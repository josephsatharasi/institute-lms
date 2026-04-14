import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Eye, ArrowLeft } from 'lucide-react';
import { BatchDetailsView } from '../components/BatchDetailsView';

const API_URL = 'http://localhost:5000/api';

export function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    batchName: '',
    trainerName: ''
  });

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
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        fetchBatches();
        setShowForm(false);
        setFormData({ batchName: '', trainerName: '' });
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
    if (!window.confirm('Are you sure? This will not delete students.')) return;

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

  if (selectedBatch) {
    return (
      <BatchDetailsView 
        batch={selectedBatch} 
        onBack={() => {
          setSelectedBatch(null);
          fetchBatches();
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-gray-900">All Batches ({batches.length})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Create Batch
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h4 className="mb-4 text-lg font-semibold text-gray-900">Create New Batch</h4>
          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Batch Name</label>
                <input
                  type="text"
                  required
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., AJ_12F25_1412"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Trainer Name</label>
                <input
                  type="text"
                  required
                  value={formData.trainerName}
                  onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Priya Menon"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Batch'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 transition-all hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {batches.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white p-8 text-center shadow-lg">
            <p className="text-gray-500">No batches created yet. Click "Create Batch" to add one.</p>
          </div>
        ) : (
          batches.map((batch) => (
            <div
              key={batch._id}
              className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white shadow-lg transition-all hover:scale-105"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">{batch.batchName}</h3>
                <button
                  onClick={() => handleDeleteBatch(batch._id)}
                  className="rounded-lg bg-white/20 p-2 transition-all hover:bg-white/30"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-4 text-sm opacity-90">Trainer: {batch.trainerName}</p>
              <div className="mb-4 space-y-1 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{batch.studentCount} students</span>
                </div>
                <div>Sections: {batch.sectionCount || 0}</div>
                <div>Activities: {batch.activityCount || 0}</div>
              </div>
              <button
                onClick={() => setSelectedBatch(batch)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/20 px-4 py-2 transition-all hover:bg-white/30"
              >
                <Eye className="h-4 w-4" />
                Manage Sections & Activities
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
