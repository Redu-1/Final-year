// src/components/common/Navbar.jsx
import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Globe, ChevronDown, Check } from 'lucide-react'
import Button from './Button'
import ProfileMenu from './ProfileMenu'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTranslation } from '../../hooks/useTranslation'
import { languages } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import LogoImage from '../../assets/Logo1.png'

const Navbar = ({ className = '', sticky = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [mobileLanguageOpen, setMobileLanguageOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  
  const languageDropdownRef = useRef(null)
  const mobileLanguageRef = useRef(null)

  // ✅ ADDED 'nav.recommendation' back to navItems
  const navItems = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.herbs', path: '/herbs' },
    { key: 'nav.recommendation', path: '/recommendations' },
    { key: 'nav.about', path: '/about' },
    { key: 'nav.contact', path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setLanguageOpen(false)
    setMobileLanguageOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setLanguageOpen(false)
      }
      if (mobileLanguageRef.current && !mobileLanguageRef.current.contains(event.target)) {
        setMobileLanguageOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setLanguageOpen(false)
    setMobileLanguageOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  return (
    <nav className={`${sticky ? 'fixed top-0 left-0 right-0' : ''} z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg border-b border-emerald-50/50' : 'bg-white border-b border-gray-100'
    } ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Without tagline in mobile */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={LogoImage} 
                alt="HerbiSense Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Tagline only visible on desktop, hidden on mobile */}
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                HerbiSense
              </span>
              <span className="text-xs text-gray-500 font-medium block">{t('nav.tagline')}</span>
            </div>
            {/* Mobile: Show only the name without tagline */}
            <div className="sm:hidden">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                HerbiSense
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation - Now with Recommendation */}
          <div className="hidden lg:flex items-center space-x-1 bg-gray-50/80 rounded-2xl p-1.5 border border-gray-200/50">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}
                className={({ isActive }) => 
                  `px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    isActive ? 'text-emerald-700 bg-white shadow-md border border-emerald-100' : 'text-gray-600 hover:text-emerald-700 hover:bg-white/80'
                  }`
                }>
                {t(item.key)}
              </NavLink>
            ))}
          </div>

          {/* Right side actions - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language selector - Desktop */}
            <div className="relative language-selector" ref={languageDropdownRef}>
              <button onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-emerald-300">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">{language}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {languageOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-emerald-50 ${
                        lang.code === language ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700'
                      }`}>
                      <span>{lang.name} <span className="text-xs text-gray-400">({lang.nativeName})</span></span>
                      {lang.code === language && <Check className="h-4 w-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Profile Menu or Login Button */}
            {user ? (
              <ProfileMenu />
            ) : (
              <NavLink to="/login">
                <Button size="md" variant="gradient" className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6">
                  {t('nav.login')}
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Language selector - Mobile */}
            <div className="relative" ref={mobileLanguageRef}>
              <button 
                onClick={() => setMobileLanguageOpen(!mobileLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 bg-white"
              >
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">{language}</span>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${mobileLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileLanguageOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-emerald-50 ${
                        lang.code === language ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700'
                      }`}>
                      <span className="font-medium">{lang.name}</span>
                      {lang.code === language && <Check className="h-4 w-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={() => setIsOpen(!isOpen)} className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
              {isOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - With Recommendation added */}
      {isOpen && (
        <div className="lg:hidden bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-200/50">
          <div className="px-6 py-4">
            {user && (
              <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-white rounded-xl border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                    {user.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile navigation items - Now includes Recommendation */}
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `block px-4 py-3 rounded-xl mb-1 ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}`
                }>
                {t(item.key)}
              </NavLink>
            ))}
            
            {/* Only Logout button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {user ? (
                <button onClick={handleLogout} className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium">
                  Logout
                </button>
              ) : (
                <NavLink to="/login" onClick={() => setIsOpen(false)} className="block">
                  <Button size="lg" variant="gradient" fullWidth className="bg-gradient-to-r from-emerald-600 to-emerald-700">
                    {t('nav.login')}
                  </Button>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar