// src/mock/courses.ts
import { Course, CourseLevel } from '@/types';

export const mockCourses: Course[] = [
  {
    courseId: 101,
    courseName: 'Introduction to Database Systems',
    description: 'Learn the fundamentals of database design and SQL',
    language: 'English',
    price: 19.99,
    minScore: 50,
    level: CourseLevel.BEGINNER,
    totalLectures: 24,
    rating: 4.8,
    studentCount: 1203,
    topics: [
      { topicId: 1, topicName: 'Computer Science', description: 'CS fundamentals' },
    ],
    instructors: [
      {
        instructorId: 1,
        qualification: 'PhD in Computer Science',
        hourlyRate: 50,
        user: {
          userId: 1,
          username: 'nguyen_tam',
          email: 'tam@example.com',
          firstName: 'Minh',
          lastName: 'Nguyen',
          role: 1,
        },
      },
    ],
  },
  {
    courseId: 102,
    courseName: 'Advanced SQL Optimization',
    description: 'Master SQL queries and optimize database performance',
    language: 'English',
    price: 29.99,
    minScore: 60,
    level: CourseLevel.ADVANCED,
    totalLectures: 32,
    rating: 4.9,
    studentCount: 856,
    topics: [
      { topicId: 1, topicName: 'Computer Science', description: 'CS fundamentals' },
    ],
    instructors: [
      {
        instructorId: 2,
        qualification: 'M.Sc Database Administration',
        hourlyRate: 60,
        user: {
          userId: 2,
          username: 'thi_b',
          email: 'thib@example.com',
          firstName: 'Thi',
          lastName: 'Le',
          role: 1,
        },
      },
    ],
  },
  {
    courseId: 103,
    courseName: 'Business Analytics 101',
    description: 'Data-driven decision making for business',
    language: 'English',
    price: 24.99,
    minScore: 55,
    level: CourseLevel.BEGINNER,
    totalLectures: 20,
    rating: 4.7,
    studentCount: 945,
    topics: [
      { topicId: 2, topicName: 'Business', description: 'Business fundamentals' },
    ],
    instructors: [
      {
        instructorId: 3,
        qualification: 'MBA',
        hourlyRate: 55,
        user: {
          userId: 3,
          username: 'john_smith',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 1,
        },
      },
    ],
  },
  {
    courseId: 104,
    courseName: 'UI/UX Design Principles',
    description: 'Create beautiful and user-friendly interfaces',
    language: 'English',
    price: 22.99,
    minScore: 45,
    level: CourseLevel.BEGINNER,
    totalLectures: 28,
    rating: 4.6,
    studentCount: 1100,
    topics: [
      { topicId: 3, topicName: 'Design', description: 'Design principles' },
    ],
    instructors: [
      {
        instructorId: 4,
        qualification: 'UX Design Expert',
        hourlyRate: 45,
        user: {
          userId: 4,
          username: 'sarah_design',
          email: 'sarah@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 1,
        },
      },
    ],
  },
];

export const mockTopics = [
  { topicId: 1, topicName: 'Computer Science', description: 'CS fundamentals' },
  { topicId: 2, topicName: 'Business', description: 'Business fundamentals' },
  { topicId: 3, topicName: 'Design', description: 'Design principles' },
];

export const mockDashboardStats = {
  totalRevenue: '$12,450',
  totalCourses: 24,
  totalStudents: 1203,
  avgRating: 4.8,
};

export const mockMonthlyRevenue = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 2000 },
  { month: 'Apr', revenue: 2780 },
  { month: 'May', revenue: 1890 },
  { month: 'Jun', revenue: 2390 },
  { month: 'Jul', revenue: 3490 },
  { month: 'Aug', revenue: 2100 },
  { month: 'Sep', revenue: 2800 },
  { month: 'Oct', revenue: 3200 },
  { month: 'Nov', revenue: 2600 },
  { month: 'Dec', revenue: 3100 },
];
