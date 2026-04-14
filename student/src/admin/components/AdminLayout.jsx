import { useState } from 'react';
import { LogOut, GraduationCap, Users, LayoutDashboard, BookOpen } from 'lucide-react';

export function AdminLayout({ children, activeMenu, onMenuChange, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'batches', label: 'Batches', icon: GraduationCap },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Institute LMS</h1>
          <p className="text-sm text-blue-200">Admin Panel</p>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onMenuChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  activeMenu === item.id
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-blue-700 p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-blue-100 transition-all hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="bg-white shadow-sm">
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
