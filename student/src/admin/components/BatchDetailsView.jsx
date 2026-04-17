import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronRight, MoreVertical, Edit2, FileText, ClipboardList, HelpCircle, FileEdit, Link2, Video, BarChart3 } from 'lucide-react';
import { ActivityModal } from './ActivityModal';

const API_URL = 'http://localhost:5000/api';

export function BatchDetailsView({ batch, onBack, onStartTestCreation }) {
  const [sections, setSections] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(null);
  const [sectionForm, setSectionForm] = useState({ sectionName: '', description: '' });
  const [editingSection, setEditingSection] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [sectionMenuOpen, setSectionMenuOpen] = useState(null);
  const [activityMenuOpen, setActivityMenuOpen] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch(`${API_URL}/batches/${batch._id}/sections`);
      const data = await response.json();
      if (data.success) {
        const sectionsWithActivities = await Promise.all(
          data.data.map(async (section) => {
            const actRes = await fetch(`${API_URL}/sections/${section._id}/activities`);
            const actData = await actRes.json();
            const activities = actData.success ? actData.data : [];
            
            // Count activities by type
            const activityCounts = {
              test: activities.filter(a => a.activityType === 'test').length,
              assignment: activities.filter(a => a.activityType === 'assignment').length,
              quiz: activities.filter(a => a.activityType === 'quiz').length,
              note: activities.filter(a => a.activityType === 'note').length,
              link: activities.filter(a => a.activityType === 'link').length,
              liveClass: activities.filter(a => a.activityType === 'live-class').length,
              poll: activities.filter(a => a.activityType === 'poll').length,
            };
            
            return { ...section, activities, activityCounts };
          })
        );
        setSections(sectionsWithActivities);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/batches/${batch._id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionForm)
      });
      const data = await response.json();
      if (data.success) {
        fetchSections();
        setShowSectionForm(false);
        setSectionForm({ sectionName: '', description: '' });
        alert('Section created successfully!');
      }
    } catch (error) {
      alert('Error creating section');
    }
  };

  const handleCreateActivity = async (activityData, sectionId) => {
    // If it's a test activity, use the new flow
    if (activityData.activityType === 'test' && onStartTestCreation) {
      onStartTestCreation(sectionId, batch._id);
      return;
    }

    // Otherwise, use the old flow for other activity types
    try {
      const response = await fetch(`${API_URL}/sections/${sectionId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      const data = await response.json();
      if (data.success) {
        fetchSections();
        setShowActivityModal(null);
        alert('Activity created successfully!');
      }
    } catch (error) {
      alert('Error creating activity');
    }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Delete this section?')) return;
    try {
      const response = await fetch(`${API_URL}/sections/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchSections();
        setSectionMenuOpen(null);
        alert('Section deleted!');
      }
    } catch (error) {
      alert('Error deleting section');
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      const response = await fetch(`${API_URL}/activities/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchSections();
        setActivityMenuOpen(null);
        alert('Activity deleted!');
      }
    } catch (error) {
      alert('Error deleting activity');
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      test: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
      assignment: { icon: ClipboardList, color: 'text-green-600', bg: 'bg-green-50' },
      quiz: { icon: HelpCircle, color: 'text-pink-600', bg: 'bg-pink-50' },
      note: { icon: FileEdit, color: 'text-yellow-600', bg: 'bg-yellow-50' },
      link: { icon: Link2, color: 'text-cyan-600', bg: 'bg-cyan-50' },
      'live-class': { icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
      poll: { icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    };
    return icons[type] || { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-all hover:bg-gray-300"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Batches
        </button>
        <div className="text-left sm:text-right">
          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{batch.batchName}</h3>
          <p className="text-sm text-gray-600">Trainer: {batch.trainerName}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-base font-semibold text-gray-900 sm:text-lg">Sections ({sections.length})</h4>
        <button
          onClick={() => setShowSectionForm(!showSectionForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700"
        >
          <Plus className="h-5 w-5" />
          Add Section
        </button>
      </div>

      {showSectionForm && (
        <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
          <h5 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">Create New Section</h5>
          <form onSubmit={handleCreateSection} className="space-y-4">
            <input
              type="text"
              required
              value={sectionForm.sectionName}
              onChange={(e) => setSectionForm({ ...sectionForm, sectionName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Section Name"
            />
            <textarea
              value={sectionForm.description}
              onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Description (optional)"
              rows="2"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                Create Section
              </button>
              <button
                type="button"
                onClick={() => setShowSectionForm(false)}
                className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-lg sm:p-8">
            <p className="text-gray-500">No sections yet. Click "Add Section" to create one.</p>
          </div>
        ) : (
          sections.map((section) => {
            const counts = section.activityCounts || {};
            const activityTypes = [
              { type: 'test', icon: FileText, count: counts.test, color: 'text-blue-600', bg: 'bg-blue-50' },
              { type: 'assignment', icon: ClipboardList, count: counts.assignment, color: 'text-green-600', bg: 'bg-green-50' },
              { type: 'quiz', icon: HelpCircle, count: counts.quiz, color: 'text-pink-600', bg: 'bg-pink-50' },
              { type: 'note', icon: FileEdit, count: counts.note, color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { type: 'link', icon: Link2, count: counts.link, color: 'text-cyan-600', bg: 'bg-cyan-50' },
              { type: 'liveClass', icon: Video, count: counts.liveClass, color: 'text-red-600', bg: 'bg-red-50' },
              { type: 'poll', icon: BarChart3, count: counts.poll, color: 'text-purple-600', bg: 'bg-purple-50' },
            ];

            return (
              <div key={section._id} className="rounded-2xl bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-200 p-3 sm:p-4">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section._id ? null : section._id)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    {expandedSection === section._id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-gray-900 sm:text-base">{section.sectionName}</h5>
                      
                      {/* Activity Type Icons with Counts */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activityTypes.map((item) => {
                          if (!item.count || item.count === 0) return null;
                          const Icon = item.icon;
                          return (
                            <div key={item.type} className={`flex items-center gap-1 rounded-lg ${item.bg} px-2 py-1`}>
                              <Icon className={`h-4 w-4 ${item.color}`} />
                              <span className={`text-sm font-semibold ${item.color}`}>{item.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </button>
                  
                  {/* Add Activity Button and 3-Dot Menu */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowActivityModal(section._id)}
                      className="flex items-center justify-center rounded-lg bg-purple-600 p-2 text-white hover:bg-purple-700"
                      title="Add Activity"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    
                    {/* 3-Dot Menu for Section */}
                    <div className="relative">
                      <button
                        onClick={() => setSectionMenuOpen(sectionMenuOpen === section._id ? null : section._id)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {sectionMenuOpen === section._id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg bg-white shadow-xl border border-gray-200">
                          <button
                            onClick={() => {
                              setEditingSection(section);
                              setSectionMenuOpen(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSection(section._id)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {expandedSection === section._id && (
                  <div className="p-3 sm:p-4">
                    <div className="space-y-2">
                      {section.activities?.length === 0 ? (
                        <p className="text-sm text-gray-500">No activities yet</p>
                      ) : (
                        section.activities?.map((activity) => {
                          const iconData = getActivityIcon(activity.activityType);
                          const Icon = iconData.icon;
                          return (
                            <div key={activity._id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                              <div className="flex items-center gap-3">
                                <div className={`rounded-lg ${iconData.bg} p-2`}>
                                  <Icon className={`h-4 w-4 ${iconData.color}`} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{activity.activityName}</p>
                                  <p className="text-xs text-gray-600">{activity.activityType.replace('-', ' ')}</p>
                                </div>
                              </div>
                              
                              {/* 3-Dot Menu for Activity */}
                              <div className="relative">
                                <button
                                  onClick={() => setActivityMenuOpen(activityMenuOpen === activity._id ? null : activity._id)}
                                  className="rounded p-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                
                                {activityMenuOpen === activity._id && (
                                  <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg bg-white shadow-xl border border-gray-200">
                                    <button
                                      onClick={() => {
                                        setEditingActivity(activity);
                                        setActivityMenuOpen(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteActivity(activity._id)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ActivityModal
        isOpen={showActivityModal !== null}
        onClose={() => setShowActivityModal(null)}
        onCreateActivity={(data) => handleCreateActivity(data, showActivityModal)}
      />
    </div>
  );
}
