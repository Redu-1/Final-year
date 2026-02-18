// src/components/auth/RegisterForm.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User, Mail, Lock, Eye, EyeOff, 
  Calendar, MapPin, Leaf, CheckCircle,
  AlertCircle, Sparkles, Chrome,
  Facebook, Twitter
} from 'lucide-react'
import Button from '../common/Button'
import { useTranslation } from '../../hooks/useTranslation'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    location: '',
    interests: [],
    agreeToTerms: false,
    newsletter: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { t } = useTranslation()

  const interests = [
    { id: 'skincare', label: t('register.interests.skincare'), icon: '✨' },
    { id: 'traditional', label: t('register.interests.traditional'), icon: '🌿' },
    { id: 'research', label: t('register.interests.research'), icon: '🔬' },
    { id: 'community', label: t('register.interests.community'), icon: '👥' },
    { id: 'education', label: t('register.interests.education'), icon: '📚' },
    { id: 'conservation', label: t('register.interests.conservation'), icon: '🌍' },
  ]

  const socialLogins = [
    { provider: 'google', icon: Chrome, label: t('register.social.google'), color: 'hover:bg-red-50 border-red-100 text-red-600' },
    { provider: 'facebook', icon: Facebook, label: t('register.social.facebook'), color: 'hover:bg-blue-50 border-blue-100 text-blue-600' },
    { provider: 'twitter', icon: Twitter, label: t('register.social.twitter'), color: 'hover:bg-sky-50 border-sky-100 text-sky-600' },
  ]

  const benefits = [
    {
      title: t('register.benefit.personalized.title'),
      description: t('register.benefit.personalized.desc')
    },
    {
      title: t('register.benefit.traditional.title'),
      description: t('register.benefit.traditional.desc')
    },
    {
      title: t('register.benefit.community.title'),
      description: t('register.benefit.community.desc')
    },
    {
      title: t('register.benefit.save.title'),
      description: t('register.benefit.save.desc')
    },
  ]

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('register.fullName.error.required')
    }
    
    if (!formData.email) {
      newErrors.email = t('register.email.error.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('register.email.error.invalid')
    }
    
    if (!formData.password) {
      newErrors.password = t('register.password.error.required')
    } else if (formData.password.length < 8) {
      newErrors.password = t('register.password.error.length')
    } else if (passwordStrength < 2) {
      newErrors.password = t('register.password.error.weak')
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.confirmPassword.error.match')
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('register.terms.error')
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
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Registration successful:', formData)
      navigate('/')
      
    } catch (error) {
      setErrors({ general: t('register.error.general') })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = (provider) => {
    console.log(`Social register with ${provider}`)
    // Implement social registration logic
  }

  const getPasswordStrengthLabel = () => {
    switch(passwordStrength) {
      case 0: return { label: t('register.password.strength.veryWeak'), color: 'bg-red-500' }
      case 1: return { label: t('register.password.strength.weak'), color: 'bg-orange-500' }
      case 2: return { label: t('register.password.strength.fair'), color: 'bg-yellow-500' }
      case 3: return { label: t('register.password.strength.good'), color: 'bg-emerald-400' }
      case 4: return { label: t('register.password.strength.strong'), color: 'bg-emerald-600' }
      default: return { label: t('register.password.strength.veryWeak'), color: 'bg-red-500' }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 opacity-5">
          <Leaf className="h-full w-full text-emerald-400 animate-float" />
        </div>
        <div className="absolute bottom-32 right-16 w-32 h-32 opacity-5">
          <Leaf className="h-full w-full text-emerald-400 animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Brand & Benefits */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('register.brand.title')}</h1>
                  <p className="text-emerald-100 text-sm">{t('register.brand.subtitle')}</p>
                </div>
              </div>

              {/* Hero Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{t('register.badge')}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {t('register.hero.title')}{' '}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    {t('register.hero.highlight')}
                  </span>
                </h2>
                
                <p className="text-emerald-100 text-lg">
                  {t('register.hero.description')}
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-12 space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{benefit.title}</h4>
                      <p className="text-emerald-100 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-2xl p-8 md:p-12">
            {/* Form Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('register.form.title')}
              </h2>
              <p className="text-gray-600">
                {t('register.form.subtitle')}
              </p>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-red-700">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-2 text-emerald-500" />
                  {t('register.fullName.label')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-emerald-200 focus:border-emerald-500'
                    }`}
                    placeholder={t('register.fullName.placeholder')}
                  />
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
                </div>
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2 text-emerald-500" />
                  {t('register.email.label')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-emerald-200 focus:border-emerald-500'
                    }`}
                    placeholder={t('register.email.placeholder')}
                  />
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-2 text-emerald-500" />
                  {t('register.password.label')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 bg-white border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-emerald-200 focus:border-emerald-500'
                    }`}
                    placeholder={t('register.password.placeholder')}
                  />
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{t('register.password.strength')}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {getPasswordStrengthLabel().label}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthLabel().color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-2 text-emerald-500" />
                  {t('register.confirmPassword.label')}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 bg-white border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-emerald-200 focus:border-emerald-500'
                    }`}
                    placeholder={t('register.confirmPassword.placeholder')}
                  />
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2 text-emerald-500" />
                    {t('register.birthDate.label')}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                    <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-2 text-emerald-500" />
                    {t('register.location.label')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      placeholder={t('register.location.placeholder')}
                    />
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('register.interests.label')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        formData.interests.includes(interest.id)
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-emerald-100 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{interest.icon}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {interest.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    id="agreeToTerms"
                  />
                  <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                    {t('register.terms.agree')}{' '}
                    <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      {t('register.terms.link.terms')}
                    </Link>
                    {' '}{t('register.terms.and')}{' '}
                    <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      {t('register.terms.link.privacy')}
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    id="newsletter"
                  />
                  <label htmlFor="newsletter" className="ml-3 text-sm text-gray-700">
                    {t('register.newsletter.label')}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full group"
              >
                {isLoading ? t('register.button.submitting') : t('register.button.submit')}
                <Sparkles className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-emerald-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">{t('register.divider')}</span>
                </div>
              </div>
            </div>

            {/* Social Registration */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {socialLogins.map((social) => {
                const Icon = social.icon
                return (
                  <button
                    key={social.provider}
                    onClick={() => handleSocialRegister(social.provider)}
                    className={`flex items-center justify-center p-3 border-2 rounded-xl transition-all hover:scale-105 ${social.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {t('register.signin.text')}{' '}
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  {t('register.signin.link')}
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-8 pt-8 border-t border-emerald-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500">
                  {t('register.security.text')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Branding */}
        <div className="lg:hidden mt-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('register.brand.title')}</h3>
              <p className="text-emerald-600 text-sm">{t('register.brand.subtitle')}</p>
            </div>
          </div>
          <p className="text-gray-600">
            {t('register.mobile.subtitle')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm