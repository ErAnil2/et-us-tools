'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface DivisionStep {
  quotientDigit: string;
  multiply: string;
  subtract: string;
  bringDown: string;
  currentDividend: string;
}

export default function LongDivisionClient() {
  const { getH1, getSubHeading } = usePageSEO('long-division-calculator');

  const [dividend, setDividend] = useState('125');
  const [divisor, setDivisor] = useState('5');
  const [result, setResult] = useState<{
    quotient: number;
    remainder: number;
    decimal: string;
    steps: DivisionStep[];
  } | null>(null);

  const relatedCalculators = [
    { href: "/us/tools/calculators/modulo-calculator", title: "Modulo Calculator", description: "Find remainders" },
    { href: "/us/tools/calculators/percentage-calculator", title: "Percentage Calculator", description: "Calculate percentages" },
    { href: "/us/tools/calculators/fraction-calculator", title: "Fraction Calculator", description: "Work with fractions" },
    { href: "/us/tools/calculators/average-calculator", title: "Average Calculator", description: "Calculate averages" },
  ];

  const fallbackFaqs = [
    {
      id: '1',
      question: "What is long division?",
      answer: "Long division is a method for dividing large numbers by breaking the process into a series of easier steps. It systematically divides the dividend by the divisor, finding one digit of the quotient at a time, making it easier to solve division problems that are too complex for mental math.",
      order: 1
    },
    {
      id: '2',
      question: "How do I do long division step by step?",
      answer: "Follow these steps: 1) Divide: How many times does the divisor fit into the first digit(s) of the dividend? 2) Multiply: Multiply the divisor by that quotient digit. 3) Subtract: Subtract the result from the current dividend. 4) Bring Down: Bring down the next digit. 5) Repeat: Continue until all digits are used.",
      order: 2
    },
    {
      id: '3',
      question: "What does the remainder mean in division?",
      answer: "The remainder is what's left over after division when the dividend cannot be divided evenly by the divisor. For example, 17 ÷ 5 = 3 with remainder 2, because 5 goes into 17 three times (15), leaving 2 left over. The formula is: Dividend = (Divisor × Quotient) + Remainder.",
      order: 3
    },
    {
      id: '4',
      question: "When should I use long division instead of a calculator?",
      answer: "Use long division for learning and understanding the division process, checking calculator work, solving problems on tests where calculators aren't allowed, working with algebraic expressions or polynomials, and developing number sense and mathematical reasoning skills.",
      order: 4
    },
    {
      id: '5',
      question: "How do I check if my long division answer is correct?",
      answer: "Verify using the division formula: Multiply the quotient by the divisor, then add the remainder. The result should equal the original dividend. For example, if 125 ÷ 5 = 25 R0, check: (5 × 25) + 0 = 125 ✓",
      order: 5
    }
  ];

  useEffect(() => {
    calculate();
  }, [dividend, divisor]);

  const calculate = () => {
    const dividendNum = parseInt(dividend);
    const divisorNum = parseInt(divisor);

    if (isNaN(dividendNum) || isNaN(divisorNum) || divisorNum === 0) {
      setResult(null);
      return;
    }

    const quotient = Math.floor(dividendNum / divisorNum);
    const remainder = dividendNum % divisorNum;
    const decimal = (dividendNum / divisorNum).toFixed(6);

    // Generate step-by-step long division
    const steps: DivisionStep[] = [];
    let currentDividend = '';
    const dividendStr = Math.abs(dividendNum).toString();
    let position = 0;
    let runningQuotient = '';

    while (position < dividendStr.length) {
      currentDividend += dividendStr[position];
      const current = parseInt(currentDividend);

      if (current >= divisorNum) {
        const digit = Math.floor(current / divisorNum);
        const product = digit * divisorNum;
        const diff = current - product;

        runningQuotient += digit.toString();

        steps.push({
          quotientDigit: digit.toString(),
          multiply: `${digit} x ${divisorNum} = ${product}`,
          subtract: `${current} - ${product} = ${diff}`,
          bringDown: position < dividendStr.length - 1 ? dividendStr[position + 1] : '',
          currentDividend: current.toString()
        });

        currentDividend = diff.toString();
        if (diff === 0 && position < dividendStr.length - 1) {
          currentDividend = '';
        }
      } else if (runningQuotient.length > 0) {
        runningQuotient += '0';
        steps.push({
          quotientDigit: '0',
          multiply: `0 x ${divisorNum} = 0`,
          subtract: `${current} - 0 = ${current}`,
          bringDown: position < dividendStr.length - 1 ? dividendStr[position + 1] : '',
          currentDividend: current.toString()
        });
      }

      position++;
    }

    setResult({ quotient, remainder, decimal, steps });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Long Division Calculator')}</h1>
          <p className="text-gray-600">Divide numbers with step-by-step solutions</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Values</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dividend</label>
                  <input
                    type="number"
                    value={dividend}
                    onChange={(e) => setDividend(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter dividend"
                  />
                  <p className="text-xs text-gray-500 mt-1">The number being divided</p>
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-2xl text-gray-400 font-light">÷</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Divisor</label>
                  <input
                    type="number"
                    value={divisor}
                    onChange={(e) => setDivisor(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter divisor"
                  />
                  <p className="text-xs text-gray-500 mt-1">The number to divide by</p>
                </div>
              </div>

              {/* Quick Examples */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { d: '144', v: '12' },
                    { d: '1000', v: '8' },
                    { d: '256', v: '16' },
                    { d: '999', v: '9' },
                  ].map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => { setDividend(ex.d); setDivisor(ex.v); }}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    >
                      {ex.d} ÷ {ex.v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

              {result ? (
                <div className="space-y-4">
                  {/* Main Result */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                    <div className="text-center">
                      <div className="text-sm text-blue-600 mb-1">{dividend} ÷ {divisor} =</div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">{result.quotient}</div>
                      {result.remainder > 0 && (
                        <div className="text-sm text-blue-600 mt-2">
                          Remainder: <span className="font-semibold">{result.remainder}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Results */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Decimal</div>
                      <div className="font-semibold text-gray-800">{result.decimal}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Verification</div>
                      <div className="font-mono text-sm text-gray-700">
                        {result.quotient} × {divisor} + {result.remainder} = {dividend}
                      </div>
                    </div>
                  </div>

                  {/* Expression */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">As Mixed Number</div>
                    <div className="font-semibold text-gray-800">
                      {result.remainder > 0
                        ? `${result.quotient} ${result.remainder}/${divisor}`
                        : result.quotient
                      }
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-5 md:p-8 text-center">
                  <p className="text-gray-500">Enter valid numbers to see the result</p>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Step by Step Solution */}
        {result && result.steps.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Solution</h2>

            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="space-y-1 text-gray-700">
                <div className="font-semibold text-gray-900">Long Division: {dividend} ÷ {divisor}</div>
                <div className="border-b border-gray-300 pb-2 mb-2"></div>

                {result.steps.map((step, index) => (
                  <div key={index} className="pl-4 border-l-2 border-blue-200 mb-3">
                    <div className="text-blue-700">Step {index + 1}:</div>
                    <div>Current dividend: {step.currentDividend}</div>
                    <div>Quotient digit: {step.quotientDigit}</div>
                    <div>{step.multiply}</div>
                    <div>{step.subtract}</div>
                    {step.bringDown && <div>Bring down: {step.bringDown}</div>}
                  </div>
                ))}

                <div className="border-t border-gray-300 pt-2 mt-2 font-semibold">
                  Final Answer: {result.quotient} R {result.remainder}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formula Reference */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Division Formula</h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-medium text-blue-900 mb-2">Basic Formula</div>
              <div className="font-mono text-sm text-blue-800">
                Dividend = (Divisor × Quotient) + Remainder
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="font-medium text-green-900 mb-2">Verification</div>
              <div className="text-sm text-green-800">
                To check: Multiply quotient by divisor and add remainder. Should equal the dividend.
              </div>
            </div>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedCalculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="font-medium text-gray-900 text-sm group-hover:text-blue-700">{calc.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{calc.description}</div>
              </Link>
            ))}
          </div>
        </div>
        {/* Mobile MREC2 - Before FAQs */}

        <CalculatorMobileMrec2 />


        {/* FAQs */}
        <FirebaseFAQs
          pageId="long-division-calculator"
          fallbackFaqs={fallbackFaqs}
        />
      </div>
    </div>
  );
}
