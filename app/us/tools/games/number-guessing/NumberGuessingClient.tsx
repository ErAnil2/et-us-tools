'use client';

import { useState, useEffect, useCallback } from 'react';
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

interface NumberGuessingClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface GuessEntry {
  guess: number;
  feedback: {
    type: string;
    message: string;
  };
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GamePhase = 'menu' | 'play' | 'result';

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
  totalGuesses: number;
  perfectGames: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I play Number Guessing?",
    answer: "Select a difficulty level which determines the number range. The game picks a secret number, and you try to guess it. After each guess, you'll get hints telling you if your guess is too high, too low, or close. Use binary search strategy for optimal results!",
    order: 1
  },
  {
    id: '2',
    question: "What's the best strategy for guessing?",
    answer: "Use binary search! Start by guessing the middle of the range. If too high, guess the middle of the lower half. If too low, guess the middle of the upper half. This guarantees finding any number in log2(n) guesses - about 7 guesses for 1-100!",
    order: 2
  },
  {
    id: '3',
    question: "What do the different hints mean?",
    answer: "Very close (within 5) shows fire emoji, warming up (within 10) shows warm message, and far away shows cold/snowflake. The hints also tell you whether to guess higher or lower to narrow down your search.",
    order: 3
  },
  {
    id: '4',
    question: "How is the score calculated?",
    answer: "Your score is the number of attempts taken to find the number, plus a penalty of 2 points for each hint used. Lower scores are better! A perfect game uses the minimum possible guesses with no hints.",
    order: 4
  }
];

