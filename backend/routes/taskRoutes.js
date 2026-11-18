const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateObjectId = require('../middleware/validateObjectId');
const {
  validateCreateTask,
  validateUpdateTask,
  validateTaskQuery,
} = require('../middleware/taskValidator');

// GET /tasks/stats - Aggregated metrics
router.get('/stats', taskController.getStats);

// GET /tasks/history/months - Available months with tasks
router.get('/history/months', taskController.getHistoryMonths);

// GET /tasks/history - Tasks grouped by date with optional ?year=&month=
router.get('/history', taskController.getHistory);

// POST /tasks - Create task with validation
router.post('/', validateCreateTask, taskController.createTask);

// GET /tasks - Get all tasks with query validation
router.get('/', validateTaskQuery, taskController.getTasks);

// PATCH /tasks/:id - Partial update (title, description, status, priority, assignedTo, dueDate)
router.patch('/:id', validateObjectId, validateUpdateTask, taskController.updateTask);

// DELETE /tasks/:id - Delete task
router.delete('/:id', validateObjectId, taskController.deleteTask);

module.exports = router;
