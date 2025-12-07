// src/modules/courses/entities/topic.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('TOPICS')
export class Topic {
  @PrimaryGeneratedColumn({ name: 'topic_id' })
  topicId: number;

  @Column({ name: 'topic_name', unique: true })
  topicName: string;

  @Column('text', { nullable: true })
  description: string;

}
