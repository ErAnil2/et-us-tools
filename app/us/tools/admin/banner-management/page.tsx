'use client';

import { useState } from 'react';

// Define banner configurations
const initialBannerConfigs: { [key: string]: BannerConfig } = {
  topBanner: {
    id: 'topBanner',
    name: 'Top Banner',
    dimensions: '728x90',
    enabled: true,
    script: '',
    fallbackAd: { text: 'Top Banner Ad', width: 728, height: 90 }
  },
  leftSkinBanner: {
    id: 'leftSkinBanner',
    name: 'Left Skin Banner',
    dimensions: '160x600',
    enabled: true,
    script: '',
    fallbackAd: { text: 'Left Skin Ad', width: 160, height: 600 }
  },
  rightSkinBanner: {
    id: 'rightSkinBanner',
    name: 'Right Skin Banner',
    dimensions: '160x600',
    enabled: true,
    script: '',
    fallbackAd: { text: 'Right Skin Ad', width: 160, height: 600 }
  },
  footerBanner: {
    id: 'footerBanner',
    name: 'Footer Banner',
    dimensions: '728x90',
    enabled: true,
    script: '',
    fallbackAd: { text: 'Footer Banner Ad', width: 728, height: 90 }
  },
  banner1: {
    id: 'banner1',
    name: 'MREC Banner 1',
    dimensions: '300x250',
    enabled: true,
    script: '',
    fallbackAd: { text: 'MREC Ad 1', width: 300, height: 250 }
  },
  banner2: {
    id: 'banner2',
    name: 'MREC Banner 2',
    dimensions: '300x250',
    enabled: true,
    script: '',
    fallbackAd: { text: 'MREC Ad 2', width: 300, height: 250 }
  }
};

interface BannerConfig {
  id: string;
  name: string;
  dimensions: string;
  enabled: boolean;
  script: string;
  fallbackAd: {
    text: string;
    width: number;
    height: number;
  };
}

export default function AdminBannerManagementPage() {
  const [bannerConfigs, setBannerConfigs] = useState(initialBannerConfigs);

  const toggleBanner = (bannerId: string) => {
    setBannerConfigs(prev => ({
      ...prev,
      [bannerId]: {
        ...prev[bannerId],
        enabled: !prev[bannerId].enabled
      }
    }));
  };

  const saveBanner = (bannerId: string) => {
    const script = (document.getElementById(`script-${bannerId}`) as HTMLTextAreaElement)?.value || '';
    setBannerConfigs(prev => ({
      ...prev,
      [bannerId]: {
        ...prev[bannerId],
        script
      }
    }));
    alert(`Banner ${bannerId} saved successfully!`);
  };

  const previewBanner = (bannerId: string) => {
    alert(`Preview for ${bannerId} - Feature coming soon!`);
  };

  const clearBanner = (bannerId: string) => {
    const textarea = document.getElementById(`script-${bannerId}`) as HTMLTextAreaElement;
    if (textarea) textarea.value = '';
    setBannerConfigs(prev => ({
      ...prev,
      [bannerId]: {
        ...prev[bannerId],
        script: ''
      }
    }));
  };

  const enableAllBanners = () => {
    setBannerConfigs(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = { ...updated[key], enabled: true };
      });
      return updated;
    });
  };

  const disableAllBanners = () => {
    setBannerConfigs(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key] = { ...updated[key], enabled: false };
      });
      return updated;
    });
  };

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(bannerConfigs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'banner-config.json';
    a.click();
  };

  const importConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string);
            setBannerConfigs(config);
            alert('Configuration imported successfully!');
          } catch {
            alert('Invalid configuration file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-[1200px] mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Banner Management</h1>
              <p className="text-gray-600">Manage advertisement banners across all pages of the website.</p>
            </div>

            {/* Banner Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(bannerConfigs).map(([key, config]) => (
                <div key={key} className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{config.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{config.dimensions}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={config.enabled}
                          onChange={() => toggleBanner(config.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Banner Preview */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                      <div className="flex justify-center">
                        <div
                          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs"
                          style={{
                            width: `${Math.min(config.fallbackAd.width, 300)}px`,
                            height: `${Math.min(config.fallbackAd.height, 150)}px`
                          }}
                        >
                          <div className="text-center">
                            <div className="mb-1">📢</div>
                            <div>{config.fallbackAd.text}</div>
                            <div className="text-gray-300">{config.dimensions}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Script Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advertisement Script
                      </label>
                      <textarea
                        id={`script-${config.id}`}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        placeholder="Paste your advertisement script here..."
                        defaultValue={config.script}
                      />
                    </div>

                    {/* Banner Location Info */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Banner Location</h4>
                      <p className="text-sm text-blue-700">
                        {config.id === 'topBanner' && 'Appears at the top of all pages above the header'}
                        {config.id === 'leftSkinBanner' && 'Left sidebar on desktop screens (1280px+)'}
                        {config.id === 'rightSkinBanner' && 'Right sidebar on desktop screens (1280px+)'}
                        {config.id === 'footerBanner' && 'Above the footer on all pages'}
                        {config.id === 'banner1' && 'First MREC banner in calculator pages'}
                        {config.id === 'banner2' && 'Second MREC banner in calculator pages'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => saveBanner(config.id)}
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => previewBanner(config.id)}
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        onClick={() => clearBanner(config.id)}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk Actions */}
            <div className="mt-12 bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Actions</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={enableAllBanners}
                >
                  Enable All Banners
                </button>
                <button
                  type="button"
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  onClick={disableAllBanners}
                >
                  Disable All Banners
                </button>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={exportConfig}
                >
                  Export Configuration
                </button>
                <button
                  type="button"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={importConfig}
                >
                  Import Configuration
                </button>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="mt-12 bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">📋 Usage Instructions</h2>
              <div className="space-y-4 text-blue-800">
                <div>
                  <h3 className="font-medium mb-2">Adding Advertisement Scripts:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Paste your ad network script (Google AdSense, etc.) in the script field</li>
                    <li>Include any necessary HTML wrapper elements</li>
                    <li>Scripts will be rendered with dangerouslySetInnerHTML</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Banner Placement:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Top Banner:</strong> 728x90 - Appears above header on all pages</li>
                    <li><strong>Skin Banners:</strong> 160x600 - Left/right sidebars on desktop only</li>
                    <li><strong>Footer Banner:</strong> 728x90 - Above footer on all pages</li>
                    <li><strong>MREC Banners:</strong> 300x250 - In calculator pages after results</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Best Practices:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Test scripts in preview before saving</li>
                    <li>Use responsive ad units when possible</li>
                    <li>Ensure scripts don&apos;t conflict with site functionality</li>
                    <li>Monitor performance impact after deployment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
