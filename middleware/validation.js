/**
 * Middleware wrapper for input validation.
 * Takes a schema object or a validator function and runs it against req.body.
 */
export const validateBody = (validateFn) => {
  return (req, res, next) => {
    const errors = validateFn(req.body);
    if (errors && Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Validation failed', validationErrors: errors });
    }
    next();
  };
};

// Auth Validators
export const validateLogin = (body) => {
  const errors = {};
  const { email, password } = body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.email = 'A valid email address is required.';
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.password = 'Password is required and must be at least 6 characters.';
  }

  return errors;
};

// Assignment Validators
export const validateAssignment = (body) => {
  const errors = {};
  const { title, dueDate, maxPoints } = body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.title = 'Assignment title is required.';
  }
  if (!dueDate || isNaN(Date.parse(dueDate))) {
    errors.dueDate = 'A valid future due date is required.';
  }
  if (maxPoints === undefined || typeof maxPoints !== 'number' || maxPoints <= 0) {
    errors.maxPoints = 'Max points must be a number greater than 0.';
  }

  return errors;
};

// Attendance Validators
export const validateAttendance = (body) => {
  const errors = {};
  const { studentId, courseId, date, status } = body;

  if (!studentId || typeof studentId !== 'number') {
    errors.studentId = 'Student ID is required and must be a number.';
  }
  if (!courseId || typeof courseId !== 'number') {
    errors.courseId = 'Course ID is required and must be a number.';
  }
  if (!date || isNaN(Date.parse(date))) {
    errors.date = 'A valid date (YYYY-MM-DD) is required.';
  }
  if (!status || !['present', 'absent', 'late'].includes(status)) {
    errors.status = "Attendance status must be one of: 'present', 'absent', 'late'.";
  }

  return errors;
};

// Marks / Exam Results Validators
export const validateExamMarks = (body) => {
  const errors = {};
  const { studentId, examinationId, pointsObtained } = body;

  if (!studentId || typeof studentId !== 'number') {
    errors.studentId = 'Student ID is required and must be a number.';
  }
  if (!examinationId || typeof examinationId !== 'number') {
    errors.examinationId = 'Examination ID is required and must be a number.';
  }
  if (pointsObtained === undefined || typeof pointsObtained !== 'number' || pointsObtained < 0) {
    errors.pointsObtained = 'Points obtained must be a number greater than or equal to 0.';
  }

  return errors;
};
