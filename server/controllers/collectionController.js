const collectionService = require('../services/collectionService');

/**
 * Create a new collection request
 * POST /api/collections
 */
const create = async (req, res, next) => {
  try {
    const collectionRequest = await collectionService.createCollectionRequest(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: 'Collection request created successfully',
      data: collectionRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all collection requests
 * GET /api/collections
 */
const getAll = async (req, res, next) => {
  try {
    const requests = await collectionService.getCollectionRequests(req.user, req.query);

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single collection request by ID
 * GET /api/collections/:id
 */
const getById = async (req, res, next) => {
  try {
    const collectionRequest = await collectionService.getCollectionRequestById(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      data: collectionRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update collection request
 * PATCH /api/collections/:id
 */
const update = async (req, res, next) => {
  try {
    const collectionRequest = await collectionService.updateCollectionRequest(
      req.params.id,
      req.body,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: 'Collection request updated successfully',
      data: collectionRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete collection request
 * DELETE /api/collections/:id
 */
const remove = async (req, res, next) => {
  try {
    await collectionService.deleteCollectionRequest(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: 'Collection request deleted successfully'
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
