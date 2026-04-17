const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class TestService {
  // Create test
  async createTest(testData) {
    const response = await fetch(`${API_URL}/tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    return response.json();
  }

  // Get tests by batch
  async getTestsByBatch(batchId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${API_URL}/tests/batch/${batchId}${queryParams ? `?${queryParams}` : ''}`;
    const response = await fetch(url);
    return response.json();
  }

  // Get tests by section
  async getTestsBySection(sectionId) {
    const response = await fetch(`${API_URL}/tests/section/${sectionId}`);
    return response.json();
  }

  // Get test by ID
  async getTestById(testId) {
    const response = await fetch(`${API_URL}/tests/${testId}`);
    return response.json();
  }

  // Get test for student (without answers)
  async getTestForStudent(testId, studentId) {
    const response = await fetch(`${API_URL}/tests/${testId}/student?studentId=${studentId}`);
    return response.json();
  }

  // Update test
  async updateTest(testId, updateData) {
    const response = await fetch(`${API_URL}/tests/${testId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return response.json();
  }

  // Delete test
  async deleteTest(testId) {
    const response = await fetch(`${API_URL}/tests/${testId}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Submit test
  async submitTest(testId, submissionData) {
    const response = await fetch(`${API_URL}/tests/${testId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });
    return response.json();
  }

  // Get student results
  async getStudentResults(studentId) {
    const response = await fetch(`${API_URL}/students/${studentId}/results`);
    return response.json();
  }

  // Get test submissions (admin)
  async getTestSubmissions(testId) {
    const response = await fetch(`${API_URL}/tests/${testId}/submissions`);
    return response.json();
  }
}

const testService = new TestService();
export default testService;
