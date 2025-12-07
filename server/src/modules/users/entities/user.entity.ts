// src/modules/users/entities/user.entity.ts
import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Student } from './student.entity';
import { Instructor } from './instructor.entity';
import { Admin } from './admin.entity';
import { UserRole } from '@/common/enums';

@Entity('USERS')
export class User {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 20 })
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'int', default: UserRole.STUDENT })
  role: UserRole;

  @Column({ name: 'bank_name', nullable: true })
  bankName: string;

  @Column({ name: 'payment_account', nullable: true })
  paymentAccount: string;

  // Timestamps omitted to match existing DB-first schema

  @OneToOne(() => Student, (student) => student.user, { nullable: true })
  student: Student;

  @OneToOne(() => Instructor, (instructor) => instructor.user, { nullable: true })
  instructor: Instructor;

  @OneToOne(() => Admin, (admin) => admin.user, { nullable: true })
  admin: Admin;
}
