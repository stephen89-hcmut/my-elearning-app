// src/modules/courses/courses.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course, Topic, CourseInstructor, Section, Lecture, Enrollment, Test, Question, QuestionChoice } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Topic,
      CourseInstructor,
      Section,
      Lecture,
      Enrollment,
      Test,
      Question,
      QuestionChoice,
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
