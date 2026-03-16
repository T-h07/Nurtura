# Nurtura — Project Instructions

## Product
Nurtura is a kindergarten management platform with:
- Management/Admin side
- Teacher/Classroom side
- Parent portal later

## Tech stack
- Backend: Java 21, Spring Boot, Spring Security, PostgreSQL, Flyway
- Frontend: React, TypeScript, Tailwind CSS
- Database runs in Docker
- Use clean modular structure from the beginning

## Engineering rules
- Favor maintainable, production-style code over shortcuts
- Keep code readable and organized
- Use strong separation of concerns
- Use DTOs, validation, service layer, repository layer
- Prefer explicit naming over clever naming
- Generate minimal but solid code, not bloated scaffolding

## Security rules
- Treat child, guardian, and medical/contact data as sensitive
- Apply secure defaults
- Use least-privilege authorization
- Never expose internal entities directly to the frontend
- Validate all request input
- Use audit-friendly backend patterns

## Database rules
- PostgreSQL in Docker
- All schema changes must go through Flyway migrations
- Do not fake persistence
- When deletion is intended, make sure backend and database behavior are aligned
- Be careful with cascade deletes; explain them before using them

## UI rules
- UI must feel premium, warm, modern, and highly usable
- Avoid generic admin-dashboard look
- Teacher flows should be fast and visual
- Management views can be denser, but still clean and polished
- Prefer reusable components and consistent spacing, typography, and states

## Repo rules
- Keep folder layout clean and readable
- Prefer small focused commits
- When changing structure, explain why
- Do not generate unnecessary files

## Codex workflow
Before major implementation:
1. Inspect existing repo structure
2. Propose a concise plan
3. Then implement

Use installed skills when relevant:
- senior-frontend
- senior-security
- senior-architect
- senior-backend
- code-reviewer
- tdd-guide
- ui-design-system
- database-schema-designer
- migration-architect
- api-design-reviewer
- playwright-pro
- ci-cd-pipeline-builder
- dependency-auditor
