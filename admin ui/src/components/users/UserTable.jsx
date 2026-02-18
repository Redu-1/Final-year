// src/components/users/UserTable.jsx
import { useState, useMemo } from 'react';
import StatusBadge from '../common/StatusBadge';
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const UserTable = ({ 
  users = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  onInvite,
  onRoleChange,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const defaultUsers = [
    {
      id: 1,
      name: 'Elder Sarah M.',
      email: 'sarah.keeper@herbisense.org',
      role: 'KNOWLEDGE KEEPER',
      status: 'active',
      lastLogin: '5 mins ago',
      avatar: 'SM'
    },
    {
      id: 2,
      name: 'Julian Vance',
      email: 'j.vance@metadata.edu',
      role: 'METADATA SPEC.',
      status: 'inactive',
      lastLogin: '3 days ago',
      avatar: 'JV'
    },
    {
      id: 3,
      name: 'Elena Ruiz',
      email: 'elena.ruiz@herbisense.org',
      role: 'SYSTEM ADMIN',
      status: 'online',
      lastLogin: 'Active now',
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'Dr. Michael Chen',
      email: 'm.chen@medschool.edu',
      role: 'MEDICAL ADVISOR',
      status: 'active',
      lastLogin: '2 hours ago',
      avatar: 'MC'
    },
    {
      id: 5,
      name: 'Botany Team',
      email: 'botany@herbisense.org',
      role: 'RESEARCH TEAM',
      status: 'active',
      lastLogin: '1 day ago',
      avatar: 'BT'
    }
  ];

  const userData = users.length > 0 ? users : defaultUsers;

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return userData;
    
    const query = searchQuery.toLowerCase();
    return userData.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  }, [userData, searchQuery]);

  const getRoleColor = (role) => {
    const colors = {
      'SYSTEM ADMIN': { bg: 'bg-red-100', text: 'text-red-800' },
      'KNOWLEDGE KEEPER': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
      'METADATA SPEC.': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'MEDICAL ADVISOR': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'RESEARCH TEAM': { bg: 'bg-amber-100', text: 'text-amber-800' }
    };
    return colors[role] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const handleAction = (action, user, e) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        onEdit?.(user);
        break;
      case 'delete':
        onDelete?.(user);
        break;
      case 'view':
        onView?.(user);
        break;
      case 'role':
        onRoleChange?.(user);
        break;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-20 bg-gray-100 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar - Simple */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const roleColor = getRoleColor(user.role);
                return (
                  <tr 
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.avatar}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <EnvelopeIcon className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleColor.bg} ${roleColor.text}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.lastLogin}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => handleAction('view', user, e)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 rounded"
                          title="View"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleAction('edit', user, e)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleAction('role', user, e)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-gray-100 rounded"
                          title="Change role"
                        >
                          <ShieldCheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleAction('delete', user, e)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="py-8 text-center">
            <UserCircleIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No users found</p>
          </div>
        )}

        {/* Simple Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          Showing {filteredUsers.length} of {userData.length} users
        </div>
      </div>
    </div>
  );
};

export default UserTable;