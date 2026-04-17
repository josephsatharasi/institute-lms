import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { DashboardPage } from './DashboardPage';
import { BatchesPage } from './BatchesPage';
import { StudentsPage } from './StudentsPage';
import { CoursesPage } from './CoursesPage';
import { CreateTestDetailsPage } from './CreateTestDetailsPage';
import { AddQuestionsPage } from './AddQuestionsPage';
import { ReviewTestPage } from './ReviewTestPage';
import testService from '../../shared/services/testService';
import socketService from '../../shared/services/socketService';

export function AdminDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [testCreationStep, setTestCreationStep] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [testWithQuestions, setTestWithQuestions] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentBatchId, setCurrentBatchId] = useState(null);

  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleStartTestCreation = (sectionId, batchId) => {
    setCurrentSectionId(sectionId);
    setCurrentBatchId(batchId);
    setTestCreationStep('details');
  };

  const handleTestDetailsNext = (details) => {
    setTestDetails(details);
    setTestCreationStep('questions');
  };

  const handleQuestionsNext = (testData) => {
    setTestWithQuestions(testData);
    setTestCreationStep('review');
  };

  const handleFinalSubmit = async (finalTestData) => {
    try {
      const testPayload = {
        ...finalTestData,
        sectionId: currentSectionId,
        batchId: currentBatchId,
        createdBy: 'Admin'
      };

      const response = await testService.createTest(testPayload);

      if (response.success) {
        alert('Test created successfully! Students will be notified in real-time.');
        setTestCreationStep(null);
        setTestDetails(null);
        setTestWithQuestions(null);
        setCurrentSectionId(null);
        setCurrentBatchId(null);
        setActiveMenu('batches');
      } else {
        alert(response.message || 'Error creating test');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Error creating test. Please try again.');
    }
  };

  const handleBackFromQuestions = () => {
    setTestCreationStep('details');
  };

  const handleBackFromReview = () => {
    setTestCreationStep('questions');
  };

  const handleBackFromDetails = () => {
    setTestCreationStep(null);
    setTestDetails(null);
    setCurrentSectionId(null);
    setCurrentBatchId(null);
  };

  if (testCreationStep === 'details') {
    return (
      <CreateTestDetailsPage
        onBack={handleBackFromDetails}
        onNext={handleTestDetailsNext}
        initialData={testDetails}
      />
    );
  }

  if (testCreationStep === 'questions') {
    return (
      <AddQuestionsPage
        testDetails={testDetails}
        onBack={handleBackFromQuestions}
        onSave={handleQuestionsNext}
      />
    );
  }

  if (testCreationStep === 'review') {
    return (
      <ReviewTestPage
        testData={testWithQuestions}
        onBack={handleBackFromReview}
        onSubmit={handleFinalSubmit}
      />
    );
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardPage />;
      case 'batches':
        return <BatchesPage onStartTestCreation={handleStartTestCreation} />;
      case 'students':
        return <StudentsPage />;
      case 'courses':
        return <CoursesPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      onLogout={onLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
}
