'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface YearlyData {
  year: number;
  startBalance: number;
  contribution: number;
  interest: number;
  endBalance: number;
  totalContributions: number;
  totalInterest: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Investment Calculator?",
    answer: "A Investment Calculator is a free online tool that helps you calculate and analyze investment-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Investment Calculator?",
    answer: "Our Investment Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Investment Calculator free to use?",
    answer: "Yes, this Investment Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Investment calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to investment such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function InvestmentCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('investment-calculator');

  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [years, setYears] = useState(20);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const [results, setResults] = useState({
    futureValue: 0,
    totalContributions: 0,
    totalInterest: 0,
    finalBalance: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateInvestment = (init: number, monthly: number, rate: number, yrs: number) => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = yrs * 12;

    const fvPrincipal = init * Math.pow(1 + monthlyRate, totalMonths);
    let fvContributions = 0;
    if (monthlyRate > 0) {
      fvContributions = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else {
      fvContributions = monthly * totalMonths;
    }

    const totalContributions = init + (monthly * totalMonths);
    const finalBalance = fvPrincipal + fvContributions;
    const totalInterest = finalBalance - totalContributions;

    return { finalBalance, totalContributions, totalInterest };
  };

  useEffect(() => {
    const result = calculateInvestment(principal, monthlyContribution, annualReturn, years);
    setResults({
      futureValue: result.finalBalance,
      totalContributions: result.totalContributions,
      totalInterest: result.totalInterest,
      finalBalance: result.finalBalance
    });

    // Calculate year-by-year breakdown
    const yearly: YearlyData[] = [];
    let balance = principal;
    let totalContrib = principal;
    let totalInt = 0;
    const monthlyRate = annualReturn / 100 / 12;

    for (let yr = 1; yr <= years; yr++) {
      const startBalance = balance;
      let yearInterest = 0;
      const yearContribution = monthlyContribution * 12;

      for (let m = 0; m < 12; m++) {
        const monthInterest = balance * monthlyRate;
        yearInterest += monthInterest;
        balance += monthInterest + monthlyContribution;
      }

      totalContrib += yearContribution;
      totalInt += yearInterest;

      yearly.push({
        year: yr,
        startBalance,
        contribution: yearContribution,
        interest: yearInterest,
        endBalance: balance,
        totalContributions: totalContrib,
        totalInterest: totalInt
      });
    }

    setYearlyData(yearly);
  }, [principal, monthlyContribution, annualReturn, years]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateInvestment(principal, monthlyContribution, annualReturn, years);
    const moreContrib = calculateInvestment(principal, monthlyContribution + 200, annualReturn, years);
    const higherReturn = calculateInvestment(principal, monthlyContribution, annualReturn + 2, years);
    const longerTime = calculateInvestment(principal, monthlyContribution, annualReturn, years + 5);

    return {
      current,
      moreContrib: { ...moreContrib, diff: moreContrib.finalBalance - current.finalBalance },
      higherReturn: { ...higherReturn, diff: higherReturn.finalBalance - current.finalBalance },
      longerTime: { ...longerTime, diff: longerTime.finalBalance - current.finalBalance }
    };
  }, [principal, monthlyContribution, annualReturn, years]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return '$' + (amount / 1000000).toFixed(2) + 'M';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatCurrencyFull = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  // Donut chart for breakdown
  const contributionsPercent = results.finalBalance > 0 ? (results.totalContributions / results.finalBalance) * 100 : 0;
  const interestPercent = results.finalBalance > 0 ? (results.totalInterest / results.finalBalance) * 100 : 0;

  const segments = [
    { id: 'contributions', label: 'Contributions', value: results.totalContributions, percent: contributionsPercent, color: '#3B82F6' },
    { id: 'interest', label: 'Interest Earned', value: results.totalInterest, percent: interestPercent, color: '#10B981' },
  ];

  const radius = 70;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 30, right: 30, bottom: 50, left: 80 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate chart points
  const chartPoints = useMemo(() => {
    if (yearlyData.length === 0) return [];
    const maxBalance = yearlyData[yearlyData.length - 1]?.endBalance * 1.1 || 1;
    return yearlyData.map((d, i) => ({
      x: chartPadding.left + (i / (yearlyData.length - 1 || 1)) * plotWidth,
      y: chartPadding.top + plotHeight - (d.endBalance / maxBalance) * plotHeight,
      year: d.year,
      balance: d.endBalance,
      contributions: d.totalContributions,
      interest: d.totalInterest
    }));
  }, [yearlyData]);

  const maxChartBalance = yearlyData[yearlyData.length - 1]?.endBalance * 1.1 || 1;

  const linePath = chartPoints.length > 0
    ? `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  const areaPath = chartPoints.length > 0
    ? `M ${chartPoints[0].x} ${chartPadding.top + plotHeight} L ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartPoints[chartPoints.length - 1].x} ${chartPadding.top + plotHeight} Z`
    : '';

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound growth', icon: '📈' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan retirement savings', icon: '🏖️' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Plan your savings', icon: '🎯' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Calculate ROI', icon: '💹' },
    { href: '/us/tools/calculators/cagr-calculator', title: 'CAGR Calculator', description: 'Annual growth rate', icon: '📊' },
    { href: '/us/tools/calculators/dividend-yield-calculator', title: 'Dividend Yield', description: 'Calculate dividends', icon: '💰' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Adjust for inflation', icon: '📉' },
    { href: '/us/tools/calculators/fd-calculator', title: 'FD Calculator', description: 'Fixed deposit returns', icon: '🏦' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Investment Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate how your investments will grow over time with compound interest</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Inputs */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Investment Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Initial Investment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Monthly Contribution: {formatCurrency(monthlyContribution)}</label>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(parseFloat(e.target.value))}
                className="w-full h-2 sm:h-2.5 bg-green-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
              <div className="flex justify-between text-[10px] xs:text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$5,000</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Expected Annual Return: {annualReturn}%</label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                className="w-full h-2 sm:h-2.5 bg-blue-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
              <div className="flex justify-between text-[10px] xs:text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Investment Period: {years} years</label>
              <input
                type="range"
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full h-2 sm:h-2.5 bg-purple-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
              <div className="flex justify-between text-[10px] xs:text-xs text-gray-500 mt-1">
                <span>1 year</span>
                <span>50 years</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
              <h3 className="text-xs sm:text-sm font-semibold text-green-600 mb-2 sm:mb-3">Quick Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setMonthlyContribution(200); setYears(10); setAnnualReturn(6); }}
                  className="px-2 py-2 bg-white border border-green-200 rounded-lg text-xs font-medium text-green-700 hover:bg-green-100 active:bg-green-200 transition-colors touch-manipulation"
                >
                  Conservative
                </button>
                <button
                  onClick={() => { setMonthlyContribution(500); setYears(20); setAnnualReturn(7); }}
                  className="px-2 py-2 bg-white border border-green-200 rounded-lg text-xs font-medium text-green-700 hover:bg-green-100 active:bg-green-200 transition-colors touch-manipulation"
                >
                  Moderate
                </button>
                <button
                  onClick={() => { setMonthlyContribution(1000); setYears(30); setAnnualReturn(10); }}
                  className="px-2 py-2 bg-white border border-green-200 rounded-lg text-xs font-medium text-green-700 hover:bg-green-100 active:bg-green-200 transition-colors touch-manipulation"
                >
                  Aggressive
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Investment Growth</h2>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-green-600 mb-0.5 sm:mb-1">Future Value</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-green-700">{formatCurrency(results.finalBalance)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-green-600 mt-1">After {years} years at {annualReturn}% annual return</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Initial Investment:</span>
                <span className="font-semibold text-gray-800">{formatCurrency(principal)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Monthly Contributions:</span>
                <span className="font-semibold text-gray-800">{formatCurrency(monthlyContribution * years * 12)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Contributions:</span>
                <span className="font-semibold text-blue-600">{formatCurrency(results.totalContributions)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Interest Earned:</span>
                <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">ROI:</span>
                <span className="font-semibold text-purple-600">{results.totalContributions > 0 ? ((results.totalInterest / results.totalContributions) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 text-center">Investment Breakdown</h3>
              <div className="flex justify-center">
                <svg viewBox="0 0 180 180" className="w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44">
                  <defs>
                    <filter id="invGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  {(() => {
                    let offset = 0;
                    return segments.map((segment) => {
                      const dashArray = (segment.percent / 100) * circumference;
                      const currentOffset = offset;
                      offset -= dashArray;

                      return (
                        <g key={segment.id}>
                          {hoveredSegment === segment.id && (
                            <circle
                              cx="90" cy="90" r={radius}
                              fill="none" stroke={segment.color} strokeWidth={strokeWidth + 8}
                              strokeDasharray={`${dashArray} ${circumference}`}
                              strokeDashoffset={currentOffset}
                              opacity="0.2"
                              className="pointer-events-none"
                            />
                          )}
                          <circle
                            cx="90" cy="90" r={radius}
                            fill="none" stroke={segment.color}
                            strokeWidth={hoveredSegment === segment.id ? strokeWidth + 4 : strokeWidth}
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={currentOffset}
                            className="pointer-events-none transition-all duration-200"
                            style={{ opacity: hoveredSegment && hoveredSegment !== segment.id ? 0.5 : 1 }}
                            filter="url(#invGlow)"
                          />
                          <circle
                            cx="90" cy="90" r={radius}
                            fill="transparent" strokeWidth={strokeWidth + 10} stroke="transparent"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={currentOffset}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredSegment(segment.id)}
                            onMouseLeave={() => setHoveredSegment(null)}
                          />
                        </g>
                      );
                    });
                  })()}
                  <text x="90" y="85" textAnchor="middle" className="text-sm sm:text-base font-bold fill-gray-800">
                    {hoveredSegment ? formatCurrency(segments.find(s => s.id === hoveredSegment)?.value || 0) : formatCurrency(results.finalBalance)}
                  </text>
                  <text x="90" y="102" textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500">
                    {hoveredSegment ? segments.find(s => s.id === hoveredSegment)?.label : 'Total'}
                  </text>
                </svg>
              </div>
              <div className="flex justify-center gap-4 xs:gap-3 sm:gap-4 md:gap-6 mt-2">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className="flex items-center gap-1.5 cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(segment.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600">{segment.label} ({segment.percent.toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


      {/* Growth Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Investment Growth Over Time</h2>

        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Portfolio Value</span>
          </div>
        </div>

        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="invAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="invLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="invLineShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
              </filter>
            </defs>

            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              return (
                <g key={i}>
                  <line x1={chartPadding.left} y1={y} x2={chartPadding.left + plotWidth} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4,4"} />
                  <text x={chartPadding.left - 12} y={y + 4} textAnchor="end" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                    {formatCurrency(maxChartBalance * ratio)}
                  </text>
                </g>
              );
            })}

            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {areaPath && <path d={areaPath} fill="url(#invAreaGradient)" />}
            {linePath && <path d={linePath} fill="none" stroke="url(#invLineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#invLineShadow)" />}

            {chartPoints.map((point, i) => (
              <g key={i}>
                {hoveredYear === i && (
                  <circle cx={point.x} cy={point.y} r="14" fill="#10b981" opacity="0.15" className="pointer-events-none" />
                )}
                <circle
                  cx={point.x} cy={point.y}
                  r={hoveredYear === i ? 8 : 5}
                  fill="white" stroke="#10b981" strokeWidth="3"
                  className="pointer-events-none transition-all duration-200"
                />
                <circle
                  cx={point.x} cy={point.y} r="18"
                  fill="transparent" className="cursor-pointer"
                  onMouseEnter={() => setHoveredYear(i)}
                  onMouseLeave={() => setHoveredYear(null)}
                />
              </g>
            ))}

            {chartPoints.map((point, i) => {
              const showLabel = chartPoints.length <= 10 || i % Math.ceil(chartPoints.length / 8) === 0 || i === chartPoints.length - 1;
              return showLabel ? (
                <text key={i} x={point.x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  Yr {point.year}
                </text>
              ) : null;
            })}

            {hoveredYear !== null && chartPoints[hoveredYear] && (
              <line
                x1={chartPoints[hoveredYear].x}
                y1={chartPadding.top}
                x2={chartPoints[hoveredYear].x}
                y2={chartPadding.top + plotHeight}
                stroke="#10b981" strokeWidth="2" strokeDasharray="6,4" opacity="0.6"
              />
            )}
          </svg>

          {hoveredYear !== null && chartPoints[hoveredYear] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-gray-100"
              style={{
                left: `calc(${(hoveredYear / (chartPoints.length - 1 || 1)) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Year {chartPoints[hoveredYear].year}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-semibold text-green-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredYear].balance)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-600">Contributed:</span>
                  <span className="font-semibold text-blue-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredYear].contributions)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-semibold text-purple-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredYear].interest)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how changes affect your final balance</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          <div className="border-2 border-green-200 bg-green-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800 mb-2">Current Plan</div>
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-green-700">{formatCurrency(scenarios.current.finalBalance)}</div>
            <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-600 mt-1">${monthlyContribution}/mo • {years} years • {annualReturn}%</div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-blue-300 transition-colors">
            <div className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800 mb-2">+$200/month</div>
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-700">{formatCurrency(scenarios.moreContrib.finalBalance)}</div>
            <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600 mt-1">+{formatCurrency(scenarios.moreContrib.diff)} more</div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 transition-colors">
            <div className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800 mb-2">+2% Return</div>
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-700">{formatCurrency(scenarios.higherReturn.finalBalance)}</div>
            <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600 mt-1">+{formatCurrency(scenarios.higherReturn.diff)} more</div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-orange-300 transition-colors">
            <div className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800 mb-2">+5 Years</div>
            <div className="text-lg xs:text-xl sm:text-2xl font-bold text-orange-700">{formatCurrency(scenarios.longerTime.finalBalance)}</div>
            <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600 mt-1">+{formatCurrency(scenarios.longerTime.diff)} more</div>
          </div>
        </div>
      </div>
{/* Year-by-Year Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Breakdown</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Contributions</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">End Balance</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">{row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-blue-600">{formatCurrencyFull(row.totalContributions)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">{formatCurrencyFull(row.totalInterest)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-gray-800">{formatCurrencyFull(row.endBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {yearlyData.length > 5 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation"
              >
                {showFullSchedule ? 'Show Less' : `Show All ${yearlyData.length} Years`}
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Investment Growth</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Growing wealth through investing relies on two key principles: regular contributions and compound interest. By consistently investing
          money and allowing returns to compound over time, even modest monthly contributions can grow into substantial sums. The earlier you
          start, the more time your money has to grow exponentially.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Start Early</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Time in the market beats timing the market</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Stay Consistent</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Regular contributions compound significantly</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Reinvest Returns</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Let compound interest work its magic</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Investment Tips</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Maximize employer 401(k) match (free money!)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Diversify across asset classes</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Keep investment fees low (index funds)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Automate contributions (pay yourself first)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Don&apos;t panic sell during market dips</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Historical Returns</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>S&amp;P 500:</strong> ~10% average annual return</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Bonds:</strong> ~5-6% average return</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Real inflation-adjusted:</strong> ~7% for stocks</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>Past performance doesn&apos;t guarantee future</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How realistic is a 7% annual return?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              A 7% return is often used as a conservative estimate for long-term stock market investing, representing the historical
              inflation-adjusted return of the S&amp;P 500. Actual returns vary significantly year to year (ranging from -40% to +50%),
              but over 20+ year periods, the average tends to converge around 7-10%. However, past performance doesn&apos;t guarantee future results.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Should I invest a lump sum or dollar-cost average?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Statistically, lump sum investing beats dollar-cost averaging about 2/3 of the time because markets tend to go up over time.
              However, dollar-cost averaging (regular fixed investments) reduces the psychological risk of investing everything right before
              a downturn. For most people, automated monthly contributions work best as it removes emotion from the equation and builds
              consistent investing habits.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What&apos;s more important: higher contributions or starting earlier?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Starting earlier typically has a bigger impact due to compound interest. A 25-year-old investing $300/month until 65 will have
              more than a 35-year-old investing $600/month until 65, assuming the same returns. The extra decade of compounding outweighs
              double the contributions. However, the best strategy combines both: start as early as possible and increase contributions over time.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How do taxes affect my investment growth?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Taxes can significantly reduce returns. In taxable accounts, you&apos;ll pay capital gains taxes on profits and taxes on dividends
              annually. Tax-advantaged accounts like 401(k)s and IRAs let investments grow tax-deferred or tax-free. Prioritize maxing out
              tax-advantaged accounts first. For taxable accounts, hold investments over a year for lower long-term capital gains rates.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What if the market crashes right before I need the money?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              This is &quot;sequence of returns risk.&quot; As you approach your goal (like retirement), gradually shift to more conservative investments
              to protect against market volatility. A common strategy is holding 2-5 years of expenses in bonds or cash equivalents. This
              creates a buffer so you don&apos;t have to sell stocks at depressed prices during a downturn. Asset allocation should become more
              conservative as your time horizon shortens.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="investment-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
