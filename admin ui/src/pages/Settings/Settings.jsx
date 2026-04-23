// src/pages/AdminFeedback.jsx
import { useState, useEffect } from 'react';
import { 
  EnvelopeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { getApiBaseUrl } from '../services/herbApi';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const API_BASE_URL = getApiBaseUrl();

  // Fetch feedback from API
  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/admin/all`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 Feedbacks fetched:', data);
        
        if (data.success && Array.isArray(data.data)) {
          setFeedbacks(data.data);
        } else if (Array.isArray(data)) {
          setFeedbacks(data);
        } else {
          setFeedbacks([]);
        }
      } else {
        console.error('Failed to fetch feedbacks');
        setFeedbacks([]);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update feedback status
  const updateFeedbackStatus = async (feedbackId, status) => {
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        showNotification(`Feedback marked as ${status}`, 'success');
        fetchFeedbacks();
      } else {
        showNotification('Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      showNotification('Error updating status', 'error');
    }
  };

  // Delete feedback
  const deleteFeedback = async (feedbackId) => {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showNotification('Feedback deleted successfully', 'success');
        fetchFeedbacks();
        if (selectedFeedback?.id === feedbackId) {
          setShowModal(false);
          setSelectedFeedback(null);
        }
      } else {
        showNotification('Failed to delete feedback', 'error');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      showNotification('Error deleting feedback', 'error');
    }
  };

  // Show toast notification
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = searchQuery === '' || 
      feedback.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'read':
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Read' };
      case 'replied':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Replied' };
      case 'archived':
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' };
      default:
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'New' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Stats
  const totalFeedbacks = feedbacks.length;
  const newFeedbacks = feedbacks.filter(f => f.status === 'new' || !f.status).length;
  const readFeedbacks = feedbacks.filter(f => f.status === 'read').length;
  const repliedFeedbacks = feedbacks.filter(f => f.status === 'replied').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className={`flex items-center p-4 rounded-lg shadow-lg ${
            toastType === 'success' ? 'bg-emerald-500' :
            toastType === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}>
            {toastType === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
            {toastType === 'error' && <XCircleIcon className="h-5 w-5 mr-2" />}
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Feedback</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and respond to user feedback submissions</p>
        </div>
        <button
          onClick={fetchFeedbacks}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{totalFeedbacks}</p>
            </div>
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New</p>
              <p className="text-2xl font-bold text-yellow-600">{newFeedbacks}</p>
            </div>
            <StarIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Read</p>
              <p className="text-2xl font-bold text-blue-600">{readFeedbacks}</p>
            </div>
            <EyeIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Replied</p>
              <p className="text-2xl font-bold text-emerald-600">{repliedFeedbacks}</p>
            </div>
            <HeartIcon className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or message..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No feedback submissions found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFeedbacks.map((feedback) => {
              const statusBadge = getStatusBadge(feedback.status);
              return (
                <div 
                  key={feedback.id} 
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedFeedback(feedback);
                    setShowModal(true);
                    if (feedback.status !== 'read') {
                      updateFeedbackStatus(feedback.id, 'read');
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold">
                          {getInitials(feedback.name)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{feedback.name}</h3>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                              {statusBadge.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <EnvelopeIcon className="h-3 w-3 mr-1" />
                              {feedback.email}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {formatDate(feedback.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 ml-13">
                        {feedback.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeedback(feedback);
                          setShowModal(true);
                          if (feedback.status !== 'read') {
                            updateFeedbackStatus(feedback.id, 'read');
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFeedback(feedback.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          
          <div className="relative flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">Feedback Details</h3>
                      <p className="text-xs text-emerald-50">View complete feedback information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-lg bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(selectedFeedback.name)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedFeedback.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {selectedFeedback.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(selectedFeedback.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Status</p>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedFeedback.status).bg} ${getStatusBadge(selectedFeedback.status).text}`}>
                      {getStatusBadge(selectedFeedback.status).label}
                    </span>
                    {selectedFeedback.status === 'new' && (
                      <button
                        onClick={() => updateFeedbackStatus(selectedFeedback.id, 'read')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Mark as Read
                      </button>
                    )}
                    {selectedFeedback.status === 'read' && (
                      <button
                        onClick={() => updateFeedbackStatus(selectedFeedback.id, 'replied')}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        Mark as Replied
                      </button>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Message</p>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedFeedback.message}
                  </p>
                </div>

                {/* Reply Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        window.location.href = `mailto:${selectedFeedback.email}?subject=Re: Your HerbiSense Feedback`;
                      }}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Reply via Email
                    </button>
                    <button
                      onClick={() => deleteFeedback(selectedFeedback.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;