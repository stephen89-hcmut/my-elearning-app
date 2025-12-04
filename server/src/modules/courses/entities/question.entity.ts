// src/modules/courses/entities/question.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Test } from './test.entity';
import { QuestionChoice } from './question-choice.entity';
import { QuestionType } from '@/common/enums';

@Entity('QUESTIONS')
export class Question {
  @PrimaryGeneratedColumn({ name: 'question_id' })
  questionId: number;

  @Column('text')
  content: string;

  @Column({ type: 'varchar' })
  type: QuestionType;

  @Column('text', { name: 'correct_answer' })
  correctAnswer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Test, (test) => test.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: Test;

  @OneToMany(() => QuestionChoice, (choice) => choice.question)
  wrongChoices: QuestionChoice[];
}
