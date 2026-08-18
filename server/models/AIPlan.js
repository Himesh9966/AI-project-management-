/**
 * CONCEPTS USED:
 * - Structured Output Document Persistence
 * - Document Store Schema Modeling
 * - Relational Linking in NoSQL (convertedToProject ref)
 *
 * PURPOSE:
 * Stores AI-generated MVP project roadmaps and task breakdowns.
 *
 * RESPONSIBILITY:
 * Preserves structured LLM generation results so students can review, share,
 * or convert AI plans directly into active tracked projects.
 */

const mongoose = require('mongoose');

const PlannedTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    estimatedHours: { type: Number, default: 2 }
  },
  { _id: false }
);

const AIPlanSchema = new mongoose.Schema(
  {
    projectIdea: {
      type: String,
      required: [true, 'Original project idea is required'],
      trim: true
    },
    generatedPlan: {
      projectTitle: { type: String, required: true },
      summary: { type: String, required: true },
      techStack: { type: [String], default: [] },
      tasks: { type: [PlannedTaskSchema], default: [] }
    },
    createdBy: {
      type: String,
      required: [true, 'Creator identifier is required']
    },
    convertedToProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    }
  },
  {
    timestamps: true
  }
);

AIPlanSchema.index({ createdBy: 1, createdAt: -1 });

const AIPlan = mongoose.model('AIPlan', AIPlanSchema);

module.exports = AIPlan;
