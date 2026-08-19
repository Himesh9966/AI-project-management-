/**
 * CONCEPTS USED:
 * - Data Validation
 * - Cross-reference Validation (Mongoose ObjectIds)
 *
 * PURPOSE:
 * Validates payloads for Task creation and updates.
 */

const mongoose = require('mongoose');

const validateTask = (data) => {
  const errors = {};

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 2) {
    errors.title = 'Title is required and must be at least 2 characters.';
  }

  if (data.status) {
    const validStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(data.status)) {
      errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
    }
  }

  if (data.priority) {
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (!validPriorities.includes(data.priority)) {
      errors.priority = `Priority must be one of: ${validPriorities.join(', ')}`;
    }
  }

  if (data.estimatedHours !== undefined) {
    if (typeof data.estimatedHours !== 'number' || data.estimatedHours < 0.25) {
      errors.estimatedHours = 'Estimated hours must be a number at least 0.25';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateTask
};
