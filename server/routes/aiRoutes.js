/**
 * CONCEPTS USED:
 * - Express Router
 * - RESTful Endpoint Design
 * - Protected Routes
 *
 * PURPOSE:
 * Maps HTTP routes for AI functionalities.
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/plan', aiController.generatePlan);
router.get('/plans', aiController.getSavedPlans);
router.post('/subtasks', aiController.generateSubtasks);
router.post('/mentor', aiController.askMentor);

module.exports = router;
