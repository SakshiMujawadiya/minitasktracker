const Task = require('../models/Task');

const ALLOWED_UPDATE_FIELDS = ['title', 'description', 'status', 'priority', 'assignedTo', 'dueDate'];

/**
 * Validate POST /tasks request body
 */
const validateCreateTask = (req, res, next) => {
  const { title, status = 'todo', priority = 'medium' } = req.body || {};

  // Title presence and type
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Task title is required and cannot be empty',
    });
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Task title cannot exceed 100 characters',
    });
  }

  // Status validation
  const normalizedStatus = Task.normalizeStatus(status);
  if (!Task.VALID_STATUSES.includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${Task.VALID_STATUSES.join(', ')}`,
    });
  }

  // Priority validation
  const normalizedPriority = Task.normalizePriority(priority);
  if (!Task.VALID_PRIORITIES.includes(normalizedPriority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Must be one of: ${Task.VALID_PRIORITIES.join(', ')}`,
    });
  }

  next();
};

/**
 * Validate PATCH /tasks/:id request body
 * Supports partial updates: title, description, status, priority
 */
const validateUpdateTask = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Request body must be a valid JSON object',
    });
  }

  const keys = Object.keys(req.body);
  if (keys.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one field (title, description, status, priority, assignedTo, or dueDate) must be provided for update',
    });
  }

  // Reject unexpected or prohibited fields
  const unexpectedKeys = keys.filter((key) => !ALLOWED_UPDATE_FIELDS.includes(key));
  if (unexpectedKeys.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Only supported fields (${ALLOWED_UPDATE_FIELDS.join(', ')}) can be updated. Unexpected fields: ${unexpectedKeys.join(', ')}`,
    });
  }

  const { title, status, priority, dueDate } = req.body;

  // Title validation if present
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot be empty',
      });
    }
    if (title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot exceed 100 characters',
      });
    }
  }

  // Status validation if present
  if (status !== undefined) {
    if (typeof status !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Status must be a valid string',
      });
    }
    const normalizedStatus = Task.normalizeStatus(status);
    if (!Task.VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${Task.VALID_STATUSES.join(', ')}`,
      });
    }
  }

  // Priority validation if present
  if (priority !== undefined) {
    if (typeof priority !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Priority must be a valid string',
      });
    }
    const normalizedPriority = Task.normalizePriority(priority);
    if (!Task.VALID_PRIORITIES.includes(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority. Must be one of: ${Task.VALID_PRIORITIES.join(', ')}`,
      });
    }
  }

  // dueDate validation if present (must be a valid ISO date string or null)
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsed = new Date(dueDate);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'dueDate must be a valid date string',
      });
    }
  }

  next();
};

/**
 * Validate GET /tasks query params
 */
const validateTaskQuery = (req, res, next) => {
  const { status, priority, sortBy, sortOrder } = req.query;

  if (status && status !== 'all' && status !== 'All') {
    const normalizedStatus = Task.normalizeStatus(status);
    if (!Task.VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status filter. Must be one of: ${Task.VALID_STATUSES.join(', ')}`,
      });
    }
  }

  if (priority && priority !== 'all' && priority !== 'All') {
    const normalizedPriority = Task.normalizePriority(priority);
    if (!Task.VALID_PRIORITIES.includes(normalizedPriority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority filter. Must be one of: ${Task.VALID_PRIORITIES.join(', ')}`,
      });
    }
  }

  if (sortBy && !['createdAt', 'priority', 'status', 'title'].includes(sortBy)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid sortBy field. Must be createdAt, priority, status, or title',
    });
  }

  if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid sortOrder. Must be asc or desc',
    });
  }

  next();
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateTaskQuery,
};

