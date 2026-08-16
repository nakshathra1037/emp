import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ExamResult = sequelize.define('ExamResult', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  examinationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pointsObtained: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING(5), // e.g. "A+", "B", "F"
    allowNull: true
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default ExamResult;
