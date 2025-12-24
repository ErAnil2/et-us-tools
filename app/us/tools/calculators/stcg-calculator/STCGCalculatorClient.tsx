'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Stcg Calculator?",
    answer: "A Stcg Calculator is a free online tool designed to help you quickly and accurately calculate stcg-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Stcg Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Stcg Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Stcg Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function STCGCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('stcg-calculator');

  const [assetType, setAssetType] = useState('stocks');
  const [purchasePrice, setPurchasePrice] = useState(10000);
  const [salePrice, setSalePrice] = useState(15000);
  const [expenses, setExpenses] = useState(100);
  const [holdingDays, setHoldingDays] = useState(180);
  const [filingStatus, setFilingStatus] = useState('single');
  const [annualIncome, setAnnualIncome] = useState(75000);

  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const assetTypes = {
    stocks: { name: 'Stocks', icon: '📈' },
    crypto: { name: 'Cryptocurrency', icon: '₿' },
    etf: { name: 'ETFs', icon: '📊' },
    bonds: { name: 'Bonds', icon: '📜' },
    options: { name: 'Options', icon: '⚙️' },
    mutual_funds: { name: 'Mutual Funds', icon: '💼' },
    real_estate: { name: 'Real Estate', icon: '🏠' },
    collectibles: { name: 'Collectibles', icon: '🎨' }
  };

  // 2025 Tax brackets
  const taxBrackets = {
    single: [
      { min: 0, max: 11925, rate: 10 },
      { min: 11925, max: 48475, rate: 12 },
      { min: 48475, max: 103350, rate: 22 },
      { min: 103350, max: 197300, rate: 24 },
      { min: 197300, max: 250525, rate: 32 },
      { min: 250525, max: 626350, rate: 35 },
      { min: 626350, max: Infinity, rate: 37 }
    ],
    married_joint: [
      { min: 0, max: 23850, rate: 10 },
      { min: 23850, max: 96950, rate: 12 },
      { min: 96950, max: 206700, rate: 22 },
      { min: 206700, max: 394600, rate: 24 },
      { min: 394600, max: 501050, rate: 32 },
      { min: 501050, max: 751600, rate: 35 },
      { min: 751600, max: Infinity, rate: 37 }
    ],
    married_separate: [
      { min: 0, max: 11925, rate: 10 },
      { min: 11925, max: 48475, rate: 12 },
      { min: 48475, max: 103350, rate: 22 },
      { min: 103350, max: 197300, rate: 24 },
      { min: 197300, max: 250525, rate: 32 },
      { min: 250525, max: 375800, rate: 35 },
      { min: 375800, max: Infinity, rate: 37 }
    ],
    head_household: [
      { min: 0, max: 17000, rate: 10 },
      { min: 17000, max: 64850, rate: 12 },
      { min: 64850, max: 103350, rate: 22 },
      { min: 103350, max: 197300, rate: 24 },
      { min: 197300, max: 250500, rate: 32 },
      { min: 250500, max: 626350, rate: 35 },
      { min: 626350, max: Infinity, rate: 37 }
    ]
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getMarginalRate = (income: number, status: string) => {
    const brackets = taxBrackets[status as keyof typeof taxBrackets] || taxBrackets.single;
    for (const bracket of brackets) {
      if (income >= bracket.min && income < bracket.max) {
        return bracket.rate;
      }
    }
    return 37;
  };

  const results = useMemo(() => {
    const capitalGain = salePrice - purchasePrice - expenses;
    const isShortTerm = holdingDays <= 365;
    const totalIncome = annualIncome + Math.max(0, capitalGain);
    const marginalRate = getMarginalRate(totalIncome, filingStatus);

    let taxAmount = 0;
    if (capitalGain > 0 && isShortTerm) {
      taxAmount = capitalGain * (marginalRate / 100);
    }

    const netProceeds = salePrice - expenses - taxAmount;
    const effectiveRate = capitalGain > 0 ? (taxAmount / capitalGain) * 100 : 0;
    const returnOnInvestment = ((salePrice - purchasePrice - expenses) / purchasePrice) * 100;
    const afterTaxReturn = ((netProceeds - purchasePrice) / purchasePrice) * 100;

    return {
      capitalGain,
      isShortTerm,
      marginalRate,
      taxAmount,
      netProceeds,
      effectiveRate,
      returnOnInvestment,
      afterTaxReturn,
      totalIncome
    };
  }, [purchasePrice, salePrice, expenses, holdingDays, filingStatus, annualIncome]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    // Scenario 1: Hold for long-term (LTCG rates)
    const ltcgRates = { single: 15, married_joint: 15, married_separate: 15, head_household: 15 };
    const ltcgRate = annualIncome < 50000 ? 0 : annualIncome > 500000 ? 20 : 15;
    const ltcgTax = results.capitalGain > 0 ? results.capitalGain * (ltcgRate / 100) : 0;
    const ltcgNet = salePrice - expenses - ltcgTax;
    const ltcgSavings = results.taxAmount - ltcgTax;

    // Scenario 2: Higher income bracket
    const higherIncome = annualIncome + 50000;
    const higherRate = getMarginalRate(higherIncome + Math.max(0, results.capitalGain), filingStatus);
    const higherTax = results.capitalGain > 0 ? results.capitalGain * (higherRate / 100) : 0;
    const higherNet = salePrice - expenses - higherTax;

    // Scenario 3: Tax-loss harvesting (offset gains)
    const offsetAmount = Math.min(results.capitalGain, 3000);
    const reducedGain = Math.max(0, results.capitalGain - offsetAmount);
    const reducedTax = reducedGain * (results.marginalRate / 100);
    const taxSavings = results.taxAmount - reducedTax;

    return {
      longTerm: {
        rate: ltcgRate,
        tax: ltcgTax,
        net: ltcgNet,
        savings: ltcgSavings
      },
      higherBracket: {
        income: higherIncome,
        rate: higherRate,
        tax: higherTax,
        net: higherNet
      },
      taxLossHarvest: {
        offset: offsetAmount,
        reducedGain,
        tax: reducedTax,
        savings: taxSavings
      }
    };
  }, [results, salePrice, expenses, annualIncome, filingStatus]);

  // Comparison table for different holding periods
  const holdingComparison = useMemo(() => {
    const periods = [30, 90, 180, 365, 366, 730];
    return periods.map(days => {
      const isLongTerm = days > 365;
      let rate: number;
      let tax: number;

      if (isLongTerm) {
        rate = annualIncome < 50000 ? 0 : annualIncome > 500000 ? 20 : 15;
      } else {
        rate = results.marginalRate;
      }

      tax = results.capitalGain > 0 ? results.capitalGain * (rate / 100) : 0;
      const net = salePrice - expenses - tax;

      return {
        days,
        label: days <= 365 ? `${days} days (STCG)` : `${Math.round(days / 365)} yr+ (LTCG)`,
        type: isLongTerm ? 'Long-Term' : 'Short-Term',
        rate,
        tax,
        net
      };
    });
  }, [results, salePrice, expenses, annualIncome]);

  // SVG Donut Chart Data
  const chartData = useMemo(() => {
    const segments = [];

    if (results.capitalGain > 0) {
      segments.push(
        { label: 'Purchase Price', value: purchasePrice, color: '#6B7280' },
        { label: 'Net Gain', value: results.capitalGain - results.taxAmount, color: '#10B981' },
        { label: 'STCG Tax', value: results.taxAmount, color: '#EF4444' }
      );
    } else {
      segments.push(
        { label: 'Current Value', value: salePrice, color: '#6B7280' },
        { label: 'Capital Loss', value: Math.abs(results.capitalGain), color: '#EF4444' }
      );
    }

    if (expenses > 0) {
      segments.push({ label: 'Expenses', value: expenses, color: '#F59E0B' });
    }

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let currentAngle = 0;

    return segments.filter(s => s.value > 0).map(segment => {
      const percentage = (segment.value / total) * 100;
      const angle = (segment.value / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return { ...segment, percentage, startAngle, endAngle: currentAngle };
    });
  }, [purchasePrice, salePrice, expenses, results]);

  const createArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = 100 + outerRadius * Math.cos(startRad);
    const y1 = 100 + outerRadius * Math.sin(startRad);
    const x2 = 100 + outerRadius * Math.cos(endRad);
    const y2 = 100 + outerRadius * Math.sin(endRad);
    const x3 = 100 + innerRadius * Math.cos(endRad);
    const y3 = 100 + innerRadius * Math.sin(endRad);
    const x4 = 100 + innerRadius * Math.cos(startRad);
    const y4 = 100 + innerRadius * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const displayedComparison = showFullSchedule ? holdingComparison : holdingComparison.slice(0, 4);

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-100 to-orange-100 px-3 sm:px-4 md:px-6 py-3 rounded-full mb-3 sm:mb-4 md:mb-6">
          <span className="text-2xl">📈</span>
          <span className="text-red-600 font-semibold">Short-Term Capital Gains Calculator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('STCG Tax Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate short-term capital gains tax on stocks, crypto, and other assets held for one year or less.
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Quick Presets */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Scenarios</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setPurchasePrice(5000); setSalePrice(6000); setHoldingDays(90); setAssetType('stocks'); }} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                  Stock Trade ($5K→$6K)
                </button>
                <button onClick={() => { setPurchasePrice(10000); setSalePrice(15000); setHoldingDays(180); setAssetType('crypto'); }} className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors">
                  Crypto ($10K→$15K)
                </button>
                <button onClick={() => { setPurchasePrice(2000); setSalePrice(1500); setHoldingDays(60); setAssetType('stocks'); }} className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors">
                  Loss ($2K→$1.5K)
                </button>
                <button onClick={() => { setPurchasePrice(50000); setSalePrice(75000); setHoldingDays(300); setAssetType('real_estate'); }} className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors">
                  Large Gain ($50K→$75K)
                </button>
              </div>
            </div>

            {/* Asset Details */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Asset Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(assetTypes).map(([key, value]) => (
                      <option key={key} value={key}>{value.icon} {value.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Purchase Price (Cost Basis)</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(purchasePrice)}</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="500000"
                    step="100"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Sale Price</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(salePrice)}</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="500000"
                    step="100"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Transaction Expenses</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(expenses)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Holding Period</span>
                    <span className={`font-semibold ${holdingDays <= 365 ? 'text-red-600' : 'text-green-600'}`}>
                      {holdingDays} days {holdingDays <= 365 ? '(STCG)' : '(LTCG)'}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="730"
                    step="1"
                    value={holdingDays}
                    onChange={(e) => setHoldingDays(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 day</span>
                    <span className="text-red-600">← Short-term | Long-term →</span>
                    <span>2 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filing Status</label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single">Single</option>
                    <option value="married_joint">Married Filing Jointly</option>
                    <option value="married_separate">Married Filing Separately</option>
                    <option value="head_household">Head of Household</option>
                  </select>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Annual Taxable Income</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(annualIncome)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="1000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Result */}
            <div className={`rounded-xl p-6 ${results.capitalGain >= 0 ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'} text-white`}>
              <div className="text-sm font-medium opacity-80 mb-1">
                {results.capitalGain >= 0 ? 'Short-Term Capital Gains Tax' : 'Capital Loss (Tax Benefit)'}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {results.capitalGain >= 0 ? formatCurrency(results.taxAmount) : formatCurrency(0)}
              </div>
              <div className="text-sm opacity-80">
                {results.isShortTerm ? `Taxed at ${results.marginalRate}% (ordinary income rate)` : 'Long-term rates apply'}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-xl p-4 border ${results.capitalGain >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`text-sm ${results.capitalGain >= 0 ? 'text-green-700' : 'text-red-700'}`}>Capital Gain/Loss</div>
                <div className={`text-2xl font-bold ${results.capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.capitalGain)}
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-blue-700">Net Proceeds</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.netProceeds)}</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="text-sm text-purple-700">ROI (Before Tax)</div>
                <div className="text-2xl font-bold text-purple-600">{results.returnOnInvestment.toFixed(1)}%</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="text-sm text-orange-700">ROI (After Tax)</div>
                <div className="text-2xl font-bold text-orange-600">{results.afterTaxReturn.toFixed(1)}%</div>
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Investment Breakdown</h3>
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <svg viewBox="0 0 200 200" className="w-40 h-40">
                  {chartData.map((segment, index) => (
                    <path
                      key={index}
                      d={createArcPath(segment.startAngle, segment.endAngle, 50, 80)}
                      fill={segment.color}
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        transform: hoveredSegment === segment.label ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center'
                      }}
                      onMouseEnter={() => setHoveredSegment(segment.label)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  ))}
                  <text x="100" y="95" textAnchor="middle" className="text-xs fill-gray-500">
                    {hoveredSegment || 'Sale Price'}
                  </text>
                  <text x="100" y="115" textAnchor="middle" className="text-sm font-bold fill-gray-800">
                    {hoveredSegment
                      ? formatCurrency(chartData.find(s => s.label === hoveredSegment)?.value || 0)
                      : formatCurrency(salePrice)}
                  </text>
                </svg>

                <div className="space-y-2">
                  {chartData.map((segment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 cursor-pointer"
                      onMouseEnter={() => setHoveredSegment(segment.label)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <div className="text-sm text-gray-600">{segment.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Tax Calculation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Sale Price</span>
                  <span className="font-semibold">{formatCurrency(salePrice)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Purchase Price (Cost Basis)</span>
                  <span>-{formatCurrency(purchasePrice)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Transaction Expenses</span>
                  <span>-{formatCurrency(expenses)}</span>
                </div>
                <div className={`flex justify-between py-2 border-t font-bold ${results.capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <span>Capital Gain/Loss</span>
                  <span>{formatCurrency(results.capitalGain)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Tax Rate (Marginal)</span>
                  <span>{results.marginalRate}%</span>
                </div>
                <div className="flex justify-between py-2 border-t font-bold text-red-600">
                  <span>STCG Tax</span>
                  <span>{formatCurrency(results.taxAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">What-If Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Long-Term Holding */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📅</span>
              <h3 className="font-semibold text-green-800">Hold 1+ Year (LTCG)</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(scenarios.longTerm.net)}
            </div>
            <p className="text-sm text-green-700 mb-3">Net at {scenarios.longTerm.rate}% LTCG rate</p>
            <div className="text-xs text-green-600 bg-green-100 rounded-lg px-3 py-2">
              Tax savings: {formatCurrency(scenarios.longTerm.savings)}
            </div>
          </div>

          {/* Higher Income */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📊</span>
              <h3 className="font-semibold text-red-800">+$50K Income</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-2">
              {formatCurrency(scenarios.higherBracket.net)}
            </div>
            <p className="text-sm text-red-700 mb-3">At {scenarios.higherBracket.rate}% bracket</p>
            <div className="text-xs text-red-600 bg-red-100 rounded-lg px-3 py-2">
              Additional tax: {formatCurrency(scenarios.higherBracket.tax - results.taxAmount)}
            </div>
          </div>

          {/* Tax-Loss Harvesting */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📉</span>
              <h3 className="font-semibold text-blue-800">Tax-Loss Harvest</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(scenarios.taxLossHarvest.savings)}
            </div>
            <p className="text-sm text-blue-700 mb-3">Offset {formatCurrency(scenarios.taxLossHarvest.offset)} in gains</p>
            <div className="text-xs text-blue-600 bg-blue-100 rounded-lg px-3 py-2">
              Reduced gain: {formatCurrency(scenarios.taxLossHarvest.reducedGain)}
            </div>
          </div>
        </div>
      </div>

      {/* Holding Period Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Holding Period Comparison</h2>
          <span className="text-sm text-gray-500">Same gain at different holding periods</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Holding Period</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Tax Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Tax Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Proceeds</th>
              </tr>
            </thead>
            <tbody>
              {displayedComparison.map((row, index) => (
                <tr key={index} className={`border-b ${row.days === holdingDays ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <td className="py-3 px-4 font-medium">{row.label}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.type === 'Long-Term' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">{row.rate}%</td>
                  <td className="text-right py-3 px-4 text-red-600">{formatCurrency(row.tax)}</td>
                  <td className="text-right py-3 px-4 text-green-600 font-medium">{formatCurrency(row.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {holdingComparison.length > 4 && (
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
          >
            {showFullSchedule ? 'Show Less' : 'Show All Periods'}
            <svg className={`w-4 h-4 transition-transform ${showFullSchedule ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
{/* 2025 Tax Brackets */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">2025 Tax Brackets (Single Filer)</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-red-50 rounded-lg p-5">
            <h3 className="font-semibold text-red-800 mb-3">Short-Term Capital Gains (Ordinary Income)</h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li className="flex justify-between"><span>$0 - $11,925:</span><span className="font-medium">10%</span></li>
              <li className="flex justify-between"><span>$11,926 - $48,475:</span><span className="font-medium">12%</span></li>
              <li className="flex justify-between"><span>$48,476 - $103,350:</span><span className="font-medium">22%</span></li>
              <li className="flex justify-between"><span>$103,351 - $197,300:</span><span className="font-medium">24%</span></li>
              <li className="flex justify-between"><span>$197,301 - $250,525:</span><span className="font-medium">32%</span></li>
              <li className="flex justify-between"><span>$250,526 - $626,350:</span><span className="font-medium">35%</span></li>
              <li className="flex justify-between"><span>Over $626,350:</span><span className="font-medium">37%</span></li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-5">
            <h3 className="font-semibold text-green-800 mb-3">Long-Term Capital Gains (Preferential Rates)</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex justify-between"><span>$0 - $47,025:</span><span className="font-medium">0%</span></li>
              <li className="flex justify-between"><span>$47,026 - $518,900:</span><span className="font-medium">15%</span></li>
              <li className="flex justify-between"><span>Over $518,900:</span><span className="font-medium">20%</span></li>
            </ul>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-xs text-green-800">
                Hold assets for more than 1 year to qualify for these lower long-term rates!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax-Saving Strategies</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Hold for Long-Term</h4>
              <p className="text-sm text-gray-600">Wait 1+ year to qualify for lower long-term capital gains rates.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Tax-Loss Harvesting</h4>
              <p className="text-sm text-gray-600">Sell losing investments to offset gains and reduce your tax bill.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Time Your Sales</h4>
              <p className="text-sm text-gray-600">Consider selling in years when your income is lower for better rates.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Use Tax-Advantaged Accounts</h4>
              <p className="text-sm text-gray-600">IRAs and 401(k)s allow tax-free or tax-deferred growth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">{calc.icon || '📊'}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="stcg-calculator" fallbackFaqs={fallbackFaqs} />
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
              This calculator provides estimates for informational purposes only. Actual tax liability depends on your
              complete tax situation. Consult a qualified tax professional for personalized advice.
            </p>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
