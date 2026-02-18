// src/components/common/Button.jsx
import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500/30 shadow-sm hover:shadow-md active:scale-[0.98]',
    secondary: 'bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 focus:ring-emerald-500/20 shadow-sm',
    outline: 'bg-transparent text-emerald-700 border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 focus:ring-emerald-500/20',
    ghost: 'bg-transparent text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus:ring-emerald-500/20',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500/30 shadow-sm hover:shadow-md',
  }
  
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-base',
    xl: 'px-10 py-4 text-lg',
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button