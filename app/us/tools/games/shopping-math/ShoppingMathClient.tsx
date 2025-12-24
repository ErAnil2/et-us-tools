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

interface ShoppingMathClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

type Difficulty = 'easy' | 'medium' | 'hard';
type GamePhase = 'menu' | 'play' | 'result';
type ProblemType = 'discount' | 'tax' | 'tip' | 'total' | 'change' | 'comparison';

interface ShoppingProblem {
  question: string;
  answer: number;
  hint: string;
  type: ProblemType;
  items?: { name: string; price: number }[];
}

interface GameStats {
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestScore: number;
  fastestTime: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I calculate a percentage discount?",
    answer: "To find the discount amount, multiply the original price by the discount percentage (as a decimal). For example, 20% off $50 = $50 × 0.20 = $10 discount. The sale price is $50 - $10 = $40.",
    order: 1
  },
  {
    id: '2',
    question: "How do I calculate sales tax?",
    answer: "Multiply the pre-tax price by the tax rate (as a decimal) to get the tax amount. Then add it to the original price. For example, 8% tax on $25 = $25 × 0.08 = $2 tax. Total = $25 + $2 = $27.",
    order: 2
  },
  {
    id: '3',
    question: "How do I calculate a tip?",
    answer: "Multiply the bill amount by the tip percentage. For a 15% tip on $40: $40 × 0.15 = $6 tip. For quick mental math: 10% is easy (move decimal), then add half of that for 15%, or double it for 20%.",
    order: 3
  },
  {
    id: '4',
    question: "What real-world skills does this game teach?",
    answer: "This game teaches essential money math: calculating discounts during sales, figuring out taxes, determining appropriate tips at restaurants, making change, and comparing prices to find the best deal.",
    order: 4
  }
];

// Shopping problem generators
const generateEasyProblem = (): ShoppingProblem => {
  const templates = [
    // Simple discount
    () => {
      const price = [10, 15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 7)];
      const discountPercent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      const discountAmount = (price * discountPercent) / 100;
      return {
        question: `A t-shirt costs $${price}. It's ${discountPercent}% off. How much is the discount?`,
        answer: discountAmount,
        hint: `Multiply $${price} by ${discountPercent/100}`,
        type: 'discount' as ProblemType
      };
    },
    // Simple total
    () => {
      const items = [
        { name: 'apple', price: Math.floor(Math.random() * 3) + 1 },
        { name: 'banana', price: Math.floor(Math.random() * 2) + 1 },
        { name: 'orange', price: Math.floor(Math.random() * 3) + 1 }
      ];
      const total = items.reduce((sum, item) => sum + item.price, 0);
      return {
        question: `You buy an apple ($${items[0].price}), a banana ($${items[1].price}), and an orange ($${items[2].price}). What's the total?`,
        answer: total,
        hint: 'Add all the prices together',
        type: 'total' as ProblemType,
        items
      };
    },
    // Simple change
    () => {
      const price = Math.floor(Math.random() * 8) + 2;
      const paid = [10, 20][Math.floor(Math.random() * 2)];
      return {
        question: `Your snack costs $${price}. You pay with a $${paid} bill. How much change do you get?`,
        answer: paid - price,
        hint: `Subtract: $${paid} - $${price}`,
        type: 'change' as ProblemType
      };
    },
    // Simple multiplication
    () => {
      const price = Math.floor(Math.random() * 5) + 2;
      const quantity = Math.floor(Math.random() * 5) + 2;
      return {
        question: `Pencils cost $${price} each. How much do ${quantity} pencils cost?`,
        answer: price * quantity,
        hint: `Multiply: $${price} × ${quantity}`,
        type: 'total' as ProblemType
      };
    }
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
};

