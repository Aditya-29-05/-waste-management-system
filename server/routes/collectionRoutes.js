const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const { protect } = require('../middleware/auth');

// All collection routes require authentication
router.use(protect);

router
  .route('/')
  .get(collectionController.getAll)
  .post(collectionController.create);

router
  .route('/:id')
  .get(collectionController.getById)
  .patch(collectionController.update)
  .delete(collectionController.remove);

module.exports = router;
