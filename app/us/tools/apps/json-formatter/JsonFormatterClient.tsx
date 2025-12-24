'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

type StatusType = 'success' | 'error' | 'info';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is JSON formatting?',
    answer: 'JSON formatting (also called beautifying or pretty-printing) adds proper indentation and line breaks to JSON data, making it much easier to read and understand. This is essential when working with API responses or configuration files.',
    order: 1
  },
  {
    id: '2',
    question: 'How do I validate JSON?',
    answer: 'Click the "Validate JSON" button to check if your JSON is valid. The tool will show if the syntax is correct or display an error message pointing to where the problem is in your JSON structure.',
    order: 2
  },
  {
    id: '3',
    question: 'What is JSON minification?',
    answer: 'JSON minification removes all unnecessary whitespace, line breaks, and indentation from JSON data. This reduces file size and is commonly used when transmitting data over networks or storing data efficiently.',
    order: 3
  },
  {
    id: '4',
    question: 'Why is my JSON showing an error?',
    answer: 'Common JSON errors include missing or extra commas, unquoted property names, single quotes instead of double quotes, trailing commas, and mismatched brackets or braces. Our tool highlights where the error occurs.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I copy the formatted JSON?',
    answer: 'Yes! After formatting your JSON, click the "Copy Result" button to copy the formatted output to your clipboard. You can then paste it directly into your code editor or application.',
    order: 5
  },
  {
    id: '6',
    question: 'Is my JSON data secure?',
    answer: 'Absolutely. All JSON processing happens entirely in your browser - no data is sent to any server. Your JSON data never leaves your device, ensuring complete privacy and security.',
    order: 6
  }
];

