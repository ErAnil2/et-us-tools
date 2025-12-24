'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is URL encoding and why is it needed?',
    answer: 'URL encoding converts special characters into a format that can be safely transmitted in URLs. Characters like spaces, &, and = have special meanings in URLs, so they need to be encoded (e.g., space becomes %20).',
    order: 1
  },
  {
    id: '2',
    question: 'What\'s the difference between URL encode and decode?',
    answer: 'URL encoding converts readable text into URL-safe format (e.g., "hello world" → "hello%20world"). URL decoding does the reverse, converting encoded URLs back to readable text.',
    order: 2
  },
  {
    id: '3',
    question: 'What is Base64 encoding for URLs?',
    answer: 'Base64 encoding converts binary data or text into ASCII characters. It\'s commonly used to embed data in URLs, data URIs, or when you need to pass complex data through URL parameters.',
    order: 3
  },
  {
    id: '4',
    question: 'Are my URLs stored anywhere?',
    answer: 'No, all processing happens locally in your browser. Your URLs are never sent to any server. Your data remains completely private.',
    order: 4
  },
  {
    id: '5',
    question: 'Why do I need to encode query parameters?',
    answer: 'Query parameters use special characters like & and = to separate values. If your data contains these characters, they must be encoded to avoid breaking the URL structure.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I use this for debugging URLs?',
    answer: 'Yes! This tool is perfect for debugging encoded URLs. Paste an encoded URL to decode it and see the actual values being passed in parameters.',
    order: 6
  }
];

type Tool = 'encode' | 'decode' | 'base64encode' | 'base64decode' | 'parse' | 'build';

interface URLParts {
  protocol: string;
  host: string;
  path: string;
  params: { key: string; value: string }[];
  hash: string;
}

interface URLStats {
  inputLength: number;
  outputLength: number;
  specialChars: number;
  paramCount: number;
}

