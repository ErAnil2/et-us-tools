'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface CalculatorFAQs {
  calculatorId: string;
  calculatorName: string;
  calculatorPath: string;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
  faqs: FAQ[];
}

export default function AdminFAQManagementPage() {
  const [allFaqs, setAllFaqs] = useState<Record<string, CalculatorFAQs>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingCalculator, setIsAddingCalculator] = useState(false);
  const [saving, setSaving] = useState(false);

  // New calculator form state
  const [newCalculator, setNewCalculator] = useState({
    calculatorId: '',
    calculatorName: '',
    calculatorPath: ''
  });

  // New/Edit FAQ form state
  const [faqForm, setFaqForm] = useState({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '',
    answer: '',
    order: 1
  });

  // Fetch all FAQs on load
  useEffect(() => {
    fetchAllFaqs();
  }, []);

  const fetchAllFaqs = async () => {
    try {
      const response = await fetch('/api/calculator-faqs');
      if (response.ok) {
        const data = await response.json();
        setAllFaqs(data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCalculators = Object.values(allFaqs).filter(calc =>
    calc.calculatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.calculatorId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = async (calculatorId: string, isActive: boolean) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/calculator-faqs/${calculatorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        setAllFaqs(prev => ({
          ...prev,
          [calculatorId]: { ...prev[calculatorId], isActive: !isActive }
        }));
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFaq = async () => {
    if (!selectedCalculator) return;
    setSaving(true);

    try {
      if (editingFaq) {
        // Update existing FAQ
        const response = await fetch(`/api/calculator-faqs/${selectedCalculator}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            faqId: editingFaq.id,
            updates: faqForm
          })
        });

        if (response.ok) {
          await fetchAllFaqs();
          setEditingFaq(null);
          setFaqForm({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '', answer: '', order: 1 });
        }
      } else {
        // Add new FAQ
        const response = await fetch(`/api/calculator-faqs/${selectedCalculator}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add',
            faq: faqForm
          })
        });

        if (response.ok) {
          await fetchAllFaqs();
          setIsAddingNew(false);
          setFaqForm({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '', answer: '', order: 1 });
        }
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!selectedCalculator || !confirm('Are you sure you want to delete this FAQ?')) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/calculator-faqs/${selectedCalculator}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          faqId
        })
      });

      if (response.ok) {
        await fetchAllFaqs();
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCalculator = async () => {
    if (!newCalculator.calculatorId) return;
    setSaving(true);

    try {
      const response = await fetch('/api/calculator-faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculatorId: newCalculator.calculatorId,
          calculatorName: newCalculator.calculatorName || newCalculator.calculatorId,
          calculatorPath: newCalculator.calculatorPath || `/us/tools/calculators/${newCalculator.calculatorId}`,
          isActive: true,
          faqs: []
        })
      });

      if (response.ok) {
        await fetchAllFaqs();
        setIsAddingCalculator(false);
        setNewCalculator({ calculatorId: '', calculatorName: '', calculatorPath: '' });
      }
    } catch (error) {
      console.error('Error adding calculator:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCalculator = async (calculatorId: string) => {
    if (!confirm('Are you sure you want to delete all FAQs for this calculator?')) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/calculator-faqs/${calculatorId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchAllFaqs();
        if (selectedCalculator === calculatorId) {
          setSelectedCalculator(null);
        }
      }
    } catch (error) {
      console.error('Error deleting calculator FAQs:', error);
    } finally {
      setSaving(false);
    }
  };

  const selectedCalcData = selectedCalculator ? allFaqs[selectedCalculator] : null;

  if (loading) {
    return (
      <AdminLayout title="FAQ Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="FAQ Management">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Calculator FAQ Management</h3>
          <p className="text-sm text-blue-700">
            Manage FAQs for each calculator. FAQs are displayed on calculator pages and used for SEO Schema.org markup.
            Toggle the active status to show/hide FAQs on the frontend.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{Object.keys(allFaqs).length}</div>
            <div className="text-sm text-gray-600">Total Calculators</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(allFaqs).filter(c => c.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(allFaqs).reduce((acc, c) => acc + c.faqs.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total FAQs</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Calculators</h3>
                <button
                  onClick={() => setIsAddingCalculator(true)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  + Add
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm mb-4"
              />

              {/* Calculator List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCalculators.map((calc) => (
                  <div
                    key={calc.calculatorId}
                    className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                      selectedCalculator === calc.calculatorId
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCalculator(calc.calculatorId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">
                          {calc.calculatorName}
                        </div>
                        <div className="text-xs text-gray-500">{calc.faqs.length} FAQs</div>
                      </div>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        calc.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {calc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredCalculators.length === 0 && (
                  <div className="text-center text-gray-500 py-4">No calculators found</div>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Editor */}
          <div className="lg:col-span-2">
            {selectedCalcData ? (
              <div className="bg-white shadow rounded-lg p-4">
                {/* Calculator Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedCalcData.calculatorName}</h3>
                    <p className="text-sm text-gray-500">{selectedCalcData.calculatorPath}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(selectedCalcData.calculatorId, selectedCalcData.isActive)}
                      disabled={saving}
                      className={`px-3 py-1 text-sm rounded ${
                        selectedCalcData.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {selectedCalcData.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDeleteCalculator(selectedCalcData.calculatorId)}
                      disabled={saving}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* FAQs List */}
                <div className="space-y-3 mb-4">
                  {selectedCalcData.faqs.sort((a, b) => a.order - b.order).map((faq, index) => (
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
                              setIsAddingNew(false);
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

                  {selectedCalcData.faqs.length === 0 && !isAddingNew && (
                    <div className="text-center text-gray-500 py-8">
                      No FAQs added yet. Click "Add FAQ" to create one.
                    </div>
                  )}
                </div>

                {/* Add FAQ Button */}
                {!isAddingNew && !editingFaq && (
                  <button
                    onClick={() => {
                      setIsAddingNew(true);
                      setFaqForm({ id: 'faq-' + Math.random().toString(36).substr(2, 9), question: '',
                        answer: '',
                        order: selectedCalcData.faqs.length + 1
                      });
                    }}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    + Add FAQ
                  </button>
                )}

                {/* FAQ Form */}
                {(isAddingNew || editingFaq) && (
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
                            setIsAddingNew(false);
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

                {/* Last Updated */}
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  Last updated: {new Date(selectedCalcData.lastUpdated).toLocaleString()} by {selectedCalcData.updatedBy}
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2">Select a calculator to manage its FAQs</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Calculator Modal */}
        {isAddingCalculator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calculator ID *</label>
                  <input
                    type="text"
                    value={newCalculator.calculatorId}
                    onChange={(e) => setNewCalculator(prev => ({ ...prev, calculatorId: e.target.value }))}
                    placeholder="e.g., salary-calculator"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calculator Name</label>
                  <input
                    type="text"
                    value={newCalculator.calculatorName}
                    onChange={(e) => setNewCalculator(prev => ({ ...prev, calculatorName: e.target.value }))}
                    placeholder="e.g., Salary Calculator"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calculator Path</label>
                  <input
                    type="text"
                    value={newCalculator.calculatorPath}
                    onChange={(e) => setNewCalculator(prev => ({ ...prev, calculatorPath: e.target.value }))}
                    placeholder="e.g., /us/tools/calculators/salary-calculator"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAddCalculator}
                    disabled={saving || !newCalculator.calculatorId}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    {saving ? 'Adding...' : 'Add Calculator'}
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCalculator(false);
                      setNewCalculator({ calculatorId: '', calculatorName: '', calculatorPath: '' });
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
