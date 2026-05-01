// src/pages/UsersRoles/UsersRoles.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Shield, Trash2, RefreshCw, Users } from 'lucide-react';
import { getApiBaseUrl } from '../../services/herbApi';

const API_BASE_URL = getApiBaseUrl();

const UsersRoles = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch admins from the correct endpoint
  const fetchAdmins = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      
      // ✅ FIX: Use the correct endpoint from Swagger
      const endpoint = `${API_BASE_URL}/admin`;
      
      console.log(`📤 Fetching admins from: ${endpoint}`);
      
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📦 API Response:', response.data);
      
      // Handle different response structures
      let adminsList = [];
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Format: { success: true, data: [...] }
        adminsList = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Format: direct array
        adminsList = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Format: { data: [...] }
        adminsList = response.data.data;
      }
      
      // Filter for admin role if role field exists
      const admins = adminsList.filter(user => 
        user.role === 'admin' || 
        user.role === 'ADMIN' ||
        user.userType === 'admin' ||
        !user.role // If no role field, assume they're admins
      );
      
      setUsers(admins);
      console.log(`✅ Found ${admins.length} admins`);
      
      if (admins.length === 0 && adminsList.length > 0) {
        console.log('📋 Users found but none have admin role:', adminsList.map(u => ({ name: u.fullName, role: u.role })));
      }
      
    } catch (err) {
      console.error('❌ Error fetching admins:', err);
      
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Admin endpoint not found. Please check the API URL.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch admins');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Create admin
  const handleCreateAdmin = async () => {
    const fullName = prompt("Enter full name:");
    if (!fullName) return;
    
    const email = prompt("Enter email:");
    if (!email) return;
    
    const password = prompt("Enter password:");
    if (!password) return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      
      const adminData = {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password
      };
      
      console.log('📤 Creating admin:', adminData);
      
      // ✅ FIX: Use the correct endpoint from Swagger
      const response = await axios.post(`${API_BASE_URL}/admin/create-admin`, adminData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin created:', response.data);
      
      if (response.status === 201 || response.data?.success) {
        // Refresh the list after creation
        await fetchAdmins();
        alert('✅ Admin created successfully!');
      } else {
        alert(response.data?.message || 'Failed to create admin');
      }
    } catch (err) {
      console.error('❌ Error creating admin:', err);
      
      if (err.response?.data?.message === 'User already exists') {
        alert('⚠️ This email is already registered. Please use a different email.');
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to create admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!confirm(`Delete ${adminName}? This action cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      
      // ✅ Try the correct delete endpoint
      const response = await axios.delete(`${API_BASE_URL}/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data?.success) {
        await fetchAdmins(); // Refresh the list
        alert('✅ Admin removed successfully');
      } else {
        throw new Error(response.data?.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      
      // If delete endpoint fails, remove from local state only
      if (err.response?.status === 404) {
        setUsers(prev => prev.filter(user => user.id !== adminId));
        alert('✅ Admin removed from local list (delete endpoint not available)');
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to delete admin');
      }
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    await fetchAdmins();
  };

  // Load admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system administrators</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleCreateAdmin}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create Admin
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Error loading admins</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchAdmins}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(isLoading || isRefreshing) && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Admins List */}
      {!isLoading && !isRefreshing && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {users.length === 0 && !error ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No admins found</p>
              <p className="text-xs text-gray-400 mt-1">Click "Create Admin" to add one</p>
              <button
                onClick={handleCreateAdmin}
                className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Create your first admin
              </button>
            </div>
          ) : users.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {users.map((admin) => (
                <div key={admin.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {(admin.fullName || admin.full_name || admin.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{admin.fullName || admin.full_name || admin.name}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            ADMIN
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {(admin.status || 'Active').charAt(0).toUpperCase() + (admin.status || 'active').slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id, admin.fullName || admin.full_name || admin.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Admin"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Stats */}
      {!isLoading && !isRefreshing && users.length > 0 && (
        <div className="text-sm text-gray-600">
          Total: {users.length} admin{users.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default UsersRoles;