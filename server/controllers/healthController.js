/**
 * Health check controller
 * GET /api/health
 */
const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'healthy'
  });
};

module.exports = {
  getHealth
};
