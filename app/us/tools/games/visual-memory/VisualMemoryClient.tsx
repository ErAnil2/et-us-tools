'use client';

import { useState, useEffect, useCallback } from 'react';
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
    question: 'How do I play Visual Memory?',
    answer: 'Watch as tiles flash on the grid one by one, then click them in the same order they appeared. Each level increases the number of tiles to remember.',
    order: 1
  },
  {
    id: '2',
    question: 'What makes this different from Pattern Memory?',
    answer: 'In Visual Memory, tiles flash one at a time and you must click them in the correct sequence order. Pattern Memory shows all tiles at once and order does not matter.',
    order: 2
  },
  {
    id: '3',
    question: 'How is the score calculated?',
    answer: 'You earn points for each correct tile clicked and bonus points for completing levels. Longer sequences and higher difficulty levels give more points.',
    order: 3
  },
  {
    id: '4',
    question: 'What happens if I click the wrong tile?',
    answer: 'Clicking the wrong tile or clicking in the wrong order ends the game. Your score is saved and you can try again to beat your high score.',
    order: 4
  },
  {
    id: '5',
    question: 'What are the difficulty options?',
    answer: 'You can choose grid sizes from 3x3 (Easy) to 5x5 (Hard) and adjust the flash speed from Slow to Fast. Larger grids and faster speeds are more challenging.',
    order: 5
  },
  {
    id: '6',
    question: 'Is Visual Memory good for brain training?',
    answer: 'Yes! Visual Memory specifically trains sequential memory and spatial recall. It improves your ability to remember ordered information and spatial positions.',
    order: 6
  }
];

interface VisualMemoryClientProps {
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
  bestScore: number;
  maxLevel: number;
  longestSequence: number;
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

export default function VisualMemoryClient({ relatedGames = defaultRelatedGames }: VisualMemoryClientProps) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('visual-memory');

  const webAppSchema = generateWebAppSchema(
    'Visual Memory Game - Free Online Brain Training',
    'Play Visual Memory online for free. Remember tile sequences and train your spatial memory. Multiple difficulty levels and speed settings.',
    'https://economictimes.indiatimes.com/us/tools/games/visual-memory',
    'Game'
  );

