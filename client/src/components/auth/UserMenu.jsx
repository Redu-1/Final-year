// src/components/auth/UserMenu.jsx
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User, Settings, LogOut, Bookmark, 
  Heart, ChevronDown, Shield
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getApiBaseUrl } from '../../services/herbApi'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [savedCount, setSavedCount] = useState(0)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout, token } = useAuth()
  const API_BASE_URL = getApiBaseUrl()

  // Fetch saved herbs count
  const fetchSavedCount = async () => {
    if (!user?.id) return
    
    try {
      const authToken = token || localStorage.getItem('herbisense_token') || localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/saved-herbs/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setSavedCount(data.data.length)
        }
      }
    } catch (error) {
      console.error('Failed to fetch saved count:', error)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchSavedCount()
    }
  }, [user?.id])

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
    logout()
    navigate('/')
  }

  // If no user is logged in, don't show the menu
  if (!user) {
    return null
  }

  // Get user display name
  const displayName = user.fullName || user.name || 'User'
  const userEmail = user.email || ''
  const isTraditionalHealer = user.userType === 'healer' || user.isTraditionalHealer || false

  // Avatar URL - use provided avatar or generate from name
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`

  const menuItems = [
    { icon: User, label: 'My Profile', path: '/profile' },
    { 
      icon: Bookmark, 
      label: 'Saved Herbs', 
      path: '/profile/saved',
      badge: savedCount > 0 ? savedCount : null
    },
    { icon: Heart, label: 'My Recommendations', path: '/profile/recommendations' },
    { icon: Settings, label: 'Settings', path: '/profile/settings' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-emerald-50 transition-colors"
      >
        <div className="relative">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-10 h-10 rounded-xl border-2 border-emerald-200 object-cover"
          />
          {isTraditionalHealer && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" title="Traditional Healer">
              <Shield className="w-2.5 h-2.5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>
        <div className="hidden lg:block text-left">
          <div className="text-sm font-semibold text-gray-900">{displayName}</div>
          <div className="text-xs text-gray-500">
            {user.userType === 'admin' ? 'Admin' : (isTraditionalHealer ? 'Healer' : 'Member')}
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-emerald-100">
            <div className="flex items-center">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-xl border-2 border-emerald-200 mr-3 object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{displayName}</div>
                <div className="text-sm text-gray-500 truncate">{userEmail}</div>
                {isTraditionalHealer && (
                  <div className="flex items-center mt-1">
                    <Shield className="h-3 w-3 text-amber-500 mr-1" />
                    <span className="text-xs font-medium text-amber-700">Traditional Healer</span>
                  </div>
                )}
                {user.userType === 'admin' && (
                  <div className="flex items-center mt-1">
                    <Shield className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-xs font-medium text-emerald-700">Administrator</span>
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
                  className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
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