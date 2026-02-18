// src/components/safety/ContraindicationCard.jsx
import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import {
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  UserIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ContraindicationCard = ({ data, viewMode = 'card', onEdit, onDelete, onView, onReport }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getRiskLevelConfig = (level) => {
    const configs = {
      high: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        iconBg: 'bg-red-500',
        border: 'border-red-200',
        icon: ShieldExclamationIcon
      },
      moderate: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        iconBg: 'bg-amber-500',
        border: 'border-amber-200',
        icon: ExclamationTriangleIcon
      },
      low: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        iconBg: 'bg-blue-500',
        border: 'border-blue-200',
        icon: ExclamationTriangleIcon
      }
    };
    return configs[level] || configs.moderate;
  };

  const getSeverityScore = (level) => {
    switch (level) {
      case 'high': return 9.5;
      case 'moderate': return 6.5;
      case 'low': return 3.5;
      default: return 5.0;
    }
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      'FDA Clinical Advisory': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'FDA' },
      'Cochrane Database': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Cochrane' },
      'ESC Guidelines': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'ESC' },
      'TGA Medical Alert': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'TGA' },
      'WHO Alert': { bg: 'bg-red-100', text: 'text-red-800', label: 'WHO' }
    };

    const config = sourceConfig[source] || { bg: 'bg-gray-100', text: 'text-gray-800', label: source };
    
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
        onEdit?.(data);
        break;
      case 'delete':
        onDelete?.(data);
        break;
      case 'view':
        onView?.(data);
        break;
      case 'report':
        onReport?.(data);
        break;
    }
  };

  const riskConfig = getRiskLevelConfig(data.riskLevel);
  const Icon = riskConfig.icon;
  const severityScore = getSeverityScore(data.riskLevel);

  if (viewMode === 'compact') {
    return (
      <div 
        className={`bg-white border ${riskConfig.border} rounded-xl p-4 hover:shadow-md transition-all duration-200`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`${riskConfig.bg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${riskConfig.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{data.title}</h4>
                <StatusBadge status={data.riskLevel} showIcon={false} size="sm" />
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{data.description}</p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-gray-500">ID: {data.riskId}</span>
                <span className="text-xs text-gray-500">{getSourceBadge(data.source)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => handleAction('view', e)}
            className={`p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            title="View details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white border ${riskConfig.border} rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`${riskConfig.bg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${riskConfig.text}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3>
                    <StatusBadge status={data.riskLevel} />
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      ID: {data.riskId}
                    </span>
                    {getSourceBadge(data.source)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{severityScore.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Severity Score</div>
                </div>
              </div>
              
              <p className="text-gray-600 mt-4">{data.description}</p>
              
              {/* Mechanism of Action */}
              {data.mechanism && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Mechanism</h4>
                  <p className="text-sm text-gray-600">{data.mechanism}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500">Reported Cases</div>
            <div className="text-lg font-bold text-gray-900 mt-1">{data.reportedCases || '142'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500">Severity Index</div>
            <div className="text-lg font-bold text-gray-900 mt-1">{data.severityIndex || '8.2/10'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500">Last Updated</div>
            <div className="text-lg font-bold text-gray-900 mt-1">{data.lastUpdated || 'Jan 2024'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500">Validation Status</div>
            <div className="text-lg font-bold text-emerald-600 mt-1">{data.validationStatus || 'Verified'}</div>
          </div>
        </div>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
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

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-200 pt-6">
          {/* Clinical Evidence */}
          {data.evidence && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Clinical Evidence</h4>
              <div className="space-y-3">
                {data.evidence.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-2 h-2 ${riskConfig.iconBg} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                    <div>
                      <p className="text-sm text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      {item.reference && (
                        <p className="text-xs text-gray-500 mt-1">Reference: {item.reference}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Management Guidelines */}
          {data.management && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Management Guidelines</h4>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Recommended Actions:</p>
                    <ul className="mt-2 space-y-1">
                      {data.management.map((action, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alternative Options */}
          {data.alternatives && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Safer Alternatives</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.alternatives.map((alt, index) => (
                  <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-800">{alt.name}</span>
                      <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                        {alt.safetyLevel}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">{alt.description}</p>
                  </div>
                ))}
              </div>
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
            View Full Report
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon={DocumentTextIcon}
            onClick={(e) => handleAction('report', e)}
            className="text-blue-600 hover:text-blue-700"
          >
            Generate Report
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
            {expanded ? 'Show Less' : 'Clinical Details'}
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
    </div>
  );
};

// Default props for the component
ContraindicationCard.defaultProps = {
  data: {
    id: 1,
    title: "St. John's Wort + SSRIs",
    description: "Severe risk of Serotonin Syndrome. May inhibit cytochrome P450 enzymes leading to toxicity.",
    riskLevel: "high",
    riskId: "CN-9921",
    source: "FDA Clinical Advisory",
    mechanism: "Inhibition of cytochrome P450 enzymes (CYP3A4, CYP2C9) leading to increased serotonin levels in the CNS.",
    reportedCases: 142,
    severityIndex: "8.2/10",
    lastUpdated: "Jan 2024",
    validationStatus: "Verified",
    tags: ["Drug Interaction", "Serotonin Syndrome", "CYP450", "SSRI"],
    evidence: [
      {
        title: "Clinical Study (2022)",
        description: "45% increase in serotonin levels observed in combined use.",
        reference: "J Clin Psychopharmacol 2022;42:123-130"
      },
      {
        title: "Case Reports",
        description: "24 documented cases of serotonin syndrome requiring hospitalization.",
        reference: "FDA Adverse Event Database"
      }
    ],
    management: [
      "Avoid concurrent use",
      "Monitor for serotonin syndrome symptoms",
      "Discontinue St. John's Wort 2 weeks before starting SSRIs",
      "Educate patients about risks"
    ],
    alternatives: [
      {
        name: "Saffron",
        safetyLevel: "Low Risk",
        description: "Mild antidepressant properties with minimal interaction risk"
      },
      {
        name: "Lavender",
        safetyLevel: "Very Safe",
        description: "Anxiolytic effects without significant drug interactions"
      }
    ]
  }
};

export default ContraindicationCard;