// src/components/recommendations/ViewRecommendationModal.jsx
import { X, Brain, Leaf, AlertCircle, Check, Sprout,ChevronRight, Heart, Clock, Tag, Target, Activity, Moon, Droplets, Thermometer, Wind, Sun, Bug, FlaskConical, Shield } from 'lucide-react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';

const ViewRecommendationModal = ({ isOpen, onClose, rule }) => {
  if (!isOpen || !rule) return null;

  const categoryColors = {
    wellness: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: Heart },
    cultivation: { bg: 'bg-green-100', text: 'text-green-800', icon: Sprout },
    preparation: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FlaskConical },
    safety: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Shield }
  };

  const conditionIcons = {
    insomnia: { icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    fatigue: { icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
    anxiety: { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
    inflammation: { icon: Thermometer, color: 'text-red-600', bg: 'bg-red-100' },
    'dry-skin': { icon: Droplets, color: 'text-sky-600', bg: 'bg-sky-100' },
    'poor-soil': { icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    pests: { icon: Bug, color: 'text-amber-600', bg: 'bg-amber-100' },
    'low-yield': { icon: Sprout, color: 'text-lime-600', bg: 'bg-lime-100' },
    stress: { icon: Wind, color: 'text-teal-600', bg: 'bg-teal-100' },
    'slow-growth': { icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-100' }
  };

  const category = categoryColors[rule.category?.toLowerCase()] || categoryColors.wellness;
  const CategoryIcon = category.icon;
  const ConditionIcon = conditionIcons[rule.condition]?.icon || AlertCircle;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Recommendation Rule Details</h3>
                  <p className="text-sm text-emerald-50">{rule.name || `Rule #${rule.id}`}</p>
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
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              
              {/* Status & Category */}
              <div className="flex items-center justify-between">
                <StatusBadge status={rule.status} size="lg" />
                <div className={`flex items-center px-3 py-1.5 rounded-full ${category.bg}`}>
                  <CategoryIcon className={`w-4 h-4 ${category.text} mr-2`} />
                  <span className={`text-sm font-medium ${category.text}`}>
                    {rule.category}
                  </span>
                </div>
              </div>

              {/* Rule Name */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center text-gray-500 text-xs font-medium mb-1">
                  <Tag className="w-3 h-3 mr-1" />
                  RULE NAME
                </div>
                <p className="text-lg font-semibold text-gray-900">{rule.name || 'Untitled Rule'}</p>
              </div>

              {/* Logic Definition */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-emerald-600 mr-2" />
                  Logic Definition
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <ConditionIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">IF CONDITION</p>
                      <p className="text-sm font-medium text-gray-900">
                        {rule.condition ? 
                          (rule.condition.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')) : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {rule.conditionValue || 'is present'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="flex items-start p-3 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Sprout className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">RECOMMEND</p>
                      <p className="text-sm font-medium text-gray-900">
                        {rule.herb ? 
                          rule.herb.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ') : 'N/A'}
                      </p>
                      {rule.alternativeHerbs && (
                        <p className="text-xs text-gray-500 mt-1">
                          Alternatives: {rule.alternativeHerbs}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {rule.description && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center text-gray-500 text-xs font-medium mb-1">
                    <Clock className="w-3 h-3 mr-1" />
                    DESCRIPTION
                  </div>
                  <p className="text-sm text-gray-700">{rule.description}</p>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {rule.successRate ? `${rule.successRate}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                  {rule.successRate && (
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          rule.successRate >= 80 ? 'bg-emerald-500' :
                          rule.successRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        } rounded-full`}
                        style={{ width: `${rule.successRate}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {rule.totalTriggers?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-500">Total Triggers</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {rule.lastTriggered?.split(' ')[0] || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">Last Triggered</div>
                </div>
              </div>

              {/* Success Criteria */}
              {rule.successCriteria && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center text-gray-500 text-xs font-medium mb-1">
                    <Target className="w-3 h-3 mr-1" />
                    SUCCESS CRITERIA
                  </div>
                  <p className="text-sm text-gray-700">{rule.successCriteria}</p>
                </div>
              )}

              {/* Trigger Frequency */}
              {rule.triggerFrequency && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center text-gray-500 text-xs font-medium mb-1">
                    <Clock className="w-3 h-3 mr-1" />
                    TRIGGER FREQUENCY
                  </div>
                  <p className="text-sm text-gray-700">
                    {rule.triggerFrequency === 'always' ? 'Always recommend' :
                     rule.triggerFrequency === 'once' ? 'Recommend once per user' :
                     rule.triggerFrequency === 'daily' ? 'Daily recommendation' :
                     rule.triggerFrequency === 'weekly' ? 'Weekly recommendation' :
                     rule.triggerFrequency === 'monthly' ? 'Monthly recommendation' : rule.triggerFrequency}
                  </p>
                </div>
              )}

              {/* Additional Notes */}
              {rule.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center text-gray-500 text-xs font-medium mb-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    ADDITIONAL NOTES
                  </div>
                  <p className="text-sm text-gray-700">{rule.notes}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Created: {rule.createdAt ? new Date(rule.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <div>ID: {rule.id}</div>
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
};

export default ViewRecommendationModal;