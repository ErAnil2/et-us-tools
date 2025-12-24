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
  { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment', color: 'bg-green-500' },
  { href: '/us/tools/calculators/stock-profit-calculator', title: 'Stock Profit', description: 'Calculate stock profits', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-orange-500' },
];

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

interface TaxBracket {
  rate: number;
  min: number;
  max: number;
  label: string;
}

interface YearlyGain {
  year: number;
  purchasePrice: number;
  salePrice: number;
  gain: number;
  tax: number;
  netProfit: number;
}

const longTermBrackets: TaxBracket[] = [
  { rate: 0, min: 0, max: 44625, label: '$0 - $44,625' },
  { rate: 15, min: 44626, max: 492300, label: '$44,626 - $492,300' },
  { rate: 20, min: 492301, max: Infinity, label: 'Over $492,300' }
];

const shortTermBrackets: TaxBracket[] = [
  { rate: 10, min: 0, max: 11000, label: '$0 - $11,000' },
  { rate: 12, min: 11001, max: 44725, label: '$11,001 - $44,725' },
  { rate: 22, min: 44726, max: 95375, label: '$44,726 - $95,375' },
  { rate: 24, min: 95376, max: 183000, label: '$95,376 - $183,000' },
  { rate: 32, min: 183001, max: 400000, label: '$183,001 - $400,000' },
  { rate: 35, min: 400001, max: 600000, label: '$400,001 - $600,000' },
  { rate: 37, min: 600001, max: Infinity, label: 'Over $600,000' }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Capital Gains Calculator?",
    answer: "A Capital Gains Calculator is a free online tool designed to help you quickly and accurately calculate capital gains-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Capital Gains Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Capital Gains Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Capital Gains Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CapitalGainsCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('capital-gains-calculator');

  const [purchasePrice, setPurchasePrice] = useState(10000);
  const [salePrice, setSalePrice] = useState(15000);
  const [holdingPeriod, setHoldingPeriod] = useState<'long' | 'short'>('long');
  const [taxableIncome, setTaxableIncome] = useState(50000);
  const [stateTaxRate, setStateTaxRate] = useState(5);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const [results, setResults] = useState({
    capitalGain: 0,
    federalTax: 0,
    stateTax: 0,
    totalTax: 0,
    netProfit: 0,
    returnPercent: 0,
    effectiveTaxRate: 0,
    federalRate: 0
  });

  const [yearlyProjection, setYearlyProjection] = useState<YearlyGain[]>([]);

  const getFederalTaxRate = (income: number, isLongTerm: boolean): number => {
    const brackets = isLongTerm ? longTermBrackets : shortTermBrackets;
    for (const bracket of brackets) {
      if (income >= bracket.min && income <= bracket.max) {
        return bracket.rate;
      }
    }
    return brackets[brackets.length - 1].rate;
  };

  const calculateGains = (purchase: number, sale: number, income: number, isLongTerm: boolean, stateRate: number) => {
    const gain = Math.max(0, sale - purchase);
    const federalRate = getFederalTaxRate(income, isLongTerm);
    const federalTax = gain * (federalRate / 100);
    const stateTax = gain * (stateRate / 100);
    const totalTax = federalTax + stateTax;
    const net = gain - totalTax;
    const returnPct = purchase > 0 ? (gain / purchase) * 100 : 0;
    const effectiveRate = gain > 0 ? (totalTax / gain) * 100 : 0;

    // Generate projection for different holding periods
    const projection: YearlyGain[] = [];
    const annualGrowth = purchase > 0 ? Math.pow(sale / purchase, 1 / 5) - 1 : 0; // Assume 5-year growth

    for (let year = 1; year <= 10; year++) {
      const projectedSale = purchase * Math.pow(1 + annualGrowth, year);
      const projectedGain = Math.max(0, projectedSale - purchase);
      const isLong = year >= 1;
      const projFedRate = getFederalTaxRate(income, isLong);
      const projFedTax = projectedGain * (projFedRate / 100);
      const projStateTax = projectedGain * (stateRate / 100);
      const projTotalTax = projFedTax + projStateTax;

      projection.push({
        year,
        purchasePrice: purchase,
        salePrice: projectedSale,
        gain: projectedGain,
        tax: projTotalTax,
        netProfit: projectedGain - projTotalTax
      });
    }

    return {
      capitalGain: gain,
      federalTax,
      stateTax,
      totalTax,
      netProfit: net,
      returnPercent: returnPct,
      effectiveTaxRate: effectiveRate,
      federalRate,
      projection
    };
  };

  useEffect(() => {
    const result = calculateGains(purchasePrice, salePrice, taxableIncome, holdingPeriod === 'long', stateTaxRate);
    setResults({
      capitalGain: result.capitalGain,
      federalTax: result.federalTax,
      stateTax: result.stateTax,
      totalTax: result.totalTax,
      netProfit: result.netProfit,
      returnPercent: result.returnPercent,
      effectiveTaxRate: result.effectiveTaxRate,
      federalRate: result.federalRate
    });
    setYearlyProjection(result.projection);
  }, [purchasePrice, salePrice, holdingPeriod, taxableIncome, stateTaxRate]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateGains(purchasePrice, salePrice, taxableIncome, holdingPeriod === 'long', stateTaxRate);
    const longTermScenario = calculateGains(purchasePrice, salePrice, taxableIncome, true, stateTaxRate);
    const shortTermScenario = calculateGains(purchasePrice, salePrice, taxableIncome, false, stateTaxRate);

    return {
      current: { ...current, type: holdingPeriod },
      longTerm: {
        ...longTermScenario,
        type: 'long',
        taxSaved: shortTermScenario.totalTax - longTermScenario.totalTax
      },
      shortTerm: {
        ...shortTermScenario,
        type: 'short',
        extraTax: shortTermScenario.totalTax - longTermScenario.totalTax
      }
    };
  }, [purchasePrice, salePrice, taxableIncome, holdingPeriod, stateTaxRate]);

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

  const maxChartValue = yearlyProjection.length > 0 ? Math.max(...yearlyProjection.map(d => d.gain)) * 1.15 : 100;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📊' },
    { href: '/us/tools/calculators/stock-valuation-calculator', title: 'Stock Valuation', description: 'Value your stocks', icon: '📈' },
    { href: '/us/tools/calculators/dividend-yield-calculator', title: 'Dividend Yield', description: 'Calculate dividends', icon: '💰' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate growth', icon: '💹' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track portfolio', icon: '📉' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Inflation impact', icon: '💵' },
    { href: '/us/tools/calculators/tax-calculator', title: 'Tax Calculator', description: 'Estimate taxes', icon: '🧾' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Capital Gains Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate investment gains, taxes owed, and net profit from your investments</p>
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Purchase Price (Cost Basis)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Sale Price (Proceeds)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Holding Period</label>
              <select
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(e.target.value as 'long' | 'short')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base touch-manipulation bg-white"
              >
                <option value="long">Long-term (more than 1 year)</option>
                <option value="short">Short-term (1 year or less)</option>
              </select>
            </div>

            <div className="bg-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-red-700 mb-2 sm:mb-3 md:mb-4">Tax Information</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-red-700 mb-1.5 sm:mb-2">Taxable Income (for bracket)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                    <input
                      type="number"
                      value={taxableIncome}
                      onChange={(e) => setTaxableIncome(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base touch-manipulation bg-white"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-red-700 mb-1.5 sm:mb-2">State Tax Rate (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stateTaxRate}
                      onChange={(e) => setStateTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base touch-manipulation bg-white"
                      inputMode="decimal"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Taxes
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Tax Summary</h2>

            <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-green-600 mb-0.5 sm:mb-1">Capital Gain</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-green-700">{formatCurrencyFull(results.capitalGain)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-green-600 mt-1">{holdingPeriod === 'long' ? 'Long-term' : 'Short-term'} gain ({results.returnPercent.toFixed(1)}% return)</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Federal Tax ({results.federalRate}%):</span>
                <span className="font-semibold text-red-600">-{formatCurrencyFull(results.federalTax)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">State Tax ({stateTaxRate}%):</span>
                <span className="font-semibold text-red-600">-{formatCurrencyFull(results.stateTax)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Tax:</span>
                <span className="font-semibold text-red-600">-{formatCurrencyFull(results.totalTax)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Net Profit:</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(results.netProfit)}</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Tax Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Effective Tax Rate</span>
                  <span className="font-medium">{results.effectiveTaxRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, results.effectiveTaxRate * 2)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Keep After Tax</span>
                  <span className="font-medium">{(100 - results.effectiveTaxRate).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${100 - results.effectiveTaxRate}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Investment Summary</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost Basis:</span>
                  <span className="font-medium">{formatCurrency(purchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sale Price:</span>
                  <span className="font-medium">{formatCurrency(salePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Holding:</span>
                  <span className="font-medium">{holdingPeriod === 'long' ? '>1 year' : '≤1 year'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fed Rate:</span>
                  <span className="font-medium">{results.federalRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Tax Visualization Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Projected Gains Over Time</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Capital Gain</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-red-400 to-red-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Tax Owed</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="greenBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="redBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
              </filter>
            </defs>

            {/* Background */}
            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {/* Grid lines */}
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

            {/* Bars */}
            {yearlyProjection.map((d, i) => {
              const barWidth = (plotWidth / yearlyProjection.length) * 0.7;
              const barGap = (plotWidth / yearlyProjection.length) * 0.15;
              const x = chartPadding.left + i * (plotWidth / yearlyProjection.length) + barGap;
              const gainHeight = (d.gain / maxChartValue) * plotHeight;
              const taxHeight = (d.tax / maxChartValue) * plotHeight;
              const isHovered = hoveredBar === i;

              return (
                <g key={i}>
                  {/* Gain bar */}
                  <rect
                    x={x}
                    y={chartPadding.top + plotHeight - gainHeight}
                    width={barWidth / 2 - 2}
                    height={gainHeight}
                    fill="url(#greenBarGradient)"
                    rx="4"
                    filter={isHovered ? "url(#barShadow)" : undefined}
                    opacity={isHovered ? 1 : 0.85}
                    className="transition-all duration-200"
                  />
                  {/* Tax bar */}
                  <rect
                    x={x + barWidth / 2 + 2}
                    y={chartPadding.top + plotHeight - taxHeight}
                    width={barWidth / 2 - 2}
                    height={taxHeight}
                    fill="url(#redBarGradient)"
                    rx="4"
                    filter={isHovered ? "url(#barShadow)" : undefined}
                    opacity={isHovered ? 1 : 0.85}
                    className="transition-all duration-200"
                  />
                  {/* X-axis label */}
                  <text x={x + barWidth / 2} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                    Yr {d.year}
                  </text>
                  {/* Hover area */}
                  <rect
                    x={x - barGap}
                    y={chartPadding.top}
                    width={plotWidth / yearlyProjection.length}
                    height={plotHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredBar !== null && yearlyProjection[hoveredBar] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-red-100"
              style={{
                left: `calc(${((hoveredBar + 0.5) / yearlyProjection.length) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Year {yearlyProjection[hoveredBar].year}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600">Gain:</span>
                  <span className="font-semibold text-green-600 ml-auto">{formatCurrencyFull(yearlyProjection[hoveredBar].gain)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold text-red-600 ml-auto">{formatCurrencyFull(yearlyProjection[hoveredBar].tax)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="text-gray-600">Net Profit:</span>
                  <span className="font-bold text-gray-800 ml-auto">{formatCurrencyFull(yearlyProjection[hoveredBar].netProfit)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">Long-term vs Short-term Comparison</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See the tax impact of holding period on your investment</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className={`border-2 ${holdingPeriod === 'long' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'} rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Long-term</span>
              {holdingPeriod === 'long' && <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>}
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Holding:</span>
                <span className="font-medium">&gt;1 year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Rate:</span>
                <span className="font-medium text-green-600">{scenarios.longTerm.federalRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Owed:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.longTerm.totalTax)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-green-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Net Profit</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-green-700">{formatCurrencyFull(scenarios.longTerm.netProfit)}</div>
            </div>
          </div>

          <div className={`border ${holdingPeriod === 'short' ? 'border-2 border-red-200 bg-red-50' : 'border-gray-200 bg-white'} rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Short-term</span>
              {holdingPeriod === 'short' && <span className="text-[8px] xs:text-[10px] sm:text-xs bg-red-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>}
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Holding:</span>
                <span className="font-medium">≤1 year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Rate:</span>
                <span className="font-medium text-red-600">{scenarios.shortTerm.federalRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Owed:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.shortTerm.totalTax)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Net Profit</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.shortTerm.netProfit)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-red-600">+{formatCurrencyFull(scenarios.shortTerm.extraTax)} more tax</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-gradient-to-br from-green-50 to-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Tax Savings</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Tip</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Short-term tax:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.shortTerm.totalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Long-term tax:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.longTerm.totalTax)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">You Save</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-green-600">{formatCurrencyFull(scenarios.longTerm.taxSaved)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">by holding &gt;1 year</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Hold Longer, Pay Less</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Long-term capital gains (assets held &gt;1 year) are taxed at preferential rates of 0%, 15%, or 20% vs. ordinary income rates up to 37% for short-term gains.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Tax-Loss Harvesting</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Consider selling losing investments to offset gains. You can use up to $3,000 in net losses to reduce ordinary income each year.
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Projected Gains Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[450px] sm:min-w-[550px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Sale Price</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Gain</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Tax</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyProjection : yearlyProjection.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Yr {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600">{formatCurrencyFull(row.salePrice)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">{formatCurrencyFull(row.gain)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-red-600 hidden xs:table-cell">-{formatCurrencyFull(row.tax)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-gray-800">{formatCurrencyFull(row.netProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {yearlyProjection.length > 5 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing first 5 of {yearlyProjection.length} years
                </p>
              )}
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation"
              >
                {showFullSchedule ? 'Show Less' : 'Show Full Schedule'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Investment Calculators - Moved above SEO and FAQs */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-red-300 active:border-red-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-red-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-red-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Capital Gains Tax</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Capital gains tax is applied to profits from selling investments like stocks, bonds, real estate, and other assets.
          The tax rate depends on how long you held the asset and your income level.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Long-term Rates (2024)</h3>
            <ul className="text-[10px] xs:text-xs sm:text-sm text-gray-600 space-y-1">
              <li>• 0% - up to $44,625</li>
              <li>• 15% - $44,626 to $492,300</li>
              <li>• 20% - over $492,300</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-red-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Short-term Rates</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">Taxed as ordinary income at rates from 10% to 37% based on your tax bracket</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Capital Gains Formula</h2>
        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">Capital Gain = Sale Price - Cost Basis</p>
          <p className="mb-2 xs:mb-3 sm:mb-4">Tax Owed = Capital Gain × Tax Rate</p>
          <p>Net Profit = Capital Gain - Tax Owed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Tax-Saving Strategies</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Hold investments for more than 1 year</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Use tax-loss harvesting to offset gains</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Invest in tax-advantaged accounts (IRA, 401k)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Consider charitable donations of appreciated stock</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Cost Basis Methods</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>FIFO:</strong> First shares bought are first sold</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>LIFO:</strong> Last shares bought are first sold</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Specific ID:</strong> Choose which shares to sell</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Average:</strong> Average cost of all shares</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is the difference between short-term and long-term capital gains?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              The key difference is the holding period and tax rate. Short-term capital gains apply to assets held for one year or less
              and are taxed as ordinary income at rates from 10% to 37%. Long-term capital gains apply to assets held for more than one
              year and receive preferential tax rates of 0%, 15%, or 20% depending on your income. This significant tax advantage makes
              long-term investing considerably more tax-efficient for most investors.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is cost basis and how do I calculate it?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Cost basis is your original investment in an asset, which determines your taxable gain when you sell. For stocks, it
              includes the purchase price plus any commissions or fees. If you received shares through dividends reinvestment, inheritance,
              or as a gift, the cost basis rules differ. Reinvested dividends add to your basis, inherited assets typically get a
              "stepped-up" basis to fair market value at death, and gifts usually carry the donor's original basis.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How does tax-loss harvesting work?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Tax-loss harvesting involves selling investments at a loss to offset capital gains and reduce your tax bill. Losses
              first offset gains of the same type (short-term losses offset short-term gains). Excess losses can offset gains of the
              other type, and up to $3,000 of remaining losses can reduce ordinary income annually. Unused losses carry forward
              indefinitely. Be aware of the wash-sale rule, which disallows the loss if you buy substantially identical securities
              within 30 days before or after the sale.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Do I have to pay state taxes on capital gains?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Most states tax capital gains as ordinary income, with rates varying widely. Some states like California and New York
              have rates exceeding 10%, while others like Texas, Florida, and Nevada have no state income tax at all. A few states
              offer preferential rates for long-term gains similar to federal treatment. Understanding your state's tax treatment is
              crucial for accurate planning, as combined federal and state taxes can significantly impact your net returns.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is the Net Investment Income Tax (NIIT)?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              The Net Investment Income Tax is an additional 3.8% tax that applies to certain investment income, including capital
              gains, for high-income taxpayers. It kicks in when your modified adjusted gross income exceeds $200,000 for single filers
              or $250,000 for married filing jointly. This means high earners could pay up to 23.8% on long-term capital gains (20% +
              3.8% NIIT) plus any applicable state taxes. Factor this into your planning if your income approaches these thresholds.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="capital-gains-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
