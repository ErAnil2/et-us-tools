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
  color: string;
  icon: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type CalcType = 'change' | 'difference' | 'findNew';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Percentage Change Calculator?",
    answer: "A Percentage Change Calculator is a mathematical tool that helps you quickly calculate or convert percentage change-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Percentage Change Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Percentage Change Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Percentage Change Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function PercentageChangeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('percentage-change-calculator');

  const [calcType, setCalcType] = useState<CalcType>('change');

  // Change calculation
  const [originalValue, setOriginalValue] = useState(100);
  const [newValue, setNewValue] = useState(125);

  // Difference calculation
  const [value1, setValue1] = useState(80);
  const [value2, setValue2] = useState(120);

  // Find new value
  const [baseValue, setBaseValue] = useState(100);
  const [targetPercentage, setTargetPercentage] = useState(25);

  // Results
  const [mainResult, setMainResult] = useState('+25.0%');
  const [resultLabel, setResultLabel] = useState('Percentage Change');
  const [resultColor, setResultColor] = useState('text-green-700');
  const [absoluteChange, setAbsoluteChange] = useState('+25');
  const [changeDirection, setChangeDirection] = useState('Increase');
  const [directionColor, setDirectionColor] = useState('text-green-600');
  const [multiplier, setMultiplier] = useState('1.25x');
  const [displayOriginal, setDisplayOriginal] = useState('100');
  const [displayNew, setDisplayNew] = useState('125');
  const [ratio, setRatio] = useState('1.25:1');
  const [reversePercent, setReversePercent] = useState('-20.0%');
  const [scenario10, setScenario10] = useState('110');
  const [scenario50, setScenario50] = useState('150');
  const [scenarioDouble, setScenarioDouble] = useState('200');
  const [interpretation, setInterpretation] = useState('');

  const formatNumber = (num: number, decimals = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const getInterpretation = (percentChange: number) => {
    const absChange = Math.abs(percentChange);
    const direction = percentChange >= 0 ? 'increase' : 'decrease';

    if (absChange >= 100) {
      return `This represents a very large ${direction}, meaning the value has more than ${direction === 'increase' ? 'doubled' : 'halved'}.`;
    } else if (absChange >= 50) {
      return `This represents a significant ${direction}, indicating a major change in the value.`;
    } else if (absChange >= 25) {
      return `This represents a moderate ${direction}, meaning the new value is substantially different from the original.`;
    } else if (absChange >= 10) {
      return `This represents a noticeable ${direction}, indicating a meaningful change in the value.`;
    } else if (absChange >= 5) {
      return `This represents a small ${direction}, showing a minor but potentially significant change.`;
    } else {
      return `This represents a minimal ${direction}, indicating very little change between the values.`;
    }
  };

  const calculatePercentage = () => {
    let result: number, original: number, newVal: number, absChange: number;

    if (calcType === 'change') {
      original = originalValue || 0;
      newVal = newValue || 0;

      if (original === 0) {
        result = newVal === 0 ? 0 : Infinity;
        absChange = newVal - original;
      } else {
        absChange = newVal - original;
        result = (absChange / original) * 100;
      }

      setResultLabel('Percentage Change');
      const sign = result >= 0 ? '+' : '';
      setMainResult(`${sign}${formatNumber(result)}%`);
      setResultColor(result >= 0 ? 'text-green-700' : 'text-red-700');

    } else if (calcType === 'difference') {
      const v1 = value1 || 0;
      const v2 = value2 || 0;
      const average = (v1 + v2) / 2;

      if (average === 0) {
        result = 0;
      } else {
        result = (Math.abs(v1 - v2) / average) * 100;
      }

      original = Math.min(v1, v2);
      newVal = Math.max(v1, v2);
      absChange = Math.abs(v1 - v2);

      setResultLabel('Percentage Difference');
      setMainResult(`${formatNumber(result)}%`);
      setResultColor('text-blue-700');

    } else {
      const base = baseValue || 0;
      const targetPct = targetPercentage || 0;

      result = base * (1 + targetPct / 100);
      original = base;
      newVal = result;
      absChange = result - base;

      setResultLabel('New Value');
      setMainResult(formatNumber(result, 2));
      setResultColor('text-purple-700');

      result = targetPct;
    }

    // Update change details
    setAbsoluteChange((absChange >= 0 ? '+' : '') + formatNumber(absChange, 2));
    const direction = result >= 0 ? 'Increase' : 'Decrease';
    setChangeDirection(direction);
    setDirectionColor(result >= 0 ? 'text-green-600' : 'text-red-600');

    const mult = original !== 0 ? newVal / original : 1;
    setMultiplier(`${formatNumber(mult, 2)}x`);

    setDisplayOriginal(formatNumber(original, 2));
    setDisplayNew(formatNumber(newVal, 2));
    setRatio(original !== 0 ? `${formatNumber(newVal/original, 2)}:1` : 'N/A');

    // Reverse calculation
    if (newVal !== 0 && calcType !== 'difference') {
      const revPercent = ((original - newVal) / newVal) * 100;
      setReversePercent(`${revPercent >= 0 ? '+' : ''}${formatNumber(revPercent)}%`);
    }

    // What-if scenarios
    if (calcType === 'change' || calcType === 'findNew') {
      const baseForScenarios = calcType === 'change' ? originalValue : baseValue;
      setScenario10(formatNumber(baseForScenarios * 1.1, 2));
      setScenario50(formatNumber(baseForScenarios * 1.5, 2));
      setScenarioDouble(formatNumber(baseForScenarios * 2, 2));
    }

    setInterpretation(getInterpretation(result));
  };

  useEffect(() => {
    calculatePercentage();
  }, [calcType, originalValue, newValue, value1, value2, baseValue, targetPercentage]);

  const applyScenario = (type: CalcType, original: number, newVal: number) => {
    setCalcType(type);
    if (type === 'change') {
      setOriginalValue(original);
      setNewValue(newVal);
    }
  };

  const getCalcTypeCardClass = (type: CalcType) => {
    const base = 'p-3 border-2 rounded-xl transition-all cursor-pointer';
    if (calcType === type) {
      if (type === 'change') return `${base} border-green-600 bg-green-50`;
      if (type === 'difference') return `${base} border-blue-600 bg-blue-50`;
      if (type === 'findNew') return `${base} border-purple-600 bg-purple-50`;
    }
    return `${base} border-gray-300 hover:border-gray-400`;
  };

  const getResultCardClass = () => {
    if (calcType === 'change') return 'bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-green-200';
    if (calcType === 'difference') return 'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-blue-200';
    return 'bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-purple-200';
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Percentage Change Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{getH1('Percentage Change Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600">Calculate percentage change, difference, or find new values</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          {/* Calculation Type Selection */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Calculation Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <div
                className={getCalcTypeCardClass('change')}
                onClick={() => setCalcType('change')}
              >
                <div className="text-sm md:text-base font-semibold text-gray-900">Percentage Change</div>
                <div className="text-xs text-gray-500">Compare two values</div>
              </div>

              <div
                className={getCalcTypeCardClass('difference')}
                onClick={() => setCalcType('difference')}
              >
                <div className="text-sm md:text-base font-semibold text-gray-900">Percentage Difference</div>
                <div className="text-xs text-gray-500">Symmetric comparison</div>
              </div>

              <div
                className={getCalcTypeCardClass('findNew')}
                onClick={() => setCalcType('findNew')}
              >
                <div className="text-sm md:text-base font-semibold text-gray-900">Find New Value</div>
                <div className="text-xs text-gray-500">From percentage</div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Input Forms */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            {/* Standard Change Calculation */}
            {calcType === 'change' && (
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Calculate Percentage Change</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label htmlFor="originalValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Original Value</label>
                    <input
                      type="number"
                      id="originalValue"
                      className="w-full px-3 md:px-2 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter original value"
                    />
                  </div>

                  <div>
                    <label htmlFor="newValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">New Value</label>
                    <input
                      type="number"
                      id="newValue"
                      className="w-full px-3 md:px-2 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={newValue}
                      onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter new value"
                    />
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-green-50 p-2 md:p-3 rounded-lg mt-3">
                  <span className="font-medium">Formula:</span> ((New Value - Original Value) / Original Value) x 100
                </div>
              </div>
            )}

            {/* Difference Calculation */}
            {calcType === 'difference' && (
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Calculate Percentage Difference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label htmlFor="value1" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Value 1</label>
                    <input
                      type="number"
                      id="value1"
                      className="w-full px-3 md:px-2 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={value1}
                      onChange={(e) => setValue1(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter first value"
                    />
                  </div>

                  <div>
                    <label htmlFor="value2" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Value 2</label>
                    <input
                      type="number"
                      id="value2"
                      className="w-full px-3 md:px-2 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={value2}
                      onChange={(e) => setValue2(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter second value"
                    />
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-blue-50 p-2 md:p-3 rounded-lg mt-3">
                  <span className="font-medium">Formula:</span> (|Value1 - Value2| / ((Value1 + Value2) / 2)) x 100
                </div>
              </div>
            )}

            {/* Find New Value */}
            {calcType === 'findNew' && (
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Find New Value from Percentage</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label htmlFor="baseValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Original Value</label>
                    <input
                      type="number"
                      id="baseValue"
                      className="w-full px-3 md:px-2 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      value={baseValue}
                      onChange={(e) => setBaseValue(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter original value"
                    />
                  </div>

                  <div>
                    <label htmlFor="targetPercentage" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Percentage Change</label>
                    <div className="relative">
                      <input
                        type="number"
                        id="targetPercentage"
                        className="w-full pl-3 md:pl-4 pr-8 py-2 md:py-2.5 text-sm md:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={targetPercentage}
                        onChange={(e) => setTargetPercentage(parseFloat(e.target.value) || 0)}
                        step="0.1"
                        placeholder="Enter percentage"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Use negative values for decrease</p>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-purple-50 p-2 md:p-3 rounded-lg mt-3">
                  <span className="font-medium">Formula:</span> New Value = Original Value x (1 + Percentage Change / 100)
                </div>
              </div>
            )}
          </div>

          {/* Common Scenarios */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Common Scenarios
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                type="button"
                className="p-2 md:p-3 text-xs md:text-sm border-2 border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                onClick={() => applyScenario('change', 1000, 1200)}
              >
                <div className="font-semibold">Salary Raise</div>
                <div className="text-xs text-gray-500">$1k → $1.2k</div>
              </button>

              <button
                type="button"
                className="p-2 md:p-3 text-xs md:text-sm border-2 border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                onClick={() => applyScenario('change', 50, 45)}
              >
                <div className="font-semibold">Price Drop</div>
                <div className="text-xs text-gray-500">$50 → $45</div>
              </button>

              <button
                type="button"
                className="p-2 md:p-3 text-xs md:text-sm border-2 border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                onClick={() => applyScenario('change', 100, 150)}
              >
                <div className="font-semibold">Stock Gain</div>
                <div className="text-xs text-gray-500">$100 → $150</div>
              </button>

              <button
                type="button"
                className="p-2 md:p-3 text-xs md:text-sm border-2 border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all"
                onClick={() => applyScenario('change', 200, 170)}
              >
                <div className="font-semibold">Weight Loss</div>
                <div className="text-xs text-gray-500">200lb → 170lb</div>
              </button>
            </div>
          </div>
</div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Results
            </h3>

            {/* Main Result */}
            <div className={getResultCardClass()}>
              <div className="text-xs md:text-sm text-gray-600 mb-1">{resultLabel}</div>
              <div className={`text-2xl md:text-3xl font-bold ${resultColor}`}>{mainResult}</div>
            </div>

            {/* Change Details */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Change Details</div>
              <div className="space-y-1.5 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Absolute Change:</span>
                  <span className="font-semibold">{absoluteChange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Direction:</span>
                  <span className={`font-semibold ${directionColor}`}>{changeDirection}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Multiplier:</span>
                  <span className="font-semibold">{multiplier}</span>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Value Comparison</div>
              <div className="space-y-1.5 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original:</span>
                  <span className="font-semibold">{displayOriginal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New:</span>
                  <span className="font-semibold">{displayNew}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ratio:</span>
                  <span className="font-semibold">{ratio}</span>
                </div>
              </div>
            </div>

            {/* Reverse Calculation */}
            {calcType !== 'difference' && (
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 border border-gray-200">
                <div className="text-xs text-gray-600 mb-1">Reverse Calculation</div>
                <div className="text-xs text-gray-600">
                  To reverse back to original:<br />
                  <span className="font-semibold">{reversePercent}</span>
                </div>
              </div>
            )}

            {/* What-If Scenarios */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">What If Scenarios</div>
              <div className="space-y-1.5">
                <div className="bg-white rounded p-2">
                  <div className="text-xs text-gray-600">10% increase:</div>
                  <div className="font-semibold text-xs md:text-sm">{scenario10}</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-xs text-gray-600">50% increase:</div>
                  <div className="font-semibold text-xs md:text-sm">{scenario50}</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-xs text-gray-600">Double (100%):</div>
                  <div className="font-semibold text-xs md:text-sm">{scenarioDouble}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
          Interpretation
        </h3>
        <div className="text-sm md:text-base text-gray-700">
          {interpretation}
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
        <FirebaseFAQs pageId="percentage-change-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
