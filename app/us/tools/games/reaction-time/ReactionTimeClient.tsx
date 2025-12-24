'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon?: string;
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do I take the reaction time test?',
    answer: 'Click or tap the red box to start. Wait for it to turn green (do not click early!). When it turns green, click as fast as possible. Your reaction time is measured in milliseconds.',
    order: 1
  },
  {
    id: '2',
    question: 'What is a good reaction time?',
    answer: 'Under 200ms is excellent, 200-250ms is good, 250-300ms is average, 300-400ms is below average, and over 400ms is considered slow. Professional gamers often achieve under 180ms.',
    order: 2
  },
  {
    id: '3',
    question: 'What happens if I click too early?',
    answer: 'Clicking before the box turns green counts as a false start. This affects your accuracy percentage but does not add to your attempt count. Wait for green before clicking!',
    order: 3
  },
  {
    id: '4',
    question: 'Can I improve my reaction time?',
    answer: 'Yes! Regular practice can improve reaction time by 10-20%. Tips: stay focused, use your dominant hand, position comfortably, get adequate sleep, and practice consistently.',
    order: 4
  },
  {
    id: '5',
    question: 'Why does reaction time matter?',
    answer: 'Quick reaction time is important for driving safety, sports performance, gaming, and many professions. It indicates how fast your brain processes visual information and sends signals to muscles.',
    order: 5
  },
  {
    id: '6',
    question: 'What factors affect reaction time?',
    answer: 'Age, fatigue, caffeine, distractions, device latency, and practice all affect reaction time. Testing when alert and focused gives the most accurate results.',
    order: 6
  }
];

type GameState = 'waiting' | 'ready' | 'clicked' | 'finished';

interface ReactionTimeClientProps {
  relatedGames?: Array<{
    href: string;
    title: string;
    description: string;
    color?: string;
    icon?: string;
  }>;
}

const getGameIcon = (icon: string) => {
  const icons: Record<string, string> = {
    memory: '🧠',
    puzzle: '🧩',
    game: '🎮',
    blocks: '🔲',
    speed: '⚡'
  };
  return icons[icon] || '🎮';
};

