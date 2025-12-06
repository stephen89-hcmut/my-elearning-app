📊 PRISMA DATABASE - VISUAL SCHEMA

═══════════════════════════════════════════════════════════════════════════════

ERD (Entity Relationship Diagram):

                        ┌─────────────────────────────────────┐
                        │            USER                     │
                        ├─────────────────────────────────────┤
                        │ PK userId (int)                     │
                        │    username (varchar)               │
                        │    email (varchar) [unique]         │
                        │    firstName (varchar)              │
                        │    lastName (varchar)               │
                        │    password (varchar)               │
                        │    role (enum: ADMIN|INSTR|STUDENT) │
                        │    bankName (varchar, nullable)     │
                        │    paymentAccount (varchar, null)   │
                        └─────────────────────────────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                    ▼          ▼          ▼
            ┌─────────────┐ ┌──────────────┐ ┌──────────────┐
            │   ADMIN     │ │ INSTRUCTOR   │ │   STUDENT    │
            ├─────────────┤ ├──────────────┤ ├──────────────┤
            │ PK adminId  │ │ PK instrId   │ │ PK studentId │
            │ FK userId   │ │ FK userId    │ │ FK userId    │
            │             │ │ teachingField│ │ enrollDate   │
            │             │ │ bio (text)   │ │              │
            └─────────────┘ └──────────────┘ └──────────────┘
                            │                    │
                            │                    │
                            ▼                    ▼
                      ┌──────────────┐    ┌─────────────────┐
                      │COURSE_INSTR  │    │  ENROLLMENT     │
                      ├──────────────┤    ├─────────────────┤
                      │PK courseId   │    │PK studentId,    │
                      │PK instrId    │    │   courseId      │
                      │mainInstructor│    │enrollmentDate   │
                      └──────────────┘    │completionStatus │
                            │             └─────────────────┘
                            │                    │
                            │                    │
                            │         ┌──────────┴──────────┐
                            │         │                     │
                            │         ▼                     ▼
┌──────────────────┐         │    ┌──────────────┐  ┌────────────────┐
│     TOPIC        │         │    │ CERTIFICATE  │  │  COURSE_RATING │
├──────────────────┤         │    ├──────────────┤  ├────────────────┤
│PK topicId        │         │    │PK certId     │  │PK studentId    │
│  topicName       │         │    │FK studentId  │  │FK courseId     │
│  description     │         │    │FK courseId   │  │rating (1-5)    │
└──────────────────┘         │    │issuedDate    │  │comment         │
        │                    │    └──────────────┘  │ratingDate      │
        │                    │                     └────────────────┘
        ▼                    │
┌──────────────────┐         │
│  COURSE_TOPICS   │         │
├──────────────────┤         │
│PK courseId       │         │
│PK topicId        │         │
└──────────────────┘         │
        │                    │
        ▼                    │
    ┌──────────────────┐     │
    │    COURSE        │◄────┘
    ├──────────────────┤
    │PK courseId       │
    │courseName        │
    │description       │
    │language          │
    │price (decimal)   │
    │minScore          │
    │level (enum)      │
    │totalLectures     │
    │totalTests        │
    │totalDuration     │
    └──────────────────┘
            │
            │
            ▼
    ┌──────────────────┐      ┌────────────────────┐
    │    SECTION       │◄─────┤  PREREQUISITE      │
    ├──────────────────┤      ├────────────────────┤
    │PK sectionId      │      │PK courseId         │
    │FK courseId       │      │PK prerequisiteId   │
    │sectionName       │      │(self-relation)     │
    │sectionOrder      │      └────────────────────┘
    │totalLectures     │
    │totalTests        │
    └──────────────────┘
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
┌──────────────┐  ┌────────────┐
│   LECTURE    │  │    TEST    │
├──────────────┤  ├────────────┤
│PK lectureId  │  │PK testId   │
│FK sectionId  │  │FK sectionId
│lectureName   │  │testName    │
│link (url)    │  │maxAttempts │
│materials     │  │timeLimit   │
│durationMin   │  │testUrl     │
│status        │  │score       │
└──────────────┘  └────────────┘
        │                │
        │                ▼
        │          ┌──────────────┐
        │          │   QUESTION   │
        │          ├──────────────┤
        │          │PK questionId │
        │          │FK testId     │
        │          │content       │
        │          │type (enum)   │
        │          │correctAnswer │
        │          └──────────────┘
        │                │
        │                ▼
        │          ┌────────────────┐
        │          │QUESTION_CHOICE │
        │          ├────────────────┤
        │          │PK choiceId     │
        │          │FK questionId   │
        │          │wrongChoice     │
        │          └────────────────┘
        │
        ▼
   ┌──────────────────┐
   │ LECTURE_VIEW     │
   ├──────────────────┤
   │PK studentId,     │
   │   lectureId      │
   │status (enum)     │
   │viewDate          │
   └──────────────────┘
            │
            │
            ▼
   ┌──────────────────┐
   │  TEST_RESULT     │
   ├──────────────────┤
   │PK resultId       │
   │FK studentId      │
   │FK testId         │
   │actualScore       │
   │startTime         │
   │submitTime        │
   │status (enum)     │
   └──────────────────┘
            │
            │
            ▼
   ┌──────────────────┐
   │  TRANSACTION     │
   ├──────────────────┤
   │PK transactionId  │
   │FK studentId      │
   │FK courseId       │
   │FK instructorId   │
   │price (decimal)   │
   │paymentStatus     │
   │transactionDate   │
   └──────────────────┘

