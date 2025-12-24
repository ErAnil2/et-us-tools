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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/investment-calculator', title: 'Investment Calculator', description: 'Plan your investments', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/stock-profit-calculator', title: 'Stock Profit', description: 'Calculate stock profits', color: 'bg-green-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment', color: 'bg-orange-500' },
];

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

interface YearlyData {
  year: number;
  shares: number;
  shareValue: number;
  dividendIncome: number;
  totalDividends: number;
  portfolioValue: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Dividend Yield Calculator?",
    answer: "A Dividend Yield Calculator is a free online tool designed to help you quickly and accurately calculate dividend yield-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Dividend Yield Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Dividend Yield Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Dividend Yield Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function DividendYieldCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('dividend-yield-calculator');

  const [stockPrice, setStockPrice] = useState(100);
  const [annualDividend, setAnnualDividend] = useState(4);
  const [shares, setShares] = useState(100);
  const [dividendGrowthRate, setDividendGrowthRate] = useState(5);
  const [reinvestDividends, setReinvestDividends] = useState(true);
  const [years, setYears] = useState(10);
  const [priceGrowthRate, setPriceGrowthRate] = useState(7);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const [results, setResults] = useState({
    dividendYield: 0,
    annualIncome: 0,
    monthlyIncome: 0,
    totalValue: 0,
    yieldOnCost: 0,
    futureAnnualIncome: 0,
    totalDividendsCollected: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateDividends = (
    price: number,
    dividend: number,
    numShares: number,
    divGrowth: number,
    priceGrowth: number,
    numYears: number,
    reinvest: boolean
  ) => {
    const data: YearlyData[] = [];
    let currentShares = numShares;
    let currentPrice = price;
    let currentDividend = dividend;
    let totalDividendsCollected = 0;

    for (let year = 1; year <= numYears; year++) {
      // Apply growth rates
      if (year > 1) {
        currentDividend = currentDividend * (1 + divGrowth / 100);
        currentPrice = currentPrice * (1 + priceGrowth / 100);
      }

      const yearDividendIncome = currentShares * currentDividend;
      totalDividendsCollected += yearDividendIncome;

      // Reinvest dividends if enabled
      if (reinvest && year < numYears) {
        const newShares = yearDividendIncome / currentPrice;
        currentShares += newShares;
      }

      data.push({
        year,
        shares: currentShares,
        shareValue: currentPrice,
        dividendIncome: yearDividendIncome,
        totalDividends: totalDividendsCollected,
        portfolioValue: currentShares * currentPrice
      });
    }

    const finalData = data[data.length - 1];
    const initialCost = price * numShares;

    return {
      dividendYield: (dividend / price) * 100,
      annualIncome: dividend * numShares,
      monthlyIncome: (dividend * numShares) / 12,
      totalValue: price * numShares,
      yieldOnCost: finalData ? (finalData.dividendIncome / initialCost) * 100 : 0,
      futureAnnualIncome: finalData ? finalData.dividendIncome : 0,
      totalDividendsCollected,
      yearlyData: data
    };
  };

  useEffect(() => {
    const result = calculateDividends(
      stockPrice,
      annualDividend,
      shares,
      dividendGrowthRate,
      priceGrowthRate,
      years,
      reinvestDividends
    );

    setResults({
      dividendYield: result.dividendYield,
      annualIncome: result.annualIncome,
      monthlyIncome: result.monthlyIncome,
      totalValue: result.totalValue,
      yieldOnCost: result.yieldOnCost,
      futureAnnualIncome: result.futureAnnualIncome,
      totalDividendsCollected: result.totalDividendsCollected
    });

    setYearlyData(result.yearlyData);
  }, [stockPrice, annualDividend, shares, dividendGrowthRate, priceGrowthRate, years, reinvestDividends]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateDividends(stockPrice, annualDividend, shares, dividendGrowthRate, priceGrowthRate, years, reinvestDividends);
    const higherYield = calculateDividends(stockPrice, annualDividend * 1.25, shares, dividendGrowthRate, priceGrowthRate, years, reinvestDividends);
    const moreShares = calculateDividends(stockPrice, annualDividend, shares * 1.5, dividendGrowthRate, priceGrowthRate, years, reinvestDividends);

    return {
      current: { ...current, dividend: annualDividend, numShares: shares },
      higher: {
        ...higherYield,
        dividend: annualDividend * 1.25,
        numShares: shares,
        diff: higherYield.futureAnnualIncome - current.futureAnnualIncome
      },
      more: {
        ...moreShares,
        dividend: annualDividend,
        numShares: Math.round(shares * 1.5),
        diff: moreShares.futureAnnualIncome - current.futureAnnualIncome
      }
    };
  }, [stockPrice, annualDividend, shares, dividendGrowthRate, priceGrowthRate, years, reinvestDividends]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2) + 'M';
    }
    if (value >= 100000) {
      return '$' + (value / 1000).toFixed(1) + 'K';
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

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.portfolioValue)) * 1.15 : 100;
  const maxDividendValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.totalDividends)) * 1.15 : 100;

  // Generate line paths
  const generateLinePath = (data: YearlyData[], getValue: (d: YearlyData) => number, maxValue: number) => {
    if (data.length === 0) return '';

    return data.map((d, i) => {
      const x = chartPadding.left + ((i + 1) / data.length) * plotWidth;
      const y = chartPadding.top + plotHeight - (getValue(d) / maxValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const generateAreaPath = (data: YearlyData[], getValue: (d: YearlyData) => number, maxValue: number) => {
    if (data.length === 0) return '';
    const linePath = generateLinePath(data, getValue, maxValue);
    const startX = chartPadding.left + (1 / data.length) * plotWidth;
    const endX = chartPadding.left + plotWidth;
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Y-axis ticks
  const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    value: maxChartValue * ratio,
    y: chartPadding.top + plotHeight - ratio * plotHeight
  }));

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📊' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound growth', icon: '📈' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track portfolio growth', icon: '💹' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment', icon: '💰' },
    { href: '/us/tools/calculators/cagr-calculator', title: 'CAGR Calculator', description: 'Annual growth rate', icon: '📉' },
    { href: '/us/tools/calculators/stock-profit-calculator', title: 'Stock Profit', description: 'Calculate stock gains', icon: '💵' },
    { href: '/us/tools/calculators/capital-gains-calculator', title: 'Capital Gains', description: 'Tax on investments', icon: '🏦' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Dividend Yield Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate your dividend income and project future passive income growth</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Stock Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Current Stock Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={stockPrice}
                  onChange={(e) => setStockPrice(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Annual Dividend per Share</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={annualDividend}
                  onChange={(e) => setAnnualDividend(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Number of Shares</label>
              <input
                type="number"
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div className="bg-lime-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-lime-700 mb-2 sm:mb-3 md:mb-4">Growth Projections</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-lime-700 mb-1.5 sm:mb-2">Dividend Growth Rate (%/yr)</label>
                  <input
                    type="number"
                    value={dividendGrowthRate}
                    onChange={(e) => setDividendGrowthRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm sm:text-base touch-manipulation bg-white"
                    inputMode="decimal"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-lime-700 mb-1.5 sm:mb-2">Stock Price Growth (%/yr)</label>
                  <input
                    type="number"
                    value={priceGrowthRate}
                    onChange={(e) => setPriceGrowthRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm sm:text-base touch-manipulation bg-white"
                    inputMode="decimal"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-lime-700 mb-1.5 sm:mb-2">Investment Period (Years)</label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-sm sm:text-base touch-manipulation bg-white"
                    inputMode="numeric"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="reinvest"
                    checked={reinvestDividends}
                    onChange={(e) => setReinvestDividends(e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                  />
                  <label htmlFor="reinvest" className="text-xs sm:text-sm font-medium text-lime-700">Reinvest Dividends (DRIP)</label>
                </div>
              </div>
            </div>

            <button className="w-full bg-lime-600 hover:bg-lime-700 active:bg-lime-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Dividends
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Dividend Income</h2>

            <div className="bg-lime-50 border border-lime-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-lime-600 mb-0.5 sm:mb-1">Current Dividend Yield</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-lime-700">{results.dividendYield.toFixed(2)}%</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-lime-600 mt-1">Based on ${annualDividend} annual dividend</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Annual Income (Year 1):</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(results.annualIncome)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Monthly Income (Year 1):</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(results.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Portfolio Value:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(results.totalValue)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Annual Income (Year {years}):</span>
                <span className="font-semibold text-lime-600">{formatCurrencyFull(results.futureAnnualIncome)}</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Income Projection</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Total Dividends ({years} yrs)</span>
                  <span className="font-medium text-green-600">{formatCurrencyFull(results.totalDividendsCollected)}</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (results.totalDividendsCollected / (results.totalValue + results.totalDividendsCollected)) * 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Yield on Cost (Year {years})</span>
                  <span className="font-medium text-lime-600">{results.yieldOnCost.toFixed(2)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, results.yieldOnCost * 5)}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Investment Summary</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shares:</span>
                  <span className="font-medium">{shares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Div. Growth:</span>
                  <span className="font-medium">{dividendGrowthRate}%/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Growth:</span>
                  <span className="font-medium">{priceGrowthRate}%/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DRIP:</span>
                  <span className="font-medium">{reinvestDividends ? 'Yes' : 'No'}</span>
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
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Portfolio & Dividend Growth</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-lime-400 to-lime-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Portfolio Value</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Cumulative Dividends</span>
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
              <linearGradient id="limeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#a3e635" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#d9f99d" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="greenAreaGradientDiv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#4ade80" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#86efac" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="limeLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#65a30d" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
              <linearGradient id="greenLineGradientDiv" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <filter id="lineShadowLime" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#84cc16" floodOpacity="0.3"/>
              </filter>
              <filter id="glowLime" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
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
            <path d={generateAreaPath(yearlyData, d => d.portfolioValue, maxChartValue)} fill="url(#limeAreaGradient)" />
            <path d={generateAreaPath(yearlyData, d => d.totalDividends, maxChartValue)} fill="url(#greenAreaGradientDiv)" />

            {/* Lines */}
            <path d={generateLinePath(yearlyData, d => d.portfolioValue, maxChartValue)} fill="none" stroke="url(#limeLineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowLime)" />
            <path d={generateLinePath(yearlyData, d => d.totalDividends, maxChartValue)} fill="none" stroke="url(#greenLineGradientDiv)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data points */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + ((i + 1) / yearlyData.length) * plotWidth;
              const yPortfolio = chartPadding.top + plotHeight - (d.portfolioValue / maxChartValue) * plotHeight;
              const yDividends = chartPadding.top + plotHeight - (d.totalDividends / maxChartValue) * plotHeight;
              const isHovered = hoveredYear === i;

              return (
                <g key={i}>
                  <circle cx={x} cy={yPortfolio} r={isHovered ? 8 : 5} fill="white" stroke="#84cc16" strokeWidth={isHovered ? 3 : 2} filter={isHovered ? "url(#glowLime)" : undefined} className="transition-all duration-200" />
                  <circle cx={x} cy={yDividends} r={isHovered ? 7 : 4} fill="white" stroke="#22c55e" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                </g>
              );
            })}

            {/* X-axis labels */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + ((i + 1) / yearlyData.length) * plotWidth;
              const showLabel = yearlyData.length <= 12 || i % Math.ceil(yearlyData.length / 10) === 0 || i === yearlyData.length - 1;
              return showLabel ? (
                <text key={i} x={x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  Yr {d.year}
                </text>
              ) : null;
            })}

            {/* Hover areas */}
            {yearlyData.map((_, i) => {
              const x = chartPadding.left + ((i + 1) / yearlyData.length) * plotWidth;
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
                x1={chartPadding.left + ((hoveredYear + 1) / yearlyData.length) * plotWidth}
                y1={chartPadding.top}
                x2={chartPadding.left + ((hoveredYear + 1) / yearlyData.length) * plotWidth}
                y2={chartPadding.top + plotHeight}
                stroke="#84cc16"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.6"
              />
            )}
          </svg>

          {/* Tooltip */}
          {hoveredYear !== null && yearlyData[hoveredYear] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-lime-100"
              style={{
                left: `calc(${((hoveredYear + 1) / yearlyData.length) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Year {yearlyData[hoveredYear].year}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-lime-400 to-lime-600 rounded-full"></span>
                  <span className="text-gray-600">Portfolio:</span>
                  <span className="font-semibold text-lime-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].portfolioValue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
                  <span className="text-gray-600">Year Dividend:</span>
                  <span className="font-semibold text-green-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].dividendIncome)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="text-gray-600">Total Dividends:</span>
                  <span className="font-bold text-green-700 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].totalDividends)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">Compare different dividend investment strategies</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-lime-200 bg-lime-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Holding</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-lime-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Shares:</span>
                <span className="font-medium">{scenarios.current.numShares}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividend:</span>
                <span className="font-medium">${scenarios.current.dividend}/share</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yield:</span>
                <span className="font-medium">{scenarios.current.dividendYield.toFixed(2)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-lime-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Annual Income (Yr {years})</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-lime-700">{formatCurrencyFull(scenarios.current.futureAnnualIncome)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Dividend</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+25%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Shares:</span>
                <span className="font-medium">{scenarios.higher.numShares}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividend:</span>
                <span className="font-medium text-green-600">${scenarios.higher.dividend.toFixed(2)}/share</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yield:</span>
                <span className="font-medium text-green-600">{scenarios.higher.dividendYield.toFixed(2)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Annual Income (Yr {years})</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higher.futureAnnualIncome)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.higher.diff)}/year</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-blue-300 active:border-blue-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">More Shares</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-blue-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+50%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Shares:</span>
                <span className="font-medium text-blue-600">{scenarios.more.numShares}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividend:</span>
                <span className="font-medium">${scenarios.more.dividend}/share</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Yield:</span>
                <span className="font-medium">{scenarios.more.dividendYield.toFixed(2)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Annual Income (Yr {years})</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.more.futureAnnualIncome)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-blue-600">+{formatCurrencyFull(scenarios.more.diff)}/year</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-lime-50 border border-lime-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-lime-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">DRIP Power</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              {reinvestDividends
                ? `With dividend reinvestment, you'll accumulate ${yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].shares.toFixed(1) : shares} shares by year ${years}, earning ${formatCurrencyFull(results.futureAnnualIncome)} annually.`
                : `Enable DRIP to automatically reinvest dividends and accelerate your income growth through compound returns.`
              }
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Yield on Cost</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Your yield on cost grows from {results.dividendYield.toFixed(2)}% today to {results.yieldOnCost.toFixed(2)}% by year {years}. Dividend growth stocks reward patient investors!
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Dividend Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Dividend Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[450px] sm:min-w-[550px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Shares</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Price</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Dividend</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Yr {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600">{row.shares.toFixed(1)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600 hidden xs:table-cell">{formatCurrencyFull(row.shareValue)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">{formatCurrencyFull(row.dividendIncome)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-lime-600">{formatCurrencyFull(row.portfolioValue)}</td>
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
                className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 bg-lime-100 hover:bg-lime-200 active:bg-lime-300 text-lime-700 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation"
              >
                {showFullSchedule ? 'Show Less' : 'Show Full Schedule'}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Related Finance Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-lime-300 active:border-lime-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-lime-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-lime-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Dividend Yield</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Dividend yield is a key metric for income investors, showing the annual dividend payment as a percentage of the stock price.
          It helps compare income potential across different investments and identify attractive dividend-paying stocks.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-lime-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-lime-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Passive Income</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Dividends provide regular cash flow without selling shares</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Dividend Growth</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Quality companies raise dividends annually, boosting income over time</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">DRIP Benefits</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Reinvesting dividends compounds your returns exponentially</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Dividend Yield Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">Calculate dividend yield using this simple formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">Dividend Yield = (Annual Dividend ÷ Stock Price) × 100</p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Example:</p>
            <p>Stock Price: $100</p>
            <p>Annual Dividend: $4</p>
            <p>Yield = ($4 ÷ $100) × 100 = 4%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Dividend Investing Tips</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-lime-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Look for Dividend Aristocrats (25+ years of increases)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-lime-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Check payout ratio (under 60% is usually safe)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-lime-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Diversify across sectors for stable income</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-lime-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Enable DRIP to compound your returns</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-lime-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Focus on dividend growth, not just high yield</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Key Metrics to Watch</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Yield on Cost:</strong> Your personal yield based on purchase price</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Payout Ratio:</strong> % of earnings paid as dividends</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>5-Year Growth Rate:</strong> Historical dividend increases</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Ex-Dividend Date:</strong> Buy before this to receive dividends</span>
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
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is a good dividend yield?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              A &quot;good&quot; dividend yield depends on your investment goals and the market context. Generally, yields between 2% and 6%
              are considered healthy for most stocks. Yields below 2% may indicate a growth-focused company, while yields above 6%
              could signal higher risk or an unsustainable payout. The S&amp;P 500 historically averages around 1.5-2% dividend yield.
              Always compare yields within the same industry sector for accurate assessment.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Why do dividend yields change even when dividends stay the same?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Dividend yield is calculated by dividing the annual dividend by the current stock price. When a stock price rises,
              the yield falls (even with the same dividend), making the stock appear less attractive to income investors. Conversely,
              when stock prices drop, yields increase. This inverse relationship is why a suddenly high yield can sometimes be a warning
              sign of a stock in trouble rather than an opportunity.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is the difference between dividend yield and dividend payout ratio?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Dividend yield measures the return you receive relative to the stock price you paid. Payout ratio measures what percentage
              of a company&apos;s earnings is distributed as dividends. A company earning $4 per share paying $2 in dividends has a 50%
              payout ratio. A lower payout ratio (below 60%) generally indicates the dividend is sustainable and leaves room for
              increases, while very high ratios may suggest the dividend could be at risk during earnings downturns.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How are dividends taxed in the US?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Dividends are taxed differently depending on whether they&apos;re &quot;qualified&quot; or &quot;ordinary.&quot; Qualified dividends from US companies
              (held for at least 60 days) are taxed at long-term capital gains rates of 0%, 15%, or 20% based on your income. Ordinary
              dividends are taxed as regular income at rates up to 37%. Holding dividend stocks in tax-advantaged accounts like IRAs or
              401(k)s can eliminate or defer this tax burden entirely.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is dividend reinvestment (DRIP) and should I use it?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Dividend Reinvestment Plans (DRIPs) automatically use your dividend payments to purchase additional shares of the same stock,
              often with no commission fees. This harnesses the power of compounding, as your dividends buy more shares which then generate
              more dividends. DRIPs are excellent for long-term wealth building, but you may prefer receiving cash dividends if you need
              income now or want to diversify by investing dividends in different companies.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="dividend-yield-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
