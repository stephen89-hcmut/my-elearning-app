# 🔗 NestJS + Prisma Integration Guide

Hướng dẫn từng bước để tích hợp Prisma vào NestJS backend.

## 📋 Điều Kiện Tiên Quyết

- ✅ Prisma schema đã tạo (`prisma/schema.prisma`)
- ✅ PrismaService & PrismaModule đã tạo
- ✅ Database đã migrate (`npm run prisma:migrate`)
- ✅ Seed data đã thêm (`npm run prisma:seed`)

---

## 🔧 Step 1: Setup PrismaModule trong AppModule

**File: `src/app.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    // Các modules khác của bạn sẽ đi vào đây
  ],
})
export class AppModule {}
```

---

## 📝 Step 2: Tạo Service Sử Dụng Prisma

**Ví dụ: `src/modules/courses/courses.service.ts`**

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  // Get all courses
  async findAll() {
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

  // Get course by ID
  async findOne(courseId: number) {
    return this.prisma.course.findUnique({
      where: { courseId },
      include: {
        courseTopics: { include: { topic: true } },
        courseInstructors: {
          include: { instructor: { include: { user: true } } },
        },
        sections: {
          include: {
            lectures: true,
            tests: { include: { questions: true } },
          },
        },
        enrollments: true,
        courseRatings: true,
      },
    });
  }

  // Create course
  async create(createCourseDto: CreateCourseDto) {
    return this.prisma.course.create({
      data: createCourseDto,
    });
  }

  // Update course
  async update(courseId: number, updateCourseDto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { courseId },
      data: updateCourseDto,
    });
  }

  // Delete course
  async remove(courseId: number) {
    return this.prisma.course.delete({
      where: { courseId },
    });
  }

  // Get enrolled students
  async getEnrolledStudents(courseId: number) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: { include: { user: true } },
      },
    });
  }
}
```

---

## 🎯 Step 3: Tạo Controller

**Ví dụ: `src/modules/courses/courses.controller.ts`**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }

  @Get(':id/students')
  getStudents(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getEnrolledStudents(id);
  }
}
```

---

## 📦 Step 4: Tạo DTOs

**File: `src/modules/courses/dto/create-course.dto.ts`**

```typescript
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { CourseLevel } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  courseName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  language: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  minScore: number;

  @IsString()
  level: CourseLevel;
}
```

**File: `src/modules/courses/dto/update-course.dto.ts`**

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
```

---

## 🏗️ Step 5: Tạo Module

**File: `src/modules/courses/courses.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
```

---

## 👥 Step 6: Ví Dụ Khác - Users Service

**File: `src/modules/users/users.service.ts`**

```typescript
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if email exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Create user
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        admin: true,
        instructor: true,
        student: true,
      },
    });
  }

  async findById(userId: number) {
    return this.prisma.user.findUnique({
      where: { userId },
      include: {
        admin: true,
        instructor: true,
        student: true,
      },
    });
  }

  async getAllStudents() {
    return this.prisma.student.findMany({
      include: { user: true },
    });
  }

  async getAllInstructors() {
    return this.prisma.instructor.findMany({
      include: { user: true },
    });
  }
}
```

---

## 📚 Step 7: Ví Dụ Khác - Enrollments Service

**File: `src/modules/enrollments/enrollments.service.ts`**

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enrollStudent(createEnrollmentDto: CreateEnrollmentDto) {
    const { studentId, courseId } = createEnrollmentDto;

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Student already enrolled in this course');
    }

    // Create enrollment
    return this.prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        enrollmentDate: new Date(),
      },
    });
  }

  async getStudentEnrollments(studentId: number) {
    return this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            courseInstructors: {
              include: { instructor: { include: { user: true } } },
            },
          },
        },
      },
    });
  }

  async completeEnrollment(studentId: number, courseId: number) {
    return this.prisma.enrollment.update({
      where: {
        studentId_courseId: { studentId, courseId },
      },
      data: {
        completionStatus: 'COMPLETED',
      },
    });
  }

  // Create certificate after completion
  async createCertificate(studentId: number, courseId: number) {
    return this.prisma.certificate.create({
      data: {
        studentId,
        courseId,
        issuedDate: new Date(),
      },
    });
  }
}
```

---

## 🔐 Step 8: Sử Dụng Prisma với Authentication

**Example Guards/Middleware:**

```typescript
// Kiểm tra student có quyền truy cập enrollment không
async canAccessEnrollment(studentId: number, courseId: number) {
  const enrollment = await this.prisma.enrollment.findUnique({
    where: {
      studentId_courseId: { studentId, courseId },
    },
  });

  return !!enrollment;
}

// Kiểm tra instructor có phụ trách khóa học không
async isInstructorOfCourse(instructorId: number, courseId: number) {
  const courseInstructor = await this.prisma.courseInstructor.findUnique({
    where: {
      courseId_instructorId: { courseId, instructorId },
    },
  });

  return !!courseInstructor;
}
```

---

## 💾 Step 9: Transactions với Prisma

```typescript
async enrollAndPayForCourse(
  studentId: number,
  courseId: number,
  instructorId: number,
) {
  return await this.prisma.$transaction(async (tx) => {
    // Create enrollment
    const enrollment = await tx.enrollment.create({
      data: {
        studentId,
        courseId,
      },
    });

    // Create transaction
    const course = await tx.course.findUnique({
      where: { courseId },
    });

    const transaction = await tx.transaction.create({
      data: {
        studentId,
        courseId,
        instructorId,
        price: course.price,
        paymentStatus: 'COMPLETED',
      },
    });

    return { enrollment, transaction };
  });
}
```

---

## 🧪 Step 10: Testing

**Example test file:**

```typescript
// courses.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: {
            course: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all courses', async () => {
    await service.findAll();
    expect(prisma.course.findMany).toHaveBeenCalled();
  });
});
```

---

## 📊 Useful Prisma Patterns

### Pattern 1: Pagination
```typescript
async findAllPaginated(page: number, pageSize: number) {
  return this.prisma.course.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}
```

### Pattern 2: Filtering
```typescript
async findByLevel(level: CourseLevel) {
  return this.prisma.course.findMany({
    where: { level },
  });
}
```

### Pattern 3: Count
```typescript
async getTotalCourses() {
  return this.prisma.course.count();
}
```

### Pattern 4: Aggregation
```typescript
async getAveragePrice() {
  return this.prisma.course.aggregate({
    _avg: { price: true },
    _min: { price: true },
    _max: { price: true },
  });
}
```

---

## ✅ Checklist

- [ ] PrismaModule imported vào AppModule
- [ ] Services sử dụng PrismaService
- [ ] Controllers tạo & hoạt động
- [ ] DTOs validate dữ liệu
- [ ] Error handling implemented
- [ ] Tests viết cho services
- [ ] Database migrations applied
- [ ] Seed data loaded

---

## 🚀 Next Steps

1. Tạo Auth module với JWT
2. Tạo API documentation (Swagger)
3. Thêm validation & error handling
4. Implement caching
5. Thêm logging
6. Setup rate limiting

---

**Tài Liệu Tham Khảo**: `PRISMA_SETUP.md`, `QUICK_START_DB.md`
