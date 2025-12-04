// src/modules/users/entities/admin.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('ADMINS')
export class Admin {
  @PrimaryColumn({ name: 'admin_id' })
  adminId: number;

  @Column('text', { nullable: true })
  permissions: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.admin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  user: User;
}
