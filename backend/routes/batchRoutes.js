const express = require('express');
const router = express.Router();
const {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch
} = require('../controllers/batchController');

const sectionRoutes = require('./sectionRoutes');
const activityRoutes = require('./activityRoutes');

router.use('/:batchId/sections', sectionRoutes);

router.route('/')
  .get(getAllBatches)
  .post(createBatch);

router.route('/:id')
  .get(getBatchById)
  .put(updateBatch)
  .delete(deleteBatch);

module.exports = router;
