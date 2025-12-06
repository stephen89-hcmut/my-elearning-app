# API Endpoints Documentation

## Overview
This document describes all available API endpoints following the MVC (Model-View-Controller) architecture. The backend uses NestJS with TypeORM and mock data for demonstration purposes.

---

## Course Management Endpoints

### 1. Create New Course
**Endpoint:** `POST /courses`  
**Status:** ✅ Implemented  
**Mock Data:** Yes  

**Request Body:**
```json
{
  "courseName": "Advanced Python Programming",
  "description": "Learn advanced Python concepts and best practices",
  "language": "English",
  "price": 149.99,
  "minScore": 70,
  "level": 2,
  "topicIds": [1, 3]
}
```

**Response (201 Created):**
```json
{
  "courseId": 4,
  "courseName": "Advanced Python Programming",
  "description": "Learn advanced Python concepts and best practices",
  "language": "English",
  "price": 149.99,
  "minScore": 70,
  "level": 2,
  "totalLectures": 0,
  "createdAt": "2024-12-04T10:00:00Z",
  "updatedAt": "2024-12-04T10:00:00Z",
  "topics": []
}
```

---

### 2. Get All Courses (with Pagination)
**Endpoint:** `GET /courses?page=1&limit=10`  
**Status:** ✅ Implemented  
**Mock Data:** Yes (3 sample courses)  

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Number of items per page

