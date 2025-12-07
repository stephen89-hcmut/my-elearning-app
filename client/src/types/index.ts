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
  teachingField?: string;
  hourlyRate?: number;
  rating?: number;
  courses?: Course[];
  user?: User;
  bio?: string;
}

export interface InstructorStats {
  courseCount: number;
  studentCount: number;
  revenue: number;
  avgRating: number | null;
}

export interface InstructorCourseSummary {
  courseId: number;
  courseName: string;
  language: string;
  level: CourseLevel;
  lectures: number;
  price: number;
  studentCount: number;
}

export interface InstructorRevenueByCourse {
  courseName: string;
  revenue: number;
}

export interface InstructorCoursesByLevel {
  level: CourseLevel;
  count: number;
}

export interface InstructorDetail {
  instructor_name: string;
  username: string;
  email: string;
  bio: string | null;
  teaching_field: string | null;
  total_courses: number;
  total_students: number;
  total_revenue: number;
  avg_rating: number;
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

export interface CourseDetail extends Course {
  lectureCount: number;
  testCount: number;
  totalDuration: number;
  topics: Topic[];
  instructor?: {
    instructorId: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    teachingField?: string;
  };
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
  studentId: string;
  enrollmentDate: Date;
  status?: 'active' | 'inactive';
  user?: User;
}

export interface StudentDetail {
  student_name: string;
  username: string;
  email: string;
  enrollment_date: string;
  total_courses: number;
  total_certificates: number;
  total_completed: number;
  total_learning_duration: number;
}

export interface Enrollment {
  studentId: string;
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
}

export interface UpdateCourseDto {
  courseName?: string;
  description?: string;
  language?: string;
  price?: number;
  minScore?: number;
  level?: CourseLevel;
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
  totalInstructors: number;
  avgRating: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}
