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

interface SnakeGameClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Position {
  x: number;
  y: number;
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GameMode = 'classic' | 'wrap';
type GamePhase = 'menu' | 'play' | 'result';

interface GameStats {
  gamesPlayed: number;
  bestScore: number;
  totalFood: number;
  longestSnake: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I control the snake?",
    answer: "Use arrow keys on desktop or swipe gestures on mobile. The snake moves continuously in the direction you choose. You cannot reverse direction directly - you must turn left or right.",
    order: 1
  },
  {
    id: '2',
    question: "What happens when the snake eats food?",
    answer: "Each time the snake eats food (the red square), it grows longer and your score increases by 10 points. A new food item appears randomly on the board.",
    order: 2
  },
  {
    id: '3',
    question: "How does the game end?",
    answer: "The game ends when the snake hits a wall (in classic mode) or collides with its own body. In wrap-around mode, going through walls is allowed - you will appear on the opposite side.",
    order: 3
  },
  {
    id: '4',
    question: "What are the different difficulty levels?",
    answer: "Easy has slow speed, Medium is normal, Hard is fast, and Expert is lightning fast. Higher difficulty means the snake moves faster, requiring quicker reflexes.",
    order: 4
  }
];

export default function SnakeGameClient({ relatedGames = defaultRelatedGames }: SnakeGameClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<{ dx: number; dy: number }>({ dx: 1, dy: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    bestScore: 0,
    totalFood: 0,
    longestSnake: 0
  });

  const gridSize = 20;
  const tileCount = 20;
  const canvasSize = 400;

  const { getH1, getSubHeading } = usePageSEO('snake-game');

  const speeds: Record<Difficulty, number> = {
    easy: 150,
    medium: 100,
    hard: 70,
    expert: 50
  };

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snakeGameStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('snakeGameStats', JSON.stringify(newStats));
  }, []);

  // Generate food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [tileCount]);

  // Draw game
  const draw = useCallback((currentSnake: Position[], currentFood: Position) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvasSize, i * gridSize);
      ctx.stroke();
    }

    // Draw snake
    currentSnake.forEach((segment, index) => {
      const gradient = ctx.createRadialGradient(
        segment.x * gridSize + gridSize / 2,
        segment.y * gridSize + gridSize / 2,
        0,
        segment.x * gridSize + gridSize / 2,
        segment.y * gridSize + gridSize / 2,
        gridSize / 2
      );

      if (index === 0) {
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(1, '#22c55e');
      } else {
        gradient.addColorStop(0, '#22c55e');
        gradient.addColorStop(1, '#16a34a');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(
        segment.x * gridSize + 1,
        segment.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2,
        4
      );
      ctx.fill();

      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = '#fff';
        const eyeSize = 3;
        const eyeOffset = 5;
        ctx.beginPath();
        ctx.arc(segment.x * gridSize + eyeOffset, segment.y * gridSize + eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.arc(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw food
    const foodGradient = ctx.createRadialGradient(
      currentFood.x * gridSize + gridSize / 2,
      currentFood.y * gridSize + gridSize / 2,
      0,
      currentFood.x * gridSize + gridSize / 2,
      currentFood.y * gridSize + gridSize / 2,
      gridSize / 2
    );
    foodGradient.addColorStop(0, '#f87171');
    foodGradient.addColorStop(1, '#ef4444');
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      currentFood.x * gridSize + gridSize / 2,
      currentFood.y * gridSize + gridSize / 2,
      gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [gridSize, tileCount, canvasSize]);

  // Game over
  const gameOver = useCallback((finalSnake: Position[], finalScore: number) => {
    setGameRunning(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    const newStats: GameStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      bestScore: Math.max(stats.bestScore, finalScore),
      totalFood: stats.totalFood + finalScore / 10,
      longestSnake: Math.max(stats.longestSnake, finalSnake.length)
    };
    saveStats(newStats);
    setGamePhase('result');
  }, [stats, saveStats]);

  // Update game state
  const update = useCallback(() => {
    setSnake(prevSnake => {
      const head = {
        x: prevSnake[0].x + direction.dx,
        y: prevSnake[0].y + direction.dy
      };

      // Handle wrap mode
      if (gameMode === 'wrap') {
        head.x = head.x < 0 ? tileCount - 1 : head.x >= tileCount ? 0 : head.x;
        head.y = head.y < 0 ? tileCount - 1 : head.y >= tileCount ? 0 : head.y;
      }

      // Check wall collision (classic mode)
      if (gameMode === 'classic') {
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
          gameOver(prevSnake, score);
          return prevSnake;
        }
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver(prevSnake, score);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      draw(newSnake, food);
      return newSnake;
    });
  }, [direction, gameMode, tileCount, food, score, draw, generateFood, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gamePaused) return;

    gameLoopRef.current = setInterval(update, speeds[difficulty]);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameRunning, gamePaused, difficulty, update]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setGamePaused(prev => !prev);
        return;
      }

      if (gamePaused) return;

      setDirection(prev => {
        switch (e.code) {
          case 'ArrowUp':
          case 'KeyW':
            return prev.dy === 0 ? { dx: 0, dy: -1 } : prev;
          case 'ArrowDown':
          case 'KeyS':
            return prev.dy === 0 ? { dx: 0, dy: 1 } : prev;
          case 'ArrowLeft':
          case 'KeyA':
            return prev.dx === 0 ? { dx: -1, dy: 0 } : prev;
          case 'ArrowRight':
          case 'KeyD':
            return prev.dx === 0 ? { dx: 1, dy: 0 } : prev;
          default:
            return prev;
        }
      });
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, gamePaused]);

  // Start game with countdown
  const startGame = () => {
    const initialSnake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    setSnake(initialSnake);
    setDirection({ dx: 1, dy: 0 });
    setScore(0);
    setFood(generateFood(initialSnake));
    setGamePaused(false);
    setGamePhase('play');

    // Countdown
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameRunning(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    draw(initialSnake, food);
  };

  const getPerformance = () => {
    if (score >= 200) return { emoji: '🏆', title: 'Snake Master!', subtitle: 'Incredible performance!' };
    if (score >= 100) return { emoji: '🌟', title: 'Great Game!', subtitle: 'You\'re getting good!' };
    if (score >= 50) return { emoji: '👍', title: 'Nice Try!', subtitle: 'Keep practicing!' };
    return { emoji: '🐍', title: 'Game Over', subtitle: 'Try again!' };
  };

  const difficultySettings = {
    easy: { label: 'Easy', color: 'from-green-500 to-emerald-500', description: 'Slow speed' },
    medium: { label: 'Medium', color: 'from-yellow-500 to-amber-500', description: 'Normal speed' },
    hard: { label: 'Hard', color: 'from-orange-500 to-red-500', description: 'Fast speed' },
    expert: { label: 'Expert', color: 'from-red-500 to-rose-600', description: 'Lightning fast' }
  };

  const webAppSchema = generateWebAppSchema({
    name: 'Snake Game',
    description: 'Classic snake arcade game with multiple difficulty levels',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full mb-3">
              <span className="text-2xl">🐍</span>
              <span className="text-green-700 font-semibold">Snake Game</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">{getH1('Classic Snake Game')}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Control the snake to eat food and grow longer. Avoid walls and yourself!
            </p>
          </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Game Area */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Menu Phase */}
                {gamePhase === 'menu' && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Settings</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6 max-w-lg mx-auto">
                      {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => {
                        const settings = difficultySettings[diff];
                        return (
                          <button
                            key={diff}
                            onClick={() => setDifficulty(diff)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              difficulty === diff
                                ? 'border-green-500 bg-green-50 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                            }`}
                          >
                            <div className={`text-lg font-bold bg-gradient-to-r ${settings.color} bg-clip-text text-transparent`}>
                              {settings.label}
                            </div>
                            <div className="text-xs text-gray-500">{settings.description}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Game Mode</label>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setGameMode('classic')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            gameMode === 'classic'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Classic (Walls kill)
                        </button>
                        <button
                          onClick={() => setGameMode('wrap')}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            gameMode === 'wrap'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Wrap (Go through walls)
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={startGame}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      🐍 Start Game
                    </button>

                    {/* Controls Info */}
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="font-bold text-green-800 mb-4">How to Play</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                        <div className="flex gap-2">
                          <span>⬆️⬇️⬅️➡️</span>
                          <span>Arrow keys to move</span>
                        </div>
                        <div className="flex gap-2">
                          <span>WASD</span>
                          <span>Alternative controls</span>
                        </div>
                        <div className="flex gap-2">
                          <span>Space</span>
                          <span>Pause/Resume game</span>
                        </div>
                        <div className="flex gap-2">
                          <span>🍎</span>
                          <span>Eat food to grow</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Play Phase */}
                {gamePhase === 'play' && (
                  <div>
                    {/* Game Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{score}</div>
                        <div className="text-xs text-green-700">Score</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{snake.length}</div>
                        <div className="text-xs text-blue-700">Length</div>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{stats.bestScore}</div>
                        <div className="text-xs text-yellow-700">Best</div>
                      </div>
                    </div>

                    {/* Game Canvas */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          width={canvasSize}
                          height={canvasSize}
                          className="border-4 border-green-300 rounded-xl shadow-lg"
                        />

                        {/* Countdown Overlay */}
                        {countdown > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                            <div className="text-6xl font-bold text-white animate-pulse">{countdown}</div>
                          </div>
                        )}

                        {/* Pause Overlay */}
                        {gamePaused && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                            <div className="text-center text-white">
                              <div className="text-4xl mb-2">⏸️</div>
                              <div className="text-xl font-bold">Paused</div>
                              <div className="text-sm">Press Space to resume</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Game Controls */}
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setGamePaused(!gamePaused)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                      >
                        {gamePaused ? '▶️ Resume' : '⏸️ Pause'}
                      </button>
                      <button
                        onClick={() => {
                          setGameRunning(false);
                          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
                          setGamePhase('menu');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      >
                        🚪 Quit
                      </button>
                    </div>
                  </div>
                )}

                {/* Result Phase */}
                {gamePhase === 'result' && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getPerformance().emoji}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{getPerformance().title}</h2>
                    <p className="text-gray-600 mb-6">{getPerformance().subtitle}</p>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                      <div className="text-5xl font-bold text-green-600 mb-2">{score}</div>
                      <div className="text-gray-600 mb-4">Final Score</div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{snake.length}</div>
                          <div className="text-xs text-gray-500">Final Length</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">{stats.bestScore}</div>
                          <div className="text-xs text-gray-500">Best Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all"
                      >
                        🐍 Play Again
                      </button>
                      <button
                        onClick={() => setGamePhase('menu')}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                      >
                        Change Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Ad Banner */}
              <div className="mt-6">
                <AdBanner />
              </div>

              {/* SEO Content Section */}
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding the Classic Snake Game</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  The Snake game is one of the most iconic and beloved classic video games, with origins dating back to the 1976 arcade game "Blockade." It gained massive popularity when Nokia pre-installed a version on its mobile phones in 1998, becoming one of the most played games of all time. The simple yet addictive gameplay has made Snake a timeless classic that continues to captivate players across generations.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h3 className="font-semibold text-green-800 mb-2">🐍 Simple Controls</h3>
                    <p className="text-sm text-gray-600">Navigate using arrow keys or swipe gestures. Turn left or right to change direction.</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <h3 className="font-semibold text-red-800 mb-2">🍎 Collect Food</h3>
                    <p className="text-sm text-gray-600">Eat the red food items to grow longer and increase your score.</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h3 className="font-semibold text-amber-800 mb-2">⚡ Speed Challenge</h3>
                    <p className="text-sm text-gray-600">Choose from four difficulty levels that increase the snake's speed.</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">🎮 Game Modes</h3>
                    <p className="text-sm text-gray-600">Classic mode with walls or wrap-around mode for continuous play.</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Strategies for High Scores</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Stay Near the Center</h4>
                      <p className="text-sm text-gray-600">Avoid edges and corners where you have fewer escape options. Keep space to maneuver.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Plan Your Path</h4>
                      <p className="text-sm text-gray-600">Think several moves ahead. Don't just chase food blindly; consider your tail position.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Create Patterns</h4>
                      <p className="text-sm text-gray-600">Move in predictable patterns like spirals or zigzags to maintain control as you grow longer.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Slow and Steady</h4>
                      <p className="text-sm text-gray-600">Start with easier difficulties to build skills before tackling expert speed levels.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Why Snake Remains Popular</h3>
                <p className="text-gray-600 leading-relaxed">
                  Snake's enduring appeal lies in its perfect balance of simplicity and challenge. The game is easy to understand but difficult to master, providing that satisfying "one more try" feeling. It improves hand-eye coordination, spatial awareness, and quick decision-making skills. Whether you're looking for a quick brain break or aiming to beat your personal best, Snake delivers instant entertainment with no learning curve required.
                </p>
              </div>

              {/* Mobile MREC2 - Before FAQs */}


              <GameAppMobileMrec2 />



              {/* FAQs Section */}
              <div className="mt-8">
                <FirebaseFAQs
                  pageId="snake-game"
                  fallbackFaqs={fallbackFaqs}
                  className="bg-white rounded-2xl shadow-lg p-6"
                />
              </div>
            </div>
{/* Sidebar */}
            <div className="lg:w-[320px] space-y-6">
              {/* Ad Banner */}
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">📊</span> Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Games Played</span>
                    <span className="font-bold text-green-600">{stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-bold text-yellow-600">{stats.bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Food Eaten</span>
                    <span className="font-bold text-red-600">{stats.totalFood}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Longest Snake</span>
                    <span className="font-bold text-blue-600">{stats.longestSnake}</span>
                  </div>
                </div>
                {stats.gamesPlayed > 0 && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('snakeGameStats');
                      setStats({ gamesPlayed: 0, bestScore: 0, totalFood: 0, longestSnake: 0 });
                    }}
                    className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Reset Stats
                  </button>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-5">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span> Pro Tips
                </h3>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• Plan your path ahead</li>
                  <li>• Stay near the center when possible</li>
                  <li>• Avoid trapping yourself in corners</li>
                  <li>• Use wrap mode to practice</li>
                </ul>
              </div>
{/* Related Games */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">🎮</span> Related Games
                </h3>
                <div className="space-y-3">
                  {relatedGames.map((game, index) => (
                    <Link
                      key={index}
                      href={game.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {game.icon === 'puzzle' ? '🧩' : '🎮'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                          {game.title}
                        </div>
                        <div className="text-xs text-gray-500">{game.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
