const express = require('express');
const router = express.Router();
const { deleteSection } = require('../controllers/sectionController');
const activityRoutes = require('./activityRoutes');

router.use('/:sectionId/activities', activityRoutes);
router.delete('/:id', deleteSection);

module.exports = router;
