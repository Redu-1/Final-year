// src/components/dashboard/OverviewStats.jsx
import StatsCard from '../common/StatsCard';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ClockIcon, 
  DocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';

const OverviewStats = () => {
  const statsData = [
    {
      title: 'Total Herbs',
      value: '1,284',
      change: '+5.4%',
      changeType: 'increase',
      icon: ChartBarIcon,
      color: 'emerald',
      description: '64 added in last 30 days',
      trendData: 75
    },
    {
      title: 'Active Users',
      value: '8,432',
      change: '+12.3%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'blue',
      description: 'Peak: 2:00 PM - 4:00 PM',
      trendData: 82
    },
    {
      title: 'Pending Reviews',
      value: '12',
      change: '-2',
      changeType: 'decrease',
      icon: DocumentCheckIcon,
      color: 'amber',
      description: 'Requires botanical validation',
      trendData: 35
    },
    {
      title: 'Avg. Response Time',
      value: '2.4s',
      change: '-0.3s',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'purple',
      description: 'Improved by 11%',
      trendData: 68
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Herbs Management</h2>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Safety & Usage</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                +5.4%
                <ArrowTrendingUpIcon className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Recommendations</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                +12%
                <ArrowTrendingUpIcon className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
          View Detailed Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-xl font-bold text-gray-900 mt-1">94.7%</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.7%' }}></div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Data Accuracy</p>
              <p className="text-xl font-bold text-gray-900 mt-1">98.2%</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '98.2%' }}></div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">User Satisfaction</p>
              <p className="text-xl font-bold text-gray-900 mt-1">4.8/5</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for CheckCircleIcon
const CheckCircleIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default OverviewStats;