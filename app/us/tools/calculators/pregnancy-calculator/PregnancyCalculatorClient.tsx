'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

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

interface PregnancyCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

interface PregnancyMilestone {
  week: number;
  title: string;
  description: string;
  emoji: string;
}

const milestones: PregnancyMilestone[] = [
  { week: 4, title: 'Positive Test', description: 'Pregnancy can be detected', emoji: '🧪' },
  { week: 8, title: 'First Heartbeat', description: 'Baby\'s heart starts beating', emoji: '💓' },
  { week: 12, title: 'End of 1st Trimester', description: 'Risk of miscarriage drops', emoji: '✅' },
  { week: 16, title: 'Feel Baby Move', description: 'First movements may be felt', emoji: '👶' },
  { week: 20, title: 'Anatomy Scan', description: 'Detailed ultrasound check', emoji: '🩻' },
  { week: 24, title: 'Viability', description: 'Baby could survive outside womb', emoji: '🌟' },
  { week: 28, title: '3rd Trimester', description: 'Final growth stage begins', emoji: '📈' },
  { week: 37, title: 'Full Term', description: 'Baby is considered full term', emoji: '🎉' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "How is my due date calculated?",
    answer: "Your due date is calculated using Naegele's rule: adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). If you know your conception date, we add 266 days (38 weeks) instead. For IVF pregnancies, the calculation is based on the embryo transfer date and embryo age. These calculations provide an estimated due date around which your baby is likely to arrive.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this pregnancy calculator?",
    answer: "This calculator provides an estimate based on standard medical formulas. Only about 5% of babies are born on their exact due date. Most births (90%) occur within 2 weeks before or after the estimated date. An ultrasound performed in the first trimester (8-13 weeks) can provide a more accurate estimate by measuring the baby's size, and healthcare providers may adjust your due date accordingly.",
    order: 2
  },
  {
    id: '3',
    question: "What are the three trimesters of pregnancy?",
    answer: "Pregnancy is divided into three trimesters: First trimester (weeks 1-13) involves early development, organ formation, and the highest risk of miscarriage; Second trimester (weeks 14-27) is when the baby grows rapidly, movements are felt, and energy typically returns; Third trimester (weeks 28-40) involves final growth, preparation for birth, and more frequent prenatal visits. Each trimester has specific milestones and medical screenings.",
    order: 3
  },
  {
    id: '4',
    question: "When should I see a doctor after a positive pregnancy test?",
    answer: "Schedule your first prenatal visit within 6-8 weeks of your last period, typically when you're 6-10 weeks pregnant. Earlier appointments may be recommended if you have pre-existing health conditions, previous pregnancy complications, are over 35, or have symptoms like severe pain or bleeding. Your first visit will include pregnancy confirmation, due date calculation, medical history review, and initial blood work.",
    order: 4
  },
  {
    id: '5',
    question: "How does cycle length affect the due date?",
    answer: "The standard calculation assumes a 28-day cycle with ovulation on day 14. If your cycle is longer (e.g., 35 days), ovulation occurs later, meaning conception happened later than the standard calculation assumes, and your actual due date would be later. Conversely, shorter cycles mean earlier ovulation and an earlier due date. Many calculators allow you to input your specific cycle length for more accurate estimates.",
    order: 5
  },
  {
    id: '6',
    question: "Can my due date change during pregnancy?",
    answer: "Yes, your due date may be adjusted based on early ultrasound measurements, especially if performed between 8-13 weeks when size measurements are most accurate. However, once a due date is established in the first trimester, it typically doesn't change. Later ultrasounds are less reliable for dating because babies grow at different rates. Your healthcare provider will use the most accurate information available to determine your final due date.",
    order: 6
  }
];

