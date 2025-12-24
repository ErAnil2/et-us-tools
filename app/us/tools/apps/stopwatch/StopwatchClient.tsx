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

interface LapTime {
  lapNumber: number;
  lapTime: number;
  totalTime: number;
  delta?: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How accurate is this online stopwatch?",
    answer: "Our stopwatch updates every 10 milliseconds and is accurate to 1/100th of a second (centiseconds). This level of precision is suitable for most timing needs including sports, cooking, and general timekeeping.",
    order: 1
  },
  {
    id: '2',
    question: "What is the difference between Lap and Split time?",
    answer: "Lap time shows the duration of the current segment (from the last lap to now), while Split time (Total) shows the cumulative time from the start. For example, if you run three laps of 30 seconds each, each lap time is 30 seconds, but the splits would be 30s, 1:00, and 1:30.",
    order: 2
  },
  {
    id: '3',
    question: "Can I use this stopwatch for sports timing?",
    answer: "Yes! This stopwatch is perfect for timing races, workouts, swim laps, running intervals, and other sports activities. The lap function lets you track individual segments while maintaining the overall time.",
    order: 3
  },
  {
    id: '4',
    question: "Will the stopwatch continue if I close the browser?",
    answer: "No, if you close the browser tab, the stopwatch will stop. For important timing, keep the tab open. You can switch to other tabs and the stopwatch will continue running in the background.",
    order: 4
  },
  {
    id: '5',
    question: "What is the maximum time the stopwatch can measure?",
    answer: "The stopwatch can measure time up to 99 hours, 59 minutes, 59 seconds, and 99 centiseconds. This is more than enough for virtually any timing need.",
    order: 5
  },
  {
    id: '6',
    question: "How do I record lap times?",
    answer: "While the stopwatch is running, click the 'Lap' button to record a lap time. Each lap will be saved in the table below, showing the lap number, lap duration, and total elapsed time at that point.",
    order: 6
  }
];

const relatedApps = [
  { href: '/us/tools/apps/timer', title: 'Timer', description: 'Countdown timer', icon: '⏲️' },
  { href: '/us/tools/apps/pomodoro-timer', title: 'Pomodoro Timer', description: 'Focus productivity', icon: '🍅' },
  { href: '/us/tools/apps/world-clock', title: 'World Clock', description: 'Global time zones', icon: '🌍' },
  { href: '/us/tools/calculators/time-calculator', title: 'Time Calculator', description: 'Add/subtract times', icon: '🧮' },
];

