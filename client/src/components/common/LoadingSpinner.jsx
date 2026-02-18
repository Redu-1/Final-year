// src/components/common/LoadingSpinner.jsx
import { useState, useEffect } from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'gradient',
  fullScreen = false,
  message = 'Loading...',
  showPercentage = false,
  interactive = false,
  speed = 'normal'
}) => {
  const [progress, setProgress] = useState(0);
  
  // Simulate progress for percentage display
  useEffect(() => {
    if (showPercentage) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [showPercentage]);
  
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-24 w-24',
  };
  
  const speedClasses = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast',
  };
  
  const renderSpinner = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            {/* Pulsing outer glow */}
            <div className="absolute inset-0 animate-ping opacity-30">
              <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-sm"></div>
            </div>
            
            {/* Animated gradient ring */}
            <div className="relative w-full h-full">
              <svg
                className={`w-full h-full ${speedClasses[speed]}`}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient-bg)"
                  strokeWidth="8"
                  strokeOpacity="0.2"
                  fill="none"
                />
                
                {/* Animated gradient arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset="70"
                  transform="rotate(-90 50 50)"
                >
                  {interactive && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values="283;0;283"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="25%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#6ee7b7" />
                    <stop offset="75%" stopColor="#a7f3d0" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  
                  <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a7f3d0" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center dot with pulse animation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="h-4 w-4 bg-emerald-400 rounded-full animate-ping absolute inset-0 -m-1 opacity-20"></div>
              </div>
            </div>
          </div>
        );
        
      case 'bars':
        return (
          <div className={`flex items-end justify-center gap-1 ${sizeClasses[size]}`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg"
                style={{
                  height: `${20 + i * 15}%`,
                  animation: `bounce 1.4s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        );
        
      case 'orbital':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  animation: `orbit 2s linear ${i * 0.66}s infinite`,
                }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div 
                    className={`h-3 w-3 rounded-full bg-gradient-to-r ${
                      i === 0 ? 'from-emerald-500 to-teal-400' :
                      i === 1 ? 'from-teal-400 to-cyan-400' :
                      'from-cyan-400 to-emerald-500'
                    }`}
                  />
                </div>
              </div>
            ))}
            
            {/* Center ring */}
            <div className="absolute inset-4 border-2 border-emerald-200 rounded-full animate-pulse"></div>
          </div>
        );
        
      default:
        return (
          <div className={`${sizeClasses[size]} ${speedClasses[speed]} text-emerald-500`}>
            <svg
              className="w-full h-full"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        );
    }
  };
  
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center";
  
  return (
    <div className={containerClass}>
      <div className="relative group">
        {renderSpinner()}
        
        {/* Interactive hover effect */}
        {interactive && !fullScreen && (
          <div className="absolute inset-0 scale-0 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-md opacity-50"></div>
          </div>
        )}
      </div>
      
      {/* Message and percentage */}
      <div className="mt-6 text-center">
        {message && (
          <p className="text-gray-700 font-medium mb-2 animate-pulse">
            {message}
          </p>
        )}
        
        {showPercentage && (
          <div className="w-48 bg-emerald-100 rounded-full h-2 overflow-hidden mt-4">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <div className="text-xs text-emerald-700 font-medium mt-2">
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>
      
      {/* Loading tips (optional) */}
      {fullScreen && (
        <div className="mt-8 text-sm text-gray-500 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-400 rounded-full"></div>
            <span>Almost ready...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Dots Loading Variant
export const LoadingDots = ({ 
  size = 'md', 
  variant = 'pulse',
  colors = ['emerald', 'teal', 'cyan']
}) => {
  const sizeClasses = {
    xs: 'h-2 w-2',
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5',
  };
  
  const colorClasses = {
    emerald: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    teal: 'bg-gradient-to-r from-teal-500 to-teal-400',
    cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-400',
    green: 'bg-gradient-to-r from-green-500 to-green-400',
    lime: 'bg-gradient-to-r from-lime-500 to-lime-400',
  };
  
  const animations = {
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping opacity-75',
  };
  
  return (
    <div className="flex items-center space-x-2">
      {colors.map((color, i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full ${animations[variant]}`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: variant === 'bounce' ? '0.6s' : '1s',
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Skeleton Loader with shimmer effect
export const SkeletonLoader = ({ 
  count = 1, 
  type = 'card',
  className = '',
  shimmer = true
}) => {
  const skeletons = Array.from({ length: count });
  
  const renderSkeleton = () => {
    const baseClass = "relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50";
    
    switch (type) {
      case 'card':
        return (
          <div className={`rounded-2xl border border-emerald-100 p-6 ${baseClass}`}>
            {shimmer && (
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            )}
            <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl mb-4"></div>
            <div className="h-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded mb-3 w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded mb-2 w-1/2"></div>
            <div className="h-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded mb-4 w-full"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full w-20"></div>
              <div className="h-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full w-16"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl"></div>
          </div>
        );
      case 'text':
        return (
          <div className={`space-y-3 ${baseClass}`}>
            {[1, 0.85, 0.7].map((width, i) => (
              <div key={i} className="relative">
                {shimmer && (
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                )}
                <div 
                  className="h-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded"
                  style={{ width: `${width * 100}%` }}
                />
              </div>
            ))}
          </div>
        );
      case 'circle':
        return (
          <div className={`relative h-12 w-12 rounded-full ${baseClass}`}>
            {shimmer && (
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className={`flex items-center gap-4 p-4 rounded-xl ${baseClass}`}>
            {shimmer && (
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            )}
            <div className="h-12 w-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded w-32"></div>
              <div className="h-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded w-24"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {skeletons.map((_, index) => (
        <div key={index} className="animate-pulse">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Add these animations to your global CSS (tailwind.config.js or global.css)
const globalAnimations = `
@keyframes orbit {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}

.animate-spin-fast {
  animation: spin 0.5s linear infinite;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce 1s infinite;
}
`;

export default LoadingSpinner;