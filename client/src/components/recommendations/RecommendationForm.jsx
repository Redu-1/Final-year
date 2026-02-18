// src/components/recommendations/RecommendationForm.jsx
import { useState } from 'react'
import { 
  User, Calendar, MapPin, Droplets, 
  AlertCircle, Heart, ChevronRight, Loader2 
} from 'lucide-react'
import SkinConditionSelector from './SkinConditionSelector'
import Button from '../common/Button'
import { useTranslation } from '../../hooks/useTranslation'

const RecommendationForm = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1)
  const [selectedConditions, setSelectedConditions] = useState([])
  const [severity, setSeverity] = useState({})
  const [formData, setFormData] = useState({
    age: '',
    skinType: '',
    location: '',
    allergies: '',
    previousTreatments: '',
    goals: []
  })
  const { t } = useTranslation()

  const skinTypes = [
    { id: 'normal', label: t('rec.form.skin_type.normal'), description: t('rec.form.skin_type.normal_desc') },
    { id: 'dry', label: t('rec.form.skin_type.dry'), description: t('rec.form.skin_type.dry_desc') },
    { id: 'oily', label: t('rec.form.skin_type.oily'), description: t('rec.form.skin_type.oily_desc') },
    { id: 'combination', label: t('rec.form.skin_type.combination'), description: t('rec.form.skin_type.combination_desc') },
    { id: 'sensitive', label: t('rec.form.skin_type.sensitive'), description: t('rec.form.skin_type.sensitive_desc') },
  ]

  const goals = [
    { id: 'healing', label: t('rec.form.goals.healing'), icon: Heart },
    { id: 'moisture', label: t('rec.form.goals.moisture'), icon: Droplets },
    { id: 'prevention', label: t('rec.form.goals.prevention'), icon: AlertCircle },
    { id: 'beauty', label: t('rec.form.goals.beauty'), icon: '✨' },
  ]

  const handleStepChange = (newStep) => {
    if (newStep >= 1 && newStep <= 3) {
      setStep(newStep)
    }
  }

  const handleConditionSelection = (conditions, severityLevels) => {
    setSelectedConditions(conditions)
    setSeverity(severityLevels)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGoalToggle = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }))
  }

  const handleSubmit = () => {
    const recommendationData = {
      conditions: selectedConditions.map(conditionId => ({
        condition: conditionId,
        severity: severity[conditionId] || 1
      })),
      profile: formData,
      timestamp: new Date().toISOString()
    }
    
    onSubmit(recommendationData)
  }

  const calculateProgress = () => {
    switch(step) {
      case 1: return 33
      case 2: return 66
      case 3: return 100
      default: return 0
    }
  }

  const isStep1Complete = selectedConditions.length > 0
  const isStep2Complete = formData.age && formData.skinType && formData.goals.length > 0
  const canSubmit = isStep1Complete && isStep2Complete

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-700">
            {t('rec.form.step', { current: step, total: 3 })}
          </div>
          <div className="text-sm text-emerald-600 font-medium">
            {t('rec.form.complete', { progress: calculateProgress() })}
          </div>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2">
          <div className={`text-sm ${step >= 1 ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
            {t('rec.form.step1')}
          </div>
          <div className={`text-sm ${step >= 2 ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
            {t('rec.form.step2')}
          </div>
          <div className={`text-sm ${step >= 3 ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
            {t('rec.form.step3')}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-xl p-8">
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('rec.form.step1.title')}
              </h2>
              <p className="text-gray-600">
                {t('rec.form.step1.subtitle')}
              </p>
            </div>
            
            <SkinConditionSelector onSelectionChange={handleConditionSelection} />
            
            <div className="pt-8 border-t border-gray-100">
              <Button
                onClick={() => handleStepChange(2)}
                disabled={!isStep1Complete}
                className="w-full group"
                size="lg"
              >
                {t('rec.form.step1.continue')}
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {!isStep1Complete && (
                <p className="text-sm text-red-500 text-center mt-3">
                  {t('rec.form.step1.error')}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('rec.form.step2.title')}
              </h2>
              <p className="text-gray-600">
                {t('rec.form.step2.subtitle')}
              </p>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-2 text-emerald-500" />
                  {t('rec.form.age.label')}
                </label>
                <select
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="">{t('rec.form.age.placeholder')}</option>
                  <option value="teen">{t('rec.form.age.teen')}</option>
                  <option value="young-adult">{t('rec.form.age.young_adult')}</option>
                  <option value="adult">{t('rec.form.age.adult')}</option>
                  <option value="senior">{t('rec.form.age.senior')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-2 text-emerald-500" />
                  {t('rec.form.location.label')}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder={t('rec.form.location.placeholder')}
                  className="w-full px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Skin Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                {t('rec.form.skin_type.label')}
              </label>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                {skinTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('skinType', type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.skinType === type.id
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-200'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{type.label}</div>
                    <div className="text-xs text-gray-600">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                {t('rec.form.goals.label')}
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {goals.map((goal) => {
                  const isSelected = formData.goals.includes(goal.id)
                  const IconComponent = goal.icon
                  
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {typeof goal.icon === 'string' ? (
                          <span className="text-xl">{goal.icon}</span>
                        ) : (
                          <IconComponent className="h-6 w-6" />
                        )}
                      </div>
                      <div className="font-medium text-gray-900">{goal.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="inline h-4 w-4 mr-2 text-amber-500" />
                  {t('rec.form.allergies.label')}
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder={t('rec.form.allergies.placeholder')}
                  rows="2"
                  className="w-full px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2 text-blue-500" />
                  {t('rec.form.previous.label')}
                </label>
                <textarea
                  value={formData.previousTreatments}
                  onChange={(e) => handleInputChange('previousTreatments', e.target.value)}
                  placeholder={t('rec.form.previous.placeholder')}
                  rows="2"
                  className="w-full px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="pt-8 border-t border-gray-100 flex justify-between">
              <Button
                onClick={() => handleStepChange(1)}
                variant="outline"
              >
                {t('rec.form.back')}
              </Button>
              
              <Button
                onClick={() => handleStepChange(3)}
                disabled={!isStep2Complete}
                className="group"
              >
                {t('rec.form.next')}
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-emerald-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('rec.form.step3.title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('rec.form.step3.subtitle')}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl border border-emerald-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t('rec.form.step3.summary')}</h3>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{t('rec.form.step3.skin_conditions')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedConditions.slice(0, 3).map(conditionId => {
                      const condition = skinTypes.find(c => c.id === conditionId) || { label: conditionId }
                      return (
                        <span key={conditionId} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                          {condition.label}
                        </span>
                      )
                    })}
                    {selectedConditions.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{selectedConditions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{t('rec.form.step3.skin_type')}</h4>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full inline-block">
                    {skinTypes.find(t => t.id === formData.skinType)?.label || t('rec.form.step3.not_specified')}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-gray-100">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-3" />
                  <span className="text-gray-600">{t('rec.form.step3.loading')}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    variant="primary"
                    size="lg"
                    className="w-full group"
                  >
                    {t('rec.form.step3.generate')}
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <Button
                    onClick={() => handleStepChange(1)}
                    variant="ghost"
                    className="w-full"
                  >
                    {t('rec.form.step3.start_over')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          <AlertCircle className="inline h-4 w-4 mr-2" />
          {t('rec.form.privacy')}
        </p>
      </div>
    </div>
  )
}

export default RecommendationForm