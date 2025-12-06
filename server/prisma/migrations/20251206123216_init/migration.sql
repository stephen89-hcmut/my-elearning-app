-- CreateTable
CREATE TABLE `USERS` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `role` ENUM('ADMIN', 'INSTRUCTOR', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    `bank_name` VARCHAR(100) NULL,
    `payment_account` VARCHAR(100) NULL,

    UNIQUE INDEX `USERS_username_key`(`username`),
    UNIQUE INDEX `USERS_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ADMINS` (
    `admin_id` INTEGER NOT NULL,

    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `INSTRUCTORS` (
    `instructor_id` INTEGER NOT NULL,
    `teaching_field` VARCHAR(255) NOT NULL,
    `bio` TEXT NULL,

    PRIMARY KEY (`instructor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `STUDENTS` (
    `student_id` INTEGER NOT NULL,
    `enrollment_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TOPICS` (
    `topic_id` INTEGER NOT NULL AUTO_INCREMENT,
    `topic_name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `TOPICS_topic_name_key`(`topic_name`),
    PRIMARY KEY (`topic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `COURSES` (
    `course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `language` VARCHAR(50) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `min_score` INTEGER NOT NULL DEFAULT 50,
    `level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    `total_lectures` INTEGER NOT NULL DEFAULT 0,
    `total_tests` INTEGER NOT NULL DEFAULT 0,
    `total_duration` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `COURSES_course_name_key`(`course_name`),
    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `COURSE_TOPICS` (
    `course_id` INTEGER NOT NULL,
    `topic_id` INTEGER NOT NULL,

    PRIMARY KEY (`course_id`, `topic_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `COURSE_INSTRUCTORS` (
    `course_id` INTEGER NOT NULL,
    `instructor_id` INTEGER NOT NULL,
    `is_main_instructor` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`course_id`, `instructor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PREREQUISITES` (
    `course_id` INTEGER NOT NULL,
    `prerequisite_course_id` INTEGER NOT NULL,

    PRIMARY KEY (`course_id`, `prerequisite_course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SECTIONS` (
    `section_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `section_name` VARCHAR(255) NOT NULL,
    `section_order` INTEGER NOT NULL,
    `total_lectures` INTEGER NOT NULL DEFAULT 0,
    `total_tests` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `SECTIONS_course_id_section_order_key`(`course_id`, `section_order`),
    PRIMARY KEY (`section_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LECTURES` (
    `lecture_id` INTEGER NOT NULL AUTO_INCREMENT,
    `section_id` INTEGER NOT NULL,
    `lecture_name` VARCHAR(255) NOT NULL,
    `link` VARCHAR(500) NOT NULL,
    `attached_materials` VARCHAR(500) NULL,
    `duration_minutes` INTEGER NULL,
    `status` ENUM('NOTSTARTED', 'INPROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOTSTARTED',

    PRIMARY KEY (`lecture_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LECTURE_VIEWS` (
    `studentId` INTEGER NOT NULL,
    `lectureId` INTEGER NOT NULL,
    `status` ENUM('NOTSTARTED', 'INPROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOTSTARTED',
    `view_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`studentId`, `lectureId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TESTS` (
    `test_id` INTEGER NOT NULL AUTO_INCREMENT,
    `section_id` INTEGER NOT NULL,
    `test_name` VARCHAR(255) NOT NULL,
    `max_attempts` INTEGER NOT NULL DEFAULT 1,
    `time_limit_minutes` INTEGER NOT NULL,
    `test_url` VARCHAR(500) NULL,
    `score` INTEGER NOT NULL DEFAULT 100,

    PRIMARY KEY (`test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QUESTIONS` (
    `question_id` INTEGER NOT NULL AUTO_INCREMENT,
    `test_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY') NOT NULL,
    `correct_answer` TEXT NOT NULL,

    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QUESTION_CHOICES` (
    `choice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `wrong_choice` TEXT NOT NULL,

    PRIMARY KEY (`choice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TEST_RESULTS` (
    `result_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,
    `actual_score` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `start_time` DATETIME(3) NOT NULL,
    `submit_time` DATETIME(3) NULL,
    `status` ENUM('INPROGRESS', 'COMPLETED') NOT NULL DEFAULT 'INPROGRESS',

    PRIMARY KEY (`result_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ENROLLMENTS` (
    `student_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `enrollment_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `completion_status` ENUM('INPROGRESS', 'COMPLETED') NOT NULL DEFAULT 'INPROGRESS',

    PRIMARY KEY (`student_id`, `course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TRANSACTIONS` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `instructor_id` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `payment_status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL,
    `transaction_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CERTIFICATES` (
    `certificate_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `issued_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `CERTIFICATES_student_id_course_id_key`(`student_id`, `course_id`),
    PRIMARY KEY (`certificate_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `COURSE_RATINGS` (
    `student_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `rating_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`student_id`, `course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ADMINS` ADD CONSTRAINT `ADMINS_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `USERS`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `INSTRUCTORS` ADD CONSTRAINT `INSTRUCTORS_instructor_id_fkey` FOREIGN KEY (`instructor_id`) REFERENCES `USERS`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `STUDENTS` ADD CONSTRAINT `STUDENTS_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `USERS`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `COURSE_TOPICS` ADD CONSTRAINT `COURSE_TOPICS_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `COURSE_TOPICS` ADD CONSTRAINT `COURSE_TOPICS_topic_id_fkey` FOREIGN KEY (`topic_id`) REFERENCES `TOPICS`(`topic_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `COURSE_INSTRUCTORS` ADD CONSTRAINT `COURSE_INSTRUCTORS_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `COURSE_INSTRUCTORS` ADD CONSTRAINT `COURSE_INSTRUCTORS_instructor_id_fkey` FOREIGN KEY (`instructor_id`) REFERENCES `INSTRUCTORS`(`instructor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PREREQUISITES` ADD CONSTRAINT `PREREQUISITES_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PREREQUISITES` ADD CONSTRAINT `PREREQUISITES_prerequisite_course_id_fkey` FOREIGN KEY (`prerequisite_course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SECTIONS` ADD CONSTRAINT `SECTIONS_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LECTURES` ADD CONSTRAINT `LECTURES_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `SECTIONS`(`section_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LECTURE_VIEWS` ADD CONSTRAINT `LECTURE_VIEWS_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `STUDENTS`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LECTURE_VIEWS` ADD CONSTRAINT `LECTURE_VIEWS_lectureId_fkey` FOREIGN KEY (`lectureId`) REFERENCES `LECTURES`(`lecture_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TESTS` ADD CONSTRAINT `TESTS_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `SECTIONS`(`section_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QUESTIONS` ADD CONSTRAINT `QUESTIONS_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `TESTS`(`test_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QUESTION_CHOICES` ADD CONSTRAINT `QUESTION_CHOICES_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `QUESTIONS`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TEST_RESULTS` ADD CONSTRAINT `TEST_RESULTS_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `STUDENTS`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TEST_RESULTS` ADD CONSTRAINT `TEST_RESULTS_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `TESTS`(`test_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ENROLLMENTS` ADD CONSTRAINT `ENROLLMENTS_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `STUDENTS`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ENROLLMENTS` ADD CONSTRAINT `ENROLLMENTS_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TRANSACTIONS` ADD CONSTRAINT `TRANSACTIONS_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `STUDENTS`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TRANSACTIONS` ADD CONSTRAINT `TRANSACTIONS_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TRANSACTIONS` ADD CONSTRAINT `TRANSACTIONS_instructor_id_fkey` FOREIGN KEY (`instructor_id`) REFERENCES `INSTRUCTORS`(`instructor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CERTIFICATES` ADD CONSTRAINT `CERTIFICATES_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `STUDENTS`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CERTIFICATES` ADD CONSTRAINT `CERTIFICATES_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `COURSE_RATINGS` ADD CONSTRAINT `COURSE_RATINGS_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `STUDENTS`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `COURSE_RATINGS` ADD CONSTRAINT `COURSE_RATINGS_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `COURSES`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;
