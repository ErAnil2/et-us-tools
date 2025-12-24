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

interface CashFlowData {
  year: number;
  cashFlow: number;
  discountFactor: number;
  presentValue: number;
  cumulativePV: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Present Value Calculator?",
    answer: "A Present Value Calculator is a free online tool designed to help you quickly and accurately calculate present value-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Present Value Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Present Value Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Present Value Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PresentValueCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('present-value-calculator');

  const [calcType, setCalcType] = useState('single');
  const [futureValue, setFutureValue] = useState(10000);
  const [years, setYears] = useState(5);
  const [payment, setPayment] = useState(1000);
  const [periods, setPeriods] = useState(10);
  const [perpetualCashFlow, setPerpetualCashFlow] = useState(500);
  const [discountRate, setDiscountRate] = useState(8);
  const [includeInitialInvestment, setIncludeInitialInvestment] = useState(false);
  const [initialInvestment, setInitialInvestment] = useState(5000);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const [presentValue, setPresentValue] = useState(0);
  const [totalFutureValue, setTotalFutureValue] = useState(0);
  const [npv, setNpv] = useState(0);
  const [discountFactor, setDiscountFactor] = useState(0);
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([]);

  const calculatePresentValue = (
    type: string,
    fv: number,
    yrs: number,
    pmt: number,
    per: number,
    perpetual: number,
    rate: number,
    includeInvestment: boolean,
    investment: number
  ) => {
    const r = rate / 100;
    let pv = 0;
    let totalFV = 0;
    let data: CashFlowData[] = [];

    switch (type) {
      case 'single':
        if (fv > 0 && yrs > 0 && r > 0) {
          pv = fv / Math.pow(1 + r, yrs);
          totalFV = fv;

          // Generate year-by-year data
          for (let year = 1; year <= yrs; year++) {
            const df = 1 / Math.pow(1 + r, year);
            const yearPV = year === yrs ? pv : 0;
            data.push({
              year,
              cashFlow: year === yrs ? fv : 0,
              discountFactor: df,
              presentValue: yearPV,
              cumulativePV: yearPV
            });
          }
        }
        break;

      case 'annuity':
        if (pmt > 0 && per > 0 && r > 0) {
          const annuityFactor = (1 - Math.pow(1 + r, -per)) / r;
          pv = pmt * annuityFactor;
          totalFV = pmt * per;

          let cumPV = 0;
          for (let year = 1; year <= per; year++) {
            const df = 1 / Math.pow(1 + r, year);
            const yearPV = pmt * df;
            cumPV += yearPV;
            data.push({
              year,
              cashFlow: pmt,
              discountFactor: df,
              presentValue: yearPV,
              cumulativePV: cumPV
            });
          }
        }
        break;

      case 'perpetuity':
        if (perpetual > 0 && r > 0) {
          pv = perpetual / r;
          totalFV = Infinity;

          // Show first 20 years for perpetuity
          let cumPV = 0;
          for (let year = 1; year <= 20; year++) {
            const df = 1 / Math.pow(1 + r, year);
            const yearPV = perpetual * df;
            cumPV += yearPV;
            data.push({
              year,
              cashFlow: perpetual,
              discountFactor: df,
              presentValue: yearPV,
              cumulativePV: cumPV
            });
          }
        }
        break;
    }

    let calculatedNpv = pv;
    if (includeInvestment && investment > 0) {
      calculatedNpv = pv - investment;
    }

    return {
      presentValue: pv,
      totalFutureValue: totalFV,
      npv: calculatedNpv,
      discountFactor: pv / (totalFV || 1),
      cashFlowData: data
    };
  };

