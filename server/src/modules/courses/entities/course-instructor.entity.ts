// src/modules/courses/entities/course-instructor.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Course } from './course.entity';
import { Instructor } from '@/modules/users/entities/instructor.entity';

@Entity('COURSE_INSTRUCTORS')
export class CourseInstructor {
  @PrimaryColumn({ name: 'course_id' })
  courseId: number;

  @PrimaryColumn({ name: 'instructor_id' })
  instructorId: number;

  @Column({ name: 'is_main_instructor', default: false })
  isMainInstructor: boolean;

  @ManyToOne(() => Course, (course) => course.instructors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Instructor, (instructor) => instructor.courses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructor_id' })
  instructor: Instructor;
}
