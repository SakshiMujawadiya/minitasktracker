const Task = require('../models/Task');

// Format Mongoose document cleanly with both id and _id
const formatTask = (task) => {
  if (!task) return null;
  const json = task.toJSON ? task.toJSON() : task;
  return {
    ...json,
    _id: task._id ? task._id.toString() : json._id,
    id: task._id ? task._id.toString() : json.id || json._id,
  };
};

/**
 * Create a new task
 */
const createTask = async ({ title, description, status = 'todo', priority = 'medium', assignedTo = '', dueDate = null }) => {
  const task = new Task({
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    status: Task.normalizeStatus(status),
    priority: Task.normalizePriority(priority),
    assignedTo: assignedTo ? assignedTo.trim() : '',
    dueDate: dueDate ? new Date(dueDate) : null,
  });

  const saved = await task.save();
  return formatTask(saved);
};

/**
 * Retrieve tasks with optional filters, search, sorting, and pagination
 */
const getTasks = async (filters = {}) => {
  const {
    status,
    priority,
    search,
    assignedTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page,
    limit,
  } = filters;

  const query = {};

  // Status filtering (e.g. todo, in_progress, done)
  if (status && status !== 'all' && status !== 'All') {
    query.status = Task.normalizeStatus(status);
  }

  // Priority filtering (e.g. low, medium, high)
  if (priority && priority !== 'all' && priority !== 'All') {
    query.priority = Task.normalizePriority(priority);
  }

  // Assigned-to filtering
  if (assignedTo && assignedTo !== 'all') {
    query.assignedTo = { $regex: assignedTo.trim(), $options: 'i' };
  }

  // Title search (case-insensitive substring match)
  if (search && typeof search === 'string' && search.trim().length > 0) {
    query.title = { $regex: search.trim(), $options: 'i' };
  }

  // Sort direction
  const order = sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortBy]: order };

  // If sorting by non-createdAt field, add createdAt: -1 as tie-breaker
  if (sortBy !== 'createdAt') {
    sort.createdAt = -1;
  }

  let mongoQuery = Task.find(query).sort(sort);

  // Pagination support if requested
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const isPaginated = !isNaN(parsedPage) && parsedPage > 0 && !isNaN(parsedLimit) && parsedLimit > 0;

  if (isPaginated) {
    const skip = (parsedPage - 1) * parsedLimit;
    mongoQuery = mongoQuery.skip(skip).limit(parsedLimit);
  }

  const [tasks, total] = await Promise.all([
    mongoQuery.exec(),
    Task.countDocuments(query),
  ]);

  const formatted = tasks.map(formatTask);

  return {
    tasks: formatted,
    total,
    count: formatted.length,
    page: isPaginated ? parsedPage : 1,
    totalPages: isPaginated ? Math.ceil(total / parsedLimit) : 1,
  };
};

/**
 * Partial update for a task (title, description, status, priority)
 */
const updateTask = async (id, updateFields) => {
  const task = await Task.findById(id);
  if (!task) {
    return null;
  }

  if (updateFields.title !== undefined) {
    task.title = updateFields.title.trim();
  }
  if (updateFields.description !== undefined) {
    task.description = updateFields.description.trim();
  }
  if (updateFields.status !== undefined) {
    task.status = Task.normalizeStatus(updateFields.status);
  }
  if (updateFields.priority !== undefined) {
    task.priority = Task.normalizePriority(updateFields.priority);
  }
  if (updateFields.assignedTo !== undefined) {
    task.assignedTo = updateFields.assignedTo.trim();
  }
  if (updateFields.dueDate !== undefined) {
    task.dueDate = updateFields.dueDate ? new Date(updateFields.dueDate) : null;
  }

  const updated = await task.save();
  return formatTask(updated);
};

/**
 * Delete a task by ID
 */
const deleteTask = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    return null;
  }
  await Task.findByIdAndDelete(id);
  return { id, _id: id };
};

/**
 * Aggregated statistics for dashboard counters & progress
 */
const getTaskStats = async () => {
  const tasks = await Task.find({}).lean();
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;

  return {
    total,
    todo,
    inProgress,
    done,
    completionPercentage,
  };
};

/**
 * Get task history grouped by date, optionally filtered by year and month
 */
const getTaskHistory = async ({ year, month } = {}) => {
  const matchStage = {};

  if (year && month) {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);
    matchStage.createdAt = { $gte: start, $lt: end };
  } else if (year) {
    const y = parseInt(year, 10);
    const start = new Date(y, 0, 1);
    const end = new Date(y + 1, 0, 1);
    matchStage.createdAt = { $gte: start, $lt: end };
  }

  const pipeline = [
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        tasks: { $push: '$$ROOT' },
        count: { $sum: 1 },
        done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        todo: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
  ];

  const groups = await Task.aggregate(pipeline);

  return groups.map((g) => ({
    date: `${g._id.year}-${String(g._id.month).padStart(2, '0')}-${String(g._id.day).padStart(2, '0')}`,
    year: g._id.year,
    month: g._id.month,
    day: g._id.day,
    count: g.count,
    done: g.done,
    inProgress: g.inProgress,
    todo: g.todo,
    tasks: g.tasks.map(formatTask),
  }));
};

/**
 * Get available months that have tasks (for the history date picker)
 */
const getHistoryMonths = async () => {
  const pipeline = [
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ];

  const results = await Task.aggregate(pipeline);
  return results.map((r) => ({
    year: r._id.year,
    month: r._id.month,
    count: r.count,
    label: new Date(r._id.year, r._id.month - 1, 1).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  }));
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
  getTaskHistory,
  getHistoryMonths,
  formatTask,
};

