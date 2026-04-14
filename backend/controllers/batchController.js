const Batch = require('../models/Batch');
const Student = require('../models/Student');
const Section = require('../models/Section');
const Activity = require('../models/Activity');

// @desc    Get all batches
// @route   GET /api/batches
// @access  Public
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    
    // Update student count and get section/activity counts for each batch
    const batchesWithCounts = await Promise.all(batches.map(async (batch) => {
      const studentCount = await Student.countDocuments({ course: batch.batchName });
      const sectionCount = await Section.countDocuments({ batchId: batch._id });
      const activities = await Activity.find({ batchId: batch._id });
      
      // Count activities by type
      const activityCounts = {
        test: activities.filter(a => a.activityType === 'test').length,
        assignment: activities.filter(a => a.activityType === 'assignment').length,
        quiz: activities.filter(a => a.activityType === 'quiz').length,
        note: activities.filter(a => a.activityType === 'note').length,
        link: activities.filter(a => a.activityType === 'link').length,
        liveClass: activities.filter(a => a.activityType === 'live-class').length,
        poll: activities.filter(a => a.activityType === 'poll').length,
        interview: activities.filter(a => a.activityType === 'interview').length,
        project: activities.filter(a => a.activityType === 'project').length,
        other: activities.filter(a => a.activityType === 'other').length
      };
      
      batch.studentCount = studentCount;
      await batch.save();
      
      return {
        ...batch.toObject(),
        sectionCount,
        activityCount: activities.length,
        activityCounts
      };
    }));
    
    res.status(200).json({
      success: true,
      count: batchesWithCounts.length,
      data: batchesWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single batch
// @route   GET /api/batches/:id
// @access  Public
exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new batch
// @route   POST /api/batches
// @access  Public
exports.createBatch = async (req, res) => {
  try {
    const { batchName, trainerName } = req.body;

    // Check if batch name already exists
    const existingBatch = await Batch.findOne({ batchName });
    if (existingBatch) {
      return res.status(400).json({
        success: false,
        message: 'Batch with this name already exists'
      });
    }

    const batch = await Batch.create({
      batchName,
      trainerName
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batch
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Public
exports.updateBatch = async (req, res) => {
  try {
    const { batchName, trainerName, status } = req.body;

    let batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { batchName, trainerName, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Batch updated successfully',
      data: batch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Public
exports.deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    await Batch.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Batch deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
