const taskService = require('../services/taskService');

/**
 * POST /tasks
 * Create a new task in MongoDB
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
      // Backward-compatibility properties
      ...task,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /tasks
 * Retrieve tasks with optional status, priority, search, sorting, and pagination
 */
const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.query);
    return res.status(200).json({
      success: true,
      count: result.count,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.tasks,
      // Array alias for clients expecting res.body.tasks
      tasks: result.tasks,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /tasks/:id
 * Partial update for a task (title, description, status, priority, assignedTo, dueDate)
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await taskService.updateTask(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`,
      });
    }

    const message = req.body.status && Object.keys(req.body).length === 1
      ? 'Task status updated successfully'
      : 'Task updated successfully';

    return res.status(200).json({
      success: true,
      message,
      data: updated,
      // Backward-compatibility properties
      ...updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /tasks/:id
 * Delete task from MongoDB
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await taskService.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deleted,
      id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /tasks/stats
 * Aggregated dashboard statistics
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await taskService.getTaskStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /tasks/history
 * Task history grouped by day, with optional ?year=&month= filtering
 */
const getHistory = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const history = await taskService.getTaskHistory({ year, month });
    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /tasks/history/months
 * List of months that have tasks (for the UI date picker dropdown)
 */
const getHistoryMonths = async (req, res, next) => {
  try {
    const months = await taskService.getHistoryMonths();
    return res.status(200).json({
      success: true,
      data: months,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus: updateTask, // Alias for backward compatibility
  deleteTask,
  getStats,
  getHistory,
  getHistoryMonths,
};
