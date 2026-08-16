import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  scheduleInfo: {
    type: DataTypes.STRING, // e.g. "Mon/Wed 9:00 AM - 10:30 AM"
    allowNull: true
  },
  room: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default Class;
