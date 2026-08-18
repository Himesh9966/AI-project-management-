/**
 * CONCEPTS USED:
 * - Controller Pattern
 * - HTTP Status Codes
 * - Error Handling
 *
 * PURPOSE:
 * Handles incoming HTTP requests for Project resources.
 *
 * RESPONSIBILITY:
 * Extracts request parameters, coordinates with the Project service layer,
 * and formats HTTP responses using standard response helpers.
 */

const projectService = require('../services/projectService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * @route   GET /api/projects
 * @desc    Get all projects for the logged in user
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsByUserId(req.user.id);
    return sendSuccess(res, 200, 'Projects retrieved successfully', { projects });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user.id);
    return sendSuccess(res, 201, 'Project created successfully', { project });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Get a specific project by ID
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }
    return sendSuccess(res, 200, 'Project retrieved successfully', { project });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/projects/:id
 * @desc    Update a project
 * @access  Private
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.user.id, req.body);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }
    return sendSuccess(res, 200, 'Project updated successfully', { project });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await projectService.deleteProject(req.params.id, req.user.id);
    if (!project) {
      return sendError(res, 404, 'Project not found');
    }
    return sendSuccess(res, 200, 'Project deleted successfully', { project });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject
};
