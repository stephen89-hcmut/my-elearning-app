// src/modules/courses/courses.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
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

  async getDetail(id: number) {
    const [row] = await this.dataSource.query(
      `SELECT c.course_id as courseId,
              c.course_name as courseName,
              c.description,
              c.language,
              c.price,
              c.min_score as minScore,
              c.level,
              c.total_lectures as totalLectures,
              COUNT(DISTINCT l.lecture_id) as lectureCount,
              COUNT(DISTINCT tst.test_id) as testCount,
              COALESCE(SUM(l.duration), 0) as totalDuration,
              COUNT(DISTINCT e.student_id) as studentCount
       FROM COURSES c
       LEFT JOIN SECTIONS s ON s.course_id = c.course_id
       LEFT JOIN LECTURES l ON l.section_id = s.section_id
       LEFT JOIN TESTS tst ON tst.section_id = s.section_id
       LEFT JOIN ENROLLMENTS e ON e.course_id = c.course_id
       WHERE c.course_id = ?
       GROUP BY c.course_id`,
      [id],
    );

    if (!row) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    const topics = await this.dataSource.query(
      `SELECT t.topic_id as topicId, t.topic_name as topicName
       FROM COURSE_TOPICS ct
       JOIN TOPICS t ON t.topic_id = ct.topic_id
       WHERE ct.course_id = ?
       ORDER BY t.topic_name`,
      [id],
    );

    const instructor = (await this.dataSource.query(
      `SELECT i.instructor_id as instructorId,
              u.first_name as firstName,
              u.last_name as lastName,
              u.username,
              u.email,
              i.teaching_field as teachingField
       FROM COURSE_INSTRUCTORS ci
       JOIN INSTRUCTORS i ON i.instructor_id = ci.instructor_id
       JOIN USERS u ON u.user_id = i.instructor_id
       WHERE ci.course_id = ?
       ORDER BY ci.is_main_instructor DESC
       LIMIT 1`,
      [id],
    ))?.[0];

    return {
      ...row,
      topics,
      instructor,
    };
  }
}
