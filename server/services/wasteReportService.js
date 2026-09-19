const WasteReport = require('../models/WasteReport');

/**
 * Create a new waste report
 * @param {Object} reportData - Report fields
 * @param {Object} user - Authenticated user
 * @returns {Object} Created report
 */
const createReport = async (reportData, user) => {
  const { title, description, wasteType, location, image } = reportData;

  if (!title || !description || !wasteType || !location) {
    const error = new Error('Title, description, wasteType, and location are required');
    error.statusCode = 400;
    throw error;
  }

  const report = await WasteReport.create({
    title,
    description,
    wasteType,
    location,
    image: image || null,
    user: user._id
  });

  return report.populate('user', 'name email phone');
};

/**
 * Get reports with filtering and access control
 * @param {Object} user - Authenticated user
 * @param {Object} queryParams - Filter parameters
 * @returns {Array} List of reports
 */
const getReports = async (user, queryParams = {}) => {
  const filter = {};

  // Regular users can only see their own reports
  if (user.role === 'user') {
    filter.user = user._id;
  } else if (user.role === 'worker') {
    // Workers can see all unassigned/assigned to them or all pending/assigned
    if (queryParams.myTasks === 'true') {
      filter.assignedWorker = user._id;
    }
  }

  // Optional status filter
  if (queryParams.status) {
    filter.status = queryParams.status.toUpperCase();
  }

  // Optional wasteType filter
  if (queryParams.wasteType) {
    filter.wasteType = new RegExp(queryParams.wasteType, 'i');
  }

  const reports = await WasteReport.find(filter)
    .populate('user', 'name email phone')
    .populate('assignedWorker', 'name email phone')
    .sort({ createdAt: -1 });

  return reports;
};

/**
 * Get a single report by ID
 * @param {string} reportId - Report ID
 * @param {Object} user - Authenticated user
 * @returns {Object} Report document
 */
const getReportById = async (reportId, user) => {
  const report = await WasteReport.findById(reportId)
    .populate('user', 'name email phone')
    .populate('assignedWorker', 'name email phone');

  if (!report) {
    const error = new Error('Waste report not found');
    error.statusCode = 404;
    throw error;
  }

  // Users can only view their own reports
  if (user.role === 'user' && report.user._id.toString() !== user._id.toString()) {
    const error = new Error('Forbidden: you cannot view reports submitted by other users');
    error.statusCode = 403;
    throw error;
  }

  return report;
};

/**
 * Update a waste report
 * @param {string} reportId - Report ID
 * @param {Object} updateData - Fields to update
 * @param {Object} user - Authenticated user
 * @returns {Object} Updated report
 */
const updateReport = async (reportId, updateData, user) => {
  const report = await WasteReport.findById(reportId);

  if (!report) {
    const error = new Error('Waste report not found');
    error.statusCode = 404;
    throw error;
  }

  // Permission checks
  if (user.role === 'user') {
    if (report.user.toString() !== user._id.toString()) {
      const error = new Error('Forbidden: you cannot update reports submitted by other users');
      error.statusCode = 403;
      throw error;
    }

    if (report.status !== 'PENDING') {
      const error = new Error(`Cannot modify report that is currently ${report.status}`);
      error.statusCode = 400;
      throw error;
    }

    // Regular users can only update basic fields or cancel
    if (updateData.title) report.title = updateData.title;
    if (updateData.description) report.description = updateData.description;
    if (updateData.wasteType) report.wasteType = updateData.wasteType;
    if (updateData.location) report.location = updateData.location;
    if (updateData.status && updateData.status.toUpperCase() === 'CANCELLED') {
      report.status = 'CANCELLED';
    }
  } else if (user.role === 'worker') {
    // Workers can update the status
    if (updateData.status) {
      const validStatuses = ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
      const statusUpper = updateData.status.toUpperCase();
      if (!validStatuses.includes(statusUpper)) {
        const error = new Error(`Worker can only change status to ${validStatuses.join(', ')}`);
        error.statusCode = 400;
        throw error;
      }
      report.status = statusUpper;
    }
  } else if (user.role === 'admin') {
    // Admin can update all fields, assign worker, and set any status
    if (updateData.title) report.title = updateData.title;
    if (updateData.description) report.description = updateData.description;
    if (updateData.wasteType) report.wasteType = updateData.wasteType;
    if (updateData.location) report.location = updateData.location;
    if (updateData.status) report.status = updateData.status.toUpperCase();
    if (updateData.assignedWorker !== undefined) {
      report.assignedWorker = updateData.assignedWorker;
      if (updateData.assignedWorker && report.status === 'PENDING') {
        report.status = 'ASSIGNED';
      }
    }
  }

  await report.save();

  return report.populate([
    { path: 'user', select: 'name email phone' },
    { path: 'assignedWorker', select: 'name email phone' }
  ]);
};

/**
 * Delete a waste report
 * @param {string} reportId - Report ID
 * @param {Object} user - Authenticated user
 */
const deleteReport = async (reportId, user) => {
  const report = await WasteReport.findById(reportId);

  if (!report) {
    const error = new Error('Waste report not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'user') {
    if (report.user.toString() !== user._id.toString()) {
      const error = new Error('Forbidden: you cannot delete reports submitted by other users');
      error.statusCode = 403;
      throw error;
    }
    if (report.status !== 'PENDING') {
      const error = new Error(`Cannot delete report that is currently ${report.status}`);
      error.statusCode = 400;
      throw error;
    }
  } else if (user.role === 'worker') {
    const error = new Error('Forbidden: collection workers cannot delete waste reports');
    error.statusCode = 403;
    throw error;
  }

  await report.deleteOne();
  return true;
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport
};
