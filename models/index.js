import sequelize from '../config/database.js';
import User from './User.js';
import Student from './Student.js';
import Teacher from './Teacher.js';
import Admin from './Admin.js';
import Class from './Class.js';
import Course from './Course.js';
import Enrollment from './Enrollment.js';
import Assignment from './Assignment.js';
import AssignmentSubmission from './AssignmentSubmission.js';
import Attendance from './Attendance.js';
import Examination from './Examination.js';
import ExamResult from './ExamResult.js';
import AcademicRecord from './AcademicRecord.js';
import ActivityLog from './ActivityLog.js';

// Relations

// User -> Student / Teacher / Admin
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Teacher, { foreignKey: 'userId', onDelete: 'CASCADE' });
Teacher.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Admin, { foreignKey: 'userId', onDelete: 'CASCADE' });
Admin.belongsTo(User, { foreignKey: 'userId' });

// Class -> Student
Class.hasMany(Student, { foreignKey: 'classId', onDelete: 'SET NULL' });
Student.belongsTo(Class, { foreignKey: 'classId' });

// Teacher -> Course
Teacher.hasMany(Course, { foreignKey: 'teacherId', onDelete: 'SET NULL' });
Course.belongsTo(Teacher, { foreignKey: 'teacherId' });

// Student -> Enrollments -> Course
Student.hasMany(Enrollment, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Enrollment.belongsTo(Student, { foreignKey: 'studentId' });

Course.hasMany(Enrollment, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

// Course -> Assignment -> Submissions <- Student
Course.hasMany(Assignment, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Assignment.belongsTo(Course, { foreignKey: 'courseId' });

Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignmentId', onDelete: 'CASCADE' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId' });

Student.hasMany(AssignmentSubmission, { foreignKey: 'studentId', onDelete: 'CASCADE' });
AssignmentSubmission.belongsTo(Student, { foreignKey: 'studentId' });

// Course/Student -> Attendance
Student.hasMany(Attendance, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Course.hasMany(Attendance, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Attendance.belongsTo(Course, { foreignKey: 'courseId' });

// Course -> Examination -> Results <- Student
Course.hasMany(Examination, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Examination.belongsTo(Course, { foreignKey: 'courseId' });

Examination.hasMany(ExamResult, { foreignKey: 'examinationId', onDelete: 'CASCADE' });
ExamResult.belongsTo(Examination, { foreignKey: 'examinationId' });

Student.hasMany(ExamResult, { foreignKey: 'studentId', onDelete: 'CASCADE' });
ExamResult.belongsTo(Student, { foreignKey: 'studentId' });

// Student -> AcademicRecord
Student.hasMany(AcademicRecord, { foreignKey: 'studentId', onDelete: 'CASCADE' });
AcademicRecord.belongsTo(Student, { foreignKey: 'studentId' });

// User -> ActivityLog
User.hasMany(ActivityLog, { foreignKey: 'userId', onDelete: 'SET NULL' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

export {
  sequelize,
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
  AcademicRecord,
  ActivityLog
};
