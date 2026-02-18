// src/components/common/Badge.jsx
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = ''
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-emerald-100 text-emerald-800',
    secondary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-indigo-100 text-indigo-800'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-emerald-400',
    secondary: 'bg-blue-400',
    success: 'bg-green-400',
    danger: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-indigo-400'
  };

  return (
    <span className={`
      inline-flex items-center ${sizes[size]} rounded-full font-medium
      ${variants[variant]}
      ${className}
    `}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[variant]}`}></span>
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 -mr-0.5 flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors"
        >
          <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;