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
- Service: `elearning-mysql` (MySQL 8.0), exposes `3306` with credentials in compose (rootpass/appuser/apppass, DB `my_elearing_db`).
- Check status: `docker ps` and `docker logs elearning-mysql` if needed.

## 3) Configure environment variables
Create `.env` files as below.

### Backend (`server/.env`)
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
If you changed credentials/ports in `docker-compose.yml`, mirror them here.

### Frontend (`client/.env`)
```
VITE_API_URL=http://localhost:3001/api
```
Point this to the backend host/port you run.

## 4) Initialize database schema/data
We keep the full SQL in `Doc/DB_INIT_SCRIPT.md`, and it's already copied to repo root as `db_init.sql`.
- Quick run (PowerShell): `pwsh scripts/run-db-init.ps1` (optional params: `-Host 127.0.0.1 -Port 3306 -User appuser -Password apppass -File ../db_init.sql`).
- Quick run (bash): `HOST=127.0.0.1 PORT=3306 USER=appuser PASSWORD=apppass FILE=../db_init.sql ./scripts/run-db-init.sh`.
- Manual MySQL CLI (if you prefer):
```pwsh
# Windows/macOS terminal
mysql -h 127.0.0.1 -P 3306 -uappuser -papppass < db_init.sql
```
- The script creates DB `BTL2`, all tables, triggers, functions/procedures, and seeds sample data. Requires `mysql` client on PATH.

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
