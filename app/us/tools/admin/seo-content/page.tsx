'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface SEOContent {
  page: string;
  title: string;
  description: string;
  keywords: string;
  status: 'published' | 'draft';
}

export default function AdminSEOContentPage() {
  const [seoContent, setSeoContent] = useState<SEOContent[]>([
    { page: 'bmi-calculator', title: 'BMI Calculator - Body Mass Index Calculator', description: 'Calculate your BMI instantly...', keywords: 'bmi, body mass index, calculator', status: 'published' },
    { page: 'age-calculator', title: 'Age Calculator - Calculate Your Age Online', description: 'Calculate your exact age...', keywords: 'age calculator, birthday calculator', status: 'published' },
    { page: 'percentage-calculator', title: 'Percentage Calculator - Quick Calculations', description: 'Calculate percentages easily...', keywords: 'percentage, calculator, math', status: 'draft' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingPage, setEditingPage] = useState<string | null>(null);

  const filteredContent = seoContent.filter(content =>
    content.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (page: string) => {
    setEditingPage(null);
    alert(`SEO content for ${page} saved successfully!`);
  };

  return (
    <AdminLayout title="SEO Content Management">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">SEO Content Management</h3>
          <p className="text-sm text-blue-700">Manage meta titles, descriptions, and keywords for all pages to optimize search engine visibility.</p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search calculators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* SEO Content List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((content) => (
                <tr key={content.page}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{content.page}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{content.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      content.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {content.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setEditingPage(content.page)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Button */}
        <div className="flex justify-end">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Page
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
