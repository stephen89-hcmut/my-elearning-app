// src/modules/courses/courses.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, Topic, CourseInstructor } from './entities';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
    @InjectRepository(CourseInstructor)
    private courseInstructorRepository: Repository<CourseInstructor>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { topicIds, ...courseData } = createCourseDto;

    // Validate topics exist
    if (topicIds && topicIds.length > 0) {
      const topics = await this.topicsRepository.findByIds(topicIds);
      if (topics.length !== topicIds.length) {
        throw new BadRequestException('One or more topics not found');
      }
    }

    const course = this.coursesRepository.create({
      ...courseData,
      topics: topicIds ? await this.topicsRepository.findByIds(topicIds) : [],
    });

    return this.coursesRepository.save(course);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<any> {
    const [data, total] = await this.coursesRepository.findAndCount({
      relations: ['topics', 'instructors', 'instructors.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { courseId: id },
      relations: ['topics', 'instructors', 'instructors.user', 'sections', 'enrollments'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);

    const { topicIds, ...updateData } = updateCourseDto;

    if (topicIds) {
      const topics = await this.topicsRepository.findByIds(topicIds);
      if (topics.length !== topicIds.length) {
        throw new BadRequestException('One or more topics not found');
      }
      course.topics = topics;
    }

    Object.assign(course, updateData);
    return this.coursesRepository.save(course);
  }

  async delete(id: number): Promise<void> {
    const course = await this.findById(id);
    await this.coursesRepository.remove(course);
  }

  async getTopics(): Promise<Topic[]> {
    return this.topicsRepository.find();
  }
}
