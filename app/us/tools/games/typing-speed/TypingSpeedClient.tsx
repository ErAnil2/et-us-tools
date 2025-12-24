'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { MobileMrec1, MobileMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';
import MRECBanners from '@/components/MRECBanners';
interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface TypingSpeedClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface TextSamples {
  random: string[];
  quotes: string[];
  numbers: string[];
  programming: string[];
}

interface Rating {
  emoji: string;
  title: string;
  description: string;
}

interface Stats {
  testsTaken: number;
  totalWPM: number;
  bestWPM: number;
  bestAccuracy: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do you measure typing speed?',
    answer: 'Typing speed is measured in Words Per Minute (WPM). We calculate the number of correctly typed words divided by the time elapsed in minutes.',
    order: 1
  },
  {
    id: '2',
    question: 'What is a good typing speed?',
    answer: 'Average typing speed is around 40 WPM. Professional typists typically reach 65-75 WPM. Expert typists can exceed 80 WPM with high accuracy.',
    order: 2
  },
  {
    id: '3',
    question: 'How can I improve my typing speed?',
    answer: 'Practice regularly, use proper finger positioning, focus on accuracy before speed, and try different text types like quotes, numbers, or programming code.',
    order: 3
  },
  {
    id: '4',
    question: 'What are the different text types available?',
    answer: 'We offer Random Words for general practice, Famous Quotes for motivation, Numbers & Symbols for technical typing, and Programming Text for developers.',
    order: 4
  },
  {
    id: '5',
    question: 'Does the test save my progress?',
    answer: 'Yes! Your best WPM, best accuracy, average WPM, and total tests taken are saved locally in your browser.',
    order: 5
  },
  {
    id: '6',
    question: 'What durations are available for the test?',
    answer: 'You can choose from 30 seconds, 1 minute, 2 minutes, or 5 minutes depending on how long you want to practice.',
    order: 6
  }
];

export default function TypingSpeedClient({ relatedGames = defaultRelatedGames }: TypingSpeedClientProps) {
  const [testActive, setTestActive] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [duration, setDuration] = useState(60);
  const [textType, setTextType] = useState<'random' | 'quotes' | 'numbers' | 'programming'>('random');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [typedValue, setTypedValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showResetBtn, setShowResetBtn] = useState(false);

  // Final results
  const [finalWPM, setFinalWPM] = useState(0);
  const [finalCPM, setFinalCPM] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);
  const [finalErrors, setFinalErrors] = useState(0);
  const [rating, setRating] = useState<Rating>({ emoji: '⭐', title: 'Good Job!', description: 'Keep practicing to improve!' });
  const [improvementTips, setImprovementTips] = useState<string[]>([
    'Practice regularly to build muscle memory',
    'Focus on accuracy before speed',
    'Use proper finger positioning'
  ]);

  // Stats
  const [bestWPM, setBestWPM] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [avgWPM, setAvgWPM] = useState(0);
  const [testsTaken, setTestsTaken] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingInputRef = useRef<HTMLTextAreaElement>(null);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('typing-speed');

  const webAppSchema = generateWebAppSchema({
    name: 'Typing Speed Test - Free Online WPM Test',
    description: 'Test and improve your typing speed with our free typing speed test. Measure your WPM and accuracy with various text samples.',
    url: 'https://economictimes.indiatimes.com/us/tools/games/typing-speed',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  const textSamples: TextSamples = {
    random: [
      'the quick brown fox jumps over the lazy dog near the river bank',
      'typing speed can be improved with regular practice and proper technique',
      'keyboard skills are essential for modern computer users in all fields',
      'accuracy is more important than speed when learning to type properly',
      'practice makes perfect when developing muscle memory for typing'
    ],
    quotes: [
      'The only way to do great work is to love what you do. Stay hungry, stay foolish.',
      'Innovation distinguishes between a leader and a follower in any industry.',
      'Your time is limited so do not waste it living someone else dream or life.',
      'The future belongs to those who believe in the beauty of their dreams today.',
      'Success is not final failure is not fatal it is the courage to continue that counts.'
    ],
    numbers: [
      'The year 2024 marks 25 years since the Y2K preparations began in 1999.',
      'Calculate: 123 + 456 = 579, then multiply by 8.5% to get the result.',
      'Use variables like $total, @user_count, and #hashtag in your code blocks.',
      'Version 3.14.159 was released on 2023-12-31 with bug fixes and updates.',
      'The API endpoint returns JSON: {"id": 42, "name": "test", "active": true}'
    ],
    programming: [
      'function calculateSum(array) { return array.reduce((a, b) => a + b, 0); }',
      'const userData = await fetch("/api/users").then(response => response.json());',
      'if (condition === true && status !== "pending") { processRequest(); }',
      'class TypingTest extends Component { constructor(props) { super(props); } }',
      'SELECT users.name, COUNT(orders.id) FROM users JOIN orders ON users.id = orders.user_id;'
    ]
  };

  // Generate text on mount and when text type changes
  useEffect(() => {
    generateText();
  }, [textType]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const generateText = useCallback(() => {
    const samples = textSamples[textType];
    const newText = samples[Math.floor(Math.random() * samples.length)];
    setCurrentText(newText);
    setCurrentIndex(0);
    setErrors(0);
    setTypedValue('');
  }, [textType]);

  const loadStats = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stats: Stats = JSON.parse(localStorage.getItem('typingStats') || '{}');
      setBestWPM(stats.bestWPM || 0);
      setBestAccuracy(stats.bestAccuracy || 0);
      setAvgWPM(stats.testsTaken > 0 ? Math.round((stats.totalWPM || 0) / stats.testsTaken) : 0);
      setTestsTaken(stats.testsTaken || 0);
    }
  }, []);

  const saveStats = useCallback((wpmValue: number, accuracyValue: number) => {
    if (typeof window !== 'undefined') {
      const stats: Stats = JSON.parse(localStorage.getItem('typingStats') || '{}');

      stats.testsTaken = (stats.testsTaken || 0) + 1;
      stats.totalWPM = (stats.totalWPM || 0) + wpmValue;
      stats.bestWPM = Math.max(stats.bestWPM || 0, wpmValue);
      stats.bestAccuracy = Math.max(stats.bestAccuracy || 0, accuracyValue);

      localStorage.setItem('typingStats', JSON.stringify(stats));
      loadStats();
    }
  }, [loadStats]);

  const updateStats = useCallback(() => {
    if (!testActive || !startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = typedValue.split(' ').length;
    const calculatedWpm = Math.round(wordsTyped / timeElapsed) || 0;

    const totalChars = currentIndex;
    const calculatedAccuracy = totalChars > 0 ? Math.round(((totalChars - errors) / totalChars) * 100) : 100;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
  }, [testActive, startTime, typedValue, currentIndex, errors]);

  const getRating = useCallback((wpmValue: number, accuracyValue: number): Rating => {
    if (accuracyValue < 85) {
      return {
        emoji: '😅',
        title: 'Focus on Accuracy',
        description: 'Accuracy is crucial. Slow down and focus on hitting the right keys.'
      };
    } else if (wpmValue >= 80) {
      return {
        emoji: '🚀',
        title: 'Expert Typist!',
        description: 'Outstanding performance! You have exceptional typing skills.'
      };
    } else if (wpmValue >= 65) {
      return {
        emoji: '🏆',
        title: 'Excellent Typist',
        description: 'Great job! Your typing speed is well above average.'
      };
    } else if (wpmValue >= 50) {
      return {
        emoji: '👍',
        title: 'Good Typist',
        description: 'Well done! You have solid typing skills.'
      };
    } else if (wpmValue >= 35) {
      return {
        emoji: '📈',
        title: 'Average Typist',
        description: 'You are doing well. Keep practicing to improve further.'
      };
    } else {
      return {
        emoji: '💪',
        title: 'Keep Practicing',
        description: 'Regular practice will help you improve your typing speed.'
      };
    }
  }, []);

  const getImprovementTips = useCallback((wpmValue: number, accuracyValue: number): string[] => {
    const tips: string[] = [];

    if (accuracyValue < 90) {
      tips.push('Focus on accuracy before trying to increase speed');
      tips.push('Practice typing slowly and correctly first');
    }

    if (wpmValue < 40) {
      tips.push('Learn proper finger positioning on the keyboard');
      tips.push('Practice touch typing without looking at keys');
    }

    if (wpmValue >= 40 && wpmValue < 60) {
      tips.push('Work on typing common word patterns');
      tips.push('Use typing games to make practice more fun');
    }

    if (wpmValue >= 60) {
      tips.push('Challenge yourself with more difficult texts');
      tips.push('Focus on maintaining consistency in your speed');
    }

    tips.push('Take regular breaks to avoid fatigue');
    tips.push('Maintain good posture while typing');

    return tips;
  }, []);

  const calculateResults = useCallback(() => {
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = typedValue.split(' ').length;
    const totalChars = currentIndex;

    const wpmValue = Math.round(wordsTyped / timeElapsed) || 0;
    const cpmValue = Math.round(totalChars / timeElapsed) || 0;
    const accuracyValue = totalChars > 0 ? Math.round(((totalChars - errors) / totalChars) * 100) : 100;

    setFinalWPM(wpmValue);
    setFinalCPM(cpmValue);
    setFinalAccuracy(accuracyValue);
    setFinalErrors(errors);

    const calculatedRating = getRating(wpmValue, accuracyValue);
    setRating(calculatedRating);

    const tips = getImprovementTips(wpmValue, accuracyValue);
    setImprovementTips(tips);

    saveStats(wpmValue, accuracyValue);
    setShowResults(true);
  }, [startTime, typedValue, currentIndex, errors, getRating, getImprovementTips, saveStats]);

  const endTest = useCallback(() => {
    setTestActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setShowResetBtn(false);
    calculateResults();
  }, [calculateResults]);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTimeLeft = prev - 1;
        if (newTimeLeft <= 0) {
          endTest();
          return 0;
        }
        return newTimeLeft;
      });
    }, 1000);
  }, [endTest]);

  const startTest = useCallback(() => {
    setTestActive(true);
    setStartTime(Date.now());
    setTimeLeft(duration);
    setCurrentIndex(0);
    setErrors(0);
    setTypedValue('');
    setShowResetBtn(true);
    setShowResults(false);
    setWpm(0);
    setAccuracy(100);

    if (typingInputRef.current) {
      typingInputRef.current.focus();
    }

    startTimer();
  }, [duration, startTimer]);

  const resetTest = useCallback(() => {
    setTestActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setCurrentIndex(0);
    setErrors(0);
    setTypedValue('');
    setShowResetBtn(false);
    setShowResults(false);
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);

    generateText();
  }, [duration, generateText]);

  const handleTyping = useCallback((value: string) => {
    if (!testActive) return;

    setTypedValue(value);
    const inputLength = value.length;

    setCurrentIndex(inputLength);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < inputLength; i++) {
      if (value[i] !== currentText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Check if completed
    if (inputLength >= currentText.length) {
      endTest();
    }
  }, [testActive, currentText, endTest]);

  // Update stats periodically
  useEffect(() => {
    if (testActive) {
      updateStats();
      const statsInterval = setInterval(updateStats, 100);
      return () => clearInterval(statsInterval);
    }
  }, [testActive, updateStats]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const renderTextDisplay = () => {
    const typedText = currentText.slice(0, currentIndex);
    const currentChar = currentText[currentIndex];
    const remainingText = currentText.slice(currentIndex + 1);

    let displayHTML = '';

    // Typed text (green for correct, red for errors)
    for (let i = 0; i < typedText.length; i++) {
      const inputChar = typedValue[i] || '';
      const targetChar = currentText[i];
      const isCorrect = inputChar === targetChar;

      displayHTML += `<span class="${isCorrect ? 'bg-green-200' : 'bg-red-200'}">${targetChar}</span>`;
    }

    // Current character
    if (currentChar) {
      displayHTML += `<span class="bg-yellow-300 animate-pulse">${currentChar}</span>`;
    }

    // Remaining text
    displayHTML += `<span class="text-gray-500">${remainingText}</span>`;

    return displayHTML || 'Click "Start Typing Test" to begin...';
  };

  const progress = (currentIndex / currentText.length) * 100;

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

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Hero Section */}
      <div className="text-center mb-4 sm:mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-green-100 px-6 py-3 rounded-full mb-6">
          <span className="text-xl sm:text-2xl">⌨️</span>
          <span className="text-blue-600 font-semibold text-sm sm:text-base">Typing Challenge</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">{getH1('Typing Speed Test')}</h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Test your typing speed and accuracy! Type the given text as quickly and accurately as possible to measure your WPM and improve your skills.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Game Interface */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        {/* Test Configuration */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Duration:</label>
            <select
              id="duration"
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={duration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                setDuration(newDuration);
                setTimeLeft(newDuration);
              }}
              disabled={testActive}
            >
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="120">2 minutes</option>
              <option value="300">5 minutes</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Text Type:</label>
            <select
              id="textType"
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={textType}
              onChange={(e) => setTextType(e.target.value as 'random' | 'quotes' | 'numbers' | 'programming')}
              disabled={testActive}
            >
              <option value="random">Random Words</option>
              <option value="quotes">Famous Quotes</option>
              <option value="numbers">Numbers & Symbols</option>
              <option value="programming">Programming Text</option>
            </select>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{wpm}</div>
            <div className="text-sm text-gray-600">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{accuracy}</div>
            <div className="text-sm text-gray-600">Accuracy %</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{timeLeft}</div>
            <div className="text-sm text-gray-600">Time Left</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{errors}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center mb-6">
          <button
            id="startBtn"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors ${testActive ? 'hidden' : ''}`}
            onClick={startTest}
          >
            🎮 Start Typing Test
          </button>

          <button
            id="resetBtn"
            className={`bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors ml-4 ${!showResetBtn ? 'hidden' : ''}`}
            onClick={resetTest}
          >
            🔄 Reset
          </button>
        </div>

        {/* Text Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 min-h-32 relative">
          <div
            id="textDisplay"
            className="text-lg leading-relaxed font-mono break-words"
            dangerouslySetInnerHTML={{ __html: renderTextDisplay() }}
          />

          {/* Typing Input */}
          <textarea
            ref={typingInputRef}
            id="typingInput"
            className="absolute inset-0 w-full h-full p-6 bg-transparent text-transparent resize-none outline-none caret-blue-600 text-lg font-mono leading-relaxed"
            placeholder=""
            disabled={!testActive}
            value={typedValue}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
              }
            }}
          />
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-2 mb-4">
          <div
            id="progressBar"
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-600">
          <p className="mb-2">⌨️ <strong>Instructions:</strong></p>
          <p className="text-sm">Type the text above as accurately and quickly as possible. Errors will be highlighted in red.</p>
          <p className="text-sm mt-1">💡 Focus on accuracy first, then speed will naturally follow!</p>
        </div>
      </div>

      {/* Results Panel */}
      <div id="resultsPanel" className={`bg-white rounded-2xl shadow-lg p-8 mb-8 ${!showResults ? 'hidden' : ''}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏁 Test Results</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Performance Metrics:</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 rounded p-3">
                <span>Words Per Minute (WPM)</span>
                <span className="font-bold text-2xl text-blue-600">{finalWPM}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded p-3">
                <span>Accuracy</span>
                <span className="font-bold text-2xl text-green-600">{finalAccuracy}%</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded p-3">
                <span>Characters Per Minute (CPM)</span>
                <span className="font-bold text-xl text-purple-600">{finalCPM}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded p-3">
                <span>Total Errors</span>
                <span className="font-bold text-xl text-red-600">{finalErrors}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Performance Rating:</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
              <div className="text-4xl mb-2">{rating.emoji}</div>
              <div className="text-lg font-semibold text-gray-800">{rating.title}</div>
              <div className="text-sm text-gray-600 mt-2">{rating.description}</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">💡 Improvement Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {improvementTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            id="tryAgainBtn"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            onClick={resetTest}
          >
            Try Again
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📈 Your Typing Statistics</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-lg font-semibold text-gray-800">Best WPM</div>
            <div className="text-2xl font-bold text-blue-600">{bestWPM}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-lg font-semibold text-gray-800">Best Accuracy</div>
            <div className="text-2xl font-bold text-green-600">{bestAccuracy}%</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-lg font-semibold text-gray-800">Avg WPM</div>
            <div className="text-2xl font-bold text-purple-600">{avgWPM}</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-lg font-semibold text-gray-800">Tests Taken</div>
            <div className="text-2xl font-bold text-orange-600">{testsTaken}</div>
          </div>
        </div>
      </div>

      {/* WPM Guide */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">⌨️ Typing Speed Guide</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 WPM Classifications:</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded p-3">
                <span>Beginner</span>
                <span className="font-bold text-gray-600">0-20 WPM</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded p-3">
                <span>Below Average</span>
                <span className="font-bold text-red-600">21-30 WPM</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded p-3">
                <span>Average</span>
                <span className="font-bold text-yellow-600">31-40 WPM</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded p-3">
                <span>Above Average</span>
                <span className="font-bold text-blue-600">41-50 WPM</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded p-3">
                <span>Good</span>
                <span className="font-bold text-green-600">51-65 WPM</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded p-3">
                <span>Excellent</span>
                <span className="font-bold text-purple-600">66-80 WPM</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded p-3">
                <span>Expert</span>
                <span className="font-bold text-indigo-600">81+ WPM</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Improvement Tips:</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• <strong>Proper Posture:</strong> Sit up straight with feet flat on the floor</li>
              <li>• <strong>Hand Position:</strong> Keep wrists straight and hands hovering over keys</li>
              <li>• <strong>Touch Typing:</strong> Learn to type without looking at the keyboard</li>
              <li>• <strong>Rhythm:</strong> Develop a steady, consistent typing rhythm</li>
              <li>• <strong>Practice:</strong> Regular practice is key to improvement</li>
              <li>• <strong>Accuracy First:</strong> Focus on accuracy before trying to increase speed</li>
              <li>• <strong>Finger Placement:</strong> Use proper finger-to-key assignments</li>
            </ul>

            <div className="mt-4 bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">⭐ Pro Tips:</h4>
              <p className="text-sm text-gray-600">
                Practice 15-20 minutes daily for consistent improvement. Focus on problem keys
                and common word patterns. Use online typing games and exercises to make
                practice more engaging and fun!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Typing Speed: Essential Digital Skill</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          In today&apos;s digital world, typing speed is one of the most valuable skills you can develop. Whether you&apos;re
          a student, professional, or simply someone who uses computers daily, faster typing translates directly to
          increased productivity. Typing speed is measured in Words Per Minute (WPM), with the average person typing
          around 40 WPM, while professional typists often exceed 80 WPM.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">⌨️ Touch Typing</h3>
            <p className="text-sm text-gray-600">Learn to type without looking at the keyboard - the foundation of fast, accurate typing.</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">📈 Productivity Boost</h3>
            <p className="text-sm text-gray-600">Doubling your typing speed effectively doubles your written output per hour.</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">🎯 Accuracy Matters</h3>
            <p className="text-sm text-gray-600">Fast typing with errors isn&apos;t efficient - aim for 95%+ accuracy first, then speed.</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2">💼 Career Value</h3>
            <p className="text-sm text-gray-600">Many jobs require minimum typing speeds, and faster typing is always an advantage.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">WPM Benchmarks</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Below 40 WPM is considered slow for professional work. 40-60 WPM is average and sufficient for most office
            jobs. 60-80 WPM is above average and excellent for writing-intensive roles. Above 80 WPM is considered fast
            and typical of professional transcriptionists. Some competitive typists exceed 150 WPM! Regular practice
            with typing tests like this one can help you steadily improve your speed while maintaining accuracy.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-3">Tips for Faster Typing</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Use proper finger placement on the home row (ASDF JKL;)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>Practice regularly - even 10 minutes daily can show significant improvement</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              <span>Focus on accuracy first, speed will naturally follow with muscle memory</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span>Keep your eyes on the screen, not the keyboard, to develop touch typing</span>
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

      
      <MRECBanners />

      {/* Related Games */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Related Games</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {relatedGames.slice(0, 6).map((game, index) => (
            <Link
              key={index}
              href={game.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                🎮
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">{game.title}</div>
                <div className="text-xs text-gray-500">{game.description}</div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/us/tools/games" className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Games →
        </Link>
      </div>
      </div>
    </>
  );
}
