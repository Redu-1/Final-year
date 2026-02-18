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
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('today');
  const [herbs, setHerbs] = useState([]);
  const [rules, setRules] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const savedHerbs = localStorage.getItem('herbiSense_herbs');
    if (savedHerbs) {
      setHerbs(JSON.parse(savedHerbs));
    }

    const savedRules = localStorage.getItem('herbiSense_rules');
    if (savedRules) {
      setRules(JSON.parse(savedRules));
    }
  }, []);

  // Calculate real stats from herbs data
  const totalHerbs = herbs.length;
  const publishedHerbs = herbs.filter(h => h.status === 'published').length;
  const draftHerbs = herbs.filter(h => h.status === 'draft').length;
  
  // Calculate total categories used
  const allCategories = herbs.flatMap(h => h.categories || []);
  const uniqueCategories = new Set(allCategories).size;
  
  // Calculate total skin conditions covered
  const allSkinConditions = herbs.flatMap(h => h.skinConditions || []);
  const uniqueSkinConditions = new Set(allSkinConditions).size;

  // Calculate active recommendation rules
  const activeRules = rules.filter(r => r.status === 'active').length;

  const stats = [
    {
      title: 'Total Herbs',
      value: totalHerbs.toLocaleString(),
      change: `+${publishedHerbs}`,
      changeType: 'increase',
      icon: BookOpenIcon,
      color: 'emerald',
      description: `${publishedHerbs} published, ${draftHerbs} drafts`
    },
    {
      title: 'Categories',
      value: uniqueCategories.toLocaleString(),
      change: `+${uniqueCategories}`,
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'blue',
      description: 'Unique herb categories'
    },
    {
      title: 'Skin Conditions',
      value: uniqueSkinConditions.toLocaleString(),
      change: uniqueSkinConditions > 0 ? 'Active' : 'None',
      changeType: 'increase',
      icon: SparklesIcon,
      color: 'purple',
      description: 'Conditions covered'
    },
    {
      title: 'Active Rules',
      value: activeRules.toLocaleString(),
      change: `${rules.length} total`,
      changeType: 'increase',
      icon: DocumentCheckIcon,
      color: 'amber',
      description: 'Recommendation rules'
    }
  ];

  // Generate recent activities
  const recentActivities = [
    ...herbs.slice(0, 3).map(herb => ({
      id: `herb-${herb.id}`,
      date: herb.updatedAt ? new Date(herb.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
      action: `${herb.status === 'published' ? 'Updated' : 'Modified'}: ${herb.commonName}`,
      user: herb.addedBy || 'System',
      status: herb.status,
      userAvatar: herb.addedBy ? herb.addedBy.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SY',
      type: 'herb'
    })),
    ...rules.slice(0, 2).map(rule => ({
      id: `rule-${rule.id}`,
      date: rule.updatedAt ? new Date(rule.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
      action: `${rule.status === 'active' ? 'Rule Triggered' : 'Rule Updated'}: ${rule.name || 'Recommendation Rule'}`,
      user: 'System',
      status: rule.status,
      userAvatar: 'SY',
      type: 'rule'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-gray-600">
            Managing {totalHerbs} herbs across {uniqueCategories} categories
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 bg-white rounded-xl border border-gray-200 p-1">
            {['today', 'week', 'month'].map((range) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Herb Activity Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Herb Activity</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {publishedHerbs} published · {draftHerbs} drafts
                </p>
              </div>
            </div>
            <EngagementChart herbs={herbs} timeRange={timeRange} />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600 mt-1">Latest updates</p>
            </div>
            <RecentActivityTable activities={recentActivities} />
          </div>
        </div>

        {/* Right Column - 1/3 width - Only Quick Shortcuts */}
        <div className="space-y-6">
          <QuickShortcuts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;