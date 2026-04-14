import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Users, LayoutList, Activity, FileText, ClipboardList, HelpCircle, FileEdit, Link2, Video, BarChart3, Mic, Rocket, Bookmark } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const getActivityIcon = (type) => {
  const icons = {
    test: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    assignment: { icon: ClipboardList, color: 'text-green-600', bg: 'bg-green-100' },
    quiz: { icon: HelpCircle, color: 'text-pink-600', bg: 'bg-pink-100' },
    note: { icon: FileEdit, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    link: { icon: Link2, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    'live-class': { icon: Video, color: 'text-red-600', bg: 'bg-red-100' },
    poll: { icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-100' },
    interview: { icon: Mic, color: 'text-orange-600', bg: 'bg-orange-100' },
    project: { icon: Rocket, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    other: { icon: Bookmark, color: 'text-gray-600', bg: 'bg-gray-100' }
  };
  return icons[type] || icons.other;
};

export function StudentBatchDetails({ batch, onBack }) {
  const [sections, setSections] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(true);

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
            
            // Group activities by type
            const groupedActivities = activities.reduce((acc, activity) => {
              if (!acc[activity.activityType]) {
                acc[activity.activityType] = [];
              }
              acc[activity.activityType].push(activity);
              return acc;
            }, {});
            
            return { ...section, activities, groupedActivities };
          })
        );
        setSections(sectionsWithActivities);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md transition-all hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Batches
        </button>

        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white shadow-xl">
          <h1 className="mb-2 text-3xl font-bold">{batch.batchName}</h1>
          <p className="text-lg opacity-90">Trainer: {batch.trainerName}</p>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <Users className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{batch.studentCount || 0}</div>
                <div className="text-sm opacity-90">Students</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <LayoutList className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{batch.sectionCount || 0}</div>
                <div className="text-sm opacity-90">Sections</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <Activity className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{batch.activityCount || 0}</div>
                <div className="text-sm opacity-90">Activities</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
          
          {sections.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
              <p className="text-lg text-gray-500">No sections available yet</p>
            </div>
          ) : (
            sections.map((section) => {
              const grouped = section.groupedActivities || {};
              const activityTypesWithData = Object.keys(grouped).map(type => ({
                type,
                activities: grouped[type],
                ...getActivityIcon(type)
              }));
              
              return (
                <div key={section._id} className="overflow-hidden rounded-2xl bg-white shadow-lg">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section._id ? null : section._id)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{section.sectionName}</h3>
                      {section.description && (
                        <p className="text-sm text-gray-600">{section.description}</p>
                      )}
                      
                      {/* Activity Type Icons with Counts */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activityTypesWithData.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.type} className={`flex items-center gap-1 rounded-lg ${item.bg} px-2 py-1`}>
                              <Icon className={`h-4 w-4 ${item.color}`} />
                              <span className={`text-sm font-semibold ${item.color}`}>{item.activities.length}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {expandedSection === section._id ? (
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    )}
                  </button>

                  {expandedSection === section._id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      {section.activities?.length === 0 ? (
                        <p className="text-center text-gray-500">No activities in this section</p>
                      ) : (
                        <div className="space-y-6">
                          {activityTypesWithData.map((typeGroup) => {
                            const Icon = typeGroup.icon;
                            return (
                              <div key={typeGroup.type}>
                                <div className={`mb-3 flex items-center gap-2 rounded-lg ${typeGroup.bg} px-3 py-2`}>
                                  <Icon className={`h-5 w-5 ${typeGroup.color}`} />
                                  <h4 className={`font-semibold ${typeGroup.color}`}>
                                    {typeGroup.type.charAt(0).toUpperCase() + typeGroup.type.slice(1).replace('-', ' ')}
                                  </h4>
                                  <span className={`ml-auto text-sm font-semibold ${typeGroup.color}`}>
                                    {typeGroup.activities.length}
                                  </span>
                                </div>
                                
                                <div className="space-y-2">
                                  {typeGroup.activities.map((activity, idx) => (
                                    <div
                                      key={activity._id}
                                      className="ml-4 flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md"
                                    >
                                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                                        {idx + 1}
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-900">{activity.activityName}</h5>
                                        {activity.description && (
                                          <p className="text-xs text-gray-500">{activity.description}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
