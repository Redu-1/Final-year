// src/components/about/MissionSection.jsx
import { useState } from 'react'
import { Target, Eye, Heart, Users, ArrowRight, Play, Sparkles } from 'lucide-react'
import Button from '../common/Button'

const MissionSection = () => {
  const [activeTab, setActiveTab] = useState('mission')

  const tabs = [
    { id: 'mission', label: 'Our Mission', icon: Target },
    { id: 'vision', label: 'Our Vision', icon: Eye },
    { id: 'values', label: 'Our Values', icon: Heart },
  ]

  const content = {
    mission: {
      title: 'Empowering Health, Preserving Heritage',
      description: 'We are committed to meticulously documenting traditional Ethiopian herbal practices, ensuring their authenticity and scientific relevance. Our mission extends to empowering individuals with knowledge for natural skincare solutions, while actively contributing to the preservation of Ethiopia\'s rich botanical and cultural heritage for future generations.',
      points: [
        'Digitally preserve Ethiopian herbal knowledge',
        'Bridge traditional wisdom with modern science',
        'Empower communities with accessible information',
        'Support sustainable herbal practices',
      ],
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0',
    },
    vision: {
      title: 'Shaping the Future of Herbal Knowledge',
      description: 'As we continue to grow, HerbiSense aims to expand its database, incorporate more interactive features, and build stronger bridges between ancient knowledge and modern research. We envision a future where traditional wisdom and modern science converge for global well-being.',
      points: [
        'Global recognition of Ethiopian herbal medicine',
        'Integration with modern healthcare systems',
        'AI-powered personalized recommendations',
        'Community-driven knowledge sharing',
      ],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
    },
    values: {
      title: 'Our Guiding Principles',
      description: 'HerbiSense operates on principles of scientific rigor, cultural respect, and community collaboration. We work closely with ethnobotanists and traditional healers to ensure accuracy while fostering a community that values natural, sustainable health practices.',
      points: [
        'Cultural respect and authenticity',
        'Scientific validation and accuracy',
        'Community collaboration',
        'Sustainability and conservation',
      ],
      image: 'https://images.unsplash.com/photo-1553531384-397c80973a0b',
    },
  }

  const stats = [
    { value: '100+', label: 'Herbs Documented', icon: '🌿' },
    { value: '50+', label: 'Traditional Healers', icon: '👨‍⚕️' },
    { value: '10K+', label: 'Users Empowered', icon: '👥' },
    { value: '98%', label: 'Accuracy Rate', icon: '🎯' },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            About HerbiSense
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Discover HerbiSense:{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Bridging Ancient Wisdom
            </span>
            <br />
            <span className="text-3xl md:text-4xl font-semibold text-gray-700">
              with Modern Wellness
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A dedicated platform to explore, preserve, and share the profound knowledge of Indigenous Ethiopian herbal remedies, particularly for skincare.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-2xl border border-emerald-100 p-2 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {content[activeTab].title}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {content[activeTab].description}
              </p>
            </div>

            {/* Points */}
            <div className="space-y-4">
              {content[activeTab].points.map((point, index) => (
                <div key={index} className="flex items-start group">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-emerald-700 transition-colors">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button variant="primary" className="group">
                Join Our Mission
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="group">
                <Play className="h-5 w-5 mr-2" />
                Watch Our Story
              </Button>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={content[activeTab].image}
                alt={content[activeTab].title}
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                  <Target className="h-4 w-4 mr-2" />
                  HerbiSense Initiative
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Preserving Ethiopian Heritage
                </h3>
                <p className="text-emerald-100">
                  Traditional knowledge meets modern technology
                </p>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-6 w-64">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-700">10K+</div>
                  <div className="text-sm text-gray-600">Community Members</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Join our growing community preserving Ethiopian herbal wisdom
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 border-4 border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Our Impact in Numbers
              </h3>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Measuring our contribution to preserving and sharing Ethiopian herbal knowledge
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-colors group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-emerald-100 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionSection