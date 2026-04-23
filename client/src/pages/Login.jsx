// src/pages/Login.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { useTranslation } from '../hooks/useTranslation'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    // Simulate loading for animations
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingDots size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 pt-20">
      <LoginForm />
    </div>
  )
}

export default Login