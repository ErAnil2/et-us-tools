'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How does the spin wheel work?',
    answer: 'Simply add your options to the wheel, click the "Spin" button, and watch as the wheel rotates randomly. When it stops, the winning segment will be highlighted and announced.',
    order: 1
  },
  {
    id: '2',
    question: 'Is the spin result truly random?',
    answer: 'Yes! Our spin wheel uses cryptographically secure random number generation to determine where the wheel stops. Each segment has an equal probability of being selected.',
    order: 2
  },
  {
    id: '3',
    question: 'Can I customize the wheel options?',
    answer: 'You can add, edit, or remove options from the wheel. Simply type your options in the text area (one per line) and click "Update Wheel" to apply changes.',
    order: 3
  },
  {
    id: '4',
    question: 'What are some uses for the spin wheel?',
    answer: 'The spin wheel is perfect for making random decisions, picking winners for giveaways, choosing activities, selecting teams, playing games, or anywhere you need a fair random selection.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I save my wheel configuration?',
    answer: 'Your wheel configuration is automatically saved in your browser\'s local storage. When you return to the page, your custom options will still be there.',
    order: 5
  },
  {
    id: '6',
    question: 'Is there a limit to the number of options?',
    answer: 'You can add up to 20 options to the wheel. For best visibility, we recommend using 2-12 options so each segment remains readable.',
    order: 6
  }
];

const relatedTools = [
  { name: 'Coin Flip', path: '/us/tools/apps/coin-flip', icon: '🪙', color: 'bg-yellow-100' },
  { name: 'Dice Roller', path: '/us/tools/apps/dice-roller', icon: '🎲', color: 'bg-red-100' },
  { name: 'Random Number', path: '/us/tools/apps/random-number-generator', icon: '🔢', color: 'bg-blue-100' },
  { name: 'Lucky Draw', path: '/us/tools/apps/lucky-draw-picker', icon: '🎁', color: 'bg-purple-100' },
];

const WHEEL_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
  '#FF7F50', '#9370DB', '#3CB371', '#FF69B4', '#87CEEB', '#FFA07A',
  '#20B2AA', '#778899'
];

const DEFAULT_OPTIONS = [
  'Option 1',
  'Option 2',
  'Option 3',
  'Option 4',
  'Option 5',
  'Option 6'
];

