'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type CalcMode = 'bedtime' | 'waketime';

interface SleepTime {
  time: string;
  cycles: number;
  hours: string;
  quality: string;
  color: string;
}

export default function SleepCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('sleep-calculator');

  const [mode, setMode] = useState<CalcMode>('bedtime');
  const [wakeHour, setWakeHour] = useState(7);
  const [wakeMinute, setWakeMinute] = useState(0);
  const [wakePeriod, setWakePeriod] = useState<'AM' | 'PM'>('AM');
  const [bedHour, setBedHour] = useState(10);
  const [bedMinute, setBedMinute] = useState(0);
  const [bedPeriod, setBedPeriod] = useState<'AM' | 'PM'>('PM');
  const [fallAsleepTime, setFallAsleepTime] = useState(15);

  const [sleepTimes, setSleepTimes] = useState<SleepTime[]>([]);

  const CYCLE_DURATION = 90; // 90 minutes per sleep cycle

  useEffect(() => {
    calculateSleepTimes();
  }, [mode, wakeHour, wakeMinute, wakePeriod, bedHour, bedMinute, bedPeriod, fallAsleepTime]);

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const calculateSleepTimes = () => {
    const times: SleepTime[] = [];

    if (mode === 'bedtime') {
      // Calculate bedtimes based on wake time
      let wake24Hour = wakeHour;
      if (wakePeriod === 'PM' && wakeHour !== 12) wake24Hour += 12;
      if (wakePeriod === 'AM' && wakeHour === 12) wake24Hour = 0;

      const wakeDate = new Date();
      wakeDate.setHours(wake24Hour, wakeMinute, 0, 0);

      for (let cycles = 6; cycles >= 4; cycles--) {
        const sleepMinutes = cycles * CYCLE_DURATION;
        const bedDate = new Date(wakeDate.getTime() - (sleepMinutes + fallAsleepTime) * 60000);

        const hours = sleepMinutes / 60;
        let quality = 'Good';
        let color = 'from-green-500 to-emerald-600';

        if (cycles === 6) {
          quality = 'Excellent';
          color = 'from-green-500 to-emerald-600';
        } else if (cycles === 5) {
          quality = 'Good';
          color = 'from-blue-500 to-indigo-600';
        } else {
          quality = 'Fair';
          color = 'from-amber-500 to-orange-600';
        }

        times.push({
          time: formatTime(bedDate),
          cycles,
          hours: `${hours}h`,
          quality,
          color
        });
      }
    } else {
      // Calculate wake times based on bedtime
      let bed24Hour = bedHour;
      if (bedPeriod === 'PM' && bedHour !== 12) bed24Hour += 12;
      if (bedPeriod === 'AM' && bedHour === 12) bed24Hour = 0;

      const bedDate = new Date();
      bedDate.setHours(bed24Hour, bedMinute, 0, 0);

      for (let cycles = 4; cycles <= 6; cycles++) {
        const sleepMinutes = cycles * CYCLE_DURATION;
        const wakeDate = new Date(bedDate.getTime() + (sleepMinutes + fallAsleepTime) * 60000);

        const hours = sleepMinutes / 60;
        let quality = 'Good';
        let color = 'from-green-500 to-emerald-600';

        if (cycles === 6) {
          quality = 'Excellent';
          color = 'from-green-500 to-emerald-600';
        } else if (cycles === 5) {
          quality = 'Good';
          color = 'from-blue-500 to-indigo-600';
        } else {
          quality = 'Fair';
          color = 'from-amber-500 to-orange-600';
        }

        times.push({
          time: formatTime(wakeDate),
          cycles,
          hours: `${hours}h`,
          quality,
          color
        });
      }
    }

    setSleepTimes(times);
  };

  const sleepStages = [
    { name: 'Stage 1 (N1)', duration: '5%', description: 'Light sleep, easy to wake', color: 'bg-blue-200' },
    { name: 'Stage 2 (N2)', duration: '45%', description: 'Body temperature drops, heart rate slows', color: 'bg-blue-400' },
    { name: 'Stage 3 (N3)', duration: '25%', description: 'Deep sleep, body repairs and grows', color: 'bg-indigo-500' },
    { name: 'REM Sleep', duration: '25%', description: 'Dreams occur, memory consolidation', color: 'bg-purple-500' }
  ];

  const sleepTips = [
    { emoji: '📱', title: 'Avoid Screens', desc: 'No blue light 1 hour before bed' },
    { emoji: '🌡️', title: 'Cool Room', desc: 'Keep bedroom at 65-68°F (18-20°C)' },
    { emoji: '🕐', title: 'Consistent Schedule', desc: 'Same bed/wake time daily' },
    { emoji: '☕', title: 'Limit Caffeine', desc: 'No caffeine 6 hours before bed' },
    { emoji: '🏃', title: 'Exercise Early', desc: 'Finish workouts 3+ hours before bed' },
    { emoji: '🌙', title: 'Dark Environment', desc: 'Use blackout curtains or eye mask' }
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: "How long is a sleep cycle?",
      answer: "A complete sleep cycle lasts approximately 90 minutes. During this time, you progress through all sleep stages: light sleep (N1, N2), deep sleep (N3), and REM sleep. Most adults need 5-6 cycles (7.5-9 hours) per night.",
    order: 1
  },
    {
    id: '2',
    question: "Why should I wake up between sleep cycles?",
      answer: "Waking during deep sleep or REM causes 'sleep inertia' - that groggy, disoriented feeling. By timing your alarm to complete full cycles, you wake during lighter sleep stages and feel more refreshed and alert.",
    order: 2
  },
    {
    id: '3',
    question: "How long does it take to fall asleep?",
      answer: "Most healthy adults take 10-20 minutes to fall asleep. If you fall asleep immediately, you may be sleep deprived. If it takes longer than 30 minutes regularly, consider sleep hygiene improvements or consult a doctor.",
    order: 3
  },
    {
    id: '4',
    question: "Is 6 hours of sleep enough?",
      answer: "For most adults, 6 hours (4 cycles) is the minimum for basic function, but it's not optimal. Research shows 7-9 hours is ideal for cognitive function, immune health, and longevity. Chronic short sleep increases disease risk.",
    order: 4
  },
    {
    id: '5',
    question: "What is the best bedtime?",
      answer: "The ideal bedtime varies by person based on wake time and sleep need. Generally, going to bed between 9 PM and midnight allows alignment with natural circadian rhythms. Consistency matters more than the specific time.",
    order: 5
  },
    {
    id: '6',
    question: "What are the different stages of sleep and why do they matter?",
      answer: "Sleep consists of 4 stages that cycle every 90 minutes: N1 (light transition, 5-10 min), N2 (light sleep with memory consolidation, 20 min), N3 (deep/slow-wave sleep for physical recovery and immune function, 20-40 min), and REM (rapid eye movement for emotional processing and learning, 10-20 min initially, increasing to 60+ min in later cycles). Each stage is crucial: deep sleep restores the body and consolidates declarative memory, while REM processes emotions and procedural memory. Missing either (from fragmented or insufficient sleep) impairs recovery, learning, and health.",
    order: 6
  }
  ];

  const ageRecommendations = [
    { age: 'Newborns (0-3 mo)', hours: '14-17', emoji: '👶' },
    { age: 'Infants (4-11 mo)', hours: '12-15', emoji: '🍼' },
    { age: 'Toddlers (1-2 yr)', hours: '11-14', emoji: '👧' },
    { age: 'Preschool (3-5 yr)', hours: '10-13', emoji: '🧒' },
    { age: 'School Age (6-13 yr)', hours: '9-11', emoji: '📚' },
    { age: 'Teenagers (14-17 yr)', hours: '8-10', emoji: '🎮' },
    { age: 'Adults (18-64 yr)', hours: '7-9', emoji: '👨' },
    { age: 'Seniors (65+ yr)', hours: '7-8', emoji: '👴' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Sleep Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate optimal bedtimes and wake times based on sleep cycles.
            Wake up refreshed by completing full 90-minute sleep cycles.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Mode Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">I want to calculate</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('bedtime')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      mode === 'bedtime'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">🛏️</span>
                    <span className="font-medium">Bedtime</span>
                  </button>
                  <button
                    onClick={() => setMode('waketime')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      mode === 'waketime'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">⏰</span>
                    <span className="font-medium">Wake Time</span>
                  </button>
                </div>
              </div>

              {/* Time Input */}
              {mode === 'bedtime' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">I need to wake up at</label>
                  <div className="flex gap-2">
                    <select
                      value={wakeHour}
                      onChange={(e) => setWakeHour(parseInt(e.target.value))}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <span className="flex items-center text-2xl text-gray-400">:</span>
                    <select
                      value={wakeMinute}
                      onChange={(e) => setWakeMinute(parseInt(e.target.value))}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
                    >
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                        <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                    <select
                      value={wakePeriod}
                      onChange={(e) => setWakePeriod(e.target.value as 'AM' | 'PM')}
                      className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">I plan to go to bed at</label>
                  <div className="flex gap-2">
                    <select
                      value={bedHour}
                      onChange={(e) => setBedHour(parseInt(e.target.value))}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-lg"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <span className="flex items-center text-2xl text-gray-400">:</span>
                    <select
                      value={bedMinute}
                      onChange={(e) => setBedMinute(parseInt(e.target.value))}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-lg"
                    >
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                        <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                    <select
                      value={bedPeriod}
                      onChange={(e) => setBedPeriod(e.target.value as 'AM' | 'PM')}
                      className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-lg"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Fall Asleep Time */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Time to fall asleep</label>
                  <span className="text-lg font-bold text-indigo-600">{fallAsleepTime} min</span>
                </div>
                <input
                  type="range"
                  value={fallAsleepTime}
                  onChange={(e) => setFallAsleepTime(parseInt(e.target.value))}
                  min="5"
                  max="30"
                  step="5"
                  className="w-full h-2 bg-gradient-to-r from-indigo-200 to-indigo-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 min</span>
                  <span>30 min</span>
                </div>
              </div>

              {/* Sleep Cycle Info */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-sm text-indigo-800 font-medium">Sleep Cycle Science</p>
                    <p className="text-xs text-indigo-700 mt-1">
                      Each sleep cycle is ~90 minutes. Waking between cycles helps you feel refreshed.
                      Adults need 5-6 cycles (7.5-9 hours) for optimal rest.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {mode === 'bedtime' ? 'Recommended Bedtimes' : 'Recommended Wake Times'}
              </h3>

              {sleepTimes.map((time, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${time.color} rounded-xl p-5 text-white`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white/80 text-xs font-medium mb-1">{time.cycles} sleep cycles • {time.hours}</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold">{time.time}</p>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                        {time.quality}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">90</div>
                  <div className="text-xs text-gray-500">minutes/cycle</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">5-6</div>
                  <div className="text-xs text-gray-500">cycles recommended</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

{/* Related Calculators */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all h-full">
                  <div className={`w-10 h-10 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-3`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-indigo-600 transition-colors mb-1">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-gray-500">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Sleep Cycles: Science of Optimal Sleep Timing</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Sleep is not a uniform state of unconsciousness but a dynamic, cyclical process where your brain and body alternate between distinct stages, each serving critical functions for physical restoration, mental processing, and overall health. A complete sleep cycle lasts approximately 90 minutes and consists of four stages: N1 (light transition), N2 (light sleep with sleep spindles), N3 (deep/slow-wave sleep), and REM (rapid eye movement sleep). Throughout the night, you cycle through these stages 4-6 times, with early cycles containing more deep sleep for physical recovery and later cycles featuring extended REM periods for memory consolidation and emotional regulation. Waking between cycles during light sleep leaves you feeling refreshed, while interrupting deep sleep or REM causes grogginess and cognitive impairment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2 text-sm">90-Minute Cycles</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Complete cycle = ~90 minutes</li>
              <li>• 4-6 cycles per night (6-9 hours)</li>
              <li>• Wake between cycles feels best</li>
              <li>• Early cycles: more deep sleep</li>
              <li>• Late cycles: more REM sleep</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Sleep Stages</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• N1: Light transition (5-10 min)</li>
              <li>• N2: Sleep spindles (20 min)</li>
              <li>• N3: Deep sleep (20-40 min)</li>
              <li>• REM: Dreams & memory (10-60 min)</li>
              <li>• All stages are essential</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Optimal Sleep Duration</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Adults: 7-9 hours (5-6 cycles)</li>
              <li>• Teenagers: 8-10 hours</li>
              <li>• Quality matters as much as quantity</li>
              <li>• Consistency is crucial</li>
              <li>• Individual needs vary slightly</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">The Four Stages of Sleep Explained</h3>
        <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
            <h4 className="font-semibold text-indigo-800 mb-2">Stage N1: Light Sleep Transition (5-10 minutes)</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Transition from wakefulness to sleep, easily awakened, muscle twitches (hypnic jerks), theta brain waves
            </p>
            <p className="text-xs text-gray-600">
              This brief stage marks the transition between wake and sleep. Brain activity slows from alert beta waves to relaxed theta waves. Heart rate and breathing begin to slow, muscles relax with occasional twitches (hypnic jerks - the sensation of falling). You're easily awakened and may not even realize you were asleep. Represents about 5% of total sleep time in healthy adults.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Stage N2: Light Sleep with Sleep Spindles (20 minutes per cycle)</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Sleep spindles and K-complexes, body temperature drops, eye movement stops, represents 50% of total sleep
            </p>
            <p className="text-xs text-gray-600">
              Your largest sleep stage by duration. Brain produces sleep spindles (rapid bursts of brain activity) and K-complexes (large waves) that protect sleep from external disturbances and consolidate memory. Body temperature decreases, heart rate slows further, and eye movements stop. Consciousness fades but you can still be awakened relatively easily. Critical for motor learning and declarative memory consolidation.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Stage N3: Deep Sleep / Slow-Wave Sleep (20-40 minutes per cycle)</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Delta waves, deepest sleep, difficult to wake, physical restoration, immune function, growth hormone release
            </p>
            <p className="text-xs text-gray-600">
              The most restorative sleep stage for physical recovery. Brain produces high-amplitude delta waves. Blood pressure drops, breathing slows and becomes rhythmic, muscle activity is minimal. This is when growth hormone is released, tissue repairs, immune system strengthens, and bone/muscle builds. Most deep sleep occurs in the first half of the night. Waking during this stage causes severe grogginess (sleep inertia) lasting 30+ minutes. Essential for feeling refreshed.
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border border-pink-100">
            <h4 className="font-semibold text-pink-800 mb-2">REM: Rapid Eye Movement Sleep (10-60 minutes per cycle)</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Characteristics:</strong> Rapid eye movements, vivid dreams, brain activity similar to waking, temporary muscle paralysis (atonia), memory consolidation
            </p>
            <p className="text-xs text-gray-600">
              Brain becomes highly active - nearly as active as when awake. Eyes move rapidly behind closed lids, vivid dreams occur, but body experiences temporary paralysis (atonia) preventing dream enactment. Heart rate and breathing become irregular. REM processes emotions, consolidates procedural memory and learning, and strengthens neural connections. First REM period lasts ~10 minutes, increasing to 60+ minutes in final cycle. Represents 20-25% of total sleep and is crucial for mental health and creativity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Sleep Cycles Matter</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span><strong>Avoid Sleep Inertia:</strong> Waking mid-cycle (especially during deep sleep) causes grogginess lasting 30-60 minutes. Wake between cycles for alertness.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span><strong>Optimize Recovery:</strong> Early cycles prioritize deep sleep for physical restoration. Later cycles emphasize REM for mental processing. Full night needed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span><strong>Memory Consolidation:</strong> Sleep spindles in N2 and REM processing are essential for converting short-term to long-term memory. Quality sleep = better learning.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span><strong>Hormonal Regulation:</strong> Growth hormone peaks during deep sleep. Cortisol, testosterone, and other hormones follow circadian cycles tied to sleep stages.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span><strong>Immune Function:</strong> Deep sleep strengthens immune response. Cytokines and antibodies are produced primarily during N3 sleep.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sleep Needs by Age</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Newborns (0-3 months):</strong> 14-17 hours - mostly REM, irregular cycles, polyphasic sleep pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Infants (4-11 months):</strong> 12-15 hours - consolidating nighttime sleep, developing circadian rhythm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Toddlers (1-2 years):</strong> 11-14 hours - includes naps, active growth and development phase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Preschool (3-5 years):</strong> 10-13 hours - transitioning away from naps, establishing routines</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>School Age (6-13 years):</strong> 9-11 hours - consistent schedule crucial for learning and behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Teenagers (14-17 years):</strong> 8-10 hours - circadian shift delays natural bedtime, early school start conflicts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Adults (18-64 years):</strong> 7-9 hours - optimal for health, performance, longevity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span><strong>Seniors (65+ years):</strong> 7-8 hours - sleep becomes lighter, more fragmented, earlier wake times</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sleep Hygiene: Optimizing Sleep Quality</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Consistent Schedule</h4>
            <p className="text-xs text-gray-600">Go to bed and wake at the same time daily, even weekends. This entrains your circadian rhythm. Irregular sleep schedules reduce sleep quality by 20-30% and increase health risks. Your body thrives on predictability.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Light Exposure</h4>
            <p className="text-xs text-gray-600">Get bright light (ideally sunlight) in the morning to set circadian clock. Avoid blue light 2-3 hours before bed - it suppresses melatonin by 50%. Use dim, warm lighting in evenings. Night mode on devices helps but isn't sufficient.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Temperature Control</h4>
            <p className="text-xs text-gray-600">Keep bedroom 60-67°F (15-19°C). Core body temperature must drop 2-3°F to initiate sleep. Hot rooms fragment sleep and reduce deep sleep stages. Cool environment promotes better sleep architecture throughout the night.</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-pink-800 mb-2 text-sm">Caffeine Timing</h4>
            <p className="text-xs text-gray-600">Avoid caffeine 6-8 hours before bed. Caffeine blocks adenosine (sleep pressure molecule) and has a half-life of 5-6 hours. Even if you can "sleep on caffeine," it reduces deep sleep by 15-20% and fragments sleep cycles.</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Alcohol Effects</h4>
            <p className="text-xs text-gray-600">Alcohol is a sedative, not a sleep aid. It fragments sleep, blocks REM (causing REM rebound insomnia), and increases sleep apnea risk. While it may help you fall asleep faster, overall sleep quality decreases significantly.</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Exercise Timing</h4>
            <p className="text-xs text-gray-600">Regular exercise improves deep sleep by 15-20%. However, finish intense workouts 3-4 hours before bed - exercise raises core temperature and adrenaline. Morning/afternoon exercise optimizes sleep. Light stretching or yoga before bed is beneficial.</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Consequences of Poor Sleep</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Short-Term Effects (Days to Weeks)</h4>
            <p className="text-xs text-gray-600">Cognitive impairment equivalent to 0.05-0.1% blood alcohol after one night of poor sleep. Reduced reaction time, impaired decision-making, decreased focus and memory consolidation. Mood disruption - increased irritability, anxiety, and negative emotions. Weakened immune response - 3x more likely to catch a cold. Increased appetite and junk food cravings due to hormonal changes (increased ghrelin, decreased leptin).</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Long-Term Effects (Months to Years)</h4>
            <p className="text-xs text-gray-600">Chronic sleep deprivation ({'<'}7 hours regularly) increases risk: cardiovascular disease by 48%, obesity by 55%, type 2 diabetes by 28%, depression and anxiety disorders significantly. Accelerated cognitive decline and increased dementia risk. Reduced lifespan - studies show sleeping {'<'}6 hours increases mortality risk by 12%. Hormonal dysregulation affecting growth, stress response, and reproductive health.</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Performance Impact</h4>
            <p className="text-xs text-gray-600">Athletic performance decreases: 10-30% reduction in sprint times, decreased accuracy and motor skills, 30-40% slower reaction times, reduced muscle recovery. Cognitive performance: 20-30% decline in productivity, increased errors and accidents (drowsy driving causes 1.2M crashes annually), impaired creativity and problem-solving, reduced emotional regulation affecting relationships and work interactions.</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Sleep Debt & Recovery</h4>
            <p className="text-xs text-gray-600">Sleep debt accumulates - losing 1 hour nightly for a week requires 10+ hours of extra sleep to fully recover. You cannot "catch up" on weekends - irregular sleep schedules worsen circadian misalignment. However, prioritizing sleep moving forward always helps. Even small improvements (30-60 min extra) show benefits within days. Consistency is key to resetting sleep patterns and recovering from chronic deprivation.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="sleep-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides general sleep timing recommendations based on 90-minute sleep cycles.
            Individual sleep needs vary. If you experience persistent sleep problems, consult a healthcare provider or sleep specialist.
          </p>
        </div>
      </div>
    </div>
  );
}
