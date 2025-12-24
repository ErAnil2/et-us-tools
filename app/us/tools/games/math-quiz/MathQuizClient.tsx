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

interface MathQuizClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Question {
  num1: number;
  num2: number;
  operation: string;
  operationSymbol: string;
  answer: number;
  questionText: string;
}

interface UserAnswer {
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

interface Stats {
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestScore: string;
  bestStreak: number;
  fastestTime: string | null;
}

type GamePhase = 'menu' | 'play' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard';

const difficultySettings = {
  easy: {
    label: 'Easy',
    description: 'Numbers 1-20',
    min: 1,
    max: 20,
    emoji: '🌱'
  },
  medium: {
    label: 'Medium',
    description: 'Numbers 1-100',
    min: 1,
    max: 100,
    emoji: '🌿'
  },
  hard: {
    label: 'Hard',
    description: 'Numbers 1-1000',
    min: 1,
    max: 1000,
    emoji: '🌳'
  }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "How does the Math Quiz help improve math skills?",
    answer: "The Math Quiz provides practice with all four basic operations (addition, subtraction, multiplication, division) at various difficulty levels. Regular practice helps build number sense, improves calculation speed, and reinforces fundamental math concepts.",
    order: 1
  },
  {
    id: '2',
    question: "What are the different difficulty levels?",
    answer: "There are three difficulty levels: Easy (numbers 1-20), Medium (numbers 1-100), and Hard (numbers 1-1000). Each level increases the complexity of calculations, helping you progress at your own pace.",
    order: 2
  },
  {
    id: '3',
    question: "How does the hint system work?",
    answer: "You get 3 hints per quiz. When you use a hint, it reveals partial information about the answer (like the first digits for multi-digit numbers). Using hints can help when you're stuck, but try to solve problems without them for better learning.",
    order: 3
  },
  {
    id: '4',
    question: "How is my score calculated?",
    answer: "Your score is based on the number of correct answers out of the total questions. The quiz also tracks your streak (consecutive correct answers), time taken, and hints used. Try to maintain streaks for a sense of achievement!",
    order: 4
  }
];

