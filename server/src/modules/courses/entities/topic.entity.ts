// src/modules/courses/entities/topic.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('TOPICS')
export class Topic {
  @PrimaryColumn({ name: 'topic_id', type: 'varchar', length: 20 })
  topicId: string;

  @Column({ name: 'topic_name', unique: true })
  topicName: string;

  @Column('text', { nullable: true })
  description: string;

}
