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
    question: 'How do I play Color Memory?',
    answer: 'Watch the sequence of colors light up, then repeat the same sequence by clicking the colored buttons in the correct order. Each level adds one more color to remember.',
    order: 1
  },
  {
    id: '2',
    question: 'What happens if I make a mistake?',
    answer: 'If you click the wrong color, the game ends and your final score is recorded. You can start a new game immediately to try to beat your high score.',
    order: 2
  },
  {
    id: '3',
    question: 'How is the score calculated?',
    answer: 'Points are awarded based on level reached, streak bonuses for consecutive correct sequences, and combo multipliers for rapid correct clicks. Higher difficulty settings with more colors give bonus multipliers.',
    order: 3
  },
  {
    id: '4',
    question: 'What difficulty levels are available?',
    answer: 'Easy mode uses 4 colors while Hard mode uses 6 colors. You can also adjust the sequence speed from Slow to Extreme for additional challenge.',
    order: 4
  },
  {
    id: '5',
    question: 'How do hints work?',
    answer: 'Click the Hint button (costs 50 points) to see the next color in the sequence. This is helpful when you forget the pattern, but use wisely as it reduces your score.',
    order: 5
  },
  {
    id: '6',
    question: 'Is Color Memory good for brain training?',
    answer: 'Yes! Color Memory helps improve short-term memory, concentration, and pattern recognition. Regular play can enhance cognitive function and working memory capacity.',
    order: 6
  }
];

interface ColorMemoryClientProps {
  relatedGames?: Array<{
    href: string;
    title: string;
    description: string;
    color?: string;
    icon?: string;
  }>;
}

interface Stats {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  maxLevel: number;
  maxStreak: number;
}

interface Color {
  name: string;
  bg: string;
  active: string;
  freq: number;
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

export default function ColorMemoryClient({ relatedGames = defaultRelatedGames }: ColorMemoryClientProps) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('color-memory');

