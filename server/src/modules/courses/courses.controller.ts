// src/modules/courses/courses.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page !== undefined && page !== null && page !== '' ? Number(page) : undefined;
    const limitNum = limit !== undefined && limit !== null && limit !== '' ? Number(limit) : undefined;

    return this.coursesService.findAll(
      Number.isNaN(pageNum) ? undefined : pageNum,
      Number.isNaN(limitNum) ? undefined : limitNum,
    );
  }

  @Get('topics')
  getTopics() {
    return this.coursesService.getTopics();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @Get(':id/detail')
  findDetail(@Param('id') id: string) {
    return this.coursesService.getDetail(id);
  }

  @Get(':id/students')
  getStudentsByCourse(
    @Param('id') courseId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.coursesService.getStudentsByCourse(courseId, page, limit);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }
}
