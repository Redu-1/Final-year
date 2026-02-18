// src/components/auth/LoginForm.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Mail, Lock, Eye, EyeOff, LogIn, 
  User, Sparkles, AlertCircle, 
  Facebook, Twitter, Chrome, Leaf
} from 'lucide-react'
import Button from '../common/Button'
import { useTranslation } from '../../hooks/useTranslation'

const LoginForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { t } = useTranslation()

  const socialLogins = [
    { provider: 'google', icon: Chrome, label: t('login.social.google'), color: 'hover:bg-red-50 border-red-100 text-red-600' },
    { provider: 'facebook', icon: Facebook, label: t('login.social.facebook'), color: 'hover:bg-blue-50 border-blue-100 text-blue-600' },
    { provider: 'twitter', icon: Twitter, label: t('login.social.twitter'), color: 'hover:bg-sky-50 border-sky-100 text-sky-600' },
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = t('login.email.error.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('login.email.error.invalid')
    }
    
    if (!formData.password) {
      newErrors.password = t('login.password.error.required')
    } else if (formData.password.length < 6) {
      newErrors.password = t('login.password.error.length')
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Login successful:', formData)
      navigate('/')
      
    } catch (error) {
      setErrors({ general: t('login.error.general') })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider}`)
    // Implement social login logic
  }

  const handleForgotPassword = () => {
    console.log('Forgot password clicked')
    // Navigate to forgot password page
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
          {/* Left Side - Brand & Info */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t('login.brand.title')}</h1>
                  <p className="text-emerald-100 text-sm">{t('login.brand.subtitle')}</p>
                </div>
              </div>

              {/* Hero Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{t('login.badge')}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {t('login.hero.title')}{' '}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    {t('login.hero.highlight')}
                  </span>
                </h2>
                
                <p className="text-emerald-100 text-lg">
                  {t('login.hero.description')}
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('login.benefit.personalized')}</h4>
                    <p className="text-emerald-100 text-sm">{t('login.benefit.personalized.desc')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('login.benefit.favorites')}</h4>
                    <p className="text-emerald-100 text-sm">{t('login.benefit.favorites.desc')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('login.benefit.community')}</h4>
                    <p className="text-emerald-100 text-sm">{t('login.benefit.community.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-2xl p-8 md:p-12">
            {/* Form Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('login.form.title')}
              </h2>
              <p className="text-gray-600">
                {t('login.form.subtitle')}
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2 text-emerald-500" />
                  {t('login.email.label')}
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
                    placeholder={t('login.email.placeholder')}
                  />
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-emerald-400" />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Lock className="inline h-4 w-4 mr-2 text-emerald-500" />
                    {t('login.password.label')}
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {t('login.password.forgot')}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 bg-white border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-emerald-200 focus:border-emerald-500'
                    }`}
                    placeholder={t('login.password.placeholder')}
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
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  id="rememberMe"
                />
                <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-700">
                  {t('login.remember.label')}
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full group"
              >
                {isLoading ? t('login.button.signing') : t('login.button.signin')}
                <LogIn className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-emerald-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">{t('login.divider')}</span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {socialLogins.map((social) => {
                const Icon = social.icon
                return (
                  <button
                    key={social.provider}
                    onClick={() => handleSocialLogin(social.provider)}
                    className={`flex items-center justify-center p-3 border-2 rounded-xl transition-all hover:scale-105 ${social.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {t('login.signup.text')}{' '}
                <Link
                  to="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  {t('login.signup.link')}
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-8 pt-8 border-t border-emerald-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500">
                  {t('login.security.text')}
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
              <h3 className="text-xl font-bold text-gray-900">{t('login.brand.title')}</h3>
              <p className="text-emerald-600 text-sm">{t('login.brand.subtitle')}</p>
            </div>
          </div>
          <p className="text-gray-600">
            {t('login.mobile.subtitle')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm