'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewSEOPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    pagePath: '',
    category: 'calculators',
    metaTitle: '',
    metaDescription: '',
    h1: '',
    subHeading: '',
    keywords: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pagePath) {
      setMessage({ type: 'error', text: 'Page path is required' });
      return;
    }

    // Ensure path starts with /
    let path = formData.pagePath;
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          h1: formData.h1,
          subHeading: formData.subHeading,
          keywords: formData.keywords,
          faqs: []
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Page created successfully!' });
        setTimeout(() => {
          router.push(`/us/tools/admin/seo/edit?path=${encodeURIComponent(path)}`);
        }, 1000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to create page' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating page' });
    } finally {
      setSaving(false);
    }
  };

  const generatePath = () => {
    const base = formData.category === 'calculators' ? '/us/tools/calculators/' :
                 formData.category === 'games' ? '/us/tools/games/' :
                 formData.category === 'apps' ? '/us/tools/apps/' : '/us/tools/';
    return base;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/us/tools/admin/seo"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Page</h1>
          <p className="text-sm text-gray-500 mt-1">Create SEO content for a new page</p>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`px-4 py-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex gap-3">
              {[
                { id: 'calculators', label: 'Calculator', color: 'blue' },
                { id: 'games', label: 'Game', color: 'green' },
                { id: 'apps', label: 'App', color: 'purple' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.category === cat.id
                      ? cat.color === 'blue' ? 'border-blue-500 bg-blue-50 text-blue-700' :
                        cat.color === 'green' ? 'border-green-500 bg-green-50 text-green-700' :
                        'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page Path */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Path *</label>
            <div className="flex">
              <span className="inline-flex items-center px-4 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-lg text-sm">
                {generatePath()}
              </span>
              <input
                type="text"
                value={formData.pagePath.replace(generatePath(), '')}
                onChange={(e) => setFormData(prev => ({ ...prev, pagePath: generatePath() + e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                placeholder="page-slug"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Full path: {formData.pagePath || generatePath() + 'page-slug'}
            </p>
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
              <span className={`ml-2 text-sm font-normal ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                ({formData.metaTitle.length}/60)
              </span>
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
              placeholder="Enter meta title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
              <span className={`ml-2 text-sm font-normal ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                ({formData.metaDescription.length}/160)
              </span>
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
              placeholder="Enter meta description..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* H1 Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">H1 Heading</label>
            <input
              type="text"
              value={formData.h1}
              onChange={(e) => setFormData(prev => ({ ...prev, h1: e.target.value }))}
              placeholder="Main page heading..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Sub Heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Heading</label>
            <textarea
              value={formData.subHeading}
              onChange={(e) => setFormData(prev => ({ ...prev, subHeading: e.target.value }))}
              placeholder="Brief description below the main heading..."
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="keyword1, keyword2, keyword3..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={saving || !formData.pagePath}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Page
                </>
              )}
            </button>
            <Link
              href="/us/tools/admin/seo"
              className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for creating SEO content</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Use descriptive, keyword-rich meta titles (50-60 characters)</li>
          <li>Write compelling meta descriptions that encourage clicks (150-160 characters)</li>
          <li>Make the H1 heading clear and relevant to the page content</li>
          <li>You can add FAQs and more details after creating the page</li>
        </ul>
      </div>
    </div>
  );
}
