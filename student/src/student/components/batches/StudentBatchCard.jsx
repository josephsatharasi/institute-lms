import { Users, Code, FileText, ClipboardList, HelpCircle, FileEdit, Link2, Video, BarChart3 } from 'lucide-react';

const gradients = [
  'from-yellow-200 via-orange-200 to-pink-200',
  'from-blue-200 via-purple-200 to-pink-200',
  'from-green-200 via-teal-200 to-blue-200',
  'from-pink-200 via-purple-200 to-indigo-200',
  'from-orange-200 via-red-200 to-pink-200',
  'from-cyan-200 via-blue-200 to-purple-200',
];

export function StudentBatchCard({ batch, index, onClick }) {
  const gradient = gradients[index % gradients.length];
  const activityCounts = batch.activityCounts || {};

  const activityIcons = [
    { icon: FileText, count: activityCounts.test || 0, color: 'text-blue-600' },
    { icon: ClipboardList, count: activityCounts.assignment || 0, color: 'text-green-600' },
    { icon: HelpCircle, count: activityCounts.quiz || 0, color: 'text-pink-600' },
    { icon: FileEdit, count: activityCounts.note || 0, color: 'text-yellow-600' },
    { icon: Link2, count: activityCounts.link || 0, color: 'text-cyan-600' },
    { icon: Video, count: activityCounts.liveClass || 0, color: 'text-red-600' },
    { icon: BarChart3, count: activityCounts.poll || 0, color: 'text-purple-600' },
  ].filter(item => item.count > 0); // Only show icons with count > 0

  return (
    <article 
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      {/* Code Icon at Top */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-2xl bg-white/40 p-4 backdrop-blur-sm">
          <Code className="h-12 w-12 text-gray-800" strokeWidth={2} />
        </div>
      </div>

      {/* Batch Name */}
      <div className="mb-2 text-center">
        <h2 className="text-xl font-bold text-gray-900">{batch.batchName}</h2>
        <p className="text-sm font-medium text-gray-700">{batch.trainerName}</p>
      </div>

      {/* Student Count Badge */}
      <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white/50 px-3 py-1 backdrop-blur-sm">
        <Users className="h-4 w-4 text-gray-700" />
        <span className="text-sm font-bold text-gray-900">{batch.studentCount || 0}</span>
      </div>

      {/* Bottom Activity Icons Row - Show only added activities */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-gray-400/30 pt-4">
        {activityIcons.length === 0 ? (
          <span className="text-xs text-gray-600">No activities yet</span>
        ) : (
          activityIcons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                <div className="rounded-lg bg-white/50 p-2 backdrop-blur-sm">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-xs font-bold text-gray-800">{item.count}</span>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}
