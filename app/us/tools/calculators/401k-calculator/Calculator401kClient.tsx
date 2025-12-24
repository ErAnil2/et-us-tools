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
  age: number;
  contribution: number;
  employerMatch: number;
  totalContributed: number;
  interestEarned: number;
  totalValue: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a 401k Calculator?",
    answer: "A 401k Calculator is a free online tool designed to help you quickly and accurately calculate 401k-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this 401k Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this 401k Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this 401k Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function Calculator401kClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('401k-calculator');

  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [annualSalary, setAnnualSalary] = useState(80000);
  const [contributionPercentage, setContributionPercentage] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [matchPercentage, setMatchPercentage] = useState(50);
  const [matchLimit, setMatchLimit] = useState(6);
  const [salaryIncrease, setSalaryIncrease] = useState(3);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const [results, setResults] = useState({
    finalBalance: 0,
    employeeContributions: 0,
    employerContributions: 0,
    investmentGrowth: 0,
    purchasingPower: 0,
    employeePercent: 0,
    employerPercent: 0,
    growthPercent: 0,
    yearsToRetirement: 0,
    returnMultiple: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculate401k = (age: number, retireAge: number, balance: number, salary: number, contribPct: number, returnRate: number, matchPct: number, matchLim: number, salaryGrowth: number) => {
    const yearsToRetirement = retireAge - age;
    const isOver50 = age >= 50;
    const contributionLimit = isOver50 ? 31000 : 23500;
    const netReturn = returnRate / 100;
    const salaryGrowthRate = salaryGrowth / 100;

    let currentBal = balance;
    let totalEmployeeContributions = 0;
    let totalEmployerContributions = 0;
    let currentSalaryCalc = salary;
    const yearlyBreakdown: YearlyData[] = [];

    for (let year = 1; year <= yearsToRetirement; year++) {
      if (year > 1) {
        currentSalaryCalc *= (1 + salaryGrowthRate);
      }

      const desiredContribution = currentSalaryCalc * (contribPct / 100);
      const yearlyContribution = Math.min(desiredContribution, contributionLimit);
      const maxMatchableContribution = currentSalaryCalc * (matchLim / 100);
      const matchableContribution = Math.min(yearlyContribution, maxMatchableContribution);
      const yearlyMatch = matchableContribution * (matchPct / 100);

      currentBal += yearlyContribution + yearlyMatch;
      totalEmployeeContributions += yearlyContribution;
      totalEmployerContributions += yearlyMatch;
      currentBal *= (1 + netReturn);

      yearlyBreakdown.push({
        year,
        age: age + year,
        contribution: yearlyContribution,
        employerMatch: yearlyMatch,
        totalContributed: totalEmployeeContributions + totalEmployerContributions + balance,
        interestEarned: currentBal - totalEmployeeContributions - totalEmployerContributions - balance,
        totalValue: currentBal
      });
    }

    const totalContributions = totalEmployeeContributions + totalEmployerContributions;
    const investmentGrowth = currentBal - totalContributions - balance;

    return {
      finalBalance: currentBal,
      employeeContributions: totalEmployeeContributions,
      employerContributions: totalEmployerContributions,
      investmentGrowth,
      totalContributions,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculate401k(currentAge, retirementAge, currentBalance, annualSalary, contributionPercentage, annualReturn, matchPercentage, matchLimit, salaryIncrease);

    const total = result.employeeContributions + result.employerContributions + result.investmentGrowth + currentBalance;
    const inflationRate = 0.03;
    const yearsToRetirement = retirementAge - currentAge;
    const purchasingPower = result.finalBalance / Math.pow(1 + inflationRate, yearsToRetirement);

    setResults({
      finalBalance: result.finalBalance,
      employeeContributions: result.employeeContributions,
      employerContributions: result.employerContributions,
      investmentGrowth: result.investmentGrowth,
      purchasingPower,
      employeePercent: (result.employeeContributions / total) * 100,
      employerPercent: (result.employerContributions / total) * 100,
      growthPercent: (result.investmentGrowth / total) * 100,
      yearsToRetirement,
      returnMultiple: result.finalBalance / (result.employeeContributions + result.employerContributions + currentBalance)
    });

    setYearlyData(result.yearlyBreakdown);
  }, [currentAge, retirementAge, currentBalance, annualSalary, contributionPercentage, annualReturn, matchPercentage, matchLimit, salaryIncrease]);

  const scenarios = useMemo(() => {
    const current = calculate401k(currentAge, retirementAge, currentBalance, annualSalary, contributionPercentage, annualReturn, matchPercentage, matchLimit, salaryIncrease);
    const higherContrib = calculate401k(currentAge, retirementAge, currentBalance, annualSalary, Math.min(contributionPercentage + 5, 50), annualReturn, matchPercentage, matchLimit, salaryIncrease);
    const longerDuration = calculate401k(currentAge, retirementAge + 3, currentBalance, annualSalary, contributionPercentage, annualReturn, matchPercentage, matchLimit, salaryIncrease);

    return {
      current: { ...current, contribPct: contributionPercentage, retireAge: retirementAge },
      higher: {
        ...higherContrib,
        contribPct: Math.min(contributionPercentage + 5, 50),
        retireAge: retirementAge,
        diff: higherContrib.finalBalance - current.finalBalance
      },
      longer: {
        ...longerDuration,
        contribPct: contributionPercentage,
        retireAge: retirementAge + 3,
        diff: longerDuration.finalBalance - current.finalBalance
      }
    };
  }, [currentAge, retirementAge, currentBalance, annualSalary, contributionPercentage, annualReturn, matchPercentage, matchLimit, salaryIncrease]);

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
  const scenarioMax = Math.max(scenarios.current.finalBalance, scenarios.higher.finalBalance, scenarios.longer.finalBalance) * 1.1;

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

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Calculate systematic investment returns', icon: '📈' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest growth', icon: '💹' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🎯' },
    { href: '/us/tools/calculators/investment-calculator', title: 'Investment Calculator', description: 'Calculate investment growth', icon: '📊' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment', icon: '💰' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Calculate inflation impact', icon: '📉' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Track savings progress', icon: '🎪' },
    { href: '/us/tools/calculators/simple-interest-calculator', title: 'Simple Interest', description: 'Calculate simple interest', icon: '🏦' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-lg sm:text-xl md:text-2xl md:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('401(k) Retirement Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate your 401(k) growth potential with employer matching, contribution limits, and comprehensive retirement projections</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 sm:gap-5 md:gap-6">
          {/* Left: Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">401(k) Planning Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Math.max(18, parseInt(e.target.value) || 18))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
                min="18"
                max="75"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Math.max(currentAge + 1, parseInt(e.target.value) || 65))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
                min="50"
                max="80"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Current 401(k) Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Annual Salary</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(Math.max(1000, parseInt(e.target.value) || 1000))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Your Contribution (%)</label>
              <input
                type="number"
                value={contributionPercentage}
                onChange={(e) => setContributionPercentage(Math.min(50, Math.max(0, parseFloat(e.target.value) || 0)))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                inputMode="decimal"
                step="0.5"
              />
            </div>

            <div className="bg-teal-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-blue-600 mb-2 sm:mb-3 md:mb-4">401(k) Assumptions</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-blue-600 mb-1.5 sm:mb-2">Annual Return (%)</label>
                    <input
                      type="number"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation bg-white"
                      inputMode="decimal"
                      step="0.25"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-blue-600 mb-1.5 sm:mb-2">Employer Match (%)</label>
                    <input
                      type="number"
                      value={matchPercentage}
                      onChange={(e) => setMatchPercentage(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation bg-white"
                      inputMode="decimal"
                      step="25"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-blue-600 mb-1.5 sm:mb-2">Match Limit (% Salary)</label>
                    <input
                      type="number"
                      value={matchLimit}
                      onChange={(e) => setMatchLimit(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation bg-white"
                      inputMode="decimal"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-blue-600 mb-1.5 sm:mb-2">Salary Increase (%)</label>
                    <input
                      type="number"
                      value={salaryIncrease}
                      onChange={(e) => setSalaryIncrease(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation bg-white"
                      inputMode="decimal"
                      step="0.25"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate 401(k) Growth
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Retirement Projection</h2>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-emerald-600 mb-0.5 sm:mb-1">Projected 401(k) Balance at Retirement</div>
              <div className="text-xl xs:text-lg sm:text-xl md:text-2xl md:text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-700">{formatCurrencyFull(results.finalBalance)}</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Your Contributions:</span>
                <span className="font-semibold text-blue-600">{formatCurrencyFull(results.employeeContributions)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Employer Match:</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(results.employerContributions)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Investment Growth:</span>
                <span className="font-semibold text-purple-600">{formatCurrencyFull(results.investmentGrowth)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Purchasing Power (Today&apos;s $):</span>
                <span className="font-semibold text-orange-600">{formatCurrencyFull(results.purchasingPower)}</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Balance Composition</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Your Contributions</span>
                  <span className="font-medium">{results.employeePercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${results.employeePercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Employer Match</span>
                  <span className="font-medium">{results.employerPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${results.employerPercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Investment Growth</span>
                  <span className="font-medium">{results.growthPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${results.growthPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Insights</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Years to retire:</span>
                  <span className="font-medium">{results.yearsToRetirement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual return:</span>
                  <span className="font-medium">{annualReturn}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Return multiple:</span>
                  <span className="font-medium">{results.returnMultiple.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Free money (match):</span>
                  <span className="font-medium text-green-600">{formatCurrency(results.employerContributions)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* 401(k) Growth Visualization - Line Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">401(k) Growth Visualization</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Contributed</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Interest Earned</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-violet-400 to-violet-600 shadow-sm"></div>
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
            {/* Enhanced gradients */}
            <defs>
              <linearGradient id="blueAreaGradient401k" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="greenAreaGradient401k" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="purpleAreaGradient401k" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="blueLineGradient401k" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="greenLineGradient401k" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="purpleLineGradient401k" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="lineShadow401k" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
              </filter>
              <filter id="pointGlow401k" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background pattern */}
            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {/* Grid lines */}
            {yAxisTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={chartPadding.left}
                  y1={tick.y}
                  x2={chartPadding.left + plotWidth}
                  y2={tick.y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? "0" : "4,4"}
                />
                <text
                  x={chartPadding.left - 12}
                  y={tick.y + 4}
                  textAnchor="end"
                  className="text-[10px] sm:text-xs fill-gray-500 font-medium"
                >
                  {formatCurrency(tick.value)}
                </text>
              </g>
            ))}

            {/* Y-axis */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top}
              x2={chartPadding.left}
              y2={chartPadding.top + plotHeight}
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* X-axis */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top + plotHeight}
              x2={chartPadding.left + plotWidth}
              y2={chartPadding.top + plotHeight}
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Area fills */}
            <path d={generateAreaPath(yearlyData, 'totalValue')} fill="url(#purpleAreaGradient401k)" />
            <path d={generateAreaPath(yearlyData, 'interestEarned')} fill="url(#greenAreaGradient401k)" />
            <path d={generateAreaPath(yearlyData, 'totalContributed')} fill="url(#blueAreaGradient401k)" />

            {/* Lines */}
            <path
              d={generateLinePath(yearlyData, 'totalValue')}
              fill="none"
              stroke="url(#purpleLineGradient401k)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lineShadow401k)"
            />
            <path
              d={generateLinePath(yearlyData, 'interestEarned')}
              fill="none"
              stroke="url(#greenLineGradient401k)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lineShadow401k)"
            />
            <path
              d={generateLinePath(yearlyData, 'totalContributed')}
              fill="none"
              stroke="url(#blueLineGradient401k)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lineShadow401k)"
            />

            {/* Data points */}
            {yearlyData.map((_, i) => {
              const totalCoords = getPointCoords(i, 'totalValue');
              const interestCoords = getPointCoords(i, 'interestEarned');
              const contributedCoords = getPointCoords(i, 'totalContributed');
              const isHovered = hoveredYear === i;
              const showPoint = yearlyData.length <= 15 || i % Math.ceil(yearlyData.length / 15) === 0 || i === yearlyData.length - 1;

              if (!showPoint && !isHovered) return null;

              return (
                <g key={i} filter={isHovered ? "url(#pointGlow401k)" : undefined}>
                  <circle cx={totalCoords.x} cy={totalCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#8b5cf6" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                  <circle cx={interestCoords.x} cy={interestCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#10b981" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                  <circle cx={contributedCoords.x} cy={contributedCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#3b82f6" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                </g>
              );
            })}

            {/* X-axis labels */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
              const showLabel = yearlyData.length <= 12 || i % Math.ceil(yearlyData.length / 10) === 0 || i === yearlyData.length - 1;
              return showLabel ? (
                <text
                  key={i}
                  x={x}
                  y={chartPadding.top + plotHeight + 25}
                  textAnchor="middle"
                  className="text-[10px] sm:text-xs fill-gray-500 font-medium"
                >
                  Age {d.age}
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

            {/* Vertical hover line */}
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
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Age {yearlyData[hoveredYear].age}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
                  <span className="text-gray-600">Contributed:</span>
                  <span className="font-semibold text-blue-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].totalContributed)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></span>
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-semibold text-emerald-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].interestEarned)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-violet-400 to-violet-600 rounded-full"></span>
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-violet-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].totalValue)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">Compare your current 401(k) plan with alternative scenarios to maximize your retirement savings</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Plan</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-blue-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Contribution:</span>
                <span className="font-medium">{scenarios.current.contribPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retire at:</span>
                <span className="font-medium">{scenarios.current.retireAge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return:</span>
                <span className="font-medium">{annualReturn}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-blue-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Total Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-blue-700">{formatCurrencyFull(scenarios.current.finalBalance)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Contribution</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+5%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Contribution:</span>
                <span className="font-medium">{scenarios.higher.contribPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retire at:</span>
                <span className="font-medium">{scenarios.higher.retireAge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return:</span>
                <span className="font-medium">{annualReturn}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Total Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higher.finalBalance)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.higher.diff)} more</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Delay Retirement</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+3 yrs</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Contribution:</span>
                <span className="font-medium">{scenarios.longer.contribPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retire at:</span>
                <span className="font-medium">{scenarios.longer.retireAge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return:</span>
                <span className="font-medium">{annualReturn}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Total Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.longer.finalBalance)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.longer.diff)} more</div>
            </div>
          </div>
        </div>

        {/* Scenario Comparison Column Chart */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2 sm:mb-3 md:mb-4">Scenario Comparison</h3>

          <div className="flex justify-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 xs:w-4 sm:w-5 h-2.5 xs:h-3 sm:h-4 bg-gradient-to-t from-blue-600 to-blue-400 shadow-sm"></div>
              <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Contributions</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 xs:w-4 sm:w-5 h-2.5 xs:h-3 sm:h-4 bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm"></div>
              <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Investment Growth</span>
            </div>
          </div>

          {/* Column Chart SVG */}
          <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
            <svg viewBox="0 0 600 280" className="w-full h-auto min-w-[300px] sm:min-w-[350px] md:min-w-[400px]" style={{ maxHeight: '280px' }} preserveAspectRatio="xMidYMid meet">
              {/* Gradients */}
              <defs>
                <linearGradient id="blueBarGradient401k" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="greenBarGradient401k" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#047857" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <filter id="barShadow401k" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.2"/>
                </filter>
                <filter id="barHoverShadow401k" x="-15%" y="-15%" width="130%" height="140%">
                  <feDropShadow dx="3" dy="4" stdDeviation="4" floodOpacity="0.3"/>
                </filter>
              </defs>

              {/* Background */}
              <rect x="80" y="40" width="470" height="180" fill="white" opacity="0.7"/>

              {/* Y-axis grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = 220 - ratio * 180;
                return (
                  <g key={i}>
                    <line x1="80" y1={y} x2="550" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4,4"} />
                    <text x="70" y={y + 4} textAnchor="end" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                      {formatCurrency(scenarioMax * ratio)}
                    </text>
                  </g>
                );
              })}

              {/* Axes */}
              <line x1="80" y1="40" x2="80" y2="220" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
              <line x1="80" y1="220" x2="550" y2="220" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              {/* Current Plan Column */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredScenario('current')}
                onMouseLeave={() => setHoveredScenario(null)}
                filter={hoveredScenario === 'current' ? "url(#barHoverShadow401k)" : "url(#barShadow401k)"}
              >
                <rect
                  x="120"
                  y={220 - ((scenarios.current.totalContributions + currentBalance) / scenarioMax) * 180}
                  width="60"
                  height={((scenarios.current.totalContributions + currentBalance) / scenarioMax) * 180}
                  fill="url(#blueBarGradient401k)"
                />
                <rect
                  x="120"
                  y={220 - (scenarios.current.finalBalance / scenarioMax) * 180}
                  width="60"
                  height={(scenarios.current.investmentGrowth / scenarioMax) * 180}
                  fill="url(#greenBarGradient401k)"
                />
                {hoveredScenario === 'current' && (
                  <g>
                    <rect x="100" y={220 - (scenarios.current.finalBalance / scenarioMax) * 180 - 35} width="100" height="28" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
                    <text x="150" y={220 - (scenarios.current.finalBalance / scenarioMax) * 180 - 16} textAnchor="middle" className="text-xs fill-gray-800 font-bold">
                      {formatCurrencyFull(scenarios.current.finalBalance)}
                    </text>
                  </g>
                )}
              </g>

              {/* Higher Contribution Column */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredScenario('higher')}
                onMouseLeave={() => setHoveredScenario(null)}
                filter={hoveredScenario === 'higher' ? "url(#barHoverShadow401k)" : "url(#barShadow401k)"}
              >
                <rect
                  x="270"
                  y={220 - ((scenarios.higher.totalContributions + currentBalance) / scenarioMax) * 180}
                  width="60"
                  height={((scenarios.higher.totalContributions + currentBalance) / scenarioMax) * 180}
                  fill="url(#blueBarGradient401k)"
                />
                <rect
                  x="270"
                  y={220 - (scenarios.higher.finalBalance / scenarioMax) * 180}
                  width="60"
                  height={(scenarios.higher.investmentGrowth / scenarioMax) * 180}
                  fill="url(#greenBarGradient401k)"
                />
                {hoveredScenario === 'higher' && (
                  <g>
                    <rect x="250" y={220 - (scenarios.higher.finalBalance / scenarioMax) * 180 - 35} width="100" height="28" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
                    <text x="300" y={220 - (scenarios.higher.finalBalance / scenarioMax) * 180 - 16} textAnchor="middle" className="text-xs fill-gray-800 font-bold">
                      {formatCurrencyFull(scenarios.higher.finalBalance)}
                    </text>
                  </g>
                )}
              </g>

              {/* Delay Retirement Column */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredScenario('longer')}
                onMouseLeave={() => setHoveredScenario(null)}
                filter={hoveredScenario === 'longer' ? "url(#barHoverShadow401k)" : "url(#barShadow401k)"}
              >
                <rect
                  x="420"
                  y={220 - ((scenarios.longer.totalContributions + currentBalance) / scenarioMax) * 180}
                  width="60"
                  height={((scenarios.longer.totalContributions + currentBalance) / scenarioMax) * 180}
                  fill="url(#blueBarGradient401k)"
                />
                <rect
                  x="420"
                  y={220 - (scenarios.longer.finalBalance / scenarioMax) * 180}
                  width="60"
                  height={(scenarios.longer.investmentGrowth / scenarioMax) * 180}
                  fill="url(#greenBarGradient401k)"
                />
                {hoveredScenario === 'longer' && (
                  <g>
                    <rect x="400" y={220 - (scenarios.longer.finalBalance / scenarioMax) * 180 - 35} width="100" height="28" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
                    <text x="450" y={220 - (scenarios.longer.finalBalance / scenarioMax) * 180 - 16} textAnchor="middle" className="text-xs fill-gray-800 font-bold">
                      {formatCurrencyFull(scenarios.longer.finalBalance)}
                    </text>
                  </g>
                )}
              </g>

              {/* X-axis labels */}
              <text x="150" y="242" textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-700 font-semibold">Current Plan</text>
              <text x="300" y="242" textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-700 font-semibold">Higher Contribution</text>
              <text x="300" y="258" textAnchor="middle" className="text-[10px] sm:text-xs fill-emerald-600 font-medium">(+5%)</text>
              <text x="450" y="242" textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-700 font-semibold">Delay Retirement</text>
              <text x="450" y="258" textAnchor="middle" className="text-[10px] sm:text-xs fill-violet-600 font-medium">(+3 yrs)</text>
            </svg>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Impact of Higher Contribution</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Increasing your contribution by 5% could result in {formatCurrencyFull(scenarios.higher.diff)} more
              ({((scenarios.higher.diff / scenarios.current.finalBalance) * 100).toFixed(1)}% increase) at retirement.
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
              Working 3 additional years could result in {formatCurrencyFull(scenarios.longer.diff)} more
              ({((scenarios.longer.diff / scenarios.current.finalBalance) * 100).toFixed(1)}% increase), demonstrating the power of compounding.
            </p>
          </div>
        </div>
      </div>
{/* Year-by-Year Accumulation Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Accumulation Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[450px] sm:min-w-[550px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Age</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Your Contrib.</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Employer Match</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">{row.age}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-blue-600">{formatCurrencyFull(row.contribution)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600 hidden xs:table-cell">{formatCurrencyFull(row.employerMatch)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-purple-600">{formatCurrencyFull(row.interestEarned)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-gray-800">{formatCurrencyFull(row.totalValue)}</td>
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

      {/* Related Finance Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 xs:mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-blue-300 active:border-blue-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                  {calc.title}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 leading-tight">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 xs:mb-4 sm:mb-4 md:mb-6 prose prose-gray max-w-none">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding 401(k) Retirement Plans</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          A 401(k) is an employer-sponsored retirement savings plan that allows employees to save and invest a portion of their paycheck before taxes are taken out. Named after a section of the Internal Revenue Code, this powerful retirement vehicle has become the cornerstone of American retirement planning since its introduction in 1978.
        </p>

        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          The beauty of a 401(k) lies in its dual tax advantages. Traditional 401(k) contributions are made with pre-tax dollars, immediately reducing your taxable income. Your investments then grow tax-deferred until withdrawal in retirement. For those who prefer to pay taxes upfront, Roth 401(k) options allow after-tax contributions that grow completely tax-free, with qualified withdrawals incurring no additional taxes.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-4 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Tax Advantages</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Contributions reduce taxable income; investments grow tax-deferred until retirement</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Employer Match</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Free money from your employer that can double your contribution impact</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Compound Growth</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Long-term investing maximizes the exponential power of compounding returns</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">How 401(k) Employer Matching Works</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Employer matching is essentially free money added to your retirement savings. Common matching formulas include 50% match up to 6% of salary or dollar-for-dollar match up to 3-4%. For example, if you earn $80,000 and your employer matches 50% up to 6%, contributing 6% ($4,800) earns you an additional $2,400 from your employer annually. Over a 30-year career with 7% returns, that employer match alone could grow to over $200,000.
        </p>

        <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 mb-4 xs:mb-4 sm:mb-4 md:mb-6">
          <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-blue-900 mb-2 xs:mb-3">2025 401(k) Contribution Limits</h3>
          <ul className="text-[10px] xs:text-xs sm:text-sm text-blue-800 list-disc pl-4 space-y-1">
            <li>Employee contribution limit: $23,500 (increased from $23,000 in 2024)</li>
            <li>Catch-up contribution (age 50+): Additional $7,500 (total $31,000)</li>
            <li>Super catch-up (ages 60-63): Additional $11,250 (total $34,750)</li>
            <li>Total contribution limit (employee + employer): $70,000</li>
            <li>Total with catch-up (age 50+): $77,500</li>
          </ul>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Traditional vs. Roth 401(k)</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Choosing between Traditional and Roth 401(k) depends on your current and expected future tax brackets. Traditional contributions make sense if you expect to be in a lower tax bracket during retirement, while Roth contributions benefit those who expect higher future taxes or want tax-free retirement income. Many financial advisors recommend contributing to both for tax diversification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-4 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">How to Use This Calculator</h2>
            <ol className="list-decimal list-inside space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li>Enter your current age and desired retirement age</li>
              <li>Input your current 401(k) balance and annual salary</li>
              <li>Set your contribution percentage (aim for at least employer match)</li>
              <li>Adjust employer match details to reflect your plan</li>
              <li>Set expected annual return (historical average is 7-10%)</li>
              <li>Include expected salary increases for accuracy</li>
            </ol>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Benefits of 401(k) Plans</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Pre-tax contributions immediately lower your tax bill</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Employer matching provides 50-100% instant returns</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Automatic payroll deductions build consistent savings habits</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Higher contribution limits than IRAs ($23,500 vs $7,000)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Assets are protected from creditors and bankruptcy</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Loan provisions allow borrowing against your balance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5 sm:space-y-4 md:space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How much should I contribute to my 401(k)?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Financial experts recommend contributing at least enough to capture your full employer match, as this is essentially free money with an immediate 50-100% return. Beyond that, aim for 10-15% of your gross income including employer contributions. If you start investing in your 20s, saving 10-12% should put you on track for a comfortable retirement. Starting later may require higher contribution rates to catch up.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What happens to my 401(k) if I change jobs?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              You have several options when leaving an employer. You can leave the funds in your former employer&apos;s plan (if permitted), roll them over to your new employer&apos;s 401(k), roll them into an IRA for more investment choices, or cash out (not recommended due to taxes and penalties). A direct rollover to an IRA or new 401(k) maintains tax-deferred status and avoids the 10% early withdrawal penalty.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">When can I withdraw from my 401(k) without penalties?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Penalty-free withdrawals are generally available at age 59½. However, the &quot;Rule of 55&quot; allows penalty-free withdrawals if you leave your job during or after the year you turn 55. Required Minimum Distributions (RMDs) must begin at age 73 (previously 72). Early withdrawals before 59½ incur a 10% penalty plus income taxes, though exceptions exist for hardship, disability, or substantially equal periodic payments.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Should I choose Traditional or Roth 401(k) contributions?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Traditional contributions make sense if you expect to be in a lower tax bracket in retirement or want to reduce current taxes. Roth contributions are better if you expect higher future tax rates, are early in your career with lower current income, or want tax-free retirement income. Many advisors recommend splitting contributions between both for tax diversification, giving you flexibility in retirement to manage your tax liability.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Can I take a loan from my 401(k)?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Most 401(k) plans allow loans up to 50% of your vested balance or $50,000, whichever is less. You repay the loan with interest (typically prime rate plus 1-2%) to yourself. However, 401(k) loans have risks: if you leave your job, the full balance may be due immediately, and any unpaid amount becomes a taxable distribution with potential penalties. Additionally, borrowed funds miss out on market returns during the repayment period.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="401k-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
