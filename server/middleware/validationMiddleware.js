/**
 * CONCEPTS USED:
 * - Express Middleware
 * - Request Payload Validation
 * - Separation of Concerns
 *
 * PURPOSE:
 * Intercepts incoming HTTP requests to validate JSON body payloads against predefined schemas/validators.
 *
 * RESPONSIBILITY:
 * Rejects malformed or invalid requests early in the pipeline, returning a 400 Bad Request
 * before business logic or database operations are executed.
 */

const { sendError } = require('../utils/responseHelper');

/**
 * Validation Middleware Factory
 * @param {Function} validationFn - A function that returns { isValid, errors }
 */
const validate = (validationFn) => {
  return (req, res, next) => {
    const { isValid, errors } = validationFn(req.body);

    if (!isValid) {
      return sendError(res, 400, 'Validation Failed', errors);
    }

    next();
  };
};

module.exports = {
  validate
};
