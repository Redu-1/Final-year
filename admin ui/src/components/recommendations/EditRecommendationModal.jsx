// src/components/recommendations/EditRecommendationModal.jsx
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, 
  Brain, 
  Leaf, 
  AlertCircle, 
  Check, 
  ChevronRight,
  FlaskConical,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Sprout,
  Shield,
  Heart,
  Zap,
  Activity,
  Moon,
  Bug,
  FileText,
  BookOpen,
  Save
} from 'lucide-react';

import Button from '../common/Button';
import Input from '../common/Input';

const EditRecommendationModal = ({ isOpen, onClose, onSave, rule }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    condition: '',
    conditionValue: 'present',
    herb: '',
    category: 'wellness',
    priority: 'medium',
    status: 'draft',
    logic: '',
    successCriteria: '',
    notes: '',
    triggerFrequency: 'always',
    alternativeHerbs: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});

  // Load rule data when modal opens
  useEffect(() => {
    if (isOpen && rule) {
      setFormData({
        name: rule.name || '',
        description: rule.description || '',
        condition: rule.condition || '',
        conditionValue: rule.conditionValue || 'present',
        herb: rule.herb || '',
        category: rule.category?.toLowerCase() || 'wellness',
        priority: rule.priority || 'medium',
        status: rule.status || 'draft',
        logic: rule.logic || '',
        successCriteria: rule.successCriteria || '',
        notes: rule.notes || '',
        triggerFrequency: rule.triggerFrequency || 'always',
        alternativeHerbs: rule.alternativeHerbs || ''
      });
      setErrors({});
      setActiveTab('basic');
    }
  }, [isOpen, rule]);

  const conditionOptions = [
    { value: 'insomnia', label: 'Insomnia', icon: Moon, category: 'wellness' },
    { value: 'fatigue', label: 'Fatigue', icon: Activity, category: 'wellness' },
    { value: 'anxiety', label: 'Anxiety', icon: Heart, category: 'wellness' },
    { value: 'inflammation', label: 'Inflammation', icon: Thermometer, category: 'wellness' },
    { value: 'dry-skin', label: 'Dry Skin', icon: Droplets, category: 'wellness' },
    { value: 'poor-soil', label: 'Poor Soil Quality', icon: Sprout, category: 'cultivation' },
    { value: 'pests', label: 'Pest Infestation', icon: Bug, category: 'cultivation' },
    { value: 'low-yield', label: 'Low Yield', icon: Sprout, category: 'cultivation' },
    { value: 'stress', label: 'Plant Stress', icon: Wind, category: 'cultivation' },
    { value: 'slow-growth', label: 'Slow Growth', icon: Sun, category: 'cultivation' }
  ];

  const conditionValueOptions = [
    { value: 'present', label: 'is present' },
    { value: 'severe', label: 'is severe' },
    { value: 'mild', label: 'is mild' },
    { value: 'chronic', label: 'is chronic' }
  ];

  const herbOptions = [
    { value: 'ashwagandha', label: 'Ashwagandha', category: 'wellness' },
    { value: 'valerian-root', label: 'Valerian Root', category: 'wellness' },
    { value: 'tulsi', label: 'Holy Basil (Tulsi)', category: 'wellness' },
    { value: 'comfrey', label: 'Comfrey', category: 'cultivation' },
    { value: 'nettle', label: 'Stinging Nettle', category: 'wellness' },
    { value: 'calendula', label: 'Calendula', category: 'cultivation' },
    { value: 'chamomile', label: 'Chamomile', category: 'wellness' },
    { value: 'lavender', label: 'Lavender', category: 'wellness' },
    { value: 'neem', label: 'Neem', category: 'cultivation' },
    { value: 'peppermint', label: 'Peppermint', category: 'preparation' },
    { value: 'echinacea', label: 'Echinacea', category: 'wellness' },
    { value: 'elderberry', label: 'Elderberry', category: 'wellness' }
  ];

  const categoryOptions = [
    { value: 'wellness', label: 'Wellness', color: 'bg-emerald-100 text-emerald-800', icon: Heart },
    { value: 'cultivation', label: 'Cultivation', color: 'bg-green-100 text-green-800', icon: Sprout },
    { value: 'preparation', label: 'Preparation', color: 'bg-blue-100 text-blue-800', icon: FlaskConical },
    { value: 'safety', label: 'Safety', color: 'bg-amber-100 text-amber-800', icon: Shield }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' }
  ];

  const frequencyOptions = [
    { value: 'always', label: 'Always recommend' },
    { value: 'once', label: 'Recommend once per user' },
    { value: 'daily', label: 'Daily recommendation' },
    { value: 'weekly', label: 'Weekly recommendation' },
    { value: 'monthly', label: 'Monthly recommendation' }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'conditions', label: 'Condition & Herb', icon: Leaf },
    { id: 'settings', label: 'Settings', icon: BookOpen }
  ];

  // Filter conditions based on selected category
  const filteredConditions = conditionOptions.filter(condition => {
    if (formData.category === 'wellness') {
      return condition.category === 'wellness';
    }
    if (formData.category === 'cultivation') {
      return condition.category === 'cultivation';
    }
    return true;
  });

  // Filter herbs based on selected category
  const filteredHerbs = herbOptions.filter(herb => {
    if (formData.category === 'wellness') {
      return herb.category === 'wellness';
    }
    if (formData.category === 'cultivation') {
      return herb.category === 'cultivation';
    }
    if (formData.category === 'preparation') {
      return herb.category === 'preparation' || herb.category === 'wellness';
    }
    return true;
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field === 'category') {
      setFormData(prev => ({
        ...prev,
        condition: '',
        herb: ''
      }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Rule name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.herb) newErrors.herb = 'Herb recommendation is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const conditionLabel = conditionOptions.find(c => c.value === formData.condition)?.label || formData.condition;
      const conditionValueLabel = conditionValueOptions.find(v => v.value === formData.conditionValue)?.label || 'is present';
      const herbLabel = herbOptions.find(h => h.value === formData.herb)?.label || formData.herb;
      
      const logic = `If ${conditionLabel} ${conditionValueLabel}\nSuggest ${herbLabel}`;
      
      const updatedRule = {
        ...rule,
        ...formData,
        logic,
        updatedAt: new Date().toISOString()
      };
      
      onSave(updatedRule);
      onClose();
    } catch (error) {
      console.error('Error updating rule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !rule) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Edit Recommendation Rule</h3>
                  <p className="text-sm text-emerald-50">Editing: {rule.name || `Rule #${rule.id}`}</p>
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
                  </button>
                );
              })}
            </nav>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
              
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rule Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Insomnia Relief Recommendation"
                      className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                      icon={FileText}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows="3"
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        shadow-sm resize-none
                        ${errors.description ? 'border-red-500' : 'border-gray-300'}
                      `}
                      placeholder="Describe when this rule should be triggered..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className={`
                          w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                          bg-white shadow-sm
                          ${errors.category ? 'border-red-500' : 'border-gray-300'}
                        `}
                      >
                        {categoryOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
                      >
                        {priorityOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Condition & Herb Tab */}
              {activeTab === 'conditions' && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-emerald-700 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Showing conditions and herbs for <span className="font-semibold mx-1">
                        {categoryOptions.find(c => c.value === formData.category)?.label || 'Wellness'}
                      </span> category
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trigger Condition <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <select
                          value={formData.condition}
                          onChange={(e) => handleChange('condition', e.target.value)}
                          className={`
                            w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                            bg-white shadow-sm
                            ${errors.condition ? 'border-red-500' : 'border-gray-300'}
                          `}
                        >
                          <option value="">Select a condition</option>
                          {filteredConditions.map(option => {
                            const Icon = option.icon;
                            return (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            );
                          })}
                        </select>
                        {errors.condition && (
                          <p className="mt-1 text-xs text-red-600 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.condition}
                          </p>
                        )}
                      </div>
                      <div>
                        <select
                          value={formData.conditionValue}
                          onChange={(e) => handleChange('conditionValue', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
                        >
                          {conditionValueOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recommended Herb <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.herb}
                      onChange={(e) => handleChange('herb', e.target.value)}
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                        bg-white shadow-sm
                        ${errors.herb ? 'border-red-500' : 'border-gray-300'}
                      `}
                    >
                      <option value="">Select a herb</option>
                      {filteredHerbs.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.herb && (
                      <p className="mt-1 text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.herb}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternative Herbs (Optional)
                    </label>
                    <Input
                      type="text"
                      value={formData.alternativeHerbs}
                      onChange={(e) => handleChange('alternativeHerbs', e.target.value)}
                      placeholder="e.g., Chamomile, Lavender"
                      icon={Leaf}
                    />
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trigger Frequency
                    </label>
                    <select
                      value={formData.triggerFrequency}
                      onChange={(e) => handleChange('triggerFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
                    >
                      {frequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Success Criteria
                    </label>
                    <textarea
                      value={formData.successCriteria}
                      onChange={(e) => handleChange('successCriteria', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                      placeholder="How to measure success of this recommendation..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                      placeholder="Any additional context or notes..."
                    />
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
                  className="px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Rule
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EditRecommendationModal;