'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface ScriptConfig {
  id: string;
  name: string;
  location: 'head' | 'body-start' | 'body-end';
  enabled: boolean;
  script: string;
}

export default function AdminGlobalScriptsPage() {
  const [scripts, setScripts] = useState<ScriptConfig[]>([
    { id: 'head-1', name: 'Google Analytics', location: 'head', enabled: true, script: '<!-- GA Script -->' },
    { id: 'head-2', name: 'Meta Pixel', location: 'head', enabled: false, script: '<!-- Meta Pixel -->' },
    { id: 'body-1', name: 'Chat Widget', location: 'body-end', enabled: true, script: '<!-- Chat Script -->' },
  ]);

  const toggleScript = (id: string) => {
    setScripts(prev => prev.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const saveScript = (id: string) => {
    alert(`Script ${id} saved successfully!`);
  };

  return (
    <AdminLayout title="Global Scripts">
      <div className="space-y-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Global Scripts Management</h3>
          <p className="text-sm text-blue-700">Add custom HTML, CSS, JavaScript, and tracking scripts that will be included across all pages of the website.</p>
        </div>

        {/* Head Scripts */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                  Head Scripts (&lt;head&gt; tag)
                </h3>
                <p className="text-sm text-gray-600 mt-1">Scripts and HTML inserted into the &lt;head&gt; section on all pages</p>
              </div>
            </div>

            <div className="space-y-4">
              {scripts.filter(s => s.location === 'head').map(script => (
                <div key={script.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{script.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={script.enabled}
                        onChange={() => toggleScript(script.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <textarea
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    defaultValue={script.script}
                    placeholder="Paste your script here..."
                  />
                  <button
                    onClick={() => saveScript(script.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body End Scripts */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  </svg>
                  Body End Scripts
                </h3>
                <p className="text-sm text-gray-600 mt-1">Scripts inserted before the closing &lt;/body&gt; tag</p>
              </div>
            </div>

            <div className="space-y-4">
              {scripts.filter(s => s.location === 'body-end').map(script => (
                <div key={script.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{script.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={script.enabled}
                        onChange={() => toggleScript(script.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <textarea
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    defaultValue={script.script}
                    placeholder="Paste your script here..."
                  />
                  <button
                    onClick={() => saveScript(script.id)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add New Script */}
        <div className="flex justify-end">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Script
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
