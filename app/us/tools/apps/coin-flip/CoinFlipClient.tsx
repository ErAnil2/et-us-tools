'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'Is this coin flip truly random?',
    answer: 'Yes! Our coin flipper uses cryptographically secure random number generation (Web Crypto API) to ensure each flip has an exactly 50/50 probability of landing heads or tails.',
    order: 1
  },
  {
    id: '2',
    question: 'Can I flip multiple coins at once?',
    answer: 'Absolutely! Use the Multiple Flips feature to flip 5, 10, 25, 50, or even 100 coins at once. You will see the results with heads/tails count and percentage.',
    order: 2
  },
  {
    id: '3',
    question: 'Is this coin flip fair?',
    answer: 'Yes, our virtual coin flip is completely fair. Unlike physical coins which can have slight biases, our digital coin uses true random number generation for an exact 50/50 probability.',
    order: 3
  },
  {
    id: '4',
    question: 'Can I use keyboard shortcuts?',
    answer: 'Yes! Press the Spacebar to quickly flip the coin without clicking. This makes rapid flipping much easier.',
    order: 4
  },
  {
    id: '5',
    question: 'Is my flip history saved?',
    answer: 'Yes, your flip history is saved locally in your browser. You can see your last 50 flips and view statistics like total heads, tails, and percentages. Use the Clear History button to reset.',
    order: 5
  },
  {
    id: '6',
    question: 'What are common uses for coin flipping?',
    answer: 'Coin flips are used for making quick decisions, settling disputes fairly, starting sports games, random selection in games, probability experiments, and teaching statistics.',
    order: 6
  }
];

const relatedTools = [
  { name: 'Dice Roller', path: '/us/tools/apps/dice-roller', icon: '🎲', color: 'bg-red-100' },
  { name: 'Random Number', path: '/us/tools/apps/random-number-generator', icon: '🔢', color: 'bg-blue-100' },
  { name: 'Spin Wheel', path: '/us/tools/apps/spin-wheel', icon: '🎡', color: 'bg-purple-100' },
  { name: 'Rock Paper Scissors', path: '/us/tools/games/rock-paper-scissors', icon: '✊', color: 'bg-green-100' },
];

