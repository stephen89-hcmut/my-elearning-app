// src/modules/users/entities/student.entity.ts
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
import { Enrollment } from '@/modules/courses/entities/enrollment.entity';

@Entity('STUDENTS')
export class Student {
  @PrimaryColumn({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'enrollment_date', default: () => 'CURRENT_DATE' })
  enrollmentDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  user: User;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
