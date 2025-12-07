// src/modules/users/students.controller.ts
import { Controller, Get, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findStudent(@Param('id') id: string) {
    return this.usersService.getStudentDetail(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteStudent(@Param('id') id: string) {
    return this.usersService.deleteStudent(id);
  }
}
