// src/modules/courses/entities/test.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Section } from './section.entity';
import { Question } from './question.entity';

@Entity('TESTS')
export class Test {
  @PrimaryGeneratedColumn({ name: 'test_id' })
  testId: number;

  @Column({ name: 'test_name' })
  testName: string;

  @Column({ name: 'max_attempts', default: 1 })
  maxAttempts: number;

  @Column({ name: 'time_limit_minutes' })
  timeLimitMinutes: number;

  @Column({ name: 'score', default: 100 })
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Section, (section) => section.tests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @OneToMany(() => Question, (question) => question.test)
  questions: Question[];
}
