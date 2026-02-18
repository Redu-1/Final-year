// src/components/about/LegacySection.jsx
import { useState } from 'react'
import { 
  History, Globe, Leaf, BookOpen, 
  Users, Award, Calendar, MapPin,
  ChevronLeft, ChevronRight, Play
} from 'lucide-react'

const LegacySection = () => {
  const [activeTimeline, setActiveTimeline] = useState(0)

  const heritageHighlights = [
    {
      icon: History,
      title: 'Centuries of Tradition',
      description: 'Traditional Ethiopian medicine dates back over 3,000 years',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Globe,
      title: 'Unique Biodiversity',
      description: 'Ethiopia hosts 6,000+ plant species, many with medicinal value',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: Users,
      title: 'Community Knowledge',
      description: 'Knowledge passed through generations of traditional healers',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BookOpen,
      title: 'Documented Wisdom',
      description: 'Ancient texts and oral traditions preserve herbal knowledge',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const timeline = [
    {
      year: 'Ancient Times',
      title: 'Origins of Traditional Medicine',
      description: 'Ethiopian herbal medicine begins with indigenous healing practices',
      icon: '🌿',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      year: '4th Century',
      title: 'Axumite Kingdom Records',
      description: 'First written records of herbal remedies in Ethiopian history',
      icon: '📜',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      year: '13th Century',
      title: 'Traditional Healer Guilds',
      description: 'Formation of organized traditional healer communities',
      icon: '👨‍⚕️',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      year: '19th Century',
      title: 'European Documentation',
      description: 'First European studies of Ethiopian medicinal plants',
      icon: '🔬',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      year: '21st Century',
      title: 'Digital Preservation',
      description: 'HerbiSense leads digital documentation efforts',
      icon: '💻',
      color: 'bg-emerald-100 text-emerald-700',
    },
  ]

  const traditionalPractices = [
    {
      name: 'Zar Healing',
      region: 'Across Ethiopia',
      description: 'Spiritual healing rituals incorporating herbal remedies',
      icon: '🌀',
      color: 'from-purple-400 to-pink-400',
    },
    {
      name: 'Wogesha',
      region: 'Amhara Region',
      description: 'Traditional bone setting with herbal compresses',
      icon: '🦴',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      name: 'Merkato Market',
      region: 'Addis Ababa',
      description: 'Africa\'s largest open-air market for medicinal herbs',
      icon: '🏪',
      color: 'from-amber-400 to-orange-400',
    },
    {
      name: 'Yederg ምርት',
      region: 'Oromia Region',
      description: 'Traditional herbal remedy preparation methods',
      icon: '⚗️',
      color: 'from-emerald-400 to-green-400',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 text-sm font-semibold mb-6">
            <History className="h-4 w-4 mr-2" />
            Cultural Heritage
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            The Enduring Legacy of{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Ethiopian Herbal Traditions
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ethiopia boasts a unique biodiversity and a deep-rooted history of traditional medicine. 
            For centuries, indigenous communities have relied on local flora for healing, passing down 
            invaluable knowledge through generations.
          </p>
        </div>

        {/* Heritage Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {heritageHighlights.map((highlight, index) => {
            const Icon = highlight.icon
            
            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                
                {/* Card */}
                <div className="relative bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:border-emerald-200">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${highlight.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {highlight.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Historical Timeline */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Historical Timeline
              </h3>
              <p className="text-gray-600">
                Journey through the evolution of Ethiopian herbal medicine
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTimeline(Math.max(0, activeTimeline - 1))}
                disabled={activeTimeline === 0}
                className="p-3 rounded-xl bg-emerald-50 text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTimeline(Math.min(timeline.length - 1, activeTimeline + 1))}
                disabled={activeTimeline === timeline.length - 1}
                className="p-3 rounded-xl bg-emerald-50 text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Timeline Visualization */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-emerald-200 to-emerald-300 -translate-y-1/2 hidden md:block"></div>
            
            {/* Timeline Items */}
            <div className="flex overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-5 gap-4 scrollbar-hide">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-64 md:w-auto md:relative"
                  onClick={() => setActiveTimeline(index)}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-1/2 top-1/2 w-4 h-4 rounded-full border-4 border-white transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block ${
                    index <= activeTimeline ? 'bg-emerald-500' : 'bg-emerald-300'
                  }`}></div>
                  
                  {/* Timeline Card */}
                  <div className={`md:absolute md:w-64 md:transform md:-translate-x-1/2 ${
                    index % 2 === 0 ? 'md:-top-24' : 'md:top-24'
                  }`}>
                    <div
                      className={`rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                        index === activeTimeline
                          ? 'border-emerald-300 bg-white shadow-xl scale-105'
                          : 'border-emerald-100 bg-white/80 hover:border-emerald-200 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="text-2xl mr-3">{item.icon}</div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${item.color}`}>
                          {item.year}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traditional Practices */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Traditional Healing Practices
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the diverse traditional healing methods practiced across Ethiopia's regions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditionalPractices.map((practice, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                
                <div className="relative bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  {/* Header */}
                  <div className={`h-32 bg-gradient-to-r ${practice.color} p-6 relative`}>
                    <div className="text-4xl mb-3">{practice.icon}</div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="font-bold text-white text-lg">{practice.name}</h4>
                      <div className="flex items-center text-emerald-100 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {practice.region}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{practice.description}</p>
                    <div className="flex items-center text-emerald-600 text-sm font-medium group-hover:text-emerald-700">
                      <Play className="h-4 w-4 mr-2" />
                      Learn about this practice
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Significance */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl border border-amber-200 p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-amber-500/10 backdrop-blur-sm rounded-full text-amber-700 text-sm font-semibold mb-6">
                <Award className="h-4 w-4 mr-2" />
                Cultural Significance
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                More Than Medicine:{' '}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  A Way of Life
                </span>
              </h3>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Ethiopian herbal medicine is deeply intertwined with culture, spirituality, and community life. 
                It represents not just a healthcare system, but a holistic approach to wellness that has sustained 
                communities for generations.
              </p>
              
              <div className="space-y-4">
                {[
                  'Integrated with spiritual and religious practices',
                  'Community-based knowledge sharing',
                  'Seasonal harvesting rituals',
                  'Intergenerational knowledge transfer',
                  'Celebratory and ceremonial uses',
                ].map((point, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cultural Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1553531384-397c80973a0b"
                  alt="Ethiopian cultural heritage"
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
              
              {/* Overlay Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl border border-amber-100 p-6 w-64">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-amber-600 mr-3" />
                  <div>
                    <div className="text-xl font-bold text-gray-900">3,000+ Years</div>
                    <div className="text-sm text-gray-600">Of Traditional Practice</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Continuous preservation of herbal knowledge through generations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LegacySection