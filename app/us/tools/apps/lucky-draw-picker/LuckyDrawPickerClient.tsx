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
    question: 'Is the selection truly random?',
    answer: 'Yes! Our picker uses cryptographically secure random number generation to ensure completely fair and unbiased selections. Every entry has an equal chance of being picked.',
    order: 1
  },
  {
    id: '2',
    question: 'Can I pick multiple winners?',
    answer: 'Absolutely! Set the number of winners you need, and the picker will randomly select that many unique entries from your list. No duplicates will be selected.',
    order: 2
  },
  {
    id: '3',
    question: 'How do I add entries?',
    answer: 'Enter names or items one per line in the text area, or separate them with commas. You can also paste a list from a spreadsheet - each row will become a separate entry.',
    order: 3
  },
  {
    id: '4',
    question: 'Can I remove winners from future draws?',
    answer: 'Yes! After each draw, you can choose to remove winners from the list. This is perfect for raffles where the same person should not win twice.',
    order: 4
  },
  {
    id: '5',
    question: 'Is my data saved?',
    answer: 'All data stays in your browser and is never sent to any server. Your entries are completely private. However, data is not saved between sessions - refresh will clear the list.',
    order: 5
  },
  {
    id: '6',
    question: 'What can I use this for?',
    answer: 'Common uses include: giveaway raffles, classroom name picks, team member selection, door prize drawings, contest winners, random group assignments, and any situation requiring a fair random selection.',
    order: 6
  }
];

