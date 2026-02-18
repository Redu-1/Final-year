// src/components/recommendations/SkinConditionSelector.jsx
import { useState } from 'react'
import { 
  Droplets, Flame, Zap, Shield, 
  Heart, Star, AlertCircle, Check
} from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const SkinConditionSelector = ({ onSelectionChange }) => {
  const [selectedConditions, setSelectedConditions] = useState([])
  const [severity, setSeverity] = useState({})
  const { t } = useTranslation()

  const skinConditions = [
    {
      id: 'dryness',
      name: t('skin.condition.dryness'),
      icon: Droplets,
      description: t('skin.desc.dryness'),
      color: 'from-blue-400 to-cyan-400',
      subConditions: [
        { id: 'mild-dryness', label: t('skin.sub.mild_dryness'), severity: 1 },
        { id: 'moderate-dryness', label: t('skin.sub.moderate_dryness'), severity: 2 },
        { id: 'severe-dryness', label: t('skin.sub.severe_dryness'), severity: 3 },
      ]
    },
    {
      id: 'inflammation',
      name: t('skin.condition.inflammation'),
      icon: Flame,
      description: t('skin.desc.inflammation'),
      color: 'from-orange-400 to-red-400',
      subConditions: [
        { id: 'mild-inflammation', label: t('skin.sub.mild_inflammation'), severity: 1 },
        { id: 'moderate-inflammation', label: t('skin.sub.moderate_inflammation'), severity: 2 },
        { id: 'severe-inflammation', label: t('skin.sub.severe_inflammation'), severity: 3 },
      ]
    },
    {
      id: 'acne',
      name: t('skin.condition.acne'),
      icon: Zap,
      description: t('skin.desc.acne'),
      color: 'from-purple-400 to-pink-400',
      subConditions: [
        { id: 'mild-acne', label: t('skin.sub.mild_acne'), severity: 1 },
        { id: 'moderate-acne', label: t('skin.sub.moderate_acne'), severity: 2 },
        { id: 'severe-acne', label: t('skin.sub.severe_acne'), severity: 3 },
      ]
    },
    {
      id: 'eczema',
      name: t('skin.condition.eczema'),
      icon: Shield,
      description: t('skin.desc.eczema'),
      color: 'from-emerald-400 to-green-400',
      subConditions: [
        { id: 'mild-eczema', label: t('skin.sub.mild_eczema'), severity: 1 },
        { id: 'moderate-eczema', label: t('skin.sub.moderate_eczema'), severity: 2 },
        { id: 'severe-eczema', label: t('skin.sub.severe_eczema'), severity: 3 },
      ]
    },
    {
      id: 'sunburn',
      name: t('skin.condition.sunburn'),
      icon: Flame,
      description: t('skin.desc.sunburn'),
      color: 'from-red-400 to-orange-400',
      subConditions: [
        { id: 'mild-sunburn', label: t('skin.sub.mild_sunburn'), severity: 1 },
        { id: 'moderate-sunburn', label: t('skin.sub.moderate_sunburn'), severity: 2 },
        { id: 'severe-sunburn', label: t('skin.sub.severe_sunburn'), severity: 3 },
      ]
    },
    {
      id: 'dark-spots',
      name: t('skin.condition.dark_spots'),
      icon: Star,
      description: t('skin.desc.dark_spots'),
      color: 'from-amber-400 to-yellow-400',
      subConditions: [
        { id: 'mild-dark-spots', label: t('skin.sub.mild_dark_spots'), severity: 1 },
        { id: 'moderate-dark-spots', label: t('skin.sub.moderate_dark_spots'), severity: 2 },
        { id: 'severe-dark-spots', label: t('skin.sub.severe_dark_spots'), severity: 3 },
      ]
    },
    {
      id: 'fine-lines',
      name: t('skin.condition.fine_lines'),
      icon: Heart,
      description: t('skin.desc.fine_lines'),
      color: 'from-rose-400 to-pink-400',
      subConditions: [
        { id: 'mild-lines', label: t('skin.sub.mild_fine_lines'), severity: 1 },
        { id: 'moderate-lines', label: t('skin.sub.moderate_fine_lines'), severity: 2 },
        { id: 'severe-lines', label: t('skin.sub.severe_fine_lines'), severity: 3 },
      ]
    },
    {
      id: 'minor-wounds',
      name: t('skin.condition.minor_wounds'),
      icon: AlertCircle,
      description: t('skin.desc.minor_wounds'),
      color: 'from-gray-400 to-blue-400',
      subConditions: [
        { id: 'mild-wounds', label: t('skin.sub.mild_minor_wounds'), severity: 1 },
        { id: 'moderate-wounds', label: t('skin.sub.moderate_minor_wounds'), severity: 2 },
        { id: 'severe-wounds', label: t('skin.sub.severe_minor_wounds'), severity: 3 },
      ]
    },
  ]

  const handleConditionToggle = (conditionId) => {
    const newConditions = selectedConditions.includes(conditionId)
      ? selectedConditions.filter(id => id !== conditionId)
      : [...selectedConditions, conditionId]
    
    setSelectedConditions(newConditions)
    
    // Clear severity for deselected conditions
    const newSeverity = { ...severity }
    if (!newConditions.includes(conditionId)) {
      delete newSeverity[conditionId]
      setSeverity(newSeverity)
    }
    
    onSelectionChange(newConditions, newSeverity)
  }

  const handleSeverityChange = (conditionId, severityLevel) => {
    const newSeverity = {
      ...severity,
      [conditionId]: severityLevel
    }
    setSeverity(newSeverity)
    onSelectionChange(selectedConditions, newSeverity)
  }

  const getSeverityLabel = (level) => {
    switch(level) {
      case 1: return { label: t('skin.severity.mild'), color: 'bg-emerald-100 text-emerald-700' }
      case 2: return { label: t('skin.severity.moderate'), color: 'bg-amber-100 text-amber-700' }
      case 3: return { label: t('skin.severity.severe'), color: 'bg-red-100 text-red-700' }
      default: return { label: t('skin.severity.select'), color: 'bg-gray-100 text-gray-700' }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('skin.header.title')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('skin.header.subtitle')}
        </p>
      </div>

      {/* Conditions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skinConditions.map((condition) => {
          const isSelected = selectedConditions.includes(condition.id)
          const conditionSeverity = severity[condition.id]
          const severityInfo = getSeverityLabel(conditionSeverity)

          return (
            <div
              key={condition.id}
              className={`group relative cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-[1.02]' : ''
              }`}
            >
              {/* Glow Effect for Selected */}
              {isSelected && (
                <div className="absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-20"></div>
              )}

              {/* Condition Card */}
              <div
                onClick={() => handleConditionToggle(condition.id)}
                className={`relative rounded-2xl border-2 p-5 transition-all duration-300 ${
                  isSelected
                    ? 'border-emerald-300 bg-white shadow-lg'
                    : 'border-gray-200 bg-white hover:border-emerald-200 hover:shadow-md'
                }`}
              >
                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="h-4 w-4 text-white" />}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${condition.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <condition.icon className="h-7 w-7 text-white" />
                </div>

                {/* Name & Description */}
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {condition.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {condition.description}
                </p>

                {/* Severity Selector (Shows when selected) */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">{t('skin.severity.label')}</span>
                      {conditionSeverity && (
                        <span className={`px-2 py-1 text-xs font-bold rounded ${severityInfo.color}`}>
                          {severityInfo.label}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {[1, 2, 3].map((level) => {
                        const label = level === 1 ? t('skin.severity.mild') : 
                                     level === 2 ? t('skin.severity.moderate') : 
                                     t('skin.severity.severe')
                        return (
                          <button
                            key={level}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSeverityChange(condition.id, level)
                            }}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                              conditionSeverity === level
                                ? level === 1 ? 'bg-emerald-500 text-white' :
                                  level === 2 ? 'bg-amber-500 text-white' :
                                  'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Conditions Summary */}
      {selectedConditions.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl border border-emerald-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">
              {t('skin.summary.title', { count: selectedConditions.length })}
            </h3>
            <button
              onClick={() => {
                setSelectedConditions([])
                setSeverity({})
                onSelectionChange([], {})
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t('skin.summary.clear')}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {selectedConditions.map(conditionId => {
              const condition = skinConditions.find(c => c.id === conditionId)
              const conditionSeverity = severity[conditionId]
              const severityInfo = getSeverityLabel(conditionSeverity)
              
              return (
                <div
                  key={conditionId}
                  className="flex items-center px-4 py-3 bg-white border border-emerald-200 rounded-xl"
                >
                  <condition.icon className="h-5 w-5 text-emerald-500 mr-3" />
                  <div>
                    <span className="font-medium text-gray-900">{condition.name}</span>
                    {conditionSeverity && (
                      <span className={`ml-3 px-2 py-1 text-xs font-bold rounded ${severityInfo.color}`}>
                        {severityInfo.label}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleConditionToggle(conditionId)
                    }}
                    className="ml-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">{t('skin.tips.title')}</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3"></div>
                <span>{t('skin.tips.tip1')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3"></div>
                <span>{t('skin.tips.tip2')}</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3"></div>
                <span>{t('skin.tips.tip3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkinConditionSelector