// src/pages/UsersRoles/UsersRoles.jsx
import { useState } from 'react';
import UserTable from '../../components/users/UserTable';
import PermissionsMatrix from '../../components/users/PermissionsMatrix';
import InviteUserModal from '../../components/users/InviteUserModal';
import EditUserModal from '../../components/users/EditUserModal';
import ViewUserModal from '../../components/users/ViewUserModal';
import SearchBar from '../../components/common/SearchBar';

const UsersRoles = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRole, setSelectedRole] = useState('Senior Botanist');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Elder Sarah M.',
      email: 'sarah.keeper@herbisense.org',
      role: 'KNOWLEDGE KEEPER',
      status: 'active',
      lastLogin: '5 mins ago',
      joinDate: 'Jan 15, 2022',
      avatar: 'SM',
      department: 'Traditional Knowledge'
    },
    {
      id: 2,
      name: 'Julian Vance',
      email: 'j.vance@metadata.edu',
      role: 'METADATA SPEC.',
      status: 'inactive',
      lastLogin: '3 days ago',
      joinDate: 'Mar 22, 2023',
      avatar: 'JV',
      department: 'Research & Data'
    },
    {
      id: 3,
      name: 'Elena Ruiz',
      email: 'elena.ruiz@herbisense.org',
      role: 'SYSTEM ADMIN',
      status: 'online',
      lastLogin: 'Active now',
      joinDate: 'Nov 5, 2021',
      avatar: 'ER',
      department: 'IT & Administration'
    },
    {
      id: 4,
      name: 'Dr. Michael Chen',
      email: 'm.chen@medschool.edu',
      role: 'MEDICAL ADVISOR',
      status: 'active',
      lastLogin: '2 hours ago',
      joinDate: 'Aug 30, 2022',
      avatar: 'MC',
      department: 'Medical Advisory'
    },
    {
      id: 5,
      name: 'Botany Team',
      email: 'botany@herbisense.org',
      role: 'RESEARCH TEAM',
      status: 'active',
      lastLogin: '1 day ago',
      joinDate: 'Feb 14, 2023',
      avatar: 'BT',
      department: 'Botanical Research'
    }
  ]);

  const [invites, setInvites] = useState([]);

  const roles = [
    { value: 'system-admin', label: 'System Admin' },
    { value: 'senior-botanist', label: 'Senior Botanist' },
    { value: 'knowledge-keeper', label: 'Knowledge Keeper' },
    { value: 'metadata-specialist', label: 'Metadata Specialist' },
    { value: 'content-moderator', label: 'Content Moderator' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const permissions = [
    {
      module: 'Botanical Records',
      description: 'Access to taxonomical data and herb biology',
      create: true,
      read: true,
      update: true,
      delete: true
    },
    {
      module: 'Indigenous Lore',
      description: 'Cultural significance and traditional uses',
      create: true,
      read: true,
      update: true,
      delete: false
    },
    {
      module: 'Geotagging & Maps',
      description: 'Spatial distribution of medicinal flora',
      create: true,
      read: true,
      update: true,
      delete: false
    },
    {
      module: 'Safety Guidelines',
      description: 'Dosage and contraindication management',
      create: false,
      read: true,
      update: false,
      delete: false
    },
    {
      module: 'User Management',
      description: 'Access control and role assignments',
      create: false,
      read: true,
      update: false,
      delete: false
    }
  ];

  // Filter users by search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active' || u.status === 'online').length;
  const pendingInvites = invites.length;

  // ========== USER HANDLERS ==========
  
  // Handle Invite User
  const handleInviteUser = (invite) => {
    // Add invite to list
    setInvites(prev => [invite, ...prev]);
    
    // In a real app, you would send this to your backend
    console.log('Invite sent:', invite);
    
    // Show success message
    alert(`Invitation sent to ${invite.email}`);
  };

  // Handle View User - Opens view modal
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Handle Edit User - Opens edit modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle Save User - Updates the user in state
  const handleSaveUser = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
    
    // Show success message
    alert(`User "${updatedUser.name}" updated successfully`);
  };

  // Handle Delete User - With confirmation
  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      alert(`User "${user.name}" deleted successfully`);
    }
  };

  // Handle Role Change - Change user role
  const handleRoleChange = (user) => {
    // In a real app, you would open a role selector dropdown
    const newRole = prompt(`Change role for ${user.name}:\nCurrent role: ${user.role}\n\nEnter new role:`, user.role);
    if (newRole && newRole !== user.role) {
      setUsers(prevUsers => 
        prevUsers.map(u => u.id === user.id ? { ...u, role: newRole } : u)
      );
      alert(`Role updated to ${newRole}`);
    }
  };

  // ========== PERMISSIONS HANDLER ==========
  
  const handleSavePermissions = () => {
    // In a real app, you would save permissions to backend
    alert('Permissions saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Access Management</h1>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Invite User
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'users'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'roles'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Roles & Permissions
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search users by name, email or role..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="online">Online</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <UserTable 
              users={filteredUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onView={handleViewUser}
              onRoleChange={handleRoleChange}
            />
          </div>

          {/* Simple Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-gray-600">
              Total: <span className="font-medium text-gray-900">{totalUsers}</span>
            </span>
            <span className="text-gray-600">
              Active: <span className="font-medium text-emerald-600">{activeUsers}</span>
            </span>
            <span className="text-gray-600">
              Pending Invites: <span className="font-medium text-amber-600">{pendingInvites}</span>
            </span>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Role Selector */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>
              <p className="text-sm text-gray-600">Role: {selectedRole}</p>
            </div>
            <select
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role.value} value={role.label}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {/* Permissions Matrix */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <PermissionsMatrix permissions={permissions} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                // Reset to original permissions
                alert('Changes discarded');
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSavePermissions}
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      {/* View User Modal */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersRoles;