const mongoose = require('mongoose');

const STATUS_MAP = {
  'todo': 'todo',
  'to do': 'todo',
  'to_do': 'todo',
  'in_progress': 'in_progress',
  'in progress': 'in_progress',
  'done': 'done',
};

const PRIORITY_MAP = {
  'low': 'low',
  'medium': 'medium',
  'high': 'high',
};

const normalizeStatus = (val) => {
  if (!val || typeof val !== 'string') return val;
  const key = val.trim().toLowerCase();
  return STATUS_MAP[key] || val.trim();
};

const normalizePriority = (val) => {
  if (!val || typeof val !== 'string') return val;
  const key = val.trim().toLowerCase();
  return PRIORITY_MAP[key] || val.trim();
};

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Task title cannot exceed 100 characters'],
      validate: {
        validator: function (v) {
          return typeof v === 'string' && v.trim().length > 0;
        },
        message: 'Task title cannot be empty',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in_progress', 'done'],
        message: '{VALUE} is not a valid status. Must be todo, in_progress, or done',
      },
      default: 'todo',
      set: normalizeStatus,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority. Must be low, medium, or high',
      },
      default: 'medium',
      set: normalizePriority,
    },
    assignedTo: {
      type: String,
      trim: true,
      default: '',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for query performance
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ priority: 1, createdAt: -1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ title: 'text' });

// Helpful constants and normalization utilities
taskSchema.statics.VALID_STATUSES = ['todo', 'in_progress', 'done'];
taskSchema.statics.VALID_PRIORITIES = ['low', 'medium', 'high'];
taskSchema.statics.normalizeStatus = normalizeStatus;
taskSchema.statics.normalizePriority = normalizePriority;

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
