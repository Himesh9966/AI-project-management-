/**
 * CONCEPTS USED:
 * - Data Validation
 * - Pure Functions
 *
 * PURPOSE:
 * Provides validation logic for Project creation and updates.
 *
 * RESPONSIBILITY:
 * Checks data types, required fields, and acceptable enum values before they reach the database.
 */

const validateProject = (data) => {
  const errors = {};
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.title = 'Title is required and must be at least 3 characters.';
  }

  if (data.status) {
    const validStatuses = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'];
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

  if (data.progress !== undefined) {
    if (typeof data.progress !== 'number' || data.progress < 0 || data.progress > 100) {
      errors.progress = 'Progress must be a number between 0 and 100.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateProject
};
