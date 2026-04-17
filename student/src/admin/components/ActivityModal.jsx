import { X, FileText, ClipboardList, BarChart3, Mic, HelpCircle, Rocket, Bookmark, FileEdit, Link2, Video } from 'lucide-react';
import { useState } from 'react';

const activityTemplates = [
  {
    type: 'test',
    icon: FileText,
    label: 'Test',
    color: 'from-blue-500 to-blue-600',
    description: 'Create a test or exam'
  },
  {
    type: 'assignment',
    icon: ClipboardList,
    label: 'Assignment',
    color: 'from-green-500 to-green-600',
    description: 'Create an assignment'
  },
  {
    type: 'quiz',
    icon: HelpCircle,
    label: 'Quiz',
    color: 'from-pink-500 to-pink-600',
    description: 'Create a quick quiz'
  },
  {
    type: 'note',
    icon: FileEdit,
    label: 'Note',
    color: 'from-yellow-500 to-yellow-600',
    description: 'Add study notes'
  },
  {
    type: 'link',
    icon: Link2,
    label: 'Link',
    color: 'from-cyan-500 to-cyan-600',
    description: 'Add external link'
  },
  {
    type: 'live-class',
    icon: Video,
    label: 'Live Class',
    color: 'from-red-500 to-red-600',
    description: 'Schedule live class'
  },
  {
    type: 'poll',
    icon: BarChart3,
    label: 'Poll',
    color: 'from-purple-500 to-purple-600',
    description: 'Create a poll or survey'
  },
  {
    type: 'interview',
    icon: Mic,
    label: 'Interview',
    color: 'from-orange-500 to-orange-600',
    description: 'Schedule an interview'
  },
  {
    type: 'project',
    icon: Rocket,
    label: 'Project',
    color: 'from-indigo-500 to-indigo-600',
    description: 'Assign a project'
  },
  {
    type: 'other',
    icon: Bookmark,
    label: 'Other',
    color: 'from-gray-500 to-gray-600',
    description: 'Custom activity'
  }
];

export function ActivityModal({ isOpen, onClose, onCreateActivity }) {
  const [selectedType, setSelectedType] = useState(null);
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');

  const handleTemplateClick = (type) => {
    if (type === 'test') {
      // Close modal and trigger test creation
      onCreateActivity({ activityType: 'test' });
      onClose();
    } else {
      setSelectedType(type);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedType && activityName) {
      onCreateActivity({
        activityName,
        activityType: selectedType,
        description
      });
      setSelectedType(null);
      setActivityName('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4 sm:p-6">
          <h3 className="text-lg font-bold text-gray-900 sm:text-2xl">Create New Activity</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {!selectedType ? (
            <>
              <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">Select an activity type to get started</p>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activityTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.type}
                      onClick={() => handleTemplateClick(template.type)}
                      className="group rounded-2xl border-2 border-gray-200 p-4 text-left transition-all hover:border-blue-500 hover:shadow-lg sm:p-6"
                    >
                      <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${template.color} p-2 sm:mb-4 sm:p-3`}>
                        <Icon className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                      </div>
                      <h4 className="mb-1 text-base font-semibold text-gray-900 sm:mb-2 sm:text-lg">{template.label}</h4>
                      <p className="text-xs text-gray-600 sm:text-sm">{template.description}</p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:gap-4 sm:p-6">
                {(() => {
                  const template = activityTemplates.find(t => t.type === selectedType);
                  const Icon = template.icon;
                  return (
                    <>
                      <div className={`rounded-xl bg-gradient-to-br ${template.color} p-2 sm:p-3`}>
                        <Icon className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900 sm:text-xl">{template.label}</h4>
                        <p className="text-xs text-gray-600 sm:text-sm">{template.description}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Activity Name *
                </label>
                <input
                  type="text"
                  required
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter activity name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter activity description"
                  rows="4"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700"
                >
                  Create Activity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType(null);
                    setActivityName('');
                    setDescription('');
                  }}
                  className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-300"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
