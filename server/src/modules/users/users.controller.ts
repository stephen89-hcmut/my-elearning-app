// src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  getStudents(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return this.usersService.getStudents(pageNum, limitNum);
  }

  @Get('instructors')
  getInstructors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return this.usersService.getInstructors(pageNum, limitNum);
  }

  @Get('students/:id')
  getStudentDetail(@Param('id') id: string) {
    return this.usersService.getStudentDetail(id);
  }

  @Get('instructors/:id')
  getInstructorDetail(@Param('id') id: string) {
    return this.usersService.getInstructorDetail(id);
  }

  @Delete('students/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteStudent(@Param('id') id: string) {
    return this.usersService.deleteStudent(id);
  }

  @Delete('instructors/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteInstructor(@Param('id') id: string) {
    return this.usersService.deleteInstructor(id);
  }
}
