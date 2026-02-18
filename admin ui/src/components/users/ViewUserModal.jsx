// src/components/users/ViewUserModal.jsx
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  XMarkIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  ClockIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const ViewUserModal = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !user) return null;

  const getRoleColor = (role) => {
    const colors = {
      'SYSTEM ADMIN': 'bg-red-100 text-red-800',
      'KNOWLEDGE KEEPER': 'bg-emerald-100 text-emerald-800',
      'METADATA SPEC.': 'bg-blue-100 text-blue-800',
      'MEDICAL ADVISOR': 'bg-purple-100 text-purple-800',
      'RESEARCH TEAM': 'bg-amber-100 text-amber-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      online: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
          
          {/* Header - Green Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <UserCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">User Profile</h3>
                  <p className="text-xs text-emerald-50">View user details and information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* User Header with Avatar */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.avatar || user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-5">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center mt-2 space-x-3">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'details'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                User Details
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'activity'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Activity Log
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'permissions'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Permissions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-5 max-h-96 overflow-y-auto">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 text-xs font-medium mb-2">
                      <EnvelopeIcon className="h-3 w-3 mr-1" />
                      EMAIL ADDRESS
                    </div>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 text-xs font-medium mb-2">
                      <IdentificationIcon className="h-3 w-3 mr-1" />
                      USER ID
                    </div>
                    <p className="text-sm text-gray-900 font-mono">{user.id}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 text-xs font-medium mb-2">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      JOIN DATE
                    </div>
                    <p className="text-sm text-gray-900">{user.joinDate || 'Jan 15, 2023'}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-500 text-xs font-medium mb-2">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      LAST LOGIN
                    </div>
                    <p className="text-sm text-gray-900">{user.lastLogin}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-500 text-xs font-medium mb-2">
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    ACCOUNT STATUS
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      user.status === 'active' || user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-900">
                      {user.status === 'online' ? 'Online' : 
                       user.status === 'active' ? 'Active' : 
                       user.status === 'inactive' ? 'Inactive' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Recent Activity</span>
                    <span className="text-xs text-gray-500">Last 30 days</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 mt-1.5 bg-emerald-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Logged in successfully</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 mt-1.5 bg-emerald-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Viewed 3 herb records</p>
                        <p className="text-xs text-gray-500">Yesterday at 3:45 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 mt-1.5 bg-emerald-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Updated user profile</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 mt-1.5 bg-gray-300 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Password changed</p>
                        <p className="text-xs text-gray-400">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Login History</span>
                    <span className="text-xs text-gray-500">Last 5 sessions</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Today, 10:30 AM</span>
                      <span className="text-emerald-600 text-xs font-medium">Current</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Yesterday, 3:45 PM</span>
                      <span className="text-gray-400">Chrome / Windows</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Mar 10, 2024</span>
                      <span className="text-gray-400">Safari / macOS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <ShieldCheckIcon className="h-4 w-4 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Role-Based Permissions</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Botanical Records</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Full Access</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Indigenous Lore</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Read/Write</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Geotagging & Maps</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Read/Write</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Safety Guidelines</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Read Only</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">User Management</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">No Access</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <ComputerDesktopIcon className="h-4 w-4 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Session Information</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Current Session</span>
                      <span className="text-emerald-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">IP Address</span>
                      <span className="text-gray-900">192.168.1.45</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Device</span>
                      <span className="text-gray-900">Chrome / Windows</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ViewUserModal;