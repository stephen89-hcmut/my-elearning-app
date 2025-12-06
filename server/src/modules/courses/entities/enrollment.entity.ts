// src/modules/courses/entities/enrollment.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { Student } from '@/modules/users/entities/student.entity';
import { Course } from './course.entity';
import { LearningStatus } from '@/common/enums';

@Entity('ENROLLMENTS')
export class Enrollment {
  @PrimaryColumn({ name: 'student_id' })
  studentId: number;

  @PrimaryColumn({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'enrollment_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrollmentDate: Date;

  @Column({ name: 'completion_status', default: LearningStatus.NOT_STARTED })
  status: LearningStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Student, (student) => student.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
