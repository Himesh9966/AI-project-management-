/**
 * CONCEPTS USED:
 * - Express Controller
 * - Parameter Extraction
 * - Relational Route Handling (Nested Routes)
 *
 * PURPOSE:
 * Handles incoming HTTP requests for Task resources.
 */

const taskService = require('../services/taskService');

/**
 * @route   GET /api/projects/:projectId/tasks
 * @desc    Get all tasks for a specific project
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId, req.user.id);
    return res.status(200).json({ success: true, message: 'Tasks retrieved successfully', data: { tasks } });
  } catch (error) {
    if (error.message.includes('unauthorized')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @route   POST /api/projects/:projectId/tasks
 * @desc    Create a new task in a project
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.params.projectId, req.user.id, req.body);
    return res.status(201).json({ success: true, message: 'Task created successfully', data: { task } });
  } catch (error) {
    if (error.message.includes('unauthorized')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Update a task (including subtasks)
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }
    return res.status(200).json({ success: true, message: 'Task updated successfully', data: { task } });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }
    return res.status(200).json({ success: true, message: 'Task deleted successfully', data: { task } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
