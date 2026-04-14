import { useState, useEffect } from 'react';
import { Users, GraduationCap, TrendingUp, BookOpen } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBatches: 0,
    activeCourses: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, batchesRes] = await Promise.all([
        fetch(`${API_URL}/students`),
        fetch(`${API_URL}/batches`)
      ]);

      const studentsData = await studentsRes.json();
      const batchesData = await batchesRes.json();

      setStats({
        totalStudents: studentsData.data?.length || 0,
        totalBatches: batchesData.data?.length || 0,
        activeCourses: batchesData.data?.filter(b => b.status === 'active').length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Batches', value: stats.totalBatches, icon: GraduationCap, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Courses', value: stats.activeCourses, icon: BookOpen, color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl bg-gradient-to-br ${stat.color} p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="mt-2 text-4xl font-bold">{stat.value}</p>
                </div>
                <Icon className="h-12 w-12 opacity-80" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-gray-900">Welcome to Institute LMS</h3>
        <p className="text-gray-600">
          Manage your batches, students, and courses from the sidebar menu.
        </p>
      </div>
    </div>
  );
}
