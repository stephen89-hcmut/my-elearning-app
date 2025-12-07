// src/modules/courses/entities/lecture.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Section } from './section.entity';

@Entity('LECTURES')
export class Lecture {
  @PrimaryGeneratedColumn({ name: 'lecture_id' })
  lectureId: number;

  @Column({ name: 'lecture_name' })
  lectureName: string;

  @Column('text', { name: 'content', nullable: true })
  content: string;

  @Column({ name: 'duration', default: 0 })
  duration: number;

  @Column({ name: 'video_url', nullable: true })
  videoUrl: string;


  @ManyToOne(() => Section, (section) => section.lectures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;
}
