-- =============================================================================
-- DATABASE INITIALIZATION
-- =============================================================================
DROP DATABASE IF EXISTS BTL2;
CREATE DATABASE BTL2;
USE BTL2;

-- =============================================================================
-- PART 1: DDL - CREATE TABLES
-- =============================================================================

-- 1. USERS (Parent Table)
CREATE TABLE USERS
(
    user_id         VARCHAR(20) PRIMARY KEY NOT NULL,
    username        VARCHAR(50)             NOT NULL UNIQUE,
    email           VARCHAR(255)            NOT NULL UNIQUE,
    first_name      VARCHAR(50)             NOT NULL,
    last_name       VARCHAR(50)             NOT NULL,
    password        VARCHAR(100)            NOT NULL,
    role            INT                     NOT NULL DEFAULT 2, -- 0: Admin, 1: Instructor, 2: Student
    bank_name       VARCHAR(100),
    payment_account VARCHAR(100),

    CONSTRAINT chk_role CHECK (role IN (0, 1, 2)),
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%')
);

-- 2. STUDENTS (Inherits USERS)
CREATE TABLE STUDENTS
(
    student_id      VARCHAR(20) PRIMARY KEY NOT NULL,
    enrollment_date DATE                    NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (student_id) REFERENCES USERS (user_id) ON DELETE CASCADE
);

-- 3. INSTRUCTORS (Inherits USERS)
CREATE TABLE INSTRUCTORS
(
    instructor_id  VARCHAR(20) PRIMARY KEY NOT NULL,
    teaching_field VARCHAR(255)            NOT NULL,
    bio            TEXT,
    FOREIGN KEY (instructor_id) REFERENCES USERS (user_id) ON DELETE CASCADE
);

-- 4. ADMINS (Inherits USERS)
CREATE TABLE ADMINS
(
    admin_id VARCHAR(20) PRIMARY KEY NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES USERS (user_id) ON DELETE CASCADE
);

-- 5. TOPICS
CREATE TABLE TOPICS
(
    topic_id    VARCHAR(20) PRIMARY KEY NOT NULL,
    topic_name  VARCHAR(100)            NOT NULL UNIQUE,
    description TEXT
);

-- 6. COURSES
CREATE TABLE COURSES
(
    course_id      VARCHAR(20) PRIMARY KEY NOT NULL,
    course_name    VARCHAR(255)            NOT NULL UNIQUE,
    description    TEXT,
    language       VARCHAR(50)             NOT NULL,
    price          DECIMAL(10, 2)          NOT NULL DEFAULT 0.00,
    min_score      INT                     NOT NULL DEFAULT 50,
    level          INT                     NOT NULL DEFAULT 0, -- 0: Beg, 1: Int, 2: Adv
    total_lectures INT                              DEFAULT 0,
    total_tests    INT                              DEFAULT 0,
    total_duration INT                              DEFAULT 0,

    CONSTRAINT chk_course_price CHECK (price >= 0),
    CONSTRAINT chk_min_score CHECK (min_score BETWEEN 0 AND 100),
    CONSTRAINT chk_course_level CHECK (level IN (0, 1, 2))
);

