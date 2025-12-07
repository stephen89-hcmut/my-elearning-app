// src/api/courses.ts
import axios from 'axios';
import { Course, CourseDetail, CreateCourseDto, UpdateCourseDto, PaginatedResponse, Topic, Student, Instructor, DashboardStats, MonthlyRevenue, StudentDetail, InstructorDetail } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======== COURSES API ========
export const getCourses = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Course>> => {
  try {
    const response = await apiClient.get('/courses', {
      params: { page, limit },
    });
    const { data, total } = response.data;
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil((total || 0) / limit),
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: number): Promise<Course> => {
  try {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const getCourseDetail = async (courseId: number): Promise<CourseDetail> => {
  try {
    const response = await apiClient.get(`/courses/${courseId}/detail`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course detail:', error);
    throw error;
  }
};

export const createCourse = async (data: CreateCourseDto): Promise<Course> => {
  try {
    const response = await apiClient.post('/courses', data);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (
  courseId: number,
  data: UpdateCourseDto,
): Promise<Course> => {
  try {
    const response = await apiClient.put(`/courses/${courseId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}`);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const getTopics = async (): Promise<Topic[]> => {
  try {
    const response = await apiClient.get('/courses/topics');
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

// ======== STUDENTS API ========
export const getStudents = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ data: Student[]; total: number; page: number; limit: number; totalPages: number }> => {
  try {
    const response = await apiClient.get('/users/students', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudentDetail = async (id: string): Promise<StudentDetail> => {
  try {
    const response = await apiClient.get(`/users/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student detail:', error);
    throw error;
  }
};

export const deleteStudent = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/users/students/${id}`);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// ======== INSTRUCTORS API ========
export const getInstructors = async (
  page: number = 1,
  limit: number = 10,
): Promise<{ data: Instructor[]; total: number; page: number; limit: number; totalPages: number }> => {
  try {
    const response = await apiClient.get('/users/instructors', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

export const getInstructorDetail = async (id: number): Promise<InstructorDetail> => {
  try {
    const response = await apiClient.get(`/users/instructors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor detail:', error);
    throw error;
  }
};

export const deleteInstructor = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/users/instructors/${id}`);
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw error;
  }
};

// ======== REPORTS API ========
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiClient.get('/reports/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
  try {
    const response = await apiClient.get('/reports/revenue');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw error;
  }
};
