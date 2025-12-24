'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface PageSEO {
  pageId: string;
  pagePath: string;
  pageName: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  keywords: string;
  h1Title: string;
  subHeading: string;
  seoContent: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  faqs: FAQ[];
  faqsEnabled: boolean;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
  createdAt: string;
}

type TabType = 'meta' | 'content' | 'faqs' | 'og';

export default function AdminSEOManagementPage() {
  const [pages, setPages] = useState<PageSEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPage, setSelectedPage] = useState<PageSEO | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('meta');
  const [saving, setSaving] = useState(false);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state for the selected page
  const [formData, setFormData] = useState<Partial<PageSEO>>({});

  // New page form state
  const [newPage, setNewPage] = useState({
    pageId: '',
    pageName: '',
    pagePath: '',
    category: 'calculators'
  });

  // New/Edit FAQ form state
  const [faqForm, setFaqForm] = useState({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '',
    answer: '',
    order: 1
  });

  // Fetch all pages on load
  useEffect(() => {
    fetchPages();
  }, []);

  // Update form data when selected page changes
  useEffect(() => {
    if (selectedPage) {
      setFormData(selectedPage);
    }
  }, [selectedPage]);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/page-seo');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.pageId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(pages.map(p => p.category))];

  const handleSave = async () => {
    if (!selectedPage) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/page-seo/${selectedPage.pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchPages();
        showSuccess('SEO data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving SEO data:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPage = async () => {
    if (!newPage.pageId) return;
    setSaving(true);

    try {
      const response = await fetch('/api/page-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: newPage.pageId,
          pageName: newPage.pageName || newPage.pageId,
          pagePath: newPage.pagePath || `/us/tools/calculators/${newPage.pageId}`,
          category: newPage.category,
          isActive: true,
          faqsEnabled: true,
          faqs: []
        })
      });

      if (response.ok) {
        await fetchPages();
        setIsAddingPage(false);
        setNewPage({ pageId: '', pageName: '', pagePath: '', category: 'calculators' });
        showSuccess('Page added successfully!');
      }
    } catch (error) {
      console.error('Error adding page:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page SEO data?')) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/page-seo/${pageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPages();
        if (selectedPage?.pageId === pageId) {
          setSelectedPage(null);
        }
        showSuccess('Page deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!selectedPage) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/page-seo/${selectedPage.pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !formData.isActive })
      });

      if (response.ok) {
        setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
        await fetchPages();
        showSuccess(`Page ${!formData.isActive ? 'activated' : 'deactivated'}!`);
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    } finally {
      setSaving(false);
    }
  };

  // FAQ Functions
  const handleSaveFaq = async () => {
    if (!selectedPage) return;
    setSaving(true);

    try {
      if (editingFaq) {
        // Update existing FAQ
        const response = await fetch(`/api/page-seo/${selectedPage.pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update-faq',
            faqId: editingFaq.id,
            updates: faqForm
          })
        });

        if (response.ok) {
          await fetchPages();
          const updatedPage = pages.find(p => p.pageId === selectedPage.pageId);
          if (updatedPage) {
            setSelectedPage(updatedPage);
            setFormData(updatedPage);
          }
          setEditingFaq(null);
          setFaqForm({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '', answer: '', order: 1 });
          showSuccess('FAQ updated successfully!');
        }
      } else {
        // Add new FAQ
        const response = await fetch(`/api/page-seo/${selectedPage.pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add-faq',
            faq: faqForm
          })
        });

        if (response.ok) {
          await fetchPages();
          setIsAddingFaq(false);
          setFaqForm({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '', answer: '', order: 1 });
          showSuccess('FAQ added successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!selectedPage || !confirm('Are you sure you want to delete this FAQ?')) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/page-seo/${selectedPage.pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-faq',
          faqId
        })
      });

      if (response.ok) {
        await fetchPages();
        showSuccess('FAQ deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="SEO Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="SEO Management">
      <div className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Page SEO Management (Firebase)</h3>
          <p className="text-sm text-blue-700">
            Manage SEO content for all pages. Data is stored in Firebase Firestore and includes meta tags,
            page content, H1 titles, SEO content, and FAQs.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{pages.length}</div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">
              {pages.filter(p => p.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Pages</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-purple-600">
              {pages.reduce((acc, p) => acc + (p.faqs?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total FAQs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Page List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Pages</h3>
                <button
                  onClick={() => setIsAddingPage(true)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  + Add Page
                </button>
              </div>

              {/* Search & Filter */}
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Page List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredPages.map((page) => (
                  <div
                    key={page.pageId}
                    className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                      selectedPage?.pageId === page.pageId
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => {
                      setSelectedPage(page);
                      setActiveTab('meta');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">
                          {page.pageName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{page.pagePath}</div>
                      </div>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        page.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {page.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredPages.length === 0 && (
                  <div className="text-center text-gray-500 py-4">No pages found</div>
                )}
              </div>
            </div>
          </div>

          {/* SEO Editor */}
          <div className="lg:col-span-2">
            {selectedPage ? (
              <div className="bg-white shadow rounded-lg">
                {/* Page Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{formData.pageName}</h3>
                      <p className="text-sm text-gray-500">{formData.pagePath}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToggleActive}
                        disabled={saving}
                        className={`px-3 py-1 text-sm rounded ${
                          formData.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDeletePage(selectedPage.pageId)}
                        disabled={saving}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                  <nav className="flex -mb-px">
                    {[
                      { id: 'meta', label: 'Meta & SEO' },
                      { id: 'content', label: 'Page Content' },
                      { id: 'faqs', label: 'FAQs' },
                      { id: 'og', label: 'Open Graph' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {/* Meta & SEO Tab */}
                  {activeTab === 'meta' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Title <span className="text-gray-400">({(formData.metaTitle || '').length}/60)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.metaTitle || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                          placeholder="Enter meta title..."
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Description <span className="text-gray-400">({(formData.metaDescription || '').length}/160)</span>
                        </label>
                        <textarea
                          value={formData.metaDescription || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                          placeholder="Enter meta description..."
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                        <input
                          type="text"
                          value={formData.canonical || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, canonical: e.target.value }))}
                          placeholder="https://example.com/page"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                        <input
                          type="text"
                          value={formData.keywords || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                          placeholder="keyword1, keyword2, keyword3"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
                          <input
                            type="text"
                            value={formData.pageName || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, pageName: e.target.value }))}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <input
                            type="text"
                            value={formData.category || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page Content Tab */}
                  {activeTab === 'content' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">H1 Title</label>
                        <input
                          type="text"
                          value={formData.h1Title || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, h1Title: e.target.value }))}
                          placeholder="Main page heading (H1)"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sub Heading <span className="text-gray-400">(Two-liner content below H1)</span>
                        </label>
                        <textarea
                          value={formData.subHeading || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, subHeading: e.target.value }))}
                          placeholder="Brief description below the main heading..."
                          rows={2}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SEO Content <span className="text-gray-400">(HTML supported)</span>
                        </label>
                        <textarea
                          value={formData.seoContent || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, seoContent: e.target.value }))}
                          placeholder="<p>Rich SEO content with HTML formatting...</p>"
                          rows={10}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Supports HTML tags: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
                        </p>
                      </div>

                      {/* Preview */}
                      {formData.seoContent && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: formData.seoContent }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* FAQs Tab */}
                  {activeTab === 'faqs' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.faqsEnabled ?? true}
                            onChange={(e) => setFormData(prev => ({ ...prev, faqsEnabled: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">FAQs Enabled</span>
                        </label>
                        <span className="text-sm text-gray-500">
                          {formData.faqs?.length || 0} FAQs
                        </span>
                      </div>

                      {/* FAQs List */}
                      <div className="space-y-3">
                        {(formData.faqs || []).sort((a, b) => a.order - b.order).map((faq) => (
                          <div key={faq.id} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">#{faq.order}</span>
                                  <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => {
                                    setEditingFaq(faq);
                                    setFaqForm({
                                      question: faq.question,
                                      answer: faq.answer,
                                      order: faq.order
                                    });
                                    setIsAddingFaq(false);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteFaq(faq.id)}
                                  disabled={saving}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {(formData.faqs || []).length === 0 && !isAddingFaq && (
                          <div className="text-center text-gray-500 py-8">
                            No FAQs added yet. Click &quot;Add FAQ&quot; to create one.
                          </div>
                        )}
                      </div>

                      {/* Add FAQ Button */}
                      {!isAddingFaq && !editingFaq && (
                        <button
                          onClick={() => {
                            setIsAddingFaq(true);
                            setFaqForm({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '',
                              answer: '',
                              order: (formData.faqs?.length || 0) + 1
                            });
                          }}
                          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                          + Add FAQ
                        </button>
                      )}

                      {/* FAQ Form */}
                      {(isAddingFaq || editingFaq) && (
                        <div className="border rounded-lg p-4 bg-blue-50">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                              <input
                                type="number"
                                min="1"
                                value={faqForm.order}
                                onChange={(e) => setFaqForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                                className="block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                              <input
                                type="text"
                                value={faqForm.question}
                                onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                                placeholder="Enter the FAQ question..."
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                              <textarea
                                value={faqForm.answer}
                                onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                                placeholder="Enter the FAQ answer..."
                                rows={4}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveFaq}
                                disabled={saving || !faqForm.question || !faqForm.answer}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                              >
                                {saving ? 'Saving...' : 'Save FAQ'}
                              </button>
                              <button
                                onClick={() => {
                                  setIsAddingFaq(false);
                                  setEditingFaq(null);
                                  setFaqForm({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '', answer: '', order: 1 });
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Open Graph Tab */}
                  {activeTab === 'og' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                        <input
                          type="text"
                          value={formData.ogTitle || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, ogTitle: e.target.value }))}
                          placeholder="Open Graph title (for social sharing)"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                        <textarea
                          value={formData.ogDescription || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, ogDescription: e.target.value }))}
                          placeholder="Open Graph description (for social sharing)"
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                        <input
                          type="text"
                          value={formData.ogImage || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, ogImage: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      {formData.ogImage && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Image Preview:</h4>
                          <img
                            src={formData.ogImage}
                            alt="OG Preview"
                            className="max-w-xs rounded border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Last updated: {formData.lastUpdated ? new Date(formData.lastUpdated).toLocaleString() : 'Never'}
                      {formData.updatedBy && ` by ${formData.updatedBy}`}
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2">Select a page to manage its SEO content</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Page Modal */}
        {isAddingPage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Page</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page ID *</label>
                  <input
                    type="text"
                    value={newPage.pageId}
                    onChange={(e) => setNewPage(prev => ({ ...prev, pageId: e.target.value }))}
                    placeholder="e.g., salary-calculator"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
                  <input
                    type="text"
                    value={newPage.pageName}
                    onChange={(e) => setNewPage(prev => ({ ...prev, pageName: e.target.value }))}
                    placeholder="e.g., Salary Calculator"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Path</label>
                  <input
                    type="text"
                    value={newPage.pagePath}
                    onChange={(e) => setNewPage(prev => ({ ...prev, pagePath: e.target.value }))}
                    placeholder="e.g., /us/tools/calculators/salary-calculator"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newPage.category}
                    onChange={(e) => setNewPage(prev => ({ ...prev, category: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="calculators">calculators</option>
                    <option value="converters">converters</option>
                    <option value="tools">tools</option>
                    <option value="games">games</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAddPage}
                    disabled={saving || !newPage.pageId}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    {saving ? 'Adding...' : 'Add Page'}
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingPage(false);
                      setNewPage({ pageId: '', pageName: '', pagePath: '', category: 'calculators' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
