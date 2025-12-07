// src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  getStudents(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.usersService.getStudents(page, limit);
  }

  @Get('instructors')
  getInstructors(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.usersService.getInstructors(page, limit);
  }

  @Get('students/:id')
  getStudentDetail(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentDetail(id);
  }

  @Get('instructors/:id')
  getInstructorDetail(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getInstructorDetail(id);
  }
}