-- 7. COURSE_TOPICS (Many-to-Many)
CREATE TABLE COURSE_TOPICS
(
    course_id VARCHAR(20) NOT NULL,
    topic_id  VARCHAR(20) NOT NULL,
    PRIMARY KEY (course_id, topic_id),
    FOREIGN KEY (course_id) REFERENCES COURSES (course_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES TOPICS (topic_id) ON DELETE CASCADE
);

-- 8. SECTIONS
CREATE TABLE SECTIONS
(
    section_id     VARCHAR(20) PRIMARY KEY NOT NULL,
    course_id      VARCHAR(20)             NOT NULL,
    section_name   VARCHAR(255)            NOT NULL,
    section_order  INT                     NOT NULL,
    total_lectures INT DEFAULT 0,
    total_tests    INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES COURSES (course_id) ON DELETE CASCADE,
    UNIQUE KEY (course_id, section_order)
);

-- 9. LECTURES
CREATE TABLE LECTURES
(
    lecture_id         VARCHAR(20) PRIMARY KEY NOT NULL,
    section_id         VARCHAR(20)             NOT NULL,
    lecture_name       VARCHAR(255)            NOT NULL,
    link               VARCHAR(500)            NOT NULL,
    attached_materials VARCHAR(500),
    duration_minutes   INT,
    status             INT DEFAULT 0,
    FOREIGN KEY (section_id) REFERENCES SECTIONS (section_id) ON DELETE CASCADE,
    CONSTRAINT chk_duration CHECK (duration_minutes IS NULL OR duration_minutes > 0)
);

-- 10. TESTS
CREATE TABLE TESTS
(
    test_id            VARCHAR(20) PRIMARY KEY NOT NULL,
    section_id         VARCHAR(20)             NOT NULL,
    test_name          VARCHAR(255)            NOT NULL,
    max_attempts       INT                     NOT NULL DEFAULT 1,
    time_limit_minutes INT                     NOT NULL,
    test_url           VARCHAR(500),
    score              INT                              DEFAULT 100,
    FOREIGN KEY (section_id) REFERENCES SECTIONS (section_id) ON DELETE CASCADE,
    CONSTRAINT chk_max_attempts CHECK (max_attempts > 0),
    CONSTRAINT chk_time_limit CHECK (time_limit_minutes > 0)
);

-- 11. QUESTIONS
CREATE TABLE QUESTIONS
(
    question_id    VARCHAR(20) PRIMARY KEY NOT NULL,
    test_id        VARCHAR(20)             NOT NULL,
    content        TEXT                    NOT NULL,
    type           VARCHAR(50)             NOT NULL,
    correct_answer TEXT                    NOT NULL,
    FOREIGN KEY (test_id) REFERENCES TESTS (test_id) ON DELETE CASCADE,
    CONSTRAINT chk_question_type CHECK (type IN ('multiple_choice', 'true_false', 'short_answer', 'essay'))
);

-- 12. QUESTION_CHOICES
CREATE TABLE QUESTION_CHOICES
(
    choice_id    VARCHAR(20) PRIMARY KEY NOT NULL,
    question_id  VARCHAR(20)             NOT NULL,
    wrong_choice TEXT                    NOT NULL,
    FOREIGN KEY (question_id) REFERENCES QUESTIONS (question_id) ON DELETE CASCADE
);

-- 13. TEST_RESULTS
CREATE TABLE TEST_RESULTS
(
    result_id    VARCHAR(20) PRIMARY KEY NOT NULL,
    student_id   VARCHAR(20)             NOT NULL,
    test_id      VARCHAR(20)             NOT NULL,
    actual_score DECIMAL(5, 2) DEFAULT 0,
    start_time   DATETIME                NOT NULL,
    submit_time  DATETIME,
    status       INT           DEFAULT 1,
    FOREIGN KEY (student_id) REFERENCES STUDENTS (student_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES TESTS (test_id) ON DELETE CASCADE
);

-- 14. TRANSACTIONS
CREATE TABLE TRANSACTIONS
(
    transaction_id   VARCHAR(20) PRIMARY KEY NOT NULL,
    student_id       VARCHAR(20)             NOT NULL,
    course_id        VARCHAR(20)             NOT NULL,
    instructor_id    VARCHAR(20)             NOT NULL,
    price            DECIMAL(10, 2)          NOT NULL,
    payment_status   VARCHAR(50)             NOT NULL,
    transaction_date DATETIME                NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES STUDENTS (student_id) ON DELETE RESTRICT,
    FOREIGN KEY (instructor_id) REFERENCES INSTRUCTORS (instructor_id) ON DELETE RESTRICT,
    FOREIGN KEY (course_id) REFERENCES COURSES (course_id) ON DELETE RESTRICT,
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    CONSTRAINT chk_transaction_price CHECK (price > 0)
);

-- 15. CERTIFICATES
CREATE TABLE CERTIFICATES
(
    certificate_id VARCHAR(20) PRIMARY KEY NOT NULL,
    student_id     VARCHAR(20)             NOT NULL,
    course_id      VARCHAR(20)             NOT NULL,
    issued_date    DATE                    NOT NULL DEFAULT (CURRENT_DATE),
    FOREIGN KEY (student_id) REFERENCES STUDENTS (student_id) ON DELETE RESTRICT,
    FOREIGN KEY (course_id) REFERENCES COURSES (course_id) ON DELETE RESTRICT,
    UNIQUE KEY (student_id, course_id)
);

-- 16. COURSE_INSTRUCTORS (Many-to-Many)
CREATE TABLE COURSE_INSTRUCTORS
(
    course_id          VARCHAR(20) NOT NULL,
    instructor_id      VARCHAR(20) NOT NULL,
    is_main_instructor BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (course_id, instructor_id),
    FOREIGN KEY (course_id) REFERENCES COURSES (course_id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES INSTRUCTORS (instructor_id) ON DELETE CASCADE
);

-- 17. ENROLLMENTS
CREATE TABLE ENROLLMENTS
(
    student_id        VARCHAR(20) NOT NULL,
    course_id         VARCHAR(20) NOT NULL,
    enrollment_date   DATE        NOT NULL DEFAULT (CURRENT_DATE),
    completion_status INT         NOT NULL DEFAULT 0, -- 0: In Progress, 1: Completed
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES STUDENTS (student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES COURSES (course_id) ON DELETE CASCADE
);

-- 18. PREREQUISITES
CREATE TABLE PREREQUISITES
(
    course_id              VARCHAR(20) NOT NULL,
    prerequisite_course_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (course_id, prerequisite_course_id),
    FOREIGN KEY (course_id) REFERENCES COURSES (course_id) ON DELETE CASCADE,
    FOREIGN KEY (prerequisite_course_id) REFERENCES COURSES (course_id) ON DELETE CASCADE,
    CONSTRAINT chk_no_self_prereq CHECK (course_id <> prerequisite_course_id)
);

-- 19. COURSE_RATINGS
CREATE TABLE COURSE_RATINGS
(
    student_id  VARCHAR(20) NOT NULL,
    course_id   VARCHAR(20) NOT NULL,
    rating      INT         NOT NULL,
    comment     TEXT,
    rating_date DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES STUDENTS (student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES COURSES (course_id) ON DELETE CASCADE,
    CONSTRAINT chk_rating_value CHECK (rating BETWEEN 1 AND 5)
);

-- 20. LECTURE_VIEWS
CREATE TABLE LECTURE_VIEWS
(
    student_id VARCHAR(20) NOT NULL,
    lecture_id VARCHAR(20) NOT NULL,
    status     INT         NOT NULL DEFAULT 0,
    view_date  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, lecture_id),
    FOREIGN KEY (student_id) REFERENCES STUDENTS (student_id) ON DELETE CASCADE,
    FOREIGN KEY (lecture_id) REFERENCES LECTURES (lecture_id) ON DELETE CASCADE,
    CONSTRAINT chk_view_status CHECK (status IN (0, 1, 2))
);

-- =============================================================================
-- PART 2: TRIGGERS (ID GENERATION & LOGIC)
-- Note: Create triggers BEFORE inserting data to ensure data integrity
-- =============================================================================

DELIMITER //

-- 2.1 ID Generation Triggers
CREATE TRIGGER trg_BeforeInsertUser BEFORE INSERT ON USERS FOR EACH ROW
BEGIN
    DECLARE v_prefix VARCHAR(3);
    DECLARE v_max_id INT;
    IF NEW.user_id IS NULL OR NEW.user_id = '' THEN
        IF NEW.role = 0 THEN SET v_prefix = 'ADM';
        ELSEIF NEW.role = 1 THEN SET v_prefix = 'INS';
        ELSE SET v_prefix = 'STU'; END IF;
        SELECT IFNULL(MAX(CAST(SUBSTRING(user_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM USERS WHERE user_id LIKE CONCAT(v_prefix, '%');
        SET NEW.user_id = CONCAT(v_prefix, LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertCourse BEFORE INSERT ON COURSES FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.course_id IS NULL OR NEW.course_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(course_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM COURSES;
        SET NEW.course_id = CONCAT('COU', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertTopic BEFORE INSERT ON TOPICS FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.topic_id IS NULL OR NEW.topic_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(topic_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM TOPICS;
        SET NEW.topic_id = CONCAT('TOP', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertSection BEFORE INSERT ON SECTIONS FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.section_id IS NULL OR NEW.section_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(section_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM SECTIONS;
        SET NEW.section_id = CONCAT('SEC', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertLecture BEFORE INSERT ON LECTURES FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.lecture_id IS NULL OR NEW.lecture_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(lecture_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM LECTURES;
        SET NEW.lecture_id = CONCAT('LEC', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertTest BEFORE INSERT ON TESTS FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.test_id IS NULL OR NEW.test_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(test_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM TESTS;
        SET NEW.test_id = CONCAT('TST', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertQuestion BEFORE INSERT ON QUESTIONS FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.question_id IS NULL OR NEW.question_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(question_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM QUESTIONS;
        SET NEW.question_id = CONCAT('QUE', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertChoice BEFORE INSERT ON QUESTION_CHOICES FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.choice_id IS NULL OR NEW.choice_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(choice_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM QUESTION_CHOICES;
        SET NEW.choice_id = CONCAT('CHO', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertTransaction BEFORE INSERT ON TRANSACTIONS FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.transaction_id IS NULL OR NEW.transaction_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(transaction_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM TRANSACTIONS;
        SET NEW.transaction_id = CONCAT('TRN', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertCertificate BEFORE INSERT ON CERTIFICATES FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.certificate_id IS NULL OR NEW.certificate_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(certificate_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM CERTIFICATES;
        SET NEW.certificate_id = CONCAT('CER', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

CREATE TRIGGER trg_BeforeInsertResult BEFORE INSERT ON TEST_RESULTS FOR EACH ROW
BEGIN
    DECLARE v_max_id INT;
    IF NEW.result_id IS NULL OR NEW.result_id = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(result_id, 4) AS UNSIGNED)), 0) INTO v_max_id FROM TEST_RESULTS;
        SET NEW.result_id = CONCAT('RES', LPAD(v_max_id + 1, 3, '0'));
    END IF;
END //

-- 2.2 Functional Triggers (Logic)
CREATE TRIGGER trg_AfterInsertLecture_UpdateCounts AFTER INSERT ON LECTURES FOR EACH ROW
BEGIN
    UPDATE SECTIONS SET total_lectures = total_lectures + 1 WHERE section_id = NEW.section_id;
    UPDATE COURSES c JOIN SECTIONS s ON c.course_id = s.course_id SET c.total_lectures = c.total_lectures + 1 WHERE s.section_id = NEW.section_id;
END //

CREATE TRIGGER trg_AfterInsertTest_UpdateCounts AFTER INSERT ON TESTS FOR EACH ROW
BEGIN
    UPDATE SECTIONS SET total_tests = total_tests + 1 WHERE section_id = NEW.section_id;
    UPDATE COURSES c JOIN SECTIONS s ON c.course_id = s.course_id SET c.total_tests = c.total_tests + 1 WHERE s.section_id = NEW.section_id;
END //

CREATE TRIGGER trg_ValidateCourseRating BEFORE INSERT ON COURSE_RATINGS FOR EACH ROW
BEGIN
    DECLARE v_status INT;
    SELECT completion_status INTO v_status FROM ENROLLMENTS WHERE student_id = NEW.student_id AND course_id = NEW.course_id;
    IF v_status IS NULL OR v_status != 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: You must complete the course before leaving a rating.';
    END IF;
END //

CREATE TRIGGER trg_ValidatePaymentAmount BEFORE INSERT ON TRANSACTIONS FOR EACH ROW
BEGIN
    DECLARE v_course_price DECIMAL(10, 2);
    SELECT price INTO v_course_price FROM COURSES WHERE course_id = NEW.course_id;
    IF NEW.price != v_course_price THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Transaction amount does not match the course price.';
    END IF;
END //

DELIMITER ;


-- =============================================================================
-- PART 3: DATA SEEDING (FULL DATASET: 10 Courses, 10 Students, 5 Instructors)
-- =============================================================================

-- 1. USERS (1 Admin + 5 Instructors + 10 Students)
-- Password '123456' hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.
INSERT INTO USERS (user_id, username, email, first_name, last_name, password, role, bank_name, payment_account) VALUES
                                                                                                                    ('ADM001', 'admin_hcmut', 'admin@hcmut.edu.vn', 'Quan', 'Admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 0, NULL, NULL),
-- 5 Instructors
                                                                                                                    ('INS001', 'thanhnv', 'thanh.nguyen@hcmut.edu.vn', 'Thanh', 'Nguyen Van', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 1, 'Vietcombank', '0071000123456'),
                                                                                                                    ('INS002', 'huonglt', 'huong.le@hcmut.edu.vn', 'Huong', 'Le Thi', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 1, 'TPBank', '000111222333'),
                                                                                                                    ('INS003', 'tunghv', 'tung.hoang@hcmut.edu.vn', 'Tung', 'Hoang Viet', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 1, 'Techcombank', '190333444555'),
                                                                                                                    ('INS004', 'minhpn', 'minh.pham@hcmut.edu.vn', 'Minh', 'Pham Nhat', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 1, 'MBBank', '999988887777'),
                                                                                                                    ('INS005', 'linhvo', 'linh.vo@hcmut.edu.vn', 'Linh', 'Vo Thuy', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 1, 'VIB', '888877776666'),
-- 10 Students
                                                                                                                    ('STU001', 'annguyen', 'an.nguyen@hcmut.edu.vn', 'An', 'Nguyen Van', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'Momo', '0909123456'),
                                                                                                                    ('STU002', 'binhtran', 'binh.tran@hcmut.edu.vn', 'Binh', 'Tran Thi', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'ViettelPay', '0987654321'),
                                                                                                                    ('STU003', 'cuongle', 'cuong.le@gmail.com', 'Cuong', 'Le Quoc', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'ZaloPay', '0918123123'),
                                                                                                                    ('STU004', 'dungpham', 'dung.pham@hcmut.edu.vn', 'Dung', 'Pham Tien', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'VietinBank', '1010101010'),
                                                                                                                    ('STU005', 'giangho', 'giang.ho@gmail.com', 'Giang', 'Ho Huong', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'Agribank', '220012341234'),
                                                                                                                    ('STU006', 'haivo', 'hai.vo@hcmut.edu.vn', 'Hai', 'Vo Thanh', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'BIDV', '370012341234'),
                                                                                                                    ('STU007', 'khanhdo', 'khanh.do@hcmut.edu.vn', 'Khanh', 'Do Duy', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'ACB', '1010109999'),
                                                                                                                    ('STU008', 'lannguyen', 'lan.nguyen@gmail.com', 'Lan', 'Nguyen Ngoc', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'Sacombank', '601100001111'),
                                                                                                                    ('STU009', 'minhvu', 'minh.vu@hcmut.edu.vn', 'Minh', 'Vu Duc', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'VIB', '411122223333'),
                                                                                                                    ('STU010', 'nambuu', 'nam.buu@hcmut.edu.vn', 'Nam', 'Buu Hoang', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4hFz6qYh.', 2, 'VPBank', '0908777666');

-- 2. INHERITANCE TABLES
INSERT INTO ADMINS (admin_id) VALUES ('ADM001');

INSERT INTO INSTRUCTORS (instructor_id, teaching_field, bio) VALUES
                                                                 ('INS001', 'Khoa Hoc May Tinh', 'Tien si KHMT tu Phap, chuyen gia AI & Machine Learning.'),
                                                                 ('INS002', 'Cong Nghe Phan Mem', 'Chuyen gia Fullstack Developer, 10 nam kinh nghiem tai FPT.'),
                                                                 ('INS003', 'He Thong Thong Tin', 'Nghien cuu ve Big Data va Data Mining tai Vien CNTT.'),
                                                                 ('INS004', 'Mang May Tinh', 'Chung chi CISSP, CEH. Chuyen gia bao mat he thong.'),
                                                                 ('INS005', 'Design & UI/UX', 'Art Director tai cty Product hang dau Viet Nam.');

INSERT INTO STUDENTS (student_id, enrollment_date) VALUES
                                                       ('STU001', '2023-09-01'), ('STU002', '2023-09-05'), ('STU003', '2023-09-10'), ('STU004', '2023-09-12'), ('STU005', '2023-10-01'),
                                                       ('STU006', '2023-10-05'), ('STU007', '2023-10-15'), ('STU008', '2023-11-01'), ('STU009', '2023-11-05'), ('STU010', '2023-11-10');

-- 3. TOPICS
INSERT INTO TOPICS (topic_id, topic_name, description) VALUES
                                                           ('TOP001', 'Lap Trinh', 'Nen tang lap trinh C++, Java, Python.'),
                                                           ('TOP002', 'Web Development', 'Frontend (React/Vue), Backend (Node/Go).'),
                                                           ('TOP003', 'Data Science', 'Machine Learning, Deep Learning, Statistics.'),
                                                           ('TOP004', 'Database', 'SQL, NoSQL, Database Design.'),
                                                           ('TOP005', 'Networking', 'Security, Cloud Computing, DevOps.'),
                                                           ('TOP006', 'Design', 'UI/UX Design, Graphic Design.');

-- 4. COURSES (10 Courses)
-- Note: total_lectures & total_tests are updated automatically by triggers.
INSERT INTO COURSES (course_id, course_name, description, language, price, min_score, level) VALUES
                                                                                                 ('COU001', 'Nhap Mon Lap Trinh C++', 'Khoa hoc nen tang cho nguoi moi bat dau.', 'Tieng Viet', 500000.00, 50, 0),
                                                                                                 ('COU002', 'Java Core & OOP', 'Lap trinh huong doi tuong voi Java.', 'Tieng Viet', 600000.00, 50, 1),
                                                                                                 ('COU003', 'Fullstack Web with React & Node', 'Xay dung ung dung web hoan chinh.', 'Tieng Anh', 1500000.00, 60, 2),
                                                                                                 ('COU004', 'Database Design Masterclass', 'Thiet ke CSDL chuan va toi uu.', 'Tieng Viet', 700000.00, 50, 1),
                                                                                                 ('COU005', 'Python for Data Science', 'Phan tich du lieu voi Pandas va NumPy.', 'Tieng Anh', 1000000.00, 65, 1),
                                                                                                 ('COU006', 'Introduction to AI', 'Nhap mon Tri tue nhan tao.', 'Tieng Anh', 1200000.00, 70, 2),
                                                                                                 ('COU007', 'Networking Essentials', 'Mang may tinh can ban.', 'Tieng Viet', 600000.00, 50, 0),
                                                                                                 ('COU008', 'AWS Cloud Practitioner', 'Luyen thi chung chi AWS.', 'Tieng Anh', 2000000.00, 75, 2),
                                                                                                 ('COU009', 'DevOps Fundamentals', 'Docker, Kubernetes, CI/CD.', 'Tieng Anh', 1800000.00, 70, 2),
                                                                                                 ('COU010', 'UI/UX Design for Beginners', 'Thiet ke giao dien nguoi dung.', 'Tieng Viet', 900000.00, 60, 0);

-- 5. LINKING (Course - Instructor & Course - Topic)
INSERT INTO COURSE_INSTRUCTORS (course_id, instructor_id, is_main_instructor) VALUES
                                                                                  ('COU001', 'INS001', 1), ('COU002', 'INS001', 1),
                                                                                  ('COU003', 'INS002', 1), ('COU009', 'INS002', 0),
                                                                                  ('COU004', 'INS003', 1), ('COU005', 'INS003', 1),
                                                                                  ('COU006', 'INS001', 1),
                                                                                  ('COU007', 'INS004', 1), ('COU008', 'INS004', 1), ('COU009', 'INS004', 1),
                                                                                  ('COU010', 'INS005', 1);

INSERT INTO COURSE_TOPICS (course_id, topic_id) VALUES
                                                    ('COU001', 'TOP001'), ('COU002', 'TOP001'),
                                                    ('COU003', 'TOP002'), ('COU004', 'TOP004'),
                                                    ('COU005', 'TOP003'), ('COU006', 'TOP003'),
                                                    ('COU007', 'TOP005'), ('COU008', 'TOP005'), ('COU009', 'TOP005'),
                                                    ('COU010', 'TOP006');

-- 6. SECTIONS
INSERT INTO SECTIONS (section_id, course_id, section_name, section_order) VALUES
                                                                              ('SEC001', 'COU001', 'Intro to C++', 1), ('SEC002', 'COU001', 'Loops & Arrays', 2),
                                                                              ('SEC003', 'COU002', 'Java Basics', 1),
                                                                              ('SEC004', 'COU003', 'React Hooks', 1),
                                                                              ('SEC005', 'COU004', 'ERD Modeling', 1),
                                                                              ('SEC006', 'COU005', 'NumPy Basics', 1),
                                                                              ('SEC007', 'COU006', 'Machine Learning Algorithms', 1),
                                                                              ('SEC008', 'COU008', 'EC2 & S3', 1),
                                                                              ('SEC009', 'COU009', 'Docker Basics', 1),
                                                                              ('SEC010', 'COU010', 'Figma Basics', 1);

-- 7. LECTURES
INSERT INTO LECTURES (lecture_id, section_id, lecture_name, link, duration_minutes) VALUES
                                                                                        ('LEC001', 'SEC001', 'Setup Environment', 'url', 15), ('LEC002', 'SEC001', 'Hello World', 'url', 10),
                                                                                        ('LEC003', 'SEC002', 'For Loop', 'url', 20), ('LEC004', 'SEC002', 'While Loop', 'url', 15),
                                                                                        ('LEC005', 'SEC003', 'OOP Concepts', 'url', 30),
                                                                                        ('LEC006', 'SEC004', 'UseState', 'url', 25),
                                                                                        ('LEC007', 'SEC005', 'Relationships', 'url', 40),
                                                                                        ('LEC008', 'SEC006', 'Arrays', 'url', 20),
                                                                                        ('LEC009', 'SEC008', 'Launching Instances', 'url', 35),
                                                                                        ('LEC010', 'SEC010', 'Wireframing', 'url', 45);

-- 8. TESTS
INSERT INTO TESTS (test_id, section_id, test_name, max_attempts, time_limit_minutes, score) VALUES
                                                                                                ('TST001', 'SEC002', 'C++ Basics Quiz', 3, 30, 100),
                                                                                                ('TST002', 'SEC003', 'Java Quiz', 2, 20, 100),
                                                                                                ('TST003', 'SEC004', 'React Quiz', 3, 15, 10),
                                                                                                ('TST004', 'SEC005', 'DB Design Exam', 1, 60, 100);

-- 9. QUESTIONS
INSERT INTO QUESTIONS (question_id, test_id, content, type, correct_answer) VALUES
                                                                                ('QUE001', 'TST001', 'Main function?', 'multiple_choice', 'main()'),
                                                                                ('QUE002', 'TST001', 'Semicolon needed?', 'true_false', 'True'),
                                                                                ('QUE003', 'TST003', 'Hooks rules?', 'short_answer', 'Top level'),
                                                                                ('QUE004', 'TST004', 'Primary key unique?', 'true_false', 'True');

INSERT INTO QUESTION_CHOICES (choice_id, question_id, wrong_choice) VALUES
                                                                        ('CHO001', 'QUE001', 'start()'), ('CHO002', 'QUE001', 'init()'),
                                                                        ('CHO003', 'QUE004', 'False');

-- 10. ENROLLMENTS & TRANSACTIONS (Complex Data)
-- STU001: 2 Completed, 1 In Progress
INSERT INTO ENROLLMENTS (student_id, course_id, enrollment_date, completion_status) VALUES
                                                                                        ('STU001', 'COU001', '2023-09-10', 1), ('STU001', 'COU004', '2023-09-15', 1), ('STU001', 'COU008', '2023-10-01', 0);
INSERT INTO TRANSACTIONS (transaction_id, student_id, course_id, instructor_id, price, payment_status) VALUES
                                                                                                           ('TRN001', 'STU001', 'COU001', 'INS001', 500000, 'completed'), ('TRN002', 'STU001', 'COU004', 'INS003', 700000, 'completed'), ('TRN003', 'STU001', 'COU008', 'INS004', 2000000, 'completed');

-- STU002: 1 Completed
INSERT INTO ENROLLMENTS (student_id, course_id, enrollment_date, completion_status) VALUES ('STU002', 'COU001', '2023-09-12', 1);
INSERT INTO TRANSACTIONS (transaction_id, student_id, course_id, instructor_id, price, payment_status) VALUES ('TRN004', 'STU002', 'COU001', 'INS001', 500000, 'completed');

-- STU003: 1 Pending Payment
INSERT INTO ENROLLMENTS (student_id, course_id, enrollment_date, completion_status) VALUES ('STU003', 'COU003', '2023-10-01', 0);
INSERT INTO TRANSACTIONS (transaction_id, student_id, course_id, instructor_id, price, payment_status) VALUES ('TRN005', 'STU003', 'COU003', 'INS002', 1500000, 'pending');

-- Other Students
INSERT INTO ENROLLMENTS (student_id, course_id, enrollment_date, completion_status) VALUES
                                                                                        ('STU004', 'COU002', '2023-09-20', 1),
                                                                                        ('STU005', 'COU005', '2023-10-10', 0),
                                                                                        ('STU006', 'COU006', '2023-10-12', 1),
                                                                                        ('STU007', 'COU009', '2023-11-01', 0),
                                                                                        ('STU008', 'COU010', '2023-11-05', 1),
                                                                                        ('STU009', 'COU007', '2023-11-06', 0),
                                                                                        ('STU010', 'COU003', '2023-11-10', 1);

INSERT INTO TRANSACTIONS (transaction_id, student_id, course_id, instructor_id, price, payment_status) VALUES
                                                                                                           ('TRN006', 'STU004', 'COU002', 'INS001', 600000, 'completed'),
                                                                                                           ('TRN007', 'STU005', 'COU005', 'INS003', 1000000, 'completed'),
                                                                                                           ('TRN008', 'STU006', 'COU006', 'INS001', 1200000, 'completed'),
                                                                                                           ('TRN009', 'STU007', 'COU009', 'INS004', 1800000, 'completed'),
                                                                                                           ('TRN010', 'STU008', 'COU010', 'INS005', 900000, 'completed'),
                                                                                                           ('TRN011', 'STU009', 'COU007', 'INS004', 600000, 'failed'), -- Failed Transaction
                                                                                                           ('TRN012', 'STU010', 'COU003', 'INS002', 1500000, 'completed');

-- 11. RATINGS (Valid ratings for completed courses)
INSERT INTO COURSE_RATINGS (student_id, course_id, rating, comment, rating_date) VALUES
                                                                                     ('STU001', 'COU001', 5, 'Great course!', '2023-10-01'),
                                                                                     ('STU002', 'COU001', 4, 'Good content.', '2023-10-02'),
                                                                                     ('STU001', 'COU004', 5, 'Very detailed.', '2023-10-05'),
                                                                                     ('STU004', 'COU002', 4, 'Java is hard but fun.', '2023-10-10'),
                                                                                     ('STU006', 'COU006', 5, 'AI is the future!', '2023-11-01'),
                                                                                     ('STU008', 'COU010', 3, 'Needs more examples.', '2023-11-15'),
                                                                                     ('STU010', 'COU003', 5, 'Best web course.', '2023-11-20');

-- 12. CERTIFICATES & RESULTS
INSERT INTO CERTIFICATES (certificate_id, student_id, course_id, issued_date) VALUES
                                                                                  ('CER001', 'STU001', 'COU001', '2023-10-02'),
                                                                                  ('CER002', 'STU001', 'COU004', '2023-10-06'),
                                                                                  ('CER003', 'STU004', 'COU002', '2023-10-11');

INSERT INTO TEST_RESULTS (result_id, student_id, test_id, actual_score, start_time, status) VALUES
                                                                                                ('RES001', 'STU001', 'TST001', 95, NOW(), 2),
                                                                                                ('RES002', 'STU002', 'TST001', 80, NOW(), 2);

-- =============================================================================
-- PART 4: STORED PROCEDURES & FUNCTIONS
-- =============================================================================

DELIMITER //

-- Function 1: Get Total System Revenue (Completed Only)
CREATE FUNCTION f_GetTotalSystemRevenue() RETURNS DECIMAL(15, 2) READS SQL DATA
BEGIN
    DECLARE v_total DECIMAL(15, 2);
    SELECT SUM(price) INTO v_total FROM TRANSACTIONS WHERE payment_status = 'completed';
    RETURN IFNULL(v_total, 0.00);
END //

-- Function 2: Get System Average Rating
CREATE FUNCTION f_GetAverageRatingAllCourses() RETURNS DECIMAL(3, 1) READS SQL DATA
BEGIN
    DECLARE v_avg DECIMAL(3, 1);
    SELECT AVG(rating) INTO v_avg FROM COURSE_RATINGS;
    RETURN IFNULL(v_avg, 0.0);
END //

-- Function 3: Get Student Grade Classification
CREATE FUNCTION f_GetStudentGrade(p_score DECIMAL(5,2)) RETURNS VARCHAR(20) DETERMINISTIC
BEGIN
    IF p_score < 0 OR p_score > 100 THEN RETURN 'Invalid'; END IF; -- Scale 100
    IF p_score >= 90 THEN RETURN 'Excellent';
    ELSEIF p_score >= 80 THEN RETURN 'Good';
    ELSEIF p_score >= 65 THEN RETURN 'Fair';
    ELSEIF p_score >= 50 THEN RETURN 'Average';
    ELSE RETURN 'Failed'; END IF;
END //

-- Procedure 1: Safe Delete User
CREATE PROCEDURE sp_DeleteUser(IN p_id VARCHAR(20))
BEGIN
    DECLARE v_count INT;
    SELECT COUNT(*) INTO v_count FROM USERS WHERE user_id = p_id;
    IF v_count = 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found'; END IF;
    START TRANSACTION;
    DELETE FROM CERTIFICATES WHERE student_id = p_id;
    DELETE FROM TRANSACTIONS WHERE student_id = p_id OR instructor_id = p_id;
    DELETE FROM USERS WHERE user_id = p_id;
    COMMIT;
END //

-- Procedure 2: Safe Delete Course
CREATE PROCEDURE sp_DeleteCourse(IN p_id VARCHAR(20))
BEGIN
    DECLARE v_count INT;
    SELECT COUNT(*) INTO v_count FROM COURSES WHERE course_id = p_id;
    IF v_count = 0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Course not found'; END IF;
    START TRANSACTION;
    DELETE FROM CERTIFICATES WHERE course_id = p_id;
    DELETE FROM TRANSACTIONS WHERE course_id = p_id;
    DELETE FROM COURSES WHERE course_id = p_id;
    COMMIT;
END //

-- Procedure 3: Get Dashboard Stats (All-in-One)
CREATE PROCEDURE sp_GetDashboardSummary(IN p_year INT)
BEGIN
    IF p_year IS NULL THEN SET p_year = YEAR(CURRENT_DATE); END IF;
    SELECT
        (SELECT IFNULL(SUM(t.price), 0) FROM TRANSACTIONS t WHERE YEAR(t.transaction_date) = p_year AND t.payment_status = 'completed') AS total_revenue,
        (SELECT COUNT(*) FROM COURSES) AS total_courses,
        (SELECT COUNT(*) FROM STUDENTS) AS total_students,
        (SELECT COUNT(*) FROM INSTRUCTORS) AS total_instructors,
        (SELECT IFNULL(ROUND(AVG(rating), 1), 0.0) FROM COURSE_RATINGS) AS avg_rating;
END //

-- Procedure 4: Filter Courses by Star Rating
CREATE PROCEDURE sp_FilterCoursesByRating(IN p_min_rating DECIMAL(3, 1))
BEGIN
    IF p_min_rating < 0 OR p_min_rating > 5 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid rating'; END IF;
    SELECT c.course_id, c.course_name, COUNT(r.student_id) AS reviews, ROUND(AVG(r.rating), 1) AS avg_rating
    FROM COURSES c JOIN COURSE_RATINGS r ON c.course_id = r.course_id
    GROUP BY c.course_id, c.course_name
    HAVING avg_rating >= p_min_rating
    ORDER BY avg_rating DESC;
END //

-- Procedure 5: Get Best Selling Courses
CREATE PROCEDURE sp_GetBestSellingCoursesByYear(IN p_year INT)
BEGIN
    DECLARE v_max DECIMAL(15, 2) DEFAULT 0;
    IF p_year IS NULL THEN SET p_year = YEAR(CURRENT_DATE); END IF;
    SELECT IFNULL(MAX(total), 0) INTO v_max FROM (SELECT SUM(price) as total FROM TRANSACTIONS WHERE YEAR(transaction_date) = p_year AND payment_status = 'completed' GROUP BY course_id) AS sub;
    IF v_max > 0 THEN
        SELECT c.course_id, c.course_name, SUM(t.price) AS revenue
        FROM COURSES c JOIN TRANSACTIONS t ON c.course_id = t.course_id
        WHERE YEAR(t.transaction_date) = p_year AND t.payment_status = 'completed'
        GROUP BY c.course_id, c.course_name HAVING revenue = v_max;
    ELSE SELECT 'No data' as message; END IF;
END //

-- Procedure 6: Get Student Details
CREATE PROCEDURE sp_GetStudentDetails(IN p_student_id VARCHAR(20))
BEGIN
    IF NOT EXISTS (SELECT 1 FROM STUDENTS WHERE student_id = p_student_id) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student not found'; END IF;
    SELECT CONCAT(u.last_name, ' ', u.first_name) AS student_name, u.username, u.email, s.enrollment_date,
           (SELECT COUNT(*) FROM ENROLLMENTS e WHERE e.student_id = s.student_id) AS total_courses,
           (SELECT COUNT(*) FROM CERTIFICATES cer WHERE cer.student_id = s.student_id) AS total_certificates,
           (SELECT COUNT(*) FROM ENROLLMENTS e WHERE e.student_id = s.student_id AND e.completion_status = 1) AS total_completed,
           (SELECT IFNULL(SUM(c.total_duration), 0) FROM ENROLLMENTS e JOIN COURSES c ON e.course_id = c.course_id WHERE e.student_id = s.student_id) AS total_learning_duration
    FROM STUDENTS s JOIN USERS u ON s.student_id = u.user_id WHERE s.student_id = p_student_id;
END //

-- Procedure 7: Get Instructor Details
CREATE PROCEDURE sp_GetInstructorDetails(IN p_instructor_id VARCHAR(20))
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INSTRUCTORS WHERE instructor_id = p_instructor_id) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Instructor not found'; END IF;
    SELECT CONCAT(u.last_name, ' ', u.first_name) AS instructor_name, u.username, u.email, i.bio, i.teaching_field,
           (SELECT COUNT(*) FROM COURSE_INSTRUCTORS ci WHERE ci.instructor_id = i.instructor_id) AS total_courses,
           (SELECT COUNT(DISTINCT e.student_id) FROM ENROLLMENTS e JOIN COURSE_INSTRUCTORS ci ON e.course_id = ci.course_id WHERE ci.instructor_id = i.instructor_id) AS total_students,
           (SELECT IFNULL(SUM(price), 0) FROM TRANSACTIONS WHERE instructor_id = i.instructor_id AND payment_status = 'completed') AS total_revenue,
           (SELECT IFNULL(ROUND(AVG(r.rating), 1), 0.0) FROM COURSE_RATINGS r JOIN COURSE_INSTRUCTORS ci ON r.course_id = ci.course_id WHERE ci.instructor_id = i.instructor_id) AS avg_rating
    FROM INSTRUCTORS i JOIN USERS u ON i.instructor_id = u.user_id WHERE i.instructor_id = p_instructor_id;
END //

-- Procedure 8: Get Course Details
CREATE PROCEDURE sp_GetCourseDetails(IN p_course_id VARCHAR(20))
BEGIN
    IF NOT EXISTS (SELECT 1 FROM COURSES WHERE course_id = p_course_id) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Course not found'; END IF;
    SELECT c.course_name, c.language, c.min_score, c.description,
           (SELECT GROUP_CONCAT(t.topic_name SEPARATOR ', ') FROM TOPICS t JOIN COURSE_TOPICS ct ON t.topic_id = ct.topic_id WHERE ct.course_id = c.course_id) AS topics,
           (SELECT COUNT(*) FROM ENROLLMENTS e WHERE e.course_id = c.course_id) AS total_students,
           (SELECT IFNULL(SUM(price), 0) FROM TRANSACTIONS tr WHERE tr.course_id = c.course_id AND tr.payment_status = 'completed') AS total_revenue,
           (SELECT COUNT(*) FROM COURSE_RATINGS cr WHERE cr.course_id = c.course_id) AS total_reviews,
           (SELECT IFNULL(ROUND(AVG(rating), 1), 0.0) FROM COURSE_RATINGS cr WHERE cr.course_id = c.course_id) AS avg_rating
    FROM COURSES c WHERE c.course_id = p_course_id;
END //

DELIMITER ;
