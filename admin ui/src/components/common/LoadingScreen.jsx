// src/components/common/LoadingScreen.jsx
import { useState, useEffect } from 'react';

const LoadingScreen = ({ 
  message = 'Loading HerbiSense',
  subMessage = 'Securing your connection and loading the dashboard...',
  showProgress = true,
  fullScreen = true,
  size = 'md'
}) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Animate progress bar
  useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [showProgress]);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: {
      container: 'w-12 h-12',
      logo: 'text-xl',
      text: 'text-sm'
    },
    md: {
      container: 'w-20 h-20',
      logo: 'text-2xl',
      text: 'text-base'
    },
    lg: {
      container: 'w-32 h-32',
      logo: 'text-4xl',
      text: 'text-lg'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  const content = (
    <div className="text-center">
      <div className="relative">
        {/* Animated Logo Container */}
        <div className={`${currentSize.container} mx-auto mb-6 relative`}>
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-3xl blur-xl animate-pulse"></div>
          
          {/* Spinning border */}
          <div className="absolute -inset-1 border-4 border-emerald-200/50 rounded-2xl animate-spin"></div>
          
          {/* Main logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
              <span className={`font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent ${currentSize.logo}`}>
                H
              </span>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <div>
            <h3 className={`font-semibold text-gray-900 ${currentSize.text}`}>
              {message}
              <span className="text-emerald-600">{dots}</span>
            </h3>
            <p className="text-gray-600 mt-2 max-w-sm mx-auto">
              {subMessage}
            </p>
          </div>

          {/* Progress bar */}
          {showProgress && (
            <div className="w-64 mx-auto">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Loading</span>
                <span>{Math.min(Math.round(progress), 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Loading indicators */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Security status */}
          <div className="pt-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium text-emerald-700">
                ENCRYPTED CONNECTION ACTIVE
              </span>
            </div>
          </div>

          {/* System info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium text-gray-700">System</div>
                <div className="mt-1">HerbiSense v2.4.0</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-700">Status</div>
                <div className="mt-1 text-emerald-600 font-medium">Initializing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {content}
        
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
      </div>
    );
  }

  return content;
};

// Variants of the LoadingScreen
export const LoadingCard = ({ message = 'Loading...', className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-xl p-8 ${className}`}>
    <LoadingScreen 
      message={message}
      subMessage="Please wait while we fetch your data"
      showProgress={false}
      fullScreen={false}
      size="sm"
    />
  </div>
);

export const LoadingInline = ({ message = 'Loading', size = 'sm' }) => (
  <div className="inline-flex items-center space-x-2">
    <div className={`w-${size === 'sm' ? '3' : '4'} h-${size === 'sm' ? '3' : '4'} border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin`}></div>
    <span className="text-gray-600">{message}...</span>
  </div>
);

export const LoadingSpinner = ({ size = 'md', color = 'emerald' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    emerald: 'border-emerald-200 border-t-emerald-600',
    blue: 'border-blue-200 border-t-blue-600',
    gray: 'border-gray-200 border-t-gray-600',
    white: 'border-white/30 border-t-white'
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
    />
  );
};

export default LoadingScreen;