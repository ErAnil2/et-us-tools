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

interface WordMathClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'menu' | 'play' | 'result';

interface WordProblem {
  question: string;
  answer: number;
  hint: string;
  category: string;
}

interface GameStats {
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestScore: number;
  bestStreak: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I solve word math problems?",
    answer: "Read the problem carefully, identify the key numbers and operations (keywords like 'total', 'more than', 'less than', 'times'), translate the words into a math equation, and solve step by step. Look for clues like 'altogether' (addition) or 'left over' (subtraction).",
    order: 1
  },
  {
    id: '2',
    question: "What types of word problems are included?",
    answer: "The game includes various real-world scenarios: shopping calculations, time and distance problems, sharing and division scenarios, percentage calculations, and multi-step problems at higher difficulties.",
    order: 2
  },
  {
    id: '3',
    question: "What strategies help with word problems?",
    answer: "Key strategies include: underlining important numbers, circling operation keywords, drawing diagrams for complex problems, breaking multi-step problems into smaller parts, and checking if your answer makes sense in context.",
    order: 3
  },
  {
    id: '4',
    question: "How is the difficulty different between levels?",
    answer: "Easy level has single-step problems with small numbers. Medium introduces two-step problems and larger numbers. Hard features multi-step problems, decimals, percentages, and more complex scenarios requiring careful analysis.",
    order: 4
  }
];

