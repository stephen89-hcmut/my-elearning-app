# Tech Stack Overview

This document summarizes the key technologies used in the project across frontend (client) and backend (server), and where they are applied.

## Frontend (client)
- React 18 + TypeScript: SPA foundation and type safety.
- Vite: fast dev server and build toolchain.
- React Router DOM 6: client-side routing for pages (dashboard, courses, students, instructors, detail views).
- Ant Design 5: primary UI component library for layout, tables, forms, modals, inputs, and feedback.
- MUI Icons (@mui/icons-material) + Emotion (@emotion/react, @emotion/styled): icon set and styled overrides where needed.
- React Query (@tanstack/react-query): data fetching, caching, and request lifecycle handling for API calls.
- Axios: HTTP client used by `client/src/api/*.ts` to call backend endpoints.
- Recharts: charts for dashboard visualizations.
- Classnames: conditional class handling in components.
- ESLint + TypeScript ESLint + Prettier: linting/formatting during development.

## Backend (server)
- NestJS 10 (Core, Common, Config, Platform-Express): application framework and dependency injection.
- TypeORM 0.3 + mysql2: ORM and MySQL driver for database access and entity management.
- Passport + passport-jwt + @nestjs/jwt/@nestjs/passport: authentication with JWT strategy.
- Class-validator + class-transformer: request DTO validation and transformation.
- Bcryptjs: password hashing.
- RxJS: reactive utilities used by NestJS under the hood.
- Rimraf: clean build artifacts in `prebuild` script.
- Tooling: Jest + ts-jest + supertest for unit/e2e tests; ESLint + Prettier for linting/formatting; ts-node/tsconfig-paths for dev/runtime TS support.

## Notes
- Prisma has been removed; the backend currently uses TypeORM exclusively with MySQL.
- Environment-specific settings (API base URL, JWT secrets, DB connection) are managed via NestJS Config and `.env` files.
