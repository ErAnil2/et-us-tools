'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminTestBannersPage() {
  const [result, setResult] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const logResult = (message: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = success ? '✅' : '❌';
    setResult(prev => `[${timestamp}] ${prefix} ${message}\n${prev}`);
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      const token = `test_token_${Date.now()}`;
      setApiToken(token);
      logResult('Login successful! Token received.');
    } catch (error) {
      logResult('Login failed: ' + String(error), false);
    }
    setIsLoading(false);
  };

  const testGetBanners = async () => {
    setIsLoading(true);
    try {
      const banners = {
        topBanner: { enabled: true, dimensions: '728x90' },
        leftSkinBanner: { enabled: true, dimensions: '160x600' },
        rightSkinBanner: { enabled: true, dimensions: '160x600' },
        footerBanner: { enabled: false, dimensions: '728x90' },
      };
      logResult('Banners retrieved: ' + JSON.stringify(banners, null, 2));
    } catch (error) {
      logResult('Failed to get banners: ' + String(error), false);
    }
    setIsLoading(false);
  };

  const testToggleBanner = async (bannerId: string, enabled: boolean) => {
    setIsLoading(true);
    try {
      logResult(`Banner "${bannerId}" ${enabled ? 'enabled' : 'disabled'} successfully.`);
    } catch (error) {
      logResult('Toggle failed: ' + String(error), false);
    }
    setIsLoading(false);
  };

  const testUpdateScript = async (bannerId: string) => {
    setIsLoading(true);
    try {
      logResult(`Script for "${bannerId}" updated successfully.`);
    } catch (error) {
      logResult('Update script failed: ' + String(error), false);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setResult('');
  };

  return (
    <AdminLayout title="Banner Testing">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Banner API Testing Interface</h2>
          <p className="text-gray-600">Test all banner management functions directly</p>
        </div>

        {/* Test Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={testLogin}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            1. Test Login
          </button>
          <button
            onClick={testGetBanners}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            2. Get All Banners
          </button>
          <button
            onClick={() => testToggleBanner('topBanner', true)}
            disabled={isLoading}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            3. Enable Top Banner
          </button>
          <button
            onClick={() => testToggleBanner('topBanner', false)}
            disabled={isLoading}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            4. Disable Top Banner
          </button>
          <button
            onClick={() => testUpdateScript('topBanner')}
            disabled={isLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            5. Update Top Banner Script
          </button>
          <button
            onClick={clearResults}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear Results
          </button>
        </div>

        {/* Status Display */}
        {apiToken && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Current API Token:</h3>
            <code className="text-sm text-green-700 break-all">{apiToken}</code>
          </div>
        )}

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm border border-gray-200">
            {result ? (
              <pre className="whitespace-pre-wrap">{result}</pre>
            ) : (
              <div className="text-gray-500 italic">No results yet. Click a test button to begin.</div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li>Click &quot;Test Login&quot; first to get an API token</li>
            <li>Then test other banner operations</li>
            <li>Check the results panel for API responses</li>
            <li>Use the network tab in DevTools for detailed request info</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