export default function ReactionTimeClient({ relatedGames = defaultRelatedGames }: ReactionTimeClientProps) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('reaction-time');

  const webAppSchema = generateWebAppSchema(
    'Reaction Time Test - Free Online Reflex Test',
    'Test your reaction time online for free. Measure your reflexes in milliseconds and track your improvement over time.',
    'https://economictimes.indiatimes.com/us/tools/games/reaction-time',
    'Game'
  );

  const [state, setState] = useState<GameState>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [falseStarts, setFalseStarts] = useState(0);

  const [reactionText, setReactionText] = useState('Click to Start');
  const [instructions, setInstructions] = useState('Click the red box above to begin the reaction time test');
  const [showResults, setShowResults] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [boxColor, setBoxColor] = useState('bg-red-500');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reactionTimeStats');
    if (saved) {
      const stats = JSON.parse(saved);
      setAttempts(stats.attempts || 0);
      setTimes(stats.times || []);
      setFalseStarts(stats.falseStarts || 0);
    }
  }, []);

  const saveStats = useCallback((newAttempts: number, newTimes: number[], newFalseStarts: number) => {
    localStorage.setItem('reactionTimeStats', JSON.stringify({
      attempts: newAttempts,
      times: newTimes,
      falseStarts: newFalseStarts
    }));
  }, []);

  const getResultMessage = (time: number) => {
    if (time < 200) return 'Excellent reflexes! ⚡';
    if (time < 250) return 'Good reaction time! 👍';
    if (time < 300) return 'Average reaction time 👌';
    if (time < 400) return 'Below average, keep practicing 📈';
    return 'Slow reflexes, more practice needed 🐌';
  };

  const getBestTime = () => {
    if (times.length === 0) return '-';
    return `${Math.min(...times)}ms`;
  };

  const getAverageTime = () => {
    if (times.length === 0) return '-';
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    return `${avg}ms`;
  };

  const getAccuracy = () => {
    if (attempts === 0 && falseStarts === 0) return '100%';
    const accuracy = Math.round((attempts / (attempts + falseStarts)) * 100);
    return `${accuracy}%`;
  };

  const startTest = useCallback(() => {
    setState('ready');
    setBoxColor('bg-red-500');
    setReactionText('Wait for GREEN...');
    setInstructions('Wait for the box to turn green, then click as fast as you can!');
    setShowResults(false);

    const delay = Math.random() * 5000 + 2000;

    timeoutRef.current = setTimeout(() => {
      setState((currentState) => {
        if (currentState === 'ready') {
          setStartTime(Date.now());
          setBoxColor('bg-green-500');
          setReactionText('CLICK NOW!');
          setInstructions('Click as fast as you can!');
          return 'clicked';
        }
        return currentState;
      });
    }, delay);
  }, []);

  const recordReaction = useCallback(() => {
    const time = Date.now() - startTime;
    setReactionTime(time);

    const newAttempts = attempts + 1;
    const newTimes = [...times, time];

    setAttempts(newAttempts);
    setTimes(newTimes);

    setBoxColor('bg-blue-500');
    setReactionText(`${time}ms`);
    setInstructions('Click to try again');

    setResultMessage(getResultMessage(time));
    setShowResults(true);

    saveStats(newAttempts, newTimes, falseStarts);
    setState('finished');
  }, [startTime, attempts, times, falseStarts, saveStats]);

  const recordFalseStart = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newFalseStarts = falseStarts + 1;
    setFalseStarts(newFalseStarts);

    setState('waiting');
    setBoxColor('bg-red-500');
    setReactionText('Too Early! Click to restart');
    setInstructions('You clicked too early! Wait for green before clicking.');

    saveStats(attempts, times, newFalseStarts);
  }, [falseStarts, attempts, times, saveStats]);

  const restart = useCallback(() => {
    setState('waiting');
    setBoxColor('bg-red-500');
    setReactionText('Click to Start');
    setInstructions('Click the red box above to begin the reaction time test');
    setShowResults(false);
  }, []);

  const resetStats = () => {
    setAttempts(0);
    setTimes([]);
    setFalseStarts(0);
    saveStats(0, [], 0);
  };

  const handleClick = () => {
    switch (state) {
      case 'waiting':
        startTest();
        break;
      case 'ready':
        recordFalseStart();
        break;
      case 'clicked':
        recordReaction();
        break;
      case 'finished':
        restart();
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
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

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">⚡</span>
            <span className="text-orange-600 font-semibold">Reaction Time</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            {getH1('Reaction Time Test')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Test your reflexes and reaction speed. How fast can you respond?')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Reaction Test Box */}
              <div
                onClick={handleClick}
                className={`w-full h-64 sm:h-72 md:h-80 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${boxColor} select-none active:scale-98`}
              >
                <div className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-center px-4">
                  {reactionText}
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 text-center text-gray-600">
                {instructions}
              </div>

              {/* Results */}
              {showResults && (
                <div className="mt-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{reactionTime}ms</div>
                  <div className="text-lg text-gray-600 mb-4">{resultMessage}</div>
                  <button
                    onClick={restart}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Click to Start</h4>
                    <p className="text-sm text-gray-600">Click the red box to begin the test</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Wait for Green</h4>
                    <p className="text-sm text-gray-600">Do not click until the box turns green!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Click Fast!</h4>
                    <p className="text-sm text-gray-600">Click as quickly as possible when green</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">See Your Time</h4>
                    <p className="text-sm text-gray-600">Your reaction time appears in milliseconds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benchmarks */}
            <div className="mt-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reaction Time Benchmarks</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-green-100 rounded-xl p-3 text-center">
                  <div className="text-sm font-semibold text-green-800">Excellent</div>
                  <div className="text-lg font-bold text-green-600">&lt;200ms</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-3 text-center">
                  <div className="text-sm font-semibold text-blue-800">Good</div>
                  <div className="text-lg font-bold text-blue-600">200-250ms</div>
                </div>
                <div className="bg-yellow-100 rounded-xl p-3 text-center">
                  <div className="text-sm font-semibold text-yellow-800">Average</div>
                  <div className="text-lg font-bold text-yellow-600">250-300ms</div>
                </div>
                <div className="bg-orange-100 rounded-xl p-3 text-center">
                  <div className="text-sm font-semibold text-orange-800">Below Avg</div>
                  <div className="text-lg font-bold text-orange-600">300-400ms</div>
                </div>
                <div className="bg-red-100 rounded-xl p-3 text-center">
                  <div className="text-sm font-semibold text-red-800">Slow</div>
                  <div className="text-lg font-bold text-red-600">&gt;400ms</div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tips to Improve</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-semibold text-orange-700 mb-1">Stay focused</h4>
                  <p className="text-sm text-gray-600">Eliminate distractions and concentrate</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-700 mb-1">Use dominant hand</h4>
                  <p className="text-sm text-gray-600">Your dominant hand reacts faster</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-semibold text-orange-700 mb-1">Get enough sleep</h4>
                  <p className="text-sm text-gray-600">Fatigue significantly slows reactions</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-700 mb-1">Practice regularly</h4>
                  <p className="text-sm text-gray-600">Consistent practice improves times</p>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Reaction Time: Measuring Your Reflexes</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Reaction time is the interval between a stimulus and your response to it. This fundamental cognitive measure
                is crucial for many activities, from sports and driving to gaming and everyday safety. The average human
                reaction time to visual stimuli is around 250 milliseconds, though this varies by age, fatigue, and practice.
                Regular testing and training can help improve your reflexes over time.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚡ Visual Processing</h3>
                  <p className="text-sm text-gray-600">How quickly your eyes detect and your brain processes visual changes.</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h3 className="font-semibold text-orange-800 mb-2">🧠 Neural Speed</h3>
                  <p className="text-sm text-gray-600">The speed at which signals travel from your brain to your muscles.</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-2">🎯 Motor Response</h3>
                  <p className="text-sm text-gray-600">How quickly your muscles can execute the commanded action.</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">📈 Improvement</h3>
                  <p className="text-sm text-gray-600">With practice, you can shave milliseconds off your reaction time.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Reaction Time Benchmarks</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Under 200ms is considered excellent and typical of trained athletes and gamers. 200-250ms is good and
                  faster than average. 250-300ms is average for most adults. Over 300ms is slower than average but can
                  be improved with practice. Factors like sleep, caffeine, and time of day can all affect your reaction time.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Factors Affecting Reaction Time</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    <span>Age - reaction time peaks in the mid-20s and gradually slows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Sleep quality - fatigue significantly impairs reaction speed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Arousal level - being too relaxed or too anxious hurts performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>Practice - regular training can improve times by 10-20%</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
{/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<div className="sticky top-6 space-y-6">
              <AdBanner className="mx-auto" />

              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📊</span> Your Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Attempts</span>
                    <span className="text-xl font-bold text-blue-600">{attempts}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Best Time</span>
                    <span className="text-xl font-bold text-green-600">{getBestTime()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Average</span>
                    <span className="text-xl font-bold text-purple-600">{getAverageTime()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Accuracy</span>
                    <span className="text-xl font-bold text-orange-600">{getAccuracy()}</span>
                  </div>
                </div>
                <button
                  onClick={resetStats}
                  className="w-full mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                >
                  Reset Statistics
                </button>
              </div>
{/* Related Games */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4">Related Games</h3>
                <div className="space-y-3">
                  {relatedGames.map((game, index) => (
                    <Link
                      key={index}
                      href={game.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {getGameIcon(game.icon)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">{game.title}</div>
                        <div className="text-xs text-gray-500">{game.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
