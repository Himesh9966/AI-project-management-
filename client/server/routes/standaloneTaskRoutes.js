/**
 * CONCEPTS USED:
 * - Express Router
 * - RESTful Flat Endpoints
 *
 * PURPOSE:
 * Defines flat endpoints for Task modifications (PATCH/DELETE) that do not require project ID in URL.
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { validateTask } = require('../validators/taskValidator');

router.use(requireAuth);

// Mapped to /api/tasks/:id in app.js
router.route('/:id')
  .patch(validate(validateTask), taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
