const Test = require('../models/Test');
const TestSubmission = require('../models/TestSubmission');
const Section = require('../models/Section');
const Batch = require('../models/Batch');

// Create a new test
exports.createTest = async (req, res) => {
  try {
    const {
      name,
      description,
      duration,
      type,
      startDate,
      startTime,
      questions,
      marksPerQuestion,
      negativeMarks,
      totalMarks,
      sectionId,
      batchId,
      createdBy
    } = req.body;

    // Validate section and batch exist
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Create test
    const test = new Test({
      name,
      description,
      duration,
      type,
      startDate: type === 'live' ? startDate : null,
      startTime: type === 'live' ? startTime : null,
      questions,
      marksPerQuestion,
      negativeMarks: negativeMarks || 0,
      totalMarks,
      sectionId,
      batchId,
      createdBy: createdBy || 'Admin',
      status: 'published'
    });

    await test.save();

    // Emit real-time event to students
    const io = req.app.get('io');
    if (io) {
      io.to(`batch-${batchId}`).emit('new-test', {
        test: {
          _id: test._id,
          name: test.name,
          description: test.description,
          duration: test.duration,
          type: test.type,
          totalMarks: test.totalMarks,
          questionCount: test.questions.length,
          startDate: test.startDate,
          startTime: test.startTime,
          createdAt: test.createdAt
        },
        message: `New ${type} test "${name}" has been created!`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test',
      error: error.message
    });
  }
};

// Get all tests for a batch
exports.getTestsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { status, type } = req.query;

    const query = { batchId };
    if (status) query.status = status;
    if (type) query.type = type;

    const tests = await Test.find(query)
      .populate('sectionId', 'sectionName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tests,
      count: tests.length
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tests',
      error: error.message
    });
  }
};

// Get all tests for a section
exports.getTestsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const tests = await Test.find({ sectionId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tests,
      count: tests.length
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tests',
      error: error.message
    });
  }
};

// Get single test by ID
exports.getTestById = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId)
      .populate('sectionId', 'sectionName')
      .populate('batchId', 'batchName trainerName');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test',
      error: error.message
    });
  }
};

// Get test for student (without correct answers)
exports.getTestForStudent = async (req, res) => {
  try {
    const { testId } = req.params;
    const { studentId } = req.query;

    const test = await Test.findById(testId)
      .populate('sectionId', 'sectionName')
      .select('-questions.correctAnswers');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check if student has already submitted
    const submission = await TestSubmission.findOne({
      testId,
      studentId
    });

    res.json({
      success: true,
      data: {
        test,
        hasSubmitted: !!submission,
        submission: submission || null
      }
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test',
      error: error.message
    });
  }
};

// Update test
exports.updateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const updateData = req.body;

    const test = await Test.findByIdAndUpdate(
      testId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`batch-${test.batchId}`).emit('test-updated', {
        testId: test._id,
        message: `Test "${test.name}" has been updated`
      });
    }

    res.json({
      success: true,
      message: 'Test updated successfully',
      data: test
    });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating test',
      error: error.message
    });
  }
};

// Delete test
exports.deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Delete all submissions for this test
    await TestSubmission.deleteMany({ testId });

    await Test.findByIdAndDelete(testId);

    // Emit real-time deletion
    const io = req.app.get('io');
    if (io) {
      io.to(`batch-${test.batchId}`).emit('test-deleted', {
        testId,
        message: `Test "${test.name}" has been deleted`
      });
    }

    res.json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting test',
      error: error.message
    });
  }
};

// Submit test (student)
exports.submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { studentId, answers, timeSpent } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check if already submitted
    const existingSubmission = await TestSubmission.findOne({
      testId,
      studentId
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Test already submitted'
      });
    }

    // Evaluate answers
    let score = 0;
    const evaluatedAnswers = answers.map((answer, index) => {
      const question = test.questions[index];
      const correctAnswers = question.correctAnswers;
      const selectedAnswers = answer.selectedAnswers;

      let isCorrect = false;
      let marksAwarded = 0;

      if (question.type === 'single') {
        isCorrect = selectedAnswers.length === 1 && 
                   correctAnswers.includes(selectedAnswers[0]);
        marksAwarded = isCorrect ? test.marksPerQuestion : -test.negativeMarks;
      } else {
        // Multiple choice
        isCorrect = correctAnswers.length === selectedAnswers.length &&
                   correctAnswers.every(ans => selectedAnswers.includes(ans));
        marksAwarded = isCorrect ? test.marksPerQuestion : -test.negativeMarks;
      }

      score += marksAwarded;

      return {
        questionId: question._id,
        selectedAnswers,
        isCorrect,
        marksAwarded
      };
    });

    const percentage = (score / test.totalMarks) * 100;

    const submission = new TestSubmission({
      testId,
      studentId,
      batchId: test.batchId,
      answers: evaluatedAnswers,
      submittedAt: Date.now(),
      timeSpent,
      score,
      totalMarks: test.totalMarks,
      percentage,
      status: 'evaluated'
    });

    await submission.save();

    res.json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        score,
        totalMarks: test.totalMarks,
        percentage,
        submission
      }
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting test',
      error: error.message
    });
  }
};

// Get test results for a student
exports.getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    const submissions = await TestSubmission.find({ studentId })
      .populate('testId', 'name type totalMarks')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: submissions,
      count: submissions.length
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching results',
      error: error.message
    });
  }
};

// Get all submissions for a test (admin)
exports.getTestSubmissions = async (req, res) => {
  try {
    const { testId } = req.params;

    const submissions = await TestSubmission.find({ testId })
      .populate('studentId', 'name email rollNumber')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: submissions,
      count: submissions.length
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};
