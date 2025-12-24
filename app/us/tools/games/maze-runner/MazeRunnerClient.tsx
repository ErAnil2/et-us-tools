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

interface MazeRunnerClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Player {
  x: number;
  y: number;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

interface GameStats {
  mazesCompleted: number;
  totalCoins: number;
  bestTime: number;
  bestMoves: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I play Maze Runner?",
    answer: "Use the arrow keys or WASD to navigate through the maze. Find the green exit while collecting coins along the way. Try to complete the maze in the fewest moves and shortest time!",
    order: 1
  },
  {
    id: '2',
    question: "How is the score calculated?",
    answer: "Your score is based on three factors: completing the maze (base score), time bonus (faster = more points), and coins collected (50 points each). Fewer moves also contribute to a better score.",
    order: 2
  },
  {
    id: '3',
    question: "What are the different difficulty levels?",
    answer: "Easy creates a 15x15 maze, Medium is 21x21, Hard is 25x25, and Expert is 31x31. Larger mazes are more complex and take longer to solve.",
    order: 3
  },
  {
    id: '4',
    question: "How are the mazes generated?",
    answer: "Each maze is procedurally generated using a recursive backtracking algorithm, ensuring every maze is solvable and unique. No two games are the same!",
    order: 4
  }
];

export default function MazeRunnerClient({ relatedGames = defaultRelatedGames }: MazeRunnerClientProps) {
  const [gamePhase, setGamePhase] = useState<'menu' | 'play' | 'result'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [moves, setMoves] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [collectedCoins, setCollectedCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    mazesCompleted: 0,
    totalCoins: 0,
    bestTime: 0,
    bestMoves: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mazeRef = useRef<number[][]>([]);
  const playerRef = useRef<Player>({ x: 1, y: 1 });
  const exitRef = useRef<Player>({ x: 0, y: 0 });
  const coinsRef = useRef<Coin[]>([]);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { getH1, getSubHeading } = usePageSEO('maze-runner');

  const difficultySettings = {
    easy: { size: 15, coinCount: 5 },
    medium: { size: 21, coinCount: 7 },
    hard: { size: 25, coinCount: 10 },
    expert: { size: 31, coinCount: 12 }
  };

  // Load stats from localStorage
  const loadStats = useCallback(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('mazeRunnerStats');
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
  const saveStats = useCallback((time: number, moveCount: number, coins: number) => {
    if (typeof window === 'undefined') return;
    const newStats = {
      mazesCompleted: stats.mazesCompleted + 1,
      totalCoins: stats.totalCoins + coins,
      bestTime: stats.bestTime === 0 ? time : Math.min(stats.bestTime, time),
      bestMoves: stats.bestMoves === 0 ? moveCount : Math.min(stats.bestMoves, moveCount)
    };
    setStats(newStats);
    localStorage.setItem('mazeRunnerStats', JSON.stringify(newStats));
  }, [stats]);

  // Carve maze using recursive backtracking
  const carveMaze = useCallback((maze: number[][], x: number, y: number, size: number) => {
    maze[y][x] = 0;

    const directions = [
      [0, -2],
      [2, 0],
      [0, 2],
      [-2, 0]
    ];

    // Shuffle directions
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (newX > 0 && newX < size - 1 && newY > 0 && newY < size - 1 && maze[newY][newX] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carveMaze(maze, newX, newY, size);
      }
    }
  }, []);

  // Generate coins
  const generateCoins = useCallback((maze: number[][], size: number, count: number): Coin[] => {
    const coins: Coin[] = [];

    for (let i = 0; i < count; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
        attempts++;
      } while (
        attempts < 100 &&
        (maze[y][x] === 1 ||
          (x === 1 && y === 1) ||
          (x === size - 2 && y === size - 2) ||
          coins.some(c => c.x === x && c.y === y))
      );

      if (attempts < 100) {
        coins.push({ x, y, collected: false });
      }
    }

    return coins;
  }, []);

  // Generate maze
  const generateMaze = useCallback(() => {
    const settings = difficultySettings[difficulty];
    const size = settings.size;

    // Initialize maze with walls
    const maze = Array(size).fill(null).map(() => Array(size).fill(1));

    // Carve passages
    carveMaze(maze, 1, 1, size);

    // Set player and exit
    playerRef.current = { x: 1, y: 1 };
    exitRef.current = { x: size - 2, y: size - 2 };
    maze[size - 2][size - 2] = 0;

    // Generate coins
    const coins = generateCoins(maze, size, settings.coinCount);
    coinsRef.current = coins;
    setTotalCoins(coins.length);

    mazeRef.current = maze;
  }, [difficulty, carveMaze, generateCoins]);

  // Draw maze
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maze = mazeRef.current;
    if (maze.length === 0) return;

    const size = maze.length;
    const cellSize = Math.floor(canvas.width / size);

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const drawX = x * cellSize;
        const drawY = y * cellSize;

        if (maze[y][x] === 1) {
          // Wall
          const gradient = ctx.createLinearGradient(drawX, drawY, drawX + cellSize, drawY + cellSize);
          gradient.addColorStop(0, '#475569');
          gradient.addColorStop(1, '#334155');
          ctx.fillStyle = gradient;
          ctx.fillRect(drawX, drawY, cellSize, cellSize);
        } else {
          // Passage
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(drawX, drawY, cellSize, cellSize);
        }
      }
    }

    // Draw coins
    ctx.fillStyle = '#fbbf24';
    for (const coin of coinsRef.current) {
      if (!coin.collected) {
        const x = coin.x * cellSize + cellSize / 2;
        const y = coin.y * cellSize + cellSize / 2;
        const radius = cellSize / 4;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Coin shimmer
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(x - radius / 4, y - radius / 4, radius / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
      }
    }

    // Draw exit
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(
      exitRef.current.x * cellSize + 2,
      exitRef.current.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );

    // Draw exit icon
    ctx.fillStyle = '#166534';
    ctx.font = `${cellSize * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚪', exitRef.current.x * cellSize + cellSize / 2, exitRef.current.y * cellSize + cellSize / 2);

    // Draw player
    ctx.fillStyle = '#ef4444';
    const playerX = playerRef.current.x * cellSize + cellSize / 2;
    const playerY = playerRef.current.y * cellSize + cellSize / 2;
    const playerRadius = cellSize / 3;

    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2);
    ctx.fill();

    // Player face
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(playerX, playerY - playerRadius / 4, playerRadius / 2, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Move player
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gamePhase !== 'play') return;

    const maze = mazeRef.current;
    const newX = playerRef.current.x + dx;
    const newY = playerRef.current.y + dy;

    // Check boundaries and walls
    if (newX < 0 || newX >= maze.length || newY < 0 || newY >= maze.length || maze[newY][newX] === 1) {
      return;
    }

    playerRef.current = { x: newX, y: newY };
    setMoves(m => m + 1);

    // Check coin collection
    for (const coin of coinsRef.current) {
      if (!coin.collected && coin.x === newX && coin.y === newY) {
        coin.collected = true;
        setCollectedCoins(c => c + 1);
      }
    }

    // Check exit
    if (newX === exitRef.current.x && newY === exitRef.current.y) {
      // Game complete!
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      saveStats(gameTime, moves + 1, collectedCoins);
      setGamePhase('result');
    }

    draw();
  }, [gamePhase, draw, saveStats, gameTime, moves, collectedCoins]);

  // Start game
  const startGame = useCallback(() => {
    generateMaze();
    setMoves(0);
    setGameTime(0);
    setCollectedCoins(0);
    setGamePhase('play');

    // Start timer
    gameTimerRef.current = setInterval(() => {
      setGameTime(t => t + 1);
    }, 1000);

    setTimeout(() => draw(), 50);
  }, [generateMaze, draw]);

  // Reset to menu
  const resetToMenu = useCallback(() => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    setGamePhase('menu');
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gamePhase !== 'play') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase, movePlayer]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const webAppSchema = generateWebAppSchema({
    name: 'Maze Runner Game',
    description: 'Navigate through challenging mazes!',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-200 to-indigo-200 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">🏃</span>
            <span className="text-purple-700 font-semibold">Puzzle Adventure</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent mb-3">{getH1('Maze Runner')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigate through procedurally generated mazes, collect coins, and find the exit!
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
              <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{moves}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Moves</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{formatTime(gameTime)}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{collectedCoins}/{totalCoins}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Coins</div>
                </div>
              </div>

              {/* Difficulty Selection (only in menu) */}
              {gamePhase === 'menu' && (
                <div className="mb-4 flex flex-wrap justify-center gap-2">
                  {(['easy', 'medium', 'hard', 'expert'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                        difficulty === d
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d} ({difficultySettings[d].size}x{difficultySettings[d].size})
                    </button>
                  ))}
                </div>
              )}

              {/* Canvas Container */}
              <div className="relative bg-slate-800 rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="block mx-auto"
                />

                {/* Menu Overlay */}
                {gamePhase === 'menu' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <div className="text-6xl mb-4">🏃</div>
                      <h2 className="text-3xl font-bold mb-2">Maze Runner</h2>
                      <p className="text-lg mb-6 opacity-90">Find your way through the maze!</p>
                      <button
                        onClick={startGame}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl text-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                      >
                        Start Game
                      </button>
                      <p className="mt-4 text-sm opacity-75">Use Arrow Keys or WASD</p>
                    </div>
                  </div>
                )}

                {/* Result Overlay */}
                {gamePhase === 'result' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <div className="text-5xl mb-3">🎉</div>
                      <h2 className="text-2xl font-bold mb-2">Maze Complete!</h2>
                      <div className="bg-white/20 rounded-xl p-4 mb-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-bold text-green-400">{formatTime(gameTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Moves:</span>
                          <span className="font-bold text-blue-400">{moves}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coins:</span>
                          <span className="font-bold text-yellow-400">{collectedCoins}/{totalCoins}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={startGame}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                        >
                          New Maze
                        </button>
                        <button
                          onClick={resetToMenu}
                          className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all"
                        >
                          Menu
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Info */}
              <div className="mt-4 text-center text-gray-600 text-sm">
                <span className="font-medium">Controls:</span> Arrow Keys or WASD to move
              </div>

              {/* Mobile Controls */}
              {gamePhase === 'play' && (
                <div className="mt-4 grid grid-cols-3 gap-2 max-w-[200px] mx-auto lg:hidden">
                  <div></div>
                  <button
                    onClick={() => movePlayer(0, -1)}
                    className="p-4 bg-purple-100 rounded-xl text-2xl active:bg-purple-200"
                  >
                    ⬆️
                  </button>
                  <div></div>
                  <button
                    onClick={() => movePlayer(-1, 0)}
                    className="p-4 bg-purple-100 rounded-xl text-2xl active:bg-purple-200"
                  >
                    ⬅️
                  </button>
                  <button
                    onClick={() => movePlayer(0, 1)}
                    className="p-4 bg-purple-100 rounded-xl text-2xl active:bg-purple-200"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={() => movePlayer(1, 0)}
                    className="p-4 bg-purple-100 rounded-xl text-2xl active:bg-purple-200"
                  >
                    ➡️
                  </button>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">How to Play</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🎮</div>
                  <h3 className="font-semibold text-gray-800">Navigate</h3>
                  <p className="text-sm text-gray-600">Use arrow keys or WASD to move</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🪙</div>
                  <h3 className="font-semibold text-gray-800">Collect Coins</h3>
                  <p className="text-sm text-gray-600">Gather coins for bonus points</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🚪</div>
                  <h3 className="font-semibold text-gray-800">Find Exit</h3>
                  <p className="text-sm text-gray-600">Reach the green exit to win</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-purple-500 text-xl">💡</span>
                  <p className="text-gray-600">Use the right-hand rule: keep your right hand on the wall and follow it.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl">🎯</span>
                  <p className="text-gray-600">The exit is always in the bottom-right area of the maze.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">⚡</span>
                  <p className="text-gray-600">Collect coins near your path, but don't detour too much!</p>
                </div>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <FirebaseFAQs
                pageId="maze-runner-game"
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
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-gray-600">Mazes Completed</span>
                  <span className="font-bold text-purple-600">{stats.mazesCompleted}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                  <span className="text-gray-600">Total Coins</span>
                  <span className="font-bold text-yellow-600">{stats.totalCoins}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <span className="text-gray-600">Best Time</span>
                  <span className="font-bold text-green-600">
                    {stats.bestTime > 0 ? formatTime(stats.bestTime) : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-gray-600">Best Moves</span>
                  <span className="font-bold text-blue-600">
                    {stats.bestMoves > 0 ? stats.bestMoves : '--'}
                  </span>
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
                  <div className="font-semibold text-green-700">Easy (15x15)</div>
                  <div className="text-xs text-gray-500">Small maze, 5 coins</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <div className="font-semibold text-yellow-700">Medium (21x21)</div>
                  <div className="text-xs text-gray-500">Standard maze, 7 coins</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <div className="font-semibold text-orange-700">Hard (25x25)</div>
                  <div className="text-xs text-gray-500">Large maze, 10 coins</div>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <div className="font-semibold text-red-700">Expert (31x31)</div>
                  <div className="text-xs text-gray-500">Massive maze, 12 coins</div>
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
