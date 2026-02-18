// src/components/home/HowToUse.jsx
import { useState } from 'react'
import { Search, Grid, Book, Heart, Share2 } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'

const HowToUse = () => {
  const [hoveredStep, setHoveredStep] = useState(null)
  const { t } = useTranslation()

  const steps = [
    {
      icon: Search,
      title: t('howto.step1.title'),
      description: t('howto.step1.desc'),
      bgColor: 'bg-blue-500',
      details: [
        t('howto.step1.detail1'),
        t('howto.step1.detail2'),
        t('howto.step1.detail3')
      ]
    },
    {
      icon: Grid,
      title: t('howto.step2.title'),
      description: t('howto.step2.desc'),
      bgColor: 'bg-green-500',
      details: [
        t('howto.step2.detail1'),
        t('howto.step2.detail2'),
        t('howto.step2.detail3')
      ]
    },
    {
      icon: Book,
      title: t('howto.step3.title'),
      description: t('howto.step3.desc'),
      bgColor: 'bg-orange-500',
      details: [
        t('howto.step3.detail1'),
        t('howto.step3.detail2'),
        t('howto.step3.detail3')
      ]
    },
    {
      icon: Heart,
      title: t('howto.step4.title'),
      description: t('howto.step4.desc'),
      bgColor: 'bg-pink-500',
      details: [
        t('howto.step4.detail1'),
        t('howto.step4.detail2'),
        t('howto.step4.detail3')
      ]
    },
    {
      icon: Share2,
      title: t('howto.step5.title'),
      description: t('howto.step5.desc'),
      bgColor: 'bg-purple-500',
      details: [
        t('howto.step5.detail1'),
        t('howto.step5.detail2'),
        t('howto.step5.detail3')
      ]
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('howto.title')}{' '}
            <span className="text-green-600">HerbiSense</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('howto.subtitle')}
          </p>
        </div>

        {/* Steps Grid - 2 columns */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* First row: Steps 1 & 2 */}
          {steps.slice(0, 2).map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 cursor-default ${
                hoveredStep === index
                  ? 'bg-white shadow-lg border-2 border-green-200 scale-[1.02]'
                  : 'bg-white hover:shadow-md border border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`${step.bgColor} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  hoveredStep === index ? 'scale-110' : ''
                }`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{t('howto.step')} {index + 1}</h3>
                  </div>
                  <p className="font-medium text-gray-800">{step.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  
                  {/* Details show on hover with animation */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    hoveredStep === index ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-3 border-t border-gray-100">
                      {step.details.map((detail, i) => (
                        <p key={i} className="text-sm text-gray-700 mb-1">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Second row: Steps 3 & 4 */}
          {steps.slice(2, 4).map((step, index) => {
            const actualIndex = index + 2
            return (
              <div
                key={actualIndex}
                onMouseEnter={() => setHoveredStep(actualIndex)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 cursor-default ${
                  hoveredStep === actualIndex
                    ? 'bg-white shadow-lg border-2 border-green-200 scale-[1.02]'
                    : 'bg-white hover:shadow-md border border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${step.bgColor} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    hoveredStep === actualIndex ? 'scale-110' : ''
                  }`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">{t('howto.step')} {actualIndex + 1}</h3>
                    </div>
                    <p className="font-medium text-gray-800">{step.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    
                    {/* Details show on hover with animation */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      hoveredStep === actualIndex ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-3 border-t border-gray-100">
                        {step.details.map((detail, i) => (
                          <p key={i} className="text-sm text-gray-700 mb-1">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Third row: Step 5 alone (centered) */}
          <div className="md:col-span-2 flex justify-center">
            <div className="w-full md:w-1/2">
              {steps.slice(4, 5).map((step, index) => {
                const actualIndex = index + 4
                return (
                  <div
                    key={actualIndex}
                    onMouseEnter={() => setHoveredStep(actualIndex)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 cursor-default ${
                      hoveredStep === actualIndex
                        ? 'bg-white shadow-lg border-2 border-green-200 scale-[1.02]'
                        : 'bg-white hover:shadow-md border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${step.bgColor} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        hoveredStep === actualIndex ? 'scale-110' : ''
                      }`}>
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900">{t('howto.step')} {actualIndex + 1}</h3>
                        </div>
                        <p className="font-medium text-gray-800">{step.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        
                        {/* Details show on hover with animation */}
                        <div className={`overflow-hidden transition-all duration-300 ${
                          hoveredStep === actualIndex ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="pt-3 border-t border-gray-100">
                            {step.details.map((detail, i) => (
                              <p key={i} className="text-sm text-gray-700 mb-1">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowToUse