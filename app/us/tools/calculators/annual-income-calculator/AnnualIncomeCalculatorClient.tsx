'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Annual Income Calculator?",
    answer: "A Annual Income Calculator is a free online tool that helps you calculate and analyze annual income-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Annual Income Calculator?",
    answer: "Our Annual Income Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Annual Income Calculator free to use?",
    answer: "Yes, this Annual Income Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Annual Income calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to annual income such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function AnnualIncomeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('annual-income-calculator');

  const [hourlyRate, setHourlyRate] = useState(25);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(50);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyDecimals = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const results = useMemo(() => {
    const annualIncome = hourlyRate * hoursPerWeek * weeksPerYear;
    const monthlyIncome = annualIncome / 12;
    const weeklyIncome = hourlyRate * hoursPerWeek;
    const dailyIncome = hoursPerWeek > 0 ? weeklyIncome / 5 : 0;
    const totalHours = hoursPerWeek * weeksPerYear;
    const workingDays = Math.round(weeksPerYear * 5);
    const vacationWeeks = 52 - weeksPerYear;
    const vacationDays = vacationWeeks * 5;

    return {
      annualIncome,
      monthlyIncome,
      weeklyIncome,
      dailyIncome,
      totalHours,
      workingDays,
      vacationWeeks,
      vacationDays
    };
  }, [hourlyRate, hoursPerWeek, weeksPerYear]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const calc = (rate: number, hours: number, weeks: number) => rate * hours * weeks;

    return [
      {
        title: '$5 More/Hour',
        description: 'Increase hourly rate',
        annual: calc(hourlyRate + 5, hoursPerWeek, weeksPerYear),
        diff: calc(hourlyRate + 5, hoursPerWeek, weeksPerYear) - results.annualIncome
      },
      {
        title: 'Full-Time+',
        description: '45 hours/week',
        annual: calc(hourlyRate, 45, weeksPerYear),
        diff: calc(hourlyRate, 45, weeksPerYear) - results.annualIncome
      },
      {
        title: 'Full Year',
        description: '52 weeks worked',
        annual: calc(hourlyRate, hoursPerWeek, 52),
        diff: calc(hourlyRate, hoursPerWeek, 52) - results.annualIncome
      }
    ];
  }, [hourlyRate, hoursPerWeek, weeksPerYear, results.annualIncome]);

  // Common hourly rates comparison
  const rateComparisons = useMemo(() => {
    const rates = [15, 20, 25, 30, 40, 50];
    return rates.map(rate => ({
      rate,
      daily: rate * 8,
      weekly: rate * hoursPerWeek,
      monthly: (rate * hoursPerWeek * weeksPerYear) / 12,
      annual: rate * hoursPerWeek * weeksPerYear
    }));
  }, [hoursPerWeek, weeksPerYear]);

  // SVG Bar Chart
  const renderIncomeChart = () => {
    const data = [
      { label: 'Hourly', value: hourlyRate, color: '#3B82F6' },
      { label: 'Daily', value: results.dailyIncome, color: '#10B981' },
      { label: 'Weekly', value: results.weeklyIncome, color: '#F59E0B' },
      { label: 'Monthly', value: results.monthlyIncome, color: '#8B5CF6' }
    ];

    const maxValue = Math.max(...data.map(d => d.value));
    const width = 400;
    const height = 220;
    const barWidth = 70;
    const gap = 25;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <text x={width / 2} y={15} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="600">
          Income Breakdown
        </text>
        {data.map((d, i) => {
          const barHeight = maxValue > 0 ? (d.value / maxValue) * 140 : 0;
          const x = 35 + i * (barWidth + gap);
          const y = 175 - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={d.color}
                rx="4"
                className="cursor-pointer transition-all duration-200"
                opacity={hoveredBar === i ? 1 : 0.85}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="#374151" fontSize="11" fontWeight="600">
                {formatCurrency(d.value)}
              </text>
              <text x={x + barWidth / 2} y={195} textAnchor="middle" fill="#6B7280" fontSize="11">
                {d.label}
              </text>
              {hoveredBar === i && (
                <rect x={x - 2} y={y - 2} width={barWidth + 4} height={barHeight + 4} fill="none" stroke={d.color} strokeWidth="2" rx="6" />
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // SVG Donut for Time Distribution
  const renderTimeChart = () => {
    const workHours = results.totalHours;
    const totalYearHours = 52 * 7 * 24; // 8,736 hours
    const sleepHours = 52 * 7 * 8; // 2,912 hours
    const otherHours = totalYearHours - workHours - sleepHours;

    const total = workHours + sleepHours + otherHours;
    const workPercent = (workHours / total) * 100;
    const sleepPercent = (sleepHours / total) * 100;
    const otherPercent = 100 - workPercent - sleepPercent;

    const radius = 60;
    const strokeWidth = 18;
    const circumference = 2 * Math.PI * radius;

    const segments = [
      { id: 'work', label: 'Work', hours: workHours, percent: workPercent, color: '#3B82F6', offset: 0 },
      { id: 'sleep', label: 'Sleep', hours: sleepHours, percent: sleepPercent, color: '#8B5CF6', offset: -(workPercent / 100) * circumference },
      { id: 'other', label: 'Other', hours: otherHours, percent: otherPercent, color: '#E5E7EB', offset: -((workPercent + sleepPercent) / 100) * circumference },
    ];

    const getTooltipContent = () => {
      const segment = segments.find(s => s.id === hoveredSegment);
      if (!segment) return null;
      return {
        label: segment.label,
        hours: segment.hours,
        percent: segment.percent
      };
    };

    const tooltipData = getTooltipContent();

    return (
      <div className="flex flex-col items-center relative">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
            {segments.map((segment) => (
              <circle
                key={segment.id}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={hoveredSegment === segment.id ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${(segment.percent / 100) * circumference} ${circumference}`}
                strokeDashoffset={segment.offset}
                className="cursor-pointer transition-all duration-200"
                style={{ opacity: hoveredSegment && hoveredSegment !== segment.id ? 0.5 : 1 }}
                onMouseEnter={() => setHoveredSegment(segment.id)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            ))}
          </svg>
          {/* Center tooltip */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {tooltipData ? (
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800">{tooltipData.hours.toLocaleString()}</div>
                <div className="text-xs text-gray-500">hours/year</div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800">{totalYearHours.toLocaleString()}</div>
                <div className="text-xs text-gray-500">total hours</div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          <div
            className={`flex items-center gap-1 cursor-pointer transition-opacity ${hoveredSegment && hoveredSegment !== 'work' ? 'opacity-50' : ''}`}
            onMouseEnter={() => setHoveredSegment('work')}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Work ({workPercent.toFixed(1)}%)</span>
          </div>
          <div
            className={`flex items-center gap-1 cursor-pointer transition-opacity ${hoveredSegment && hoveredSegment !== 'sleep' ? 'opacity-50' : ''}`}
            onMouseEnter={() => setHoveredSegment('sleep')}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-gray-600">Sleep ({sleepPercent.toFixed(1)}%)</span>
          </div>
          <div
            className={`flex items-center gap-1 cursor-pointer transition-opacity ${hoveredSegment && hoveredSegment !== 'other' ? 'opacity-50' : ''}`}
            onMouseEnter={() => setHoveredSegment('other')}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-xs text-gray-600">Other ({otherPercent.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">{getH1('Annual Income Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Convert hourly wage to yearly salary with comprehensive breakdowns by day, week, month, and year
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}

      <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Income Details</h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Hourly Rate</label>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrencyDecimals(hourlyRate)}</span>
                </div>
                <input
                  type="range"
                  min="7.25"
                  max="200"
                  step="0.25"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$7.25 (Min wage)</span>
                  <span>$200</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Hours per Week</label>
                  <span className="text-sm font-semibold text-emerald-600">{hoursPerWeek} hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="80"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 hour</span>
                  <span>80 hours</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Working Weeks per Year</label>
                  <span className="text-sm font-semibold text-purple-600">{weeksPerYear} weeks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="52"
                  step="1"
                  value={weeksPerYear}
                  onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 week</span>
                  <span>52 weeks</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {results.vacationWeeks > 0 ? `${results.vacationWeeks} weeks off (${results.vacationDays} vacation days)` : 'Full year with no time off'}
                </p>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setHourlyRate(15); setHoursPerWeek(40); setWeeksPerYear(50); }}
                    className="p-2 text-xs bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="font-semibold text-blue-900">Entry Level</div>
                    <div className="text-blue-700">$15/hr</div>
                  </button>
                  <button
                    onClick={() => { setHourlyRate(30); setHoursPerWeek(40); setWeeksPerYear(50); }}
                    className="p-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <div className="font-semibold text-emerald-900">Mid Level</div>
                    <div className="text-emerald-700">$30/hr</div>
                  </button>
                  <button
                    onClick={() => { setHourlyRate(50); setHoursPerWeek(40); setWeeksPerYear(50); }}
                    className="p-2 text-xs bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="font-semibold text-purple-900">Senior</div>
                    <div className="text-purple-700">$50/hr</div>
                  </button>
                </div>
              </div>

              {/* Time Distribution */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 text-center mb-2">Annual Time Distribution</h3>
                {renderTimeChart()}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Income Breakdown</h2>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 mb-5 border border-emerald-100">
              <div className="text-sm text-emerald-700 mb-1">Annual Income</div>
              <div className="text-xl sm:text-2xl md:text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">{formatCurrency(results.annualIncome)}</div>
              <div className="text-xs text-emerald-600 mt-1">Gross yearly salary</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Hourly Rate</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrencyDecimals(hourlyRate)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-emerald-600 mb-1">Daily Income</div>
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(results.dailyIncome)}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-amber-600 mb-1">Weekly Income</div>
                <div className="text-lg font-bold text-amber-600">{formatCurrency(results.weeklyIncome)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Monthly Income</div>
                <div className="text-lg font-bold text-purple-600">{formatCurrency(results.monthlyIncome)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                <div className="text-xs text-gray-500 mb-1">Total Hours/Year</div>
                <div className="text-lg font-bold text-gray-800">{results.totalHours.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                <div className="text-xs text-gray-500 mb-1">Working Days</div>
                <div className="text-lg font-bold text-gray-800">{results.workingDays}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                <div className="text-xs text-gray-500 mb-1">Vacation Days</div>
                <div className="text-lg font-bold text-gray-800">{results.vacationDays}</div>
              </div>
            </div>

            {/* Income Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              {renderIncomeChart()}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">See how changes affect your annual income</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{scenario.title}</h3>
                  <p className="text-xs text-gray-500">{scenario.description}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(scenario.annual)}</div>
              <div className="text-sm font-medium text-emerald-600">
                +{formatCurrency(scenario.diff)} annually
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Hourly Rate Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Hourly Rate Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-lg">Hourly Rate</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Daily (8hr)</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Weekly</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Monthly</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 rounded-tr-lg">Annual</th>
              </tr>
            </thead>
            <tbody>
              {rateComparisons.map((row, index) => (
                <tr key={row.rate} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${row.rate === Math.round(hourlyRate) ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">${row.rate}/hr</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(row.daily)}</td>
                  <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(row.weekly)}</td>
                  <td className="px-4 py-3 text-right text-purple-600">{formatCurrency(row.monthly)}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">{formatCurrency(row.annual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">Based on {hoursPerWeek} hours/week and {weeksPerYear} weeks/year</p>
      </div>

      {/* Income Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-blue-100">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Income & Work Tips</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Salary Negotiation</h4>
            <p className="text-blue-800 text-sm">Know your hourly equivalent when negotiating salary. A $5/hr increase equals $10,000+ annually.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-emerald-100">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-emerald-900 mb-2">Overtime Value</h4>
            <p className="text-emerald-800 text-sm">Time-and-a-half overtime (1.5x) significantly boosts income. 5 extra hours at $25/hr = $187.50/week.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-purple-900 mb-2">True Hourly Value</h4>
            <p className="text-purple-800 text-sm">Consider benefits, commute time, and work expenses when comparing job offers.</p>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className={`w-10 h-10 ${calc.color || 'bg-blue-100'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-xl">{calc.icon || '📊'}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">How to Calculate Your Annual Income from Hourly Wage</h2>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Converting your hourly wage to annual salary might seem straightforward, but there's more to it than just multiplication. Your actual yearly earnings depend on how many hours you work each week and how many weeks you work throughout the year. Most full-time employees in the US work around 2,080 hours annually (40 hours × 52 weeks), though this varies based on vacation time, holidays, and industry standards.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">The Annual Income Formula</h3>
          <div className="bg-gray-50 rounded-xl p-5 mb-3 sm:mb-4 md:mb-6">
            <p className="font-mono text-sm text-gray-700 mb-3">
              Annual Income = Hourly Rate × Hours per Week × Weeks per Year
            </p>
            <p className="text-sm text-gray-600">
              For example, at $25/hour working 40 hours weekly for 50 weeks: $25 × 40 × 50 = <strong>$50,000 per year</strong>
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Weeks Worked Matters</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Many online calculators assume you work all 52 weeks of the year, which inflates your true annual income. In reality, most American workers take 2-3 weeks of vacation, plus federal holidays. If you're paid hourly and don't receive paid time off, those unpaid weeks significantly impact your yearly total. A $20/hour worker who takes 2 weeks unpaid vacation earns $1,600 less than someone working the full year.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Understanding Gross vs Net Income</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                The annual income shown here is your <strong>gross income</strong>—the total before any deductions. Your actual take-home pay (net income) will be 20-35% lower after federal income tax, state taxes, Social Security (6.2%), Medicare (1.45%), and any pre-tax benefits like health insurance or 401(k) contributions.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
              <h4 className="text-lg font-semibold text-emerald-900 mb-3">Overtime Considerations</h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Under the Fair Labor Standards Act (FLSA), non-exempt hourly employees must receive 1.5× their regular rate for hours worked beyond 40 per week. If overtime is part of your regular schedule, your effective annual income could be significantly higher than standard calculations suggest.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Hourly to Annual Conversions</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Here's a quick reference based on a standard 40-hour week working 50 weeks per year (allowing for 2 weeks unpaid time off):
          </p>
          <ul className="text-gray-600 space-y-2 mb-3 sm:mb-4 md:mb-6">
            <li className="flex items-center gap-2"><span className="text-blue-500">•</span><strong>$15/hour</strong> = $30,000/year (minimum wage in many states)</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">•</span><strong>$20/hour</strong> = $40,000/year (entry-level skilled positions)</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">•</span><strong>$25/hour</strong> = $50,000/year (median hourly wage)</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">•</span><strong>$35/hour</strong> = $70,000/year (experienced professionals)</li>
            <li className="flex items-center gap-2"><span className="text-blue-500">•</span><strong>$50/hour</strong> = $100,000/year (specialized skills)</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Using Annual Income for Financial Planning</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Knowing your annual income is essential for several financial decisions:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <strong className="text-gray-800">Budgeting:</strong>
                <p className="text-sm text-gray-600">Calculate monthly expenses as a percentage of your gross income. Financial experts recommend keeping housing costs under 30%.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <strong className="text-gray-800">Loan Applications:</strong>
                <p className="text-sm text-gray-600">Lenders use your annual income to determine debt-to-income ratio and loan eligibility.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <strong className="text-gray-800">Tax Planning:</strong>
                <p className="text-sm text-gray-600">Understanding your tax bracket helps optimize deductions and retirement contributions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <strong className="text-gray-800">Job Comparisons:</strong>
                <p className="text-sm text-gray-600">Compare salary offers by converting everything to the same format (annual or hourly).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How do I convert hourly wage to annual salary?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Multiply your hourly rate by the number of hours you work per week, then multiply by the number of weeks you work per year. For a standard full-time job: hourly rate × 40 hours × 52 weeks. However, if you don't get paid vacation, use 50 weeks to account for typical time off.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What's the difference between 2,080 hours and 2,000 hours per year?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The 2,080-hour figure assumes 52 full weeks of work (40 × 52). The 2,000-hour figure accounts for 2 weeks of unpaid time off (40 × 50). For hourly workers without paid vacation, 2,000 hours is more realistic. Salaried employees with PTO typically use 2,080 hours since they're paid regardless of vacation.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Should I include overtime in my annual income calculation?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              If overtime is consistent and expected, include it. Calculate overtime hours separately at 1.5× your regular rate. For budgeting purposes, it's safer to calculate your base income without overtime, then treat extra earnings as savings or debt payoff funds.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How much of a raise is $1 more per hour?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A $1/hour raise equals approximately $2,000 more per year for a full-time worker (40 hours × 50 weeks). Over a 30-year career, that single dollar raise amounts to $60,000 in additional lifetime earnings—even more when you factor in future percentage-based raises built on that higher base.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Why is my take-home pay so much less than my gross annual income?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your net (take-home) pay is reduced by federal income tax (10-37% depending on bracket), state income tax (0-13% depending on state), Social Security tax (6.2% up to the wage base), Medicare tax (1.45%), and any pre-tax deductions like health insurance, HSA contributions, or 401(k) contributions. Most workers take home 65-80% of their gross pay.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Disclaimer</h3>
            <p className="text-sm text-amber-700">
              This calculator provides gross income estimates before taxes and deductions. Net take-home pay will be lower after federal, state, and local taxes, as well as benefits deductions. For precise tax calculations, consult a tax professional or use the IRS Tax Withholding Estimator.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="annual-income-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
