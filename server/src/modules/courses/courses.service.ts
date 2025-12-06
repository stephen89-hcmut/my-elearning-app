// src/modules/courses/courses.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Course, Topic, Enrollment } from './entities';
import { CreateCourseDto, UpdateCourseDto } from './dto';

@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { topicIds, ...courseData } = createCourseDto;

    const topics = topicIds?.length
      ? await this.topicsRepository.find({ where: { topicId: In(topicIds) } })
      : [];

    if (topicIds?.length && topics.length !== topicIds.length) {
      throw new BadRequestException('One or more topicIds are invalid');
    }

    const course = this.coursesRepository.create({
      ...courseData,
      topics,
    });

    return this.coursesRepository.save(course);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<any> {
    const [data, total] = await this.coursesRepository.findAndCount({
      relations: ['topics'],
      skip: (page - 1) * limit,
      take: limit,
      order: { courseId: 'ASC' },
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
      relations: ['topics', 'instructors', 'enrollments'],
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
      const topics = await this.topicsRepository.find({ where: { topicId: In(topicIds) } });
      if (topics.length !== topicIds.length) {
        throw new BadRequestException('One or more topicIds are invalid');
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
    return this.topicsRepository.find({ order: { topicId: 'ASC' } });
  }

  async getStudentsByCourse(
    courseId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const course = await this.coursesRepository.findOne({ where: { courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const [enrollments, total] = await this.enrollmentRepository.findAndCount({
      where: { courseId },
      relations: ['student', 'student.user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { enrollmentDate: 'DESC' },
    });

    return {
      data: enrollments.map((enrollment) => ({
        studentId: enrollment.studentId,
        fullName: `${enrollment.student?.user?.firstName || ''} ${enrollment.student?.user?.lastName || ''}`.trim(),
        email: enrollment.student?.user?.email,
        username: enrollment.student?.user?.username,
        enrollmentDate: enrollment.enrollmentDate,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
