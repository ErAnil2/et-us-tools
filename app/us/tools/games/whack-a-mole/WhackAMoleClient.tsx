'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface WhackAMoleClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Mole {
  id: number;
  isUp: boolean;
  isWhacked: boolean;
}

interface GameStats {
  gamesPlayed: number;
  highScore: number;
  totalMolesWhacked: number;
}

const fallbackFaqs = [
  {
    question: "How do I play Whack-a-Mole?",
    answer: "Click or tap on the moles when they pop up from their holes. Each mole you hit earns you points. Try to whack as many moles as possible before time runs out!",
    order: 0
  },
  {
    question: "How is the score calculated?",
    answer: "You earn 10 points for each mole you successfully whack. The game lasts for 30 seconds on Easy, 25 seconds on Medium, and 20 seconds on Hard difficulty.",
    order: 1
  },
  {
    question: "What are the different difficulty levels?",
    answer: "Easy mode has slower moles and longer game time. Medium has faster moles with moderate time. Hard mode features very fast moles and shorter time for maximum challenge.",
    order: 2
  },
  {
    question: "How can I improve my score?",
    answer: "Focus on the center of the grid, stay calm, and anticipate where moles might appear. Quick reactions and not over-clicking help you achieve higher scores.",
    order: 3
  }
];

