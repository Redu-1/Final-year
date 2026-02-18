// src/components/common/Modal.jsx
import { Fragment, useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  type = 'default' // 'default', 'warning', 'danger', 'success'
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  const typeConfig = {
    default: {
      icon: null,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    danger: {
      icon: ExclamationTriangleIcon,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    success: {
      icon: null,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        
        {/* Modal */}
        <div className={`relative w-full ${sizes[size]} transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all`}>
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {Icon && (
                  <div className={`${config.iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
              </div>
              
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="border-t border-gray-200 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal Body Component
const ModalBody = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

// Modal Footer Component
const ModalFooter = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end space-x-3 ${className}`}>
      {children}
    </div>
  );
};

Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;