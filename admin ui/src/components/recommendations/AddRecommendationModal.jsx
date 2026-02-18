// src/components/recommendations/AddRecommendationModal.jsx
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
  Target,
  BookOpen
} from 'lucide-react';

import Button from '../common/Button';
import Input from '../common/Input';

const AddRecommendationModal = ({ isOpen, onClose, onSave }) => {
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
    userFeedback: '',
    alternativeHerbs: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
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
        userFeedback: '',
        alternativeHerbs: ''
      });
      setErrors({});
      setActiveStep(1);
      setIsSubmitting(false);
    }
  }, [isOpen]);

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
    // Clear condition and herb when category changes
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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Rule name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category) newErrors.category = 'Category is required';
    }
    
    if (step === 2) {
      if (!formData.condition) newErrors.condition = 'Condition is required';
      if (!formData.herb) newErrors.herb = 'Herb recommendation is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepClick = (stepId) => {
    // Only allow clicking on steps that are accessible
    if (stepId < activeStep) {
      // Can go back to previous steps without validation
      setActiveStep(stepId);
    } else if (stepId > activeStep) {
      // Need to validate current step before moving forward
      if (validateStep(activeStep)) {
        setActiveStep(stepId);
      }
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
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
      setActiveStep(1);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const conditionLabel = conditionOptions.find(c => c.value === formData.condition)?.label || formData.condition;
      const conditionValueLabel = conditionValueOptions.find(v => v.value === formData.conditionValue)?.label || 'is present';
      const herbLabel = herbOptions.find(h => h.value === formData.herb)?.label || formData.herb;
      
      const logic = `If ${conditionLabel} ${conditionValueLabel}\nSuggest ${herbLabel}`;
      
      const newRule = {
        id: Date.now(),
        ...formData,
        logic,
        status: formData.status || 'draft',
        successRate: null,
        totalTriggers: 0,
        lastTriggered: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onSave(newRule);
      onClose();
    } catch (error) {
      console.error('Error creating rule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, name: 'Basic Info', icon: Brain },
    { id: 2, name: 'Condition & Herb', icon: Leaf },
    { id: 3, name: 'Review', icon: Check }
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header - Emerald Green */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Create Recommendation Rule</h3>
                  <p className="text-sm text-emerald-50">Define automated herb suggestions</p>
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

          {/* Progress Steps - NOW CLICKABLE */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                const isComplete = activeStep > step.id;
                const isClickable = step.id <= activeStep || step.id === activeStep + 1;
                
                return (
                  <div 
                    key={step.id} 
                    className="flex items-center flex-1"
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div className="flex items-center cursor-pointer group">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                        ${isActive ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 
                          isComplete ? 'bg-emerald-500 text-white' : 
                          'bg-gray-200 text-gray-500 group-hover:bg-gray-300'}
                      `}>
                        {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className={`
                        ml-2 text-sm font-medium hidden sm:block transition-colors
                        ${isActive ? 'text-emerald-600' : 
                          isComplete ? 'text-emerald-600' : 
                          'text-gray-500 group-hover:text-gray-700'}
                      `}>
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight className="h-5 w-5 mx-4 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
              
              {/* STEP 1: Basic Information */}
              {activeStep === 1 && (
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

              {/* STEP 2: Condition & Herb */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-emerald-700 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Showing conditions and herbs for <span className="font-semibold mx-1">
                        {categoryOptions.find(c => c.value === formData.category)?.label || 'Wellness'}
                      </span> category
                    </p>
                  </div>

                  {/* Trigger Condition */}
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

                  {/* Recommended Herb */}
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

                  {/* Alternative Herbs */}
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
                    <p className="mt-1 text-xs text-gray-500">
                      Comma-separated list of alternative herbs
                    </p>
                  </div>

                  {/* Trigger Frequency */}
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

                  {/* Success Criteria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Success Criteria
                    </label>
                    <textarea
                      value={formData.successCriteria}
                      onChange={(e) => handleChange('successCriteria', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                      placeholder="How to measure success of this recommendation (e.g., user feedback rating > 4/5, 80% satisfaction rate)"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Review */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  {/* Rule Preview */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Brain className="h-5 w-5 text-emerald-600 mr-2" />
                      Rule Preview
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                          <AlertCircle className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">If Condition Met</p>
                          <p className="text-sm text-gray-600">
                            {formData.condition ? 
                              conditionOptions.find(c => c.value === formData.condition)?.label || formData.condition 
                              : '[Select condition]'}
                            {' '}
                            {formData.conditionValue ? 
                              conditionValueOptions.find(v => v.value === formData.conditionValue)?.label || ''
                              : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex items-center p-3 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                          <Sprout className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Recommend Herb</p>
                          <p className="text-sm text-gray-600">
                            {formData.herb ? 
                              herbOptions.find(h => h.value === formData.herb)?.label || formData.herb 
                              : '[Select herb]'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editable Fields Section */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="h-4 w-4 text-emerald-600 mr-2" />
                      Rule Configuration
                    </h4>
                    
                    {/* Rule Name - Editable */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Rule Name
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="text-sm"
                        icon={FileText}
                      />
                    </div>

                    {/* Description - Editable */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Category - Editable */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleChange('category', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        >
                          {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Priority - Editable */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Priority
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => handleChange('priority', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        >
                          {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Condition - Editable */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Condition
                        </label>
                        <select
                          value={formData.condition}
                          onChange={(e) => handleChange('condition', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        >
                          <option value="">Select condition</option>
                          {filteredConditions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Herb - Editable */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Recommended Herb
                        </label>
                        <select
                          value={formData.herb}
                          onChange={(e) => handleChange('herb', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        >
                          <option value="">Select herb</option>
                          {filteredHerbs.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Success Criteria - Editable */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Success Criteria
                      </label>
                      <textarea
                        value={formData.successCriteria}
                        onChange={(e) => handleChange('successCriteria', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm resize-none"
                        placeholder="How to measure success..."
                      />
                    </div>

                    {/* Status - Editable */}
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                      >
                        <option value="draft">Save as Draft</option>
                        <option value="active">Publish Active</option>
                        <option value="pending">Submit for Review</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Notes - Editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows="2"
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
                
                {activeStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="px-6"
                  >
                    Back
                  </Button>
                )}
                
                {activeStep < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    Continue
                  </Button>
                ) : (
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
                        Creating...
                      </>
                    ) : (
                      'Create Rule'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AddRecommendationModal;