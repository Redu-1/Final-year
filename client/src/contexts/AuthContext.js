// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Mock user data - In production, this would come from your backend
  const mockUsers = {
    'alemu@example.com': {
      id: 1,
      name: 'Alemu Kebede',
      email: 'alemu@example.com',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alemu',
      isTraditionalHealer: true,
      joinedDate: '2024-01-15',
      preferences: {
        language: 'en',
        theme: 'light',
        notifications: true
      }
    },
    'test@herbisense.com': {
      id: 2,
      name: 'Test User',
      email: 'test@herbisense.com',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
      isTraditionalHealer: false,
      joinedDate: '2024-02-20',
      preferences: {
        language: 'en',
        theme: 'light',
        notifications: true
      }
    }
  }

  useEffect(() => {
    // Check for saved user session on app load
    const checkAuthStatus = () => {
      setIsLoading(true)
      
      try {
        const savedUser = localStorage.getItem('herbisense_user')
        const token = localStorage.getItem('herbisense_token')
        
        if (savedUser && token) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setIsAuthenticated(true)
          toast.success(`Welcome back, ${userData.name}!`, {
            icon: '👋'
          })
        }
      } catch (error) {
        console.error('Error loading auth session:', error)
        localStorage.removeItem('herbisense_user')
        localStorage.removeItem('herbisense_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock authentication - In production, this would be a real API call
      if (mockUsers[email] && password === 'password123') {
        const userData = mockUsers[email]
        
        // Generate mock token
        const token = btoa(JSON.stringify({
          email: userData.email,
          id: userData.id,
          timestamp: Date.now()
        }))
        
        setUser(userData)
        setIsAuthenticated(true)
        
        // Save to localStorage
        if (rememberMe) {
          localStorage.setItem('herbisense_user', JSON.stringify(userData))
          localStorage.setItem('herbisense_token', token)
        } else {
          sessionStorage.setItem('herbisense_user', JSON.stringify(userData))
          sessionStorage.setItem('herbisense_token', token)
        }
        
        toast.success(`Welcome to HerbiSense, ${userData.name}!`, {
          icon: '🌿'
        })
        
        return { success: true, user: userData }
      } else {
        throw new Error('Invalid email or password')
      }
      
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock registration - In production, this would be a real API call
      if (mockUsers[userData.email]) {
        throw new Error('User with this email already exists')
      }
      
      const newUser = {
        id: Date.now(),
        name: userData.fullName,
        email: userData.email,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.fullName}`,
        isTraditionalHealer: userData.interests?.includes('traditional') || false,
        joinedDate: new Date().toISOString().split('T')[0],
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: userData.newsletter || true
        }
      }
      
      // Generate mock token
      const token = btoa(JSON.stringify({
        email: newUser.email,
        id: newUser.id,
        timestamp: Date.now()
      }))
      
      setUser(newUser)
      setIsAuthenticated(true)
      
      // Save to localStorage
      localStorage.setItem('herbisense_user', JSON.stringify(newUser))
      localStorage.setItem('herbisense_token', token)
      
      toast.success('Welcome to HerbiSense! Your account has been created.', {
        icon: '🎉'
      })
      
      return { success: true, user: newUser }
      
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    
    // Clear all storage
    localStorage.removeItem('herbisense_user')
    localStorage.removeItem('herbisense_token')
    sessionStorage.removeItem('herbisense_user')
    sessionStorage.removeItem('herbisense_token')
    
    toast.info('You have been logged out successfully.', {
      icon: '👋'
    })
  }

  const updateProfile = async (updates) => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      
      // Update localStorage
      const storage = localStorage.getItem('herbisense_user') ? localStorage : sessionStorage
      storage.setItem('herbisense_user', JSON.stringify(updatedUser))
      
      toast.success('Profile updated successfully!', {
        icon: '✅'
      })
      
      return { success: true, user: updatedUser }
      
    } catch (error) {
      toast.error('Failed to update profile. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const socialLogin = async (provider) => {
    setIsLoading(true)
    
    try {
      // Simulate social login API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock social login user
      const socialUser = {
        id: 1000,
        name: 'Social User',
        email: `social@${provider}.com`,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
        isTraditionalHealer: false,
        joinedDate: new Date().toISOString().split('T')[0],
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: true
        }
      }
      
      setUser(socialUser)
      setIsAuthenticated(true)
      
      // Save to localStorage
      localStorage.setItem('herbisense_user', JSON.stringify(socialUser))
      localStorage.setItem('herbisense_token', `social_${provider}_${Date.now()}`)
      
      toast.success(`Logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`, {
        icon: '🌿'
      })
      
      return { success: true, user: socialUser }
      
    } catch (error) {
      toast.error(`Failed to login with ${provider}. Please try again.`)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    socialLogin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}