# System Architecture & Data Flow Diagrams

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client Application                        │
│                      (React Frontend)                           │
└─────────────┬──────────────────────────────────────────────────────┘
              │
              │ HTTP Requests (REST API)
              │
┌─────────────▼──────────────────────────────────────────────────────┐
│                      API Layer (Port 3000)                        │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              NestJS Application                           │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │         HTTP Request Router                         │ │  │
│  │  │  (Express behind NestJS)                            │ │  │
│  │  └────────┬─────────────────────────────────────────────┘ │  │
│  │           │                                               │  │
│  │  ┌────────▼──────────┬────────────────────────────────┐   │  │
│  │  │  Controllers     │                                │   │  │
│  │  │                  │                                │   │  │
│  │  │ ┌──────────────┐ │ ┌──────────────────────────┐  │   │  │
│  │  │ │  Courses     │ │ │  Users                   │  │   │  │
│  │  │ │  Controller  │ │ │  Controller              │  │   │  │
│  │  │ └──────┬───────┘ │ └──────────┬───────────────┘  │   │  │
│  │  │        │         │            │                 │   │  │
│  │  │ [POST, GET, PUT, DELETE]  [GET]                 │   │  │
│  │  │        │         │            │                 │   │  │
│  │  └────────┼─────────┼────────────┼─────────────────┘   │  │
│  │           │         │            │                     │  │
│  │  ┌────────▼─────────▼────────────▼──────────────────┐   │  │
│  │  │      Services Layer                            │   │  │
│  │  │  (Business Logic)                              │   │  │
│  │  │                                                │   │  │
│  │  │  ┌─────────────────┐ ┌──────────────────────┐ │   │  │
│  │  │  │ CoursesService  │ │ UsersService         │ │   │  │
│  │  │  │                 │ │                      │ │   │  │
│  │  │  │ Methods:        │ │ Methods:             │ │   │  │
│  │  │  │ • create()      │ │ • getStudents()      │ │   │  │
│  │  │  │ • findAll()     │ │                      │ │   │  │
│  │  │  │ • findById()    │ └──────────────────────┘ │   │  │
│  │  │  │ • update()      │                         │   │  │
│  │  │  │ • delete()      │                         │   │  │
│  │  │  │ • getTopics()   │                         │   │  │
│  │  │  │ • getStudents   │                         │   │  │
│  │  │  │   ByCourse()    │                         │   │  │
│  │  │  └────────┬────────┘                         │   │  │
│  │  │           │                                  │   │  │
│  │  └───────────┼──────────────────────────────────┘   │  │
│  │              │                                       │  │
│  │  ┌───────────▼──────────────────────────────────┐   │  │
│  │  │     Mock Data Layer                        │   │  │
│  │  │  (In-Memory Data Storage)                  │   │  │
│  │  │                                            │   │  │
│  │  │  • mockCourses[]                           │   │  │
│  │  │  • mockTopics[]                            │   │  │
│  │  │  • mockStudents[]                          │   │  │
│  │  │  • mockEnrollments[]                       │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                    (Future: Database Connection)
                              │
                    ┌─────────▼─────────┐
                    │    PostgreSQL     │
                    │    MySQL          │
                    │    MongoDB        │
                    └───────────────────┘
```

---

## 2. Course Management Data Flow

### Create Course Flow
```
Client                    Controller            Service              Mock Storage
  │                          │                    │                      │
  ├─ POST /courses ─────────>│                    │                      │
  │  {courseData}            │                    │                      │
  │                          ├─ Validate ─────────>│                      │
  │                          │  Input             │                      │
  │                          │<─ Valid ───────────┤                      │
  │                          │                    ├─ Add to Mock ─────>│
  │                          │                    │  mockCourses[]     │
  │                          │                    │                    │
  │<─ 201 Created ───────────┤<─ Return Course ───┤                     │
  │  {newCourse}             │                    │                     │
