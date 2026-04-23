// src/pages/Recommendations.jsx
import { useState, useEffect } from 'react'
import RecommendationForm from '../components/recommendations/RecommendationForm'
import RecommendationResults from '../components/recommendations/RecommendationResults'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { Sparkles, Target, Heart } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Recommendations = () => {
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  // Mock recommendations data with translations
  const mockRecommendations = [
    {
      id: 1,
      herbId: 1,
      herbName: t('rec.herb.aloe.name'),
      localName: t('rec.herb.aloe.local'),
      effectiveness: 95,
      preparationDifficulty: 'easy',
      bestFor: [
        t('rec.herb.aloe.bestFor[0]'),
        t('rec.herb.aloe.bestFor[1]'),
        t('rec.herb.aloe.bestFor[2]')
      ],
      description: t('rec.herb.aloe.desc'),
      benefits: [
        t('rec.herb.aloe.benefits[0]'),
        t('rec.herb.aloe.benefits[1]'),
        t('rec.herb.aloe.benefits[2]'),
        t('rec.herb.aloe.benefits[3]')
      ],
      region: 'Oromia',
      traditionalUse: 2000,
      safetyLevel: 'high'
    },
    {
      id: 2,
      herbId: 2,
      herbName: t('rec.herb.kosso.name'),
      localName: t('rec.herb.kosso.local'),
      effectiveness: 88,
      preparationDifficulty: 'medium',
      bestFor: [
        t('rec.herb.kosso.bestFor[0]'),
        t('rec.herb.kosso.bestFor[1]')
      ],
      description: t('rec.herb.kosso.desc'),
      benefits: [
        t('rec.herb.kosso.benefits[0]'),
        t('rec.herb.kosso.benefits[1]'),
        t('rec.herb.kosso.benefits[2]'),
        t('rec.herb.kosso.benefits[3]')
      ],
      region: 'Amhara',
      traditionalUse: 500,
      safetyLevel: 'medium'
    },
    {
      id: 3,
      herbId: 4,
      herbName: t('rec.herb.turmeric.name'),
      localName: t('rec.herb.turmeric.local'),
      effectiveness: 92,
      preparationDifficulty: 'easy',
      bestFor: [
        t('rec.herb.turmeric.bestFor[0]'),
        t('rec.herb.turmeric.bestFor[1]'),
        t('rec.herb.turmeric.bestFor[2]')
      ],
      description: t('rec.herb.turmeric.desc'),
      benefits: [
        t('rec.herb.turmeric.benefits[0]'),
        t('rec.herb.turmeric.benefits[1]'),
        t('rec.herb.turmeric.benefits[2]'),
        t('rec.herb.turmeric.benefits[3]')
      ],
      region: 'SNNP',
      traditionalUse: 3000,
      safetyLevel: 'high'
    },
    {
      id: 4,
      herbId: 5,
      herbName: t('rec.herb.neem.name'),
      localName: t('rec.herb.neem.local'),
      effectiveness: 90,
      preparationDifficulty: 'medium',
      bestFor: [
        t('rec.herb.neem.bestFor[0]'),
        t('rec.herb.neem.bestFor[1]'),
        t('rec.herb.neem.bestFor[2]')
      ],
      description: t('rec.herb.neem.desc'),
      benefits: [
        t('rec.herb.neem.benefits[0]'),
        t('rec.herb.neem.benefits[1]'),
        t('rec.herb.neem.benefits[2]'),
        t('rec.herb.neem.benefits[3]')
      ],
      region: 'Tigray',
      traditionalUse: 1200,
      safetyLevel: 'medium'
    },
  ]

  const mockUserData = {
    conditions: ['dryness', 'inflammation', 'acne'],
    severity: {
      dryness: 2,
      inflammation: 1,
      acne: 3
    },
    profile: {
      skinType: 'combination',
      age: 'adult',
      location: 'High altitude',
      goals: ['healing', 'moisture', 'prevention']
    }
  }

  const handleFormSubmit = (data) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setShowResults(true)
      setIsLoading(false)
    }, 2000)
  }

  const handleBackToForm = () => {
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResults ? (
          <>
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {t('rec.header.title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('rec.header.subtitle')}
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: Target,
                  title: t('rec.benefit.personalized.title'),
                  description: t('rec.benefit.personalized.desc')
                },
                {
                  icon: Sparkles,
                  title: t('rec.benefit.traditional.title'),
                  description: t('rec.benefit.traditional.desc')
                },
                {
                  icon: Heart,
                  title: t('rec.benefit.safe.title'),
                  description: t('rec.benefit.safe.desc')
                },
              ].map((benefit, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl border border-gray-200">
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* Recommendation Form */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
                <LoadingDots size="lg" />
                <p className="mt-6 text-gray-600">{t('rec.loading.message')}</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <RecommendationForm 
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Trust Section */}
            <div className="mt-10 bg-emerald-50 rounded-xl border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {t('rec.trust.title')}
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center mr-3">
                    <span className="text-emerald-700 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">{t('rec.trust.healer')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center mr-3">
                    <span className="text-emerald-700 font-bold text-sm">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">{t('rec.trust.scientific')}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            {/* Back Button */}
            <button
              onClick={handleBackToForm}
              className="mb-6 flex items-center text-emerald-600 hover:text-emerald-700"
            >
              <span className="mr-2 text-xl">←</span>
              <span>{t('rec.back.button')}</span>
            </button>

            <RecommendationResults 
              recommendations={mockRecommendations}
              userData={mockUserData}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommendations