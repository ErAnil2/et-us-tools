'use client';

import { useState, useEffect } from 'react';
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
  faqSchema?: any;
  calculatorSchema?: any;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Pay Raise Calculator?",
    answer: "A Pay Raise Calculator is a free online tool designed to help you quickly and accurately calculate pay raise-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Pay Raise Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Pay Raise Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Pay Raise Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PayRaiseCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Main calculator states
  const { getH1, getSubHeading } = usePageSEO('pay-raise-calculator');

  const [currentSalary, setCurrentSalary] = useState(60000);
  const [raiseType, setRaiseType] = useState<'percentage' | 'amount'>('percentage');
  const [raisePercentage, setRaisePercentage] = useState(5);
  const [raiseAmount, setRaiseAmount] = useState(3000);
  const [taxRate, setTaxRate] = useState(25);

  // Results states
  const [newSalary, setNewSalary] = useState(0);
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [monthlyIncrease, setMonthlyIncrease] = useState(0);
  const [weeklyIncrease, setWeeklyIncrease] = useState(0);
  const [hourlyIncrease, setHourlyIncrease] = useState(0);
  const [monthlyTakeHome, setMonthlyTakeHome] = useState(0);
  const [annualTakeHome, setAnnualTakeHome] = useState(0);
  const [percentageDisplay, setPercentageDisplay] = useState(0);

  // Lifetime calculator states
  const [lifetimeCurrentSalary, setLifetimeCurrentSalary] = useState(75000);
  const [lifetimeRaisePercent, setLifetimeRaisePercent] = useState(6);
  const [yearsRemaining, setYearsRemaining] = useState(25);
  const [lifetimeTotal, setLifetimeTotal] = useState(0);
  const [tenYearImpact, setTenYearImpact] = useState(0);
  const [twentyYearImpact, setTwentyYearImpact] = useState(0);
  const [compoundingEffect, setCompoundingEffect] = useState(0);
  const [lifetimeInsights, setLifetimeInsights] = useState('');

  // Negotiation calculator states
  const [negCurrentSalary, setNegCurrentSalary] = useState(85000);
  const [targetRaise, setTargetRaise] = useState(8);
  const [marketRate, setMarketRate] = useState(95000);
  const [performanceRating, setPerformanceRating] = useState('exceeds');
  const [marketGap, setMarketGap] = useState('');
  const [marketAnalysis, setMarketAnalysis] = useState('');
  const [recommendedAsk, setRecommendedAsk] = useState('');
  const [askRationale, setAskRationale] = useState('');
  const [negotiationStrength, setNegotiationStrength] = useState('');
  const [strengthFactors, setStrengthFactors] = useState('');
  const [alternativeStrategy, setAlternativeStrategy] = useState('');

  useEffect(() => {
    calculateRaise();
  }, [currentSalary, raiseType, raisePercentage, raiseAmount, taxRate]);

  useEffect(() => {
    calculateLifetimeImpact();
  }, [lifetimeCurrentSalary, lifetimeRaisePercent, yearsRemaining]);

  useEffect(() => {
    calculateNegotiation();
  }, [negCurrentSalary, targetRaise, marketRate, performanceRating]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrencyPrecise = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateRaise = () => {
    let calculatedRaiseAmount: number;
    let calculatedRaisePercentage: number;

    if (raiseType === 'percentage') {
      calculatedRaisePercentage = raisePercentage;
      calculatedRaiseAmount = (currentSalary * raisePercentage) / 100;
    } else {
      calculatedRaiseAmount = raiseAmount;
      calculatedRaisePercentage = currentSalary > 0 ? (raiseAmount / currentSalary) * 100 : 0;
    }

    const calculatedNewSalary = currentSalary + calculatedRaiseAmount;
    const calculatedMonthlyIncrease = calculatedRaiseAmount / 12;
    const calculatedWeeklyIncrease = calculatedRaiseAmount / 52;
    const calculatedHourlyIncrease = calculatedRaiseAmount / (52 * 40);

    const taxMultiplier = (100 - taxRate) / 100;
    const calculatedAnnualTakeHome = calculatedRaiseAmount * taxMultiplier;
    const calculatedMonthlyTakeHome = calculatedAnnualTakeHome / 12;

    setNewSalary(calculatedNewSalary);
    setAnnualIncrease(calculatedRaiseAmount);
    setMonthlyIncrease(calculatedMonthlyIncrease);
    setWeeklyIncrease(calculatedWeeklyIncrease);
    setHourlyIncrease(calculatedHourlyIncrease);
    setAnnualTakeHome(calculatedAnnualTakeHome);
    setMonthlyTakeHome(calculatedMonthlyTakeHome);
    setPercentageDisplay(calculatedRaisePercentage);
  };

  const calculateLifetimeImpact = () => {
    const raiseAmt = (lifetimeCurrentSalary * lifetimeRaisePercent) / 100;

    let totalLifetime = 0;
    let tenYear = 0;
    let twentyYear = 0;

    for (let year = 1; year <= yearsRemaining; year++) {
      totalLifetime += raiseAmt;
      if (year <= 10) tenYear += raiseAmt;
      if (year <= 20) twentyYear += raiseAmt;
    }

    const compounding = totalLifetime * 0.35;
    const totalWithCompounding = totalLifetime + compounding;

    setLifetimeTotal(totalWithCompounding);
    setTenYearImpact(tenYear);
    setTwentyYearImpact(twentyYear);
    setCompoundingEffect(compounding);

    const insights = `A ${lifetimeRaisePercent}% raise on a ${formatCurrency(lifetimeCurrentSalary)} salary creates a lifetime earnings increase of ${formatCurrency(totalWithCompounding)} over ${yearsRemaining} years due to compounding effects.`;
    setLifetimeInsights(insights);
  };

  const calculateNegotiation = () => {
    const marketGapPercent = ((marketRate - negCurrentSalary) / negCurrentSalary) * 100;
    const marketGapText = marketGapPercent > 0 ?
      `${marketGapPercent.toFixed(1)}% below market` :
      `${Math.abs(marketGapPercent).toFixed(1)}% above market`;

    let strength = 'Moderate';
    let strengthFacs = 'Average performance, fair market position';

    if (performanceRating === 'exceeds' && marketGapPercent > 5) {
      strength = 'Very Strong';
      strengthFacs = 'High performance, below-market compensation';
    } else if (performanceRating === 'exceeds' || marketGapPercent > 8) {
      strength = 'Strong';
      strengthFacs = 'Above-market performance or below-market pay';
    } else if (performanceRating === 'below' && marketGapPercent < -5) {
      strength = 'Weak';
      strengthFacs = 'Below-market performance, above-market pay';
    }

    let recommendedPercent = targetRaise;
    if (marketGapPercent > 10) {
      recommendedPercent = Math.min(targetRaise + 2, marketGapPercent * 0.8);
    }
    const recommendedSalary = negCurrentSalary * (1 + recommendedPercent / 100);

    let marketAnal = 'Reasonable request';
    if (marketGapPercent > 10) {
      marketAnal = 'Strong justification for increase';
    } else if (marketGapPercent < -5) {
      marketAnal = 'Consider timing and performance';
    }

    let rationale = 'Standard increase request';
    if (recommendedPercent <= 5) {
      rationale = 'Conservative but justified request';
    } else if (recommendedPercent > 10) {
      rationale = 'Aggressive but market-supported';
    }

    let altStrategy = 'Consider additional professional development opportunities.';
    if (strength === 'Weak') {
      altStrategy = 'Focus on performance improvement before negotiating salary.';
    } else if (marketGapPercent < 0) {
      altStrategy = 'Consider requesting additional benefits or flexible work arrangements if salary budget is limited.';
    }

    setMarketGap(marketGapText);
    setMarketAnalysis(marketAnal);
    setRecommendedAsk(`${formatCurrency(recommendedSalary)} (${recommendedPercent.toFixed(1)}%)`);
    setAskRationale(rationale);
    setNegotiationStrength(strength);
    setStrengthFactors(strengthFacs);
    setAlternativeStrategy(altStrategy);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600">Pay Raise Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Pay Raise Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate the financial impact of salary increases with our comprehensive pay raise calculator. Analyze annual, monthly, and hourly increases plus tax implications.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Current Salary */}
              <div>
                <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700 mb-2">Current Annual Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="currentSalary"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              {/* Raise Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Raise Type:</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="raiseType"
                      value="percentage"
                      checked={raiseType === 'percentage'}
                      onChange={(e) => setRaiseType(e.target.value as 'percentage' | 'amount')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Percentage</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="raiseType"
                      value="amount"
                      checked={raiseType === 'amount'}
                      onChange={(e) => setRaiseType(e.target.value as 'percentage' | 'amount')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Dollar Amount</span>
                  </label>
                </div>
              </div>

              {/* Percentage Raise */}
              {raiseType === 'percentage' && (
                <div>
                  <label htmlFor="raisePercentage" className="block text-sm font-medium text-gray-700 mb-2">Raise Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="raisePercentage"
                      className="w-full pl-4 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={raisePercentage}
                      onChange={(e) => setRaisePercentage(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              )}

              {/* Dollar Amount Raise */}
              {raiseType === 'amount' && (
                <div>
                  <label htmlFor="raiseAmount" className="block text-sm font-medium text-gray-700 mb-2">Raise Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="raiseAmount"
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={raiseAmount}
                      onChange={(e) => setRaiseAmount(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              )}

              {/* Tax Rate (Optional) */}
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (Optional)</label>
                <div className="relative">
                  <input
                    type="number"
                    id="taxRate"
                    className="w-full pl-4 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="50"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Estimate your combined tax rate for take-home calculations</p>
              </div>
            </div>
          </div>

      {/* SVG Charts Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Pay Raise Visualizations</h2>

        {/* Chart 1: Salary Comparison Bar Chart */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary Comparison: Before vs After Raise</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="beforeBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                <linearGradient id="afterBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="180" x2="740" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="120" x2="740" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="60" x2="740" y2="60" stroke="#e5e7eb" strokeWidth="1" />

              <line x1="60" y1="20" x2="60" y2="240" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="240" x2="740" y2="240" stroke="#374151" strokeWidth="2" />

              {(() => {
                const maxValue = Math.max(newSalary, currentSalary);
                const scale = 200 / maxValue;

                const bars = [
                  { label: 'Current Salary', value: currentSalary, color: 'url(#beforeBar)', x: 200 },
                  { label: 'New Salary', value: newSalary, color: 'url(#afterBar)', x: 450 }
                ];

                return bars.map((bar, idx) => {
                  const height = bar.value * scale;
                  const y = 240 - height;

                  return (
                    <g key={idx}>
                      <rect
                        x={bar.x}
                        y={y}
                        width="120"
                        height={height}
                        fill={bar.color}
                        rx="4"
                      />
                      <text x={bar.x + 60} y={y - 10} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                        {formatCurrency(bar.value)}
                      </text>
                      <text x={bar.x + 60} y={260} textAnchor="middle" className="text-sm fill-gray-600">
                        {bar.label}
                      </text>
                    </g>
                  );
                });
              })()}

              <text x="55" y="245" textAnchor="end" className="text-xs fill-gray-600">$0</text>
              <text x="55" y="125" textAnchor="end" className="text-xs fill-gray-600">
                {formatCurrency(Math.max(newSalary, currentSalary) / 2)}
              </text>
              <text x="55" y="25" textAnchor="end" className="text-xs fill-gray-600">
                {formatCurrency(Math.max(newSalary, currentSalary))}
              </text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Annual Increase Breakdown Pie Chart */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Annual Income Breakdown</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5 md:gap-8">
            <svg viewBox="0 0 200 200" className="w-64 h-64">
              <defs>
                <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="raiseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              {(() => {
                const currentAngle = (currentSalary / newSalary) * 360;
                const raiseAngle = (annualIncrease / newSalary) * 360;

                const createPieSlice = (startAngle: number, endAngle: number, color: string) => {
                  const start = (startAngle - 90) * Math.PI / 180;
                  const end = (endAngle - 90) * Math.PI / 180;
                  const x1 = 100 + 80 * Math.cos(start);
                  const y1 = 100 + 80 * Math.sin(start);
                  const x2 = 100 + 80 * Math.cos(end);
                  const y2 = 100 + 80 * Math.sin(end);
                  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

                  return (
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                };

                return (
                  <>
                    {createPieSlice(0, currentAngle, 'url(#currentGradient)')}
                    {createPieSlice(currentAngle, 360, 'url(#raiseGradient)')}
                  </>
                );
              })()}
            </svg>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div>
                  <p className="text-sm text-gray-600">Current Salary</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(currentSalary)}</p>
                  <p className="text-xs text-gray-500">{((currentSalary / newSalary) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-green-600"></div>
                <div>
                  <p className="text-sm text-gray-600">Raise Amount</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(annualIncrease)}</p>
                  <p className="text-xs text-gray-500">{percentageDisplay.toFixed(1)}% increase</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Multi-Year Projection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">5-Year Salary Projection</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="projectionLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="180" x2="740" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="120" x2="740" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="60" x2="740" y2="60" stroke="#e5e7eb" strokeWidth="1" />

              <line x1="60" y1="20" x2="60" y2="240" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="240" x2="740" y2="240" stroke="#374151" strokeWidth="2" />

              {(() => {
                const years = [0, 1, 2, 3, 4, 5];
                const salaries = years.map(year => {
                  if (year === 0) return currentSalary;
                  return newSalary * Math.pow(1.03, year - 1); // Assuming 3% annual raises after initial
                });

                const maxSalary = Math.max(...salaries);
                const scale = 200 / maxSalary;
                const xSpacing = 640 / 5;

                let pathData = '';
                salaries.forEach((salary, idx) => {
                  const x = 80 + idx * xSpacing;
                  const y = 240 - (salary * scale);
                  if (idx === 0) {
                    pathData += `M ${x} ${y}`;
                  } else {
                    pathData += ` L ${x} ${y}`;
                  }
                });

                return (
                  <>
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {salaries.map((salary, idx) => {
                      const x = 80 + idx * xSpacing;
                      const y = 240 - (salary * scale);
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r="5" fill="#10b981" />
                          <text x={x} y={y - 15} textAnchor="middle" className="text-xs font-semibold fill-green-700">
                            {formatCurrency(salary)}
                          </text>
                          <text x={x} y={260} textAnchor="middle" className="text-sm fill-gray-600">
                            Year {idx}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}

              <text x="55" y="245" textAnchor="end" className="text-xs fill-gray-600">$0</text>
            </svg>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-3 sm:p-4 md:p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Raise Impact Analysis</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">New Annual Salary</div>
                <div className="text-2xl font-bold text-emerald-600">{formatCurrency(newSalary)}</div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Annual Increase</div>
                <div className="text-lg font-semibold text-gray-800">{formatCurrency(annualIncrease)}</div>
              </div>
<div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Monthly Increase</div>
                <div className="text-lg font-semibold text-gray-800">{formatCurrency(monthlyIncrease)}</div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Weekly Increase</div>
                <div className="text-lg font-semibold text-gray-800">{formatCurrency(weeklyIncrease)}</div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Hourly Increase</div>
                <div className="text-lg font-semibold text-gray-800">{formatCurrencyPrecise(hourlyIncrease)}</div>
              </div>

              {/* After Tax Section */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">After Tax (Take-Home)</h3>

                <div className="bg-white rounded-lg p-4 mb-2">
                  <div className="text-sm text-gray-600">Monthly Take-Home Increase</div>
                  <div className="text-lg font-semibold text-green-600">{formatCurrency(monthlyTakeHome)}</div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Annual Take-Home Increase</div>
                  <div className="text-lg font-semibold text-green-600">{formatCurrency(annualTakeHome)}</div>
                </div>
              </div>

              {/* Percentage Display */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Percentage Increase</div>
                <div className="text-lg font-semibold text-gray-800">{percentageDisplay.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Raise Impact Analysis Table */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Pay Raise Impact by Salary Level</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Current Salary</th>
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">3% Raise</th>
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">5% Raise</th>
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">10% Raise</th>
                  <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Monthly Impact (5%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-2 py-2 font-medium">$40,000</td>
                  <td className="border border-gray-300 px-2 py-2">$1,200</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600 font-medium">$2,000</td>
                  <td className="border border-gray-300 px-2 py-2">$4,000</td>
                  <td className="border border-gray-300 px-2 py-2">$167</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2 font-medium">$60,000</td>
                  <td className="border border-gray-300 px-2 py-2">$1,800</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600 font-medium">$3,000</td>
                  <td className="border border-gray-300 px-2 py-2">$6,000</td>
                  <td className="border border-gray-300 px-2 py-2">$250</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-2 font-medium">$80,000</td>
                  <td className="border border-gray-300 px-2 py-2">$2,400</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600 font-medium">$4,000</td>
                  <td className="border border-gray-300 px-2 py-2">$8,000</td>
                  <td className="border border-gray-300 px-2 py-2">$333</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-2 py-2 font-medium">$100,000</td>
                  <td className="border border-gray-300 px-2 py-2">$3,000</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600 font-medium">$5,000</td>
                  <td className="border border-gray-300 px-2 py-2">$10,000</td>
                  <td className="border border-gray-300 px-2 py-2">$417</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-2 font-medium">$150,000</td>
                  <td className="border border-gray-300 px-2 py-2">$4,500</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600 font-medium">$7,500</td>
                  <td className="border border-gray-300 px-2 py-2">$15,000</td>
                  <td className="border border-gray-300 px-2 py-2">$625</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Raise Types and Timing Analysis */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Types of Pay Raises and Timing</h2>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Types of Raises */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Types of Raises</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Merit Increase</h4>
                  <p className="text-sm text-gray-600">Based on performance: 3-8% annually</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Promotion</h4>
                  <p className="text-sm text-gray-600">Role advancement: 10-20% typical</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Cost of Living</h4>
                  <p className="text-sm text-gray-600">Inflation adjustment: 2-4% annually</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Market Adjustment</h4>
                  <p className="text-sm text-gray-600">Competitive positioning: 5-15%</p>
                </div>
              </div>
            </div>

            {/* Timing and Frequency */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Timing Considerations</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Annual Reviews</h4>
                  <p className="text-sm text-blue-800">Most common timing for raises and promotions</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">Project Completion</h4>
                  <p className="text-sm text-green-800">After major achievements or milestones</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Market Changes</h4>
                  <p className="text-sm text-purple-800">When industry standards shift significantly</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900">Retention</h4>
                  <p className="text-sm text-orange-800">Counter-offers when valuable employees consider leaving</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lifetime Impact Calculator */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Lifetime Impact Calculator</h2>

          <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Input Section */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div>
                  <label htmlFor="lifetimeCurrentSalary" className="block text-sm font-medium text-gray-700 mb-2">Current Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="lifetimeCurrentSalary"
                      value={lifetimeCurrentSalary}
                      onChange={(e) => setLifetimeCurrentSalary(parseFloat(e.target.value) || 0)}
                      step="1000"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lifetimeRaisePercent" className="block text-sm font-medium text-gray-700 mb-2">Raise Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="lifetimeRaisePercent"
                      value={lifetimeRaisePercent}
                      onChange={(e) => setLifetimeRaisePercent(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      max="50"
                      className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="yearsRemaining" className="block text-sm font-medium text-gray-700 mb-2">Years Until Retirement</label>
                  <input
                    type="number"
                    id="yearsRemaining"
                    value={yearsRemaining}
                    onChange={(e) => setYearsRemaining(parseFloat(e.target.value) || 0)}
                    min="1"
                    max="50"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-900 mb-2">Total Career Earnings Increase</h3>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(lifetimeTotal)}</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">10-Year Impact</h3>
                  <div className="text-xl font-semibold text-blue-600">{formatCurrency(tenYearImpact)}</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-900 mb-2">20-Year Impact</h3>
                  <div className="text-xl font-semibold text-purple-600">{formatCurrency(twentyYearImpact)}</div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-orange-900 mb-2">Compounding Effect</h3>
                  <div className="text-xl font-semibold text-orange-600">{formatCurrency(compoundingEffect)}</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Key Insights:</h4>
                <div className="text-sm text-gray-700">
                  {lifetimeInsights}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Negotiation Strategies Calculator */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Raise Negotiation Strategy Calculator</h2>

          <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Strategy Input */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Negotiation Parameters</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="negCurrentSalary" className="block text-sm font-medium text-gray-700 mb-2">Current Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="negCurrentSalary"
                      value={negCurrentSalary}
                      onChange={(e) => setNegCurrentSalary(parseFloat(e.target.value) || 0)}
                      step="1000"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="targetRaise" className="block text-sm font-medium text-gray-700 mb-2">Target Raise %</label>
                  <div className="relative">
                    <input
                      type="number"
                      id="targetRaise"
                      value={targetRaise}
                      onChange={(e) => setTargetRaise(parseFloat(e.target.value) || 0)}
                      step="0.5"
                      min="0"
                      max="30"
                      className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="marketRate" className="block text-sm font-medium text-gray-700 mb-2">Market Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="marketRate"
                      value={marketRate}
                      onChange={(e) => setMarketRate(parseFloat(e.target.value) || 0)}
                      step="1000"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="performanceRating" className="block text-sm font-medium text-gray-700 mb-2">Performance Level</label>
                  <select
                    id="performanceRating"
                    value={performanceRating}
                    onChange={(e) => setPerformanceRating(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="exceeds">Exceeds Expectations</option>
                    <option value="meets">Meets Expectations</option>
                    <option value="below">Below Expectations</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Strategy Results */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Negotiation Analysis</h3>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Market Position</h4>
                  <div className="text-lg font-semibold text-blue-600">{marketGap}</div>
                  <p className="text-sm text-blue-800">{marketAnalysis}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Recommended Ask</h4>
                  <div className="text-lg font-semibold text-green-600">{recommendedAsk}</div>
                  <p className="text-sm text-green-800">{askRationale}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Negotiation Strength</h4>
                  <div className="text-lg font-semibold text-purple-600">{negotiationStrength}</div>
                  <p className="text-sm text-purple-800">{strengthFactors}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Alternative Strategy</h4>
                  <div className="text-sm text-orange-800">
                    {alternativeStrategy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Benchmarks */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Industry Raise Benchmarks & Trends</h2>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Industry Averages */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Average Raises by Industry (2024)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Technology</span>
                  <span className="text-green-600 font-bold">6.2%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Healthcare</span>
                  <span className="text-green-600 font-bold">5.8%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Financial Services</span>
                  <span className="text-blue-600 font-bold">5.1%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Manufacturing</span>
                  <span className="text-blue-600 font-bold">4.8%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Retail</span>
                  <span className="text-orange-600 font-bold">4.2%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Government</span>
                  <span className="text-orange-600 font-bold">3.5%</span>
                </div>
              </div>
            </div>

            {/* Trends and Outlook */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trends & Future Outlook</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800">2024 Trends</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Higher raises for retention</li>
                    <li>• Performance-based increases</li>
                    <li>• Skills-premium adjustments</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">2025 Projections</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• 4.8% average raise expected</li>
                    <li>• Continued talent competition</li>
                    <li>• Remote work impact</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Key Factors</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Economic uncertainty</li>
                    <li>• Inflation considerations</li>
                    <li>• Skills shortage premiums</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Pay Raise Impact</h2>
          <p className="text-gray-700 leading-relaxed">
            A pay raise calculator helps you understand the real financial impact of salary increases. Whether negotiating a promotion or evaluating a job offer, knowing how much extra you'll earn annually, monthly, and weekly is crucial for financial planning. Don't forget to consider taxes when calculating your actual take-home increase.
          </p>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="max-w-[1180px] mx-auto px-2 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Business Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-3 sm:p-4 md:p-6"
            >
              <div className={`${calc.color || 'bg-gray-500'} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white text-xl font-bold">
                  {calc.icon === 'money' && '$'}
                  {calc.icon === 'percent' && '%'}
                  {calc.icon === 'chart' && '📊'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="max-w-[1180px] mx-auto px-2 mt-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What is a typical annual pay raise percentage?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Average annual pay raises in the US typically range from 3-5% for standard merit increases. Cost-of-living adjustments average 2-3%, while promotional raises range from 10-20%. High performers in competitive industries may receive 5-8% annual increases. The average varies by industry—tech and healthcare tend to offer higher raises (5-7%) while government and retail are lower (2-4%). Economic conditions, company performance, and your individual contributions all influence the final number.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How much of my raise will I actually take home after taxes?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your net increase depends on your marginal tax bracket. For most workers, expect to take home 60-75% of a raise after federal, state, and FICA taxes. A $5,000 raise for someone in the 22% federal bracket with 5% state tax results in roughly $3,400 additional take-home pay. Higher earners may keep only 55-60% due to higher brackets. Use our calculator to see your specific net increase based on your actual tax situation.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">When is the best time to ask for a raise?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The best times to request a raise include: after completing a major project successfully, during annual performance reviews, when you&apos;ve taken on additional responsibilities, after receiving positive feedback or awards, or when you&apos;ve been in your role 12+ months without an increase. Avoid asking during company layoffs, poor quarterly results, or immediately after starting. Research industry salary benchmarks beforehand to support your request with data.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How do I calculate the lifetime impact of a raise?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A raise compounds over your career because future raises are typically percentages of your current salary. A 5% raise on $60,000 ($3,000) doesn&apos;t just add $3,000/year—it adds $3,000 plus 5% of that in year two, and so on. Over 20 years with 3% annual increases, a single $3,000 raise adds over $80,000 in cumulative earnings. This is why negotiating starting salaries and early-career raises has such significant long-term impact.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What&apos;s the difference between a raise and a cost-of-living adjustment?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A cost-of-living adjustment (COLA) compensates for inflation to maintain purchasing power—typically 2-4%. A merit raise rewards performance and represents real income growth above inflation. If inflation is 3% and you receive a 3% COLA, your purchasing power stays flat. True wealth-building requires raises that exceed inflation. A 5% raise with 3% inflation means only 2% real income growth. Always compare raise percentages against current inflation rates.
              </p>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-2">Should I accept a title change without a raise?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A title change without immediate compensation increase can be valuable if it positions you for future earnings—better titles on your resume can command higher salaries when job hunting. However, be cautious: companies sometimes use title inflation instead of raises. If you accept, negotiate a timeline for compensation review (3-6 months) and get it in writing. New titles should come with new responsibilities that you can leverage in future salary negotiations internally or externally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="pay-raise-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