export default function CoinFlipClient() {
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [flipHistory, setFlipHistory] = useState<string[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinDisplay, setCoinDisplay] = useState('?');
  const [result, setResult] = useState('Ready to flip!');
  const [resultSubtext, setResultSubtext] = useState('Click the coin or press Space');
  const [resultColor, setResultColor] = useState('text-gray-800');
  const [coinClass, setCoinClass] = useState('from-yellow-400 to-yellow-600 text-yellow-900');
  const [multipleCount, setMultipleCount] = useState('5');
  const [multipleResults, setMultipleResults] = useState<{ heads: number; tails: number; results: string[] } | null>(null);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('coin-flip');

  const webAppSchema = generateWebAppSchema(
    'Coin Flip - Free Online Virtual Coin Flipper',
    'Free online coin flip tool for making quick decisions. Features true 50/50 probability, multiple coin flips, history tracking, and keyboard shortcuts.',
    'https://economictimes.indiatimes.com/us/tools/apps/coin-flip',
    'Utility'
  );

  useEffect(() => {
    loadStats();

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isFlipping) {
        e.preventDefault();
        flipCoin();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFlipping]);

  const getSecureRandomBoolean = (): boolean => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % 2 === 0;
    }
    return Math.random() < 0.5;
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const flipCoin = async () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult('Flipping...');
    setResultSubtext('');

    await sleep(1500);

    const isHeads = getSecureRandomBoolean();

    // Update stats
    if (isHeads) {
      setHeadsCount(prev => prev + 1);
    } else {
      setTailsCount(prev => prev + 1);
    }

    // Add to history
    setFlipHistory(prev => {
      const newHistory = [isHeads ? 'H' : 'T', ...prev];
      return newHistory.slice(0, 50);
    });

    // Show result
    setCoinDisplay(isHeads ? 'H' : 'T');
    setCoinClass(isHeads ? 'from-blue-400 to-blue-600 text-white' : 'from-red-400 to-red-600 text-white');

    setResult(isHeads ? 'HEADS!' : 'TAILS!');
    setResultColor(isHeads ? 'text-blue-600' : 'text-red-600');

    const messages = {
      heads: ['You got heads!', 'Blue side wins!', 'Heads it is!', 'Lucky heads!'],
      tails: ['You got tails!', 'Red side wins!', 'Tails it is!', 'Lucky tails!']
    };

    const messageArray = isHeads ? messages.heads : messages.tails;
    setResultSubtext(messageArray[Math.floor(Math.random() * messageArray.length)]);

    setIsFlipping(false);
    saveStats();
  };

  const multipleFlip = async () => {
    const count = parseInt(multipleCount);
    setMultipleResults(null);

    await sleep(500);

    let heads = 0;
    let tails = 0;
    let results: string[] = [];
    let newHistory: string[] = [];

    for (let i = 0; i < count; i++) {
      const isHeads = getSecureRandomBoolean();
      if (isHeads) {
        heads++;
      } else {
        tails++;
      }
      results.push(isHeads ? 'H' : 'T');
      newHistory.push(isHeads ? 'H' : 'T');
    }

    setHeadsCount(prev => prev + heads);
    setTailsCount(prev => prev + tails);
    setFlipHistory(prev => [...newHistory, ...prev].slice(0, 50));
    setMultipleResults({ heads, tails, results });

    saveStats();
  };

  const clearHistory = () => {
    setHeadsCount(0);
    setTailsCount(0);
    setFlipHistory([]);
    setCoinDisplay('?');
    setCoinClass('from-yellow-400 to-yellow-600 text-yellow-900');
    setResult('Ready to flip!');
    setResultColor('text-gray-800');
    setResultSubtext('Click the coin or press Space');
    setMultipleResults(null);
    saveStats();
  };

  const saveStats = () => {
    if (typeof window !== 'undefined') {
      const data = {
        headsCount,
        tailsCount,
        flipHistory: flipHistory.slice(0, 20)
      };
      localStorage.setItem('coinFlipData', JSON.stringify(data));
    }
  };

  const loadStats = () => {
    if (typeof window !== 'undefined') {
      try {
        const data = JSON.parse(localStorage.getItem('coinFlipData') || '{}');
        setHeadsCount(data.headsCount || 0);
        setTailsCount(data.tailsCount || 0);
        setFlipHistory(data.flipHistory || []);
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  };

  const totalFlips = headsCount + tailsCount;
  const headsPercentage = totalFlips > 0 ? ((headsCount / totalFlips) * 100).toFixed(1) : '0.0';
  const tailsPercentage = totalFlips > 0 ? ((tailsCount / totalFlips) * 100).toFixed(1) : '0.0';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🪙</span>
          <span className="text-yellow-600 font-semibold">Virtual Coin Flip</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
          {getH1('Coin Flip')}
        </h1>

        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          {getSubHeading('Make quick decisions with our virtual coin flipper. Fair 50/50 probability for heads or tails every time.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="lg:hidden mb-6">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{headsCount}</div>
            <div className="text-xs opacity-80">Heads</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{tailsCount}</div>
            <div className="text-xs opacity-80">Tails</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{totalFlips}</div>
            <div className="text-xs opacity-80">Total</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{headsPercentage}%</div>
            <div className="text-xs opacity-80">Heads %</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Coin Display */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
            <div className="text-center">
              <div className="relative mx-auto w-48 h-48 mb-6">
                <div
                  className={`coin w-full h-full bg-gradient-to-br ${coinClass} rounded-full shadow-lg flex items-center justify-center text-6xl font-bold cursor-pointer hover:scale-105 transition-transform ${isFlipping ? 'flipping' : ''}`}
                  onClick={flipCoin}
                >
                  {coinDisplay}
                </div>
              </div>

              <div className={`text-3xl font-bold ${resultColor} mb-2 h-10`}>
                {result}
              </div>
              <div className="text-gray-600 h-6">
                {resultSubtext}
              </div>

              <button
                onClick={flipCoin}
                disabled={isFlipping}
                className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🪙 Flip Coin
              </button>
            </div>
          </div>

          {/* Multiple Flips */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Multiple Flips</h3>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-gray-700 font-medium">Flip</label>
              <select
                value={multipleCount}
                onChange={(e) => setMultipleCount(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="5">5 coins</option>
                <option value="10">10 coins</option>
                <option value="25">25 coins</option>
                <option value="50">50 coins</option>
                <option value="100">100 coins</option>
              </select>
              <button
                onClick={multipleFlip}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
              >
                Multi Flip
              </button>
            </div>

            {multipleResults && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="font-semibold text-gray-800 mb-2">
                  Results: {multipleResults.heads} Heads, {multipleResults.tails} Tails ({((multipleResults.heads / (multipleResults.heads + multipleResults.tails)) * 100).toFixed(0)}% heads)
                </div>
                <div className="text-sm font-mono text-gray-600 break-all">
                  {multipleResults.results.join(' ')}
                </div>
              </div>
            )}
          </div>

          {/* Flip History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Flips</h3>
              <button
                onClick={clearHistory}
                className="text-red-600 text-sm hover:text-red-700 transition-colors font-medium"
              >
                Clear History
              </button>
            </div>
            <div className="grid grid-cols-10 gap-2">
              {flipHistory.length === 0 ? (
                <p className="col-span-10 text-gray-500 text-center py-8">No flips yet</p>
              ) : (
                flipHistory.slice(0, 20).map((flip, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 ${
                      flip === 'H' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    } rounded-full flex items-center justify-center text-sm font-bold`}
                  >
                    {flip}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Uses and Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-green-800 mb-4">Common Uses</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  <span>Making quick decisions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  <span>Settling disputes fairly</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  <span>Starting sports games</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  <span>Random selection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">•</span>
                  <span>Probability experiments</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-800 mb-4">Fun Facts</h3>
              <ul className="space-y-2 text-amber-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">🎯</span>
                  <span>A fair coin has exactly 50% chance for heads or tails</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">🏛️</span>
                  <span>Ancient Romans called it "navia aut caput"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">🎲</span>
                  <span>10 heads in a row: 1 in 1,024 chance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">⚖️</span>
                  <span>Used in legal systems when all else fails</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
{/* Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4 text-yellow-100">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-yellow-100">Heads</span>
                <div className="text-right">
                  <span className="font-bold text-xl">{headsCount}</span>
                  <span className="text-yellow-200 text-sm ml-1">({headsPercentage}%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-100">Tails</span>
                <div className="text-right">
                  <span className="font-bold text-xl">{tailsCount}</span>
                  <span className="text-yellow-200 text-sm ml-1">({tailsPercentage}%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-yellow-400/30">
                <span className="text-yellow-100">Total Flips</span>
                <span className="font-bold text-2xl">{totalFlips}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden flex">
                {totalFlips > 0 && (
                  <>
                    <div
                      className="h-full bg-blue-400 transition-all"
                      style={{ width: `${headsPercentage}%` }}
                    />
                    <div
                      className="h-full bg-red-400 transition-all"
                      style={{ width: `${tailsPercentage}%` }}
                    />
                  </>
                )}
              </div>
              <div className="flex justify-between text-xs text-yellow-200">
                <span>Heads</span>
                <span>Tails</span>
              </div>
            </div>
          </div>
{/* Related Tools */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-3">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-10 h-10 ${tool.color} rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                    {tool.icon}
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6">
            <h3 className="font-semibold text-orange-800 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-orange-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">⌨️</span>
                <span>Press <kbd className="px-1 py-0.5 bg-orange-200 rounded text-xs">Space</kbd> to flip quickly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">🖱️</span>
                <span>Click the coin directly to flip</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">📊</span>
                <span>Use Multi Flip for probability tests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">💾</span>
                <span>History saved automatically</span>
              </li>
            </ul>
          </div>

          {/* MREC2 - After 2 widgets (Desktop only) */}
          <SidebarMrec2 />
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <GameAppMobileMrec2 />



      {/* FAQs Section */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="coin-flip" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .coin {
          user-select: none;
          transition: all 0.3s ease;
        }

        .coin.flipping {
          animation: coinFlip 1.5s ease-in-out;
        }

        @keyframes coinFlip {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: rotateY(180deg) rotateX(90deg) scale(0.8);
          }
          50% {
            transform: rotateY(360deg) rotateX(180deg) scale(0.6);
          }
          75% {
            transform: rotateY(540deg) rotateX(270deg) scale(0.8);
          }
          100% {
            transform: rotateY(720deg) rotateX(360deg) scale(1);
          }
        }

        .coin:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
