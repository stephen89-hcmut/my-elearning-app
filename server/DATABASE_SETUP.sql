-- Database Setup Script
-- Run this with root account or administrative privileges

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS ElearningDB;
USE ElearningDB;

-- 2. Create User and Grant Privileges
CREATE USER IF NOT EXISTS 'sManager'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON ElearningDB.* TO 'sManager'@'localhost';
FLUSH PRIVILEGES;

-- 3. Create Tables (TypeORM will handle this with synchronize: true in development)
-- But here's the SQL for reference

-- USERS table
CREATE TABLE IF NOT EXISTS USERS (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role INT DEFAULT 2 COMMENT '0=ADMIN, 1=INSTRUCTOR, 2=STUDENT',
  bank_name VARCHAR(100),
  payment_account VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TOPICS table
CREATE TABLE IF NOT EXISTS TOPICS (
  topic_id INT AUTO_INCREMENT PRIMARY KEY,
  topic_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COURSES table
CREATE TABLE IF NOT EXISTS COURSES (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  language VARCHAR(100),
  price DECIMAL(10, 2) DEFAULT 0,
  min_score INT DEFAULT 50 CHECK (min_score BETWEEN 0 AND 100),
  level INT DEFAULT 0 COMMENT '0=BEGINNER, 1=INTERMEDIATE, 2=ADVANCED',
  total_lectures INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- COURSE_TOPICS junction table
CREATE TABLE IF NOT EXISTS COURSE_TOPICS (
  course_id INT NOT NULL,
  topic_id INT NOT NULL,
  PRIMARY KEY (course_id, topic_id),
  FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES TOPICS(topic_id) ON DELETE CASCADE
);

-- STUDENTS table
CREATE TABLE IF NOT EXISTS STUDENTS (
  student_id INT PRIMARY KEY,
  enrollment_date DATE DEFAULT CURDATE(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

-- INSTRUCTORS table
CREATE TABLE IF NOT EXISTS INSTRUCTORS (
  instructor_id INT PRIMARY KEY,
  qualification TEXT,
  hourly_rate DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

-- ADMINS table
CREATE TABLE IF NOT EXISTS ADMINS (
  admin_id INT PRIMARY KEY,
  permissions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

-- COURSE_INSTRUCTORS junction table (with is_main_instructor)
CREATE TABLE IF NOT EXISTS COURSE_INSTRUCTORS (
  course_id INT NOT NULL,
  instructor_id INT NOT NULL,
  is_main_instructor BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (course_id, instructor_id),
  FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES INSTRUCTORS(instructor_id) ON DELETE CASCADE
);

-- ENROLLMENTS table
CREATE TABLE IF NOT EXISTS ENROLLMENTS (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date DATE DEFAULT CURDATE(),
  completion_status INT DEFAULT 0 COMMENT '0=NOT_STARTED, 1=IN_PROGRESS, 2=COMPLETED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE
);

-- SECTIONS table
CREATE TABLE IF NOT EXISTS SECTIONS (
  section_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  section_name VARCHAR(255) NOT NULL,
  section_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE
);

-- LECTURES table
CREATE TABLE IF NOT EXISTS LECTURES (
  lecture_id INT AUTO_INCREMENT PRIMARY KEY,
  section_id INT NOT NULL,
  lecture_name VARCHAR(255) NOT NULL,
  content TEXT,
  duration INT DEFAULT 0,
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES SECTIONS(section_id) ON DELETE CASCADE
);

-- TESTS table
CREATE TABLE IF NOT EXISTS TESTS (
  test_id INT AUTO_INCREMENT PRIMARY KEY,
  section_id INT NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  max_attempts INT DEFAULT 1,
  time_limit_minutes INT NOT NULL,
  score INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES SECTIONS(section_id) ON DELETE CASCADE
);

-- QUESTIONS table
CREATE TABLE IF NOT EXISTS QUESTIONS (
  question_id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL COMMENT 'multiple_choice, true_false, short_answer, essay',
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES TESTS(test_id) ON DELETE CASCADE
);

-- QUESTION_CHOICES table
CREATE TABLE IF NOT EXISTS QUESTION_CHOICES (
  choice_id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  content TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES QUESTIONS(question_id) ON DELETE CASCADE
);

-- TRANSACTIONS table
CREATE TABLE IF NOT EXISTS TRANSACTIONS (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  instructor_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending, completed, failed, refunded',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES STUDENTS(student_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES COURSES(course_id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES INSTRUCTORS(instructor_id) ON DELETE CASCADE
);

-- 4. Stored Procedures

DELIMITER $$

-- SP: Get Monthly Revenue
CREATE PROCEDURE IF NOT EXISTS sp_GetMonthlyRevenue(IN p_month INT, IN p_year INT)
BEGIN
  SELECT SUM(price) as revenue 
  FROM TRANSACTIONS 
  WHERE MONTH(payment_date) = p_month 
    AND YEAR(payment_date) = p_year 
    AND payment_status = 'completed';
END$$

-- SP: Get Course Statistics
CREATE PROCEDURE IF NOT EXISTS sp_GetCourseStats()
BEGIN
  SELECT 
    COUNT(*) as totalCourses,
    AVG(price) as avgPrice,
    MAX(price) as maxPrice,
    MIN(price) as minPrice
  FROM COURSES;
END$$

-- SP: Get Student Enrollment Stats
CREATE PROCEDURE IF NOT EXISTS sp_GetEnrollmentStats(IN p_course_id INT)
BEGIN
  SELECT 
    COUNT(*) as totalEnrollments,
    SUM(CASE WHEN completion_status = 2 THEN 1 ELSE 0 END) as completedCount,
    SUM(CASE WHEN completion_status = 1 THEN 1 ELSE 0 END) as inProgressCount
  FROM ENROLLMENTS
  WHERE course_id = p_course_id;
END$$

DELIMITER ;

-- 5. Insert Sample Data (Optional)

-- Insert Topics
INSERT INTO TOPICS (topic_name, description) VALUES
('Computer Science', 'Computer Science fundamentals'),
('Business', 'Business fundamentals'),
('Design', 'Design principles and practices');

-- Insert Sample Users (Passwords are hashed in real implementation)
INSERT INTO USERS (username, email, first_name, last_name, password, role) VALUES
('admin_user', 'admin@example.com', 'Admin', 'User', 'hashed_password', 0),
('instructor_tam', 'tam@example.com', 'Minh', 'Nguyen', 'hashed_password', 1),
('instructor_thi', 'thi@example.com', 'Thi', 'Le', 'hashed_password', 1),
('student_john', 'john@example.com', 'John', 'Doe', 'hashed_password', 2);

-- Insert sample courses
INSERT INTO COURSES (course_name, description, language, price, level) VALUES
('Introduction to Database Systems', 'Learn database fundamentals', 'English', 19.99, 0),
('Advanced SQL', 'Master SQL optimization', 'English', 29.99, 2),
('Business Analytics 101', 'Data-driven decision making', 'English', 24.99, 0);

-- Link courses to topics
INSERT INTO COURSE_TOPICS (course_id, topic_id) VALUES
(1, 1),
(2, 1),
(3, 2);

-- Create Student and Instructor records
INSERT INTO STUDENTS (student_id, enrollment_date) VALUES
(4, CURDATE());

INSERT INTO INSTRUCTORS (instructor_id, qualification, hourly_rate) VALUES
(2, 'PhD in Computer Science', 50.00),
(3, 'M.Sc Database Administration', 60.00);

-- Link instructors to courses
INSERT INTO COURSE_INSTRUCTORS (course_id, instructor_id, is_main_instructor) VALUES
(1, 2, TRUE),
(2, 3, TRUE),
(3, 2, FALSE);

COMMIT;
