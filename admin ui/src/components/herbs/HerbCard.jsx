// src/components/herbs/HerbCard.jsx
import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { 
  BookOpenIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const HerbCard = ({ herb, viewMode = 'grid', onEdit, onDelete, onView, onDuplicate }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    published: 'emerald',
    draft: 'blue',
    pending: 'amber',
    archived: 'gray'
  };

 // Update the handleAction function in HerbCard.jsx
const handleAction = (action, e) => {
  e.stopPropagation();
  switch (action) {
    case 'edit':
      onEdit?.(herb); // This should open EditHerbModal with the herb data
      break;
    case 'delete':
      onDelete?.(herb); // This should open your delete confirmation modal
      break;
    case 'view':
      onView?.(herb); // This should open ViewHerbModal with the herb data
      break;
    case 'duplicate':
      onDuplicate?.(herb);
      break;
  }
};

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between">
          {/* Left Section */}
          <div className="flex-1 flex items-start space-x-4">
            {/* Herb Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              herb.status === 'published' ? 'bg-emerald-100' :
              herb.status === 'draft' ? 'bg-blue-100' :
              'bg-amber-100'
            }`}>
              <BookOpenIcon className={`w-6 h-6 ${
                herb.status === 'published' ? 'text-emerald-600' :
                herb.status === 'draft' ? 'text-blue-600' :
                'text-amber-600'
              }`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{herb.commonName}</h3>
                  <p className="text-sm text-gray-500 italic mt-1">{herb.scientificName}</p>
                </div>
                <StatusBadge status={herb.status} />
              </div>

              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <TagIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{herb.partsUsed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{herb.indigenousRegion}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Updated {herb.lastUpdated}</span>
                </div>
                <div className="text-right md:text-left">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    ID: {herb.id}
                  </span>
                </div>
              </div>

              {herb.description && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{herb.description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={`ml-4 flex items-center space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              size="sm"
              variant="ghost"
              icon={EyeIcon}
              onClick={(e) => handleAction('view', e)}
              title="View details"
            />
            <Button
              size="sm"
              variant="ghost"
              icon={PencilIcon}
              onClick={(e) => handleAction('edit', e)}
              title="Edit herb"
            />
            <Button
              size="sm"
              variant="ghost"
              icon={DocumentDuplicateIcon}
              onClick={(e) => handleAction('duplicate', e)}
              title="Duplicate"
            />
            <Button
              size="sm"
              variant="ghost"
              icon={TrashIcon}
              onClick={(e) => handleAction('delete', e)}
              title="Delete herb"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            />
          </div>
        </div>

        {/* Expandable Section */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Traditional Uses</h4>
                <ul className="space-y-1">
                  {herb.uses?.slice(0, 3).map((use, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2"></span>
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Properties</h4>
                <div className="flex flex-wrap gap-2">
                  {herb.properties?.slice(0, 4).map((prop, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700"
        >
          {expanded ? (
            <>
              <ChevronUpIcon className="w-4 h-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4 mr-1" />
              Show More Details
            </>
          )}
        </button>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            herb.status === 'published' ? 'bg-emerald-100' :
            herb.status === 'draft' ? 'bg-blue-100' :
            'bg-amber-100'
          }`}>
            <BookOpenIcon className={`w-5 h-5 ${
              herb.status === 'published' ? 'text-emerald-600' :
              herb.status === 'draft' ? 'text-blue-600' :
              'text-amber-600'
            }`} />
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={herb.status} size="sm" />
            <span className="text-xs text-gray-500">ID: {herb.id}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mt-4">{herb.commonName}</h3>
        <p className="text-sm text-gray-500 italic mt-1">{herb.scientificName}</p>

        {herb.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{herb.description}</p>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TagIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Parts Used</span>
            </div>
            <span className="text-sm font-semibold text-emerald-600">{herb.partsUsed}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Region</span>
            </div>
            <span className="text-sm text-gray-600">{herb.indigenousRegion}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Updated</span>
            </div>
            <span className="text-sm text-gray-600">{herb.lastUpdated}</span>
          </div>
        </div>

        {/* Properties Tags */}
        {herb.properties && herb.properties.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {herb.properties.slice(0, 3).map((prop, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {prop}
                </span>
              ))}
              {herb.properties.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
                  +{herb.properties.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`mt-4 pt-4 border-t border-gray-200 flex items-center justify-between transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <Button
            size="sm"
            variant="ghost"
            icon={EyeIcon}
            onClick={(e) => handleAction('view', e)}
            className="text-gray-600 hover:text-gray-900"
          >
            View
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

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-500">Uses</div>
            <div className="text-sm font-bold text-gray-900">{herb.usesCount || 'N/A'}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-500">Studies</div>
            <div className="text-sm font-bold text-gray-900">{herb.studiesCount || 'N/A'}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-500">Safety</div>
            <div className="text-sm font-bold text-gray-900">{herb.safetyLevel || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Added by: {herb.addedBy || 'System'}</span>
          <span>{herb.createdAt || 'Oct 2023'}</span>
        </div>
      </div>
    </div>
  );
};

// Default props for the component
HerbCard.defaultProps = {
  herb: {
    id: 1,
    commonName: 'Aloe vera',
    scientificName: 'Aloe barbadensis miller',
    partsUsed: 'LEAVES',
    indigenousRegion: 'Various',
    status: 'published',
    description: 'Soothing gel for burns and skin conditions',
    lastUpdated: '2 days ago',
    properties: ['Anti-inflammatory', 'Antioxidant', 'Moisturizing'],
    uses: ['Skin burns', 'Wound healing', 'Skin hydration'],
    usesCount: 24,
    studiesCount: 18,
    safetyLevel: 'A',
    addedBy: 'Sarah J.',
    createdAt: 'Oct 24, 2023'
  }
};

export default HerbCard;