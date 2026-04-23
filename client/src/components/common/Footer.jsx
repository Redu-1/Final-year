// src/components/common/Footer.jsx
import { Heart } from 'lucide-react'
import LogoImage from '../../assets/Logo1.png'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          {/* Logo Image */}
          <div className="w-10 h-10 rounded-md overflow-hidden">
            <img 
              src={LogoImage} 
              alt="HerbiSense Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Copyright Text */}
          <span>© {currentYear} HerbiSense.</span>
          {/* <span className="mx-1">Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-current" />
          <span className="ml-1">in Ethiopia</span> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer