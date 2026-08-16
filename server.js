import app from './app.js';
import sequelize from './config/database.js';
import { seedDatabase } from './db/seed.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const dbDir = path.resolve(__dirname, './db');
const dbPath = path.resolve(dbDir, 'edupulse.sqlite');

const startServer = async () => {
  try {
    // Ensure the db folder exists
    if (!fs.existsSync(dbDir)) {
      console.log('Creating database storage directory at:', dbDir);
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Check if database needs auto-seeding
    const dbExists = fs.existsSync(dbPath);

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    if (!dbExists) {
      console.log('No existing SQLite database file detected. Initializing with auto-seed data...');
      await seedDatabase();
    } else {
      // Sync schemas without overwriting data if already exists
      await sequelize.sync();
      console.log('Database tables successfully synchronized.');
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` EDUPULSE AI ACADEMIC BACKEND READY`);
      console.log(` Active Port: http://localhost:${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(` Mode: ${process.env.NODE_ENV || 'production'}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('CRITICAL: Failed to launch EduPulse Server:', error.message);
    process.exit(1);
  }
};

startServer();
