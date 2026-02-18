// src/components/common/Header.jsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Globe, User, Menu, X, Bell, Bookmark } from 'lucide-react'
import Navbar from './Navbar'
import SearchBar from './SearchBar'
import Button from './Button'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { 
      path: '/herbs', 
      label: 'Herbs',
      children: [
        { path: '/herbs', label: 'All Herbs' },
        { path: '/herbs/skin', label: 'Skin Conditions', badge: 'New' },
        { path: '/herbs/categories', label: 'Categories' },
        { path: '/herbs/favorites', label: 'Favorites' },
      ]
    },
    { path: '/recommendations', label: 'Recommendation' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span className="text-center">
            🎉 Discover 100+ Ethiopian herbs for skin wellness. <Link to="/herbs" className="font-bold underline ml-1">Explore Now</Link>
          </span>
        </div>
      </div>

      {/* Main Header */}
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
        ctaText="Login"
        onCtaClick={() => console.log('Login clicked')}
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
          
          <Button
            variant="secondary"
            className="!rounded-full w-14 h-14 !p-0 shadow-lg"
          >
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </>
  )
}

export default Header