// src/modules/users/users.service.ts
import { Injectable, BadRequestException, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, Student, Instructor, Admin } from './entities';
import { CreateUserDto } from './dto';
import { UserRole } from '@/common/enums';

@Injectable()
export class UsersService implements OnModuleInit {
  // Mock data storage (temporary - will be replaced with database)
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
    {
      studentId: 4,
      enrollmentDate: new Date('2024-01-04'),
      createdAt: new Date('2024-01-04'),
      user: {
        userId: 4,
        username: 'student4',
        email: 'student4@example.com',
        firstName: 'Alice',
        lastName: 'Williams',
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
      studentId: 5,
      enrollmentDate: new Date('2024-01-05'),
      createdAt: new Date('2024-01-05'),
      user: {
        userId: 5,
        username: 'student5',
        email: 'student5@example.com',
        firstName: 'Charlie',
        lastName: 'Brown',
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

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Instructor)
    private instructorsRepository: Repository<Instructor>,
    @InjectRepository(Admin)
    private adminsRepository: Repository<Admin>,
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
    // Mock implementation - return paginated students list
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedStudents = this.mockStudents.slice(start, end);
    const total = this.mockStudents.length;

    return {
      data: paginatedStudents.map((student) => ({
        studentId: student.studentId,
        fullName: `${student.user.firstName} ${student.user.lastName}`,
        email: student.user.email,
        username: student.user.username,
        enrollmentDate: student.enrollmentDate,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
