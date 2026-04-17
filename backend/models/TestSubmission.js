const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedAnswers: [{
    type: Number
  }],
  isCorrect: {
    type: Boolean,
    default: false
  },
  marksAwarded: {
    type: Number,
    default: 0
  }
});

const testSubmissionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  answers: [answerSchema],
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'submitted', 'evaluated'],
    default: 'in-progress'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
testSubmissionSchema.index({ testId: 1, studentId: 1 });
testSubmissionSchema.index({ batchId: 1, status: 1 });
testSubmissionSchema.index({ studentId: 1, submittedAt: -1 });

// Ensure one submission per student per test
testSubmissionSchema.index({ testId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('TestSubmission', testSubmissionSchema);
