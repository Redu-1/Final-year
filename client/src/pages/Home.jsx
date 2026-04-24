// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import HeroSection from '../components/home/HeroSection'
import HowToUse from '../components/home/HowToUse'
import FeaturesSection from '../components/home/FeaturesSection'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { Sparkles, Target, Users, Shield } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingDots size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 pt-16 md:pt-20">
      {/* Hero Section */}
      <HeroSection />

      {/* How to Use Section */}
      <HowToUse />

      {/* Features Section */}
      <FeaturesSection />

      {/* Trust Indicators - Fully Responsive */}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-emerald-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              {t('home.trusted.title1')}{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                {t('home.trusted.title2')}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              {t('home.trusted.description')}
            </p>
          </div>

          {/* Responsive Grid - Mobile first */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                key: 'who',
                color: 'text-blue-500',
                bgColor: 'bg-blue-50'
              },
              {
                icon: Target,
                key: 'healers',
                color: 'text-emerald-500',
                bgColor: 'bg-emerald-50'
              },
              {
                icon: Users,
                key: 'community',
                color: 'text-amber-500',
                bgColor: 'bg-amber-50'
              },
              {
                icon: Sparkles,
                key: 'accuracy',
                color: 'text-purple-500',
                bgColor: 'bg-purple-50'
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white/50 backdrop-blur-sm"
              >
                <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:shadow-md`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {t(`home.trust.${item.key}.title`)}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(`home.trust.${item.key}.description`)}
                </p>
              </div>
            ))}
          </div>

          {/* Optional: Responsive decoration */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 rounded-full backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-xs sm:text-sm text-emerald-700 font-medium">
                {t('common.join') || 'Join thousands of users discovering Ethiopian herbal wisdom'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Add responsive styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Home