// src/components/recommendations/LogicBuilder.jsx
import { useState } from 'react';
import Button from '../common/Button';
import {
  PlusIcon,
  TrashIcon,
  Cog6ToothIcon,
  PlayIcon,
  EyeIcon,
  BoltIcon,
  LightBulbIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const LogicBuilder = ({ onSave, onTest, onPreview, initialLogic = null }) => {
  const [logic, setLogic] = useState(initialLogic || {
    name: '',
    description: '',
    conditions: [{ type: 'symptom', operator: 'is', value: '' }],
    actions: [{ type: 'suggest', value: '' }],
    category: 'wellness',
    priority: 'medium',
    active: true
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const conditionTypes = [
    { value: 'symptom', label: 'Symptom', icon: '🩺' },
    { value: 'condition', label: 'Medical Condition', icon: '🏥' },
    { value: 'age', label: 'Age Group', icon: '👤' },
    { value: 'interaction', label: 'Drug Interaction', icon: '💊' },
    { value: 'allergy', label: 'Allergy', icon: '⚠️' },
    { value: 'soil', label: 'Soil Type', icon: '🌱' },
    { value: 'climate', label: 'Climate', icon: '☀️' }
  ];

  const operators = [
    { value: 'is', label: 'is', description: 'Equals exactly' },
    { value: 'is_not', label: 'is not', description: 'Does not equal' },
    { value: 'contains', label: 'contains', description: 'Includes value' },
    { value: 'greater_than', label: '>', description: 'Greater than' },
    { value: 'less_than', label: '<', description: 'Less than' },
    { value: 'between', label: 'between', description: 'Within range' }
  ];

  const actionTypes = [
    { value: 'suggest', label: 'Suggest Herb', icon: '🌿' },
    { value: 'warn', label: 'Show Warning', icon: '⚠️' },
    { value: 'recommend', label: 'Recommend Dosage', icon: '💊' },
    { value: 'avoid', label: 'Avoid Herb', icon: '❌' },
    { value: 'combine', label: 'Combine With', icon: '➕' }
  ];

  const categories = [
    { value: 'wellness', label: 'Wellness', color: 'emerald' },
    { value: 'cultivation', label: 'Cultivation', color: 'green' },
    { value: 'preparation', label: 'Preparation', color: 'blue' },
    { value: 'safety', label: 'Safety', color: 'red' },
    { value: 'traditional', label: 'Traditional Use', color: 'purple' }
  ];

  const priorities = [
    { value: 'high', label: 'High Priority', color: 'red' },
    { value: 'medium', label: 'Medium Priority', color: 'amber' },
    { value: 'low', label: 'Low Priority', color: 'emerald' }
  ];

  const symptomOptions = [
    'Anxiety', 'Insomnia', 'Fatigue', 'Pain', 'Inflammation',
    'Digestive Issues', 'Stress', 'Headache', 'Allergies', 'Skin Conditions'
  ];

  const herbOptions = [
    'Chamomile', 'Valerian Root', 'Ashwagandha', 'Turmeric', 'Ginger',
    'Peppermint', 'Lavender', 'Echinacea', 'Ginkgo Biloba', 'St. John\'s Wort'
  ];

  const handleAddCondition = () => {
    setLogic(prev => ({
      ...prev,
      conditions: [...prev.conditions, { type: 'symptom', operator: 'is', value: '' }]
    }));
  };

  const handleRemoveCondition = (index) => {
    setLogic(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateCondition = (index, field, value) => {
    setLogic(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const handleAddAction = () => {
    setLogic(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'suggest', value: '' }]
    }));
  };

  const handleRemoveAction = (index) => {
    setLogic(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateAction = (index, field, value) => {
    setLogic(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const handleTestLogic = async () => {
    setIsTesting(true);
    // Simulate API call
    setTimeout(() => {
      setTestResults({
        success: Math.random() > 0.3,
        matches: Math.floor(Math.random() * 1000),
        confidence: Math.floor(Math.random() * 30) + 70,
        suggestions: [
          'Rule syntax is valid',
          'No conflicting rules found',
          'Herb exists in database',
          'Dosage guidelines available'
        ]
      });
      setIsTesting(false);
    }, 1500);
  };

  const handleSave = () => {
    onSave?.(logic);
  };

  const getCategoryColor = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.color || 'gray';
  };

  const getPriorityColor = (priorityValue) => {
    const priority = priorities.find(p => p.value === priorityValue);
    return priority?.color || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Logic Builder</h3>
          <p className="text-gray-600 mt-1">Create automated suggestion rules based on traditional wisdom</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            icon={EyeIcon}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button
            variant="primary"
            icon={PlusIcon}
            onClick={handleSave}
          >
            Save Rule
          </Button>
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-2">Rule Preview</div>
              <div className="text-gray-600">How your rule will appear to users</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                  <LightBulbIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{logic.name || 'New Recommendation Rule'}</h4>
                  <p className="text-gray-600">{logic.description || 'Automated herbal suggestion'}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${getCategoryColor(logic.category)}-100 text-${getCategoryColor(logic.category)}-800`}>
                {categories.find(c => c.value === logic.category)?.label || 'Wellness'}
              </span>
            </div>

            {/* Logic Display */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-center space-x-4">
                {/* Conditions */}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 mb-2">IF</div>
                  {logic.conditions.map((condition, index) => {
                    const conditionType = conditionTypes.find(c => c.value === condition.type);
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 mb-2">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{conditionType?.icon || '🔍'}</span>
                          <span className="text-sm font-medium text-gray-900">{conditionType?.label || 'Condition'}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-sm text-gray-700">
                            {operators.find(o => o.value === condition.operator)?.label || 'is'}
                          </span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-sm font-semibold text-emerald-600">{condition.value || '[value]'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BoltIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">THEN</div>
                </div>

                {/* Actions */}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 mb-2">SUGGEST</div>
                  {logic.actions.map((action, index) => {
                    const actionType = actionTypes.find(a => a.value === action.type);
                    return (
                      <div key={index} className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-2">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{actionType?.icon || '🌿'}</span>
                          <span className="text-sm font-medium text-gray-900">{actionType?.label || 'Action'}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-sm font-semibold text-emerald-600">{action.value || '[herb]'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Rule Metadata */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Priority</div>
                <div className={`text-sm font-semibold text-${getPriorityColor(logic.priority)}-600 mt-1`}>
                  {priorities.find(p => p.value === logic.priority)?.label || 'Medium'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className={`text-sm font-semibold ${logic.active ? 'text-emerald-600' : 'text-gray-600'} mt-1`}>
                  {logic.active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500">Estimated Success</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">~85%</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={logic.name}
                  onChange={(e) => setLogic(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Insomnia Relief Recommendation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={logic.category}
                  onChange={(e) => setLogic(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={logic.description}
                  onChange={(e) => setLogic(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                  rows="2"
                  placeholder="Describe the purpose of this rule..."
                />
              </div>
            </div>
          </div>

          {/* Conditions Builder */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-gray-900">Conditions (IF)</h4>
              <Button
                size="sm"
                variant="outline"
                icon={PlusIcon}
                onClick={handleAddCondition}
              >
                Add Condition
              </Button>
            </div>

            <div className="space-y-4">
              {logic.conditions.map((condition, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={condition.type}
                        onChange={(e) => handleUpdateCondition(index, 'type', e.target.value)}
                        className="w-full text-sm rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {conditionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Operator
                      </label>
                      <select
                        value={condition.operator}
                        onChange={(e) => handleUpdateCondition(index, 'operator', e.target.value)}
                        className="w-full text-sm rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {operators.map(op => (
                          <option key={op.value} value={op.value}>
                            {op.label} ({op.description})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      {condition.type === 'symptom' ? (
                        <select
                          value={condition.value}
                          onChange={(e) => handleUpdateCondition(index, 'value', e.target.value)}
                          className="w-full text-sm rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select symptom...</option>
                          {symptomOptions.map(symptom => (
                            <option key={symptom} value={symptom}>
                              {symptom}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={condition.value}
                          onChange={(e) => handleUpdateCondition(index, 'value', e.target.value)}
                          className="w-full text-sm rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter value..."
                        />
                      )}
                    </div>
                  </div>
                  {logic.conditions.length > 1 && (
                    <button
                      onClick={() => handleRemoveCondition(index)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Cog6ToothIcon className="w-4 h-4 mr-2" />
              All conditions must be met (AND logic)
            </div>
          </div>

          {/* Actions Builder */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-gray-900">Actions (THEN)</h4>
              <Button
                size="sm"
                variant="outline"
                icon={PlusIcon}
                onClick={handleAddAction}
              >
                Add Action
              </Button>
            </div>

            <div className="space-y-4">
              {logic.actions.map((action, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Action Type
                      </label>
                      <select
                        value={action.type}
                        onChange={(e) => handleUpdateAction(index, 'type', e.target.value)}
                        className="w-full text-sm rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        {actionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      {action.type === 'suggest' ? (
                        <select
                          value={action.value}
                          onChange={(e) => handleUpdateAction(index, 'value', e.target.value)}
                          className="w-full text-sm rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Select herb...</option>
                          {herbOptions.map(herb => (
                            <option key={herb} value={herb}>
                              {herb}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={action.value}
                          onChange={(e) => handleUpdateAction(index, 'value', e.target.value)}
                          className="w-full text-sm rounded-lg border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter action value..."
                        />
                      )}
                    </div>
                  </div>
                  {logic.actions.length > 1 && (
                    <button
                      onClick={() => handleRemoveAction(index)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Rule Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="space-y-2">
                  {priorities.map(priority => (
                    <label key={priority.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={logic.priority === priority.value}
                        onChange={(e) => setLogic(prev => ({ ...prev, priority: e.target.value }))}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{priority.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={logic.active}
                      onChange={(e) => setLogic(prev => ({ ...prev, active: true }))}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={!logic.active}
                      onChange={(e) => setLogic(prev => ({ ...prev, active: false }))}
                      className="h-4 w-4 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Inactive (Draft)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testing
                </label>
                <Button
                  variant="outline"
                  icon={isTesting ? ArrowPathIcon : PlayIcon}
                  onClick={handleTestLogic}
                  loading={isTesting}
                  className="w-full"
                >
                  {isTesting ? 'Testing...' : 'Test Rule Logic'}
                </Button>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className={`bg-white border rounded-2xl p-6 ${
              testResults.success ? 'border-emerald-200' : 'border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {testResults.success ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-600 mr-3" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-600 mr-3" />
                  )}
                  <h4 className="font-semibold text-gray-900">
                    {testResults.success ? 'Test Passed' : 'Test Failed'}
                  </h4>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  Confidence: {testResults.confidence}%
                </div>
              </div>
              
              <div className="space-y-2">
                {testResults.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-1.5 mr-3 ${
                      testResults.success ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-600">{suggestion}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Estimated matches: <span className="font-medium text-gray-900">{testResults.matches}</span> records
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogicBuilder;