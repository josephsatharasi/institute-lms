import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, CheckCircle2, Circle, Clock, Calendar, FileText, Save } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

export function CreateTestPage({ onBack, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    description: '',
    type: 'practice',
    startDate: '',
    startTime: ''
  });
  const [endDateTime, setEndDateTime] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    type: 'single',
    options: ['', '', '', ''],
    correctAnswers: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setQuestions(initialData.questions || []);
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

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    onSave({ ...formData, questions });
  };

  const handleAddQuestion = () => {
    if (!questionForm.question.trim()) {
      alert('Please enter a question');
      return;
    }
    if (questionForm.options.some(opt => !opt.trim())) {
      alert('Please fill all options');
      return;
    }
    if (questionForm.correctAnswers.length === 0) {
      alert('Please select at least one correct answer');
      return;
    }

    if (editingQuestion !== null) {
      const updated = [...questions];
      updated[editingQuestion] = { ...questionForm, id: Date.now() };
      setQuestions(updated);
      setEditingQuestion(null);
    } else {
      setQuestions([...questions, { ...questionForm, id: Date.now() }]);
    }

    setQuestionForm({
      question: '',
      type: 'single',
      options: ['', '', '', ''],
      correctAnswers: []
    });
    setShowQuestionForm(false);
  };

  const handleEditQuestion = (index) => {
    setQuestionForm(questions[index]);
    setEditingQuestion(index);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm('Delete this question?')) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const toggleCorrectAnswer = (index) => {
    if (questionForm.type === 'single') {
      setQuestionForm({ ...questionForm, correctAnswers: [index] });
    } else {
      const current = questionForm.correctAnswers;
      if (current.includes(index)) {
        setQuestionForm({ ...questionForm, correctAnswers: current.filter(i => i !== index) });
      } else {
        setQuestionForm({ ...questionForm, correctAnswers: [...current, index] });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-300"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {initialData ? 'Edit Test' : 'Create New Test'}
                </h1>
                <p className="text-sm text-gray-600">Fill in the details and add questions</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="h-5 w-5" />
              Save Test
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Details Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Test Details</h2>
              
              <div className="space-y-6">
                {/* Test Type */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Test Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'practice' })}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 text-center font-semibold transition-all ${
                        formData.type === 'practice'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-green-300'
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                      <span>Practice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'live' })}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 text-center font-semibold transition-all ${
                        formData.type === 'live'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-red-300'
                      }`}
                    >
                      <Clock className="h-5 w-5" />
                      <span>Live</span>
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

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                    placeholder="Add test instructions or description..."
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Questions Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Questions ({questions.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setShowQuestionForm(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                  Add Question
                </button>
              </div>

              {showQuestionForm && (
                <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-6 space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Question *
                    </label>
                    <RichTextEditor
                      value={questionForm.question}
                      onChange={(value) => setQuestionForm({ ...questionForm, question: value })}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Question Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setQuestionForm({ ...questionForm, type: 'single', correctAnswers: [] })}
                        className={`rounded-lg border-2 p-3 font-semibold transition-all ${
                          questionForm.type === 'single'
                            ? 'border-blue-500 bg-blue-100 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        Single Choice
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuestionForm({ ...questionForm, type: 'multiple', correctAnswers: [] })}
                        className={`rounded-lg border-2 p-3 font-semibold transition-all ${
                          questionForm.type === 'multiple'
                            ? 'border-blue-500 bg-blue-100 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        Multiple Choice
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Options * (Click icon to mark as correct)
                    </label>
                    <div className="space-y-3">
                      {questionForm.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleCorrectAnswer(index)}
                            className={`flex-shrink-0 rounded-lg p-2 transition-all ${
                              questionForm.correctAnswers.includes(index)
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {questionForm.correctAnswers.includes(index) ? (
                              <CheckCircle2 className="h-6 w-6" />
                            ) : (
                              <Circle className="h-6 w-6" />
                            )}
                          </button>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options];
                              newOptions[index] = e.target.value;
                              setQuestionForm({ ...questionForm, options: newOptions });
                            }}
                            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                    >
                      {editingQuestion !== null ? 'Update Question' : 'Add Question'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setEditingQuestion(null);
                        setQuestionForm({
                          question: '',
                          type: 'single',
                          options: ['', '', '', ''],
                          correctAnswers: []
                        });
                      }}
                      className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {questions.length === 0 && !showQuestionForm && (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                  <p className="text-gray-500">No questions added yet. Click "Add Question" to start.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Questions List */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Questions List ({questions.length})
              </h3>
              {questions.length === 0 ? (
                <p className="text-center text-sm text-gray-500">No questions yet</p>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {questions.map((q, index) => (
                    <div key={q.id} className="rounded-lg border-2 border-gray-200 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                          Q{index + 1}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditQuestion(index)}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(index)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div 
                        className="mb-3 text-sm font-medium text-gray-900"
                        dangerouslySetInnerHTML={{ __html: q.question }}
                      />
                      <div className="space-y-1">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs ${
                              q.correctAnswers.includes(i)
                                ? 'bg-green-50 text-green-700 font-semibold'
                                : 'bg-gray-50 text-gray-600'
                            }`}
                          >
                            {q.correctAnswers.includes(i) && <CheckCircle2 className="h-3 w-3" />}
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {q.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
