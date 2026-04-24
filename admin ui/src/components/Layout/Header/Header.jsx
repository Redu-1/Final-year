// src/components/Layout/Header/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';

const Header = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Refs for detecting outside clicks
  const notificationsRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Animated professional statements - Slightly shorter phrases
  const professionalPhrases = [
    { text: "Empowering traditional wisdom", icon: "🌿", highlight: "wisdom" },
    { text: "Your trusted herbal partner", icon: "✨", highlight: "trusted" },
    { text: "Ancient remedies, modern tech", icon: "⚡", highlight: "modern" },
    { text: "Preserving herbal heritage", icon: "🌟", highlight: "heritage" },
    { text: "Intelligent herbal solutions", icon: "💡", highlight: "intelligent" }
  ];

  // Rotate phrases every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % professionalPhrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    { id: 1, title: 'New herb submission', message: 'Kava Kava needs review', time: '5 min ago', read: false },
    { id: 2, title: 'System update', message: 'Version 2.4.1 available', time: '1 hour ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to highlight specific word
  const renderPhrase = (phrase) => {
    if (!phrase.highlight) return phrase.text;
    
    const parts = phrase.text.split(new RegExp(`(${phrase.highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === phrase.highlight.toLowerCase() ? 
        <span key={i} className="text-emerald-600 font-semibold">{part}</span> : 
        part
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-3"> {/* Reduced padding */}
        <div className="flex items-center justify-between">
          {/* Animated Professional Statement - Smaller box */}
          <div className="w-[400px]"> {/* Reduced from 520px to 400px */}
            <div className="relative h-10"> {/* Reduced from h-12 to h-10 */}
              {professionalPhrases.map((phrase, index) => (
                <div
                  key={index}
                  className={`
                    absolute inset-0 flex items-center transition-all duration-700 transform
                    ${index === currentPhrase 
                      ? 'opacity-100 translate-y-0' 
                      : index < currentPhrase 
                        ? 'opacity-0 -translate-y-5' 
                        : 'opacity-0 translate-y-5'
                    }
                  `}
                >
                  {/* Icon - slightly smaller */}
                  <span className="text-2xl mr-3 animate-bounce-subtle">{phrase.icon}</span>
                  
                  {/* Text - slightly smaller but still readable */}
                  <span className="text-base font-medium text-gray-800">
                    {renderPhrase(phrase)}
                  </span>
                  
                  {/* Animated gradient underline - thinner */}
                  <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 animate-slide rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Slightly smaller */}
          <div className="flex items-center space-x-3">
            <div className="relative" ref={notificationsRef}>
              {/* <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button> */}

              {/* Notifications Dropdown */}
              {/* {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    Notifications
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-emerald-50/30' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {notifications.length > 0 && (
                    <button className="w-full px-4 py-2 text-xs text-center text-emerald-600 hover:bg-gray-50 border-t border-gray-100 font-medium">
                      View all
                    </button>
                  )}
                </div>
              )} */}
            </div>

            {/* User Profile - More compact */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 pl-2 pr-1 py-1.5 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-md flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <span className="text-sm font-medium text-gray-800 block">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.role || 'Admin'}
                  </span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown - More compact */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  
                  {/* <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <UserCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                    Profile
                  </button> */}
                  
                  {/* <button
                    onClick={() => navigate('/settings')}
                    className="w-full flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-2 text-gray-400" />
                    Settings
                  </button> */}
                  
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations to your global CSS */}
      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
        
        @keyframes slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-slide {
          animation: slide 3s infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;