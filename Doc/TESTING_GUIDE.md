# Testing Guide - API Endpoints

## Quick Start Testing

### Start the Server
```bash
cd server
npm install  # if not already done
npm run start:dev
```

The API will be available at `http://localhost:3000`

---

## cURL Testing Examples

### 1. Create a New Course
```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Python for Data Science",
    "description": "Learn Python programming for data analysis",
    "language": "English",
    "price": 119.99,
    "minScore": 65,
    "level": 1,
    "topicIds": [1, 3]
  }'
```

**Expected Response:** 201 Created with course data

---

### 2. Get All Courses with Pagination
```bash
# First page with 10 items
curl http://localhost:3000/courses?page=1&limit=10

# Second page with 5 items
curl http://localhost:3000/courses?page=2&limit=5
```

**Expected Response:** 200 OK with paginated course list

---

### 3. Get Course Details
```bash
curl http://localhost:3000/courses/1
```

**Expected Response:** 200 OK with course detail

---

### 4. Update a Course
```bash
curl -X PUT http://localhost:3000/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Advanced TypeScript 2024",
    "price": 129.99,
    "minScore": 70
  }'
```

**Expected Response:** 200 OK with updated course data

---

### 5. Get Students Enrolled in a Course
```bash
# Get students in course 1
curl http://localhost:3000/courses/1/students?page=1&limit=10
```

**Expected Response:** 200 OK with enrolled students list

**Sample Response:**
```json
{
  "data": [
    {
      "studentId": 1,
      "fullName": "John Doe",
      "email": "student1@example.com",
      "username": "student1",
      "enrollmentDate": "2024-01-15T00:00:00.000Z"
    },
    {
      "studentId": 2,
      "fullName": "Jane Smith",
      "email": "student2@example.com",
      "username": "student2",
      "enrollmentDate": "2024-01-16T00:00:00.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### 6. Get All Topics
```bash
curl http://localhost:3000/courses/topics
```

**Expected Response:** 200 OK with all topics

---

### 7. Delete a Course
```bash
curl -X DELETE http://localhost:3000/courses/1
```

**Expected Response:** 204 No Content

---

### 8. Get All Students
```bash
# First page with 5 items
curl http://localhost:3000/users/students?page=1&limit=5

# Second page
curl http://localhost:3000/users/students?page=2&limit=5
```

**Expected Response:** 200 OK with paginated students list

**Sample Response:**
```json
{
  "data": [
    {
      "studentId": 1,
      "fullName": "John Doe",
      "email": "student1@example.com",
      "username": "student1",
      "enrollmentDate": "2024-01-01T00:00:00.000Z"
    },
    {
      "studentId": 2,
      "fullName": "Jane Smith",
      "email": "student2@example.com",
      "username": "student2",
      "enrollmentDate": "2024-01-02T00:00:00.000Z"
    },
    {
      "studentId": 3,
      "fullName": "Bob Johnson",
      "email": "student3@example.com",
      "username": "student3",
      "enrollmentDate": "2024-01-03T00:00:00.000Z"
    },
    {
      "studentId": 4,
      "fullName": "Alice Williams",
      "email": "student4@example.com",
      "username": "student4",
      "enrollmentDate": "2024-01-04T00:00:00.000Z"
    },
    {
      "studentId": 5,
      "fullName": "Charlie Brown",
      "email": "student5@example.com",
      "username": "student5",
      "enrollmentDate": "2024-01-05T00:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 5,
  "totalPages": 1
}
```

---

## Postman Collection

### Import into Postman

You can create a new Postman collection with these requests:

**Base URL:** `http://localhost:3000`

#### Collection Structure:
```
E-Learning API
├── Courses
│   ├── Create Course (POST)
│   ├── Get All Courses (GET)
│   ├── Get Course Details (GET)
│   ├── Update Course (PUT)
│   ├── Delete Course (DELETE)
│   ├── Get Course Topics (GET)
│   └── Get Students in Course (GET)
└── Students
    └── Get All Students (GET)
```

---

## Testing Scenarios

### Scenario 1: Complete Course CRUD Flow
1. **Create** a new course
2. **Read** all courses (verify it's in the list)
3. **Read** specific course (get details)
4. **Update** course information
5. **Delete** the course

### Scenario 2: Student Management Flow
1. **Get** all students
2. **Get** students in course 1
3. **Get** students in course 2 (different set)

### Scenario 3: Pagination Testing
1. Get courses with `page=1&limit=2`
2. Get courses with `page=2&limit=2`
3. Verify totalPages calculation

---

## Error Scenarios to Test

### 1. Course Not Found (404)
```bash
curl http://localhost:3000/courses/999
```

Expected Response:
```json
{
  "statusCode": 404,
  "message": "Course with ID 999 not found",
  "error": "Not Found"
}
```

### 2. Invalid Pagination Parameters
```bash
# These should still work with defaults
curl http://localhost:3000/courses?page=0&limit=0
curl http://localhost:3000/courses?page=-1&limit=-5
```

### 3. Delete Non-existent Course
```bash
curl -X DELETE http://localhost:3000/courses/999
```

Expected Response: 404 Not Found

---

## Mock Data Reference

### Available Courses (IDs)
- Course ID 1: Advanced TypeScript
- Course ID 2: React Fundamentals  
- Course ID 3: NestJS Backend Development

### Available Students (IDs)
- Student ID 1: John Doe
- Student ID 2: Jane Smith
- Student ID 3: Bob Johnson
- Student ID 4: Alice Williams
- Student ID 5: Charlie Brown

### Available Topics (IDs)
- Topic ID 1: Web Development
- Topic ID 2: Frontend
- Topic ID 3: Backend
- Topic ID 4: TypeScript

### Enrollment Relationships
- Course 1: Students 1, 2
- Course 2: Student 1
- Course 3: No students yet

---

## Notes

- All responses follow a consistent JSON structure
- Pagination defaults: page=1, limit=10
- Mock data is stored in memory (resets on server restart)
- No database operations are performed yet
- All error responses include statusCode, message, and error type

---

**Last Updated:** December 4, 2024
