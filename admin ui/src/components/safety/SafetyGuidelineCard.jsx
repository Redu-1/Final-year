// src/components/safety/SafetyGuidelineCard.jsx
import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const SafetyGuidelineCard = ({ guideline, viewMode = 'card', onEdit, onDelete, onView, onDuplicate }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getGuidelineIcon = (type) => {
    switch (type) {
      case 'protocol':
        return DocumentTextIcon;
      case 'storage':
        return ShieldCheckIcon;
      case 'emergency':
        return ExclamationTriangleIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getGuidelineColor = (type) => {
    switch (type) {
      case 'protocol':
        return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
      case 'storage':
        return { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' };
      case 'emergency':
        return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const getAuthorityBadge = (authority) => {
    const authorityConfig = {
      'WHO-GLP': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'WHO-GLP' },
      'EMA Verified': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'EMA' },
      'MOH Internal': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'MOH' },
      'FDA Approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'FDA' },
      'Clinical Study': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Clinical' }
    };

    const config = authorityConfig[authority] || { bg: 'bg-gray-100', text: 'text-gray-800', label: authority };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        onEdit?.(guideline);
        break;
      case 'delete':
        onDelete?.(guideline);
        break;
      case 'view':
        onView?.(guideline);
        break;
      case 'duplicate':
        onDuplicate?.(guideline);
        break;
    }
  };

  const Icon = getGuidelineIcon(guideline.type);
  const color = getGuidelineColor(guideline.type);

  if (viewMode === 'compact') {
    return (
      <div 
        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`${color.bg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{guideline.title}</h4>
                {getAuthorityBadge(guideline.authority)}
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{guideline.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  Updated {guideline.updated}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  Version {guideline.version || '1.0'}
                </div>
              </div>
            </div>
          </div>
          <div className={`flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => handleAction('view', e)}
              className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
              title="View details"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleAction('edit', e)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Edit guideline"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white border ${color.border} rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`${color.bg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color.text}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{guideline.title}</h3>
                <div className="flex items-center space-x-2">
                  {getAuthorityBadge(guideline.authority)}
                  <StatusBadge status={guideline.status || 'active'} size="sm" />
                </div>
              </div>
              <p className="text-gray-600 mt-2">{guideline.description}</p>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Updated: <span className="font-medium text-gray-900">{guideline.updated}</span></span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Version: <span className="font-medium text-gray-900">{guideline.version || '1.0.0'}</span></span>
                </div>
                {guideline.applicableTo && (
                  <div className="flex items-center text-sm text-gray-500">
                    <UserGroupIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>For: <span className="font-medium text-gray-900">{guideline.applicableTo}</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {guideline.tags && guideline.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {guideline.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {expanded && guideline.content && (
        <div className="px-6 pb-6 border-t border-gray-200 pt-6">
          <div className="prose prose-sm max-w-none">
            <h4 className="font-medium text-gray-900 mb-3">Detailed Protocol</h4>
            <div className="text-gray-600 space-y-3">
              {guideline.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {guideline.sections && (
            <div className="mt-6 space-y-4">
              {guideline.sections.map((section, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">{section.title}</h5>
                  <p className="text-sm text-gray-600">{section.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* References */}
          {guideline.references && (
            <div className="mt-6">
              <h5 className="font-medium text-gray-900 mb-2">References</h5>
              <ul className="space-y-1">
                {guideline.references.map((ref, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between transition-opacity ${
        isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            icon={EyeIcon}
            onClick={(e) => handleAction('view', e)}
            className="text-gray-600 hover:text-gray-900"
          >
            View Details
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
            icon={DocumentDuplicateIcon}
            onClick={(e) => handleAction('duplicate', e)}
            className="text-purple-600 hover:text-purple-700"
          >
            Duplicate
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            icon={expanded ? ChevronUpIcon : ChevronDownIcon}
            onClick={() => setExpanded(!expanded)}
            className="text-gray-600 hover:text-gray-900"
          >
            {expanded ? 'Show Less' : 'Show More'}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-4 divide-x divide-gray-200 border-t border-gray-200">
        <div className="p-3 text-center">
          <div className="text-xs font-medium text-gray-500">Compliance</div>
          <div className="text-sm font-bold text-gray-900">98%</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xs font-medium text-gray-500">Updates</div>
          <div className="text-sm font-bold text-gray-900">{guideline.updateCount || '12'}</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xs font-medium text-gray-500">Cited</div>
          <div className="text-sm font-bold text-gray-900">{guideline.citationCount || '45'}</div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xs font-medium text-gray-500">Validation</div>
          <div className="text-sm font-bold text-emerald-600">Verified</div>
        </div>
      </div>
    </div>
  );
};

// Default props for the component
SafetyGuidelineCard.defaultProps = {
  guideline: {
    id: 1,
    title: 'General Preparation Protocols',
    description: 'Standardized boiling and infusion temperatures for aqueous extracts to preserve alkaloid stability.',
    authority: 'WHO-GLP',
    updated: '2 days ago',
    type: 'protocol',
    status: 'active',
    version: '2.1.0',
    applicableTo: 'All aqueous herbal extracts',
    tags: ['Preparation', 'Temperature Control', 'Alkaloids', 'Standardization'],
    content: 'Maintain water temperature between 85-95°C during extraction. Steep time should not exceed 15 minutes for delicate herbs. Always use distilled or purified water to prevent mineral interference.',
    sections: [
      {
        title: 'Temperature Guidelines',
        content: 'Different herbs require specific temperature ranges for optimal extraction.'
      },
      {
        title: 'Quality Control',
        content: 'Regular testing of pH and alkaloid concentration is mandatory.'
      }
    ],
    references: [
      'WHO Guidelines on Good Manufacturing Practices',
      'Pharmacopoeia Standards 2023',
      'Clinical Study: Extraction Efficiency (2022)'
    ],
    updateCount: 12,
    citationCount: 45
  }
};

export default SafetyGuidelineCard;