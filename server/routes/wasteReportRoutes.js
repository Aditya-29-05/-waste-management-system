const express = require('express');
const router = express.Router();
const wasteReportController = require('../controllers/wasteReportController');
const { protect } = require('../middleware/auth');

// All waste report routes require authentication
router.use(protect);

router
  .route('/')
  .get(wasteReportController.getAll)
  .post(wasteReportController.create);

router
  .route('/:id')
  .get(wasteReportController.getById)
  .patch(wasteReportController.update)
  .delete(wasteReportController.remove);

module.exports = router;
