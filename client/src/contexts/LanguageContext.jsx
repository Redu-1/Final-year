// src/contexts/LanguageContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'

const LanguageContext = createContext()

export const languages = [
  { code: 'EN', name: 'English', nativeName: 'English', apiCode: 'EN' },
  { code: 'AM', name: 'Amharic', nativeName: 'አማርኛ', apiCode: 'AM' },
  { code: 'OM', name: 'Oromo', nativeName: 'Afaan Oromoo', apiCode: 'OM' }  // Changed from 'OR' to 'OM'
]

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN')
  const [direction, setDirection] = useState('ltr')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  useEffect(() => {
    // Check if there's a saved language in localStorage
    const savedLanguage = localStorage.getItem('herbisense-language')
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language preference
    localStorage.setItem('herbisense-language', language)
    
    // Set direction (Amharic is also LTR, but if you add Arabic later, this would handle RTL)
    document.documentElement.dir = 'ltr'
    
    // You could add a class to the body for language-specific styling
    document.documentElement.lang = language.toLowerCase()
  }, [language])

  const changeLanguage = (langCode) => {
    setLanguage(langCode)
    setShowLanguageMenu(false)
  }

  // Get the API language code (EN, AM, OM)
  const getApiLanguageCode = () => {
    const lang = languages.find(l => l.code === language);
    return lang?.apiCode || 'EN';
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      changeLanguage, 
      languages, 
      showLanguageMenu, 
      setShowLanguageMenu,
      getApiLanguageCode 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}