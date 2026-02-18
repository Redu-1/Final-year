// src/components/auth/AuthGuard.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthGuard = ({ children, requireAuth = true }) => {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem('herbisense_auth') === 'true'
    
    if (requireAuth && !isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } })
    } else if (!requireAuth && isAuthenticated) {
      navigate('/')
    }
  }, [requireAuth, navigate])

  return children
}

export default AuthGuard