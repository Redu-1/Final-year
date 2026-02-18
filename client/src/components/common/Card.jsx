// src/components/common/Card.jsx
import { forwardRef } from 'react'

const Card = forwardRef(({
  children,
  variant = 'default',
  hoverable = true,
  className = '',
  onClick,
  ...props
}, ref) => {
  const baseClasses = 'rounded-2xl transition-all duration-300'
  
  const variants = {
    default: 'bg-white border border-emerald-100 shadow-sm',
    elevated: 'bg-white border border-emerald-100 shadow-lg',
    gradient: 'bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm',
    dark: 'bg-gradient-to-br from-emerald-900 to-emerald-800 text-white shadow-xl',
  }
  
  const hoverClasses = hoverable 
    ? 'hover:shadow-xl hover:-translate-y-1 hover:border-emerald-200 cursor-pointer' 
    : ''
  
  return (
    <div
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Sub-components
export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-0 ${className}`}>
    {children}
  </div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
    {children}
  </h3>
)

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 text-sm ${className}`}>
    {children}
  </p>
)

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

export default Card