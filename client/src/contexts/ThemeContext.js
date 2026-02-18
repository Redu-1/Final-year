// src/context/ThemeContext.js
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')
  const [fontSize, setFontSize] = useState('medium')
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Language translations
  const translations = {
    en: {
      // Navigation
      home: "Home",
      herbs: "Herbs",
      recommendations: "Recommendations",
      about: "About",
      contact: "Contact",
      login: "Login",
      
      // Common
      search: "Search",
      filter: "Filter",
      viewAll: "View All",
      learnMore: "Learn More",
      save: "Save",
      share: "Share",
      
      // Herb details
      uses: "Uses",
      benefits: "Benefits",
      preparation: "Preparation",
      safety: "Safety",
      traditionalUse: "Traditional Use",
      effectiveness: "Effectiveness",
      
      // Auth
      welcome: "Welcome",
      signIn: "Sign In",
      signUp: "Sign Up",
      logout: "Logout",
      profile: "Profile",
      
      // Actions
      getRecommendations: "Get Recommendations",
      browseHerbs: "Browse Herbs",
      saveToBookmarks: "Save to Bookmarks"
    },
    am: {
      // Amharic translations would go here
      home: "መነሻ",
      herbs: "ጥቅል",
      recommendations: "ምክር",
      about: "ስለ እኛ",
      contact: "አግኙን",
      login: "ግባ",
      search: "ፈልግ",
      filter: "አጣራ",
      viewAll: "ሁሉንም ተመልከት",
      learnMore: "ተጨማሪ ይወቁ",
      save: "አስቀምጥ",
      share: "አጋራ"
    },
    or: {
      // Oromiffa translations would go here
      home: "Mana",
      herbs: "Uwwisaa",
      recommendations: "Gorsa",
      about: "Waa'ee keenya",
      contact: "Nu qunnamii",
      login: "Seenu",
      search: "Barbaadi",
      filter: "Filtaa",
      viewAll: "Hunda ilaali",
      learnMore: "Dabalataa baradhu",
      save: "Qabadhu",
      share: "Qoodhu"
    }
  }

  useEffect(() => {
    // Load saved preferences from localStorage
    const loadPreferences = () => {
      try {
        const savedTheme = localStorage.getItem('herbisense_theme')
        const savedLanguage = localStorage.getItem('herbisense_language')
        const savedFontSize = localStorage.getItem('herbisense_font_size')
        const savedHighContrast = localStorage.getItem('herbisense_high_contrast')
        const savedReducedMotion = localStorage.getItem('herbisense_reduced_motion')
        
        if (savedTheme) setTheme(savedTheme)
        if (savedLanguage) setLanguage(savedLanguage)
        if (savedFontSize) setFontSize(savedFontSize)
        if (savedHighContrast) setHighContrast(savedHighContrast === 'true')
        if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true')
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    }

    loadPreferences()
  }, [])

  useEffect(() => {
    // Apply theme to document
    const applyTheme = () => {
      const root = document.documentElement
      
      // Remove existing theme classes
      root.classList.remove('light-theme', 'dark-theme', 'high-contrast')
      
      // Add new theme class
      if (highContrast) {
        root.classList.add('high-contrast')
      } else {
        root.classList.add(`${theme}-theme`)
      }
      
      // Apply font size
      const fontSizeMap = {
        small: '14px',
        medium: '16px',
        large: '18px',
        xlarge: '20px'
      }
      root.style.fontSize = fontSizeMap[fontSize]
      
      // Apply reduced motion
      if (reducedMotion) {
        root.style.setProperty('--animation-duration', '0s')
        root.style.setProperty('--transition-duration', '0s')
      } else {
        root.style.removeProperty('--animation-duration')
        root.style.removeProperty('--transition-duration')
      }
      
      // Save to localStorage
      localStorage.setItem('herbisense_theme', theme)
      localStorage.setItem('herbisense_language', language)
      localStorage.setItem('herbisense_font_size', fontSize)
      localStorage.setItem('herbisense_high_contrast', highContrast)
      localStorage.setItem('herbisense_reduced_motion', reducedMotion)
    }

    applyTheme()
  }, [theme, language, fontSize, highContrast, reducedMotion])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    // In a real app, you might want to reload the page or update all translated content
  }

  const changeFontSize = (size) => {
    setFontSize(size)
  }

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev)
  }

  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev)
  }

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const value = {
    theme,
    language,
    fontSize,
    highContrast,
    reducedMotion,
    translations,
    toggleTheme,
    changeLanguage,
    changeFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    t
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}