export default function JsonFormatterClient() {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<StatusType>('info');
  const [jsonStats, setJsonStats] = useState({ size: 0, lines: 0, keys: 0, type: '' });
  const [inputBorderColor, setInputBorderColor] = useState('#D1D5DB');
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('json-formatter');

  const webAppSchema = generateWebAppSchema(
    'JSON Formatter & Validator - Free Online JSON Beautifier',
    'Free online JSON formatter, validator, and beautifier. Format, minify, and validate JSON data instantly. Perfect for developers and API testing.',
    'https://economictimes.indiatimes.com/us/tools/apps/json-formatter',
    'DeveloperApplication'
  );

  const updateStatus = (message: string, type: StatusType = 'info') => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const updateStats = (jsonData: string) => {
    try {
      const obj = JSON.parse(jsonData);
      const size = new Blob([jsonData]).size;
      const lines = jsonData.split('\n').length;
      const keys = (JSON.stringify(obj).match(/"/g)?.length || 0) / 2;

      setJsonStats({
        size,
        lines,
        keys: Math.floor(keys),
        type: Array.isArray(obj) ? 'Array' : typeof obj
      });
    } catch {
      setJsonStats({ size: 0, lines: 0, keys: 0, type: '' });
    }
  };

  const handleFormat = () => {
    const input = inputValue.trim();
    if (!input) {
      updateStatus('Please enter JSON data to format', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputValue(formatted);
      updateStatus('JSON formatted successfully!', 'success');
      updateStats(formatted);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStatus(`Invalid JSON: ${errorMessage}`, 'error');
      setOutputValue('');
      setJsonStats({ size: 0, lines: 0, keys: 0, type: '' });
    }
  };

  const handleMinify = () => {
    const input = inputValue.trim();
    if (!input) {
      updateStatus('Please enter JSON data to minify', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutputValue(minified);
      updateStatus('JSON minified successfully!', 'success');
      updateStats(minified);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStatus(`Invalid JSON: ${errorMessage}`, 'error');
      setOutputValue('');
      setJsonStats({ size: 0, lines: 0, keys: 0, type: '' });
    }
  };

  const handleValidate = () => {
    const input = inputValue.trim();
    if (!input) {
      updateStatus('Please enter JSON data to validate', 'error');
      return;
    }

    try {
      JSON.parse(input);
      updateStatus('JSON is valid!', 'success');
      updateStats(input);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStatus(`Invalid JSON: ${errorMessage}`, 'error');
      setJsonStats({ size: 0, lines: 0, keys: 0, type: '' });
    }
  };

  const handleClear = () => {
    setInputValue('');
    setOutputValue('');
    updateStatus('Cleared all data', 'info');
    setJsonStats({ size: 0, lines: 0, keys: 0, type: '' });
    setInputBorderColor('#D1D5DB');
  };

  const handleCopy = () => {
    const output = outputValue;
    if (!output) {
      updateStatus('No formatted JSON to copy', 'error');
      return;
    }

    navigator.clipboard.writeText(output).then(() => {
      updateStatus('Copied to clipboard!', 'success');
    }).catch(() => {
      if (outputRef.current) {
        outputRef.current.select();
        document.execCommand('copy');
        updateStatus('Copied to clipboard!', 'success');
      }
    });
  };

  const handleLoadSample = () => {
    const sampleJson = {
      "users": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "active": true,
          "preferences": {
            "theme": "dark",
            "notifications": true,
            "language": "en"
          }
        },
        {
          "id": 2,
          "name": "Jane Smith",
          "email": "jane@example.com",
          "active": false,
          "preferences": {
            "theme": "light",
            "notifications": false,
            "language": "es"
          }
        }
      ],
      "metadata": {
        "total": 2,
        "page": 1,
        "timestamp": "2024-01-15T10:30:00Z"
      }
    };

    setInputValue(JSON.stringify(sampleJson));
    updateStatus('Sample JSON loaded', 'info');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const input = value.trim();
    if (input) {
      try {
        JSON.parse(input);
        setInputBorderColor('#10B981');
      } catch {
        setInputBorderColor('#EF4444');
      }
    } else {
      setInputBorderColor('#D1D5DB');
    }
  };

  const getStatusColors = () => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return colors[statusType];
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-blue-100 px-6 py-3 rounded-full mb-4">
            <span className="text-2xl">{'{}'}</span>
            <span className="text-green-600 font-semibold">JSON Formatter</span>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {getH1('JSON Formatter & Validator')}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Format, validate, minify, and beautify JSON data instantly. Perfect tool for developers and API testing.')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Mobile Stats Bar */}
        <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 text-center text-white">
            <div className="text-lg font-bold">{jsonStats.size || '—'}</div>
            <div className="text-xs opacity-80">Bytes</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 text-center text-white">
            <div className="text-lg font-bold">{jsonStats.lines || '—'}</div>
            <div className="text-xs opacity-80">Lines</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 text-center text-white">
            <div className="text-lg font-bold">{jsonStats.keys || '—'}</div>
            <div className="text-xs opacity-80">Keys</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2 text-center text-white">
            <div className="text-lg font-bold">{jsonStats.type?.slice(0, 3) || '—'}</div>
            <div className="text-xs opacity-80">Type</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Main Tool */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
                <button
                  onClick={handleFormat}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Format
                </button>
                <button
                  onClick={handleMinify}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Minify
                </button>
                <button
                  onClick={handleValidate}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  Validate
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Copy
                </button>
                <button
                  onClick={handleLoadSample}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Sample
                </button>
              </div>

              {/* Input/Output Areas */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Input JSON
                  </label>
                  <textarea
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full h-80 p-4 border-2 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    style={{ borderColor: inputBorderColor }}
                    placeholder="Paste your JSON here..."
                  />
                </div>

                {/* Output */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Output
                  </label>
                  <textarea
                    ref={outputRef}
                    value={outputValue}
                    readOnly
                    className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-none"
                    placeholder="Formatted JSON will appear here..."
                  />
                </div>
              </div>

              {/* Status */}
              {statusMessage && (
                <div className={`mt-4 p-3 rounded-lg border ${getStatusColors()}`}>
                  <div className="text-sm font-medium">{statusMessage}</div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">Format</div>
                <p className="text-sm text-blue-700">Pretty-print JSON</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">Validate</div>
                <p className="text-sm text-green-700">Check syntax errors</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">Minify</div>
                <p className="text-sm text-purple-700">Compress output</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">Stats</div>
                <p className="text-sm text-orange-700">View JSON info</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding JSON: The Universal Data Format</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                JSON (JavaScript Object Notation) is the most widely used data interchange format on the web. Created by
                Douglas Crockford in the early 2000s, JSON has become the standard for API responses, configuration files,
                and data storage. Its human-readable format makes it easy to work with, and proper formatting with tools
                like this one is essential for debugging and development.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">🔧 Formatting</h3>
                  <p className="text-sm text-gray-600">Pretty-print JSON with proper indentation for easy reading and debugging.</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Validation</h3>
                  <p className="text-sm text-gray-600">Detect syntax errors and ensure your JSON is properly structured.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">📦 Minification</h3>
                  <p className="text-sm text-gray-600">Compress JSON by removing whitespace for smaller file sizes.</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h3 className="font-semibold text-orange-800 mb-2">📊 Analysis</h3>
                  <p className="text-sm text-gray-600">View statistics about your JSON structure including size and depth.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Why Format JSON?</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Unformatted JSON (minified) is difficult to read and debug. Proper formatting with indentation makes
                  the structure visible, helps identify nested objects and arrays, and makes it easier to spot missing
                  commas or brackets. Developers regularly format JSON when working with APIs, configuration files,
                  or debugging data issues.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Common JSON Use Cases</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>API Development - Format responses for debugging and documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>Configuration Files - Edit and validate settings files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Data Exchange - Prepare data for sharing between systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Learning - Understand JSON structure for web development</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
              <FirebaseFAQs pageId="json-formatter" fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
{/* Right Sidebar */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-green-500">{'{}'}</span> JSON Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Size</span>
                  <span className="font-bold text-green-600">{jsonStats.size} bytes</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Lines</span>
                  <span className="font-bold text-blue-600">{jsonStats.lines}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="text-gray-600">Keys</span>
                  <span className="font-bold text-purple-600">{jsonStats.keys}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                  <span className="text-gray-600">Type</span>
                  <span className="font-bold text-orange-600">{jsonStats.type || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Related Tools */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-500">🔧</span> Related Tools
              </h3>
              <div className="space-y-2">
                <Link href="/us/tools/apps/base64-encoder" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="text-xl">🔄</span>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-blue-600">Base64 Encoder</div>
                    <div className="text-xs text-gray-500">Encode/decode Base64</div>
                  </div>
                </Link>
                <Link href="/us/tools/apps/hash-generator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="text-xl">#️⃣</span>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-blue-600">Hash Generator</div>
                    <div className="text-xs text-gray-500">Generate MD5, SHA hashes</div>
                  </div>
                </Link>
                <Link href="/us/tools/apps/url-shortener" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="text-xl">🔗</span>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-blue-600">URL Encoder</div>
                    <div className="text-xs text-gray-500">Encode/decode URLs</div>
                  </div>
                </Link>
                <Link href="/us/tools/apps/qr-generator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                  <span className="text-xl">📱</span>
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-blue-600">QR Generator</div>
                    <div className="text-xs text-gray-500">Create QR codes</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="hidden lg:block bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>💡</span> Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Use double quotes for strings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>No trailing commas allowed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Keys must be quoted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Border turns green when valid</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
