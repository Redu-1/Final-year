// src/components/recommendations/RuleCard.jsx
import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import {
  LightBulbIcon,
  ChartBarIcon,
  BoltIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  PlayIcon,
  StopIcon,
  ArrowsRightLeftIcon,
  TagIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const RuleCard = ({ rule, viewMode = 'table', onEdit, onDelete, onView, onDuplicate, onToggle, onTest }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      wellness: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: LightBulbIcon },
      cultivation: { bg: 'bg-green-100', text: 'text-green-800', icon: BoltIcon },
      preparation: { bg: 'bg-blue-100', text: 'text-blue-800', icon: ArrowsRightLeftIcon },
      safety: { bg: 'bg-red-100', text: 'text-red-800', icon: TagIcon },
      default: { bg: 'bg-gray-100', text: 'text-gray-800', icon: LightBulbIcon }
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const formatCondition = (condition) => {
    if (!condition) return 'N/A';
    return condition.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatHerb = (herb) => {
    if (!herb) return 'N/A';
    return herb.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    e.preventDefault();
    switch (action) {
      case 'edit':
        onEdit?.(rule);
        break;
      case 'delete':
        onDelete?.(rule);
        break;
      case 'view':
        onView?.(rule);
        break;
      case 'duplicate':
        onDuplicate?.(rule);
        break;
      case 'toggle':
        onToggle?.(rule);
        break;
      case 'test':
        onTest?.(rule);
        break;
    }
  };

  const categoryColor = getCategoryColor(rule.category);
  const CategoryIcon = categoryColor.icon;

  if (viewMode === 'card') {
    return (
      <div 
        className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${categoryColor.bg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <CategoryIcon className={`w-5 h-5 ${categoryColor.text}`} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={rule.status} size="sm" />
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColor.bg} ${categoryColor.text}`}>
                    {rule.category}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">ID: {rule.id}</div>
              </div>
            </div>
            <div className={`flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={(e) => handleAction('toggle', e)}
                className={`p-1 rounded-lg ${rule.status === 'active' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}
                title={rule.status === 'active' ? 'Deactivate' : 'Activate'}
              >
                {rule.status === 'active' ? (
                  <StopIcon className="w-4 h-4" />
                ) : (
                  <PlayIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">{rule.name || `Rule #${rule.id}`}</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-mono text-gray-800 whitespace-pre-line">
                {rule.logic || `If ${formatCondition(rule.condition)} ${rule.conditionValue || 'is present'}\nSuggest ${formatHerb(rule.herb)}`}
              </div>
            </div>
          </div>

          {/* Stats - Success Rate REMOVED, now only Total Triggers and Last Trigger */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {rule.totalTriggers?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-500">Total Triggers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {rule.lastTriggered ? rule.lastTriggered.split(' ')[0] : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Last Trigger</div>
            </div>
          </div>

          {/* Success Rate Bar - REMOVED */}

          {/* Actions */}
          <div className={`flex items-center justify-between pt-4 border-t border-gray-200 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <Button
              size="sm"
              variant="ghost"
              icon={EyeIcon}
              onClick={(e) => handleAction('view', e)}
              className="text-gray-600 hover:text-gray-900"
            >
              Details
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={PencilIcon}
              onClick={(e) => handleAction('edit', e)}
              className="text-blue-600 hover:text-blue-700"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={TrashIcon}
              onClick={(e) => handleAction('delete', e)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              Created {rule.createdAt ? new Date(rule.createdAt).toLocaleDateString() : 'Oct 2023'}
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              {expanded ? 'Less' : 'More'}
              {expanded ? (
                <ChevronUpIcon className="w-3 h-3 ml-1" />
              ) : (
                <ChevronDownIcon className="w-3 h-3 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3">
              {rule.description && (
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Description</h5>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
              )}
              {rule.successCriteria && (
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Success Criteria</h5>
                  <p className="text-sm text-gray-600">{rule.successCriteria}</p>
                </div>
              )}
              {rule.notes && (
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Notes</h5>
                  <p className="text-sm text-gray-600">{rule.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Table View (default) - Success Rate Column REMOVED
  return (
    <tr 
      className={`hover:bg-gray-50 transition-colors ${rule.status === 'draft' ? 'bg-gray-50/50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={rule.status} />
      </td>

      {/* Logic Definition */}
      <td className="px-6 py-4">
        <div className="flex items-start">
          <div className={`${categoryColor.bg} w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
            <CategoryIcon className={`w-4 h-4 ${categoryColor.text}`} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              {rule.name || `Rule #${rule.id}`}
            </div>
            <div className="text-sm text-gray-600">
              If {formatCondition(rule.condition)} {rule.conditionValue || 'is present'}
            </div>
            <div className="text-sm text-emerald-600 font-medium">
              Then {formatHerb(rule.herb)}
            </div>
            {rule.description && (
              <div className="text-xs text-gray-500 mt-1">{rule.description}</div>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}>
          {rule.category}
        </span>
      </td>

      {/* SUCCESS RATE COLUMN - COMPLETELY REMOVED */}

      {/* Total Triggers */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <ChartBarIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">
            {rule.totalTriggers?.toLocaleString() || '0'}
          </span>
        </div>
        {rule.lastTriggered && (
          <div className="text-xs text-gray-500 mt-1">
            Last: {rule.lastTriggered}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => handleAction('view', e)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
            title="View details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleAction('edit', e)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit rule"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleAction('duplicate', e)}
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
            title="Duplicate rule"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleAction('delete', e)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete rule"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Default props for the component - Success Rate REMOVED from default props
RuleCard.defaultProps = {
  rule: {
    id: 1,
    name: 'Insomnia Relief',
    status: 'active',
    condition: 'insomnia',
    conditionValue: 'present',
    herb: 'valerian-root',
    action: 'Suggest Valerian Root',
    logic: 'If Symptom is Insomnia\nSuggest Valerian Root',
    category: 'WELLNESS',
    totalTriggers: 1248,
    lastTriggered: '2 hours ago',
    createdAt: '2024-01-01T00:00:00.000Z',
    description: 'For mild to moderate insomnia cases'
  }
};

export default RuleCard;