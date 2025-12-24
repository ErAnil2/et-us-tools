'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import Link from 'next/link';
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

export default function ModuloClient() {
  const { getH1, getSubHeading } = usePageSEO('modulo-calculator');

  const [dividend, setDividend] = useState(17);
  const [divisor, setDivisor] = useState(5);

  const [results, setResults] = useState({
    remainder: 0,
    quotient: 0,
    isEven: false,
    steps: [] as string[]
  });

  const relatedCalculators = [
    { href: '/us/tools/calculators/long-division-calculator', title: 'Long Division', description: 'Step-by-step division' },
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' },
    { href: '/us/tools/calculators/fraction-calculator', title: 'Fraction Calculator', description: 'Work with fractions' },
    { href: '/us/tools/calculators/average-calculator', title: 'Average Calculator', description: 'Statistical averages' }
  ];

  const fallbackFaqs = [
    {
      id: '1',
      question: "What is modulo operation?",
      answer: "The modulo operation finds the remainder after division of one number by another. Written as 'a mod n', it returns what's left over after dividing a by n. For example, 17 mod 5 = 2 because 17 ÷ 5 = 3 with remainder 2.",
      order: 1
    },
    {
      id: '2',
      question: "What's the difference between modulo and division?",
      answer: "Division gives you the quotient (how many times the divisor fits), while modulo gives you the remainder (what's left over). For 17 ÷ 5: division gives quotient 3, modulo gives remainder 2. Both are parts of the same operation: 17 = (5 × 3) + 2.",
      order: 2
    },
    {
      id: '3',
      question: "How do I check if a number is even or odd using modulo?",
      answer: "Use modulo 2 (n mod 2). If the result is 0, the number is even. If the result is 1, the number is odd. This works because even numbers are divisible by 2 with no remainder, while odd numbers have a remainder of 1.",
      order: 3
    },
    {
      id: '4',
      question: "What are practical uses of modulo?",
      answer: "Modulo is used in: clock arithmetic (12-hour and 24-hour clocks), determining day of the week, checking divisibility, cryptography and hash functions, circular arrays in programming, creating repeating patterns, and distributing items evenly.",
      order: 4
    },
    {
      id: '5',
      question: "Can modulo be negative?",
      answer: "Yes, when working with negative numbers. Different programming languages handle negative modulo differently. Generally, the sign of the result matches the sign of the dividend (the number being divided). For example, -17 mod 5 might give -2 or 3 depending on implementation.",
      order: 5
    }
  ];

  useEffect(() => {
    calculate();
  }, [dividend, divisor]);

  const calculate = () => {
    if (divisor === 0) {
      setResults({
        remainder: NaN,
        quotient: NaN,
        isEven: false,
        steps: ['Error: Cannot divide by zero']
      });
      return;
    }

    const remainder = dividend % divisor;
    const quotient = Math.floor(dividend / divisor);

    const steps = [
      `Dividend (a) = ${dividend}`,
      `Divisor (n) = ${divisor}`,
      ``,
      `Quotient = floor(${dividend} ÷ ${divisor}) = ${quotient}`,
      `Remainder = ${dividend} - (${quotient} × ${divisor}) = ${remainder}`,
      ``,
      `Therefore: ${dividend} mod ${divisor} = ${remainder}`
    ];

    setResults({
      remainder,
      quotient,
      isEven: remainder === 0,
      steps
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Modulo Calculator')}</h1>
          <p className="text-gray-600">Calculate the remainder of division (modular arithmetic)</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dividend (a)</label>
                  <input
                    type="number"
                    value={dividend}
                    onChange={(e) => setDividend(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">The number to be divided</p>
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-500">mod</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Divisor (n)</label>
                  <input
                    type="number"
                    value={divisor}
                    onChange={(e) => setDivisor(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">The number to divide by</p>
                </div>
              </div>

              {/* Quick Examples */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { a: 17, n: 5 },
                    { a: 100, n: 7 },
                    { a: 25, n: 4 },
                    { a: 123, n: 10 },
                  ].map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => { setDividend(ex.a); setDivisor(ex.n); }}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    >
                      {ex.a} mod {ex.n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

              {/* Main Result */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-100 mb-4">
                <div className="text-center">
                  <div className="text-sm text-purple-600 mb-1">{dividend} mod {divisor} =</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700">
                    {isNaN(results.remainder) ? 'Error' : results.remainder}
                  </div>
                  <div className="text-sm text-purple-600 mt-2">
                    {results.isEven ? `${dividend} is divisible by ${divisor}` : 'Remainder'}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Quotient</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {isNaN(results.quotient) ? 'N/A' : results.quotient}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Evenly Divisible?</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {results.isEven ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              {/* Step by Step */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2 text-sm">Solution Steps</h3>
                <div className="font-mono text-xs text-gray-600 whitespace-pre-line">
                  {results.steps.join('\n')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What is Modulo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">What is Modulo?</h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                The modulo operation finds the remainder after division of one number by another.
                It's commonly written as <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">a mod n</code> or <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">a % n</code>.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="font-medium text-blue-900 mb-2">Formula</div>
                <div className="font-mono text-sm text-blue-800">
                  a mod n = a - n × floor(a/n)
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Common Uses:</div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Check if a number is even or odd (n mod 2)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Wrap values within a range (clock arithmetic)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Cryptography and hash functions
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Determine day of the week
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Examples Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Common Examples</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Expression</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Result</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 px-3 font-mono">10 mod 3</td>
                  <td className="py-2 px-3 font-semibold">1</td>
                  <td className="py-2 px-3 text-gray-600">10 = 3×3 + 1</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">15 mod 4</td>
                  <td className="py-2 px-3 font-semibold">3</td>
                  <td className="py-2 px-3 text-gray-600">15 = 4×3 + 3</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">20 mod 5</td>
                  <td className="py-2 px-3 font-semibold">0</td>
                  <td className="py-2 px-3 text-gray-600">20 is evenly divisible by 5</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">7 mod 2</td>
                  <td className="py-2 px-3 font-semibold">1</td>
                  <td className="py-2 px-3 text-gray-600">7 is odd (remainder 1)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">100 mod 7</td>
                  <td className="py-2 px-3 font-semibold">2</td>
                  <td className="py-2 px-3 text-gray-600">100 = 7×14 + 2</td>
                </tr>
              </tbody>
            </table>
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
          pageId="modulo-calculator"
          fallbackFaqs={fallbackFaqs}
        />
      </div>
    </div>
  );
}
