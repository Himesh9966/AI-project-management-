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
const { cacheMiddleware, clearCache } = require('../middleware/cacheMiddleware');

// Protect all project routes with authentication middleware
router.use(requireAuth);

router.route('/')
  .get(cacheMiddleware('projects'), projectController.getProjects)
  .post(clearCache('projects'), validate(validateProject), projectController.createProject);

router.route('/:id')
  .get(cacheMiddleware('projects'), projectController.getProjectById)
  .patch(clearCache('projects'), validate(validateProject), projectController.updateProject)
  .delete(clearCache('projects'), projectController.deleteProject);

module.exports = router;
