// src/contexts/LanguageContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'

const LanguageContext = createContext()

export const languages = [
  { code: 'EN', name: 'English', nativeName: 'English' },
  { code: 'AM', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'OR', name: 'Oromo', nativeName: 'Afaan Oromoo' }
]

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('EN')
  const [direction, setDirection] = useState('ltr')

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
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
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