export default function WhackAMoleClient({ relatedGames = defaultRelatedGames }: WhackAMoleClientProps) {
  const [gamePhase, setGamePhase] = useState<'menu' | 'play' | 'result'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [moles, setMoles] = useState<Mole[]>(
    Array.from({ length: 9 }, (_, i) => ({ id: i, isUp: false, isWhacked: false }))
  );
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    highScore: 0,
    totalMolesWhacked: 0
  });
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [molesWhackedThisGame, setMolesWhackedThisGame] = useState(0);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { getH1, getSubHeading } = usePageSEO('whack-a-mole');

  const difficultySettings = {
    easy: { duration: 30, moleUpTime: 1200, moleInterval: 800 },
    medium: { duration: 25, moleUpTime: 900, moleInterval: 600 },
    hard: { duration: 20, moleUpTime: 600, moleInterval: 400 }
  };

  // Load stats from localStorage
  const loadStats = useCallback(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('whackAMoleStats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats(parsed);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((currentScore: number, molesWhacked: number) => {
    if (typeof window === 'undefined') return;
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      highScore: Math.max(stats.highScore, currentScore),
      totalMolesWhacked: stats.totalMolesWhacked + molesWhacked
    };
    setStats(newStats);
    localStorage.setItem('whackAMoleStats', JSON.stringify(newStats));

    if (currentScore > stats.highScore) {
      setIsNewRecord(true);
    }
  }, [stats]);

  // Pop up a random mole
  const popUpMole = useCallback(() => {
    setMoles(prev => {
      const downMoles = prev.filter(m => !m.isUp);
      if (downMoles.length === 0) return prev;

      const randomMole = downMoles[Math.floor(Math.random() * downMoles.length)];
      const settings = difficultySettings[difficulty];

      // Auto hide mole after moleUpTime
      setTimeout(() => {
        setMoles(current =>
          current.map(m =>
            m.id === randomMole.id ? { ...m, isUp: false, isWhacked: false } : m
          )
        );
      }, settings.moleUpTime);

      return prev.map(m =>
        m.id === randomMole.id ? { ...m, isUp: true, isWhacked: false } : m
      );
    });
  }, [difficulty]);

  // Whack a mole
  const whackMole = useCallback((moleId: number) => {
    if (gamePhase !== 'play') return;

    setMoles(prev =>
      prev.map(m => {
        if (m.id === moleId && m.isUp && !m.isWhacked) {
          setScore(s => s + 10);
          setMolesWhackedThisGame(n => n + 1);
          return { ...m, isWhacked: true };
        }
        return m;
      })
    );
  }, [gamePhase]);

  // Start game
  const startGame = useCallback(() => {
    const settings = difficultySettings[difficulty];

    setScore(0);
    setTimeLeft(settings.duration);
    setMolesWhackedThisGame(0);
    setIsNewRecord(false);
    setMoles(Array.from({ length: 9 }, (_, i) => ({ id: i, isUp: false, isWhacked: false })));
    setGamePhase('play');

    // Start mole popping
    moleTimerRef.current = setInterval(() => {
      popUpMole();
    }, settings.moleInterval);

    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // Game over
          if (gameTimerRef.current) clearInterval(gameTimerRef.current);
          if (moleTimerRef.current) clearInterval(moleTimerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [difficulty, popUpMole]);

  // Handle game over
  useEffect(() => {
    if (timeLeft === 0 && gamePhase === 'play') {
      saveStats(score, molesWhackedThisGame);
      setGamePhase('result');
    }
  }, [timeLeft, gamePhase, score, molesWhackedThisGame, saveStats]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (moleTimerRef.current) clearInterval(moleTimerRef.current);
    };
  }, []);

  const avgScore = stats.gamesPlayed > 0 ? Math.round((stats.totalMolesWhacked * 10) / stats.gamesPlayed) : 0;

  const webAppSchema = generateWebAppSchema({
    name: 'Whack-a-Mole Game',
    description: 'Play the classic Whack-a-Mole game online!',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-200 to-orange-200 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">🔨</span>
            <span className="text-amber-700 font-semibold">Reflex Challenge</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3">{getH1('Whack-a-Mole')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your reflexes! Whack the moles as they pop up before they disappear.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Game Stats Bar */}
              <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{score}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{timeLeft}s</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.highScore}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Best</div>
                </div>
              </div>

              {/* Difficulty Selection (only in menu) */}
              {gamePhase === 'menu' && (
                <div className="mb-4 flex justify-center gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                        difficulty === d
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}

              {/* Game Grid */}
              <div className="relative bg-gradient-to-b from-green-600 to-green-800 rounded-xl p-6 overflow-hidden">
                {/* Grass texture overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_transparent_20%,_#000_20%,_#000_80%,_transparent_80%)] bg-[length:20px_20px]" />

                <div className="grid grid-cols-3 gap-4 relative z-10">
                  {moles.map((mole) => (
                    <div
                      key={mole.id}
                      onClick={() => whackMole(mole.id)}
                      className="aspect-square relative cursor-pointer"
                    >
                      {/* Hole */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[40%] bg-gradient-to-b from-amber-900 to-amber-950 rounded-[50%] shadow-inner" />

                      {/* Mole */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 w-[70%] transition-all duration-150 ${
                          mole.isUp
                            ? mole.isWhacked
                              ? 'bottom-[30%] scale-90 opacity-50'
                              : 'bottom-[20%]'
                            : 'bottom-[-50%]'
                        }`}
                      >
                        <div className={`w-full aspect-square rounded-full bg-gradient-to-b from-amber-600 to-amber-800 flex items-center justify-center text-4xl shadow-lg ${
                          mole.isWhacked ? 'animate-pulse' : ''
                        }`}>
                          {mole.isWhacked ? '😵' : '🐹'}
                        </div>
                      </div>

                      {/* Whack effect */}
                      {mole.isWhacked && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl animate-ping">
                          💥
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Menu Overlay */}
                {gamePhase === 'menu' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-20">
                    <div className="text-center text-white p-6">
                      <div className="text-6xl mb-4">🔨</div>
                      <h2 className="text-3xl font-bold mb-2">Whack-a-Mole</h2>
                      <p className="text-lg mb-6 opacity-90">Hit the moles before they hide!</p>
                      <button
                        onClick={startGame}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                      >
                        Start Game
                      </button>
                      <p className="mt-4 text-sm opacity-75">Difficulty: {difficulty}</p>
                    </div>
                  </div>
                )}

                {/* Result Overlay */}
                {gamePhase === 'result' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-20">
                    <div className="text-center text-white p-6">
                      <div className="text-5xl mb-3">{isNewRecord ? '🏆' : '🎉'}</div>
                      <h2 className="text-2xl font-bold mb-2">
                        {isNewRecord ? 'New High Score!' : 'Game Over!'}
                      </h2>
                      <div className="bg-white/20 rounded-xl p-4 mb-4">
                        <div className="text-4xl font-bold text-yellow-400">{score}</div>
                        <div className="text-sm opacity-80">Points ({molesWhackedThisGame} moles)</div>
                      </div>
                      {isNewRecord && (
                        <div className="text-yellow-400 font-semibold mb-3 animate-pulse">
                          You beat your previous best!
                        </div>
                      )}
                      <button
                        onClick={startGame}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                      >
                        Play Again
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Info */}
              <div className="mt-4 text-center text-gray-600 text-sm">
                <span className="font-medium">Controls:</span> Click or tap on the moles to whack them!
              </div>
            </div>

            {/* How to Play */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">How to Play</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">👀</div>
                  <h3 className="font-semibold text-gray-800">Watch for Moles</h3>
                  <p className="text-sm text-gray-600">Keep your eyes on all 9 holes</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🔨</div>
                  <h3 className="font-semibold text-gray-800">Whack Them</h3>
                  <p className="text-sm text-gray-600">Click quickly before they hide</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-semibold text-gray-800">Score Points</h3>
                  <p className="text-sm text-gray-600">Each mole = 10 points</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 text-xl">💡</span>
                  <p className="text-gray-600">Focus on the center of the grid - moles can pop up anywhere!</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl">🎯</span>
                  <p className="text-gray-600">Use peripheral vision to spot moles appearing in corners.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">⚡</span>
                  <p className="text-gray-600">Stay relaxed - tense muscles slow down your reaction time.</p>
                </div>
              </div>
            </div>

            {/* SEO Content Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Whack-a-Mole: The Classic Arcade Game</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Whack-a-Mole is a classic arcade game that has entertained players since its invention in 1975 by Aaron Fechter.
                Originally called &quot;Whac-A-Mole&quot; and manufactured by Bob&apos;s Space Racers, the game quickly became an arcade
                staple and carnival favorite. The simple yet addictive gameplay tests reflexes and hand-eye coordination as
                players attempt to hit moles that randomly pop up from holes before they disappear.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h3 className="font-semibold text-amber-800 mb-2">🎯 Reflex Training</h3>
                  <p className="text-sm text-gray-600">Whack-a-Mole is excellent for developing quick reflexes and reaction time, making it popular for both entertainment and cognitive training.</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h3 className="font-semibold text-orange-800 mb-2">👁️ Hand-Eye Coordination</h3>
                  <p className="text-sm text-gray-600">The game requires precise coordination between visual tracking and physical response, improving motor skills through practice.</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-2">⏱️ Time Management</h3>
                  <p className="text-sm text-gray-600">With limited time to score points, players learn to maximize efficiency and prioritize targets quickly.</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <h3 className="font-semibold text-yellow-800 mb-2">🧠 Peripheral Awareness</h3>
                  <p className="text-sm text-gray-600">Monitoring multiple holes simultaneously develops peripheral vision and spatial awareness skills.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Game History & Cultural Impact</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The original Whack-a-Mole arcade cabinet featured a padded mallet and mechanical moles that would pop up
                  randomly. The game became so popular that &quot;whack-a-mole&quot; has become a common English idiom describing
                  any situation where solving one problem causes another to appear. The game has been featured in countless
                  TV shows, movies, and has inspired numerous digital versions like this one.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Benefits of Playing</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span>Improves reaction time and reflexes through repeated practice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Provides quick stress relief and entertainment in short gaming sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Enhances focus and concentration under time pressure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    <span>Suitable for all ages with adjustable difficulty levels</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <FirebaseFAQs
                pageId="whack-a-mole-game"
                fallbackFaqs={fallbackFaqs}
              />
            </div>
          </div>
{/* Sidebar */}
          <div className="lg:w-[320px] space-y-6">
            {/* Ad Banner */}
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<AdBanner className="w-full" />

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span> Your Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                  <span className="text-gray-600">High Score</span>
                  <span className="font-bold text-amber-600">{stats.highScore}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-bold text-orange-600">{stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                  <span className="text-gray-600">Total Moles</span>
                  <span className="font-bold text-red-600">{stats.totalMolesWhacked}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-bold text-purple-600">{avgScore}</span>
                </div>
              </div>
            </div>

            {/* Difficulty Info */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>⚙️</span> Difficulty Levels
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-xl">
                  <div className="font-semibold text-green-700">Easy</div>
                  <div className="text-xs text-gray-500">30 seconds, slower moles</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <div className="font-semibold text-yellow-700">Medium</div>
                  <div className="text-xs text-gray-500">25 seconds, moderate speed</div>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <div className="font-semibold text-red-700">Hard</div>
                  <div className="text-xs text-gray-500">20 seconds, fast moles</div>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
{/* Related Games */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎮</span> Related Games
              </h3>
              <div className="space-y-3">
                {relatedGames.map((game, index) => (
                  <Link
                    key={index}
                    href={game.href}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                      {game.icon === 'game' ? '🎮' : game.icon === 'puzzle' ? '🧩' : '🎯'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{game.title}</div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
