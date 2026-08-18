/**
 * CONCEPTS USED:
 * - Conversational State Storage in Document Database
 * - Embedded Array of Message Documents
 * - Project Context Snapshotting
 *
 * PURPOSE:
 * Stores chat history and contextual interactions between users and the AI Project Mentor.
 *
 * RESPONSIBILITY:
 * Preserves multi-turn conversation logs, role attribution ('user', 'model', 'system'),
 * and metadata snapshots for historical review.
 */

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'model', 'system'],
      required: [true, 'Message role is required']
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const AIConversationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Conversation must be tied to a project'],
      index: true
    },
    user: {
      type: String,
      required: [true, 'User identifier is required']
    },
    messages: {
      type: [MessageSchema],
      default: []
    },
    contextSnapshot: {
      projectTitle: { type: String, default: '' },
      totalTasks: { type: Number, default: 0 },
      completedTasks: { type: Number, default: 0 },
      progress: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

AIConversationSchema.index({ project: 1, user: 1 });

const AIConversation = mongoose.model('AIConversation', AIConversationSchema);

module.exports = AIConversation;