```

### Get Course Detail Flow
```
Client                    Controller            Service              Mock Storage
  │                          │                    │                      │
  ├─ GET /courses/1 ────────>│                    │                      │
  │                          ├─ Parse ID ────────>│                      │
  │                          │  (id: 1)           ├─ Find in Mock ────>│
  │                          │                    │  mockCourses[]     │
  │                          │                    │  (search by ID)    │
  │                          │                    │<─ Course found ────┤
  │                          │<─ Return Course ───┤                     │
  │<─ 200 OK ────────────────┤                    │                     │
  │  {courseDetail}          │                    │                     │
```

### Update Course Flow
```
Client                    Controller            Service              Mock Storage
  │                          │                    │                      │
  ├─ PUT /courses/1 ────────>│                    │                      │
  │  {updateData}            │                    │                      │
  │                          ├─ Parse ID ────────>│                      │
  │                          │  & Data            ├─ Find Course ────>│
  │                          │                    │  Update fields    │
  │                          │                    │  Set updatedAt    │
  │                          │                    │<─ Updated Course ─┤
  │<─ 200 OK ────────────────┤<─ Return Course ───┤                     │
  │  {updatedCourse}         │                    │                     │
```

### Delete Course Flow
```
Client                    Controller            Service              Mock Storage
  │                          │                    │                      │
  ├─ DELETE /courses/1 ─────>│                    │                      │
  │                          ├─ Parse ID ────────>│                      │
  │                          │                    ├─ Find Course ────>│
  │                          │                    │  Remove from    │
  │                          │                    │  mockCourses[]  │
  │                          │<─ Success ─────────┤                    │
  │<─ 204 No Content ────────┤                    │                     │
  │  {}                      │                    │                     │
```

---

## 3. Pagination Flow

```
Client                    Controller            Service
  │                          │                    │
  ├─ GET /courses?page=2 ───>│                    │
  │  &limit=5                │                    │
  │                          ├─ Parse Query ────>│
  │                          │  page: 2           ├─ Calculate:
  │                          │  limit: 5          │  start = (2-1)*5 = 5
  │                          │                    │  end = 5+5 = 10
  │                          │                    │
  │                          │                    ├─ mockCourses[]
  │                          │                    │  .slice(5, 10)
  │                          │                    │
  │                          │                    ├─ Calculate:
  │                          │                    │  totalPages = 
  │                          │                    │  ceil(total/limit)
  │                          │                    │
  │<─ 200 OK ────────────────┤<─ Return Response ┤
  │  {                       │                    │
  │    data: [...5 items],   │                    │
  │    total: 25,            │                    │
  │    page: 2,              │                    │
  │    limit: 5,             │                    │
  │    totalPages: 5         │                    │
  │  }                       │                    │
```

---

## 4. Course-Student Relationship Flow

```
┌─────────────────────────────────────────────────────┐
│              Course-Student Relationships           │
└─────────────────────────────────────────────────────┘

        Course 1 (Advanced TypeScript)
        └── Enrollment
            ├── Student 1 (John Doe) - enrolled 2024-01-15
            └── Student 2 (Jane Smith) - enrolled 2024-01-16

        Course 2 (React Fundamentals)
        └── Enrollment
            └── Student 1 (John Doe) - enrolled 2024-01-20

        Course 3 (NestJS Backend)
        └── (No enrollments)


GET /courses/1/students Flow:
┌────────────────────────────────────────────────┐
│ 1. Receive request for course 1                │
│ 2. Find course in mockCourses[]                │
│ 3. Find all enrollments where courseId === 1   │
│ 4. Extract studentIds from enrollments         │
│ 5. Find students in mockStudents[]             │
│ 6. Return paginated student list               │
└────────────────────────────────────────────────┘
```

---

## 5. Student Listing Flow

```
Client                    Controller            Service              Mock Storage
  │                          │                    │                      │
  ├─ GET /users/students ───>│                    │                      │
  │  ?page=1&limit=10        │                    │                      │
  │                          ├─ Parse Query ────>│                      │
  │                          │  Params            ├─ Paginate ────────>│
  │                          │                    │  mockStudents[]    │
  │                          │                    │  slice(start, end) │
  │                          │                    │                    │
  │                          │                    ├─ Format Response   │
  │                          │                    │  (map students)    │
  │                          │                    │<─ Return data ─────┤
  │<─ 200 OK ────────────────┤<─ Return Response ┤                     │
  │  {                       │                    │                     │
  │    data: [...students],  │                    │                     │
  │    total: 5,             │                    │                     │
  │    page: 1,              │                    │                     │
  │    limit: 10,            │                    │                     │
  │    totalPages: 1         │                    │                     │
  │  }                       │                    │                     │
