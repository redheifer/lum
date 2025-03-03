const logger = require('../utils/logger');

/**
 * Global error handler middleware
 */
module.exports = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Handle specific errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;
  
  return res.status(statusCode).json({
    success: false,
    message
  });
}; 