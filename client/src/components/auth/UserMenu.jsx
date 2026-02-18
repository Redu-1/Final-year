// src/components/auth/UserMenu.jsx
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  User, Settings, LogOut, Bookmark, 
  Heart, ChevronDown, Shield
} from 'lucide-react'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Mock user data
  const user = {
    name: 'Alemu Kebede',
    email: 'alemu@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemu',
    isTraditionalHealer: true,
    joinedDate: '2024-01-15'
  }

  const menuItems = [
    { icon: User, label: 'My Profile', path: '/profile' },
    { icon: Bookmark, label: 'Saved Herbs', path: '/profile/saved' },
    { icon: Heart, label: 'My Recommendations', path: '/profile/recommendations' },
    { icon: Settings, label: 'Settings', path: '/profile/settings' },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('herbisense_auth')
    window.location.href = '/'
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-emerald-50 transition-colors"
      >
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-xl border-2 border-emerald-200"
          />
          {user.isTraditionalHealer && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-sm font-semibold text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">Member</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-emerald-100">
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-xl border-2 border-emerald-200 mr-3"
              />
              <div>
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                {user.isTraditionalHealer && (
                  <div className="flex items-center mt-1">
                    <Shield className="h-3 w-3 text-amber-500 mr-1" />
                    <span className="text-xs font-medium text-amber-700">Traditional Healer</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-emerald-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu