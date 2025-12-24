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
    question: 'How do I play Pattern Memory?',
    answer: 'Watch the pattern that lights up on the grid, then recreate it by clicking the same tiles. Each level adds more tiles to remember. You have limited lives, so be careful!',
    order: 1
  },
  {
    id: '2',
    question: 'What are the difficulty levels?',
    answer: 'Easy starts with a 3x3 grid, Medium uses a 4x4 grid, and Hard uses a 5x5 grid. Larger grids mean more possible patterns and greater challenge.',
    order: 2
  },
  {
    id: '3',
    question: 'How is the score calculated?',
    answer: 'You earn points based on the level reached and grid size. Completing patterns quickly gives time bonuses. Streak multipliers reward consecutive correct patterns.',
    order: 3
  },
  {
    id: '4',
    question: 'What happens if I click the wrong tile?',
    answer: 'You lose one life. You start with 3 lives. When all lives are lost, the game ends. Try to remember the pattern carefully before clicking!',
    order: 4
  },
  {
    id: '5',
    question: 'Does Pattern Memory help improve memory?',
    answer: 'Yes! Pattern Memory is excellent for training spatial memory, visual recall, and working memory. Regular practice can improve your ability to remember positions and patterns.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I replay the pattern if I forget?',
    answer: 'Currently, each pattern is shown once. Focus carefully during the display phase. Future updates may include a hint system for additional help.',
    order: 6
  }
];

interface PatternMemoryClientProps {
  relatedGames?: Array<{
    href: string;
    title: string;
    description: string;
    color: string;
    icon: string;
  }>;
}

interface Stats {
  gamesPlayed: number;
  bestScore: number;
  maxLevel: number;
  totalPatterns: number;
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

export default function PatternMemoryClient({ relatedGames = defaultRelatedGames }: PatternMemoryClientProps) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('pattern-memory');

  const webAppSchema = generateWebAppSchema(
    'Pattern Memory Game - Free Online Brain Training',
    'Play Pattern Memory online for free. Remember and recreate grid patterns to train your spatial memory. Multiple difficulty levels available.',
    'https://economictimes.indiatimes.com/us/tools/games/pattern-memory',
    'Game'
  );

  const [gridSize, setGridSize] = useState(3);
  const [pattern, setPattern] = useState<number[]>([]);
  const [playerPattern, setPlayerPattern] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [showingPattern, setShowingPattern] = useState(false);
  const [gamePhase, setGamePhase] = useState<'menu' | 'showing' | 'input' | 'result'>('menu');
  const [stats, setStats] = useState<Stats>({ gamesPlayed: 0, bestScore: 0, maxLevel: 1, totalPatterns: 0 });
  const [activeTiles, setActiveTiles] = useState<number[]>([]);
  const [wrongTile, setWrongTile] = useState<number | null>(null);
  const [correctTiles, setCorrectTiles] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState('medium');

