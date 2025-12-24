'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface HistoryEntry {
  type: string;
  range: string;
  result: string;
  count?: number;
  duplicates?: boolean;
  timestamp: Date;
}

const fallbackFaqs = [
  {
    id: '1',
    question: 'Is this random number generator truly random?',
    answer: 'Yes! Our generator uses the Web Crypto API (cryptographically secure random number generation) when available, ensuring truly random and unpredictable numbers. This is the same technology used in secure applications.',
    order: 1
  },
  {
    id: '2',
    question: 'Can I generate multiple random numbers at once?',
    answer: 'Absolutely! Use the "Multiple Numbers" section to generate up to 100 random numbers at once. You can also choose whether to allow duplicate numbers or require all numbers to be unique.',
    order: 2
  },
  {
    id: '3',
    question: 'What is the maximum range I can use?',
    answer: 'You can use any range of numbers. Simply enter your minimum and maximum values in the input fields. The generator works with positive numbers, negative numbers, and even very large ranges.',
    order: 3
  },
  {
    id: '4',
    question: 'Can I use this for lottery number picks?',
    answer: 'Yes! Use the lottery preset or set your own range. For example, for a 6/49 lottery, set the range to 1-49 and generate 6 unique numbers (uncheck "Allow duplicates").',
    order: 4
  },
  {
    id: '5',
    question: 'Is there a history of my generated numbers?',
    answer: 'Yes, the generator keeps a history of your last 20 generations. You can see the type, range, results, and timestamp for each generation. Use the Clear History button to reset.',
    order: 5
  },
  {
    id: '6',
    question: 'What are the quick presets?',
    answer: 'Quick presets are one-click shortcuts for common random number scenarios: dice rolls (1-6), coin flips (0-1), lottery picks (6 from 1-49), PIN codes (1000-9999), and more.',
    order: 6
  }
];

