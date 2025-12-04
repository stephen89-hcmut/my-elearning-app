// src/api/courses.ts
import axios from 'axios';
import { Course, CreateCourseDto, UpdateCourseDto, PaginatedResponse } from '@/types';
import { mockCourses, mockDashboardStats, mockMonthlyRevenue } from '@/mock/courses';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Simulating network delay
const simulateDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ======== GIAI ĐOẠN 1: MOCK DATA ========
export const getCoursesDemo = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Course>> => {
  await simulateDelay();
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: mockCourses.slice(start, end),
    total: mockCourses.length,
    page,
    limit,
    totalPages: Math.ceil(mockCourses.length / limit),
  };
};

export const getCourseByIdDemo = async (courseId: number): Promise<Course> => {
  await simulateDelay();
  const course = mockCourses.find((c) => c.courseId === courseId);
  if (!course) throw new Error('Course not found');
  return course;
};

export const createCourseDemo = async (data: CreateCourseDto): Promise<Course> => {
  await simulateDelay();
  const newCourse: Course = {
    courseId: Math.max(...mockCourses.map((c) => c.courseId)) + 1,
    ...data,
    totalLectures: 0,
  };
  mockCourses.push(newCourse);
  return newCourse;
};

export const updateCourseDemo = async (
  courseId: number,
  data: UpdateCourseDto,
): Promise<Course> => {
  await simulateDelay();
  const course = mockCourses.find((c) => c.courseId === courseId);
  if (!course) throw new Error('Course not found');
  Object.assign(course, data);
  return course;
};

export const deleteCourseDemmo = async (courseId: number): Promise<void> => {
  await simulateDelay();
  const index = mockCourses.findIndex((c) => c.courseId === courseId);
  if (index === -1) throw new Error('Course not found');
  mockCourses.splice(index, 1);
};

export const getDashboardStatsDemo = async () => {
  await simulateDelay();
  return mockDashboardStats;
};

export const getMonthlyRevenueDemo = async () => {
  await simulateDelay();
  return mockMonthlyRevenue;
};

// ======== GIAI ĐOẠN 2-3: REAL API (Uncomment khi backend ready) ========
/*
export const getCourses = async (
  page: number = 1,
  limit: number = 10,
  topic?: string,
  level?: string,
): Promise<PaginatedResponse<Course>> => {
  const res = await axios.get(`${API_BASE}/courses`, {
    params: { page, limit, topic, level },
  });
  return res.data;
};

export const getCourseById = async (courseId: number): Promise<Course> => {
  const res = await axios.get(`${API_BASE}/courses/${courseId}`);
  return res.data;
};

export const createCourse = async (data: CreateCourseDto): Promise<Course> => {
  const res = await axios.post(`${API_BASE}/courses`, data);
  return res.data;
};

export const updateCourse = async (
  courseId: number,
  data: UpdateCourseDto,
): Promise<Course> => {
  const res = await axios.put(`${API_BASE}/courses/${courseId}`, data);
  return res.data;
};

export const deleteCourse = async (courseId: number): Promise<void> => {
  await axios.delete(`${API_BASE}/courses/${courseId}`);
};

export const getDashboardStats = async () => {
  const res = await axios.get(`${API_BASE}/reports/dashboard-stats`);
  return res.data;
};

export const getMonthlyRevenue = async () => {
  const res = await axios.get(`${API_BASE}/reports/monthly-revenue`);
  return res.data;
};
*/

// Export aliases for current demo phase
export const getCourses = getCoursesDemo;
export const getCourseById = getCourseByIdDemo;
export const createCourse = createCourseDemo;
export const updateCourse = updateCourseDemo;
export const deleteCourse = deleteCourseDemmo;
export const getDashboardStats = getDashboardStatsDemo;
export const getMonthlyRevenue = getMonthlyRevenueDemo;
