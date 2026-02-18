// src/hooks/useTranslation.js
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'

export const useTranslation = () => {
  const { language } = useLanguage()

  const t = (key, params = {}) => {
    const translation = translations[language]?.[key] || translations['EN']?.[key] || key
    
    // Replace parameters like {year}
    return translation.replace(/{(\w+)}/g, (match, p1) => params[p1] || match)
  }

  return { t, language }
}