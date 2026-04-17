import { useState } from 'react';
import { ArrowLeft, Save, CheckCircle2, Edit2, Menu, X } from 'lucide-react';

export function ReviewTestPage({ testData, onBack, onSubmit }) {
  const [marksPerQuestion, setMarksPerQuestion] = useState('1');
  const [negativeMarks, setNegativeMarks] = useState('0');
  const [totalMarks, setTotalMarks] = useState(testData.questions.length);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleMarksChange = (value) => {
    setMarksPerQuestion(value);
    setTotalMarks(testData.questions.length * parseFloat(value || 0));
  };

  const handleSubmit = () => {
    if (!marksPerQuestion || parseFloat(marksPerQuestion) <= 0) {
      alert('Please enter valid marks per question');
      return;
    }

    const finalTestData = {
      ...testData,
      marksPerQuestion: parseFloat(marksPerQuestion),
      negativeMarks: parseFloat(negativeMarks),
      totalMarks: totalMarks
    };

    onSubmit(finalTestData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20 lg:pb-0">
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
              <h1 className="text-base font-bold text-gray-900 sm:text-2xl truncate">{testData.name}</h1>
              <p className="text-xs text-gray-600 sm:text-sm">Step 3: Review & Submit</p>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Desktop Progress & Button */}
            <div className="hidden items-center gap-4 lg:flex">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">✓</div>
                <div className="h-1 w-12 bg-green-600"></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-bold">✓</div>
                <div className="h-1 w-12 bg-blue-600"></div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">3</div>
              </div>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:from-green-700 hover:to-emerald-700"
              >
                <Save className="h-5 w-5" />
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Test Details Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Test Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Test Type:</span>
                  <span className="font-semibold text-gray-900 capitalize">{testData.type}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-900">{testData.duration} min</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-semibold text-gray-900">{testData.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Marks:</span>
                  <span className="text-2xl font-bold text-blue-600">{totalMarks}</span>
                </div>
              </div>
            </div>

            {/* Marks Configuration Card */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Marks Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Marks per Question *
                  </label>
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={marksPerQuestion}
                    onChange={(e) => handleMarksChange(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg font-semibold focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Negative Marks (per wrong answer)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg font-semibold focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 0.25"
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave 0 for no negative marking</p>
                </div>

                <div className="rounded-lg bg-white p-4 border-2 border-blue-300">
                  <div className="text-sm text-gray-600">Calculated Total Marks:</div>
                  <div className="text-3xl font-bold text-blue-600">{totalMarks}</div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Description</h3>
              <p className="text-gray-600">{testData.description}</p>
            </div>
          </div>

          {/* Right Column - Questions Review */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Questions Review ({testData.questions.length})
                </h2>
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Questions
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {testData.questions.map((question, index) => (
                  <div key={question.id} className="rounded-xl border-2 border-gray-200 p-4 hover:border-blue-300 transition-all sm:p-6">
                    <div className="mb-3 flex items-start justify-between sm:mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white sm:h-10 sm:w-10 sm:text-lg">
                          {index + 1}
                        </span>
                        <div>
                          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700 sm:px-3">
                            {question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Marks</div>
                        <div className="text-sm font-bold text-green-600 sm:text-xl">+{marksPerQuestion}</div>
                        {parseFloat(negativeMarks) > 0 && (
                          <div className="text-sm font-semibold text-red-600">-{negativeMarks}</div>
                        )}
                      </div>
                    </div>

                    <div 
                      className="mb-3 text-base font-medium text-gray-900 sm:mb-4 sm:text-lg"
                      dangerouslySetInnerHTML={{ __html: question.question }}
                    />

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 rounded-lg p-2 transition-all sm:gap-3 sm:p-3 ${
                            question.correctAnswers.includes(optIndex)
                              ? 'bg-green-100 border-2 border-green-500'
                              : 'bg-gray-50 border-2 border-gray-200'
                          }`}
                        >
                          {question.correctAnswers.includes(optIndex) && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                          )}
                          <span className={`flex-1 text-sm sm:text-base ${
                            question.correctAnswers.includes(optIndex)
                              ? 'font-semibold text-green-900'
                              : 'text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </span>
                          {question.correctAnswers.includes(optIndex) && (
                            <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                              Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg lg:hidden">
          <button
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg"
          >
            <Save className="h-5 w-5" />
            Submit Test
          </button>
        </div>

        {/* Mobile Sidebar */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)}></div>
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="text-lg font-bold text-gray-900">Test Summary</h3>
                <button onClick={() => setShowSidebar(false)} className="rounded-lg p-2 hover:bg-gray-100">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Test Details Card */}
                <div className="rounded-2xl bg-white border-2 border-gray-200 p-4">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">Test Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Test Type:</span>
                      <span className="font-semibold text-gray-900 capitalize">{testData.type}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold text-gray-900">{testData.duration} min</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Total Questions:</span>
                      <span className="font-semibold text-gray-900">{testData.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Marks:</span>
                      <span className="text-2xl font-bold text-blue-600">{totalMarks}</span>
                    </div>
                  </div>
                </div>

                {/* Marks Configuration Card */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">Marks Configuration</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Marks per Question *
                      </label>
                      <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={marksPerQuestion}
                        onChange={(e) => handleMarksChange(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg font-semibold focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., 1"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Negative Marks (per wrong answer)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        value={negativeMarks}
                        onChange={(e) => setNegativeMarks(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg font-semibold focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., 0.25"
                      />
                      <p className="mt-1 text-xs text-gray-500">Leave 0 for no negative marking</p>
                    </div>

                    <div className="rounded-lg bg-white p-4 border-2 border-blue-300">
                      <div className="text-sm text-gray-600">Calculated Total Marks:</div>
                      <div className="text-3xl font-bold text-blue-600">{totalMarks}</div>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="rounded-2xl bg-white border-2 border-gray-200 p-4">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">Description</h3>
                  <p className="text-gray-600">{testData.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
