import { useState, useEffect } from 'react';
import { X, FileText, Clock, Calendar } from 'lucide-react';

export function TestActivityModal({ isOpen, onClose, onCreateTest }) {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    description: '',
    type: 'practice',
    startDate: '',
    startTime: ''
  });
  const [endDateTime, setEndDateTime] = useState('');

  useEffect(() => {
    if (formData.startDate && formData.startTime && formData.duration) {
      calculateEndTime();
    }
  }, [formData.startDate, formData.startTime, formData.duration]);

  const calculateEndTime = () => {
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const durationMinutes = parseInt(formData.duration);
    
    if (!isNaN(durationMinutes) && durationMinutes > 0) {
      const endTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
      setEndDateTime(endTime.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }));
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.type === 'live') {
      const selectedDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const now = new Date();
      
      if (selectedDateTime <= now) {
        alert('Please select a future date and time for live tests');
        return;
      }
    }

    onCreateTest(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      duration: '',
      description: '',
      type: 'practice',
      startDate: '',
      startTime: ''
    });
    setEndDateTime('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-white" />
            <h3 className="text-2xl font-bold text-white">Create Test/Activity</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Test Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Test/Activity Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Mid-term Exam, Practice Quiz"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Duration (minutes) *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 pl-11 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., 60"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              placeholder="Add test instructions or description..."
              rows="3"
            />
          </div>

          {/* Type Slider */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Test Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'practice' })}
                className={`rounded-lg border-2 p-4 text-center font-semibold transition-all ${
                  formData.type === 'practice'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-green-300'
                }`}
              >
                <div className="text-lg">📝</div>
                <div className="mt-1">Practice</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'live' })}
                className={`rounded-lg border-2 p-4 text-center font-semibold transition-all ${
                  formData.type === 'live'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-red-300'
                }`}
              >
                <div className="text-lg">🔴</div>
                <div className="mt-1">Live</div>
              </button>
            </div>
          </div>

          {/* Live Test Schedule */}
          {formData.type === 'live' && (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 space-y-4">
              <div className="flex items-center gap-2 text-red-700 font-semibold">
                <Calendar className="h-5 w-5" />
                <span>Schedule Live Test</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required={formData.type === 'live'}
                    value={formData.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required={formData.type === 'live'}
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {endDateTime && (
                <div className="rounded-lg bg-white p-3 border border-red-200">
                  <div className="text-sm text-gray-600">Calculated End Time:</div>
                  <div className="text-lg font-semibold text-red-700">{endDateTime}</div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700"
            >
              Create Test
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