  useEffect(() => {
    const result = calculatePresentValue(
      calcType,
      futureValue,
      years,
      payment,
      periods,
      perpetualCashFlow,
      discountRate,
      includeInitialInvestment,
      initialInvestment
    );
    setPresentValue(result.presentValue);
    setTotalFutureValue(result.totalFutureValue);
    setNpv(result.npv);
    setDiscountFactor(result.discountFactor);
    setCashFlowData(result.cashFlowData);
  }, [calcType, futureValue, years, payment, periods, perpetualCashFlow, discountRate, includeInitialInvestment, initialInvestment]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculatePresentValue(calcType, futureValue, years, payment, periods, perpetualCashFlow, discountRate, includeInitialInvestment, initialInvestment);
    const lowerRate = calculatePresentValue(calcType, futureValue, years, payment, periods, perpetualCashFlow, discountRate - 2, includeInitialInvestment, initialInvestment);
    const higherRate = calculatePresentValue(calcType, futureValue, years, payment, periods, perpetualCashFlow, discountRate + 2, includeInitialInvestment, initialInvestment);

    return {
      current: { ...current, rate: discountRate },
      lower: {
        ...lowerRate,
        rate: discountRate - 2,
        diff: lowerRate.presentValue - current.presentValue
      },
      higher: {
        ...higherRate,
        rate: discountRate + 2,
        diff: higherRate.presentValue - current.presentValue
      }
    };
  }, [calcType, futureValue, years, payment, periods, perpetualCashFlow, discountRate, includeInitialInvestment, initialInvestment]);

  const formatCurrency = (value: number) => {
    if (!isFinite(value)) return 'Perpetual';
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
    if (!isFinite(value)) return 'Perpetual';
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

  const maxChartValue = cashFlowData.length > 0 ? Math.max(...cashFlowData.map(d => Math.max(d.cashFlow, d.cumulativePV))) * 1.15 : 100;

  // Generate line path
  const generateLinePath = (data: CashFlowData[], key: 'cumulativePV' | 'cashFlow') => {
    if (data.length === 0) return '';
    return data.map((d, i) => {
      const x = chartPadding.left + ((i + 1) / data.length) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const generateAreaPath = (data: CashFlowData[], key: 'cumulativePV' | 'cashFlow') => {
    if (data.length === 0) return '';
    const linePath = generateLinePath(data, key);
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
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate growth', icon: '📈' },
    { href: '/us/tools/calculators/npv-calculator', title: 'NPV Calculator', description: 'Net present value', icon: '💰' },
    { href: '/us/tools/calculators/future-value-calculator', title: 'Future Value', description: 'Project future worth', icon: '🔮' },
    { href: '/us/tools/calculators/irr-calculator', title: 'IRR Calculator', description: 'Internal rate of return', icon: '📊' },
    { href: '/us/tools/calculators/annuity-calculator', title: 'Annuity Calculator', description: 'Calculate annuities', icon: '💵' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement', description: 'Plan retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track growth', icon: '💹' },
    { href: '/us/tools/calculators/bond-calculator', title: 'Bond Calculator', description: 'Bond valuation', icon: '🏦' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Present Value Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate the present value of future cash flows using time value of money principles</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Cash Flow Analysis</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Calculation Type</label>
              <select
                value={calcType}
                onChange={(e) => setCalcType(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation bg-white"
              >
                <option value="single">Single Future Value</option>
                <option value="annuity">Ordinary Annuity</option>
                <option value="perpetuity">Perpetuity</option>
              </select>
            </div>

            {/* Single Future Value Inputs */}
            {calcType === 'single' && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Future Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                    <input
                      type="number"
                      value={futureValue}
                      onChange={(e) => setFutureValue(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Years</label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation"
                    inputMode="numeric"
                  />
                </div>
              </div>
            )}

            {/* Annuity Inputs */}
            {calcType === 'annuity' && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Payment Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                    <input
                      type="number"
                      value={payment}
                      onChange={(e) => setPayment(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Number of Periods</label>
                  <input
                    type="number"
                    value={periods}
                    onChange={(e) => setPeriods(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation"
                    inputMode="numeric"
                  />
                </div>
              </div>
            )}

            {/* Perpetuity Inputs */}
            {calcType === 'perpetuity' && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Annual Cash Flow</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                  <input
                    type="number"
                    value={perpetualCashFlow}
                    onChange={(e) => setPerpetualCashFlow(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation"
                    inputMode="numeric"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Discount Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="includeInvestment"
                  checked={includeInitialInvestment}
                  onChange={(e) => setIncludeInitialInvestment(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="includeInvestment" className="text-xs sm:text-sm font-semibold text-purple-700">Include Initial Investment (for NPV)</label>
              </div>

              {includeInitialInvestment && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-purple-700 mb-1.5 sm:mb-2">Initial Investment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                    <input
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base touch-manipulation bg-white"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              )}
            </div>

            <button className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Present Value
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Present Value Results</h2>

            <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-purple-600 mb-0.5 sm:mb-1">Present Value</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700">{formatCurrencyFull(presentValue)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-purple-600 mt-1">Discounted at {discountRate}% annually</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Future Value:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(totalFutureValue)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Time Value Discount:</span>
                <span className="font-semibold text-red-600">-{formatCurrencyFull(totalFutureValue - presentValue)}</span>
              </div>
              {includeInitialInvestment && (
                <>
                  <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                    <span className="text-gray-600">Initial Investment:</span>
                    <span className="font-semibold text-gray-800">-{formatCurrencyFull(initialInvestment)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                    <span className="text-gray-600">Net Present Value:</span>
                    <span className={`font-semibold ${npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrencyFull(npv)}</span>
                  </div>
                </>
              )}
              {calcType === 'single' && (
                <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                  <span className="text-gray-600">Discount Factor:</span>
                  <span className="font-semibold text-purple-600">{(1 / Math.pow(1 + discountRate / 100, years)).toFixed(4)}</span>
                </div>
              )}
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Value Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Present Value</span>
                  <span className="font-medium">{isFinite(totalFutureValue) ? ((presentValue / totalFutureValue) * 100).toFixed(1) : '—'}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: isFinite(totalFutureValue) ? `${(presentValue / totalFutureValue) * 100}%` : '100%' }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Calculation Summary</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{calcType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium">{discountRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium">{calcType === 'perpetuity' ? 'Forever' : `${calcType === 'annuity' ? periods : years} yrs`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NPV Status:</span>
                  <span className={`font-medium ${npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>{npv >= 0 ? 'Accept' : 'Reject'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Cash Flow & Present Value</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Cumulative PV</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Cash Flow</span>
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
            <defs>
              <linearGradient id="purpleAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="purpleLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
              <filter id="lineShadowPurple" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#9333ea" floodOpacity="0.3"/>
              </filter>
              <filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
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

            {/* Area fill */}
            <path d={generateAreaPath(cashFlowData, 'cumulativePV')} fill="url(#purpleAreaGradient)" />

            {/* Line */}
            <path d={generateLinePath(cashFlowData, 'cumulativePV')} fill="none" stroke="url(#purpleLineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowPurple)" />

            {/* Data points */}
            {cashFlowData.map((d, i) => {
              const x = chartPadding.left + ((i + 1) / cashFlowData.length) * plotWidth;
              const y = chartPadding.top + plotHeight - (d.cumulativePV / maxChartValue) * plotHeight;
              const isHovered = hoveredYear === i;

              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={isHovered ? 8 : 5} fill="white" stroke="#9333ea" strokeWidth={isHovered ? 3 : 2} filter={isHovered ? "url(#glowPurple)" : undefined} className="transition-all duration-200" />
                </g>
              );
            })}

            {/* X-axis labels */}
            {cashFlowData.map((d, i) => {
              const x = chartPadding.left + ((i + 1) / cashFlowData.length) * plotWidth;
              const showLabel = cashFlowData.length <= 12 || i % Math.ceil(cashFlowData.length / 10) === 0 || i === cashFlowData.length - 1;
              return showLabel ? (
                <text key={i} x={x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  Yr {d.year}
                </text>
              ) : null;
            })}

            {/* Hover areas */}
            {cashFlowData.map((_, i) => {
              const x = chartPadding.left + ((i + 1) / cashFlowData.length) * plotWidth;
              const width = plotWidth / cashFlowData.length;
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
                x1={chartPadding.left + ((hoveredYear + 1) / cashFlowData.length) * plotWidth}
                y1={chartPadding.top}
                x2={chartPadding.left + ((hoveredYear + 1) / cashFlowData.length) * plotWidth}
                y2={chartPadding.top + plotHeight}
                stroke="#9333ea"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.6"
              />
            )}
          </svg>

          {/* Tooltip */}
          {hoveredYear !== null && cashFlowData[hoveredYear] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-purple-100"
              style={{
                left: `calc(${((hoveredYear + 1) / cashFlowData.length) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Year {cashFlowData[hoveredYear].year}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gray-500 rounded-full"></span>
                  <span className="text-gray-600">Cash Flow:</span>
                  <span className="font-semibold text-gray-800 ml-auto">{formatCurrencyFull(cashFlowData[hoveredYear].cashFlow)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-600">Present Value:</span>
                  <span className="font-semibold text-purple-600 ml-auto">{formatCurrencyFull(cashFlowData[hoveredYear].presentValue)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="text-gray-600">Cumulative PV:</span>
                  <span className="font-bold text-purple-700 ml-auto">{formatCurrencyFull(cashFlowData[hoveredYear].cumulativePV)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">Discount Rate Sensitivity</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how discount rate changes affect present value</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Lower Rate</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">-2%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium text-green-600">{scenarios.lower.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Present Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrency(scenarios.lower.presentValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrency(scenarios.lower.diff)} more</div>
            </div>
          </div>

          <div className="border-2 border-purple-200 bg-purple-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Rate</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.current.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-purple-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Present Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-purple-700">{formatCurrency(scenarios.current.presentValue)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-red-300 active:border-red-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Rate</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-red-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+2%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium text-red-600">{scenarios.higher.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Present Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrency(scenarios.higher.presentValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-red-600">{formatCurrency(scenarios.higher.diff)} less</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Time Value of Money</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Money today is worth more than the same amount in the future due to earning potential. At {discountRate}% rate, ${formatCurrency(totalFutureValue)} in {calcType === 'perpetuity' ? 'perpetual payments' : `${calcType === 'annuity' ? periods : years} years`} is worth {formatCurrency(presentValue)} today.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">NPV Decision Rule</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              {includeInitialInvestment
                ? npv >= 0
                  ? `NPV of ${formatCurrency(npv)} is positive. This investment adds value and should be accepted.`
                  : `NPV of ${formatCurrency(npv)} is negative. This investment destroys value and should be rejected.`
                : 'Enable initial investment to calculate NPV and make investment decisions based on net value creation.'
              }
            </p>
          </div>
        </div>
      </div>
{/* Cash Flow Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Discounted Cash Flow Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[450px] sm:min-w-[550px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Cash Flow</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Discount Factor</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Present Value</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? cashFlowData : cashFlowData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Yr {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600">{formatCurrencyFull(row.cashFlow)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600 hidden xs:table-cell">{row.discountFactor.toFixed(4)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-purple-600">{formatCurrencyFull(row.presentValue)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-purple-700">{formatCurrencyFull(row.cumulativePV)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {cashFlowData.length > 5 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing first 5 of {cashFlowData.length} periods
                </p>
              )}
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 bg-purple-100 hover:bg-purple-200 active:bg-purple-300 text-purple-700 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation"
              >
                {showFullSchedule ? 'Show Less' : 'Show Full Schedule'}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* SEO Content Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6 prose prose-gray max-w-none">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Present Value</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Present value (PV) is a fundamental concept in finance that determines the current worth of future cash flows.
          It's based on the time value of money principle - a dollar today is worth more than a dollar tomorrow.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Single Payment</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">PV = FV / (1 + r)^n</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Annuity</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">PV = PMT × [(1-(1+r)^-n)/r]</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Perpetuity</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">PV = PMT / r</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Key Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h3 className="text-sm xs:text-base font-semibold text-gray-800 mb-2">Applications</h3>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-purple-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Investment analysis and valuation</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-purple-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Bond pricing and yield analysis</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-purple-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Capital budgeting decisions</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-purple-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Retirement planning</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm xs:text-base font-semibold text-gray-800 mb-2">NPV Decision Rules</h3>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>NPV &gt; 0:</strong> Accept the investment</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>NPV &lt; 0:</strong> Reject the investment</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-gray-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>NPV = 0:</strong> Indifferent</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-purple-500 mt-0.5 flex-shrink-0">•</span>
                <span>Higher NPV is always better</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
{/* Mobile MREC2 - Before FAQs */}

<CalculatorMobileMrec2 />


{/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">What is present value and why does it matter?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Present value is the current worth of future cash flows, discounted at a specific rate. It matters because a dollar today is worth more than a dollar tomorrow due to earning potential. Understanding PV helps compare investment opportunities, value assets, make capital budgeting decisions, and evaluate lottery payouts or structured settlements. It&apos;s fundamental to almost every financial decision involving money over time.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">How do I choose the right discount rate?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              The discount rate should reflect your opportunity cost—what you could earn on alternative investments of similar risk. Use Treasury rates (3-5%) for low-risk comparisons, stock market returns (7-10%) for equity investments, or your company&apos;s WACC for business decisions. For personal finances, your expected return on investments you&apos;d make instead is most appropriate. Higher discount rates result in lower present values.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">What is the difference between NPV and PV?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Present Value (PV) calculates the current worth of future cash flows without considering initial investment. Net Present Value (NPV) subtracts the initial investment from PV to determine net value creation. NPV = PV - Initial Investment. A positive NPV means the investment creates value and should be accepted; negative NPV means it destroys value. NPV is the primary decision metric for capital budgeting.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">What is a perpetuity and when would I use it?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              A perpetuity is a stream of equal payments that continues forever—infinite cash flows. The present value formula simplifies to PV = Payment ÷ Discount Rate. Perpetuities are used to value preferred stock dividends, endowments, certain bonds, and long-lived assets. A $1,000 annual payment at 5% discount rate has a PV of $20,000. Though nothing truly lasts forever, perpetuity calculations are useful approximations for very long-term cash flows.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">How does compounding frequency affect present value?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              More frequent compounding (monthly vs. annually) results in a lower present value because the effective annual rate increases. A 10% rate compounded monthly equals 10.47% annually. When discounting future cash flows, higher effective rates mean those future dollars are worth less today. For accurate calculations, match compounding frequency to how the discount rate is quoted and how cash flows occur.
            </p>
          </div>
          <div>
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">Should I take a lump sum or annuity payment?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Calculate the present value of the annuity at your expected investment return rate and compare to the lump sum. If PV of annuity exceeds lump sum, the annuity is mathematically better (assuming you can achieve that return). However, also consider: your investment discipline, life expectancy, tax implications (annuity spreads taxes), and need for immediate cash. Many people choose lump sums even when annuities have higher PV due to flexibility preferences.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="present-value-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

{/* Related Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-purple-300 active:border-purple-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-purple-600 transition-colors leading-tight">
                  {calc.title}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 leading-tight">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
