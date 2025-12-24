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

interface MultiplicationTableClientProps {
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
  answer: number;
}

interface TableProgress {
  [key: number]: {
    correct: number;
    total: number;
    mastered: boolean;
  };
}

interface Stats {
  gamesPlayed: number;
  totalCorrect: number;
  totalProblems: number;
  tablesMastered: number;
  bestStreak: number;
}

type GamePhase = 'menu' | 'practice' | 'quiz' | 'result';
type GameMode = 'practice' | 'quiz' | 'challenge';

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I use the Multiplication Tables game?",
    answer: "Select which tables you want to practice (2-12), then choose Practice mode to learn at your own pace, Quiz mode to test specific tables, or Challenge mode to test all tables randomly. Type your answers and track your progress!",
    order: 1
  },
  { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What does 'mastered' mean for a table?",
    answer: "A table is considered mastered when you've answered at least 10 problems from that table with 90% or higher accuracy. Mastered tables show a gold star in the selection menu.",
    order: 2
  },
  {
    id: '2',
    question: "How does Practice mode differ from Quiz mode?",
    answer: "Practice mode shows problems one at a time with immediate feedback and no time pressure. Quiz mode gives you a set number of problems with a timer, testing your speed and accuracy.",
    order: 2
  },
  { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What's the best way to memorize multiplication tables?",
    answer: "Start with easier tables (2, 5, 10), use patterns (like 9's finger trick), practice regularly in short sessions, and focus on the tables you find most difficult. Consistent practice is key!",
    order: 4
  }
];

