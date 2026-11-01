/**
 * Central error handling middleware.
 * Formats errors consistently and avoids leaking internals in production.
 */
const { NODE_ENV } = require('../config/env');

function errorHandler(err, req, res, next) {
  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] ${status} — ${message}`, NODE_ENV !== 'production' ? err.stack : '');

  res.status(status).json({
    error: {
      message,
      ...(NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
}

function notFound(req, res, next) {
  const err = new Error(`Not Found — ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

module.exports = { errorHandler, notFound };
