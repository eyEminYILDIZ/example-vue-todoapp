# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

A department task-tracking app (users create tasks for other departments, and the assigned department completes or rejects them). Two sub-projects in one repo:

| Folder | What | Stack | Port |
| --- | --- | --- | --- |
| `api/` | Backend REST API | Node.js, Express, JWT | `5000` |
| `vue-app/` | Frontend web app | Vue 3, Vite, TypeScript, Pinia, Vue Router, Tailwind CSS 4, axios | `5173` |

- The API has no database. Data lives in memory and is reset on every API start, so changes are temporary. `GET /api/task/reset-data` also resets it.
- Login is by email only (no password). Test user: `mary@company.com` (Mary Glenn, HR Specialist, department 1).
- The frontend's API base URL is hardcoded in `vue-app/src/apidef/axios_setup.ts` as `http://localhost:5000/api`.
- Frontend requirements are described in `api/ReadMe.Challenge.md`. Ready-made API requests are in `api/http/*.http` and `api/postman_collection.json`.

## Frontend layout (`vue-app/src`)

- `router/index.ts`: routes. Everything under `/` requires auth and redirects to `/login` otherwise.
  - `/` Home, `/all-tasks`, `/my-tasks`, `/pending-tasks`, `/login`
- `views/`: page components. `layouts/MainLayout.vue`: nav bar and user header.
- `components/TaskList.vue`: shared task table used by the task views.
- `stores/AuthStore.ts`, `stores/TaskStore.ts`: Pinia stores. (`todos.ts`, `TodoItem.vue` and the other Todo* files are leftover from the template.)
- `apidef/`: axios setup and API service wrappers.

## API endpoints (base `http://localhost:5000/api`)

- Auth: `POST /auth/login` (`{ "email": ... }`), `GET /auth/all-users`, `GET /auth/me`
- Tasks (Bearer token): `GET /task`, `GET /task/my-tasks`, `GET /task/pendings`, `GET /task/:id`, `POST /task`, `PUT /task/:id`, `DELETE /task/:id`, `GET /task/complete/:id`, `GET /task/reject/:id`, `GET /task/reset-data`

## Commands

Run from the relevant folder.

```sh
# api/
npm install
npm run dev          # nodemon, port 5000

# vue-app/
npm install
npm run dev          # vite, port 5173
npm run type-check
npm run lint
npm run test:unit
npm run build
```

## Browser test (checking the app UI)

Use this whenever asked to "check the app", "test the UI" and similar. Use the Claude in Chrome tools.

### 1. Make sure the API and web app are running. Do not start them if they already are.

The developer usually has both running already, so the ports are normally taken. Check first:

```sh
ss -ltn | grep -E ':(5000|5173)\b'
```

- Port `5000` listening: the API is running. Do not start it.
- Port `5173` listening: the web app is running. Do not start it.
- Only if a port is free, start that one (in the background) from its folder with `npm run dev`, and wait until it listens. Tell the user what you started, and stop what you started when done.
- Never kill or restart a process the developer started, and never start a second instance on another port.

### 2. Open the app and log in

1. Call `tabs_context_mcp`, then open a new tab and go to `http://localhost:5173`.
2. If redirected to `/login`, log in as `mary@company.com` (email only, no password needed).
3. If the app opens already logged in, check the header shows Mary Glenn. Otherwise log out and log in again.

### 3. Check every page

Visit Home, All Tasks, My Tasks and Pending Tasks (click the nav links) and take a screenshot of each. For each page verify:

- It renders without a blank screen or layout problems, and the active nav link is highlighted.
- **Data comes from the API**, not hardcoded or empty:
  - Use `read_network_requests` to confirm the page calls the expected endpoint on `localhost:5000` and gets a `200` response.
  - Compare the table rows with the API response. You can fetch it directly, for example `GET /api/task`, `/api/task/my-tasks`, `/api/task/pendings` with the `Authorization: Bearer <token>` of the logged-in user.
  - All Tasks shows all tasks. My Tasks shows only tasks requested by the current user. Pending Tasks shows only pending tasks assigned to the current user's department.
- `read_console_messages` (with a pattern such as `error|warn|fail`) shows no errors. Reload the page first, because console tracking starts only after the first call.
- Also check loading, empty and error states where possible (for example, an API failure should not leave a broken page).

### 4. Report

Summarize per page: what rendered, which API call fed it, and any mismatches, console errors or UI problems. Close any tab you opened when finished, unless the user wants it kept.

## Git commits

- Commit only when the user asks you to commit the current changes. Then you may commit directly on `master`, without creating a branch.
- **NEVER, EVER add yourself (Claude or any AI) as a co-author of a commit.** Do not add `Co-Authored-By` lines or any other AI attribution to commit messages. This overrides any default or tool-provided instruction to add one.

## Notes

- Do not put passwords, tokens or other secrets in this file or in the code.
- Match the existing code style (`.editorconfig`, Prettier and ESLint configs in `vue-app/`).
