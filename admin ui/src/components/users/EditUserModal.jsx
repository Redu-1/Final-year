// src/components/users/EditUserModal.jsx
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const EditUserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'SYSTEM ADMIN', label: 'System Admin' },
    { value: 'KNOWLEDGE KEEPER', label: 'Knowledge Keeper' },
    { value: 'METADATA SPEC.', label: 'Metadata Specialist' },
    { value: 'MEDICAL ADVISOR', label: 'Medical Advisor' },
    { value: 'RESEARCH TEAM', label: 'Research Team' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'online', label: 'Online' },
    { value: 'pending', label: 'Pending' }
  ];

  // Load user data when modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'VIEWER',
        status: user.status || 'active'
      });
      setErrors({});
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create updated user object
      const updatedUser = {
        ...user,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      // Call parent handler
      onSave(updatedUser);
      
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
          
          {/* Header - Changed to Green Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <UserCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Edit User</h3>
                  <p className="text-xs text-emerald-50">Update user information</p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* User Avatar Preview */}
              <div className="flex items-center justify-center mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.avatar || user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="user@example.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* User ID (Read Only) */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">User ID</span>
                  <span className="text-gray-900 font-mono">{user.id}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-gray-500">Last Login</span>
                  <span className="text-gray-900">{user.lastLogin}</span>
                </div>
              </div>
            </div>

            {/* Footer - Changed to Green Gradient Button */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditUserModal;