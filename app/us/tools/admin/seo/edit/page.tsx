'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order?: number;
}

interface PageSEO {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subHeading: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  faqs: FAQ[];
}

function SEOEditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pagePath = searchParams.get('path') || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'meta' | 'content' | 'faqs' | 'og'>('meta');

  const [formData, setFormData] = useState<PageSEO>({
    metaTitle: '',
    metaDescription: '',
    h1: '',
    subHeading: '',
    keywords: '',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    faqs: []
  });

  // FAQ editing state
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [newFaq, setNewFaq] = useState<FAQ>({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '', answer: '' });

  useEffect(() => {
    if (pagePath) {
      fetchPageData();
    }
  }, [pagePath]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/seo?path=${encodeURIComponent(pagePath)}`);
      const data = await response.json();

      if (data.pages && data.pages[pagePath]) {
        const pageData = data.pages[pagePath];
        setFormData({
          metaTitle: pageData.metaTitle || '',
          metaDescription: pageData.metaDescription || '',
          h1: pageData.h1 || '',
          subHeading: pageData.subHeading || '',
          keywords: pageData.keywords || '',
          canonical: pageData.canonical || '',
          ogTitle: pageData.ogTitle || '',
          ogDescription: pageData.ogDescription || '',
          ogImage: pageData.ogImage || '',
          faqs: pageData.faqs || []
        });
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
      setMessage({ type: 'error', text: 'Failed to load page data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pagePath,
          ...formData
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'SEO data saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save SEO data' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving SEO data' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { ...newFaq, id: `faq-${Date.now()}`, order: prev.faqs.length + 1 }]
      }));
      setNewFaq({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '', answer: '' });
    }
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => {
      const newFaqs = [...prev.faqs];
      newFaqs[index] = { ...newFaqs[index], [field]: value };
      return { ...prev, faqs: newFaqs };
    });
  };

  const handleDeleteFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const newFaqs = [...prev.faqs];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex >= 0 && newIndex < newFaqs.length) {
        [newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]];
      }
      return { ...prev, faqs: newFaqs };
    });
  };

  if (!pagePath) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No page path specified</p>
        <Link href="/us/tools/admin/seo" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to SEO Management
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-600 text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-gray-900">Edit SEO</h1>
            <p className="text-sm text-gray-500 mt-1">{pagePath}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={pagePath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Page
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
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

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'meta', label: 'Meta & SEO', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
              { id: 'content', label: 'Page Content', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'faqs', label: `FAQs (${formData.faqs.length})`, icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { id: 'og', label: 'Open Graph', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Meta & SEO Tab */}
          {activeTab === 'meta' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                  <span className={`ml-2 text-sm font-normal ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                    ({formData.metaTitle.length}/60 characters)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Enter meta title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Optimal length: 50-60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                  <span className={`ml-2 text-sm font-normal ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                    ({formData.metaDescription.length}/160 characters)
                  </span>
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Enter meta description..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Optimal length: 150-160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Comma-separated keywords for SEO</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                <input
                  type="text"
                  value={formData.canonical}
                  onChange={(e) => setFormData(prev => ({ ...prev, canonical: e.target.value }))}
                  placeholder="https://economictimes.com/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to use the current page URL</p>
              </div>

              {/* Preview Card */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Search Preview</h4>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-blue-600 text-lg font-medium truncate">
                    {formData.metaTitle || 'Page Title'}
                  </div>
                  <div className="text-green-700 text-sm truncate">
                    {pagePath}
                  </div>
                  <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {formData.metaDescription || 'Meta description will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">H1 Heading</label>
                <input
                  type="text"
                  value={formData.h1}
                  onChange={(e) => setFormData(prev => ({ ...prev, h1: e.target.value }))}
                  placeholder="Main page heading..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">The main visible heading on the page</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Heading
                  <span className="ml-2 text-sm font-normal text-gray-400">(Two-liner content below H1)</span>
                </label>
                <textarea
                  value={formData.subHeading}
                  onChange={(e) => setFormData(prev => ({ ...prev, subHeading: e.target.value }))}
                  placeholder="Brief description below the main heading..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              {/* Add New FAQ */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="text-sm font-medium text-orange-900 mb-3">Add New FAQ</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter question..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Enter answer..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={handleAddFaq}
                    disabled={!newFaq.question || !newFaq.answer}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    Add FAQ
                  </button>
                </div>
              </div>

              {/* Existing FAQs */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Existing FAQs ({formData.faqs.length})
                </h4>
                {formData.faqs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No FAQs added yet
                  </div>
                ) : (
                  formData.faqs.map((faq, index) => (
                    <div key={faq.id || index} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              #{index + 1}
                            </span>
                          </div>
                          {editingFaqIndex === index ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              />
                              <textarea
                                value={faq.answer}
                                onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              />
                              <button
                                onClick={() => setEditingFaqIndex(null)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                              >
                                Done Editing
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="font-medium text-gray-900">{faq.question}</div>
                              <div className="text-sm text-gray-600 mt-1">{faq.answer}</div>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveFaq(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                            title="Move up"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMoveFaq(index, 'down')}
                            disabled={index === formData.faqs.length - 1}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                            title="Move down"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditingFaqIndex(editingFaqIndex === index ? null : index)}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(index)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Open Graph Tab */}
          {activeTab === 'og' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                <p className="text-sm text-blue-700">
                  Open Graph meta tags control how your page appears when shared on social media platforms like Facebook, LinkedIn, and Twitter.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Title</label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, ogTitle: e.target.value }))}
                  placeholder="Title for social sharing..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to use Meta Title</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Description</label>
                <textarea
                  value={formData.ogDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, ogDescription: e.target.value }))}
                  placeholder="Description for social sharing..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to use Meta Description</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
                <input
                  type="text"
                  value={formData.ogImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, ogImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Recommended size: 1200x630 pixels</p>
              </div>

              {/* OG Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Social Share Preview</h4>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
                  {formData.ogImage && (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <img
                        src={formData.ogImage}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-xs text-gray-500 uppercase">economictimes.com</div>
                    <div className="font-medium text-gray-900 mt-1">
                      {formData.ogTitle || formData.metaTitle || 'Page Title'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {formData.ogDescription || formData.metaDescription || 'Page description...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SEOEditPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-600 text-lg">Loading...</span>
        </div>
      </div>
    }>
      <SEOEditForm />
    </Suspense>
  );
}
