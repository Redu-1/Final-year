// src/components/common/DeleteConfirmationModal.jsx
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';
import ReactDOM from 'react-dom';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, itemType = 'item' }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Delete {itemType}</h3>
                  <p className="text-sm text-red-50">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Are you absolutely sure?
            </h4>
            
            <p className="text-gray-600 text-center mb-6">
              This will permanently delete{' '}
              <span className="font-semibold text-gray-900">"{itemName}"</span> 
              {' '}and remove all associated data. This action cannot be reversed.
            </p>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={onConfirm}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
              >
                Delete {itemType}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default DeleteConfirmationModal;