// src/components/auth/RegisterForm.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User, Mail, Lock, Eye, EyeOff, 
  Leaf, CheckCircle, AlertCircle, Sparkles
} from 'lucide-react'
import Button from '../common/Button'
import { useTranslation } from '../../hooks/useTranslation'
import { authApi } from '../../services/authApi'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { t } = useTranslation()

  const benefits = [
    {
      title: 'Personalized Experience',
      description: 'Get tailored herb recommendations based on your interests'
    },
    {
      title: 'Save Favorites',
      description: 'Bookmark your favorite herbs for quick access'
    },
    {
      title: 'Community Access',
      description: 'Join discussions with herbal enthusiasts'
    },
    {
      title: 'Research Updates',
      description: 'Stay informed about new herbal discoveries'
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (passwordStrength < 2) {
      newErrors.password = 'Password is too weak'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }
    
    return newErrors
  }

// src/components/auth/RegisterForm.jsx
// Update the handleSubmit function to show more specific errors

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setIsLoading(true);
  setErrors({});
  
  try {
    const response = await authApi.register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password
    });
    
    console.log('Registration successful:', response);
    
    // Show success message
    alert('Registration successful! Please log in with your credentials.');
    
    // Redirect to login page
    navigate('/login');
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Show specific error message
    let errorMessage = error.message || 'Registration failed. Please try again.';
    
    // Check if it's a network error
    if (errorMessage.includes('Cannot connect to the server')) {
      errorMessage = 'Cannot connect to the server. Please make sure the backend is running at http://10.41.248.116:5001';
    }
    
    setErrors({ 
      general: errorMessage
    });
  } finally {
    setIsLoading(false);
  }
};

  const getPasswordStrengthLabel = () => {
    switch(passwordStrength) {
      case 0: return { label: 'Very Weak', color: 'bg-red-500' }
      case 1: return { label: 'Weak', color: 'bg-orange-500' }
      case 2: return { label: 'Fair', color: 'bg-yellow-500' }
      case 3: return { label: 'Good', color: 'bg-emerald-400' }
      case 4: return { label: 'Strong', color: 'bg-emerald-600' }
      default: return { label: 'Very Weak', color: 'bg-red-500' }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 pt-24 pb-12 px-4">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-10 w-24 h-24 opacity-5">
          <Leaf className="h-full w-full text-emerald-400 animate-float" />
        </div>
        <div className="absolute bottom-40 right-16 w-32 h-32 opacity-5">
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
                  <h1 className="text-2xl font-bold">HerbiSense</h1>
                  <p className="text-emerald-100 text-sm">Ethiopian Herbal Wisdom</p>
                </div>
              </div>

              {/* Hero Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Join 10,000+ Herbal Enthusiasts</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Start Your Herbal{' '}
                  <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    Journey Today
                  </span>
                </h2>
                
                <p className="text-emerald-100 text-lg">
                  Create an account to access our complete herbal directory, save favorites, and join our community.
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
                Create Account
              </h2>
              <p className="text-gray-600">
                Sign up to explore our herbal directory
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
                  Full Name
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
                    placeholder="Enter your full name"
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
                  Email Address
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
                    placeholder="Enter your email"
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
                  Password
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
                    placeholder="Create a password"
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
                      <span className="text-sm text-gray-600">Password strength</span>
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
                  Confirm Password
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
                    placeholder="Confirm your password"
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

              {/* Terms Checkbox */}
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
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full group"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                <Sparkles className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Sign In
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
              <h3 className="text-xl font-bold text-gray-900">HerbiSense</h3>
              <p className="text-emerald-600 text-sm">Ethiopian Herbal Wisdom</p>
            </div>
          </div>
          <p className="text-gray-600">
            Join our community of herbal enthusiasts
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

export default RegisterForm