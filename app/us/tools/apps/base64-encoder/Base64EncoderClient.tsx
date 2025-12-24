'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is Base64 encoding?',
    answer: 'Base64 is a binary-to-text encoding scheme that converts binary data into ASCII text format. It uses 64 characters (A-Z, a-z, 0-9, +, /) to represent data, making it safe for transmission over text-based protocols like email or URLs.',
    order: 1
  },
  {
    id: '2',
    question: 'Why do I need Base64 encoding?',
    answer: 'Base64 is commonly used to embed images in HTML/CSS, transmit binary data via JSON APIs, encode email attachments (MIME), store binary data in text-only databases, and encode data for URL parameters.',
    order: 2
  },
  {
    id: '3',
    question: 'Does Base64 provide encryption or security?',
    answer: 'No, Base64 is NOT encryption. It is simply an encoding scheme that can be easily reversed by anyone. Do not use Base64 to secure sensitive data - use proper encryption instead.',
    order: 3
  },
  {
    id: '4',
    question: 'Why does Base64 increase file size?',
    answer: 'Base64 encoding increases data size by approximately 33%. This is because every 3 bytes of binary data become 4 bytes of Base64 text. This trade-off is made for compatibility with text-based systems.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I encode files with this tool?',
    answer: 'Yes! You can upload files (images, documents, etc.) and convert them to Base64 strings. This is useful for embedding images directly in HTML or CSS, or for API data transmission.',
    order: 5
  },
  {
    id: '6',
    question: 'Is my data secure when using this tool?',
    answer: 'Absolutely. All encoding and decoding happens entirely in your browser. No data is sent to any server. Your text and files remain completely private on your device.',
    order: 6
  }
];

export default function Base64EncoderClient() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileInfo, setFileInfo] = useState<{name: string; size: string; type: string} | null>(null);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('base64-encoder');

  const webAppSchema = generateWebAppSchema(
    'Base64 Encoder & Decoder - Free Online Base64 Tool',
    'Free online Base64 encoder and decoder. Convert text and files to Base64 and back. Perfect for web developers, APIs, and data transmission.',
    'https://economictimes.indiatimes.com/us/tools/apps/base64-encoder',
    'DeveloperApplication'
  );

  const encode = () => {
    setError('');
    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
    } catch (e) {
      setError('Failed to encode. Please check your input.');
    }
  };

  const decode = () => {
    setError('');
    try {
      const decoded = decodeURIComponent(escape(atob(inputText)));
      setOutputText(decoded);
    } catch (e) {
      setError('Invalid Base64 string. Please check your input.');
    }
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      encode();
    } else {
      decode();
    }
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInputText(outputText);
    setOutputText('');
    setError('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
    setFileInfo(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setOutputText(base64);
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'unknown'
      });
      setMode('encode');
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const relatedTools = [
    { href: '/us/tools/apps/hash-generator', title: 'Hash Generator', icon: '🔒' },
    { href: '/us/tools/apps/strong-password-generator', title: 'Password Generator', icon: '🔐' },
    { href: '/us/tools/apps/qr-generator', title: 'QR Code Generator', icon: '📱' },
    { href: '/us/tools/apps/text-editor', title: 'Text Editor', icon: '📝' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🔐</span>
          <span className="text-indigo-600 font-semibold">Base64 Encoder</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {getH1('Base64 Encoder & Decoder')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Convert text and files to Base64 encoding and decode Base64 strings back to original data. Fast, secure, and completely client-side.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{inputText.length}</div>
          <div className="text-xs text-indigo-100">Input</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{outputText.length}</div>
          <div className="text-xs text-purple-100">Output</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{inputText.length > 0 ? ((outputText.length / inputText.length) * 100).toFixed(0) : 0}%</div>
          <div className="text-xs text-green-100">Ratio</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-3 text-center">
          <div className="text-xl font-bold">{mode === 'encode' ? 'ENC' : 'DEC'}</div>
          <div className="text-xs text-orange-100">Mode</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-xl p-1 inline-flex">
              <button
                onClick={() => { setMode('encode'); setOutputText(''); setError(''); }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'encode'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => { setMode('decode'); setOutputText(''); setError(''); }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'decode'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Decode
              </button>
            </div>
          </div>

          {/* Main Tool */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold text-gray-800">
                    {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                  </label>
                  {mode === 'encode' && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
                        Upload File
                      </span>
                    </label>
                  )}
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
                />
              </div>

              {/* Output */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold text-gray-800">
                    {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                  </label>
                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea
                  value={outputText}
                  readOnly
                  placeholder="Result will appear here..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl bg-gray-50 font-mono text-sm resize-none"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* File Info */}
            {fileInfo && mode === 'encode' && (
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">📄</span>
                  <div>
                    <div className="font-semibold text-indigo-800">{fileInfo.name}</div>
                    <div className="text-sm text-indigo-600">
                      {fileInfo.size} • {fileInfo.type}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                onClick={handleConvert}
                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                  mode === 'encode'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
              </button>
              <button
                onClick={handleSwap}
                disabled={!outputText}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Swap & Reverse
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Common Use Cases */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Common Use Cases</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">🖼️</div>
                <h4 className="font-semibold text-gray-800">Embed Images</h4>
                <p className="text-sm text-gray-600">Convert images for inline CSS/HTML</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">📧</div>
                <h4 className="font-semibold text-gray-800">Email Attachments</h4>
                <p className="text-sm text-gray-600">Encode files for MIME transmission</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">🔗</div>
                <h4 className="font-semibold text-gray-800">API Data</h4>
                <p className="text-sm text-gray-600">Transmit binary in JSON payloads</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">🌐</div>
                <h4 className="font-semibold text-gray-800">Data URLs</h4>
                <p className="text-sm text-gray-600">Create data URLs for resources</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">💾</div>
                <h4 className="font-semibold text-gray-800">Storage</h4>
                <p className="text-sm text-gray-600">Store binary in text databases</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">🔧</div>
                <h4 className="font-semibold text-gray-800">Debug Data</h4>
                <p className="text-sm text-gray-600">Decode strings from logs/APIs</p>
              </div>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="base64-encoder" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                <span className="text-sm text-indigo-700">Input Length</span>
                <span className="font-bold text-indigo-600">{inputText.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-sm text-purple-700">Output Length</span>
                <span className="font-bold text-purple-600">{outputText.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700">Size Ratio</span>
                <span className="font-bold text-green-600">
                  {inputText.length > 0 ? ((outputText.length / inputText.length) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                <span className="text-sm text-orange-700">Typical Change</span>
                <span className="font-bold text-orange-600">
                  {mode === 'encode' ? '+33%' : '-25%'}
                </span>
              </div>
            </div>

            {/* Mode Indicator */}
            <div className="mt-4 pt-4 border-t">
              <div className={`p-3 rounded-xl text-center ${
                mode === 'encode'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                <div className="font-bold">{mode === 'encode' ? 'Encoding Mode' : 'Decoding Mode'}</div>
                <div className="text-sm">
                  {mode === 'encode' ? 'Text → Base64' : 'Base64 → Text'}
                </div>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Ad Banner */}
          <AdBanner />
{/* Related Tools */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-2">
              {relatedTools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
            <h3 className="text-lg font-bold text-indigo-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span>Base64 is NOT encryption - data can be decoded by anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span>Encoded data is ~33% larger than original</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span>Upload files to convert images to data URLs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span>All processing happens locally in your browser</span>
              </li>
            </ul>
          </div>

          {/* Warning Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
            <h3 className="text-lg font-bold text-amber-800 mb-3">Security Notice</h3>
            <p className="text-sm text-amber-700">
              Base64 is an encoding scheme, not encryption. Anyone can decode Base64 data.
              Never use it to protect sensitive information - use proper encryption instead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
