# Prisma Database Setup Guide

Hướng dẫn thiết lập database cho backend e-learning using Prisma (Code First approach).

## 📋 Yêu cầu

- Node.js >= 18.0.0
- MySQL Server trên Docker Synology (192.168.1.200:3307)
- npm hoặc yarn

## 🚀 Bước 1: Cài đặt Dependencies

```bash
cd server
npm install
```

Hoặc nếu bạn sử dụng yarn:

```bash
yarn install
```

## 🔧 Bước 2: Cấu hình Database Connection

Kiểm tra file `.env` trong thư mục `server/` với nội dung sau (đã được cấu hình):

```env
# Database Configuration (MySQL on Docker Synology)
DATABASE_URL="mysql://root:admin@123@192.168.1.200:3307/BTL2"

# Application
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRATION=24h
```

### Thông tin Kết nối:

- **Host**: 192.168.1.200
- **Port**: 3307
- **User**: root
- **Password**: admin@123
- **Database**: BTL2

## 📦 Bước 3: Tạo Migration (Có thể bỏ qua nếu sử dụng reset)

Nếu database chưa tồn tại hoặc bạn muốn cập nhật schema:

```bash
npm run prisma:migrate
```

Nếu đó là lần đầu, hệ thống sẽ yêu cầu bạn nhập tên cho migration (ví dụ: `init`).

## 🌱 Bước 4: Seed Database (Thêm dữ liệu test)

```bash
npm run prisma:seed
```

Lệnh này sẽ:

- Tạo 1 admin, 4 instructors, 10 students
- Tạo 8 khóa học với 6 chủ đề
- Tạo các sections, lectures, tests, questions
- Tạo enrollments, transactions, ratings, certificates
- Tạo lecture views và test results

## 📊 Bước 5: Xem Dữ liệu (Tùy chọn)

Để xem và quản lý dữ liệu trong Prisma Studio:

```bash
npm run prisma:studio
```

Sẽ mở trình duyệt tại `http://localhost:5555`

## 🔄 Reset Database (Nếu cần)

Nếu bạn muốn xóa tất cả dữ liệu và bắt đầu lại:

```bash
npm run prisma:reset
```

## 📝 Cấu trúc Database

### Users & Roles

- **User**: Bảng cha chứa thông tin người dùng chung
- **Admin**: Quản trị viên hệ thống
- **Instructor**: Giảng viên (có tài khoản ngân hàng để nhận thanh toán)
- **Student**: Sinh viên

### Courses

- **Course**: Khóa học
- **Topic**: Chủ đề (liên kết N-N với courses)
- **Section**: Chương/Bài học trong khóa
- **Lecture**: Bài giảng video/nội dung
- **Test**: Bài kiểm tra
- **Question**: Câu hỏi trong bài test
- **QuestionChoice**: Các lựa chọn sai cho trắc nghiệm

### Học tập

- **Enrollment**: Đăng ký khóa học
- **LectureView**: Theo dõi xem bài giảng
- **TestResult**: Kết quả làm bài test

### Giao dịch & Chứng chỉ

- **Transaction**: Giao dịch thanh toán
- **Certificate**: Chứng chỉ hoàn thành khóa học
- **CourseRating**: Đánh giá khóa học

## 🛠️ Các Lệnh Prisma Hữu ích

```bash
# Tạo migration mới
npm run prisma:migrate -- --name your_migration_name

# Chỉ generate Prisma Client (khi schema thay đổi)
npm run prisma:generate

# Xem studio (quản lý dữ liệu)
npm run prisma:studio

# Reset database (xóa tất cả dữ liệu)
npm run prisma:reset
```

## 📚 Schema Prisma

File schema Prisma được lưu tại: `/server/prisma/schema.prisma`

Các model chính:

- User, Admin, Instructor, Student
- Topic, Course, CourseTopics, CourseInstructor
- Section, Lecture, LectureView
- Test, Question, QuestionChoice, TestResult
- Enrollment, Transaction, Certificate, CourseRating, Prerequisite

## 🚨 Troubleshooting

### Lỗi: "Can't reach database server"

- Kiểm tra MySQL server có chạy không
- Kiểm tra DATABASE_URL có chính xác không
- Kiểm tra username/password trong DATABASE_URL

### Lỗi: "Database BTL2 does not exist"

- Tạo database bằng tay trước:
  ```sql
  CREATE DATABASE BTL2;
  ```
- Hoặc chạy: `npm run prisma:migrate`

### Lỗi: "relation already exists"

- Chạy: `npm run prisma:reset`
- Nếu vẫn lỗi, xóa database và tạo lại, sau đó chạy migrate

## 🔐 Bảo mật

### Password User Demo

- Tất cả user demo đều sử dụng password: `password123`
- **⚠️ KHÔNG sử dụng trong production**
- Thay đổi `seed.ts` để sử dụng password ngẫu nhiên trong production

### JWT Secret

- Thay đổi `JWT_SECRET` trong `.env` cho production
- Sử dụng một chuỗi dài, ngẫu nhiên và phức tạp

## 📖 Tài liệu tham khảo

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [NestJS Prisma Integration](https://docs.nestjs.com/recipes/prisma)

---

**Tác giả**: Stephen  
**Ngày cập nhật**: 2024
