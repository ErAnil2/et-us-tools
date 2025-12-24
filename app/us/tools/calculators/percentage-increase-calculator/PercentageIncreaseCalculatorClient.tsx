'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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
  { href: '/us/tools/calculators/percentage-difference-calculator', title: 'Percentage Difference', description: 'Find difference between values', color: 'bg-green-500', icon: '%' },
  { href: '/us/tools/calculators/percentage-decrease-calculator', title: 'Percentage Decrease', description: 'Calculate percent decrease', color: 'bg-red-500', icon: '%' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Percentage Increase Calculator?",
    answer: "A Percentage Increase Calculator is a mathematical tool that helps you quickly calculate or convert percentage increase-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Percentage Increase Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Percentage Increase Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
    order: 3
  },
  {
    id: '4',
    question: "Can I use this for professional or academic work?",
    answer: "Yes, this calculator is suitable for professional, academic, and personal use. It uses standard formulas that are widely accepted. However, always verify critical calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Is this calculator free?",
    answer: "Yes, this Percentage Increase Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function PercentageIncreaseCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Main calculation
  const { getH1, getSubHeading } = usePageSEO('percentage-increase-calculator');

  const [originalValue, setOriginalValue] = useState(100);
  const [newValue, setNewValue] = useState(125);

  // Alternative calculation
  const [baseValue, setBaseValue] = useState(100);
  const [percentageChange, setPercentageChange] = useState(25);
  const [calculatedNewValue, setCalculatedNewValue] = useState('125.00');

  // Results
  const [percentageResult, setPercentageResult] = useState('+25.00%');
  const [changeType, setChangeType] = useState('Increase');
  const [absoluteChange, setAbsoluteChange] = useState('25.00');
  const [multiplier, setMultiplier] = useState('1.25x');
  const [displayOriginal, setDisplayOriginal] = useState('100.00');
  const [displayNew, setDisplayNew] = useState('125.00');
  const [formula, setFormula] = useState('((125 - 100) / 100) x 100 = 25.00%');
  const [resultCardClass, setResultCardClass] = useState('from-green-50 to-emerald-50 border-green-200');
  const [resultTextClass, setResultTextClass] = useState('text-green-700');
  const [changeTypeClass, setChangeTypeClass] = useState('text-green-600');

  const calculatePercentageChange = () => {
    const original = originalValue || 0;
    const newVal = newValue || 0;

    if (original === 0) {
      setPercentageResult('0%');
      setChangeType('Change');
      setAbsoluteChange('0');
      setMultiplier('1.00x');
      setDisplayOriginal('0');
      setDisplayNew('0');
      setFormula('Enter values to calculate');
      return;
    }

    const change = newVal - original;
    const pctChange = (change / original) * 100;
    const mult = newVal / original;

    if (pctChange > 0) {
      setResultCardClass('from-green-50 to-emerald-50 border-green-200');
      setResultTextClass('text-green-700');
      setPercentageResult(`+${Math.abs(pctChange).toFixed(2)}%`);
      setChangeType('Increase');
      setChangeTypeClass('text-green-600');
    } else if (pctChange < 0) {
      setResultCardClass('from-red-50 to-rose-50 border-red-200');
      setResultTextClass('text-red-700');
      setPercentageResult(`${pctChange.toFixed(2)}%`);
      setChangeType('Decrease');
      setChangeTypeClass('text-red-600');
    } else {
      setResultCardClass('from-gray-50 to-slate-50 border-gray-200');
      setResultTextClass('text-gray-700');
      setPercentageResult('0%');
      setChangeType('No Change');
      setChangeTypeClass('text-gray-600');
    }

    setAbsoluteChange(change.toFixed(2));
    setMultiplier(`${mult.toFixed(2)}x`);
    setDisplayOriginal(original.toFixed(2));
    setDisplayNew(newVal.toFixed(2));
    setFormula(`((${newVal} - ${original}) / ${original}) x 100 = ${pctChange.toFixed(2)}%`);
  };

  const calculateNewValue = () => {
    const base = baseValue || 0;
    const pctChange = percentageChange || 0;

    if (base === 0) {
      setCalculatedNewValue('0.00');
      return;
    }

    const newVal = base * (1 + pctChange / 100);
    setCalculatedNewValue(newVal.toFixed(2));
  };

  useEffect(() => {
    calculatePercentageChange();
  }, [originalValue, newValue]);

  useEffect(() => {
    calculateNewValue();
  }, [baseValue, percentageChange]);

  const applyExample = (original: number, newVal: number) => {
    setOriginalValue(original);
    setNewValue(newVal);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Percentage Increase Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{getH1('Percentage Increase Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600">Calculate percentage increase, decrease, and change between two values</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          {/* Main Calculation */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Calculate Percentage Change
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <label htmlFor="originalValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Original Value</label>
                <input
                  type="number"
                  id="originalValue"
                  step="0.01"
                  value={originalValue}
                  onChange={(e) => setOriginalValue(parseFloat(e.target.value) || 0)}
                  placeholder="Enter original value"
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="newValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">New Value</label>
                <input
                  type="number"
                  id="newValue"
                  step="0.01"
                  value={newValue}
                  onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                  placeholder="Enter new value"
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className={`p-3 md:p-4 bg-gradient-to-br ${resultCardClass} rounded-lg border-2`}>
                <div className="text-xs md:text-sm text-gray-600 mb-1">Percentage Change</div>
                <div className={`text-xl md:text-2xl font-bold ${resultTextClass}`}>{percentageResult}</div>
                <div className={`text-xs md:text-sm mt-1 ${changeTypeClass}`}>{changeType}</div>
              </div>

              <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                <div className="text-xs md:text-sm text-blue-600 font-medium mb-1">Absolute Change</div>
                <div className="text-xl md:text-2xl font-bold text-blue-800">{absoluteChange}</div>
              </div>

              <div className="p-3 md:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                <div className="text-xs md:text-sm text-purple-600 font-medium mb-1">Multiplier</div>
                <div className="text-xl md:text-2xl font-bold text-purple-800">{multiplier}</div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Alternative: Calculate New Value */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Calculate New Value from Percentage
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
              <div>
                <label htmlFor="baseValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Base Value</label>
                <input
                  type="number"
                  id="baseValue"
                  step="0.01"
                  value={baseValue}
                  onChange={(e) => setBaseValue(parseFloat(e.target.value) || 0)}
                  placeholder="Base value"
                  className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="percentageChange" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">% Change</label>
                <div className="relative">
                  <input
                    type="number"
                    id="percentageChange"
                    step="0.1"
                    value={percentageChange}
                    onChange={(e) => setPercentageChange(parseFloat(e.target.value) || 0)}
                    placeholder="% change"
                    className="w-full pl-3 pr-8 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Use negative for decrease</p>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">New Value</label>
                <input
                  type="text"
                  readOnly
                  value={calculatedNewValue}
                  className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Common Examples */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Common Examples
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => applyExample(100, 120)}
                className="p-3 text-left border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
              >
                <div className="font-semibold text-sm md:text-base">Price Increase</div>
                <div className="text-xs text-gray-600">$100 → $120</div>
                <div className="font-medium text-green-600 text-xs md:text-sm mt-1">20% increase</div>
              </button>

              <button
                onClick={() => applyExample(1000, 1500)}
                className="p-3 text-left border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-sm md:text-base">Sales Growth</div>
                <div className="text-xs text-gray-600">1,000 → 1,500</div>
                <div className="font-medium text-blue-600 text-xs md:text-sm mt-1">50% increase</div>
              </button>

              <button
                onClick={() => applyExample(80, 60)}
                className="p-3 text-left border-2 border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all"
              >
                <div className="font-semibold text-sm md:text-base">Discount</div>
                <div className="text-xs text-gray-600">$80 → $60</div>
                <div className="font-medium text-red-600 text-xs md:text-sm mt-1">25% decrease</div>
              </button>
            </div>
          </div>
</div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Calculation Details
            </h3>

            {/* Values */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Values</div>
              <div className="space-y-1.5 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original:</span>
                  <span className="font-semibold">{displayOriginal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New:</span>
                  <span className="font-semibold">{displayNew}</span>
                </div>
              </div>
            </div>

            {/* Formula */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Formula Used</div>
              <div className="text-xs font-mono text-gray-800 leading-relaxed">
                {formula}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">
          Formula & How to Calculate
        </h3>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-900">Percentage Change Formula:</h4>
            <div className="p-3 md:p-4 bg-purple-50 rounded-lg border border-purple-200 mb-3 md:mb-4">
              <div className="font-mono text-xs md:text-sm text-purple-900">
                ((New Value - Original Value) / Original Value) x 100
              </div>
            </div>
            <ul className="space-y-1 text-xs md:text-sm text-gray-700">
              <li>• Positive result = increase</li>
              <li>• Negative result = decrease</li>
              <li>• Multiply by 100 to get percentage</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-gray-900">Step by Step:</h4>
            <ol className="space-y-2 list-decimal list-inside text-xs md:text-sm text-gray-700">
              <li>Find the difference (new - original)</li>
              <li>Divide by original value</li>
              <li>Multiply by 100</li>
              <li>Add % sign to result</li>
            </ol>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">%</div>
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
        <FirebaseFAQs pageId="percentage-increase-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
