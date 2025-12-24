'use client';

import { useState, useEffect } from 'react';

interface Script {
  id: string;
  name: string;
  enabled: boolean;
  script: string;
}

interface ScriptData {
  headerScripts: Script[];
  bodyScripts: Script[];
}

export default function ScriptManagementClient() {
  const [scriptData, setScriptData] = useState<ScriptData | null>(null);
  const [selectedScript, setSelectedScript] = useState<{ script: Script; location: 'header' | 'body' } | null>(null);
  const [editData, setEditData] = useState<Script | null>(null);
  const [editLocation, setEditLocation] = useState<'header' | 'body'>('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newScriptLocation, setNewScriptLocation] = useState<'header' | 'body'>('header');

  useEffect(() => {
    fetchScriptData();
  }, []);

  const fetchScriptData = async () => {
    try {
      const response = await fetch('/api/admin/scripts');
      const data = await response.json();
      setScriptData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching script data:', error);
      setLoading(false);
    }
  };

  const handleSelectScript = (script: Script, location: 'header' | 'body') => {
    setSelectedScript({ script, location });
    setEditData({ ...script });
    setEditLocation(location);
    setMessage(null);
  };

  const handleSave = async () => {
    if (!editData) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editData, location: editLocation })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Script saved successfully!' });
        fetchScriptData();
      } else {
        setMessage({ type: 'error', text: 'Failed to save script' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving script' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, location: 'header' | 'body') => {
    if (!confirm('Are you sure you want to delete this script?')) return;

    try {
      const response = await fetch(`/api/admin/scripts?id=${id}&location=${location}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSelectedScript(null);
        setEditData(null);
        fetchScriptData();
      }
    } catch (error) {
      console.error('Error deleting script:', error);
    }
  };

  const handleToggleEnabled = async (script: Script, location: 'header' | 'body') => {
    try {
      await fetch('/api/admin/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...script, enabled: !script.enabled, location })
      });
      fetchScriptData();
    } catch (error) {
      console.error('Error toggling script:', error);
    }
  };

  const handleAddScript = async () => {
    const newScript = {
      id: `custom-${Date.now()}`,
      name: 'New Script',
      enabled: false,
      script: ''
    };

    try {
      await fetch('/api/admin/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newScript, location: newScriptLocation })
      });
      fetchScriptData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding script:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Scripts List */}
      <div className="space-y-6">
        {/* Header Scripts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Header Scripts</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">&lt;head&gt;</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">Scripts added to the &lt;head&gt; section of the page</p>

          <div className="space-y-2">
            {scriptData?.headerScripts.map((script) => (
              <div
                key={script.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                  selectedScript?.script.id === script.id && editLocation === 'header'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => handleSelectScript(script, 'header')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📜</span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{script.name}</div>
                    <div className="text-xs text-gray-500">{script.id}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleEnabled(script, 'header'); }}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    script.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    script.enabled ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Body Scripts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Body Scripts</h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">&lt;body&gt;</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">Scripts added to the &lt;body&gt; section of the page</p>

          <div className="space-y-2">
            {scriptData?.bodyScripts.map((script) => (
              <div
                key={script.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                  selectedScript?.script.id === script.id && editLocation === 'body'
                    ? 'bg-purple-50 border border-purple-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => handleSelectScript(script, 'body')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📜</span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{script.name}</div>
                    <div className="text-xs text-gray-500">{script.id}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleEnabled(script, 'body'); }}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    script.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    script.enabled ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Script Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          + Add New Script
        </button>
      </div>

      {/* Edit Form */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {selectedScript && editData ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-gray-900">Edit Script: {editData.name}</h2>
                <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                  editLocation === 'header' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {editLocation === 'header' ? 'Header Script' : 'Body Script'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(editData.id, editLocation)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              {/* Script Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Script Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Google Tag Manager"
                />
              </div>

              {/* Script ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Script ID</label>
                <input
                  type="text"
                  value={editData.id}
                  onChange={(e) => setEditData({ ...editData, id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="gtm-head"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for this script</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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

              {/* Script Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Script Code</label>
                <textarea
                  value={editData.script}
                  onChange={(e) => setEditData({ ...editData, script: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="<!-- Paste your script code here -->"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the complete script including &lt;script&gt; tags
                </p>
              </div>

              {/* Common Scripts */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Templates</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditData({
                      ...editData,
                      name: 'Google Tag Manager (Head)',
                      script: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`
                    })}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-400"
                  >
                    GTM (Head)
                  </button>
                  <button
                    onClick={() => setEditData({
                      ...editData,
                      name: 'Google Tag Manager (Body)',
                      script: `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`
                    })}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-400"
                  >
                    GTM (Body)
                  </button>
                  <button
                    onClick={() => setEditData({
                      ...editData,
                      name: 'Google Analytics 4',
                      script: `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`
                    })}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-400"
                  >
                    GA4
                  </button>
                  <button
                    onClick={() => setEditData({
                      ...editData,
                      name: 'Facebook Pixel',
                      script: `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->`
                    })}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-400"
                  >
                    FB Pixel
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <p>Select a script to edit or add a new one</p>
          </div>
        )}
      </div>

      {/* Add Script Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Script</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Script Location</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setNewScriptLocation('header')}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    newScriptLocation === 'header'
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                  }`}
                >
                  Header (&lt;head&gt;)
                </button>
                <button
                  onClick={() => setNewScriptLocation('body')}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    newScriptLocation === 'body'
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-400'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                  }`}
                >
                  Body (&lt;body&gt;)
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddScript}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Script
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
