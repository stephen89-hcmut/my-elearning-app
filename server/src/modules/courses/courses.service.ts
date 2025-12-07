// src/modules/courses/courses.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Course, Enrollment } from './entities';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private dataSource: DataSource,
  ) {}

  private async getNextCourseId(): Promise<string> {
    const rows = await this.dataSource.query(
      'SELECT IFNULL(MAX(CAST(course_id AS UNSIGNED)), 0) + 1 AS nextId FROM COURSES',
    );
    const nextId = Number(rows?.[0]?.nextId || 1);
    const safe = Number.isNaN(nextId) ? 1 : nextId;
    return String(safe);
  }
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const duplicate = await this.coursesRepository.findOne({ where: { courseName: createCourseDto.courseName } });
    if (duplicate) {
      throw new BadRequestException('Course name already exists');
    }
    const courseId = await this.getNextCourseId();
    const course = this.coursesRepository.create({ courseId, ...createCourseDto });
    let saved: Course;
    try {
      saved = await this.coursesRepository.save(course);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any)?.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Course name already exists');
      }
      throw err;
    }

    return this.findById(saved.courseId);
  }

  async findAll(page?: number, limit?: number): Promise<any> {
    if (page === undefined || limit === undefined) {
      const data = await this.coursesRepository.find({ order: { courseId: 'ASC' } });
      return {
        data,
        total: data.length,
        page: null,
        limit: null,
        totalPages: 1,
      };
    }

    const [data, total] = await this.coursesRepository.findAndCount({
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

  async findById(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { courseId: id },
      relations: ['enrollments'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    Object.assign(course, updateCourseDto);
    return this.coursesRepository.save(course);
  }

  async delete(id: string): Promise<void> {
    // Use stored procedure to handle dependent cleanup safely
    await this.dataSource.query('CALL sp_DeleteCourse(?)', [id]);
  }

  async getStudentsByCourse(
    courseId: string,
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

  async getDetail(id: string) {
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

    return {
      ...row,
      topics: [],
      instructor: null,
    };
  }
}
