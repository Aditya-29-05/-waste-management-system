const mongoose = require('mongoose');

/**
 * Health check controller
 * GET /api/health
 */
const getHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  return res.status(200).json({
    success: true,
    status: 'healthy',
    database: dbStatus
  });
};

module.exports = {
  getHealth
};