// Word problem generators by difficulty
const generateEasyProblem = (): WordProblem => {
  const templates = [
    () => {
      const a = Math.floor(Math.random() * 20) + 5;
      const b = Math.floor(Math.random() * 15) + 3;
      return {
        question: `Sarah has ${a} apples. Her friend gives her ${b} more apples. How many apples does Sarah have now?`,
        answer: a + b,
        hint: "Add the two amounts together",
        category: "Addition"
      };
    },
    () => {
      const total = Math.floor(Math.random() * 30) + 15;
      const given = Math.floor(Math.random() * (total - 5)) + 3;
      return {
        question: `Tom had ${total} stickers. He gave ${given} stickers to his sister. How many stickers does Tom have left?`,
        answer: total - given,
        hint: "Subtract what was given away",
        category: "Subtraction"
      };
    },
    () => {
      const bags = Math.floor(Math.random() * 6) + 2;
      const candiesPerBag = Math.floor(Math.random() * 8) + 3;
      return {
        question: `There are ${bags} bags with ${candiesPerBag} candies in each bag. How many candies are there in total?`,
        answer: bags * candiesPerBag,
        hint: "Multiply bags by candies per bag",
        category: "Multiplication"
      };
    },
    () => {
      const friends = Math.floor(Math.random() * 5) + 2;
      const total = friends * (Math.floor(Math.random() * 6) + 2);
      return {
        question: `${total} cookies are shared equally among ${friends} friends. How many cookies does each friend get?`,
        answer: total / friends,
        hint: "Divide total by number of friends",
        category: "Division"
      };
    },
    () => {
      const price = Math.floor(Math.random() * 8) + 2;
      const quantity = Math.floor(Math.random() * 5) + 2;
      return {
        question: `Each pencil costs $${price}. How much do ${quantity} pencils cost?`,
        answer: price * quantity,
        hint: "Multiply price by quantity",
        category: "Money"
      };
    }
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
};

const generateMediumProblem = (): WordProblem => {
  const templates = [
    () => {
      const start = Math.floor(Math.random() * 50) + 30;
      const bought = Math.floor(Math.random() * 20) + 10;
      const sold = Math.floor(Math.random() * 15) + 5;
      return {
        question: `A store had ${start} books. They bought ${bought} more books and sold ${sold} books. How many books does the store have now?`,
        answer: start + bought - sold,
        hint: "Add what was bought, subtract what was sold",
        category: "Two-step"
      };
    },
    () => {
      const hourlyRate = Math.floor(Math.random() * 10) + 8;
      const hours = Math.floor(Math.random() * 6) + 3;
      const bonus = Math.floor(Math.random() * 15) + 5;
      return {
        question: `Alex earns $${hourlyRate} per hour. He worked ${hours} hours and received a $${bonus} bonus. How much did Alex earn in total?`,
        answer: (hourlyRate * hours) + bonus,
        hint: "Calculate hours × rate, then add bonus",
        category: "Money"
      };
    },
    () => {
      const boxes = Math.floor(Math.random() * 6) + 3;
      const itemsPerBox = Math.floor(Math.random() * 12) + 6;
      const extraItems = Math.floor(Math.random() * 10) + 5;
      return {
        question: `There are ${boxes} boxes with ${itemsPerBox} items each, plus ${extraItems} loose items. How many items are there in total?`,
        answer: (boxes * itemsPerBox) + extraItems,
        hint: "Multiply boxes × items, then add extras",
        category: "Two-step"
      };
    },
    () => {
      const people = Math.floor(Math.random() * 8) + 4;
      const costPerPerson = Math.floor(Math.random() * 15) + 10;
      return {
        question: `A group of ${people} people went to a movie. Each ticket costs $${costPerPerson}. They paid with a $${people * costPerPerson + Math.floor(Math.random() * 20) + 10} bill. How much was the total cost?`,
        answer: people * costPerPerson,
        hint: "Multiply people × ticket price",
        category: "Money"
      };
    },
    () => {
      const rows = Math.floor(Math.random() * 8) + 5;
      const seatsPerRow = Math.floor(Math.random() * 10) + 6;
      const emptySeats = Math.floor(Math.random() * 15) + 5;
      return {
        question: `A theater has ${rows} rows with ${seatsPerRow} seats in each row. If ${emptySeats} seats are empty, how many people are seated?`,
        answer: (rows * seatsPerRow) - emptySeats,
        hint: "Calculate total seats, subtract empty ones",
        category: "Two-step"
      };
    }
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
};

const generateHardProblem = (): WordProblem => {
  const templates = [
    () => {
      const originalPrice = Math.floor(Math.random() * 50) + 50;
      const discountPercent = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
      const discountAmount = (originalPrice * discountPercent) / 100;
      return {
        question: `A jacket originally costs $${originalPrice}. It's on sale for ${discountPercent}% off. How much is the discount amount?`,
        answer: discountAmount,
        hint: "Multiply price by discount percentage (as decimal)",
        category: "Percentages"
      };
    },
    () => {
      const distance = Math.floor(Math.random() * 100) + 50;
      const speed = [30, 40, 50, 60][Math.floor(Math.random() * 4)];
      const time = distance / speed;
      return {
        question: `A car travels ${distance} miles at a speed of ${speed} miles per hour. How many hours does the trip take?`,
        answer: time,
        hint: "Time = Distance ÷ Speed",
        category: "Distance"
      };
    },
    () => {
      const workers = Math.floor(Math.random() * 4) + 2;
      const days = Math.floor(Math.random() * 4) + 3;
      const hoursPerDay = Math.floor(Math.random() * 4) + 6;
      return {
        question: `If ${workers} workers each work ${hoursPerDay} hours per day for ${days} days, how many total work hours is that?`,
        answer: workers * hoursPerDay * days,
        hint: "Multiply: workers × hours × days",
        category: "Multi-step"
      };
    },
    () => {
      const length = Math.floor(Math.random() * 15) + 10;
      const width = Math.floor(Math.random() * 10) + 5;
      return {
        question: `A rectangular garden is ${length} meters long and ${width} meters wide. What is the perimeter of the garden?`,
        answer: 2 * (length + width),
        hint: "Perimeter = 2 × (length + width)",
        category: "Geometry"
      };
    },
    () => {
      const total = Math.floor(Math.random() * 100) + 50;
      const ratio1 = Math.floor(Math.random() * 3) + 2;
      const ratio2 = Math.floor(Math.random() * 3) + 1;
      const part1 = (total * ratio1) / (ratio1 + ratio2);
      return {
        question: `$${total} is divided between two people in the ratio ${ratio1}:${ratio2}. How much does the first person get?`,
        answer: part1,
        hint: "First find total parts, then calculate share",
        category: "Ratios"
      };
    },
    () => {
      const principal = [100, 200, 500, 1000][Math.floor(Math.random() * 4)];
      const rate = [5, 8, 10][Math.floor(Math.random() * 3)];
      const interest = (principal * rate) / 100;
      return {
        question: `If you invest $${principal} at ${rate}% simple interest for 1 year, how much interest do you earn?`,
        answer: interest,
        hint: "Interest = Principal × Rate ÷ 100",
        category: "Finance"
      };
    }
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
};

export default function WordMathClient({ relatedGames = defaultRelatedGames }: WordMathClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentProblem, setCurrentProblem] = useState<WordProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions] = useState(10);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
    bestStreak: 0
  });

  const { getH1, getSubHeading } = usePageSEO('word-math-game');

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wordMathStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('wordMathStats', JSON.stringify(newStats));
  }, []);

  const generateProblem = useCallback(() => {
    switch (difficulty) {
      case 'easy':
        return generateEasyProblem();
      case 'medium':
        return generateMediumProblem();
      case 'hard':
        return generateHardProblem();
      default:
        return generateEasyProblem();
    }
  }, [difficulty]);

  const startGame = () => {
    setScore(0);
    setQuestionNumber(1);
    setStreak(0);
    setHintsUsed(0);
    setFeedback(null);
    setShowHint(false);
    setUserAnswer('');
    setCurrentProblem(generateProblem());
    setGamePhase('play');
  };

  const submitAnswer = () => {
    if (!currentProblem) return;

    const numAnswer = parseFloat(userAnswer);
    const isCorrect = Math.abs(numAnswer - currentProblem.answer) < 0.01;

    if (isCorrect) {
      const points = showHint ? 5 : 10;
      setScore(score + points);
      setStreak(streak + 1);
      setFeedback({ correct: true, message: `Correct! +${points} points` });
    } else {
      setStreak(0);
      setFeedback({ correct: false, message: `The correct answer was ${currentProblem.answer}` });
    }

    // Move to next question after delay
    setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        // End game
        const finalScore = isCorrect ? score + (showHint ? 5 : 10) : score;
        const finalStreak = isCorrect ? streak + 1 : 0;

        const newStats: GameStats = {
          gamesPlayed: stats.gamesPlayed + 1,
          totalCorrect: stats.totalCorrect + (isCorrect ? 1 : 0) + score / 10,
          totalQuestions: stats.totalQuestions + totalQuestions,
          bestScore: Math.max(stats.bestScore, finalScore),
          bestStreak: Math.max(stats.bestStreak, finalStreak, streak)
        };
        saveStats(newStats);
        setGamePhase('result');
      } else {
        // Next question
        setQuestionNumber(questionNumber + 1);
        setCurrentProblem(generateProblem());
        setUserAnswer('');
        setShowHint(false);
        setFeedback(null);
      }
    }, 1500);
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !feedback) {
      submitAnswer();
    }
  };

  const difficultySettings = {
    easy: { label: 'Easy', color: 'from-green-500 to-emerald-500', description: 'Single-step problems' },
    medium: { label: 'Medium', color: 'from-yellow-500 to-amber-500', description: 'Two-step problems' },
    hard: { label: 'Hard', color: 'from-red-500 to-rose-500', description: 'Multi-step & percentages' }
  };

  const getPerformance = () => {
    const percentage = (score / (totalQuestions * 10)) * 100;
    if (percentage >= 90) return { emoji: '🏆', title: 'Outstanding!', subtitle: 'You\'re a word problem master!' };
    if (percentage >= 70) return { emoji: '🌟', title: 'Great Job!', subtitle: 'Excellent problem solving!' };
    if (percentage >= 50) return { emoji: '👍', title: 'Good Work!', subtitle: 'Keep practicing!' };
    return { emoji: '💪', title: 'Keep Learning!', subtitle: 'Practice makes perfect!' };
  };

  const webAppSchema = generateWebAppSchema({
    name: 'Word Math Game',
    description: 'Practice solving math word problems with real-world scenarios',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 px-4 py-2 rounded-full mb-3">
              <span className="text-2xl">📝</span>
              <span className="text-cyan-700 font-semibold">Word Math Game</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">{getH1('Solve Math Word Problems')}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Read carefully, think logically, and solve real-world math problems!
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                      {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => {
                        const settings = difficultySettings[diff];
                        return (
                          <button
                            key={diff}
                            onClick={() => setDifficulty(diff)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              difficulty === diff
                                ? 'border-cyan-500 bg-cyan-50 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
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
                      className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      📝 Start Game
                    </button>

                    {/* How to Play */}
                    <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 text-left">
                      <h3 className="font-bold text-cyan-800 mb-4 text-center">How to Play</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-cyan-700">
                        <div className="flex gap-2">
                          <span>📖</span>
                          <span>Read each word problem carefully</span>
                        </div>
                        <div className="flex gap-2">
                          <span>🔢</span>
                          <span>Identify the numbers and operations</span>
                        </div>
                        <div className="flex gap-2">
                          <span>💡</span>
                          <span>Use hints if you need help (less points)</span>
                        </div>
                        <div className="flex gap-2">
                          <span>⭐</span>
                          <span>Build streaks for bonus motivation!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Play Phase */}
                {gamePhase === 'play' && currentProblem && (
                  <div>
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Question {questionNumber} of {totalQuestions}</span>
                        <span>Score: {score}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-cyan-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-cyan-600">{score}</div>
                        <div className="text-xs text-cyan-700">Score</div>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">{streak}</div>
                        <div className="text-xs text-orange-700">Streak</div>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">{hintsUsed}</div>
                        <div className="text-xs text-purple-700">Hints</div>
                      </div>
                    </div>

                    {/* Problem Display */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-6">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-cyan-200 text-cyan-800 rounded-full">
                          {currentProblem.category}
                        </span>
                      </div>
                      <p className="text-lg text-gray-800 leading-relaxed">
                        {currentProblem.question}
                      </p>
                    </div>

                    {/* Hint Display */}
                    {showHint && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                        <span className="text-yellow-800">💡 Hint: {currentProblem.hint}</span>
                      </div>
                    )}

                    {/* Answer Input */}
                    <div className="flex gap-3 mb-4">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your answer..."
                        disabled={!!feedback}
                        className="flex-1 px-4 py-3 text-xl text-center border-2 border-cyan-200 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 disabled:bg-gray-100"
                      />
                      <button
                        onClick={submitAnswer}
                        disabled={!userAnswer || !!feedback}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Submit
                      </button>
                    </div>

                    {/* Hint Button */}
                    {!showHint && !feedback && (
                      <div className="text-center mb-4">
                        <button
                          onClick={useHint}
                          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                        >
                          💡 Show Hint (half points)
                        </button>
                      </div>
                    )}

                    {/* Feedback */}
                    {feedback && (
                      <div className={`p-4 rounded-xl text-center font-medium ${
                        feedback.correct
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-red-100 text-red-700 border-2 border-red-300'
                      }`}>
                        {feedback.correct ? '✓' : '✗'} {feedback.message}
                      </div>
                    )}

                    {/* Back to Menu */}
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setGamePhase('menu')}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        ← Quit Game
                      </button>
                    </div>
                  </div>
                )}

                {/* Result Phase */}
                {gamePhase === 'result' && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getPerformance().emoji}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {getPerformance().title}
                    </h2>
                    <p className="text-gray-600 mb-6">{getPerformance().subtitle}</p>

                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-6">
                      <div className="text-5xl font-bold text-cyan-600 mb-2">
                        {score}/{totalQuestions * 10}
                      </div>
                      <div className="text-gray-600 mb-4">Final Score</div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(score / 10)}
                          </div>
                          <div className="text-xs text-gray-500">Correct</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">{streak}</div>
                          <div className="text-xs text-gray-500">Best Streak</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{hintsUsed}</div>
                          <div className="text-xs text-gray-500">Hints Used</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:from-cyan-700 hover:to-blue-700 transition-all"
                      >
                        📝 Play Again
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
                <AdBanner slot="bottom" />
              </div>

              {/* Mobile MREC2 - Before FAQs */}


              <GameAppMobileMrec2 />



              {/* FAQs Section */}
              <div className="mt-8">
                <FirebaseFAQs
                  pageId="word-math-game"
                  fallbackFaqs={fallbackFaqs}
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
                    <span className="font-bold text-cyan-600">{stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-bold text-green-600">{stats.bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Streak</span>
                    <span className="font-bold text-orange-600">{stats.bestStreak}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="font-bold text-purple-600">
                      {stats.totalQuestions > 0
                        ? `${Math.round((stats.totalCorrect / stats.totalQuestions) * 100)}%`
                        : '-'}
                    </span>
                  </div>
                </div>
                {stats.gamesPlayed > 0 && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('wordMathStats');
                      setStats({ gamesPlayed: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, bestStreak: 0 });
                    }}
                    className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Reset Stats
                  </button>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-5">
                <h3 className="font-bold text-cyan-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span> Problem Solving Tips
                </h3>
                <ul className="text-sm text-cyan-700 space-y-2">
                  <li>• Look for keywords: "total", "more", "less"</li>
                  <li>• Underline important numbers</li>
                  <li>• Check if your answer makes sense</li>
                  <li>• Break complex problems into steps</li>
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
                        {game.icon === 'puzzle' ? '🧩' : game.icon === 'speed' ? '⚡' : '🎮'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-cyan-600 transition-colors">
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
