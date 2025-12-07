// src/modules/users/entities/admin.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('ADMINS')
export class Admin {
  @PrimaryColumn({ name: 'admin_id', type: 'varchar', length: 20 })
  adminId: string;

  @OneToOne(() => User, (user) => user.admin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  user: User;
}
