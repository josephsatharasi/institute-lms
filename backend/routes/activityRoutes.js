const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getActivitiesBySection,
  createActivity,
  deleteActivity
} = require('../controllers/activityController');

router.route('/')
  .get(getActivitiesBySection)
  .post(createActivity);

router.route('/:id')
  .delete(deleteActivity);

module.exports = router;