export default function MultiplicationTableClient({ relatedGames = defaultRelatedGames }: MultiplicationTableClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 3, 4, 5]);

  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [problemQueue, setProblemQueue] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  const [tableProgress, setTableProgress] = useState<TableProgress>({});
  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalCorrect: 0,
    totalProblems: 0,
    tablesMastered: 0,
    bestStreak: 0
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { getH1, getSubHeading } = usePageSEO('multiplication-table');

  const webAppSchema = generateWebAppSchema({
    name: 'Multiplication Tables Game',
    description: 'Practice multiplication tables with our interactive learning game',
    url: typeof window !== 'undefined' ? window.location.href : ''
  });

  // Load saved data
  useEffect(() => {
    const savedStats = localStorage.getItem('multiplicationTableStats');
    const savedProgress = localStorage.getItem('multiplicationTableProgress');
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedProgress) setTableProgress(JSON.parse(savedProgress));
  }, []);

  const saveData = (newStats: Stats, newProgress: TableProgress) => {
    setStats(newStats);
    setTableProgress(newProgress);
    localStorage.setItem('multiplicationTableStats', JSON.stringify(newStats));
    localStorage.setItem('multiplicationTableProgress', JSON.stringify(newProgress));
  };

  const toggleTable = (num: number) => {
    if (selectedTables.includes(num)) {
      if (selectedTables.length > 1) {
        setSelectedTables(selectedTables.filter(t => t !== num));
      }
    } else {
      setSelectedTables([...selectedTables, num]);
    }
  };

  const selectAllTables = () => {
    setSelectedTables([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  };

  const generateProblems = (count: number): Problem[] => {
    const problems: Problem[] = [];
    for (let i = 0; i < count; i++) {
      const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
      const multiplier = Math.floor(Math.random() * 12) + 1;
      problems.push({
        num1: table,
        num2: multiplier,
        answer: table * multiplier
      });
    }
    return problems;
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setUserAnswer('');
    setFeedback(null);
    setShowAnswer(false);
    setCurrentIndex(0);

    if (mode === 'practice') {
      const problems = generateProblems(1);
      setProblemQueue(problems);
      setCurrentProblem(problems[0]);
      setGamePhase('practice');
    } else if (mode === 'quiz') {
      const problems = generateProblems(20);
      setProblemQueue(problems);
      setCurrentProblem(problems[0]);
      setTimeLeft(120);
      setGamePhase('quiz');
    } else if (mode === 'challenge') {
      setSelectedTables([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      const problems = generateProblems(30);
      setProblemQueue(problems);
      setCurrentProblem(problems[0]);
      setTimeLeft(180);
      setGamePhase('quiz');
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Timer for quiz mode
  useEffect(() => {
    if (gamePhase === 'quiz' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (gamePhase === 'quiz' && timeLeft <= 0) {
      endGame();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [gamePhase, timeLeft]);

  const submitAnswer = () => {
    if (!currentProblem || userAnswer === '') return;

    const answer = parseInt(userAnswer);
    const isCorrect = answer === currentProblem.answer;

    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) setShowAnswer(true);

    // Update table progress
    const newProgress = { ...tableProgress };
    const tableNum = currentProblem.num1;
    if (!newProgress[tableNum]) {
      newProgress[tableNum] = { correct: 0, total: 0, mastered: false };
    }
    newProgress[tableNum].total++;
    if (isCorrect) {
      newProgress[tableNum].correct++;
      setCorrectCount(c => c + 1);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
      setScore(s => s + 10 + Math.min(streak, 10));
    } else {
      setWrongCount(w => w + 1);
      setStreak(0);
    }

    // Check mastery
    if (newProgress[tableNum].total >= 10) {
      const accuracy = newProgress[tableNum].correct / newProgress[tableNum].total;
      newProgress[tableNum].mastered = accuracy >= 0.9;
    }
    setTableProgress(newProgress);

    setTimeout(() => {
      setFeedback(null);
      setShowAnswer(false);
      setUserAnswer('');

      if (gamePhase === 'practice') {
        // Generate next problem for practice
        const problems = generateProblems(1);
        setProblemQueue(problems);
        setCurrentProblem(problems[0]);
      } else {
        // Move to next problem in quiz
        const nextIndex = currentIndex + 1;
        if (nextIndex < problemQueue.length) {
          setCurrentIndex(nextIndex);
          setCurrentProblem(problemQueue[nextIndex]);
        } else {
          endGame();
        }
      }

      inputRef.current?.focus();
    }, isCorrect ? 300 : 1000);
  };

  const endGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGamePhase('result');

    const newStats = { ...stats };
    newStats.gamesPlayed++;
    newStats.totalCorrect += correctCount;
    newStats.totalProblems += correctCount + wrongCount;
    if (maxStreak > newStats.bestStreak) newStats.bestStreak = maxStreak;

    // Count mastered tables
    newStats.tablesMastered = Object.values(tableProgress).filter(t => t.mastered).length;

    saveData(newStats, tableProgress);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submitAnswer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTableStatus = (num: number) => {
    const progress = tableProgress[num];
    if (!progress) return 'new';
    if (progress.mastered) return 'mastered';
    if (progress.total >= 5) return 'practicing';
    return 'started';
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

  const accuracy = correctCount + wrongCount > 0
    ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">✖️</span>
            <span className="text-purple-700 font-semibold">Times Tables</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">{getH1('Multiplication Tables')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Master your times tables with practice, quizzes, and challenges!
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
                  {/* Table Selection */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-gray-800">Select Tables to Practice</h3>
                      <button
                        onClick={selectAllTables}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Select All
                      </button>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                        const status = getTableStatus(num);
                        const isSelected = selectedTables.includes(num);
                        return (
                          <button
                            key={num}
                            onClick={() => toggleTable(num)}
                            className={`relative p-3 rounded-xl border-2 transition-all font-bold text-lg ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 text-gray-500 hover:border-purple-300'
                            }`}
                          >
                            {num}
                            {status === 'mastered' && (
                              <span className="absolute -top-1 -right-1 text-xs">⭐</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {selectedTables.sort((a, b) => a - b).join(', ')} tables
                    </p>
                  </div>

                  {/* Game Modes */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Choose Mode</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => startGame('practice')}
                        className="p-4 rounded-xl border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-all text-left"
                      >
                        <div className="text-2xl mb-2">📚</div>
                        <div className="font-bold text-green-700">Practice</div>
                        <div className="text-sm text-green-600">Learn at your own pace</div>
                      </button>
                      <button
                        onClick={() => startGame('quiz')}
                        className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-all text-left"
                      >
                        <div className="text-2xl mb-2">📝</div>
                        <div className="font-bold text-blue-700">Quiz</div>
                        <div className="text-sm text-blue-600">20 problems, 2 minutes</div>
                      </button>
                      <button
                        onClick={() => startGame('challenge')}
                        className="p-4 rounded-xl border-2 border-purple-500 bg-purple-50 hover:bg-purple-100 transition-all text-left"
                      >
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="font-bold text-purple-700">Challenge</div>
                        <div className="text-sm text-purple-600">All tables, 30 problems</div>
                      </button>
                    </div>
                  </div>

                  {/* Reference Table */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Reference Table</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className="p-1 text-purple-700">×</th>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                              <th key={n} className="p-1 text-purple-700">{n}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTables.slice(0, 4).map(row => (
                            <tr key={row}>
                              <td className="p-1 font-bold text-purple-700">{row}</td>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(col => (
                                <td key={col} className="p-1 text-center text-gray-700">
                                  {row * col}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {selectedTables.length > 4 && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Showing first 4 selected tables
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Practice/Quiz Phase */}
              {(gamePhase === 'practice' || gamePhase === 'quiz') && currentProblem && (
                <div className="space-y-6">
                  {/* Header Info */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {gamePhase === 'quiz' && (
                        <>
                          <div className={`text-xl font-bold ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-700'}`}>
                            ⏱️ {formatTime(timeLeft)}
                          </div>
                          <div className="text-gray-500">
                            {currentIndex + 1} / {problemQueue.length}
                          </div>
                        </>
                      )}
                      {gamePhase === 'practice' && (
                        <span className="text-purple-600 font-medium">Practice Mode</span>
                      )}
                    </div>
                    <button
                      onClick={() => setGamePhase('menu')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕ End
                    </button>
                  </div>

                  {/* Score Display */}
                  <div className="flex justify-center gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{score}</div>
                      <div className="text-sm text-gray-500">Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                      <div className="text-sm text-gray-500">Correct</div>
                    </div>
                    {streak > 0 && (
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{streak} 🔥</div>
                        <div className="text-sm text-gray-500">Streak</div>
                      </div>
                    )}
                  </div>

                  {/* Problem Display */}
                  <div
                    className={`text-center py-12 rounded-2xl transition-all ${
                      feedback === 'correct' ? 'bg-green-100' :
                      feedback === 'wrong' ? 'bg-red-100' :
                      'bg-gradient-to-br from-purple-50 to-indigo-50'
                    }`}
                  >
                    <div className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
                      {currentProblem.num1} × {currentProblem.num2} = ?
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
                      className="flex-1 text-4xl text-center p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="?"
                      autoFocus
                    />
                    <button
                      onClick={submitAnswer}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xl font-bold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
                    >
                      Check
                    </button>
                  </div>
                </div>
              )}

              {/* Result Phase */}
              {gamePhase === 'result' && (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">
                    {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🎉' : '💪'}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800">
                    {accuracy >= 90 ? 'Excellent!' : accuracy >= 70 ? 'Great Job!' : 'Keep Practicing!'}
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-purple-600">{score}</div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-green-600">{correctCount}</div>
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

                  {/* Tables Progress */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-800 mb-3">Tables Progress</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                        const progress = tableProgress[num];
                        const status = getTableStatus(num);
                        return (
                          <div
                            key={num}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                              status === 'mastered' ? 'bg-yellow-400 text-yellow-900' :
                              status === 'practicing' ? 'bg-purple-200 text-purple-700' :
                              status === 'started' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-400'
                            }`}
                            title={progress ? `${progress.correct}/${progress.total} correct` : 'Not started'}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ⭐ = Mastered (90%+ accuracy on 10+ problems)
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => startGame(gameMode)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setGamePhase('menu')}
                      className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Change Tables
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <strong>Select Tables</strong>
                    <p className="text-sm text-gray-600">Choose which times tables you want to practice</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <strong>Pick a Mode</strong>
                    <p className="text-sm text-gray-600">Practice, Quiz, or full Challenge mode</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <strong>Answer Quickly</strong>
                    <p className="text-sm text-gray-600">Type answers and press Enter to submit</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <strong>Master Tables</strong>
                    <p className="text-sm text-gray-600">Get 90% accuracy to earn a gold star</p>
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
                  <span>Start with 2, 5, and 10 tables - they have easy patterns!</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>For 9s: the digits always add up to 9 (9×3=27, 2+7=9)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Practice daily for 5-10 minutes for best results</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Focus on your weakest tables to improve faster</span>
                </li>
              </ul>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6">
              <FirebaseFAQs pageId="multiplication-table" fallbackFaqs={fallbackFaqs} />
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
                <span>📊</span> Your Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-bold text-gray-800">{stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tables Mastered</span>
                  <span className="font-bold text-purple-600">{stats.tablesMastered} / 11</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="font-bold text-orange-600">{stats.bestStreak}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-bold text-green-600">
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
                      <div className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {game.title}
                      </div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-purple-500 transition-colors">→</span>
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
