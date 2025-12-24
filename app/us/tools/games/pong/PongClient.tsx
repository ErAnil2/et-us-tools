'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

interface PongClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GamePhase = 'menu' | 'play' | 'result';

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalPoints: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I control my paddle?",
    answer: "Use your mouse to move the paddle up and down, or use the W/S keys or Arrow Up/Down keys on keyboard. The paddle follows your input smoothly.",
    order: 1
  },
  {
    id: '2',
    question: "How does scoring work?",
    answer: "Score a point when the ball passes your opponent's paddle. First to reach the target score (5, 10, 15, or 21) wins the game!",
    order: 2
  },
  {
    id: '3',
    question: "What do the difficulty levels change?",
    answer: "Difficulty affects AI paddle speed and reaction time. Easy AI is slow and makes mistakes, while Expert AI has near-perfect tracking and quick reactions.",
    order: 3
  },
  {
    id: '4',
    question: "How does the ball physics work?",
    answer: "The ball bounces off walls and paddles. Hitting different parts of the paddle changes the ball angle - edges give sharper angles, center gives straighter shots.",
    order: 4
  }
];

export default function PongClient({ relatedGames = defaultRelatedGames }: PongClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [winScore, setWinScore] = useState(5);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    totalPoints: 0
  });

  const { getH1, getSubHeading } = usePageSEO('pong');

  // Game state refs
  const ballRef = useRef({ x: 400, y: 200, dx: 5, dy: 3, radius: 10, speed: 5 });
  const playerPaddleRef = useRef({ x: 20, y: 150, width: 15, height: 100, speed: 8 });
  const aiPaddleRef = useRef({ x: 765, y: 150, width: 15, height: 100, speed: 4 });
  const keysRef = useRef<Record<string, boolean>>({});
  const mouseYRef = useRef(200);
  const playerScoreRef = useRef(0);
  const aiScoreRef = useRef(0);
  const gameRunningRef = useRef(false);
  const gamePausedRef = useRef(false);
  const winScoreRef = useRef(5);

  const aiSettings = {
    easy: { speed: 3, accuracy: 0.6 },
    medium: { speed: 4, accuracy: 0.75 },
    hard: { speed: 6, accuracy: 0.9 },
    expert: { speed: 8, accuracy: 0.98 }
  };

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('pongStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Save stats
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('pongStats', JSON.stringify(newStats));
  }, []);

  // Update refs
  useEffect(() => { gameRunningRef.current = gameRunning; }, [gameRunning]);
  useEffect(() => { gamePausedRef.current = gamePaused; }, [gamePaused]);
  useEffect(() => { winScoreRef.current = winScore; }, [winScore]);

  // Reset ball
  const resetBall = useCallback(() => {
    const ball = ballRef.current;
    ball.x = 400;
    ball.y = 200;
    const angle = (Math.random() - 0.5) * Math.PI / 3;
    const direction = Math.random() < 0.5 ? 1 : -1;
    ball.dx = Math.cos(angle) * ball.speed * direction;
    ball.dy = Math.sin(angle) * ball.speed;
  }, []);

  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ball = ballRef.current;
    const playerPaddle = playerPaddleRef.current;
    const aiPaddle = aiPaddleRef.current;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.setLineDash([15, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player paddle (green)
    const playerGradient = ctx.createLinearGradient(playerPaddle.x, 0, playerPaddle.x + playerPaddle.width, 0);
    playerGradient.addColorStop(0, '#22c55e');
    playerGradient.addColorStop(1, '#16a34a');
    ctx.fillStyle = playerGradient;
    ctx.beginPath();
    ctx.roundRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 5);
    ctx.fill();

    // AI paddle (red)
    const aiGradient = ctx.createLinearGradient(aiPaddle.x, 0, aiPaddle.x + aiPaddle.width, 0);
    aiGradient.addColorStop(0, '#ef4444');
    aiGradient.addColorStop(1, '#dc2626');
    ctx.fillStyle = aiGradient;
    ctx.beginPath();
    ctx.roundRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, 5);
    ctx.fill();

    // Ball
    const ballGradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Ball trail
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(ball.x - ball.dx * 2, ball.y - ball.dy * 2, ball.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Handle paddle collision
  const handlePaddleCollision = useCallback((paddle: typeof playerPaddleRef.current, isPlayer: boolean) => {
    const ball = ballRef.current;
    const hitPos = (ball.y - paddle.y) / paddle.height;
    const angle = (hitPos - 0.5) * Math.PI / 3;
    const direction = isPlayer ? 1 : -1;
    const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
    const newSpeed = Math.min(12, currentSpeed + 0.3);
    ball.dx = Math.cos(angle) * newSpeed * direction;
    ball.dy = Math.sin(angle) * newSpeed;
    ball.x = isPlayer ? paddle.x + paddle.width + ball.radius : paddle.x - ball.radius;
  }, []);

  // End game
  const endGame = useCallback((playerWon: boolean) => {
    setGameRunning(false);
    gameRunningRef.current = false;
    setWinner(playerWon ? 'player' : 'ai');

    const newStats: GameStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (playerWon ? 1 : 0),
      gamesLost: stats.gamesLost + (playerWon ? 0 : 1),
      totalPoints: stats.totalPoints + playerScoreRef.current
    };
    saveStats(newStats);
    setGamePhase('result');
  }, [stats, saveStats]);

  // Update game
  const update = useCallback(() => {
    if (!gameRunningRef.current || gamePausedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ball = ballRef.current;
    const playerPaddle = playerPaddleRef.current;
    const aiPaddle = aiPaddleRef.current;

    // Player paddle - mouse control
    const targetY = mouseYRef.current - playerPaddle.height / 2;
    playerPaddle.y = Math.max(0, Math.min(canvas.height - playerPaddle.height, targetY));

    // Player paddle - keyboard control
    if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) {
      playerPaddle.y = Math.max(0, playerPaddle.y - playerPaddle.speed);
    }
    if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) {
      playerPaddle.y = Math.min(canvas.height - playerPaddle.height, playerPaddle.y + playerPaddle.speed);
    }

    // Update ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
      ball.dy = -ball.dy;
      ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }

    // AI paddle movement
    const settings = aiSettings[difficulty as Difficulty];
    aiPaddle.speed = settings.speed;
    const paddleCenterY = aiPaddle.y + aiPaddle.height / 2;
    let targetAIY = ball.y;
    if (Math.random() > settings.accuracy) {
      targetAIY += (Math.random() - 0.5) * 100;
    }
    if (Math.abs(targetAIY - paddleCenterY) > 10) {
      if (targetAIY > paddleCenterY) {
        aiPaddle.y = Math.min(canvas.height - aiPaddle.height, aiPaddle.y + aiPaddle.speed);
      } else {
        aiPaddle.y = Math.max(0, aiPaddle.y - aiPaddle.speed);
      }
    }

    // Player paddle collision
    if (ball.x - ball.radius <= playerPaddle.x + playerPaddle.width &&
        ball.y >= playerPaddle.y &&
        ball.y <= playerPaddle.y + playerPaddle.height &&
        ball.dx < 0) {
      handlePaddleCollision(playerPaddle, true);
    }

    // AI paddle collision
    if (ball.x + ball.radius >= aiPaddle.x &&
        ball.y >= aiPaddle.y &&
        ball.y <= aiPaddle.y + aiPaddle.height &&
        ball.dx > 0) {
      handlePaddleCollision(aiPaddle, false);
    }

    // Scoring
    if (ball.x > canvas.width) {
      playerScoreRef.current++;
      setPlayerScore(playerScoreRef.current);
      if (playerScoreRef.current >= winScoreRef.current) {
        endGame(true);
      } else {
        resetBall();
      }
    }

    if (ball.x < 0) {
      aiScoreRef.current++;
      setAiScore(aiScoreRef.current);
      if (aiScoreRef.current >= winScoreRef.current) {
        endGame(false);
      } else {
        resetBall();
      }
    }
  }, [difficulty, handlePaddleCollision, resetBall, endGame]);

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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === ' ' && gameRunningRef.current) {
        e.preventDefault();
        setGamePaused(prev => !prev);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse control
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseYRef.current = ((e.clientY - rect.top) / rect.height) * canvas.height;
  }, []);

  // Start game
  const startGame = () => {
    setGameRunning(true);
    gameRunningRef.current = true;
    setGamePaused(false);
    gamePausedRef.current = false;
    setPlayerScore(0);
    playerScoreRef.current = 0;
    setAiScore(0);
    aiScoreRef.current = 0;
    setWinner(null);
    ballRef.current.speed = 5;
    resetBall();
    playerPaddleRef.current.y = 150;
    aiPaddleRef.current.y = 150;
    setGamePhase('play');
  };

  const togglePause = () => {
    setGamePaused(prev => !prev);
    gamePausedRef.current = !gamePausedRef.current;
  };

  const difficultySettings = {
    easy: { label: 'Easy', color: 'from-green-500 to-emerald-500', description: 'Slow AI' },
    medium: { label: 'Medium', color: 'from-yellow-500 to-amber-500', description: 'Balanced' },
    hard: { label: 'Hard', color: 'from-orange-500 to-red-500', description: 'Fast AI' },
    expert: { label: 'Expert', color: 'from-red-500 to-rose-600', description: 'Near perfect' }
  };

  const webAppSchema = generateWebAppSchema({
    name: 'Pong Game',
    description: 'Classic Pong arcade game vs AI',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-3">
              <span className="text-2xl">🏓</span>
              <span className="text-blue-700 font-semibold">Pong Game</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{getH1('Classic Pong')}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Move your paddle to hit the ball and score against the AI!
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
                                ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-blue-300'
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
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Points to Win</label>
                      <div className="flex justify-center gap-3">
                        {[5, 10, 15, 21].map((score) => (
                          <button
                            key={score}
                            onClick={() => setWinScore(score)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              winScore === score
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={startGame}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                    >
                      🏓 Start Game
                    </button>

                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                      <h3 className="font-bold text-blue-800 mb-4">Controls</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                        <div>🖱️ Mouse - Move paddle</div>
                        <div>⬆️⬇️ or W/S - Move paddle</div>
                        <div>Space - Pause game</div>
                        <div>🎯 Hit ball past AI to score</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Play Phase */}
                {gamePhase === 'play' && (
                  <div>
                    {/* Score Display */}
                    <div className="flex justify-center gap-8 mb-4 bg-slate-900 rounded-xl p-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-400">{playerScore}</div>
                        <div className="text-sm text-green-300">You</div>
                      </div>
                      <div className="text-white text-4xl font-mono">:</div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-red-400">{aiScore}</div>
                        <div className="text-sm text-red-300">AI</div>
                      </div>
                    </div>

                    {/* Canvas */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          width={800}
                          height={400}
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
                      <button onClick={togglePause} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600">
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
                    <div className="text-6xl mb-4">{winner === 'player' ? '🏆' : '😔'}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {winner === 'player' ? 'You Win!' : 'AI Wins!'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {winner === 'player' ? 'Great game!' : 'Better luck next time!'}
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                      <div className="text-5xl font-bold text-blue-600 mb-2">{playerScore} - {aiScore}</div>
                      <div className="text-gray-600">Final Score</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button onClick={startGame} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold">
                        🏓 Play Again
                      </button>
                      <button onClick={() => setGamePhase('menu')} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold">
                        Change Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6"><AdBanner /></div>

              {/* SEO Content Section */}
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Pong: The Game That Started It All</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pong is the game that launched the video game industry. Created by Allan Alcorn and released by Atari in 1972, this simple table tennis simulation became the first commercially successful video game. Its elegant design—two paddles, one ball, and simple rules—proved that electronic games could be profitable entertainment, paving the way for the multi-billion dollar gaming industry we know today.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h3 className="font-semibold text-green-800 mb-2">🏓 Simple Controls</h3>
                    <p className="text-sm text-gray-600">Move your paddle up and down to deflect the ball. That's all you need!</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">⚡ Fast Reflexes</h3>
                    <p className="text-sm text-gray-600">React quickly to the ball's trajectory and position your paddle precisely.</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <h3 className="font-semibold text-purple-800 mb-2">🎯 Score Points</h3>
                    <p className="text-sm text-gray-600">Get the ball past your opponent's paddle to score. First to the target wins!</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <h3 className="font-semibold text-amber-800 mb-2">🤖 vs AI</h3>
                    <p className="text-sm text-gray-600">Challenge the computer opponent with adjustable difficulty levels.</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pro Strategies for Pong</h3>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Anticipate the Ball</h4>
                      <p className="text-sm text-gray-600">Watch the ball's angle and start moving early. Don't wait until it's close.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Control the Angle</h4>
                      <p className="text-sm text-gray-600">Hit with paddle edges for sharp angles that are harder to return.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Stay Centered</h4>
                      <p className="text-sm text-gray-600">Return to center position after each hit for maximum coverage.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Vary Your Returns</h4>
                      <p className="text-sm text-gray-600">Mix up angles to keep your opponent guessing and off-balance.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pong's Historic Impact</h3>
                <p className="text-gray-600 leading-relaxed">
                  Pong demonstrated that video games could be mainstream entertainment. Its success in bars and arcades proved there was a market for electronic gaming, leading directly to the home console revolution. The game's simplicity made it accessible to everyone, while its competitive nature kept players coming back. Today, Pong remains a symbol of gaming's origins and the timeless appeal of pure, skill-based competition.
                </p>
              </div>

              {/* Mobile MREC2 - Before FAQs */}


              <GameAppMobileMrec2 />



              <div className="mt-8">
                <FirebaseFAQs pageId="pong" fallbackFaqs={fallbackFaqs} className="bg-white rounded-2xl shadow-lg p-6" />
              </div>
            </div>
{/* Sidebar */}
            <div className="lg:w-[320px] space-y-6">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">📊</span> Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-600">Games Played</span><span className="font-bold text-blue-600">{stats.gamesPlayed}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Wins</span><span className="font-bold text-green-600">{stats.gamesWon}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Losses</span><span className="font-bold text-red-600">{stats.gamesLost}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Win Rate</span><span className="font-bold text-purple-600">{stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">🎮</span> Related Games
                </h3>
                <div className="space-y-3">
                  {relatedGames.map((game, index) => (
                    <Link key={index} href={game.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>🎮</div>
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-blue-600">{game.title}</div>
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
