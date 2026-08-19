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

/**
 * @route   GET /api/projects
 * @desc    Get all projects for the logged in user
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsByUserId(req.user.id);
    return res.status(200).json({ success: true, message: 'Projects retrieved successfully', data: { projects } });
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
    return res.status(201).json({ success: true, message: 'Project created successfully', data: { project } });
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
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, message: 'Project retrieved successfully', data: { project } });
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
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, message: 'Project updated successfully', data: { project } });
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
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, message: 'Project deleted successfully', data: { project } });
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
