const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: [true, 'Batch name is required'],
    unique: true,
    trim: true
  },
  trainerName: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true
  },
  studentCount: {
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

module.exports = mongoose.model('Batch', batchSchema);