export default function NumberGuessingClient({ relatedGames = defaultRelatedGames }: NumberGuessingClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [secretNumber, setSecretNumber] = useState(0);
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessHistory, setGuessHistory] = useState<GuessEntry[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    totalGuesses: 0,
    perfectGames: 0
  });

  const { getH1, getSubHeading } = usePageSEO('number-guessing');

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('numberGuessingStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('numberGuessingStats', JSON.stringify(newStats));
  }, []);

  const difficultySettings: Record<Difficulty, { min: number; max: number; label: string; color: string; description: string }> = {
    easy: { min: 1, max: 50, label: 'Easy', color: 'from-green-500 to-emerald-500', description: 'Numbers 1-50 (6 guesses optimal)' },
    medium: { min: 1, max: 100, label: 'Medium', color: 'from-yellow-500 to-amber-500', description: 'Numbers 1-100 (7 guesses optimal)' },
    hard: { min: 1, max: 500, label: 'Hard', color: 'from-orange-500 to-red-500', description: 'Numbers 1-500 (9 guesses optimal)' },
    expert: { min: 1, max: 1000, label: 'Expert', color: 'from-red-500 to-rose-600', description: 'Numbers 1-1000 (10 guesses optimal)' }
  };

  const startGame = () => {
    const settings = difficultySettings[difficulty];
    setMinNumber(settings.min);
    setMaxNumber(settings.max);

    const newSecret = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    setSecretNumber(newSecret);

    setAttempts(0);
    setHintsUsed(0);
    setGuessHistory([]);
    setCurrentGuess('');
    setShowHint(false);
    setCurrentHint('');
    setGamePhase('play');
  };

  const getFeedback = (guess: number): { type: string; message: string } => {
    if (guess === secretNumber) {
      return { type: 'correct', message: 'Correct! You found it!' };
    }

    const diff = Math.abs(guess - secretNumber);
    const isLow = guess < secretNumber;

    if (diff <= 3) {
      return { type: isLow ? 'hot-low' : 'hot-high', message: `Burning hot! Go ${isLow ? 'higher' : 'lower'}!` };
    } else if (diff <= 10) {
      return { type: isLow ? 'warm-low' : 'warm-high', message: `Very warm! Try ${isLow ? 'higher' : 'lower'}!` };
    } else if (diff <= 25) {
      return { type: isLow ? 'cool-low' : 'cool-high', message: `Getting warmer! Go ${isLow ? 'higher' : 'lower'}!` };
    } else {
      return { type: isLow ? 'cold-low' : 'cold-high', message: `Cold! Think ${isLow ? 'much higher' : 'much lower'}!` };
    }
  };

  const submitGuess = () => {
    const guess = parseInt(currentGuess);

    if (isNaN(guess) || guess < minNumber || guess > maxNumber) {
      return;
    }

    const feedback = getFeedback(guess);
    const newHistory = [...guessHistory, { guess, feedback }];
    setGuessHistory(newHistory);
    setAttempts(attempts + 1);

    if (guess === secretNumber) {
      // Game won
      const score = attempts + 1 + (hintsUsed * 2);
      const optimalGuesses = Math.ceil(Math.log2(maxNumber - minNumber + 1));
      const isPerfect = attempts + 1 <= optimalGuesses && hintsUsed === 0;

      const newStats: GameStats = {
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + 1,
        bestScore: stats.bestScore === 0 ? score : Math.min(stats.bestScore, score),
        totalGuesses: stats.totalGuesses + attempts + 1,
        perfectGames: stats.perfectGames + (isPerfect ? 1 : 0)
      };
      saveStats(newStats);
      setGamePhase('result');
    } else {
      setCurrentGuess('');
    }
  };

  const getHint = () => {
    const hints = [
      `The number is ${secretNumber % 2 === 0 ? 'even' : 'odd'}`,
      `The number is ${secretNumber > (minNumber + maxNumber) / 2 ? 'in the upper half' : 'in the lower half'}`,
      `The sum of digits is ${secretNumber.toString().split('').reduce((sum, d) => sum + parseInt(d), 0)}`,
      `The number ${secretNumber % 5 === 0 ? 'is' : 'is NOT'} divisible by 5`,
      `The number ${secretNumber % 3 === 0 ? 'is' : 'is NOT'} divisible by 3`,
      `The last digit is ${secretNumber % 10}`
    ];

    // Pick a random hint that hasn't been shown
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    setCurrentHint(randomHint);
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
  };

  const getFeedbackStyle = (type: string): string => {
    if (type === 'correct') return 'bg-green-100 text-green-700 border-green-300';
    if (type.includes('hot')) return 'bg-red-100 text-red-700 border-red-300';
    if (type.includes('warm')) return 'bg-orange-100 text-orange-700 border-orange-300';
    if (type.includes('cool')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-blue-100 text-blue-700 border-blue-300';
  };

  const getFeedbackEmoji = (type: string): string => {
    if (type === 'correct') return '🎉';
    if (type.includes('hot')) return '🔥';
    if (type.includes('warm')) return '☀️';
    if (type.includes('cool')) return '🌤️';
    return '❄️';
  };

  const getPerformanceMessage = (): { title: string; subtitle: string; emoji: string } => {
    const optimalGuesses = Math.ceil(Math.log2(maxNumber - minNumber + 1));

    if (attempts <= optimalGuesses && hintsUsed === 0) {
      return { title: 'Perfect!', subtitle: 'Optimal binary search!', emoji: '🏆' };
    } else if (attempts <= optimalGuesses + 2) {
      return { title: 'Excellent!', subtitle: 'Great guessing strategy!', emoji: '🌟' };
    } else if (attempts <= optimalGuesses + 5) {
      return { title: 'Well Done!', subtitle: 'Good effort!', emoji: '👍' };
    } else {
      return { title: 'Keep Practicing!', subtitle: 'Try binary search next time!', emoji: '💪' };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitGuess();
    }
  };

  const webAppSchema = generateWebAppSchema({
    name: 'Number Guessing Game',
    description: 'Interactive number guessing game with binary search strategy and multiple difficulty levels',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-fuchsia-50">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-3">
              <span className="text-2xl">🔮</span>
              <span className="text-purple-700 font-semibold">Number Guessing Game</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{getH1('Guess the Secret Number')}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Use logic and binary search to find the hidden number in the fewest guesses!
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Difficulty</h2>

                    <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
                      {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => {
                        const settings = difficultySettings[diff];
                        return (
                          <button
                            key={diff}
                            onClick={() => setDifficulty(diff)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              difficulty === diff
                                ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                            }`}
                          >
                            <div className={`text-lg font-bold bg-gradient-to-r ${settings.color} bg-clip-text text-transparent`}>
                              {settings.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{settings.description}</div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={startGame}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      🎯 Start Game
                    </button>

                    {/* How to Play */}
                    <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-left">
                      <h3 className="font-bold text-purple-800 mb-4 text-center">How to Play</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700">
                        <div className="flex gap-2">
                          <span>🎯</span>
                          <span>Enter your guess and submit to see if you're right</span>
                        </div>
                        <div className="flex gap-2">
                          <span>🔥</span>
                          <span>Hot/cold feedback tells you how close you are</span>
                        </div>
                        <div className="flex gap-2">
                          <span>💡</span>
                          <span>Use hints if stuck (adds 2 to your score)</span>
                        </div>
                        <div className="flex gap-2">
                          <span>🏆</span>
                          <span>Try to find the number in optimal guesses!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Play Phase */}
                {gamePhase === 'play' && (
                  <div>
                    {/* Range Display */}
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6 text-center">
                      <div className="text-lg text-purple-800">
                        I'm thinking of a number between
                      </div>
                      <div className="text-3xl font-bold text-purple-600">
                        {minNumber} and {maxNumber}
                      </div>
                    </div>

                    {/* Game Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{attempts}</div>
                        <div className="text-xs text-blue-700">Guesses</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">{hintsUsed}</div>
                        <div className="text-xs text-purple-700">Hints</div>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-pink-600">
                          {Math.ceil(Math.log2(maxNumber - minNumber + 1))}
                        </div>
                        <div className="text-xs text-pink-700">Optimal</div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-3 mb-6">
                      <input
                        type="number"
                        value={currentGuess}
                        onChange={(e) => setCurrentGuess(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your guess..."
                        min={minNumber}
                        max={maxNumber}
                        className="flex-1 px-4 py-3 text-xl text-center border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      />
                      <button
                        onClick={submitGuess}
                        disabled={!currentGuess}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Guess
                      </button>
                    </div>

                    {/* Hint Button */}
                    <div className="text-center mb-6">
                      <button
                        onClick={getHint}
                        className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                      >
                        💡 Get Hint (+2 to score)
                      </button>
                    </div>

                    {/* Current Hint Display */}
                    {showHint && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 text-center">
                        <span className="text-yellow-800 font-medium">💡 {currentHint}</span>
                      </div>
                    )}

                    {/* Guess History */}
                    {guessHistory.length > 0 && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {[...guessHistory].reverse().map((entry, index) => (
                          <div
                            key={guessHistory.length - 1 - index}
                            className={`flex justify-between items-center p-3 rounded-xl border ${getFeedbackStyle(entry.feedback.type)}`}
                          >
                            <span className="font-bold">
                              #{guessHistory.length - index}: {entry.guess}
                            </span>
                            <span className="flex items-center gap-2">
                              {getFeedbackEmoji(entry.feedback.type)} {entry.feedback.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Back to Menu */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setGamePhase('menu')}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        ← Back to Menu
                      </button>
                    </div>
                  </div>
                )}

                {/* Result Phase */}
                {gamePhase === 'result' && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getPerformanceMessage().emoji}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {getPerformanceMessage().title}
                    </h2>
                    <p className="text-gray-600 mb-6">{getPerformanceMessage().subtitle}</p>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                      <div className="text-5xl font-bold text-purple-600 mb-2">
                        {secretNumber}
                      </div>
                      <div className="text-gray-600 mb-4">was the secret number</div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{attempts}</div>
                          <div className="text-xs text-gray-500">Guesses</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">{hintsUsed}</div>
                          <div className="text-xs text-gray-500">Hints</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {attempts + (hintsUsed * 2)}
                          </div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        🎯 Play Again
                      </button>
                      <button
                        onClick={() => setGamePhase('menu')}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                      >
                        Change Difficulty
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Ad Banner */}
              <div className="mt-6">
                <AdBanner />
              </div>

              {/* Mobile MREC2 - Before FAQs */}


              <GameAppMobileMrec2 />



              {/* FAQs Section */}
              <div className="mt-8">
                <FirebaseFAQs
                  pageId="number-guessing"
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
                    <span className="font-bold text-purple-600">{stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Games Won</span>
                    <span className="font-bold text-green-600">{stats.gamesWon}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-bold text-blue-600">
                      {stats.bestScore || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Perfect Games</span>
                    <span className="font-bold text-yellow-600">{stats.perfectGames}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg. Guesses</span>
                    <span className="font-bold text-pink-600">
                      {stats.gamesWon > 0 ? (stats.totalGuesses / stats.gamesWon).toFixed(1) : '-'}
                    </span>
                  </div>
                </div>
                {stats.gamesPlayed > 0 && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('numberGuessingStats');
                      setStats({ gamesPlayed: 0, gamesWon: 0, bestScore: 0, totalGuesses: 0, perfectGames: 0 });
                    }}
                    className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Reset Stats
                  </button>
                )}
              </div>

              {/* Binary Search Tip */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-5">
                <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span> Pro Tip
                </h3>
                <p className="text-sm text-purple-700">
                  <strong>Binary Search:</strong> Always guess the middle of the remaining range.
                  This guarantees finding any number from 1-100 in at most 7 guesses!
                </p>
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
                        {game.icon === 'puzzle' ? '🧩' : game.icon === 'memory' ? '🧠' : '🎮'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
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
