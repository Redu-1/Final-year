// src/components/common/Header.jsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Globe, User, Menu, X, Bell, Bookmark, LogOut, Settings, Heart, ChevronDown, Check } from 'lucide-react'
import Navbar from './Navbar'
import SearchBar from './SearchBar'
import Button from './Button'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { language, changeLanguage, languages, showLanguageMenu, setShowLanguageMenu, getApiLanguageCode } = useLanguage()

  const navItems = [
    { path: '/', label: 'Home' },
    { 
      path: '/herbs', 
      label: 'Herbs',
      children: [
        { path: '/herbs', label: 'All Herbs' },
        { path: '/herbs/categories', label: 'Categories' },
        { path: '/herbs/favorites', label: 'Favorites' },
      ]
    },
    { path: '/recommendations', label: 'Recommendation' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const getCurrentLanguageLabel = () => {
    const currentLang = languages.find(l => l.code === language);
    if (language === 'EN') return 'EN';
    if (language === 'AM') return 'አማ';
    if (language === 'OM') return 'OM';
    return 'EN';
  };

  return (
    <>
      {/* Top Announcement Bar with Language Switcher */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1"></div> {/* Spacer */}
          {/* <span className="text-center flex-1">
            🎉 Discover 100+ Ethiopian herbs for skin wellness. <Link to="/herbs" className="font-bold underline ml-1">Explore Now</Link>
          </span> */}
          
          {/* Language Switcher */}
          <div className="relative flex-1 flex justify-end">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
            >
              <Globe className="h-4 w-4" />
              <span>{getCurrentLanguageLabel()}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLanguageMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-emerald-50 transition-colors ${
                        language === lang.code ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      {language === lang.code && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rest of the Header remains the same */}
      <Navbar
        logo={
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                HerbiSense
              </h1>
              <p className="text-xs text-emerald-600 font-medium">Ethiopian Herbal Wisdom</p>
            </div>
          </Link>
        }
        items={navItems}
        cta={
          user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-emerald-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user.fullName?.split(' ')[0] || 'User'}</p>
                  <p className="text-xs text-gray-500">Profile</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-emerald-100 shadow-xl z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                          {getUserInitials()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                      >
                        <User className="h-5 w-5 text-emerald-500 mr-3" />
                        <span className="flex-1 text-gray-700">My Profile</span>
                      </Link>

                      <Link
                        to="/saved-herbs"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                      >
                        <Bookmark className="h-5 w-5 text-emerald-500 mr-3" />
                        <span className="flex-1 text-gray-700">Saved Herbs</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                      >
                        <Settings className="h-5 w-5 text-emerald-500 mr-3" />
                        <span className="flex-1 text-gray-700">Settings</span>
                      </Link>

                      <div className="border-t border-emerald-100 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group text-left"
                      >
                        <LogOut className="h-5 w-5 text-red-500 mr-3" />
                        <span className="flex-1 text-gray-700">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm" className="px-6">
                Login
              </Button>
            </Link>
          )
        }
        sticky={true}
      />

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 pt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Search HerbiSense</h2>
              <button
                onClick={() => setShowSearch(false)}
                className="p-2 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <SearchBar
              placeholder="Search herbs, skin conditions, traditional uses..."
              onSearch={(query) => {
                console.log('Searching:', query)
                setShowSearch(false)
              }}
              showFilters={true}
              filters={[
                { id: 'skin', label: 'Skin Conditions' },
                { id: 'herbs', label: 'Herbs' },
                { id: 'traditional', label: 'Traditional Uses' },
                { id: 'scientific', label: 'Scientific Names' },
                { id: 'remedies', label: 'Remedies' },
              ]}
              autoFocus={true}
              className="mb-6"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {['Aloe Vera', 'Skin Burns', 'Traditional Remedies', 'Eczema', 'Turmeric', 'Inflammation'].map((term) => (
                <button
                  key={term}
                  onClick={() => setShowSearch(false)}
                  className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-left hover:bg-emerald-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Bar (for desktop) */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <div className="flex flex-col space-y-3">
          <Button
            onClick={() => setShowSearch(true)}
            variant="primary"
            className="!rounded-full w-14 h-14 !p-0 shadow-xl"
          >
            <Search className="h-6 w-6" />
          </Button>
          
          {user && (
            <Button
              variant="secondary"
              className="!rounded-full w-14 h-14 !p-0 shadow-lg"
            >
              <Bookmark className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default Header