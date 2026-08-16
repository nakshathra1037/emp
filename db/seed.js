import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';
import {
  User,
  Student,
  Teacher,
  Admin,
  Class,
  Course,
  Enrollment,
  Assignment,
  AssignmentSubmission,
  Attendance,
  Examination,
  ExamResult,
  AcademicRecord
} from '../models/index.js';

export const seedDatabase = async () => {
  try {
    // Force sync the database (clear existing tables)
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');

    // 1. Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 2. Create Users
    const users = await User.bulkCreate([
      { email: 'admin@edupulse.edu', passwordHash, role: 'admin' },
      { email: 'sarah.jenkins@edupulse.edu', passwordHash, role: 'teacher' },
      { email: 'teacher.jones@edupulse.edu', passwordHash, role: 'teacher' },
      { email: 'alex.mercer@edupulse.edu', passwordHash, role: 'student' },
      { email: 'student.bob@edupulse.edu', passwordHash, role: 'student' },
      { email: 'student.charlie@edupulse.edu', passwordHash, role: 'student' }
    ]);

    const adminUser = users[0];
    const teacherSmithUser = users[1]; // Sarah Jenkins
    const teacherJonesUser = users[2];
    const aliceUser = users[3]; // Alex Mercer
    const bobUser = users[4];
    const charlieUser = users[5];

    // 3. Create Admin Profile
    const admin = await Admin.create({
      userId: adminUser.id,
      firstName: 'Alice',
      lastName: 'Director',
      employeeId: 'ADM-001'
    });

    // 4. Create Teacher Profiles
    const smithTeacher = await Teacher.create({
      userId: teacherSmithUser.id,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      employeeId: 'TCH-101'
    });

    const jonesTeacher = await Teacher.create({
      userId: teacherJonesUser.id,
      firstName: 'Mary',
      lastName: 'Jones',
      employeeId: 'TCH-102'
    });

    // 5. Create Classes
    const classA = await Class.create({
      name: 'Class 2026-A',
      scheduleInfo: 'Mon-Fri 9:00 AM - 1:00 PM',
      room: 'Room 301'
    });

    const classB = await Class.create({
      name: 'Class 2026-B',
      scheduleInfo: 'Mon-Fri 1:00 PM - 5:00 PM',
      room: 'Room 302'
    });

    // 6. Create Student Profiles
    const alice = await Student.create({
      userId: aliceUser.id,
      firstName: 'Alex',
      lastName: 'Mercer',
      studentId: 'STU-1001',
      classId: classA.id
    });

    const bob = await Student.create({
      userId: bobUser.id,
      firstName: 'Bob',
      lastName: 'Miller',
      studentId: 'STU-1002',
      classId: classA.id
    });

    const charlie = await Student.create({
      userId: charlieUser.id,
      firstName: 'Charlie',
      lastName: 'Stone',
      studentId: 'STU-1003',
      classId: classA.id
    });

    // 7. Create Courses
    const math101 = await Course.create({
      name: 'Mathematics 101',
      code: 'MATH101',
      description: 'Algebra, Trigonometry, and introductory Calculus concepts.',
      teacherId: smithTeacher.id
    });

    const cs101 = await Course.create({
      name: 'Computer Science 101',
      code: 'CS101',
      description: 'Foundations of programming using Python and basic data structures.',
      teacherId: smithTeacher.id
    });

    const sci102 = await Course.create({
      name: 'Natural Sciences 102',
      code: 'SCI102',
      description: 'General Chemistry, Lab safety procedures, and mechanics.',
      teacherId: jonesTeacher.id
    });

    // 8. Enroll Students
    const studentIds = [alice.id, bob.id, charlie.id];
    const courseIds = [math101.id, cs101.id, sci102.id];

    for (const sId of studentIds) {
      for (const cId of courseIds) {
        await Enrollment.create({
          studentId: sId,
          courseId: cId,
          status: 'enrolled'
        });
      }
    }

    // 9. Create Course Assignments
    const mathAssignments = await Assignment.bulkCreate([
      { title: 'Algebra Practice Quiz', description: 'Solve quadratic equations and matrices.', maxPoints: 100, dueDate: new Date('2026-09-15'), courseId: math101.id },
      { title: 'Trigonometry Worksheet', description: 'Trigonometric identities and proofs.', maxPoints: 100, dueDate: new Date('2026-10-05'), courseId: math101.id },
      { title: 'Calculus Homework 1', description: 'Solve limits and derivative equations.', maxPoints: 100, dueDate: new Date('2026-11-20'), courseId: math101.id }
    ]);

    const csAssignments = await Assignment.bulkCreate([
      { title: 'Intro Python Syntax', description: 'Variables, loops, and function syntax.', maxPoints: 100, dueDate: new Date('2026-09-20'), courseId: cs101.id },
      { title: 'Binary Trees Assignment', description: 'Implement tree traversals (pre, post, in order).', maxPoints: 100, dueDate: new Date('2026-10-18'), courseId: cs101.id },
      { title: 'Database Design Normalization', description: 'Normalize tables up to 3NF schema.', maxPoints: 100, dueDate: new Date('2026-11-25'), courseId: cs101.id }
    ]);

    const sciAssignments = await Assignment.bulkCreate([
      { title: 'Lab Safety Guidelines Quiz', description: 'Safety rules and chemical handling protocols.', maxPoints: 100, dueDate: new Date('2026-09-10'), courseId: sci102.id },
      { title: 'Photosynthesis Experiment Report', description: 'Document steps and results of the plant light test.', maxPoints: 100, dueDate: new Date('2026-10-12'), courseId: sci102.id },
      { title: 'Mechanics & Friction Homework', description: 'Friction coefficients and free-body diagrams.', maxPoints: 100, dueDate: new Date('2026-11-15'), courseId: sci102.id }
    ]);

    // 10. Seed Assignment Submissions (with distinct performance metrics)
    // Alice: Excelled Student (Scores: 90-98%)
    // Bob: Average Student (Scores: 70-80%)
    // Charlie: At-Risk Student (Scores: 40-55%, and misses some)
    
    // Alice Submissions
    for (const a of [...mathAssignments, ...csAssignments, ...sciAssignments]) {
      await AssignmentSubmission.create({
        assignmentId: a.id,
        studentId: alice.id,
        submissionText: `Alice's complete answers for ${a.title}`,
        submissionUrl: `http://edupulse.edu/submissions/alice/${a.id}.pdf`,
        submittedAt: new Date(a.dueDate.getTime() - 24*60*60*1000), // Submitted 1 day early
        status: 'graded',
        pointsObtained: Math.floor(Math.random() * 9) + 90, // 90 to 98
        feedback: 'Excellent reasoning and presentation!',
        gradedBy: a.courseId === sci102.id ? jonesTeacher.id : smithTeacher.id
      });
    }

    // Bob Submissions
    for (const a of [...mathAssignments, ...csAssignments, ...sciAssignments]) {
      await AssignmentSubmission.create({
        assignmentId: a.id,
        studentId: bob.id,
        submissionText: `Bob's answers for ${a.title}. Tried all questions.`,
        submissionUrl: `http://edupulse.edu/submissions/bob/${a.id}.pdf`,
        submittedAt: new Date(a.dueDate.getTime() - 2*60*60*1000), // Submitted on time
        status: 'graded',
        pointsObtained: Math.floor(Math.random() * 11) + 70, // 70 to 80
        feedback: 'Good work. Some minor math errors, but overall correct direction.',
        gradedBy: a.courseId === sci102.id ? jonesTeacher.id : smithTeacher.id
      });
    }

    // Charlie Submissions
    // MATH assignments
    await AssignmentSubmission.create({
      assignmentId: mathAssignments[0].id,
      studentId: charlie.id,
      submissionText: 'Charlie submission for Quiz 1',
      submittedAt: mathAssignments[0].dueDate,
      status: 'graded',
      pointsObtained: 55, // Low grade
      feedback: 'Shows conceptual gaps. Please seek help.',
      gradedBy: smithTeacher.id
    });
    await AssignmentSubmission.create({
      assignmentId: mathAssignments[1].id,
      studentId: charlie.id,
      submissionText: 'Charlie submission for Worksheet 2',
      submittedAt: new Date(mathAssignments[1].dueDate.getTime() + 12*60*60*1000), // Submitted LATE
      status: 'graded',
      pointsObtained: 40, // Failing grade
      feedback: 'Very incomplete. Lateness penalty applied.',
      gradedBy: smithTeacher.id
    });
    // Missed MATH homework 3 (declining/incomplete record)

    // CS assignments
    await AssignmentSubmission.create({
      assignmentId: csAssignments[0].id,
      studentId: charlie.id,
      submissionText: 'Charlie python submission',
      submittedAt: csAssignments[0].dueDate,
      status: 'graded',
      pointsObtained: 60,
      feedback: 'Basic syntax passes, but logic is broken.',
      gradedBy: smithTeacher.id
    });
    await AssignmentSubmission.create({
      assignmentId: csAssignments[1].id,
      studentId: charlie.id,
      submissionText: 'Charlie Tree submission',
      submittedAt: new Date(csAssignments[1].dueDate.getTime() + 2*24*60*60*1000), // LATE
      status: 'graded',
      pointsObtained: 45,
      feedback: 'Missed implementing post-order traversal entirely.',
      gradedBy: smithTeacher.id
    });
    // Missed CS homework 3

    // SCI assignments
    await AssignmentSubmission.create({
      assignmentId: sciAssignments[0].id,
      studentId: charlie.id,
      submissionText: 'Charlie Safety answers',
      submittedAt: sciAssignments[0].dueDate,
      status: 'graded',
      pointsObtained: 50,
      feedback: 'Warning: Safe storage of reagents was answered incorrectly.',
      gradedBy: jonesTeacher.id
    });
    // Missed SCI experiment 2 & 3 (Severe Academic Risk!)

    // 11. Seed Attendance logs over a 10-day period
    const dates = [
      '2026-10-01', '2026-10-02', '2026-10-05', '2026-10-06', '2026-10-07',
      '2026-10-08', '2026-10-09', '2026-10-12', '2026-10-13', '2026-10-14'
    ];

    for (const dt of dates) {
      for (const cId of courseIds) {
        // Alice: 100% Present
        await Attendance.create({ studentId: alice.id, courseId: cId, date: dt, status: 'present' });

        // Bob: 80% Present, 10% Late, 10% Absent
        const bobRoll = Math.random();
        let bobStatus = 'present';
        if (bobRoll < 0.1) bobStatus = 'absent';
        else if (bobRoll < 0.2) bobStatus = 'late';
        await Attendance.create({ studentId: bob.id, courseId: cId, date: dt, status: bobStatus });

        // Charlie: 40% Present, 30% Absent, 30% Late (Irregular attendance!)
        const charlieRoll = Math.random();
        let charlieStatus = 'present';
        if (charlieRoll < 0.3) charlieStatus = 'absent';
        else if (charlieRoll < 0.6) charlieStatus = 'late';
        await Attendance.create({ studentId: charlie.id, courseId: cId, date: dt, status: charlieStatus });
      }
    }

    // 12. Create Examinations
    const midtermMath = await Examination.create({ name: 'Mathematics Midterm Exam', date: '2026-10-15', type: 'midterm', maxPoints: 100, courseId: math101.id });
    const midtermCS = await Examination.create({ name: 'Computer Science Midterm Exam', date: '2026-10-17', type: 'midterm', maxPoints: 100, courseId: cs101.id });
    const midtermSci = await Examination.create({ name: 'Natural Science Midterm Exam', date: '2026-10-20', type: 'midterm', maxPoints: 100, courseId: sci102.id });

    // 13. Seed Exam results
    // Alice Midterm (90s)
    await ExamResult.create({ examinationId: midtermMath.id, studentId: alice.id, pointsObtained: 94, grade: 'A', remarks: 'Superb calculus skills!' });
    await ExamResult.create({ examinationId: midtermCS.id, studentId: alice.id, pointsObtained: 96, grade: 'A+', remarks: 'Algorithm implementation was flawless.' });
    await ExamResult.create({ examinationId: midtermSci.id, studentId: alice.id, pointsObtained: 92, grade: 'A', remarks: 'Excellent lab comprehension.' });

    // Bob Midterm (70s)
    await ExamResult.create({ examinationId: midtermMath.id, studentId: bob.id, pointsObtained: 78, grade: 'B', remarks: 'Good trigonometry understanding, needs limit practice.' });
    await ExamResult.create({ examinationId: midtermCS.id, studentId: bob.id, pointsObtained: 82, grade: 'A', remarks: 'Python structures are correct, trees can improve.' });
    await ExamResult.create({ examinationId: midtermSci.id, studentId: bob.id, pointsObtained: 74, grade: 'B', remarks: 'Well structured lab answers.' });

    // Charlie Midterm (Fails / Low Marks - Academic Risk!)
    await ExamResult.create({ examinationId: midtermMath.id, studentId: charlie.id, pointsObtained: 46, grade: 'F', remarks: 'Fails to solve basic matrix transformations.' });
    await ExamResult.create({ examinationId: midtermCS.id, studentId: charlie.id, pointsObtained: 52, grade: 'D', remarks: 'Unclear coding style. Basic syntactical errors.' });
    await ExamResult.create({ examinationId: midtermSci.id, studentId: charlie.id, pointsObtained: 40, grade: 'F', remarks: 'Failed to answer 5 out of 10 physics friction questions.' });

    // 14. Seed Academic Records (Historical GPAs)
    await AcademicRecord.bulkCreate([
      { studentId: alice.id, term: 'Spring 2026', overallGpa: 3.95 },
      { studentId: bob.id, term: 'Spring 2026', overallGpa: 3.10 },
      { studentId: charlie.id, term: 'Spring 2026', overallGpa: 2.10 } // Already low historic grade, now declining!
    ]);

    console.log('Seeding finished successfully. Realistic data models successfully populated.');
  } catch (error) {
    console.error('Error seeding SQLite database:', error.message);
    throw error;
  }
};

// If run directly from terminal
if (process.argv[1] && (process.argv[1].endsWith('seed.js') || process.argv[1].endsWith('seed'))) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
