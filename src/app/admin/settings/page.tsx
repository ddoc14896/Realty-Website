'use client';

import { useState } from 'react';
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { 
  Settings,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Palette,
  Save,
  RefreshCw
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Chennai Realty Website',
    siteDescription: 'Premium real estate properties in Chennai',
    contactEmail: 'contact@chennairealty.com',
    supportPhone: '+91 98765 43210',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    enableNotifications: true,
    enableRegistrations: true,
    enablePropertySubmissions: false,
    maxFileSize: 10,
    allowedImageTypes: 'jpg,jpeg,png,webp',
    theme: 'default',
    maintenanceMode: false
  });
  
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">🏠 Admin - Settings</span>
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                Admin
              </Link>
              <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Settings</h1>
            <p className="text-gray-600 mt-2">Configure your website settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                <input
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Feature Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Feature Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Enable Notifications</h4>
                  <p className="text-sm text-gray-500">Allow email notifications for inquiries and updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Allow User Registration</h4>
                  <p className="text-sm text-gray-500">Allow new users to register on the website</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableRegistrations}
                  onChange={(e) => handleInputChange('enableRegistrations', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Property Submissions</h4>
                  <p className="text-sm text-gray-500">Allow users to submit their own properties</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enablePropertySubmissions}
                  onChange={(e) => handleInputChange('enablePropertySubmissions', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">Enable maintenance mode to restrict access</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">File Upload Settings</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxFileSize}
                  onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Image Types</label>
                <input
                  type="text"
                  value={settings.allowedImageTypes}
                  onChange={(e) => handleInputChange('allowedImageTypes', e.target.value)}
                  placeholder="jpg,jpeg,png,webp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="h-6 w-6 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="default">Default</option>
                <option value="dark">Dark Mode</option>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminGuard>
  );
}