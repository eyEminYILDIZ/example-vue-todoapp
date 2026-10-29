# API Upgrade Planı

Kapsam: `api/` (Node.js + Express). **Uygulama mantığı ve HTTP kontratı değişmeyecek**; yalnızca araç/paket güncellemesi ve davranış-korumalı kod refactor'ü yapılacak.

Bu doküman bir araştırma + plan çıktısıdır; hiçbir kod veya paket değiştirilmemiştir. (Tarih: 2026-10-29)

---

## 1. Mevcut Durum

| Alan | Bulgu |
| --- | --- |
| Runtime | Yerel Node `v18.19.1` / npm `9.2.0`. Node 18 (Nisan 2025) ve Node 20 (Nisan 2026) EOL. nodejs.org'a göre güncel LTS hatları: 22 (Jod), 24 (Krypton), 26 (Lithium). |
| Kod boyutu | ~500 satır CommonJS: `index.js` + `src/{controllers,services,repositories,models}`. Veritabanı yok, veri bellekte. |
| Test | **Hiç test yok.** `mocha`, `chai`, `supertest` kurulu ama kullanılmıyor; `package.json`'da `test` script'i yok. |
| Lint/format/CI | Yok (ESLint, Prettier, `.nvmrc`, `engines`, CI, Dockerfile yok). Kod Prettier 2 stilinde (çift tırnak, es5 trailing comma). |
| Git | `api/` (ve üst dizin) **git reposu değil**. Geri dönüş stratejisi için önce `git init` gerekir. |
| `npm audit` | **10 açık (4 critical, 6 high)** — hepsi 4 doğrudan bağımlılıktan geliyor (aşağıda). |

### Paket durumu

| Paket | Kurulu | Hedef | Breaking? | Not |
| --- | --- | --- | --- | --- |
| `express` | 4.22.3 | **5.3.0** | Evet | Etki küçük, bkz. §4 Faz 3. Node >= 18. |
| `body-parser` | 1.20.9 | **kaldır** | — | Express 5 `express.json()` / `express.urlencoded()` içeriyor. |
| `cors` | 2.8.6 | 2.8.6 | Hayır | Zaten güncel. |
| `jsonwebtoken` | 8.5.1 | **9.0.3** | Evet | 3 high advisory (GHSA-8cf7-32gw-wr33, GHSA-hjrf-2m68-5959, GHSA-qwph-4952-7xr6). |
| `mocha` | 3.5.3 | **kaldır** → `node:test` | Evet | `minimist`/`mkdirp`/`growl`/`debug`/`diff` üzerinden 4 critical + 2 high. Mocha 12 ESM ve Node `^20.19 \|\| >=22.12` ister. |
| `chai` | 4.5.0 | **kaldır** → `node:assert` | Evet | v5+ ESM-only; proje CommonJS. Hiç kullanılmıyor. |
| `supertest` | 3.4.2 | **7.3.1** | Düşük | `request(app)` API'si aynı. |
| `nodemon` | 2.0.22 | **kaldır** → `node --watch` | — | `semver` ReDoS üzerinden high. 3.1.14'e çıkmak da geçerli alternatif. |

Audit kaynağı özeti: `jsonwebtoken` (direct, high) · `mocha` (direct, critical; transitive: minimist, mkdirp, growl, debug, diff) · `nodemon` (direct, high; transitive: simple-update-notifier, semver).

---

## 2. Davranış Değişmezleri (Korunacak Kontrat)

Her fazın sonunda aşağıdakilerin birebir aynı olduğu doğrulanacak:

