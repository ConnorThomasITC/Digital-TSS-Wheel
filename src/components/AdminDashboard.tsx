'use client';

import { useState, useEffect } from 'react';
import type { ServiceWithSubservices } from '@/lib/types';
import ColorPicker from './ColorPicker';
import Wheel from './Wheel';

interface AdminDashboardProps {
  initialServices: ServiceWithSubservices[];
  editKey: string | null;
}

export default function AdminDashboard({ initialServices, editKey: initialKey }: AdminDashboardProps) {
  const [services, setServices] = useState<ServiceWithSubservices[]>(initialServices);
  const [editKey, setEditKey] = useState<string>(initialKey || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialKey);
  const [keyInput, setKeyInput] = useState<string>('');
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [editingService, setEditingService] = useState<number | null>(null);
  const [editingSubservice, setEditingSubservice] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAuthenticate = () => {
    if (keyInput.trim()) {
      setEditKey(keyInput.trim());
      setIsAuthenticated(true);
      localStorage.setItem('tss_edit_key', keyInput.trim());
      showMessage('success', 'Authenticated successfully');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEditKey('');
    setKeyInput('');
    localStorage.removeItem('tss_edit_key');
  };

  useEffect(() => {
    const storedKey = localStorage.getItem('tss_edit_key');
    if (storedKey) {
      setEditKey(storedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setServices(data.services);
    } catch (error) {
      showMessage('error', 'Failed to fetch services');
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/config?key=${encodeURIComponent(editKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services }),
      });

      if (res.ok) {
        showMessage('success', 'Changes published successfully');
        await fetchServices();
      } else {
        const error = await res.json();
        showMessage('error', error.error || 'Failed to publish changes');
        if (res.status === 401) {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      showMessage('error', 'Network error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/export?key=${encodeURIComponent(editKey)}`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tss-wheel-backup-${Date.now()}.json`;
        a.click();
        showMessage('success', 'Exported successfully');
      } else {
        showMessage('error', 'Failed to export');
      }
    } catch (error) {
      showMessage('error', 'Export failed');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.services && Array.isArray(data.services)) {
        setServices(data.services);
        showMessage('success', 'Imported successfully - click Publish to save');
      } else {
        showMessage('error', 'Invalid file format');
      }
    } catch (error) {
      showMessage('error', 'Failed to import file');
    }
  };

  const updateService = (id: number, updates: Partial<ServiceWithSubservices>) => {
    setServices(services.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addService = () => {
    const newService: ServiceWithSubservices = {
      id: Date.now(),
      name: 'New Service',
      tooltip: '',
      description: '',
      color: '#6B7280',
      sort_order: services.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subservices: [],
    };
    setServices([...services, newService]);
    setExpandedService(newService.id);
  };

  const deleteService = (id: number) => {
    if (confirm('Delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const addSubservice = (serviceId: number) => {
    const newSub = {
      id: Date.now(),
      service_id: serviceId,
      name: 'New Subservice',
      tooltip: '',
      color: '#9CA3AF',
      weight: 10,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setServices(services.map(s =>
      s.id === serviceId
        ? { ...s, subservices: [...s.subservices, newSub] }
        : s
    ));
  };

  const updateSubservice = (serviceId: number, subId: number, updates: any) => {
    setServices(services.map(s =>
      s.id === serviceId
        ? {
            ...s,
            subservices: s.subservices.map(sub =>
              sub.id === subId ? { ...sub, ...updates } : sub
            )
          }
        : s
    ));
  };

  const deleteSubservice = (serviceId: number, subId: number) => {
    if (confirm('Delete this subservice?')) {
      setServices(services.map(s =>
        s.id === serviceId
          ? { ...s, subservices: s.subservices.filter(sub => sub.id !== subId) }
          : s
      ));
    }
  };

  const moveService = (id: number, direction: 'up' | 'down') => {
    const index = services.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;

    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];

    setServices(newServices.map((s, idx) => ({ ...s, sort_order: idx })));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
          <p className="text-gray-600 mb-4 text-sm">Enter your edit key to access the dashboard.</p>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()}
            placeholder="Edit key"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button
            onClick={handleAuthenticate}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">TSS Wheel Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <label className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer">
              Import JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="px-6 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Publishing...' : 'Publish Changes'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-md shadow-lg ${
          message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white animate-fade-in`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Services</h2>
                <button
                  onClick={addService}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  + Add Service
                </button>
              </div>

              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveService(service.id, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveService(service.id, 'down')}
                            disabled={index === services.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="font-semibold">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {expandedService === service.id ? 'Collapse' : 'Expand'}
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {expandedService === service.id && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(service.id, { name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip (hover text)</label>
                          <input
                            type="text"
                            value={service.tooltip || ''}
                            onChange={(e) => updateService(service.id, { tooltip: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description (modal)</label>
                          <textarea
                            value={service.description || ''}
                            onChange={(e) => updateService(service.id, { description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <ColorPicker
                          label="Color"
                          color={service.color}
                          onChange={(color) => updateService(service.id, { color })}
                        />

                        <div className="border-t pt-4 mt-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">Subservices</h3>
                            <button
                              onClick={() => addSubservice(service.id)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                            >
                              + Add
                            </button>
                          </div>

                          <div className="space-y-3">
                            {service.subservices.map((sub) => (
                              <div key={sub.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm">{sub.name}</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setEditingSubservice(editingSubservice === sub.id ? null : sub.id)}
                                      className="text-blue-600 hover:text-blue-700 text-xs"
                                    >
                                      {editingSubservice === sub.id ? 'Close' : 'Edit'}
                                    </button>
                                    <button
                                      onClick={() => deleteSubservice(service.id, sub.id)}
                                      className="text-red-600 hover:text-red-700 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>

                                {editingSubservice === sub.id && (
                                  <div className="space-y-2 mt-3">
                                    <input
                                      type="text"
                                      value={sub.name}
                                      onChange={(e) => updateSubservice(service.id, sub.id, { name: e.target.value })}
                                      placeholder="Name"
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                      type="text"
                                      value={sub.tooltip || ''}
                                      onChange={(e) => updateSubservice(service.id, sub.id, { tooltip: e.target.value })}
                                      placeholder="Tooltip"
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        value={sub.weight}
                                        onChange={(e) => updateSubservice(service.id, sub.id, { weight: parseInt(e.target.value) || 10 })}
                                        placeholder="Weight"
                                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                      <span className="text-xs text-gray-500">Weight</span>
                                    </div>
                                    <ColorPicker
                                      color={sub.color}
                                      onChange={(color) => updateSubservice(service.id, sub.id, { color })}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4">Live Preview</h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <Wheel services={services} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
