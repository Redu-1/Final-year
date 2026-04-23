// src/components/Layout/Sidebar/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import LogoImage from '../../../assets/Logo1.png';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { userType } = useAuth();

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Menu items based on user role
  const baseMenuItems = [
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
    }
  ];

  // Admin only gets extra menu items
  const adminMenuItems = userType === 'admin' ? [
    {
      id: 3,
      title: 'Feedback',
      icon: ChatBubbleLeftRightIcon,
      path: '/feedback',
      badge: '',
      color: 'purple'
    },
    {
      id: 4,
      title: 'Users & Roles',
      icon: UsersIcon,
      path: '/users',
      badge: '',
      color: 'blue'
    }
  ] : [];

  // Combine menu items based on role
  const menuItems = [...baseMenuItems, ...adminMenuItems];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      blue: 'bg-blue-500'
    };
    return colors[color] || 'bg-emerald-500';
  };

  const getActiveColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200'
    };
    return colors[color] || 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  // Mobile toggle button
  const MobileToggleButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="fixed top-4 left-4 z-50 md:hidden p-2 bg-gray-900 rounded-lg shadow-lg text-white hover:bg-gray-700 transition-colors"
    >
      {isMobileOpen ? (
        <XMarkIcon className="w-6 h-6" />
      ) : (
        <Bars3Icon className="w-6 h-6" />
      )}
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className={`p-6 border-b border-gray-700 transition-all duration-300 ${collapsed && !isMobile ? 'px-4' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 ${collapsed && !isMobile ? 'mx-auto' : ''}`}>
            <img 
              src={LogoImage} 
              alt="HerbiSense Logo" 
              className="w-10 h-10 rounded-xl object-cover shadow-lg"
            />
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 overflow-hidden">
              <h2 className="text-lg font-bold text-white tracking-tight">HerbiSense</h2>
              <p className="text-xs text-emerald-300 font-medium mt-0.5">
                {userType === 'admin' ? 'ADMIN CONSOLE' : 'HERB CREATOR PORTAL'}
              </p>
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
                flex items-center ${collapsed && !isMobile ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? getActiveColorClasses(item.color) + ' shadow-sm transform scale-[1.02]' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
              title={collapsed && !isMobile ? item.title : ''}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? getColorClasses(item.color) : 'bg-gray-700/50'}`}>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                </div>
                {isActive && (
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-current rounded-full"></div>
                )}
              </div>
              {(!collapsed || isMobile) && (
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
    </>
  );

  // Desktop sidebar (always visible, can be collapsed)
  if (!isMobile) {
    return (
      <>
        <aside className={`relative flex flex-col h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-40`}>
          {/* Collapse Toggle - Desktop only */}
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
          
          <SidebarContent />
        </aside>
      </>
    );
  }

  // Mobile sidebar (hidden by default, shows when toggled)
  return (
    <>
      <MobileToggleButton />
      
      {/* Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out md:hidden
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative h-full">
          {/* Close button inside sidebar for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 z-10 p-1 rounded-lg bg-gray-700/50 hover:bg-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-300" />
          </button>
          
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;