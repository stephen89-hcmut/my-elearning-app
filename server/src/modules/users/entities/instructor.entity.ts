// src/modules/users/entities/instructor.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CourseInstructor } from '@/modules/courses/entities/course-instructor.entity';

@Entity('INSTRUCTORS')
export class Instructor {
  @PrimaryColumn({ name: 'instructor_id' })
  instructorId: number;

  @Column('text', { name: 'qualification', nullable: true })
  qualification: string;

  @Column('decimal', { name: 'hourly_rate', precision: 10, scale: 2, nullable: true })
  hourlyRate: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.instructor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructor_id' })
  user: User;

  @OneToMany(() => CourseInstructor, (ci) => ci.instructor)
  courses: CourseInstructor[];
}
