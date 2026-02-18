// src/components/about/CommitmentSection.jsx
import { useState } from 'react'
import { 
  Shield, Users, Target, CheckCircle, 
  Heart, Globe, Award, BookOpen,
  ChevronRight, ExternalLink, Star,
  MessageSquare, HandHeart, Leaf
} from 'lucide-react'
import Button from '../common/Button'

const CommitmentSection = () => {
  const [activePrinciple, setActivePrinciple] = useState(0)

  const principles = [
    {
      icon: Shield,
      title: 'Accuracy & Scientific Rigor',
      description: 'Every piece of information is verified through scientific research and traditional healer validation.',
      color: 'from-blue-500 to-cyan-500',
      commitments: [
        'WHO traditional medicine standards',
        'Peer-reviewed research validation',
        'Traditional healer verification',
        'Regular data updates',
      ]
    },
    {
      icon: Users,
      title: 'Cultural Respect & Collaboration',
      description: 'Working directly with Ethiopian communities to ensure respectful representation of traditional knowledge.',
      color: 'from-emerald-500 to-green-500',
      commitments: [
        'Community partnership programs',
        'Traditional healer compensation',
        'Cultural protocol adherence',
        'Local language support',
      ]
    },
    {
      icon: Target,
      title: 'Accessibility & Empowerment',
      description: 'Making traditional knowledge accessible to everyone while preserving its cultural integrity.',
      color: 'from-amber-500 to-orange-500',
      commitments: [
        'Multilingual platform',
        'Offline access features',
        'Free educational resources',
        'Mobile optimization',
      ]
    },
    {
      icon: Heart,
      title: 'Sustainability & Conservation',
      description: 'Promoting sustainable harvesting practices and supporting biodiversity conservation efforts.',
      color: 'from-rose-500 to-pink-500',
      commitments: [
        'Sustainable harvesting guidelines',
        'Biodiversity protection',
        'Community conservation projects',
        'Eco-friendly practices',
      ]
    },
  ]

  const communityPartners = [
    {
      name: 'Traditional Healers Association',
      logo: '👨‍⚕️',
      description: 'Over 500 registered traditional healers',
      region: 'Nationwide',
      verified: true,
    },
    {
      name: 'Ethiopian Biodiversity Institute',
      logo: '🌱',
      description: 'Scientific research partnership',
      region: 'Addis Ababa',
      verified: true,
    },
    {
      name: 'Ministry of Health',
      logo: '🏛️',
      description: 'Traditional medicine integration',
      region: 'Government',
      verified: true,
    },
    {
      name: 'Local Universities',
      logo: '🎓',
      description: 'Research and documentation',
      region: 'Multiple regions',
      verified: true,
    },
  ]

  const verificationProcess = [
    {
      step: 1,
      title: 'Traditional Healer Interview',
      description: 'Direct consultation with experienced traditional healers',
      icon: '🗣️',
      duration: '2-4 weeks',
    },
    {
      step: 2,
      title: 'Scientific Literature Review',
      description: 'Analysis of peer-reviewed research and studies',
      icon: '📚',
      duration: '3-5 weeks',
    },
    {
      step: 3,
      title: 'Field Verification',
      description: 'On-site plant identification and preparation validation',
      icon: '🌿',
      duration: '1-2 weeks',
    },
    {
      step: 4,
      title: 'Community Feedback',
      description: 'Review by local community members and users',
      icon: '👥',
      duration: '2-3 weeks',
    },
    {
      step: 5,
      title: 'Platform Integration',
      description: 'Final verification and platform publication',
      icon: '✅',
      duration: '1 week',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Our Commitment
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Commitment:{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Accuracy, Respect, and Community
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            HerbiSense operates on principles of scientific rigor, cultural respect, and community collaboration. 
            We work closely with ethnobotanists and traditional healers to ensure accuracy while fostering a community 
            that values natural, sustainable health practices.
          </p>
        </div>

        {/* Guiding Principles */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Principles Navigation */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Our Guiding Principles
            </h3>
            
            {principles.map((principle, index) => {
              const Icon = principle.icon
              
              return (
                <button
                  key={index}
                  onClick={() => setActivePrinciple(index)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                    activePrinciple === index
                      ? 'border-emerald-300 bg-white shadow-lg'
                      : 'border-emerald-100 hover:border-emerald-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${principle.color} flex items-center justify-center mr-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{principle.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{principle.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Principle Details */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${principles[activePrinciple].color} flex items-center justify-center mr-4`}>
                {(() => {
                  const Icon = principles[activePrinciple].icon
                  return <Icon className="h-8 w-8 text-white" />
                })()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {principles[activePrinciple].title}
                </h3>
                <p className="text-emerald-600 font-medium">
                  Core Commitment Area
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900">Key Commitments:</h4>
              {principles[activePrinciple].commitments.map((commitment, index) => (
                <div key={index} className="flex items-center p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{commitment}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-emerald-100">
              <Button variant="primary" className="w-full group">
                Learn More About This Principle
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Verification Process */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Verification Process
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every piece of information on HerbiSense undergoes a rigorous 5-step verification process
            </p>
          </div>

          <div className="relative">
            {/* Process Line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-emerald-200 to-emerald-300 -translate-y-1/2 hidden md:block"></div>
            
            {/* Process Steps */}
            <div className="grid md:grid-cols-5 gap-4 relative z-10">
              {verificationProcess.map((step, index) => (
                <div
                  key={step.step}
                  className="group relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center z-20">
                    {step.step}
                  </div>
                  
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:border-emerald-300">
                    <div className="text-3xl mb-4">{step.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                    <div className="flex items-center text-emerald-600 text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                      {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Partners */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Our Community Partners
              </h3>
              <p className="text-gray-600">
                Collaborating with organizations across Ethiopia to preserve herbal knowledge
              </p>
            </div>
            
            <Button variant="outline" className="group">
              View All Partners
              <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityPartners.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-emerald-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{partner.logo}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{partner.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="h-4 w-4 mr-1" />
                      {partner.region}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{partner.description}</p>
                
                {partner.verified && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-emerald-500 mr-2" />
                    <span className="text-sm font-medium text-emerald-600">Verified Partner</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Join Community */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 border-4 border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6">
                  <HandHeart className="h-4 w-4 mr-2" />
                  Join Our Community
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-6">
                  Be Part of Something{' '}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    Meaningful
                  </span>
                </h3>
                
                <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
                  Join thousands of traditional healers, researchers, and wellness enthusiasts 
                  who are preserving Ethiopian herbal knowledge for future generations.
                </p>
                
                <div className="space-y-4">
                  {[
                    'Contribute traditional knowledge',
                    'Participate in research studies',
                    'Join community discussions',
                    'Access exclusive resources',
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <Star className="h-5 w-5 text-amber-300 mr-3" />
                      <span className="text-white font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button variant="secondary" className="!bg-white !text-emerald-700 group">
                    Join Community
                    <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button variant="outline" className="!border-white !text-white group">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Contact Us
                  </Button>
                </div>
              </div>
              
              {/* Community Stats */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '5,000+', label: 'Community Members', icon: Users, color: 'bg-blue-500' },
                  { value: '500+', label: 'Traditional Healers', icon: BookOpen, color: 'bg-emerald-500' },
                  { value: '100+', label: 'Research Papers', icon: Award, color: 'bg-amber-500' },
                  { value: '50+', label: 'Partner Organizations', icon: Globe, color: 'bg-purple-500' },
                ].map((stat, index) => {
                  const Icon = stat.icon
                  
                  return (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mr-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{stat.value}</div>
                          <div className="text-emerald-100 text-sm">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Final Commitment */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center">
            <Leaf className="h-16 w-16 text-emerald-500 mb-6" />
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              Committed to Preserving Ethiopian Herbal Heritage
            </h4>
            <p className="text-gray-600 max-w-2xl mb-8">
              Through accuracy, respect, and community collaboration, we're ensuring that traditional 
              Ethiopian herbal wisdom continues to thrive in the modern world.
            </p>
            <Button variant="primary" size="lg" className="group">
              Support Our Mission
              <Heart className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommitmentSection