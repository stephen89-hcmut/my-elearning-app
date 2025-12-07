// src/modules/users/users.service.ts
import { Injectable, BadRequestException, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, Student, Instructor, Admin } from './entities';
import { CreateUserDto, UpdateStudentDto, UpdateInstructorDto } from './dto';
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
        studentId: String(savedUser.userId),
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

  async findById(id: string): Promise<User> {
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

  async getStudentDetail(id: string) {
    // Use stored procedure to fetch student detail summary
    const result = await this.dataSource.query('CALL sp_GetStudentDetails(?)', [id]);
    const row = Array.isArray(result?.[0]) && result[0].length ? result[0][0] : null;

    if (!row) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return row;
  }

  async getInstructorDetail(id: string) {
    // Use stored procedure to fetch instructor detail summary
    const result = await this.dataSource.query('CALL sp_GetInstructorDetails(?)', [id]);
    const row = Array.isArray(result?.[0]) && result[0].length ? result[0][0] : null;

    if (!row) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    return row;
  }

  async updateStudent(id: string, payload: UpdateStudentDto) {
    const student = await this.studentsRepository.findOne({ where: { studentId: id }, relations: ['user'] });

    if (!student || !student.user) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Uniqueness checks for username/email when provided
    if (payload.username) {
      const existing = await this.usersRepository.findOne({ where: { username: payload.username } });
      if (existing && existing.userId !== student.user.userId) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (payload.email) {
      const existing = await this.usersRepository.findOne({ where: { email: payload.email } });
      if (existing && existing.userId !== student.user.userId) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(student.user, payload);
    await this.usersRepository.save(student.user);

    // Return updated summary using stored procedure for consistency
    return this.getStudentDetail(id);
  }

  async updateInstructor(id: string, payload: UpdateInstructorDto) {
    const instructor = await this.instructorsRepository.findOne({ where: { instructorId: id as any }, relations: ['user'] });

    if (!instructor || !instructor.user) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    if (payload.username) {
      const existing = await this.usersRepository.findOne({ where: { username: payload.username } });
      if (existing && existing.userId !== instructor.user.userId) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (payload.email) {
      const existing = await this.usersRepository.findOne({ where: { email: payload.email } });
      if (existing && existing.userId !== instructor.user.userId) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(instructor.user, payload);
    await this.usersRepository.save(instructor.user);

    if (payload.teachingField !== undefined) {
      instructor.teachingField = payload.teachingField;
    }

    if (payload.bio !== undefined) {
      (instructor as any).bio = payload.bio;
    }

    await this.instructorsRepository.save(instructor);

    // Return stored-procedure detail for consistency
    return this.getInstructorDetail(id);
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await this.studentsRepository.findOne({ where: { studentId: id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    await this.dataSource.query('CALL sp_DeleteUser(?)', [id]);
  }

  async deleteInstructor(id: string): Promise<void> {
    const instructor = await this.instructorsRepository.findOne({ where: { instructorId: id as any } });
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    await this.dataSource.query('CALL sp_DeleteUser(?)', [id]);
  }
}
