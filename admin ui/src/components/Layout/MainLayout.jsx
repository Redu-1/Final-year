// src/components/Layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50/50 via-white to-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        {/* <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">HerbiSense</span> Admin Console v2.4.0
            </div>
            <div className="mt-2 sm:mt-0 flex items-center space-x-4 text-sm text-gray-600">
              <span>© 2024 HerbiSense Inc.</span>
              <span className="hidden sm:inline">•</span>
              <a href="#" className="hover:text-emerald-600">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-emerald-600">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-emerald-600">Help Center</a>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
};

export default MainLayout;