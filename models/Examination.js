import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Examination = sequelize.define('Examination', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('midterm', 'final', 'quiz', 'other'),
    allowNull: false,
    defaultValue: 'quiz'
  },
  maxPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default Examination;
