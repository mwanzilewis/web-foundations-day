# School Database Design

## 1. Tables Explanation

### students
Holds the person who learns. Fields: `id` PK auto-increment, `name` NOT NULL, `email` NOT NULL UNIQUE. UNIQUE prevents duplicate accounts.

### courses
Holds the subject offered. Fields: `id` PK, `title` NOT NULL, `code` UNIQUE NOT NULL like CS101. Code unique so we don't create same course twice.

### enrolments
Holds the fact that a student is enrolled on a course. Fields: `id` PK, `student_id` FK -> students(id), `course_id` FK -> courses(id), `grade` TEXT (e.g., A, B+), `enrolled_at`. It has `UNIQUE(student_id, course_id)` to prevent same student enrolling same course twice, and FOREIGN KEYs with ON DELETE CASCADE.

## 2. Relationships

- **students -> enrolments: One-to-Many.** One student can have many enrolment rows.
- **courses -> enrolments: One-to-Many.** One course can have many enrolment rows.
- **students <-> courses: Many-to-Many.** One student takes many courses, one course has many students. We cannot store this directly with two tables, so we need a **join table** (enrolments). The join table breaks the many-to-many into two one-to-many relationships and lets us store extra data like grade and enrollment date.

Why join table is needed: Without it we would have to store an array of course_ids in students or student_ids in courses, which violates 1NF, is hard to query, and cannot store grade per enrollment.

## 3. Index

**Index I would add:**
```sql
CREATE INDEX idx_enrolments_student_id ON enrolments(student_id);
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);
