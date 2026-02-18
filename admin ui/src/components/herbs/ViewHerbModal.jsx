// src/components/herbs/ViewHerbModal.jsx
import { X, Leaf, MapPin, Tag, Clock, Flower2, Shield, Droplets, Zap, Sparkles, Heart, Pill, Thermometer, Scissors, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import ReactDOM from 'react-dom';

const ViewHerbModal = ({ isOpen, onClose, herb }) => {
  if (!isOpen || !herb) return null;

  const skinConditionsIcons = {
    inflammation: { icon: Thermometer, color: 'text-red-500', bg: 'bg-red-50' },
    downsitis: { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    burrus: { icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50' },
    itching: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
    radical: { icon: Sparkles, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    'dry-skin': { icon: Droplets, color: 'text-sky-500', bg: 'bg-sky-50' },
    infections: { icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    scars: { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    prioritans: { icon: Pill, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    aging: { icon: Flower2, color: 'text-pink-500', bg: 'bg-pink-50' },
    pain: { icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
    circulation: { icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    antiaspiric: { icon: Shield, color: 'text-teal-500', bg: 'bg-teal-50' },
    neurothimans: { icon: Pill, color: 'text-violet-500', bg: 'bg-violet-50' },
    irritations: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    hair: { icon: Sparkles, color: 'text-lime-500', bg: 'bg-lime-50' },
    cuts: { icon: Scissors, color: 'text-gray-500', bg: 'bg-gray-50' },
  };

  const categoryColors = {
    spices: 'bg-amber-100 text-amber-800',
    aromatic: 'bg-emerald-100 text-emerald-800',
    seeds: 'bg-amber-200 text-amber-900',
    medicinal: 'bg-green-100 text-green-800',
    succulents: 'bg-lime-100 text-lime-800',
    healing: 'bg-emerald-200 text-emerald-900',
    resins: 'bg-orange-100 text-orange-800',
    vegetables: 'bg-red-100 text-red-800',
    grains: 'bg-yellow-100 text-yellow-800',
    superfoods: 'bg-purple-100 text-purple-800',
    legumes: 'bg-lime-200 text-lime-900',
    trees: 'bg-teal-100 text-teal-800',
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Semi-transparent backdrop - NO BLUR HERE */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Herb Details</h3>
                  <p className="text-sm text-emerald-50">Complete information about {herb.commonName}</p>
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
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            <div className="space-y-8">
              
              {/* Status Badge */}
              <div className="flex justify-end">
                <StatusBadge status={herb.status} size="lg" />
              </div>

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Leaf className="h-5 w-5 text-emerald-500 mr-2" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Common Name</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{herb.commonName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Scientific Name</label>
                    <p className="mt-1 text-lg italic text-gray-700">{herb.scientificName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Parts Used</label>
                    <p className="mt-1 text-gray-900 font-medium">{herb.partsUsed}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Indigenous Region</label>
                    <p className="mt-1 text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {herb.indigenousRegion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-gray-700 leading-relaxed">{herb.description}</p>
              </div>

              {/* Categories */}
              {herb.categories && herb.categories.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Tag className="h-5 w-5 text-emerald-500 mr-2" />
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {herb.categories.map((categoryId) => (
                      <span
                        key={categoryId}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          categoryColors[categoryId] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skin Conditions */}
              {herb.skinConditions && herb.skinConditions.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                    Skin Conditions Treated
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {herb.skinConditions.map((conditionId) => {
                      const condition = skinConditionsIcons[conditionId];
                      const IconComponent = condition?.icon || Shield;
                      return (
                        <div
                          key={conditionId}
                          className={`flex items-center p-3 rounded-lg ${condition?.bg || 'bg-gray-50'}`}
                        >
                          <IconComponent className={`h-5 w-5 mr-2 ${condition?.color || 'text-gray-500'}`} />
                          <span className="text-sm font-medium text-gray-700">
                            {conditionId.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Medicinal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {herb.medicinalUses && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Medicinal Uses</h4>
                    <p className="text-gray-700 whitespace-pre-line">{herb.medicinalUses}</p>
                  </div>
                )}

                {herb.contraindications && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      Contraindications
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line">{herb.contraindications}</p>
                  </div>
                )}
              </div>

              {/* Preparation & Storage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {herb.dosage && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Dosage</h4>
                    <p className="text-gray-700">{herb.dosage}</p>
                  </div>
                )}

                {herb.preparation && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Preparation</h4>
                    <p className="text-gray-700 whitespace-pre-line">{herb.preparation}</p>
                  </div>
                )}

                {herb.storageInstructions && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Storage</h4>
                    <p className="text-gray-700 whitespace-pre-line">{herb.storageInstructions}</p>
                  </div>
                )}
              </div>

              {/* Image */}
              {herb.imageUrl && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Herb Image</h4>
                  <img 
                    src={herb.imageUrl} 
                    alt={herb.commonName}
                    className="max-h-64 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Added by: {herb.addedBy || 'System'}</span>
                </div>
                <span>Created: {herb.createdAt ? new Date(herb.createdAt).toLocaleDateString() : herb.lastUpdated || 'N/A'}</span>
                <span>ID: {herb.id}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ViewHerbModal;