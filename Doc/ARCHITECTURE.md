# EduCore Architecture Documentation

## 🏛️ System Architecture

EduCore follows a **3-tier architecture** with **MVC pattern**:

```
┌─────────────────────────────────────────────────┐
│               Presentation Layer                 │
│           (React Frontend - View)                │
│  ┌─────────────────────────────────────────────┐ │
│  │ Components  │ Pages  │ Hooks  │ Types      │ │
│  └──────────────┬────────────────────────────┘ │
│                 │                                 │
├─────────────────┼─────────────────────────────┤
│  API Layer (Axios + React Query)                │
│  - Mock Data Handler (Giai Đoạn 1)              │
│  - Real API Handler (Giai Đoạn 2-3)             │
└──────────────┬─────────────────────────────────┘
               │ HTTP/REST
┌──────────────┼─────────────────────────────────┐
│              ▼                                    │
│        Application Layer                         │
│           (NestJS - Controller)                  │
│  ┌──────────────────────────────────────────┐  │
│  │ CoursesController │ AuthController │ ...│  │
│  └──────────┬─────────────────────────┘  │
│             │                              │
├─────────────┼──────────────────────────────┤
│ Business Logic Layer (NestJS - Service)    │
│  ┌──────────────────────────────────────┐  │
│  │ CoursesService │ AuthService │ ...  │  │
│  └──────────┬────────────────────┘  │
│             │                        │
├─────────────┼────────────────────────┤
│ Data Access Layer (TypeORM - Model)  │
│  ┌──────────────────────────────────┐ │
│  │ Course │ User │ Topic │ ...      │ │
│  │       Entities                   │ │
│  └──────────┬──────────────────────┘ │
│             │                        │
└─────────────┼────────────────────────┘
              │ SQL
     ┌────────▼──────────┐
     │   MySQL Database  │
     │   ElearningDB     │
     └───────────────────┘
```

---

## 📊 Three-Phase Development Strategy

### Giai Đoạn 1: Frontend with Mock Data (Current)
```
User → React Components → Mock API Handler → Static Data
       ↓
    Mock Data in JSON
```

**Files:**
- `client/src/mock/courses.ts` - Mock dataset
- `client/src/api/courses.ts` - Mock API functions
- Dashboard displays static data

**Advantages:**
- ✅ Frontend development independent of backend
- ✅ Fast iteration and testing
- ✅ UX/UI can be finalized
- ✅ No network latency

### Giai Đoạn 2: Database & Backend Core
```
Mock API Handler → (Switch to) → Real API Handler
                                  ↓
                           NestJS Endpoints
                                  ↓
                           TypeORM Services
                                  ↓
                           MySQL Database
```

**Implementation:**
1. Run `DATABASE_SETUP.sql` to create tables
2. Services query real database
3. Controllers return real data
4. Frontend switches to real API calls

### Giai Đoạn 3: Advanced Features & Optimization
```
Real API Handler
       ↓
  Services
       ↓
  Stored Procedures ← Database
       ↓
  Complex Queries
  Aggregations
  Reports
```

---

## 🔄 Request/Response Flow

### Current (Mock Data):

```javascript
// User clicks "Get Courses"
User Action
    ↓
React Hook: useQuery(['courses', page])
    ↓
API Layer: getCourses(page, limit)
    ↓
Mock Handler: getCoursesDemo()
    ↓
setTimeout(500ms) // Simulate network
    ↓
Return mockCourses array
    ↓
React Query caches result
    ↓
Component re-renders with data
    ↓
Display in UI
```

### Future (Real API):

```javascript
// User clicks "Get Courses"
User Action
    ↓
React Hook: useQuery(['courses', page])
    ↓
API Layer: getCourses(page, limit)
    ↓
Axios HTTP GET /api/courses?page=1&limit=10
    ↓
Network Request
    ↓
NestJS Controller: @Get('/courses')
    ↓
CoursesService: findAll(page, limit)
    ↓
TypeORM Repository: find()
    ↓
SQL Query to MySQL
    ↓
Database returns records
    ↓
Service maps to DTO
    ↓
Controller returns JSON
    ↓
Axios receives response
    ↓
React Query caches result
    ↓
Component re-renders
    ↓
Display in UI
```

---

## 🗄️ Data Model Relationships

