// src/components/Layout/PrivateLayout.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

const PrivateLayout = () => {
  const { user, loading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="relative">
            {/* Animated Logo */}
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  H
                </span>
              </div>
              
              {/* Spinning border */}
              <div className="absolute -inset-1 border-2 border-emerald-200 rounded-2xl animate-spin"></div>
            </div>
            
            {/* Loading text */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Loading HerbiSense</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Securing your connection and loading the dashboard...
              </p>
              
              {/* Progress bar */}
              <div className="w-48 mx-auto h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-progress"></div>
              </div>
              
              {/* Security status */}
              <div className="pt-4">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs font-medium text-emerald-700">ENCRYPTED CONNECTION ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

// Add custom animation for progress bar
const style = document.createElement('style');
style.textContent = `
  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-progress {
    animation: progress 1.5s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default PrivateLayout;