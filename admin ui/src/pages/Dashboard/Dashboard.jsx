// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OverviewStats from '../../components/dashboard/OverviewStats';
import RecentActivityTable from '../../components/dashboard/RecentActivityTable';
import QuickShortcuts from '../../components/dashboard/QuickShortcuts';
import EngagementChart from '../../components/dashboard/EngagementChart';
import StatsCard from '../../components/common/StatsCard';
import { 
  ChartBarIcon, 
  BookOpenIcon,
  SparklesIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { herbApi, getApiBaseUrl } from '../../services/herbApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [herbs, setHerbs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch herbs and users from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch herbs
      const herbsData = await herbApi.getAllHerbs();
      console.log('📦 Dashboard herbs:', herbsData);
      setHerbs(Array.isArray(herbsData) ? herbsData : []);
      
      // Fetch users to get creator information
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token');
      const usersResponse = await fetch(`${getApiBaseUrl()}/users`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        }
      });
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('👥 Users fetched:', usersData);
        const usersList = usersData.data || usersData.users || usersData;
        setUsers(Array.isArray(usersList) ? usersList : []);
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user by ID
  const getUserById = (userId) => {
    if (!userId) return null;
    return users.find(u => u.id === userId || u._id === userId);
  };

  // Calculate real stats from herbs data
  const totalHerbs = herbs.length;
  const publishedHerbs = herbs.filter(h => h.status === 'published' || h.isPublished === true).length;
  const pendingHerbs = herbs.filter(h => h.status === 'pending').length;
  const draftHerbs = herbs.filter(h => h.status === 'draft').length;

  // Calculate stats
  const stats = [
    {
      title: 'Total Herbs',
      value: totalHerbs.toLocaleString(),
      change: `+${publishedHerbs}`,
      changeType: 'increase',
      icon: BookOpenIcon,
      color: 'emerald',
      description: `${publishedHerbs} published, ${pendingHerbs} pending`
    },
    {
      title: 'Pending Review',
      value: pendingHerbs.toLocaleString(),
      change: pendingHerbs > 0 ? 'Needs attention' : 'All reviewed',
      changeType: pendingHerbs > 0 ? 'warning' : 'success',
      icon: SparklesIcon,
      color: pendingHerbs > 0 ? 'amber' : 'emerald',
      description: `${pendingHerbs} herb${pendingHerbs !== 1 ? 's' : ''} awaiting approval`
    },
    {
      title: 'Published',
      value: publishedHerbs.toLocaleString(),
      change: `${Math.round((publishedHerbs / (totalHerbs || 1)) * 100)}%`,
      changeType: 'increase',
      icon: DocumentCheckIcon,
      color: 'emerald',
      description: 'of total herbs are live'
    }
  ];

  // Generate recent activities from herbs data with REAL user data (Admin or Herb Creator only)
  const recentActivities = herbs
    .map(herb => {
      const dateStr = herb.updatedAt || herb.createdAt || herb.updated_at || herb.created_at;
      let formattedDate = 'Recent';
      let fullDate = new Date();
      let timeAgo = '';
      
      if (dateStr) {
        try {
          fullDate = new Date(dateStr);
          formattedDate = fullDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric'
          });
          
          // Calculate time ago
          const now = new Date();
          const diffDays = Math.floor((now - fullDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 0) timeAgo = 'Today';
          else if (diffDays === 1) timeAgo = 'Yesterday';
          else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
          else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} weeks ago`;
          else timeAgo = `${Math.floor(diffDays / 30)} months ago`;
        } catch (e) {
          console.error('Error formatting date:', e);
        }
      }
      
      // Get REAL user data from the herb creator
      const creatorId = herb.createdBy || herb.creatorId || herb.authorId;
      const user = getUserById(creatorId);
      
      // Determine user role (Admin or Herb Creator only)
      let userRole = 'herb_creator';
      let userRoleLabel = 'Herb Creator';
      
      if (user) {
        const role = user.role?.toLowerCase() || '';
        if (role === 'admin') {
          userRole = 'admin';
          userRoleLabel = 'Administrator';
        }
      } else if (herb.creatorRole) {
        const role = herb.creatorRole?.toLowerCase() || '';
        if (role === 'admin') {
          userRole = 'admin';
          userRoleLabel = 'Administrator';
        }
      }
      
      // Use real user data if available, otherwise use herb metadata
      const userData = user ? {
        name: user.name || user.fullName || user.username || (userRole === 'admin' ? 'Admin' : 'Herb Creator'),
        role: userRole,
        roleLabel: userRoleLabel,
        email: user.email,
        avatar: user.avatar || user.profileImage,
        id: user.id || user._id
      } : {
        name: herb.createdByName || herb.creatorName || (userRole === 'admin' ? 'Admin' : 'Herb Creator'),
        role: userRole,
        roleLabel: userRoleLabel,
        email: herb.createdByEmail,
        avatar: null,
        id: creatorId
      };
      
      return {
        id: `herb-${herb.id}`,
        herbName: herb.name,
        scientificName: herb.scientificName || '',
        date: formattedDate,
        timeAgo: timeAgo,
        fullDate: fullDate,
        userData: userData,
        status: herb.status || 'pending'
      };
    })
    .sort((a, b) => b.fullDate - a.fullDate)
    .slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 p-8 rounded-xl border border-red-200">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-gray-600">
            Managing {totalHerbs} {totalHerbs === 1 ? 'herb' : 'herbs'} in your collection
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 p-1">
            {[].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                  timeRange === range
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {totalHerbs > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <BookOpenIcon className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">No Herbs Yet</h3>
          <p className="text-amber-700 mb-4">Get started by adding your first herb to the database.</p>
          <button
            onClick={() => navigate('/herbs/new')}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Add Your First Herb
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      {totalHerbs > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Herb Activity Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Herb Activity</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {publishedHerbs} published · {pendingHerbs} pending
                  </p>
                </div>
              </div>
              <EngagementChart herbs={herbs} timeRange={timeRange} />
            </div>

            {/* Recent Activity - Simplified Table */}
            {recentActivities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Latest herbs added by {users.filter(u => u.role === 'admin' || u.role === 'herb_creator').length} contributors
                  </p>
                </div>
                <RecentActivityTable activities={recentActivities} />
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <QuickShortcuts />
            
            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Herbs</span>
                  <span className="text-2xl font-bold">{totalHerbs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Published</span>
                  <span className="text-xl font-semibold">{publishedHerbs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Review</span>
                  <span className="text-xl font-semibold">{pendingHerbs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completion Rate</span>
                  <span className="text-xl font-semibold">
                    {Math.round((publishedHerbs / (totalHerbs || 1)) * 100)}%
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/herbs')}
                className="mt-4 w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
              >
                Manage Herbs →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;