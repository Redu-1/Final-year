// src/components/herbs/HerbDetail.jsx
import { useState } from 'react'
import { 
  Bookmark, Leaf, ChevronLeft, Share2, Star, Clock, 
  AlertCircle, Calendar, BookOpen, Zap, Droplets, 
  Flame, Shield, Heart, ExternalLink
} from 'lucide-react'
import Button from '../common/Button'
import Modal from '../common/Modal'
import { useTranslation } from '../../hooks/useTranslation'

const HerbDetail = ({ herb }) => {
  const [isBookmarked, setIsBookmarked] = useState(herb.isBookmarked || false)
  const [activeTab, setActiveTab] = useState('description')
  const [showPreparationModal, setShowPreparationModal] = useState(false)
  const [selectedPreparation, setSelectedPreparation] = useState(null)
  const { t } = useTranslation()

  const benefits = [
    { icon: Flame, label: t('herb.benefit.soothes'), color: 'text-orange-500' },
    { icon: Droplets, label: t('herb.benefit.hydration'), color: 'text-blue-500' },
    { icon: Shield, label: t('herb.benefit.protects'), color: 'text-emerald-500' },
    { icon: Zap, label: t('herb.benefit.healing'), color: 'text-purple-500' },
  ]

  const safetyInfo = [
    { level: 'safe', text: t('herb.safety.safe') },
    { level: 'warning', text: t('herb.safety.warning') },
    { level: 'info', text: t('herb.safety.info') },
  ]

  const preparationMethods = [
    {
      id: 1,
      title: t('herb.preparation.method1.title'),
      steps: [
        t('herb.preparation.method1.step1'),
        t('herb.preparation.method1.step2'),
        t('herb.preparation.method1.step3'),
        t('herb.preparation.method1.step4'),
        t('herb.preparation.method1.step5')
      ],
      duration: t('herb.preparation.method1.duration'),
      difficulty: t('herb.preparation.method1.difficulty'),
      traditional: true
    },
    {
      id: 2,
      title: t('herb.preparation.method2.title'),
      steps: [
        t('herb.preparation.method2.step1'),
        t('herb.preparation.method2.step2'),
        t('herb.preparation.method2.step3'),
        t('herb.preparation.method2.step4'),
        t('herb.preparation.method2.step5')
      ],
      duration: t('herb.preparation.method2.duration'),
      difficulty: t('herb.preparation.method2.difficulty'),
      traditional: false
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6 group"
      >
        <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        {t('herb.detail.back')}
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Herb Info */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-white rounded-3xl border border-emerald-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{herb.name}</h1>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span className="text-lg text-emerald-600 font-medium">{herb.localName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{herb.scientificName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="font-semibold text-gray-900">{herb.effectiveness}{t('herb.detail.effective')}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                    <span className="text-gray-600">{t('herb.detail.traditional_use')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={isBookmarked ? 'primary' : 'outline'}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="flex items-center"
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'mr-2' : ''}`} />
                  {isBookmarked ? t('herb.detail.saved') : t('herb.detail.save')}
                </Button>
                <Button variant="ghost">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 border-b border-emerald-100">
              {['description', 'uses', 'preparation', 'safety', 'research'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {t(`herb.tab.${tab}`)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {herb.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center p-4 bg-white border border-emerald-100 rounded-xl">
                        <benefit.icon className={`h-8 w-8 ${benefit.color} mr-4`} />
                        <div>
                          <h4 className="font-semibold text-gray-900">{benefit.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{t('herb.benefit.traditional')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'uses' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">{t('herb.uses.title')}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {herb.uses.map((use, index) => (
                      <div key={index} className="p-4 bg-emerald-50 rounded-xl">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                          <h4 className="font-semibold text-gray-900">{use}</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t('herb.uses.description')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preparation' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900">{t('herb.preparation.title')}</h3>
                  <div className="space-y-4">
                    {preparationMethods.map((method) => (
                      <div key={method.id} className="border border-emerald-100 rounded-xl overflow-hidden">
                        <div className="p-4 bg-emerald-50 flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-900">{method.title}</h4>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                {t('herb.preparation.duration')}: {method.duration}
                              </span>
                              <span className="text-sm text-gray-600">{t('herb.preparation.difficulty')}: {method.difficulty}</span>
                              {method.traditional && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                                  {t('herb.preparation.traditional')}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedPreparation(method)
                              setShowPreparationModal(true)
                            }}
                          >
                            {t('herb.preparation.view_steps')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Safety Card */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-amber-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-900">{t('herb.safety.title')}</h3>
            </div>
            
            <div className="space-y-3">
              {safetyInfo.map((info, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                    info.level === 'safe' ? 'bg-emerald-500' :
                    info.level === 'warning' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`}></div>
                  <p className="text-sm text-gray-700">{info.text}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              {t('herb.safety.read')}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('herb.actions.title')}</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full">
                <Heart className="h-5 w-5 mr-2" />
                {t('herb.actions.recommendations')}
              </Button>
              <Button variant="outline" className="w-full">
                <BookOpen className="h-5 w-5 mr-2" />
                {t('herb.actions.research')}
              </Button>
              <Button variant="ghost" className="w-full">
                <ExternalLink className="h-5 w-5 mr-2" />
                {t('herb.actions.share')}
              </Button>
            </div>
          </div>

          {/* Herb Properties */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('herb.properties.title')}</h3>
            <div className="space-y-4">
              {[
                { label: t('herb.properties.category'), value: herb.category },
                { label: t('herb.properties.part_used'), value: t('herb.properties.parts.leaves_gel') },
                { label: t('herb.properties.harvest'), value: t('herb.properties.harvest.year_round') },
                { label: t('herb.properties.region'), value: t('herb.properties.region.ethiopia') },
                { label: t('herb.properties.conservation'), value: t('herb.properties.conservation.least_concern') },
              ].map((prop) => (
                <div key={prop.label} className="flex justify-between items-center py-2 border-b border-emerald-50">
                  <span className="text-sm text-gray-600">{prop.label}</span>
                  <span className="text-sm font-medium text-gray-900">{prop.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preparation Modal */}
      <Modal
        isOpen={showPreparationModal}
        onClose={() => setShowPreparationModal(false)}
        title={selectedPreparation?.title}
        size="lg"
      >
        {selectedPreparation && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {t('herb.preparation.duration')}: {selectedPreparation.duration}
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                {selectedPreparation.difficulty}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">{t('herb.modal.steps')}:</h4>
              <ol className="space-y-3">
                {selectedPreparation.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-6 border-t border-emerald-100">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-amber-800 mb-1">{t('herb.modal.important_note')}</h5>
                    <p className="text-sm text-amber-700">
                      {t('herb.modal.note_text')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default HerbDetail