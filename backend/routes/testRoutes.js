const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

// Admin routes
router.post('/tests', testController.createTest);
router.get('/tests/batch/:batchId', testController.getTestsByBatch);
router.get('/tests/section/:sectionId', testController.getTestsBySection);
router.get('/tests/:testId', testController.getTestById);
router.put('/tests/:testId', testController.updateTest);
router.delete('/tests/:testId', testController.deleteTest);
router.get('/tests/:testId/submissions', testController.getTestSubmissions);

// Student routes
router.get('/tests/:testId/student', testController.getTestForStudent);
router.post('/tests/:testId/submit', testController.submitTest);
router.get('/students/:studentId/results', testController.getStudentResults);

module.exports = router;
