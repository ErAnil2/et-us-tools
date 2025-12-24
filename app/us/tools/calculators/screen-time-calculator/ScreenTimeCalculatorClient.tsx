'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface Preset {
  phone: number;
  computer: number;
  tv: number;
  tablet: number;
}

const presets: Record<string, Preset> = {
  light: { phone: 2, computer: 3, tv: 1, tablet: 0 },
  moderate: { phone: 3, computer: 4, tv: 2, tablet: 0.5 },
  heavy: { phone: 4, computer: 6, tv: 2.5, tablet: 1 }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Screen Time Calculator?",
    answer: "A Screen Time Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is the date calculation?",
    answer: "Our calculator accounts for leap years, varying month lengths, and other calendar complexities to provide accurate results. It uses the Gregorian calendar system.",
    order: 2
  },
  {
    id: '3',
    question: "What date formats are supported?",
    answer: "The calculator accepts common date formats and displays results in an easy-to-understand format. Simply enter dates in the format shown in the input fields.",
    order: 3
  },
  {
    id: '4',
    question: "Can I calculate dates far in the future or past?",
    answer: "Yes, the calculator can handle dates spanning many years. It's useful for planning, historical research, or any date-related calculations you need.",
    order: 4
  },
  {
    id: '5',
    question: "Is timezone considered in calculations?",
    answer: "Date calculations are based on calendar dates. For time-specific calculations, ensure you're considering your local timezone for the most accurate results.",
    order: 5
  }
];

