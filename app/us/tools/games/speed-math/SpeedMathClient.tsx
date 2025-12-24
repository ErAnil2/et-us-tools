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

interface SpeedMathClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Problem {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
  display: string;
}

interface Stats {
  gamesPlayed: number;
  totalCorrect: number;
  bestScore: number;
  bestStreak: number;
  averageTime: number;
}

type GamePhase = 'menu' | 'countdown' | 'play' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

const difficultySettings = {
  easy: {
    label: 'Easy',
    description: 'Single digits, + & -',
    minNum: 1,
    maxNum: 9,
    operators: ['+', '-'],
    timeLimit: 60,
    emoji: '🌱'
  },
  medium: {
    label: 'Medium',
    description: 'Double digits, + - ×',
    minNum: 2,
    maxNum: 20,
    operators: ['+', '-', '×'],
    timeLimit: 60,
    emoji: '🌿'
  },
  hard: {
    label: 'Hard',
    description: 'Larger numbers, all ops',
    minNum: 5,
    maxNum: 50,
    operators: ['+', '-', '×', '÷'],
    timeLimit: 60,
    emoji: '🌳'
  },
  expert: {
    label: 'Expert',
    description: 'Big numbers, 45 seconds',
    minNum: 10,
    maxNum: 100,
    operators: ['+', '-', '×', '÷'],
    timeLimit: 45,
    emoji: '🏆'
  }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "How does Speed Math work?",
    answer: "Speed Math challenges you to solve as many arithmetic problems as possible within the time limit. Type your answer and press Enter or click Submit. Correct answers add to your score, while wrong answers break your streak.",
    order: 1
  },
  {
    id: '2',
    question: "What are the different difficulty levels?",
    answer: "Easy uses single digits with addition/subtraction. Medium adds double digits and multiplication. Hard includes all operations with larger numbers. Expert uses big numbers with only 45 seconds!",
    order: 2
  },
  {
    id: '3',
    question: "How is the score calculated?",
    answer: "Each correct answer gives base points plus streak bonuses. Higher difficulties give multiplied points. Building consecutive correct answers (streaks) significantly boosts your score.",
    order: 3
  },
  {
    id: '4',
    question: "What tips can help me improve?",
    answer: "Practice mental math shortcuts, memorize common products, and stay calm under pressure. Start with Easy to build confidence, then progress to harder levels as your speed improves.",
    order: 4
  }
];