const generateMediumProblem = (): ShoppingProblem => {
  const templates = [
    // Tax calculation
    () => {
      const price = [15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 6)];
      const taxRate = [5, 8, 10][Math.floor(Math.random() * 3)];
      const tax = (price * taxRate) / 100;
      return {
        question: `A book costs $${price}. With ${taxRate}% sales tax, what is the tax amount?`,
        answer: tax,
        hint: `Tax = $${price} × ${taxRate/100}`,
        type: 'tax' as ProblemType
      };
    },
    // Tip calculation
    () => {
      const bill = [20, 25, 30, 40, 50, 60][Math.floor(Math.random() * 6)];
      const tipPercent = [15, 18, 20][Math.floor(Math.random() * 3)];
      const tip = (bill * tipPercent) / 100;
      return {
        question: `Your restaurant bill is $${bill}. You want to leave a ${tipPercent}% tip. How much is the tip?`,
        answer: tip,
        hint: `Tip = $${bill} × ${tipPercent/100}`,
        type: 'tip' as ProblemType
      };
    },
    // Discount sale price
    () => {
      const price = [40, 50, 60, 80, 100][Math.floor(Math.random() * 5)];
      const discountPercent = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
      const salePrice = price - (price * discountPercent) / 100;
      return {
        question: `A jacket is $${price} with ${discountPercent}% off. What is the sale price?`,
        answer: salePrice,
        hint: `First find discount, then subtract from original`,
        type: 'discount' as ProblemType
      };
    },
    // Price comparison
    () => {
      const priceA = Math.floor(Math.random() * 10) + 5;
      const quantityA = Math.floor(Math.random() * 3) + 2;
      const priceB = Math.floor(Math.random() * 10) + 5;
      const quantityB = Math.floor(Math.random() * 3) + 2;
      const unitPriceA = priceA / quantityA;
      const unitPriceB = priceB / quantityB;
      const betterDeal = unitPriceA < unitPriceB ? priceA : priceB;
      return {
        question: `Store A: ${quantityA} items for $${priceA}. Store B: ${quantityB} items for $${priceB}. Which store has the better unit price? (Enter the total price of better deal)`,
        answer: betterDeal,
        hint: 'Divide price by quantity for each store',
        type: 'comparison' as ProblemType
      };
    },
    // Multiple items with change
    () => {
      const item1 = Math.floor(Math.random() * 10) + 5;
      const item2 = Math.floor(Math.random() * 8) + 3;
      const total = item1 + item2;
      const paid = Math.ceil(total / 10) * 10 + 10;
      return {
        question: `You buy a sandwich ($${item1}) and a drink ($${item2}). You pay with $${paid}. How much change?`,
        answer: paid - total,
        hint: `Total = $${item1} + $${item2}, then subtract from $${paid}`,
        type: 'change' as ProblemType
      };
    }
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
};