═══════════════════════════════════════════════════════════════════════════════

RELATIONSHIP SUMMARY:

One-to-Many (1→N):
  ✓ User       → Admin, Instructor, Student (inheritance)
  ✓ Course     → Section
  ✓ Section    → Lecture, Test
  ✓ Test       → Question, TestResult
  ✓ Question   → QuestionChoice
  ✓ Lecture    → LectureView

Many-to-Many (N↔N):
  ✓ Course     ↔ Topic          (via CourseTopics)
  ✓ Course     ↔ Instructor     (via CourseInstructor)
  ✓ Student    ↔ Course         (via Enrollment)
  ✓ Student    ↔ Lecture        (via LectureView)

Many-to-One (N→1):
  ✓ TestResult → Student, Test
  ✓ Transaction → Student, Course, Instructor
  ✓ Certificate → Student, Course
  ✓ CourseRating → Student, Course

Self-Relation (Recursive):
  ✓ Course → Prerequisite → Course

═══════════════════════════════════════════════════════════════════════════════

DATA FLOW:

User Registration:
  User → (Student | Instructor | Admin)
      └─ If Student: Student → Enrollment → Course

Learning Journey:
  Student → Enrollment → Course
                └─ Section
                    ├─ Lecture → LectureView (track progress)
                    └─ Test → Question
                         ├─ QuestionChoice
                         └─ TestResult (store score)

Course Completion:
  Student → Enrollment (completionStatus = COMPLETED)
        └─ Certificate (issued)
        └─ CourseRating (review left)

Payment:
  Student → Enrollment → Course → Transaction (payment record)
            └─ Instructor (revenue tracking)

═══════════════════════════════════════════════════════════════════════════════

QUERY PATTERNS:

Get Student Transcript:
  Student ─→ Enrollments ─→ Courses
              │              │
              │              ├─ Sections
              │              │   └─ Tests
              │              │       └─ TestResults
              │              │
              │              └─ CourseRatings
              │
              ├─ Certificates
              └─ Transactions

Get Course Details:
  Course ─→ Topics
       ─→ Instructors
       ─→ Sections ─→ Lectures
                  ─→ Tests ─→ Questions ─→ Choices
       ─→ Enrollments ─→ Students
       ─→ Ratings

Get Instructor Dashboard:
  Instructor ─→ Courses
           ─→ CourseInstructors
           ─→ Transactions
           ─→ Students (via Enrollments)

═══════════════════════════════════════════════════════════════════════════════

20 MODELS OVERVIEW:

Layer 1: Users (4 models)
  └─ User, Admin, Instructor, Student

Layer 2: Courses (5 models)
  └─ Course, Topic, CourseTopics, CourseInstructor, Prerequisite

Layer 3: Content (5 models)
  └─ Section, Lecture, Test, Question, QuestionChoice

Layer 4: Learning (4 models)
  └─ Enrollment, LectureView, TestResult, CourseRating

Layer 5: Transactions (2 models)
  └─ Transaction, Certificate

═══════════════════════════════════════════════════════════════════════════════

KEY FEATURES:

✅ Inheritance Pattern    - User → Admin/Instructor/Student
✅ N-N Relationships      - Courses ↔ Topics, Instructors, Enrollments
✅ Enum Types             - UserRole, CourseLevel, PaymentStatus, etc.
✅ Constraints            - Check constraints, unique constraints
✅ Default Values         - Timestamps, default roles, statuses
✅ Cascading Deletes      - Clean up related records
✅ Calculated Fields      - totalLectures, totalTests, totalDuration
✅ Self-Relations         - Course Prerequisites
✅ Time Tracking          - enrollmentDate, startTime, submitTime, etc.
✅ Financial Data         - prices, payment statuses, revenue

═══════════════════════════════════════════════════════════════════════════════
