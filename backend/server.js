const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDb } = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Middleware
app.use(
  cors({
    origin: CLIENT_URL === '*' ? '*' : [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Favicon handler
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes (supporting both /tasks and /api/tasks)
app.use('/tasks', taskRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource not found on endpoint: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`TaskFlow Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server due to database connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app;
