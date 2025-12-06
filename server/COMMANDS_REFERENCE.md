# 📋 COMMAND LINE REFERENCE

## 🚀 Khởi Tạo Database (Lần Đầu)

### Cách Nhanh Nhất (1 Lệnh)
```bash
cd server && npm install && npm run prisma:generate && npx prisma migrate deploy && npm run prisma:seed
```

### Cách Từng Bước
```bash
cd server
npm install                  # Cài dependencies
npm run prisma:generate     # Generate Prisma Client
npm run prisma:migrate      # Tạo migrations & database
npm run prisma:seed         # Thêm dữ liệu test
```

---

## 🔄 NPM Scripts Có Sẵn

### Prisma Commands
```bash
npm run prisma:generate     # Generate Prisma Client
npm run prisma:migrate      # Create migration & apply (interactive)
npm run prisma:studio       # Mở giao diện visual (http://localhost:5555)
npm run prisma:reset        # Reset database (xóa + tạo lại)
npm run prisma:seed         # Chạy seed script
```

### NestJS Commands
```bash
npm run build               # Build project
npm run start               # Chạy server (production)
npm run start:dev          # Chạy server (development, auto-reload)
npm run start:debug        # Debug mode
npm run start:prod         # Production build
```

### Lint & Format
```bash
npm run lint               # ESLint check
npm run format             # Prettier format code
```

### Testing
```bash
npm test                   # Run tests
npm run test:watch         # Watch mode
npm run test:cov           # Coverage report
npm run test:debug         # Debug tests
npm run test:e2e           # E2E tests
```

---

## 🔧 Database Management

### Xem Dữ Liệu Visual
```bash
npm run prisma:studio
# Mở: http://localhost:5555
```

### Xem Dữ Liệu với MySQL
```bash
mysql -h 192.168.1.200 -P 3307 -u root -padmin@123 BTL2

# Hoặc từng bước:
mysql -h 192.168.1.200 -P 3307 -u root -p
# Password: admin@123
USE BTL2;
SHOW TABLES;
SELECT COUNT(*) FROM User;
SELECT * FROM User LIMIT 5;
```

### Xem Migrations
```bash
ls prisma/migrations/
```

### Reset Database (⚠️ Xóa dữ liệu)
```bash
npm run prisma:reset       # Hoặc:
npx prisma migrate reset --force
```

---

## 📝 Thay Đổi Schema

### 1. Sửa schema
```bash
# Sửa file: prisma/schema.prisma
# Ví dụ: thêm field mới, thay đổi type, v.v.
```

### 2. Tạo migration
```bash
npm run prisma:migrate
# Nhập tên migration: "add_new_field"
```

### 3. Xem changes
```bash
npm run prisma:studio
```

---

## 🔐 Environment Variables

### Xem cấu hình hiện tại
```bash
cat .env
```

### Cấu hình bản sao
```bash
cp .env.example .env.production
# Sửa: DATABASE_URL, JWT_SECRET, PORT, NODE_ENV
```

---

## 🐛 Debug & Troubleshooting

### Log database queries
```bash
# Thêm vào .env:
DATABASE_URL="mysql://root:admin@123@192.168.1.200:3307/BTL2?schema=BTL2"

# Hoặc debug trong code:
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

### Kiểm tra connection
```bash
# Ping server
ping 192.168.1.200

# Kiểm tra port
nc -zv 192.168.1.200 3307

# Kiểm tra với mysql client
mysql -h 192.168.1.200 -P 3307 -u root -padmin@123 -e "SELECT 1"
```

### Xem migration status
```bash
npx prisma migrate status
```

### Validate schema
```bash
npx prisma validate
```

---

## 🔄 Workflow Phát Triển

### Development Loop
```bash
# Terminal 1: Chạy dev server
npm run start:dev

# Terminal 2: Xem dữ liệu
npm run prisma:studio

# Terminal 3: Làm việc với code
# Sửa files trong src/
```

### Khi Sửa Database Schema
```bash
# 1. Sửa prisma/schema.prisma
vim prisma/schema.prisma

# 2. Tạo migration
npm run prisma:migrate
# Nhập tên: "descriptive_migration_name"

# 3. Xem changes
npm run prisma:studio

# 4. Update services nếu cần
# Sửa files trong src/modules/
```

---

## 📊 Kiểm Tra Dữ Liệu

### Đếm records
```bash
# Dùng Prisma Studio hoặc:
mysql -h 192.168.1.200 -P 3307 -u root -padmin@123 -e "
USE BTL2;
SELECT 'User' as table_name, COUNT(*) as count FROM User
UNION ALL
SELECT 'Course', COUNT(*) FROM Course
UNION ALL
SELECT 'Enrollment', COUNT(*) FROM Enrollment
UNION ALL
SELECT 'Transaction', COUNT(*) FROM Transaction;
"
```

### Xem schema
```bash
# Visual:
npm run prisma:studio

# Terminal:
npx prisma db pull  # Sync schema từ database
npx prisma generate # Generate Client
```

---

## 🚀 Deployment

### Build production
```bash
npm run build
npm run start:prod
```

### Check before deploy
```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

---

## 🆘 Emergency Commands

### Xóa migrations (⚠️ Cẩn thận)
```bash
rm -rf prisma/migrations
npm run prisma:migrate dev --name init
```

### Xóa node_modules và cài lại
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset mọi thứ
```bash
npm run prisma:reset
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

---

## 📚 Tài Liệu Thêm

```bash
# Mở các file sau:
cat ../Doc/DATABASE_INITIALIZATION_GUIDE.md
cat ../Doc/QUICK_START_DB.md
cat ../Doc/NESTJS_PRISMA_INTEGRATION.md
cat ../Doc/MIGRATIONS_GUIDE.md
```

---

**💡 Tip: Copy-paste commands từ trên để chạy nhanh!**
