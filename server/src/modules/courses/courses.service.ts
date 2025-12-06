// src/modules/courses/courses.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, Topic, CourseInstructor, Enrollment } from './entities';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { Student, User } from '@/modules/users/entities';
import { CourseLevel } from '@/common/enums';

@Injectable()
export class CoursesService {
  // Mock data storage (temporary - will be replaced with database)
  private mockCourses: Course[] = [
    {
      courseId: 1,
      courseName: 'Advanced TypeScript',
      description: 'Learn advanced TypeScript concepts',
      language: 'English',
      price: 99.99,
      minScore: 60,
      level: CourseLevel.ADVANCED,
      totalLectures: 20,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      topics: [],
      instructors: [],
      sections: [],
      enrollments: [],
    },
    {
      courseId: 2,
      courseName: 'React Fundamentals',
      description: 'Master React basics and hooks',
      language: 'English',
      price: 79.99,
      minScore: 50,
      level: CourseLevel.BEGINNER,
      totalLectures: 15,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      topics: [],
      instructors: [],
      sections: [],
      enrollments: [],
    },
    {
      courseId: 3,
      courseName: 'NestJS Backend Development',
      description: 'Build scalable backend with NestJS',
      language: 'English',
      price: 89.99,
      minScore: 55,
      level: CourseLevel.INTERMEDIATE,
      totalLectures: 25,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      topics: [],
      instructors: [],
      sections: [],
      enrollments: [],
    },
  ];

  private mockTopics: Topic[] = [
    {
      topicId: 1,
      topicName: 'Web Development' as any,
      description: null as any,
      createdAt: new Date(),
    },
    {
      topicId: 2,
      topicName: 'Frontend' as any,
      description: null as any,
      createdAt: new Date(),
    },
    {
      topicId: 3,
      topicName: 'Backend' as any,
      description: null as any,
      createdAt: new Date(),
    },
    {
      topicId: 4,
      topicName: 'TypeScript' as any,
      description: null as any,
      createdAt: new Date(),
    },
  ];

  private mockEnrollments: Enrollment[] = [
    {
      studentId: 1,
      courseId: 1,
      enrollmentDate: new Date('2024-01-15'),
      status: 1,
      createdAt: new Date('2024-01-15'),
      student: null,
      course: null,
    },
    {
      studentId: 2,
      courseId: 1,
      enrollmentDate: new Date('2024-01-16'),
      status: 1,
      createdAt: new Date('2024-01-16'),
      student: null,
      course: null,
    },
    {
      studentId: 1,
      courseId: 2,
      enrollmentDate: new Date('2024-01-20'),
      status: 1,
      createdAt: new Date('2024-01-20'),
      student: null,
      course: null,
    },
  ];

  private mockStudents: Student[] = [
    {
      studentId: 1,
      enrollmentDate: new Date('2024-01-01'),
      createdAt: new Date('2024-01-01'),
      user: {
        userId: 1,
        username: 'student1',
        email: 'student1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '',
        role: 0,
        bankName: null,
        paymentAccount: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: null,
        instructor: null,
        admin: null,
      },
      enrollments: [],
    },
    {
      studentId: 2,
      enrollmentDate: new Date('2024-01-02'),
      createdAt: new Date('2024-01-02'),
      user: {
        userId: 2,
        username: 'student2',
        email: 'student2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: '',
        role: 0,
        bankName: null,
        paymentAccount: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: null,
        instructor: null,
        admin: null,
      },
      enrollments: [],
    },
    {
      studentId: 3,
      enrollmentDate: new Date('2024-01-03'),
      createdAt: new Date('2024-01-03'),
      user: {
        userId: 3,
        username: 'student3',
        email: 'student3@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        password: '',
        role: 0,
        bankName: null,
        paymentAccount: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        student: null,
        instructor: null,
        admin: null,
      },
      enrollments: [],
    },
  ];

  private nextCourseId = 4;

  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
    @InjectRepository(CourseInstructor)
    private courseInstructorRepository: Repository<CourseInstructor>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const { topicIds, ...courseData } = createCourseDto;

    // Mock implementation - create new course
    const newCourse: Course = {
      courseId: this.nextCourseId++,
      courseName: courseData.courseName,
      description: courseData.description ?? '',
      language: courseData.language,
      price: courseData.price,
      minScore: courseData.minScore ?? 50,
      level: courseData.level ?? CourseLevel.BEGINNER,
      totalLectures: (courseData as any).totalLectures ?? 0,
      topics: topicIds
        ? this.mockTopics.filter((t) => topicIds.includes(t.topicId))
        : [],
      instructors: [],
      sections: [],
      enrollments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockCourses.push(newCourse);
    return newCourse;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<any> {
    // Mock implementation with pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = this.mockCourses.slice(start, end);
    const total = this.mockCourses.length;

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Course> {
    // Mock implementation - find course by ID
    const course = this.mockCourses.find((c) => c.courseId === id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Mock implementation - update course
    const course = await this.findById(id);

    const { topicIds, ...updateData } = updateCourseDto;

    if (topicIds) {
      course.topics = this.mockTopics.filter((t) =>
        topicIds.includes(t.topicId),
      );
    }

    Object.assign(course, updateData, { updatedAt: new Date() });
    return course;
  }

  async delete(id: number): Promise<void> {
    // Mock implementation - delete course
    const index = this.mockCourses.findIndex((c) => c.courseId === id);

    if (index === -1) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    this.mockCourses.splice(index, 1);
  }

  async getTopics(): Promise<Topic[]> {
    // Mock implementation - return all topics
    return this.mockTopics;
  }

  async getStudentsByCourse(
    courseId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    // Mock implementation - get students enrolled in a course
    const course = await this.findById(courseId);

    // Filter enrollments for this course
    const courseEnrollments = this.mockEnrollments.filter(
      (e) => e.courseId === courseId,
    );

    // Get students from enrollments
    const studentIds = courseEnrollments.map((e) => e.studentId);
    const students = this.mockStudents.filter((s) =>
      studentIds.includes(s.studentId),
    );

    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedStudents = students.slice(start, end);

    return {
      data: paginatedStudents.map((s) => ({
        studentId: s.studentId,
        fullName: `${s.user.firstName} ${s.user.lastName}`,
        email: s.user.email,
        username: s.user.username,
        enrollmentDate: courseEnrollments.find(
          (e) => e.studentId === s.studentId,
        )?.enrollmentDate,
      })),
      total: students.length,
      page,
      limit,
      totalPages: Math.ceil(students.length / limit),
    };
  }
}