export default function UrlShortenerClient() {
  const [activeTool, setActiveTool] = useState<Tool>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [urlStats, setUrlStats] = useState<URLStats>({ inputLength: 0, outputLength: 0, specialChars: 0, paramCount: 0 });

  // URL Builder state
  const [urlParts, setUrlParts] = useState<URLParts>({
    protocol: 'https',
    host: '',
    path: '',
    params: [{ key: '', value: '' }],
    hash: ''
  });

  const { getH1, getSubHeading, faqSchema } = usePageSEO('url-shortener');

  const webAppSchema = generateWebAppSchema(
    'URL Encoder/Decoder - Free URL Tools',
    'Free URL encoder and decoder tool. Encode, decode, parse, and build URLs. Base64 encoding, query parameter parsing, and URL builder. Process locally - no data sent to servers.',
    'https://economictimes.indiatimes.com/us/tools/apps/url-shortener',
    'Utility'
  );

  // Update stats when input/output changes
  useEffect(() => {
    const specialCharRegex = /[!@#$%^&*()+=\[\]{};':"\\|,.<>\/?~` ]/g;
    const specialChars = (input.match(specialCharRegex) || []).length;

    let paramCount = 0;
    if (activeTool === 'parse' && output) {
      try {
        const parsed = JSON.parse(output);
        paramCount = Object.keys(parsed.params || {}).length;
      } catch (e) {
        paramCount = 0;
      }
    } else if (activeTool === 'build') {
      paramCount = urlParts.params.filter(p => p.key.trim()).length;
    }

    setUrlStats({
      inputLength: input.length,
      outputLength: output.length,
      specialChars,
      paramCount
    });
  }, [input, output, activeTool, urlParts.params]);

  const processUrl = () => {
    setError('');
    setCopied(false);

    try {
      switch (activeTool) {
        case 'encode':
          setOutput(encodeURIComponent(input));
          break;
        case 'decode':
          setOutput(decodeURIComponent(input));
          break;
        case 'base64encode':
          setOutput(btoa(input));
          break;
        case 'base64decode':
          setOutput(atob(input));
          break;
        case 'parse':
          parseUrl(input);
          break;
        default:
          break;
      }
    } catch (e) {
      setError('Invalid input. Please check your URL or encoded string.');
      setOutput('');
    }
  };

  const parseUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const params: { key: string; value: string }[] = [];
      parsed.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      if (params.length === 0) {
        params.push({ key: '', value: '' });
      }

      setUrlParts({
        protocol: parsed.protocol.replace(':', ''),
        host: parsed.host,
        path: parsed.pathname,
        params,
        hash: parsed.hash.replace('#', '')
      });

      setOutput(JSON.stringify({
        protocol: parsed.protocol,
        host: parsed.host,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        params: Object.fromEntries(parsed.searchParams)
      }, null, 2));
    } catch (e) {
      setError('Invalid URL format. Please enter a valid URL starting with http:// or https://');
    }
  };

  const buildUrl = () => {
    setError('');
    try {
      const { protocol, host, path, params, hash } = urlParts;
      if (!host) {
        setError('Host is required');
        return;
      }

      let url = `${protocol}://${host}`;
      if (path) {
        url += path.startsWith('/') ? path : `/${path}`;
      }

      const validParams = params.filter(p => p.key.trim());
      if (validParams.length > 0) {
        const searchParams = new URLSearchParams();
        validParams.forEach(p => searchParams.append(p.key, p.value));
        url += `?${searchParams.toString()}`;
      }

      if (hash) {
        url += `#${hash}`;
      }

      setOutput(url);
    } catch (e) {
      setError('Error building URL');
    }
  };

  const addParam = () => {
    setUrlParts({
      ...urlParts,
      params: [...urlParts.params, { key: '', value: '' }]
    });
  };

  const removeParam = (index: number) => {
    const newParams = urlParts.params.filter((_, i) => i !== index);
    if (newParams.length === 0) {
      newParams.push({ key: '', value: '' });
    }
    setUrlParts({ ...urlParts, params: newParams });
  };

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...urlParts.params];
    newParams[index][field] = value;
    setUrlParts({ ...urlParts, params: newParams });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setUrlParts({
      protocol: 'https',
      host: '',
      path: '',
      params: [{ key: '', value: '' }],
      hash: ''
    });
  };

  useEffect(() => {
    setInput('');
    setOutput('');
    setError('');
  }, [activeTool]);

  const tools = [
    { id: 'encode', label: 'URL Encode', icon: '🔒' },
    { id: 'decode', label: 'URL Decode', icon: '🔓' },
    { id: 'base64encode', label: 'Base64 Encode', icon: '📝' },
    { id: 'base64decode', label: 'Base64 Decode', icon: '📖' },
    { id: 'parse', label: 'Parse URL', icon: '🔍' },
    { id: 'build', label: 'Build URL', icon: '🔧' },
  ];

  const relatedTools = [
    { name: 'JSON Formatter', path: '/us/tools/apps/json-formatter', color: 'bg-green-500' },
    { name: 'Base64 Encoder', path: '/us/tools/apps/base64-encoder', color: 'bg-purple-500' },
    { name: 'QR Generator', path: '/us/tools/apps/qr-generator', color: 'bg-blue-500' },
    { name: 'Text Editor', path: '/us/tools/apps/text-editor', color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🔗</span>
          <span className="text-blue-600 font-semibold">URL Tools</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          {getH1('URL Encoder, Decoder & Builder')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Encode, decode, parse, and build URLs. All processing happens locally in your browser.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{urlStats.inputLength}</div>
          <div className="text-xs opacity-80">Input</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{urlStats.outputLength}</div>
          <div className="text-xs opacity-80">Output</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{urlStats.specialChars}</div>
          <div className="text-xs opacity-80">Special</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{urlStats.paramCount}</div>
          <div className="text-xs opacity-80">Params</div>
        </div>
      </div>

      {/* Tool Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as Tool)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTool === tool.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeTool === 'build' ? (
            /* URL Builder */
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Build URL</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Protocol</label>
                    <select
                      value={urlParts.protocol}
                      onChange={(e) => setUrlParts({ ...urlParts, protocol: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="https">https</option>
                      <option value="http">http</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host *</label>
                    <input
                      type="text"
                      value={urlParts.host}
                      onChange={(e) => setUrlParts({ ...urlParts, host: e.target.value })}
                      placeholder="example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hash</label>
                    <input
                      type="text"
                      value={urlParts.hash}
                      onChange={(e) => setUrlParts({ ...urlParts, hash: e.target.value })}
                      placeholder="section"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Path</label>
                  <input
                    type="text"
                    value={urlParts.path}
                    onChange={(e) => setUrlParts({ ...urlParts, path: e.target.value })}
                    placeholder="/api/users"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Query Parameters</label>
                    <button
                      onClick={addParam}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Add Parameter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {urlParts.params.map((param, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={param.key}
                          onChange={(e) => updateParam(idx, 'key', e.target.value)}
                          placeholder="key"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={param.value}
                          onChange={(e) => updateParam(idx, 'value', e.target.value)}
                          placeholder="value"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeParam(idx)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={buildUrl}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all"
                  >
                    Build URL
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl">
                  {error}
                </div>
              )}

              {output && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Built URL</label>
                    <button
                      onClick={copyToClipboard}
                      className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                        copied ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl font-mono text-sm break-all">
                    {output}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Encode/Decode/Parse Tools */
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Input */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    activeTool === 'encode' ? 'Enter text to URL encode...' :
                    activeTool === 'decode' ? 'Enter URL-encoded text to decode...' :
                    activeTool === 'base64encode' ? 'Enter text to Base64 encode...' :
                    activeTool === 'base64decode' ? 'Enter Base64 string to decode...' :
                    'Enter URL to parse (https://example.com/path?key=value)'
                  }
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={processUrl}
                    disabled={!input.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50"
                  >
                    {activeTool === 'encode' ? 'Encode' :
                     activeTool === 'decode' ? 'Decode' :
                     activeTool === 'base64encode' ? 'Encode to Base64' :
                     activeTool === 'base64decode' ? 'Decode from Base64' :
                     'Parse URL'}
                  </button>
                  {(activeTool === 'encode' || activeTool === 'decode' || activeTool === 'base64encode' || activeTool === 'base64decode') && (
                    <button
                      onClick={swapInputOutput}
                      disabled={!output}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                      title="Swap input and output"
                    >
                      ⇄
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl">
                    {error}
                  </div>
                )}
              </div>

              {/* Output */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Output
                  </label>
                  {output && (
                    <button
                      onClick={copyToClipboard}
                      className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                        copied ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <div className="w-full min-h-[8rem] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">
                  {output || <span className="text-gray-400">Output will appear here...</span>}
                </div>

                {activeTool === 'parse' && output && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">Parsed Components</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600">Protocol:</span> <span className="font-mono">{urlParts.protocol}</span></div>
                      <div><span className="text-gray-600">Host:</span> <span className="font-mono">{urlParts.host}</span></div>
                      <div><span className="text-gray-600">Path:</span> <span className="font-mono">{urlParts.path || '/'}</span></div>
                      {urlParts.params.some(p => p.key) && (
                        <div>
                          <span className="text-gray-600">Parameters:</span>
                          <ul className="ml-4 mt-1">
                            {urlParts.params.filter(p => p.key).map((p, i) => (
                              <li key={i} className="font-mono">{p.key} = {p.value}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {urlParts.hash && <div><span className="text-gray-600">Hash:</span> <span className="font-mono">#{urlParts.hash}</span></div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Common Examples */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Common URL Encoding Examples</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { char: 'Space', original: ' ', encoded: '%20' },
                { char: 'Ampersand', original: '&', encoded: '%26' },
                { char: 'Equals', original: '=', encoded: '%3D' },
                { char: 'Question', original: '?', encoded: '%3F' },
                { char: 'Slash', original: '/', encoded: '%2F' },
                { char: 'Hash', original: '#', encoded: '%23' },
                { char: 'Plus', original: '+', encoded: '%2B' },
                { char: 'At', original: '@', encoded: '%40' },
              ].map(item => (
                <div key={item.char} className="bg-white rounded-xl p-3 text-center">
                  <div className="text-sm text-gray-500">{item.char}</div>
                  <div className="font-mono text-lg">
                    <span className="text-gray-400">{item.original}</span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span className="text-blue-600">{item.encoded}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🔒</span>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">100% Private & Secure</h3>
                <p className="text-gray-600">All URL processing happens entirely in your browser. Your URLs and data are never sent to any server. This tool works completely offline once loaded.</p>
              </div>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="url-shortener" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">URL Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <span className="text-gray-600">Input Length</span>
                <span className="font-bold text-blue-600">{urlStats.inputLength}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl">
                <span className="text-gray-600">Output Length</span>
                <span className="font-bold text-indigo-600">{urlStats.outputLength}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <span className="text-gray-600">Special Chars</span>
                <span className="font-bold text-purple-600">{urlStats.specialChars}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                <span className="text-gray-600">Parameters</span>
                <span className="font-bold text-pink-600">{urlStats.paramCount}</span>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Ad Banner */}
          <div className="hidden lg:block">
            <AdBanner className="w-full" />
          </div>
{/* Related Tools */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                  <span className="text-gray-700 hover:text-blue-600">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="hidden lg:block bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-4 text-white">
            <h3 className="text-lg font-bold mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use URL Encode for query parameters with special characters</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Base64 is great for embedding binary data in URLs</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Parse URLs to debug complex query strings</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>All processing is done locally in your browser</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
