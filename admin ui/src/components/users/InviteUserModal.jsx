// src/components/users/InviteUserModal.jsx
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { XMarkIcon, EnvelopeIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const InviteUserModal = ({ isOpen, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'system-admin', label: 'System Admin' },
    { value: 'senior-botanist', label: 'Senior Botanist' },
    { value: 'knowledge-keeper', label: 'Knowledge Keeper' },
    { value: 'metadata-specialist', label: 'Metadata Specialist' },
    { value: 'content-moderator', label: 'Content Moderator' },
    { value: 'viewer', label: 'Viewer' }
  ];

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

    setSending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create invite object
      const invite = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      };

      // Call parent handler
      onInvite(invite);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'viewer',
        message: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Invite failed:', error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <UserPlusIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Invite User</h3>
                  <p className="text-xs text-emerald-50">Send an invitation to join HerbiSense</p>
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
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., John Smith"
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
                  Assign Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
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

              {/* Personal Message (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows="3"
                  placeholder="Add a personal note to the invitation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-start">
                  <EnvelopeIcon className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    An invitation email will be sent with a secure link that expires in 7 days.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
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
                disabled={sending}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default InviteUserModal;