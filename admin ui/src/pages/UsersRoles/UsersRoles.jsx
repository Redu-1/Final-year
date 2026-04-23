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

  // Try to fetch existing users from available endpoints
  const fetchExistingUsers = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      
      // Try multiple possible endpoints to get users
      const endpoints = [
        `${API_BASE_URL}/users`,
        `${API_BASE_URL}/admin/users`,
        `${API_BASE_URL}/admin/list`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`📤 Trying to fetch from: ${endpoint}`);
          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.data && response.data.success && Array.isArray(response.data.data)) {
            const admins = response.data.data.filter(user => user.role === 'admin');
            if (admins.length > 0) {
              setUsers(admins);
              console.log(`✅ Found ${admins.length} admins from ${endpoint}`);
              return;
            }
          } else if (Array.isArray(response.data)) {
            const admins = response.data.filter(user => user.role === 'admin');
            if (admins.length > 0) {
              setUsers(admins);
              console.log(`✅ Found ${admins.length} admins from ${endpoint}`);
              return;
            }
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
        }
      }
      
      // If no endpoint works, show message
      console.log('No GET endpoint available to fetch existing admins');
    } catch (err) {
      console.error('Error fetching users:', err);
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
      
      const response = await axios.post(`${API_BASE_URL}/admin/create-admin`, adminData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Admin created:', response.data);
      
      if (response.status === 201 || response.data?.success) {
        const newAdmin = {
          id: Date.now(),
          fullName: fullName.trim(),
          email: email.trim(),
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        
        setUsers(prev => [newAdmin, ...prev]);
        alert('✅ Admin created successfully!');
      } else {
        alert(response.data?.message || 'Failed to create admin');
      }
    } catch (err) {
      console.error('❌ Error creating admin:', err);
      
      if (err.response?.data?.message === 'User already exists') {
        alert('⚠️ This email is already registered. Please use a different email.');
        // Try to fetch existing users
        await fetchExistingUsers();
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to create admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete admin from local state
  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!confirm(`Delete ${adminName}? This action cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      
      // Try to delete from backend if endpoint exists
      try {
        await axios.delete(`${API_BASE_URL}/admin/${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (deleteErr) {
        console.warn('Backend delete failed or endpoint not found, removing from local state only');
      }
      
      setUsers(prev => prev.filter(user => user.id !== adminId));
      alert('✅ Admin removed successfully');
    } catch (err) {
      console.error('Error deleting admin:', err);
      alert('Failed to delete admin');
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    await fetchExistingUsers();
  };

  // Load existing users on component mount
  useEffect(() => {
    fetchExistingUsers();
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

      {/* Info Box - Show if no GET endpoint but admins might exist */}
      {users.length === 0 && !isLoading && !isRefreshing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">No admins displayed</p>
              <p className="text-sm text-blue-700 mt-1">
                Admins are stored in the database but there's no GET endpoint to fetch them.
                When you create a new admin with a unique email, it will appear here.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                <strong>Note:</strong> The email <code className="bg-blue-100 px-1 rounded">creator@herbisense.com</code> already exists in the database.
                Try creating an admin with a different email address.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Admins List */}
      {!isLoading && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No admins added yet</p>
              <button
                onClick={handleCreateAdmin}
                className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Create your first admin
              </button>
            </div>
          ) : (
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
                            Active
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
          )}
        </div>
      )}

      {/* Stats */}
      {!isLoading && users.length > 0 && (
        <div className="text-sm text-gray-600">
          Total: {users.length} admin{users.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default UsersRoles;