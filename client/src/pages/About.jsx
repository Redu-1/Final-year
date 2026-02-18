// src/pages/About.jsx
import { useEffect, useState } from 'react'
import Layout, { PageWrapper } from '../components/layout/Layout'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { 
  Leaf, Globe, Users, Target, 
  Shield, History, Sparkles, 
  ArrowRight, Heart, BookOpen,
  ChevronRight, Award, Calendar,
  MessageSquare, ExternalLink,
  Search, Database, Brain,
  Handshake, Scale, FlaskConical
} from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const About = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('discover')
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Navigation sections
  const sections = [
    { id: 'discover', label: t('about.nav.discover'), icon: Sparkles },
    { id: 'mission', label: t('about.nav.mission'), icon: Target },
    { id: 'legacy', label: t('about.nav.legacy'), icon: History },
    { id: 'commitment', label: t('about.nav.commitment'), icon: Shield },
    { id: 'future', label: t('about.nav.future'), icon: Globe }
  ]

  // Interactive stats
  const stats = [
    { icon: Leaf, value: '250+', label: t('about.stats.plants'), sublabel: t('about.stats.plants_sub') },
    { icon: Users, value: '100+', label: t('about.stats.healers'), sublabel: t('about.stats.healers_sub') },
    { icon: BookOpen, value: '3000+', label: t('about.stats.years'), sublabel: t('about.stats.years_sub') },
    { icon: Award, value: '98.7%', label: t('about.stats.accuracy'), sublabel: t('about.stats.accuracy_sub') }
  ]

  // Core principles
  const principles = [
    {
      icon: FlaskConical,
      title: t('about.principles.scientific'),
      description: t('about.principles.scientific_desc'),
      color: 'bg-blue-500',
      features: [
        t('about.principles.scientific_feat1'),
        t('about.principles.scientific_feat2'),
        t('about.principles.scientific_feat3')
      ]
    },
    {
      icon: Handshake,
      title: t('about.principles.cultural'),
      description: t('about.principles.cultural_desc'),
      color: 'bg-emerald-500',
      features: [
        t('about.principles.cultural_feat1'),
        t('about.principles.cultural_feat2'),
        t('about.principles.cultural_feat3')
      ]
    },
    {
      icon: Scale,
      title: t('about.principles.balance'),
      description: t('about.principles.balance_desc'),
      color: 'bg-amber-500',
      features: [
        t('about.principles.balance_feat1'),
        t('about.principles.balance_feat2'),
        t('about.principles.balance_feat3')
      ]
    }
  ]

  // Future roadmap
  const roadmap = [
    { phase: t('about.future.phase1'), year: '2024', goal: t('about.future.phase1_goal'), status: 'completed', icon: '✅' },
    { phase: t('about.future.phase2'), year: '2025', goal: t('about.future.phase2_goal'), status: 'current', icon: '📱' },
    { phase: t('about.future.phase3'), year: '2026', goal: t('about.future.phase3_goal'), status: 'upcoming', icon: '🤖' },
    { phase: t('about.future.phase4'), year: '2027', goal: t('about.future.phase4_goal'), status: 'upcoming', icon: '🌍' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <LoadingDots size="lg" />
          </div>
          <p className="text-emerald-600 font-medium">{t('about.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <PageWrapper>
        {/* Fixed Navigation */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 space-x-1 scrollbar-hide">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id)
                      const element = document.getElementById(section.id)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                    className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="font-medium text-sm">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Hero Section - Discover */}
        <section id="discover" className="relative pt-20 pb-28 bg-gradient-to-b from-white to-emerald-50/30">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-amber-100 rounded-full text-emerald-700 text-sm font-semibold mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                {t('about.hero.badge')}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                  {t('about.hero.title1')}
                </span>
                <br />
                <span className="text-3xl md:text-4xl text-gray-700 font-semibold">
                  {t('about.hero.title2')}
                </span>
              </h1>
              
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  {t('about.hero.description1')}
                </p>
                <p className="italic text-gray-500 border-l-4 border-emerald-300 pl-4 py-2">
                  {t('about.hero.description2')}
                </p>
              </div>
            </div>

            {/* Interactive Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl border border-emerald-100 p-6 text-center hover:shadow-xl hover:border-emerald-200 transition-all duration-500 transform hover:-translate-y-1"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 mb-4">
                      <Icon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="font-semibold text-gray-800">{stat.label}</div>
                    <div className="text-sm text-gray-500">{stat.sublabel}</div>
                  </div>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <span className="flex items-center justify-center">
                  {t('about.hero.start')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="group px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300">
                <span className="flex items-center justify-center">
                  {t('about.hero.watch')}
                  <MessageSquare className="ml-2 h-5 w-5" />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-20 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-blue-100 p-8 md:p-12 shadow-lg">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {t('about.mission.title')}
                </h2>
              </div>
              
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  {t('about.mission.description1')}
                </p>
                <p className="text-lg border-l-4 border-blue-200 pl-6 py-3 bg-blue-50/50 rounded-r-lg">
                  {t('about.mission.description2')}
                </p>
              </div>

              {/* Mission Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: Search, title: t('about.mission.research'), desc: t('about.mission.research_desc') },
                  { icon: Database, title: t('about.mission.documentation'), desc: t('about.mission.documentation_desc') },
                  { icon: Users, title: t('about.mission.community'), desc: t('about.mission.community_desc') }
                ].map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                      <Icon className="h-10 w-10 text-blue-500 mb-4" />
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Legacy Section */}
        <section id="legacy" className="py-20 bg-gradient-to-b from-white to-amber-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-700 text-sm font-semibold mb-6">
                <History className="h-4 w-4 mr-2" />
                {t('about.legacy.badge')}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                {t('about.legacy.title')}
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  {t('about.legacy.description1')}
                </p>
                <p className="italic text-gray-500">
                  {t('about.legacy.description2')}
                </p>
                <p>
                  {t('about.legacy.description3')}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-200 to-emerald-200"></div>
              
              <div className="space-y-12">
                {[
                  { year: t('about.timeline.ancient'), event: t('about.timeline.ancient_event'), desc: t('about.timeline.ancient_desc') },
                  { year: t('about.timeline.14th'), event: t('about.timeline.14th_event'), desc: t('about.timeline.14th_desc') },
                  { year: t('about.timeline.19th'), event: t('about.timeline.19th_event'), desc: t('about.timeline.19th_desc') },
                  { year: t('about.timeline.21st'), event: t('about.timeline.21st_event'), desc: t('about.timeline.21st_desc') }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                      <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-sm font-semibold text-amber-600 mb-2">{item.year}</div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{item.event}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 border-4 border-white shadow-lg"></div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section id="commitment" className="py-20 bg-gradient-to-b from-white to-emerald-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full text-emerald-700 text-sm font-semibold mb-6">
                <Shield className="h-4 w-4 mr-2" />
                {t('about.commitment.badge')}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                {t('about.commitment.title')}
              </h2>
              
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('about.commitment.description')}
              </p>
            </div>

            {/* Principles Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {principles.map((principle, index) => {
                const Icon = principle.icon
                return (
                  <div key={index} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                    <div className="relative bg-white rounded-2xl border border-emerald-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                      <div className={`w-16 h-16 rounded-xl ${principle.color} flex items-center justify-center mb-6`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{principle.title}</h3>
                      <p className="text-gray-600 mb-6">{principle.description}</p>
                      <div className="space-y-3">
                        {principle.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 p-8">
              <p className="text-center text-lg text-gray-700 leading-relaxed">
                {t('about.commitment.footer')}
              </p>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section id="future" className="py-20 bg-gradient-to-b from-white to-purple-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl border border-purple-100 p-8 md:p-12 shadow-lg">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {t('about.future.title')}
                </h2>
              </div>
              
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                {t('about.future.description')}
              </p>

              {/* Roadmap */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('about.future.roadmap')}</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {roadmap.map((phase, index) => (
                    <div key={index} className={`relative p-6 rounded-xl border-2 ${
                      phase.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                      phase.status === 'current' ? 'border-blue-200 bg-blue-50' :
                      'border-purple-200 bg-purple-50'
                    }`}>
                      <div className="text-2xl mb-2">{phase.icon}</div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3 ${
                        phase.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        phase.status === 'current' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {phase.phase}
                      </div>
                      <div className="font-bold text-gray-900 mb-1">{phase.year}</div>
                      <h4 className="font-semibold text-gray-800 mb-2">{phase.goal}</h4>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        phase.status === 'completed' ? 'bg-emerald-200 text-emerald-800' :
                        phase.status === 'current' ? 'bg-blue-200 text-blue-800' :
                        'bg-purple-200 text-purple-800'
                      }`}>
                        {phase.status === 'completed' ? t('about.future.status.completed') :
                         phase.status === 'current' ? t('about.future.status.current') :
                         t('about.future.status.upcoming')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final CTA */}
              <div className="text-center">
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  {t('about.future.cta')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <span className="flex items-center justify-center">
                      {t('about.future.join')}
                      <Users className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    </span>
                  </button>
                  <button className="group px-8 py-4 bg-white text-purple-700 font-semibold rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300">
                    <span className="flex items-center justify-center">
                      {t('about.future.explore')}
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
          aria-label={t('about.back_to_top')}
        >
          <ArrowRight className="h-6 w-6 rotate-270" />
        </button>
      </PageWrapper>
    </Layout>
  )
}

export default About