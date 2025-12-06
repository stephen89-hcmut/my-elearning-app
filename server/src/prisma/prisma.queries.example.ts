// Prisma Query Examples - ELearning Database

// ============================================
// 1. USERS & AUTHENTICATION
// ============================================

// Get user by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: {
    admin: true,
    instructor: true,
    student: true,
  },
});

// Get all instructors
const instructors = await prisma.instructor.findMany({
  include: {
    user: true,
    courseInstructors: {
      include: { course: true },
    },
    transactions: true,
  },
});

// Get student with all enrollments
const student = await prisma.student.findUnique({
  where: { studentId: 6 },
  include: {
    user: true,
    enrollments: {
      include: { course: true },
    },
    testResults: {
      include: { test: true },
    },
    courseRatings: true,
    certificates: true,
  },
});

// ============================================
// 2. COURSES
// ============================================

// Get course with all details
const course = await prisma.course.findUnique({
  where: { courseId: 1 },
  include: {
    courseTopics: {
      include: { topic: true },
    },
    courseInstructors: {
      include: { instructor: { include: { user: true } } },
    },
    sections: {
      include: {
        lectures: true,
        tests: { include: { questions: true } },
      },
    },
    enrollments: true,
    courseRatings: true,
  },
});

// Get all courses with instructors
const courses = await prisma.course.findMany({
  include: {
    courseTopics: { include: { topic: true } },
    courseInstructors: {
      include: { instructor: { include: { user: true } } },
    },
    _count: {
      select: { enrollments: true },
    },
  },
});

// Get courses by topic
const topicCourses = await prisma.courseTopics.findMany({
  where: { topicId: 1 },
  include: {
    course: {
      include: {
        courseInstructors: {
          include: { instructor: { include: { user: true } } },
        },
      },
    },
  },
});

// ============================================
// 3. ENROLLMENTS & TRANSACTIONS
// ============================================

// Get student enrollments
const enrollments = await prisma.enrollment.findMany({
  where: { studentId: 6 },
  include: {
    course: {
      include: {
        courseInstructors: {
          include: { instructor: { include: { user: true } } },
        },
      },
    },
  },
});

// Get students enrolled in a course
const courseStudents = await prisma.enrollment.findMany({
  where: { courseId: 1 },
  include: {
    student: {
      include: { user: true },
    },
  },
});

// Get all transactions for a student
const studentTransactions = await prisma.transaction.findMany({
  where: { studentId: 6 },
  include: {
    course: true,
    instructor: { include: { user: true } },
    student: { include: { user: true } },
  },
  orderBy: { transactionDate: 'desc' },
});

// Get instructor revenue
const instructorRevenue = await prisma.transaction.aggregate({
  where: {
    instructorId: 2,
    paymentStatus: 'COMPLETED',
  },
  _sum: { price: true },
  _count: true,
});

// ============================================
// 4. TESTS & RESULTS
// ============================================

// Get test with all questions
const test = await prisma.test.findUnique({
  where: { testId: 1 },
  include: {
    questions: {
      include: { questionChoices: true },
    },
    testResults: true,
  },
});

// Get student test results
const testResults = await prisma.testResult.findMany({
  where: { studentId: 6 },
  include: {
    test: {
      include: { section: { include: { course: true } } },
    },
  },
  orderBy: { startTime: 'desc' },
});

// Get test result with details
const testResult = await prisma.testResult.findUnique({
  where: { resultId: 1 },
  include: {
    test: {
      include: { questions: true },
    },
    student: { include: { user: true } },
  },
});

// Get student's best test score for a test
const bestScore = await prisma.testResult.findMany({
  where: {
    studentId: 6,
    testId: 1,
  },
  orderBy: { actualScore: 'desc' },
  take: 1,
});

// ============================================
// 5. LECTURES & VIEWS
// ============================================

// Get section with all lectures
const section = await prisma.section.findUnique({
  where: { sectionId: 1 },
  include: {
    course: true,
    lectures: true,
    tests: true,
  },
});

// Get student's lecture views
const lectureViews = await prisma.lectureView.findMany({
  where: { studentId: 6 },
  include: {
    lecture: {
      include: { section: { include: { course: true } } },
    },
  },
});

// Get lecture view progress
const lectureProgress = await prisma.lectureView.findMany({
  where: { lectureId: 1 },
  include: {
    student: { include: { user: true } },
  },
});

// ============================================
// 6. RATINGS & CERTIFICATES
// ============================================

// Get course ratings
const ratings = await prisma.courseRating.findMany({
  where: { courseId: 1 },
  include: {
    student: { include: { user: true } },
  },
  orderBy: { ratingDate: 'desc' },
});

// Get average rating for a course
const avgRating = await prisma.courseRating.aggregate({
  where: { courseId: 1 },
  _avg: { rating: true },
  _count: true,
});

// Get student certificates
const certificates = await prisma.certificate.findMany({
  where: { studentId: 6 },
  include: {
    course: true,
  },
});

// ============================================
// 7. AGGREGATIONS & STATISTICS
// ============================================

// Total enrolled students per course
const courseStats = await prisma.enrollment.groupBy({
  by: ['courseId'],
  _count: { studentId: true },
  orderBy: { _count: { studentId: 'desc' } },
});

