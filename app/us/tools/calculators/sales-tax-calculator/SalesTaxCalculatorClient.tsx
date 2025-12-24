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

interface StateTaxData {
  name: string;
  rate: number;
  category: 'none' | 'low' | 'medium' | 'high';
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How is sales tax calculated?",
    answer: "Sales tax is calculated by multiplying the purchase price by the tax rate. For example, a $100 item with 8% sales tax: $100 × 0.08 = $8 tax, making the total $108. To find the pre-tax price from a total, divide by (1 + tax rate): $108 ÷ 1.08 = $100. Tax rates vary by state, county, and city.",
    order: 1
  },
  {
    id: '2',
    question: "Which states have no sales tax?",
    answer: "Five states have no state sales tax: Alaska, Delaware, Montana, New Hampshire, and Oregon. However, Alaska allows local jurisdictions to levy sales tax, so some areas in Alaska do have local sales taxes. Delaware, Montana, New Hampshire, and Oregon have no state or local sales taxes at all.",
    order: 2
  },
  {
    id: '3',
    question: "What items are typically exempt from sales tax?",
    answer: "Exemptions vary by state, but commonly exempt items include: groceries (in about 30 states), prescription medications (nearly all states), medical equipment, clothing (in some states like PA, NJ, NY), and educational materials. Many states also exempt items during special 'tax holidays' for back-to-school shopping or hurricane preparedness.",
    order: 3
  },
  {
    id: '4',
    question: "Do I have to pay sales tax on online purchases?",
    answer: "Yes, since the 2018 Supreme Court ruling (South Dakota v. Wayfair), online retailers must collect sales tax if they have significant sales in your state, even without a physical presence. The tax rate is based on your delivery address. Most major online retailers now automatically calculate and collect applicable sales tax at checkout.",
    order: 4
  }
];

