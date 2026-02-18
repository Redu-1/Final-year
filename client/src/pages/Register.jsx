// src/pages/Register.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'
import Layout from '../components/layout/Layout'
import { LoadingDots } from '../components/common/LoadingSpinner'

const Register = () => {
  const [isLoading, setIsLoading] = useState(true)

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
      <RegisterForm />
    </Layout>
  )
}

export default Register