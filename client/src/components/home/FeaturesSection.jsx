// src/components/home/FeaturesSection.jsx
import { Shield, Database, Users, Globe, Target, Zap, Award } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const FeaturesSection = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: Database,
      title: t('features.database.title'),
      description: t('features.database.description'),
      color: 'bg-blue-500',
      stats: t('features.database.stats')
    },
    {
      icon: Shield,
      title: t('features.evidence.title'),
      description: t('features.evidence.description'),
      color: 'bg-emerald-500',
      stats: t('features.evidence.stats')
    },
    {
      icon: Target,
      title: t('features.personalized.title'),
      description: t('features.personalized.description'),
      color: 'bg-amber-500',
      stats: t('features.personalized.stats')
    },
    {
      icon: Users,
      title: t('features.community.title'),
      description: t('features.community.description'),
      color: 'bg-rose-500',
      stats: t('features.community.stats')
    },
    {
      icon: Globe,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
      color: 'bg-purple-500',
      stats: t('features.multilingual.stats')
    },
    {
      icon: Zap,
      title: t('features.fast.title'),
      description: t('features.fast.description'),
      color: 'bg-orange-500',
      stats: t('features.fast.stats')
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award className="inline h-4 w-4 mr-1" />
            {t('features.badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title1')}{' '}
            <span className="text-emerald-600">{t('features.title2')}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {feature.stats}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection