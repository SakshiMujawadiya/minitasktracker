const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err.name || 'Error', err.message);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID format',
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || 'Validation error',
      errors: messages,
    });
  }

  // JSON Body Parse Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body',
    });
  }

  // Default server error (do not leak stack trace)
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'An unexpected server error occurred' : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

