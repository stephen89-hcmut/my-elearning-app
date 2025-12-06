// src/types/index.ts

export enum UserRole {
  ADMIN = 0,
  INSTRUCTOR = 1,
  STUDENT = 2,
}

export enum CourseLevel {
  BEGINNER = 0,
  INTERMEDIATE = 1,
  ADVANCED = 2,
}

export enum LearningStatus {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
}

export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  bankName?: string;
  paymentAccount?: string;
}

export interface Topic {
  topicId: number;
  topicName: string;
  description?: string;
}

export interface Instructor {
  instructorId: number;
  qualification?: string;
  hourlyRate?: number;
  rating?: number;
  courses?: Course[];
  user?: User;
}

export interface Course {
  courseId: number;
  courseName: string;
  description?: string;
  language: string;
  price: number;
  minScore: number;
  level: CourseLevel;
  totalLectures: number;
  topics?: Topic[];
  instructor?: Instructor;
  instructors?: Instructor[];
  rating?: number;
  studentCount?: number;
}

export interface Section {
  sectionId: number;
  sectionName: string;
  sectionOrder: number;
  courseId: number;
  lectures?: Lecture[];
}

export interface Lecture {
  lectureId: number;
  lectureName: string;
  duration: number;
  sectionId: number;
}

export interface Student {
  studentId: number;
  enrollmentDate: Date;
  status?: 'active' | 'inactive';
  user?: User;
}

export interface Enrollment {
  studentId: number;
  courseId: number;
  enrollmentDate: Date;
  status: LearningStatus;
  student?: Student;
  course?: Course;
}

export interface CreateCourseDto {
  courseName: string;
  description?: string;
  language: string;
  price: number;
  minScore?: number;
  level?: CourseLevel;
  topicIds: number[];
}

export interface UpdateCourseDto {
  courseName?: string;
  description?: string;
  language?: string;
  price?: number;
  minScore?: number;
  level?: CourseLevel;
  topicIds?: number[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalRevenue: string;
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}
