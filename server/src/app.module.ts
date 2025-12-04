// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/common';
import { CoursesModule } from '@/modules/courses/courses.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ReportsModule } from '@/modules/reports/reports.module';

// Entities
import { User, Student, Instructor, Admin } from '@/modules/users/entities';
import {
  Course,
  Topic,
  Section,
  Lecture,
  CourseInstructor,
  Enrollment,
  Test,
  Question,
  QuestionChoice,
} from '@/modules/courses/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'sManager',
      password: process.env.DB_PASSWORD || 'password123',
      database: process.env.DB_NAME || 'ElearningDB',
      entities: [
        User,
        Student,
        Instructor,
        Admin,
        Course,
        Topic,
        Section,
        Lecture,
        CourseInstructor,
        Enrollment,
        Test,
        Question,
        QuestionChoice,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: false,
    }),
    CoursesModule,
    UsersModule,
    AuthModule,
    ReportsModule,
  ],
})
export class AppModule {}
