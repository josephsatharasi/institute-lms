const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: [true, 'Section name is required'],
    trim: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Section', sectionSchema);
