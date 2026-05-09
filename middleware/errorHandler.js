// 404 catch-all for undefined routes
const notFound = (req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
};

// Global error handler — must have exactly 4 parameters
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = { notFound, errorHandler };
