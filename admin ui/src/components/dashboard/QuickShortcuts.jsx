// src/components/dashboard/QuickShortcuts.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircleIcon, 
  DocumentArrowDownIcon, 
  MegaphoneIcon,
  ArchiveBoxIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import ReactDOM from 'react-dom';

// Toast Notification Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: CheckCircleIcon,
    error: ExclamationTriangleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  };

  const Icon = icons[type];

  return ReactDOM.createPortal(
    <div className="fixed bottom-4 right-4 z-[9999] animate-slide-up">
      <div className={`${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center`}>
        <Icon className="h-5 w-5 mr-3" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>,
    document.body
  );
};

// Notification Modal Component - Updated to Green Gradient
const NotificationModal = ({ isOpen, onClose, onSend }) => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('info');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    await onSend({ subject, message, type });
    setSending(false);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header - Changed to Green Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <MegaphoneIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Send Notification</h3>
                  <p className="text-sm text-emerald-50">Message all system users</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="info">Information</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="alert">Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., System Update"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  placeholder="Type your notification message here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Changed to Green Info Box */}
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-700">
                    This will send a notification to all active users.
                    Users can dismiss notifications from their dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Changed to Green Button */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className={`px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Export Modal Component - Updated to Green Gradient
const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState('json');
  const [includeHerbs, setIncludeHerbs] = useState(true);
  const [includeRules, setIncludeRules] = useState(true);
  const [includeUsers, setIncludeUsers] = useState(false);
  const [dateRange, setDateRange] = useState('all');

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
          
          {/* Header - Changed to Green Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <DocumentArrowDownIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Export Report</h3>
                  <p className="text-sm text-emerald-50">Choose export options</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormat('json')}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      format === 'json'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-sm font-medium">JSON</span>
                    <span className="text-xs text-gray-500">Full data structure</span>
                  </button>
                  <button
                    onClick={() => setFormat('csv')}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      format === 'csv'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block text-sm font-medium">CSV</span>
                    <span className="text-xs text-gray-500">Spreadsheet format</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 90 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Include in Export
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeHerbs}
                      onChange={(e) => setIncludeHerbs(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Herbs Database</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeRules}
                      onChange={(e) => setIncludeRules(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Recommendation Rules</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeUsers}
                      onChange={(e) => setIncludeUsers(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">User Data (Anonymized)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Changed to Green Button */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onExport({ format, includeHerbs, includeRules, includeUsers, dateRange })}
              disabled={!includeHerbs && !includeRules && !includeUsers}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Main QuickShortcuts Component
const QuickShortcuts = () => {
  const navigate = useNavigate();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = (options) => {
    try {
      // Gather data
      const herbs = localStorage.getItem('herbiSense_herbs');
      const rules = localStorage.getItem('herbiSense_rules');
      const users = localStorage.getItem('herbiSense_users');

      let data = {};
      
      if (options.includeHerbs) data.herbs = herbs ? JSON.parse(herbs) : [];
      if (options.includeRules) data.rules = rules ? JSON.parse(rules) : [];
      if (options.includeUsers) data.users = users ? JSON.parse(users) : [];

      // Add metadata
      data.metadata = {
        exportedAt: new Date().toISOString(),
        format: options.format,
        dateRange: options.dateRange,
        version: '1.0.0',
        generatedBy: 'HerbiSense Admin'
      };

      if (options.format === 'json') {
        // JSON Export
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `herbisense_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Report exported successfully as JSON', 'success');
      } else {
        // CSV Export
        let csv = '';
        
        if (options.includeHerbs && data.herbs.length > 0) {
          csv += '# HERBS DATA\n';
          const herbHeaders = ['ID', 'Common Name', 'Scientific Name', 'Parts Used', 'Region', 'Status', 'Categories', 'Skin Conditions', 'Created'];
          csv += herbHeaders.join(',') + '\n';
          
          data.herbs.forEach(herb => {
            const row = [
              herb.id,
              `"${herb.commonName || ''}"`,
              `"${herb.scientificName || ''}"`,
              herb.partsUsed || '',
              `"${herb.indigenousRegion || ''}"`,
              herb.status || '',
              `"${(herb.categories || []).join('; ')}"`,
              `"${(herb.skinConditions || []).join('; ')}"`,
              herb.createdAt ? new Date(herb.createdAt).toLocaleDateString() : ''
            ];
            csv += row.join(',') + '\n';
          });
          csv += '\n';
        }

        if (options.includeRules && data.rules.length > 0) {
          csv += '# RECOMMENDATION RULES\n';
          const ruleHeaders = ['ID', 'Name', 'Condition', 'Herb', 'Status', 'Triggers', 'Created'];
          csv += ruleHeaders.join(',') + '\n';
          
          data.rules.forEach(rule => {
            const row = [
              rule.id,
              `"${rule.name || ''}"`,
              `"${rule.condition || ''}"`,
              `"${rule.herb || ''}"`,
              rule.status || '',
              rule.totalTriggers || 0,
              rule.createdAt ? new Date(rule.createdAt).toLocaleDateString() : ''
            ];
            csv += row.join(',') + '\n';
          });
        }

        // Add metadata as comments
        csv = `# HerbiSense Export - ${new Date().toLocaleDateString()}\n` +
              `# Format: CSV\n` +
              `# Date Range: ${options.dateRange}\n\n` +
              csv;

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `herbisense_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Report exported successfully as CSV', 'success');
      }
      
      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export failed. Please try again.', 'error');
    }
  };

  const handleNotify = async ({ subject, message, type }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log notification
      console.log('Notification sent:', { subject, message, type, timestamp: new Date().toISOString() });
      
      // Show success toast
      showToast(`Notification sent to all users`, 'success');
      
      // Store in localStorage for demo
      const notifications = JSON.parse(localStorage.getItem('herbiSense_notifications') || '[]');
      notifications.push({
        id: Date.now(),
        subject,
        message,
        type,
        sentAt: new Date().toISOString(),
        recipients: Math.floor(Math.random() * 50) + 100
      });
      localStorage.setItem('herbiSense_notifications', JSON.stringify(notifications));
      
    } catch (error) {
      console.error('Notification failed:', error);
      showToast('Failed to send notification', 'error');
    }
  };

  // Backup DB function
  const handleBackup = () => {
    try {
      // Gather all data from localStorage
      const herbs = localStorage.getItem('herbiSense_herbs');
      const rules = localStorage.getItem('herbiSense_rules');
      const users = localStorage.getItem('herbiSense_users');
      const notifications = localStorage.getItem('herbiSense_notifications');

      // Parse data or use empty arrays
      const herbsData = herbs ? JSON.parse(herbs) : [];
      const rulesData = rules ? JSON.parse(rules) : [];
      const usersData = users ? JSON.parse(users) : [];
      const notificationsData = notifications ? JSON.parse(notifications) : [];

      // Create backup object
      const backup = {
        metadata: {
          backedUpAt: new Date().toISOString(),
          version: '1.0.0',
          appVersion: '2.4.0',
          generatedBy: 'HerbiSense Admin Console',
          database: 'HerbiSense System'
        },
        statistics: {
          totalHerbs: herbsData.length,
          totalRules: rulesData.length,
          totalUsers: usersData.length,
          totalNotifications: notificationsData.length,
          timestamp: Date.now()
        },
        data: {
          herbs: herbsData,
          rules: rulesData,
          users: usersData,
          notifications: notificationsData
        },
        summary: {
          herbsByStatus: {
            published: herbsData.filter(h => h.status === 'published').length,
            draft: herbsData.filter(h => h.status === 'draft').length,
            pending: herbsData.filter(h => h.status === 'pending').length
          },
          rulesByStatus: {
            active: rulesData.filter(r => r.status === 'active').length,
            draft: rulesData.filter(r => r.status === 'draft').length
          }
        }
      };

      // Create and download file
      const dataStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp
      const date = new Date();
      const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
      link.download = `herbisense_backup_${timestamp}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      showToast(`Backup created successfully! (${herbsData.length} herbs, ${rulesData.length} rules)`, 'success');
      
    } catch (error) {
      console.error('Backup failed:', error);
      showToast('Backup failed. Please try again.', 'error');
    }
  };

  const handleAddHerb = () => {
    console.log('Shortcut clicked: add');
    navigate('/herbs');
  };

  const shortcuts = [
    {
      id: 1,
      name: 'Add New Herb',
      description: 'Add a new herb to the database',
      icon: PlusCircleIcon,
      color: 'emerald',
      action: handleAddHerb,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      hoverBg: 'hover:bg-emerald-100'
    },
    {
      id: 2,
      name: 'Export Report',
      description: 'Generate and download system report',
      icon: DocumentArrowDownIcon,
      color: 'emerald',
      action: () => setIsExportModalOpen(true),
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      hoverBg: 'hover:bg-emerald-100'
    },

 
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <button
                key={shortcut.id}
                onClick={shortcut.action}
                className={`w-full flex items-center p-4 ${shortcut.bg} rounded-xl ${shortcut.hoverBg} transition-all duration-200 group cursor-pointer`}
              >
                <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${shortcut.iconColor}`} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                    {shortcut.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5 group-hover:text-gray-500">
                    {shortcut.description}
                  </p>
                </div>
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals - All with Green Gradients */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onSend={handleNotify}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default QuickShortcuts;