// src/modules/users/users.service.ts
import { Injectable, BadRequestException, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, Student, Instructor, Admin } from './entities';
import { CreateUserDto } from './dto';
import { UserRole } from '@/common/enums';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Instructor)
    private instructorsRepository: Repository<Instructor>,
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.ensureDefaultAdmin();
  }

  private async ensureDefaultAdmin() {
    try {
      const defaultPassword = '123456';
      const admin = await this.usersRepository.findOne({ where: { username: 'admin_hcmut' }, withDeleted: false });

      // If not exists, create new with hashed password
      if (!admin) {
        const hashed = await bcrypt.hash(defaultPassword, 10);
        const created = await this.usersRepository.save({
          username: 'admin_hcmut',
          email: 'admin_hcmut@example.com',
          firstName: 'Admin',
          lastName: 'HCMUT',
          password: hashed,
          role: UserRole.ADMIN,
        });
        await this.adminsRepository.save({ adminId: created.userId, user: created });
        Logger.log('Default admin user created: admin_hcmut / 123456');
        return;
      }

      // If exists but password is not bcrypt (plaintext), re-hash default password
      const looksHashed = typeof admin.password === 'string' && admin.password.startsWith('$2');
      if (!looksHashed) {
        const hashed = await bcrypt.hash(defaultPassword, 10);
        await this.usersRepository.update({ userId: admin.userId }, { password: hashed, role: UserRole.ADMIN });
        Logger.log('Default admin password was plaintext; re-hashed to bcrypt');
      }

      // Ensure role and admin record
      if (admin.role !== UserRole.ADMIN) {
        await this.usersRepository.update({ userId: admin.userId }, { role: UserRole.ADMIN });
      }
      await this.adminsRepository.upsert({ adminId: admin.userId, user: admin }, ['adminId']);
      Logger.log('Default admin user ensured: admin_hcmut / 123456');
    } catch (error) {
      Logger.error('Failed to ensure default admin user', error?.message || error);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || UserRole.STUDENT,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create role-specific record
    if (savedUser.role === UserRole.STUDENT) {
      await this.studentsRepository.save({
        studentId: savedUser.userId,
        user: savedUser,
      });
    } else if (savedUser.role === UserRole.INSTRUCTOR) {
      await this.instructorsRepository.save({
        instructorId: savedUser.userId,
        user: savedUser,
      });
    } else if (savedUser.role === UserRole.ADMIN) {
      await this.adminsRepository.save({
        adminId: savedUser.userId,
        user: savedUser,
      });
    }

    return this.findById(savedUser.userId);
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
      relations: ['student', 'instructor', 'admin'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      select: [
        'userId',
        'username',
        'email',
        'firstName',
        'lastName',
        'password',
        'role',
      ],
    });
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getStudents(
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.max(1, limit || 10);

    const [students, total] = await this.studentsRepository.findAndCount({
      relations: ['user'],
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      order: { studentId: 'ASC' },
    });

    return {
      data: students,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async getInstructors(
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.max(1, limit || 10);

    const [instructors, total] = await this.instructorsRepository.findAndCount({
      relations: ['user', 'courses'],
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      order: { instructorId: 'ASC' },
    });

    return {
      data: instructors,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async getStudentDetail(id: number) {
    const student = await this.studentsRepository.findOne({
      where: { studentId: id },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const stats = await this.dataSource.query(
      `SELECT
        COUNT(*) as totalCourses,
        SUM(CASE WHEN completion_status = 2 THEN 1 ELSE 0 END) as completedCourses,
        SUM(CASE WHEN completion_status = 1 THEN 1 ELSE 0 END) as inProgressCourses
      FROM ENROLLMENTS
      WHERE student_id = ?`,
      [id],
    );

    const spendingRow = (await this.dataSource.query(
      `SELECT COALESCE(SUM(price), 0) as totalSpent
       FROM TRANSACTIONS
       WHERE student_id = ? AND payment_status = 'completed'`,
      [id],
    ))[0];

    const courses = await this.dataSource.query(
      `SELECT c.course_id as courseId,
              c.course_name as courseName,
              c.description,
              c.language,
              c.level,
              c.total_lectures as totalLectures,
              c.price,
              e.completion_status as completionStatus,
              e.enrollment_date as enrollmentDate
       FROM ENROLLMENTS e
       JOIN COURSES c ON c.course_id = e.course_id
       WHERE e.student_id = ?
       ORDER BY e.enrollment_date DESC`,
      [id],
    );

    return {
      student,
      stats: {
        totalCourses: Number(stats?.[0]?.totalCourses || 0),
        completed: Number(stats?.[0]?.completedCourses || 0),
        inProgress: Number(stats?.[0]?.inProgressCourses || 0),
        totalSpent: Number(spendingRow?.totalSpent || 0),
        avgScore: null,
      },
      courses,
    };
  }

  async getInstructorDetail(id: number) {
    const instructor = await this.instructorsRepository.findOne({
      where: { instructorId: id },
      relations: ['user'],
    });

    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    const [statsRow] = await this.dataSource.query(
      `SELECT
        COUNT(DISTINCT ci.course_id) as courseCount,
        COUNT(DISTINCT e.student_id) as studentCount,
        COALESCE(SUM(CASE WHEN t.payment_status = 'completed' THEN t.price END), 0) as revenue
      FROM INSTRUCTORS i
      LEFT JOIN COURSE_INSTRUCTORS ci ON ci.instructor_id = i.instructor_id
      LEFT JOIN ENROLLMENTS e ON e.course_id = ci.course_id
      LEFT JOIN TRANSACTIONS t ON t.course_id = ci.course_id AND t.instructor_id = i.instructor_id
      WHERE i.instructor_id = ?
      GROUP BY i.instructor_id`,
      [id],
    );

    const revenueByCourse = await this.dataSource.query(
      `SELECT c.course_name as courseName,
              COALESCE(SUM(CASE WHEN t.payment_status = 'completed' THEN t.price END), 0) as revenue
       FROM COURSE_INSTRUCTORS ci
       JOIN COURSES c ON c.course_id = ci.course_id
       LEFT JOIN TRANSACTIONS t ON t.course_id = ci.course_id AND t.instructor_id = ci.instructor_id AND t.payment_status = 'completed'
       WHERE ci.instructor_id = ?
       GROUP BY c.course_id, c.course_name
       ORDER BY c.course_name`,
      [id],
    );

    const coursesByLevel = await this.dataSource.query(
      `SELECT c.level, COUNT(*) as count
       FROM COURSE_INSTRUCTORS ci
       JOIN COURSES c ON c.course_id = ci.course_id
       WHERE ci.instructor_id = ?
       GROUP BY c.level`,
      [id],
    );

    const courses = await this.dataSource.query(
      `SELECT c.course_id as courseId,
              c.course_name as courseName,
              c.language,
              c.level,
              c.total_lectures as lectures,
              c.price,
              COALESCE(e.student_count, 0) as studentCount
       FROM COURSE_INSTRUCTORS ci
       JOIN COURSES c ON c.course_id = ci.course_id
       LEFT JOIN (
         SELECT course_id, COUNT(*) as student_count
         FROM ENROLLMENTS
         GROUP BY course_id
       ) e ON e.course_id = c.course_id
       WHERE ci.instructor_id = ?
       ORDER BY c.course_name`,
      [id],
    );

    return {
      instructor,
      stats: {
        courseCount: Number(statsRow?.courseCount || 0),
        studentCount: Number(statsRow?.studentCount || 0),
        revenue: Number(statsRow?.revenue || 0),
        avgRating: null,
      },
      revenueByCourse,
      coursesByLevel: coursesByLevel.map((row: any) => ({ level: Number(row.level), count: Number(row.count) })),
      courses,
    };
  }
}