export default function SpeedMathClient({ relatedGames = defaultRelatedGames }: SpeedMathClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [countdown, setCountdown] = useState(3);

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalCorrect: 0,
    bestScore: 0,
    bestStreak: 0,
    averageTime: 0
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { getH1, getSubHeading } = usePageSEO('speed-math-game');

  const webAppSchema = generateWebAppSchema({
    name: 'Speed Math Game',
    description: 'Test your mental math speed with fast arithmetic challenges',
    url: typeof window !== 'undefined' ? window.location.href : ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('speedMathStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const saveStats = (newStats: Stats) => {
    setStats(newStats);
    localStorage.setItem('speedMathStats', JSON.stringify(newStats));
  };

  const generateProblem = useCallback((): Problem => {
    const settings = difficultySettings[difficulty];
    const operator = settings.operators[Math.floor(Math.random() * settings.operators.length)];

    let num1 = Math.floor(Math.random() * (settings.maxNum - settings.minNum + 1)) + settings.minNum;
    let num2 = Math.floor(Math.random() * (settings.maxNum - settings.minNum + 1)) + settings.minNum;
    let answer: number;

    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
      default:
        answer = 0;
    }

    return {
      num1,
      num2,
      operator,
      answer,
      display: `${num1} ${operator} ${num2}`
    };
  }, [difficulty]);

  const startGame = () => {
    setGamePhase('countdown');
    setCountdown(3);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setProblemsSolved(0);
    setWrongAnswers(0);
    setUserAnswer('');
    setFeedback(null);
    setTimeLeft(difficultySettings[difficulty].timeLimit);
  };

  // Countdown effect
  useEffect(() => {
    if (gamePhase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGamePhase('play');
        setCurrentProblem(generateProblem());
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [gamePhase, countdown, generateProblem]);

  // Game timer
  useEffect(() => {
    if (gamePhase === 'play') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gamePhase]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGamePhase('result');

    const newStats = { ...stats };
    newStats.gamesPlayed++;
    newStats.totalCorrect += problemsSolved;

    if (score > newStats.bestScore) {
      newStats.bestScore = score;
    }

    if (maxStreak > newStats.bestStreak) {
      newStats.bestStreak = maxStreak;
    }

    saveStats(newStats);
  }, [stats, score, problemsSolved, maxStreak]);

  const submitAnswer = () => {
    if (!currentProblem || userAnswer === '') return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentProblem.answer;

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const basePoints = 10;
      const streakBonus = Math.min(streak, 10) * 2;
      const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2, expert: 3 }[difficulty];
      const points = Math.floor((basePoints + streakBonus) * difficultyMultiplier);

      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
      setProblemsSolved(prev => prev + 1);
    } else {
      setStreak(0);
      setWrongAnswers(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer('');
      setCurrentProblem(generateProblem());
      inputRef.current?.focus();
    }, 200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const getScoreGrade = () => {
    if (score >= 500) return { grade: 'S', color: 'text-yellow-500', label: 'Lightning Fast!' };
    if (score >= 300) return { grade: 'A', color: 'text-green-500', label: 'Excellent!' };
    if (score >= 200) return { grade: 'B', color: 'text-blue-500', label: 'Great Job!' };
    if (score >= 100) return { grade: 'C', color: 'text-purple-500', label: 'Good Effort!' };
    return { grade: 'D', color: 'text-orange-500', label: 'Keep Practicing!' };
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'puzzle': return '🧩';
      case 'memory': return '🧠';
      case 'game': return '🎮';
      case 'speed': return '⚡';
      default: return '🎯';
    }
  };

  const accuracy = problemsSolved + wrongAnswers > 0
    ? Math.round((problemsSolved / (problemsSolved + wrongAnswers)) * 100)
    : 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">⚡</span>
            <span className="text-red-700 font-semibold">Speed Challenge</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">{getH1('Speed Math')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Race against the clock! Solve as many math problems as you can before time runs out.
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
                <div className="space-y-6">
                  {/* Difficulty Selection */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Select Difficulty</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficulty(diff)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            difficulty === diff
                              ? 'border-red-500 bg-red-50 shadow-md'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{difficultySettings[diff].emoji}</div>
                          <div className="font-semibold text-gray-800">{difficultySettings[diff].label}</div>
                          <div className="text-xs text-gray-500">{difficultySettings[diff].description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Display */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Time Limit</div>
                    <div className="text-3xl font-bold text-red-600">
                      {difficultySettings[difficulty].timeLimit} seconds
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xl font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Start Challenge
                  </button>
                </div>
              )}

              {/* Countdown Phase */}
              {gamePhase === 'countdown' && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-8xl font-bold text-red-500 animate-pulse">
                    {countdown}
                  </div>
                  <p className="text-gray-600 mt-4">Get Ready!</p>
                </div>
              )}

              {/* Play Phase */}
              {gamePhase === 'play' && currentProblem && (
                <div className="space-y-6">
                  {/* Timer Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all duration-1000 ${
                          timeLeft <= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                        style={{ width: `${(timeLeft / difficultySettings[difficulty].timeLimit) * 100}%` }}
                      />
                    </div>
                    <div className={`absolute right-0 top-5 text-2xl font-bold ${
                      timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'
                    }`}>
                      {timeLeft}s
                    </div>
                  </div>

                  {/* Problem Display */}
                  <div
                    className={`text-center py-12 rounded-2xl transition-all ${
                      feedback === 'correct' ? 'bg-green-100' :
                      feedback === 'wrong' ? 'bg-red-100' :
                      'bg-gradient-to-br from-red-50 to-orange-50'
                    }`}
                  >
                    <div className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
                      {currentProblem.display} = ?
                    </div>
                  </div>

                  {/* Answer Input */}
                  <div className="flex gap-3">
                    <input
                      ref={inputRef}
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 text-4xl text-center p-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
                      placeholder="?"
                      autoFocus
                    />
                    <button
                      onClick={submitAnswer}
                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xl font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all"
                    >
                      Go!
                    </button>
                  </div>

                  {/* Live Score & Streak */}
                  <div className="flex justify-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{score}</div>
                      <div className="text-sm text-gray-500">Score</div>
                    </div>
                    {streak > 0 && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">{streak} 🔥</div>
                        <div className="text-sm text-gray-500">Streak</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{problemsSolved}</div>
                      <div className="text-sm text-gray-500">Solved</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Phase */}
              {gamePhase === 'result' && (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">
                    {score >= 300 ? '🏆' : score >= 150 ? '🎉' : '💪'}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800">
                    {getScoreGrade().label}
                  </h2>

                  <div className={`text-8xl font-bold ${getScoreGrade().color}`}>
                    {getScoreGrade().grade}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-red-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-red-600">{score}</div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-green-600">{problemsSolved}</div>
                      <div className="text-sm text-gray-600">Correct</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-orange-600">{maxStreak}</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>

                  {score > stats.bestScore && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
                      <span>🎖️</span>
                      <span className="font-bold text-yellow-700">New High Score!</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setGamePhase('menu')}
                      className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Change Difficulty
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <strong>Choose Difficulty</strong>
                    <p className="text-sm text-gray-600">Select a level that matches your skill</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <strong>Solve Fast</strong>
                    <p className="text-sm text-gray-600">Type your answer and press Enter</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <strong>Build Streaks</strong>
                    <p className="text-sm text-gray-600">Consecutive correct answers = bonus points!</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <strong>Beat the Clock</strong>
                    <p className="text-sm text-gray-600">Solve as many as you can before time's up</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Press Enter immediately after typing - don't reach for the button!</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Memorize multiplication tables for instant answers</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Don't panic on wrong answers - just move on quickly</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Accuracy matters! Streaks give huge bonus points</span>
                </li>
              </ul>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6">
              <FirebaseFAQs pageId="speed-math" fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
{/* Sidebar */}
          <div className="lg:w-[320px] space-y-6">
            {/* Ad Banner */}
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<AdBanner className="mx-auto" />

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span> Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-bold text-gray-800">{stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Score</span>
                  <span className="font-bold text-red-600">{stats.bestScore}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="font-bold text-orange-600">{stats.bestStreak}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Correct</span>
                  <span className="font-bold text-green-600">{stats.totalCorrect}</span>
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
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {renderIcon(game.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                        {game.title}
                      </div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-red-500 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
          </div>
        </div>
      </div>
    </>
  );
}
