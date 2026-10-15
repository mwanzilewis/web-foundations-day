PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

-- 1. STUDENTS TABLE
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. COURSES TABLE
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);

-- 3. ENROLMENTS TABLE (join table)
CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    enrolled_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id)
);

-- SAMPLE DATA: 4 students (one will have no enrolment)
INSERT INTO students (name, email) VALUES
('Lewis Mwanzi', 'lewis.mwanzi@example.com'),
('Aisha Kamau', 'aisha.kamau@example.com'),
('Brian Otieno', 'brian.otieno@example.com'),
('Grace Wanjiku', 'grace.wanjiku@example.com');

INSERT INTO courses (title, code) VALUES
('Web Foundations', 'CS101'),
('Database Systems', 'CS202'),
('Data Structures', 'CS203');

INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'B'),
(1, 2, 'A'),
(2, 1, 'A'),
(2, 3, 'B+'),
(3, 2, 'C');

-- QUERY 1: All courses for one student (by name) - Lewis Mwanzi
SELECT c.title, c.code, e.grade
FROM students s
JOIN enrolments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id
WHERE s.name = 'Lewis Mwanzi';

-- QUERY 2: All students on one course - Web Foundations
SELECT s.name, s.email, e.grade
FROM courses c
JOIN enrolments e ON c.id = e.course_id
JOIN students s ON e.student_id = s.id
WHERE c.title = 'Web Foundations';

-- QUERY 3: Number of students per course
SELECT c.title, c.code, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.code;

-- QUERY 4: Students who have no enrolments
SELECT s.id, s.name, s.email
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.student_id IS NULL;

-- QUERY 5: Update one enrolment's grade (Lewis Mwanzi in Web Foundations to A)
UPDATE enrolments
SET grade = 'A'
WHERE student_id = (SELECT id FROM students WHERE name = 'Lewis Mwanzi')
AND course_id = (SELECT id FROM courses WHERE title = 'Web Foundations');

-- Verify update
SELECT * FROM enrolments;
