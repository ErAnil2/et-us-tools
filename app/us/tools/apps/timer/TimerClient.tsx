'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface RelatedApp {
  href: string;
  title: string;
  description: string;
  color: string;
}

const defaultRelatedApps: RelatedApp[] = [
  { href: '/us/tools/apps/qr-generator', title: 'QR Generator', description: 'Generate QR codes', color: 'bg-blue-500' },
  { href: '/us/tools/apps/timer', title: 'Timer', description: 'Countdown timer', color: 'bg-green-500' },
  { href: '/us/tools/apps/stopwatch', title: 'Stopwatch', description: 'Track time', color: 'bg-purple-500' },
];

interface TimerPreset {
  label: string;
  minutes: number;
  icon: string;
}

const presets: TimerPreset[] = [
  { label: '1 min', minutes: 1, icon: '⚡' },
  { label: '3 min', minutes: 3, icon: '🥚' },
  { label: '5 min', minutes: 5, icon: '☕' },
  { label: '10 min', minutes: 10, icon: '📖' },
  { label: '15 min', minutes: 15, icon: '🧘' },
  { label: '20 min', minutes: 20, icon: '💪' },
  { label: '25 min', minutes: 25, icon: '🍅' },
  { label: '30 min', minutes: 30, icon: '📚' },
  { label: '45 min', minutes: 45, icon: '🎯' },
  { label: '60 min', minutes: 60, icon: '⏰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I set a custom time on the timer?",
    answer: "You can set a custom time by clicking on the hours, minutes, or seconds display and entering your desired value. Alternatively, use the quick preset buttons for common durations like 5, 10, 15, or 25 minutes.",
    order: 1
  },
  {
    id: '2',
    question: "Will the timer alert me when it's done?",
    answer: "Yes! When the timer reaches zero, it will play an audio alert sound (if enabled) and show a visual notification. You can enable or disable sound alerts in the settings.",
    order: 2
  },
  {
    id: '3',
    question: "Can I pause and resume the timer?",
    answer: "Absolutely! Click the Pause button to stop the countdown temporarily. Click Start again to resume from where you left off. You can also reset the timer to start over.",
    order: 3
  },
  {
    id: '4',
    question: "What happens if I close the browser tab?",
    answer: "If you close the tab or browser, the timer will stop. For important timing needs, we recommend keeping the tab open. The timer uses your device's local time for accuracy.",
    order: 4
  },
  {
    id: '5',
    question: "Can I run multiple timers at once?",
    answer: "This timer is designed for single countdown use. For multiple simultaneous timers, you can open multiple browser tabs or use dedicated timer applications.",
    order: 5
  },
  {
    id: '6',
    question: "Is there a maximum time limit?",
    answer: "You can set the timer for up to 99 hours, 59 minutes, and 59 seconds. This covers virtually any timing need from quick tasks to extended study sessions.",
    order: 6
  }
];

const relatedApps = [
  { href: '/us/tools/apps/stopwatch', title: 'Stopwatch', description: 'Track elapsed time', icon: '⏱️' },
  { href: '/us/tools/apps/pomodoro-timer', title: 'Pomodoro Timer', description: 'Focus productivity', icon: '🍅' },
  { href: '/us/tools/apps/world-clock', title: 'World Clock', description: 'Global time zones', icon: '🌍' },
  { href: '/us/tools/calculators/time-calculator', title: 'Time Calculator', description: 'Add/subtract times', icon: '🧮' },
];

