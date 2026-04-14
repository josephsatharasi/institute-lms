const Activity = require('../models/Activity');
const Section = require('../models/Section');

// @desc    Get all activities for a section
// @route   GET /api/sections/:sectionId/activities
// @access  Public
exports.getActivitiesBySection = async (req, res) => {
  try {
    const activities = await Activity.find({ sectionId: req.params.sectionId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new activity
// @route   POST /api/sections/:sectionId/activities
// @access  Public
exports.createActivity = async (req, res) => {
  try {
    const { activityName, activityType, description, dueDate } = req.body;
    const { sectionId } = req.params;

    // Check if section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const activity = await Activity.create({
      activityName,
      activityType,
      description,
      dueDate,
      sectionId,
      batchId: section.batchId
    });

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Public
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
