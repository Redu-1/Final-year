// src/components/common/Modal.jsx
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  preventCloseOnOverlay = false,
  className = '',
}) => {
  const modalRef = useRef(null)

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !preventCloseOnOverlay
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, preventCloseOnOverlay])

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50">
        {/* Overlay with blur */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={!preventCloseOnOverlay ? onClose : undefined}
        />
        
        {/* Modal Container */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Modal */}
            <div
              ref={modalRef}
              className={`${sizeClasses[size]} w-full transform transition-all duration-300 ${
                isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            >
              <div className={`bg-white rounded-3xl shadow-2xl ${className}`}>
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-emerald-100">
                    {title && (
                      <h3 className="text-xl font-bold text-gray-900">
                        {title}
                      </h3>
                    )}
                    
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-emerald-50 rounded-xl transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      </button>
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Modal Footer Component
export const ModalFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    <div className="flex items-center justify-end space-x-3">
      {children}
    </div>
  </div>
)

// Confirmation Modal Variant
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-6">
        <p className="text-gray-600">{message}</p>
        
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  )
}

export default Modal