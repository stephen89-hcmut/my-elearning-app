// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User, Student, Instructor, Admin } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Instructor, Admin])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
