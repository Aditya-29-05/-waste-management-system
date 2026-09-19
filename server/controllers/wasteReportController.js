const wasteReportService = require('../services/wasteReportService');

/**
 * Create a new waste report
 * POST /api/reports
 */
const create = async (req, res, next) => {
  try {
    const report = await wasteReportService.createReport(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: 'Waste report created successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all waste reports accessible to user
 * GET /api/reports
 */
const getAll = async (req, res, next) => {
  try {
    const reports = await wasteReportService.getReports(req.user, req.query);

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single waste report by ID
 * GET /api/reports/:id
 */
const getById = async (req, res, next) => {
  try {
    const report = await wasteReportService.getReportById(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update waste report by ID
 * PATCH /api/reports/:id
 */
const update = async (req, res, next) => {
  try {
    const report = await wasteReportService.updateReport(req.params.id, req.body, req.user);

    return res.status(200).json({
      success: true,
      message: 'Waste report updated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete waste report by ID
 * DELETE /api/reports/:id
 */
const remove = async (req, res, next) => {
  try {
    await wasteReportService.deleteReport(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: 'Waste report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};
