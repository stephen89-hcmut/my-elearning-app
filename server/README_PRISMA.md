# 🎓 My E-Learning App - Database Setup (Prisma)

> **E-Learning Backend Database** - Code First Approach using Prisma ORM

## 📌 Overview

Dự án sử dụng **Prisma ORM** để quản lý database MySQL theo mô hình **Code First**. Tất cả schema được định nghĩa trong file `schema.prisma` và migrate ra database thực tế.

### Tại sao chọn Prisma?

✅ Type-safe database client cho TypeScript  
✅ Auto-generate migrations  
✅ Powerful query builder  
✅ Built-in data seeding  
✅ Excellent NestJS integration  
✅ Visual data management (Prisma Studio)  

---

## 🚀 Quick Start (3 phút)

### 1️⃣ Cài Đặt
```bash
cd server
npm install
```

### 2️⃣ Cấu Hình
```bash
cp .env.example .env
# Kiểm tra DATABASE_URL (mặc định: mysql://root:@localhost:3306/BTL2)
```

### 3️⃣ Khởi Tạo Database
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 4️⃣ Done! ✅
Database đã sẵn sàng với 15 users, 8 courses, và dữ liệu test đầy đủ.

---

## 📂 File Structure

```
server/
├── prisma/
│   ├── schema.prisma              # Định nghĩa database models
│   └── seed.ts                    # Dữ liệu test
├── src/
│   ├── prisma/
│   │   ├── prisma.service.ts      # Service (kết nối DB)
│   │   ├── prisma.module.ts       # Module
│   │   ├── prisma.queries.example.ts  # 50+ query examples
│   │   └── index.ts               # Exports
│   ├── modules/                   # Business logic
│   │   ├── courses/
│   │   ├── users/
│   │   ├── enrollments/
│   │   ├── auth/
│   │   └── ...
│   └── app.module.ts
├── .env                           # Environment (production values)
├── .env.example                   # Template
└── package.json

📖 Documentation:
├── QUICK_START_DB.md              # Quick start guide
├── PRISMA_SETUP.md                # Detailed setup guide
├── PRISMA_COMPLETE_SETUP.md       # Complete summary
└── NESTJS_PRISMA_INTEGRATION.md   # NestJS integration guide
```

---

## 📚 Documentation

### For Quick Setup:
👉 **[QUICK_START_DB.md](./QUICK_START_DB.md)** - 5 phút setup

### For Detailed Setup:
👉 **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Chi tiết mọi bước

### For Integration:
👉 **[NESTJS_PRISMA_INTEGRATION.md](./NESTJS_PRISMA_INTEGRATION.md)** - Cách dùng trong code

### Complete Reference:
👉 **[PRISMA_COMPLETE_SETUP.md](./PRISMA_COMPLETE_SETUP.md)** - Tóm tắt đầy đủ

---

## 🎯 Database Schema Overview

### 20 Models (Tables)

#### 👥 Users & Authentication
```
User
├── Admin
├── Instructor (có tài khoản ngân hàng)
└── Student
```

#### 📚 Courses & Content
```
Course
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

#### 🎓 Learning & Transactions
```
Enrollment (Students-Courses N-N)
Transaction (Payment)
Certificate (Completion)
CourseRating (Feedback)
```

---

## 📊 Seed Data

### Users (15 total)
- **1 Admin**: `admin_hcmut`
- **4 Instructors**: `gv_thanh`, `gv_huong`, `gv_tung`, `gv_minh`
- **10 Students**: `sv_an`, `sv_binh`, `sv_cuong`, etc.

**Default password**: `password123` *(change for production)*

### Courses (8 total)
| # | Course | Level | Price |
|---|--------|-------|-------|
| 1 | Nhập Môn Lập Trình C++ | BEGINNER | 500,000 VND |
| 2 | Cấu Trúc Dữ Liệu & Giải Thuật | INTERMEDIATE | 800,000 VND |
| 3 | Lập Trình Web Fullstack | ADVANCED | 1,200,000 VND |
| 4 | Hệ Quản Trị CSDL | INTERMEDIATE | 600,000 VND |
| 5 | Python cho Phân Tích Dữ Liệu | INTERMEDIATE | 1,000,000 VND |
| 6 | Nhập Môn Trí Tuệ Nhân Tạo | ADVANCED | 1,500,000 VND |
| 7 | Mạng Máy Tính Cơ Bản | BEGINNER | 700,000 VND |
| 8 | Luyện Thi Chứng Chỉ AWS | ADVANCED | 2,000,000 VND |

### Topics (6 total)
- Lập Trình Cơ Bản
- Phát Triển Web
- Khoa Học Dữ Liệu
- Cơ Sở Dữ Liệu
- An Ninh Mạng
- Kỹ Năng Mềm

### Other Data
- 10 Sections
- 12 Lectures
- 6 Tests
- 8 Questions
- 7 Enrollments
- 7 Transactions
- 6 Lecture Views
- 3 Test Results
- 3 Course Ratings
- 2 Certificates

---

## 🛠️ Commands

### Setup & Migration
```bash
# Install dependencies
npm install

# Create initial migration
npm run prisma:migrate

# Seed test data
npm run prisma:seed

# Generate Prisma Client
npm run prisma:generate
```

### Development
```bash
# Start dev server
npm run start:dev

