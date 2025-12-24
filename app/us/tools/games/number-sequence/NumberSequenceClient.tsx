'use client';

import { useState, useEffect, useRef } from 'react';
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

interface NumberSequenceClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Sequence {
  numbers: number[];
  answer: number;
  hint: string;
  pattern: string;
}

interface Stats {
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestStreak: number;
}

type GamePhase = 'menu' | 'play' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard';

const fallbackFaqs = [
  {
    id: '1',
    question: "What types of sequences are in this game?",
    answer: "Easy level has arithmetic sequences (constant addition). Medium adds geometric sequences (multiplication) and squared numbers. Hard includes Fibonacci-like patterns, triangular numbers, and more complex progressions.",
    order: 1
  },
  {
    id: '2',
    question: "How do I find the pattern in a sequence?",
    answer: "Look at the differences between consecutive numbers. If they're constant, it's arithmetic. If they double or triple, it's geometric. If differences increase by a fixed amount, try squared numbers.",
    order: 2
  },
  {
    id: '3',
    question: "What does the hint tell me?",
    answer: "The hint reveals the type of pattern (arithmetic, geometric, etc.) without giving the answer. Use it when stuck to narrow down your approach to finding the solution.",
    order: 3
  },
  {
    id: '4',
    question: "How can I improve at pattern recognition?",
    answer: "Practice regularly and learn common sequence types. Start by always calculating differences between numbers. Many patterns become obvious once you see the relationship between consecutive terms.",
    order: 4
  }
];

