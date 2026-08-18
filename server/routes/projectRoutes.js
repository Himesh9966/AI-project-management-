/**
 * CONCEPTS USED:
 * - Express Router
 * - RESTful Endpoint Design
 * - Middleware Chaining (Authentication & Validation)
 *
 * PURPOSE:
 * Defines REST API endpoints for managing Project resources.
 *
 * RESPONSIBILITY:
 * Routes HTTP methods (GET, POST, PATCH, DELETE) to their respective controller methods.
 * Ensures all routes are protected by authMiddleware and payloads are validated.
 */

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { validateProject } = require('../validators/projectValidator');

// Protect all project routes with authentication middleware
router.use(requireAuth);

router.route('/')
  .get(projectController.getProjects)
  .post(validate(validateProject), projectController.createProject);

router.route('/:id')
  .get(projectController.getProjectById)
  .patch(validate(validateProject), projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
