// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StudentsController } from './students.controller';
import { User, Student, Instructor, Admin } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Instructor, Admin])],
  providers: [UsersService],
  controllers: [UsersController, StudentsController],
  exports: [UsersService],
})
export class UsersModule {}
