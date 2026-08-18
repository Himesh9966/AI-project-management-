/**
 * CONCEPTS USED:
 * - Service Layer Abstraction
 * - Mongoose ObjectId Referencing & Population
 * - Authorization Checks (Ownership verification)
 *
 * PURPOSE:
 * Handles business logic and DB interactions for Tasks.
 *
 * RESPONSIBILITY:
 * Interacts with MongoDB to CRUD tasks, while strictly verifying that the user
 * owns the parent project.
 */

const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * Verify project ownership before allowing task operations
 */
const verifyProjectOwnership = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) throw new Error('Project not found or unauthorized');
  return project;
};

const getTasksByProject = async (projectId, userId) => {
  await verifyProjectOwnership(projectId, userId);
  return await Task.find({ project: projectId }).sort({ createdAt: -1 });
};

const createTask = async (projectId, userId, taskData) => {
  await verifyProjectOwnership(projectId, userId);
  
  const task = new Task({
    ...taskData,
    project: projectId
  });
  return await task.save();
};

const updateTask = async (taskId, userId, updateData) => {
  // First, find the task to get its project ID
  const task = await Task.findById(taskId);
  if (!task) return null;
  
  // Verify ownership of the parent project
  await verifyProjectOwnership(task.project, userId);
  
  return await Task.findByIdAndUpdate(
    taskId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) return null;
  
  await verifyProjectOwnership(task.project, userId);
  
  return await Task.findByIdAndDelete(taskId);
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask
};