export default function SpinWheelClient() {
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
  const [optionsText, setOptionsText] = useState(DEFAULT_OPTIONS.join('\n'));
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('spin-wheel');

  const webAppSchema = generateWebAppSchema(
    'Spin the Wheel - Random Picker & Decision Maker',
    'Free online spin wheel for random selection and decision making. Customize options, spin the wheel, and get random results.',
    'https://economictimes.indiatimes.com/us/tools/apps/spin-wheel',
    'Utility'
  );

  // Load saved options
  useEffect(() => {
    const saved = localStorage.getItem('spinWheelOptions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOptions(parsed);
          setOptionsText(parsed.join('\n'));
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    const savedHistory = localStorage.getItem('spinWheelHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  // Draw wheel
  useEffect(() => {
    drawWheel();
  }, [options, rotation]);

  // Save options
  useEffect(() => {
    localStorage.setItem('spinWheelOptions', JSON.stringify(options));
  }, [options]);

  // Save history
  useEffect(() => {
    localStorage.setItem('spinWheelHistory', JSON.stringify(history));
  }, [history]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sliceAngle = (2 * Math.PI) / options.length;

    // Draw segments
    options.forEach((option, index) => {
      const startAngle = index * sliceAngle + (rotation * Math.PI / 180);
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[index % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 3;

      // Truncate long text
      let displayText = option;
      if (displayText.length > 15) {
        displayText = displayText.substring(0, 12) + '...';
      }
      ctx.fillText(displayText, radius - 20, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 15, centerY);
    ctx.lineTo(centerX + radius - 10, centerY - 15);
    ctx.lineTo(centerX + radius - 10, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#FF4444';
    ctx.fill();
    ctx.strokeStyle = '#CC0000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const getSecureRandom = (): number => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] / (0xFFFFFFFF + 1);
    }
    return Math.random();
  };

  const spinWheel = () => {
    if (isSpinning || options.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    // Calculate random spin
    const minSpins = 5;
    const maxSpins = 10;
    const spins = minSpins + getSecureRandom() * (maxSpins - minSpins);
    const randomAngle = getSecureRandom() * 360;
    const totalRotation = spins * 360 + randomAngle;

    // Animate
    const startRotation = rotation;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentRotation = startRotation + totalRotation * eased;
      setRotation(currentRotation % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Determine winner
        const finalRotation = (startRotation + totalRotation) % 360;
        const sliceAngle = 360 / options.length;
        // Pointer is at 0 degrees (right side), so we need to find which slice is there
        const adjustedAngle = (360 - finalRotation + 90) % 360;
        const winnerIndex = Math.floor(adjustedAngle / sliceAngle) % options.length;
        const winner = options[winnerIndex];

        setResult(winner);
        setHistory(prev => [winner, ...prev].slice(0, 20));
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const updateOptions = () => {
    const newOptions = optionsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 20);

    if (newOptions.length >= 2) {
      setOptions(newOptions);
      setResult(null);
    } else {
      alert('Please enter at least 2 options');
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const resetWheel = () => {
    setOptions(DEFAULT_OPTIONS);
    setOptionsText(DEFAULT_OPTIONS.join('\n'));
    setResult(null);
    setRotation(0);
  };

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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🎡</span>
          <span className="text-purple-600 font-semibold">Spin the Wheel</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {getH1('Spin the Wheel')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Make random decisions, pick winners, or choose options fairly with our customizable spin wheel.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="lg:hidden mb-6">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{options.length}</div>
            <div className="text-xs opacity-80">Options</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{history.length}</div>
            <div className="text-xs opacity-80">Spins</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold truncate px-1">{result || '-'}</div>
            <div className="text-xs opacity-80">Last</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Wheel Container */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
            <div className="flex justify-center mb-6">
              <canvas
                ref={canvasRef}
                width={350}
                height={350}
                className="max-w-full"
              />
            </div>

            {/* Result Display */}
            {result && (
              <div className="text-center mb-6 p-4 bg-white rounded-xl shadow-lg">
                <div className="text-sm text-gray-500 mb-1">Winner!</div>
                <div className="text-2xl font-bold text-purple-600">{result}</div>
              </div>
            )}

            {/* Spin Button */}
            <div className="text-center">
              <button
                onClick={spinWheel}
                disabled={isSpinning || options.length < 2}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSpinning ? '🎡 Spinning...' : '🎡 SPIN!'}
              </button>
            </div>
          </div>

          {/* Options Editor */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Customize Options</h3>
            <p className="text-sm text-gray-500 mb-3">Enter one option per line (2-20 options)</p>
            <textarea
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="Enter options, one per line..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={updateOptions}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Update Wheel
              </button>
              <button
                onClick={resetWheel}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Spin History</h3>
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No spins yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {history.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Common Uses</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Giveaway winner selection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Team or group picking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Decision making</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Classroom activities</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Party games</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-800 mb-4">Ideas</h3>
              <ul className="space-y-2 text-amber-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">🍕</span>
                  <span>What to eat for dinner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">🎬</span>
                  <span>Which movie to watch</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">🎮</span>
                  <span>Which game to play</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">🧹</span>
                  <span>Chore assignments</span>
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
          <div className="hidden lg:block bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4 text-purple-100">Wheel Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Options</span>
                <span className="font-bold text-2xl">{options.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Total Spins</span>
                <span className="font-bold text-xl">{history.length}</span>
              </div>
              {result && (
                <div className="pt-4 border-t border-purple-400/30">
                  <div className="text-purple-100 text-sm mb-1">Last Winner</div>
                  <div className="font-bold text-lg truncate">{result}</div>
                </div>
              )}
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
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
                  <span className="font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
{/* Quick Tips */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
            <h3 className="font-semibold text-purple-800 mb-3">Tips</h3>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">💡</span>
                <span>Use 2-12 options for best visibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">💾</span>
                <span>Options auto-save in your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">🎲</span>
                <span>Results are cryptographically random</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">📱</span>
                <span>Works great on mobile too!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <GameAppMobileMrec2 />



      

      {/* FAQs Section */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="spin-wheel" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
