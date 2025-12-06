# 🚀 Hướng Dẫn Khởi Tạo Database

## 📋 Yêu Cầu

Trước khi bắt đầu, đảm bảo:

- ✅ Node.js >= 18.0.0 đã cài đặt
- ✅ MySQL trên Docker Synology (192.168.1.200:3307) đang chạy
- ✅ File `.env` đã cấu hình (đã được thiết lập sẵn)

## 🔧 Các Bước Khởi Tạo

### Bước 1: Cài Đặt Dependencies (3-5 phút)

```bash
cd server
npm install
```

**Điều này sẽ:**

- Tải xuống tất cả npm packages
- Cài đặt Prisma CLI
- Chuẩn bị các tools cần thiết

### Bước 2: Generate Prisma Client (< 1 phút)

```bash
npm run prisma:generate
```

**Hoặc tự động:**

```bash
npx prisma generate
```

**Điều này sẽ:**

- Tạo Prisma Client từ schema
- Cập nhật type definitions cho TypeScript

### Bước 3: Tạo Migration & Database (1-2 phút)

```bash
npm run prisma:migrate
```

**Hoặc chạy migrations mà không tạo migration mới:**

```bash
npx prisma migrate deploy
```

**Lần đầu tiên, hãy chọn "init" khi được hỏi tên migration**

**Điều này sẽ:**

- ✅ Tạo database BTL2 trên MySQL Synology
- ✅ Tạo tất cả 20 bảng dữ liệu
- ✅ Thiết lập các foreign keys và constraints
- ✅ Lưu lịch sử migrations

### Bước 4: Khởi Tạo Dữ Liệu Test (< 1 phút)

```bash
npm run prisma:seed
```

**Hoặc chạy trực tiếp:**

```bash
node prisma/seed.ts
```

**Điều này sẽ:**

- ✅ Tạo 15 users (1 admin, 4 instructors, 10 students)
- ✅ Tạo 8 khóa học đầy đủ
- ✅ Thêm 10 sections và 12 lectures
- ✅ Thêm 6 tests với 48 câu hỏi
- ✅ Tạo enrollments, transactions, ratings...
- ✅ Sẵn sàng cho development

## ⚡ Chạy Tất Cả Một Lần (Nhanh Nhất)

```bash
cd server && npm install && npm run prisma:generate && npx prisma migrate deploy && npm run prisma:seed
```

Hoặc sử dụng script (nếu trên macOS/Linux):

```bash
cd server && bash setup-db.sh
```

## 🔍 Xác Nhận Kết Quả

### 1. Xem Dữ Liệu với Prisma Studio

Mở giao diện visual để xem và quản lý dữ liệu:

```bash
npm run prisma:studio
```

Sẽ mở browser tại: **http://localhost:5555**

### 2. Kiểm Tra Connection String

```bash
cat .env | grep DATABASE_URL
```

Kết quả sẽ như:

```
DATABASE_URL="mysql://root:admin@123@192.168.1.200:3307/BTL2"
```

### 3. Kiểm Tra với MySQL Client

```bash
mysql -h 192.168.1.200 -P 3307 -u root -p
# Password: admin@123

# Trong MySQL shell:
USE BTL2;
SHOW TABLES;
SELECT COUNT(*) FROM User;
SELECT COUNT(*) FROM Course;
```

## 📊 Thông Tin Seed Data

Sau khi seed thành công, bạn sẽ có:

### Users (15 người)

- **1 Admin**: admin_hcmut (admin@hcmut.edu.vn)
- **4 Instructors**: gv_thanh, gv_huong, gv_minh, gv_lan
- **10 Students**: sv_001 đến sv_010

Tất cả mật khẩu mặc định: **password123**

### Courses (8 khóa học)

- C++ từ cơ bản đến nâng cao
- Cấu trúc dữ liệu & Giải thuật
- Lập trình Web với React
- Cơ sở dữ liệu nâng cao
- Python cho AI/ML
- Nhập môn Trí Tuệ Nhân Tạo
- Mạng máy tính nâng cao
- AWS Cloud Solutions

### Content

- 10 Sections (chương)
- 12 Lectures (bài giảng)
- 6 Tests (bài kiểm tra)
- 8 Questions mỗi test
- 15 Answer Choices cho mỗi câu hỏi

### Learning Activities

- 7 Enrollments (học sinh đăng ký khóa học)
- 7 Transactions (giao dịch thanh toán)
- 6 Lecture Views (lượt xem bài giảng)
- 3 Test Results (kết quả kiểm tra)
- 3 Course Ratings (đánh giá khóa học)
- 2 Certificates (chứng chỉ hoàn thành)

## ❌ Xử Lý Lỗi

### Lỗi: "Connection refused"

```
Error: connect ECONNREFUSED 192.168.1.200:3307
```

**Giải pháp:**

- Kiểm tra MySQL trên Synology đang chạy
- Kiểm tra IP: `ping 192.168.1.200`
- Kiểm tra port: `nc -zv 192.168.1.200 3307`
- Kiểm tra DATABASE_URL trong `.env`

### Lỗi: "Access denied for user 'root'"

```
Error: Access denied for user 'root'@'192.168.1.200'
```

**Giải pháp:**

- Kiểm tra mật khẩu: `admin@123`
- Kiểm tra username: `root`
- Xác nhận trong MySQL Synology settings

### Lỗi: "Database does not exist"

```
Error: Unknown database 'BTL2'
```

**Giải pháp:**

- Database sẽ được tự động tạo bởi Prisma
- Nếu lỗi vẫn xảy ra, xóa migration và tạo lại:
  ```bash
  rm -rf prisma/migrations
  npm run prisma:migrate
  ```

### Lỗi: "Seed fails on constraint violation"

```
Error: Foreign key constraint failed
```

**Giải pháp:**

- Reset database:
  ```bash
  npm run prisma:reset
  ```
- Hoặc xóa dữ liệu cũ và seed lại:
  ```bash
  npx prisma migrate reset --force
  ```

## 📝 Tiếp Theo

Sau khi setup thành công:

1. **Tạo API Endpoints**: Xem `../Doc/NESTJS_PRISMA_INTEGRATION.md`
2. **Viết Services**: Tham khảo `src/prisma/prisma.queries.example.ts`
3. **Bắt đầu Development**: `npm run start:dev`
4. **Xem Dữ Liệu**: `npm run prisma:studio`

## 🎯 Checklist

- [ ] .env đã cấu hình
- [ ] npm install thành công
- [ ] prisma:migrate thành công
- [ ] prisma:seed thành công
- [ ] Mở prisma:studio và thấy dữ liệu
- [ ] Kiểm tra Users: 15 users
- [ ] Kiểm tra Courses: 8 courses
- [ ] Sẵn sàng bắt đầu develop APIs

## 📚 Tài Liệu Tham Khảo

- [FINAL_SUMMARY.md](FINAL_SUMMARY.md) - Tổng quan đầy đủ
- [QUICK_START_DB.md](QUICK_START_DB.md) - Khởi động nhanh
- [NESTJS_PRISMA_INTEGRATION.md](NESTJS_PRISMA_INTEGRATION.md) - Tích hợp NestJS
- [README_PRISMA.md](README_PRISMA.md) - Tài liệu tham khảo chính
- [MIGRATIONS_GUIDE.md](MIGRATIONS_GUIDE.md) - Quản lý migrations

---

**Happy Coding! 🚀**
