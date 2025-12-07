# Setup & Run Guide

This README walks you through installing Docker, bringing up MySQL via the project compose file, wiring env vars, initializing the database schema/data, and running both backend and frontend.

## 1) Install Docker Desktop
- Download: https://www.docker.com/products/docker-desktop/
- Stable choice: the latest GA build (e.g., 4.31+); avoid preview/beta builds.
- Windows: enable virtualization (BIOS/UEFI), install WSL2 if prompted, then start Docker Desktop and wait for the whale icon to turn green.
- macOS (Intel/Apple Silicon): download the correct dmg (Intel vs. Apple chip), install, grant permissions, then start Docker Desktop.
- Verify: `docker --version` and `docker compose version` should both respond without errors.

## 2) Start MySQL with docker-compose
From the repo root (contains `docker-compose.yml`):
```pwsh
# Windows PowerShell / macOS zsh
cd /path/to/my-elearning-app
docker compose up -d
```
- Service: `elearning-mysql` (MySQL 8.0), exposes `3306` with credentials in compose (root/rootpass, app user `sManager`/`admin@123`, DB `BTL2`).
- Check status: `docker ps` and `docker logs elearning-mysql` if needed.

## 3) Configure environment variables
Create `.env` files as below.

### Backend (`server/.env`)
Copy `server/.env.example` to `server/.env` and adjust if needed:
```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=sManager
DB_PASSWORD=admin@123
DB_NAME=BTL2
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
TYPEORM_LOGGING=false
```
If you changed credentials/ports in `docker-compose.yml`, mirror them here.

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:3001/api
```
Point this to the backend host/port you run.

## 4) Initialize database schema/data
We keep the full SQL in `Doc/DB_INIT_SCRIPT.md`, and it's already copied to repo root as `db_init.sql`.
- Quick run (PowerShell): `pwsh scripts/run-db-init.ps1` (defaults: root/rootpass, file `../db_init.sql`).
- Quick run (bash): `./scripts/run-db-init.sh` (same defaults; can override `HOST/PORT/USER/PASSWORD/FILE`).
- Both scripts auto-fallback to `docker exec elearning-mysql mysql ...` if local `mysql` client is missing.
- Manual MySQL CLI (if you prefer):
```pwsh
# Windows/macOS terminal (requires mysql client on PATH)
mysql -h 127.0.0.1 -P 3306 -uroot -prootpass < db_init.sql
```
- The script creates DB `BTL2`, all tables, triggers, functions/procedures, and seeds sample data.

## 5) Run backend and frontend
Install dependencies once per workspace:
```pwsh
# Backend
cd server
npm install
npm run start:dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```
- Backend serves at `http://localhost:3001` (API base `/api`).
- Frontend (Vite) serves at the URL printed in the console (typically `http://localhost:5173`).
- Ensure `VITE_API_URL` matches the backend URL.

## Tips / Troubleshooting
- If MySQL fails to start: `docker compose down -v` then `docker compose up -d`, check logs for port conflicts or permission issues.
- If DB auth fails: confirm `.env` values match the compose credentials and rerun the init script.
- If frontend cannot call API: verify backend is running and `VITE_API_URL` is correct.
