// src/components/Layout/Sidebar/Sidebar.jsx
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon, 
  LightBulbIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: 1,
      title: 'Dashboard',
      icon: HomeIcon,
      path: '/dashboard',
      badge: null,
      color: 'emerald'
    },
    {
      id: 2,
      title: 'Herbs Management',
      icon: BookOpenIcon,
      path: '/herbs',
      badge: '',
      color: 'green'
    },
    {
      id: 3,
      title: 'Recommendations',
      icon: LightBulbIcon,
      path: '/recommendations',
      badge: '',
      color: 'green'
    },
    {
      id: 4,
      title: 'Users & Roles',
      icon: UsersIcon,
      path: '/users',
      badge: '',
      color: 'green'
    },
    // REMOVED: Content Management (id: 5)
    {
      id: 5,
      title: 'System Settings',
      icon: Cog6ToothIcon,
      path: '/settings',
      badge: null,
      color: 'green'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || 'bg-emerald-500';
  };

  const getActiveColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[color] || 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <aside className={`relative flex flex-col h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-gray-900 to-gray-800 text-white`}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 bg-gray-800 border-2 border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
      >
        {collapsed ? (
          <ChevronRightIcon className="w-3 h-3 text-gray-300" />
        ) : (
          <ChevronLeftIcon className="w-3 h-3 text-gray-300" />
        )}
      </button>

      {/* Logo Section */}
      <div className={`p-6 border-b border-gray-700 transition-all duration-300 ${collapsed ? 'px-4' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">H</span>
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <h1 className="text-xl font-bold tracking-tight text-white">HerbiSense</h1>
              <p className="text-xs text-emerald-300 font-medium mt-0.5">ADMIN CONSOLE</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center ${collapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? getActiveColorClasses(item.color) + ' shadow-sm transform scale-[1.02]' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? getColorClasses(item.color) : 'bg-gray-700/50'}`}>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                </div>
                {isActive && (
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-current rounded-full"></div>
                )}
              </div>
              {!collapsed && (
                <div className="ml-3 flex-1 flex items-center justify-between overflow-hidden">
                  <span className="text-sm font-medium truncate">{item.title}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gray-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className={`p-4 border-t border-gray-700 ${collapsed ? 'px-3' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-300 rounded-full flex items-center justify-center shadow">
              <span className="text-sm font-bold text-white">SJ</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full"></div>
          </div>
          {!collapsed && (
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white truncate">Sarah Johnson</p>
                  <p className="text-xs text-gray-400 truncate">Admin • Online</p>
                </div>
                <button className="ml-2 p-1 hover:bg-gray-700 rounded-lg">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;