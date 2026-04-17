import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, CheckCircle2, Circle, ArrowRight, Square, CheckSquare, Menu, X, List } from 'lucide-react';
import { RichTextEditor } from '../../shared/components';

export function AddQuestionsPage({ testDetails, onBack, onSave }) {
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    type: 'single',
    options: ['', '', '', ''],
    correctAnswers: []
  });

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
    setShowSidebar(false);
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

  const handleSaveTest = () => {
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    onSave({ ...testDetails, questions });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile-Friendly Header */}
      <div className="sticky top-0 z-20 border-b bg-white shadow-sm">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-300"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex-1 px-2 sm:px-4">
              <h1 className="text-base font-bold text-gray-900 sm:text-2xl truncate">{testDetails.name}</h1>
              <p className="text-xs text-gray-600 sm:text-sm">Step 2: Add Questions</p>
            </div>

            {/* Mobile Questions Button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white lg:hidden"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">{questions.length}</span>
            </button>

            {/* Desktop Progress & Button */}
            <div className="hidden items-center gap-4 lg:flex">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">✓</div>
                <div className="h-1 w-12 bg-blue-600"></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">2</div>
                <div className="h-1 w-12 bg-gray-300"></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-600 font-bold">3</div>
              </div>
              <button
                onClick={handleSaveTest}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700"
              >
                Next: Review & Submit
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Question Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {!showQuestionForm && (
              <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
                <button
                  type="button"
                  onClick={() => setShowQuestionForm(true)}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-6 font-semibold text-blue-600 transition-all hover:border-blue-500 hover:bg-blue-100 sm:p-8"
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-base sm:text-lg">Add New Question</span>
                </button>
              </div>
            )}

            {showQuestionForm && (
              <div className="rounded-2xl bg-white p-4 shadow-lg space-y-4 sm:p-8 sm:space-y-6">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {editingQuestion !== null ? 'Edit Question' : 'Add New Question'}
                </h2>

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
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setQuestionForm({ ...questionForm, type: 'single', correctAnswers: [] })}
                      className={`rounded-lg border-2 p-3 font-semibold transition-all sm:p-4 ${
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
                      className={`rounded-lg border-2 p-3 font-semibold transition-all sm:p-4 ${
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
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Options * (Select correct answer{questionForm.type === 'multiple' ? 's' : ''})
                  </label>
                  <div className="space-y-3">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => toggleCorrectAnswer(index)}
                          className={`flex-shrink-0 rounded-lg p-2 transition-all border-2 sm:p-3 ${
                            questionForm.correctAnswers.includes(index)
                              ? 'bg-green-100 border-green-500 text-green-700 shadow-md'
                              : 'bg-gray-50 border-gray-300 text-gray-400 hover:bg-gray-100 hover:border-gray-400'
                          }`}
                        >
                          {questionForm.type === 'single' ? (
                            questionForm.correctAnswers.includes(index) ? (
                              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                            ) : (
                              <Circle className="h-5 w-5 sm:h-6 sm:w-6" />
                            )
                          ) : (
                            questionForm.correctAnswers.includes(index) ? (
                              <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                            ) : (
                              <Square className="h-5 w-5 sm:h-6 sm:w-6" />
                            )
                          )}
                        </button>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options];
                              newOptions[index] = e.target.value;
                              setQuestionForm({ ...questionForm, options: newOptions });
                            }}
                            className={`w-full rounded-lg border-2 px-3 py-2 text-base transition-all sm:px-4 sm:py-3 sm:text-lg ${
                              questionForm.correctAnswers.includes(index)
                                ? 'border-green-500 bg-green-50 font-medium'
                                : 'border-gray-300 bg-white focus:border-blue-500'
                            } focus:outline-none`}
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                    {questionForm.type === 'single' 
                      ? '💡 Click the circle to mark the correct answer' 
                      : '💡 Click the checkboxes to mark multiple correct answers'}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white hover:bg-green-700 sm:text-lg"
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
                    className="rounded-lg bg-gray-200 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-300 sm:px-8 sm:text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Questions ({questions.length})
              </h3>
              {questions.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">No questions added yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {questions.map((q, index) => (
                    <QuestionCard 
                      key={q.id} 
                      question={q} 
                      index={index} 
                      onEdit={handleEditQuestion}
                      onDelete={handleDeleteQuestion}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg lg:hidden">
          <button
            onClick={handleSaveTest}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg"
          >
            Next: Review & Submit
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-900">Questions ({questions.length})</h3>
              <button onClick={() => setShowSidebar(false)} className="rounded-lg p-2 hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 80px)' }}>
              {questions.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">No questions added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q, index) => (
                    <QuestionCard 
                      key={q.id} 
                      question={q} 
                      index={index} 
                      onEdit={handleEditQuestion}
                      onDelete={handleDeleteQuestion}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question, index, onEdit, onDelete }) {
  return (
    <div className="rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition-all">
      <div className="mb-2 flex items-start justify-between">
        <span className="rounded bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
          Q{index + 1}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(index)}
            className="rounded p-2 text-blue-600 hover:bg-blue-50"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="rounded p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div 
        className="mb-3 text-sm font-medium text-gray-900 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />
      <div className="space-y-1">
        {question.options.map((opt, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs ${
              question.correctAnswers.includes(i)
                ? 'bg-green-50 text-green-700 font-semibold'
                : 'bg-gray-50 text-gray-600'
            }`}
          >
            {question.correctAnswers.includes(i) && <CheckCircle2 className="h-3 w-3" />}
            <span className="line-clamp-1">{opt}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
      </div>
    </div>
  );
}
