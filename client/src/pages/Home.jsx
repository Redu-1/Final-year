// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import Layout, { PageWrapper } from '../components/layout/Layout'
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
    <Layout>
      {/* Remove PageWrapper or modify it */}
      <div className="-mt-4"> {/* Negative margin to pull hero section up */}
        {/* Hero Section */}
        <HeroSection />
      </div>

      {/* Rest of the sections with normal spacing */}
      <PageWrapper>
        {/* How to Use Section */}
        <HowToUse />

        {/* Features Section */}
        <FeaturesSection />

        {/* Trust Indicators */}
        <section className="py-16 bg-gradient-to-b from-white to-emerald-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('home.trusted.title1')}{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  {t('home.trusted.title2')}
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('home.trusted.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  key: 'who',
                  color: 'text-blue-500'
                },
                {
                  icon: Target,
                  key: 'healers',
                  color: 'text-emerald-500'
                },
                {
                  icon: Users,
                  key: 'community',
                  color: 'text-amber-500'
                },
                {
                  icon: Sparkles,
                  key: 'accuracy',
                  color: 'text-purple-500'
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${item.color} bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{t(`home.trust.${item.key}.title`)}</h3>
                  <p className="text-gray-600 text-sm">{t(`home.trust.${item.key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PageWrapper>
    </Layout>
  )
}

export default Home