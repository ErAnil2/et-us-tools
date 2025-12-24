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

interface MentalMathClientProps {
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
  totalProblems: number;
  bestScore: number;
  bestStreak: number;
  fastestTime: number | null;
}

type GamePhase = 'menu' | 'countdown' | 'play' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GameMode = 'timed' | 'endless' | 'sprint';

const difficultySettings = {
  easy: {
    label: 'Easy',
    description: 'Single digits',
    minNum: 1,
    maxNum: 9,
    operators: ['+', '-'],
    timeBonus: 3,
    emoji: '🌱'
  },
  medium: {
    label: 'Medium',
    description: 'Double digits',
    minNum: 10,
    maxNum: 50,
    operators: ['+', '-', '×'],
    timeBonus: 4,
    emoji: '🌿'
  },
  hard: {
    label: 'Hard',
    description: 'Larger numbers',
    minNum: 10,
    maxNum: 100,
    operators: ['+', '-', '×', '÷'],
    timeBonus: 5,
    emoji: '🌳'
  },
  expert: {
    label: 'Expert',
    description: 'All operations',
    minNum: 50,
    maxNum: 200,
    operators: ['+', '-', '×', '÷'],
    timeBonus: 6,
    emoji: '🏆'
  }
};

const gameModes = {
  timed: {
    label: 'Timed',
    description: '60 seconds to solve as many as you can',
    emoji: '⏱️',
    duration: 60
  },
  endless: {
    label: 'Endless',
    description: 'Keep going until you make 3 mistakes',
    emoji: '♾️',
    lives: 3
  },
  sprint: {
    label: 'Sprint',
    description: 'Solve 20 problems as fast as possible',
    emoji: '🏃',
    target: 20
  }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "How does Mental Math help improve calculation skills?",
    answer: "Mental Math trains your brain to perform quick calculations without a calculator. Regular practice improves number sense, working memory, and processing speed, making everyday math tasks easier.",
    order: 1
  },
  {
    id: '2',
    question: "What are the different game modes in Mental Math?",
    answer: "There are three modes: Timed (60 seconds to solve as many problems as possible), Endless (keep going until 3 mistakes), and Sprint (solve 20 problems as fast as possible). Each mode challenges different aspects of mental calculation.",
    order: 2
  },
  {
    id: '3',
    question: "Which difficulty level should I start with?",
    answer: "Start with Easy (single-digit numbers with addition/subtraction) to build confidence. Progress to Medium for double digits, Hard for larger numbers with multiplication/division, and Expert for the ultimate challenge.",
    order: 3
  },
  {
    id: '4',
    question: "Are there any tips for faster mental math?",
    answer: "Focus on patterns and shortcuts: break numbers into parts (e.g., 48 + 35 = 48 + 30 + 5), memorize common products, and practice regularly. Speed comes with consistent practice and familiarity with number relationships.",
    order: 4
  }
];

