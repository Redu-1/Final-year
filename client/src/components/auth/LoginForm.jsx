// src/components/auth/LoginForm.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Mail, Lock, Eye, EyeOff, LogIn, 
  User, Sparkles, AlertCircle, Leaf
} from 'lucide-react'
import Button from '../common/Button'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../contexts/AuthContext'

const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { t } = useTranslation()

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
      newErrors.email = t('login.email.error.required') || 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('login.email.error.invalid') || 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = t('login.password.error.required') || 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = t('login.password.error.length') || 'Password must be at least 6 characters'
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
    setErrors({})
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Redirect to home page or previous page
        navigate('/')
      } else {
        setErrors({ 
          general: result.error || t('login.error.general') || 'Invalid email or password' 
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ 
        general: t('login.error.general') || 'Login failed. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    console.log('Forgot password clicked')
    // Navigate to forgot password page
    navigate('/forgot-password')
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
                  <h1 className="text-2xl font-bold">{t('login.brand.title') || 'HerbiSense'}</h1>
                  <p className="text-emerald-100 text-sm">{t('login.brand.subtitle') || 'Ethiopian Herbal Wisdom'}</p>
                </div>
              </div>

              {/* Hero Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{t('login.badge') || 'Welcome Back'}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {t('login.hero.title') || 'Continue Your'}{' '}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    {t('login.hero.highlight') || 'Herbal Journey'}
                  </span>
                </h2>
                
                <p className="text-emerald-100 text-lg">
                  {t('login.hero.description') || 'Access your saved herbs and personalized recommendations'}
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('login.benefit.personalized') || 'Personalized Experience'}</h4>
                    <p className="text-emerald-100 text-sm">{t('login.benefit.personalized.desc') || 'Get herb recommendations tailored to you'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('login.benefit.favorites') || 'Save Favorites'}</h4>
                    <p className="text-emerald-100 text-sm">{t('login.benefit.favorites.desc') || 'Bookmark herbs for quick access'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t('login.benefit.community') || 'Community Access'}</h4>
                    <p className="text-emerald-100 text-sm">{t('login.benefit.community.desc') || 'Join discussions with herbal enthusiasts'}</p>
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
                {t('login.form.title') || 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {t('login.form.subtitle') || 'Sign in to continue your herbal journey'}
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
                  {t('login.email.label') || 'Email Address'}
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
                    placeholder={t('login.email.placeholder') || 'Enter your email'}
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
                    {t('login.password.label') || 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {t('login.password.forgot') || 'Forgot Password?'}
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
                    placeholder={t('login.password.placeholder') || 'Enter your password'}
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
                  {t('login.remember.label') || 'Remember me for 30 days'}
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
                {isLoading ? (t('login.button.signing') || 'Signing in...') : (t('login.button.signin') || 'Sign In')}
                <LogIn className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                {t('login.signup.text') || "Don't have an account?"}{' '}
                <Link
                  to="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  {t('login.signup.link') || 'Sign Up'}
                </Link>
              </p>
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
              <h3 className="text-xl font-bold text-gray-900">{t('login.brand.title') || 'HerbiSense'}</h3>
              <p className="text-emerald-600 text-sm">{t('login.brand.subtitle') || 'Ethiopian Herbal Wisdom'}</p>
            </div>
          </div>
          <p className="text-gray-600">
            {t('login.mobile.subtitle') || 'Sign in to access your herbal directory'}
          </p>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default LoginForm