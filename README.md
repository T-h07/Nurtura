# Nurtura Foundation (PT01 + NT-PT02)

Nurtura is a desktop-first kindergarten management platform with:
- Management/Admin surface
- Teacher/Classroom surface
- Parent portal planned for a later phase

PT01 established the modular full-stack base. NT-PT02 adds authentication foundation, role-aware behavior, protected routing, and desktop-style app shells with persistent sidebar navigation.

## Stack

- Backend: Java 21, Spring Boot, Spring Security, PostgreSQL, Flyway
- Frontend: React, TypeScript, Tailwind CSS, React Router
- Database: PostgreSQL in Docker

## Key NT-PT02 Additions

- Login foundation aligned with Spring Security dev skeleton
- `GET /api/auth/me` session endpoint for frontend role awareness
- Role model wired end-to-end (`PLATFORM_ADMIN`, `MANAGEMENT`, `TEACHER`, `PARENT`)
- Protected routes and reusable route guards
- Desktop-first UI shell with persistent left sidebar
- Separate operational shells for management and classroom surfaces
- Parent role remains in the model, but parent surface stays intentionally inactive

## Repo Layout

```text
.
|-- backend/
|   |-- src/main/java/com/nurtura/platform/
|   |   |-- common/
|   |   |-- modules/
|   |   |   |-- classroom/
|   |   |   |-- identity/
|   |   |   |-- management/
|   |   |   `-- parent/
|   |   `-- security/
|   `-- src/main/resources/db/migration/
|-- frontend/
|   `-- src/
|       |-- app/
|       |   |-- layout/
|       |   `-- router/
|       |-- features/
|       |   |-- auth/
|       |   |-- classroom/
|       |   `-- management/
|       `-- shared/
|-- docker-compose.yml
`-- .env.example
```

## API Endpoints (Current Foundation)

- `GET /api/public/health`
- `GET /api/auth/me`
- `GET /api/management/workspace`
- `GET /api/classroom/workspace`

## Local Setup

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL:

   ```powershell
   docker compose up -d
   ```

3. Start backend:

   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

   Backend reads root `.env` automatically for local settings.
   Default local port is `18080` (`NURTURA_SERVER_PORT`).
   Override only if needed:

   ```powershell
   $env:NURTURA_SERVER_PORT="8080"
   .\mvnw.cmd spring-boot:run
   ```

4. Start frontend in a second terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Frontend proxy automatically reads `NURTURA_SERVER_PORT` from the repo root `.env`.
   Keep backend and frontend aligned by changing only `.env`.
   You can still force an explicit origin:

   ```powershell
   $env:NURTURA_BACKEND_ORIGIN="http://localhost:8080"
   npm run dev
   ```

5. Open `http://localhost:5173` and sign in.

## Tauri Desktop Dev

Tauri is now scaffolded for desktop-shell development from the same frontend codebase.

1. Ensure Windows prerequisites are installed (once per machine):
   - Rust toolchain (`rustup`, `cargo`, `rustc`)
   - Microsoft C++ build tools (Visual Studio Build Tools)
   - WebView2 runtime
2. Keep PostgreSQL + backend running (from Local Setup above).
3. In a new terminal:

   ```powershell
   cd frontend
   npm install
   npm run tauri-dev
   ```

Desktop dev uses the same proxy behavior (auto from `NURTURA_SERVER_PORT`, or explicit override):

```powershell
$env:NURTURA_BACKEND_ORIGIN="http://localhost:8080"
npm run tauri-dev
```

## Authentication and Routing Flow

- Login uses backend Basic auth (development-only foundation).
- Frontend validates credentials via `GET /api/auth/me`.
- Session auth header is stored in `sessionStorage` for local development.
- Route access is guarded by role:
  - Management shell: `/app/management/:section` (`PLATFORM_ADMIN`, `MANAGEMENT`)
  - Classroom shell: `/app/classroom/:section` (`PLATFORM_ADMIN`, `TEACHER`)
  - Unsupported active role path: `/app/unsupported`
- `/app` automatically redirects to the correct default shell by role.

## Development Credentials

- Admin: `admin@nurtura.local` / `ChangeMe123!`
- Teacher: `teacher@nurtura.local` / `ChangeMe123!`

These credentials are local-only and should be replaced by real authentication in a later phase.
