import { useState, useEffect } from 'react';
import { FileText, Clock, Calendar, Award, AlertCircle } from 'lucide-react';
import testService from '../../shared/services/testService';
import socketService from '../../shared/services/socketService';
import { Badge, Card, Loader, EmptyState } from '../../shared/components';

export function StudentTestsPage({ studentId, batchId }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchTests();
    setupSocketListeners();

    return () => {
      socketService.off('new-test');
      socketService.off('test-updated');
      socketService.off('test-deleted');
      socketService.leaveBatch(batchId);
    };
  }, [batchId]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await testService.getTestsByBatch(batchId);
      if (response.success) {
        setTests(response.data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.connect();
    socketService.joinBatch(batchId);

    socketService.onNewTest((data) => {
      console.log('New test received:', data);
      setNotification({
        type: 'success',
        message: data.message
      });
      setTests(prev => [data.test, ...prev]);
      
      setTimeout(() => setNotification(null), 5000);
    });

    socketService.onTestUpdated((data) => {
      console.log('Test updated:', data);
      setNotification({
        type: 'info',
        message: data.message
      });
      fetchTests();
      
      setTimeout(() => setNotification(null), 5000);
    });

    socketService.onTestDeleted((data) => {
      console.log('Test deleted:', data);
      setNotification({
        type: 'warning',
        message: data.message
      });
      setTests(prev => prev.filter(test => test._id !== data.testId));
      
      setTimeout(() => setNotification(null), 5000);
    });
  };

  const handleStartTest = async (testId) => {
    try {
      const response = await testService.getTestForStudent(testId, studentId);
      if (response.success) {
        if (response.data.hasSubmitted) {
          alert('You have already submitted this test');
        } else {
          // Navigate to test taking page
          console.log('Start test:', response.data.test);
        }
      }
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Error loading test');
    }
  };

  const getTestStatus = (test) => {
    if (test.type === 'practice') {
      return { label: 'Practice', variant: 'success' };
    }
    
    const now = new Date();
    const startDateTime = new Date(`${test.startDate}T${test.startTime}`);
    
    if (now < startDateTime) {
      return { label: 'Upcoming', variant: 'warning' };
    } else if (now >= startDateTime && now <= new Date(startDateTime.getTime() + test.duration * 60000)) {
      return { label: 'Live Now', variant: 'danger' };
    } else {
      return { label: 'Completed', variant: 'default' };
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">Available Tests</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">View and attempt your tests</p>
        </div>

        {/* Real-time Notification */}
        {notification && (
          <div className={`mb-6 rounded-lg border-2 p-4 ${
            notification.type === 'success' ? 'border-green-500 bg-green-50' :
            notification.type === 'info' ? 'border-blue-500 bg-blue-50' :
            'border-yellow-500 bg-yellow-50'
          }`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`h-5 w-5 ${
                notification.type === 'success' ? 'text-green-600' :
                notification.type === 'info' ? 'text-blue-600' :
                'text-yellow-600'
              }`} />
              <p className={`font-semibold ${
                notification.type === 'success' ? 'text-green-900' :
                notification.type === 'info' ? 'text-blue-900' :
                'text-yellow-900'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        )}

        {/* Tests Grid */}
        {tests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No tests available"
            description="Tests will appear here when your instructor creates them"
          />
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => {
              const status = getTestStatus(test);
              return (
                <Card key={test._id} hover className="flex flex-col">
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{test.name}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">{test.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FileText className="h-4 w-4" />
                      <span>{test.questionCount || test.questions?.length || 0} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Award className="h-4 w-4" />
                      <span>{test.totalMarks} marks</span>
                    </div>
                    {test.type === 'live' && test.startDate && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(test.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartTest(test._id)}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700"
                  >
                    {status.label === 'Live Now' ? 'Start Test' : 'View Test'}
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
