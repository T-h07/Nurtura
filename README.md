# Nurtura PT01 Foundation

PT01 establishes a clean full-stack foundation for Nurtura as a modular monolith with explicit boundaries for management, classroom, and a later parent portal.

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
|       |-- features/
|       |   |-- classroom/
|       |   `-- management/
|       `-- shared/
|-- docker-compose.yml
`-- .env.example
```

## Foundation Choices

- **Architecture:** modular monolith, because it keeps deployment and local development simple while preserving clean module seams.
- **Security:** role structure is defined now for `PLATFORM_ADMIN`, `MANAGEMENT`, `TEACHER`, and `PARENT`; the current auth mechanism is a development-only Spring Security skeleton using in-memory users.
- **Persistence:** PostgreSQL runs in Docker and Flyway owns all schema changes from the first migration.
- **Deletion behavior:** the initial `user_account_role` join table uses `ON DELETE RESTRICT`, so cleanup stays explicit and audit-friendly instead of hiding behavior behind cascade deletes.

## Backend Notes

- `common/` holds shared API and persistence infrastructure.
- `modules/identity/` contains the initial account and role persistence model.
- `modules/management/` and `modules/classroom/` each have their own `dto`, `service`, and `web` packages.
- `modules/parent/` is intentionally reserved so future work can slot in without reshaping the existing module graph.

Available starter endpoints:

- `GET /api/public/health`
- `GET /api/management/workspace`
- `GET /api/classroom/workspace`

## Frontend Notes

- `app/` assembles the shell.
- `features/management` and `features/classroom` own their workspace panels.
- `shared/` contains reusable UI and shared content.

The current app shell is a warm, premium foundation page that already reflects the management/classroom split without overcommitting to detailed workflows too early.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL:

   ```powershell
   docker compose up -d
   ```

3. Start the backend:

   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

4. Start the frontend in a second terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. Open the frontend at `http://localhost:5173`.

## Development Credentials

- Admin: `admin@nurtura.local` / `ChangeMe123!`
- Teacher: `teacher@nurtura.local` / `ChangeMe123!`

These credentials are only intended for local development and should be replaced by a real identity flow in the next phase.