# Open Prisma Studio (visual data manager)
npm run prisma:studio

# Format code
npm run format
```

### Database Management
```bash
# Reset database (WARNING: deletes all data!)
npm run prisma:reset

# View migration status
npx prisma migrate status
```

---

## 💻 Usage Examples

### Example 1: Get All Courses
```typescript
// In your service, inject PrismaService
constructor(private prisma: PrismaService) {}

async getAllCourses() {
  return this.prisma.course.findMany({
    include: {
      courseTopics: { include: { topic: true } },
      courseInstructors: {
        include: { instructor: { include: { user: true } } },
      },
      _count: { select: { enrollments: true } },
    },
  });
}
```

### Example 2: Enroll Student
```typescript
async enrollStudent(studentId: number, courseId: number) {
  return this.prisma.enrollment.create({
    data: {
      studentId,
      courseId,
      enrollmentDate: new Date(),
    },
  });
}
```

### Example 3: Get Student Transcript
```typescript
async getStudentTranscript(studentId: number) {
  return this.prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          sections: {
            include: {
              tests: {
                include: {
                  testResults: { where: { studentId } },
                },
              },
            },
          },
        },
      },
    },
  });
}
```

### Example 4: Instructor Revenue
```typescript
async getInstructorRevenue(instructorId: number) {
  return this.prisma.transaction.aggregate({
    where: {
      instructorId,
      paymentStatus: 'COMPLETED',
    },
    _sum: { price: true },
    _count: true,
  });
}
```

👉 **Thêm 50+ examples**: Xem `src/prisma/prisma.queries.example.ts`

---

## 🔐 Security

### Environment Variables
Lưu trong `.env` (never commit):
```env
DATABASE_URL=mysql://root:password@localhost:3306/BTL2
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
```

### Password Hashing
```typescript
// In seed.ts - Generate hashed passwords
const hashedPassword = await bcrypt.hash('password123', 12);
```

### Change Demo Passwords
**Sau khi setup, thay đổi seed.ts:**
```typescript
// Trước: const hashedPassword = await bcrypt.hash('password123', 12);
// Sau: const hashedPassword = await bcrypt.hash(generateSecurePassword(), 12);
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Kiểm tra MySQL server chạy? Port 3306 có lắng nghe? |
| Database not exist | `CREATE DATABASE BTL2;` hoặc chạy `npm run prisma:migrate` |
| Migration conflict | `npm run prisma:reset` |
| Port 3306 in use | Thay port trong DATABASE_URL |
| Prisma Client not found | `npm run prisma:generate` |
| Schema out of sync | `npm run prisma:migrate` |

---

## 🚦 Development Workflow

### 1️⃣ Modify Schema
Edit `prisma/schema.prisma`

### 2️⃣ Create Migration
```bash
npm run prisma:migrate -- --name your_change_name
```

### 3️⃣ Generate Client
```bash
npm run prisma:generate
```

### 4️⃣ Update Services
Sử dụng new fields/models trong code

### 5️⃣ Test
```bash
npm run test
```

---

## 🌐 API Integration (NestJS)

### Import PrismaModule
```typescript
// app.module.ts
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, /* other modules */],
})
export class AppModule {}
```

### Use in Services
```typescript
// courses.service.ts
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.course.findMany({
      include: { courseTopics: true },
    });
  }
}
```

**Xem chi tiết**: [NESTJS_PRISMA_INTEGRATION.md](./NESTJS_PRISMA_INTEGRATION.md)

---

## 📖 Tài Liệu Tham Khảo

- [Prisma Official Docs](https://www.prisma.io/docs)
- [Prisma MySQL Guide](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/general-optimization-guidelines)

---

## ✅ Checklist

### Setup
- [ ] Dependencies installed
- [ ] .env configured
- [ ] Database created
- [ ] Migration applied
- [ ] Seed data loaded

### Development
- [ ] PrismaModule imported in AppModule
- [ ] Services using PrismaService
- [ ] Controllers created
- [ ] DTOs with validation
- [ ] Error handling implemented

### Testing
- [ ] Unit tests for services
- [ ] Integration tests for API
- [ ] Database tests with transactions

---

## 🎯 Next Steps

1. **Setup Auth Module** - JWT authentication
2. **Create API Endpoints** - CRUD operations
3. **Add Validation** - DTO & class-validator
4. **Implement Caching** - Redis
5. **Add Logging** - Winston
6. **Setup Testing** - Jest & e2e tests
7. **Deploy** - Docker & production database

---

## 📞 Support

### Common Questions

**Q: Làm cách nào để đặt lại database?**  
A: `npm run prisma:reset` (xóa tất cả dữ liệu)

**Q: Làm cách nào để xem dữ liệu?**  
A: `npm run prisma:studio` (mở visual explorer)

**Q: Làm cách nào để thêm column mới?**  
A: Edit `schema.prisma` → `npm run prisma:migrate`

**Q: Schema của tôi bị lỗi?**  
A: `npx prisma validate` kiểm tra syntax

---

## 📝 License

UNLICENSED (Private Project)

---

## 👨‍💻 Author

**Stephen** - HCMUT  
**Created**: 2024

---

**Status**: ✅ Production Ready

*Last Updated: 2024*
