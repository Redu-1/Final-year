// src/components/common/ProfileMenu.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Get user's full name from either fullName or full_name field
  const getUserFullName = () => {
    return user?.fullName || user?.full_name || '';
  };

  // Get first two letters from full name
  const getInitials = () => {
    const fullName = getUserFullName();
    if (!fullName) return '';
    
    const nameParts = fullName.trim().split(' ');
    
    if (nameParts.length === 1) {
      // Single name - take first two letters
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple names - take first letter of first two names
      return (nameParts[0][0] + (nameParts[1]?.[0] || '')).toUpperCase();
    }
  };

  // Get first name from full name
  const getFirstName = () => {
    const fullName = getUserFullName();
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  // Get user email (handle different field names)
  const getUserEmail = () => {
    return user?.email || user?.email_address || '';
  };

  // Don't render if no user
  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-emerald-50 transition-all group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Circular Avatar with Gradient */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
          <span className="text-sm font-bold">{getInitials()}</span>
        </div>

        {/* First Name - from registration */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{getFirstName()}</p>
        </div>

        {/* Chevron with Animation */}
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-emerald-100 shadow-xl z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  <span>{getInitials()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{getUserFullName()}</p>
                  <p className="text-sm text-gray-600 truncate">{getUserEmail()}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-red-50 transition-colors group text-left"
              >
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <span className="flex-1 text-gray-700 font-medium">Logout</span>
              </button>
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-emerald-100 text-center">
              <p className="text-xs text-gray-500">
                HerbiSense v2.4.0
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;