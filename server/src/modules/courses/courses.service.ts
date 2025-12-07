// src/modules/courses/courses.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Course, Enrollment, CourseInstructor, Topic } from './entities';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(CourseInstructor)
    private courseInstructorRepository: Repository<CourseInstructor>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
    private dataSource: DataSource,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.dataSource.transaction(async (manager) => {
      const courseRepo = manager.getRepository(Course);
      const duplicate = await courseRepo.findOne({ where: { courseName: createCourseDto.courseName } });
      if (duplicate) {
        throw new BadRequestException('Course name already exists');
      }

      const { instructorIds, topicIds, ...payload } = createCourseDto;
      // Let DB trigger generate course_id (prefix/padded) via raw insert
      const insertSql = `INSERT INTO COURSES (course_name, description, language, price, min_score, level)
                         VALUES (?, ?, ?, ?, ?, ?)`;
      const params = [
        payload.courseName,
        payload.description ?? null,
        payload.language,
        payload.price,
        payload.minScore ?? 50,
        payload.level ?? 0,
      ];
      try {
        await manager.query(insertSql, params);
      } catch (err) {
        if (err instanceof QueryFailedError && (err as any)?.code === 'ER_DUP_ENTRY') {
          throw new BadRequestException('Course name already exists');
        }
        throw err;
      }

      // Fetch generated course_id (trigger) by unique course_name
      const courseIdRow = await manager.query('SELECT course_id FROM COURSES WHERE course_name = ? LIMIT 1', [
        createCourseDto.courseName,
      ]);
      const courseId: string | undefined = courseIdRow?.[0]?.course_id;
      if (!courseId) {
        throw new BadRequestException('Failed to retrieve created course id');
      }

      // Link instructors (many-to-many via COURSE_INSTRUCTORS)
      if (Array.isArray(instructorIds) && instructorIds.length > 0) {
        for (const instructorId of instructorIds) {
          await manager.query(
            'INSERT INTO COURSE_INSTRUCTORS (course_id, instructor_id, is_main_instructor) VALUES (?, ?, ?)',
            [courseId, instructorId, false],
          );
        }
      }

      // Link topics (many-to-many via COURSE_TOPICS)
      if (Array.isArray(topicIds) && topicIds.length > 0) {
        for (const topicId of topicIds) {
          await manager.query('INSERT INTO COURSE_TOPICS (course_id, topic_id) VALUES (?, ?)', [courseId, topicId]);
        }
      }

      const createdCourse = await courseRepo.findOne({
        where: { courseId },
        relations: ['topics', 'instructors', 'enrollments'],
      });

      if (!createdCourse) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      return createdCourse;
    });
  }

  async findAll(page?: number, limit?: number): Promise<any> {
    if (page === undefined || limit === undefined) {
      const data = await this.coursesRepository.find({
        order: { courseId: 'ASC' },
        relations: ['topics', 'instructors'],
      });
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
      relations: ['topics', 'instructors'],
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
      relations: ['enrollments', 'topics', 'instructors'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.dataSource.transaction(async (manager) => {
      const courseRepo = manager.getRepository(Course);
      const course = await courseRepo.findOne({ where: { courseId: id } });

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      const { instructorIds, topicIds, ...payload } = updateCourseDto;

      // Update scalar fields
      Object.assign(course, payload);
      await courseRepo.save(course);

      // Update instructors junction if provided
      if (Array.isArray(instructorIds)) {
        await manager.query('DELETE FROM COURSE_INSTRUCTORS WHERE course_id = ?', [id]);
        for (const instructorId of instructorIds) {
          await manager.query(
            'INSERT INTO COURSE_INSTRUCTORS (course_id, instructor_id, is_main_instructor) VALUES (?, ?, ?)',
            [id, instructorId, false],
          );
        }
      }

      // Update topics junction if provided
      if (Array.isArray(topicIds)) {
        await manager.query('DELETE FROM COURSE_TOPICS WHERE course_id = ?', [id]);
        for (const topicId of topicIds) {
          await manager.query('INSERT INTO COURSE_TOPICS (course_id, topic_id) VALUES (?, ?)', [id, topicId]);
        }
      }

      const updated = await courseRepo.findOne({
        where: { courseId: id },
        relations: ['topics', 'instructors', 'enrollments'],
      });

      if (!updated) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return updated;
    });
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
    const result = await this.dataSource.query('CALL sp_GetCourseDetails(?)', [id]);
    const row = Array.isArray(result?.[0]) && result[0].length ? result[0][0] : null;

    if (!row) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return row;
  }

  async getTopics(): Promise<Topic[]> {
    return this.topicRepository.find({ order: { topicId: 'ASC' } });
  }
}
