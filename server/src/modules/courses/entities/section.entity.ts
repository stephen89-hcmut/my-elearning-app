// src/modules/courses/entities/section.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Course } from './course.entity';
import { Lecture } from './lecture.entity';
import { Test } from './test.entity';

@Entity('SECTIONS')
export class Section {
  @PrimaryGeneratedColumn({ name: 'section_id' })
  sectionId: number;

  @Column({ name: 'section_name' })
  sectionName: string;

  @Column({ name: 'section_order' })
  sectionOrder: number;

  @ManyToOne(() => Course, (course) => course.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Lecture, (lecture) => lecture.section)
  lectures: Lecture[];

  @OneToMany(() => Test, (test) => test.section)
  tests: Test[];
}
