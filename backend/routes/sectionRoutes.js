const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getSectionsByBatch,
  createSection,
  deleteSection
} = require('../controllers/sectionController');

router.route('/')
  .get(getSectionsByBatch)
  .post(createSection);

router.route('/:id')
  .delete(deleteSection);

module.exports = router;
