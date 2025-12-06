# 🔌 API Documentation

Complete reference for all API endpoints in the EduCore E-Learning Dashboard.

## 📋 API Overview

- **Base URL**: `http://localhost:3001/api` (development)
- **Protocol**: HTTP/HTTPS (REST)
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token

---

## 🔐 Authentication

### Supported Authentication Methods

1. **JWT Bearer Token** (Recommended)
   - Get token from login endpoint
   - Include in every request: `Authorization: Bearer <token>`

2. **Local Storage** (Frontend)
   - Frontend stores user in localStorage after login
   - Credentials: sManager / password123

### Login

**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "username": "sManager",
  "password": "password123"
}
```

**Response** (Success - 200):
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "1",
    "username": "sManager",
    "email": "manager@educore.vn",
    "role": "admin"
  }
}
```

**Response** (Error - 401):
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

### Available Demo Accounts

```
Username: sManager
Password: password123
Role: admin

Username: instructor
Password: password123
Role: instructor

Username: student
Password: password123
Role: student
```

---

## 📚 Courses Endpoints

### Get All Courses

**Endpoint**: `GET /courses`

**Query Parameters**:
- `skip` (optional): Number of records to skip (default: 0)
- `take` (optional): Number of records to take (default: 10)
- `topic` (optional): Filter by topic ID
- `level` (optional): Filter by level

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "data": [
    {
      "courseId": 1,
      "courseName": "Advanced Web Development",
      "description": "Learn modern web development...",
      "language": "English",
      "price": 99.99,
      "level": "advanced",
      "minScore": 70,
      "totalLectures": 20,
      "instructor": {
        "instructorId": "2",
        "firstName": "Giảng",
        "lastName": "Viên"
      },
      "topics": [
        {
          "topicId": 1,
          "topicName": "Web Development"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 8,
  "page": 1,
  "pageSize": 10
}
```

### Get Course by ID

**Endpoint**: `GET /courses/:id`

**Response** (200):
```json
{
  "courseId": 1,
  "courseName": "Advanced Web Development",
  "description": "Learn modern web development...",
  "language": "English",
  "price": 99.99,
  "level": "advanced",
  "minScore": 70,
  "totalLectures": 20,
  "instructor": { /* ... */ },
  "topics": [ /* ... */ ],
  "sections": [
    {
      "sectionId": 1,
      "sectionName": "Section 1",
      "lectures": [ /* ... */ ]
    }
  ]
}
```

### Create Course

**Endpoint**: `POST /courses`

**Request**:
```json
{
  "courseName": "New Course",
  "description": "Course description",
  "language": "English",
  "price": 49.99,
  "level": "beginner",
  "minScore": 60,
  "instructorId": "2",
  "topicIds": [1, 2, 3]
}
```

**Response** (201):
```json
{
  "courseId": 9,
  "courseName": "New Course",
  "description": "Course description",
  /* ... rest of course data */
}
```

### Update Course

**Endpoint**: `PUT /courses/:id`

**Request**:
```json
{
  "courseName": "Updated Course Name",
  "price": 59.99,
  "level": "intermediate"
}
```

**Response** (200):
```json
{
  "courseId": 1,
  "courseName": "Updated Course Name",
  /* ... updated course data */
}
```

### Delete Course

**Endpoint**: `DELETE /courses/:id`

**Response** (200):
```json
{
  "message": "Course deleted successfully",
  "courseId": 1
}
```

---

## 👥 Users Endpoints

### Get All Students

**Endpoint**: `GET /users/students`

**Query Parameters**:
- `skip` (optional): Number of records to skip
- `take` (optional): Number of records to take
- `status` (optional): Filter by status (active/inactive)

**Response** (200):
```json
{
  "data": [
    {
      "studentId": "5",
      "firstName": "Sinh",
      "lastName": "Viên",
      "email": "student@educore.vn",
      "status": "active",
      "enrollmentDate": "2024-01-01T00:00:00Z",
      "enrollments": 3,
      "courses": [ /* ... */ ]
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 10
}
```

### Get All Instructors

**Endpoint**: `GET /users/instructors`

**Query Parameters**:
- `skip` (optional): Number of records to skip
- `take` (optional): Number of records to take

**Response** (200):
```json
{
  "data": [
    {
      "instructorId": "2",
      "firstName": "Giảng",
      "lastName": "Viên",
      "email": "instructor@educore.vn",
      "rating": 4.8,
      "courses": 3,
      "bankAccount": "1234567890",
      "bankName": "Vietcombank"
    }
  ],
  "total": 4,
  "page": 1,
  "pageSize": 10
}
```

### Get User by ID

**Endpoint**: `GET /users/:id`

**Response** (200):
```json
{
  "id": "2",
  "username": "instructor",
  "email": "instructor@educore.vn",
  "firstName": "Giảng",
  "lastName": "Viên",
  "role": "instructor",
  "avatar": "GV",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Create User

**Endpoint**: `POST /users`

**Request**:
```json
{
  "username": "newuser",
  "email": "newuser@educore.vn",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "role": "student"
}
```

**Response** (201):
```json
{
  "id": "11",
  "username": "newuser",
  "email": "newuser@educore.vn",
  "firstName": "New",
  "lastName": "User",
  "role": "student"
}
```

### Update User

**Endpoint**: `PUT /users/:id`

**Request**:
```json
{
  "email": "newemail@educore.vn",
  "firstName": "Updated"
}
```

**Response** (200):
```json
{
  "id": "11",
  "username": "newuser",
  "email": "newemail@educore.vn",
  "firstName": "Updated",
  "lastName": "User"
}
```

---

## 📊 Reports Endpoints

### Get Dashboard Statistics

**Endpoint**: `GET /reports/statistics`

**Response** (200):
```json
{
  "totalCourses": 8,
  "totalStudents": 10,
  "totalInstructors": 4,
  "totalRevenue": 4799.92,
  "activeEnrollments": 25
}
```

### Get Monthly Revenue

**Endpoint**: `GET /reports/revenue`

**Query Parameters**:
- `month` (optional): Month number (1-12)
- `year` (optional): Year

**Response** (200):
```json
{
  "data": [
    {
      "month": "January",
      "revenue": 599.99,
      "courses": 3
    },
    {
      "month": "February",
      "revenue": 849.95,
      "courses": 2
    }
  ],
  "total": 4799.92
}
```

### Get Course Statistics

**Endpoint**: `GET /reports/courses/stats`

**Response** (200):
```json
{
  "totalCourses": 8,
  "averagePrice": 599.99,
  "coursesByLevel": {
    "beginner": 2,
    "intermediate": 3,
    "advanced": 3
  },
  "coursesByTopic": {
    "Web Development": 4,
    "Frontend": 2,
    "Backend": 2
  }
}
```

---

## 🔍 Topics Endpoints

### Get All Topics

**Endpoint**: `GET /topics`

**Response** (200):
```json
{
  "data": [
    {
      "topicId": 1,
      "topicName": "Web Development",
      "courseCount": 4
    },
    {
      "topicId": 2,
      "topicName": "Frontend",
      "courseCount": 2
    }
  ],
  "total": 6
}
```

### Create Topic

**Endpoint**: `POST /topics`

**Request**:
```json
{
  "topicName": "Mobile Development"
}
```

**Response** (201):
```json
{
  "topicId": 7,
  "topicName": "Mobile Development"
}
```

---

## ⚠️ Error Responses

All errors follow this format:

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "courseName",
      "message": "Course name is required"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or missing token"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "You don't have permission to access this resource"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Course not found",
  "error": "Resource does not exist"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## 📝 Request/Response Examples

### Example: Create and Get Course

**Step 1: Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sManager","password":"password123"}'
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "user": { /* ... */ }
}
```

**Step 2: Create Course**
```bash
curl -X POST http://localhost:3001/api/courses \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "React Mastery",
    "description": "Master React framework",
    "language": "English",
    "price": 79.99,
    "level": "advanced",
    "minScore": 75
  }'
```

**Step 3: Get Course**
```bash
curl -X GET http://localhost:3001/api/courses/9 \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 🔄 Pagination

All list endpoints support pagination:

```
GET /courses?skip=0&take=10
```

Response includes:
```json
{
  "data": [ /* results */ ],
  "total": 8,
  "page": 1,
  "pageSize": 10
}
```

---

## 🆘 API Troubleshooting

### Issue: 401 Unauthorized

**Cause**: Missing or invalid token

**Solution**:
1. Call login endpoint again
2. Copy token from response
3. Include in Authorization header

### Issue: 404 Not Found

**Cause**: Resource doesn't exist

**Solution**:
1. Verify resource ID is correct
2. Check if resource was deleted
3. See all resources with GET endpoint

### Issue: 500 Internal Server Error

**Cause**: Server error

**Solution**:
1. Check server logs in terminal
2. Verify request format is correct
3. Ensure database is running

---

## 📚 Frontend Integration

### Using Fetch API

```typescript
const response = await fetch('http://localhost:3001/api/courses', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

### Using Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

const response = await api.get('/courses');
```

### Using React Query

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['courses'],
  queryFn: async () => {
    const response = await fetch('/api/courses', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
});
```

---

## 🔗 Related Documentation

- **Setup**: See `doc/SETUP.md`
- **Running**: See `doc/RUNNING.md`
- **Configuration**: See `doc/CONFIGURATION.md`
- **Architecture**: See `doc/ARCHITECTURE.md`

---

**Last Updated**: December 2025
**Version**: 1.0
**API Version**: v1
