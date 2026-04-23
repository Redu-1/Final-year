// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import PrivateLayout from '../components/Layout/PrivateLayout';
import MainLayout from '../components/Layout/MainLayout';

// Pages
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import HerbsManagement from '../pages/HerbsManagement/HerbsManagement';
import Recommendations from '../pages/Recommendations/Recommendations';
import UsersRoles from '../pages/UsersRoles/UsersRoles';
import ContentManagement from '../pages/ContentManagement/ContentManagement';
import AdminFeedback from '../pages/AdminFeedback';

const AppRoutes = () => {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<PrivateLayout />}>
        <Route element={<MainLayout />}>

          {/* ✅ DASHBOARD (Admin + Creator) */}
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />

          {/* ✅ HERBS (Admin + Creator) */}
          <Route
            path="/herbs"
            element={
              user ? <HerbsManagement /> : <Navigate to="/login" replace />
            }
          />

          {/* ✅ FEEDBACK (Admin Only) - NEW */}
          <Route
            path="/feedback"
            element={
              userType === 'admin'
                ? <AdminFeedback />
                : <Navigate to="/dashboard" replace />
            }
          />

          {/* ❌ ADMIN ONLY ROUTES */}
          <Route
            path="/users"
            element={
              userType === 'admin'
                ? <UsersRoles />
                : <Navigate to="/dashboard" replace />
            }
          />

          <Route
            path="/content"
            element={
              userType === 'admin'
                ? <ContentManagement />
                : <Navigate to="/dashboard" replace />
            }
          />

          <Route
            path="/recommendations"
            element={
              userType === 'admin'
                ? <Recommendations />
                : <Navigate to="/dashboard" replace />
            }
          />

          {/* Settings - Admin Only (can be removed or kept) */}
          <Route
            path="/settings"
            element={
              userType === 'admin'
                ? (
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                )
                : <Navigate to="/dashboard" replace />
            }
          />

        </Route>
      </Route>

      {/* ================= ROOT REDIRECT ================= */}
      <Route
        path="/"
        element={
          user
            ? <Navigate to={userType === 'creator' ? "/herbs" : "/dashboard"} replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* ================= OLD URL REDIRECT ================= */}
      <Route
        path="/herbs-management"
        element={<Navigate to="/herbs" replace />}
      />

      {/* ================= 404 PAGE ================= */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-6">Page not found</p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;