```

---

## 6. Error Handling Flow

```
Client                    Controller            Service
  │                          │                    │
  ├─ GET /courses/999 ──────>│                    │
  │                          ├─ Parse ID ────────>│
  │                          │  (id: 999)         │
  │                          │                    ├─ Search in Mock
  │                          │                    │  Course not found
  │                          │                    │
  │                          │                    ├─ throw
  │                          │                    │ NotFoundException
  │                          │<─ Error ───────────┤
  │<─ 404 Not Found ─────────┤                    │
  │  {                       │                    │
  │    statusCode: 404,      │                    │
  │    message: "Course      │                    │
  │              with ID     │                    │
  │              999 not     │                    │
  │              found",     │                    │
  │    error: "Not Found"    │                    │
  │  }                       │                    │
```

---

## 7. Database Integration (Future)

```
Current State (Mock):
┌─────────────────┐
│  Mock Storage   │
│  In Memory      │
└─────────────────┘
        │
        ├─ mockCourses[]
        ├─ mockTopics[]
        ├─ mockStudents[]
        └─ mockEnrollments[]


Future State (Database):
┌─────────────────────────────────────────────────┐
│              TypeORM Repository                 │
│                                                 │
│ this.coursesRepository.findAndCount({...})     │
│ this.studentsRepository.find({...})            │
│ etc...                                          │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────────────┐
        │                             │
   PostgreSQL              MySQL      MongoDB
   (SQL)                   (SQL)      (NoSQL)
```

---

## 8. Request Validation Flow

```
Client Request
    │
    ▼
┌──────────────────────┐
│ NestJS Pipes         │
│ & Middleware         │
└──────┬───────────────┘
       │
       ├─ ParseIntPipe for ID validation
       ├─ Query parameter parsing
       └─ JSON body parsing
           │
           ▼
┌──────────────────────┐
│ DTO Validation       │
│ (class-validator)    │
└──────┬───────────────┘
       │
       ├─ @IsString()
       ├─ @IsNumber()
       ├─ @IsOptional()
       ├─ @IsEnum()
       └─ @IsArray()
           │
           ▼
    ┌──────────────┐
    │ Valid Data   │
    │ to Service   │
    └──────────────┘
           │
           ▼
      Service Logic
```

---

## 9. Response Structure

```
┌─────────────────────────────────────────────┐
│         API Response Format                 │
└─────────────────────────────────────────────┘

Single Item Response:
{
  "courseId": 1,
  "courseName": "Advanced TypeScript",
  "description": "...",
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

List Response:
{
  "data": [
    { ...item1 },
    { ...item2 },
    { ...item3 }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}

Error Response:
{
  "statusCode": 404,
  "message": "Course with ID 999 not found",
  "error": "Not Found"
}
```

---

## 10. Module Dependencies

```
┌────────────────────────────────┐
│      App Module                │
└────────────┬───────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Courses      │  │ Users        │
│ Module       │  │ Module       │
└──────────────┘  └──────────────┘
    │                 │
    ├─ TypeOrmModule  ├─ TypeOrmModule
    │ (Course,        │ (User,
    │  Topic,         │  Student,
    │  etc...)        │  Instructor,
    │                 │  Admin)
    │                 │
    ├─ Controller     ├─ Controller
    │                 │
    └─ Service       └─ Service
```

---

**Diagrams Created:** December 4, 2024
**Purpose:** Visual understanding of system architecture and data flow
