const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: '../.env' });

const logger = require('./utils/logger');

// Import routes
const curriculumRoutes = require('./routes/curriculumRoutes');
const quizRoutes = require('./routes/quizRoutes');
const gradingRoutes = require('./routes/gradingRoutes');
const translatorRoutes = require('./routes/translatorRoutes');
const slideRoutes = require('./routes/slideRoutes');
const mindmapRoutes = require('./routes/mindmapRoutes');
const lecturePlanRoutes = require('./routes/lecturePlanRoutes');
//

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/grading', gradingRoutes);
app.use('/api/translate', translatorRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/mindmap', mindmapRoutes);
app.use('/api/lecture-plan', lecturePlanRoutes);
//

// AI Service health check proxy
app.get('/api/ai-health', async (req, res) => {
  try {
    const axios = require('axios');
    const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
    const response = await axios.get(`${aiUrl.replace(/\/$/, '')}/health`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    res.json({ status: 'online', aiService: response.data });
  } catch (error) {
    console.log('AI Service health check failed:', error.message);
    res.status(503).json({ status: 'offline', error: error.message });
  }
});

// Orchestrated preflight: checks backend routes and AI connectivity
app.get('/api/preflight', async (req, res) => {
  const axios = require('axios');
  const aiUrl = (process.env.AI_SERVICE_URL || 'http://localhost:8001').replace(/\/$/, '');
  const results = {};
  const tasks = [
    { key: 'aiHealth', fn: () => axios.get(`${aiUrl}/health`, { timeout: 8000 }) },
  ];
  for (const t of tasks) {
    try {
      const r = await t.fn();
      results[t.key] = { ok: true, data: r.data };
    } catch (e) {
      results[t.key] = { ok: false, error: e.message };
    }
  }
  const ok = Object.values(results).every(r => r.ok);
  res.status(ok ? 200 : 503).json({ success: ok, results });
});

// Static files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;