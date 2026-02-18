// src/pages/SafetyUsage/SafetyUsage.jsx
import { useState } from 'react';
import SafetyGuidelineCard from '../../components/safety/SafetyGuidelineCard';
import ContraindicationCard from '../../components/safety/ContraindicationCard';
import DosageTable from '../../components/safety/DosageTable';

const SafetyUsage = () => {
  const [activeTab, setActiveTab] = useState('guidelines');

  const guidelines = [
    {
      id: 1,
      title: 'General Preparation Protocols',
      description: 'Standardized boiling and infusion temperatures for aqueous extracts to preserve alkaloid stability.',
      authority: 'WHO-GLP',
      updated: '2 days ago',
      type: 'protocol'
    },
    {
      id: 2,
      title: 'Storage & Bio-Contamination',
      description: 'Guidelines for humidity control and microbial testing in storage facilities for dried indigenous roots.',
      authority: 'EMA Verified',
      updated: 'Oct 24, 2023',
      type: 'storage'
    },
    {
      id: 3,
      title: 'Emergency Response Procedures',
      description: 'Protocol for acute toxicity events and allergic reaction reporting within clinical trial settings.',
      authority: 'MOH Internal',
      updated: 'Jan 02, 2024',
      type: 'emergency'
    }
  ];

  const dosageData = [
    {
      herb: 'Ashwagandha Root',
      targetGroup: 'Adults (18-65)',
      amount: '300mg - 500mg',
      frequency: '2x Daily',
      source: 'Pharmacopoeia'
    },
    {
      herb: 'Moringa Oleifera',
      targetGroup: 'Child (6-12y)',
      amount: '1g - 2g (Powder)',
      frequency: '1x Daily',
      source: 'Clinical Study'
    },
    {
      herb: 'Curcuma Longa',
      targetGroup: 'General Adult',
      amount: '500mg (95% Curc.)',
      frequency: '3x Daily',
      source: 'Trad. Ayurveda'
    },
    {
      herb: 'Bacopa Monnieri',
      targetGroup: 'Senior (65y+)',
      amount: '150mg - 300mg',
      frequency: 'Daily (AM)',
      source: 'Clinical Study'
    }
  ];

  const contraindications = [
    {
      id: 1,
      title: 'St. John\'s Wort + SSRIs',
      description: 'Severe risk of Serotonin Syndrome. May inhibit cytochrome P450 enzymes leading to toxicity.',
      riskLevel: 'high',
      riskId: 'CN-9921',
      source: 'FDA Clinical Advisory'
    },
    {
      id: 2,
      title: 'Ginkgo Biloba + Warfarin',
      description: 'Increased risk of spontaneous bleeding due to potentiation of anticoagulant effects.',
      riskLevel: 'moderate',
      riskId: 'CN-4412',
      source: 'Cochrane Database'
    },
    {
      id: 3,
      title: 'Licorice Root + Hypertension',
      description: 'Prolonged use can cause pseudo-aldosteronism, leading to potassium depletion and spiked BP.',
      riskLevel: 'high',
      riskId: 'CN-2287',
      source: 'ESC Guidelines'
    },
    {
      id: 4,
      title: 'Kava + Hepatic Impairment',
      description: 'Observed hepatotoxicity. Contraindicated for patients with existing liver enzyme elevations.',
      riskLevel: 'moderate',
      riskId: 'CN-1055',
      source: 'TGA Medical Alert'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Safety & Usage Management</h1>
          <p className="mt-1 text-gray-600">
            Manage guidelines, dosages, and contraindications for herbal clinical data.
          </p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Guideline
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['guidelines', 'dosages', 'contraindications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                activeTab === tab
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      {activeTab === 'guidelines' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Safety Guidelines</h3>
                <p className="text-gray-600 mt-1">
                  All guidelines are validated by international health authorities and regularly updated.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {guidelines.map((guideline) => (
              <SafetyGuidelineCard key={guideline.id} guideline={guideline} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'dosages' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Standardized Dosage Guidelines</h3>
              <p className="text-gray-600 mt-1">Clinically validated dosage recommendations</p>
            </div>
            <DosageTable data={dosageData} />
          </div>
        </div>
      )}

      {activeTab === 'contraindications' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Contraindications & Warnings</h3>
                <p className="text-gray-600 mt-1">
                  Critical safety information about herb-drug interactions and contraindications.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contraindications.map((contra) => (
              <ContraindicationCard key={contra.id} data={contra} />
            ))}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-medium text-gray-900">Need to update a guideline?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Submit changes for review by the medical advisory board.
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Export Report
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
              Submit Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyUsage;