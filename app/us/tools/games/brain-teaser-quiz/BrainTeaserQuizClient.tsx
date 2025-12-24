'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon?: string;
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: 'What types of brain teasers are included?',
    answer: 'The quiz includes logic puzzles (sequences, deductions), word riddles (wordplay, metaphors), math brain teasers (number patterns), and lateral thinking problems (creative solutions).',
    order: 1
  },
  {
    id: '2',
    question: 'How do I use the hint feature?',
    answer: 'Click the Hint button on any question to get a clue. Hints provide guidance without giving away the answer. Use them when stuck, but try solving without hints first for best practice.',
    order: 2
  },
  {
    id: '3',
    question: 'What do the difficulty levels mean?',
    answer: 'Easy has straightforward riddles and patterns. Medium includes more complex logic. Hard features multi-step problems. Expert has the most challenging puzzles requiring creative thinking.',
    order: 3
  },
  {
    id: '4',
    question: 'How is my score calculated?',
    answer: 'You get points for each correct answer. Streaks (consecutive correct answers) give bonus points. Category performance is tracked separately to show your strengths and areas for improvement.',
    order: 4
  },
  {
    id: '5',
    question: 'Are brain teasers good for the brain?',
    answer: 'Yes! Brain teasers improve critical thinking, problem-solving skills, pattern recognition, and cognitive flexibility. Regular practice can enhance mental agility and creative thinking.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I skip a question?',
    answer: 'Yes, click Skip to move to the next question. Skipped questions count as incorrect and break your streak, but sometimes its better to skip and maintain momentum.',
    order: 6
  }
];

interface Question {
  question: string;
  options?: string[];
  correct: number | string;
  hint: string;
  explanation: string;
  type?: string;
  category: string;
}

interface BrainTeaserQuizClientProps {
  relatedGames?: Array<{
    href: string;
    title: string;
    description: string;
    color?: string;
    icon?: string;
  }>;
}

interface Stats {
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestStreak: number;
}

const getGameIcon = (icon: string) => {
  const icons: Record<string, string> = {
    memory: '🧠',
    puzzle: '🧩',
    game: '🎮',
    blocks: '🔲',
    speed: '⚡'
  };
  return icons[icon] || '🎮';
};

