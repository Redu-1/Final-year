// src/contexts/DashboardContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create the Dashboard Context
const DashboardContext = createContext(null);

// Hook to use the Dashboard Context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Dashboard Provider Component
export const DashboardProvider = ({ children }) => {
  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    totalHerbs: 0,
    activeUsers: 0,
    pendingReviews: 0,
    avgResponseTime: 0,
    engagementRate: 0,
    successRate: 0,
    dataAccuracy: 0
  });

  // Recent Activities State
  const [recentActivities, setRecentActivities] = useState([]);

  // User Engagement Data
  const [engagementData, setEngagementData] = useState({
    labels: [],
    datasets: []
  });

  // Quick Shortcuts
  const [quickShortcuts, setQuickShortcuts] = useState([]);

  // System Health
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.8%',
    lastUpdate: new Date(),
    apiLatency: 256
  });

  // Loading States
  const [loading, setLoading] = useState({
    stats: true,
    activities: true,
    engagement: true,
    shortcuts: true
  });

  // Errors
  const [errors, setErrors] = useState({});

  // Mock data for demo
  const mockStats = {
    totalHerbs: 1284,
    activeUsers: 8432,
    pendingReviews: 12,
    avgResponseTime: 2.4,
    engagementRate: 24.8,
    successRate: 94.7,
    dataAccuracy: 98.2
  };

  const mockActivities = [
    {
      id: 1,
      date: 'Oct 24, 2023',
      action: 'Updated Dosage: Aloe Vera',
      user: 'Sarah J.',
      status: 'approved',
      userAvatar: 'SJ'
    },
    {
      id: 2,
      date: 'Oct 23, 2023',
      action: 'New Submission: Kava',
      user: 'Mike R.',
      status: 'pending',
      userAvatar: 'MR'
    },
    {
      id: 3,
      date: 'Oct 23, 2023',
      action: 'Deleted Draft: Root B',
      user: 'Admin',
      status: 'draft',
      userAvatar: 'AD'
    },
    {
      id: 4,
      date: 'Oct 22, 2023',
      action: 'User Role Changed: John D.',
      user: 'John D.',
      status: 'approved',
      userAvatar: 'JD'
    }
  ];

  const mockEngagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'User Engagement',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const mockShortcuts = [
    {
      id: 1,
      title: 'Add New Herb',
      description: 'Add a new herb to the database',
      icon: 'PlusCircleIcon',
      color: 'emerald',
      action: 'add',
      badge: null
    },
    {
      id: 2,
      title: 'Export Report',
      description: 'Generate and download system report',
      icon: 'ArrowDownTrayIcon',
      color: 'blue',
      action: 'export',
      badge: 'New'
    },
    {
      id: 3,
      title: 'Notify Users',
      description: 'Send notifications to all users',
      icon: 'BellIcon',
      color: 'amber',
      action: 'notify',
      badge: null
    },
    {
      id: 4,
      title: 'Backup DB',
      description: 'Create system backup',
      icon: 'ServerIcon',
      color: 'purple',
      action: 'backup',
      badge: 'Due'
    }
  ];

  // Fetch Dashboard Stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate some random variation for demo
      const stats = {
        totalHerbs: mockStats.totalHerbs + Math.floor(Math.random() * 20),
        activeUsers: mockStats.activeUsers + Math.floor(Math.random() * 100),
        pendingReviews: mockStats.pendingReviews + Math.floor(Math.random() * 5),
        avgResponseTime: mockStats.avgResponseTime + (Math.random() * 0.5),
        engagementRate: mockStats.engagementRate + (Math.random() * 2),
        successRate: mockStats.successRate + (Math.random() * 1),
        dataAccuracy: mockStats.dataAccuracy + (Math.random() * 0.5)
      };
      
      setDashboardStats(stats);
      setErrors(prev => ({ ...prev, stats: null }));
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setErrors(prev => ({ ...prev, stats: 'Failed to load dashboard statistics' }));
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, []);

  // Fetch Recent Activities
  const fetchRecentActivities = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, activities: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setRecentActivities(mockActivities);
      setErrors(prev => ({ ...prev, activities: null }));
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      setErrors(prev => ({ ...prev, activities: 'Failed to load recent activities' }));
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  }, []);

  // Fetch Engagement Data
  const fetchEngagementData = useCallback(async (timeRange = '7d') => {
    try {
      setLoading(prev => ({ ...prev, engagement: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Generate different data based on time range
      let data;
      switch (timeRange) {
        case '30d':
          data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100));
          break;
        case '90d':
          data = Array.from({ length: 13 }, () => Math.floor(Math.random() * 100));
          break;
        default: // 7d
          data = mockEngagementData.datasets[0].data;
      }
      
      setEngagementData({
        labels: timeRange === '7d' ? mockEngagementData.labels : 
                timeRange === '30d' ? Array.from({ length: 6 }, (_, i) => `Week ${i + 1}`) :
                Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`),
        datasets: [{
          ...mockEngagementData.datasets[0],
          data
        }]
      });
      setErrors(prev => ({ ...prev, engagement: null }));
    } catch (error) {
      console.error('Failed to fetch engagement data:', error);
      setErrors(prev => ({ ...prev, engagement: 'Failed to load engagement data' }));
    } finally {
      setLoading(prev => ({ ...prev, engagement: false }));
    }
  }, []);

  // Fetch Quick Shortcuts
  const fetchQuickShortcuts = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, shortcuts: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setQuickShortcuts(mockShortcuts);
      setErrors(prev => ({ ...prev, shortcuts: null }));
    } catch (error) {
      console.error('Failed to fetch quick shortcuts:', error);
      setErrors(prev => ({ ...prev, shortcuts: 'Failed to load quick shortcuts' }));
    } finally {
      setLoading(prev => ({ ...prev, shortcuts: false }));
    }
  }, []);

  // Refresh System Health
  const refreshSystemHealth = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const healthStatus = Math.random() > 0.1 ? 'healthy' : 'degraded';
      
      setSystemHealth({
        status: healthStatus,
        uptime: healthStatus === 'healthy' ? '99.8%' : '98.2%',
        lastUpdate: new Date(),
        apiLatency: Math.floor(Math.random() * 100) + 200
      });
    } catch (error) {
      console.error('Failed to refresh system health:', error);
    }
  }, []);

  // Handle Quick Shortcut Action
  const handleShortcutAction = useCallback((action, data) => {
    console.log(`Shortcut action: ${action}`, data);
    
    // Handle different actions
    switch (action) {
      case 'add':
        // Navigate to add herb page
        window.location.href = '/herbs?action=add';
        break;
      case 'export':
        // Trigger export
        triggerExport();
        break;
      case 'notify':
        // Open notification modal
        openNotificationModal();
        break;
      case 'backup':
        // Trigger backup
        triggerBackup();
        break;
      default:
        console.warn(`Unknown shortcut action: ${action}`);
    }
  }, []);

  // Helper functions for shortcut actions
  const triggerExport = async () => {
    try {
      // Simulate export process
      console.log('Exporting data...');
      // In real app, this would be an API call
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const openNotificationModal = () => {
    // This would open a modal in a real app
    console.log('Opening notification modal...');
  };

  const triggerBackup = async () => {
    try {
      // Simulate backup process
      console.log('Starting backup...');
      // In real app, this would be an API call
    } catch (error) {
      console.error('Backup failed:', error);
    }
  };

  // Add a new activity
  const addActivity = useCallback((activity) => {
    const newActivity = {
      ...activity,
      id: recentActivities.length + 1,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      userAvatar: activity.user?.split(' ').map(n => n[0]).join('') || 'SY'
    };

    setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]);
  }, [recentActivities.length]);

  // Update a stat
  const updateStat = useCallback((statName, value) => {
    setDashboardStats(prev => ({
      ...prev,
      [statName]: value
    }));
  }, []);

  // Initialize dashboard data
  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchRecentActivities(),
        fetchEngagementData(),
        fetchQuickShortcuts(),
        refreshSystemHealth()
      ]);
    };

    initializeDashboard();

    // Set up periodic refresh for system health
    const healthInterval = setInterval(refreshSystemHealth, 30000); // Every 30 seconds
    
    // Set up periodic refresh for stats (less frequent)
    const statsInterval = setInterval(fetchDashboardStats, 300000); // Every 5 minutes

    return () => {
      clearInterval(healthInterval);
      clearInterval(statsInterval);
    };
  }, [fetchDashboardStats, fetchRecentActivities, fetchEngagementData, fetchQuickShortcuts, refreshSystemHealth]);

  const value = {
    // State
    dashboardStats,
    recentActivities,
    engagementData,
    quickShortcuts,
    systemHealth,
    loading,
    errors,
    
    // Actions
    fetchDashboardStats,
    fetchRecentActivities,
    fetchEngagementData,
    fetchQuickShortcuts,
    refreshSystemHealth,
    handleShortcutAction,
    addActivity,
    updateStat,
    
    // Helper functions
    getStatChange: (statName) => {
      // Calculate percentage change (mock)
      const changes = {
        totalHerbs: '+5.4%',
        activeUsers: '+12.3%',
        pendingReviews: '-2',
        avgResponseTime: '-0.3s',
        engagementRate: '+3.2%',
        successRate: '+1.5%',
        dataAccuracy: '+0.8%'
      };
      return changes[statName] || '+0%';
    },
    
    getStatDescription: (statName) => {
      const descriptions = {
        totalHerbs: '64 added in last 30 days',
        activeUsers: 'Peak activity: 2:00 PM - 4:00 PM',
        pendingReviews: 'Requires botanical validation',
        avgResponseTime: 'Improved by 11%',
        engagementRate: '7-day average',
        successRate: 'Recommendation accuracy',
        dataAccuracy: 'Herbal entries validation'
      };
      return descriptions[statName] || '';
    }
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;