export default function SalesTaxCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Forward calculator states
  const { getH1, getSubHeading } = usePageSEO('sales-tax-calculator');

  const [itemPrice, setItemPrice] = useState(100);
  const [taxRate, setTaxRate] = useState(8.25);
  const [selectedState, setSelectedState] = useState('');

  // Reverse calculator states
  const [totalPriceReverse, setTotalPriceReverse] = useState(108.25);
  const [taxRateReverse, setTaxRateReverse] = useState(8.25);

  // UI states
  const [currentTab, setCurrentTab] = useState<'forward' | 'reverse'>('forward');
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // State tax rates data
  const stateTaxRates: { [key: string]: StateTaxData } = {
    'Alabama': { name: 'Alabama', rate: 4.0, category: 'medium' },
    'Alaska': { name: 'Alaska', rate: 0, category: 'none' },
    'Arizona': { name: 'Arizona', rate: 5.6, category: 'medium' },
    'Arkansas': { name: 'Arkansas', rate: 6.5, category: 'high' },
    'California': { name: 'California', rate: 7.25, category: 'high' },
    'Colorado': { name: 'Colorado', rate: 2.9, category: 'low' },
    'Connecticut': { name: 'Connecticut', rate: 6.35, category: 'high' },
    'Delaware': { name: 'Delaware', rate: 0, category: 'none' },
    'Florida': { name: 'Florida', rate: 6.0, category: 'medium' },
    'Georgia': { name: 'Georgia', rate: 4.0, category: 'medium' },
    'Hawaii': { name: 'Hawaii', rate: 4.0, category: 'medium' },
    'Idaho': { name: 'Idaho', rate: 6.0, category: 'medium' },
    'Illinois': { name: 'Illinois', rate: 6.25, category: 'high' },
    'Indiana': { name: 'Indiana', rate: 7.0, category: 'high' },
    'Iowa': { name: 'Iowa', rate: 6.0, category: 'medium' },
    'Kansas': { name: 'Kansas', rate: 6.5, category: 'high' },
    'Kentucky': { name: 'Kentucky', rate: 6.0, category: 'medium' },
    'Louisiana': { name: 'Louisiana', rate: 4.45, category: 'medium' },
    'Maine': { name: 'Maine', rate: 5.5, category: 'medium' },
    'Maryland': { name: 'Maryland', rate: 6.0, category: 'medium' },
    'Massachusetts': { name: 'Massachusetts', rate: 6.25, category: 'high' },
    'Michigan': { name: 'Michigan', rate: 6.0, category: 'medium' },
    'Minnesota': { name: 'Minnesota', rate: 6.875, category: 'high' },
    'Mississippi': { name: 'Mississippi', rate: 7.0, category: 'high' },
    'Missouri': { name: 'Missouri', rate: 4.225, category: 'medium' },
    'Montana': { name: 'Montana', rate: 0, category: 'none' },
    'Nebraska': { name: 'Nebraska', rate: 5.5, category: 'medium' },
    'Nevada': { name: 'Nevada', rate: 4.6, category: 'medium' },
    'New Hampshire': { name: 'New Hampshire', rate: 0, category: 'none' },
    'New Jersey': { name: 'New Jersey', rate: 6.625, category: 'high' },
    'New Mexico': { name: 'New Mexico', rate: 5.125, category: 'medium' },
    'New York': { name: 'New York', rate: 4.0, category: 'medium' },
    'North Carolina': { name: 'North Carolina', rate: 4.75, category: 'medium' },
    'North Dakota': { name: 'North Dakota', rate: 5.0, category: 'medium' },
    'Ohio': { name: 'Ohio', rate: 5.75, category: 'medium' },
    'Oklahoma': { name: 'Oklahoma', rate: 4.5, category: 'medium' },
    'Oregon': { name: 'Oregon', rate: 0, category: 'none' },
    'Pennsylvania': { name: 'Pennsylvania', rate: 6.0, category: 'medium' },
    'Rhode Island': { name: 'Rhode Island', rate: 7.0, category: 'high' },
    'South Carolina': { name: 'South Carolina', rate: 6.0, category: 'medium' },
    'South Dakota': { name: 'South Dakota', rate: 4.5, category: 'medium' },
    'Tennessee': { name: 'Tennessee', rate: 7.0, category: 'high' },
    'Texas': { name: 'Texas', rate: 6.25, category: 'high' },
    'Utah': { name: 'Utah', rate: 4.85, category: 'medium' },
    'Vermont': { name: 'Vermont', rate: 6.0, category: 'medium' },
    'Virginia': { name: 'Virginia', rate: 5.3, category: 'medium' },
    'Washington': { name: 'Washington', rate: 6.5, category: 'high' },
    'West Virginia': { name: 'West Virginia', rate: 6.0, category: 'medium' },
    'Wisconsin': { name: 'Wisconsin', rate: 5.0, category: 'medium' },
    'Wyoming': { name: 'Wyoming', rate: 4.0, category: 'medium' }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Forward calculation
  const forwardResults = useMemo(() => {
    const taxAmount = itemPrice * (taxRate / 100);
    const totalPrice = itemPrice + taxAmount;
    const effectiveRate = taxRate;
    return { taxAmount, totalPrice, effectiveRate };
  }, [itemPrice, taxRate]);

  // Reverse calculation
  const reverseResults = useMemo(() => {
    const originalPrice = totalPriceReverse / (1 + (taxRateReverse / 100));
    const taxAmount = totalPriceReverse - originalPrice;
    return { originalPrice, taxAmount };
  }, [totalPriceReverse, taxRateReverse]);

  // What-If Scenarios for forward calculator
  const scenarios = useMemo(() => {
    const currentPrice = currentTab === 'forward' ? itemPrice : reverseResults.originalPrice;
    const currentRate = currentTab === 'forward' ? taxRate : taxRateReverse;

    // Scenario 1: No tax state
    const noTaxTotal = currentPrice;

    // Scenario 2: Lowest tax state (Colorado 2.9%)
    const lowTaxTotal = currentPrice * 1.029;
    const lowTaxAmount = currentPrice * 0.029;

    // Scenario 3: Highest tax state (California 7.25%)
    const highTaxTotal = currentPrice * 1.0725;
    const highTaxAmount = currentPrice * 0.0725;

    // Savings comparison
    const currentTotal = currentPrice * (1 + currentRate / 100);
    const savingsVsHigh = highTaxTotal - currentTotal;
    const savingsVsNoTax = currentTotal - noTaxTotal;

    return {
      noTax: { total: noTaxTotal, savings: savingsVsNoTax },
      lowTax: { total: lowTaxTotal, tax: lowTaxAmount, rate: 2.9 },
      highTax: { total: highTaxTotal, tax: highTaxAmount, rate: 7.25 },
      currentSavingsVsHigh: savingsVsHigh
    };
  }, [itemPrice, taxRate, currentTab, reverseResults, taxRateReverse]);

  // State categories for chart
  const stateCategories = useMemo(() => {
    const categories = { none: 0, low: 0, medium: 0, high: 0 };
    Object.values(stateTaxRates).forEach(state => {
      categories[state.category]++;
    });
    return categories;
  }, []);

  // SVG Donut Chart for price breakdown
  const chartData = useMemo(() => {
    const price = currentTab === 'forward' ? itemPrice : reverseResults.originalPrice;
    const tax = currentTab === 'forward' ? forwardResults.taxAmount : reverseResults.taxAmount;
    const total = price + tax;

    return [
      { label: 'Original Price', value: price, color: '#3B82F6', percentage: (price / total) * 100 },
      { label: 'Sales Tax', value: tax, color: '#F59E0B', percentage: (tax / total) * 100 }
    ];
  }, [currentTab, itemPrice, forwardResults, reverseResults]);

  // Create SVG arc path
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

  // Calculate angles for donut chart
  const chartAngles = useMemo(() => {
    let currentAngle = 0;
    return chartData.map(segment => {
      const angle = (segment.percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      return { ...segment, startAngle, endAngle: currentAngle };
    });
  }, [chartData]);

  const handleStateChange = (stateName: string) => {
    if (stateName && stateTaxRates[stateName]) {
      setSelectedState(stateName);
      if (currentTab === 'forward') {
        setTaxRate(stateTaxRates[stateName].rate);
      } else {
        setTaxRateReverse(stateTaxRates[stateName].rate);
      }
    } else {
      setSelectedState('');
    }
  };

  // Tax comparison table data
  const taxComparison = useMemo(() => {
    const price = currentTab === 'forward' ? itemPrice : reverseResults.originalPrice;
    const rates = [0, 3, 5, 6.25, 7.25];
    return rates.map(rate => ({
      rate,
      tax: price * (rate / 100),
      total: price * (1 + rate / 100)
    }));
  }, [currentTab, itemPrice, reverseResults]);

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Sales Tax Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Calculate sales tax amount and total price with reverse calculator and US state rates
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4 sm:mb-4 md:mb-6">
          <button
            onClick={() => setCurrentTab('forward')}
            className={`px-3 xs:px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors ${
              currentTab === 'forward'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Calculate Tax
          </button>
          <button
            onClick={() => setCurrentTab('reverse')}
            className={`px-3 xs:px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors ${
              currentTab === 'reverse'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reverse
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            {/* Quick Presets */}
            <div>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Quick Presets</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button onClick={() => currentTab === 'forward' ? setItemPrice(50) : setTotalPriceReverse(54.13)} className="px-2 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                  $50
                </button>
                <button onClick={() => currentTab === 'forward' ? setItemPrice(100) : setTotalPriceReverse(108.25)} className="px-2 sm:px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                  $100
                </button>
                <button onClick={() => currentTab === 'forward' ? setItemPrice(500) : setTotalPriceReverse(541.25)} className="px-2 sm:px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                  $500
                </button>
                <button onClick={() => currentTab === 'forward' ? setItemPrice(1000) : setTotalPriceReverse(1082.50)} className="px-2 sm:px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                  $1,000
                </button>
              </div>
            </div>

            {currentTab === 'forward' ? (
              /* Forward Calculator Inputs */
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Item Price (Before Tax)</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(itemPrice)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="1"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$1</span>
                    <span>$10,000</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Sales Tax Rate</span>
                    <span className="text-blue-600 font-semibold">{taxRate.toFixed(2)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.25"
                    value={taxRate}
                    onChange={(e) => { setTaxRate(parseFloat(e.target.value)); setSelectedState(''); }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Select US State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a state...</option>
                    <option value="" disabled>── No Sales Tax ──</option>
                    {Object.entries(stateTaxRates).filter(([_, s]) => s.category === 'none').map(([key, state]) => (
                      <option key={key} value={key}>{state.name} - {state.rate}%</option>
                    ))}
                    <option value="" disabled>── Low Tax ──</option>
                    {Object.entries(stateTaxRates).filter(([_, s]) => s.category === 'low').map(([key, state]) => (
                      <option key={key} value={key}>{state.name} - {state.rate}%</option>
                    ))}
                    <option value="" disabled>── Medium Tax ──</option>
                    {Object.entries(stateTaxRates).filter(([_, s]) => s.category === 'medium').map(([key, state]) => (
                      <option key={key} value={key}>{state.name} - {state.rate}%</option>
                    ))}
                    <option value="" disabled>── High Tax ──</option>
                    {Object.entries(stateTaxRates).filter(([_, s]) => s.category === 'high').map(([key, state]) => (
                      <option key={key} value={key}>{state.name} - {state.rate}%</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              /* Reverse Calculator Inputs */
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Total Price (With Tax)</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(totalPriceReverse)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="1"
                    value={totalPriceReverse}
                    onChange={(e) => setTotalPriceReverse(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$1</span>
                    <span>$10,000</span>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Sales Tax Rate</span>
                    <span className="text-blue-600 font-semibold">{taxRateReverse.toFixed(2)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.25"
                    value={taxRateReverse}
                    onChange={(e) => { setTaxRateReverse(parseFloat(e.target.value)); setSelectedState(''); }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Select US State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a state...</option>
                    {Object.entries(stateTaxRates).map(([key, state]) => (
                      <option key={key} value={key}>{state.name} - {state.rate}%</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* SVG Donut Chart */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Price Breakdown</h3>
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <svg viewBox="0 0 200 200" className="w-40 h-40">
                  {chartAngles.map((segment, index) => (
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
                      ? formatCurrency(chartAngles.find(s => s.label === hoveredSegment)?.value || 0)
                      : formatCurrency(currentTab === 'forward' ? forwardResults.totalPrice : totalPriceReverse)}
                  </text>
                </svg>

                <div className="space-y-3">
                  {chartAngles.map((segment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 cursor-pointer"
                      onMouseEnter={() => setHoveredSegment(segment.label)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
                      <div>
                        <div className="text-sm font-medium text-gray-700">{segment.label}</div>
                        <div className="text-xs text-gray-500">{segment.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {currentTab === 'forward' ? (
              /* Forward Results */
              <>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 sm:p-4 md:p-6">
                  <div className="text-sm font-medium text-green-100 mb-1">Total Price</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{formatCurrency(forwardResults.totalPrice)}</div>
                  <div className="text-sm text-green-100">at {taxRate}% tax rate</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-sm text-blue-700">Original Price</div>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(itemPrice)}</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <div className="text-sm text-orange-700">Tax Amount</div>
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(forwardResults.taxAmount)}</div>
                  </div>
                </div>
              </>
            ) : (
              /* Reverse Results */
              <>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 sm:p-4 md:p-6">
                  <div className="text-sm font-medium text-blue-100 mb-1">Original Price (Before Tax)</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{formatCurrency(reverseResults.originalPrice)}</div>
                  <div className="text-sm text-blue-100">at {taxRateReverse}% tax rate</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="text-sm text-green-700">Total Paid</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPriceReverse)}</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <div className="text-sm text-orange-700">Tax Included</div>
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(reverseResults.taxAmount)}</div>
                  </div>
                </div>
              </>
            )}

            {/* Tax Rate Comparison Table */}
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Tax Rate Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-gray-700">Rate</th>
                      <th className="text-right py-2 font-medium text-gray-700">Tax</th>
                      <th className="text-right py-2 font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxComparison.map((row, index) => {
                      const currentRate = currentTab === 'forward' ? taxRate : taxRateReverse;
                      const isSelected = Math.abs(row.rate - currentRate) < 0.5;
                      return (
                        <tr key={index} className={`border-b ${isSelected ? 'bg-green-50' : ''}`}>
                          <td className="py-2 font-medium">{row.rate}%</td>
                          <td className="text-right text-orange-600">{formatCurrency(row.tax)}</td>
                          <td className="text-right font-medium text-blue-600">{formatCurrency(row.total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional SVG Charts Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-4 md:mb-6">Sales Tax Visualizations</h2>

        {/* Chart 1: Tax Rate Comparison Bar Chart */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Rate Comparison Across Different Rates</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="barGradient0" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="barGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="barGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="barGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="180" x2="740" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="120" x2="740" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="60" x2="740" y2="60" stroke="#e5e7eb" strokeWidth="1" />

              {/* Axis */}
              <line x1="60" y1="20" x2="60" y2="240" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="240" x2="740" y2="240" stroke="#374151" strokeWidth="2" />

              {(() => {
                const price = currentTab === 'forward' ? itemPrice : reverseResults.originalPrice;
                const rates = [0, 5, 7.25, 10];
                const maxTotal = price * 1.10;
                const scale = 200 / maxTotal;

                return rates.map((rate, idx) => {
                  const taxAmount = price * (rate / 100);
                  const total = price + taxAmount;
                  const height = total * scale;
                  const y = 240 - height;
                  const x = 100 + idx * 150;

                  return (
                    <g key={idx}>
                      <rect
                        x={x}
                        y={y}
                        width="80"
                        height={height}
                        fill={`url(#barGradient${idx})`}
                        rx="4"
                        className="transition-all duration-200"
                      />
                      <text x={x + 40} y={y - 10} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                        {formatCurrency(total)}
                      </text>
                      <text x={x + 40} y={260} textAnchor="middle" className="text-sm fill-gray-600">
                        {rate}%
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Y-axis labels */}
              <text x="55" y="245" textAnchor="end" className="text-xs fill-gray-600">$0</text>
              <text x="55" y="125" textAnchor="end" className="text-xs fill-gray-600">
                {formatCurrency(((currentTab === 'forward' ? itemPrice : reverseResults.originalPrice) * 1.10) / 2)}
              </text>
              <text x="55" y="25" textAnchor="end" className="text-xs fill-gray-600">
                {formatCurrency((currentTab === 'forward' ? itemPrice : reverseResults.originalPrice) * 1.10)}
              </text>

              <text x="400" y="290" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                Tax Rate
              </text>
            </svg>
          </div>
        </div>

        {/* Chart 2: State Tax Distribution */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">US State Tax Rate Distribution</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="stateBar0" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="stateBar1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="stateBar2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="stateBar3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="180" x2="740" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="120" x2="740" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="60" x2="740" y2="60" stroke="#e5e7eb" strokeWidth="1" />

              {/* Axis */}
              <line x1="60" y1="20" x2="60" y2="240" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="240" x2="740" y2="240" stroke="#374151" strokeWidth="2" />

              {(() => {
                const categories = [
                  { label: 'No Tax', count: stateCategories.none, color: 'url(#stateBar0)' },
                  { label: 'Low (0-3%)', count: stateCategories.low, color: 'url(#stateBar1)' },
                  { label: 'Medium (3-6%)', count: stateCategories.medium, color: 'url(#stateBar2)' },
                  { label: 'High (6%+)', count: stateCategories.high, color: 'url(#stateBar3)' }
                ];

                const maxCount = Math.max(...categories.map(c => c.count));
                const scale = 200 / maxCount;

                return categories.map((cat, idx) => {
                  const height = cat.count * scale;
                  const y = 240 - height;
                  const x = 100 + idx * 150;

                  return (
                    <g key={idx}>
                      <rect
                        x={x}
                        y={y}
                        width="80"
                        height={height}
                        fill={cat.color}
                        rx="4"
                        className="transition-all duration-200"
                      />
                      <text x={x + 40} y={y - 10} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                        {cat.count} states
                      </text>
                      <text x={x + 40} y={260} textAnchor="middle" className="text-xs fill-gray-600">
                        {cat.label}
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Y-axis labels */}
              <text x="55" y="245" textAnchor="end" className="text-xs fill-gray-600">0</text>
              <text x="55" y="125" textAnchor="end" className="text-xs fill-gray-600">
                {Math.max(...Object.values(stateCategories)) / 2}
              </text>
              <text x="55" y="25" textAnchor="end" className="text-xs fill-gray-600">
                {Math.max(...Object.values(stateCategories))}
              </text>
            </svg>
          </div>
        </div>

        {/* Chart 3: Cumulative Cost Visualization */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Components Breakdown</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 200" className="w-full h-auto">
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="taxGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              {(() => {
                const price = currentTab === 'forward' ? itemPrice : reverseResults.originalPrice;
                const tax = currentTab === 'forward' ? forwardResults.taxAmount : reverseResults.taxAmount;
                const total = price + tax;
                const priceWidth = (price / total) * 600;
                const taxWidth = (tax / total) * 600;

                return (
                  <>
                    {/* Original Price Bar */}
                    <rect x="100" y="60" width={priceWidth} height="40" fill="url(#priceGradient)" rx="4" />
                    <text x={100 + priceWidth / 2} y="85" textAnchor="middle" className="text-sm font-semibold fill-white">
                      Original: {formatCurrency(price)}
                    </text>

                    {/* Tax Bar */}
                    <rect x={100 + priceWidth} y="60" width={taxWidth} height="40" fill="url(#taxGradient)" rx="4" />
                    <text x={100 + priceWidth + taxWidth / 2} y="85" textAnchor="middle" className="text-sm font-semibold fill-white">
                      Tax: {formatCurrency(tax)}
                    </text>

                    {/* Total indicator */}
                    <line x1="100" y1="120" x2="700" y2="120" stroke="#374151" strokeWidth="2" />
                    <text x="400" y="145" textAnchor="middle" className="text-lg font-bold fill-gray-700">
                      Total: {formatCurrency(total)}
                    </text>

                    {/* Percentage labels */}
                    <text x={100 + priceWidth / 2} y="175" textAnchor="middle" className="text-xs fill-blue-600">
                      {((price / total) * 100).toFixed(1)}%
                    </text>
                    <text x={100 + priceWidth + taxWidth / 2} y="175" textAnchor="middle" className="text-xs fill-orange-600">
                      {((tax / total) * 100).toFixed(1)}%
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Sales Tax in the United States</h2>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Sales tax is a consumption tax imposed by state and local governments on the sale of goods and some services. Unlike a national VAT system used in many countries, the US relies on a patchwork of state, county, and city taxes, making it essential to know your local combined rate for accurate pricing and budgeting.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-semibold text-green-900 mb-2">Forward Calculation</h3>
              <p className="text-sm text-green-800 mb-1">Tax = Price × Rate</p>
              <p className="text-xs text-green-700">Use when you know the pre-tax price and want to calculate total cost with tax included.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Reverse Calculation</h3>
              <p className="text-sm text-blue-800 mb-1">Original = Total ÷ (1 + Rate)</p>
              <p className="text-xs text-blue-700">Use to find the original price when you only know the tax-inclusive total.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">How Sales Tax Rates Vary</h3>
          <p className="text-gray-600 mb-4">
            State sales tax rates range from 0% (in five states: Alaska, Delaware, Montana, New Hampshire, Oregon) to 7.25% (California). However, local jurisdictions can add their own taxes, pushing combined rates as high as 11.5% in some areas. For example, Seattle has a combined rate of 10.25%, while parts of Louisiana exceed 11%.
          </p>

          <div className="grid md:grid-cols-3 gap-3 my-6 not-prose">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">5</div>
              <div className="text-xs text-gray-600">States with No Sales Tax</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">5.09%</div>
              <div className="text-xs text-gray-600">Average State Rate</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-700">11.5%</div>
              <div className="text-xs text-gray-600">Highest Combined Rate</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Sales Tax Exemptions</h3>
          <p className="text-gray-600">
            Most states exempt certain items from sales tax. Groceries are exempt or taxed at lower rates in about 30 states. Prescription medications are exempt nearly everywhere. Some states like Pennsylvania, New Jersey, and New York exempt most clothing. Many states offer annual "tax holidays" for back-to-school shopping, hurricane supplies, or energy-efficient appliances, temporarily waiving sales tax on qualifying purchases.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="sales-tax-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
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
              State sales tax rates shown are base rates only. Local city and county taxes may apply in addition to state rates.
              Some items may be exempt from sales tax. Always verify current rates with your state&apos;s department of revenue.
            </p>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