### User Hierarchy (Class Table Inheritance)
```
USERS (Parent)
├── userId (PK)
├── username
├── email
├── role (0=ADMIN, 1=INSTRUCTOR, 2=STUDENT)
└── ...

    ↓ (1:1 relationship based on userId)

STUDENTS (Child)          INSTRUCTORS (Child)        ADMINS (Child)
├── student_id (FK)      ├── instructor_id (FK)     ├── admin_id (FK)
├── enrollment_date      ├── qualification          ├── permissions
└── ...                  ├── hourly_rate            └── ...
                         └── ...
```

### Course Structure
```
COURSES
├── course_id (PK)
├── course_name
├── price
├── level
├── ...

    ↓ (N:N via junction table)
    
COURSE_TOPICS
├── course_id (FK)
├── topic_id (FK)

    ↓
    
TOPICS
├── topic_id (PK)
├── topic_name
└── description

    ↓ (1:N)
    
SECTIONS
├── section_id (PK)
├── course_id (FK)
├── section_name
└── ...

    ↓ (1:N)
    
LECTURES
├── lecture_id (PK)
├── section_id (FK)
├── lecture_name
└── ...

    ↓ (1:N)
    
TESTS
├── test_id (PK)
├── section_id (FK)
└── ...

    ↓ (1:N)
    
QUESTIONS
├── question_id (PK)
├── test_id (FK)
└── correct_answer
```

### Enrollment Flow
```
STUDENTS            COURSES
(student_id)  ----  (course_id)
    ↓  N:N  ↓
    
ENROLLMENTS (junction with status)
├── student_id (FK)
├── course_id (FK)
├── enrollment_date
└── completion_status

    ↓ (Payment related)
    
TRANSACTIONS
├── transaction_id (PK)
├── student_id (FK)
├── course_id (FK)
├── instructor_id (FK)
├── price
└── payment_status
```

---

## 🔐 Entity Relationships (TypeORM)

### User.entity.ts
```typescript
@OneToOne(() => Student)
student: Student;        // If user is student

@OneToOne(() => Instructor)
instructor: Instructor;  // If user is instructor

@OneToOne(() => Admin)
admin: Admin;           // If user is admin
```

### Course.entity.ts
```typescript
@ManyToMany(() => Topic)
@JoinTable({ name: 'COURSE_TOPICS' })
topics: Topic[];        // Multiple topics per course

@OneToMany(() => Section)
sections: Section[];    // Sections of course

@OneToMany(() => CourseInstructor)
instructors: CourseInstructor[];  // Instructors for course

@OneToMany(() => Enrollment)
enrollments: Enrollment[];  // Student enrollments
```

### CourseInstructor.entity.ts (Composite Key)
```typescript
@PrimaryColumn() courseId: number;      // Part of composite key
@PrimaryColumn() instructorId: number;  // Part of composite key

@Column() isMainInstructor: boolean;    // Extra attribute
```

---

## 🔄 State Management Strategy

### Frontend (React Query)

```typescript
// Giai Đoạn 1: Mock Data
const { data, isLoading, error } = useQuery({
  queryKey: ['courses', page, limit],
  queryFn: () => getCourses(page, limit),  // Uses mock
  staleTime: 5 * 60 * 1000,               // 5 min cache
});

// Automatic transitions to real API when endpoint changes
```

**React Query Benefits:**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Error handling
- ✅ Loading states
- ✅ Optimistic updates
- ✅ Retry logic

### Backend (Service Pattern)

```typescript
// CoursesService
@Injectable()
export class CoursesService {
  async findAll(page, limit) {
    // Business logic here
    // Query using TypeORM repository
    // Return formatted data
  }
}

// CoursesController calls service
// Controller handles HTTP concerns (status codes, headers)
// Service handles business logic
```

---

## 🛡️ Data Validation Flow

### Frontend (Client-Side)
```
User Input
    ↓
React Form Component
    ↓
React Hook Form (validation)
    ↓
TypeScript Types check
    ↓
Error display if invalid
    ↓
API call if valid
```

### Backend (Server-Side)
```
HTTP Request
    ↓
DTO Validation (class-validator)
    ↓
Type checking
    ↓
Business logic validation
    ↓
Database constraints
    ↓
Response with proper status code
```

**DTO Example:**
```typescript
export class CreateCourseDto {
  @IsString() @IsNotEmpty()
  courseName: string;

  @IsNumber() @Min(0)
  price: number;

  @IsArray() @IsNumber({}, { each: true })
  topicIds: number[];
}
```

---

## 📡 API Design Patterns

### RESTful Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/courses` | List all (paginated) |
| GET | `/courses/:id` | Get one |
| POST | `/courses` | Create |
| PUT | `/courses/:id` | Update |
| DELETE | `/courses/:id` | Delete |