  const gridSizes: Record<string, number> = {
    easy: 3,
    medium: 4,
    hard: 5
  };

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('patternMemoryStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const saveStats = useCallback((finalScore: number, finalLevel: number) => {
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      bestScore: Math.max(stats.bestScore, finalScore),
      maxLevel: Math.max(stats.maxLevel, finalLevel),
      totalPatterns: stats.totalPatterns + finalLevel - 1
    };
    setStats(newStats);
    localStorage.setItem('patternMemoryStats', JSON.stringify(newStats));
  }, [stats]);

  const generatePattern = useCallback((lvl: number, size: number) => {
    const tilesCount = Math.min(3 + Math.floor(lvl / 2), Math.floor((size * size) / 2));
    const totalTiles = size * size;
    const newPattern: number[] = [];

    while (newPattern.length < tilesCount) {
      const tile = Math.floor(Math.random() * totalTiles);
      if (!newPattern.includes(tile)) {
        newPattern.push(tile);
      }
    }

    return newPattern;
  }, []);

  const showPattern = useCallback(async (patternToShow: number[]) => {
    setShowingPattern(true);
    setGamePhase('showing');
    setActiveTiles([]);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Show all tiles at once
    setActiveTiles(patternToShow);

    // Display time based on pattern length
    const displayTime = 1000 + (patternToShow.length * 300);
    await new Promise(resolve => setTimeout(resolve, displayTime));

    setActiveTiles([]);
    setShowingPattern(false);
    setGamePhase('input');
  }, []);

  const startGame = useCallback(() => {
    const size = gridSizes[difficulty];
    setGridSize(size);
    setLevel(1);
    setScore(0);
    setLives(3);
    setStreak(0);
    setPlayerPattern([]);
    setCorrectTiles([]);
    setWrongTile(null);
    setGameActive(true);

    const newPattern = generatePattern(1, size);
    setPattern(newPattern);
    showPattern(newPattern);
  }, [difficulty, gridSizes, generatePattern, showPattern]);

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    setLevel(newLevel);
    setPlayerPattern([]);
    setCorrectTiles([]);
    setWrongTile(null);

    // Add bonus points for level completion
    const levelBonus = level * 10 * (gridSize - 2);
    const streakBonus = streak >= 3 ? streak * 5 : 0;
    setScore(prev => prev + levelBonus + streakBonus);

    const newPattern = generatePattern(newLevel, gridSize);
    setPattern(newPattern);

    setTimeout(() => {
      showPattern(newPattern);
    }, 1000);
  }, [level, gridSize, streak, generatePattern, showPattern]);

  const handleTileClick = useCallback((index: number) => {
    if (!gameActive || showingPattern || gamePhase !== 'input') return;
    if (playerPattern.includes(index) || correctTiles.includes(index)) return;

    const newPlayerPattern = [...playerPattern, index];
    setPlayerPattern(newPlayerPattern);

    if (pattern.includes(index)) {
      // Correct tile
      setCorrectTiles(prev => [...prev, index]);

      if (newPlayerPattern.length === pattern.length) {
        // Pattern complete
        setStreak(prev => prev + 1);
        setTimeout(() => nextLevel(), 800);
      }
    } else {
      // Wrong tile
      setWrongTile(index);
      setStreak(0);
      setLives(prev => prev - 1);

      setTimeout(() => {
        setWrongTile(null);
        if (lives <= 1) {
          // Game over
          setGameActive(false);
          setGamePhase('result');
          saveStats(score, level);
        } else {
          // Continue with same pattern
          setPlayerPattern([]);
          setCorrectTiles([]);
        }
      }, 500);
    }
  }, [gameActive, showingPattern, gamePhase, playerPattern, correctTiles, pattern, lives, score, level, nextLevel, saveStats]);

  const resetToMenu = useCallback(() => {
    setGameActive(false);
    setGamePhase('menu');
    setPattern([]);
    setPlayerPattern([]);
    setCorrectTiles([]);
    setActiveTiles([]);
    setWrongTile(null);
  }, []);

  const totalTiles = gridSize * gridSize;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🔲</span>
            <span className="text-indigo-600 font-semibold">Pattern Memory</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {getH1('Pattern Memory Game')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Remember the pattern and recreate it. Test your spatial memory!')}
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
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-blue-600">Level</div>
                    <div className="text-2xl font-bold text-blue-700">{level}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-green-600">Score</div>
                    <div className="text-2xl font-bold text-green-700">{score}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-red-600">Lives</div>
                    <div className="text-2xl font-bold text-red-700">{'❤️'.repeat(lives)}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-orange-600">Streak</div>
                    <div className="text-2xl font-bold text-orange-700">{streak}</div>
                  </div>
                </div>
              )}

              {/* Menu Screen */}
              {gamePhase === 'menu' && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Difficulty</h2>
                  <div className="flex justify-center gap-4 mb-8">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          difficulty === diff
                            ? 'bg-indigo-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                        <div className="text-xs opacity-75">{gridSizes[diff]}×{gridSizes[diff]}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={startGame}
                    className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-blue-600 transition-all shadow-lg"
                  >
                    Start Game
                  </button>
                </div>
              )}

              {/* Game Grid */}
              {(gamePhase === 'showing' || gamePhase === 'input') && (
                <div className="flex flex-col items-center">
                  <div className="text-center mb-4">
                    <div className={`text-lg font-semibold ${showingPattern ? 'text-indigo-600' : 'text-green-600'}`}>
                      {showingPattern ? 'Remember this pattern...' : 'Recreate the pattern!'}
                    </div>
                    {!showingPattern && (
                      <div className="text-sm text-gray-500">
                        {correctTiles.length}/{pattern.length} tiles found
                      </div>
                    )}
                  </div>

                  <div
                    className="grid gap-2 sm:gap-3 mb-6"
                    style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                  >
                    {Array.from({ length: totalTiles }).map((_, index) => {
                      const isActive = activeTiles.includes(index);
                      const isCorrect = correctTiles.includes(index);
                      const isWrong = wrongTile === index;

                      return (
                        <button
                          key={index}
                          onClick={() => handleTileClick(index)}
                          disabled={showingPattern}
                          className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl transition-all duration-200 transform ${
                            isActive
                              ? 'bg-indigo-500 scale-105 shadow-lg'
                              : isCorrect
                              ? 'bg-green-500 scale-105'
                              : isWrong
                              ? 'bg-red-500 animate-pulse'
                              : 'bg-gray-200 hover:bg-gray-300 hover:scale-105 cursor-pointer'
                          } ${showingPattern ? 'cursor-default' : ''}`}
                        />
                      );
                    })}
                  </div>

                  {!showingPattern && (
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
                  <div className="text-6xl mb-4">🧠</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>
                  <div className="space-y-3 max-w-sm mx-auto mb-6">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="text-sm text-indigo-600">Final Score</div>
                      <div className="text-3xl font-bold text-indigo-700">{score}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-600">Level Reached</div>
                        <div className="text-xl font-bold text-blue-700">{level}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-xs text-green-600">Patterns Solved</div>
                        <div className="text-xl font-bold text-green-700">{level - 1}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-blue-600"
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
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Watch the Pattern</h4>
                    <p className="text-sm text-gray-600">Tiles will light up briefly - memorize them!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Recreate It</h4>
                    <p className="text-sm text-gray-600">Click the same tiles you saw lit up</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Level Up</h4>
                    <p className="text-sm text-gray-600">Each level adds more tiles to remember</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Preserve Lives</h4>
                    <p className="text-sm text-gray-600">Wrong clicks cost lives - 3 lives total!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-indigo-700 mb-1">Scan systematically</h4>
                  <p className="text-sm text-gray-600">Look at the grid row by row to remember positions</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-700 mb-1">Use landmarks</h4>
                  <p className="text-sm text-gray-600">Remember tiles relative to corners and center</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-indigo-700 mb-1">Start with sure tiles</h4>
                  <p className="text-sm text-gray-600">Click tiles you definitely remember first</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-700 mb-1">Stay calm</h4>
                  <p className="text-sm text-gray-600">Rushing leads to mistakes - take your time</p>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Pattern Memory: Enhancing Cognitive Skills</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Pattern memory games test your ability to observe, remember, and reproduce visual patterns. This type of
                memory training engages both visual-spatial skills and working memory, making it an effective brain exercise.
                Pattern recognition is a fundamental cognitive ability used in everything from reading and mathematics to
                recognizing faces and navigating environments.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <h3 className="font-semibold text-indigo-800 mb-2">🔲 Spatial Awareness</h3>
                  <p className="text-sm text-gray-600">Understand and remember the relationship between positions in space.</p>
                </div>
                <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                  <h3 className="font-semibold text-violet-800 mb-2">👁️ Visual Encoding</h3>
                  <p className="text-sm text-gray-600">Quickly capture and store visual information in memory.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">🧩 Pattern Recognition</h3>
                  <p className="text-sm text-gray-600">Identify and remember structured arrangements of elements.</p>
                </div>
                <div className="bg-fuchsia-50 rounded-xl p-4 border border-fuchsia-100">
                  <h3 className="font-semibold text-fuchsia-800 mb-2">🎯 Attention Control</h3>
                  <p className="text-sm text-gray-600">Focus intensely during the observation period for best results.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Brain Training Benefits</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Research suggests that visual-spatial memory games can improve cognitive function in several areas.
                  Regular practice with pattern memory exercises has been associated with better performance on tasks
                  requiring spatial reasoning, improved attention span, and enhanced visual working memory capacity.
                  These skills transfer to real-world activities like reading maps, organizing spaces, and solving problems.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Memory Strategies</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Look for shapes or recognizable forms within the pattern</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-violet-500">•</span>
                    <span>Group adjacent highlighted cells into larger chunks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Use the grid edges as reference points for positions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-500">•</span>
                    <span>Take a mental &quot;snapshot&quot; rather than trying to remember each cell individually</span>
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
                    <span className="font-bold text-indigo-600">{stats.bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Level</span>
                    <span className="font-bold text-blue-600">{stats.maxLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Patterns Solved</span>
                    <span className="font-bold text-green-600">{stats.totalPatterns}</span>
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
                        <div className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{game.title}</div>
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
