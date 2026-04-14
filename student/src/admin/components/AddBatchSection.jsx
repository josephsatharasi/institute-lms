import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const courseOptions = [
  { name: 'MERN Stack Development', icon: '💻', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Java Full Stack', icon: '☕', gradient: 'from-orange-500 to-red-500' },
  { name: 'Python Full Stack', icon: '🐍', gradient: 'from-green-500 to-emerald-600' },
  { name: 'Data Science & AI', icon: '🤖', gradient: 'from-purple-500 to-pink-500' },
  { name: 'DevOps Engineering', icon: '⚙️', gradient: 'from-indigo-500 to-blue-600' },
  { name: 'Cloud Computing', icon: '☁️', gradient: 'from-teal-500 to-cyan-600' }
];

export function AddBatchSection() {
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseOptions[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch(`${API_URL}/batches`);
      const data = await response.json();
      if (data.success) {
        setBatches(data.data);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: selectedCourse.name,
          icon: selectedCourse.icon,
          gradient: selectedCourse.gradient
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchBatches();
        alert('Batch created successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error creating batch');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatch = async (id) => {
    if (!window.confirm('Are you sure you want to delete this batch?')) return;

    try {
      const response = await fetch(`${API_URL}/batches/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchBatches();
        alert('Batch deleted successfully!');
      }
    } catch (error) {
      alert('Error deleting batch');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Create New Batch</h2>

        <form onSubmit={handleCreateBatch} className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">Select Course</label>
            <div className="grid gap-3">
              {courseOptions.map((course) => (
                <button
                  key={course.name}
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                    selectedCourse.name === course.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">{course.icon}</span>
                  <span className="font-semibold text-gray-900">{course.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
            {loading ? 'Creating...' : 'Create Batch'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Active Batches ({batches.length})
        </h2>
        <div className="max-h-[600px] space-y-4 overflow-y-auto">
          {batches.length === 0 ? (
            <p className="py-8 text-center text-gray-500">No batches created yet</p>
          ) : (
            batches.map((batch) => (
              <div
                key={batch._id}
                className={`flex items-center justify-between rounded-lg bg-gradient-to-r ${batch.gradient} p-4 text-white`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{batch.icon}</span>
                  <div>
                    <h3 className="font-semibold">{batch.courseName}</h3>
                    <p className="text-sm opacity-90">{batch.studentCount} students</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBatch(batch._id)}
                  className="rounded-lg bg-white/20 p-2 transition-all hover:bg-white/30"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