  const webAppSchema = generateWebAppSchema(
    'Color Memory Game - Free Online Brain Training',
    'Play Color Memory online for free. Remember color sequences and improve your memory. Multiple difficulty levels and speed settings.',
    'https://economictimes.indiatimes.com/us/tools/games/color-memory',
    'Game'
  );

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showingSequence, setShowingSequence] = useState(false);
  const [colorCount, setColorCount] = useState(4);
  const [speed, setSpeed] = useState(400);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stats, setStats] = useState<Stats>({ gamesPlayed: 0, totalScore: 0, bestScore: 0, maxLevel: 1, maxStreak: 0 });
  const [gameStatus, setGameStatus] = useState('Press Start to begin!');
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const colors: Color[] = [
    { name: 'red', bg: 'bg-red-500', active: 'bg-red-300', freq: 261.63 },
    { name: 'blue', bg: 'bg-blue-500', active: 'bg-blue-300', freq: 329.63 },
    { name: 'green', bg: 'bg-green-500', active: 'bg-green-300', freq: 392.00 },
    { name: 'yellow', bg: 'bg-yellow-400', active: 'bg-yellow-200', freq: 523.25 },
    { name: 'purple', bg: 'bg-purple-500', active: 'bg-purple-300', freq: 440.00 },
    { name: 'pink', bg: 'bg-pink-500', active: 'bg-pink-300', freq: 493.88 }
  ];

  // Load stats and initialize audio
  useEffect(() => {
    const saved = localStorage.getItem('colorMemoryStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
    } catch (e) {
      setSoundEnabled(false);
    }
  }, []);

  const playSound = useCallback((frequency: number) => {
    if (!soundEnabled || !audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.15);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.15);
    } catch (e) {
      console.log('Sound error');
    }
  }, [soundEnabled]);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const showSequence = useCallback(async (seq: number[]) => {
    setShowingSequence(true);
    setGameStatus('Watch the sequence...');
    await wait(500);

    for (let i = 0; i < seq.length; i++) {
      const colorIndex = seq[i];
      setActiveColor(colorIndex);
      playSound(colors[colorIndex].freq);
      await wait(speed);
      setActiveColor(null);
      await wait(200);
    }

    setShowingSequence(false);
    setGameStatus('Your turn! Repeat the sequence');
  }, [colors, playSound, speed]);

  const saveStats = useCallback((finalScore: number, finalLevel: number, finalStreak: number) => {
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      totalScore: stats.totalScore + finalScore,
      bestScore: Math.max(stats.bestScore, finalScore),
      maxLevel: Math.max(stats.maxLevel, finalLevel),
      maxStreak: Math.max(stats.maxStreak, finalStreak)
    };
    setStats(newStats);
    localStorage.setItem('colorMemoryStats', JSON.stringify(newStats));
  }, [stats]);

  const gameOver = useCallback(() => {
    setGameActive(false);
    saveStats(score, level, streak);
    setShowGameOver(true);
    setGameStatus('Game Over!');
  }, [score, level, streak, saveStats]);

  const startGame = useCallback(() => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setStreak(0);
    setCombo(0);
    setGameActive(true);
    setShowGameOver(false);

    const firstColor = Math.floor(Math.random() * colorCount);
    const newSequence = [firstColor];
    setSequence(newSequence);

    setTimeout(() => {
      showSequence(newSequence);
    }, 500);
  }, [colorCount, showSequence]);

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    setLevel(newLevel);
    setPlayerSequence([]);

    const randomColor = Math.floor(Math.random() * colorCount);
    const newSequence = [...sequence, randomColor];
    setSequence(newSequence);

    setTimeout(() => {
      showSequence(newSequence);
    }, 1000);
  }, [level, colorCount, sequence, showSequence]);

  const handleColorClick = useCallback((colorIndex: number) => {
    if (!gameActive || showingSequence) return;

    setActiveColor(colorIndex);
    playSound(colors[colorIndex].freq);
    setTimeout(() => setActiveColor(null), 150);

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    const currentIndex = newPlayerSequence.length - 1;

    if (sequence[currentIndex] !== colorIndex) {
      gameOver();
      return;
    }

    setCombo(prev => prev + 1);

    if (newPlayerSequence.length === sequence.length) {
      // Level complete
      const newStreak = streak + 1;
      setStreak(newStreak);

      const basePoints = level * 10;
      const streakBonus = newStreak >= 3 ? newStreak * 5 : 0;
      const comboMultiplier = Math.min(1 + (combo * 0.1), 2);
      const points = Math.floor((basePoints + streakBonus) * comboMultiplier);
      setScore(prev => prev + points);

      if (level >= 20) {
        setScore(prev => prev + 500);
        gameOver();
      } else {
        nextLevel();
      }
    }
  }, [gameActive, showingSequence, playerSequence, sequence, level, streak, combo, colors, playSound, gameOver, nextLevel]);

  const useHint = useCallback(() => {
    if (!gameActive || showingSequence || score < 50) return;

    setScore(prev => prev - 50);
    const nextIndex = playerSequence.length;

    if (nextIndex < sequence.length) {
      const colorToShow = sequence[nextIndex];
      setActiveColor(colorToShow);
      playSound(colors[colorToShow].freq);
      setTimeout(() => setActiveColor(null), 500);
    }
  }, [gameActive, showingSequence, score, playerSequence, sequence, colors, playSound]);

  const gridCols = colorCount <= 4 ? 2 : 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
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

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🌈</span>
            <span className="text-purple-600 font-semibold">Color Memory</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {getH1('Color Memory Game')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Watch the color sequence and repeat it back. How many levels can you complete?')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Game Status */}
              <div className="text-center mb-6">
                <div className="text-lg font-semibold text-purple-600 mb-4">{gameStatus}</div>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-blue-600">Level</div>
                    <div className="text-2xl font-bold text-blue-700">{level}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-green-600">Score</div>
                    <div className="text-2xl font-bold text-green-700">{score}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-orange-600">Streak</div>
                    <div className="text-2xl font-bold text-orange-700">{streak}</div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              {!gameActive && (
                <div className="mb-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-full p-2 border-2 border-gray-200 rounded-lg"
                    >
                      <option value="600">Slow</option>
                      <option value="400">Normal</option>
                      <option value="250">Fast</option>
                      <option value="150">Extreme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                    <select
                      value={colorCount}
                      onChange={(e) => setColorCount(parseInt(e.target.value))}
                      className="w-full p-2 border-2 border-gray-200 rounded-lg"
                    >
                      <option value="4">Easy (4)</option>
                      <option value="6">Hard (6)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Color Grid */}
              <div className="flex justify-center mb-6">
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
                >
                  {colors.slice(0, colorCount).map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorClick(index)}
                      disabled={showingSequence || !gameActive}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl transition-all duration-150 transform shadow-lg ${
                        activeColor === index
                          ? `${color.active} scale-110 ring-4 ring-white`
                          : `${color.bg} hover:scale-105`
                      } ${!gameActive || showingSequence ? 'opacity-70' : 'cursor-pointer'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              {gameActive && (
                <div className="mb-6 max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{playerSequence.length}/{sequence.length}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${(playerSequence.length / sequence.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  {gameActive ? 'Restart' : 'Start Game'}
                </button>
                {gameActive && (
                  <>
                    <button
                      onClick={useHint}
                      disabled={score < 50}
                      className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Hint (-50)
                    </button>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                        soundEnabled ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {soundEnabled ? '🔊' : '🔇'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Game Over Modal */}
            {showGameOver && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                  <div className="text-5xl mb-4">🧠</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Over!</h2>
                  <div className="space-y-3 mb-6">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-sm text-purple-600">Final Score</div>
                      <div className="text-3xl font-bold text-purple-700">{score}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-2">
                        <div className="text-xs text-blue-600">Level</div>
                        <div className="text-xl font-bold text-blue-700">{level}</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2">
                        <div className="text-xs text-orange-600">Streak</div>
                        <div className="text-xl font-bold text-orange-700">{streak}</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={startGame}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}

            {/* How to Play */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Watch Carefully</h4>
                    <p className="text-sm text-gray-600">Colors will light up in a sequence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Repeat the Pattern</h4>
                    <p className="text-sm text-gray-600">Click colors in the same order</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Level Up</h4>
                    <p className="text-sm text-gray-600">Each level adds one more color</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Build Streaks</h4>
                    <p className="text-sm text-gray-600">Consecutive correct = bonus points</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-700 mb-1">Use sounds</h4>
                  <p className="text-sm text-gray-600">Each color has a unique tone to help memory</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-pink-700 mb-1">Chunk patterns</h4>
                  <p className="text-sm text-gray-600">Group colors into smaller sequences</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-700 mb-1">Stay focused</h4>
                  <p className="text-sm text-gray-600">Watch without distractions for best recall</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-pink-700 mb-1">Practice daily</h4>
                  <p className="text-sm text-gray-600">Regular play improves working memory</p>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Color Memory: Training Visual Recall</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Color memory games challenge your brain to remember and reproduce sequences of colors, training a specific
                aspect of visual memory. This type of game builds on the classic Simon electronic game concept, helping
                players develop stronger visual processing, sequential memory, and pattern recognition skills through
                engaging, colorful gameplay.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                  <h3 className="font-semibold text-pink-800 mb-2">🎨 Color Recognition</h3>
                  <p className="text-sm text-gray-600">Quickly identify and distinguish between different colors under pressure.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">🔢 Sequential Memory</h3>
                  <p className="text-sm text-gray-600">Remember ordered sequences of items - a crucial cognitive skill.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">⚡ Working Memory</h3>
                  <p className="text-sm text-gray-600">Hold and manipulate color information in your short-term memory.</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">🎯 Attention to Detail</h3>
                  <p className="text-sm text-gray-600">Focus carefully on each color presentation to avoid errors.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Memory Capacity</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The average person can remember about 7 items in their working memory at once. Color memory games
                  help you discover and expand your personal limits. With regular practice, many players find they
                  can remember increasingly longer sequences, demonstrating the brain&apos;s remarkable ability to improve
                  through training.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Tips for Success</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Verbalize the colors as they appear to engage auditory memory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Create patterns or groups to remember longer sequences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Stay focused - distractions significantly impact performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>Practice regularly to build and maintain your color memory skills</span>
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
              {/* Ad Banner */}
              <AdBanner className="mx-auto" />

              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📊</span> Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Games Played</span>
                    <span className="font-bold text-gray-800">{stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-bold text-purple-600">{stats.bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Level</span>
                    <span className="font-bold text-blue-600">{stats.maxLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Streak</span>
                    <span className="font-bold text-orange-600">{stats.maxStreak}</span>
                  </div>
                </div>
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
                        <div className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">{game.title}</div>
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
