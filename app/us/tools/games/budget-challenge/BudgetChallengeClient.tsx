'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { MobileMrec1, MobileMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';
import MRECBanners from '@/components/MRECBanners';
interface Expense {
  name: string;
  cost: number;
}

interface Scenario {
  scenario: string;
  essential: Expense[];
  optional: Expense[];
}

interface Decision {
  name: string;
  cost: number;
  type: 'essential' | 'optional';
  month: number;
}

interface Stats {
  challengesWon: number;
  highestGrade: string;
  totalSaved: number;
}

type GameScreen = 'setup' | 'play' | 'results';
type Difficulty = 'easy' | 'medium' | 'hard';

const scenarioSets: Record<Difficulty, Scenario[]> = {
  easy: [
    {
      scenario: "You're starting college! You need to budget carefully as a student with part-time income.",
      essential: [
        { name: 'Dorm Room', cost: 400 },
        { name: 'Meal Plan', cost: 300 },
        { name: 'Textbooks', cost: 150 },
        { name: 'Phone Bill', cost: 50 }
      ],
      optional: [
        { name: 'Coffee Shop Visits', cost: 60 },
        { name: 'Movie Tickets', cost: 40 },
        { name: 'New Clothes', cost: 80 },
        { name: 'Gaming Subscription', cost: 15 }
      ]
    },
    {
      scenario: "Midterm season! You might need extra resources for studying and stress relief.",
      essential: [
        { name: 'Dorm Room', cost: 400 },
        { name: 'Meal Plan', cost: 300 },
        { name: 'Study Materials', cost: 75 },
        { name: 'Phone Bill', cost: 50 }
      ],
      optional: [
        { name: 'Tutoring Sessions', cost: 120 },
        { name: 'Stress Relief Activities', cost: 50 },
        { name: 'Extra Snacks', cost: 30 },
        { name: 'Energy Drinks', cost: 25 }
      ]
    }
  ],
  medium: [
    {
      scenario: "You've just started your new job! Plan your budget carefully to cover all essential expenses.",
      essential: [
        { name: 'Rent & Utilities', cost: 1200 },
        { name: 'Groceries', cost: 400 },
        { name: 'Car Payment', cost: 300 },
        { name: 'Insurance (Health/Auto)', cost: 250 },
        { name: 'Phone & Internet', cost: 100 }
      ],
      optional: [
        { name: 'Dining Out', cost: 200 },
        { name: 'Entertainment', cost: 150 },
        { name: 'Gym Membership', cost: 50 },
        { name: 'Shopping', cost: 180 },
        { name: 'Emergency Fund', cost: 300 }
      ]
    },
    {
      scenario: "Your car needs unexpected repairs, but you also have a friend's wedding to attend.",
      essential: [
        { name: 'Rent & Utilities', cost: 1200 },
        { name: 'Groceries', cost: 400 },
        { name: 'Car Repair', cost: 500 },
        { name: 'Insurance', cost: 250 },
        { name: 'Phone & Internet', cost: 100 }
      ],
      optional: [
        { name: 'Wedding Gift & Attire', cost: 200 },
        { name: 'Travel to Wedding', cost: 150 },
        { name: 'Dining Out', cost: 100 },
        { name: 'Emergency Fund', cost: 200 }
      ]
    }
  ],
  hard: [
    {
      scenario: "Managing a family budget requires careful planning. Balance everyone's needs while saving for the future.",
      essential: [
        { name: 'Mortgage & Utilities', cost: 2200 },
        { name: 'Groceries', cost: 800 },
        { name: 'Car Payments (2 cars)', cost: 600 },
        { name: 'Insurance (All types)', cost: 400 },
        { name: "Children's School Expenses", cost: 300 },
        { name: 'Phone & Internet', cost: 150 }
      ],
      optional: [
        { name: 'Family Entertainment', cost: 250 },
        { name: "Children's Activities", cost: 200 },
        { name: 'Date Nights', cost: 150 },
        { name: 'Home Improvements', cost: 300 },
        { name: 'College Savings', cost: 400 },
        { name: 'Emergency Fund', cost: 500 }
      ]
    }
  ]
};

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is the Budget Challenge game?',
    answer: 'Budget Challenge is an interactive game that teaches smart money management by making real-life budgeting decisions. You balance income, expenses, and savings goals across multiple months.',
    order: 1
  },
  {
    id: '2',
    question: 'What difficulty levels are available?',
    answer: 'Easy (Student Budget - $1,200/month), Medium (Young Professional - $3,500/month), and Hard (Family Budget - $6,000/month). Each level presents unique financial scenarios.',
    order: 2
  },
  {
    id: '3',
    question: 'How is my grade calculated?',
    answer: 'Your grade is based on your savings rate over the challenge duration. Save 15%+ of total income for A+, 10%+ for A, 5%+ for B+, breaking even for B, and overspending results in C.',
    order: 3
  },
  {
    id: '4',
    question: 'What is the 50/30/20 rule?',
    answer: 'The 50/30/20 rule suggests allocating 50% of income to needs (essentials), 30% to wants (optional), and 20% to savings. This game helps you practice this principle.',
    order: 4
  },
  {
    id: '5',
    question: 'Are my stats saved?',
    answer: 'Yes! Your challenges won, highest grade, and total saved are stored locally in your browser so you can track your progress over time.',
    order: 5
  }
];

