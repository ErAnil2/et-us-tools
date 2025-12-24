'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
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
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Mortgage Points Calculator?",
    answer: "A Mortgage Points Calculator is a free online tool that helps you calculate and analyze mortgage points-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Mortgage Points Calculator?",
    answer: "Our Mortgage Points Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Mortgage Points Calculator free to use?",
    answer: "Yes, this Mortgage Points Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Mortgage Points calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to mortgage points such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function MortgagePointsCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('mortgage-points-calculator');

  const [loanAmount, setLoanAmount] = useState(400000);
  const [baseRate, setBaseRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [points, setPoints] = useState(1);
  const [rateReduction, setRateReduction] = useState(0.25);
  const [keepYears, setKeepYears] = useState(7);
  const [taxRate, setTaxRate] = useState(24);
  const [investmentReturn, setInvestmentReturn] = useState(7);

  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculatePayment = (amount: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return amount / numPayments;
    return amount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const results = useMemo(() => {
    const pointsCost = loanAmount * (points / 100);
    const newRate = baseRate - (points * rateReduction);

    const basePayment = calculatePayment(loanAmount, baseRate, loanTerm);
    const newPayment = calculatePayment(loanAmount, newRate, loanTerm);

    const monthlySavings = basePayment - newPayment;
    const annualSavings = monthlySavings * 12;

    const breakEvenMonths = monthlySavings > 0 ? pointsCost / monthlySavings : Infinity;
    const breakEvenYears = breakEvenMonths / 12;

    const totalSavings = monthlySavings * keepYears * 12;
    const taxBenefit = pointsCost * (taxRate / 100);
    const netBenefit = totalSavings + taxBenefit - pointsCost;

    const investmentValue = pointsCost * Math.pow(1 + investmentReturn / 100, keepYears);
    const opportunityCost = investmentValue - pointsCost;

    let recommendation = 'Not Worth It';
    let recommendationBar = 20;
    let grade = 'D';
    let gradeDesc = 'Poor value proposition';
    let gradeColor = 'text-red-600';

    if (breakEvenYears < keepYears && netBenefit > 0) {
      if (breakEvenYears < keepYears * 0.5) {
        recommendation = 'Excellent Value';
        recommendationBar = 90;
        grade = 'A';
        gradeDesc = 'Excellent value for long-term ownership';
        gradeColor = 'text-green-600';
      } else if (breakEvenYears < keepYears * 0.7) {
        recommendation = 'Good Value';
        recommendationBar = 75;
        grade = 'A-';
        gradeDesc = 'Good value for long-term ownership';
        gradeColor = 'text-green-500';
      } else {
        recommendation = 'Fair Value';
        recommendationBar = 60;
        grade = 'B+';
        gradeDesc = 'Marginal benefit, consider alternatives';
        gradeColor = 'text-yellow-600';
      }
    } else if (breakEvenYears < keepYears + 2) {
      recommendation = 'Consider Carefully';
      recommendationBar = 40;
      grade = 'C';
      gradeDesc = 'Break-even close to ownership period';
      gradeColor = 'text-orange-500';
    }

    return {
      pointsCost,
      newRate,
      basePayment,
      newPayment,
      monthlySavings,
      annualSavings,
      breakEvenYears,
      totalSavings,
      taxBenefit,
      netBenefit,
      investmentValue,
      opportunityCost,
      recommendation,
      recommendationBar,
      grade,
      gradeDesc,
      gradeColor
    };
  }, [loanAmount, baseRate, loanTerm, points, rateReduction, keepYears, taxRate, investmentReturn]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    // Scenario 1: No points
    const noPointsPayment = calculatePayment(loanAmount, baseRate, loanTerm);
    const noPointsTotalInterest = (noPointsPayment * loanTerm * 12) - loanAmount;

    // Scenario 2: Double points
    const doublePoints = points * 2;
    const doublePointsCost = loanAmount * (doublePoints / 100);
    const doublePointsRate = baseRate - (doublePoints * rateReduction);
    const doublePointsPayment = calculatePayment(loanAmount, doublePointsRate, loanTerm);
    const doublePointsSavings = noPointsPayment - doublePointsPayment;
    const doubleBreakEven = doublePointsSavings > 0 ? (doublePointsCost / doublePointsSavings) / 12 : Infinity;

    // Scenario 3: Shorter loan term (15 years)
    const shorterTermPayment = calculatePayment(loanAmount, baseRate - 0.5, 15);
    const shorterTermTotalInterest = (shorterTermPayment * 15 * 12) - loanAmount;

    return {
      noPoints: {
        payment: noPointsPayment,
        totalInterest: noPointsTotalInterest,
        upfrontCost: 0
      },
      doublePoints: {
        payment: doublePointsPayment,
        savings: doublePointsSavings,
        breakEven: doubleBreakEven,
        cost: doublePointsCost
      },
      shorterTerm: {
        payment: shorterTermPayment,
        totalInterest: shorterTermTotalInterest,
        savings: noPointsTotalInterest - shorterTermTotalInterest
      }
    };
  }, [loanAmount, baseRate, loanTerm, points, rateReduction]);

  // Break-even timeline
  const breakEvenSchedule = useMemo(() => {
    const schedule = [];
    const maxYears = Math.min(keepYears + 3, 15);

    for (let year = 1; year <= maxYears; year++) {
      const cumulativeSavings = results.annualSavings * year;
      const netBenefit = cumulativeSavings - results.pointsCost;
      const isBreakEven = year >= Math.ceil(results.breakEvenYears);

      schedule.push({
        year,
        annualSavings: results.annualSavings,
        cumulativeSavings,
        netBenefit,
        isBreakEven,
        isWithinOwnership: year <= keepYears
      });
    }

    return schedule;
  }, [results, keepYears]);

  // Points comparison data for SVG bar chart
  const pointsComparison = useMemo(() => {
    const options = [0, 0.5, 1, 1.5, 2];
    return options.map(p => {
      const rate = baseRate - (p * rateReduction);
      const payment = calculatePayment(loanAmount, rate, loanTerm);
      const cost = loanAmount * (p / 100);
      return { points: p, payment, cost, rate };
    });
  }, [loanAmount, baseRate, loanTerm, rateReduction]);

  const maxPayment = Math.max(...pointsComparison.map(p => p.payment));
  const maxCost = Math.max(...pointsComparison.map(p => p.cost));

  const displayedSchedule = showFullSchedule ? breakEvenSchedule : breakEvenSchedule.slice(0, 7);

  const relatedCalculators = [
    { href: '/us/tools/calculators/mortgage-payment-calculator', title: 'Mortgage Payment', description: 'Calculate monthly mortgage payments', icon: '🏠' },
    { href: '/us/tools/calculators/home-affordability-calculator', title: 'Home Affordability', description: 'How much house can you afford', icon: '💰' },
    { href: '/us/tools/calculators/refinance-calculator', title: 'Refinance Calculator', description: 'Should you refinance?', icon: '🔄' },
    { href: '/us/tools/calculators/amortization-calculator', title: 'Amortization', description: 'View loan payment schedule', icon: '📊' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-blue-100 px-3 sm:px-4 md:px-6 py-3 rounded-full mb-3 sm:mb-4 md:mb-6">
          <span className="text-2xl">🏠</span>
          <span className="text-green-600 font-semibold">Mortgage Points Calculator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Mortgage Points Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate whether buying mortgage points is worth it with break-even analysis and cost comparison.
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Quick Presets */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Mortgage Scenarios</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button onClick={() => { setLoanAmount(200000); setBaseRate(7.0); setPoints(1); setKeepYears(5); }} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                  First Home ($200K)
                </button>
                <button onClick={() => { setLoanAmount(400000); setBaseRate(7.5); setPoints(1.5); setKeepYears(7); }} className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors">
                  Family Home ($400K)
                </button>
                <button onClick={() => { setLoanAmount(600000); setBaseRate(7.25); setPoints(2); setKeepYears(10); }} className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors">
                  Luxury Home ($600K)
                </button>
                <button onClick={() => { setLoanAmount(300000); setBaseRate(7.75); setPoints(1); setKeepYears(15); }} className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors">
                  Long-term ($300K)
                </button>
                <button onClick={() => { setLoanAmount(500000); setBaseRate(7.125); setPoints(0.5); setKeepYears(3); }} className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors">
                  Short-term ($500K)
                </button>
                <button onClick={() => { setLoanAmount(350000); setBaseRate(6.875); setPoints(2.5); setKeepYears(8); }} className="px-3 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg text-sm font-medium transition-colors">
                  Refinance ($350K)
                </button>
              </div>
            </div>

            {/* Loan Details */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Loan Amount</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(loanAmount)}</span>
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$50K</span>
                    <span>$2M</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Base Interest Rate</span>
                    <span className="text-blue-600 font-semibold">{baseRate.toFixed(2)}%</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="0.125"
                    value={baseRate}
                    onChange={(e) => setBaseRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Loan Term</span>
                    <span className="text-blue-600 font-semibold">{loanTerm} years</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="5"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Points Options */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Points Options</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Points to Purchase</span>
                    <span className="text-blue-600 font-semibold">{points} points</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.25"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Rate Reduction per Point</span>
                    <span className="text-blue-600 font-semibold">{rateReduction.toFixed(3)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.125"
                    max="0.5"
                    step="0.125"
                    value={rateReduction}
                    onChange={(e) => setRateReduction(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Analysis Parameters */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Expected Ownership Duration</span>
                    <span className="text-blue-600 font-semibold">{keepYears} years</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={keepYears}
                    onChange={(e) => setKeepYears(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Marginal Tax Rate</span>
                    <span className="text-blue-600 font-semibold">{taxRate}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Alternative Investment Return</span>
                    <span className="text-blue-600 font-semibold">{investmentReturn}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={investmentReturn}
                    onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-medium text-green-100 mb-1">Break-Even Period</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{results.breakEvenYears.toFixed(1)} years</div>
                </div>
                <div className={`text-3xl font-bold ${results.gradeColor} bg-white rounded-lg px-4 py-2`}>
                  {results.grade}
                </div>
              </div>
              <p className="text-sm text-green-100">{results.gradeDesc}</p>
              <div className="mt-4 pt-4 border-t border-green-400">
                <div className="flex justify-between text-sm">
                  <span className="text-green-100">Recommendation:</span>
                  <span className="font-semibold">{results.recommendation}</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-blue-700">Points Cost</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.pointsCost)}</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-sm text-green-700">Monthly Savings</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.monthlySavings)}</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="text-sm text-purple-700">New Rate</div>
                <div className="text-2xl font-bold text-purple-600">{results.newRate.toFixed(3)}%</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="text-sm text-orange-700">Total Savings ({keepYears}yr)</div>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(results.totalSavings)}</div>
              </div>
            </div>

            {/* Payment Comparison */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Monthly Payment Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Without Points:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(results.basePayment)}/mo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">With {points} Point(s):</span>
                  <span className="font-semibold text-green-600">{formatCurrency(results.newPayment)}/mo</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium text-gray-800">You Save:</span>
                  <span className="font-bold text-green-600">{formatCurrency(results.monthlySavings)}/mo</span>
                </div>
              </div>
            </div>

            {/* Financial Analysis */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Financial Analysis</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax Benefit (Points Deduction):</span>
                  <span className="font-medium text-green-600">+{formatCurrency(results.taxBenefit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Benefit ({keepYears} years):</span>
                  <span className={`font-medium ${results.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.netBenefit >= 0 ? '+' : ''}{formatCurrency(results.netBenefit)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Opportunity Cost (Investment):</span>
                  <span className="font-medium text-orange-600">{formatCurrency(results.opportunityCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Points Comparison Chart */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Points Comparison</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* SVG Bar Chart */}
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Monthly Payment by Points</h3>
            <svg viewBox="0 0 300 200" className="w-full">
              {pointsComparison.map((item, index) => {
                const barHeight = (item.payment / maxPayment) * 140;
                const x = 20 + index * 56;
                const isSelected = item.points === points;

                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={180 - barHeight}
                      width="40"
                      height={barHeight}
                      fill={isSelected ? '#10B981' : '#94A3B8'}
                      rx="4"
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                      style={{ transform: hoveredBar === index ? 'scaleY(1.02)' : 'scaleY(1)', transformOrigin: 'bottom' }}
                    />
                    <text x={x + 20} y="195" textAnchor="middle" className="text-xs fill-gray-600">
                      {item.points}pt
                    </text>
                    {(hoveredBar === index || isSelected) && (
                      <text x={x + 20} y={175 - barHeight} textAnchor="middle" className="text-xs font-medium fill-gray-800">
                        {formatCurrency(item.payment)}
                      </text>
                    )}
                  </g>
                );
              })}
              <line x1="15" y1="180" x2="290" y2="180" stroke="#E5E7EB" strokeWidth="2" />
            </svg>
          </div>

          {/* Upfront Cost Table */}
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Cost & Savings Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-700">Points</th>
                    <th className="text-right py-2 font-medium text-gray-700">Cost</th>
                    <th className="text-right py-2 font-medium text-gray-700">Rate</th>
                    <th className="text-right py-2 font-medium text-gray-700">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsComparison.map((item, index) => (
                    <tr key={index} className={`border-b ${item.points === points ? 'bg-green-50' : ''}`}>
                      <td className="py-2 font-medium">{item.points}</td>
                      <td className="text-right text-gray-600">{formatCurrency(item.cost)}</td>
                      <td className="text-right text-gray-600">{item.rate.toFixed(2)}%</td>
                      <td className="text-right font-medium text-blue-600">{formatCurrency(item.payment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">What-If Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* No Points */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚫</span>
              <h3 className="font-semibold text-gray-800">No Points</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 mb-2">
              {formatCurrency(scenarios.noPoints.payment)}/mo
            </div>
            <p className="text-sm text-gray-600 mb-3">Keep original {baseRate}% rate</p>
            <div className="text-xs text-gray-500 bg-gray-100 rounded-lg px-3 py-2">
              Total interest: {formatCurrency(scenarios.noPoints.totalInterest)}
            </div>
          </div>

          {/* Double Points */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💎</span>
              <h3 className="font-semibold text-blue-800">Double Points ({points * 2})</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(scenarios.doublePoints.payment)}/mo
            </div>
            <p className="text-sm text-blue-700 mb-3">Save {formatCurrency(scenarios.doublePoints.savings)}/mo more</p>
            <div className="text-xs text-blue-600 bg-blue-100 rounded-lg px-3 py-2">
              Break-even: {scenarios.doublePoints.breakEven.toFixed(1)} years
            </div>
          </div>

          {/* 15-Year Term */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚡</span>
              <h3 className="font-semibold text-purple-800">15-Year Term</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-2">
              {formatCurrency(scenarios.shorterTerm.payment)}/mo
            </div>
            <p className="text-sm text-purple-700 mb-3">Higher payment, faster payoff</p>
            <div className="text-xs text-purple-600 bg-purple-100 rounded-lg px-3 py-2">
              Interest savings: {formatCurrency(scenarios.shorterTerm.savings)}
            </div>
          </div>
        </div>
      </div>
{/* Break-Even Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Break-Even Timeline</h2>
          <div className="text-sm text-gray-500">
            Planned ownership: <span className="font-medium text-blue-600">{keepYears} years</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Annual Savings</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Cumulative Savings</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Benefit</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedSchedule.map((row) => (
                <tr key={row.year} className={`border-b ${row.isWithinOwnership ? 'bg-blue-50/30' : ''}`}>
                  <td className="py-3 px-4 font-medium">
                    Year {row.year}
                    {row.year === keepYears && <span className="ml-2 text-xs text-blue-600">(Planned Exit)</span>}
                  </td>
                  <td className="text-right py-3 px-4 text-green-600">{formatCurrency(row.annualSavings)}</td>
                  <td className="text-right py-3 px-4 font-medium">{formatCurrency(row.cumulativeSavings)}</td>
                  <td className={`text-right py-3 px-4 font-bold ${row.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.netBenefit >= 0 ? '+' : ''}{formatCurrency(row.netBenefit)}
                  </td>
                  <td className="text-center py-3 px-4">
                    {row.isBreakEven ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Profitable
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Recovering
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {breakEvenSchedule.length > 7 && (
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
          >
            {showFullSchedule ? 'Show Less' : `Show All ${breakEvenSchedule.length} Years`}
            <svg className={`w-4 h-4 transition-transform ${showFullSchedule ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Points Strategy Tips</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Long-Term Ownership</h4>
              <p className="text-sm text-gray-600">Points are most beneficial when you plan to keep the loan for many years.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Tax Deductibility</h4>
              <p className="text-sm text-gray-600">Points paid on a home purchase may be fully deductible in the year paid.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Rising Rate Environment</h4>
              <p className="text-sm text-gray-600">Points become more valuable when rates are expected to rise.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Alternative Investments</h4>
              <p className="text-sm text-gray-600">Compare potential returns if you invested the points cost elsewhere.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">{calc.icon}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Mortgage Points</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Mortgage points, also called discount points, are fees paid directly to the lender at closing in exchange for a reduced interest rate. Each point costs 1% of your loan amount and typically lowers your rate by 0.25%. Buying points is essentially prepaying interest upfront to save money over the life of the loan.
        </p>

        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          The decision to buy points depends on your financial situation and how long you plan to stay in the home. Points make sense when you have extra cash at closing, plan to hold the mortgage long enough to recoup the upfront cost, and prefer predictable long-term savings over immediate cash preservation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Discount Points</h3>
            <p className="text-sm text-blue-800">Prepaid interest that lowers your mortgage rate. Each point = 1% of loan amount and typically reduces rate by 0.25%</p>
          </div>
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <h3 className="font-semibold text-green-900 mb-2">Origination Points</h3>
            <p className="text-sm text-green-800">Fees charged by the lender for processing your loan. These don&apos;t reduce your rate - they&apos;re just loan costs</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Calculate Your Break-Even Point</h3>
        <div className="bg-gray-50 rounded-xl p-5 mb-3 sm:mb-4 md:mb-6">
          <p className="text-gray-700 mb-3">The break-even formula is straightforward:</p>
          <p className="font-mono text-sm bg-white p-3 rounded-lg mb-3">Break-Even Months = Points Cost / Monthly Savings</p>
          <p className="text-gray-600 text-sm">
            For example: If 1 point costs $3,000 and saves you $75/month, break-even = 3,000 / 75 = 40 months (3.3 years). Stay past 40 months and you save money; leave before and you lose.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">Tax Considerations</h3>
        <p className="text-gray-600 leading-relaxed">
          Mortgage points are generally tax-deductible. For a home purchase, points are usually fully deductible in the year paid. For refinancing, points must be deducted over the loan term unless you use part of the refinance for home improvements. Consult a tax professional for guidance on your specific situation.
        </p>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Are mortgage points worth buying in today&apos;s market?</h3>
            <p className="text-gray-600">
              Points are most valuable when you plan to stay in your home long-term (7+ years), have extra cash at closing, and prioritize long-term savings over upfront costs. In high-rate environments, points become more attractive because the absolute dollar savings per point increase. Calculate your specific break-even point to make an informed decision.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How many points should I buy?</h3>
            <p className="text-gray-600">
              Most lenders offer 0-3 points, with diminishing returns beyond 2 points. Each additional point typically provides less rate reduction than the previous one. Start by calculating break-even for 1 point, then evaluate if additional points fit your timeline and budget. Consider alternative uses for the cash, like a larger down payment to avoid PMI.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What&apos;s the difference between points and lender credits?</h3>
            <p className="text-gray-600">
              Points and lender credits are opposite strategies. Points cost you money upfront to get a lower rate (paying now to save later). Lender credits give you money at closing in exchange for a higher rate (saving now to pay more later). Choose points if staying long-term; choose credits if you may move or refinance soon.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can I negotiate the cost of points?</h3>
            <p className="text-gray-600">
              While the points-to-rate-reduction ratio is typically fixed by lenders, you can shop around for better deals. Different lenders offer different rate reductions per point, so compare quotes carefully. Some lenders may also offer promotional rates or waive certain fees, effectively making points more valuable.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I use extra cash for points or a larger down payment?</h3>
            <p className="text-gray-600">
              If your down payment is below 20%, putting extra money toward the down payment to avoid PMI often provides better returns than buying points. PMI can cost 0.5-1% of the loan annually, which typically exceeds the savings from points. Once you&apos;ve reached 20% down, then consider whether points make sense for your situation.
            </p>
          </div>
        </div>
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
              This calculator provides estimates for educational purposes only. Actual mortgage rates, points costs, and tax implications
              vary by lender and individual circumstances. Consult with a mortgage professional and tax advisor for personalized advice.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="mortgage-points-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
