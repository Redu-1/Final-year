// src/pages/Recommendations/Recommendations.jsx
import { useState, useEffect } from 'react';
import RuleCard from '../../components/recommendations/RuleCard';
// import LogicBuilder from '../../components/recommendations/LogicBuilder';
import AddRecommendationModal from '../../components/recommendations/AddRecommendationModal';
import EditRecommendationModal from '../../components/recommendations/EditRecommendationModal';
import ViewRecommendationModal from '../../components/recommendations/ViewRecommendationModal';
import DeleteRuleModal from '../../components/recommendations/DeleteRuleModal';
import Button from '../../components/common/Button';
import { 
  PlusIcon, 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon 
} from '@heroicons/react/24/outline';
import { Brain } from 'lucide-react';

const Recommendations = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  
  // Load rules from localStorage
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem('herbiSense_rules');
    if (savedRules) {
      return JSON.parse(savedRules);
    }
    return [
      {
        id: 1,
        name: 'Insomnia Relief',
        description: 'Recommend Valerian Root when user reports insomnia',
        condition: 'insomnia',
        conditionValue: 'present',
        herb: 'valerian-root',
        status: 'active',
        logic: 'If Insomnia is present\nSuggest Valerian Root',
        category: 'WELLNESS',
        totalTriggers: 1248,
        lastTriggered: '2 hours ago',
        priority: 'high',
        triggerFrequency: 'always',
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 2,
        name: 'Soil Improvement',
        description: 'Suggest Comfrey for clay/dense soil',
        condition: 'poor-soil',
        conditionValue: 'severe',
        herb: 'comfrey',
        status: 'active',
        logic: 'If Poor Soil Quality is severe\nSuggest Comfrey Plant',
        category: 'CULTIVATION',
        totalTriggers: 892,
        lastTriggered: '1 day ago',
        priority: 'medium',
        triggerFrequency: 'weekly',
        createdAt: new Date('2024-01-02').toISOString()
      },
      {
        id: 3,
        name: 'Fatigue Support',
        description: 'Nettle infusion for fatigue',
        condition: 'fatigue',
        conditionValue: 'mild',
        herb: 'nettle',
        status: 'draft',
        logic: 'If Fatigue is mild\nSuggest Nettle Infusion',
        category: 'WELLNESS',
        totalTriggers: 0,
        lastTriggered: null,
        priority: 'low',
        triggerFrequency: 'daily',
        createdAt: new Date('2024-01-03').toISOString()
      }
    ];
  });

  // Save rules to localStorage
  useEffect(() => {
    localStorage.setItem('herbiSense_rules', JSON.stringify(rules));
  }, [rules]);

  // Add blur effect when modals are open
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen || isViewModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
      const dashboardContent = document.querySelector('.dashboard-container');
      if (dashboardContent) {
        dashboardContent.classList.add('dashboard-blur');
      }
    } else {
      document.body.style.overflow = 'unset';
      const dashboardContent = document.querySelector('.dashboard-container');
      if (dashboardContent) {
        dashboardContent.classList.remove('dashboard-blur');
      }
    }
  }, [isAddModalOpen, isEditModalOpen, isViewModalOpen, isDeleteModalOpen]);

  // Updated stats - Removed Success Rate
  const stats = [
    { 
      label: 'Active Rules', 
      value: rules.filter(r => r.status === 'active').length.toString(), 
      change: `+${rules.filter(r => r.status === 'active').length > 0 ? '12' : '0'}%`, 
      trend: 'up' 
    },
    { 
      label: 'Total Rules', 
      value: rules.length.toString(), 
      change: `+${rules.length > 3 ? '2' : '0'}`, 
      trend: 'up' 
    },
    { 
      label: 'Top Suggested Herb', 
      value: 'Valerian Root', 
      trend: null 
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'WELLNESS', label: 'Wellness' },
    { value: 'CULTIVATION', label: 'Cultivation' },
    { value: 'PREPARATION', label: 'Preparation' },
    { value: 'SAFETY', label: 'Safety' }
  ];

  // Filter rules based on active filter
  const filteredRules = rules.filter(rule => {
    if (activeFilter === 'all') return true;
    return rule.category === activeFilter.toUpperCase();
  });

  // CRUD Handlers
  const handleAddRule = (newRule) => {
    setRules(prev => [newRule, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleEditRule = (updatedRule) => {
    setRules(prev => prev.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    ));
    setIsEditModalOpen(false);
    setSelectedRule(null);
  };

  const handleViewRule = (rule) => {
    setSelectedRule(rule);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (rule) => {
    setSelectedRule(rule);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (rule) => {
    setSelectedRule(rule);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRule) {
      setRules(prev => prev.filter(rule => rule.id !== selectedRule.id));
      setIsDeleteModalOpen(false);
      setSelectedRule(null);
    }
  };

  const handleDuplicateRule = (rule) => {
    const newId = rules.length > 0 ? Math.max(...rules.map(r => r.id)) + 1 : 1;
    const now = new Date();
    
    const duplicatedRule = {
      ...rule,
      id: newId,
      name: `${rule.name} (Copy)`,
      status: 'draft',
      totalTriggers: 0,
      lastTriggered: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    
    setRules(prev => [duplicatedRule, ...prev]);
  };

  const handleToggleRule = (rule) => {
    setRules(prev => prev.map(r => 
      r.id === rule.id 
        ? { ...r, status: r.status === 'active' ? 'draft' : 'active' }
        : r
    ));
  };

  return (
    <div className="dashboard-container space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Dashboard</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Recommendations</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recommendation Rules</h1>
            <p className="mt-1 text-gray-600">
              Manage automated suggestion logic based on traditional wisdom.
            </p>
          </div>
          <Button 
            variant="primary" 
            icon={PlusIcon}
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            Create New Rule
          </Button>
        </div>
      </div>

      {/* Stats Cards - Now 3 cards without Success Rate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              {stat.change && (
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.trend === 'up' ? (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {stat.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active Recommendations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recommendation Rules</h3>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select 
                className="block w-48 rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              
              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 ${
                    viewMode === 'table'
                      ? 'bg-emerald-50 text-emerald-600 border-r border-gray-300'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  title="Table view"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 ${
                    viewMode === 'card'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  title="Card view"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Display - Table or Cards */}
        {filteredRules.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rules found</h3>
              <p className="text-gray-500 mb-6">
                {activeFilter !== 'all' 
                  ? 'No rules in this category yet' 
                  : 'Get started by creating your first recommendation rule'}
              </p>
              <Button 
                variant="primary" 
                icon={PlusIcon}
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Create New Rule
              </Button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LOGIC DEFINITION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CATEGORY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TOTAL TRIGGERS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRules.map((rule) => (
                  <RuleCard 
                    key={rule.id} 
                    rule={rule} 
                    viewMode="table"
                    onEdit={handleEditClick}
                    onView={handleViewRule}
                    onDelete={handleDeleteClick}
                    onDuplicate={handleDuplicateRule}
                    onToggle={handleToggleRule}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRules.map((rule) => (
              <RuleCard 
                key={rule.id} 
                rule={rule} 
                viewMode="card"
                onEdit={handleEditClick}
                onView={handleViewRule}
                onDelete={handleDeleteClick}
                onDuplicate={handleDuplicateRule}
                onToggle={handleToggleRule}
              />
            ))}
          </div>
        )}

        {/* Table Footer */}
        {filteredRules.length > 0 && viewMode === 'table' && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{filteredRules.length}</span> of{' '}
                <span className="font-medium">{rules.length}</span> rules
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Updated Quick Tips - Removed success rate reference */}
      {/* <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Optimization Tip</h4>
            <p className="text-gray-600 mt-1">
              Test your recommendation rules with different conditions to find the most effective combinations. 
              Rules can be toggled between active and draft status at any time.
            </p>
          </div>
        </div>
      </div> */}

      {/* Modals */}
      <AddRecommendationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddRule}
      />

      <EditRecommendationModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRule(null);
        }}
        onSave={handleEditRule}
        rule={selectedRule}
      />

      <ViewRecommendationModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedRule(null);
        }}
        rule={selectedRule}
      />

      <DeleteRuleModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRule(null);
        }}
        onConfirm={handleDeleteConfirm}
        ruleName={selectedRule?.name || selectedRule?.id || 'this rule'}
      />
    </div>
  );
};

export default Recommendations;