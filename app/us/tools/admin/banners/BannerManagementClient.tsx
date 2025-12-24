'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: string;
  name: string;
  enabled: boolean;
  script: string;
  dimensions: string;
  platform?: 'desktop' | 'mobile' | 'all';
  category?: string;
  minContainerSize?: string;
  fallbackAd: {
    text: string;
    width: number;
    height: number;
  };
}

interface BannerData {
  banners: { [key: string]: Banner };
}

export default function BannerManagementClient() {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [editData, setEditData] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      const data = await response.json();
      setBannerData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banner data:', error);
      setLoading(false);
    }
  };

  const handleSelectBanner = (id: string) => {
    setSelectedBanner(id);
    if (bannerData?.banners[id]) {
      setEditData({ ...bannerData.banners[id] });
    }
    setMessage(null);
  };

  const handleSave = async () => {
    if (!selectedBanner || !editData) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Banner saved successfully!' });
        fetchBannerData();
      } else {
        setMessage({ type: 'error', text: 'Failed to save banner' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving banner' });
    }
    setSaving(false);
  };

  const handleToggleEnabled = async (id: string) => {
    const banner = bannerData?.banners[id];
    if (!banner) return;

    try {
      await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, enabled: !banner.enabled })
      });
      fetchBannerData();
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  const getBannerIcon = (id: string) => {
    if (id.includes('Skinner') || id.includes('Skin')) return '📐';
    if (id.includes('AboveFold') || id.includes('BelowFold') || id.includes('BelowHeader')) return '📏';
    if (id.includes('Mrec') || id.includes('mrec')) return '🖼️';
    if (id.includes('Footer') || id.includes('footer')) return '🦶';
    if (id.includes('top')) return '📏';
    return '📢';
  };

  // Filter banners by platform
  const getDesktopBanners = () => {
    if (!bannerData?.banners) return [];
    return Object.values(bannerData.banners).filter(
      b => b.platform === 'desktop' || b.id.startsWith('web') ||
           ['topBanner', 'footerBanner', 'leftSkinBanner', 'rightSkinBanner'].includes(b.id)
    );
  };

  const getMobileBanners = () => {
    if (!bannerData?.banners) return [];
    return Object.values(bannerData.banners).filter(
      b => b.platform === 'mobile' || b.id.startsWith('mobile')
    );
  };

  const currentBanners = activeTab === 'desktop' ? getDesktopBanners() : getMobileBanners();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Banners List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Ad Banners</h2>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'desktop'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🖥️ Desktop ({getDesktopBanners().length})
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'mobile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📱 Mobile ({getMobileBanners().length})
          </button>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {currentBanners.map((banner) => (
            <div
              key={banner.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                selectedBanner === banner.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
              }`}
              onClick={() => handleSelectBanner(banner.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getBannerIcon(banner.id)}</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{banner.name}</div>
                  <div className="text-xs text-gray-500">{banner.dimensions}</div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleEnabled(banner.id); }}
                className={`w-10 h-6 rounded-full transition-colors ${
                  banner.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                  banner.enabled ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Banner Types</h3>
          <div className="space-y-1 text-xs text-gray-500">
            {activeTab === 'desktop' ? (
              <>
                <div>📏 Above/Below Fold - (728x90, 970x250)</div>
                <div>🖼️ MREC - In-content (300x250, 336x280)</div>
                <div>📐 Skinner - Left/Right side (160x600)</div>
                <div>🦶 Footer - Above footer (728x90, 970x250)</div>
              </>
            ) : (
              <>
                <div>📏 Above Fold - (320x50, 320x100)</div>
                <div>📏 Below Header - (320x50)</div>
                <div>🖼️ MREC - In-content (300x250, 336x280)</div>
                <div>🦶 Footer - Above footer (320x50, 320x100)</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {selectedBanner && editData ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">Edit Banner: {editData.name}</h2>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                  editData.platform === 'mobile'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {editData.platform === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'}
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              {/* Banner Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Dimensions & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editData.dimensions}
                    onChange={(e) => setEditData({ ...editData, dimensions: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="728x90, 970x250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex items-center gap-3 h-[42px]">
                    <button
                      onClick={() => setEditData({ ...editData, enabled: !editData.enabled })}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        editData.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {editData.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Min Container Size */}
              {editData.minContainerSize && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Container Size</label>
                  <input
                    type="text"
                    value={editData.minContainerSize}
                    onChange={(e) => setEditData({ ...editData, minContainerSize: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="300x250"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum size for the ad container</p>
                </div>
              )}

              {/* Ad Script */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Script / HTML Code
                </label>
                <textarea
                  value={editData.script}
                  onChange={(e) => setEditData({ ...editData, script: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="<!-- Paste your ad script here -->"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the ad network script (DFP, AdSense, etc.) or custom HTML
                </p>
              </div>

              {/* Fallback Settings */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Fallback Placeholder</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Text</label>
                    <input
                      type="text"
                      value={editData.fallbackAd.text}
                      onChange={(e) => setEditData({
                        ...editData,
                        fallbackAd: { ...editData.fallbackAd, text: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={editData.fallbackAd.width}
                      onChange={(e) => setEditData({
                        ...editData,
                        fallbackAd: { ...editData.fallbackAd, width: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={editData.fallbackAd.height}
                      onChange={(e) => setEditData({
                        ...editData,
                        fallbackAd: { ...editData.fallbackAd, height: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center overflow-auto">
                  <div
                    className="bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-gray-500 text-xs"
                    style={{
                      width: Math.min(editData.fallbackAd.width, 600),
                      height: Math.min(editData.fallbackAd.height, 200),
                      maxWidth: '100%'
                    }}
                  >
                    {editData.fallbackAd.text} ({editData.dimensions})
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Select a banner to edit its configuration</p>
            <p className="text-sm mt-2">
              Choose from {getDesktopBanners().length} desktop or {getMobileBanners().length} mobile banners
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
