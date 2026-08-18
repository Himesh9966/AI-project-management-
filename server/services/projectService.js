/**
 * CONCEPTS USED:
 * - Service Layer Pattern (Separation of Concerns)
 * - Mongoose CRUD Operations
 * - Business Logic Encapsulation
 *
 * PURPOSE:
 * Contains all business logic and database interactions for Projects.
 *
 * RESPONSIBILITY:
 * Abstracts MongoDB Mongoose queries away from the controllers.
 */

const Project = require('../models/Project');

const getProjectsByUserId = async (userId) => {
  return await Project.find({ owner: userId }).sort({ createdAt: -1 });
};

const getProjectById = async (projectId, userId) => {
  return await Project.findOne({ _id: projectId, owner: userId });
};

const createProject = async (projectData, userId) => {
  const project = new Project({
    ...projectData,
    owner: userId
  });
  return await project.save();
};

const updateProject = async (projectId, userId, updateData) => {
  return await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

const deleteProject = async (projectId, userId) => {
  return await Project.findOneAndDelete({ _id: projectId, owner: userId });
};

module.exports = {
  getProjectsByUserId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
