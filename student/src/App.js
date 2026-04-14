import { useState } from 'react';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { StudentBatchesPage } from './student/pages/batches/StudentBatchesPage';
import { GraduationCap, Shield } from 'lucide-react';

function App() {
  const [role, setRole] = useState(null); // 'admin' or 'student'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Role selection screen
  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="space-y-8 text-center">
          <div>
            <h1 className="text-5xl font-bold text-white">Institute LMS</h1>
            <p className="mt-2 text-xl text-white/90">Select Your Portal</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <button
              onClick={() => setRole('admin')}
              className="group rounded-2xl bg-white p-8 shadow-2xl transition-all hover:scale-105 hover:shadow-3xl"
            >
              <Shield className="mx-auto mb-4 h-16 w-16 text-blue-600 transition-transform group-hover:scale-110" />
              <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
              <p className="mt-2 text-gray-600">Manage batches and students</p>
            </button>

            <button
              onClick={() => setRole('student')}
              className="group rounded-2xl bg-white p-8 shadow-2xl transition-all hover:scale-105 hover:shadow-3xl"
            >
              <GraduationCap className="mx-auto mb-4 h-16 w-16 text-purple-600 transition-transform group-hover:scale-110" />
              <h2 className="text-2xl font-bold text-gray-900">Student Portal</h2>
              <p className="mt-2 text-gray-600">View available courses</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Portal
  if (role === 'admin') {
    return (
      <div className="min-h-screen">
        {!isLoggedIn ? (
          <AdminLoginPage onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <AdminDashboard onLogout={() => {
            setIsLoggedIn(false);
            setRole(null);
          }} />
        )}
      </div>
    );
  }

  // Student Portal
  if (role === 'student') {
    return (
      <div className="min-h-screen">
        <StudentBatchesPage onBack={() => setRole(null)} />
      </div>
    );
  }
}

export default App;
