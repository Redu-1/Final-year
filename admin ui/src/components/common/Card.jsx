// src/components/common/Card.jsx
import { ReactNode } from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false, 
  border = true,
  padding = 'p-6',
  shadow = 'shadow-sm',
  rounded = 'rounded-2xl'
}) => {
  return (
    <div className={`
      ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'}
      ${border ? 'border border-gray-200' : ''}
      ${hover ? 'hover:shadow-lg hover:border-gray-300 hover:transform hover:-translate-y-0.5' : ''}
      ${shadow}
      ${rounded}
      ${padding}
      transition-all duration-200
      ${className}
    `}>
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '',
  title,
  subtitle,
  action
}) => {
  return (
    <div className={`flex items-center justify-between border-b border-gray-200 pb-4 mb-4 ${className}`}>
      <div className="flex-1">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        {children && !title && children}
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;