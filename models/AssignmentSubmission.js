import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  assignmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  submissionText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submissionUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('submitted', 'graded'),
    allowNull: false,
    defaultValue: 'submitted'
  },
  pointsObtained: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gradedBy: {
    type: DataTypes.INTEGER, // Teacher ID who graded it
    allowNull: true
  }
});

export default AssignmentSubmission;
