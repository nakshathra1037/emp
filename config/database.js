import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store SQLite database in a db directory under workspace root
const dbPath = path.resolve(__dirname, '../db/edupulse.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Set to console.log for SQL query debugging
  define: {
    timestamps: true,
    underscored: true // Use snake_case in tables for cleaner database standard
  }
});

export default sequelize;
