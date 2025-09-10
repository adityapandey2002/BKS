module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};
