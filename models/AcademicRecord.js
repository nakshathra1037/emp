import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AcademicRecord = sequelize.define('AcademicRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  term: {
    type: DataTypes.STRING,
    allowNull: false // e.g. "Fall 2026"
  },
  overallGpa: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  computedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

export default AcademicRecord;
