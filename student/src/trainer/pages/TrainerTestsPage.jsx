import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button, Card, Badge, EmptyState, CreateTestPage } from '../../shared/components';

export function TrainerTestsPage() {
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [tests, setTests] = useState([]);

  const handleCreateTest = (testData) => {
    const newTest = {
      id: Date.now(),
      ...testData,
      createdAt: new Date().toISOString()
    };
    setTests([...tests, newTest]);
    setShowCreatePage(false);
    console.log('Test Created:', newTest);
  };

  if (showCreatePage) {
    return (
      <CreateTestPage
        onBack={() => setShowCreatePage(false)}
        onSave={handleCreateTest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Tests & Activities</h1>
            <p className="mt-2 text-gray-600">Create and manage your tests</p>
          </div>
          <Button onClick={() => setShowCreatePage(true)} icon={Plus}>
            Create Test
          </Button>
        </div>

        {/* Tests List */}
        {tests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No tests created yet"
            description='Click "Create Test" to get started'
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <Card key={test.id} hover>
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
                  <Badge variant={test.type === 'live' ? 'danger' : 'success'}>
                    {test.type === 'live' ? '🔴 Live' : '📝 Practice'}
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-gray-600">{test.description || 'No description'}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold">Duration:</span>
                    <span>{test.duration} minutes</span>
                  </div>
                  {test.type === 'live' && test.startDate && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">Starts:</span>
                      <span>{new Date(`${test.startDate}T${test.startTime}`).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
