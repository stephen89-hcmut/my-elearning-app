// src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Query,
  Param,
  Delete,
  Put,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateStudentDto, UpdateInstructorDto } from './dto';

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

  @Put('students/:id')
  updateStudent(@Param('id') id: string, @Body() body: UpdateStudentDto) {
    return this.usersService.updateStudent(id, body);
  }

  @Get('instructors/:id')
  getInstructorDetail(@Param('id') id: string) {
    return this.usersService.getInstructorDetail(id);
  }

  @Put('instructors/:id')
  updateInstructor(@Param('id') id: string, @Body() body: UpdateInstructorDto) {
    return this.usersService.updateInstructor(id, body);
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
