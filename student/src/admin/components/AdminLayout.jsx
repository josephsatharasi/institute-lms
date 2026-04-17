import { useState } from 'react';
import { LogOut, GraduationCap, Users, LayoutDashboard, BookOpen, Menu, X } from 'lucide-react';

export function AdminLayout({ children, activeMenu, onMenuChange, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'batches', label: 'Batches', icon: GraduationCap },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen }
  ];

  const handleMenuClick = (id) => {
    onMenuChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Institute LMS</h1>
            <p className="text-xs text-gray-600">Admin Panel</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Institute LMS</h1>
          <p className="text-sm text-blue-200">Admin Panel</p>
        </div>

        <nav className="mt-6 flex-1 space-y-2 px-4">
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

        <div className="border-t border-blue-700 p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-blue-100 transition-all hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl">
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
                    onClick={() => handleMenuClick(item.id)}
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
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:ml-64 lg:pt-0">
        <header className="hidden bg-white shadow-sm lg:block">
          <div className="px-4 py-6 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