**Response (200 OK):**
```json
{
  "data": [
    {
      "courseId": 1,
      "courseName": "Advanced TypeScript",
      "description": "Learn advanced TypeScript concepts",
      "language": "English",
      "price": 99.99,
      "minScore": 60,
      "level": 2,
      "totalLectures": 20,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "topics": [],
      "instructors": [],
      "sections": [],
      "enrollments": []
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### 3. Get Course Detail
**Endpoint:** `GET /courses/:id`  
**Status:** ✅ Implemented  
**Mock Data:** Yes  

**Path Parameters:**
- `id` (required) - Course ID

**Response (200 OK):**
```json
{
  "courseId": 1,
  "courseName": "Advanced TypeScript",
  "description": "Learn advanced TypeScript concepts",
  "language": "English",
  "price": 99.99,
  "minScore": 60,
  "level": 2,
  "totalLectures": 20,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "topics": [],
  "instructors": [],
  "sections": [],
  "enrollments": [
    {
      "studentId": 1,
      "courseId": 1,
      "enrollmentDate": "2024-01-15T00:00:00Z",
      "status": 1
    }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Course with ID 999 not found",
  "error": "Not Found"
}
```

---

### 4. Update Course
**Endpoint:** `PUT /courses/:id`  
**Status:** ✅ Implemented  
**Mock Data:** Yes  

**Path Parameters:**
- `id` (required) - Course ID

**Request Body (all fields optional):**
```json
{
  "courseName": "Updated Course Name",
  "description": "Updated description",
  "language": "English",
  "price": 199.99,
  "minScore": 75,
  "level": 2,
  "topicIds": [1, 2, 3]
}
```

**Response (200 OK):**
```json
{
  "courseId": 1,
  "courseName": "Updated Course Name",
  "description": "Updated description",
  "language": "English",
  "price": 199.99,
  "minScore": 75,
  "level": 2,
  "totalLectures": 20,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-12-04T10:30:00Z",
  "topics": []
}
```

---

### 5. Delete Course
**Endpoint:** `DELETE /courses/:id`  
**Status:** ✅ Implemented  
**Mock Data:** Yes  

**Path Parameters:**
- `id` (required) - Course ID

**Response (204 No Content):**
(Empty response body)

**Error Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Course with ID 999 not found",
  "error": "Not Found"
}
```

---

### 6. Get All Topics
**Endpoint:** `GET /courses/topics`  
**Status:** ✅ Implemented  
**Mock Data:** Yes (4 sample topics)  

**Response (200 OK):**
```json
[
  {
    "topicId": 1,
    "topicName": "Web Development",
    "courses": []
  },
  {
    "topicId": 2,
    "topicName": "Frontend",
    "courses": []
  },
  {
    "topicId": 3,
    "topicName": "Backend",
    "courses": []
  },
  {
    "topicId": 4,
    "topicName": "TypeScript",
    "courses": []
  }
]
```

---

### 7. Get Students Enrolled in a Course
**Endpoint:** `GET /courses/:id/students?page=1&limit=10`  
**Status:** ✅ Implemented  
**Mock Data:** Yes (mock enrollments)  

**Path Parameters:**
- `id` (required) - Course ID

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Number of items per page

**Response (200 OK):**
```json
{
  "data": [
    {
      "studentId": 1,
      "fullName": "John Doe",
      "email": "student1@example.com",
      "username": "student1",
      "enrollmentDate": "2024-01-15T00:00:00Z"
    },
    {
      "studentId": 2,
      "fullName": "Jane Smith",
      "email": "student2@example.com",
      "username": "student2",
      "enrollmentDate": "2024-01-16T00:00:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

## User/Student Management Endpoints

### 8. Get All Students (with Pagination)
**Endpoint:** `GET /users/students?page=1&limit=10`  
**Status:** ✅ Implemented  
**Mock Data:** Yes (5 sample students)  

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Number of items per page

**Response (200 OK):**
```json
{
  "data": [
    {
      "studentId": 1,
      "fullName": "John Doe",
      "email": "student1@example.com",
      "username": "student1",
      "enrollmentDate": "2024-01-01T00:00:00Z"
    },
    {
      "studentId": 2,
      "fullName": "Jane Smith",
      "email": "student2@example.com",
      "username": "student2",
      "enrollmentDate": "2024-01-02T00:00:00Z"
    },
    {
      "studentId": 3,
      "fullName": "Bob Johnson",
      "email": "student3@example.com",
      "username": "student3",
      "enrollmentDate": "2024-01-03T00:00:00Z"
    },
    {
      "studentId": 4,
      "fullName": "Alice Williams",
      "email": "student4@example.com",
      "username": "student4",
      "enrollmentDate": "2024-01-04T00:00:00Z"
    },
    {
      "studentId": 5,
      "fullName": "Charlie Brown",
      "email": "student5@example.com",
      "username": "student5",
      "enrollmentDate": "2024-01-05T00:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

## Course Level Enums
- `0` - BEGINNER
- `1` - INTERMEDIATE
- `2` - ADVANCED

## Learning Status Enums
- `0` - NOT_STARTED
- `1` - IN_PROGRESS
- `2` - COMPLETED

---

## MVC Architecture Overview

### Model (Entity Layer)
- **Course.entity.ts** - Represents course entity with relationships
- **Topic.entity.ts** - Represents course topic
- **Enrollment.entity.ts** - Represents student-course relationships
- **Student.entity.ts** - Represents student entity
- **User.entity.ts** - Represents user entity

### View (DTO/Response Layer)
- **CreateCourseDto** - Validates course creation requests
- **UpdateCourseDto** - Validates course update requests
- JSON responses follow consistent format with data, pagination, and error information

### Controller Layer
- **CoursesController** - Handles HTTP requests for course operations
  - `POST /courses` - Create course
  - `GET /courses` - List all courses
  - `GET /courses/:id` - Get course detail
  - `GET /courses/:id/students` - Get enrolled students
  - `PUT /courses/:id` - Update course
  - `DELETE /courses/:id` - Delete course
  - `GET /courses/topics` - Get all topics

- **UsersController** - Handles HTTP requests for user operations
  - `GET /users/students` - List all students

### Service Layer
- **CoursesService** - Business logic for course operations
  - Uses mock data for demonstration
  - Implements full CRUD operations
  - Implements student enrollment retrieval

- **UsersService** - Business logic for user operations
  - Uses mock data for demonstration
  - Implements student listing with pagination

---

## Mock Data Summary

### Mock Courses (3 courses)
1. Advanced TypeScript - $99.99 (Advanced level)
2. React Fundamentals - $79.99 (Beginner level)
3. NestJS Backend Development - $89.99 (Intermediate level)

### Mock Topics (4 topics)
1. Web Development
2. Frontend
3. Backend
4. TypeScript

### Mock Students (5 students)
1. John Doe (student1@example.com)
2. Jane Smith (student2@example.com)
3. Bob Johnson (student3@example.com)
4. Alice Williams (student4@example.com)
5. Charlie Brown (student5@example.com)

### Mock Enrollments
- Student 1 enrolled in Course 1 & 2
- Student 2 enrolled in Course 1
- Student 3 enrolled in Course 3

---

## Notes on Implementation

### Current Status
- ✅ Full CRUD operations for courses implemented with mock data
- ✅ Student listing and enrollment retrieval implemented
- ✅ Pagination support on all list endpoints
- ✅ Error handling with appropriate HTTP status codes
- ✅ Request/response validation with DTOs

### Future Database Integration
When connecting to a real database, simply:
1. Replace mock data storage with actual database queries using TypeORM Repository pattern
2. Keep the same method signatures and return types
3. No changes needed in controllers or DTOs
4. Update to use `findBy`, `findAndCount`, `save`, `remove` repository methods

---
