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
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type CalculationType = 'original' | 'percentage' | 'result';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Reverse Percentage Calculator?",
    answer: "A Reverse Percentage Calculator is a mathematical tool that helps you quickly calculate or convert reverse percentage-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Reverse Percentage Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Reverse Percentage Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Reverse Percentage Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function ReversePercentageCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('reverse-percentage-calculator');

  const [calculationType, setCalculationType] = useState<CalculationType>('original');

  // Original Value inputs
  const [finalValue, setFinalValue] = useState(120);
  const [percentageChange, setPercentageChange] = useState(20);
  const [changeType, setChangeType] = useState<'increase' | 'decrease'>('increase');

  // Percentage inputs
  const [originalValueForPercentage, setOriginalValueForPercentage] = useState(100);
  const [finalValueForPercentage, setFinalValueForPercentage] = useState(120);

  // Result inputs
  const [originalValueForResult, setOriginalValueForResult] = useState(100);
  const [percentageForResult, setPercentageForResult] = useState(20);
  const [changeTypeForResult, setChangeTypeForResult] = useState<'increase' | 'decrease'>('increase');

  // Results
  const [calculatedResult, setCalculatedResult] = useState('100.00');
  const [resultLabel, setResultLabel] = useState('Original Value');
  const [resultColor, setResultColor] = useState('text-purple-700');
  const [formulaDisplay, setFormulaDisplay] = useState('Original = Final / (1 + %/100)');
  const [step1, setStep1] = useState('Step 1: Identify values');
  const [step2, setStep2] = useState('Step 2: Apply formula');
  const [step3, setStep3] = useState('Step 3: Calculate result');
  const [verification, setVerification] = useState('100.00 + 20% = 120.00');

  const calculateReversePercentage = () => {
    let result: number;
    let formula: string;
    let s1: string, s2: string, s3: string, verify: string;
    let label: string;
    let color: string;

    switch (calculationType) {
      case 'original': {
        const final = finalValue || 0;
        const pct = percentageChange || 0;

        if (final <= 0) return;

        const multiplier = changeType === 'increase' ? (1 + pct / 100) : (1 - pct / 100);
        result = final / multiplier;

        formula = `Original = ${final} / ${multiplier.toFixed(4)}`;
        label = 'Original Value';
        color = 'text-purple-700';
        s1 = `Final: ${final}, ${changeType} of ${pct}%`;
        s2 = `Multiplier: ${changeType === 'increase' ? '1 +' : '1 -'} ${pct}/100 = ${multiplier.toFixed(4)}`;
        s3 = `Original = ${final} / ${multiplier.toFixed(4)} = ${result.toFixed(2)}`;

        const checkValue = result * (changeType === 'increase' ? (1 + pct / 100) : (1 - pct / 100));
        verify = `${result.toFixed(2)} ${changeType === 'increase' ? '+' : '-'} ${pct}% = ${checkValue.toFixed(2)}`;
        break;
      }

      case 'percentage': {
        const original = originalValueForPercentage || 0;
        const final = finalValueForPercentage || 0;

        if (original <= 0 || final <= 0) return;

        result = ((final - original) / original) * 100;
        const changeDirection = result >= 0 ? 'increase' : 'decrease';

        formula = `% = ((${final} - ${original}) / ${original}) x 100`;
        label = `Percentage ${changeDirection.charAt(0).toUpperCase() + changeDirection.slice(1)}`;
        color = 'text-blue-700';
        s1 = `Original: ${original}, Final: ${final}`;
        s2 = `Difference: ${final} - ${original} = ${(final - original).toFixed(2)}`;
        s3 = `% = (${(final - original).toFixed(2)} / ${original}) x 100 = ${Math.abs(result).toFixed(2)}%`;
        verify = `${original} ${result >= 0 ? '+' : '-'} ${Math.abs(result).toFixed(2)}% = ${final}`;
        result = Math.abs(result);
        break;
      }

      case 'result': {
        const original = originalValueForResult || 0;
        const pct = percentageForResult || 0;

        if (original <= 0) return;

        const multiplier = changeTypeForResult === 'increase' ? (1 + pct / 100) : (1 - pct / 100);
        result = original * multiplier;

        formula = `Final = ${original} x ${multiplier.toFixed(4)}`;
        label = 'Final Value';
        color = 'text-green-700';
        s1 = `Original: ${original}, ${changeTypeForResult} of ${pct}%`;
        s2 = `Multiplier: ${changeTypeForResult === 'increase' ? '1 +' : '1 -'} ${pct}/100 = ${multiplier.toFixed(4)}`;
        s3 = `Final = ${original} x ${multiplier.toFixed(4)} = ${result.toFixed(2)}`;
        verify = `${original} ${changeTypeForResult === 'increase' ? '+' : '-'} ${pct}% = ${result.toFixed(2)}`;
        break;
      }

      default:
        return;
    }

    setCalculatedResult(result.toFixed(2));
    setResultLabel(label);
    setResultColor(color);
    setFormulaDisplay(formula);
    setStep1(s1);
    setStep2(s2);
    setStep3(s3);
    setVerification(verify);
  };

  useEffect(() => {
    calculateReversePercentage();
  }, [calculationType, finalValue, percentageChange, changeType, originalValueForPercentage, finalValueForPercentage, originalValueForResult, percentageForResult, changeTypeForResult]);

  const getCalcTypeCardClass = (type: CalculationType) => {
    const base = 'p-3 border-2 rounded-xl transition-all cursor-pointer';
    if (calculationType === type) {
      if (type === 'original') return `${base} border-purple-600 bg-purple-50`;
      if (type === 'percentage') return `${base} border-blue-600 bg-blue-50`;
      if (type === 'result') return `${base} border-green-600 bg-green-50`;
    }
    return `${base} border-gray-300 hover:border-gray-400`;
  };

  const getResultCardClass = () => {
    if (calculationType === 'original') return 'bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-purple-200';
    if (calculationType === 'percentage') return 'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-blue-200';
    return 'bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-green-200';
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Reverse Percentage Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{getH1('Reverse Percentage Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600">Find original values from percentage results</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          {/* Calculation Type Selector */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              What do you want to find?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              <div
                className={getCalcTypeCardClass('original')}
                onClick={() => setCalculationType('original')}
              >
                <div className="text-sm md:text-base font-semibold text-gray-900">Original Value</div>
                <div className="text-xs text-gray-500">Before % change</div>
              </div>

              <div
                className={getCalcTypeCardClass('percentage')}
                onClick={() => setCalculationType('percentage')}
              >
                <div className="text-sm md:text-base font-semibold text-gray-900">Percentage Rate</div>
                <div className="text-xs text-gray-500">Find the %</div>
              </div>

              <div
                className={getCalcTypeCardClass('result')}
                onClick={() => setCalculationType('result')}
              >
                <div className="text-sm md:text-base font-semibold text-gray-900">Result Value</div>
                <div className="text-xs text-gray-500">After % change</div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Input Forms */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            {/* Original Value Form */}
            {calculationType === 'original' && (
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Find Original Value</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Final Value (Result)</label>
                    <input
                      type="number"
                      value={finalValue}
                      onChange={(e) => setFinalValue(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter final value"
                      className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Percentage Change</label>
                    <div className="flex gap-2">
                      <select
                        value={changeType}
                        onChange={(e) => setChangeType(e.target.value as 'increase' | 'decrease')}
                        className="px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="increase">Increase</option>
                        <option value="decrease">Decrease</option>
                      </select>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={percentageChange}
                          onChange={(e) => setPercentageChange(parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                          placeholder="Enter %"
                          className="w-full pr-8 pl-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-purple-50 p-2 md:p-3 rounded-lg mt-3">
                  <span className="font-medium">Formula:</span> Original = Final / (1 +/- Percentage/100)
                </div>
              </div>
            )}

            {/* Percentage Form */}
            {calculationType === 'percentage' && (
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Find Percentage Rate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Original Value</label>
                    <input
                      type="number"
                      value={originalValueForPercentage}
                      onChange={(e) => setOriginalValueForPercentage(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter original"
                      className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Final Value</label>
                    <input
                      type="number"
                      value={finalValueForPercentage}
                      onChange={(e) => setFinalValueForPercentage(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter final"
                      className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-blue-50 p-2 md:p-3 rounded-lg mt-3">
                  <span className="font-medium">Formula:</span> % = ((Final - Original) / Original) x 100
                </div>
              </div>
            )}

            {/* Result Form */}
            {calculationType === 'result' && (
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Find Result Value</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Original Value</label>
                    <input
                      type="number"
                      value={originalValueForResult}
                      onChange={(e) => setOriginalValueForResult(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      placeholder="Enter original"
                      className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Percentage Change</label>
                    <div className="flex gap-2">
                      <select
                        value={changeTypeForResult}
                        onChange={(e) => setChangeTypeForResult(e.target.value as 'increase' | 'decrease')}
                        className="px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="increase">Increase</option>
                        <option value="decrease">Decrease</option>
                      </select>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={percentageForResult}
                          onChange={(e) => setPercentageForResult(parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                          placeholder="Enter %"
                          className="w-full pr-8 pl-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 bg-green-50 p-2 md:p-3 rounded-lg mt-3">
                  <span className="font-medium">Formula:</span> Final = Original x (1 +/- Percentage/100)
                </div>
              </div>
            )}
          </div>

          {/* Common Scenarios */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Common Use Cases
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm md:text-base text-blue-900 mb-2">Shopping & Discounts</h4>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• Find original price before discount</li>
                  <li>• Calculate pre-tax prices</li>
                  <li>• Determine markup amounts</li>
                </ul>
              </div>

              <div className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-sm md:text-base text-green-900 mb-2">Business & Finance</h4>
                <ul className="space-y-1 text-xs text-green-800">
                  <li>• Calculate investment returns</li>
                  <li>• Determine profit margins</li>
                  <li>• Analyze growth rates</li>
                </ul>
              </div>
            </div>
          </div>
</div>

        {/* Results Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Results
            </h3>

            {/* Main Result */}
            <div className={getResultCardClass()}>
              <div className="text-xs md:text-sm text-gray-600 mb-1">{resultLabel}</div>
              <div className={`text-2xl md:text-3xl font-bold ${resultColor}`}>{calculatedResult}</div>
            </div>

            {/* Step-by-step */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Calculation Steps</div>
              <div className="space-y-1.5 text-xs">
                <div className="text-gray-800">{step1}</div>
                <div className="text-gray-800">{step2}</div>
                <div className="text-gray-800">{step3}</div>
              </div>
            </div>

            {/* Formula */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 mb-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Formula Used</div>
              <div className="font-mono text-xs text-gray-900 leading-relaxed">
                {formulaDisplay}
              </div>
            </div>

            {/* Verification */}
            <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Verification</div>
              <div className="text-xs text-gray-800">
                {verification}
              </div>
            </div>
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
        <FirebaseFAQs pageId="reverse-percentage-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
