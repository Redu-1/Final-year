// src/pages/Login.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import Layout from '../components/layout/Layout'
import { LoadingDots } from '../components/common/LoadingSpinner'
import { useTranslation } from '../hooks/useTranslation'

const Login = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

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
    <Layout>
      <LoginForm />
    </Layout>
  )
}

export default Login