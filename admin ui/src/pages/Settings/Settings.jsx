// src/pages/Settings/Settings.jsx
import { useState, useEffect } from 'react';
import { 
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Load settings from localStorage
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('herbiSense_settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      general: {
        language: 'en',
        timezone: 'UTC-05:00',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      },
      notifications: {
        emailAlerts: true,
        systemUpdates: true,
        securityAlerts: true,
        marketingEmails: false,
        pushNotifications: false,
        desktopNotifications: true
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginAlerts: true
      },
      system: {
        autoSave: true,
        telemetry: false,
        cacheSize: '128 MB',
        lastBackup: '2024-02-13'
      }
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('herbiSense_settings', JSON.stringify(settings));
  }, [settings]);

  // Show toast notification
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ========== GENERAL SETTINGS HANDLERS ==========
  const handleLanguageChange = (e) => {
    setSettings({
      ...settings,
      general: { ...settings.general, language: e.target.value }
    });
    showNotification('Language updated');
  };

  const handleTimezoneChange = (e) => {
    setSettings({
      ...settings,
      general: { ...settings.general, timezone: e.target.value }
    });
    showNotification('Timezone updated');
  };

  const handleDateFormatChange = (format) => {
    setSettings({
      ...settings,
      general: { ...settings.general, dateFormat: format }
    });
    showNotification('Date format updated');
  };

  const handleTimeFormatChange = (format) => {
    setSettings({
      ...settings,
      general: { ...settings.general, timeFormat: format }
    });
    showNotification('Time format updated');
  };

  // ========== NOTIFICATION HANDLERS ==========
  const toggleNotification = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
    showNotification(`${key === 'emailAlerts' ? 'Email alerts' : 
                      key === 'systemUpdates' ? 'System updates' :
                      key === 'securityAlerts' ? 'Security alerts' :
                      key === 'marketingEmails' ? 'Marketing emails' :
                      key === 'pushNotifications' ? 'Push notifications' :
                      'Desktop notifications'} ${!settings.notifications[key] ? 'enabled' : 'disabled'}`);
  };

  const handleTestNotification = () => {
    showNotification('Test notification sent! Check your device', 'info');
  };

  // ========== SECURITY HANDLERS ==========
  const handleChangePassword = () => {
    showNotification('Password change link sent to your email', 'info');
  };

  const handleEnable2FA = () => {
    setSettings({
      ...settings,
      security: { ...settings.security, twoFactorEnabled: true }
    });
    showNotification('Two-factor authentication enabled');
  };

  const handleDisable2FA = () => {
    if (window.confirm('Are you sure you want to disable two-factor authentication?')) {
      setSettings({
        ...settings,
        security: { ...settings.security, twoFactorEnabled: false }
      });
      showNotification('Two-factor authentication disabled');
    }
  };

  const handleRevokeSessions = () => {
    if (window.confirm('Revoke all active sessions? You will be logged out everywhere except this device.')) {
      showNotification('All other sessions revoked', 'warning');
    }
  };

  const handleViewLogs = () => {
    showNotification('Opening audit logs...', 'info');
  };

  const handleSessionTimeoutChange = (e) => {
    setSettings({
      ...settings,
      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
    });
    showNotification(`Session timeout updated to ${e.target.value} minutes`);
  };

  // ========== SYSTEM HANDLERS ==========
  const handleClearCache = () => {
    if (window.confirm('Clear system cache? This may improve performance.')) {
      setTimeout(() => {
        showNotification('Cache cleared successfully!');
      }, 1000);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `herbisense_settings_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Settings exported successfully');
  };

  const handleBackupNow = () => {
    setSettings({
      ...settings,
      system: {
        ...settings.system,
        lastBackup: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
      }
    });
    showNotification('Backup created successfully');
  };

  const handleDeleteSystemData = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL system data. This action cannot be undone. Are you absolutely sure?')) {
      localStorage.clear();
      showNotification('System data cleared. Refreshing...', 'error');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const handleSaveChanges = () => {
    localStorage.setItem('herbiSense_settings', JSON.stringify(settings));
    showNotification('All settings saved successfully');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all settings to default values?')) {
      localStorage.removeItem('herbiSense_settings');
      window.location.reload();
    }
  };

  // Updated tabs - removed Appearance
  const tabs = [
    { id: 'general', label: 'General', icon: GlobeAltIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'system', label: 'System', icon: Cog6ToothIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className={`flex items-center p-4 rounded-lg shadow-lg ${
            toastType === 'success' ? 'bg-emerald-500' :
            toastType === 'error' ? 'bg-red-500' :
            toastType === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          } text-white`}>
            {toastType === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
            {toastType === 'error' && <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
            {toastType === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
            {toastType === 'info' && <BellIcon className="h-5 w-5 mr-2" />}
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-emerald-500' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language Setting */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <GlobeAltIcon className="h-5 w-5 text-emerald-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Language</h3>
                  </div>
                  <select
                    value={settings.general.language}
                    onChange={handleLanguageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>

                {/* Timezone Setting */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <ClockIcon className="h-5 w-5 text-emerald-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Timezone</h3>
                  </div>
                  <select
                    value={settings.general.timezone}
                    onChange={handleTimezoneChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="UTC-08:00">UTC-08:00 Pacific Time</option>
                    <option value="UTC-07:00">UTC-07:00 Mountain Time</option>
                    <option value="UTC-06:00">UTC-06:00 Central Time</option>
                    <option value="UTC-05:00">UTC-05:00 Eastern Time</option>
                    <option value="UTC+00:00">UTC+00:00 Greenwich Mean Time</option>
                    <option value="UTC+01:00">UTC+01:00 Central European Time</option>
                    <option value="UTC+08:00">UTC+08:00 Singapore Time</option>
                    <option value="UTC+09:00">UTC+09:00 Japan Time</option>
                  </select>
                </div>
              </div>

              {/* Date Format */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <DocumentTextIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Date Format</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((format) => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        name="dateFormat"
                        checked={settings.general.dateFormat === format}
                        onChange={() => handleDateFormatChange(format)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Format */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <ClockIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Time Format</h3>
                </div>
                <div className="flex gap-4">
                  {['12h', '24h'].map((format) => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        name="timeFormat"
                        checked={settings.general.timeFormat === format}
                        onChange={() => handleTimeFormatChange(format)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {format === '12h' ? '12-hour (AM/PM)' : '24-hour'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <EnvelopeIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive important alerts via email' },
                    { key: 'systemUpdates', label: 'System Updates', desc: 'Get notified about system updates' },
                    { key: 'securityAlerts', label: 'Security Alerts', desc: 'Critical security notifications' },
                    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Product updates and newsletters' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleNotification(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                          settings.notifications[item.key] ? 'bg-emerald-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'pushNotifications', label: 'Mobile Push', desc: 'Receive push notifications on mobile' },
                    { key: 'desktopNotifications', label: 'Desktop Notifications', desc: 'Show desktop notifications' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleNotification(item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications[item.key] ? 'bg-emerald-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleTestNotification}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                >
                  Test Notification
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <LockClosedIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Authentication</h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleChangePassword}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">Change Password</span>
                    </div>
                    <span className="text-sm text-emerald-600">Update →</span>
                  </button>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Two-Factor Authentication</span>
                        <p className="text-xs text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    {settings.security.twoFactorEnabled ? (
                      <button
                        onClick={handleDisable2FA}
                        className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={handleEnable2FA}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-200"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <UserGroupIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Session Management</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Session Timeout</span>
                      <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
                    </div>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={handleSessionTimeoutChange}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Active Sessions</span>
                      <p className="text-xs text-gray-500">You have 2 active sessions</p>
                    </div>
                    <button
                      onClick={handleRevokeSessions}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Revoke All
                    </button>
                  </div>

                  <label className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Login Alerts</span>
                      <p className="text-xs text-gray-500">Email on new device login</p>
                    </div>
                    <button
                      onClick={() => toggleNotification('loginAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.security.loginAlerts ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Audit Logs</h3>
                </div>
                <button
                  onClick={handleViewLogs}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-900">View System Audit Logs</span>
                  <span className="text-sm text-emerald-600">View →</span>
                </button>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <ArrowPathIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">System Maintenance</h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleClearCache}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-900">Clear System Cache</span>
                    <span className="text-xs text-gray-500">{settings.system.cacheSize}</span>
                  </button>

                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-900">Export Settings</span>
                    <CloudArrowUpIcon className="h-4 w-4 text-gray-400" />
                  </button>

                  <label className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Auto-Save</span>
                      <p className="text-xs text-gray-500">Automatically save changes</p>
                    </div>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        system: { ...settings.system, autoSave: !settings.system.autoSave }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.system.autoSave ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.system.autoSave ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <CloudArrowUpIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Backup</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Last Backup</span>
                      <p className="text-xs text-gray-500">{settings.system.lastBackup}</p>
                    </div>
                    <button
                      onClick={handleBackupNow}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-200"
                    >
                      Backup Now
                    </button>
                  </div>

                  <label className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Telemetry</span>
                      <p className="text-xs text-gray-500">Send anonymous usage data</p>
                    </div>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        system: { ...settings.system, telemetry: !settings.system.telemetry }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.system.telemetry ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.system.telemetry ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Danger Zone</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Actions here are irreversible. Please proceed with caution.
                    </p>
                    <button
                      onClick={handleDeleteSystemData}
                      className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Delete System Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>© 2024 HerbiSense. All rights reserved.</span>
        <span>v2.4.0</span>
      </div>
    </div>
  );
};

export default Settings;