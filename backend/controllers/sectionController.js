const Section = require('../models/Section');
const Batch = require('../models/Batch');

// @desc    Get all sections for a batch
// @route   GET /api/batches/:batchId/sections
// @access  Public
exports.getSectionsByBatch = async (req, res) => {
  try {
    const sections = await Section.find({ batchId: req.params.batchId }).sort({ order: 1 });
    
    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new section
// @route   POST /api/batches/:batchId/sections
// @access  Public
exports.createSection = async (req, res) => {
  try {
    const { sectionName, description, order } = req.body;
    const { batchId } = req.params;

    // Check if batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    const section = await Section.create({
      sectionName,
      description,
      order,
      batchId
    });

    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: section
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete section
// @route   DELETE /api/sections/:id
// @access  Public
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    await Section.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
