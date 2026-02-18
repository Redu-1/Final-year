// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import PrivateLayout from './components/Layout/PrivateLayout';
import MainLayout from './components/Layout/MainLayout';

// Import Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import HerbsManagement from './pages/HerbsManagement/HerbsManagement';
import Recommendations from './pages/Recommendations/Recommendations';
import UsersRoles from './pages/UsersRoles/UsersRoles';
import Settings from './pages/Settings/Settings'; // IMPORT the actual Settings component

function App() {
  return (
    <Router>
      <AuthProvider>
        <DashboardProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route element={<PrivateLayout />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/herbs" element={<HerbsManagement />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/users" element={<UsersRoles />} />
                  
                  {/* USE the actual Settings component instead of placeholder */}
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 Page */}
              <Route path="*" element={
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
              } />
            </Routes>
          </div>
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;