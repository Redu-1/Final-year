// src/pages/Feedback.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { 
  Mail, MessageSquare, Send, User, 
  CheckCircle, AlertCircle, Sparkles,
  Heart, Shield, ChevronRight, X,
  Phone, Mail as MailIcon, Headphones
} from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'
import { getApiBaseUrl } from '../services/herbApi'

const Feedback = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const { t } = useTranslation()

  const API_BASE_URL = getApiBaseUrl()

  // Contact information
  const contactInfo = {
    email: "herbcreator@herbisense.com",
    phone: "+251 911 234 567"
  }

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
    if (!formData.name.trim()) newErrors.name = t('feedback.form.name.error')
    if (!formData.email) {
      newErrors.email = t('feedback.form.email.error.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('feedback.form.email.error.invalid')
    }
    if (!formData.message.trim()) {
      newErrors.message = t('feedback.form.message.error.required')
    } else if (formData.message.length < 10) {
      newErrors.message = t('feedback.form.message.error.length')
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
    setSubmitError(null)
    
    try {
      const token = localStorage.getItem('herbisense_token') || localStorage.getItem('token')
      
      const feedbackData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      }
      
      console.log('📤 Submitting feedback:', feedbackData)
      
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : {},
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Feedback submitted:', data)
        setSubmitSuccess(true)
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit feedback')
      }
    } catch (error) {
      console.error('❌ Error submitting feedback:', error)
      setSubmitError(error.message || 'Failed to send feedback. Please try again.')
      setTimeout(() => setSubmitError(null), 5000)
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
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            {t('feedback.hero.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('feedback.hero.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('feedback.hero.subtitle')}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Form - Main Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t('feedback.form.title')}</h2>
              </div>

              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('feedback.form.success.title')}</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {t('feedback.form.success.message')}
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    {t('feedback.form.success.button')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error Message */}
                  {submitError && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                          <p className="text-red-700">{submitError}</p>
                        </div>
                        <button onClick={() => setSubmitError(null)} className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('feedback.form.name.label')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors ${
                          errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                        }`}
                        placeholder={t('feedback.form.name.placeholder')}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('feedback.form.email.label')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors ${
                          errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                        }`}
                        placeholder={t('feedback.form.email.placeholder')}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('feedback.form.message.label')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-colors ${
                        errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                      }`}
                      placeholder={t('feedback.form.message.placeholder')}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      {formData.message.length}/500 {t('feedback.form.message.characters')}
                    </p>
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
                        {t('feedback.form.submitting')}
                      </>
                    ) : (
                      <>
                        {t('feedback.form.submit')}
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* Privacy Note */}
                  <p className="text-xs text-gray-500 text-center">
                    {t('feedback.form.privacy')}
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contact Herb Creator Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Headphones className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{t('feedback.contact.card.title')}</h3>
                    <p className="text-emerald-100 text-xs">{t('feedback.contact.card.subtitle')}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <MailIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">{t('feedback.contact.email.label')}</p>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-sm text-gray-900 hover:text-emerald-600 transition-colors font-medium"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                  <button
                    onClick={() => window.location.href = `mailto:${contactInfo.email}`}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('feedback.contact.email.button')}
                  </button>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors group">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">{t('feedback.contact.phone.label')}</p>
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="text-sm text-gray-900 hover:text-emerald-600 transition-colors font-medium"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                  <button
                    onClick={() => window.location.href = `tel:${contactInfo.phone}`}
                    className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('feedback.contact.phone.button')}
                  </button>
                </div>
              </div>
            </div>

            {/* Why Feedback Matters Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
              <Heart className="h-8 w-8 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">{t('feedback.matters.title')}</h3>
              <p className="text-emerald-100 text-sm mb-4">
                {t('feedback.matters.description')}
              </p>
              <div className="flex items-center text-sm text-emerald-200">
                <Shield className="h-4 w-4 mr-2" />
                {t('feedback.matters.shield')}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t('feedback.links.title')}</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => navigate('/herbs')}
                    className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors w-full"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {t('feedback.links.herbs')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/about')}
                    className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors w-full"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {t('feedback.links.about')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/recommendations')}
                    className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors w-full"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {t('feedback.links.recommendations')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedback