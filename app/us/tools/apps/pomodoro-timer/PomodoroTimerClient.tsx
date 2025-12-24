'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is the Pomodoro Technique?',
    answer: 'The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses 25-minute focused work sessions (called "pomodoros") followed by 5-minute short breaks. After 4 pomodoros, you take a longer 15-30 minute break.',
    order: 1
  },
  {
    id: '2',
    question: 'Why are work sessions 25 minutes long?',
    answer: '25 minutes is considered optimal because it is long enough to make meaningful progress on tasks, but short enough to maintain intense focus without mental fatigue. You can customize this in our timer settings.',
    order: 2
  },
  {
    id: '3',
    question: 'How do I customize the timer settings?',
    answer: 'Use the settings panel below the timer to adjust focus time (default 25 min), short break (default 5 min), and long break (default 15 min). Changes take effect immediately.',
    order: 3
  },
  {
    id: '4',
    question: 'Will the timer notify me when time is up?',
    answer: 'Yes! Enable browser notifications to receive alerts when sessions end. You can also enable sound alerts in the settings. The page title updates with the remaining time so you can see it in your browser tab.',
    order: 4
  },
  {
    id: '5',
    question: 'What happens after 4 pomodoros?',
    answer: 'After completing 4 focus sessions (pomodoros), the timer automatically switches to a longer break of 15-30 minutes. This helps prevent mental burnout and maintains productivity throughout the day.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I track my productivity?',
    answer: 'Yes, the timer displays the number of completed pomodoro sessions. This helps you track your daily productivity and see how much focused work you have accomplished.',
    order: 6
  }
];

export default function PomodoroTimerClient() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [focusTime, setFocusTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const radius = 135;
  const circumference = 2 * Math.PI * radius;

  const { getH1, getSubHeading } = usePageSEO('pomodoro-timer');

  const webAppSchema = generateWebAppSchema(
    'Pomodoro Timer - Free Online Focus & Productivity Timer',
    'Free online Pomodoro timer for focused work sessions. Boost productivity with 25-minute focus intervals, customizable breaks, and session tracking.',
    'https://economictimes.indiatimes.com/us/tools/apps/pomodoro-timer',
    'Utility'
  );

  const updateDisplay = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update page title
    const sessionText = currentSession === 'focus' ? 'Focus Session' :
                       currentSession === 'shortBreak' ? 'Short Break' : 'Long Break';
    document.title = `${timeString} - ${sessionText} | Pomodoro Timer`;

    // Update progress circle
    if (progressCircleRef.current) {
      const progress = timeLeft / totalTime;
      const offset = circumference - (progress * circumference);
      progressCircleRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [timeLeft, totalTime, currentSession, circumference]);

  const playNotificationSound = useCallback(() => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  const showNotification = useCallback((message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: message,
        icon: 'https://economictimes.indiatimes.com/icons/etfavicon.ico'
      });
    } else {
      alert(message);
    }
  }, []);

  const sessionComplete = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (soundEnabled) {
      playNotificationSound();
    }

    if (currentSession === 'focus') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);

      // Determine next session type
      if (newSessionsCompleted % 4 === 0) {
        setCurrentSession('longBreak');
        const newTime = longBreak * 60;
        setTimeLeft(newTime);
        setTotalTime(newTime);
        showNotification('Great work! Time for a long break.');
      } else {
        setCurrentSession('shortBreak');
        const newTime = shortBreak * 60;
        setTimeLeft(newTime);
        setTotalTime(newTime);
        showNotification('Break time! Take a rest.');
      }
    } else {
      setCurrentSession('focus');
      const newTime = focusTime * 60;
      setTimeLeft(newTime);
      setTotalTime(newTime);
      showNotification('Focus time! Get back to work.');
    }
  }, [currentSession, sessionsCompleted, focusTime, shortBreak, longBreak, soundEnabled, playNotificationSound, showNotification]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            sessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, sessionComplete]);

  useEffect(() => {
    updateDisplay();
  }, [updateDisplay]);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    if (currentSession === 'focus') {
      setTimeLeft(focusTime * 60);
      setTotalTime(focusTime * 60);
    } else if (currentSession === 'shortBreak') {
      setTimeLeft(shortBreak * 60);
      setTotalTime(shortBreak * 60);
    } else {
      setTimeLeft(longBreak * 60);
      setTotalTime(longBreak * 60);
    }
  };

  const updateCurrentTime = (type: 'focus' | 'shortBreak' | 'longBreak', value: number) => {
    if (type === 'focus') {
      setFocusTime(value);
      if (currentSession === 'focus') {
        setTimeLeft(value * 60);
        setTotalTime(value * 60);
      }
    } else if (type === 'shortBreak') {
      setShortBreak(value);
      if (currentSession === 'shortBreak') {
        setTimeLeft(value * 60);
        setTotalTime(value * 60);
      }
    } else {
      setLongBreak(value);
      if (currentSession === 'longBreak') {
        setTimeLeft(value * 60);
        setTotalTime(value * 60);
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const sessionTypeText = currentSession === 'focus' ? 'Focus Session' :
                         currentSession === 'shortBreak' ? 'Short Break' : 'Long Break';

  const pomodoroIndicators = Array.from({ length: 4 }, (_, i) => i);

  const relatedTools = [
    { name: 'Timer', href: '/us/tools/apps/timer', icon: '⏱️' },
    { name: 'Stopwatch', href: '/us/tools/apps/stopwatch', icon: '⏱️' },
    { name: 'Age Calculator', href: '/us/tools/calculators/age-calculator', icon: '🎂' },
    { name: 'Date Calculator', href: '/us/tools/calculators/date-calculator', icon: '📅' }
  ];

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-100 to-orange-100 px-5 py-2.5 rounded-full mb-3">
          <span className="text-2xl">🍅</span>
          <span className="text-red-600 font-semibold">Pomodoro Timer</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3">
          {getH1('Pomodoro Timer')}
        </h1>

        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Boost your productivity with the Pomodoro Technique. 25-minute focus sessions followed by short breaks.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Mobile Stats Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 lg:hidden">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Session</div>
              <div className="text-sm sm:text-base font-bold truncate">{sessionTypeText.split(' ')[0]}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Status</div>
              <div className="text-sm sm:text-base font-bold">{isRunning ? 'Running' : 'Paused'}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Completed</div>
              <div className="text-sm sm:text-base font-bold">{sessionsCompleted}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 text-center text-white shadow-lg">
              <div className="text-[10px] sm:text-xs font-medium opacity-90 uppercase tracking-wide">Cycle</div>
              <div className="text-sm sm:text-base font-bold">{(sessionsCompleted % 4) + 1}/4</div>
            </div>
          </div>

          {/* Timer Section */}
          <div className="timer-container bg-gradient-to-br from-white via-red-50/30 to-orange-50/30 rounded-2xl shadow-xl p-6 md:p-8 mb-6 border-2 border-red-100">
            {/* Timer Display */}
            <div className="text-center mb-6">
              {/* Circular Progress Ring */}
              <div className="relative inline-block mb-4">
                <svg className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] -rotate-90" viewBox="0 0 300 300">
                  <circle
                    stroke="#fee2e2"
                    strokeWidth="14"
                    fill="white"
                    r="135"
                    cx="150"
                    cy="150"
                  />
                  <circle
                    stroke="url(#gradient)"
                    strokeWidth="14"
                    fill="transparent"
                    r="135"
                    cx="150"
                    cy="150"
                    ref={progressCircleRef}
                    className="transition-all duration-500 ease-out"
                    style={{
                      strokeDasharray: `${circumference} ${circumference}`,
                      strokeDashoffset: 0,
                      strokeLinecap: 'round'
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl sm:text-6xl font-mono font-bold bg-gradient-to-br from-red-600 to-orange-600 bg-clip-text text-transparent mb-1">
                    {timeDisplay}
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-gray-700">
                    {sessionTypeText}
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={start}
                  className={`timer-btn bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 transform ${isRunning ? 'hidden' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                    Start
                  </span>
                </button>
                <button
                  onClick={pause}
                  className={`timer-btn bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 transform ${!isRunning ? 'hidden' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z"/>
                    </svg>
                    Pause
                  </span>
                </button>
                <button
                  onClick={reset}
                  className="timer-btn bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 transform"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                    </svg>
                    Reset
                  </span>
                </button>
              </div>
            </div>

            {/* Session Counter */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl px-6 py-3 border-2 border-red-200 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-gray-600 font-semibold uppercase tracking-wide">Completed</div>
                    <div className="text-xl font-black text-gray-900">{sessionsCompleted}</div>
                  </div>
                </div>
                <div className="border-l-2 border-red-300 h-8"></div>
                <div className="flex gap-2">
                  {pomodoroIndicators.map((i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i < (sessionsCompleted % 4)
                          ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-sm'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50/50 rounded-xl p-4 border border-gray-200 shadow-md">
              <h3 className="text-lg font-bold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span>Settings</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <span className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-[10px]">🎯</span>
                    Focus Time
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={focusTime}
                      onChange={(e) => updateCurrentTime('focus', parseInt(e.target.value) || 1)}
                      min="1"
                      max="60"
                      className="w-full text-center bg-gradient-to-br from-gray-50 to-white border-2 border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-base font-bold focus:border-red-500 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all hover:border-red-300"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-semibold">min</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <span className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-[10px]">☕</span>
                    Short Break
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={shortBreak}
                      onChange={(e) => updateCurrentTime('shortBreak', parseInt(e.target.value) || 1)}
                      min="1"
                      max="30"
                      className="w-full text-center bg-gradient-to-br from-gray-50 to-white border-2 border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-base font-bold focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all hover:border-green-300"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-semibold">min</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-[10px]">🌟</span>
                    Long Break
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={longBreak}
                      onChange={(e) => updateCurrentTime('longBreak', parseInt(e.target.value) || 1)}
                      min="1"
                      max="60"
                      className="w-full text-center bg-gradient-to-br from-gray-50 to-white border-2 border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-base font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all hover:border-blue-300"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-semibold">min</span>
                  </div>
                </div>
              </div>

              <div className="text-center bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-gray-300 text-red-500 focus:ring-2 focus:ring-red-400 transition-all"
                  />
                  <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    <span className="text-base">🔔</span>
                    Play notification sound
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* How to Use Section */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">How the Pomodoro Technique Works</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xl">🍅</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">1. Choose a Task</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Pick something you want to work on and focus solely on that single task.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">2. Set Timer to 25 Minutes</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Work with complete focus for the entire 25-minute period without distractions.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xl">☕</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">3. Take a 5-Minute Break</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">Step away from work completely and relax your mind to recharge.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xl">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">4. Repeat & Take Long Breaks</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">After 4 sessions, take a longer 15-30 minute break to fully reset.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tips Section */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl">💡</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">Pro Tips</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3">
                <span className="text-amber-500 font-bold text-lg">•</span>
                <p className="text-gray-700 text-sm">Plan your tasks before starting a session</p>
              </div>
              <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3">
                <span className="text-amber-500 font-bold text-lg">•</span>
                <p className="text-gray-700 text-sm">Silence notifications during focus time</p>
              </div>
              <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3">
                <span className="text-amber-500 font-bold text-lg">•</span>
                <p className="text-gray-700 text-sm">Use breaks to stretch and hydrate</p>
              </div>
              <div className="flex items-start gap-3 bg-white/80 rounded-lg p-3">
                <span className="text-amber-500 font-bold text-lg">•</span>
                <p className="text-gray-700 text-sm">Track completed pomodoros daily</p>
              </div>
            </div>
          </div>
        </div>
{/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats - Hidden on mobile */}
          <div className="hidden lg:block bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📊</span>
              Session Stats
            </h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Current Session</div>
                <div className="text-lg font-bold">{sessionTypeText}</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Status</div>
                <div className="text-lg font-bold">{isRunning ? 'Running' : 'Paused'}</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Sessions Completed</div>
                <div className="text-lg font-bold">{sessionsCompleted}</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 text-white">
                <div className="text-xs font-medium opacity-90 uppercase tracking-wide">Current Cycle</div>
                <div className="text-lg font-bold">{(sessionsCompleted % 4) + 1} of 4</div>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Ad Banner */}
          <AdBanner />
{/* Related Tools */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">🔗</span>
              Related Tools
            </h3>
            <div className="space-y-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Pomodoro Benefits */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">✨</span>
              Benefits
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-green-500">✓</span>
                <span>Improved focus & concentration</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-green-500">✓</span>
                <span>Reduced mental fatigue</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-green-500">✓</span>
                <span>Better time awareness</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-green-500">✓</span>
                <span>Increased productivity</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <span className="text-green-500">✓</span>
                <span>Work-life balance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <GameAppMobileMrec2 />



      

      {/* FAQs Section */}
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <FirebaseFAQs pageId="pomodoro-timer" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}
