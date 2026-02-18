// src/components/common/Navbar.jsx
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Globe, ChevronDown, Leaf, Check } from 'lucide-react'
import Button from './Button'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTranslation } from '../../hooks/useTranslation'
import { languages } from '../../contexts/LanguageContext'

const Navbar = ({ className = '', sticky = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const location = useLocation()
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()

  // Navigation items with translations
  const navItems = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.herbs', path: '/herbs' },
    { key: 'nav.recommendation', path: '/recommendations' },
    { key: 'nav.about', path: '/about' },
    { key: 'nav.contact', path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false)
    setLanguageOpen(false)
  }, [location.pathname])

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-selector')) {
        setLanguageOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setLanguageOpen(false)
  }

  return (
    <>
      <nav
        className={`${sticky ? 'fixed top-0 left-0 right-0' : ''} z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-lg border-b border-emerald-50/50'
            : 'bg-white border-b border-gray-100'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all duration-300">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
                    HerbiSense
                  </span>
                  <span className="text-xs text-gray-500 font-medium tracking-wider mt-0.5">
                    {t('nav.tagline')}
                  </span>
                </div>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-200/50 shadow-inner">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `relative px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'text-emerald-700 bg-white shadow-md shadow-emerald-100/50 border border-emerald-100'
                          : 'text-gray-600 hover:text-emerald-700 hover:bg-white/80'
                      }`
                    }
                  >
                    {t(item.key)}
                    {location.pathname === item.path && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language selector with dropdown */}
              <div className="relative language-selector">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm transition-all duration-200 group"
                >
                  <Globe className="h-4 w-4 text-gray-500 group-hover:text-emerald-600" />
                  <span className="text-sm font-semibold text-gray-700">{language}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    languageOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {/* Language dropdown */}
                {languageOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors hover:bg-emerald-50 ${
                          lang.code === language ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">{lang.name}</span>
                          <span className="text-xs text-gray-400 ml-2">({lang.nativeName})</span>
                        </div>
                        {lang.code === language && (
                          <Check className="h-4 w-4 text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Login button */}
              <NavLink to="/login">
                <Button
                  size="md"
                  variant="gradient"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-600/30 px-6 font-semibold"
                >
                  {t('nav.login')}
                </Button>
              </NavLink>
            </div>

            {/* Mobile header actions */}
            <div className="lg:hidden flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 bg-white">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">{language}</span>
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200"
              >
                {isOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-out ${
            isOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-6 pt-6 pb-8 bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-200/50 shadow-inner">
            {/* Navigation items */}
            <div className="space-y-1 mb-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 text-emerald-700'
                        : 'text-gray-700 hover:bg-white hover:border hover:border-gray-200'
                    }`
                  }
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    location.pathname === item.path ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="font-semibold">{t(item.key)}</span>
                  {location.pathname === item.path && (
                    <ChevronDown className="h-4 w-4 text-emerald-600 ml-auto transform rotate-90" />
                  )}
                </NavLink>
              ))}
            </div>
            
            {/* Language options in mobile */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                {t('nav.language')}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code)
                      setIsOpen(false)
                    }}
                    className={`flex flex-col items-center justify-center px-2 py-3 rounded-lg border transition-all duration-200 ${
                      lang.code === language
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-200'
                    }`}
                  >
                    <span className="text-sm font-medium">{lang.code}</span>
                    <span className="text-xs mt-1">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile Login button */}
            <NavLink 
              to="/login" 
              onClick={() => setIsOpen(false)}
              className="block"
            >
              <Button
                size="lg"
                variant="gradient"
                fullWidth
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/25 py-4 font-semibold text-lg"
              >
                {t('nav.login')}
              </Button>
            </NavLink>
            
            {/* Mobile tagline */}
            <div className="mt-6 pt-6 border-t border-gray-200/50 text-center">
              <p className="text-xs text-gray-500 font-medium">
                {t('nav.tagline')}
              </p>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      {sticky && <div className="h-20"></div>}
    </>
  )
}

export default Navbar