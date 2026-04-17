import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, Calendar, FileText } from 'lucide-react';

export function CreateTestDetailsPage({ onNext, onBack, initialData = null }) {
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
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.startDate && formData.startTime && formData.duration) {
      calculateEndTime();
    } else {
      setEndDateTime('');
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

    onNext(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile-Friendly Header */}
      <div className="sticky top-0 z-20 border-b bg-white shadow-sm">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300 sm:px-4"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex-1 px-3 sm:px-4">
              <h1 className="text-lg font-bold text-gray-900 sm:text-2xl">Create Test</h1>
              <p className="text-xs text-gray-600 sm:text-sm">Step 1: Test Details</p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white sm:h-8 sm:w-8">1</div>
              <div className="h-0.5 w-6 bg-gray-300 sm:h-1 sm:w-12"></div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-600 sm:h-8 sm:w-8">2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Test Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                Test Type *
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'practice' })}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 text-center font-semibold transition-all sm:gap-3 sm:p-6 ${
                    formData.type === 'practice'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-green-300'
                  }`}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-base sm:text-lg">Practice Test</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'live' })}
                  className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 text-center font-semibold transition-all sm:gap-3 sm:p-6 ${
                    formData.type === 'live'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-red-300'
                  }`}
                >
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-base sm:text-lg">Live Test</span>
                </button>
              </div>
            </div>

            {/* Test Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Test Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none sm:px-4 sm:py-3 sm:text-lg"
                placeholder="e.g., Mid-term Exam"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Duration (minutes) *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:h-5 sm:w-5" />
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 pl-10 text-base focus:border-blue-500 focus:outline-none sm:px-4 sm:py-3 sm:pl-11 sm:text-lg"
                  placeholder="e.g., 60"
                />
              </div>
            </div>

            {/* Live Test Schedule */}
            {formData.type === 'live' && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 space-y-3 sm:space-y-4 sm:p-6">
                <div className="flex items-center gap-2 text-red-700 font-semibold text-base sm:text-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Schedule Live Test</span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-base focus:border-red-500 focus:outline-none sm:px-4 sm:py-3"
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
                      className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-base focus:border-red-500 focus:outline-none sm:px-4 sm:py-3"
                    />
                  </div>
                </div>

                {endDateTime && (
                  <div className="rounded-lg bg-white p-3 border border-red-200 sm:p-4">
                    <div className="text-sm text-gray-600">Calculated End Time:</div>
                    <div className="text-base font-semibold text-red-700 sm:text-xl">{endDateTime}</div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none sm:px-4 sm:py-3 sm:text-lg"
                placeholder="Add test instructions..."
                rows="4"
              />
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-2 sm:pt-4">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                Next: Add Questions
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
