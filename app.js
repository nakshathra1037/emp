import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Global Middleware Configuration
app.use(cors({
  origin: '*', // Allow all origins for local hackathon development & cross-origin testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Public API Health Check & Home route
app.get('/', (req, res) => {
  return res.status(200).json({
    portalName: 'EduPulse AI Academic Portal Backend',
    version: '1.0.0',
    status: 'ONLINE',
    description: 'AI-Powered Education Management Portal API Engine. Features custom Academic Intelligence analytics, Gemini AI integration, deterministic fallback diagnostics, and role-based access control.',
    endpointsSummary: {
      auth: '/api/auth',
      courses: '/api/courses',
      student: '/api/student',
      teacher: '/api/teacher',
      admin: '/api/admin',
      ai: '/api/ai'
    }
  });
});

app.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Resource not found: ${req.originalUrl}` });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error occurred.';
  
  res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
