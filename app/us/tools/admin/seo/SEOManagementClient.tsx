'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order?: number;
}

interface PageSEO {
  pageId: string;
  pagePath: string;
  pageName: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  h1Title: string;
  faqs: FAQ[];
  isActive: boolean;
  lastUpdated?: string;
}

interface BulkStatus {
  total: number;
  withSEO: number;
  missingSEO: number;
  existing: number;
  categories: {
    calculators: number;
    games: number;
    apps: number;
  };
}

export default function SEOManagementClient() {
  const [pages, setPages] = useState<PageSEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Bulk operations state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<BulkStatus | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<string>('');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo');
      const data = await response.json();

      // Convert pages object to array format
      if (data.pages) {
        const pagesArray: PageSEO[] = Object.entries(data.pages).map(([path, pageData]: [string, any]) => ({
          pageId: path.split('/').pop() || path,
          pagePath: path,
          pageName: pageData.h1 || path.split('/').pop()?.replace(/-/g, ' ') || path,
          category: path.includes('/games/') ? 'games' : path.includes('/apps/') ? 'apps' : 'calculators',
          metaTitle: pageData.metaTitle || '',
          metaDescription: pageData.metaDescription || '',
          h1Title: pageData.h1 || '',
          faqs: pageData.faqs || [],
          isActive: true,
          lastUpdated: ''
        }));
        setPages(pagesArray);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setMessage({ type: 'error', text: 'Failed to load pages' });
    } finally {
      setLoading(false);
    }
  };

  // Filter and search pages
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch =
        page.pagePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.metaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.h1Title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [pages, searchQuery, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const paginatedPages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPages.slice(start, start + itemsPerPage);
  }, [filteredPages, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(pages.map(p => p.category))];
  }, [pages]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: pages.length,
      calculators: pages.filter(p => p.category === 'calculators').length,
      games: pages.filter(p => p.category === 'games').length,
      apps: pages.filter(p => p.category === 'apps').length,
      withFaqs: pages.filter(p => p.faqs && p.faqs.length > 0).length
    };
  }, [pages]);

  const handleDelete = async (pagePath: string) => {
    try {
      const response = await fetch(`/api/admin/seo?path=${encodeURIComponent(pagePath)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Page deleted successfully' });
        fetchPages();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete page' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting page' });
    }
    setDeleteConfirm(null);
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch bulk status
  const fetchBulkStatus = async () => {
    try {
      setBulkLoading(true);
      const response = await fetch('/api/admin/seo/bulk');
      const data = await response.json();
      setBulkStatus(data);
    } catch (error) {
      console.error('Error fetching bulk status:', error);
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle bulk operations
  const handleBulkAction = async (action: string, options: { category?: string; overwrite?: boolean } = {}) => {
    try {
      setBulkLoading(true);
      setBulkProgress(`Processing ${action}...`);

      const response = await fetch('/api/admin/seo/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...options })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setBulkProgress('');
        fetchPages(); // Refresh the list
        fetchBulkStatus(); // Update status
      } else {
        setMessage({ type: 'error', text: data.error || 'Operation failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bulk operation failed' });
    } finally {
      setBulkLoading(false);
      setBulkProgress('');
    }
  };

  // Open bulk modal and fetch status
  const openBulkModal = () => {
    setShowBulkModal(true);
    fetchBulkStatus();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-600 text-lg">Loading pages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Pages</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.calculators}</div>
          <div className="text-sm text-gray-500">Calculators</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">{stats.games}</div>
          <div className="text-sm text-gray-500">Games</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.apps}</div>
          <div className="text-sm text-gray-500">Apps</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.withFaqs}</div>
          <div className="text-sm text-gray-500">With FAQs</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by URL, title, or H1..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>

            {/* Bulk Operations Button */}
            <button
              onClick={openBulkModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              Bulk SEO
            </button>

            {/* Add New Page Button */}
            <Link
              href="/us/tools/admin/seo/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Page
            </Link>
          </div>
        </div>

        {/* Search Results Info */}
        {(searchQuery || categoryFilter !== 'all') && (
          <div className="mt-3 text-sm text-gray-500">
            Showing {filteredPages.length} of {pages.length} pages
            {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
            {categoryFilter !== 'all' && <span> in {categoryFilter}</span>}
          </div>
        )}
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Page URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  H1 Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  FAQs
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No pages found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                paginatedPages.map((page) => (
                  <tr key={page.pagePath} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 truncate" title={page.pagePath}>
                          {page.pagePath}
                        </div>
                        {page.metaTitle && (
                          <div className="text-xs text-gray-500 truncate mt-1" title={page.metaTitle}>
                            {page.metaTitle}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={page.h1Title || '-'}>
                        {page.h1Title || <span className="text-gray-400">Not set</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.category === 'calculators' ? 'bg-blue-100 text-blue-800' :
                        page.category === 'games' ? 'bg-green-100 text-green-800' :
                        page.category === 'apps' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {page.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.faqs && page.faqs.length > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {page.faqs?.length || 0} FAQs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/us/tools/admin/seo/edit?path=${encodeURIComponent(page.pagePath)}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        {deleteConfirm === page.pagePath ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(page.pagePath)}
                              className="px-2 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(page.pagePath)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPages.length)} of {filteredPages.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                      return false;
                    })
                    .map((page, index, array) => (
                      <span key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-orange-500 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))
                  }
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Guide</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div>
              <strong>Search:</strong> Find pages by URL, title, or H1 heading
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <div>
              <strong>Filter:</strong> View calculators, games, or apps separately
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <div>
              <strong>Edit:</strong> Update meta title, description, H1, FAQs, and more
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Operations Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Bulk SEO Operations</h2>
                <p className="text-sm text-gray-500 mt-1">Generate and sync SEO data for all pages</p>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Section */}
              {bulkStatus && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600">{bulkStatus.total}</div>
                      <div className="text-xs text-gray-500">Total Pages</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-2xl font-bold text-green-600">{bulkStatus.existing}</div>
                      <div className="text-xs text-gray-500">With SEO</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-2xl font-bold text-orange-600">{bulkStatus.missingSEO}</div>
                      <div className="text-xs text-gray-500">Missing SEO</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-2xl font-bold text-purple-600">
                        {bulkStatus.existing > 0 ? Math.round((bulkStatus.existing / bulkStatus.total) * 100) : 0}%
                      </div>
                      <div className="text-xs text-gray-500">Coverage</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Calculators: {bulkStatus.categories.calculators} |
                    Games: {bulkStatus.categories.games} |
                    Apps: {bulkStatus.categories.apps}
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              {bulkProgress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-blue-700">{bulkProgress}</span>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>

                {/* Import Missing */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-900">Import Missing SEO</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Imports SEO data for {bulkStatus?.missingSEO || 0} pages that don&apos;t have data yet. Won&apos;t overwrite existing.
                      </p>
                    </div>
                    <button
                      onClick={() => handleBulkAction('import-missing')}
                      disabled={bulkLoading || (bulkStatus?.missingSEO === 0)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                    >
                      Import Missing
                    </button>
                  </div>
                </div>

                {/* Import All */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-orange-900">Import All SEO ({bulkStatus?.total || 0} pages)</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Re-imports SEO for ALL {bulkStatus?.total || 0} pages. Use with caution - this overwrites existing customizations.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`This will overwrite SEO data for all ${bulkStatus?.total || 0} pages. Are you sure?`)) {
                          handleBulkAction('import-all', { overwrite: true });
                        }
                      }}
                      disabled={bulkLoading}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm font-medium"
                    >
                      Import All
                    </button>
                  </div>
                </div>

                {/* By Category */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-3">Import by Category</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleBulkAction('import-category', { category: 'calculators' })}
                      disabled={bulkLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                    >
                      Calculators ({bulkStatus?.categories?.calculators || 0})
                    </button>
                    <button
                      onClick={() => handleBulkAction('import-category', { category: 'games' })}
                      disabled={bulkLoading}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                    >
                      Games ({bulkStatus?.categories?.games || 0})
                    </button>
                    <button
                      onClick={() => handleBulkAction('import-category', { category: 'apps' })}
                      disabled={bulkLoading}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 text-sm"
                    >
                      Apps ({bulkStatus?.categories?.apps || 0})
                    </button>
                  </div>
                  <p className="text-xs text-purple-600 mt-2">Only imports pages missing SEO in that category</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
                <strong>How it works:</strong> SEO data is stored in a JSON file (<code className="bg-gray-200 px-1 rounded">data/all-pages-seo.json</code>) with {bulkStatus?.total || 357} pages
                (289 calculators, 36 games, 32 apps). Each page has meta title, description,
                keywords, H1, canonical URL, and FAQs. Changes made here are saved directly to the JSON file.
                <br /><br />
                <strong>Note:</strong> Changes are saved instantly to the JSON file. The frontend reads from this file, so changes will reflect immediately on page refresh.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={fetchBulkStatus}
                disabled={bulkLoading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Refresh Status
              </button>
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