export default function MentalMathClient({ relatedGames = defaultRelatedGames }: MentalMathClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('timed');

  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(3);
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalCorrect: 0,
    totalProblems: 0,
    bestScore: 0,
    bestStreak: 0,
    fastestTime: null
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { getH1, getSubHeading } = usePageSEO('mental-math');

  const webAppSchema = generateWebAppSchema({
    name: 'Mental Math Game',
    description: 'Train your brain with fast mental math exercises',
    url: typeof window !== 'undefined' ? window.location.href : ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('mentalMathStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const saveStats = (newStats: Stats) => {
    setStats(newStats);
    localStorage.setItem('mentalMathStats', JSON.stringify(newStats));
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
        num2 = Math.floor(Math.random() * (settings.maxNum / 2)) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        num2 = Math.floor(Math.random() * 12) + 2;
        answer = Math.floor(Math.random() * 20) + 1;
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
    setUserAnswer('');
    setFeedback(null);
    setShowAnswer(false);
    setEndTime(null);

    if (gameMode === 'timed') {
      setTimeLeft(60);
    } else if (gameMode === 'endless') {
      setLives(3);
      setTimeLeft(0);
    } else if (gameMode === 'sprint') {
      setTimeLeft(0);
    }
  };

  useEffect(() => {
    if (gamePhase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGamePhase('play');
        setStartTime(Date.now());
        setCurrentProblem(generateProblem());
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [gamePhase, countdown, generateProblem]);

  useEffect(() => {
    if (gamePhase === 'play' && gameMode === 'timed') {
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
  }, [gamePhase, gameMode]);

  useEffect(() => {
    if (gamePhase === 'play' && (gameMode === 'endless' || gameMode === 'sprint')) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gamePhase, gameMode]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGamePhase('result');
    const finalTime = Date.now();
    setEndTime(finalTime);

    const newStats = { ...stats };
    newStats.gamesPlayed++;
    newStats.totalCorrect += score;
    newStats.totalProblems += problemsSolved;

    if (score > newStats.bestScore) {
      newStats.bestScore = score;
    }

    if (maxStreak > newStats.bestStreak) {
      newStats.bestStreak = maxStreak;
    }

    if (gameMode === 'sprint' && problemsSolved >= 20) {
      const elapsedTime = Math.floor((finalTime - startTime) / 1000);
      if (!newStats.fastestTime || elapsedTime < newStats.fastestTime) {
        newStats.fastestTime = elapsedTime;
      }
    }

    saveStats(newStats);
  }, [stats, score, problemsSolved, maxStreak, gameMode, startTime]);

  const submitAnswer = () => {
    if (!currentProblem || userAnswer === '') return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentProblem.answer;

    setFeedback(isCorrect ? 'correct' : 'wrong');
    setShowAnswer(!isCorrect);

    if (isCorrect) {
      const basePoints = 10;
      const streakBonus = Math.min(streak, 10);
      const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2, expert: 3 }[difficulty];
      const points = Math.floor((basePoints + streakBonus) * difficultyMultiplier);

      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
      setProblemsSolved(prev => prev + 1);

      if (gameMode === 'timed') {
        setTimeLeft(prev => Math.min(prev + difficultySettings[difficulty].timeBonus, 90));
      }

      if (gameMode === 'sprint' && problemsSolved + 1 >= 20) {
        setTimeout(() => endGame(), 500);
        return;
      }
    } else {
      setStreak(0);

      if (gameMode === 'endless') {
        setLives(prev => {
          if (prev <= 1) {
            setTimeout(() => endGame(), 500);
            return 0;
          }
          return prev - 1;
        });
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setShowAnswer(false);
      setUserAnswer('');
      setCurrentProblem(generateProblem());
      inputRef.current?.focus();
    }, isCorrect ? 300 : 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreGrade = () => {
    if (score >= 500) return { grade: 'S', color: 'text-yellow-500', label: 'Math Genius!' };
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🧠</span>
            <span className="text-green-700 font-semibold">Brain Training</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">{getH1('Mental Math')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Train your brain with quick mental calculations. Choose your challenge and see how fast you can solve!
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
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{difficultySettings[diff].emoji}</div>
                          <div className="font-semibold text-gray-800">{difficultySettings[diff].label}</div>
                          <div className="text-xs text-gray-500">{difficultySettings[diff].description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Game Mode Selection */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Select Mode</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(Object.keys(gameModes) as GameMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setGameMode(mode)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            gameMode === mode
                              ? 'border-teal-500 bg-teal-50 shadow-md'
                              : 'border-gray-200 hover:border-teal-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{gameModes[mode].emoji}</span>
                            <div>
                              <div className="font-semibold text-gray-800">{gameModes[mode].label}</div>
                              <div className="text-xs text-gray-500">{gameModes[mode].description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Start Challenge
                  </button>
                </div>
              )}

              {/* Countdown Phase */}
              {gamePhase === 'countdown' && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-8xl font-bold text-green-500 animate-pulse">
                    {countdown}
                  </div>
                  <p className="text-gray-600 mt-4">Get Ready!</p>
                </div>
              )}

              {/* Play Phase */}
              {gamePhase === 'play' && currentProblem && (
                <div className="space-y-6">
                  {/* Game Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {gameMode === 'timed' && (
                        <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                          {formatTime(timeLeft)}
                        </div>
                      )}
                      {gameMode === 'endless' && (
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <span key={i} className={`text-2xl ${i < lives ? '' : 'opacity-30'}`}>
                              ❤️
                            </span>
                          ))}
                        </div>
                      )}
                      {(gameMode === 'endless' || gameMode === 'sprint') && (
                        <div className="text-gray-500">
                          {formatTime(timeLeft)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{score}</div>
                      <div className="text-xs text-gray-500">Points</div>
                    </div>
                  </div>

                  {/* Progress for Sprint */}
                  {gameMode === 'sprint' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${(problemsSolved / 20) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Problem Display */}
                  <div
                    className={`text-center py-12 rounded-2xl transition-all ${
                      feedback === 'correct' ? 'bg-green-100' :
                      feedback === 'wrong' ? 'bg-red-100' :
                      'bg-gradient-to-br from-green-50 to-teal-50'
                    }`}
                  >
                    <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                      {currentProblem.display} = ?
                    </div>
                    {showAnswer && (
                      <div className="text-xl text-red-600">
                        Correct answer: {currentProblem.answer}
                      </div>
                    )}
                  </div>

                  {/* Answer Input */}
                  <div className="flex gap-3">
                    <input
                      ref={inputRef}
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 text-3xl text-center p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                      placeholder="Your answer"
                      autoFocus
                    />
                    <button
                      onClick={submitAnswer}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all"
                    >
                      Submit
                    </button>
                  </div>

                  {/* Streak Display */}
                  {streak > 0 && (
                    <div className="text-center">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
                        <span className="text-xl">🔥</span>
                        <span className="font-bold text-orange-600">{streak} Streak!</span>
                      </span>
                    </div>
                  )}
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
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-green-600">{score}</div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-blue-600">{problemsSolved}</div>
                      <div className="text-sm text-gray-600">Solved</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-orange-600">{maxStreak}</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-purple-600">
                        {gameMode === 'timed' ? '60s' : formatTime(timeLeft)}
                      </div>
                      <div className="text-sm text-gray-600">Time</div>
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
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setGamePhase('menu')}
                      className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Change Settings
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <strong>Choose Your Challenge</strong>
                    <p className="text-sm text-gray-600">Pick a difficulty level and game mode that suits you</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <strong>Solve Problems</strong>
                    <p className="text-sm text-gray-600">Type your answer and press Enter or click Submit</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <strong>Build Streaks</strong>
                    <p className="text-sm text-gray-600">Consecutive correct answers give bonus points</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <strong>Beat Your Best</strong>
                    <p className="text-sm text-gray-600">Track your progress and aim for higher scores</p>
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
                  <span>Break large numbers into easier parts (e.g., 47 + 38 = 47 + 40 - 2)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Memorize multiplication tables up to 12 for faster calculations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>In Timed mode, correct answers add bonus seconds!</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Start with Easy to warm up, then increase difficulty</span>
                </li>
              </ul>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6">
              <FirebaseFAQs pageId="mental-math" fallbackFaqs={fallbackFaqs} />
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
                  <span className="font-bold text-green-600">{stats.bestScore}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="font-bold text-orange-600">{stats.bestStreak}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Problems Solved</span>
                  <span className="font-bold text-blue-600">{stats.totalCorrect}</span>
                </div>
                {stats.fastestTime && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Sprint Record</span>
                    <span className="font-bold text-purple-600">{formatTime(stats.fastestTime)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-bold text-teal-600">
                    {stats.totalProblems > 0
                      ? Math.round((stats.totalCorrect / stats.totalProblems) * 100)
                      : 0}%
                  </span>
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
                      <div className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                        {game.title}
                      </div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-green-500 transition-colors">→</span>
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