  const [gridSize, setGridSize] = useState(3);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showingSequence, setShowingSequence] = useState(false);
  const [gamePhase, setGamePhase] = useState<'menu' | 'showing' | 'input' | 'result'>('menu');
  const [stats, setStats] = useState<Stats>({ gamesPlayed: 0, bestScore: 0, maxLevel: 1, longestSequence: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [flashSpeed, setFlashSpeed] = useState(500);
  const [difficulty, setDifficulty] = useState('medium');
  const [clickedTiles, setClickedTiles] = useState<number[]>([]);
  const [wrongTile, setWrongTile] = useState<number | null>(null);

  const gridSizes: Record<string, number> = {
    easy: 3,
    medium: 4,
    hard: 5
  };

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('visualMemoryStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const saveStats = useCallback((finalScore: number, finalLevel: number, sequenceLength: number) => {
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      bestScore: Math.max(stats.bestScore, finalScore),
      maxLevel: Math.max(stats.maxLevel, finalLevel),
      longestSequence: Math.max(stats.longestSequence, sequenceLength)
    };
    setStats(newStats);
    localStorage.setItem('visualMemoryStats', JSON.stringify(newStats));
  }, [stats]);

  const generateSequence = useCallback((length: number, size: number) => {
    const totalTiles = size * size;
    const newSequence: number[] = [];

    while (newSequence.length < length) {
      const tile = Math.floor(Math.random() * totalTiles);
      // Allow same tile to appear again in sequence for variety
      newSequence.push(tile);
    }

    return newSequence;
  }, []);

  const showSequence = useCallback(async (seq: number[]) => {
    setShowingSequence(true);
    setGamePhase('showing');
    setActiveIndex(null);
    setClickedTiles([]);

    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < seq.length; i++) {
      setActiveIndex(seq[i]);
      await new Promise(resolve => setTimeout(resolve, flashSpeed));
      setActiveIndex(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setShowingSequence(false);
    setGamePhase('input');
  }, [flashSpeed]);

  const startGame = useCallback(() => {
    const size = gridSizes[difficulty];
    setGridSize(size);
    setLevel(1);
    setScore(0);
    setPlayerIndex(0);
    setClickedTiles([]);
    setWrongTile(null);
    setGameActive(true);

    // Start with 3 tiles in sequence
    const newSequence = generateSequence(3, size);
    setSequence(newSequence);
    showSequence(newSequence);
  }, [difficulty, gridSizes, generateSequence, showSequence]);

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    setLevel(newLevel);
    setPlayerIndex(0);
    setClickedTiles([]);
    setWrongTile(null);

    // Add points for completing level
    const levelBonus = level * 20 + sequence.length * 10;
    setScore(prev => prev + levelBonus);

    // Add one more tile to sequence each level
    const newSequence = generateSequence(3 + newLevel - 1, gridSize);
    setSequence(newSequence);

    setTimeout(() => {
      showSequence(newSequence);
    }, 1000);
  }, [level, sequence.length, gridSize, generateSequence, showSequence]);

  const handleTileClick = useCallback((index: number) => {
    if (!gameActive || showingSequence || gamePhase !== 'input') return;

    const expectedTile = sequence[playerIndex];

    if (index === expectedTile) {
      // Correct!
      setClickedTiles(prev => [...prev, index]);
      setScore(prev => prev + 10);
      const newPlayerIndex = playerIndex + 1;
      setPlayerIndex(newPlayerIndex);

      // Flash the tile green briefly
      setActiveIndex(index);
      setTimeout(() => setActiveIndex(null), 150);

      if (newPlayerIndex === sequence.length) {
        // Sequence complete!
        setTimeout(() => nextLevel(), 500);
      }
    } else {
      // Wrong!
      setWrongTile(index);
      setGameActive(false);

      setTimeout(() => {
        setGamePhase('result');
        saveStats(score, level, sequence.length);
      }, 800);
    }
  }, [gameActive, showingSequence, gamePhase, sequence, playerIndex, score, level, nextLevel, saveStats]);

  const resetToMenu = useCallback(() => {
    setGameActive(false);
    setGamePhase('menu');
    setSequence([]);
    setClickedTiles([]);
    setActiveIndex(null);
    setWrongTile(null);
    setPlayerIndex(0);
  }, []);

  const totalTiles = gridSize * gridSize;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-teal-50">
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">👁️</span>
            <span className="text-cyan-600 font-semibold">Visual Memory</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
            {getH1('Visual Memory Game')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Watch the sequence, then click tiles in the same order. Test your sequential memory!')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Game Status */}
              {gameActive && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-blue-600">Level</div>
                    <div className="text-2xl font-bold text-blue-700">{level}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-green-600">Score</div>
                    <div className="text-2xl font-bold text-green-700">{score}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-purple-600">Sequence</div>
                    <div className="text-2xl font-bold text-purple-700">{clickedTiles.length}/{sequence.length}</div>
                  </div>
                </div>
              )}

              {/* Menu Screen */}
              {gamePhase === 'menu' && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Settings</h2>

                  <div className="max-w-md mx-auto space-y-6 mb-8">
                    {/* Grid Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grid Size</label>
                      <div className="flex justify-center gap-3">
                        {(['easy', 'medium', 'hard'] as const).map((diff) => (
                          <button
                            key={diff}
                            onClick={() => setDifficulty(diff)}
                            className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                              difficulty === diff
                                ? 'bg-cyan-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {diff.charAt(0).toUpperCase() + diff.slice(1)}
                            <div className="text-xs opacity-75">{gridSizes[diff]}×{gridSizes[diff]}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speed */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Flash Speed</label>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setFlashSpeed(700)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            flashSpeed === 700 ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Slow
                        </button>
                        <button
                          onClick={() => setFlashSpeed(500)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            flashSpeed === 500 ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Normal
                        </button>
                        <button
                          onClick={() => setFlashSpeed(300)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            flashSpeed === 300 ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Fast
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={startGame}
                    className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg"
                  >
                    Start Game
                  </button>
                </div>
              )}

              {/* Game Grid */}
              {(gamePhase === 'showing' || gamePhase === 'input') && (
                <div className="flex flex-col items-center">
                  <div className="text-center mb-4">
                    <div className={`text-lg font-semibold ${showingSequence ? 'text-cyan-600' : 'text-green-600'}`}>
                      {showingSequence ? 'Watch the sequence...' : 'Click the tiles in order!'}
                    </div>
                  </div>

                  <div
                    className="grid gap-2 sm:gap-3 mb-6"
                    style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                  >
                    {Array.from({ length: totalTiles }).map((_, index) => {
                      const isActive = activeIndex === index;
                      const isClicked = clickedTiles.includes(index);
                      const isWrong = wrongTile === index;

                      return (
                        <button
                          key={index}
                          onClick={() => handleTileClick(index)}
                          disabled={showingSequence}
                          className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl transition-all duration-150 transform ${
                            isWrong
                              ? 'bg-red-500 scale-110 animate-pulse'
                              : isActive
                              ? 'bg-cyan-500 scale-110 shadow-lg ring-4 ring-cyan-200'
                              : isClicked
                              ? 'bg-green-400 scale-100'
                              : 'bg-gray-200 hover:bg-gray-300 hover:scale-105 cursor-pointer'
                          } ${showingSequence ? 'cursor-default' : ''}`}
                        >
                          {isClicked && !isWrong && (
                            <span className="text-white font-bold text-lg">
                              {clickedTiles.indexOf(index) + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!showingSequence && !wrongTile && (
                    <button
                      onClick={resetToMenu}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                    >
                      Quit Game
                    </button>
                  )}
                </div>
              )}

              {/* Result Screen */}
              {gamePhase === 'result' && (
                <div className="text-center">
                  <div className="text-6xl mb-4">👁️</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
                  <div className="space-y-3 max-w-sm mx-auto mb-6">
                    <div className="bg-cyan-50 rounded-lg p-4">
                      <div className="text-sm text-cyan-600">Final Score</div>
                      <div className="text-3xl font-bold text-cyan-700">{score}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-600">Level Reached</div>
                        <div className="text-xl font-bold text-blue-700">{level}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-xs text-purple-600">Longest Sequence</div>
                        <div className="text-xl font-bold text-purple-700">{sequence.length}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-teal-600"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={resetToMenu}
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
                    >
                      Main Menu
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Watch Carefully</h4>
                    <p className="text-sm text-gray-600">Tiles will flash one at a time in a sequence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Remember the Order</h4>
                    <p className="text-sm text-gray-600">The sequence order matters - memorize it!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Repeat in Order</h4>
                    <p className="text-sm text-gray-600">Click tiles in the exact order they appeared</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Level Up</h4>
                    <p className="text-sm text-gray-600">Each level adds one more tile to remember</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-cyan-700 mb-1">Create a story</h4>
                  <p className="text-sm text-gray-600">Link tile positions in a narrative to remember order</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-teal-700 mb-1">Use finger tracking</h4>
                  <p className="text-sm text-gray-600">Point at tiles as they flash to reinforce memory</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-cyan-700 mb-1">Say positions aloud</h4>
                  <p className="text-sm text-gray-600">Verbalize positions like &quot;top-left, center, bottom&quot;</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-teal-700 mb-1">Start slow</h4>
                  <p className="text-sm text-gray-600">Begin with slow speed and increase as you improve</p>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Visual Memory: Training Your Mind&apos;s Eye</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Visual memory is the ability to remember and recall visual information such as colors, shapes, and spatial
                locations. This cognitive skill is fundamental to many everyday tasks, from navigating familiar places to
                recognizing faces and reading. Visual memory games challenge you to remember increasingly complex patterns,
                providing an effective workout for this crucial cognitive function.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
                  <h3 className="font-semibold text-cyan-800 mb-2">🧠 Spatial Memory</h3>
                  <p className="text-sm text-gray-600">Remember the positions of objects in space - essential for navigation and organization.</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                  <h3 className="font-semibold text-teal-800 mb-2">👁️ Pattern Recognition</h3>
                  <p className="text-sm text-gray-600">Quickly identify and remember visual patterns, improving attention to detail.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">⚡ Processing Speed</h3>
                  <p className="text-sm text-gray-600">Train your brain to encode visual information faster and more accurately.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">🎯 Working Memory</h3>
                  <p className="text-sm text-gray-600">Hold and manipulate visual information in your mind - a key cognitive skill.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-100 to-teal-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Applications in Daily Life</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Strong visual memory benefits many aspects of life. Students use it to remember diagrams and maps.
                  Professionals rely on it for data visualization and presentations. Artists and designers need it for
                  creative work. Even everyday tasks like finding your car in a parking lot or remembering where you
                  put your keys depend on visual memory. Regular training with games like this can improve performance
                  across all these areas.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Training Strategies</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">•</span>
                    <span>Focus on the pattern as a whole, not individual elements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500">•</span>
                    <span>Create mental landmarks - anchor points to remember positions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Use chunking - group nearby cells into memorable clusters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Practice regularly to build visual memory capacity</span>
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
                    <span className="font-bold text-cyan-600">{stats.bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Level</span>
                    <span className="font-bold text-blue-600">{stats.maxLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Longest Sequence</span>
                    <span className="font-bold text-purple-600">{stats.longestSequence}</span>
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
                        <div className="font-semibold text-gray-800 group-hover:text-cyan-600 transition-colors">{game.title}</div>
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
