// src/components/common/StatsCard.jsx
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'increase', // 'increase' or 'decrease'
  icon: Icon,
  color = 'emerald',
  description,
  loading = false,
  trendData
}) => {
  const colors = {
    emerald: {
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200'
    },
    blue: {
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    purple: {
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200'
    },
    amber: {
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-200'
    },
    red: {
      bg: 'bg-red-500',
      bgLight: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200'
    },
    gray: {
      bg: 'bg-gray-500',
      bgLight: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-200'
    }
  };

  const selectedColor = colors[color] || colors.emerald;

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border ${selectedColor.border} rounded-2xl p-6 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`${selectedColor.bgLight} w-12 h-12 rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${selectedColor.text}`} />
          </div>
        )}
      </div>
      
      {change && (
        <div className="flex items-center space-x-2 mt-2">
          <div className={`flex items-center px-2 py-1 rounded-lg ${selectedColor.bgLight} ${selectedColor.text} text-sm font-medium`}>
            {changeType === 'increase' ? (
              <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
            )}
            {change}
          </div>
          {description && (
            <span className="text-sm text-gray-500">{description}</span>
          )}
        </div>
      )}
      
      {trendData && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Trend</span>
            <span>Last 7 days</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${selectedColor.bg} rounded-full`}
              style={{ width: `${trendData}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;