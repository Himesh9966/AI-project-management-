/**
 * CONCEPTS USED:
 * - Mongoose Schema Definition & Validation
 * - Non-Relational Data Modeling (Document Store)
 * - Schema Options & Automatic Timestamps
 * - Data Integrity Enums & Default Values
 *
 * PURPOSE:
 * Defines the schema and model for software development projects.
 *
 * RESPONSIBILITY:
 * Enforces field validations, data types, constraints, and defaults for Project documents.
 */

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Project title must be at least 3 characters'],
      maxlength: [120, 'Project title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'],
        message: '{VALUE} is not a valid project status'
      },
      default: 'PLANNING'
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'MEDIUM', 'HIGH'],
        message: '{VALUE} is not a valid priority level'
      },
      default: 'MEDIUM'
    },
    deadline: {
      type: Date,
      default: null
    },
    owner: {
      type: String,
      required: [true, 'Project owner reference is required'],
      trim: true
    },
    progress: {
      type: Number,
      min: [0, 'Progress cannot be less than 0%'],
      max: [100, 'Progress cannot exceed 100%'],
      default: 0
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index on owner and status for optimized query performance
ProjectSchema.index({ owner: 1, status: 1 });
ProjectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
