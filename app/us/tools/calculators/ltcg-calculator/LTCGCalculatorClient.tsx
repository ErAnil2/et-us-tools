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

// 2025 LTCG Tax Brackets
const ltcgTaxBrackets = {
  single: [
    { min: 0, max: 49700, rate: 0 },
    { min: 49700, max: 547200, rate: 15 },
    { min: 547200, max: Infinity, rate: 20 }
  ],
  married_joint: [
    { min: 0, max: 99400, rate: 0 },
    { min: 99400, max: 614700, rate: 15 },
    { min: 614700, max: Infinity, rate: 20 }
  ],
  married_separate: [
    { min: 0, max: 49700, rate: 0 },
    { min: 49700, max: 307350, rate: 15 },
    { min: 307350, max: Infinity, rate: 20 }
  ],
  head_household: [
    { min: 0, max: 66600, rate: 0 },
    { min: 66600, max: 582050, rate: 15 },
    { min: 582050, max: Infinity, rate: 20 }
  ]
};

const assetTypes = [
  { value: 'stocks', label: 'Stocks', icon: '📈' },
  { value: 'etf', label: 'ETFs', icon: '📊' },
  { value: 'mutual_funds', label: 'Mutual Funds', icon: '💼' },
  { value: 'bonds', label: 'Bonds', icon: '📜' },
  { value: 'real_estate', label: 'Real Estate', icon: '🏠' },
  { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
  { value: 'collectibles', label: 'Collectibles', icon: '🎨' },
  { value: 'other', label: 'Other Assets', icon: '💰' }
];

const filingStatuses = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married Filing Jointly' },
  { value: 'married_separate', label: 'Married Filing Separately' },
  { value: 'head_household', label: 'Head of Household' }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Ltcg Calculator?",
    answer: "A Ltcg Calculator is a free online tool designed to help you quickly and accurately calculate ltcg-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Ltcg Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Ltcg Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Ltcg Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function LTCGCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('ltcg-calculator');

  const [assetType, setAssetType] = useState('stocks');
  const [purchasePrice, setPurchasePrice] = useState(50000);
  const [salePrice, setSalePrice] = useState(80000);
  const [holdingPeriodMonths, setHoldingPeriodMonths] = useState(24);
  const [filingStatus, setFilingStatus] = useState('single');
  const [annualIncome, setAnnualIncome] = useState(85000);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getLTCGTaxRate = (income: number, status: string): number => {
    const brackets = ltcgTaxBrackets[status as keyof typeof ltcgTaxBrackets] || ltcgTaxBrackets.single;
    for (const bracket of brackets) {
      if (income >= bracket.min && income < bracket.max) {
        return bracket.rate;
      }
    }
    return 20;
  };

  const getOrdinaryTaxRate = (income: number, status: string): number => {
    // Simplified ordinary income tax rates for STCG comparison
    const brackets = status === 'married_joint' ? [
      { min: 0, max: 23850, rate: 10 },
      { min: 23850, max: 96950, rate: 12 },
      { min: 96950, max: 206700, rate: 22 },
      { min: 206700, max: 394600, rate: 24 },
      { min: 394600, max: 501050, rate: 32 },
      { min: 501050, max: 751600, rate: 35 },
      { min: 751600, max: Infinity, rate: 37 }
    ] : [
      { min: 0, max: 11925, rate: 10 },
      { min: 11925, max: 48475, rate: 12 },
      { min: 48475, max: 103350, rate: 22 },
      { min: 103350, max: 197300, rate: 24 },
      { min: 197300, max: 250525, rate: 32 },
      { min: 250525, max: 626350, rate: 35 },
      { min: 626350, max: Infinity, rate: 37 }
    ];

    for (const bracket of brackets) {
      if (income >= bracket.min && income < bracket.max) {
        return bracket.rate;
      }
    }
    return 37;
  };

  const results = useMemo(() => {
    const isLongTerm = holdingPeriodMonths > 12;
    const capitalGains = Math.max(0, salePrice - purchasePrice);
    const totalIncome = annualIncome + capitalGains;

    let taxRate: number;
    let taxType: string;

    if (isLongTerm) {
      taxRate = getLTCGTaxRate(totalIncome, filingStatus);
      taxType = 'Long-Term Capital Gains';
    } else {
      taxRate = getOrdinaryTaxRate(totalIncome, filingStatus);
      taxType = 'Short-Term (Ordinary Income)';
    }

    const capitalGainsTax = capitalGains * (taxRate / 100);

    // Net Investment Income Tax (NIIT) - 3.8% on investment income for high earners
    const niitThreshold = filingStatus === 'married_joint' ? 250000 :
                          filingStatus === 'married_separate' ? 125000 : 200000;
    const niitApplies = totalIncome > niitThreshold;
    const niitTax = niitApplies ? capitalGains * 0.038 : 0;

    const totalTax = capitalGainsTax + niitTax;
    const netProceeds = salePrice - totalTax;
    const effectiveRate = capitalGains > 0 ? (totalTax / capitalGains) * 100 : 0;
    const returnOnInvestment = purchasePrice > 0 ? ((salePrice - purchasePrice) / purchasePrice) * 100 : 0;
    const netGains = capitalGains - totalTax;

    return {
      isLongTerm,
      capitalGains,
      taxRate,
      taxType,
      capitalGainsTax,
      niitApplies,
      niitTax,
      totalTax,
      netProceeds,
      effectiveRate,
      returnOnInvestment,
      netGains,
      holdingYears: Math.floor(holdingPeriodMonths / 12),
      holdingMonthsRemaining: holdingPeriodMonths % 12
    };
  }, [purchasePrice, salePrice, holdingPeriodMonths, filingStatus, annualIncome]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const capitalGains = Math.max(0, salePrice - purchasePrice);

    // Scenario 1: 0% Tax Bracket (Lower income)
    const zeroRateBrackets = ltcgTaxBrackets[filingStatus as keyof typeof ltcgTaxBrackets];
    const zeroRateThreshold = zeroRateBrackets[0].max;
    const incomeForZeroRate = Math.max(0, zeroRateThreshold - capitalGains - 1000);
    const zeroRateTax = 0;
    const zeroRateNiit = 0;

    // Scenario 2: Higher Income (+$100K)
    const higherIncome = annualIncome + 100000;
    const higherTotalIncome = higherIncome + capitalGains;
    const higherRate = getLTCGTaxRate(higherTotalIncome, filingStatus);
    const higherTax = capitalGains * (higherRate / 100);
    const higherNiitThreshold = filingStatus === 'married_joint' ? 250000 :
                                 filingStatus === 'married_separate' ? 125000 : 200000;
    const higherNiit = higherTotalIncome > higherNiitThreshold ? capitalGains * 0.038 : 0;

    // Scenario 3: Tax-Loss Harvesting (offset gains)
    const harvestAmount = Math.min(capitalGains, 50000);
    const reducedGains = capitalGains - harvestAmount;
    const reducedTotalIncome = annualIncome + reducedGains;
    const reducedRate = getLTCGTaxRate(reducedTotalIncome, filingStatus);
    const reducedTax = reducedGains * (reducedRate / 100);
    const reducedNiit = reducedTotalIncome > (filingStatus === 'married_joint' ? 250000 : 200000) ? reducedGains * 0.038 : 0;

    return [
      {
        name: '0% Tax Bracket',
        description: `Income ≤${formatCurrency(zeroRateThreshold)}`,
        tax: zeroRateTax + zeroRateNiit,
        savings: results.totalTax - (zeroRateTax + zeroRateNiit),
        rate: 0,
        color: 'bg-green-100 border-green-300'
      },
      {
        name: '+$100K Income',
        description: `Total: ${formatCurrency(higherIncome)}`,
        tax: higherTax + higherNiit,
        savings: results.totalTax - (higherTax + higherNiit),
        rate: higherRate + (higherNiit > 0 ? 3.8 : 0),
        color: 'bg-orange-100 border-orange-300'
      },
      {
        name: 'Tax-Loss Harvest',
        description: `Offset ${formatCurrency(harvestAmount)}`,
        tax: reducedTax + reducedNiit,
        savings: results.totalTax - (reducedTax + reducedNiit),
        rate: reducedRate,
        color: 'bg-purple-100 border-purple-300'
      }
    ];
  }, [purchasePrice, salePrice, filingStatus, annualIncome, results.totalTax]);

  // Holding Period Analysis
  const holdingAnalysis = useMemo(() => {
    const capitalGains = Math.max(0, salePrice - purchasePrice);
    const periods = [6, 12, 18, 24, 36, 60];

    return periods.map(months => {
      const isLong = months > 12;
      const totalIncome = annualIncome + capitalGains;
      const rate = isLong ? getLTCGTaxRate(totalIncome, filingStatus) : getOrdinaryTaxRate(totalIncome, filingStatus);
      const tax = capitalGains * (rate / 100);
      const niitThreshold = filingStatus === 'married_joint' ? 250000 : 200000;
      const niit = totalIncome > niitThreshold ? capitalGains * 0.038 : 0;

      return {
        months,
        label: months < 12 ? `${months} mo` : `${months / 12} yr`,
        type: isLong ? 'LTCG' : 'STCG',
        rate,
        tax: tax + niit,
        netGains: capitalGains - tax - niit
      };
    });
  }, [purchasePrice, salePrice, filingStatus, annualIncome]);

  // SVG Donut Chart
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

  const chartData = useMemo(() => {
    const total = salePrice;
    if (total === 0) return [];

    const segments = [
      { label: 'Cost Basis', value: purchasePrice, color: '#6B7280' },
      { label: 'Net Gains', value: results.netGains, color: '#10B981' },
      { label: 'Capital Gains Tax', value: results.capitalGainsTax, color: '#EF4444' }
    ];

    if (results.niitTax > 0) {
      segments.push({ label: 'NIIT (3.8%)', value: results.niitTax, color: '#F59E0B' });
    }

    let currentAngle = 0;
    return segments.filter(s => s.value > 0).map(segment => {
      const angle = (segment.value / total) * 360;
      const path = createArcPath(currentAngle, currentAngle + angle - 0.5, 50, 80);
      const midAngle = currentAngle + angle / 2;
      currentAngle += angle;
      return { ...segment, path, angle, midAngle };
    });
  }, [purchasePrice, salePrice, results]);

  const quickPresets = [
    { label: 'Stock Sale', purchase: 25000, sale: 40000, months: 18, income: 75000 },
    { label: 'Real Estate', purchase: 300000, sale: 450000, months: 60, income: 120000 },
    { label: 'ETF Portfolio', purchase: 50000, sale: 75000, months: 36, income: 95000 },
    { label: 'High Earner', purchase: 100000, sale: 180000, months: 24, income: 400000 }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Long-Term Capital Gains Calculator')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate your LTCG tax on investments held over one year with 2025 tax brackets
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Quick Presets */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {quickPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setPurchasePrice(preset.purchase);
                setSalePrice(preset.sale);
                setHoldingPeriodMonths(preset.months);
                setAnnualIncome(preset.income);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Details</h2>

            {/* Asset Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
              <div className="grid grid-cols-4 gap-2">
                {assetTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setAssetType(type.value)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      assetType === type.value
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-lg">{type.icon}</div>
                    <div className="text-xs mt-1">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Basis (Purchase Price): {formatCurrency(purchasePrice)}
              </label>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$1,000</span>
                <span>$1,000,000</span>
              </div>
            </div>

            {/* Sale Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price: {formatCurrency(salePrice)}
              </label>
              <input
                type="range"
                min="1000"
                max="2000000"
                step="1000"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$1,000</span>
                <span>$2,000,000</span>
              </div>
            </div>

            {/* Holding Period */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holding Period: {results.holdingYears > 0 ? `${results.holdingYears} yr` : ''} {results.holdingMonthsRemaining > 0 ? `${results.holdingMonthsRemaining} mo` : holdingPeriodMonths === 12 ? '12 mo' : ''}
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                  results.isLongTerm ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {results.isLongTerm ? 'LTCG' : 'STCG'}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="120"
                value={holdingPeriodMonths}
                onChange={(e) => setHoldingPeriodMonths(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 month</span>
                <span className="text-green-600 font-medium">← 12+ mo = LTCG</span>
                <span>10 years</span>
              </div>
            </div>

            {/* Annual Income */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income (excluding gains): {formatCurrency(annualIncome)}
              </label>
              <input
                type="range"
                min="0"
                max="750000"
                step="5000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$750,000</span>
              </div>
            </div>

            {/* Filing Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filing Status</label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {filingStatuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax Calculation</h2>

            {/* Gain Type Indicator */}
            <div className={`mb-4 p-4 rounded-lg border-2 ${
              results.isLongTerm ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm font-medium ${results.isLongTerm ? 'text-green-700' : 'text-orange-700'}`}>
                    {results.taxType}
                  </div>
                  <div className={`text-2xl font-bold ${results.isLongTerm ? 'text-green-600' : 'text-orange-600'}`}>
                    {results.taxRate}% Rate
                    {results.niitApplies && <span className="text-sm font-normal ml-1">+ 3.8% NIIT</span>}
                  </div>
                </div>
                <div className={`text-4xl ${results.isLongTerm ? 'text-green-500' : 'text-orange-500'}`}>
                  {results.isLongTerm ? '✓' : '⏳'}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="text-xs text-gray-600">Capital Gains</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.capitalGains)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="text-xs text-gray-600">ROI</div>
                <div className={`text-lg font-bold ${results.returnOnInvestment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.returnOnInvestment.toFixed(1)}%
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="text-xs text-red-600">Total Tax</div>
                <div className="text-lg font-bold text-red-600">{formatCurrency(results.totalTax)}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-xs text-green-600">Net Proceeds</div>
                <div className="text-lg font-bold text-green-600">{formatCurrency(results.netProceeds)}</div>
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Investment Breakdown</h3>
              <div className="flex justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                  {chartData.map((segment, index) => (
                    <path
                      key={index}
                      d={segment.path}
                      fill={segment.color}
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        transform: hoveredSegment === segment.label ? 'scale(1.03)' : 'scale(1)',
                        transformOrigin: '100px 100px',
                        opacity: hoveredSegment && hoveredSegment !== segment.label ? 0.5 : 1
                      }}
                      onMouseEnter={() => setHoveredSegment(segment.label)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  ))}
                  <circle cx="100" cy="100" r="40" fill="white" />
                  <text x="100" y="95" textAnchor="middle" className="text-xs fill-gray-500">
                    {hoveredSegment || 'Net Gains'}
                  </text>
                  <text x="100" y="112" textAnchor="middle" className="text-sm font-bold fill-gray-800">
                    {formatCurrency(hoveredSegment
                      ? chartData.find(s => s.label === hoveredSegment)?.value || 0
                      : results.netGains
                    )}
                  </text>
                </svg>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                {chartData.map((segment, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="text-xs text-gray-600">{segment.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NIIT Warning */}
            {results.niitApplies && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500">⚠️</span>
                  <div>
                    <div className="text-sm font-medium text-amber-800">Net Investment Income Tax Applies</div>
                    <div className="text-xs text-amber-700">
                      Additional 3.8% NIIT ({formatCurrency(results.niitTax)}) applies because total income exceeds threshold.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">What-If Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className={`${scenario.color} rounded-lg p-4 border`}>
              <div className="text-sm font-semibold text-gray-800">{scenario.name}</div>
              <div className="text-xs text-gray-600 mb-2">{scenario.description}</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(scenario.tax)}</div>
              <div className="text-xs text-gray-600">Tax at {scenario.rate}% rate</div>
              {scenario.savings !== 0 && (
                <div className={`text-sm font-medium mt-2 ${scenario.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {scenario.savings > 0 ? `Save ${formatCurrency(scenario.savings)}` : `Extra ${formatCurrency(Math.abs(scenario.savings))}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Holding Period Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Holding Period Comparison</h2>
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showFullSchedule ? 'Show Less' : 'Show Full Analysis'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Period</th>
                <th className="px-3 py-2 text-center">Type</th>
                <th className="px-3 py-2 text-right">Rate</th>
                <th className="px-3 py-2 text-right">Tax</th>
                <th className="px-3 py-2 text-right">Net Gains</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? holdingAnalysis : holdingAnalysis.slice(0, 4)).map((period, index) => (
                <tr
                  key={index}
                  className={`border-t ${period.months === holdingPeriodMonths ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-3 py-2 font-medium">{period.label}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      period.type === 'LTCG' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {period.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">{period.rate}%</td>
                  <td className="px-3 py-2 text-right text-red-600">{formatCurrency(period.tax)}</td>
                  <td className="px-3 py-2 text-right text-green-600 font-medium">{formatCurrency(period.netGains)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!results.isLongTerm && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">💡</span>
              <div className="text-sm text-blue-800">
                <strong>Tip:</strong> Hold for {13 - holdingPeriodMonths} more month{13 - holdingPeriodMonths > 1 ? 's' : ''} to qualify for LTCG rates and potentially save {formatCurrency(holdingAnalysis.find(p => p.months === 18)?.tax ? results.totalTax - (holdingAnalysis.find(p => p.months === 18)?.tax || 0) : 0)} in taxes.
              </div>
            </div>
          </div>
        )}
      </div>
{/* 2025 LTCG Tax Brackets */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">2025 Long-Term Capital Gains Tax Brackets</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Filing Status</th>
                <th className="px-3 py-2 text-center text-green-600">0% Rate</th>
                <th className="px-3 py-2 text-center text-blue-600">15% Rate</th>
                <th className="px-3 py-2 text-center text-purple-600">20% Rate</th>
              </tr>
            </thead>
            <tbody>
              {filingStatuses.map((status) => {
                const brackets = ltcgTaxBrackets[status.value as keyof typeof ltcgTaxBrackets];
                return (
                  <tr key={status.value} className={`border-t ${filingStatus === status.value ? 'bg-blue-50' : ''}`}>
                    <td className="px-3 py-2 font-medium">{status.label}</td>
                    <td className="px-3 py-2 text-center text-green-700">
                      Up to {formatCurrency(brackets[0].max)}
                    </td>
                    <td className="px-3 py-2 text-center text-blue-700">
                      {formatCurrency(brackets[0].max)} - {formatCurrency(brackets[1].max)}
                    </td>
                    <td className="px-3 py-2 text-center text-purple-700">
                      Over {formatCurrency(brackets[1].max)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          * High earners may also owe an additional 3.8% Net Investment Income Tax (NIIT) on capital gains.
        </p>
      </div>

      {/* Tax Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">LTCG Tax Strategies</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <h3 className="font-semibold text-gray-800">Hold for 12+ Months</h3>
                <p className="text-sm text-gray-600">Qualify for preferential LTCG rates (0%, 15%, or 20%) instead of ordinary income rates (up to 37%).</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📉</span>
              <div>
                <h3 className="font-semibold text-gray-800">Tax-Loss Harvesting</h3>
                <p className="text-sm text-gray-600">Sell losing investments to offset gains. Up to $3,000 in net losses can offset ordinary income.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-semibold text-gray-800">Manage Your Tax Bracket</h3>
                <p className="text-sm text-gray-600">Time asset sales in low-income years. 0% LTCG rate applies to lower income levels.</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <h3 className="font-semibold text-gray-800">Gift Appreciated Assets</h3>
                <p className="text-sm text-gray-600">Gift stocks to family in lower tax brackets or donate to charity to avoid capital gains entirely.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.slice(0, 8).map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Long-Term Capital Gains Tax</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Long-term capital gains (LTCG) tax applies to profits from selling assets held for more than one year. The US tax code incentivizes long-term investing by taxing these gains at preferential rates—0%, 15%, or 20%—compared to short-term gains which are taxed as ordinary income at rates up to 37%. This differential can save investors thousands of dollars annually, making holding period planning a critical component of tax-efficient investing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 text-base">0% LTCG Rate</h3>
            <p className="text-xs text-gray-600">Applies to single filers with taxable income up to $47,025 and married filing jointly up to $94,050 in 2025.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 text-base">15% LTCG Rate</h3>
            <p className="text-xs text-gray-600">The most common bracket, applying to single filers earning $47,026-$518,900 and MFJ earning $94,051-$583,750.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2 text-base">20% LTCG Rate</h3>
            <p className="text-xs text-gray-600">Reserved for high earners exceeding the 15% thresholds. Additional 3.8% NIIT may also apply.</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">LTCG vs Short-Term Capital Gains</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          The distinction between long-term and short-term capital gains hinges on your holding period—exactly 365 days or less triggers short-term treatment, while holding 366+ days qualifies for LTCG rates. Short-term gains are taxed as ordinary income, meaning a high earner in the 37% bracket selling stocks after 11 months pays nearly double the tax compared to waiting one more month. For a $100,000 gain, this could mean $37,000 in taxes versus $20,000—a $17,000 difference from a single month&apos;s patience.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Net Investment Income Tax (NIIT)</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          High-income investors face an additional 3.8% Net Investment Income Tax on capital gains when modified adjusted gross income exceeds $200,000 (single) or $250,000 (married filing jointly). This surtax applies to the lesser of net investment income or the amount by which MAGI exceeds the threshold. Combined with the 20% top LTCG rate, the effective maximum federal rate on long-term capital gains reaches 23.8%, before considering state taxes which can add another 0-13.3% depending on your state.
        </p>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How is the holding period calculated for capital gains?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The holding period begins the day after you acquire the asset and includes the day you sell it. For securities purchased through a broker, the acquisition date is the trade date (not settlement date). To qualify for long-term treatment, you must hold the asset for more than one year—so stock purchased on January 15, 2024 must be sold on January 16, 2025 or later to receive LTCG rates. Inherited assets automatically qualify for long-term treatment regardless of how long you hold them.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Can I use capital losses to offset capital gains?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes, capital losses first offset capital gains of the same type (short-term losses offset short-term gains, long-term losses offset long-term gains). Remaining losses then offset gains of the other type. If losses exceed gains, you can deduct up to $3,000 ($1,500 if married filing separately) against ordinary income annually. Unused losses carry forward indefinitely to future tax years. This makes tax-loss harvesting—intentionally selling losing positions—a powerful year-end tax strategy.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the wash sale rule and how does it affect capital gains?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The wash sale rule disallows a capital loss deduction if you purchase substantially identical securities within 30 days before or after selling at a loss. This prevents investors from selling to harvest losses while immediately repurchasing the same investment. The disallowed loss adds to the cost basis of the replacement shares, deferring (not eliminating) the tax benefit. The rule applies across all your accounts, including IRAs, and to options and contracts on the same securities.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Are there special capital gains rates for collectibles or real estate?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes, different assets receive different treatment. Collectibles (art, antiques, precious metals, coins) are taxed at a maximum 28% rate for long-term gains. Real estate gains may qualify for Section 1031 like-kind exchanges to defer taxes, and primary residence sales can exclude up to $250,000 ($500,000 for married couples) of gains under Section 121. Qualified small business stock (QSBS) held over 5 years may exclude 100% of gains up to $10 million under Section 1202.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How do I minimize capital gains taxes legally?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Several strategies can reduce capital gains tax burden: (1) Hold investments over one year to qualify for LTCG rates; (2) Use tax-loss harvesting to offset gains; (3) Time sales during low-income years to potentially qualify for 0% rates; (4) Donate appreciated assets to charity to avoid gains entirely and receive a deduction; (5) Gift appreciated assets to family members in lower tax brackets; (6) Use qualified opportunity zone investments to defer and reduce gains; (7) Maximize contributions to tax-advantaged accounts like 401(k)s and IRAs.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Do I owe capital gains tax on cryptocurrency?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes, the IRS treats cryptocurrency as property, not currency, so all dispositions—including sales, exchanges, and payments for goods—trigger capital gains or losses. Trading one cryptocurrency for another is a taxable event. The same holding period rules apply: hold for over one year for LTCG treatment. Crypto tax reporting has increased scrutiny; exchanges now issue 1099 forms, and the IRS has added a digital asset question to Form 1040. Consider using crypto tax software to track cost basis across multiple wallets and exchanges.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="ltcg-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center">
          <strong>Disclaimer:</strong> This calculator provides estimates based on 2025 federal tax rates.
          Actual taxes may vary based on state taxes, AMT, specific deductions, and individual circumstances.
          Consult a qualified tax professional for personalized advice.
        </p>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
