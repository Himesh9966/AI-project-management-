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
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * @route   GET /api/projects/:projectId/tasks
 * @desc    Get all tasks for a specific project
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId, req.user.id);
    return sendSuccess(res, 200, 'Tasks retrieved successfully', { tasks });
  } catch (error) {
    if (error.message.includes('unauthorized')) {
      return sendError(res, 403, error.message);
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
    return sendSuccess(res, 201, 'Task created successfully', { task });
  } catch (error) {
    if (error.message.includes('unauthorized')) {
      return sendError(res, 403, error.message);
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
      return sendError(res, 404, 'Task not found or unauthorized');
    }
    return sendSuccess(res, 200, 'Task updated successfully', { task });
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
      return sendError(res, 404, 'Task not found or unauthorized');
    }
    return sendSuccess(res, 200, 'Task deleted successfully', { task });
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