export default function LuckyDrawPickerClient() {
  const [entries, setEntries] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [winners, setWinners] = useState<string[]>([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState('');
  const [removeWinners, setRemoveWinners] = useState(false);
  const [history, setHistory] = useState<{winners: string[], timestamp: Date}[]>([]);
  const [isFullWidth, setIsFullWidth] = useState(false);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('lucky-draw-picker');

  const webAppSchema = generateWebAppSchema(
    'Lucky Draw Picker - Free Random Name & Winner Picker',
    'Free online random name picker for giveaways, raffles, and contests. Pick fair winners with our lucky draw tool. Supports multiple winners and animated selections.',
    'https://economictimes.indiatimes.com/us/tools/apps/lucky-draw-picker',
    'Utility'
  );

  const parseEntries = (text: string): string[] => {
    const parsed = text
      .split(/[\n,]+/)
      .map(entry => entry.trim())
      .filter(entry => entry.length > 0);
    return [...new Set(parsed)];
  };

  const MAX_ENTRIES = 1000;

  const handleAddEntries = () => {
    const newEntries = parseEntries(inputText);
    setEntries(prev => {
      const combined = [...prev, ...newEntries];
      const uniqueEntries = [...new Set(combined)];
      if (uniqueEntries.length > MAX_ENTRIES) {
        alert(`Maximum ${MAX_ENTRIES} entries allowed. Only the first ${MAX_ENTRIES} entries will be kept.`);
        return uniqueEntries.slice(0, MAX_ENTRIES);
      }
      return uniqueEntries;
    });
    setInputText('');
  };

  const handleClearAll = () => {
    setEntries([]);
    setWinners([]);
    setCurrentDisplay('');
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  const getSecureRandom = (max: number): number => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    return Math.floor(Math.random() * max);
  };

  const pickWinners = async () => {
    if (entries.length === 0) return;
    if (winnerCount > entries.length) {
      alert(`Cannot pick ${winnerCount} winners from ${entries.length} entries.`);
      return;
    }

    setIsSpinning(true);
    setWinners([]);

    const spinDuration = 3000;
    const spinInterval = 50;
    const spinSteps = spinDuration / spinInterval;

    for (let i = 0; i < spinSteps; i++) {
      const randomIndex = getSecureRandom(entries.length);
      setCurrentDisplay(entries[randomIndex]);
      await new Promise(resolve => setTimeout(resolve, spinInterval));
    }

    const availableEntries = [...entries];
    const selectedWinners: string[] = [];

    for (let i = 0; i < winnerCount; i++) {
      const randomIndex = getSecureRandom(availableEntries.length);
      selectedWinners.push(availableEntries[randomIndex]);
      availableEntries.splice(randomIndex, 1);
    }

    setWinners(selectedWinners);
    setCurrentDisplay(selectedWinners[0]);
    setIsSpinning(false);

    setHistory(prev => [{
      winners: selectedWinners,
      timestamp: new Date()
    }, ...prev].slice(0, 10));

    if (removeWinners) {
      setEntries(prev => prev.filter(entry => !selectedWinners.includes(entry)));
    }
  };

  const loadSample = () => {
    const sampleNames = [
      'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Ross',
      'Edward Norton', 'Fiona Apple', 'George Lucas', 'Helen Troy',
      'Ivan Petrov', 'Julia Roberts', 'Kevin Hart', 'Lisa Simpson'
    ];
    setEntries(sampleNames);
  };

  const relatedTools = [
    { href: '/us/tools/apps/random-number-generator', title: 'Random Number Generator', icon: '🎲' },
    { href: '/us/tools/apps/strong-password-generator', title: 'Password Generator', icon: '🔐' },
    { href: '/us/tools/apps/qr-generator', title: 'QR Code Generator', icon: '📱' },
    { href: '/us/tools/apps/hash-generator', title: 'Hash Generator', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

      {/* Full Width Hero Section */}
      <div className="w-full bg-gradient-to-r from-amber-500 to-orange-400 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur px-6 py-3 rounded-full mb-4">
              <span className="text-3xl">🎰</span>
              <span className="text-white font-semibold text-lg">Lucky Draw Picker</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {getH1('Lucky Draw Picker')}
            </h1>

            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {getSubHeading('Pick random winners for giveaways, raffles, and contests. Fair, fun, and completely random selections.')}
            </p>
          </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
            <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{entries.length}</div>
              <div className="text-xs text-white/80">Entries</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{winners.length}</div>
              <div className="text-xs text-white/80">Winners</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{winnerCount}</div>
              <div className="text-xs text-white/80">To Pick</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-white">{history.length}</div>
              <div className="text-xs text-white/80">Draws</div>
            </div>
          </div>

          {/* Winner Display / Play Area */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-3xl mx-auto border border-white/20 shadow-2xl">
            <div className="text-white/80 text-sm mb-2 uppercase tracking-wider">
              {isSpinning ? '🎰 Selecting...' : winners.length > 0 ? '🏆 Winner(s)!' : '✨ Ready to Pick'}
            </div>

            <div className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 min-h-[4rem] flex items-center justify-center ${isSpinning ? 'animate-pulse' : ''}`}>
              {currentDisplay || '???'}
            </div>

            {winners.length > 1 && !isSpinning && (
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className="bg-white/20 backdrop-blur rounded-full px-5 py-2 text-white font-medium"
                  >
                    #{index + 1}: {winner}
                  </div>
                ))}
              </div>
            )}

            {/* Pick Winner Button - In Play Area */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={pickWinners}
                disabled={entries.length === 0 || isSpinning}
                className="px-10 py-4 bg-white text-amber-600 rounded-2xl font-bold text-xl hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                {isSpinning ? '🎰 Spinning...' : '🎉 Pick Winner(s)!'}
              </button>

              {/* Winner Count Quick Select */}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                <span className="text-white/80 text-sm">Pick:</span>
                {[1, 2, 3, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => setWinnerCount(num)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      winnerCount === num
                        ? 'bg-white text-amber-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Toggle */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex justify-end">
          <button
            onClick={() => setIsFullWidth(!isFullWidth)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-gray-700 font-medium"
          >
            {isFullWidth ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span>Show Sidebar</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Full Width</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 py-6 ${isFullWidth ? '' : 'flex flex-col lg:flex-row gap-6'}`}>
        {/* Main Content Area */}
        <div className={`${isFullWidth ? 'w-full' : 'flex-1 min-w-0'}`}>
          <div className={`grid ${isFullWidth ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
            {/* Add Entries */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Add Entries</h3>
                <button
                  onClick={loadSample}
                  className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                >
                  Load Sample
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter names/entries (one per line or comma-separated)..."
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none mb-2"
              />
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>One entry per line or comma-separated</span>
                <span className={entries.length >= MAX_ENTRIES ? 'text-red-500 font-medium' : ''}>
                  {entries.length}/{MAX_ENTRIES}
                </span>
              </div>

              <button
                onClick={handleAddEntries}
                disabled={!inputText.trim() || entries.length >= MAX_ENTRIES}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50"
              >
                {entries.length >= MAX_ENTRIES ? 'Max Entries Reached' : 'Add to List'}
              </button>
            </div>

            {/* Draw Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Draw Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Winners
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={entries.length || 1}
                    value={winnerCount}
                    onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={removeWinners}
                    onChange={(e) => setRemoveWinners(e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded"
                  />
                  <span className="text-gray-700">Remove winners from list after draw</span>
                </label>

                {/* Quick Tips */}
                <div className="p-4 bg-amber-50 rounded-xl">
                  <h4 className="font-semibold text-amber-800 mb-2">Quick Tips</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Paste names from spreadsheet</li>
                    <li>• Uses secure random selection</li>
                    <li>• All data stays in browser</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Entry List */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 ${isFullWidth ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Entries ({entries.length})
                </h3>
                <button
                  onClick={handleClearAll}
                  disabled={entries.length === 0}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Clear All
                </button>
              </div>

              {entries.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No entries yet. Add names above to get started!
                </div>
              ) : (
                <div className={`${isFullWidth ? 'max-h-80' : 'max-h-64'} overflow-y-auto space-y-2`}>
                  {entries.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        winners.includes(entry)
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-800">{entry}</span>
                        {winners.includes(entry) && (
                          <span className="text-green-600">🏆</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveEntry(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Draw History</h3>
              <div className={`${isFullWidth ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-3'} max-h-48 overflow-y-auto`}>
                {history.map((draw, index) => (
                  <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-amber-600">
                        Draw #{history.length - index}
                      </span>
                      <span className="text-xs text-gray-400">
                        {draw.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-amber-800 font-medium">
                      {draw.winners.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mt-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="lucky-draw-picker" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar - Only show when not full width */}
        {!isFullWidth && (
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
            <div className="hidden lg:block bg-white rounded-2xl p-4 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Draw Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                  <span className="text-sm text-amber-700">Total Entries</span>
                  <span className="font-bold text-amber-600">{entries.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <span className="text-sm text-green-700">Winners Selected</span>
                  <span className="font-bold text-green-600">{winners.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <span className="text-sm text-blue-700">Winners to Pick</span>
                  <span className="font-bold text-blue-600">{winnerCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <span className="text-sm text-purple-700">Total Draws</span>
                  <span className="font-bold text-purple-600">{history.length}</span>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Current Winners */}
            {winners.length > 0 && (
              <div className="hidden lg:block bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 shadow-lg">
                <h3 className="text-lg font-bold text-green-800 mb-3">Current Winners</h3>
                <div className="space-y-2">
                  {winners.map((winner, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                      <span className="text-green-600">🏆</span>
                      <span className="text-sm font-medium text-gray-800">{winner}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ad Banner */}
            <AdBanner />
{/* Related Tools */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
              <div className="space-y-2">
                {relatedTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors group"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600">{tool.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 shadow-lg">
              <h3 className="text-lg font-bold text-amber-800 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Paste names from a spreadsheet for quick entry</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Enable "Remove winners" for no-repeat raffles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Use cryptographically secure random selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>All data stays private in your browser</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
