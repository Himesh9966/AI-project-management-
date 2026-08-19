/**
 * CONCEPTS USED:
 * - Express Router (`mergeParams` trick for nested routes)
 * - Nested API Routing
 *
 * PURPOSE:
 * Defines endpoints for Task CRUD operations.
 */

const express = require('express');
// mergeParams: true allows access to :projectId from parent router if mounted that way,
// but we will explicitly define it for clarity.
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { validateTask } = require('../validators/taskValidator');

router.use(requireAuth);

// Note: /api/projects/:projectId/tasks is mapped to this router in app.js
// So '/' here means /api/projects/:projectId/tasks
router.route('/')
  .get(taskController.getTasks)
  .post(validate(validateTask), taskController.createTask);

module.exports = router;