export default function BudgetChallengeClient() {
  const [gameScreen, setGameScreen] = useState<GameScreen>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [duration, setDuration] = useState(3);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [balance, setBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [paidExpenses, setPaidExpenses] = useState<Set<string>>(new Set());
  const [showMonthlyResults, setShowMonthlyResults] = useState(false);
  const [stats, setStats] = useState<Stats>({ challengesWon: 0, highestGrade: '--', totalSaved: 0 });

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('budget-challenge');

  const webAppSchema = generateWebAppSchema({
    name: 'Budget Challenge Game - Personal Finance Management',
    description: 'Learn budgeting skills with our interactive budget challenge game. Make smart financial decisions and manage monthly expenses wisely.',
    url: 'https://economictimes.indiatimes.com/us/tools/games/budget-challenge',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('budgetChallengeStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const saveStats = useCallback((newStats: Stats) => {
    localStorage.setItem('budgetChallengeStats', JSON.stringify(newStats));
    setStats(newStats);
  }, []);

  const startGame = useCallback(() => {
    const incomes: Record<Difficulty, number> = {
      easy: 1200,
      medium: 3500,
      hard: 6000
    };

    const income = incomes[difficulty];
    setMonthlyIncome(income);
    setBalance(income * 0.7); // Starting with some savings
    setCurrentMonth(1);
    setMonthlyExpenses(0);
    setDecisions([]);
    setPaidExpenses(new Set());
    setScenarios(scenarioSets[difficulty]);
    setShowMonthlyResults(false);
    setGameScreen('play');
  }, [difficulty]);

  const selectExpense = useCallback((expense: Expense, type: 'essential' | 'optional') => {
    const expenseKey = `${type}-${expense.name}`;

    if (paidExpenses.has(expenseKey)) {
      return; // Already paid
    }

    if (balance >= expense.cost) {
      setBalance(prev => prev - expense.cost);
      setMonthlyExpenses(prev => prev + expense.cost);
      setPaidExpenses(prev => new Set(prev).add(expenseKey));
      setDecisions(prev => [...prev, {
        name: expense.name,
        cost: expense.cost,
        type,
        month: currentMonth
      }]);
    } else {
      alert(`💸 Not enough money! You need $${expense.cost} but only have $${balance}.`);
    }
  }, [balance, currentMonth, paidExpenses]);

  const finishMonth = useCallback(() => {
    setShowMonthlyResults(true);
  }, []);

  const nextMonth = useCallback(() => {
    if (currentMonth >= duration) {
      setGameScreen('results');
    } else {
      setCurrentMonth(prev => prev + 1);
      setBalance(prev => prev + monthlyIncome);
      setMonthlyExpenses(0);
      setPaidExpenses(new Set());
      setShowMonthlyResults(false);
    }
  }, [currentMonth, duration, monthlyIncome]);

  const resetGame = useCallback(() => {
    setGameScreen('setup');
    setCurrentMonth(1);
    setBalance(0);
    setMonthlyExpenses(0);
    setDecisions([]);
    setPaidExpenses(new Set());
    setShowMonthlyResults(false);
  }, []);

  // Calculate monthly results
  const getMonthlyResults = useCallback(() => {
    const monthDecisions = decisions.filter(d => d.month === currentMonth);
    const essentialSpent = monthDecisions.filter(d => d.type === 'essential').reduce((sum, d) => sum + d.cost, 0);
    const optionalSpent = monthDecisions.filter(d => d.type === 'optional').reduce((sum, d) => sum + d.cost, 0);
    const saved = monthlyIncome - monthlyExpenses;

    let feedback = '';
    if (saved > monthlyIncome * 0.2) {
      feedback = '🌟 Excellent! You saved over 20% of your income.';
    } else if (saved > 0) {
      feedback = '👍 Good job! You managed to save some money this month.';
    } else if (saved === 0) {
      feedback = '⚠️ You broke even. Try to save more next month.';
    } else {
      feedback = '😰 You overspent! This will hurt your long-term financial health.';
    }

    return { essentialSpent, optionalSpent, saved, feedback };
  }, [decisions, currentMonth, monthlyIncome, monthlyExpenses]);

  // Calculate final results
  const getFinalResults = useCallback(() => {
    const startingBalance = monthlyIncome * 0.7;
    const totalIncome = monthlyIncome * duration;
    const netChange = balance - startingBalance;
    const savingsRate = netChange / totalIncome;

    let grade, emoji, feedback;

    if (savingsRate >= 0.15) {
      grade = 'A+';
      emoji = '🏆';
      feedback = "Outstanding! You're a budgeting master with excellent savings habits.";
    } else if (savingsRate >= 0.1) {
      grade = 'A';
      emoji = '🌟';
      feedback = 'Excellent work! You maintained great financial discipline.';
    } else if (savingsRate >= 0.05) {
      grade = 'B+';
      emoji = '👍';
      feedback = 'Good job! You managed your budget well with some room for improvement.';
    } else if (savingsRate >= 0) {
      grade = 'B';
      emoji = '😊';
      feedback = 'Not bad! You broke even. Try to focus more on saving next time.';
    } else {
      grade = 'C';
      emoji = '😅';
      feedback = 'You overspent overall. Review your spending habits and prioritize essentials.';
    }

    return { grade, emoji, feedback };
  }, [balance, monthlyIncome, duration]);

  // Update stats when game ends
  useEffect(() => {
    if (gameScreen === 'results') {
      const { grade } = getFinalResults();
      const newStats = {
        challengesWon: stats.challengesWon + 1,
        highestGrade: grade > stats.highestGrade || stats.highestGrade === '--' ? grade : stats.highestGrade,
        totalSaved: stats.totalSaved + Math.max(0, balance - (monthlyIncome * 0.7))
      };
      saveStats(newStats);
    }
  }, [gameScreen, getFinalResults, balance, monthlyIncome, stats.challengesWon, stats.highestGrade, stats.totalSaved, saveStats]);

  const currentScenario = scenarios[Math.min(currentMonth - 1, scenarios.length - 1)] || scenarios[0];
  const progressPercent = (currentMonth / duration) * 100;

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-[1100px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-8">
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-100 to-emerald-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl">💳</span>
          <span className="text-green-600 font-semibold text-sm sm:text-base">Budget Challenge</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">{getH1('Monthly Budget Challenge')}</h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Learn smart money management by making real-life budgeting decisions. Balance your income, expenses, and savings goals!
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
        {/* Left Column: Game Content */}
        <div>
          {/* Game Container */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            {/* Game Setup */}
            {gameScreen === 'setup' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Challenge</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="easy">Easy (Student Budget - $1,200/month)</option>
                      <option value="medium">Medium (Young Professional - $3,500/month)</option>
                      <option value="hard">Hard (Family Budget - $6,000/month)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Challenge Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  💰 Start Challenge
                </button>
              </div>
            )}

            {/* Game Play */}
            {gameScreen === 'play' && (
              <div>
                {/* Month Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Month <span>{currentMonth}</span> of <span>{duration}</span>
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Current Balance</div>
                      <div className="text-2xl font-bold text-green-600">${balance.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Monthly Income</h4>
                    <div className="text-2xl font-bold text-blue-600">${monthlyIncome.toLocaleString()}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Total Expenses</h4>
                    <div className="text-2xl font-bold text-red-600">${monthlyExpenses.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Available</h4>
                    <div className="text-2xl font-bold text-green-600">${balance.toLocaleString()}</div>
                  </div>
                </div>

                {/* Decision Making */}
                {!showMonthlyResults && (
                  <div>
                    <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-bold text-yellow-800 mb-4">💡 This Month&apos;s Situation</h3>
                      <p className="text-gray-800">
                        {currentScenario?.scenario}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Essential Expenses */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">🏠 Essential Expenses</h4>
                        <div className="space-y-3">
                          {currentScenario?.essential.map((expense, index) => {
                            const expenseKey = `essential-${expense.name}`;
                            const isPaid = paidExpenses.has(expenseKey);

                            return (
                              <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{expense.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-red-600 font-bold">${expense.cost}</span>
                                    <button
                                      onClick={() => selectExpense(expense, 'essential')}
                                      disabled={isPaid}
                                      className={`px-3 py-1 rounded text-sm ${
                                        isPaid
                                          ? 'bg-green-600 text-white cursor-default'
                                          : 'bg-red-600 text-white hover:bg-red-700'
                                      }`}
                                    >
                                      {isPaid ? '✓ Paid' : 'Pay'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Optional Expenses */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">🎯 Optional Expenses</h4>
                        <div className="space-y-3">
                          {currentScenario?.optional.map((expense, index) => {
                            const expenseKey = `optional-${expense.name}`;
                            const isPaid = paidExpenses.has(expenseKey);

                            return (
                              <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{expense.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-blue-600 font-bold">${expense.cost}</span>
                                    <button
                                      onClick={() => selectExpense(expense, 'optional')}
                                      disabled={isPaid}
                                      className={`px-3 py-1 rounded text-sm ${
                                        isPaid
                                          ? 'bg-green-600 text-white cursor-default'
                                          : 'bg-blue-600 text-white hover:bg-blue-700'
                                      }`}
                                    >
                                      {isPaid ? '✓ Paid' : 'Choose'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center mt-8">
                      <button
                        onClick={finishMonth}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        ✅ Finish This Month
                      </button>
                    </div>
                  </div>
                )}

                {/* Monthly Results */}
                {showMonthlyResults && (() => {
                  const results = getMonthlyResults();
                  return (
                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Month Results</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">Essential Expenses</div>
                          <div className="text-xl font-bold text-red-600">${results.essentialSpent}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-700">Optional Expenses</div>
                          <div className="text-xl font-bold text-blue-600">${results.optionalSpent}</div>
                        </div>
                      </div>
                      <div className="text-center mb-4">
                        <div className="text-lg font-semibold text-gray-700">Amount Saved/Spent</div>
                        <div className={`text-2xl font-bold ${results.saved >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {results.saved >= 0 ? '+' : ''}${results.saved}
                        </div>
                      </div>
                      <p className="text-center text-gray-800">{results.feedback}</p>
                      <div className="text-center mt-6">
                        <button
                          onClick={nextMonth}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ➡️ Next Month
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Final Results */}
            {gameScreen === 'results' && (() => {
              const results = getFinalResults();
              return (
                <div className="text-center">
                  <div className="mb-8">
                    <div className="text-6xl mb-4">{results.emoji}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Challenge Complete!</h2>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">${balance.toLocaleString()}</div>
                      <div className="text-xl text-gray-700 mb-2">Final Balance</div>
                      <div className="text-lg text-gray-600">Grade: {results.grade} (Excellent!)</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 mb-6 border-l-4 border-green-400">
                      <p className="text-gray-800">{results.feedback}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={resetGame}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700"
                    >
                      🆕 New Challenge
                    </button>
                    <Link
                      href="/us/tools/games"
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      🎮 More Games
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        {/* End Left Column */}

        {/* Right Column: Sidebar (320px) */}
        <div className="space-y-4">
          {/* Budgeting Tips Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <h3 className="text-lg font-bold text-green-800">Smart Money Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Follow the 50/30/20 rule: Needs, Wants, Savings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Always pay essentials first before luxuries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Build an emergency fund of 3-6 months</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Track every expense to spot savings opportunities</span>
              </li>
            </ul>
          </div>

          {/* Your Stats Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-bold text-purple-800">Your Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">Challenges Won:</span>
                <span className="font-bold text-purple-900">{stats.challengesWon}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">Highest Grade:</span>
                <span className="font-bold text-purple-900">{stats.highestGrade}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">Total Saved:</span>
                <span className="font-bold text-purple-900">${stats.totalSaved.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* More Finance Games Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎮</span>
              <h3 className="text-lg font-bold text-blue-800">More Finance Games</h3>
            </div>
            <div className="space-y-2">
              <Link href="/us/tools/games/shopping-math" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-100">
                <div className="font-semibold text-blue-800 text-sm">Shopping Math</div>
                <div className="text-xs text-blue-600">Calculate deals & savings</div>
              </Link>
              <Link href="/us/tools/games/math-quiz" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-100">
                <div className="font-semibold text-blue-800 text-sm">Math Quiz</div>
                <div className="text-xs text-blue-600">Practice calculations</div>
              </Link>
              <Link href="/us/tools/games/typing-speed" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border border-blue-100">
                <div className="font-semibold text-blue-800 text-sm">Typing Speed</div>
                <div className="text-xs text-blue-600">Test your typing skills</div>
              </Link>
            </div>
          </div>
        </div>
        {/* End Right Column */}
      </div>

      {/* How to Play */}
      <div className="mt-12 bg-green-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-green-800 mb-4">How to Play</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-700">
          <div>
            <h4 className="font-semibold mb-2">💰 Manage Income</h4>
            <p>You receive a monthly income based on your chosen difficulty level. Use it wisely to cover all expenses.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🏠 Pay Essentials</h4>
            <p>Cover essential expenses like rent, utilities, and groceries first. These are necessary for daily life.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🎯 Choose Wisely</h4>
            <p>Decide on optional expenses like entertainment and dining out. Balance enjoyment with financial responsibility.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📈 Build Savings</h4>
            <p>Try to save money each month. Building an emergency fund is crucial for financial stability.</p>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Budget Management: Essential Financial Skills</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Budgeting is the foundation of financial wellness, yet it&apos;s a skill that many people never formally learn.
          The Budget Challenge game teaches essential money management concepts in an engaging, risk-free environment.
          By simulating real-world financial decisions, you can develop habits and strategies that translate directly
          to managing your actual finances more effectively.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">💰 Income Management</h3>
            <p className="text-sm text-gray-600">Learn to work within your means by allocating income to various expenses and priorities.</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">🏠 Essential vs Optional</h3>
            <p className="text-sm text-gray-600">Understand the difference between needs (rent, utilities) and wants (entertainment, dining out).</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">📈 Savings Goals</h3>
            <p className="text-sm text-gray-600">Practice building emergency funds and saving for future goals within budget constraints.</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <h3 className="font-semibold text-amber-800 mb-2">⚖️ Trade-off Decisions</h3>
            <p className="text-sm text-gray-600">Experience the real impact of financial choices and learn to prioritize spending wisely.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">The 50/30/20 Rule</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            A popular budgeting framework suggests allocating 50% of income to needs (housing, food, utilities),
            30% to wants (entertainment, hobbies, dining out), and 20% to savings and debt repayment. This budget
            challenge game helps you practice these principles by presenting realistic scenarios where you must
            balance immediate desires against long-term financial health. The skills you develop here directly
            apply to real-world money management.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-3">Financial Literacy Benefits</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>Build awareness of how quickly expenses can add up over a month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Learn to identify areas where you can cut spending without major lifestyle changes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Practice making financial decisions under constraints, just like real life</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span>Develop the habit of thinking about long-term consequences of spending choices</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <GameAppMobileMrec2 />



      {/* FAQs Section */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
    </>
  );
}
