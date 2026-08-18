/**
 * CONCEPTS USED:
 * - Mongoose ObjectId References (Relationships in MongoDB)
 * - Subdocument Schema Nesting
 * - Validation Constraints & Pre/Post Hooks
 * - Query Indexing
 *
 * PURPOSE:
 * Defines schema and data structure for tasks and subtasks associated with projects.
 *
 * RESPONSIBILITY:
 * Enforces task data integrity, status progression, hours estimation, and subtask tracking.
 */

const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Subtask title is required'],
      trim: true,
      maxlength: [200, 'Subtask title cannot exceed 200 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    estimatedHours: {
      type: Number,
      min: [0.25, 'Estimated hours must be at least 15 minutes (0.25)'],
      max: [100, 'Subtask hours cannot exceed 100'],
      default: 1
    }
  },
  { _id: true }
);

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Task title must be at least 2 characters'],
      maxlength: [140, 'Task title cannot exceed 140 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Task description cannot exceed 2000 characters'],
      default: ''
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Task must belong to a project'],
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
        message: '{VALUE} is not a valid task status'
      },
      default: 'TODO'
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH'],
        message: '{VALUE} is not a valid task priority'
      },
      default: 'MEDIUM'
    },
    estimatedHours: {
      type: Number,
      min: [0.25, 'Estimated hours must be at least 0.25'],
      max: [500, 'Estimated hours cannot exceed 500'],
      default: 1
    },
    dueDate: {
      type: Date,
      default: null
    },
    subtasks: {
      type: [SubtaskSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index for efficient retrieval of tasks by project and status
TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ project: 1, createdAt: -1 });

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
