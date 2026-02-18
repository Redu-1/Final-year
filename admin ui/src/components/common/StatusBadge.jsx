// src/components/common/StatusBadge.jsx
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const StatusBadge = ({ 
  status, 
  size = 'md',
  showIcon = true,
  showText = true,
  className = ''
}) => {
  const statusConfig = {
    active: {
      icon: CheckCircleIcon,
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
      dot: 'bg-emerald-400'
    },
    online: {
      icon: CheckCircleIcon,
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
      dot: 'bg-emerald-400'
    },
    approved: {
      icon: CheckCircleIcon,
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
      dot: 'bg-emerald-400'
    },
    pending: {
      icon: ClockIcon,
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      dot: 'bg-yellow-400'
    },
    draft: {
      icon: PencilIcon,
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      iconColor: 'text-blue-500',
      dot: 'bg-blue-400'
    },
    published: {
      icon: EyeIcon,
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      iconColor: 'text-indigo-500',
      dot: 'bg-indigo-400'
    },
    inactive: {
      icon: XCircleIcon,
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      iconColor: 'text-gray-500',
      dot: 'bg-gray-400'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      iconColor: 'text-orange-500',
      dot: 'bg-orange-400'
    },
    error: {
      icon: XCircleIcon,
      bg: 'bg-red-100',
      text: 'text-red-800',
      iconColor: 'text-red-500',
      dot: 'bg-red-400'
    },
    high: {
      icon: ExclamationTriangleIcon,
      bg: 'bg-red-100',
      text: 'text-red-800',
      iconColor: 'text-red-500',
      dot: 'bg-red-400'
    },
    moderate: {
      icon: ExclamationTriangleIcon,
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      dot: 'bg-yellow-400'
    },
    low: {
      icon: CheckCircleIcon,
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-500',
      dot: 'bg-emerald-400'
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`
      inline-flex items-center ${sizeClasses[size]}
      ${config.bg} ${config.text} rounded-full font-medium
      ${className}
    `}>
      {showIcon && <Icon className={`${iconSizes[size]} ${config.iconColor}`} />}
      
      {showText && (
        <>
          {!showIcon && (
            <span className={`w-1.5 h-1.5 ${config.dot} rounded-full`}></span>
          )}
          <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </>
      )}
      
      {!showText && showIcon && (
        <span className={`w-1.5 h-1.5 ${config.dot} rounded-full`}></span>
      )}
    </span>
  );
};

export default StatusBadge;