// Revenue by course
const courseRevenue = await prisma.transaction.groupBy({
  by: ['courseId'],
  where: { paymentStatus: 'COMPLETED' },
  _sum: { price: true },
  _count: true,
  orderBy: { _sum: { price: 'desc' } },
});

// Instructor performance
const instructorStats = await prisma.courseInstructor.findMany({
  where: { isMainInstructor: true },
  include: {
    instructor: {
      include: {
        user: true,
        _count: {
          select: { transactions: true },
        },
      },
    },
    course: {
      include: {
        _count: { select: { enrollments: true } },
      },
    },
  },
});

// ============================================
// 8. MUTATIONS (CREATE, UPDATE, DELETE)
// ============================================

// Create new user
const newUser = await prisma.user.create({
  data: {
    username: 'newstudent',
    email: 'student@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: hashedPassword,
    role: 'STUDENT',
  },
});

// Create student and link to user
const newStudent = await prisma.student.create({
  data: {
    studentId: newUser.userId,
    enrollmentDate: new Date(),
  },
});

// Enroll student in course
const enrollment = await prisma.enrollment.create({
  data: {
    studentId: 6,
    courseId: 1,
    enrollmentDate: new Date(),
    completionStatus: 'INPROGRESS',
  },
});

// Create test result
const result = await prisma.testResult.create({
  data: {
    studentId: 6,
    testId: 1,
    actualScore: 8.5,
    startTime: new Date(),
    status: 'COMPLETED',
  },
});

// Update course price
const updatedCourse = await prisma.course.update({
  where: { courseId: 1 },
  data: {
    price: 750000.0,
  },
});

// Complete enrollment
const completedEnrollment = await prisma.enrollment.update({
  where: {
    studentId_courseId: {
      studentId: 6,
      courseId: 1,
    },
  },
  data: {
    completionStatus: 'COMPLETED',
  },
});

// Create certificate
const certificate = await prisma.certificate.create({
  data: {
    studentId: 6,
    courseId: 1,
    issuedDate: new Date(),
  },
});

// Add course rating
const rating = await prisma.courseRating.create({
  data: {
    studentId: 6,
    courseId: 1,
    rating: 5,
    comment: 'Excellent course!',
  },
});

// ============================================
// 9. FILTERING & PAGINATION
// ============================================

// Get completed courses for a student
const completedCourses = await prisma.enrollment.findMany({
  where: {
    studentId: 6,
    completionStatus: 'COMPLETED',
  },
  include: { course: true },
});

// Get pending transactions
const pendingTransactions = await prisma.transaction.findMany({
  where: { paymentStatus: 'PENDING' },
  include: {
    student: { include: { user: true } },
    course: true,
    instructor: { include: { user: true } },
  },
  orderBy: { transactionDate: 'asc' },
});

// Pagination example
const page = 1;
const pageSize = 10;
const students = await prisma.student.findMany({
  include: { user: true },
  skip: (page - 1) * pageSize,
  take: pageSize,
});

// Get high-rated courses
const topRatedCourses = await prisma.courseRating.groupBy({
  by: ['courseId'],
  where: { rating: { gte: 4 } },
  _avg: { rating: true },
  _count: true,
  orderBy: { _avg: { rating: 'desc' } },
  take: 5,
});

// ============================================
// 10. COMPLEX QUERIES
// ============================================

// Get student transcript
async function getStudentTranscript(studentId: number) {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          sections: {
            include: {
              tests: {
                include: {
                  testResults: {
                    where: { studentId },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return enrollments.map((enrollment) => ({
    course: enrollment.course.courseName,
    enrollmentDate: enrollment.enrollmentDate,
    status: enrollment.completionStatus,
    testScores: enrollment.course.sections.flatMap((section) =>
      section.tests.flatMap((test) =>
        test.testResults.map((result) => ({
          testName: test.testName,
          score: result.actualScore,
          date: result.submitTime,
        }))
      )
    ),
  }));
}

// Get courses a student is eligible to enroll
async function getEligibleCourses(studentId: number) {
  const student = await prisma.student.findUnique({
    where: { studentId },
    include: {
      enrollments: { select: { courseId: true } },
    },
  });

  // Get all prerequisites the student has completed
  const completedPrerequisites = await prisma.enrollment.findMany({
    where: {
      studentId,
      completionStatus: 'COMPLETED',
    },
    select: { courseId: true },
  });

  const completedCourseIds = completedPrerequisites.map((e) => e.courseId);
  const enrolledCourseIds = student.enrollments.map((e) => e.courseId);

  // Find courses that don't have unmet prerequisites
  const eligibleCourses = await prisma.course.findMany({
    where: {
      courseId: {
        notIn: enrolledCourseIds,
      },
    },
    include: {
      prerequisiteOf: true,
      courseInstructors: {
        include: { instructor: { include: { user: true } } },
      },
      courseTopics: { include: { topic: true } },
    },
  });

  return eligibleCourses.filter((course) => {
    const unmetPrerequisites = course.prerequisiteOf.filter(
      (p) => !completedCourseIds.includes(p.prerequisiteCourseId)
    );
    return unmetPrerequisites.length === 0;
  });
}