const generateHardProblem = (): ShoppingProblem => {
  const templates = [
    // Discount then tax
    () => {
      const price = [50, 60, 75, 80, 100][Math.floor(Math.random() * 5)];
      const discount = [10, 15, 20][Math.floor(Math.random() * 3)];
      const tax = [8, 10][Math.floor(Math.random() * 2)];
      const afterDiscount = price - (price * discount / 100);
      const finalPrice = afterDiscount + (afterDiscount * tax / 100);
      return {
        question: `Shoes cost $${price}. They're ${discount}% off, then ${tax}% tax is added. What's the final price?`,
        answer: Math.round(finalPrice * 100) / 100,
        hint: 'Apply discount first, then add tax to discounted price',
        type: 'discount' as ProblemType
      };
    },
    // Bill split with tip
    () => {
      const bill = [60, 80, 100, 120][Math.floor(Math.random() * 4)];
      const tipPercent = [15, 18, 20][Math.floor(Math.random() * 3)];
      const people = [2, 3, 4][Math.floor(Math.random() * 3)];
      const totalWithTip = bill + (bill * tipPercent / 100);
      const perPerson = totalWithTip / people;
      return {
        question: `A $${bill} dinner bill with ${tipPercent}% tip is split ${people} ways. How much does each person pay?`,
        answer: Math.round(perPerson * 100) / 100,
        hint: 'Add tip to bill, then divide by people',
        type: 'tip' as ProblemType
      };
    },
    // Bulk discount
    () => {
      const unitPrice = Math.floor(Math.random() * 5) + 3;
      const quantity = Math.floor(Math.random() * 6) + 5;
      const bulkDiscount = [10, 15, 20][Math.floor(Math.random() * 3)];
      const normalTotal = unitPrice * quantity;
      const discountedTotal = normalTotal - (normalTotal * bulkDiscount / 100);
      return {
        question: `Items are $${unitPrice} each. Buy ${quantity} items and get ${bulkDiscount}% off the total. What do you pay?`,
        answer: discountedTotal,
        hint: 'Calculate total first, then apply percentage discount',
        type: 'discount' as ProblemType
      };
    },
    // Savings comparison
    () => {
      const originalPrice = [80, 100, 120, 150][Math.floor(Math.random() * 4)];
      const percentOff = [20, 25, 30][Math.floor(Math.random() * 3)];
      const dollarOff = Math.floor(originalPrice * (percentOff - 5) / 100);
      const priceWithPercent = originalPrice - (originalPrice * percentOff / 100);
      const priceWithDollar = originalPrice - dollarOff;
      const savings = Math.abs(priceWithPercent - priceWithDollar);
      return {
        question: `Item costs $${originalPrice}. Coupon A: ${percentOff}% off. Coupon B: $${dollarOff} off. How much more do you save with the better coupon?`,
        answer: savings,
        hint: 'Calculate final price with each coupon, find the difference',
        type: 'comparison' as ProblemType
      };
    },
    // Tax on discounted items
    () => {
      const item1Price = [30, 40, 50][Math.floor(Math.random() * 3)];
      const item2Price = [20, 25, 30][Math.floor(Math.random() * 3)];
      const discount = [15, 20, 25][Math.floor(Math.random() * 3)];
      const taxRate = 8;
      const subtotal = item1Price + item2Price;
      const afterDiscount = subtotal - (subtotal * discount / 100);
      const finalTotal = afterDiscount + (afterDiscount * taxRate / 100);
      return {
        question: `You buy items at $${item1Price} and $${item2Price}. Get ${discount}% off, then ${taxRate}% tax. What's the final total?`,
        answer: Math.round(finalTotal * 100) / 100,
        hint: 'Add items, apply discount, then add tax',
        type: 'tax' as ProblemType
      };
    }
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
};

export default function ShoppingMathClient({ relatedGames = defaultRelatedGames }: ShoppingMathClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentProblem, setCurrentProblem] = useState<ShoppingProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions] = useState(10);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
    fastestTime: 0
  });

  const { getH1, getSubHeading } = usePageSEO('shopping-math');

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('shoppingMathStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gamePhase === 'play' && startTime > 0) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gamePhase, startTime]);

  // Save stats to localStorage
  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('shoppingMathStats', JSON.stringify(newStats));
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
    setCorrectAnswers(0);
    setHintsUsed(0);
    setFeedback(null);
    setShowHint(false);
    setUserAnswer('');
    setStartTime(Date.now());
    setElapsedTime(0);
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
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({ correct: true, message: `Correct! +${points} points` });
    } else {
      setFeedback({ correct: false, message: `The answer was $${currentProblem.answer.toFixed(2)}` });
    }

    // Move to next question after delay
    setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        // End game
        const finalScore = isCorrect ? score + (showHint ? 5 : 10) : score;
        const finalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
        const gameTime = Math.floor((Date.now() - startTime) / 1000);

        const newStats: GameStats = {
          gamesPlayed: stats.gamesPlayed + 1,
          totalCorrect: stats.totalCorrect + finalCorrect,
          totalQuestions: stats.totalQuestions + totalQuestions,
          bestScore: Math.max(stats.bestScore, finalScore),
          fastestTime: stats.fastestTime === 0 ? gameTime : Math.min(stats.fastestTime, gameTime)
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: ProblemType) => {
    const colors = {
      discount: 'bg-red-100 text-red-700',
      tax: 'bg-blue-100 text-blue-700',
      tip: 'bg-green-100 text-green-700',
      total: 'bg-purple-100 text-purple-700',
      change: 'bg-orange-100 text-orange-700',
      comparison: 'bg-pink-100 text-pink-700'
    };
    return colors[type];
  };

  const getTypeLabel = (type: ProblemType) => {
    const labels = {
      discount: 'Discount',
      tax: 'Sales Tax',
      tip: 'Tip',
      total: 'Total',
      change: 'Change',
      comparison: 'Compare'
    };
    return labels[type];
  };

  const difficultySettings = {
    easy: { label: 'Easy', color: 'from-green-500 to-emerald-500', description: 'Basic calculations' },
    medium: { label: 'Medium', color: 'from-yellow-500 to-amber-500', description: 'Tax, tips & discounts' },
    hard: { label: 'Hard', color: 'from-red-500 to-rose-500', description: 'Multi-step problems' }
  };

  const getPerformance = () => {
    const percentage = (score / (totalQuestions * 10)) * 100;
    if (percentage >= 90) return { emoji: '🛒', title: 'Shopping Expert!', subtitle: 'You\'ll never overpay!' };
    if (percentage >= 70) return { emoji: '💰', title: 'Smart Shopper!', subtitle: 'Great money skills!' };
    if (percentage >= 50) return { emoji: '🧾', title: 'Good Work!', subtitle: 'Keep practicing!' };
    return { emoji: '📝', title: 'Keep Learning!', subtitle: 'Practice makes perfect!' };
  };

  const webAppSchema = generateWebAppSchema({
    name: 'Shopping Math Game',
    description: 'Practice real-world math with discounts, taxes, tips, and shopping scenarios',
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
              <span className="text-2xl">🛒</span>
              <span className="text-green-700 font-semibold">Shopping Math Game</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">{getH1('Master Shopping Math')}</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Calculate discounts, taxes, tips, and more in real-world shopping scenarios!
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
                                ? 'border-green-500 bg-green-50 scale-105 shadow-lg'
                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
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
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      🛒 Start Shopping
                    </button>

                    {/* How to Play */}
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 text-left">
                      <h3 className="font-bold text-green-800 mb-4 text-center">What You'll Learn</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                        <div className="flex gap-2">
                          <span>🏷️</span>
                          <span>Calculate percentage discounts</span>
                        </div>
                        <div className="flex gap-2">
                          <span>🧾</span>
                          <span>Figure out sales tax</span>
                        </div>
                        <div className="flex gap-2">
                          <span>💵</span>
                          <span>Determine tips at restaurants</span>
                        </div>
                        <div className="flex gap-2">
                          <span>🔄</span>
                          <span>Make change and compare prices</span>
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
                        <span>Time: {formatTime(elapsedTime)}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">{score}</div>
                        <div className="text-xs text-green-700">Score</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{correctAnswers}/{questionNumber - 1}</div>
                        <div className="text-xs text-blue-700">Correct</div>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">{hintsUsed}</div>
                        <div className="text-xs text-orange-700">Hints</div>
                      </div>
                    </div>

                    {/* Problem Display */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(currentProblem.type)}`}>
                          {getTypeLabel(currentProblem.type)}
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
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="0.00"
                          disabled={!!feedback}
                          className="w-full pl-8 pr-4 py-3 text-xl text-center border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:bg-gray-100"
                        />
                      </div>
                      <button
                        onClick={submitAnswer}
                        disabled={!userAnswer || !!feedback}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                      <div className="text-5xl font-bold text-green-600 mb-2">
                        {score}/{totalQuestions * 10}
                      </div>
                      <div className="text-gray-600 mb-4">Final Score</div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                          <div className="text-xs text-gray-500">Correct</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{formatTime(elapsedTime)}</div>
                          <div className="text-xs text-gray-500">Time</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">{hintsUsed}</div>
                          <div className="text-xs text-gray-500">Hints</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all"
                      >
                        🛒 Play Again
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
                  pageId="shopping-math"
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
                    <span className="font-bold text-blue-600">{stats.bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fastest Game</span>
                    <span className="font-bold text-orange-600">
                      {stats.fastestTime > 0 ? formatTime(stats.fastestTime) : '-'}
                    </span>
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
                      localStorage.removeItem('shoppingMathStats');
                      setStats({ gamesPlayed: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, fastestTime: 0 });
                    }}
                    className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Reset Stats
                  </button>
                )}
              </div>

              {/* Quick Reference */}
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-5">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">📋</span> Quick Reference
                </h3>
                <div className="text-sm text-green-700 space-y-2">
                  <div><strong>10% off:</strong> Divide by 10</div>
                  <div><strong>15% tip:</strong> 10% + half of 10%</div>
                  <div><strong>20% off:</strong> Divide by 5</div>
                  <div><strong>25% off:</strong> Divide by 4</div>
                  <div><strong>Tax:</strong> Price × Rate ÷ 100</div>
                </div>
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
