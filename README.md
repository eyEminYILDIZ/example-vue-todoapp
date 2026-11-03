# Task Management App

A department task-tracking app. Users create tasks for other departments, and the assigned department completes or rejects them.

| Folder | What | Stack | Port |
| --- | --- | --- | --- |
| [`api/`](api) | Backend REST API | Node.js, Express, JWT | 5000 |
| [`vue-app/`](vue-app) | Frontend web app | Vue 3, Vite, TypeScript, Pinia, Vue Router, Tailwind CSS 4, axios | 3000 |

## Getting started

Start the API and the web app in two terminals:

```sh
cd api
npm install
npm run dev      # http://localhost:5000
```

```sh
cd vue-app
npm install
npm run dev      # http://localhost:3000
```

Open <http://localhost:3000> and log in with `mary@company.com` (email only, no password).

## Features

- Email login with JWT auth
- **All Tasks**: every task in the system
- **My Tasks**: tasks you requested
- **Pending Tasks**: pending tasks assigned to your department
- Create, edit and delete your own tasks; complete or reject tasks assigned to your department

## Frontend scripts

Run from `vue-app/`:

```sh
npm run type-check
npm run lint
npm run test:unit
npm run build
```

## Notes

- The API has no database. Data lives in memory and resets on every API start, or call `GET /api/task/reset-data`.
- The API base URL is hardcoded in `vue-app/src/apidef/axios_setup.ts` as `http://localhost:5000/api`.
- Ready-made API requests are in `api/http/*.http` and `api/postman_collection.json`. The API is described in [`api/ReadMe.md`](api/ReadMe.md), and the original task in [`api/ReadMe.Challenge.md`](api/ReadMe.Challenge.md).
