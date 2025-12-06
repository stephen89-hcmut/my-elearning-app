# 📊 Database Prisma Setup - Complete Summary

## ✅ Những gì đã được tạo

### 1. **Prisma Schema** (`/server/prisma/schema.prisma`)
- ✅ 20 models Prisma (tương ứng với 20 bảng SQL)
- ✅ Tất cả enums: `UserRole`, `CourseLevel`, `PaymentStatus`, `LectureStatus`, v.v.
- ✅ Tất cả relationships: 1-N, N-N, self-relations
- ✅ Primary keys, unique constraints, foreign keys
- ✅ Map database names cho MySQL

### 2. **Prisma Seed File** (`/server/prisma/seed.ts`)
- ✅ Tạo 15 users (1 admin, 4 instructors, 10 students)
- ✅ Tạo 8 courses với 6 topics
- ✅ Tạo 10 sections, 12 lectures, 6 tests
- ✅ Tạo 8 questions với multiple choice
- ✅ Seed 7 enrollments, 7 transactions
- ✅ Seed lecture views, test results, ratings, certificates

### 3. **Configuration Files**
- ✅ `.env` - Database connection URL
- ✅ `.env.example` - Template environment
- ✅ `package.json` - Updated dependencies & scripts

### 4. **NestJS Prisma Integration**
- ✅ `PrismaService` - Service để kết nối database
- ✅ `PrismaModule` - Module để export service
- ✅ Ready to inject vào các services khác

### 5. **Documentation Files**
- ✅ `PRISMA_SETUP.md` - Hướng dẫn chi tiết
- ✅ `QUICK_START_DB.md` - Quick start guide
- ✅ `prisma.queries.example.ts` - 50+ query examples

---

## 🎯 Các Models Được Tạo

### Users & Authentication
```
- User (cha)
  ├── Admin
  ├── Instructor
  └── Student
```

### Courses & Content
```
- Course
  ├── Topic (N-N via CourseTopics)
  ├── CourseInstructor (N-N)
  ├── Section
  │   ├── Lecture
  │   │   └── LectureView
  │   └── Test
  │       ├── Question
  │       │   └── QuestionChoice
  │       └── TestResult
  └── Prerequisite (self-relation)
```

### Learning & Transactions
```
- Enrollment (N-N Students-Courses)
- Transaction (Payment)
- Certificate (Completion)
- CourseRating (Student feedback)
```

---

## 📦 Database Seed Data

### Users
| Role | Count | Usernames |
|------|-------|-----------|
| Admin | 1 | admin_hcmut |
| Instructor | 4 | gv_thanh, gv_huong, gv_tung, gv_minh |
| Student | 10 | sv_an, sv_binh, sv_cuong, ... |

### Courses (8 total)
1. Nhập Môn Lập Trình C++ (BEGINNER)
2. Cấu Trúc Dữ Liệu & Giải Thuật (INTERMEDIATE)
3. Lập Trình Web Fullstack (ADVANCED)
4. Hệ Quản Trị Cơ Sở Dữ Liệu (INTERMEDIATE)
5. Python cho Phân Tích Dữ Liệu (INTERMEDIATE)
6. Nhập Môn Trí Tuệ Nhân Tạo (ADVANCED)
7. Mạng Máy Tính Cơ Bản (BEGINNER)
8. Luyện Thi Chứng Chỉ AWS Cloud (ADVANCED)

### Topics (6 total)
- Lập Trình Cơ Bản
- Phát Triển Web
- Khoa Học Dữ Liệu
- Cơ Sở Dữ Liệu
- An Ninh Mạng
- Kỹ Năng Mềm

---

## 🚀 Cách Sử Dụng

### Step 1: Cài đặt Dependencies
```bash
cd server
npm install
```

### Step 2: Cấu hình Database
```bash
cp .env.example .env
# Sửa DATABASE_URL nếu cần
```

### Step 3: Tạo Database & Migrate
```bash
npm run prisma:migrate
# Nhập tên: init
```

### Step 4: Seed Dữ Liệu
```bash
npm run prisma:seed
```

### Step 5: Kiểm tra (Tùy chọn)
```bash
npm run prisma:studio
# Mở http://localhost:5555
```

---

## 🔧 Prisma Scripts

| Script | Lệnh | Mô tả |
|--------|------|-------|
| Migrate | `npm run prisma:migrate` | Tạo migration & apply |
| Generate | `npm run prisma:generate` | Generate Prisma Client |
| Seed | `npm run prisma:seed` | Seed dữ liệu test |
| Studio | `npm run prisma:studio` | Mở data explorer |
| Reset | `npm run prisma:reset` | Reset DB (xóa hết) |

---

## 📝 Cách Sử Dụng Prisma trong Code

### 1. Import PrismaModule vào AppModule

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, /* other modules */],
})
export class AppModule {}
```

### 2. Inject PrismaService vào các services

```typescript
// courses.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async getCourseById(courseId: number) {
    return this.prisma.course.findUnique({
      where: { courseId },
      include: {
        courseTopics: { include: { topic: true } },
        courseInstructors: {
          include: { instructor: { include: { user: true } } },
        },
        sections: { include: { lectures: true, tests: true } },
      },
    });
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        courseTopics: { include: { topic: true } },
        courseInstructors: { include: { instructor: true } },
      },
    });
  }
}
```

### 3. Query Examples

Xem file `src/prisma/prisma.queries.example.ts` để có 50+ query examples

---

## 🔐 Bảo Mật

### Demo Credentials
```
All users: password = "password123"
```

### ⚠️ KHÔNG dùng trong production!

Thay đổi trong `prisma/seed.ts`:
```typescript
const hashedPassword = await bcrypt.hash('strong_random_password', 12);
```

---

## 🐛 Troubleshooting

| Lỗi | Giải pháp |
|-----|----------|
| Connection refused | Chạy MySQL server |
| Database not exist | `CREATE DATABASE BTL2;` |
| Migration conflict | `npm run prisma:reset` |
| Port 3306 in use | Thay port trong DATABASE_URL |

---

## 📚 Tài Liệu Tham Khảo

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)
- File này: `PRISMA_SETUP.md` & `QUICK_START_DB.md`

---

## 📂 File Structure

```
server/
├── prisma/
│   ├── schema.prisma          ← Database schema (models)
│   └── seed.ts                ← Seed script (dữ liệu test)
├── src/
│   ├── prisma/
│   │   ├── prisma.service.ts  ← PrismaService
│   │   ├── prisma.module.ts   ← PrismaModule
│   │   └── prisma.queries.example.ts ← Query examples
│   ├── modules/               ← Business logic
│   │   ├── courses/
│   │   ├── users/
│   │   ├── enrollments/
│   │   └── ...
│   └── app.module.ts          ← Main app module
├── .env                       ← Environment (thực tế)
├── .env.example               ← Template
├── package.json               ← Dependencies
├── PRISMA_SETUP.md            ← Detailed guide
├── QUICK_START_DB.md          ← Quick start
└── DATABASE_SETUP.sql         ← Original SQL (reference)
```

---

## ✨ Next Steps

1. **Import PrismaModule** vào AppModule
2. **Tạo services** sử dụng PrismaService
3. **Tạo controllers** cho các API endpoints
4. **Implement auth** sử dụng User model
5. **Add validation** với DTOs & decorators

---

**Status**: ✅ Prisma database setup hoàn thành!  
**Ready to use**: Bạn có thể bắt đầu tạo API endpoints.

---

*Tạo ngày: 2024*  
*Tác giả: Stephen*
