// src/pages/Contact.jsx
import { useState, useEffect } from 'react'
import Layout, { PageWrapper } from '../components/layout/Layout'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { 
  Mail, Phone, MapPin, MessageSquare, 
  Send, User, Globe, Clock,
  CheckCircle, AlertCircle, Sparkles,
  Heart, Shield, Users, ChevronRight
} from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { t } = useTranslation()

  const contactCategories = [
    { id: 'general', label: t('contact.category.general'), icon: MessageSquare },
    { id: 'technical', label: t('contact.category.technical'), icon: Globe },
    { id: 'partnership', label: t('contact.category.partnership'), icon: Users },
    { id: 'traditional', label: t('contact.category.traditional'), icon: Shield },
    { id: 'feedback', label: t('contact.category.feedback'), icon: Heart },
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.info.email.title'),
      details: ['contact@herbisense.com', 'support@herbisense.com'],
      description: t('contact.info.email.desc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: t('contact.info.phone.title'),
      details: ['+251 911 234 567', '+251 912 345 678'],
      description: t('contact.info.phone.desc'),
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: MapPin,
      title: t('contact.info.visit.title'),
      details: ['Jimma Institute of Technology', 'Jimma, Ethiopia'],
      description: t('contact.info.visit.desc'),
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Globe,
      title: t('contact.info.online.title'),
      details: ['@HerbiSense', 'HerbiSense Community'],
      description: t('contact.info.online.desc'),
      color: 'from-purple-500 to-pink-500'
    },
  ]

  const faqs = [
    {
      question: t('contact.faq.q1'),
      answer: t('contact.faq.a1')
    },
    {
      question: t('contact.faq.q2'),
      answer: t('contact.faq.a2')
    },
    {
      question: t('contact.faq.q3'),
      answer: t('contact.faq.a3')
    },
    {
      question: t('contact.faq.q4'),
      answer: t('contact.faq.a4')
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = t('contact.form.name.error')
    if (!formData.email) {
      newErrors.email = t('contact.form.email.error.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.form.email.error.invalid')
    }
    if (!formData.subject.trim()) newErrors.subject = t('contact.form.subject.error')
    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.message.error.required')
    } else if (formData.message.length < 10) {
      newErrors.message = t('contact.form.message.error.details')
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '', category: 'general' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      setErrors({ general: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingDots size="lg" />
      </div>
    )
  }

  return (
    <Layout>
      <PageWrapper>
        {/* Main Content - Perfectly aligned with navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('contact.hero.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('contact.hero.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('contact.hero.subtitle')}
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div 
                  key={index}
                  className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 text-${info.color.split('-')[1]}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 text-sm">{detail}</p>
                  ))}
                  <p className="text-xs text-gray-500 mt-3">{info.description}</p>
                </div>
              )
            })}
          </div>

          {/* Main Grid - Contact Form & Info */}
          <div className="grid lg:grid-cols-5 gap-8 mb-16">
            {/* Contact Form - 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('contact.form.title')}</h2>
                </div>

                {submitSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('contact.form.success.title')}</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {t('contact.form.success.message')}
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      {t('contact.form.success.button')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errors.general && (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                          <p className="text-red-700">{errors.general}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('contact.form.name.label')}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors ${
                            errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                          }`}
                          placeholder={t('contact.form.name.placeholder')}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('contact.form.email.label')}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors ${
                            errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                          }`}
                          placeholder={t('contact.form.email.placeholder')}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t('contact.form.category.label')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {contactCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                              formData.category === category.id
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                            }`}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.subject.label')}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors ${
                          errors.subject ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                        }`}
                        placeholder={t('contact.form.subject.placeholder')}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.message.label')}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors ${
                          errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                        }`}
                        placeholder={t('contact.form.message.placeholder')}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          {t('contact.form.submitting')}
                        </>
                      ) : (
                        <>
                          {t('contact.form.submit')}
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>

                    {/* Privacy Note */}
                    <p className="text-xs text-gray-500 text-center">
                      {t('contact.form.privacy')}
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Right Sidebar - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Response Time Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
                <Clock className="h-8 w-8 mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-2">{t('contact.sidebar.response.title')}</h3>
                <p className="text-emerald-100 text-sm mb-4">
                  {t('contact.sidebar.response.description')}
                </p>
                <div className="flex items-center text-sm text-emerald-200">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('contact.sidebar.response.guarantee')}
                </div>
              </div>

              {/* Community Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <Users className="h-8 w-8 text-emerald-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('contact.sidebar.community.title')}</h3>
                <p className="text-gray-600 text-sm mb-6">
                  {t('contact.sidebar.community.description')}
                </p>
                <button className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center">
                  {t('contact.sidebar.community.button')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              {/* Quick Help */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
                <h3 className="font-bold text-gray-900 mb-4">{t('contact.sidebar.help.title')}</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/faq" className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {t('contact.sidebar.help.faq')}
                    </a>
                  </li>
                  <li>
                    <a href="/support" className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {t('contact.sidebar.help.support')}
                    </a>
                  </li>
                  <li>
                    <a href="/partnership" className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {t('contact.sidebar.help.partnership')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('contact.faq.title')}</h2>
              <p className="text-gray-600">{t('contact.faq.subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </Layout>
  )
}

export default Contact