export default function TimerClient() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [editMode, setEditMode] = useState<'hours' | 'minutes' | 'seconds' | null>(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Firebase SEO Integration
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('timer');

  const webAppSchema = generateWebAppSchema(
    'Online Timer - Free Countdown Timer with Alarms',
    'Free online countdown timer with customizable alarms. Perfect for cooking, workouts, studying, and time management.',
    'https://economictimes.indiatimes.com/us/tools/apps/timer',
    'Utility'
  );

  const progressPercent = initialTotalSeconds > 0
    ? ((initialTotalSeconds - totalSeconds) / initialTotalSeconds) * 100
    : 0;

  const playAlarm = useCallback(() => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      const playBeep = (time: number, frequency: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        oscillator.start(time);
        oscillator.stop(time + 0.3);
      };

      for (let i = 0; i < 3; i++) {
        playBeep(audioContext.currentTime + i * 0.4, 800);
        playBeep(audioContext.currentTime + i * 0.4 + 0.15, 600);
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  const updateTimeDisplay = useCallback((total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, []);

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            setSessionsCompleted(s => s + 1);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, playAlarm]);

  useEffect(() => {
    updateTimeDisplay(totalSeconds);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const timeStr = h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;

    if (isRunning) {
      document.title = `${timeStr} - Timer | ET Tools`;
    } else if (isComplete) {
      document.title = `Timer Complete! | ET Tools`;
    } else {
      document.title = `Timer - Countdown Timer | ET Tools`;
    }
  }, [totalSeconds, isRunning, isComplete, updateTimeDisplay]);

  const startTimer = () => {
    if (totalSeconds > 0) {
      setIsRunning(true);
      setIsComplete(false);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTotalSeconds(initialTotalSeconds);
  };

  const setPreset = (mins: number) => {
    const total = mins * 60;
    setTotalSeconds(total);
    setInitialTotalSeconds(total);
    setIsRunning(false);
    setIsComplete(false);
    setEditMode(null);
  };

  const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', value: string) => {
    let num = parseInt(value) || 0;

    if (type === 'hours') {
      num = Math.min(99, Math.max(0, num));
      const newTotal = num * 3600 + minutes * 60 + seconds;
      setTotalSeconds(newTotal);
      setInitialTotalSeconds(newTotal);
    } else if (type === 'minutes') {
      num = Math.min(59, Math.max(0, num));
      const newTotal = hours * 3600 + num * 60 + seconds;
      setTotalSeconds(newTotal);
      setInitialTotalSeconds(newTotal);
    } else {
      num = Math.min(59, Math.max(0, num));
      const newTotal = hours * 3600 + minutes * 60 + num;
      setTotalSeconds(newTotal);
      setInitialTotalSeconds(newTotal);
    }
  };

  const incrementTime = (type: 'hours' | 'minutes' | 'seconds', delta: number) => {
    if (type === 'hours') {
      const newHours = Math.min(99, Math.max(0, hours + delta));
      const newTotal = newHours * 3600 + minutes * 60 + seconds;
      setTotalSeconds(newTotal);
      setInitialTotalSeconds(newTotal);
    } else if (type === 'minutes') {
      const newMinutes = Math.min(59, Math.max(0, minutes + delta));
      const newTotal = hours * 3600 + newMinutes * 60 + seconds;
      setTotalSeconds(newTotal);
      setInitialTotalSeconds(newTotal);
    } else {
      const newSeconds = Math.min(59, Math.max(0, seconds + delta));
      const newTotal = hours * 3600 + minutes * 60 + newSeconds;
      setTotalSeconds(newTotal);
      setInitialTotalSeconds(newTotal);
    }
  };

  const formatTime = (val: number) => val.toString().padStart(2, '0');
  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

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

      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">⏲️</span>
            <span className="text-white font-semibold text-sm">Countdown Timer</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {getH1('Online Timer')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Free countdown timer for cooking, workouts, studying, and more. Set custom durations or use quick presets.')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Layout: Timer + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Timer Area */}
          <div className="flex-1 min-w-0">
            {/* Timer Container */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100">
              {/* Stats Bar - Mobile/Tablet */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 lg:hidden">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">STATUS</div>
                  <div className="text-sm sm:text-base font-bold">{isRunning ? 'Running' : isComplete ? 'Done!' : 'Ready'}</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">SET FOR</div>
                  <div className="text-sm sm:text-base font-bold">{formatDuration(initialTotalSeconds)}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">COMPLETED</div>
                  <div className="text-sm sm:text-base font-bold">{sessionsCompleted}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                    isComplete ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Timer Display */}
              <div className="flex justify-center items-center gap-2 mb-6">
                {/* Hours */}
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => !isRunning && incrementTime('hours', 1)}
                      className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-30 transition-colors"
                      disabled={isRunning}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    {editMode === 'hours' && !isRunning ? (
                      <input
                        type="number"
                        value={hours}
                        onChange={(e) => handleTimeChange('hours', e.target.value)}
                        onBlur={() => setEditMode(null)}
                        className="w-16 sm:w-20 text-4xl sm:text-5xl font-mono font-bold text-center bg-blue-100 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-500"
                        min={0}
                        max={99}
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => !isRunning && setEditMode('hours')}
                        className={`text-4xl sm:text-5xl md:text-6xl font-mono font-bold cursor-pointer px-2 py-1 rounded-lg transition-all ${
                          isRunning ? 'text-gray-800' : 'text-gray-800 hover:bg-blue-100'
                        } ${isComplete ? 'text-green-600' : ''}`}
                      >
                        {formatTime(hours)}
                      </div>
                    )}
                    <button
                      onClick={() => !isRunning && incrementTime('hours', -1)}
                      className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-30 transition-colors"
                      disabled={isRunning}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Hours</span>
                </div>

                <span className={`text-4xl sm:text-5xl md:text-6xl font-bold ${isComplete ? 'text-green-600' : 'text-gray-800'}`}>:</span>

                {/* Minutes */}
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => !isRunning && incrementTime('minutes', 1)}
                      className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-30 transition-colors"
                      disabled={isRunning}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    {editMode === 'minutes' && !isRunning ? (
                      <input
                        type="number"
                        value={minutes}
                        onChange={(e) => handleTimeChange('minutes', e.target.value)}
                        onBlur={() => setEditMode(null)}
                        className="w-16 sm:w-20 text-4xl sm:text-5xl font-mono font-bold text-center bg-blue-100 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-500"
                        min={0}
                        max={59}
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => !isRunning && setEditMode('minutes')}
                        className={`text-4xl sm:text-5xl md:text-6xl font-mono font-bold cursor-pointer px-2 py-1 rounded-lg transition-all ${
                          isRunning ? 'text-gray-800' : 'text-gray-800 hover:bg-blue-100'
                        } ${isComplete ? 'text-green-600' : ''}`}
                      >
                        {formatTime(minutes)}
                      </div>
                    )}
                    <button
                      onClick={() => !isRunning && incrementTime('minutes', -1)}
                      className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-30 transition-colors"
                      disabled={isRunning}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Minutes</span>
                </div>

                <span className={`text-4xl sm:text-5xl md:text-6xl font-bold ${isComplete ? 'text-green-600' : 'text-gray-800'}`}>:</span>

                {/* Seconds */}
                <div className="text-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => !isRunning && incrementTime('seconds', 1)}
                      className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-30 transition-colors"
                      disabled={isRunning}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    {editMode === 'seconds' && !isRunning ? (
                      <input
                        type="number"
                        value={seconds}
                        onChange={(e) => handleTimeChange('seconds', e.target.value)}
                        onBlur={() => setEditMode(null)}
                        className="w-16 sm:w-20 text-4xl sm:text-5xl font-mono font-bold text-center bg-blue-100 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-500"
                        min={0}
                        max={59}
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => !isRunning && setEditMode('seconds')}
                        className={`text-4xl sm:text-5xl md:text-6xl font-mono font-bold cursor-pointer px-2 py-1 rounded-lg transition-all ${
                          isRunning ? 'text-gray-800' : 'text-gray-800 hover:bg-blue-100'
                        } ${isComplete ? 'text-green-600' : ''}`}
                      >
                        {formatTime(seconds)}
                      </div>
                    )}
                    <button
                      onClick={() => !isRunning && incrementTime('seconds', -1)}
                      className="text-gray-400 hover:text-blue-600 p-1 disabled:opacity-30 transition-colors"
                      disabled={isRunning}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Seconds</span>
                </div>
              </div>

              {/* Complete Message */}
              {isComplete && (
                <div className="text-center mb-4 animate-pulse">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-5 py-2 rounded-full text-base font-semibold border border-green-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Timer Complete!
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center gap-3 mb-4">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    disabled={totalSeconds === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Pause
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                  </svg>
                  Reset
                </button>
              </div>

              {/* Quick Presets */}
              <div className="mb-4">
                <div className="text-center text-sm text-gray-600 mb-3 font-medium">Quick Presets</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.minutes}
                      onClick={() => setPreset(preset.minutes)}
                      disabled={isRunning}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 disabled:opacity-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-blue-300"
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="flex justify-center">
                <label className="inline-flex items-center gap-2 cursor-pointer bg-white/60 px-4 py-2 rounded-lg">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-gray-700 font-medium text-sm">
                    {soundEnabled ? '🔔' : '🔕'} Sound {soundEnabled ? 'On' : 'Off'}
                  </span>
                </label>
              </div>
            </div>

            {/* How to Use - Below Timer */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> How to Use
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Set Time</div>
                    <div className="text-gray-600">Click on hours/minutes/seconds to edit, or use presets</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Start Countdown</div>
                    <div className="text-gray-600">Click Start to begin the timer</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Pause & Resume</div>
                    <div className="text-gray-600">Pause anytime and continue later</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Get Alerted</div>
                    <div className="text-gray-600">Sound plays when timer completes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Uses */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> Popular Uses
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-blue-700 mb-1">🍳 Cooking</div>
                  <div className="text-gray-600">Time eggs, pasta, baking, and recipes perfectly.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-blue-700 mb-1">💪 Workouts</div>
                  <div className="text-gray-600">HIIT intervals, rest periods, and exercises.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-blue-700 mb-1">📚 Study Sessions</div>
                  <div className="text-gray-600">Focus periods and exam practice timing.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-blue-700 mb-1">🧘 Meditation</div>
                  <div className="text-gray-600">Mindfulness sessions and breathing exercises.</div>
                </div>
              </div>
            </div>
          </div>
{/* Right Sidebar - 320px */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Stats Card - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Timer Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Status</span>
                  <span className="text-lg font-bold text-blue-600">{isRunning ? 'Running' : isComplete ? 'Done!' : 'Ready'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-purple-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Set For</span>
                  <span className="text-lg font-bold text-indigo-600">{formatDuration(initialTotalSeconds)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Progress</div>
                    <div className="text-xl font-bold text-gray-700">{Math.round(progressPercent)}%</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Completed</div>
                    <div className="text-xl font-bold text-gray-700">{sessionsCompleted}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Ad Banner */}
            {/* Ad banner replaced with MREC components */}
{/* Related Apps */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Related Time Tools</h3>
              <div className="space-y-2">
                {relatedApps.map((app) => (
                  <Link key={app.href} href={app.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">{app.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{app.title}</div>
                      <div className="text-xs text-gray-500">{app.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/us/tools/apps" className="block mt-3 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Apps →
              </Link>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Click numbers to edit directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Use arrow buttons to adjust</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Preset buttons for quick setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Toggle sound on/off below</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        

        {/* Mobile MREC2 - Before FAQs */}


        

        <GameAppMobileMrec2 />



        

        {/* FAQs Section */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="timer" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
