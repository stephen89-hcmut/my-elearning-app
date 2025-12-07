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

  @Column('text', { name: 'teaching_field', nullable: true })
  teachingField: string;

  @Column('text', { name: 'bio', nullable: true })
  bio: string;

  @OneToOne(() => User, (user) => user.instructor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructor_id' })
  user: User;

  @OneToMany(() => CourseInstructor, (ci) => ci.instructor)
  courses: CourseInstructor[];
}