export default function PregnancyCalculatorClient({ relatedCalculators = [] }: PregnancyCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('pregnancy-calculator');

  const [method, setMethod] = useState<'lmp' | 'conception' | 'ivf'>('lmp');
  const [dateInput, setDateInput] = useState<string>('');
  const [cycleLength, setCycleLength] = useState(28);

  const [results, setResults] = useState({
    dueDate: null as Date | null,
    currentWeek: 0,
    currentDay: 0,
    daysRemaining: 0,
    trimester: '',
    conception: null as Date | null,
    firstTrimesterEnd: null as Date | null,
    secondTrimesterEnd: null as Date | null,
    progress: 0
  });

  useEffect(() => {
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 2);
    const year = threeMonthsAgo.getFullYear();
    const month = String(threeMonthsAgo.getMonth() + 1).padStart(2, '0');
    const day = String(threeMonthsAgo.getDate()).padStart(2, '0');
    setDateInput(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    if (dateInput) {
      calculatePregnancy();
    }
  }, [dateInput, method, cycleLength]);

  const calculatePregnancy = () => {
    if (!dateInput) return;

    const inputDate = new Date(dateInput);
    const today = new Date();
    let conceptionDate: Date;
    let dueDate: Date;

    if (method === 'lmp') {
      // Conception typically occurs around day 14 of a 28-day cycle
      // Adjust for different cycle lengths
      const ovulationDay = cycleLength - 14;
      conceptionDate = new Date(inputDate);
      conceptionDate.setDate(conceptionDate.getDate() + ovulationDay);

      dueDate = new Date(inputDate);
      dueDate.setDate(dueDate.getDate() + 280);
    } else if (method === 'conception') {
      conceptionDate = new Date(inputDate);
      dueDate = new Date(inputDate);
      dueDate.setDate(dueDate.getDate() + 266);
    } else {
      // IVF - date is embryo transfer, add 266 days minus embryo age (typically 3 or 5 days)
      conceptionDate = new Date(inputDate);
      dueDate = new Date(inputDate);
      dueDate.setDate(dueDate.getDate() + 266);
    }

    // Calculate current week and day
    const lmpDate = method === 'lmp' ? inputDate : new Date(conceptionDate.getTime() - (14 * 24 * 60 * 60 * 1000));
    const diffTime = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7);
    const currentDay = diffDays % 7;

    // Days remaining
    const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    // Trimester
    let trimester = '';
    if (currentWeek <= 13) {
      trimester = 'First Trimester';
    } else if (currentWeek <= 27) {
      trimester = 'Second Trimester';
    } else {
      trimester = 'Third Trimester';
    }

    // Trimester end dates
    const firstTrimesterEnd = new Date(lmpDate);
    firstTrimesterEnd.setDate(firstTrimesterEnd.getDate() + (13 * 7));

    const secondTrimesterEnd = new Date(lmpDate);
    secondTrimesterEnd.setDate(secondTrimesterEnd.getDate() + (27 * 7));

    // Progress percentage
    const progress = Math.min(100, Math.max(0, (diffDays / 280) * 100));

    setResults({
      dueDate,
      currentWeek: Math.max(0, currentWeek),
      currentDay: Math.max(0, currentDay),
      daysRemaining,
      trimester,
      conception: conceptionDate,
      firstTrimesterEnd,
      secondTrimesterEnd,
      progress
    });
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '--';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (date: Date | null): string => {
    if (!date) return '--';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <main className="flex-grow">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{getH1('Pregnancy Due Date Calculator')}</h1>
          <p className="text-gray-600">Calculate your estimated due date and track pregnancy milestones</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          {/* Calculation Method */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Calculate By</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('lmp')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  method === 'lmp'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="text-2xl block mb-1">📅</span>
                <span className="text-xs font-medium block">Last Period</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('conception')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  method === 'conception'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="text-2xl block mb-1">🌟</span>
                <span className="text-xs font-medium block">Conception</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('ivf')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  method === 'ivf'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="text-2xl block mb-1">🔬</span>
                <span className="text-xs font-medium block">IVF Transfer</span>
              </button>
            </div>
          </div>

          {/* Date Input */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {method === 'lmp' ? 'First Day of Last Period' : method === 'conception' ? 'Conception Date' : 'IVF Transfer Date'}
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Cycle Length (only for LMP) */}
          {method === 'lmp' && (
            <div className="mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Average Cycle Length</label>
                <span className="text-lg font-bold text-pink-600">{cycleLength} days</span>
              </div>
              <input
                type="range"
                min="21"
                max="40"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-pink-200 to-pink-400 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>21 days</span>
                <span>40 days</span>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="space-y-4">
            {/* Primary Result - Due Date */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-3 sm:p-4 md:p-6 text-white">
              <div className="text-center">
                <div className="text-pink-100 text-sm font-medium mb-1">Estimated Due Date</div>
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold mb-2">{formatDate(results.dueDate)}</div>
                <div className="text-pink-100 text-sm">{results.daysRemaining} days remaining</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Pregnancy Progress</span>
                <span className="font-bold text-pink-600">{results.progress.toFixed(0)}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500"
                  style={{ width: `${results.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Week 1</span>
                <span>Week 40</span>
              </div>
            </div>

            {/* Current Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                <div className="text-purple-100 text-xs mb-1">Current Week</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.currentWeek}</div>
                <div className="text-purple-100 text-xs">+ {results.currentDay} days</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white text-center">
                <div className="text-blue-100 text-xs mb-1">Trimester</div>
                <div className="text-lg font-bold">{results.trimester || '--'}</div>
                <div className="text-blue-100 text-xs">of pregnancy</div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Important Dates</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-pink-100 rounded-lg p-3 text-center">
                  <div className="text-xs text-pink-600 font-medium mb-1">1st Tri Ends</div>
                  <div className="text-sm font-bold text-pink-800">{formatShortDate(results.firstTrimesterEnd)}</div>
                </div>
                <div className="bg-purple-100 rounded-lg p-3 text-center">
                  <div className="text-xs text-purple-600 font-medium mb-1">2nd Tri Ends</div>
                  <div className="text-sm font-bold text-purple-800">{formatShortDate(results.secondTrimesterEnd)}</div>
                </div>
                <div className="bg-blue-100 rounded-lg p-3 text-center">
                  <div className="text-xs text-blue-600 font-medium mb-1">Due Date</div>
                  <div className="text-sm font-bold text-blue-800">{formatShortDate(results.dueDate)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Pregnancy Milestones */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pregnancy Milestones</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {milestones.map((milestone) => {
              const isPast = results.currentWeek >= milestone.week;
              return (
                <div
                  key={milestone.week}
                  className={`bg-white rounded-xl p-4 text-center shadow-sm ${
                    isPast ? 'ring-2 ring-pink-400' : ''
                  }`}
                >
                  <span className="text-2xl block mb-2">{milestone.emoji}</span>
                  <div className="text-xs text-gray-500 mb-1">Week {milestone.week}</div>
                  <div className="font-semibold text-gray-800 text-sm">{milestone.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{milestone.description}</div>
                  {isPast && (
                    <div className="text-xs text-pink-600 font-medium mt-2">✓ Reached</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trimester Information */}
        <div className="grid md:grid-cols-3 gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className={`rounded-2xl p-6 ${results.trimester === 'First Trimester' ? 'bg-pink-100 ring-2 ring-pink-400' : 'bg-pink-50'}`}>
            <h3 className="text-lg font-bold text-pink-900 mb-3 flex items-center gap-2">
              <span>🌱</span> First Trimester
            </h3>
            <p className="text-sm text-pink-800 mb-3">Weeks 1-13</p>
            <ul className="space-y-1 text-sm text-pink-700">
              <li>• Morning sickness common</li>
              <li>• Major organs forming</li>
              <li>• Fatigue and mood changes</li>
              <li>• First prenatal visits</li>
            </ul>
          </div>

          <div className={`rounded-2xl p-6 ${results.trimester === 'Second Trimester' ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-purple-50'}`}>
            <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span>🌸</span> Second Trimester
            </h3>
            <p className="text-sm text-purple-800 mb-3">Weeks 14-27</p>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• Energy levels improve</li>
              <li>• Baby movements felt</li>
              <li>• Anatomy scan at week 20</li>
              <li>• Belly begins showing</li>
            </ul>
          </div>

          <div className={`rounded-2xl p-6 ${results.trimester === 'Third Trimester' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-blue-50'}`}>
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span>🍼</span> Third Trimester
            </h3>
            <p className="text-sm text-blue-800 mb-3">Weeks 28-40</p>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Rapid baby growth</li>
              <li>• More frequent checkups</li>
              <li>• Prepare for delivery</li>
              <li>• Braxton Hicks contractions</li>
            </ul>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your Pregnancy Journey</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Pregnancy is an incredible 40-week journey divided into three trimesters, each bringing unique developments, milestones, and challenges. Calculating your due date accurately helps you and your healthcare provider track your baby's growth, schedule important prenatal appointments, prepare for delivery, and understand what to expect each week. While your due date is an estimate - with only 5% of babies arriving on their exact due date - it serves as an essential reference point for monitoring a healthy pregnancy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
              <h3 className="font-semibold text-pink-800 mb-2">Naegele's Rule</h3>
              <p className="text-sm text-gray-600">The standard method for calculating due dates: add 280 days (40 weeks) to the first day of your last menstrual period. This assumes a 28-day cycle with ovulation on day 14, the most common pattern for conception.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2">Trimester System</h3>
              <p className="text-sm text-gray-600">Pregnancy is divided into three 13-week periods. Each trimester has distinct developmental milestones, symptoms, and medical screenings that track your baby's growth and your health throughout pregnancy.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Ultrasound Dating</h3>
              <p className="text-sm text-gray-600">First-trimester ultrasounds (8-13 weeks) measure your baby's size to confirm or adjust your due date. These early measurements are more accurate than later scans because babies grow at similar rates early on.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Pregnancy Calculation Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Last Menstrual Period (LMP)</h4>
              <p className="text-sm text-gray-600 mb-2">The most common method. Add 280 days to the first day of your last period. Works best if you have regular 28-day cycles and know your LMP date accurately.</p>
              <p className="text-xs text-gray-500">Example: LMP Jan 1 → Due Date Oct 8</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Conception Date</h4>
              <p className="text-sm text-gray-600 mb-2">If you know when conception occurred (from ovulation tracking or specific date), add 266 days (38 weeks). More accurate than LMP for irregular cycles.</p>
              <p className="text-xs text-gray-500">Example: Conception Jan 15 → Due Date Oct 8</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">IVF Transfer Date</h4>
              <p className="text-sm text-gray-600 mb-2">For IVF pregnancies, calculate based on embryo transfer date and embryo age (3 or 5 days). Most accurate method since exact conception timing is known.</p>
              <p className="text-xs text-gray-500">Accounts for specific embryo development stage</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">Important Pregnancy Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Medical Appointments & Screening</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <strong>6-8 weeks:</strong> First prenatal visit - pregnancy confirmation, due date calculation, medical history, initial blood work, and prenatal vitamin recommendations.
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <strong>11-14 weeks:</strong> NT scan (nuchal translucency) - early screening for chromosomal abnormalities and confirmation of due date via ultrasound.
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <strong>18-22 weeks:</strong> Anatomy scan - detailed ultrasound checking baby's organs, growth, and often revealing baby's sex if desired.
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <strong>24-28 weeks:</strong> Glucose tolerance test - screening for gestational diabetes, a temporary condition that affects some pregnancies.
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <strong>35-37 weeks:</strong> Group B Strep test - screening for bacteria that could affect baby during delivery, easily treated with antibiotics.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">What to Expect Each Trimester</h4>
              <div className="space-y-3">
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
                  <h5 className="font-semibold text-pink-800 mb-1">First Trimester (Weeks 1-13)</h5>
                  <p className="text-xs text-gray-600">Morning sickness, fatigue, breast tenderness. Baby's organs form, heart starts beating. Highest miscarriage risk (10-20%). Take prenatal vitamins with folic acid to prevent neural tube defects.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <h5 className="font-semibold text-purple-800 mb-1">Second Trimester (Weeks 14-27)</h5>
                  <p className="text-xs text-gray-600">Energy returns, baby bump shows, feel first movements (quickening) around 18-20 weeks. Baby's sex can be determined. Often called the "honeymoon phase" - symptoms ease and energy improves.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <h5 className="font-semibold text-blue-800 mb-1">Third Trimester (Weeks 28-40)</h5>
                  <p className="text-xs text-gray-600">Rapid baby growth, frequent urination, backaches, Braxton Hicks contractions. Baby's lungs mature, baby descends into pelvis. Nesting instinct and increased prenatal visits prepare for delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="pregnancy-calculator" fallbackFaqs={fallbackFaqs} />
        </div>
{/* Related Calculators */}
        {relatedCalculators.length > 0 && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedCalculators.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className={`w-10 h-10 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-3`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-pink-600 transition-colors">{calc.title}</h3>
                  <p className="text-xs text-gray-500">{calc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. It is not a substitute for professional medical advice. Please consult your healthcare provider for accurate pregnancy dating and prenatal care.
          </p>
        </div>
      </div>
    </main>
  );
}
