// src/components/layout/Layout.jsx
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronUp, Search, MessageSquare } from 'lucide-react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import Button from '../common/Button'
import Container from './Container'

const Layout = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
      
      // Show feedback widget after scrolling 50% of page
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercentage > 50 && !showFeedback) {
        setShowFeedback(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showFeedback])

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Floating Leaves */}
        <div className="absolute top-20 left-10 w-24 h-24 opacity-5">
          <svg viewBox="0 0 100 100" className="text-emerald-400 animate-float">
            <path d="M50 10 Q70 30 50 50 Q30 70 50 90" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute bottom-32 right-16 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" className="text-emerald-400 animate-float" style={{animationDelay: '2s'}}>
            <path d="M30 30 Q50 10 70 30 Q90 50 70 70 Q50 90 30 70 Q10 50 30 30" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform">
            {/* Sidebar content */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end space-y-3">
        {/* Scroll to Top */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            variant="primary"
            className="!rounded-full w-12 h-12 !p-0 shadow-xl animate-bounce"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        )}

        {/* Quick Search */}
        <Button
          variant="secondary"
          className="!rounded-full w-12 h-12 !p-0 shadow-lg"
          aria-label="Quick search"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Feedback Widget */}
        {showFeedback && (
          <div className="relative group">
            <Button
              variant="primary"
              className="!rounded-full w-12 h-12 !p-0 shadow-lg"
              onClick={() => console.log('Feedback clicked')}
              aria-label="Give feedback"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            {/* Feedback Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-2xl shadow-2xl border border-emerald-200 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
              <p className="text-sm text-gray-700 mb-3">
                How can we improve HerbiSense?
              </p>
              <textarea
                className="w-full h-20 p-2 text-sm border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your feedback..."
              />
              <button className="mt-2 w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-emerald-700">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-5 h-16">
          {['Home', 'Herbs', 'Search', 'Recs', 'Profile'].map((item, index) => (
            <button
              key={item}
              className={`flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                location.pathname === `/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`
                  ? 'text-emerald-600'
                  : 'text-gray-600'
              }`}
              onClick={() => {
                if (item === 'Search') {
                  // Handle search
                } else if (item === 'Recs') {
                  window.location.href = '/recommendations'
                } else if (item === 'Profile') {
                  window.location.href = '/login'
                } else {
                  window.location.href = item === 'Home' ? '/' : `/${item.toLowerCase()}`
                }
              }}
            >
              {index === 2 ? (
                <div className="w-12 h-12 -mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <Search className="h-5 w-5 text-white" />
                </div>
              ) : (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                    location.pathname === `/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`
                      ? 'bg-emerald-100'
                      : 'bg-emerald-50'
                  }`}>
                    {/* Icons would go here */}
                  </div>
                  <span>{item}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Page Transition Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 animate-shimmer"></div>
      </div>
    </div>
  )
}

// Page Wrapper Component - FIXED VERSION
export const PageWrapper = ({ 
  children, 
  showHero = false,
  heroTitle,
  heroSubtitle,
  heroBackground = 'default',
  className = '' 
}) => {
  return (
    <div className={`${className}`}>
      {showHero && (
        <div className={`relative overflow-hidden ${
          heroBackground === 'gradient' 
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-700' 
            : 'bg-white'
        }`}>
          {/* Hero Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 border-4 border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <Container className="relative z-10 py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {heroTitle}
              </h1>
              {heroSubtitle && (
                <p className="text-xl text-emerald-100">
                  {heroSubtitle}
                </p>
              )}
            </div>
          </Container>
          
          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity=".25" className="fill-white"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                opacity=".5" className="fill-white"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                className="fill-white"></path>
            </svg>
          </div>
        </div>
      )}
      
      {/* REMOVED: pt-12 conditional padding */}
      {children}
    </div>
  )
}

// Content Section Component
export const ContentSection = ({
  children,
  title,
  subtitle,
  align = 'left',
  spacing = 'default',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const spacingClasses = {
    none: 'mb-0',
    xs: 'mb-8',
    sm: 'mb-10',
    default: 'mb-12',
    lg: 'mb-16',
    xl: 'mb-20',
  }

  return (
    <div className={`${spacingClasses[spacing]} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className={`mb-8 ${alignClasses[align]}`}>
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default Layout