# Environment Setup (Backend & Frontend)

This guide shows how to configure environment variables for the NestJS backend and the Vite React frontend.

## Backend (server/.env)

### Nhanh (theo thông số đã cung cấp)

1. Sao chép file mẫu: `cp server/.env.example server/.env`.
2. Mở `server/.env` và đặt đúng thông số DB (MySQL trên Synology Docker):
   - `DB_HOST=192.168.1.200`
   - `DB_PORT=3307`
   - `DB_USERNAME=root`
   - `DB_PASSWORD=admin@123`
   - `DB_NAME=BTL2`
   - `DATABASE_URL="mysql://root:admin@123@192.168.1.200:3307/BTL2"` (giữ đồng bộ để dùng Prisma tools nếu cần)
3. Cấu hình ứng dụng & JWT:
   - `PORT=3001`
   - `JWT_SECRET=` chuỗi ngẫu nhiên mạnh
   - `JWT_EXPIRATION=24h`
   - `CORS_ORIGIN=http://localhost:5173` (thêm origin khác nếu FE chạy domain/port khác, cách nhau bằng dấu phẩy)
4. Đảm bảo MySQL container đang chạy và port 3307 đã được publish/forward.
5. Chạy backend: `cd server && npm install && npm run start:dev`.

### Giải thích nhanh

- NestJS đọc các biến `DB_HOST/DB_PORT/DB_USERNAME/DB_PASSWORD/DB_NAME` trong `src/app.module.ts` để kết nối MySQL (TypeORM). Nếu sai/thiếu sẽ báo `ECONNREFUSED`.
- `CORS_ORIGIN` cần chứa origin của frontend để browser cho phép gọi API.

### Ví dụ `.env` đầy đủ

```
NODE_ENV=development
PORT=3001
DB_HOST=192.168.1.200
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=admin@123
DB_NAME=BTL2
DATABASE_URL="mysql://root:admin@123@192.168.1.200:3307/BTL2"
JWT_SECRET=change_me_in_prod
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:5173
```

## Frontend (client/.env.local)

1. In `client`, create `.env.local`.
2. Set the API base URL that matches the backend port and prefix:

```
VITE_API_URL=http://localhost:3001/api
```

3. Install & run the frontend: `cd client && npm install && npm run dev` (open the URL shown, typically http://localhost:5173).

Lưu ý: nếu backend chạy trên host LAN khác (ví dụ máy Synology), đặt giá trị full URL của host đó, ví dụ:

```
VITE_API_URL=http://192.168.1.200:3001/api
```

## Quick health checks

- Backend: browse `http://localhost:3001/api` or check console for `🚀 Server running on http://localhost:3001`.
- Frontend → Backend: from the browser devtools, call a known API route (e.g., a public GET or your login POST) and confirm you receive a response; CORS errors indicate the origin list needs updating.