const questionBank = {
  logic: {
    easy: [
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What comes next in this sequence: 2, 4, 8, 16, ?",
        options: ["24", "32", "28", "30"],
        correct: 1,
        hint: "Each number is double the previous number.",
        explanation: "This is a doubling sequence: 2×2=4, 4×2=8, 8×2=16, 16×2=32."
      },
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely Lazzles. True or False?",
        options: ["True", "False"],
        correct: 0,
        hint: "Follow the logical chain: Bloops → Razzles → Lazzles",
        explanation: "True. If A→B and B→C, then A→C. This is basic logical transitivity."
      },
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What comes next: 1, 1, 2, 3, 5, 8, ?",
        options: ["10", "11", "13", "15"],
        correct: 2,
        hint: "Add the two previous numbers together.",
        explanation: "This is the Fibonacci sequence. Each number is the sum of the two before it: 5+8=13."
      }
    ],
    medium: [
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "A man lives on the 20th floor. Every morning he takes the elevator down. When he comes home, he takes it to the 10th floor and walks up... except on rainy days. Why?",
        options: ["He's short and can't reach the 20th floor button", "He likes exercise", "The elevator is broken", "He's afraid of heights"],
        correct: 0,
        hint: "Think about what's different on rainy days that would help him reach higher buttons.",
        explanation: "He's too short to reach the 20th floor button, but on rainy days he has an umbrella to press it."
      },
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        options: ["A ghost", "An echo", "A shadow", "A thought"],
        correct: 1,
        hint: "Think about sounds that come back to you.",
        explanation: "An echo repeats sounds (speaks) and requires sound waves (hears) without having physical form."
      }
    ],
    hard: [
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "You have 12 balls that look identical. 11 weigh the same, one is different. Using a balance scale 3 times, how many balls do you weigh first?",
        options: ["2", "3", "4", "6"],
        correct: 2,
        hint: "Divide into groups that give maximum information per weighing.",
        explanation: "Divide into 3 groups of 4. First weighing compares 4 vs 4. This tells you which group of 4 (or the unweighed group) contains the odd ball."
      }
    ]
  },
  riddles: {
    easy: [
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What has keys but no locks, space but no room, and you can enter but can't go inside?",
        options: ["A computer keyboard", "A piano", "A map", "A book"],
        correct: 0,
        hint: "Think about something you use every day with letters and numbers.",
        explanation: "A keyboard has keys, a space bar, and an enter key, but no physical locks, rooms, or interior."
      },
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What gets wetter the more it dries?",
        options: ["A sponge", "A towel", "Rain", "A mop"],
        correct: 1,
        hint: "Think about something used after a shower.",
        explanation: "A towel gets wetter as it dries other things (like your body)."
      },
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        options: ["A painting", "A map", "A dream", "A photograph"],
        correct: 1,
        hint: "Something you might unfold to find your way.",
        explanation: "A map shows cities, mountains, and water, but only as representations, not real objects."
      }
    ],
    medium: [
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
        options: ["Fire", "Plant", "Cloud", "Crystal"],
        correct: 0,
        hint: "Think about something that needs oxygen but is destroyed by water.",
        explanation: "Fire grows (spreads), needs air (oxygen), but water extinguishes it."
      },
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "The more you take, the more you leave behind. What am I?",
        options: ["Time", "Footsteps", "Memories", "Breaths"],
        correct: 1,
        hint: "Think about what happens when you walk.",
        explanation: "The more footsteps you take while walking, the more footprints you leave behind."
      }
    ]
  },
  math: {
    easy: [
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "If you multiply me by any number, the result equals that number. What am I?",
        options: ["0", "1", "10", "Infinity"],
        correct: 1,
        hint: "Think about the multiplicative identity.",
        explanation: "The number 1 is the multiplicative identity - any number times 1 equals itself."
      }
    ],
    medium: [
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "A bat and ball cost $1.10 total. The bat costs $1.00 more than the ball. How much does the ball cost?",
        options: ["$0.10", "$0.05", "$0.15", "$0.20"],
        correct: 1,
        hint: "If the ball is X, then the bat is X + $1.00. What's the total?",
        explanation: "If ball = $0.05 and bat = $1.05, then: $0.05 + $1.05 = $1.10, and $1.05 - $0.05 = $1.00 difference."
      }
    ]
  },
  lateral: {
    medium: [
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "A man pushes his car to a hotel and tells the owner he's bankrupt. What happened?",
        options: ["He's playing Monopoly", "His car broke down", "He lost his job", "He gambled his money"],
        correct: 0,
        hint: "Think about games where you move pieces around a board.",
        explanation: "He's playing Monopoly! He moved his car piece to a hotel property and couldn't afford the rent."
      },
      { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "A woman shoots her husband, holds him underwater for 5 minutes, then hangs him. Later they enjoy dinner together. How?",
        options: ["She's a ghost", "She shot, developed, and hung a photo of him", "It was a dream", "They're actors"],
        correct: 1,
        hint: "Think about photography terms.",
        explanation: "She took a photograph: shot (took the picture), held underwater (developed), hung (dried the photo)."
      }
    ]
  }
};

export default function BrainTeaserQuizClient({ relatedGames = defaultRelatedGames }: BrainTeaserQuizClientProps) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('brain-teaser-quiz');

  const webAppSchema = generateWebAppSchema(
    'Brain Teaser Quiz - Free Online Logic Puzzles',
    'Challenge your mind with brain teasers, logic puzzles, and riddles. Test your critical thinking and problem-solving skills.',
    'https://economictimes.indiatimes.com/us/tools/games/brain-teaser-quiz',
    'Game'
  );

  const [difficulty, setDifficulty] = useState('medium');
  const [quizLength, setQuizLength] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['logic', 'riddles']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [categoryStats, setCategoryStats] = useState<Record<string, { correct: number; total: number }>>({});
  const [gamePhase, setGamePhase] = useState<'menu' | 'play' | 'result'>('menu');
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  const [stats, setStats] = useState<Stats>({ gamesPlayed: 0, totalCorrect: 0, totalQuestions: 0, bestStreak: 0 });

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('brainTeaserStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const saveStats = useCallback((correct: number, total: number, streak: number) => {
    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      totalCorrect: stats.totalCorrect + correct,
      totalQuestions: stats.totalQuestions + total,
      bestStreak: Math.max(stats.bestStreak, streak)
    };
    setStats(newStats);
    localStorage.setItem('brainTeaserStats', JSON.stringify(newStats));
  }, [stats]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const startQuiz = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category!');
      return;
    }

    const newQuestions: Question[] = [];
    const questionsPerCategory = Math.ceil(quizLength / selectedCategories.length);

    selectedCategories.forEach(category => {
      const categoryQuestions = (questionBank as Record<string, Record<string, Array<Omit<Question, 'category'>>>>)[category]?.[difficulty] || [];
      const selected = shuffleArray([...categoryQuestions]).slice(0, questionsPerCategory);

      selected.forEach(q => {
        newQuestions.push({ ...q, category });
      });
    });

    setQuestions(shuffleArray(newQuestions).slice(0, quizLength));
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setSelectedAnswer(undefined);
    setShowFeedback(false);
    setShowHint(false);
    setTextAnswer('');

    const newCategoryStats: Record<string, { correct: number; total: number }> = {};
    selectedCategories.forEach(cat => {
      newCategoryStats[cat] = { correct: 0, total: 0 };
    });
    setCategoryStats(newCategoryStats);

    setGamePhase('play');
  };

  const submitAnswer = () => {
    const question = questions[currentQuestion];
    let correct = false;

    if (question.type === 'text') {
      const userAnswer = textAnswer.trim().toLowerCase();
      const correctAnswer = (question.correct as string).toLowerCase();
      correct = userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer);
    } else {
      if (selectedAnswer === undefined) {
        alert('Please select an answer!');
        return;
      }
      correct = selectedAnswer === question.correct;
    }

    const newCategoryStats = { ...categoryStats };
    if (newCategoryStats[question.category]) {
      newCategoryStats[question.category].total++;
    }

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setBestStreak(prev => Math.max(prev, newStreak));
      if (newCategoryStats[question.category]) {
        newCategoryStats[question.category].correct++;
      }
      setIsCorrect(true);
    } else {
      setWrongAnswers(prev => prev + 1);
      setCurrentStreak(0);
      setIsCorrect(false);
    }

    setCategoryStats(newCategoryStats);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      saveStats(correctAnswers, questions.length, bestStreak);
      setGamePhase('result');
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(undefined);
      setShowFeedback(false);
      setShowHint(false);
      setTextAnswer('');
    }
  };

  const skipQuestion = () => {
    const question = questions[currentQuestion];
    setWrongAnswers(prev => prev + 1);
    setCurrentStreak(0);

    const newCategoryStats = { ...categoryStats };
    if (newCategoryStats[question.category]) {
      newCategoryStats[question.category].total++;
    }
    setCategoryStats(newCategoryStats);

    nextQuestion();
  };

  const resetToMenu = () => {
    setGamePhase('menu');
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      logic: 'Logic Puzzle',
      riddles: 'Word Riddle',
      math: 'Math Brain Teaser',
      lateral: 'Lateral Thinking'
    };
    return names[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      logic: '🧩',
      riddles: '🔤',
      math: '🔢',
      lateral: '💭'
    };
    return icons[category] || '🤔';
  };

  const currentQ = questions[currentQuestion];
  const progressPercent = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
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

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🧩</span>
            <span className="text-yellow-600 font-semibold">Brain Teasers</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
            {getH1('Brain Teaser Quiz')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Exercise your mind with challenging puzzles, logic problems, and creative riddles!')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Game Setup */}
              {gamePhase === 'menu' && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Challenge</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Questions</label>
                      <select
                        value={quizLength}
                        onChange={(e) => setQuizLength(Number(e.target.value))}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="5">Quick (5)</option>
                        <option value="10">Standard (10)</option>
                        <option value="15">Extended (15)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Categories</label>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['logic', 'riddles', 'math', 'lateral'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedCategories.includes(cat)
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {getCategoryIcon(cat)} {getCategoryDisplayName(cat)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={startQuiz}
                    className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
                  >
                    Start Quiz
                  </button>
                </div>
              )}

              {/* Game Play */}
              {gamePhase === 'play' && currentQ && (
                <div>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{currentQuestion + 1} of {questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-green-600">{correctAnswers}</div>
                      <div className="text-xs text-green-700">Correct</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-red-600">{wrongAnswers}</div>
                      <div className="text-xs text-red-700">Wrong</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-purple-600">{currentStreak}</div>
                      <div className="text-xs text-purple-700">Streak</div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl">{getCategoryIcon(currentQ.category)}</span>
                      <div>
                        <span className="text-sm font-medium text-yellow-700">{getCategoryDisplayName(currentQ.category)}</span>
                        <p className="text-gray-800 text-lg leading-relaxed mt-1">{currentQ.question}</p>
                      </div>
                    </div>

                    {showHint && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-4">
                        <p className="text-blue-700 text-sm">
                          <strong>💡 Hint:</strong> {currentQ.hint}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  {currentQ.type !== 'text' && currentQ.options && (
                    <div className="space-y-3 mb-6">
                      {currentQ.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(index)}
                          disabled={showFeedback}
                          className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                            selectedAnswer === index
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'border-gray-200 hover:border-yellow-400 hover:bg-yellow-50'
                          } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center">
                            <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Text Answer */}
                  {currentQ.type === 'text' && (
                    <div className="mb-6">
                      <textarea
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        disabled={showFeedback}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500"
                        placeholder="Type your answer..."
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  {!showFeedback && (
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        onClick={submitAnswer}
                        className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => setShowHint(true)}
                        disabled={showHint}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50"
                      >
                        💡 Hint
                      </button>
                      <button
                        onClick={skipQuestion}
                        className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600"
                      >
                        Skip
                      </button>
                    </div>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className="text-center">
                      <div className="text-xl font-semibold mb-4">
                        {isCorrect ? (
                          <span className="text-green-600">✅ Correct! {currentStreak > 1 && <span className="text-purple-600">🔥 {currentStreak} streak!</span>}</span>
                        ) : (
                          <span className="text-red-600">❌ Incorrect</span>
                        )}
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 mb-4 text-left">
                        <h4 className="font-semibold text-green-800 mb-2">💡 Explanation:</h4>
                        <p className="text-green-700">{currentQ.explanation}</p>
                      </div>
                      <button
                        onClick={nextQuestion}
                        className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600"
                      >
                        {currentQuestion + 1 >= questions.length ? 'See Results' : 'Next Question'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Results */}
              {gamePhase === 'result' && (
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {(() => {
                      const pct = Math.round((correctAnswers / questions.length) * 100);
                      if (pct >= 90) return '🏆';
                      if (pct >= 80) return '🌟';
                      if (pct >= 70) return '🎉';
                      if (pct >= 60) return '👍';
                      return '🧠';
                    })()}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Score</div>
                      <div className="text-3xl font-bold text-yellow-600">{correctAnswers}/{questions.length}</div>
                      <div className="text-sm text-gray-500">{Math.round((correctAnswers / questions.length) * 100)}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Best Streak</div>
                      <div className="text-3xl font-bold text-purple-600">{bestStreak}</div>
                      <div className="text-sm text-gray-500">in a row</div>
                    </div>
                  </div>

                  {Object.keys(categoryStats).length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 max-w-md mx-auto">
                      <h4 className="font-semibold text-gray-800 mb-3">Category Performance</h4>
                      <div className="space-y-2">
                        {Object.entries(categoryStats).map(([cat, stat]) => {
                          if (stat.total === 0) return null;
                          const pct = Math.round((stat.correct / stat.total) * 100);
                          return (
                            <div key={cat} className="flex justify-between items-center">
                              <span className="text-sm">{getCategoryIcon(cat)} {getCategoryDisplayName(cat)}</span>
                              <span className="font-bold">{stat.correct}/{stat.total} ({pct}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={resetToMenu}
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600"
                    >
                      Play Again
                    </button>
                    <Link
                      href="/us/tools/games"
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
                    >
                      More Games
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Read Carefully</h4>
                    <p className="text-sm text-gray-600">Take time to understand each puzzle</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Think Outside the Box</h4>
                    <p className="text-sm text-gray-600">Many puzzles have creative solutions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Use Hints Wisely</h4>
                    <p className="text-sm text-gray-600">Hints help without giving the answer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Learn from Explanations</h4>
                    <p className="text-sm text-gray-600">Read explanations to improve</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Brain Teasers: Mental Exercises for Sharp Minds</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Brain teasers are puzzles and riddles designed to challenge your thinking and test your cognitive abilities.
                These mental exercises have been used for centuries to entertain, educate, and assess intelligence. From ancient
                riddles of the Sphinx to modern IQ tests, brain teasers remain one of the most effective ways to stimulate
                critical thinking, improve problem-solving skills, and keep the mind sharp at any age.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">🧠 Critical Thinking</h3>
                  <p className="text-sm text-gray-600">Brain teasers force you to think beyond obvious solutions and consider problems from multiple angles.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">🔍 Pattern Recognition</h3>
                  <p className="text-sm text-gray-600">Many brain teasers involve identifying patterns, a skill essential for mathematics and science.</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">💡 Creative Problem Solving</h3>
                  <p className="text-sm text-gray-600">These puzzles encourage &quot;thinking outside the box&quot; and finding unconventional solutions.</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h3 className="font-semibold text-orange-800 mb-2">⚡ Mental Agility</h3>
                  <p className="text-sm text-gray-600">Regular practice with brain teasers improves mental flexibility and cognitive speed.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Scientific Benefits</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Research in cognitive psychology has shown that engaging with brain teasers and puzzles can help build
                  cognitive reserve - a buffer against age-related mental decline. Studies suggest that people who regularly
                  challenge their minds with puzzles show improved memory, better concentration, and may even reduce their
                  risk of developing dementia. Brain teasers are particularly effective because they require active engagement
                  rather than passive consumption.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Types of Brain Teasers</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Logic puzzles - require step-by-step reasoning to reach a conclusion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Lateral thinking - need creative approaches to seemingly simple problems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>Math riddles - combine numerical skills with logical reasoning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>Word puzzles - test vocabulary, language patterns, and verbal reasoning</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
{/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<div className="sticky top-6 space-y-6">
              <AdBanner className="mx-auto" />

              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📊</span> Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quizzes Played</span>
                    <span className="font-bold text-gray-800">{stats.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Correct</span>
                    <span className="font-bold text-green-600">{stats.totalCorrect}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="font-bold text-blue-600">
                      {stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Streak</span>
                    <span className="font-bold text-purple-600">{stats.bestStreak}</span>
                  </div>
                </div>
              </div>
{/* Related Games */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4">Related Games</h3>
                <div className="space-y-3">
                  {relatedGames.map((game, index) => (
                    <Link
                      key={index}
                      href={game.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 ${game.color ?? 'bg-gray-500'} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {game.icon ? getGameIcon(game.icon) : '🎮'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">{game.title}</div>
                        <div className="text-xs text-gray-500">{game.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
