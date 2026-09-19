const CollectionRequest = require('../models/CollectionRequest');

/**
 * Create a new collection request
 * @param {Object} data - Request payload
 * @param {Object} user - Authenticated user
 * @returns {Object} Created collection request
 */
const createCollectionRequest = async (data, user) => {
  const { address, wasteType, preferredDate, preferredTime, description } = data;

  if (!address || !wasteType || !preferredDate || !preferredTime) {
    const error = new Error('Address, wasteType, preferredDate, and preferredTime are required');
    error.statusCode = 400;
    throw error;
  }

  const collectionRequest = await CollectionRequest.create({
    user: user._id,
    address,
    wasteType,
    preferredDate,
    preferredTime,
    description: description || ''
  });

  return collectionRequest.populate('user', 'name email phone address');
};

/**
 * Get collection requests filtered by user role and query parameters
 * @param {Object} user - Authenticated user
 * @param {Object} queryParams - Filter parameters
 * @returns {Array} List of collection requests
 */
const getCollectionRequests = async (user, queryParams = {}) => {
  const filter = {};

  if (user.role === 'user') {
    filter.user = user._id;
  } else if (user.role === 'worker') {
    if (queryParams.myTasks === 'true') {
      filter.assignedWorker = user._id;
    }
  }

  if (queryParams.status) {
    filter.status = queryParams.status.toUpperCase();
  }

  if (queryParams.wasteType) {
    filter.wasteType = new RegExp(queryParams.wasteType, 'i');
  }

  const requests = await CollectionRequest.find(filter)
    .populate('user', 'name email phone address')
    .populate('assignedWorker', 'name email phone')
    .sort({ createdAt: -1 });

  return requests;
};

/**
 * Get single collection request by ID
 * @param {string} id - Request ID
 * @param {Object} user - Authenticated user
 * @returns {Object} Collection request document
 */
const getCollectionRequestById = async (id, user) => {
  const collectionRequest = await CollectionRequest.findById(id)
    .populate('user', 'name email phone address')
    .populate('assignedWorker', 'name email phone');

  if (!collectionRequest) {
    const error = new Error('Collection request not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'user' && collectionRequest.user._id.toString() !== user._id.toString()) {
    const error = new Error('Forbidden: you cannot view collection requests created by other users');
    error.statusCode = 403;
    throw error;
  }

  return collectionRequest;
};

/**
 * Update collection request
 * @param {string} id - Request ID
 * @param {Object} updateData - Updated fields
 * @param {Object} user - Authenticated user
 * @returns {Object} Updated collection request
 */
const updateCollectionRequest = async (id, updateData, user) => {
  const collectionRequest = await CollectionRequest.findById(id);

  if (!collectionRequest) {
    const error = new Error('Collection request not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'user') {
    if (collectionRequest.user.toString() !== user._id.toString()) {
      const error = new Error('Forbidden: you cannot update collection requests of other users');
      error.statusCode = 403;
      throw error;
    }

    if (collectionRequest.status !== 'REQUESTED') {
      const error = new Error(`Cannot modify request that is currently ${collectionRequest.status}`);
      error.statusCode = 400;
      throw error;
    }

    if (updateData.address) collectionRequest.address = updateData.address;
    if (updateData.wasteType) collectionRequest.wasteType = updateData.wasteType;
    if (updateData.preferredDate) collectionRequest.preferredDate = updateData.preferredDate;
    if (updateData.preferredTime) collectionRequest.preferredTime = updateData.preferredTime;
    if (updateData.description !== undefined) collectionRequest.description = updateData.description;
    if (updateData.status && updateData.status.toUpperCase() === 'CANCELLED') {
      collectionRequest.status = 'CANCELLED';
    }
  } else if (user.role === 'worker') {
    if (updateData.status) {
      const validStatuses = ['ASSIGNED', 'COLLECTING', 'COMPLETED'];
      const statusUpper = updateData.status.toUpperCase();
      if (!validStatuses.includes(statusUpper)) {
        const error = new Error(`Worker can only update status to ${validStatuses.join(', ')}`);
        error.statusCode = 400;
        throw error;
      }
      collectionRequest.status = statusUpper;
    }
  } else if (user.role === 'admin') {
    if (updateData.address) collectionRequest.address = updateData.address;
    if (updateData.wasteType) collectionRequest.wasteType = updateData.wasteType;
    if (updateData.preferredDate) collectionRequest.preferredDate = updateData.preferredDate;
    if (updateData.preferredTime) collectionRequest.preferredTime = updateData.preferredTime;
    if (updateData.description !== undefined) collectionRequest.description = updateData.description;
    if (updateData.status) collectionRequest.status = updateData.status.toUpperCase();
    if (updateData.assignedWorker !== undefined) {
      collectionRequest.assignedWorker = updateData.assignedWorker;
      if (updateData.assignedWorker && collectionRequest.status === 'REQUESTED') {
        collectionRequest.status = 'ASSIGNED';
      }
    }
  }

  await collectionRequest.save();

  return collectionRequest.populate([
    { path: 'user', select: 'name email phone address' },
    { path: 'assignedWorker', select: 'name email phone' }
  ]);
};

/**
 * Delete a collection request
 * @param {string} id - Request ID
 * @param {Object} user - Authenticated user
 */
const deleteCollectionRequest = async (id, user) => {
  const collectionRequest = await CollectionRequest.findById(id);

  if (!collectionRequest) {
    const error = new Error('Collection request not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'user') {
    if (collectionRequest.user.toString() !== user._id.toString()) {
      const error = new Error('Forbidden: you cannot delete collection requests of other users');
      error.statusCode = 403;
      throw error;
    }

    if (collectionRequest.status !== 'REQUESTED') {
      const error = new Error(`Cannot delete request that is currently ${collectionRequest.status}`);
      error.statusCode = 400;
      throw error;
    }
  } else if (user.role === 'worker') {
    const error = new Error('Forbidden: collection workers cannot delete collection requests');
    error.statusCode = 403;
    throw error;
  }

  await collectionRequest.deleteOne();
  return true;
};

module.exports = {
  createCollectionRequest,
  getCollectionRequests,
  getCollectionRequestById,
  updateCollectionRequest,
  deleteCollectionRequest
};