- **Port** 5000; tüm rotalar `/api/...` altında; **rota sırası** (`/api/task/my-tasks`, `/pendings` ve `reset-data`, `/:taskId`'den önce tanımlı).
- **Endpoint'ler ve HTTP metotları** (mutasyon yapan `complete`/`reject`/`reset-data` dahil GET kalır):
  `POST /auth/login` · `GET /auth/all-users` · `GET /auth/me` · `GET /task/reset-data` · `GET /task` · `GET /task/my-tasks` · `GET /task/pendings` · `GET /task/:id` · `POST /task` · `PUT /task/:id` · `DELETE /task/:id` · `GET /task/complete/:id` · `GET /task/reject/:id`.
- **Hangi endpoint auth ister**: yalnızca `login`, `all-users`, `reset-data` açık; gerisi Bearer JWT.
- **Response zarfı**: `{ code, payload }` (başarı) ve `{ code: "validationError", message }` (hata); `code` değerleri ve **mesaj metinleri birebir** (yazım hataları dahil: `employe`, `Pending (1)`).
- **Status kodları**: 200 / 400 / 401 / 403 / 404 (bkz. test matrisi).
- **JWT**: HS256, claim'ler `userId`, `givenName`, `department`, `iat`, `exp`; ömür 1000 gün; aynı secret ile imzalanmış mevcut token'lar geçerli kalır.
- **Body işleme**: JSON ve `application/x-www-form-urlencoded` (`extended: true`) kabul edilir; body yoksa/parse edilmediyse handler'lar `{}` görür (bkz. Express 5 riski).
- **CORS**: `cors()` varsayılanı (`Access-Control-Allow-Origin: *`).
- `task.id == taskId` karşılaştırması string param ↔ number id üzerinden **gevşek eşitlik**le çalışıyor; bu semantik korunmalı.

### Fark edildi ama BU PLANDA DEĞİŞTİRİLMEYECEK olanlar (karar sizde)

Bunlar "mantık" olduğu için refactor sırasında sessizce düzeltilmeyecek; karakterizasyon testlerinde **mevcut davranış olarak sabitlenecek**. İsterseniz upgrade bittikten sonra ayrı bir değişiklik olarak ele alınır.

1. **Yetkilendirme açığı:** `taskController.updateTaskById` ve `deleteTaskById`, `userIdMustBeCurrentUserId(res, task)` fonksiyonunu 3. argüman (`currentUserId`) olmadan çağırıyor; fonksiyon da var olmayan `task.userId` alanına bakıyor (gerçek alan `task.user.id`). Sonuç `undefined != undefined` → kontrol hiç tetiklenmez; **her giriş yapmış kullanıcı her task'ı güncelleyip silebilir**. `ReadMe.md` ise "kendi oluşturduğu Task'ları güncelleyip silebilir" diyor.
2. `statusMustBePending` mesajı "Pending (1)" diyor ama `taskStatus.Pending = 0`.
3. `GET /api/task/reset-data` kimlik doğrulamasız (herkes veriyi sıfırlayabilir); `GET /api/auth/all-users` kimlik doğrulamasız; login yalnızca e-posta ile (challenge tasarımı).
4. Task id'leri `Math.random` ile 1000–10000 arası üretiliyor; çakışma mümkün. `assignedDepartment` doğrulanmıyor.
5. JWT secret kaynak kodda sabit, ömür 1000 gün.

---

## 3. Strateji ve Sıralama

Prensip: **önce güvenlik ağı, sonra yükseltme, en son refactor.** Test yokken Express/JWT major atlamak körlemesine olur.

```
Faz 0  Hazırlık (git, yedek)
Faz 1  Karakterizasyon testleri (mevcut yığın üzerinde, yeşil)
Faz 2  Runtime + dev tooling
Faz 3  Runtime bağımlılık yükseltmeleri (jsonwebtoken, express 5)
Faz 4  Davranış-korumalı refactor
Faz 5  Lint/format/CI/dokümantasyon
```

Her faz ayrı commit/branch; her faz sonunda tüm testler yeşil olmalı. `package-lock.json` commit'lenir, kurulum `npm ci` ile yapılır.

---

## 4. Fazlar

### Faz 0 — Hazırlık  (S)

- `api/` için `git init` + ilk commit (veya üst dizinde repo). Mevcut hal "baseline" etiketi alır; tüm geri dönüşler buna dayanır.
- `node_modules` dışında klasörün yedeğini al.
- Baseline kaydı: `npm ls --depth=0`, `npm audit` çıktısı, `node -v`.

### Faz 1 — Karakterizasyon testleri  (M) — *en kritik adım*

Amaç: yükseltme öncesi **mevcut** davranışı sabitlemek. Testler bugünkü yığında (Node 18, Express 4, supertest 3) çalışmalı, sonra hiç değişmeden yeni yığında da geçmeli.

- Araç: **`node:test` + `node:assert/strict` + `supertest`** (Node 18.19'da `node --test` çalışır; mocha/chai migrasyonu gerekmez). Script: `"test": "node --test"`.
- `index.js` zaten `module.exports = app` ve `module.parent` koruması ile test edilebilir; port açmadan `request(app)` kullanılır.
- Determinizm: her testten önce `taskRepository.resetData()`; task id'leri (random) ve JWT string'leri **karşılaştırılmaz**, token `jsonwebtoken.decode` ile claim bazında doğrulanır.
- Kullanıcılar: Mary (id 1001, dept 1), John (id 2002, dept 2). Task 8054 (John'un, dept 1'e atanmış), Task 4381 (Mary'nin, dept 2'ye atanmış).

Test matrisi:

| Alan | Senaryolar |
| --- | --- |
| Login | geçerli e-posta → 200 `loginSuccess` + `jwtToken`; boş e-posta → 400; bilinmeyen e-posta → 404; **body yok** → 400 `Email can not be empty`; urlencoded body ile → 200; token claim'leri + `exp - iat = 1000 gün` |
| Auth middleware | header yok → 401; bozuk token → 403; yanlış secret ile imzalı → 403; geçerli → geçer |
| `me` / `all-users` | 200 ve payload şekli; `all-users` auth'suz 200 |
| Okuma | `GET /task`, `/my-tasks`, `/pendings` (department filtresi), `/:id` 200/404; **rota sırası**: `/task/my-tasks` ve `/task/pendings` `/:id` tarafından yakalanmaz |
| Create | 200 + `Pending` + log; title/description eksik → 400; **body yok** → 400; response `logs` içermez (`mapTaskToResponseModel`) |
| Update | 200; eksik alan → 400; yok → 404; **başka kullanıcının task'ını güncelleme → 200 (mevcut açık davranışı olarak sabitle)** |
| Delete | 200; yok → 404; **başka kullanıcınınkini silme → 200 (aynı)** |
| Complete / Reject | doğru departman 200; yanlış departman 403; Pending değil 400; yok 404 |
| Reset | `reset-data` auth'suz çalışır, veriyi 2 kayda döndürür |
| Çapraz | CORS başlığı; bilinmeyen rota 404; bozuk JSON → 400; hata cevaplarında body'nin tamamı (zarf) birebir |

Çıkış kriteri: tüm testler mevcut yığında yeşil; test dosyaları commit'li.

### Faz 2 — Runtime ve dev tooling  (S)

- Node hedefi: **24 LTS** (öneri). `.nvmrc` = `24`, `package.json` → `"engines": { "node": ">=22.12.0" }`. (Node 26 da yeni LTS; daha muhafazakâr/yeni tercih için alternatif.)
- `mocha` ve `chai` kaldırılır (kullanılmıyor; testler `node:test` ile) → 4 critical + 2 high açık kapanır.
- `nodemon` kaldırılır; `"dev": "node --watch index.js"`.
- `supertest` → `^7.3.1`.
- Doğrulama: `npm ci && npm test && npm audit`.

### Faz 3 — Runtime bağımlılık yükseltmeleri  (M)

**3a. `jsonwebtoken` 8.5.1 → 9.0.3** (güvenlik, öncelikli)
- v9 değişiklikleri: Node >= 12; `verify` için string secret'ta izinli algoritmalar HS256/384/512'ye kısıtlanır; boş secret reddedilir; RSA anahtar boyutu/tip kontrolleri sıkılaştı. Bu projede HS256 + string secret kullanıldığı için kod değişikliği beklenmiyor.
- Kontrol: `expiresIn: "1000 days"` hâlâ doğru parse ediliyor mu (Faz 1'deki `exp - iat` testi); eski sürümle imzalanmış token'ın v9 ile `verify` olması (testte sabit bir eski token ile).

**3b. `express` 4 → 5.3.0, `body-parser` kaldır**

Bu koda etkisi olan Express 5 değişiklikleri:

| Değişiklik | Bu projedeki etkisi | Aksiyon |
| --- | --- | --- |
| `body-parser` 2: `req.body` parse edilmezse **`undefined`** (eskiden `{}`) | `login`, `createTask`, `updateTaskById` `requestData.email/title` okuyor → body yokken **500 TypeError** (şu an 400 doğrulama hatası) | `express.json()`/`urlencoded()` sonrasına `req.body ??= {}` yapan tek middleware ekle. Faz 1'deki "body yok" testleri bunu yakalar. |
| `express.urlencoded` varsayılanı `extended: false` | Şu an `extended: true` | `express.urlencoded({ extended: true })` açıkça yazılır. |
| path-to-regexp 8 (wildcard/regex/opsiyonel sözdizimi) | Rotalar yalnızca statik + `:taskId` → **etkilenmez** | Rota sırası korunur. |
| Reddedilen promise'ler `next(err)`'e gider; senkron throw yine yakalanır | Mevcut "res.json + `throw "string"`" deseni çalışmaya devam eder | Faz 4'te temizlenecek. |
| `app.listen` callback'i hata argümanı alır | Sadece `console.log` | İsteğe bağlı: hata yakala. |
| Kaldırılan API'ler (`res.json(status, obj)`, `app.del`, `req.param()` …) | Kod bunları kullanmıyor (`res.status().json()`, `req.params.x`) | Aksiyon yok. |

- Doğrulama: Faz 1 test paketi değişmeden yeşil; `npm audit` 0 (veya kalanlar belgelenir).

### Faz 4 — Davranış-korumalı refactor  (M)

Her madde ayrı küçük commit; her biri sonrası testler yeşil. Yanıt gövdeleri/status kodları değişmez.

1. **`index.js` bölünmesi:** `src/app.js` app'i kurar ve export eder (listen yok); `index.js` ince bir giriş olarak `listen` eder. `module.parent` (deprecated) yerine `require.main === module` ya da ayrı dosya. `npm start`/`dev` aynı kalır. Port: `process.env.PORT ?? 5000`.
2. **Config:** `src/config.js` — `JWT_SECRET` env'den okunur, **yoksa mevcut sabit değere düşer** (davranış korunur; fallback kullanılırsa uyarı logu). `.env.example` eklenir. Secret'ı döndürmek mevcut token'ları geçersiz kılar → karar sizde.
3. **Hata akışı:** `res.status().json(); throw "string"` deseni yerine validator'lar `ValidationError` (status, code, message) fırlatır, tek bir error middleware aynı JSON'u yazar. Validator imzalarından `res` parametresi kalkar. **Mesajlar birebir korunur** (yazım hataları dahil). Gözlemlenebilir fark yalnızca: sunucu loguna string-throw yerine düzgün hata düşmesi ve "headers already sent" soket kapatma davranışının ortadan kalkması.
4. **Modern sözdizimi:** `var` → `const/let`; `function` handler'lar → arrow/named. **`==` → `===` dönüşümünde dikkat:** `task.id == taskId` (number ↔ string) için id'yi controller'da açıkça `Number(req.params.taskId)` ile çevir; `token == null` kontrolünü (`null`/`undefined` ikisini de yakalar) `eqeqeq` kuralında `null: "ignore"` ile bırak. Bu dönüşümler için Faz 1'de `"8054"`, `" 8054 "`, `"8054abc"`, `"abc"` gibi param testleri eklenir.
5. **Tekrarın azaltılması:** `completeTaskById`/`rejectTaskById` ~%90 aynı → tek `transitionTask(status, logAction, code)` yardımcısı. `jwt.verify` callback'i → senkron `try/catch` (aynı `console.log(err)` + 403). Koruma gerektiren rotalar için `express.Router()` + `router.use(authenticate)`; **açık rotalar (`reset-data`, `login`, `all-users`) ve rota sırası aynen korunur.**
6. **Küçük temizlikler:** `taskStatus` → `Object.freeze`; `authModule`/`authService` isimlendirme tutarsızlığı; ölü kod `updateTask` (no-op) davranışı yorumsuz bırakılır ya da kaldırılır (zaten referans nesneyi mutate ediyor).
7. **Mimari katmanı (CJS) korunur**; ESM/TypeScript'e geçiş kapsam dışı (bkz. §6).

### Faz 5 — Tooling, CI ve doküman  (S)

- **ESLint** (flat config, güncel major) + **Prettier**; Prettier'da `trailingComma: "es5"` ile mevcut stil korunur (Prettier 3 varsayılanı `all`, gereksiz diff üretir). Kurallar: `eqeqeq` (null istisnası), `no-var`, `prefer-const`.
- `package.json` düzeni: `"private": true`, `engines`, scriptler: `start`, `dev`, `test`, `lint`, `format`, `audit`.
- CI (isteğe bağlı): GitHub Actions — Node 22 ve 24 matrisi; `npm ci`, `lint`, `test`, `npm audit --omit=dev`.
- `ReadMe.md`: Node sürümü, yeni scriptler, test çalıştırma, `JWT_SECRET`/`PORT` env değişkenleri. `http/*.http` dosyaları değişmeden kalır. `postman_collection.json` içindeki gömülü (süresi dolmuş) token'ı yenilemek isteğe bağlı.

---

## 5. Doğrulama ve Geri Dönüş

| Kontrol | Ne zaman |
| --- | --- |
| `npm test` (karakterizasyon paketi, test dosyaları fazlar boyunca **değişmeden**) | Her faz sonu |
| `npm audit` — hedef: 0 açık | Faz 2, 3 ve 5 sonu |
| `http/auth.http` + `http/task.http` ile elle duman testi (VS Code REST Client) | Faz 3 ve 4 sonu |
| Eski/yeni sürümde aynı istek dizisinin JSON çıktısını (id ve token hariç) `diff`'lemek | Faz 3 sonu (isteğe bağlı) |
| Geri dönüş | Her faz ayrı commit; sorun varsa o commit revert + `npm ci` |

Kabul kriterleri: §2'deki tüm değişmezler testle kanıtlanmış, `npm audit` temiz, Node 24'te `npm ci && npm test && npm start` başarılı, `package.json`'da `mocha/chai/nodemon/body-parser` yok.

## 6. Kapsam Dışı (istenirse ayrı iş)

- Yetkilendirme açığının (§2, madde 1) ve diğer mantık düzeltmelerinin yapılması
- ESM'e veya TypeScript'e geçiş, veritabanı, giriş doğrulama kütüphanesi (zod vb.), `helmet`/rate limit, OpenAPI, Docker
- Frontend (`vue-app`) — şu an API'yi hiç çağırmıyor; kontrat uyumu için bu planda ek aksiyon yok

## 7. Karar Bekleyen Noktalar (varsayılan önerilerle)

1. Test aracı: `node:test` (**önerilen**, bağımlılık azaltır) vs mocha 12 + chai 6 (ESM-only, Node >= 20.19/22.12).
2. Hedef Node: **24 LTS** (önerilen) vs 26 LTS (yeni).
3. `JWT_SECRET`: env + mevcut sabit değer fallback (**önerilen**, davranış korunur) vs zorunlu env (mevcut token'ları geçersiz kılar).
4. §2'deki yetkilendirme açığı: upgrade sonrası ayrı iş olarak mı ele alınsın?
5. Dev server: `node --watch` (**önerilen**) vs nodemon 3.
