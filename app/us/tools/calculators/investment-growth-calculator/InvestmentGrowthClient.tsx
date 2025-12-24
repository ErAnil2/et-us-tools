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
  contributions: number;
  growth: number;
  value: number;
  realValue: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Investment Growth Calculator?",
    answer: "A Investment Growth Calculator is a free online tool that helps you calculate and analyze investment growth-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Investment Growth Calculator?",
    answer: "Our Investment Growth Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Investment Growth Calculator free to use?",
    answer: "Yes, this Investment Growth Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Investment Growth calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to investment growth such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function InvestmentGrowthClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('investment-growth-calculator');

  const [initialAmount, setInitialAmount] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [investmentYears, setInvestmentYears] = useState(20);
  const [inflationRate, setInflationRate] = useState(3);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const [results, setResults] = useState({
    finalValue: 0,
    totalContributions: 0,
    totalGrowth: 0,
    realValue: 0,
    growthMultiple: 0,
    effectiveReturn: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateGrowth = (initial: number, monthly: number, rate: number, years: number, inflation: number) => {
    const monthlyRate = rate / 100 / 12;
    const inflationDecimal = inflation / 100;
    const totalMonths = years * 12;

    // Future value of initial investment
    const fvInitial = initial * Math.pow(1 + monthlyRate, totalMonths);

    // Future value of monthly contributions (annuity)
    let fvMonthly = 0;
    if (monthly > 0 && monthlyRate > 0) {
      fvMonthly = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else if (monthly > 0) {
      fvMonthly = monthly * totalMonths;
    }

    const finalValue = fvInitial + fvMonthly;
    const totalContributions = initial + (monthly * totalMonths);
    const totalGrowth = finalValue - totalContributions;
    const realValue = finalValue / Math.pow(1 + inflationDecimal, years);

    // Generate yearly breakdown
    const yearlyBreakdown: YearlyData[] = [];
    for (let year = 1; year <= years; year++) {
      const months = year * 12;
      const fvInit = initial * Math.pow(1 + monthlyRate, months);
      let fvMon = 0;
      if (monthly > 0 && monthlyRate > 0) {
        fvMon = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      } else if (monthly > 0) {
        fvMon = monthly * months;
      }
      const value = fvInit + fvMon;
      const contributions = initial + (monthly * months);
      const growth = value - contributions;
      const realVal = value / Math.pow(1 + inflationDecimal, year);

      yearlyBreakdown.push({
        year,
        contributions,
        growth,
        value,
        realValue: realVal
      });
    }

    return {
      finalValue,
      totalContributions,
      totalGrowth,
      realValue,
      growthMultiple: finalValue / totalContributions,
      effectiveReturn: ((Math.pow(finalValue / totalContributions, 1 / years) - 1) * 100),
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateGrowth(initialAmount, monthlyContribution, annualReturn, investmentYears, inflationRate);
    setResults({
      finalValue: result.finalValue,
      totalContributions: result.totalContributions,
      totalGrowth: result.totalGrowth,
      realValue: result.realValue,
      growthMultiple: result.growthMultiple,
      effectiveReturn: result.effectiveReturn
    });
    setYearlyData(result.yearlyBreakdown);
  }, [initialAmount, monthlyContribution, annualReturn, investmentYears, inflationRate]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateGrowth(initialAmount, monthlyContribution, annualReturn, investmentYears, inflationRate);
    const higherReturn = calculateGrowth(initialAmount, monthlyContribution, annualReturn + 2, investmentYears, inflationRate);
    const moreContribution = calculateGrowth(initialAmount, monthlyContribution + 200, annualReturn, investmentYears, inflationRate);

    return {
      current: { ...current, annualReturn, monthlyContribution },
      higherReturn: {
        ...higherReturn,
        annualReturn: annualReturn + 2,
        monthlyContribution,
        extraGrowth: higherReturn.finalValue - current.finalValue
      },
      moreContribution: {
        ...moreContribution,
        annualReturn,
        monthlyContribution: monthlyContribution + 200,
        extraGrowth: moreContribution.finalValue - current.finalValue
      }
    };
  }, [initialAmount, monthlyContribution, annualReturn, investmentYears, inflationRate]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2) + 'M';
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

  // SVG Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 30, right: 30, bottom: 50, left: 80 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate chart points
  const chartPoints = useMemo(() => {
    if (yearlyData.length === 0) return [];

    const maxValue = Math.max(...yearlyData.map(d => d.value)) * 1.1;
    const points: { x: number; y: number; yContrib: number; year: number; value: number; contributions: number; growth: number }[] = [];

    // Start point
    points.push({
      x: chartPadding.left,
      y: chartPadding.top + plotHeight - (initialAmount / maxValue) * plotHeight,
      yContrib: chartPadding.top + plotHeight - (initialAmount / maxValue) * plotHeight,
      year: 0,
      value: initialAmount,
      contributions: initialAmount,
      growth: 0
    });

    yearlyData.forEach((d, i) => {
      const x = chartPadding.left + ((i + 1) / investmentYears) * plotWidth;
      const y = chartPadding.top + plotHeight - (d.value / maxValue) * plotHeight;
      const yContrib = chartPadding.top + plotHeight - (d.contributions / maxValue) * plotHeight;
      points.push({
        x,
        y,
        yContrib,
        year: d.year,
        value: d.value,
        contributions: d.contributions,
        growth: d.growth
      });
    });

    return points;
  }, [yearlyData, initialAmount, investmentYears]);

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.value)) * 1.1 : initialAmount * 2;

  // Create paths
  const valuePath = chartPoints.length > 0
    ? `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  const contribPath = chartPoints.length > 0
    ? `M ${chartPoints.map(p => `${p.x} ${p.yContrib}`).join(' L ')}`
    : '';

  const areaPath = chartPoints.length > 0
    ? `M ${chartPoints[0].x} ${chartPadding.top + plotHeight} L ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartPoints[chartPoints.length - 1].x} ${chartPadding.top + plotHeight} Z`
    : '';

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💹' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound growth', icon: '📈' },
    { href: '/us/tools/calculators/lumpsum-calculator', title: 'Lumpsum Calculator', description: 'One-time investment', icon: '💰' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📊' },
    { href: '/us/tools/calculators/cagr-calculator', title: 'CAGR Calculator', description: 'Compound annual growth', icon: '📉' },
    { href: '/us/tools/calculators/fd-calculator', title: 'FD Calculator', description: 'Fixed deposit returns', icon: '🏦' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Adjust for inflation', icon: '💵' },
    { href: '/us/tools/calculators/apy-calculator', title: 'APY Calculator', description: 'Annual percentage yield', icon: '🌱' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Investment Growth Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Track your investment growth over time and visualize your path to financial goals</p>
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Initial Investment ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Monthly Contribution ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Expected Annual Return (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Historical S&P 500: ~10% | Balanced: ~7%</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Investment Period (Years)</label>
              <input
                type="number"
                value={investmentYears}
                onChange={(e) => setInvestmentYears(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Inflation Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Math.max(0, Math.min(15, parseFloat(e.target.value) || 0)))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
            </div>

            <div className="bg-rose-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-rose-600 mb-2 sm:mb-3 md:mb-4">Investment Strategy Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setAnnualReturn(5); setInitialAmount(10000); setMonthlyContribution(300); }}
                  className="px-2 py-2 bg-white border border-rose-200 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors touch-manipulation"
                >
                  Conservative (5%)
                </button>
                <button
                  onClick={() => { setAnnualReturn(7); setInitialAmount(15000); setMonthlyContribution(500); }}
                  className="px-2 py-2 bg-white border border-rose-200 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors touch-manipulation"
                >
                  Balanced (7%)
                </button>
                <button
                  onClick={() => { setAnnualReturn(10); setInitialAmount(20000); setMonthlyContribution(750); }}
                  className="px-2 py-2 bg-white border border-rose-200 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors touch-manipulation"
                >
                  Growth (10%)
                </button>
                <button
                  onClick={() => { setAnnualReturn(12); setInitialAmount(25000); setMonthlyContribution(1000); }}
                  className="px-2 py-2 bg-white border border-rose-200 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors touch-manipulation"
                >
                  Aggressive (12%)
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Investment Projection</h2>

            <div className="bg-rose-50 border border-rose-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-rose-600 mb-0.5 sm:mb-1">Final Portfolio Value</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-rose-700">{formatCurrencyFull(results.finalValue)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-rose-600 mt-1">After {investmentYears} years at {annualReturn}% p.a.</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Contributions:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(results.totalContributions)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Investment Growth:</span>
                <span className="font-semibold text-green-600">+{formatCurrencyFull(results.totalGrowth)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Real Value (Today's $):</span>
                <span className="font-semibold text-blue-600">{formatCurrencyFull(results.realValue)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Growth Multiple:</span>
                <span className="font-semibold text-rose-600">{results.growthMultiple.toFixed(2)}x</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Portfolio Composition</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Your Contributions</span>
                  <span className="font-medium">{((results.totalContributions / results.finalValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${(results.totalContributions / results.finalValue) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Investment Growth</span>
                  <span className="font-medium">{((results.totalGrowth / results.finalValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(results.totalGrowth / results.finalValue) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Return:</span>
                  <span className="font-medium">{annualReturn}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly:</span>
                  <span className="font-medium">{formatCurrency(monthlyContribution)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective CAGR:</span>
                  <span className="font-medium text-rose-600">{results.effectiveReturn.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{investmentYears} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Growth Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Portfolio Growth Over Time</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Portfolio Value</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Contributions</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="investAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#fb7185" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fecdd3" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="investLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
              <filter id="investGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="investShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
              </filter>
            </defs>

            {/* Background */}
            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {/* Y-axis grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              return (
                <g key={i}>
                  <line x1={chartPadding.left} y1={y} x2={chartPadding.left + plotWidth} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4,4"} />
                  <text x={chartPadding.left - 12} y={y + 4} textAnchor="end" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                    {formatCurrency(maxChartValue * ratio)}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* Area fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#investAreaGradient)"
                filter="url(#investShadow)"
              />
            )}

            {/* Contributions line */}
            {contribPath && (
              <path
                d={contribPath}
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeDasharray="6,4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Value line */}
            {valuePath && (
              <path
                d={valuePath}
                fill="none"
                stroke="url(#investLineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#investGlow)"
              />
            )}

            {/* Data points */}
            {chartPoints.map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === i ? 8 : 6}
                  fill="white"
                  stroke="#f43f5e"
                  strokeWidth="3"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  filter="url(#investGlow)"
                />
                {hoveredPoint === i && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill="#f43f5e"
                    opacity="0.2"
                    className="animate-pulse"
                  />
                )}
              </g>
            ))}

            {/* X-axis labels */}
            {chartPoints.filter((_, i) => i % Math.ceil(chartPoints.length / 10) === 0 || i === chartPoints.length - 1).map((point, i) => (
              <text
                key={i}
                x={point.x}
                y={chartPadding.top + plotHeight + 25}
                textAnchor="middle"
                className="text-[10px] sm:text-xs fill-gray-500 font-medium"
              >
                {point.year === 0 ? 'Start' : `Yr ${point.year}`}
              </text>
            ))}

            {/* Hover indicator line */}
            {hoveredPoint !== null && chartPoints[hoveredPoint] && (
              <line
                x1={chartPoints[hoveredPoint].x}
                y1={chartPadding.top}
                x2={chartPoints[hoveredPoint].x}
                y2={chartPadding.top + plotHeight}
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.5"
              />
            )}
          </svg>

          {/* Tooltip */}
          {hoveredPoint !== null && chartPoints[hoveredPoint] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-gray-100"
              style={{
                left: `calc(${(hoveredPoint / (chartPoints.length - 1)) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">
                {chartPoints[hoveredPoint].year === 0 ? 'Start' : `Year ${chartPoints[hoveredPoint].year}`}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-rose-400 to-rose-600 rounded-full"></span>
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold text-rose-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredPoint].value)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">Invested:</span>
                  <span className="font-semibold text-gray-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredPoint].contributions)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
                  <span className="text-gray-600">Growth:</span>
                  <span className="font-semibold text-green-600 ml-auto">+{formatCurrencyFull(chartPoints[hoveredPoint].growth)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how changing your investment strategy affects your final portfolio</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div
            className={`border-2 border-rose-200 bg-rose-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1 transition-transform duration-200 ${hoveredScenario === 'current' ? 'scale-[1.02]' : ''}`}
            onMouseEnter={() => setHoveredScenario('current')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Plan</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-rose-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Return:</span>
                <span className="font-medium">{annualReturn}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrency(monthlyContribution)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{investmentYears} years</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-rose-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-rose-700">{formatCurrencyFull(scenarios.current.finalValue)}</div>
            </div>
          </div>

          <div
            className={`border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-all duration-200 ${hoveredScenario === 'higherReturn' ? 'scale-[1.02] border-green-300' : ''}`}
            onMouseEnter={() => setHoveredScenario('higherReturn')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Return</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+2%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Return:</span>
                <span className="font-medium text-green-600">{annualReturn + 2}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrency(monthlyContribution)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{investmentYears} years</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higherReturn.finalValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.higherReturn.extraGrowth)} extra</div>
            </div>
          </div>

          <div
            className={`border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-all duration-200 ${hoveredScenario === 'moreContribution' ? 'scale-[1.02] border-purple-300' : ''}`}
            onMouseEnter={() => setHoveredScenario('moreContribution')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">More Monthly</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+$200</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Return:</span>
                <span className="font-medium">{annualReturn}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium text-purple-600">{formatCurrency(monthlyContribution + 200)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{investmentYears} years</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.moreContribution.finalValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.moreContribution.extraGrowth)} extra</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Higher Return Impact</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              A 2% higher return would grow your portfolio by {formatCurrencyFull(scenarios.higherReturn.extraGrowth)} more.
              Consider diversifying into growth-oriented investments.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Contribution Power</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Adding $200 more monthly would increase your final portfolio by {formatCurrencyFull(scenarios.moreContribution.extraGrowth)}.
              Small increases compound significantly over time.
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Growth Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Contributions</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Growth</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Year {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600">{formatCurrencyFull(row.contributions)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">+{formatCurrencyFull(row.growth)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-rose-600">{formatCurrencyFull(row.value)}</td>
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
      {/* Related Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-rose-300 active:border-rose-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-rose-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-rose-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Investment Growth</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Investment growth is driven by compound returns - your earnings generating additional earnings over time.
          This calculator helps you visualize how your initial investment and regular contributions can grow into significant wealth
          through the power of compounding.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-rose-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-rose-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Compound Growth</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Your returns earn returns, accelerating wealth accumulation</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Regular Contributions</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Consistent investing builds wealth through dollar-cost averaging</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Time Advantage</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Longer investment periods dramatically increase final value</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Investment Growth Formulas</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The calculator combines these formulas:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">Initial Growth: FV = P × (1 + r)<sup>n</sup></p>
          <p className="mb-2 xs:mb-3 sm:mb-4">Contributions: FV = PMT × [((1 + r)<sup>n</sup> - 1) / r]</p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Where:</p>
            <p>FV = Future Value</p>
            <p>P = Principal (Initial Investment)</p>
            <p>PMT = Monthly Contribution</p>
            <p>r = Monthly Rate (Annual Rate / 12)</p>
            <p>n = Number of months</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Keys to Investment Success</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-rose-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Start Early:</strong> Time is your greatest asset</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-rose-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Be Consistent:</strong> Regular contributions compound</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-rose-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Stay Invested:</strong> Ride out market volatility</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-rose-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Diversify:</strong> Spread risk across asset classes</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Investment Tips</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Maximize tax-advantaged accounts (401k, IRA)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Choose low-cost index funds</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Automate your investments</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Rebalance portfolio annually</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Increase contributions with raises</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Avoid emotional decisions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-4 xs:space-y-5">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base font-semibold text-gray-800 mb-2">What is compound growth and why is it so powerful?</h3>
            <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">
              Compound growth occurs when your investment earnings generate their own earnings. Instead of only earning returns on your original investment, you earn returns on your returns. Over long periods, this creates exponential growth. For example, $10,000 invested at 8% becomes $21,589 in 10 years, but $46,610 in 20 years and $100,627 in 30 years—the growth accelerates dramatically over time.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base font-semibold text-gray-800 mb-2">What return rate should I expect from my investments?</h3>
            <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">
              Historical returns vary by asset class. The S&amp;P 500 has averaged about 10% annually over the long term (before inflation). A balanced 60/40 stock/bond portfolio historically returns around 7-8%. Conservative bond portfolios return 4-5%. These are averages—actual returns vary significantly year to year, with some years seeing gains of 20%+ and others seeing losses of 30%+.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base font-semibold text-gray-800 mb-2">How much should I invest each month?</h3>
            <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">
              A common guideline is to save 15-20% of your income for retirement, including any employer match. Start with what you can afford—even $100/month adds up significantly over time. Focus first on getting any employer 401(k) match (that&apos;s free money), then build from there. Increase your contributions whenever you get a raise.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base font-semibold text-gray-800 mb-2">Why does the calculator show &quot;real value&quot; with inflation?</h3>
            <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">
              Inflation erodes purchasing power over time. A dollar today buys more than a dollar in 20 years. The &quot;real value&quot; shows what your future portfolio will be worth in today&apos;s dollars. If you&apos;ll have $1 million in 20 years but inflation averages 3%, that $1 million only has about $554,000 of today&apos;s purchasing power. This helps set realistic expectations for retirement planning.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-sm xs:text-base font-semibold text-gray-800 mb-2">Should I invest a lump sum or contribute monthly?</h3>
            <p className="text-xs xs:text-sm text-gray-600 leading-relaxed">
              Statistically, investing a lump sum immediately (if you have one) outperforms dollar-cost averaging about two-thirds of the time because markets tend to rise. However, regular monthly investing works better for most people&apos;s cash flow, reduces psychological stress, and helps avoid the risk of investing everything at a market peak. Both strategies work well for long-term investors.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="investment-growth-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