export default function StopwatchClient() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Firebase SEO Integration
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('stopwatch');

  const webAppSchema = generateWebAppSchema(
    'Online Stopwatch - Free Precision Timer with Lap Times',
    'Free online stopwatch with millisecond precision and lap time tracking. Perfect for sports timing, workouts, and any activity requiring accurate time measurement.',
    'https://economictimes.indiatimes.com/us/tools/apps/stopwatch',
    'Utility'
  );

  const formatTime = useCallback((ms: number) => {
    const centiseconds = Math.floor((ms % 1000) / 10);
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  const formatLapTime = useCallback((ms: number) => {
    const centiseconds = Math.floor((ms % 1000) / 10);
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(time)} - Stopwatch | ET Tools`;
    } else if (time > 0) {
      document.title = `${formatTime(time)} (Paused) - Stopwatch | ET Tools`;
    } else {
      document.title = `Stopwatch - Online Precision Timer | ET Tools`;
    }
  }, [time, isRunning, formatTime]);

  const start = () => {
    pausedTimeRef.current = time;
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
    pausedTimeRef.current = time;
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setLastLapTime(0);
    pausedTimeRef.current = 0;
  };

  const recordLap = () => {
    if (!isRunning) return;

    const currentLapTime = time - lastLapTime;
    const newLap: LapTime = {
      lapNumber: laps.length + 1,
      lapTime: currentLapTime,
      totalTime: time };

    if (laps.length > 0) {
      newLap.delta = currentLapTime - laps[laps.length - 1].lapTime;
    }

    setLaps([...laps, newLap]);
    setLastLapTime(time);
  };

  const getBestLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((best, lap) => lap.lapTime < best.lapTime ? lap : best);
  };

  const getWorstLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((worst, lap) => lap.lapTime > worst.lapTime ? lap : worst);
  };

  const getAverageLap = () => {
    if (laps.length === 0) return 0;
    const total = laps.reduce((sum, lap) => sum + lap.lapTime, 0);
    return total / laps.length;
  };

  const bestLap = getBestLap();
  const worstLap = getWorstLap();
  const avgLap = getAverageLap();

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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">⏱️</span>
            <span className="text-white font-semibold text-sm">Precision Stopwatch</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {getH1('Online Stopwatch')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Free precision stopwatch with lap times and split tracking. Perfect for sports, workouts, and timing any activity.')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Layout: Stopwatch + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Stopwatch Area */}
          <div className="flex-1 min-w-0">
            {/* Stopwatch Container */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-cyan-100">
              {/* Stats Bar - Mobile/Tablet */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 lg:hidden">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">STATUS</div>
                  <div className="text-sm sm:text-base font-bold">{isRunning ? 'Running' : time > 0 ? 'Paused' : 'Ready'}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">LAPS</div>
                  <div className="text-sm sm:text-base font-bold">{laps.length}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">BEST LAP</div>
                  <div className="text-sm sm:text-base font-bold">{bestLap ? formatLapTime(bestLap.lapTime) : '--'}</div>
                </div>
              </div>

              {/* Time Display */}
              <div className="text-center mb-6">
                <div className={`text-5xl sm:text-6xl md:text-7xl font-mono font-bold tracking-wider transition-colors ${
                  isRunning ? 'text-cyan-600' : time > 0 ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {formatTime(time)}
                </div>
                {time > 0 && !isRunning && (
                  <div className="text-sm text-gray-500 mt-2 font-medium">Paused</div>
                )}
              </div>

              {/* Current Lap Indicator */}
              {isRunning && laps.length > 0 && (
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-xl border border-cyan-200 shadow-sm">
                    <span className="text-sm text-cyan-600 font-semibold">Lap {laps.length + 1}:</span>
                    <span className="text-lg font-mono font-bold text-cyan-700">
                      {formatLapTime(time - lastLapTime)}
                    </span>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center gap-3 mb-4">
                {!isRunning ? (
                  <>
                    <button
                      onClick={start}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                      {time > 0 ? 'Resume' : 'Start'}
                    </button>
                    {time > 0 && (
                      <button
                        onClick={reset}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                        </svg>
                        Reset
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={pause}
                      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Pause
                    </button>
                    <button
                      onClick={recordLap}
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      Lap
                    </button>
                  </>
                )}
              </div>

              {/* Lap Statistics */}
              {laps.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                  <div className="bg-white rounded-xl p-3 text-center border border-green-200 shadow-sm">
                    <div className="text-[10px] sm:text-xs text-green-600 font-bold uppercase">Best</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-green-700">
                      {bestLap ? formatLapTime(bestLap.lapTime) : '-'}
                    </div>
                    {bestLap && <div className="text-[10px] text-green-600">Lap {bestLap.lapNumber}</div>}
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-blue-200 shadow-sm">
                    <div className="text-[10px] sm:text-xs text-blue-600 font-bold uppercase">Average</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-blue-700">
                      {formatLapTime(avgLap)}
                    </div>
                    <div className="text-[10px] text-blue-600">{laps.length} laps</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-red-200 shadow-sm">
                    <div className="text-[10px] sm:text-xs text-red-600 font-bold uppercase">Worst</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-red-700">
                      {worstLap ? formatLapTime(worstLap.lapTime) : '-'}
                    </div>
                    {worstLap && <div className="text-[10px] text-red-600">Lap {worstLap.lapNumber}</div>}
                  </div>
                </div>
              )}

              {/* Lap Times Table */}
              {laps.length > 0 && (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      <span>📊</span> Lap Times
                    </h3>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-600 font-semibold text-xs">Lap</th>
                          <th className="px-3 py-2 text-right text-gray-600 font-semibold text-xs">Time</th>
                          <th className="px-3 py-2 text-right text-gray-600 font-semibold text-xs">Delta</th>
                          <th className="px-3 py-2 text-right text-gray-600 font-semibold text-xs">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[...laps].reverse().map((lap) => (
                          <tr
                            key={lap.lapNumber}
                            className={`${
                              bestLap?.lapNumber === lap.lapNumber ? 'bg-green-50' :
                              worstLap?.lapNumber === lap.lapNumber && laps.length > 1 ? 'bg-red-50' : ''
                            }`}
                          >
                            <td className="px-3 py-2 font-semibold text-gray-800 text-xs">
                              {lap.lapNumber}
                              {bestLap?.lapNumber === lap.lapNumber && (
                                <span className="ml-1 text-green-600 text-[10px]">Best</span>
                              )}
                              {worstLap?.lapNumber === lap.lapNumber && laps.length > 1 && (
                                <span className="ml-1 text-red-600 text-[10px]">Worst</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right font-mono font-medium text-gray-700 text-xs">
                              {formatLapTime(lap.lapTime)}
                            </td>
                            <td className={`px-3 py-2 text-right font-mono font-medium text-xs ${
                              lap.delta === undefined ? 'text-gray-400' :
                              lap.delta < 0 ? 'text-green-600' : lap.delta > 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {lap.delta === undefined ? '-' :
                               lap.delta < 0 ? `-${formatLapTime(Math.abs(lap.delta))}` :
                               lap.delta > 0 ? `+${formatLapTime(lap.delta)}` : '0.00'}
                            </td>
                            <td className="px-3 py-2 text-right font-mono text-gray-500 text-xs">
                              {formatLapTime(lap.totalTime)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* How to Use - Below Stopwatch */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> How to Use
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-600 font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Start</div>
                    <div className="text-gray-600">Click Start to begin timing</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-600 font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Record Laps</div>
                    <div className="text-gray-600">Click Lap to record split times</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-600 font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Pause & Resume</div>
                    <div className="text-gray-600">Pause anytime without losing data</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-600 font-bold">4</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Track Performance</div>
                    <div className="text-gray-600">View best, average, and worst laps</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Uses */}
            <div className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 border border-cyan-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> Popular Uses
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-cyan-700 mb-1">🏃 Running & Racing</div>
                  <div className="text-gray-600">Track lap times and personal records.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-cyan-700 mb-1">🏊 Swimming</div>
                  <div className="text-gray-600">Time swimming laps and intervals.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-cyan-700 mb-1">💪 HIIT Workouts</div>
                  <div className="text-gray-600">Track high-intensity interval training.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-cyan-700 mb-1">🎮 Speedrunning</div>
                  <div className="text-gray-600">Game timing and competition tracking.</div>
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
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Stopwatch Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-blue-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Status</span>
                  <span className="text-lg font-bold text-cyan-600">{isRunning ? 'Running' : time > 0 ? 'Paused' : 'Ready'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Total Laps</span>
                  <span className="text-lg font-bold text-green-600">{laps.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Best Lap</div>
                    <div className="text-sm font-bold text-gray-700 font-mono">{bestLap ? formatLapTime(bestLap.lapTime) : '--'}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Avg Lap</div>
                    <div className="text-sm font-bold text-gray-700 font-mono">{laps.length > 0 ? formatLapTime(avgLap) : '--'}</div>
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
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">{app.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{app.title}</div>
                      <div className="text-xs text-gray-500">{app.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/us/tools/apps" className="block mt-3 text-center text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                View All Apps →
              </Link>
            </div>

            {/* Understanding Laps */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Lap Time Guide</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800 text-xs">Lap Time</div>
                  <div className="text-gray-600 text-xs">Duration since last lap</div>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800 text-xs">Delta (+/-)</div>
                  <div className="text-gray-600 text-xs">Difference from previous lap</div>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800 text-xs">Total Time</div>
                  <div className="text-gray-600 text-xs">Cumulative time from start</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Mobile MREC2 - Before FAQs */}


        

        <GameAppMobileMrec2 />



        

        {/* FAQs Section */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="stopwatch" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
