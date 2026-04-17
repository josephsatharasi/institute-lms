const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'multiple'],
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswers: [{
    type: Number,
    required: true
  }]
});

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ['practice', 'live'],
    required: true
  },
  startDate: {
    type: Date,
    required: function() {
      return this.type === 'live';
    }
  },
  startTime: {
    type: String,
    required: function() {
      return this.type === 'live';
    }
  },
  questions: [questionSchema],
  marksPerQuestion: {
    type: Number,
    required: true,
    min: 0
  },
  negativeMarks: {
    type: Number,
    default: 0,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true
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
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed'],
    default: 'published'
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
testSchema.index({ batchId: 1, sectionId: 1 });
testSchema.index({ status: 1, type: 1 });
testSchema.index({ startDate: 1 });

// Update timestamp on save
testSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Test', testSchema);