export default function MathQuizClient({ relatedGames = defaultRelatedGames }: MathQuizClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [operations, setOperations] = useState({
    addition: true,
    subtraction: true,
    multiplication: true,
    division: false
  });

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');

  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: '0/0',
    bestStreak: 0,
    fastestTime: null
  });

  const answerInputRef = useRef<HTMLInputElement>(null);

  const { getH1, getSubHeading } = usePageSEO('math-quiz');

  const webAppSchema = generateWebAppSchema({
    name: 'Math Quiz Game',
    description: 'Test your arithmetic skills with our interactive math quiz',
    url: typeof window !== 'undefined' ? window.location.href : ''
  });

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mathQuizStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gamePhase === 'play' && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setElapsedTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gamePhase, startTime]);

  const saveStats = (newStats: Stats) => {
    setStats(newStats);
    localStorage.setItem('mathQuizStats', JSON.stringify(newStats));
  };

  const generateQuestions = (count: number, diff: Difficulty) => {
    const newQuestions: Question[] = [];
    const range = difficultySettings[diff];

    const selectedOps: { symbol: string; name: string }[] = [];
    if (operations.addition) selectedOps.push({ symbol: '+', name: 'addition' });
    if (operations.subtraction) selectedOps.push({ symbol: '-', name: 'subtraction' });
    if (operations.multiplication) selectedOps.push({ symbol: '×', name: 'multiplication' });
    if (operations.division) selectedOps.push({ symbol: '÷', name: 'division' });

    for (let i = 0; i < count; i++) {
      const op = selectedOps[Math.floor(Math.random() * selectedOps.length)];
      let num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      let num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      let answer: number;

      switch (op.symbol) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          if (num1 < num2) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          break;
        case '×':
          // Keep multiplication reasonable
          num1 = Math.min(num1, 20);
          num2 = Math.min(num2, 20);
          answer = num1 * num2;
          break;
        case '÷':
          // Ensure clean division
          num2 = Math.max(2, Math.floor(Math.random() * 12) + 2);
          answer = Math.floor(Math.random() * 20) + 1;
          num1 = num2 * answer;
          break;
        default:
          answer = 0;
      }

      newQuestions.push({
        num1,
        num2,
        operation: op.name,
        operationSymbol: op.symbol,
        answer,
        questionText: `${num1} ${op.symbol} ${num2} = ?`
      });
    }

    return newQuestions;
  };

  const startGame = () => {
    const selectedOps = Object.values(operations).filter(v => v);
    if (selectedOps.length === 0) {
      alert('Please select at least one operation!');
      return;
    }

    const newQuestions = generateQuestions(questionCount, difficulty);
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setHintsRemaining(3);
    setUserAnswers([]);
    setUserAnswer('');
    setStartTime(Date.now());
    setElapsedTime('00:00');
    setGamePhase('play');

    setTimeout(() => {
      answerInputRef.current?.focus();
    }, 100);
  };

  const useHint = () => {
    if (hintsRemaining <= 0 || !questions[currentQuestion]) return;

    const answer = questions[currentQuestion].answer;
    const answerStr = answer.toString();
    let hint = '';

    if (answerStr.length === 1) {
      hint = `The answer is a single digit number`;
    } else if (answerStr.length === 2) {
      hint = `The answer starts with: ${answerStr[0]}`;
    } else {
      const halfLength = Math.ceil(answerStr.length / 2);
      hint = `The answer starts with: ${answerStr.substring(0, halfLength)}`;
    }

    setHintsRemaining(hintsRemaining - 1);
    alert(`💡 Hint: ${hint}`);
  };

  const submitAnswer = () => {
    if (!questions[currentQuestion]) return;

    const answer = parseFloat(userAnswer);
    const correctAnswer = questions[currentQuestion].answer;

    if (isNaN(answer)) {
      alert('Please enter a valid number!');
      return;
    }

    const isCorrect = Math.abs(answer - correctAnswer) < 0.01;

    const newUserAnswers = [...userAnswers, {
      question: questions[currentQuestion].questionText,
      userAnswer: answer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect
    }];
    setUserAnswers(newUserAnswers);

    let newCorrectAnswers = correctAnswers;
    let newCurrentStreak = currentStreak;
    let newMaxStreak = maxStreak;

    if (isCorrect) {
      newCorrectAnswers++;
      newCurrentStreak++;
      setCorrectAnswers(newCorrectAnswers);
      setCurrentStreak(newCurrentStreak);

      if (newCurrentStreak > maxStreak) {
        newMaxStreak = newCurrentStreak;
        setMaxStreak(newMaxStreak);
      }
    } else {
      newCurrentStreak = 0;
      setCurrentStreak(0);
    }

    setUserAnswer('');

    if (currentQuestion + 1 >= questionCount) {
      showResults(newCorrectAnswers, newMaxStreak, newUserAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setTimeout(() => {
        answerInputRef.current?.focus();
      }, 100);
    }
  };

  const showResults = (finalCorrect: number, finalMaxStreak: number, finalUserAnswers: UserAnswer[]) => {
    setGamePhase('result');

    const newStats = { ...stats };
    newStats.gamesPlayed++;
    newStats.totalCorrect += finalCorrect;
    newStats.totalQuestions += questionCount;

    const percentage = Math.round((finalCorrect / questionCount) * 100);
    const currentScore = `${finalCorrect}/${questionCount}`;
    const bestScoreParts = stats.bestScore.split('/');
    const bestPercentage = parseInt(bestScoreParts[1]) > 0
      ? (parseInt(bestScoreParts[0]) / parseInt(bestScoreParts[1])) * 100
      : 0;

    if (percentage > bestPercentage) {
      newStats.bestScore = currentScore;
    }

    if (finalMaxStreak > newStats.bestStreak) {
      newStats.bestStreak = finalMaxStreak;
    }

    if (!newStats.fastestTime || elapsedTime < newStats.fastestTime) {
      newStats.fastestTime = elapsedTime;
    }

    saveStats(newStats);
  };

  const resetGame = () => {
    setGamePhase('menu');
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setHintsRemaining(3);
    setUserAnswers([]);
    setUserAnswer('');
    setElapsedTime('00:00');
    setStartTime(null);
  };

  const getResultEmoji = () => {
    const percentage = Math.round((correctAnswers / questionCount) * 100);
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 70) return '👍';
    if (percentage >= 60) return '📚';
    return '💪';
  };

  const getResultMessage = () => {
    const percentage = Math.round((correctAnswers / questionCount) * 100);
    if (percentage >= 90) return { title: 'Outstanding!', message: "You're a math master!" };
    if (percentage >= 80) return { title: 'Excellent!', message: 'Great performance!' };
    if (percentage >= 70) return { title: 'Good Job!', message: 'Keep practicing!' };
    if (percentage >= 60) return { title: 'Not Bad!', message: "You're improving!" };
    return { title: "Don't Give Up!", message: 'Practice makes perfect!' };
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

  const progressPercent = questionCount > 0 ? ((currentQuestion + 1) / questionCount) * 100 : 0;
  const accuracy = (correctAnswers + userAnswers.length) > 0
    ? Math.round((correctAnswers / (correctAnswers + userAnswers.length - (userAnswers.length > 0 && userAnswers[userAnswers.length - 1]?.isCorrect ? 0 : 0))) * 100)
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🧮</span>
            <span className="text-blue-700 font-semibold">Math Challenge</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{getH1('Math Quiz')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Test your arithmetic skills with our interactive quiz. Choose your difficulty and operations!
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
                    <div className="grid grid-cols-3 gap-3">
                      {(Object.keys(difficultySettings) as Difficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficulty(diff)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            difficulty === diff
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{difficultySettings[diff].emoji}</div>
                          <div className="font-semibold text-gray-800">{difficultySettings[diff].label}</div>
                          <div className="text-xs text-gray-500">{difficultySettings[diff].description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operations Selection */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Select Operations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <label
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          operations.addition ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={operations.addition}
                          onChange={(e) => setOperations({ ...operations, addition: e.target.checked })}
                          className="w-5 h-5 text-green-500"
                        />
                        <span className="text-xl">+</span>
                        <span className="font-medium">Addition</span>
                      </label>
                      <label
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          operations.subtraction ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={operations.subtraction}
                          onChange={(e) => setOperations({ ...operations, subtraction: e.target.checked })}
                          className="w-5 h-5 text-red-500"
                        />
                        <span className="text-xl">-</span>
                        <span className="font-medium">Subtraction</span>
                      </label>
                      <label
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          operations.multiplication ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={operations.multiplication}
                          onChange={(e) => setOperations({ ...operations, multiplication: e.target.checked })}
                          className="w-5 h-5 text-blue-500"
                        />
                        <span className="text-xl">×</span>
                        <span className="font-medium">Multiply</span>
                      </label>
                      <label
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          operations.division ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={operations.division}
                          onChange={(e) => setOperations({ ...operations, division: e.target.checked })}
                          className="w-5 h-5 text-purple-500"
                        />
                        <span className="text-xl">÷</span>
                        <span className="font-medium">Division</span>
                      </label>
                    </div>
                  </div>

                  {/* Question Count */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Number of Questions</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {[5, 10, 15, 20].map((count) => (
                        <button
                          key={count}
                          onClick={() => setQuestionCount(count)}
                          className={`p-3 rounded-xl border-2 font-bold transition-all ${
                            questionCount === count
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-200 text-gray-600 hover:border-blue-300'
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
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Start Quiz
                  </button>
                </div>
              )}

              {/* Play Phase */}
              {gamePhase === 'play' && questions.length > 0 && (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{currentQuestion + 1} of {questionCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                    <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                      {questions[currentQuestion].questionText}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {questions[currentQuestion].operation}
                    </div>
                  </div>

                  {/* Answer Input */}
                  <div className="flex gap-3">
                    <input
                      ref={answerInputRef}
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') submitAnswer();
                      }}
                      className="flex-1 text-3xl text-center p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      placeholder="Your answer"
                      autoFocus
                    />
                    <button
                      onClick={submitAnswer}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                      Submit
                    </button>
                  </div>

                  {/* Hint Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={useHint}
                      disabled={hintsRemaining <= 0}
                      className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                        hintsRemaining > 0
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      💡 Use Hint ({hintsRemaining} left)
                    </button>
                  </div>

                  {/* Streak Display */}
                  {currentStreak > 0 && (
                    <div className="text-center">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
                        <span className="text-xl">🔥</span>
                        <span className="font-bold text-orange-600">{currentStreak} Streak!</span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Result Phase */}
              {gamePhase === 'result' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getResultEmoji()}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{getResultMessage().title}</h2>
                    <p className="text-gray-600">{getResultMessage().message}</p>
                  </div>

                  {/* Score Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {correctAnswers}/{questionCount}
                    </div>
                    <div className="text-xl text-gray-700">
                      {Math.round((correctAnswers / questionCount) * 100)}% Correct
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{maxStreak}</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{elapsedTime}</div>
                      <div className="text-sm text-gray-600">Time</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{3 - hintsRemaining}</div>
                      <div className="text-sm text-gray-600">Hints Used</div>
                    </div>
                  </div>

                  {/* Answer Review */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Answer Review</h4>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {userAnswers.map((answer, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-xl flex items-center justify-between ${
                            answer.isCorrect
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-gray-800">
                              {index + 1}. {answer.question.replace(' = ?', '')}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Your answer: </span>
                              <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {answer.userAnswer}
                              </span>
                              {!answer.isCorrect && (
                                <span className="text-green-600 ml-2">
                                  (Correct: {answer.correctAnswer})
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-2xl">{answer.isCorrect ? '✓' : '✗'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={resetGame}
                      className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Change Settings
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <strong>Choose Settings</strong>
                    <p className="text-sm text-gray-600">Select difficulty, operations, and number of questions</p>
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
                    <strong>Use Hints Wisely</strong>
                    <p className="text-sm text-gray-600">You have 3 hints per quiz - save them for tough ones!</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <strong>Build Streaks</strong>
                    <p className="text-sm text-gray-600">Consecutive correct answers increase your streak</p>
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
                  <span>Press Enter to quickly submit your answer</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Start with Easy to build confidence, then increase difficulty</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>For multiplication, break numbers into smaller parts</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500">▸</span>
                  <span>Division problems always have whole number answers</span>
                </li>
              </ul>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6">
              <FirebaseFAQs pageId="math-quiz" fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
{/* Sidebar */}
          <div className="lg:w-[320px] space-y-6">
            {/* Ad Banner */}
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<AdBanner className="mx-auto" />

            {/* Live Stats Card (during play) */}
            {gamePhase === 'play' && (
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📊</span> Live Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Time</span>
                    <span className="font-bold text-blue-600">{elapsedTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Correct</span>
                    <span className="font-bold text-green-600">{correctAnswers}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Streak</span>
                    <span className="font-bold text-orange-600">{currentStreak}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Hints Left</span>
                    <span className="font-bold text-purple-600">{hintsRemaining}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🏆</span> Your Stats
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
                  <span className="text-gray-600">Total Correct</span>
                  <span className="font-bold text-blue-600">{stats.totalCorrect}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-bold text-purple-600">
                    {stats.totalQuestions > 0
                      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
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
                      <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {game.title}
                      </div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-500 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
