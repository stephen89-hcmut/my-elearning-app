# Setup Guide (Frontend & Backend)

This guide covers cloning the project, configuring environment variables, and running the app in two scenarios:

1) You already have a MySQL database running (e.g., via Docker).
2) You do not have a database yet (we'll set one up with Docker Compose).

## Prerequisites

- Node.js 18+ and npm
- Git
- Docker Desktop (needed for scenario 2 or if you want to run MySQL via Docker)

## Repo structure

- `client/`: React + Vite frontend
- `server/`: NestJS backend (TypeORM + MySQL)
- `Doc/`: documentation

## Environment variables

Create `.env` files as below. The backend uses NestJS Config; the frontend reads from Vite `import.meta.env` (prefix `VITE_`).

### Backend (`server/.env`)

```
# HTTP server
PORT=3001

# Database connection (MySQL)
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=my_elearing_db

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Optional: enable query logging
TYPEORM_LOGGING=false
```

### Frontend (`client/.env`)

```
VITE_API_URL=http://localhost:3001/api
```

Adjust host/port/user/password/dbname to your environment (see scenarios below).

## Scenario 1: Already have MySQL running (e.g., Docker container or remote)

1) Ensure the database is reachable and you have credentials (host, port, user, password, database name).
2) Backend: set `server/.env` to point to that DB (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`).
3) Frontend: set `client/.env` to the backend API URL (default `http://localhost:3001/api`). If backend runs on another host/port, update accordingly.
4) Install deps and run:
   - Backend:
     ```pwsh
     cd server
     npm install
     npm run start:dev
     ```
   - Frontend:
     ```pwsh
     cd client
     npm install
     npm run dev
     ```
5) Open the frontend dev URL (shown by Vite, typically `http://localhost:5173`) and verify calls to the API succeed.

## Scenario 2: No MySQL yet — set up via Docker Compose

### 1) Create `docker-compose.yml` at repo root

```
version: "3.9"
services:
  db:
    image: mysql:8.0
    container_name: elearning-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: my_elearing_db
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
volumes:
  db_data:
```

You can change exposed port or credentials if needed; keep them in sync with `.env`.

### 2) Start MySQL

```pwsh
# from repo root
docker compose up -d
```

Wait for the container to be healthy (`docker ps` to check health status).

### 3) Configure backend env

Create `server/.env` using the same values as the compose file:

```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=appuser
DB_PASSWORD=apppass
DB_NAME=my_elearing_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
TYPEORM_LOGGING=false
```

### 4) Configure frontend env

`client/.env`:

```
VITE_API_URL=http://localhost:3001/api
```

### 5) Install deps and run

- Backend:
  ```pwsh
  cd server
  npm install
  npm run start:dev
  ```
- Frontend:
  ```pwsh
  cd client
  npm install
  npm run dev
  ```

### 6) Verify

- Backend: should start without DB connection errors (listening on `PORT`).
- Frontend: open Vite dev URL (default `http://localhost:5173`) and confirm data loads.

## Common tasks

- Recreate DB volume (danger: deletes data): `docker compose down -v && docker compose up -d`
- Check MySQL logs: `docker logs elearning-mysql`
- Connect to MySQL shell: `docker exec -it elearning-mysql mysql -uappuser -papppass my_elearing_db`

## Notes

- Prisma has been removed; backend uses TypeORM with MySQL.
- Keep ports consistent across Docker compose, backend env, and firewall rules.
- For production, use stronger credentials and avoid exposing MySQL publicly; consider running backend and DB in a private network.
