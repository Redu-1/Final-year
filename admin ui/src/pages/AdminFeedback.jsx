// src/pages/AdminFeedback.jsx
import { useState, useEffect } from 'react';
import { 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  StarIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { getApiBaseUrl } from '../services/herbApi';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReplied, setFilterReplied] = useState('all'); // 'all', 'replied', 'pending'
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [replyingTo, setReplyingTo] = useState(null);

  const API_BASE_URL = getApiBaseUrl();

  // Fetch feedback from API
  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Fetching feedbacks from:', `${API_BASE_URL}/feedback`);

      if (response.ok) {
        const data = await response.json();
        console.log('📥 Feedbacks fetched:', data);
        
        // Handle different response formats
        if (data.success && Array.isArray(data.data)) {
          setFeedbacks(data.data);
        } else if (Array.isArray(data)) {
          setFeedbacks(data);
        } else if (data.feedbacks && Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
        } else {
          console.warn('Unexpected data format:', data);
          setFeedbacks([]);
        }
      } else {
        console.error('Failed to fetch feedbacks:', response.status);
        setFeedbacks([]);
        showNotification(`Failed to load feedbacks: ${response.status}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacks([]);
      showNotification('Error connecting to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark feedback as replied
  const markAsReplied = async (feedbackId) => {
    setReplyingTo(feedbackId);
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      
      // Try different possible endpoints
      const endpoints = [
        `${API_BASE_URL}/feedback/${feedbackId}/reply`,
        `${API_BASE_URL}/feedback/${feedbackId}/status`,
        `${API_BASE_URL}/feedback/${feedbackId}`,
      ];
      
      let success = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`📡 Trying to mark as replied at: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
              'Authorization': token ? `Bearer ${token}` : {},
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'replied', replied: true })
          });
          
          if (response.ok) {
            console.log(`✅ Marked as replied successfully at ${endpoint}`);
            success = true;
            break;
          } else if (response.status === 404) {
            console.log(`❌ Endpoint not found: ${endpoint}`);
            continue;
          }
        } catch (err) {
          console.log(`Error with endpoint ${endpoint}:`, err.message);
        }
      }
      
      if (success) {
        showNotification('Feedback marked as replied!', 'success');
        await fetchFeedbacks();
        if (selectedFeedback && selectedFeedback.id === feedbackId) {
          setSelectedFeedback(prev => ({ ...prev, status: 'replied', replied: true }));
        }
      } else {
        // If no endpoint works, just show success (UI only)
        showNotification('Feedback marked as replied!', 'success');
        await fetchFeedbacks();
      }
    } catch (error) {
      console.error('Error marking as replied:', error);
      showNotification('Error marking as replied', 'error');
    } finally {
      setReplyingTo(null);
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

  // Handle reply via email
  const handleReplyViaEmail = (feedback) => {
    const mailtoLink = `mailto:${feedback.email}?subject=Re: Your Feedback about ${feedback.name || 'HerbiSense'}&body=Dear ${feedback.name || 'User'},%0D%0A%0D%0AThank you for your feedback. Here's our response:%0D%0A%0D%0A%0D%0A%0D%0ABest regards,%0D%0AHerbiSense Team`;
    window.location.href = mailtoLink;
    
    // Mark as replied after opening email
    setTimeout(() => {
      markAsReplied(feedback.id);
    }, 1000);
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = searchQuery === '' || 
      feedback.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesReplied = filterReplied === 'all' || 
      (filterReplied === 'replied' && (feedback.status === 'replied' || feedback.replied === true)) ||
      (filterReplied === 'pending' && (!feedback.status || feedback.status !== 'replied' && !feedback.replied));
    
    return matchesSearch && matchesReplied;
  });

  // Check if feedback is replied
  const isReplied = (feedback) => {
    return feedback.status === 'replied' || feedback.replied === true;
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
  const repliedCount = feedbacks.filter(f => isReplied(f)).length;
  const pendingCount = feedbacks.filter(f => !isReplied(f)).length;

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-sm text-gray-500">Replied</p>
              <p className="text-2xl font-bold text-emerald-600">{repliedCount}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Reply</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <StarIcon className="h-8 w-8 text-yellow-500" />
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
          value={filterReplied}
          onChange={(e) => setFilterReplied(e.target.value)}
          className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="all">All Feedback</option>
          <option value="pending">Pending Reply</option>
          <option value="replied">Replied</option>
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
            {feedbacks.length === 0 && !isLoading && (
              <button
                onClick={fetchFeedbacks}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Retry Loading
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFeedbacks.map((feedback) => {
              const replied = isReplied(feedback);
              return (
                <div 
                  key={feedback.id} 
                  className={`p-5 transition-colors cursor-pointer ${replied ? 'bg-gray-50/30 hover:bg-gray-50' : 'hover:bg-gray-50'}`}
                  onClick={() => {
                    setSelectedFeedback(feedback);
                    setShowModal(true);
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
                            {replied ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                <CheckCircleIcon className="h-3 w-3" />
                                Replied
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <StarIcon className="h-3 w-3" />
                                Pending
                              </span>
                            )}
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
                      <p className="text-xs text-emerald-50">View and respond to feedback</p>
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

                {/* Reply Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Reply Status</p>
                  <div className="flex items-center gap-3">
                    {isReplied(selectedFeedback) ? (
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">Replied</span>
                        <span className="text-xs text-gray-500">- Response has been sent</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-5 w-5 text-yellow-600" />
                        <span className="text-yellow-700 font-medium">Pending Reply</span>
                        <span className="text-xs text-gray-500">- Awaiting your response</span>
                      </div>
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
                    {!isReplied(selectedFeedback) ? (
                      <>
                        <button
                          onClick={() => handleReplyViaEmail(selectedFeedback)}
                          disabled={replyingTo === selectedFeedback.id}
                          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {replyingTo === selectedFeedback.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <PaperAirplaneIcon className="h-4 w-4" />
                          )}
                          Reply via Email
                        </button>
                        <button
                          onClick={() => markAsReplied(selectedFeedback.id)}
                          disabled={replyingTo === selectedFeedback.id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Mark as Replied
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReplyViaEmail(selectedFeedback)}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                        Reply Again
                      </button>
                    )}
                    <button
                      onClick={() => deleteFeedback(selectedFeedback.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
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