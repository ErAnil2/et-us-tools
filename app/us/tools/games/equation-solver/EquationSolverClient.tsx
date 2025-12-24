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

interface EquationSolverClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Question {
  equation: string;
  answer: number;
  steps: string[];
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
    question: "What types of equations can I practice?",
    answer: "Easy level has simple equations like x + 5 = 12. Medium level has two-step equations like 3x + 7 = 22. Hard level has variables on both sides like 4x + 3 = 2x + 11.",
    order: 1
  },
  {
    id: '2',
    question: "How do I solve algebraic equations?",
    answer: "The goal is to isolate x. Use inverse operations: subtract to undo addition, divide to undo multiplication. Keep the equation balanced by doing the same operation to both sides.",
    order: 2
  },
  {
    id: '3',
    question: "Why are solution steps shown?",
    answer: "Seeing the step-by-step solution helps you understand the process, even if you got the answer right. This reinforces proper algebraic technique and helps you solve harder equations.",
    order: 3
  },
  {
    id: '4',
    question: "How can I improve at algebra?",
    answer: "Practice regularly, start with easy equations and progress gradually. Focus on understanding WHY each step works, not just memorizing procedures. The solution steps help with this.",
    order: 4
  }
];

export default function EquationSolverClient({ relatedGames = defaultRelatedGames }: EquationSolverClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestStreak: 0
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const { getH1, getSubHeading } = usePageSEO('equation-solver');

  const webAppSchema = generateWebAppSchema({
    name: 'Equation Solver Game',
    description: 'Practice solving algebraic equations step by step',
    url: typeof window !== 'undefined' ? window.location.href : ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('equationSolverStats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const saveStats = (newStats: Stats) => {
    setStats(newStats);
    localStorage.setItem('equationSolverStats', JSON.stringify(newStats));
  };

  const generateEasyEquation = (): Question => {
    const x = Math.floor(Math.random() * 20) + 1;
    const a = Math.floor(Math.random() * 20) + 1;
    const b = x + a;

    return {
      equation: `x + ${a} = ${b}`,
      answer: x,
      steps: [
        `x + ${a} = ${b}`,
        `x + ${a} - ${a} = ${b} - ${a}`,
        `x = ${x}`
      ]
    };
  };

  const generateMediumEquation = (): Question => {
    const x = Math.floor(Math.random() * 15) + 1;
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 20) + 1;
    const c = a * x + b;

    return {
      equation: `${a}x + ${b} = ${c}`,
      answer: x,
      steps: [
        `${a}x + ${b} = ${c}`,
        `${a}x + ${b} - ${b} = ${c} - ${b}`,
        `${a}x = ${c - b}`,
        `x = ${c - b} ÷ ${a}`,
        `x = ${x}`
      ]
    };
  };

  const generateHardEquation = (): Question => {
    const x = Math.floor(Math.random() * 10) + 1;
    const a = Math.floor(Math.random() * 5) + 2;
    let c = Math.floor(Math.random() * 4) + 1;
    if (c >= a) c = a - 1;
    if (c <= 0) c = 1;

    const b = Math.floor(Math.random() * 10) + 1;
    const d = a * x + b - c * x;

    return {
      equation: `${a}x + ${b} = ${c}x + ${d}`,
      answer: x,
      steps: [
        `${a}x + ${b} = ${c}x + ${d}`,
        `${a}x - ${c}x + ${b} = ${d}`,
        `${a - c}x + ${b} = ${d}`,
        `${a - c}x = ${d} - ${b}`,
        `${a - c}x = ${d - b}`,
        `x = ${d - b} ÷ ${a - c}`,
        `x = ${x}`
      ]
    };
  };

  const generateQuestions = (count: number): Question[] => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < count; i++) {
      switch (difficulty) {
        case 'easy': newQuestions.push(generateEasyEquation()); break;
        case 'medium': newQuestions.push(generateMediumEquation()); break;
        case 'hard': newQuestions.push(generateHardEquation()); break;
      }
    }
    return newQuestions;
  };

  const startGame = () => {
    const newQuestions = generateQuestions(questionCount);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setStreak(0);
    setMaxStreak(0);
    setUserAnswer('');
    setShowFeedback(false);
    setGamePhase('play');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const submitAnswer = () => {
    const answer = parseFloat(userAnswer);
    if (isNaN(answer)) return;

    const correct = Math.abs(answer - questions[currentIndex].answer) < 0.01;
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-rose-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">📐</span>
            <span className="text-red-700 font-semibold">Algebra Practice</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-2">{getH1('Equation Solver')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Practice solving algebraic equations. Find the value of x with step-by-step solutions!
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
                              ? 'border-red-500 bg-red-50 shadow-md'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">
                            {diff === 'easy' ? '🌱' : diff === 'medium' ? '🌿' : '🌳'}
                          </div>
                          <div className="font-semibold text-gray-800 capitalize">{diff}</div>
                          <div className="text-xs text-gray-500">
                            {diff === 'easy' ? 'x + a = b' : diff === 'medium' ? 'ax + b = c' : 'ax + b = cx + d'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Count */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Number of Questions</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[5, 10, 15].map((count) => (
                        <button
                          key={count}
                          onClick={() => setQuestionCount(count)}
                          className={`p-3 rounded-xl border-2 font-bold transition-all ${
                            questionCount === count
                              ? 'border-red-500 bg-red-50 text-red-600'
                              : 'border-gray-200 text-gray-600 hover:border-red-300'
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
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xl font-bold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Start Solving
                  </button>
                </div>
              )}

              {/* Play Phase */}
              {gamePhase === 'play' && questions.length > 0 && (
                <div className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{currentIndex + 1} of {questionCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full transition-all"
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

                  {/* Equation */}
                  <div className={`py-8 rounded-2xl text-center transition-all ${
                    showFeedback ? (isCorrect ? 'bg-green-100' : 'bg-red-100') : 'bg-gradient-to-br from-red-50 to-rose-50'
                  }`}>
                    <div className="text-sm text-gray-600 mb-2">Solve for x:</div>
                    <div className="text-4xl md:text-5xl font-bold text-gray-800">
                      {questions[currentIndex].equation}
                    </div>
                  </div>

                  {/* Answer Input */}
                  {!showFeedback && (
                    <div className="space-y-4">
                      <div className="flex gap-3 max-w-md mx-auto">
                        <div className="text-2xl font-bold text-gray-700 flex items-center">x =</div>
                        <input
                          ref={inputRef}
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                          className="flex-1 text-3xl text-center p-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
                          placeholder="?"
                        />
                      </div>
                      <button
                        onClick={submitAnswer}
                        className="w-full max-w-md mx-auto block py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-600"
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className="space-y-4">
                      <div className="text-center text-xl font-bold">
                        {isCorrect ? (
                          <span className="text-green-600">✅ Correct! x = {questions[currentIndex].answer}</span>
                        ) : (
                          <span className="text-red-600">❌ Incorrect. x = {questions[currentIndex].answer}</span>
                        )}
                      </div>

                      {/* Solution Steps */}
                      <div className="bg-blue-50 rounded-xl p-4 max-w-md mx-auto">
                        <h4 className="font-bold text-blue-800 mb-2">Solution Steps:</h4>
                        <div className="space-y-1 text-blue-700 text-sm">
                          {questions[currentIndex].steps.map((step, i) => (
                            <div key={i}>{step}</div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={nextQuestion}
                        className="w-full max-w-md mx-auto block py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600"
                      >
                        {currentIndex + 1 >= questionCount ? 'See Results' : 'Next Question'}
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
                    {percentage >= 90 ? 'Algebra Master!' : percentage >= 70 ? 'Great Job!' : 'Keep Practicing!'}
                  </h2>

                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6">
                    <div className="text-5xl font-bold text-red-600 mb-2">{correctAnswers}/{questionCount}</div>
                    <div className="text-xl text-gray-700">{percentage}% Correct</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-600">{maxStreak}</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-purple-600 capitalize">{difficulty}</div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-600"
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
            <div className="mt-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Solve Equations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <strong>Isolate the Variable</strong>
                    <p className="text-sm text-gray-600">Get x alone on one side of the equation</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <strong>Use Inverse Operations</strong>
                    <p className="text-sm text-gray-600">Subtract to undo addition, divide to undo multiplication</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <strong>Keep Balance</strong>
                    <p className="text-sm text-gray-600">Whatever you do to one side, do to the other</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <strong>Check Your Answer</strong>
                    <p className="text-sm text-gray-600">Substitute x back into the original equation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6">
              <FirebaseFAQs pageId="equation-solver" fallbackFaqs={fallbackFaqs} />
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
                  <span className="font-bold text-red-600">
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
                      <div className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                        {game.title}
                      </div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-red-500">→</span>
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
