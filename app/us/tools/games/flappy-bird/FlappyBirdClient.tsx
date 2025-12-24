'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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

interface FlappyBirdClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Bird {
  x: number;
  y: number;
  velocity: number;
  radius: number;
  gravity: number;
  jump: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  bottomHeight: number;
  passed: boolean;
}

interface GameStats {
  gamesPlayed: number;
  highScore: number;
  totalScore: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I play Flappy Bird?",
    answer: "Click, tap, or press the spacebar to make the bird flap and fly upward. Navigate through the gaps between the pipes without hitting them or the ground.",
    order: 1
  },
  {
    id: '2',
    question: "What happens if I hit a pipe or the ground?",
    answer: "The game ends when you hit a pipe, the ground, or fly too high. Your score is recorded and you can try again to beat your high score.",
    order: 2
  },
  {
    id: '3',
    question: "How is the score calculated?",
    answer: "You earn one point for each pair of pipes you successfully fly through. Try to get as many points as possible before hitting an obstacle.",
    order: 3
  },
  {
    id: '4',
    question: "Are there different difficulty levels?",
    answer: "The game maintains a consistent difficulty, but you can challenge yourself by trying to beat your high score and improve your timing.",
    order: 4
  }
];

export default function FlappyBirdClient({ relatedGames = defaultRelatedGames }: FlappyBirdClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gamePhase, setGamePhase] = useState<'menu' | 'play' | 'result'>('menu');
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    highScore: 0,
    totalScore: 0
  });
  const [isNewRecord, setIsNewRecord] = useState(false);

  const gameStateRef = useRef({
    bird: {
      x: 100,
      y: 300,
      velocity: 0,
      radius: 15,
      gravity: 0.4,
      jump: -7
    } as Bird,
    pipes: [] as Pipe[],
    pipeWidth: 60,
    pipeGap: 160,
    pipeSpeed: 3,
    score: 0,
    gameRunning: false,
    animationId: 0
  });

  const { getH1, getSubHeading } = usePageSEO('flappy-bird');

  // Load stats from localStorage
  const loadStats = useCallback(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('flappyBirdStats');
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
  const saveStats = useCallback((currentScore: number) => {
    if (typeof window === 'undefined') return;
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      highScore: Math.max(stats.highScore, currentScore),
      totalScore: stats.totalScore + currentScore
    };
    setStats(newStats);
    localStorage.setItem('flappyBirdStats', JSON.stringify(newStats));

    if (currentScore > stats.highScore) {
      setIsNewRecord(true);
    }
  }, [stats]);

  // Generate a new pipe
  const generatePipe = useCallback((canvas: HTMLCanvasElement) => {
    const minHeight = 50;
    const maxHeight = canvas.height - gameStateRef.current.pipeGap - 50 - minHeight;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;

    return {
      x: canvas.width,
      topHeight: height,
      bottomY: height + gameStateRef.current.pipeGap,
      bottomHeight: canvas.height - height - gameStateRef.current.pipeGap,
      passed: false
    };
  }, []);

  // Check collision with pipe
  const checkCollision = useCallback((pipe: Pipe) => {
    const bird = gameStateRef.current.bird;
    const birdLeft = bird.x - bird.radius;
    const birdRight = bird.x + bird.radius;
    const birdTop = bird.y - bird.radius;
    const birdBottom = bird.y + bird.radius;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + gameStateRef.current.pipeWidth;

    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
        return true;
      }
    }

    return false;
  }, []);

  // Game over handler
  const gameOver = useCallback(() => {
    gameStateRef.current.gameRunning = false;
    cancelAnimationFrame(gameStateRef.current.animationId);

    const finalScore = gameStateRef.current.score;
    saveStats(finalScore);
    setGamePhase('result');
  }, [saveStats]);

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#4169E1');
    gradient.addColorStop(1, '#2d5016');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    // Pipes
    for (const pipe of state.pipes) {
      // Pipe body gradient
      const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + state.pipeWidth, 0);
      pipeGrad.addColorStop(0, '#228B22');
      pipeGrad.addColorStop(0.5, '#32CD32');
      pipeGrad.addColorStop(1, '#228B22');
      ctx.fillStyle = pipeGrad;

      // Top pipe
      ctx.fillRect(pipe.x, 0, state.pipeWidth, pipe.topHeight);
      // Top pipe cap
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, state.pipeWidth + 10, 20);

      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, state.pipeWidth, pipe.bottomHeight);
      // Bottom pipe cap
      ctx.fillRect(pipe.x - 5, pipe.bottomY, state.pipeWidth + 10, 20);
    }

    // Bird body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(state.bird.x, state.bird.y, state.bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bird wing
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(state.bird.x - 5, state.bird.y + 3, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bird eye
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(state.bird.x + 5, state.bird.y - 3, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(state.bird.x + 6, state.bird.y - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Bird beak
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.moveTo(state.bird.x + state.bird.radius, state.bird.y);
    ctx.lineTo(state.bird.x + state.bird.radius + 10, state.bird.y + 3);
    ctx.lineTo(state.bird.x + state.bird.radius, state.bird.y + 6);
    ctx.closePath();
    ctx.fill();

    // Score on canvas
    if (gameStateRef.current.gameRunning) {
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(state.score.toString(), canvas.width / 2, 50);
      ctx.fillText(state.score.toString(), canvas.width / 2, 50);
    }
  }, []);

  // Update game state
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStateRef.current.gameRunning) return;

    const state = gameStateRef.current;

    // Update bird
    state.bird.velocity += state.bird.gravity;
    state.bird.y += state.bird.velocity;

    // Update pipes
    for (let i = state.pipes.length - 1; i >= 0; i--) {
      const pipe = state.pipes[i];
      pipe.x -= state.pipeSpeed;

      // Remove off-screen pipes
      if (pipe.x + state.pipeWidth < 0) {
        state.pipes.splice(i, 1);
      }

      // Score when bird passes pipe
      if (!pipe.passed && state.bird.x > pipe.x + state.pipeWidth) {
        pipe.passed = true;
        state.score++;
        setScore(state.score);
      }

      // Check collision
      if (checkCollision(pipe)) {
        gameOver();
        return;
      }
    }

    // Generate new pipes
    if (state.pipes.length === 0 || state.pipes[state.pipes.length - 1].x < canvas.width - 200) {
      state.pipes.push(generatePipe(canvas));
    }

    // Check ground/ceiling collision
    if (state.bird.y + state.bird.radius >= canvas.height - 40 || state.bird.y - state.bird.radius <= 0) {
      gameOver();
    }
  }, [checkCollision, gameOver, generatePipe]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameStateRef.current.gameRunning) return;

    updateGame();
    draw();
    gameStateRef.current.animationId = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  // Start game
  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameStateRef.current = {
      ...gameStateRef.current,
      bird: {
        x: 100,
        y: 300,
        velocity: 0,
        radius: 15,
        gravity: 0.4,
        jump: -7
      },
      pipes: [],
      score: 0,
      gameRunning: true
    };

    setScore(0);
    setIsNewRecord(false);
    setGamePhase('play');

    // Generate first pipe
    gameStateRef.current.pipes.push(generatePipe(canvas));

    gameLoop();
  }, [generatePipe, gameLoop]);

  // Handle input (flap)
  const handleFlap = useCallback(() => {
    if (gamePhase === 'menu') {
      startGame();
    } else if (gamePhase === 'play' && gameStateRef.current.gameRunning) {
      gameStateRef.current.bird.velocity = gameStateRef.current.bird.jump;
    }
  }, [gamePhase, startGame]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleFlap();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleFlap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(gameStateRef.current.animationId);
    };
  }, []);

  const avgScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;

  const webAppSchema = generateWebAppSchema({
    name: 'Flappy Bird Game',
    description: 'Play the classic Flappy Bird game online!',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-200 to-orange-200 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">🐦</span>
            <span className="text-yellow-700 font-semibold">Flying Challenge</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-3">{getH1('Flappy Bird')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tap to flap and guide the bird through the pipes. Simple to learn, challenging to master!
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
              <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{score}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.highScore}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Best</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.gamesPlayed}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Games</div>
                </div>
              </div>

              {/* Canvas Container */}
              <div className="relative bg-gradient-to-b from-sky-400 to-blue-600 rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={600}
                  className="block mx-auto cursor-pointer"
                  onClick={handleFlap}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleFlap();
                  }}
                />

                {/* Menu Overlay */}
                {gamePhase === 'menu' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <div className="text-6xl mb-4">🐦</div>
                      <h2 className="text-3xl font-bold mb-2">Flappy Bird</h2>
                      <p className="text-lg mb-6 opacity-90">Tap or click to fly!</p>
                      <button
                        onClick={startGame}
                        className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl text-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
                      >
                        Start Game
                      </button>
                      <p className="mt-4 text-sm opacity-75">Press SPACE or tap to flap</p>
                    </div>
                  </div>
                )}

                {/* Result Overlay */}
                {gamePhase === 'result' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <div className="text-5xl mb-3">{isNewRecord ? '🏆' : '💥'}</div>
                      <h2 className="text-2xl font-bold mb-2">
                        {isNewRecord ? 'New High Score!' : 'Game Over!'}
                      </h2>
                      <div className="bg-white/20 rounded-xl p-4 mb-4">
                        <div className="text-4xl font-bold text-yellow-400">{score}</div>
                        <div className="text-sm opacity-80">Points</div>
                      </div>
                      {isNewRecord && (
                        <div className="text-yellow-400 font-semibold mb-3 animate-pulse">
                          You beat your previous best!
                        </div>
                      )}
                      <button
                        onClick={startGame}
                        className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl text-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
                      >
                        Play Again
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-4 text-center text-gray-600 text-sm">
                <span className="font-medium">Controls:</span> Click/Tap or press SPACE to flap
              </div>
            </div>

            {/* How to Play */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">How to Play</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">👆</div>
                  <h3 className="font-semibold text-gray-800">Tap to Fly</h3>
                  <p className="text-sm text-gray-600">Click, tap, or press space to flap</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🚧</div>
                  <h3 className="font-semibold text-gray-800">Avoid Pipes</h3>
                  <p className="text-sm text-gray-600">Navigate through the gaps carefully</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-semibold text-gray-800">Score Points</h3>
                  <p className="text-sm text-gray-600">Each pipe passed = 1 point</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-500 text-xl">💡</span>
                  <p className="text-gray-600">Tap in short bursts rather than holding - it gives you better control.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl">🎯</span>
                  <p className="text-gray-600">Aim for the center of the gaps to give yourself margin for error.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-xl">⏰</span>
                  <p className="text-gray-600">Find a rhythm - consistent timing beats reactive tapping.</p>
                </div>
              </div>
            </div>

            {/* SEO Content Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Flappy Bird: The Viral Gaming Phenomenon</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Flappy Bird took the world by storm in 2013, becoming one of the most downloaded mobile games in history. Created by Vietnamese developer Dong Nguyen, this deceptively simple game challenged players to navigate a bird through gaps between pipes with just one action—tapping to flap. Its extreme difficulty and addictive "one more try" nature made it a cultural phenomenon that sparked endless discussions about game design.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <h3 className="font-semibold text-yellow-800 mb-2">🐦 Tap to Fly</h3>
                  <p className="text-sm text-gray-600">Each tap gives the bird a small upward boost. Master the timing!</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">🌿 Navigate Pipes</h3>
                  <p className="text-sm text-gray-600">Fly through the gaps between green pipes without touching them.</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-2">💥 Instant Failure</h3>
                  <p className="text-sm text-gray-600">Any collision ends the game. Precision is everything!</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">🏆 High Scores</h3>
                  <p className="text-sm text-gray-600">Each pipe passed equals one point. Can you beat your best?</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Tips for Higher Scores</h3>
              <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl p-5 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Gentle Taps</h4>
                    <p className="text-sm text-gray-600">Small, frequent taps give better control than big, spaced-out jumps.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Focus Ahead</h4>
                    <p className="text-sm text-gray-600">Look at upcoming pipes, not the bird. Anticipate your path.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Stay Calm</h4>
                    <p className="text-sm text-gray-600">Panic leads to over-tapping. Maintain a steady rhythm.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Center the Gaps</h4>
                    <p className="text-sm text-gray-600">Aim for the middle of each gap to maximize margin for error.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Why Flappy Bird Captivated Millions</h3>
              <p className="text-gray-600 leading-relaxed">
                Flappy Bird's genius lies in its simplicity combined with difficulty. The one-button control scheme means anyone can play, but mastering it requires practice and patience. The game taps into our desire to improve and the satisfaction of beating personal records. Despite being removed from app stores by its creator in 2014, Flappy Bird remains a benchmark for viral mobile gaming success.
              </p>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <FirebaseFAQs
                pageId="flappy-bird-game"
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
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                  <span className="text-gray-600">High Score</span>
                  <span className="font-bold text-yellow-600">{stats.highScore}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-bold text-orange-600">{stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                  <span className="text-gray-600">Total Score</span>
                  <span className="font-bold text-red-600">{stats.totalScore}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-bold text-purple-600">{avgScore}</span>
                </div>
              </div>
            </div>
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

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
          </div>
        </div>
      </div>
    </div>
  );
}
