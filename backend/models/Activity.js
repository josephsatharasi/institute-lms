const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityName: {
    type: String,
    required: [true, 'Activity name is required'],
    trim: true
  },
  activityType: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: ['test', 'assignment', 'poll', 'interview', 'quiz', 'project', 'note', 'link', 'live-class', 'other']
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
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
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
