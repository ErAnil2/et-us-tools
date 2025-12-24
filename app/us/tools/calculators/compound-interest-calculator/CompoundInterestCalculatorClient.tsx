'use client';

import { useState, useEffect, useMemo } from 'react';
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

interface YearlyData {
  year: number;
  contribution: number;
  totalContributed: number;
  interestEarned: number;
  totalValue: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Compound Interest Calculator?",
    answer: "A Compound Interest Calculator is a free online tool that helps you calculate and analyze compound interest-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Compound Interest Calculator?",
    answer: "Our Compound Interest Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Compound Interest Calculator free to use?",
    answer: "Yes, this Compound Interest Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Compound Interest calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to compound interest such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function CompoundInterestCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('compound-interest-calculator');

  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState(12);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const [results, setResults] = useState({
    futureValue: 0,
    totalContributions: 0,
    totalInterest: 0,
    contributionPercent: 0,
    interestPercent: 0,
    effectiveRate: 0,
    growthMultiple: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateCompoundInterest = (p: number, monthly: number, rate: number, t: number, freq: number) => {
    const r = rate / 100;
    const n = freq;

    // Calculate year by year
    const yearlyBreakdown: YearlyData[] = [];
    let currentValue = p;
    let totalContributed = p;

    for (let year = 1; year <= t; year++) {
      // Add monthly contributions and compound interest for this year
      const yearlyContribution = monthly * 12;

      // Compound the existing balance
      for (let period = 0; period < n; period++) {
        currentValue = currentValue * (1 + r / n);
        // Add monthly contributions distributed across compound periods
        if (n >= 12) {
          currentValue += monthly * (12 / n);
        }
      }

      // If compounding less frequently than monthly, add remaining contributions
      if (n < 12) {
        currentValue += monthly * 12;
      }

      totalContributed += yearlyContribution;
      const interestEarned = currentValue - totalContributed;

      yearlyBreakdown.push({
        year,
        contribution: yearlyContribution,
        totalContributed,
        interestEarned,
        totalValue: currentValue
      });
    }

    return {
      futureValue: currentValue,
      totalContributions: totalContributed,
      totalInterest: currentValue - totalContributed,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateCompoundInterest(principal, monthlyContribution, annualRate, years, compoundFrequency);
    const contributionPercent = (result.totalContributions / result.futureValue) * 100;
    const interestPercent = (result.totalInterest / result.futureValue) * 100;

    setResults({
      futureValue: result.futureValue,
      totalContributions: result.totalContributions,
      totalInterest: result.totalInterest,
      contributionPercent,
      interestPercent,
      effectiveRate: annualRate,
      growthMultiple: result.futureValue / result.totalContributions
    });

    setYearlyData(result.yearlyBreakdown);
  }, [principal, monthlyContribution, annualRate, years, compoundFrequency]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateCompoundInterest(principal, monthlyContribution, annualRate, years, compoundFrequency);
    const higherContribution = calculateCompoundInterest(principal, monthlyContribution * 1.5, annualRate, years, compoundFrequency);
    const longerTerm = calculateCompoundInterest(principal, monthlyContribution, annualRate, years + 5, compoundFrequency);

    return {
      current: { ...current, monthly: monthlyContribution, years, rate: annualRate },
      higher: {
        ...higherContribution,
        monthly: Math.round(monthlyContribution * 1.5),
        years,
        rate: annualRate,
        diff: higherContribution.futureValue - current.futureValue
      },
      longer: {
        ...longerTerm,
        monthly: monthlyContribution,
        years: years + 5,
        rate: annualRate,
        diff: longerTerm.futureValue - current.futureValue
      }
    };
  }, [principal, monthlyContribution, annualRate, years, compoundFrequency]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(1) + 'M';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.totalValue)) * 1.15 : 100;
  const scenarioMax = Math.max(scenarios.current.futureValue, scenarios.higher.futureValue, scenarios.longer.futureValue) * 1.1;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/simple-interest-calculator', title: 'Simple Interest', description: 'Calculate simple interest', icon: '💵' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '📈' },
    { href: '/us/tools/calculators/investment-calculator', title: 'Investment Calculator', description: 'Calculate investment growth', icon: '💹' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Plan savings targets', icon: '🎯' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/401k-calculator', title: '401k Calculator', description: 'Retirement savings plan', icon: '🏦' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Calculate inflation impact', icon: '📉' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📊' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate smooth line path
  const generateLinePath = (data: YearlyData[], key: 'totalContributed' | 'interestEarned' | 'totalValue') => {
    if (data.length === 0) return '';

    return data.map((d, i) => {
      const x = chartPadding.left + (i / (data.length - 1)) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: YearlyData[], key: 'totalContributed' | 'interestEarned' | 'totalValue') => {
    if (data.length === 0) return '';
    const linePath = generateLinePath(data, key);
    const startX = chartPadding.left;
    const endX = chartPadding.left + plotWidth;
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Get point coordinates
  const getPointCoords = (index: number, key: 'totalContributed' | 'interestEarned' | 'totalValue') => {
    if (!yearlyData[index]) return { x: 0, y: 0 };
    const x = chartPadding.left + (index / (yearlyData.length - 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - (yearlyData[index][key] / maxChartValue) * plotHeight;
    return { x, y };
  };

  // Y-axis ticks
  const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    value: maxChartValue * ratio,
    y: chartPadding.top + plotHeight - ratio * plotHeight
  }));

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Compound Interest Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">See how your money grows exponentially with the power of compound interest</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Investment Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Initial Investment (Principal)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Monthly Contribution</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Annual Interest Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Time Period (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-purple-600 mb-2 sm:mb-3 md:mb-4">Compounding Options</h3>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-purple-600 mb-1.5 sm:mb-2">Compound Frequency</label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(parseInt(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation bg-white"
                >
                  <option value={1}>Annually</option>
                  <option value={2}>Semi-annually</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={365}>Daily</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Growth
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Investment Growth</h2>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-emerald-600 mb-0.5 sm:mb-1">Future Value</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-700">{formatCurrencyFull(results.futureValue)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-emerald-600 mt-1">After {years} years of compounding</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Initial Investment:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(principal)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Contributions:</span>
                <span className="font-semibold text-blue-600">{formatCurrencyFull(results.totalContributions)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Interest Earned:</span>
                <span className="font-semibold text-purple-600">{formatCurrencyFull(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Growth Period:</span>
                <span className="font-semibold text-green-600">{years} years ({years * 12} months)</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Growth Composition</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Your Contributions</span>
                  <span className="font-medium">{results.contributionPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${results.contributionPercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Interest Earned</span>
                  <span className="font-medium">{results.interestPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${results.interestPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Insights</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest rate:</span>
                  <span className="font-medium">{annualRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compounding:</span>
                  <span className="font-medium">{compoundFrequency === 365 ? 'Daily' : compoundFrequency === 12 ? 'Monthly' : compoundFrequency === 4 ? 'Quarterly' : compoundFrequency === 2 ? 'Semi-annual' : 'Annual'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth multiple:</span>
                  <span className="font-medium">{results.growthMultiple.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective yield:</span>
                  <span className="font-medium">{((results.totalInterest / results.totalContributions) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Growth Visualization - Line Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Investment Growth Visualization</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Contributions</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Interest Earned</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Value</span>
          </div>
        </div>

        {/* Line Chart */}
        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="blueAreaGradientCI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="purpleAreaGradientCI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="greenAreaGradientCI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="blueLineGradientCI" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="purpleLineGradientCI" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="greenLineGradientCI" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="lineShadowCI" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
              </filter>
            </defs>

            {/* Background */}
            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {/* Grid lines */}
            {yAxisTicks.map((tick, i) => (
              <g key={i}>
                <line x1={chartPadding.left} y1={tick.y} x2={chartPadding.left + plotWidth} y2={tick.y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4,4"} />
                <text x={chartPadding.left - 12} y={tick.y + 4} textAnchor="end" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  {formatCurrency(tick.value)}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* Area fills */}
            <path d={generateAreaPath(yearlyData, 'totalValue')} fill="url(#greenAreaGradientCI)" />
            <path d={generateAreaPath(yearlyData, 'interestEarned')} fill="url(#purpleAreaGradientCI)" />
            <path d={generateAreaPath(yearlyData, 'totalContributed')} fill="url(#blueAreaGradientCI)" />

            {/* Lines */}
            <path d={generateLinePath(yearlyData, 'totalValue')} fill="none" stroke="url(#greenLineGradientCI)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowCI)" />
            <path d={generateLinePath(yearlyData, 'interestEarned')} fill="none" stroke="url(#purpleLineGradientCI)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowCI)" />
            <path d={generateLinePath(yearlyData, 'totalContributed')} fill="none" stroke="url(#blueLineGradientCI)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowCI)" />

            {/* Data points */}
            {yearlyData.map((_, i) => {
              const totalCoords = getPointCoords(i, 'totalValue');
              const interestCoords = getPointCoords(i, 'interestEarned');
              const contributedCoords = getPointCoords(i, 'totalContributed');
              const isHovered = hoveredYear === i;

              return (
                <g key={i}>
                  <circle cx={totalCoords.x} cy={totalCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#10b981" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                  <circle cx={interestCoords.x} cy={interestCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#8b5cf6" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                  <circle cx={contributedCoords.x} cy={contributedCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#3b82f6" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                </g>
              );
            })}

            {/* X-axis labels */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
              const showLabel = yearlyData.length <= 12 || i % Math.ceil(yearlyData.length / 10) === 0 || i === yearlyData.length - 1;
              return showLabel ? (
                <text key={i} x={x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  Year {d.year}
                </text>
              ) : null;
            })}

            {/* Hover areas */}
            {yearlyData.map((_, i) => {
              const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
              const width = plotWidth / yearlyData.length;
              return (
                <rect
                  key={i}
                  x={x - width / 2}
                  y={chartPadding.top}
                  width={width}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredYear(i)}
                  onMouseLeave={() => setHoveredYear(null)}
                />
              );
            })}

            {/* Hover line */}
            {hoveredYear !== null && (
              <line
                x1={chartPadding.left + (hoveredYear / (yearlyData.length - 1)) * plotWidth}
                y1={chartPadding.top}
                x2={chartPadding.left + (hoveredYear / (yearlyData.length - 1)) * plotWidth}
                y2={chartPadding.top + plotHeight}
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.6"
              />
            )}
          </svg>

          {/* Tooltip */}
          {hoveredYear !== null && yearlyData[hoveredYear] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-gray-100"
              style={{
                left: `calc(${((hoveredYear) / (yearlyData.length - 1)) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Year {yearlyData[hoveredYear].year}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
                  <span className="text-gray-600">Contributions:</span>
                  <span className="font-semibold text-blue-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].totalContributed)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></span>
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-semibold text-purple-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].interestEarned)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></span>
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-emerald-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].totalValue)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">Compare your current plan with alternative investment strategies</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-green-200 bg-green-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Plan</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.current.monthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.current.years} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.current.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-green-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Future Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-green-700">{formatCurrencyFull(scenarios.current.futureValue)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-blue-300 active:border-blue-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Contribution</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-blue-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+50%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.higher.monthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.higher.years} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.higher.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Future Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higher.futureValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-blue-600">+{formatCurrencyFull(scenarios.higher.diff)} more</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Longer Duration</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+5 yrs</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.longer.monthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.longer.years} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.longer.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Future Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.longer.futureValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-purple-600">+{formatCurrencyFull(scenarios.longer.diff)} more</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Increase Contributions</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Adding 50% more to your monthly contribution could grow your investment by {formatCurrencyFull(scenarios.higher.diff)} ({((scenarios.higher.diff / scenarios.current.futureValue) * 100).toFixed(1)}% more).
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Power of Time</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Investing for 5 more years adds {formatCurrencyFull(scenarios.longer.diff)} to your wealth ({((scenarios.longer.diff / scenarios.current.futureValue) * 100).toFixed(1)}% increase). Time is your biggest ally!
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Growth Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Growth Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Contribution</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Total Contributed</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Yr {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-blue-600">{formatCurrencyFull(row.contribution)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600 hidden xs:table-cell">{formatCurrencyFull(row.totalContributed)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-purple-600">{formatCurrencyFull(row.interestEarned)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-emerald-600">{formatCurrencyFull(row.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {yearlyData.length > 5 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing first 5 of {yearlyData.length} years
                </p>
              )}
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation"
              >
                {showFullSchedule ? 'Show Less' : 'Show Full Schedule'}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Related Investment Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-green-300 active:border-green-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-green-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-green-600 transition-colors leading-tight">
                  {calc.title}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 leading-tight">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6 prose prose-gray max-w-none">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">The Power of Compound Interest</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Compound interest is often called the &quot;eighth wonder of the world&quot; - and for good reason. Unlike simple interest which only earns returns on your principal,
          compound interest earns returns on both your principal AND your accumulated interest, creating exponential growth over time.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Principal Growth</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Your initial investment grows as interest compounds on itself</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Interest on Interest</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Earn returns not just on principal but on accumulated gains</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Exponential Growth</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">The longer you invest, the faster your money multiplies</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Compound Interest Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The compound interest calculator uses the following formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">A = P(1 + r/n)<sup>nt</sup></p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Where:</p>
            <p>A = Final Amount</p>
            <p>P = Principal (Initial Investment)</p>
            <p>r = Annual Interest Rate (decimal)</p>
            <p>n = Number of times compounded per year</p>
            <p>t = Time in years</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">How to Use This Calculator</h2>
            <ol className="list-decimal list-inside space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li>Enter your initial investment amount</li>
              <li>Add monthly contribution if applicable</li>
              <li>Set the expected annual interest rate</li>
              <li>Choose the investment time period</li>
              <li>Select compounding frequency</li>
            </ol>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Tips for Maximizing Returns</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Start investing as early as possible</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Reinvest all dividends and interest</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Make regular contributions consistently</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Choose higher compounding frequency</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Be patient - time amplifies returns</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Minimize fees that reduce compounding</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is the difference between simple and compound interest?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Simple interest is calculated only on the original principal amount, so you earn the same dollar amount each period.
              Compound interest is calculated on the principal plus all accumulated interest, meaning you earn &quot;interest on interest.&quot;
              Over time, this creates exponential growth. For example, $10,000 at 7% simple interest grows to $17,000 after 10 years,
              but the same amount at 7% compound interest grows to nearly $19,700 - a difference of $2,700 from compounding alone.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How does compounding frequency affect my returns?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              More frequent compounding leads to higher returns because interest is added to the principal more often, allowing
              subsequent interest calculations to include the newly added interest. For example, at 10% annual interest, $10,000
              compounded annually becomes $11,000 after one year. Compounded monthly, it becomes approximately $11,047. The difference
              grows substantially over longer periods. However, the marginal benefit decreases as frequency increases - daily vs.
              monthly makes less difference than monthly vs. annually.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is the Rule of 72 and how accurate is it?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              The Rule of 72 is a quick mental math shortcut to estimate how long it takes for an investment to double. Simply divide
              72 by your interest rate. At 8% annual return, your money doubles in approximately 9 years (72 / 8). The rule is most
              accurate for interest rates between 6% and 10%. At higher or lower rates, the approximation becomes less precise.
              For more accuracy with lower rates, use the Rule of 69 or 70 instead.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Should I invest a lump sum or make regular contributions?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Statistically, lump sum investing outperforms dollar-cost averaging about two-thirds of the time because markets
              generally trend upward. However, regular contributions offer psychological benefits by reducing the anxiety of market
              timing and the impact of short-term volatility. For most people, a combination works best: invest any lump sums you
              receive right away while maintaining consistent monthly contributions. This approach maximizes compounding time while
              building disciplined saving habits.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How do fees and taxes affect compound growth?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Fees and taxes are compound interest&apos;s worst enemies because they reduce the amount that compounds. A 1% annual fee
              might seem small, but over 30 years it can reduce your final balance by 25% or more. Similarly, taxes on dividends
              and gains slow compounding. This is why tax-advantaged accounts like 401(k)s and IRAs are so powerful - they allow
              your full returns to compound without annual tax drag. When possible, keep high-growth investments in tax-advantaged
              accounts and choose low-cost index funds to minimize fee impact.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="compound-interest-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
