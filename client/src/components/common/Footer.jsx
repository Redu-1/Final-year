// src/components/common/Footer.jsx
import { Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          {/* Logo */}
          <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">H</span>
          </div>
          
          {/* Copyright Text */}
          <span>© {currentYear} HerbiSense.</span>
          <span className="mx-1">Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-current" />
          <span className="ml-1">in Ethiopia</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer