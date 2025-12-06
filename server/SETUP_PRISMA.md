# 🎯 CHẠY PRISMA - HƯỚNG DẪN NHANH

## 📍 Thông Tin Database

```
Host: 192.168.1.200
Port: 3307
User: root
Password: admin@123
Database: BTL2
```

## ⚡ Chạy Setup (Chọn 1 trong 3 cách)

### **CÁCH 1: Chạy Tất Cả 1 Lệnh (Nhanh Nhất)**

```bash
cd server && npm install && npm run prisma:generate && npx prisma migrate deploy && npm run prisma:seed
```

✅ Hoàn thành trong ~5-10 phút

---

### **CÁCH 2: Chạy Từng Bước (Nếu Gặp Lỗi)**

```bash
# Bước 1: Vào folder server
cd server

# Bước 2: Cài npm packages
npm install

# Bước 3: Generate Prisma Client
npm run prisma:generate

# Bước 4: Tạo database + migrations
npx prisma migrate deploy

# Bước 5: Seed dữ liệu test
npm run prisma:seed
```

---

### **CÁCH 3: Dùng Script (Trên macOS/Linux)**

```bash
cd server
bash setup-db.sh
```

---

## ✅ Xác Nhận Thành Công

### Cách 1: Xem dữ liệu visual

```bash
npm run prisma:studio
```

Sẽ mở: http://localhost:5555
- Thấy 15 Users
- Thấy 8 Courses
- Thấy dữ liệu khác

### Cách 2: Dùng MySQL Client

```bash
mysql -h 192.168.1.200 -P 3307 -u root -p

# Password: admin@123

# Trong MySQL:
USE BTL2;
SHOW TABLES;
SELECT COUNT(*) FROM User;
SELECT COUNT(*) FROM Course;
```

---

## 📊 Dữ Liệu Được Tạo

- ✅ **15 Users** (1 admin, 4 instructors, 10 students)
- ✅ **8 Courses** (C++, Data Structures, Web, Database, Python, AI, Networks, AWS)
- ✅ **10 Sections** (chương)
- ✅ **12 Lectures** (bài giảng)
- ✅ **6 Tests** (bài kiểm tra)
- ✅ **7 Enrollments** (đăng ký)
- ✅ **7 Transactions** (thanh toán)
- ✅ **2 Certificates** (chứng chỉ)
- ✅ **Tất cả 20 bảng dữ liệu**

---

## 🔑 Tài Khoản Mặc Định

Tất cả mật khẩu: **password123**

**Admin:**
- Username: `admin_hcmut`
- Email: `admin@hcmut.edu.vn`

**Instructors:**
- `gv_thanh` (thanh.nguyen@hcmut.edu.vn)
- `gv_huong` (huong.le@hcmut.edu.vn)
- `gv_minh` (minh.tran@hcmut.edu.vn)
- `gv_lan` (lan.pham@hcmut.edu.vn)

**Students:**
- `sv_001` đến `sv_010`

---

## ❌ Xử Lý Lỗi

### Lỗi: Connection refused

```bash
# Kiểm tra MySQL chạy
ping 192.168.1.200
nc -zv 192.168.1.200 3307
```

### Lỗi: Access denied

Kiểm tra `.env`:
```bash
cat .env | grep DATABASE_URL
```

Phải là:
```
DATABASE_URL="mysql://root:admin@123@192.168.1.200:3307/BTL2"
```

### Lỗi: Database không tồn tại

Reset toàn bộ:
```bash
npm run prisma:reset
```

Hoặc:
```bash
rm -rf prisma/migrations
npm run prisma:migrate
npm run prisma:seed
```

---

## 📚 Tài Liệu Thêm

- `../Doc/DATABASE_INITIALIZATION_GUIDE.md` - Hướng dẫn chi tiết
- `../Doc/QUICK_START_DB.md` - Quick start
- `../Doc/FINAL_SUMMARY.md` - Tổng quan
- `../Doc/NESTJS_PRISMA_INTEGRATION.md` - Tích hợp code

---

## 🚀 Tiếp Theo

Sau khi setup xong:

```bash
# 1. Bắt đầu dev server
npm run start:dev

# 2. Xem dữ liệu visual
npm run prisma:studio

# 3. Viết API endpoints
# Xem: src/prisma/prisma.queries.example.ts
```

---

**✅ Setup hoàn tất! Bạn đã sẵn sàng phát triển API.**