export default function RandomNumberGeneratorClient() {
  const [singleMin, setSingleMin] = useState(1);
  const [singleMax, setSingleMax] = useState(100);
  const [singleResult, setSingleResult] = useState('-');

  const [multipleMin, setMultipleMin] = useState(1);
  const [multipleMax, setMultipleMax] = useState(100);
  const [count, setCount] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [multipleResults, setMultipleResults] = useState<number[]>([]);

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('random-number-generator');

  const webAppSchema = generateWebAppSchema(
    'Random Number Generator - Free Online Secure RNG Tool',
    'Free online random number generator with cryptographically secure randomness. Generate single or multiple random numbers, lottery picks, dice rolls, and more.',
    'https://economictimes.indiatimes.com/us/tools/apps/random-number-generator',
    'Utility'
  );

  const getSecureRandomNumber = (min: number, max: number): number => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const range = max - min + 1;
      const maxUint32 = 0xFFFFFFFF;
      const randomUint32 = new Uint32Array(1);

      let attempts = 0;
      while (attempts < 10) {
        window.crypto.getRandomValues(randomUint32);
        const randomFloat = randomUint32[0] / (maxUint32 + 1);
        const result = Math.floor(randomFloat * range) + min;

        if (result >= min && result <= max) {
          return result;
        }
        attempts++;
      }
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateSingle = () => {
    if (isNaN(singleMin) || isNaN(singleMax)) {
      alert('Please enter valid numbers for minimum and maximum values.');
      return;
    }

    if (singleMin >= singleMax) {
      alert('Maximum value must be greater than minimum value.');
      return;
    }

    const result = getSecureRandomNumber(singleMin, singleMax);
    setSingleResult(result.toString());

    addToHistory({
      type: 'Single',
      range: `${singleMin} - ${singleMax}`,
      result: result.toString(),
      timestamp: new Date()
    });
  };

  const generateMultiple = () => {
    if (isNaN(multipleMin) || isNaN(multipleMax) || isNaN(count)) {
      alert('Please enter valid numbers for all fields.');
      return;
    }

    if (multipleMin >= multipleMax) {
      alert('Maximum value must be greater than minimum value.');
      return;
    }

    if (count < 1 || count > 100) {
      alert('Count must be between 1 and 100.');
      return;
    }

    if (!allowDuplicates && count > (multipleMax - multipleMin + 1)) {
      alert(`Cannot generate ${count} unique numbers from range ${multipleMin}-${multipleMax}. Range only contains ${multipleMax - multipleMin + 1} numbers.`);
      return;
    }

    const results = generateMultipleNumbers(multipleMin, multipleMax, count, allowDuplicates);
    setMultipleResults(results);

    addToHistory({
      type: 'Multiple',
      range: `${multipleMin} - ${multipleMax}`,
      result: results.join(', '),
      count: count,
      duplicates: allowDuplicates,
      timestamp: new Date()
    });
  };

  const generateMultipleNumbers = (min: number, max: number, cnt: number, duplicates: boolean): number[] => {
    const results: number[] = [];

    if (duplicates) {
      for (let i = 0; i < cnt; i++) {
        results.push(getSecureRandomNumber(min, max));
      }
    } else {
      const available: number[] = [];
      for (let i = min; i <= max; i++) {
        available.push(i);
      }

      for (let i = 0; i < cnt; i++) {
        const randomIndex = Math.floor(Math.random() * available.length);
        results.push(available[randomIndex]);
        available.splice(randomIndex, 1);
      }
    }

    return results.sort((a, b) => a - b);
  };

  const applyPreset = (min: number, max: number, cnt?: number) => {
    if (cnt) {
      setMultipleMin(min);
      setMultipleMax(max);
      setCount(cnt);
      setTimeout(() => {
        const results = generateMultipleNumbers(min, max, cnt, allowDuplicates);
        setMultipleResults(results);
        addToHistory({
          type: 'Multiple',
          range: `${min} - ${max}`,
          result: results.join(', '),
          count: cnt,
          duplicates: allowDuplicates,
          timestamp: new Date()
        });
      }, 100);
    } else {
      setSingleMin(min);
      setSingleMax(max);
      const result = getSecureRandomNumber(min, max);
      setSingleResult(result.toString());
      addToHistory({
        type: 'Single',
        range: `${min} - ${max}`,
        result: result.toString(),
        timestamp: new Date()
      });
    }
  };

  const addToHistory = (entry: HistoryEntry) => {
    setHistory(prev => [entry, ...prev].slice(0, 20));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const relatedTools = [
    { href: '/us/tools/apps/lucky-draw-picker', title: 'Lucky Draw Picker', icon: '🎰' },
    { href: '/us/tools/apps/strong-password-generator', title: 'Password Generator', icon: '🔐' },
    { href: '/us/tools/apps/hash-generator', title: 'Hash Generator', icon: '🔒' },
    { href: '/us/tools/apps/qr-generator', title: 'QR Code Generator', icon: '📱' },
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🎲</span>
          <span className="text-purple-600 font-semibold">Random Number Generator</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {getH1('Random Number Generator')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Generate truly random numbers within any range. Perfect for games, lottery picks, statistical sampling, and making random choices.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center border border-purple-200">
          <div className="text-xl font-bold text-purple-600">{singleResult !== '-' ? singleResult : '?'}</div>
          <div className="text-xs text-purple-700">Last</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 text-center border border-blue-200">
          <div className="text-xl font-bold text-blue-600">{multipleResults.length}</div>
          <div className="text-xs text-blue-700">Multiple</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center border border-green-200">
          <div className="text-xl font-bold text-green-600">{history.length}</div>
          <div className="text-xs text-green-700">History</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
          <div className="text-xl font-bold text-amber-600">{singleMax - singleMin + 1}</div>
          <div className="text-xs text-amber-700">Range</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Generators Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Single Number Generator */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Single Number</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum</label>
                    <input
                      type="number"
                      value={singleMin}
                      onChange={(e) => setSingleMin(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum</label>
                    <input
                      type="number"
                      value={singleMax}
                      onChange={(e) => setSingleMax(parseInt(e.target.value) || 100)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  onClick={generateSingle}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  🎲 Generate Random Number
                </button>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
                  <div className="text-gray-600 text-sm mb-2">Generated Number</div>
                  <div className="text-4xl font-bold text-purple-600">{singleResult}</div>
                </div>
              </div>
            </div>

            {/* Multiple Numbers Generator */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Multiple Numbers</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum</label>
                    <input
                      type="number"
                      value={multipleMin}
                      onChange={(e) => setMultipleMin(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum</label>
                    <input
                      type="number"
                      value={multipleMax}
                      onChange={(e) => setMultipleMax(parseInt(e.target.value) || 100)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Count</label>
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                      min="1"
                      max="100"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowDuplicates}
                        onChange={(e) => setAllowDuplicates(e.target.checked)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm text-gray-700">Allow duplicates</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={generateMultiple}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  🎯 Generate Multiple Numbers
                </button>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                  <div className="text-gray-600 text-sm mb-2">Generated Numbers</div>
                  <div>
                    {multipleResults.length === 0 ? (
                      <div className="text-gray-400 text-sm">Click generate to see results</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {multipleResults.map((num, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold text-sm">
                            {num}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Quick Presets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => applyPreset(1, 6)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-transparent hover:border-amber-200">
                <div className="text-2xl mb-1">🎲</div>
                <div className="font-semibold text-sm">Dice Roll</div>
                <div className="text-xs text-gray-500">1-6</div>
              </button>

              <button onClick={() => applyPreset(1, 52)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-transparent hover:border-amber-200">
                <div className="text-2xl mb-1">🃏</div>
                <div className="font-semibold text-sm">Playing Card</div>
                <div className="text-xs text-gray-500">1-52</div>
              </button>

              <button onClick={() => applyPreset(1, 49, 6)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-transparent hover:border-amber-200">
                <div className="text-2xl mb-1">🎟️</div>
                <div className="font-semibold text-sm">Lottery</div>
                <div className="text-xs text-gray-500">6 from 1-49</div>
              </button>

              <button onClick={() => applyPreset(0, 1)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-transparent hover:border-amber-200">
                <div className="text-2xl mb-1">🪙</div>
                <div className="font-semibold text-sm">Coin Flip</div>
                <div className="text-xs text-gray-500">0 or 1</div>
              </button>

              <button onClick={() => applyPreset(1, 100)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-transparent hover:border-amber-200">
                <div className="text-2xl mb-1">💯</div>
                <div className="font-semibold text-sm">Percentage</div>
                <div className="text-xs text-gray-500">1-100</div>
              </button>

              <button onClick={() => applyPreset(1000, 9999)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-transparent hover:border-amber-200">
                <div className="text-2xl mb-1">🔐</div>
                <div className="font-semibold text-sm">PIN Code</div>
                <div className="text-xs text-gray-500">1000-9999</div>
              </button>

              <button onClick={() => applyPreset(1, 365)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-transparent hover:border-amber-200">
                <div className="text-2xl mb-1">📅</div>
                <div className="font-semibold text-sm">Day of Year</div>
                <div className="text-xs text-gray-500">1-365</div>
              </button>

              <button onClick={() => applyPreset(1, 10, 3)} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-transparent hover:border-amber-200">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-semibold text-sm">Top 3</div>
                <div className="text-xs text-gray-500">3 from 1-10</div>
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Generation History</h3>
              <button onClick={clearHistory} className="text-red-600 text-sm hover:text-red-700 transition-colors">
                Clear History
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No numbers generated yet</p>
              ) : (
                history.map((entry, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-800">
                        {entry.type} Number{entry.type === 'Multiple' ? 's' : ''}
                      </span>
                      <span className="text-xs text-gray-500">
                        {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Range: {entry.range}
                      {entry.count ? ` (${entry.count} numbers)` : ''}
                    </div>
                    <div className="font-mono text-purple-700">{entry.result}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Features & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-purple-800 mb-4">Features</h3>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Cryptographically secure randomness</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Support for any range</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Generate single or multiple numbers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Quick presets for common use cases</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">✓</span>
                  <span>Generation history tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Common Use Cases</h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Gaming and dice rolls</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Lottery number selection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Statistical sampling</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Password generation components</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Decision making and random choices</span>
                </li>
              </ul>
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="random-number-generator" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Generator Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="text-sm text-purple-700">Last Single</span>
                <span className="font-bold text-purple-600">{singleResult}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <span className="text-sm text-blue-700">Multiple Count</span>
                <span className="font-bold text-blue-600">{multipleResults.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <span className="text-sm text-green-700">History</span>
                <span className="font-bold text-green-600">{history.length} entries</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                <span className="text-sm text-amber-700">Current Range</span>
                <span className="font-bold text-amber-600">{singleMin}-{singleMax}</span>
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
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">{tool.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
            <h3 className="text-lg font-bold text-purple-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Use unique numbers for lottery picks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Quick presets save time for common tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>History helps track previous generations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>All generation uses secure randomness</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
