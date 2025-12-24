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

type CalculationMethod = 'difference' | 'change';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Percentage Difference Calculator?",
    answer: "A Percentage Difference Calculator is a mathematical tool that helps you quickly calculate or convert percentage difference-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Percentage Difference Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Percentage Difference Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Percentage Difference Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function PercentageDifferenceCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('percentage-difference-calculator');

  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [method, setMethod] = useState<CalculationMethod>('difference');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [interpretation, setInterpretation] = useState<string>('');
  const [formula, setFormula] = useState<string>('');

  const calculatePercentage = () => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (isNaN(v1) || isNaN(v2)) {
      setResult(null);
      setError(value1 || value2 ? 'Please enter valid numbers for both values' : '');
      return;
    }

    setError('');
    let calculatedResult: number;
    let formulaText: string;
    let interpretationText: string;

    if (method === 'difference') {
      if (v1 === 0 && v2 === 0) {
        setError('Both values are zero - no difference');
        setResult(null);
        return;
      }

      const average = (Math.abs(v1) + Math.abs(v2)) / 2;
      if (average === 0) {
        setError('Cannot calculate percentage difference when average is zero');
        setResult(null);
        return;
      }

      calculatedResult = (Math.abs(v1 - v2) / average) * 100;
      formulaText = `|${v1} - ${v2}| / ((${v1} + ${v2}) / 2) x 100%`;
      interpretationText = 'Symmetric percentage difference between the two values';
    } else {
      if (v1 === 0) {
        setError('Cannot calculate percentage change when original value is zero');
        setResult(null);
        return;
      }

      calculatedResult = ((v2 - v1) / Math.abs(v1)) * 100;
      formulaText = `(${v2} - ${v1}) / ${v1} x 100%`;
      interpretationText = calculatedResult >= 0
        ? 'Percentage increase from Value 1 to Value 2'
        : 'Percentage decrease from Value 1 to Value 2';
    }

    setResult(calculatedResult);
    setFormula(formulaText);
    setInterpretation(interpretationText);
  };

  useEffect(() => {
    calculatePercentage();
  }, [value1, value2, method]);

  const getResultColor = () => {
    if (method === 'change') {
      return result !== null && result >= 0 ? 'text-green-600' : 'text-red-600';
    }
    return 'text-blue-600';
  };

  const getResultSign = () => {
    if (method === 'change' && result !== null) {
      return result >= 0 ? '+' : '';
    }
    return '';
  };

  const getSummary = () => {
    if (result === null) return '';
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (method === 'difference') {
      return `The difference between ${v1} and ${v2} is ${result.toFixed(2)}% relative to their average.`;
    }
    return v2 > v1
      ? `Value 2 is ${result.toFixed(2)}% higher than Value 1.`
      : `Value 2 is ${Math.abs(result).toFixed(2)}% lower than Value 1.`;
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header Section */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Percentage Difference Calculator')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Calculate the percentage difference between two values. Find percent change, increase, or decrease with our easy-to-use calculator.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Section */}
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Values</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="value1" className="block text-sm font-medium text-gray-700 mb-2">
                  Value 1 (Original/First Value)
                </label>
                <input
                  type="number"
                  id="value1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first value"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  step="any"
                />
              </div>

              <div>
                <label htmlFor="value2" className="block text-sm font-medium text-gray-700 mb-2">
                  Value 2 (New/Second Value)
                </label>
                <input
                  type="number"
                  id="value2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter second value"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  step="any"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calculation Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="method"
                      checked={method === 'difference'}
                      onChange={() => setMethod('difference')}
                      className="mr-2"
                    />
                    <span className="text-sm">Percentage Difference (symmetric)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="method"
                      checked={method === 'change'}
                      onChange={() => setMethod('change')}
                      className="mr-2"
                    />
                    <span className="text-sm">Percentage Change (from Value 1 to Value 2)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
            <div className="space-y-4">
              {error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : result !== null ? (
                <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getResultColor()} mb-2`}>
                      {getResultSign()}{result.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{interpretation}</div>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Calculation Details:</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      {formula} = {getResultSign()}{result.toFixed(2)}%
                    </div>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Summary:</h4>
                    <div className="text-sm text-gray-700">{getSummary()}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Enter values to see results</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Sections */}
      <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        {/* How It Works */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg">Percentage Difference (Symmetric)</h3>
              <p className="text-sm mb-2">Used when both values are equally important:</p>
              <div className="bg-white p-3 rounded border font-mono text-sm">
                |Value1 - Value2| / ((Value1 + Value2) / 2) x 100%
              </div>
</div>

            <div>
              <h3 className="font-semibold text-lg">Percentage Change</h3>
              <p className="text-sm mb-2">Used to show change from original value:</p>
              <div className="bg-white p-3 rounded border font-mono text-sm">
                (Value2 - Value1) / Value1 x 100%
              </div>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Examples</h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold">Price Comparison</h4>
              <p className="text-sm">Product A costs $80, Product B costs $100</p>
              <p className="text-sm text-blue-600">Percentage Difference: 22.22%</p>
            </div>

            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold">Sales Growth</h4>
              <p className="text-sm">Last month: $1000, This month: $1200</p>
              <p className="text-sm text-green-600">Percentage Change: +20%</p>
            </div>

            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold">Temperature Change</h4>
              <p className="text-sm">Yesterday: 75F, Today: 68F</p>
              <p className="text-sm text-red-600">Percentage Change: -9.33%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">$</span>
            </div>
            <h3 className="font-semibold mb-2">Finance & Business</h3>
            <p className="text-sm text-gray-600">Price comparisons, sales growth, profit margins, stock performance</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">%</span>
            </div>
            <h3 className="font-semibold mb-2">Data Analysis</h3>
            <p className="text-sm text-gray-600">Survey results, A/B testing, performance metrics, statistical analysis</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">=</span>
            </div>
            <h3 className="font-semibold mb-2">Science & Research</h3>
            <p className="text-sm text-gray-600">Experimental results, measurement comparisons, error analysis</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips & Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">When to Use Each Method:</h3>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Percentage Difference:</strong> Comparing two independent values</li>
              <li>• <strong>Percentage Change:</strong> Measuring change over time</li>
              <li>• Consider context and what comparison makes most sense</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Important Notes:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Percentage difference is always positive (absolute value)</li>
              <li>• Percentage change can be positive or negative</li>
              <li>• Be careful with zero values in denominators</li>
              <li>• Consider using decimal places for precision</li>
            </ul>
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
        <FirebaseFAQs pageId="percentage-difference-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
