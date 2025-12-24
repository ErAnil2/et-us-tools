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
    question: "What is a Tds Calculator?",
    answer: "A Tds Calculator is a free online tool designed to help you quickly and accurately calculate tds-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Tds Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Tds Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Tds Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function TDSCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('tds-calculator');

  const [paymentType, setPaymentType] = useState('contractor');
  const [amount, setAmount] = useState(5000);
  const [withholdingRate, setWithholdingRate] = useState(24);
  const [isBackupWithholding, setIsBackupWithholding] = useState(false);
  const [additionalState, setAdditionalState] = useState(0);

  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const paymentTypes = {
    contractor: { name: 'Independent Contractor (1099-NEC)', defaultRate: 24, description: 'Payments to self-employed individuals' },
    interest: { name: 'Interest Income (1099-INT)', defaultRate: 24, description: 'Bank interest, bond interest' },
    dividends: { name: 'Dividends (1099-DIV)', defaultRate: 24, description: 'Stock dividends' },
    royalties: { name: 'Royalties (1099-MISC)', defaultRate: 24, description: 'Intellectual property payments' },
    gambling: { name: 'Gambling Winnings (W-2G)', defaultRate: 24, description: 'Casino, lottery winnings' },
    pension: { name: 'Pension/IRA (1099-R)', defaultRate: 10, description: 'Retirement distributions' },
    rental: { name: 'Rental Income', defaultRate: 0, description: 'Property rental payments' },
    wages: { name: 'Wages/Salary', defaultRate: 22, description: 'Employee supplemental wages' }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const results = useMemo(() => {
    const effectiveRate = isBackupWithholding ? 24 : withholdingRate;
    const federalWithholding = (amount * effectiveRate) / 100;
    const stateWithholding = (amount * additionalState) / 100;
    const totalWithholding = federalWithholding + stateWithholding;
    const netPayment = amount - totalWithholding;
    const effectiveTotalRate = (totalWithholding / amount) * 100;

    return {
      federalWithholding,
      stateWithholding,
      totalWithholding,
      netPayment,
      effectiveRate,
      effectiveTotalRate
    };
  }, [amount, withholdingRate, isBackupWithholding, additionalState]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    // Scenario 1: No backup withholding (if applicable)
    const scenario1Rate = paymentTypes[paymentType as keyof typeof paymentTypes].defaultRate;
    const scenario1Federal = (amount * scenario1Rate) / 100;
    const scenario1Net = amount - scenario1Federal - (amount * additionalState / 100);

    // Scenario 2: Maximum withholding (37%)
    const scenario2Federal = (amount * 37) / 100;
    const scenario2Net = amount - scenario2Federal - (amount * additionalState / 100);

    // Scenario 3: Double the payment
    const doubleAmount = amount * 2;
    const scenario3Federal = (doubleAmount * results.effectiveRate) / 100;
    const scenario3State = (doubleAmount * additionalState) / 100;
    const scenario3Net = doubleAmount - scenario3Federal - scenario3State;

    return {
      defaultRate: {
        rate: scenario1Rate,
        withholding: scenario1Federal,
        net: scenario1Net
      },
      maxRate: {
        rate: 37,
        withholding: scenario2Federal,
        net: scenario2Net
      },
      doublePayment: {
        amount: doubleAmount,
        withholding: scenario3Federal + scenario3State,
        net: scenario3Net
      }
    };
  }, [amount, withholdingRate, additionalState, paymentType, results.effectiveRate]);

  // Annual schedule (monthly payments)
  const annualSchedule = useMemo(() => {
    const schedule = [];
    for (let month = 1; month <= 12; month++) {
      const cumulativeGross = amount * month;
      const cumulativeWithholding = results.totalWithholding * month;
      const cumulativeNet = results.netPayment * month;

      schedule.push({
        month,
        monthName: new Date(2024, month - 1, 1).toLocaleString('default', { month: 'short' }),
        gross: amount,
        withholding: results.totalWithholding,
        net: results.netPayment,
        cumulativeGross,
        cumulativeWithholding,
        cumulativeNet
      });
    }
    return schedule;
  }, [amount, results]);

  // SVG Donut Chart Data
  const chartData = useMemo(() => {
    const segments = [
      { label: 'Net Payment', value: results.netPayment, color: '#10B981' },
      { label: 'Federal Withholding', value: results.federalWithholding, color: '#EF4444' }
    ];

    if (results.stateWithholding > 0) {
      segments.push({ label: 'State Withholding', value: results.stateWithholding, color: '#F59E0B' });
    }

    let currentAngle = 0;
    return segments.map(segment => {
      const percentage = (segment.value / amount) * 100;
      const angle = (segment.value / amount) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        ...segment,
        percentage,
        startAngle,
        endAngle: currentAngle
      };
    });
  }, [amount, results]);

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

  const handlePaymentTypeChange = (type: string) => {
    setPaymentType(type);
    setWithholdingRate(paymentTypes[type as keyof typeof paymentTypes].defaultRate);
  };

  const displayedSchedule = showFullSchedule ? annualSchedule : annualSchedule.slice(0, 6);

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-100 to-orange-100 px-3 sm:px-4 md:px-6 py-3 rounded-full mb-3 sm:mb-4 md:mb-6">
          <span className="text-2xl">🏛️</span>
          <span className="text-red-600 font-semibold">Tax Withholding Calculator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Tax Withholding Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate federal and state tax withholding on various payment types including 1099, W-2G, and backup withholding.
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
                <button onClick={() => { setAmount(5000); handlePaymentTypeChange('contractor'); }} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                  Contractor ($5K)
                </button>
                <button onClick={() => { setAmount(10000); handlePaymentTypeChange('gambling'); }} className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors">
                  Gambling Win ($10K)
                </button>
                <button onClick={() => { setAmount(2500); handlePaymentTypeChange('interest'); }} className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors">
                  Interest ($2.5K)
                </button>
                <button onClick={() => { setAmount(50000); handlePaymentTypeChange('pension'); }} className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors">
                  Pension ($50K)
                </button>
              </div>
            </div>

            {/* Payment Type */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                  <select
                    value={paymentType}
                    onChange={(e) => handlePaymentTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(paymentTypes).map(([key, value]) => (
                      <option key={key} value={key}>{value.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">{paymentTypes[paymentType as keyof typeof paymentTypes].description}</p>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Payment Amount</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(amount)}</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$100</span>
                    <span>$100,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Withholding Rates */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Withholding Rates</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <input
                    type="checkbox"
                    id="backupWithholding"
                    checked={isBackupWithholding}
                    onChange={(e) => setIsBackupWithholding(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="backupWithholding" className="text-sm text-red-800">
                    <span className="font-medium">Backup Withholding (24%)</span>
                    <span className="block text-xs">Applied when TIN not provided or IRS notifies</span>
                  </label>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Federal Withholding Rate</span>
                    <span className="text-blue-600 font-semibold">{isBackupWithholding ? 24 : withholdingRate}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="37"
                    step="1"
                    value={isBackupWithholding ? 24 : withholdingRate}
                    onChange={(e) => setWithholdingRate(Number(e.target.value))}
                    disabled={isBackupWithholding}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>State Withholding Rate</span>
                    <span className="text-blue-600 font-semibold">{additionalState}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="13"
                    step="0.5"
                    value={additionalState}
                    onChange={(e) => setAdditionalState(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0% (TX, FL)</span>
                    <span>13% (CA)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Payment Breakdown</h3>
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
                    {hoveredSegment || 'Total'}
                  </text>
                  <text x="100" y="115" textAnchor="middle" className="text-sm font-bold fill-gray-800">
                    {hoveredSegment
                      ? formatCurrency(chartData.find(s => s.label === hoveredSegment)?.value || 0)
                      : formatCurrency(amount)}
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
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Results */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-3 sm:p-4 md:p-6">
              <div className="text-sm font-medium text-red-100 mb-1">Total Tax Withheld</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{formatCurrency(results.totalWithholding)}</div>
              <div className="text-sm text-red-100">{results.effectiveTotalRate.toFixed(1)}% effective rate</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-sm text-green-700">Net Payment</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.netPayment)}</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="text-sm text-red-700">Federal Withholding</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(results.federalWithholding)}</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="text-sm text-orange-700">State Withholding</div>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(results.stateWithholding)}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-blue-700">Gross Payment</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Withholding Calculation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Gross Payment</span>
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Federal Withholding ({results.effectiveRate}%)</span>
                  <span className="text-red-600">-{formatCurrency(results.federalWithholding)}</span>
                </div>
                {results.stateWithholding > 0 && (
                  <div className="flex justify-between py-1 text-gray-600">
                    <span>State Withholding ({additionalState}%)</span>
                    <span className="text-orange-600">-{formatCurrency(results.stateWithholding)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t font-bold">
                  <span className="text-gray-800">Net Payment</span>
                  <span className="text-green-600">{formatCurrency(results.netPayment)}</span>
                </div>
              </div>
            </div>

            {/* Annual Summary */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-gray-800 mb-3">Annual Summary (12 payments)</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500">Total Gross</div>
                  <div className="text-lg font-bold text-gray-800">{formatCurrency(amount * 12)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total Withheld</div>
                  <div className="text-lg font-bold text-red-600">{formatCurrency(results.totalWithholding * 12)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total Net</div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(results.netPayment * 12)}</div>
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
          {/* Default Rate */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📋</span>
              <h3 className="font-semibold text-blue-800">Default Rate ({scenarios.defaultRate.rate}%)</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(scenarios.defaultRate.net)}
            </div>
            <p className="text-sm text-blue-700 mb-3">Net at standard {paymentTypes[paymentType as keyof typeof paymentTypes].name.split(' ')[0]} rate</p>
            <div className="text-xs text-blue-600 bg-blue-100 rounded-lg px-3 py-2">
              Withholding: {formatCurrency(scenarios.defaultRate.withholding)}
            </div>
          </div>

          {/* Max Rate */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-semibold text-red-800">Maximum Rate (37%)</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-2">
              {formatCurrency(scenarios.maxRate.net)}
            </div>
            <p className="text-sm text-red-700 mb-3">Highest marginal tax bracket</p>
            <div className="text-xs text-red-600 bg-red-100 rounded-lg px-3 py-2">
              Withholding: {formatCurrency(scenarios.maxRate.withholding)}
            </div>
          </div>

          {/* Double Payment */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📈</span>
              <h3 className="font-semibold text-green-800">Double Payment</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(scenarios.doublePayment.net)}
            </div>
            <p className="text-sm text-green-700 mb-3">Gross: {formatCurrency(scenarios.doublePayment.amount)}</p>
            <div className="text-xs text-green-600 bg-green-100 rounded-lg px-3 py-2">
              Withholding: {formatCurrency(scenarios.doublePayment.withholding)}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Monthly Withholding Schedule</h2>
          <span className="text-sm text-gray-500">Assuming monthly payments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Gross</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Withheld</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">YTD Gross</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">YTD Withheld</th>
              </tr>
            </thead>
            <tbody>
              {displayedSchedule.map((row) => (
                <tr key={row.month} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{row.monthName}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{formatCurrency(row.gross)}</td>
                  <td className="text-right py-3 px-4 text-red-600">{formatCurrency(row.withholding)}</td>
                  <td className="text-right py-3 px-4 text-green-600 font-medium">{formatCurrency(row.net)}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{formatCurrency(row.cumulativeGross)}</td>
                  <td className="text-right py-3 px-4 text-red-600 font-medium">{formatCurrency(row.cumulativeWithholding)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {annualSchedule.length > 6 && (
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
          >
            {showFullSchedule ? 'Show Less' : 'Show Full Year'}
            <svg className={`w-4 h-4 transition-transform ${showFullSchedule ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
{/* Withholding Rates Reference */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Common Withholding Rates</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-blue-50 rounded-lg p-5">
            <h3 className="font-semibold text-blue-800 mb-3">Federal Withholding</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex justify-between"><span>Backup Withholding:</span><span className="font-medium">24%</span></li>
              <li className="flex justify-between"><span>Gambling Winnings:</span><span className="font-medium">24%</span></li>
              <li className="flex justify-between"><span>Pension (default):</span><span className="font-medium">10%</span></li>
              <li className="flex justify-between"><span>Supplemental Wages:</span><span className="font-medium">22%</span></li>
              <li className="flex justify-between"><span>Non-Resident Alien:</span><span className="font-medium">30%</span></li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-5">
            <h3 className="font-semibold text-green-800 mb-3">State Withholding Examples</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex justify-between"><span>California (max):</span><span className="font-medium">13.3%</span></li>
              <li className="flex justify-between"><span>New York (max):</span><span className="font-medium">8.82%</span></li>
              <li className="flex justify-between"><span>Illinois:</span><span className="font-medium">4.95%</span></li>
              <li className="flex justify-between"><span>Florida:</span><span className="font-medium">0%</span></li>
              <li className="flex justify-between"><span>Texas:</span><span className="font-medium">0%</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax Withholding Tips</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Provide Your TIN</h4>
              <p className="text-sm text-gray-600">Always provide your correct TIN to avoid backup withholding at 24%.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Quarterly Estimates</h4>
              <p className="text-sm text-gray-600">If you receive 1099 income, consider making quarterly estimated tax payments.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Keep Records</h4>
              <p className="text-sm text-gray-600">Save all 1099 forms for your tax return and to verify withholding credits.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Adjust Withholding</h4>
              <p className="text-sm text-gray-600">Request specific withholding amounts for pension distributions using Form W-4P.</p>
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
                <div className="text-2xl mb-2">{calc.icon || '🏛️'}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Tax Deducted at Source (TDS)</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Tax Deducted at Source (TDS) is a mechanism where tax is collected at the point of income generation rather than at year-end. For US taxpayers, this concept manifests through various withholding requirements on wages, dividends, interest, gambling winnings, and other income types. The payer deducts a percentage of the payment and remits it directly to the IRS, ensuring regular tax collection and reducing year-end tax burdens for recipients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 text-base">Common TDS/Withholding Types</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• W-2 wages (per W-4 elections)</li>
              <li>• Backup withholding (24% on 1099)</li>
              <li>• Gambling winnings (24%)</li>
              <li>• Pension distributions (10% default)</li>
              <li>• Non-resident alien payments (30%)</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 text-base">Benefits of Withholding</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Spreads tax burden throughout year</li>
              <li>• Reduces risk of underpayment penalties</li>
              <li>• Ensures compliance automatically</li>
              <li>• Simplifies tax planning</li>
              <li>• Creates forced savings mechanism</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Backup Withholding Explained</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Backup withholding at 24% applies when the IRS requires payers to withhold from payments that normally wouldn&apos;t have withholding. This occurs when you fail to provide your correct Taxpayer Identification Number (TIN), the IRS notifies the payer that your TIN is incorrect, or you&apos;re subject to backup withholding for underreporting interest/dividends. Providing Form W-9 with your correct TIN prevents backup withholding in most cases.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Claiming Withheld Taxes</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          All taxes withheld during the year count as payments toward your annual tax liability. Report them on your tax return using information from W-2s, 1099s, and other tax documents. If total withholding exceeds your actual tax liability, you receive a refund. If it falls short, you owe the difference. The goal is accurate withholding that results in neither a large refund (interest-free loan to government) nor large balance due (potential underpayment penalties).
        </p>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What triggers backup withholding?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Backup withholding is triggered when: (1) you don&apos;t provide your TIN to the payer via Form W-9, (2) the IRS notifies the payer that your TIN is incorrect, (3) the IRS notifies the payer to start backup withholding due to underreporting of interest or dividends, or (4) you fail to certify that you&apos;re not subject to backup withholding. Once triggered, 24% is withheld from applicable payments until the issue is resolved with the IRS.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much tax is withheld from gambling winnings?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Federal withholding on gambling winnings is 24% when winnings exceed certain thresholds: $5,000+ from sweepstakes, wagering pools, or lotteries; $1,200+ from bingo or slot machines; $1,500+ from keno. Poker tournament winnings face withholding when net proceeds exceed $5,000. Winnings below thresholds aren&apos;t subject to automatic withholding but remain fully taxable—you&apos;re responsible for reporting all gambling income.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Can I adjust withholding on pension distributions?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes, use Form W-4P (Withholding Certificate for Periodic Pension or Annuity Payments) to adjust federal withholding on pensions and annuities. The default 10% withholding may be too low if the pension is your primary income, or too high if you have significant deductions. You can elect a specific dollar amount, percentage, or choose no withholding (though this may result in underpayment penalties if you don&apos;t make estimated payments).
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the withholding rate for non-resident aliens?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The standard withholding rate for payments to non-resident aliens is 30% for FDAP income (Fixed, Determinable, Annual, Periodical)—including dividends, interest, rents, royalties, and certain other payments. Tax treaties between the US and other countries may reduce this rate significantly, sometimes to zero. Non-resident aliens must provide Form W-8BEN to claim treaty benefits and certify foreign status. Without proper documentation, payers must withhold at the full 30% rate.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How do I stop backup withholding?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To stop backup withholding, address the underlying cause: provide your correct TIN via Form W-9 to payers, resolve TIN mismatches by contacting the Social Security Administration, or respond to IRS notices about underreporting. Once issues are resolved, the IRS sends a &quot;C&quot; notice to payers authorizing them to stop backup withholding. Keep copies of all correspondence and allow 4-6 weeks for processing after corrections are made.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Is withheld tax always sufficient to cover my liability?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Not necessarily. Standard withholding rates are flat percentages that don&apos;t account for your complete tax situation. If you have multiple income sources, self-employment income, or are in a higher tax bracket, withholding may fall short. Conversely, if you have significant deductions or credits, you might be over-withheld. Review withholding annually using the IRS Tax Withholding Estimator and adjust W-4 elections or make estimated payments as needed.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="tds-calculator" fallbackFaqs={fallbackFaqs} />
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
              This calculator provides estimates for informational purposes only. Actual withholding rates may vary based on
              your specific tax situation, state laws, and current IRS regulations. Consult a tax professional for personalized advice.
            </p>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
