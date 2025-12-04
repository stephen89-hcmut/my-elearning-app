// src/modules/courses/entities/question-choice.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('QUESTION_CHOICES')
export class QuestionChoice {
  @PrimaryGeneratedColumn({ name: 'choice_id' })
  choiceId: number;

  @Column('text')
  content: string;

  @Column({ name: 'is_correct', default: false })
  isCorrect: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Question, (question) => question.wrongChoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
