'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2 } from '@/components/BannerPlacements';

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface BreakoutClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

type GamePhase = 'menu' | 'play' | 'result';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  visible: boolean;
}

interface GameStats {
  gamesPlayed: number;
  highScore: number;
  totalBricks: number;
  levelsCompleted: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I control the paddle?",
    answer: "Move your mouse left and right to control the paddle. You can also use the left and right arrow keys or A/D keys on keyboard.",
    order: 1
  },
  {
    id: '2',
    question: "How do I score points?",
    answer: "Break bricks by bouncing the ball off them. Different colored bricks give different points - red bricks at top give 100 points, orange 75, yellow 50, green 25, and blue 10.",
    order: 2
  },
  {
    id: '3',
    question: "What happens when I lose a life?",
    answer: "You lose a life when the ball falls below your paddle. You start with 3 lives. Lose all lives and the game ends, but completing a level gives you an extra life!",
    order: 3
  },
  {
    id: '4',
    question: "How do levels work?",
    answer: "Clear all bricks to complete a level. Each level adds more rows of bricks and the ball moves slightly faster, making the game progressively more challenging.",
    order: 4
  }
];

export default function BreakoutClient({ relatedGames = defaultRelatedGames }: BreakoutClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameRunning, setGameRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    highScore: 0,
    totalBricks: 0,
    levelsCompleted: 0
  });

  const { getH1, getSubHeading } = usePageSEO('breakout');

  // Game state refs
  const ballRef = useRef({ x: 400, y: 500, dx: 5, dy: -5, radius: 8, speed: 5 });
  const paddleRef = useRef({ x: 350, y: 560, width: 100, height: 15, speed: 8 });
  const bricksRef = useRef<Brick[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});
  const mouseXRef = useRef(400);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const gameRunningRef = useRef(false);
  const gamePausedRef = useRef(false);

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('breakoutStats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  // Save stats
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('breakoutStats', JSON.stringify(newStats));
  }, []);

  // Update refs
  useEffect(() => { gameRunningRef.current = gameRunning; }, [gameRunning]);
  useEffect(() => { gamePausedRef.current = gamePaused; }, [gamePaused]);

  // Create bricks
  const createBricks = useCallback((lvl: number) => {
    const bricks: Brick[] = [];
    const rows = Math.min(5 + Math.floor(lvl / 2), 8);
    const cols = 10;
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
    const points = [100, 75, 50, 25, 10];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        bricks.push({
          x: col * 80 + 10,
          y: row * 30 + 50,
          width: 70,
          height: 25,
          color: colors[row % colors.length],
          points: points[row % points.length],
          visible: true
        });
      }
    }
    bricksRef.current = bricks;
  }, []);

  // Reset ball
  const resetBall = useCallback(() => {
    const ball = ballRef.current;
    ball.x = 400;
    ball.y = 500;
    const angle = (Math.random() - 0.5) * Math.PI / 3;
    ball.dx = Math.sin(angle) * ball.speed;
    ball.dy = -Math.abs(Math.cos(angle) * ball.speed);
  }, []);

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ball = ballRef.current;
    const paddle = paddleRef.current;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bricks
    for (const brick of bricksRef.current) {
      if (!brick.visible) continue;
      const brickGradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.height);
      brickGradient.addColorStop(0, brick.color);
      brickGradient.addColorStop(1, adjustColor(brick.color, -30));
      ctx.fillStyle = brickGradient;
      ctx.beginPath();
      ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw paddle
    const paddleGradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    paddleGradient.addColorStop(0, '#60a5fa');
    paddleGradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = paddleGradient;
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 8);
    ctx.fill();

    // Draw ball
    const ballGradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // End game
  const endGame = useCallback((won: boolean) => {
    setGameRunning(false);
    gameRunningRef.current = false;
    setGameWon(won);

    const newStats: GameStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      highScore: Math.max(stats.highScore, scoreRef.current),
      totalBricks: stats.totalBricks + bricksRef.current.filter(b => !b.visible).length,
      levelsCompleted: stats.levelsCompleted + (won ? levelRef.current : levelRef.current - 1)
    };
    saveStats(newStats);
    setGamePhase('result');
  }, [stats, saveStats]);

  // Next level
  const nextLevel = useCallback(() => {
    levelRef.current++;
    setLevel(levelRef.current);
    livesRef.current++;
    setLives(livesRef.current);
    ballRef.current.speed = 5 + levelRef.current * 0.5;
    createBricks(levelRef.current);
    resetBall();
    paddleRef.current.x = 350;
  }, [createBricks, resetBall]);

  // Update game
  const update = useCallback(() => {
    if (!gameRunningRef.current || gamePausedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ball = ballRef.current;
    const paddle = paddleRef.current;

    // Move paddle - keyboard
    if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
      paddle.x = Math.max(0, paddle.x - paddle.speed);
    }
    if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
      paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);
    }

    // Move paddle - mouse
    const targetX = mouseXRef.current - paddle.width / 2;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, targetX));

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collisions
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
      ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      ball.y = ball.radius;
    }

    // Ball lost
    if (ball.y + ball.radius > canvas.height) {
      livesRef.current--;
      setLives(livesRef.current);
      if (livesRef.current <= 0) {
        endGame(false);
        return;
      }
      resetBall();
    }

    // Paddle collision
    if (ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width &&
        ball.dy > 0) {
      const hitPos = (ball.x - paddle.x) / paddle.width;
      const angle = (hitPos - 0.5) * Math.PI * 0.4;
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      ball.dx = Math.sin(angle) * speed;
      ball.dy = -Math.abs(Math.cos(angle) * speed);
      ball.y = paddle.y - ball.radius;
    }

    // Brick collisions
    for (const brick of bricksRef.current) {
      if (!brick.visible) continue;

      if (ball.x + ball.radius > brick.x &&
          ball.x - ball.radius < brick.x + brick.width &&
          ball.y + ball.radius > brick.y &&
          ball.y - ball.radius < brick.y + brick.height) {
        brick.visible = false;
        scoreRef.current += brick.points;
        setScore(scoreRef.current);

        const dx = ball.x - (brick.x + brick.width / 2);
        const dy = ball.y - (brick.y + brick.height / 2);
        if (Math.abs(dx / brick.width) > Math.abs(dy / brick.height)) {
          ball.dx = -ball.dx;
        } else {
          ball.dy = -ball.dy;
        }
        break;
      }
    }

    // Check level complete
    if (bricksRef.current.every(b => !b.visible)) {
      nextLevel();
    }
  }, [endGame, resetBall, nextLevel]);

  // Game loop
  const gameLoop = useCallback(() => {
    update();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [update, draw]);

  // Start game loop
  useEffect(() => {
    if (gamePhase === 'play') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gamePhase, gameLoop]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === ' ' && gameRunningRef.current) {
        e.preventDefault();
        setGamePaused(prev => !prev);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseXRef.current = ((e.clientX - rect.left) / rect.width) * canvas.width;
  }, []);

  // Start game
  const startGame = () => {
    setGameRunning(true);
    gameRunningRef.current = true;
    setGamePaused(false);
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setLevel(1);
    levelRef.current = 1;
    ballRef.current.speed = 5;
    createBricks(1);
    resetBall();
    paddleRef.current.x = 350;
    setGamePhase('play');
  };

  const webAppSchema = generateWebAppSchema({
    name: 'Breakout Game',
    description: 'Classic brick breaker arcade game',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full mb-3">
              <span className="text-2xl">🧱</span>
              <span className="text-orange-700 font-semibold">Breakout Game</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">{getH1('Classic Breakout')}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Break all the bricks with your ball and paddle!
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready to Break?</h2>
                    <button
                      onClick={startGame}
                      className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold text-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg"
                    >
                      🧱 Start Game
                    </button>

                    <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
                      <h3 className="font-bold text-orange-800 mb-4">How to Play</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-orange-700">
                        <div>🖱️ Mouse - Move paddle</div>
                        <div>⬅️➡️ or A/D - Move paddle</div>
                        <div>Space - Pause game</div>
                        <div>🧱 Break all bricks to win!</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Play Phase */}
                {gamePhase === 'play' && (
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">{score}</div>
                        <div className="text-xs text-orange-700">Score</div>
                      </div>
                      <div className="bg-red-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-red-600">{lives}</div>
                        <div className="text-xs text-red-700">Lives</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{level}</div>
                        <div className="text-xs text-blue-700">Level</div>
                      </div>
                    </div>

                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          width={800}
                          height={600}
                          onMouseMove={handleMouseMove}
                          className="border-4 border-slate-700 rounded-xl max-w-full h-auto cursor-none"
                        />
                        {gamePaused && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                            <div className="text-center text-white">
                              <div className="text-4xl mb-2">⏸️</div>
                              <div className="text-xl font-bold">Paused</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <button onClick={() => setGamePaused(!gamePaused)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600">
                        {gamePaused ? '▶️ Resume' : '⏸️ Pause'}
                      </button>
                      <button onClick={() => setGamePhase('menu')} className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600">
                        🚪 Quit
                      </button>
                    </div>
                  </div>
                )}

                {/* Result Phase */}
                {gamePhase === 'result' && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">{gameWon ? '🏆' : '💥'}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {gameWon ? 'Amazing!' : 'Game Over!'}
                    </h2>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 mb-6">
                      <div className="text-5xl font-bold text-orange-600 mb-2">{score}</div>
                      <div className="text-gray-600 mb-4">Final Score</div>
                      <div className="flex justify-center gap-6">
                        <div><span className="font-bold text-blue-600">{level}</span> <span className="text-gray-500 text-sm">Level</span></div>
                        <div><span className="font-bold text-yellow-600">{stats.highScore}</span> <span className="text-gray-500 text-sm">Best</span></div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button onClick={startGame} className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold">🧱 Play Again</button>
                      <button onClick={() => setGamePhase('menu')} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">Back to Menu</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6"><AdBanner /></div>

              {/* SEO Content Section */}
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Breakout: The Classic Brick-Breaking Game</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Breakout is a legendary arcade game developed by Atari and released in 1976. Designed by Nolan Bushnell and Steve Bristow, with help from Steve Wozniak and Steve Jobs (before founding Apple), Breakout revolutionized the gaming industry and inspired countless variations. The game's simple concept—break all the bricks using a paddle and ball—has made it an enduring classic that continues to entertain players worldwide.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">🏓 Paddle Control</h3>
                    <p className="text-sm text-gray-600">Move the paddle left and right to bounce the ball and keep it in play.</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <h3 className="font-semibold text-red-800 mb-2">🧱 Break Bricks</h3>
                    <p className="text-sm text-gray-600">Destroy all colored bricks to complete each level and earn points.</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-semibold text-purple-800 mb-2">⚡ Ball Physics</h3>
                    <p className="text-sm text-gray-600">Ball angle changes based on where it hits the paddle for strategic control.</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h3 className="font-semibold text-amber-800 mb-2">❤️ Limited Lives</h3>
                    <p className="text-sm text-gray-600">Don't let the ball fall below the paddle. Each miss costs a life!</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Winning Strategies</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Aim for Corners</h4>
                      <p className="text-sm text-gray-600">Breaking bricks at the top corners can trap the ball above, clearing many bricks automatically.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Control Ball Speed</h4>
                      <p className="text-sm text-gray-600">Hit with paddle edges for angled shots; center hits maintain horizontal trajectory.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Stay Centered</h4>
                      <p className="text-sm text-gray-600">Keep your paddle near the center for maximum reaction time in both directions.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Prioritize Top Bricks</h4>
                      <p className="text-sm text-gray-600">Higher bricks are worth more points and create breakthrough opportunities.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">The Legacy of Breakout</h3>
                <p className="text-gray-600 leading-relaxed">
                  Breakout's influence extends far beyond gaming—its design principles shaped the entire video game industry. The game demonstrated that simple mechanics could create deeply engaging experiences. Modern variations include power-ups, multiple balls, and different brick types, but the core satisfaction of smashing bricks remains unchanged after nearly 50 years.
                </p>
              </div>

              <div className="mt-8"><FirebaseFAQs pageId="breakout" fallbackFaqs={fallbackFaqs} className="bg-white rounded-2xl shadow-lg p-6" /></div>
            </div>
{/* Sidebar */}
            <div className="lg:w-[320px] space-y-6">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-xl">📊</span> Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-600">Games Played</span><span className="font-bold text-orange-600">{stats.gamesPlayed}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">High Score</span><span className="font-bold text-yellow-600">{stats.highScore}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Bricks Broken</span><span className="font-bold text-red-600">{stats.totalBricks}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Levels Completed</span><span className="font-bold text-blue-600">{stats.levelsCompleted}</span></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-5">
                <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2"><span className="text-xl">💡</span> Tips</h3>
                <ul className="text-sm text-orange-700 space-y-2">
                  <li>• Hit ball with paddle edges for sharp angles</li>
                  <li>• Clear top rows first for more points</li>
                  <li>• Stay centered and react quickly</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-xl">🎮</span> Related Games</h3>
                <div className="space-y-3">
                  {relatedGames.map((game, index) => (
                    <Link key={index} href={game.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>🎮</div>
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-orange-600">{game.title}</div>
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
