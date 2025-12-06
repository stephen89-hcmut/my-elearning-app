# Quick Reference - API Endpoints

## Overview
Complete Course & Student Management API Implementation with Mock Data

---

## 📚 Course Endpoints

### Create Course
```
POST /courses
Content-Type: application/json

{
  "courseName": "Course Name",
  "description": "Description",
  "language": "English",
  "price": 99.99,
  "minScore": 50,
  "level": 1,
  "topicIds": [1, 2, 3]
}

Response: 201 Created
```

### Get All Courses
```
GET /courses?page=1&limit=10

Response: 200 OK
{
  "data": [...],
  "total": number,
  "page": 1,
  "limit": 10,
  "totalPages": number
}
```

### Get Course Detail
```
GET /courses/:id

Response: 200 OK or 404 Not Found
```

### Update Course
```
PUT /courses/:id
Content-Type: application/json

{
  "courseName": "Updated Name",
  "price": 199.99,
  ...
}

Response: 200 OK or 404 Not Found
```

### Delete Course
```
DELETE /courses/:id

Response: 204 No Content or 404 Not Found
```

### Get Course Topics
```
GET /courses/topics

Response: 200 OK
[
  {
    "topicId": 1,
    "topicName": "Web Development",
    "courses": []
  },
  ...
]
```

### Get Students in Course
```
GET /courses/:id/students?page=1&limit=10

Response: 200 OK
{
  "data": [
    {
      "studentId": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "enrollmentDate": "2024-01-15T00:00:00Z"
    },
    ...
  ],
  "total": number,
  "page": 1,
  "limit": 10,
  "totalPages": number
}
```

---

## 👥 User Endpoints

### Get All Students
```
GET /users/students?page=1&limit=10

Response: 200 OK
{
  "data": [
    {
      "studentId": 1,
      "fullName": "John Doe",
      "email": "student1@example.com",
      "username": "student1",
      "enrollmentDate": "2024-01-01T00:00:00Z"
    },
    ...
  ],
  "total": number,
  "page": 1,
  "limit": 10,
  "totalPages": number
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET successful, PUT successful |
| 201 | Created | POST successful |
| 204 | No Content | DELETE successful |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected error |

---

## 🧪 cURL Examples

### Create Course
```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Python 101",
    "description": "Learn Python",
    "language": "English",
    "price": 99.99,
    "minScore": 60,
    "level": 0,
    "topicIds": []
  }'
```

### Get Courses
```bash
curl http://localhost:3000/courses?page=1&limit=10
```

### Get Course Detail
```bash
curl http://localhost:3000/courses/1
```

### Update Course
```bash
curl -X PUT http://localhost:3000/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 149.99,
    "minScore": 70
  }'
```

### Delete Course
```bash
curl -X DELETE http://localhost:3000/courses/1
```

### Get Topics
```bash
curl http://localhost:3000/courses/topics
```

### Get Students in Course
```bash
curl http://localhost:3000/courses/1/students?page=1&limit=5
```

### Get All Students
```bash
curl http://localhost:3000/users/students?page=1&limit=10
```

---

## 🎯 Level Constants
- `0` = BEGINNER
- `1` = INTERMEDIATE
- `2` = ADVANCED

## 📈 Status Constants
- `0` = NOT_STARTED
- `1` = IN_PROGRESS
- `2` = COMPLETED

---

## 🔑 Default Values
- **Page:** 1
- **Limit:** 10
- **Price:** 0
- **Min Score:** 50
- **Level:** 0 (BEGINNER)
- **Total Lectures:** 0

---

## 📝 Files Modified
- `server/src/modules/courses/courses.service.ts` ✅
- `server/src/modules/courses/courses.controller.ts` ✅
- `server/src/modules/users/users.service.ts` ✅
- `server/src/modules/users/users.module.ts` ✅
- `server/src/modules/users/users.controller.ts` ✨ (NEW)

## 📚 Documentation Files
- `API_ENDPOINTS.md` ✨ (NEW)
- `TESTING_GUIDE.md` ✨ (NEW)
- `IMPLEMENTATION_SUMMARY.md` ✨ (NEW)
- `COMPLETION_REPORT.md` ✨ (NEW)
- `ARCHITECTURE_DIAGRAMS.md` ✨ (NEW)

---

## ⚡ Quick Start

1. **Start Server:**
   ```bash
   cd server
   npm run start:dev
   ```

2. **Test Endpoint:**
   ```bash
   curl http://localhost:3000/courses
   ```

3. **View Documentation:**
   - `API_ENDPOINTS.md` - Complete API reference
   - `TESTING_GUIDE.md` - Testing instructions
   - `ARCHITECTURE_DIAGRAMS.md` - System diagrams

---

## 🚀 All Endpoints Summary

| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 1 | POST | /courses | ✅ |
| 2 | GET | /courses | ✅ |
| 3 | GET | /courses/:id | ✅ |
| 4 | PUT | /courses/:id | ✅ |
| 5 | DELETE | /courses/:id | ✅ |
| 6 | GET | /courses/topics | ✅ |
| 7 | GET | /courses/:id/students | ✅ |
| 8 | GET | /users/students | ✅ |

**Total: 8 Endpoints** ✅

---

## 📊 Mock Data Summary

### Courses (3)
1. Advanced TypeScript - $99.99
2. React Fundamentals - $79.99
3. NestJS Backend Development - $89.99

### Students (5)
1. John Doe
2. Jane Smith
3. Bob Johnson
4. Alice Williams
5. Charlie Brown

### Topics (4)
1. Web Development
2. Frontend
3. Backend
4. TypeScript

---

**Version:** 1.0  
**Last Updated:** December 4, 2024  
**Status:** ✅ Complete & Ready