export default function ScreenTimeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('screen-time-calculator');

  const [phoneHours, setPhoneHours] = useState(3);
  const [computerHours, setComputerHours] = useState(6);
  const [tvHours, setTvHours] = useState(2);
  const [tabletHours, setTabletHours] = useState(1);

  const [totalHours, setTotalHours] = useState(0);
  const [percentWaking, setPercentWaking] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [yearlyDays, setYearlyDays] = useState(0);
  const [assessmentClass, setAssessmentClass] = useState('');
  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [assessmentText, setAssessmentText] = useState('');
  const [longestDevice, setLongestDevice] = useState('');

  useEffect(() => {
    calculateScreenTime();
  }, [phoneHours, computerHours, tvHours, tabletHours]);

  const calculateScreenTime = () => {
    const total = phoneHours + computerHours + tvHours + tabletHours;
    const wakingHours = 16;
    const percent = Math.round((total / wakingHours) * 100);

    setTotalHours(total);
    setPercentWaking(percent);
    setWeeklyHours(Math.round(total * 7));
    setMonthlyHours(Math.round(total * 30));
    setYearlyDays(Math.round((total * 365) / 24));

    const devices = [
      { name: '📱 Smartphone', hours: phoneHours },
      { name: '💻 Computer', hours: computerHours },
      { name: '📺 Television', hours: tvHours },
      { name: '📟 Tablet', hours: tabletHours }
    ];

    const longest = devices.reduce((max, device) =>
      device.hours > max.hours ? device : max
    );
    setLongestDevice(longest.hours > 0 ? `${longest.name}: ${longest.hours}h` : 'No usage');

    let className, title, text;
    if (total < 4) {
      className = 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300';
      title = '✓ Excellent Balance';
      text = 'Your screen time is well within healthy limits!';
    } else if (total < 7) {
      className = 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300';
      title = '👍 Good Habits';
      text = 'Your screen time is reasonable for most adults.';
    } else if (total < 9) {
      className = 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300';
      title = '⚠️ Moderate Usage';
      text = 'Consider implementing digital wellness strategies.';
    } else if (total < 12) {
      className = 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300';
      title = '🔴 High Screen Time';
      text = 'Your screen time is quite high and may impact health.';
    } else {
      className = 'bg-gradient-to-br from-red-50 to-pink-50 border-red-400';
      title = '⛔ Excessive Usage';
      text = 'Immediate action recommended to reduce screen time.';
    }

    setAssessmentClass(className);
    setAssessmentTitle(title);
    setAssessmentText(text);
  };

  const applyPreset = (preset: string) => {
    const p = presets[preset];
    setPhoneHours(p.phone);
    setComputerHours(p.computer);
    setTvHours(p.tv);
    setTabletHours(p.tablet);
  };

  const devices = [
    { name: '📱 Smartphone', hours: phoneHours, color: 'bg-blue-500' },
    { name: '💻 Computer', hours: computerHours, color: 'bg-green-500' },
    { name: '📺 Television', hours: tvHours, color: 'bg-purple-500' },
    { name: '📟 Tablet', hours: tabletHours, color: 'bg-orange-500' }
  ];

  const ResultsPanel = () => (
    <>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Screen Time Analysis</h2>

      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
        <div className="text-sm font-medium text-purple-700 mb-1">Total Daily Screen Time</div>
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900">{Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m</div>
        <div className="text-xs text-purple-600 mt-1">{percentWaking}% of waking hours</div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="text-sm font-medium text-blue-700 mb-3">Time Projections</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm p-2 bg-white/60 rounded-lg">
            <span className="text-blue-700">Weekly:</span>
            <span className="font-bold text-blue-900">{weeklyHours}h</span>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          <div className="flex justify-between text-sm p-2 bg-white/60 rounded-lg">
            <span className="text-blue-700">Monthly:</span>
            <span className="font-bold text-blue-900">{monthlyHours}h</span>
          </div>
          <div className="flex justify-between text-sm p-2 bg-white/60 rounded-lg">
            <span className="text-blue-700">Yearly:</span>
            <span className="font-bold text-blue-900">{yearlyDays} days</span>
          </div>
</div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="text-sm font-medium text-green-700 mb-3">Device Breakdown</div>
        <div className="space-y-2">
          {devices.filter(d => d.hours > 0).map((device, idx) => {
            const percentage = totalHours > 0 ? Math.round((device.hours / totalHours) * 100) : 0;
            return (
              <div key={idx} className="p-2 bg-white/60 rounded-lg">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-green-700">{device.name}</span>
                  <span className="text-green-900 font-medium">{device.hours}h ({percentage}%)</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-1.5">
                  <div className={`${device.color} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
        <div className="text-sm font-medium text-orange-700 mb-2">Longest Device Usage</div>
        <div className="text-lg font-bold text-orange-900">{longestDevice}</div>
      </div>

      <div className={`rounded-xl p-4 border ${assessmentClass}`}>
        <div className="text-sm font-bold mb-1">{assessmentTitle}</div>
        <div className="text-xs">{assessmentText}</div>
      </div>
    </>
  );

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Screen Time Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Track and analyze your screen time across all devices. Get personalized recommendations for healthier digital habits and improved work-life balance.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Daily Device Usage</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">📱</div>
                  <h3 className="text-base font-semibold text-blue-900">Smartphone</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Hours per day</label>
                  <input
                    type="number"
                    value={phoneHours}
                    onChange={(e) => setPhoneHours(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="24"
                    step="0.5"
                    className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">💻</div>
                  <h3 className="text-base font-semibold text-green-900">Computer/Laptop</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Hours per day</label>
                  <input
                    type="number"
                    value={computerHours}
                    onChange={(e) => setComputerHours(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="24"
                    step="0.5"
                    className="w-full px-3 py-2.5 border border-green-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">📺</div>
                  <h3 className="text-base font-semibold text-purple-900">Television</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">Hours per day</label>
                  <input
                    type="number"
                    value={tvHours}
                    onChange={(e) => setTvHours(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="24"
                    step="0.5"
                    className="w-full px-3 py-2.5 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-2xl">📟</div>
                  <h3 className="text-base font-semibold text-orange-900">Tablet</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Hours per day</label>
                  <input
                    type="number"
                    value={tabletHours}
                    onChange={(e) => setTabletHours(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="24"
                    step="0.5"
                    className="w-full px-3 py-2.5 border border-orange-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => applyPreset('light')}
                  className="px-3 py-2.5 bg-green-100 hover:bg-green-200 rounded-lg text-green-800 font-medium transition-colors border border-green-200 text-sm"
                >
                  ✓ Light User
                </button>
                <button
                  onClick={() => applyPreset('moderate')}
                  className="px-3 py-2.5 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-800 font-medium transition-colors border border-yellow-200 text-sm"
                >
                  ⚡ Moderate
                </button>
                <button
                  onClick={() => applyPreset('heavy')}
                  className="px-3 py-2.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-800 font-medium transition-colors border border-red-200 text-sm"
                >
                  ⚠️ Heavy User
                </button>
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-6">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-4">
              <ResultsPanel />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-300">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">20-20-20 Rule</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">Every 20 minutes, look at something 20 feet away for at least 20 seconds. This reduces digital eye strain and prevents eye fatigue.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center border border-green-300">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Healthy Limits</h3>
                  <p className="text-sm text-green-700 leading-relaxed">Adults: Limit recreational screen time to 2-3 hours daily. Children (2-5): Max 1 hour. Children (6+): Set consistent limits that don't interfere with sleep and activities.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center border border-purple-300">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Sleep & Blue Light</h3>
                  <p className="text-sm text-purple-700 leading-relaxed">Avoid screens 1 hour before bed. Blue light suppresses melatonin production, disrupting sleep. Use night mode or blue light filters in the evening.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center border border-orange-300">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">Move More</h3>
                  <p className="text-sm text-orange-700 leading-relaxed">Take a 5-minute movement break every hour. Stretch, walk, or do light exercises. Prolonged sitting and screen time increase health risks.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center border border-pink-300">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-pink-900 mb-2">Good Posture</h3>
                  <p className="text-sm text-pink-700 leading-relaxed">Keep screen at eye level, 20-26 inches away. Sit with back supported, feet flat on floor. Avoid "tech neck" by keeping head aligned with spine.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center border border-cyan-300">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-900 mb-2">Set Boundaries</h3>
                  <p className="text-sm text-cyan-700 leading-relaxed">Create device-free zones (bedroom, dining table) and times (meals, family time). Use app timers and turn off non-essential notifications.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Screen Time Health Effects</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Excessive Screen Time May Cause:</span>
                </h3>
                <ul className="text-sm text-red-700 space-y-1.5">
                  <li>• Digital eye strain and dry eyes</li>
                  <li>• Poor sleep quality and insomnia</li>
                  <li>• Neck, back, and shoulder pain</li>
                  <li>• Reduced physical activity</li>
                  <li>• Headaches and migraines</li>
                  <li>• Attention and focus difficulties</li>
                  <li>• Social isolation</li>
                  <li>• Increased anxiety and stress</li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <span>✓</span>
                  <span>Benefits of Reduced Screen Time:</span>
                </h3>
                <ul className="text-sm text-green-700 space-y-1.5">
                  <li>• Better sleep quality and duration</li>
                  <li>• Improved focus and productivity</li>
                  <li>• More physical activity and exercise</li>
                  <li>• Better posture and less pain</li>
                  <li>• Reduced eye strain</li>
                  <li>• Enhanced social connections</li>
                  <li>• Lower stress and anxiety levels</li>
                  <li>• More time for hobbies and interests</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="text-xl sm:text-2xl md:text-3xl mb-2">⏰</div>
              <h3 className="font-semibold text-blue-900 mb-2">Time Management</h3>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Set daily limits</li>
                <li>• Use app timers</li>
                <li>• Schedule breaks</li>
                <li>• Track your usage</li>
              </ul>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-xl sm:text-2xl md:text-3xl mb-2">👥</div>
              <h3 className="font-semibold text-green-900 mb-2">Social Balance</h3>
              <ul className="text-sm text-green-700 text-left space-y-1">
                <li>• Device-free meals</li>
                <li>• Face-to-face time</li>
                <li>• Offline hobbies</li>
                <li>• Active listening</li>
              </ul>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="text-xl sm:text-2xl md:text-3xl mb-2">🧘</div>
              <h3 className="font-semibold text-purple-900 mb-2">Mindful Usage</h3>
              <ul className="text-sm text-purple-700 text-left space-y-1">
                <li>• Be intentional</li>
                <li>• Remove distractions</li>
                <li>• Turn off notifications</li>
                <li>• Practice awareness</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:sticky lg:top-6 space-y-4">
            <ResultsPanel />
          </div>
        </div>
      </div>
      <div className="mb-4 sm:mb-6 md:mb-8 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Related Converter Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color} rounded-xl p-6 text-white hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-lg font-semibold mb-2">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="screen-time-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