export default function NumberSequenceClient({ relatedGames = defaultRelatedGames }: NumberSequenceClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questionCount, setQuestionCount] = useState(10);

  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const [showHint, setShowHint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestStreak: 0
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const { getH1, getSubHeading } = usePageSEO('number-sequence');

  const webAppSchema = generateWebAppSchema({
    name: 'Number Sequence Game',
    description: 'Challenge your pattern recognition with mathematical sequences',
    url: typeof window !== 'undefined' ? window.location.href : ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('numberSequenceStats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const saveStats = (newStats: Stats) => {
    setStats(newStats);
    localStorage.setItem('numberSequenceStats', JSON.stringify(newStats));
  };

  // Sequence generators
  const generateArithmetic = (): Sequence => {
    const start = Math.floor(Math.random() * 20) + 1;
    const diff = Math.floor(Math.random() * 10) + 2;
    const numbers = [start, start + diff, start + 2 * diff, start + 3 * diff, start + 4 * diff];
    const answer = start + 5 * diff;
    return { numbers, answer, hint: `Add ${diff} each time`, pattern: 'Arithmetic (+' + diff + ')' };
  };

  const generateGeometric = (): Sequence => {
    const start = Math.floor(Math.random() * 5) + 1;
    const ratio = Math.floor(Math.random() * 3) + 2;
    const numbers = [start, start * ratio, start * ratio ** 2, start * ratio ** 3];
    const answer = start * ratio ** 4;
    return { numbers, answer, hint: `Multiply by ${ratio} each time`, pattern: 'Geometric (×' + ratio + ')' };
  };

  const generateSquares = (): Sequence => {
    const offset = Math.floor(Math.random() * 5);
    const numbers = [(1 + offset) ** 2, (2 + offset) ** 2, (3 + offset) ** 2, (4 + offset) ** 2, (5 + offset) ** 2];
    const answer = (6 + offset) ** 2;
    return { numbers, answer, hint: 'Square numbers pattern', pattern: 'Perfect squares' };
  };

  const generateTriangular = (): Sequence => {
    const triangular = (n: number) => (n * (n + 1)) / 2;
    const numbers = [triangular(1), triangular(2), triangular(3), triangular(4), triangular(5)];
    const answer = triangular(6);
    return { numbers, answer, hint: 'Sum of integers 1 to n', pattern: 'Triangular numbers' };
  };

  const generateFibonacciLike = (): Sequence => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    const numbers = [a, b, a + b, b + (a + b), (a + b) + (b + (a + b))];
    const answer = numbers[3] + numbers[4];
    return { numbers, answer, hint: 'Each number is sum of previous two', pattern: 'Fibonacci-like' };
  };

  const generateArithmeticDoubleStep = (): Sequence => {
    const start = Math.floor(Math.random() * 10) + 1;
    const diff1 = Math.floor(Math.random() * 5) + 1;
    const diff2 = Math.floor(Math.random() * 5) + 3;
    const numbers = [start, start + diff1, start + diff1 + diff2, start + 2 * diff1 + diff2, start + 2 * diff1 + 2 * diff2];
    const answer = start + 3 * diff1 + 2 * diff2;
    return { numbers, answer, hint: 'Alternating differences', pattern: 'Alternating +' + diff1 + '/+' + diff2 };
  };

  const generatePrimes = (): Sequence => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    const startIdx = Math.floor(Math.random() * 5);
    const numbers = primes.slice(startIdx, startIdx + 5);
    const answer = primes[startIdx + 5];
    return { numbers, answer, hint: 'Prime numbers', pattern: 'Prime sequence' };
  };

  const generateSequences = (count: number): Sequence[] => {
    const newSequences: Sequence[] = [];
    const generators = {
      easy: [generateArithmetic],
      medium: [generateArithmetic, generateGeometric, generateSquares],
      hard: [generateGeometric, generateSquares, generateTriangular, generateFibonacciLike, generateArithmeticDoubleStep, generatePrimes]
    };

    const availableGenerators = generators[difficulty];

    for (let i = 0; i < count; i++) {
      const generator = availableGenerators[Math.floor(Math.random() * availableGenerators.length)];
      newSequences.push(generator());
    }

    return newSequences;
  };

  const startGame = () => {
    const newSequences = generateSequences(questionCount);
    setSequences(newSequences);
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setStreak(0);
    setMaxStreak(0);
    setHintsUsed(0);
    setUserAnswer('');
    setShowHint(false);
    setShowFeedback(false);
    setGamePhase('play');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(h => h + 1);
  };

  const submitAnswer = () => {
    const answer = parseInt(userAnswer);
    if (isNaN(answer)) return;

    const correct = answer === sequences[currentIndex].answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectAnswers(c => c + 1);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questionCount) {
      endGame();
    } else {
      setCurrentIndex(i => i + 1);
      setUserAnswer('');
      setShowHint(false);
      setShowFeedback(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const endGame = () => {
    setGamePhase('result');

    const newStats = { ...stats };
    newStats.gamesPlayed++;
    newStats.totalCorrect += correctAnswers;
    newStats.totalQuestions += questionCount;
    if (maxStreak > newStats.bestStreak) newStats.bestStreak = maxStreak;

    saveStats(newStats);
  };

  const percentage = questionCount > 0 ? Math.round((correctAnswers / questionCount) * 100) : 0;

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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-violet-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🔢</span>
            <span className="text-indigo-700 font-semibold">Pattern Recognition</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">{getH1('Number Sequence')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Find the pattern and predict the next number in the sequence!
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
                  {/* Difficulty */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Select Difficulty</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficulty(diff)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            difficulty === diff
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">
                            {diff === 'easy' ? '🌱' : diff === 'medium' ? '🌿' : '🌳'}
                          </div>
                          <div className="font-semibold text-gray-800 capitalize">{diff}</div>
                          <div className="text-xs text-gray-500">
                            {diff === 'easy' ? 'Arithmetic' : diff === 'medium' ? '+ Geometric' : '+ Complex'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Count */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Number of Sequences</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[5, 10, 15].map((count) => (
                        <button
                          key={count}
                          onClick={() => setQuestionCount(count)}
                          className={`p-3 rounded-xl border-2 font-bold transition-all ${
                            questionCount === count
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                              : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xl font-bold rounded-xl hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Start Challenge
                  </button>
                </div>
              )}

              {/* Play Phase */}
              {gamePhase === 'play' && sequences.length > 0 && (
                <div className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{currentIndex + 1} of {questionCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all"
                        style={{ width: `${((currentIndex + 1) / questionCount) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="flex justify-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                      <div className="text-sm text-gray-600">Correct</div>
                    </div>
                    {streak > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{streak} 🔥</div>
                        <div className="text-sm text-gray-600">Streak</div>
                      </div>
                    )}
                  </div>

                  {/* Sequence Display */}
                  <div className={`py-8 rounded-2xl text-center transition-all ${
                    showFeedback ? (isCorrect ? 'bg-green-100' : 'bg-red-100') : 'bg-gradient-to-br from-indigo-50 to-violet-50'
                  }`}>
                    <div className="text-sm text-gray-600 mb-4">Find the next number:</div>
                    <div className="flex justify-center items-center gap-3 flex-wrap px-4">
                      {sequences[currentIndex].numbers.map((num, i) => (
                        <div key={i} className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center text-xl font-bold text-indigo-700 border-2 border-indigo-200">
                          {num}
                        </div>
                      ))}
                      <div className="w-14 h-14 bg-indigo-100 rounded-xl border-2 border-dashed border-indigo-400 flex items-center justify-center text-2xl font-bold text-indigo-500">
                        ?
                      </div>
                    </div>
                    {showHint && !showFeedback && (
                      <div className="mt-4 text-indigo-600 text-sm">
                        💡 Hint: {sequences[currentIndex].hint}
                      </div>
                    )}
                    {showFeedback && (
                      <div className="mt-4 text-gray-700">
                        Pattern: <span className="font-semibold">{sequences[currentIndex].pattern}</span>
                      </div>
                    )}
                  </div>

                  {/* Answer Input */}
                  {!showFeedback && (
                    <div className="space-y-4">
                      <div className="flex gap-3 max-w-md mx-auto">
                        <input
                          ref={inputRef}
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                          className="flex-1 text-3xl text-center p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none"
                          placeholder="?"
                        />
                        <button
                          onClick={submitAnswer}
                          className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-violet-600"
                        >
                          Check
                        </button>
                      </div>
                      {!showHint && (
                        <button
                          onClick={useHint}
                          className="mx-auto block px-6 py-2 bg-amber-100 text-amber-700 font-semibold rounded-xl hover:bg-amber-200"
                        >
                          💡 Use Hint
                        </button>
                      )}
                    </div>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className="space-y-4">
                      <div className="text-center text-xl font-bold">
                        {isCorrect ? (
                          <span className="text-green-600">✅ Correct! The answer is {sequences[currentIndex].answer}</span>
                        ) : (
                          <span className="text-red-600">❌ Incorrect. The answer is {sequences[currentIndex].answer}</span>
                        )}
                      </div>
                      <button
                        onClick={nextQuestion}
                        className="w-full max-w-md mx-auto block py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600"
                      >
                        {currentIndex + 1 >= questionCount ? 'See Results' : 'Next Sequence'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Result Phase */}
              {gamePhase === 'result' && (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">
                    {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : '💪'}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800">
                    {percentage >= 90 ? 'Pattern Master!' : percentage >= 70 ? 'Great Job!' : 'Keep Practicing!'}
                  </h2>

                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-6">
                    <div className="text-5xl font-bold text-indigo-600 mb-2">{correctAnswers}/{questionCount}</div>
                    <div className="text-xl text-gray-700">{percentage}% Correct</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-600">{maxStreak}</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-amber-600">{hintsUsed}</div>
                      <div className="text-sm text-gray-600">Hints Used</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-purple-600 capitalize">{difficulty}</div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-violet-600"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setGamePhase('menu')}
                      className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
                    >
                      Change Settings
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Common Sequence Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex gap-3">
                  <span className="text-2xl">➕</span>
                  <div>
                    <strong>Arithmetic</strong>
                    <p className="text-sm text-gray-600">Add same number each time (2, 5, 8, 11...)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">✖️</span>
                  <div>
                    <strong>Geometric</strong>
                    <p className="text-sm text-gray-600">Multiply by same number (2, 6, 18, 54...)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">²</span>
                  <div>
                    <strong>Square Numbers</strong>
                    <p className="text-sm text-gray-600">Perfect squares (1, 4, 9, 16, 25...)</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">🌀</span>
                  <div>
                    <strong>Fibonacci-like</strong>
                    <p className="text-sm text-gray-600">Sum of previous two (1, 1, 2, 3, 5...)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6">
              <FirebaseFAQs pageId="number-sequence" fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
{/* Sidebar */}
          <div className="lg:w-[320px] space-y-6">
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
                  <span className="text-gray-600">Total Correct</span>
                  <span className="font-bold text-green-600">{stats.totalCorrect}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="font-bold text-orange-600">{stats.bestStreak}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-bold text-indigo-600">
                    {stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0}%
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
                      <div className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {game.title}
                      </div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-indigo-500">→</span>
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
