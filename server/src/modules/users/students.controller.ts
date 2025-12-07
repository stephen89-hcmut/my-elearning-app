// src/modules/users/students.controller.ts
import { Controller, Get, Delete, Param, HttpCode, HttpStatus, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateStudentDto } from './dto';

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

  @Put(':id')
  updateStudent(@Param('id') id: string, @Body() body: UpdateStudentDto) {
    return this.usersService.updateStudent(id, body);
  }
}
