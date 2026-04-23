// src/components/common/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  // Safely handle undefined or null status
  if (!status) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        Unknown
      </span>
    );
  }

  // Safely get status string
  const statusStr = String(status).toLowerCase();
  
  // Define badge styles based on status and type
  const getBadgeStyles = () => {
    // Default type badges
    if (type === 'default') {
      switch (statusStr) {
        case 'active':
        case 'approved':
        case 'published':
          return 'bg-green-100 text-green-800';
        case 'pending':
        case 'draft':
          return 'bg-yellow-100 text-yellow-800';
        case 'inactive':
        case 'rejected':
        case 'archived':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Custom type badges (you can add more types as needed)
    switch (type) {
      case 'herb':
        switch (statusStr) {
          case 'common':
            return 'bg-emerald-100 text-emerald-800';
          case 'rare':
            return 'bg-amber-100 text-amber-800';
          case 'endangered':
            return 'bg-rose-100 text-rose-800';
          default:
            return 'bg-blue-100 text-blue-800';
        }
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format the display text safely
  const formatDisplayText = () => {
    if (!status) return 'Unknown';
    
    // Handle different input types
    const statusText = String(status);
    
    // If it's empty string
    if (statusText.trim() === '') return 'Unknown';
    
    // Capitalize first letter and make the rest lowercase
    return statusText.charAt(0).toUpperCase() + statusText.slice(1).toLowerCase();
  };

  const badgeStyles = getBadgeStyles();
  const displayText = formatDisplayText();

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeStyles}`}>
      {displayText}
    </span>
  );
};

export default StatusBadge;