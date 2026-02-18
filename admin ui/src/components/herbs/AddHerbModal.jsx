// src/components/herbs/AddHerbModal.jsx
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  Thermometer, 
  Droplets, 
  Shield, 
  Zap, 
  Sparkles, 
  Heart, 
  Pill, 
  Flower2, 
  Scissors,
  Search,
  X,
  Check,
  Leaf,
  Package,
  AlertCircle
} from 'lucide-react';

const AddHerbModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    commonName: '',
    scientificName: '',
    partsUsed: 'LEAVES',
    indigenousRegion: '',
    status: 'draft',
    description: '',
    medicinalUses: '',
    contraindications: '',
    dosage: '',
    preparation: '',
    storageInstructions: '',
    imageUrl: '',
    skinConditions: [],
    categories: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  // Skin conditions from screenshot
  const skinConditions = [
    { id: 'inflammation', name: 'Acute inflammation', icon: Thermometer, color: 'text-red-500' },
    { id: 'downsitis', name: 'Downsitis', icon: Droplets, color: 'text-blue-500' },
    { id: 'burrus', name: 'Burrus', icon: Shield, color: 'text-amber-500' },
    { id: 'itching', name: 'Itching', icon: Zap, color: 'text-purple-500' },
    { id: 'radical', name: 'Radical', icon: Sparkles, color: 'text-yellow-500' },
    { id: 'dry-skin', name: 'Dry Skin', icon: Droplets, color: 'text-sky-500' },
    { id: 'infections', name: 'Skin infections', icon: Shield, color: 'text-indigo-500' },
    { id: 'scars', name: 'Scars', icon: Heart, color: 'text-rose-500' },
    { id: 'prioritans', name: 'Prioritans', icon: Pill, color: 'text-emerald-500' },
    { id: 'aging', name: 'Aging Skin', icon: Flower2, color: 'text-pink-500' },
    { id: 'pain', name: 'Muscle Pain (Topical)', icon: Thermometer, color: 'text-orange-500' },
    { id: 'circulation', name: 'Circulation', icon: Zap, color: 'text-cyan-500' },
    { id: 'antiaspiric', name: 'Antiaspiric', icon: Shield, color: 'text-teal-500' },
    { id: 'neurothimans', name: 'Skin Neurithimans', icon: Pill, color: 'text-violet-500' },
    { id: 'irritations', name: 'Minor Irritations', icon: Zap, color: 'text-amber-500' },
    { id: 'hair', name: 'Hair Health', icon: Sparkles, color: 'text-lime-500' },
    { id: 'cuts', name: 'Minor Cuts', icon: Scissors, color: 'text-gray-500' },
  ];

  // Herb categories from screenshot
  const herbCategories = [
    { id: 'spices', name: 'Spices', color: 'bg-amber-100 text-amber-800' },
    { id: 'aromatic', name: 'Aromatic Herbs', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'seeds', name: 'Seeds', color: 'bg-amber-200 text-amber-900' },
    { id: 'medicinal', name: 'Medicinal Plants', color: 'bg-green-100 text-green-800' },
    { id: 'succulents', name: 'Succulents', color: 'bg-lime-100 text-lime-800' },
    { id: 'healing', name: 'Healing Plants', color: 'bg-emerald-200 text-emerald-900' },
    { id: 'resins', name: 'Resins', color: 'bg-orange-100 text-orange-800' },
    { id: 'vegetables', name: 'Vegetables', color: 'bg-red-100 text-red-800' },
    { id: 'grains', name: 'Grains', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'superfoods', name: 'Superfoods', color: 'bg-purple-100 text-purple-800' },
    { id: 'legumes', name: 'Legumes', color: 'bg-lime-200 text-lime-900' },
    { id: 'trees', name: 'Trees', color: 'bg-teal-100 text-teal-800' },
  ];

  const partsUsedOptions = [
    { value: 'LEAVES', label: 'Leaves', icon: Leaf },
    { value: 'ROOTS', label: 'Roots', icon: Package },
    { value: 'BARK', label: 'Bark', icon: Shield },
    { value: 'FLOWERS', label: 'Flowers', icon: Flower2 },
    { value: 'SEEDS', label: 'Seeds', icon: Sparkles },
    { value: 'FRUITS', label: 'Fruits', icon: Heart },
    { value: 'WHOLE_PLANT', label: 'Whole Plant', icon: Leaf },
    { value: 'RHIZOME', label: 'Rhizome', icon: Package },
    { value: 'SHRUB/LEAVES', label: 'Shrub/Leaves', icon: Leaf }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' }
  ];

  // Add blur effect to background dashboard only when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      
      // Add blur to the dashboard container (the parent container of your app content)
      // This targets the specific container that holds your dashboard, not the entire body
      const dashboardContent = document.querySelector('.dashboard-container, .app-content, main, #root > div:not(.modal-portal)');
      if (dashboardContent) {
        dashboardContent.classList.add('dashboard-blur');
      }
    } else {
      // Remove blur and restore scrolling
      document.body.style.overflow = 'unset';
      
      const dashboardContent = document.querySelector('.dashboard-container, .app-content, main, #root > div:not(.modal-portal)');
      if (dashboardContent) {
        dashboardContent.classList.remove('dashboard-blur');
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      const dashboardContent = document.querySelector('.dashboard-container, .app-content, main, #root > div:not(.modal-portal)');
      if (dashboardContent) {
        dashboardContent.classList.remove('dashboard-blur');
      }
    };
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleMultiSelect = (field, itemId) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(itemId)
        ? prev[field].filter(id => id !== itemId)
        : [...prev[field], itemId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.commonName.trim()) {
      newErrors.commonName = 'Common name is required';
    }
    if (!formData.scientificName.trim()) {
      newErrors.scientificName = 'Scientific name is required';
    }
    if (!formData.indigenousRegion.trim()) {
      newErrors.indigenousRegion = 'Indigenous region is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      if (errors.commonName || errors.scientificName || errors.indigenousRegion || errors.description) {
        setActiveTab('basic');
      } else if (errors.categories) {
        setActiveTab('categories');
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSave(formData);
      handleReset();
      onClose();
    } catch (error) {
      console.error('Error adding herb:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      commonName: '',
      scientificName: '',
      partsUsed: 'LEAVES',
      indigenousRegion: '',
      status: 'draft',
      description: '',
      medicinalUses: '',
      contraindications: '',
      dosage: '',
      preparation: '',
      storageInstructions: '',
      imageUrl: '',
      skinConditions: [],
      categories: []
    });
    setErrors({});
    setSearchTerm('');
    setCategorySearchTerm('');
  };

  const filteredSkinConditions = skinConditions.filter(condition =>
    condition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = herbCategories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: Leaf },
    { id: 'categories', label: 'Categories & Conditions', icon: Shield },
    { id: 'details', label: 'Details & Instructions', icon: Package },
  ];

  if (!isOpen) return null;

  // Modal content
  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop - only blurs the background, not the modal */}
      <div 
        className="fixed inset-0 bg-black/50"
        style={{ backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      
      {/* Modal - crisp and clear, no blur */}
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Add New Herb</h3>
                  <p className="text-sm text-emerald-50">Add a new herb to your digital pharmacopoeia</p>
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

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50/50 px-6">
            <nav className="flex -mb-px space-x-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                      transition-all duration-200
                      ${activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                    {tab.id === 'categories' && formData.categories.length > 0 && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {formData.categories.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Common Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.commonName}
                          onChange={(e) => handleChange('commonName', e.target.value)}
                          placeholder="e.g., Ashwagandha"
                          className={errors.commonName ? 'border-red-500 focus:ring-red-500' : ''}
                          icon={Leaf}
                          required
                        />
                        {errors.commonName && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.commonName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Scientific Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.scientificName}
                          onChange={(e) => handleChange('scientificName', e.target.value)}
                          placeholder="e.g., Withania somnifera"
                          className={errors.scientificName ? 'border-red-500 focus:ring-red-500' : ''}
                          required
                        />
                        {errors.scientificName && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.scientificName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Parts Used <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.partsUsed}
                          onChange={(e) => handleChange('partsUsed', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
                        >
                          {partsUsedOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Indigenous Region <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.indigenousRegion}
                          onChange={(e) => handleChange('indigenousRegion', e.target.value)}
                          placeholder="e.g., India, Middle East"
                          className={errors.indigenousRegion ? 'border-red-500 focus:ring-red-500' : ''}
                          required
                        />
                        {errors.indigenousRegion && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.indigenousRegion}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          rows="5"
                          className={`
                            w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                            shadow-sm resize-none
                            ${errors.description ? 'border-red-500' : 'border-gray-300'}
                          `}
                          placeholder="Brief description of the herb..."
                          required
                        />
                        {errors.description && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.description}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <div className="flex space-x-4 bg-gray-50 p-3 rounded-lg">
                          {statusOptions.map(option => (
                            <label key={option.value} className="flex items-center">
                              <input
                                type="radio"
                                name="status"
                                value={option.value}
                                checked={formData.status === option.value}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                              />
                              <span className={`ml-2 text-sm px-2 py-1 rounded-full ${option.color}`}>
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories & Skin Conditions Tab */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Herb Categories */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Herb Categories <span className="text-red-500">*</span>
                        </label>
                        {formData.categories.length > 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            {formData.categories.length} selected
                          </span>
                        )}
                      </div>
                      
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search categories..."
                          value={categorySearchTerm}
                          onChange={(e) => setCategorySearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                      </div>

                      <div className={`
                        border rounded-lg overflow-hidden
                        ${errors.categories ? 'border-red-500' : 'border-gray-200'}
                      `}>
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map(category => (
                              <label
                                key={category.id}
                                className={`
                                  flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer
                                  transition-colors duration-150
                                  ${formData.categories.includes(category.id) ? 'bg-emerald-50/50' : ''}
                                `}
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={formData.categories.includes(category.id)}
                                    onChange={() => handleMultiSelect('categories', category.id)}
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                  />
                                  <span className={`ml-3 text-sm px-2 py-1 rounded-full ${category.color}`}>
                                    {category.name}
                                  </span>
                                </div>
                                {formData.categories.includes(category.id) && (
                                  <Check className="h-4 w-4 text-emerald-600" />
                                )}
                              </label>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No categories found
                            </div>
                          )}
                        </div>
                      </div>
                      {errors.categories && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.categories}
                        </p>
                      )}
                    </div>

                    {/* Skin Conditions */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Skin Conditions Treated
                        </label>
                        {formData.skinConditions.length > 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            {formData.skinConditions.length} selected
                          </span>
                        )}
                      </div>

                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search conditions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                          {filteredSkinConditions.length > 0 ? (
                            filteredSkinConditions.map(condition => {
                              const IconComponent = condition.icon;
                              return (
                                <label
                                  key={condition.id}
                                  className={`
                                    flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer
                                    transition-colors duration-150
                                    ${formData.skinConditions.includes(condition.id) ? 'bg-emerald-50/50' : ''}
                                  `}
                                >
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={formData.skinConditions.includes(condition.id)}
                                      onChange={() => handleMultiSelect('skinConditions', condition.id)}
                                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <IconComponent className={`h-4 w-4 ml-3 mr-2 ${condition.color}`} />
                                    <span className="text-sm text-gray-700">{condition.name}</span>
                                  </div>
                                  {formData.skinConditions.includes(condition.id) && (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  )}
                                </label>
                              );
                            })
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No conditions found
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Select the skin conditions that this herb can help treat
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Details & Instructions Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medicinal Uses
                        </label>
                        <textarea
                          value={formData.medicinalUses}
                          onChange={(e) => handleChange('medicinalUses', e.target.value)}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                          placeholder="List key medicinal uses..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contraindications
                        </label>
                        <textarea
                          value={formData.contraindications}
                          onChange={(e) => handleChange('contraindications', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                          placeholder="Any known contraindications..."
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dosage
                        </label>
                        <Input
                          type="text"
                          value={formData.dosage}
                          onChange={(e) => handleChange('dosage', e.target.value)}
                          placeholder="e.g., 300-500mg/day"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <Input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => handleChange('imageUrl', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preparation Instructions
                        </label>
                        <textarea
                          value={formData.preparation}
                          onChange={(e) => handleChange('preparation', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                          placeholder="How to prepare the herb..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Storage Instructions
                        </label>
                        <textarea
                          value={formData.storageInstructions}
                          onChange={(e) => handleChange('storageInstructions', e.target.value)}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                          placeholder="How to store the herb..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="px-8 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Herb'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Use Portal to render modal at the root level, outside of the dashboard container
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default AddHerbModal;