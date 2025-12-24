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
  value: number;
  inflationRate: number;
  cumulativeInflation: number;
  purchasingPower: number;
}

// Historical inflation rates (US CPI data)
const historicalRates: { [key: number]: number } = {
  1980: 13.5, 1981: 10.3, 1982: 6.1, 1983: 3.2, 1984: 4.3, 1985: 3.6, 1986: 1.9, 1987: 3.6, 1988: 4.1, 1989: 4.8,
  1990: 5.4, 1991: 4.2, 1992: 3.0, 1993: 3.0, 1994: 2.6, 1995: 2.8, 1996: 3.0, 1997: 2.3, 1998: 1.6, 1999: 2.2,
  2000: 3.4, 2001: 2.8, 2002: 1.6, 2003: 2.3, 2004: 2.7, 2005: 3.4, 2006: 3.2, 2007: 2.8, 2008: 3.8, 2009: -0.4,
  2010: 1.6, 2011: 3.1, 2012: 2.1, 2013: 1.5, 2014: 0.1, 2015: 0.1, 2016: 1.3, 2017: 2.1, 2018: 2.4, 2019: 1.8,
  2020: 1.2, 2021: 4.7, 2022: 8.0, 2023: 4.1, 2024: 3.5
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Inflation Calculator?",
    answer: "A Inflation Calculator is a free online tool designed to help you quickly and accurately calculate inflation-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Inflation Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Inflation Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Inflation Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function InflationCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('inflation-calculator');

  const [initialAmount, setInitialAmount] = useState(1000);
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2024);
  const [customRate, setCustomRate] = useState('');
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const [results, setResults] = useState({
    finalAmount: 0,
    totalInflation: 0,
    avgRate: 0,
    years: 0,
    purchasingPowerLost: 0,
    multiplier: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const getAverageInflationRate = (start: number, end: number): number => {
    let totalRate = 0;
    let yearCount = 0;
    for (let year = start; year < end; year++) {
      if (historicalRates[year] !== undefined) {
        totalRate += historicalRates[year];
        yearCount++;
      }
    }
    return yearCount > 0 ? totalRate / yearCount : 3.2;
  };

  const calculateInflation = (amount: number, start: number, end: number, rate?: number) => {
    if (amount <= 0 || start <= 0 || end <= 0 || end <= start) {
      return { finalAmount: 0, totalInflation: 0, avgRate: 0, multiplier: 1 };
    }

    const useRate = rate !== undefined ? rate : getAverageInflationRate(start, end);
    const yearsDiff = end - start;
    const multiplier = Math.pow(1 + (useRate / 100), yearsDiff);
    const finalAmount = amount * multiplier;
    const totalInflation = (multiplier - 1) * 100;

    return { finalAmount, totalInflation, avgRate: useRate, multiplier };
  };

  useEffect(() => {
    const rate = customRate ? parseFloat(customRate) : undefined;
    const result = calculateInflation(initialAmount, startYear, endYear, rate);
    const yearsDiff = endYear - startYear;
    const purchasingPowerLost = result.multiplier > 0 ? (1 - (1 / result.multiplier)) * 100 : 0;

    setResults({
      finalAmount: result.finalAmount,
      totalInflation: result.totalInflation,
      avgRate: result.avgRate,
      years: yearsDiff,
      purchasingPowerLost,
      multiplier: result.multiplier
    });

    // Generate year-by-year data
    const data: YearlyData[] = [];
    let currentValue = initialAmount;
    let cumulativeInflation = 0;

    for (let year = startYear; year <= endYear; year++) {
      const yearRate = customRate ? parseFloat(customRate) : (historicalRates[year] || 3.2);
      if (year > startYear) {
        currentValue = currentValue * (1 + yearRate / 100);
        cumulativeInflation = ((currentValue / initialAmount) - 1) * 100;
      }
      const purchasingPower = (initialAmount / currentValue) * 100;

      data.push({
        year,
        value: currentValue,
        inflationRate: year === startYear ? 0 : yearRate,
        cumulativeInflation,
        purchasingPower
      });
    }

    setYearlyData(data);
  }, [initialAmount, startYear, endYear, customRate]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const rate = customRate ? parseFloat(customRate) : getAverageInflationRate(startYear, endYear);
    const current = calculateInflation(initialAmount, startYear, endYear, rate);
    const lowerInflation = calculateInflation(initialAmount, startYear, endYear, Math.max(0, rate - 2));
    const higherInflation = calculateInflation(initialAmount, startYear, endYear, rate + 2);

    return {
      current: {
        ...current,
        rate,
        amount: initialAmount
      },
      lowerInflation: {
        ...lowerInflation,
        rate: Math.max(0, rate - 2),
        amount: initialAmount,
        diff: current.finalAmount - lowerInflation.finalAmount
      },
      higherInflation: {
        ...higherInflation,
        rate: rate + 2,
        amount: initialAmount,
        diff: higherInflation.finalAmount - current.finalAmount
      }
    };
  }, [initialAmount, startYear, endYear, customRate]);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound returns', icon: '💹' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💰' },
    { href: '/us/tools/calculators/cagr-calculator', title: 'CAGR Calculator', description: 'Compound annual growth rate', icon: '📊' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Track savings targets', icon: '🎯' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track investment growth', icon: '📈' },
    { href: '/us/tools/calculators/future-value-calculator', title: 'Future Value', description: 'Calculate future value', icon: '🔮' },
    { href: '/us/tools/calculators/present-value-calculator', title: 'Present Value', description: 'Calculate present value', icon: '💵' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.value)) * 1.15 : 100;

  // Generate line path
  const generateLinePath = () => {
    if (yearlyData.length === 0) return '';
    return yearlyData.map((d, i) => {
      const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
      const y = chartPadding.top + plotHeight - (d.value / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = () => {
    if (yearlyData.length === 0) return '';
    const linePath = generateLinePath();
    const startX = chartPadding.left;
    const endX = chartPadding.left + plotWidth;
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Get point coordinates
  const getPointCoords = (index: number) => {
    if (!yearlyData[index]) return { x: 0, y: 0 };
    const x = chartPadding.left + (index / (yearlyData.length - 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - (yearlyData[index].value / maxChartValue) * plotHeight;
    return { x, y };
  };

  const setPreset = (start: number, end: number, amount: number) => {
    setStartYear(start);
    setEndYear(end);
    setInitialAmount(amount);
    setCustomRate('');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Inflation Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate how inflation affects purchasing power and prices over time</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Enter Values</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Initial Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Start Year</label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(Math.max(1913, parseInt(e.target.value) || 1913))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                  min="1913"
                  max="2024"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">End Year</label>
                <input
                  type="number"
                  value={endYear}
                  onChange={(e) => setEndYear(Math.max(startYear + 1, parseInt(e.target.value) || 2024))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                  min="1913"
                  max="2030"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Custom Inflation Rate (Optional)</label>
              <div className="relative">
                <input
                  type="number"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="Leave blank for historical rates"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">US historical average: ~3.2%</p>
            </div>

            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-orange-600 mb-2 sm:mb-3">Quick Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreset(2000, 2024, 1000)}
                  className="px-2 py-2 bg-white border border-orange-200 rounded-lg text-xs font-medium text-orange-700 hover:bg-orange-100 active:bg-orange-200 transition-colors touch-manipulation"
                >
                  2000 to 2024
                </button>
                <button
                  onClick={() => setPreset(2010, 2024, 1000)}
                  className="px-2 py-2 bg-white border border-orange-200 rounded-lg text-xs font-medium text-orange-700 hover:bg-orange-100 active:bg-orange-200 transition-colors touch-manipulation"
                >
                  2010 to 2024
                </button>
                <button
                  onClick={() => setPreset(1990, 2024, 1000)}
                  className="px-2 py-2 bg-white border border-orange-200 rounded-lg text-xs font-medium text-orange-700 hover:bg-orange-100 active:bg-orange-200 transition-colors touch-manipulation"
                >
                  1990 to 2024
                </button>
                <button
                  onClick={() => setPreset(1980, 2024, 1000)}
                  className="px-2 py-2 bg-white border border-orange-200 rounded-lg text-xs font-medium text-orange-700 hover:bg-orange-100 active:bg-orange-200 transition-colors touch-manipulation"
                >
                  1980 to 2024
                </button>
              </div>
            </div>

            <button className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Inflation
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Inflation Impact</h2>

            <div className="bg-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-orange-600 mb-0.5 sm:mb-1">Equivalent Value in {endYear}</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-orange-700">{formatCurrencyFull(results.finalAmount)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-orange-600 mt-1">
                {formatCurrency(initialAmount)} in {startYear} = {formatCurrency(results.finalAmount)} in {endYear}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Initial Amount:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(initialAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Inflation:</span>
                <span className="font-semibold text-orange-600">+{results.totalInflation.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Avg. Annual Rate:</span>
                <span className="font-semibold text-blue-600">{results.avgRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Purchasing Power Lost:</span>
                <span className="font-semibold text-red-600">-{results.purchasingPowerLost.toFixed(2)}%</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Value Change</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Original Value</span>
                  <span className="font-medium">{((initialAmount / results.finalAmount) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((initialAmount / results.finalAmount) * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Inflation Increase</span>
                  <span className="font-medium">{(100 - (initialAmount / results.finalAmount) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${Math.max(100 - (initialAmount / results.finalAmount) * 100, 0)}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Period:</span>
                  <span className="font-medium">{results.years} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Multiplier:</span>
                  <span className="font-medium">{results.multiplier.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Buying Power:</span>
                  <span className="font-medium">{(100 - results.purchasingPowerLost).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Value Lost:</span>
                  <span className="font-medium">{formatCurrency(results.finalAmount - initialAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Inflation Visualization - Line Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Price Growth Over Time</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Inflated Value</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-0.5 bg-gray-400 border-dashed border-t-2 border-gray-400"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Original Value</span>
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
              <linearGradient id="orangeAreaGradientInflation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fdba74" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="orangeLineGradientInflation" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <filter id="lineShadowInflation" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
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

            {/* Original value reference line */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top + plotHeight - (initialAmount / maxChartValue) * plotHeight}
              x2={chartPadding.left + plotWidth}
              y2={chartPadding.top + plotHeight - (initialAmount / maxChartValue) * plotHeight}
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="8,4"
            />

            {/* Axes */}
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* Area fill */}
            <path d={generateAreaPath()} fill="url(#orangeAreaGradientInflation)" />

            {/* Line */}
            <path d={generateLinePath()} fill="none" stroke="url(#orangeLineGradientInflation)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowInflation)" />

            {/* Data points */}
            {yearlyData.map((d, i) => {
              const coords = getPointCoords(i);
              const isHovered = hoveredYear === i;
              return (
                <circle
                  key={i}
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 8 : 5}
                  fill="white"
                  stroke="#f97316"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200"
                />
              );
            })}

            {/* X-axis labels */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
              const showLabel = yearlyData.length <= 10 || i % Math.ceil(yearlyData.length / 8) === 0 || i === yearlyData.length - 1;
              return showLabel ? (
                <text key={i} x={x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  {d.year}
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
                stroke="#f97316"
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
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">{yearlyData[hoveredYear].year}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold text-orange-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].value)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
                  <span className="text-gray-600">Cumulative:</span>
                  <span className="font-semibold text-blue-600 ml-auto">+{yearlyData[hoveredYear].cumulativeInflation.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how different inflation rates affect your money over time</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-orange-200 bg-orange-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Rate</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-orange-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">{scenarios.current.rate.toFixed(1)}%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Initial:</span>
                <span className="font-medium">{formatCurrency(initialAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final:</span>
                <span className="font-medium">{formatCurrency(scenarios.current.finalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inflation:</span>
                <span className="font-medium">+{scenarios.current.totalInflation.toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-orange-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-orange-700">{formatCurrency(scenarios.current.finalAmount)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Lower Inflation</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">-2%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium text-green-600">{scenarios.lowerInflation.rate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final:</span>
                <span className="font-medium">{formatCurrency(scenarios.lowerInflation.finalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inflation:</span>
                <span className="font-medium">+{scenarios.lowerInflation.totalInflation.toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrency(scenarios.lowerInflation.finalAmount)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">Save {formatCurrency(scenarios.lowerInflation.diff)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-red-300 active:border-red-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Inflation</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-red-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+2%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium text-red-600">{scenarios.higherInflation.rate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final:</span>
                <span className="font-medium">{formatCurrency(scenarios.higherInflation.finalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inflation:</span>
                <span className="font-medium">+{scenarios.higherInflation.totalInflation.toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrency(scenarios.higherInflation.finalAmount)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-red-600">+{formatCurrency(scenarios.higherInflation.diff)} more</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Lower Inflation Benefits</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              A 2% lower inflation rate would save {formatCurrency(scenarios.lowerInflation.diff)} in purchasing power erosion over {results.years} years.
              Lower inflation preserves the value of your savings.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Higher Inflation Impact</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              A 2% higher inflation rate would cost an additional {formatCurrency(scenarios.higherInflation.diff)} in purchasing power.
              Higher inflation erodes savings faster.
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Inflation Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Inflation Breakdown</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Value</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Rate</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Cumulative</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Buying Power</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 6)).map((row, index) => (
                <tr key={row.year} className={`border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 ${index === 0 ? 'bg-blue-50' : ''}`}>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">{row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-orange-600 font-semibold">{formatCurrencyFull(row.value)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-blue-600">
                    {index === 0 ? '-' : `${row.inflationRate.toFixed(1)}%`}
                  </td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-purple-600">
                    {index === 0 ? '-' : `+${row.cumulativeInflation.toFixed(1)}%`}
                  </td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-red-600 hidden xs:table-cell">
                    {row.purchasingPower.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {yearlyData.length > 6 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing first 6 of {yearlyData.length} years
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
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-orange-300 active:border-orange-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-orange-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-orange-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Inflation</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Inflation is the rate at which the general level of prices for goods and services rises over time, leading to a decrease in
          purchasing power. Central banks, like the Federal Reserve in the US, aim to maintain an inflation rate around 2% annually
          to promote economic stability and growth.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-orange-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-orange-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Demand-Pull</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Occurs when demand exceeds supply capacity</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Cost-Push</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Rising production costs push prices higher</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Monetary</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Increased money supply reduces currency value</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Inflation Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The inflation calculator uses the compound inflation formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4 font-bold">Future Value = Present Value x (1 + Inflation Rate)<sup>Years</sup></p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1 border-t border-gray-200 pt-3">
            <p>Where:</p>
            <p>Present Value = Original amount</p>
            <p>Inflation Rate = Annual rate (as decimal)</p>
            <p>Years = Time period</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">How to Use This Calculator</h2>
            <ol className="list-decimal list-inside space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li>Enter the initial dollar amount</li>
              <li>Select the starting year</li>
              <li>Select the ending year</li>
              <li>Optionally enter a custom inflation rate</li>
              <li>View the inflation-adjusted value</li>
            </ol>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Protecting Against Inflation</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                <span>Invest in stocks for long-term growth</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                <span>Consider Treasury Inflation-Protected Securities (TIPS)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                <span>Real estate can hedge against inflation</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                <span>Commodities often rise with inflation</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                <span>I Bonds offer inflation protection</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                <span>Diversify your investment portfolio</span>
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
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is inflation and why does it matter?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Inflation is the rate at which prices for goods and services rise over time, reducing what your money can buy. It matters
              because $100 today won't have the same purchasing power in 10 or 20 years. Understanding inflation helps you plan for
              retirement, negotiate salary increases, evaluate investment returns, and make informed decisions about saving versus
              spending. The Federal Reserve targets around 2% annual inflation for economic stability.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How is inflation measured in the United States?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              The US primarily uses the Consumer Price Index (CPI), which tracks the price changes of a basket of goods and services
              typical households purchase. The Bureau of Labor Statistics releases CPI data monthly. Another measure is the Personal
              Consumption Expenditures (PCE) index, preferred by the Federal Reserve for policy decisions. Core inflation excludes
              volatile food and energy prices to show underlying trends more clearly.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What causes inflation to rise or fall?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Inflation can rise from demand-pull factors (too much money chasing too few goods), cost-push factors (higher production
              costs like wages or raw materials), or monetary expansion (central banks printing more money). Inflation falls when demand
              weakens, supply increases, or central banks tighten monetary policy by raising interest rates. Global factors like supply
              chain disruptions, energy prices, and geopolitical events also significantly impact inflation.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is the difference between inflation and deflation?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Inflation means prices are rising and your money buys less over time. Deflation means prices are falling and your money
              buys more. While deflation sounds good, it can be economically dangerous because people delay purchases expecting lower
              prices, businesses earn less revenue, leading to job cuts and economic contraction. This is why central banks target
              low, stable inflation (around 2%) rather than zero or negative inflation.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How can I protect my savings from inflation?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              To protect against inflation, consider investments that historically outpace inflation: stocks (averaging 7-10% annually),
              Treasury Inflation-Protected Securities (TIPS) which adjust with CPI, I Bonds (up to $10,000/year with inflation protection),
              real estate, and commodities. Avoid keeping large amounts in low-interest savings accounts where inflation erodes value.
              Diversification across asset classes provides the best long-term protection against inflation's unpredictable nature.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="inflation-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
