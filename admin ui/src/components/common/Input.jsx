// src/components/common/Input.jsx
import { forwardRef, useState } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  prefix,
  suffix,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = true,
  size = 'md',
  variant = 'default',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizes = {
    sm: 'py-2 text-sm',
    md: 'py-2.5 text-sm',
    lg: 'py-3 text-base'
  };

  const variants = {
    default: 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${error ? 'text-red-400' : isFocused ? 'text-emerald-500' : 'text-gray-400'}`} />
          </div>
        )}
        
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        <input
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${widthClass}
            ${sizes[size]}
            ${Icon && iconPosition === 'left' ? 'pl-10' : prefix ? 'pl-12' : 'pl-4'}
            ${suffix ? 'pr-12' : Icon && iconPosition === 'right' ? 'pr-10' : 'pr-4'}
            border rounded-xl bg-white/50 backdrop-blur-sm
            ${variants[error ? 'error' : variant]}
            focus:ring-2 focus:ring-opacity-50
            placeholder:text-gray-400
            transition-all duration-200
            ${error ? 'text-red-900' : 'text-gray-900'}
            ${className}
          `}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${error ? 'text-red-400' : isFocused ? 'text-emerald-500' : 'text-gray-400'}`} />
          </div>
        )}
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;