### Query Parameters
```
GET /courses?page=1&limit=10&topic=IT&level=0&sort=price_asc
    ├── page: Pagination
    ├── limit: Items per page
    ├── topic: Filter
    ├── level: Filter
    └── sort: Sorting
```

### Response Format
```typescript
// Success
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 50,
  "totalPages": 5
}

// Error
{
  "success": false,
  "error": "Invalid input",
  "message": "Price must be > 0"
}
```

---

## 🔑 Authentication & Authorization

### JWT Flow
```
1. User submits login form
   ↓
2. Backend validates credentials
   ↓
3. If valid, generate JWT token
   ↓
4. Return token to frontend
   ↓
5. Frontend stores in localStorage
   ↓
6. Include token in Authorization header
   ↓
Authorization: Bearer <token>
   ↓
7. Backend verifies token
   ↓
8. Allow/deny access based on role
```

### Role-Based Access
```typescript
enum UserRole {
  ADMIN = 0,      // Full access
  INSTRUCTOR = 1, // Course management
  STUDENT = 2     // Enrollment only
}

// JWT payload
{
  "userId": 123,
  "username": "teacher",
  "role": 1,      // INSTRUCTOR
  "iat": 1702123456,
  "exp": 1702209856
}
```

---

## 💾 Database Optimization

### Indexes
```sql
-- Performance optimization
CREATE INDEX idx_course_name ON COURSES(course_name);
CREATE INDEX idx_user_email ON USERS(email);
CREATE INDEX idx_enrollment_student ON ENROLLMENTS(student_id);
```

### Stored Procedures (Giai Đoạn 3)
```sql
PROCEDURE sp_GetMonthlyRevenue(month, year)
PROCEDURE sp_GetCourseStats()
PROCEDURE sp_GetEnrollmentStats(course_id)
```

---

## 🚀 Deployment Strategy

### Frontend Build
```bash
npm run build  // Vite builds to /dist
# Result: Optimized static files
```

### Backend Build
```bash
npm run build  // NestJS compiles TypeScript to /dist
# Result: JavaScript files ready for Node.js
```

### Production Deployment
```
Frontend (Vite build)
    ↓
  CDN / Static hosting
    ↓
  Served to browser

Backend (NestJS)
    ↓
  Docker container / PM2
    ↓
  Reverse proxy (Nginx)
    ↓
  Connected to MySQL
```

---

## 📈 Performance Considerations

### Frontend
- **Code Splitting**: Route-based chunks
- **Caching**: React Query handles API cache
- **Lazy Loading**: Components loaded on demand
- **Optimization**: Image optimization, minification

### Backend
- **Database Queries**: Use proper joins
- **Pagination**: Limit results per request
- **Caching**: Redis for frequently accessed data
- **Async Operations**: Handle long operations asynchronously

### Database
- **Indexes**: On foreign keys and frequently filtered columns
- **Denormalization**: Where necessary for performance
- **Partitioning**: For large tables
- **Connection Pooling**: MySQL connection optimization

---

## 🔍 Monitoring & Logging

### Frontend
```typescript
// Error tracking
console.error('API Error:', error);

// Performance monitoring
console.time('coursesFetch');
// ... operation
console.timeEnd('coursesFetch');
```

### Backend
```typescript
// NestJS logging
this.logger.log('Creating course', createCourseDto);
this.logger.error('Database error', error);
```

---

## 📚 Testing Strategy

### Frontend Unit Tests
```typescript
// Test React components
test('CourseTable renders courses', () => {
  render(<CourseTable courses={mockCourses} />);
  expect(screen.getByText('DB Systems')).toBeInTheDocument();
});
```

### Backend Unit Tests
```typescript
// Test services
describe('CoursesService', () => {
  it('should find all courses', async () => {
    const result = await service.findAll(1, 10);
    expect(result.data).toHaveLength(10);
  });
});
```

### E2E Tests
```typescript
// Test full flow
test('User can create and view course', () => {
  // Login
  // Create course
  // Verify in list
  // Delete course
});
```

---

## 🎯 Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| View | React 18 | Rendering UI |
| State Mgmt | React Query | Server state |
| API Client | Axios | HTTP requests |
| UI Library | Ant Design | Components |
| Backend | NestJS | API server |
| ORM | TypeORM | Database abstraction |
| Database | MySQL | Data persistence |
| Auth | JWT | Authentication |

This architecture ensures:
- ✅ Clear separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Independent frontend/backend development
- ✅ Easy testing
- ✅ Production-ready code

---

**Last Updated**: December 2024
