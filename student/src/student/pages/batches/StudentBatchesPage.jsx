import { useState, useEffect } from 'react';
import { StudentBatchCard } from '../../components/batches/StudentBatchCard';
import { StudentBatchDetails } from '../../components/batches/StudentBatchDetails';
import { ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export function StudentBatchesPage({ onBack }) {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (selectedBatch) {
    return (
      <StudentBatchDetails 
        batch={selectedBatch} 
        onBack={() => setSelectedBatch(null)} 
      />
    );
  }
 
  if (loading) {
    return (
      <section className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-xl font-semibold text-gray-600">Loading courses...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md transition-all hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Portal Selection
        </button>
      )}
      
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Available Batches</h1>
        <p className="mt-2 text-lg text-slate-600">Select a batch to view course content</p>
      </header>

      {batches.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-lg text-gray-600">No batches available at the moment.</p>
          <p className="mt-2 text-sm text-gray-500">Please check back later.</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch, index) => (
            <StudentBatchCard 
              key={batch._id} 
              batch={batch} 
              index={index}
              onClick={() => setSelectedBatch(batch)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

