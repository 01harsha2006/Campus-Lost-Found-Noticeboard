/**
 * Centralized error-handling middleware
 * Logs errors and returns { message: "Internal Server Error" } with status 500
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Centralized Error Handler]:', err.stack || err);

  // If response headers have already been sent, delegate to standard Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message || 'Validation Error',
      errors: Object.values(err.errors || {}).map((e) => e.message),
    });
  }

  // Handle Mongoose invalid ObjectId errors
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({
      message: 'Item not found',
    });
  }

  // Default server error
  return res.status(500).json({
    message: 'Internal Server Error',
  });
};
