import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seeding...');

    // ============================================
    // 1. CREATE USERS
    // ============================================
    console.log('Creating users...');

    const hashedPassword = await bcrypt.hash('password123', 12);

    const admin = await prisma.user.create({
      data: {
        userId: 1,
        username: 'admin_hcmut',
        email: 'admin@hcmut.edu.vn',
        firstName: 'Quan',
        lastName: 'Tri Vien',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    const instructors = await Promise.all([
      prisma.user.create({
        data: {
          userId: 2,
          username: 'gv_thanh',
          email: 'thanh.nguyen@hcmut.edu.vn',
          firstName: 'Thanh',
          lastName: 'Nguyen Van',
          password: hashedPassword,
          role: 'INSTRUCTOR',
          bankName: 'Vietcombank',
          paymentAccount: '0071000123456',
        },
      }),
      prisma.user.create({
        data: {
          userId: 3,
          username: 'gv_huong',
          email: 'huong.le@hcmut.edu.vn',
          firstName: 'Huong',
          lastName: 'Le Thi',
          password: hashedPassword,
          role: 'INSTRUCTOR',
          bankName: 'TPBank',
          paymentAccount: '000111222333',
        },
      }),
      prisma.user.create({
        data: {
          userId: 4,
          username: 'gv_tung',
          email: 'tung.hoang@hcmut.edu.vn',
          firstName: 'Tung',
          lastName: 'Hoang Viet',
          password: hashedPassword,
          role: 'INSTRUCTOR',
          bankName: 'Techcombank',
          paymentAccount: '190333444555',
        },
      }),
      prisma.user.create({
        data: {
          userId: 5,
          username: 'gv_minh',
          email: 'minh.pham@hcmut.edu.vn',
          firstName: 'Minh',
          lastName: 'Pham Nhat',
          password: hashedPassword,
          role: 'INSTRUCTOR',
          bankName: 'MBBank',
          paymentAccount: '999988887777',
        },
      }),
    ]);

    const students = await Promise.all([
      prisma.user.create({
        data: {
          userId: 6,
          username: 'sv_an',
          email: 'an.nguyen123@hcmut.edu.vn',
          firstName: 'An',
          lastName: 'Nguyen Van',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '0909123456',
        },
      }),
      prisma.user.create({
        data: {
          userId: 7,
          username: 'sv_binh',
          email: 'binh.tran@hcmut.edu.vn',
          firstName: 'Binh',
          lastName: 'Tran Thi',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '0987654321',
        },
      }),
      prisma.user.create({
        data: {
          userId: 8,
          username: 'sv_cuong',
          email: 'cuong.le@gmail.com',
          firstName: 'Cuong',
          lastName: 'Le Quoc',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '0918123123',
        },
      }),
      prisma.user.create({
        data: {
          userId: 9,
          username: 'sv_dung',
          email: 'dung.pham@hcmut.edu.vn',
          firstName: 'Dung',
          lastName: 'Pham Tien',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '1010101010',
        },
      }),
      prisma.user.create({
        data: {
          userId: 10,
          username: 'sv_giang',
          email: 'giang.ho@gmail.com',
          firstName: 'Giang',
          lastName: 'Ho Huong',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '220012341234',
        },
      }),
      prisma.user.create({
        data: {
          userId: 11,
          username: 'sv_hai',
          email: 'hai.vo@hcmut.edu.vn',
          firstName: 'Hai',
          lastName: 'Vo Thanh',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '370012341234',
        },
      }),
      prisma.user.create({
        data: {
          userId: 12,
          username: 'sv_khanh',
          email: 'khanh.do@hcmut.edu.vn',
          firstName: 'Khanh',
          lastName: 'Do Duy',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '1010109999',
        },
      }),
      prisma.user.create({
        data: {
          userId: 13,
          username: 'sv_lan',
          email: 'lan.nguyen@gmail.com',
          firstName: 'Lan',
          lastName: 'Nguyen Ngoc',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '601100001111',
        },
      }),
      prisma.user.create({
        data: {
          userId: 14,
          username: 'sv_minh',
          email: 'minh.vu@hcmut.edu.vn',
          firstName: 'Minh',
          lastName: 'Vu Duc',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '411122223333',
        },
      }),
      prisma.user.create({
        data: {
          userId: 15,
          username: 'sv_nam',
          email: 'nam.buu@hcmut.edu.vn',
          firstName: 'Nam',
          lastName: 'Buu Hoang',
          password: hashedPassword,
          role: 'STUDENT',
          paymentAccount: '0908777666',
        },
      }),
    ]);

    // ============================================
    // 2. CREATE ADMIN
    // ============================================
    await prisma.admin.create({
      data: {
        adminId: 1,
      },
    });

    // ============================================
    // 3. CREATE INSTRUCTORS
    // ============================================
    console.log('Creating instructors...');

    await Promise.all([
      prisma.instructor.create({
        data: {
          instructorId: 2,
          teachingField: 'Khoa Hoc May Tinh & AI',
          bio: 'Tien si KHMT tu Phap, 10 nam kinh nghiem giang day Machine Learning.',
        },
      }),
      prisma.instructor.create({
        data: {
          instructorId: 3,
          teachingField: 'Cong Nghe Phan Mem',
          bio: 'Chuyen gia Fullstack Developer, tung lam viec tai FPT Software.',
        },
      }),
      prisma.instructor.create({
        data: {
          instructorId: 4,
          teachingField: 'He Thong Thong Tin',
          bio: 'Nghien cuu ve Big Data va Data Mining tai Vien CNTT.',
        },
      }),
      prisma.instructor.create({
        data: {
          instructorId: 5,
          teachingField: 'Mang May Tinh & An Ninh Mang',
          bio: 'Chung chi CISSP, CEH. Chuyen gia bao mat he thong.',
        },
      }),
    ]);

    // ============================================
    // 4. CREATE STUDENTS
    // ============================================
    console.log('Creating students...');

    await Promise.all([
      prisma.student.create({
        data: {
          studentId: 6,
          enrollmentDate: new Date('2023-09-05'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 7,
          enrollmentDate: new Date('2023-09-05'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 8,
          enrollmentDate: new Date('2023-09-10'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 9,
          enrollmentDate: new Date('2023-09-12'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 10,
          enrollmentDate: new Date('2023-10-01'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 11,
          enrollmentDate: new Date('2023-10-05'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 12,
          enrollmentDate: new Date('2023-10-15'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 13,
          enrollmentDate: new Date('2023-11-01'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 14,
          enrollmentDate: new Date('2023-11-05'),
        },
      }),
      prisma.student.create({
        data: {
          studentId: 15,
          enrollmentDate: new Date('2023-11-10'),
        },
      }),
    ]);

    // ============================================
    // 5. CREATE TOPICS
    // ============================================
    console.log('Creating topics...');

    const topics = await Promise.all([
      prisma.topic.create({
        data: {
          topicId: 1,
          topicName: 'Lap Trinh Co Ban',
          description:
            'Nen tang lap trinh C/C++, Python cho nguoi moi bat dau',
        },
      }),
      prisma.topic.create({
        data: {
          topicId: 2,
          topicName: 'Phat Trien Web',
          description: 'Frontend, Backend, ReactJS, NodeJS, PHP',
        },
      }),
      prisma.topic.create({
        data: {
          topicId: 3,
          topicName: 'Khoa Hoc Du Lieu',
          description: 'Phan tich du lieu, Machine Learning, Deep Learning',
        },
      }),
      prisma.topic.create({
        data: {
          topicId: 4,
          topicName: 'Co So Du Lieu',
          description: 'Thiet ke CSDL, SQL Server, MySQL, MongoDB',
        },
      }),
      prisma.topic.create({
        data: {
          topicId: 5,
          topicName: 'An Ninh Mang',
          description: 'Bao mat he thong, Pentest, Cryptography',
        },
      }),
      prisma.topic.create({
        data: {
          topicId: 6,
          topicName: 'Ky Nang Mem',
          description: 'Quan ly thoi gian, thuyet trinh, lam viec nhom',
        },
      }),
    ]);

    // ============================================
    // 6. CREATE COURSES
    // ============================================
    console.log('Creating courses...');

    const courses = await Promise.all([
      prisma.course.create({
        data: {
          courseId: 1,
          courseName: 'Nhap Mon Lap Trinh C++',
          description: 'Khoa hoc nen tang cho sinh vien nam nhat.',
          language: 'Tieng Viet',
          price: 500000.0,
          minScore: 50,
          level: 'BEGINNER',
        },
      }),
      prisma.course.create({
        data: {
          courseId: 2,
          courseName: 'Cau Truc Du Lieu & Giai Thuat',
          description: 'Nam vung cac thuat toan cot loi.',
          language: 'Tieng Viet',
          price: 800000.0,
          minScore: 50,
          level: 'INTERMEDIATE',
        },
      }),
      prisma.course.create({
        data: {
          courseId: 3,
          courseName: 'Lap Trinh Web Fullstack voi React & Node',
          description: 'Xay dung website thuong mai dien tu.',
          language: 'Tieng Anh',
          price: 1200000.0,
          minScore: 60,
          level: 'ADVANCED',
        },
      }),
      prisma.course.create({
        data: {
          courseId: 4,
          courseName: 'He Quan Tri Co So Du Lieu',
          description: 'Thanh thao SQL va thiet ke Database.',
          language: 'Tieng Viet',
          price: 600000.0,
          minScore: 50,
          level: 'INTERMEDIATE',
        },
      }),
      prisma.course.create({
        data: {
          courseId: 5,
          courseName: 'Python cho Phan Tich Du Lieu',
          description: 'Xu ly du lieu voi Pandas, NumPy.',
          language: 'Tieng Viet',
          price: 1000000.0,
          minScore: 60,
          level: 'INTERMEDIATE',
        },
      }),
      prisma.course.create({
        data: {
          courseId: 6,
          courseName: 'Nhap Mon Tri Tue Nhan Tao',
          description: 'Co ban ve AI va Machine Learning.',
          language: 'Tieng Anh',
          price: 1500000.0,
          minScore: 70,
          level: 'ADVANCED',
        },
      }),
      prisma.course.create({
        data: {
          courseId: 7,
          courseName: 'Mang May Tinh Co Ban',
          description: 'Kien thuc ve TCP/IP, OSI model.',
          language: 'Tieng Viet',
          price: 700000.0,
          minScore: 50,
          level: 'BEGINNER',
        },
      }),
      prisma.course.create({
        data: {
          courseId: 8,
          courseName: 'Luyen Thi Chung Chi AWS Cloud',
          description: 'Kien thuc dien toan dam may AWS.',
          language: 'Tieng Anh',
          price: 2000000.0,
          minScore: 75,
          level: 'ADVANCED',
        },
      }),
    ]);

    // ============================================
    // 7. LINK COURSES TO TOPICS
    // ============================================
    console.log('Linking courses to topics...');

    await Promise.all([
      prisma.courseTopics.create({
        data: { courseId: 1, topicId: 1 },
      }),
      prisma.courseTopics.create({
        data: { courseId: 2, topicId: 1 },
      }),
      prisma.courseTopics.create({
        data: { courseId: 3, topicId: 2 },
      }),
      prisma.courseTopics.create({
        data: { courseId: 4, topicId: 4 },
      }),
      prisma.courseTopics.create({
        data: { courseId: 5, topicId: 3 },
      }),
      prisma.courseTopics.create({
        data: { courseId: 6, topicId: 3 },
      }),
      prisma.courseTopics.create({
        data: { courseId: 7, topicId: 5 },
      }),
      prisma.courseTopics.create({
        data: { courseId: 8, topicId: 2 },
      }),
    ]);

    // ============================================
    // 8. LINK INSTRUCTORS TO COURSES
    // ============================================
    console.log('Linking instructors to courses...');

    await Promise.all([
      prisma.courseInstructor.create({
        data: {
          courseId: 1,
          instructorId: 2,
          isMainInstructor: true,
        },
      }),
      prisma.courseInstructor.create({
        data: {
          courseId: 1,
          instructorId: 3,
          isMainInstructor: false,
        },
      }),
      prisma.courseInstructor.create({
        data: {
          courseId: 2,
          instructorId: 2,
          isMainInstructor: true,
        },
      }),
      prisma.courseInstructor.create({
        data: {
          courseId: 3,
          instructorId: 3,
          isMainInstructor: true,
        },
      }),
      prisma.courseInstructor.create({
        data: {
          courseId: 4,
          instructorId: 4,
          isMainInstructor: true,
        },
      }),
      prisma.courseInstructor.create({
        data: {
          courseId: 5,
          instructorId: 4,
          isMainInstructor: true,
        },
      }),
      prisma.courseInstructor.create({
        data: {
          courseId: 6,
          instructorId: 2,
          isMainInstructor: true,
        },
      }),
      prisma.courseInstructor.create({
        data: {
          courseId: 7,
          instructorId: 5,
          isMainInstructor: true,
        },
      }),
      prisma.courseInstructor.create({
        data: {
          courseId: 8,
          instructorId: 5,
          isMainInstructor: true,
        },
      }),
    ]);

    // ============================================
    // 9. CREATE SECTIONS
    // ============================================
    console.log('Creating sections...');

    const sections = await Promise.all([
      // Course 1: C++
      prisma.section.create({
        data: {
          sectionId: 1,
          courseId: 1,
          sectionName: 'Gioi thieu ve C++ va IDE',
          sectionOrder: 1,
        },
      }),
      prisma.section.create({
        data: {
          sectionId: 2,
          courseId: 1,
          sectionName: 'Bien, Kieu Du Lieu va Toan Tu',
          sectionOrder: 2,
        },
      }),
      prisma.section.create({
        data: {
          sectionId: 3,
          courseId: 1,
          sectionName: 'Cau Truc Dieu Khien (If, Loop)',
          sectionOrder: 3,
        },
      }),
      // Course 3: Web
      prisma.section.create({
        data: {
          sectionId: 4,
          courseId: 3,
          sectionName: 'Tong quan ve HTML5 & CSS3',
          sectionOrder: 1,
        },
      }),
      prisma.section.create({
        data: {
          sectionId: 5,
          courseId: 3,
          sectionName: 'Javascript ES6 Co Ban',
          sectionOrder: 2,
        },
      }),
      prisma.section.create({
        data: {
          sectionId: 6,
          courseId: 3,
          sectionName: 'React Components & State',
          sectionOrder: 3,
        },
      }),
      // Course 4: Database
      prisma.section.create({
        data: {
          sectionId: 7,
          courseId: 4,
          sectionName: 'Mo hinh ERD & Thiet ke CSDL',
          sectionOrder: 1,
        },
      }),
      prisma.section.create({
        data: {
          sectionId: 8,
          courseId: 4,
          sectionName: 'Truy van SQL Co ban (SELECT)',
          sectionOrder: 2,
        },
      }),
      prisma.section.create({
        data: {
          sectionId: 9,
          courseId: 4,
          sectionName: 'Cac loai JOIN va GROUP BY',
          sectionOrder: 3,
        },
      }),
      // Course 5: Python Data
      prisma.section.create({
        data: {
          sectionId: 10,
          courseId: 5,
          sectionName: 'Cai dat moi truong Anaconda',
          sectionOrder: 1,
        },
      }),
    ]);

    // ============================================
    // 10. CREATE LECTURES
    // ============================================
    console.log('Creating lectures...');

    await Promise.all([
      // C++ Lectures
      prisma.lecture.create({
        data: {
          sectionId: 1,
          lectureName: 'Cai dat Visual Studio Code',
          link: 'https://hcmut.edu.vn/cpp/bai1',
          durationMinutes: 15,
        },
      }),
      prisma.lecture.create({
        data: {
          sectionId: 1,
          lectureName: 'Chuong trinh Hello World',
          link: 'https://hcmut.edu.vn/cpp/bai2',
          durationMinutes: 10,
        },
      }),
      prisma.lecture.create({
        data: {
          sectionId: 2,
          lectureName: 'Cac kieu du lieu nguyen thuy',
          link: 'https://hcmut.edu.vn/cpp/bai3',
          durationMinutes: 20,
        },
      }),
      prisma.lecture.create({
        data: {
          sectionId: 3,
          lectureName: 'Vong lap For va While',
          link: 'https://hcmut.edu.vn/cpp/bai4',
          durationMinutes: 25,
        },
      }),
      // Web Lectures
      prisma.lecture.create({
        data: {
          sectionId: 4,
          lectureName: 'Cau truc DOM trong HTML',
          link: 'https://hcmut.edu.vn/web/bai1',
          durationMinutes: 15,
        },
      }),
      prisma.lecture.create({
        data: {
          sectionId: 4,
          lectureName: 'Flexbox va Grid System',
          link: 'https://hcmut.edu.vn/web/bai2',
          durationMinutes: 30,
        },
      }),
      prisma.lecture.create({
        data: {
          sectionId: 5,
          lectureName: 'Arrow Function & Destructuring',
          link: 'https://hcmut.edu.vn/web/bai3',
          durationMinutes: 20,
        },
      }),
      // Database Lectures
      prisma.lecture.create({
        data: {
          sectionId: 7,
          lectureName: 'Thuc the va Moi quan he',
          link: 'https://hcmut.edu.vn/db/bai1',
          durationMinutes: 30,
        },
      }),
      prisma.lecture.create({
        data: {
          sectionId: 8,
          lectureName: 'Cau lenh SELECT-FROM-WHERE',
          link: 'https://hcmut.edu.vn/db/bai2',
          durationMinutes: 20,
        },
      }),
      prisma.lecture.create({
        data: {
          sectionId: 9,
          lectureName: 'Su dung INNER JOIN',
          link: 'https://hcmut.edu.vn/db/bai3',
          durationMinutes: 25,
        },
      }),
      // Python Lectures
      prisma.lecture.create({
        data: {
          sectionId: 10,
          lectureName: 'Gioi thieu Jupyter Notebook',
          link: 'https://hcmut.edu.vn/data/bai1',
          durationMinutes: 15,
        },
      }),
      prisma.lecture.create({
        data: {
          sectionId: 10,
          lectureName: 'Cac thu vien can thiet',
          link: 'https://hcmut.edu.vn/data/bai2',
          durationMinutes: 10,
        },
      }),
    ]);

    // ============================================
    // 11. CREATE TESTS
    // ============================================
    console.log('Creating tests...');

    const tests = await Promise.all([
      prisma.test.create({
        data: {
          testId: 1,
          sectionId: 1,
          testName: 'Kiem tra kien thuc nhap mon C++',
          maxAttempts: 3,
          timeLimitMinutes: 15,
          score: 10,
        },
      }),
      prisma.test.create({
        data: {
          testId: 2,
          sectionId: 3,
          testName: 'Bai tap ve Vong lap',
          maxAttempts: 2,
          timeLimitMinutes: 30,
          score: 10,
        },
      }),
      prisma.test.create({
        data: {
          testId: 3,
          sectionId: 4,
          testName: 'Quiz HTML/CSS',
          maxAttempts: 3,
          timeLimitMinutes: 20,
          score: 10,
        },
      }),
      prisma.test.create({
        data: {
          testId: 4,
          sectionId: 7,
          testName: 'Kiem tra thiet ke ERD',
          maxAttempts: 1,
          timeLimitMinutes: 45,
          score: 10,
        },
      }),
      prisma.test.create({
        data: {
          testId: 5,
          sectionId: 8,
          testName: 'Thuc hanh truy van SQL',
          maxAttempts: 2,
          timeLimitMinutes: 60,
          score: 10,
        },
      }),
      prisma.test.create({
        data: {
          testId: 6,
          sectionId: 10,
          testName: 'Quiz moi truong Python',
          maxAttempts: 5,
          timeLimitMinutes: 10,
          score: 10,
        },
      }),
    ]);

    // ============================================
    // 12. CREATE QUESTIONS
    // ============================================
    console.log('Creating questions...');

    await Promise.all([
      // C++ Questions
      prisma.question.create({
        data: {
          questionId: 1,
          testId: 1,
          content: 'Ham nao la ham chinh trong C++?',
          type: 'MULTIPLE_CHOICE',
          correctAnswer: 'main()',
        },
      }),
      prisma.question.create({
        data: {
          questionId: 2,
          testId: 1,
          content: 'Dau cham phay dung de ket thuc lenh?',
          type: 'TRUE_FALSE',
          correctAnswer: 'True',
        },
      }),
      // Web Questions
      prisma.question.create({
        data: {
          questionId: 3,
          testId: 3,
          content: 'The nao dung de tao chu in dam?',
          type: 'MULTIPLE_CHOICE',
          correctAnswer: '<strong>',
        },
      }),
      prisma.question.create({
        data: {
          questionId: 4,
          testId: 3,
          content: 'CSS la viet tat cua gi?',
          type: 'SHORT_ANSWER',
          correctAnswer: 'Cascading Style Sheets',
        },
      }),
      // SQL Questions
      prisma.question.create({
        data: {
          questionId: 5,
          testId: 4,
          content: 'Khoa chinh (Primary Key) phai la duy nhat?',
          type: 'TRUE_FALSE',
          correctAnswer: 'True',
        },
      }),
      prisma.question.create({
        data: {
          questionId: 6,
          testId: 5,
          content: 'Lenh nao dung de lay du lieu?',
          type: 'MULTIPLE_CHOICE',
          correctAnswer: 'SELECT',
        },
      }),
      prisma.question.create({
        data: {
          questionId: 7,
          testId: 5,
          content: 'Menh de nao dung de loc du lieu?',
          type: 'MULTIPLE_CHOICE',
          correctAnswer: 'WHERE',
        },
      }),
      // Python Question
      prisma.question.create({
        data: {
          questionId: 8,
          testId: 6,
          content: 'Thu vien nao dung ve bieu do?',
          type: 'MULTIPLE_CHOICE',
          correctAnswer: 'Matplotlib',
        },
      }),
    ]);

    // ============================================
    // 13. CREATE QUESTION CHOICES
    // ============================================
    console.log('Creating question choices...');

    await Promise.all([
      prisma.questionChoice.create({
        data: { questionId: 1, wrongChoice: 'start()' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 1, wrongChoice: 'begin()' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 1, wrongChoice: 'init()' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 3, wrongChoice: '<bold>' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 3, wrongChoice: '<bb>' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 3, wrongChoice: '<heavy>' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 6, wrongChoice: 'GET' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 6, wrongChoice: 'FETCH' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 6, wrongChoice: 'OBTAIN' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 7, wrongChoice: 'FILTER' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 7, wrongChoice: 'SEARCH' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 7, wrongChoice: 'FIND' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 8, wrongChoice: 'NumPy' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 8, wrongChoice: 'Pandas' },
      }),
      prisma.questionChoice.create({
        data: { questionId: 8, wrongChoice: 'Scikit-learn' },
      }),
    ]);

    // ============================================
    // 14. CREATE ENROLLMENTS
    // ============================================
    console.log('Creating enrollments...');

    await Promise.all([
      prisma.enrollment.create({
        data: {
          studentId: 6,
          courseId: 1,
          enrollmentDate: new Date('2023-09-10'),
          completionStatus: 'COMPLETED',
        },
      }),
      prisma.enrollment.create({
        data: {
          studentId: 6,
          courseId: 4,
          enrollmentDate: new Date('2023-09-15'),
          completionStatus: 'INPROGRESS',
        },
      }),
      prisma.enrollment.create({
        data: {
          studentId: 7,
          courseId: 1,
          enrollmentDate: new Date('2023-09-12'),
          completionStatus: 'INPROGRESS',
        },
      }),
      prisma.enrollment.create({
        data: {
          studentId: 8,
          courseId: 3,
          enrollmentDate: new Date('2023-10-01'),
          completionStatus: 'INPROGRESS',
        },
      }),
      prisma.enrollment.create({
        data: {
          studentId: 9,
          courseId: 1,
          enrollmentDate: new Date('2023-09-20'),
          completionStatus: 'COMPLETED',
        },
      }),
      prisma.enrollment.create({
        data: {
          studentId: 10,
          courseId: 6,
          enrollmentDate: new Date('2023-10-10'),
          completionStatus: 'INPROGRESS',
        },
      }),
      prisma.enrollment.create({
        data: {
          studentId: 11,
          courseId: 8,
          enrollmentDate: new Date('2023-11-01'),
          completionStatus: 'INPROGRESS',
        },
      }),
    ]);

    // ============================================
    // 15. CREATE TRANSACTIONS
    // ============================================
    console.log('Creating transactions...');

    await Promise.all([
      prisma.transaction.create({
        data: {
          studentId: 6,
          courseId: 1,
          instructorId: 2,
          price: 500000.0,
          paymentStatus: 'COMPLETED',
          transactionDate: new Date('2023-09-10 08:00:00'),
        },
      }),
      prisma.transaction.create({
        data: {
          studentId: 6,
          courseId: 4,
          instructorId: 4,
          price: 600000.0,
          paymentStatus: 'COMPLETED',
          transactionDate: new Date('2023-09-15 09:30:00'),
        },
      }),
      prisma.transaction.create({
        data: {
          studentId: 7,
          courseId: 1,
          instructorId: 2,
          price: 500000.0,
          paymentStatus: 'COMPLETED',
          transactionDate: new Date('2023-09-12 14:00:00'),
        },
      }),
      prisma.transaction.create({
        data: {
          studentId: 8,
          courseId: 3,
          instructorId: 3,
          price: 1200000.0,
          paymentStatus: 'COMPLETED',
          transactionDate: new Date('2023-10-01 10:00:00'),
        },
      }),
      prisma.transaction.create({
        data: {
          studentId: 9,
          courseId: 1,
          instructorId: 2,
          price: 500000.0,
          paymentStatus: 'COMPLETED',
          transactionDate: new Date('2023-09-20 15:00:00'),
        },
      }),
      prisma.transaction.create({
        data: {
          studentId: 10,
          courseId: 6,
          instructorId: 2,
          price: 1500000.0,
          paymentStatus: 'PENDING',
          transactionDate: new Date('2023-10-10 16:00:00'),
        },
      }),
      prisma.transaction.create({
        data: {
          studentId: 11,
          courseId: 8,
          instructorId: 5,
          price: 2000000.0,
          paymentStatus: 'FAILED',
          transactionDate: new Date('2023-11-01 19:00:00'),
        },
      }),
    ]);

    // ============================================
    // 16. CREATE LECTURE VIEWS
    // ============================================
    console.log('Creating lecture views...');

    await Promise.all([
      prisma.lectureView.create({
        data: {
          studentId: 6,
          lectureId: 1,
          status: 'COMPLETED',
          viewDate: new Date('2023-09-11 09:00:00'),
        },
      }),
      prisma.lectureView.create({
        data: {
          studentId: 6,
          lectureId: 2,
          status: 'COMPLETED',
          viewDate: new Date('2023-09-11 10:00:00'),
        },
      }),
      prisma.lectureView.create({
        data: {
          studentId: 9,
          lectureId: 1,
          status: 'COMPLETED',
          viewDate: new Date('2023-09-21 20:00:00'),
        },
      }),
      prisma.lectureView.create({
        data: {
          studentId: 9,
          lectureId: 2,
          status: 'COMPLETED',
          viewDate: new Date('2023-09-21 21:00:00'),
        },
      }),
      prisma.lectureView.create({
        data: {
          studentId: 7,
          lectureId: 1,
          status: 'INPROGRESS',
          viewDate: new Date('2023-09-13 14:00:00'),
        },
      }),
      prisma.lectureView.create({
        data: {
          studentId: 8,
          lectureId: 5,
          status: 'NOTSTARTED',
          viewDate: new Date('2023-10-02 08:00:00'),
        },
      }),
    ]);

    // ============================================
    // 17. CREATE TEST RESULTS
    // ============================================
    console.log('Creating test results...');

    await Promise.all([
      prisma.testResult.create({
        data: {
          studentId: 6,
          testId: 1,
          actualScore: 10.0,
          startTime: new Date('2023-09-12 09:00:00'),
          submitTime: new Date('2023-09-12 09:15:00'),
          status: 'COMPLETED',
        },
      }),
      prisma.testResult.create({
        data: {
          studentId: 9,
          testId: 1,
          actualScore: 8.5,
          startTime: new Date('2023-09-22 10:00:00'),
          submitTime: new Date('2023-09-22 10:14:00'),
          status: 'COMPLETED',
        },
      }),
      prisma.testResult.create({
        data: {
          studentId: 7,
          testId: 1,
          actualScore: 4.0,
          startTime: new Date('2023-09-14 15:00:00'),
          submitTime: new Date('2023-09-14 15:15:00'),
          status: 'COMPLETED',
        },
      }),
    ]);

    // ============================================
    // 18. CREATE COURSE RATINGS
    // ============================================
    console.log('Creating course ratings...');

    await Promise.all([
      prisma.courseRating.create({
        data: {
          studentId: 6,
          courseId: 1,
          rating: 5,
          comment: 'Khoa hoc rat hay, thay Thanh day de hieu.',
          ratingDate: new Date('2023-10-01 10:00:00'),
        },
      }),
      prisma.courseRating.create({
        data: {
          studentId: 9,
          courseId: 1,
          rating: 4,
          comment: 'Noi dung tot nhung am thanh hoi nho.',
          ratingDate: new Date('2023-10-05 09:00:00'),
        },
      }),
      prisma.courseRating.create({
        data: {
          studentId: 7,
          courseId: 1,
          rating: 3,
          comment: 'Bai tap hoi kho so voi nguoi moi.',
          ratingDate: new Date('2023-09-25 10:00:00'),
        },
      }),
    ]);

    // ============================================
    // 19. CREATE CERTIFICATES
    // ============================================
    console.log('Creating certificates...');

    await Promise.all([
      prisma.certificate.create({
        data: {
          studentId: 6,
          courseId: 1,
          issuedDate: new Date('2023-10-02'),
        },
      }),
      prisma.certificate.create({
        data: {
          studentId: 9,
          courseId: 1,
          issuedDate: new Date('2023-10-06'),
        },
      }),
    ]);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
