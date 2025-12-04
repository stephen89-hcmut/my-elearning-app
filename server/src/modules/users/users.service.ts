// src/modules/users/users.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, Student, Instructor, Admin } from './entities';
import { CreateUserDto } from './dto';
import { UserRole } from '@/common/enums';

@Injectable()
export class UsersService {
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
}
