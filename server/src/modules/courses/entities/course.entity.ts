// src/modules/courses/entities/course.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { Section } from './section.entity';
import { CourseInstructor } from './course-instructor.entity';
import { Enrollment } from './enrollment.entity';
import { CourseLevel } from '@/common/enums';

@Entity('COURSES')
export class Course {
  @PrimaryGeneratedColumn({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'course_name', unique: true })
  courseName: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  language: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ name: 'min_score', default: 50 })
  minScore: number;

  @Column({ type: 'int', default: CourseLevel.BEGINNER })
  level: CourseLevel;

  @Column({ name: 'total_lectures', default: 0 })
  totalLectures: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Topic)
  @JoinTable({
    name: 'COURSE_TOPICS',
    joinColumn: { name: 'course_id', referencedColumnName: 'courseId' },
    inverseJoinColumn: { name: 'topic_id', referencedColumnName: 'topicId' },
  })
  topics: Topic[];

  @OneToMany(() => Section, (section) => section.course)
  sections: Section[];

  @OneToMany(() => CourseInstructor, (ci) => ci.course)
  instructors: CourseInstructor[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
