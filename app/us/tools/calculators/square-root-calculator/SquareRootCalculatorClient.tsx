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
  color: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type CalculationType = 'squareRoot' | 'cubeRoot' | 'nthRoot' | 'square' | 'cube';

interface HistoryItem {
  operation: string;
  input: string;
  result: string;
  timestamp: Date;
}

export default function SquareRootCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('square-root-calculator');

  const [number, setNumber] = useState<number>(144);
  const [nthValue, setNthValue] = useState<number>(4);
  const [calculationType, setCalculationType] = useState<CalculationType>('squareRoot');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Results state
  const [result, setResult] = useState<string>('12');
  const [exactValue, setExactValue] = useState<string>('12');
  const [decimalValue, setDecimalValue] = useState<string>('12.000000');
  const [isPerfectSquare, setIsPerfectSquare] = useState<boolean>(true);
  const [steps, setSteps] = useState<string[]>([]);

  const calculationTypes = [
    { value: 'squareRoot' as CalculationType, label: 'Square Root', emoji: '√', symbol: '√x', description: '√x - Second root' },
    { value: 'cubeRoot' as CalculationType, label: 'Cube Root', emoji: '∛', symbol: '∛x', description: '∛x - Third root' },
    { value: 'nthRoot' as CalculationType, label: 'Nth Root', emoji: 'ⁿ√', symbol: 'ⁿ√x', description: 'Any root' },
    { value: 'square' as CalculationType, label: 'Square', emoji: '²', symbol: 'x²', description: 'x × x' },
    { value: 'cube' as CalculationType, label: 'Cube', emoji: '³', symbol: 'x³', description: 'x × x × x' },
  ];

  const simplifyRadical = (n: number): string | null => {
    if (n <= 0) return null;
    let factor = 1;
    let remainder = n;

    for (let i = 2; i * i <= remainder; i++) {
      while (remainder % (i * i) === 0) {
        factor *= i;
        remainder /= (i * i);
      }
    }

    if (factor === 1) return null;
    if (remainder === 1) return factor.toString();
    return `${factor}√${remainder}`;
  };

  const calculate = () => {
    if (isNaN(number)) {
      setResult('Enter a number');
      return;
    }

    const calculationSteps: string[] = [];
    let res = 0;
    let exact = '';
    let operationName = '';
    let inputStr = '';
    let resultStr = '';

    switch (calculationType) {
      case 'squareRoot': {
        if (number < 0) {
          setResult('Error: Negative numbers require complex numbers');
          setExactValue('N/A');
          setDecimalValue('N/A');
          setIsPerfectSquare(false);
          setSteps(['Square root of negative numbers requires complex numbers (i = √-1)']);
          return;
        }
        res = Math.sqrt(number);
        const isInteger = Number.isInteger(res);
        setIsPerfectSquare(isInteger);

        calculationSteps.push(`Find √${number}`);
        if (isInteger) {
          calculationSteps.push(`${number} = ${res} × ${res}`);
          calculationSteps.push(`Therefore, √${number} = ${res}`);
          exact = res.toString();
        } else {
          const simplified = simplifyRadical(number);
          if (simplified && !simplified.includes('√')) {
            exact = simplified;
          } else if (simplified) {
            exact = simplified;
            calculationSteps.push(`Simplify: √${number} = ${simplified}`);
          } else {
            exact = `√${number}`;
          }
          calculationSteps.push(`Decimal approximation: ${res.toFixed(6)}`);
        }
        operationName = 'Square Root';
        inputStr = `√${number}`;
        resultStr = isInteger ? res.toString() : res.toFixed(6);
        break;
      }
      case 'cubeRoot': {
        res = Math.cbrt(number);
        const isInteger = Number.isInteger(res);

        calculationSteps.push(`Find ∛${number}`);
        if (isInteger) {
          calculationSteps.push(`${number} = ${res} × ${res} × ${res}`);
          calculationSteps.push(`Therefore, ∛${number} = ${res}`);
          exact = res.toString();
        } else {
          exact = `∛${number}`;
          calculationSteps.push(`Decimal approximation: ${res.toFixed(6)}`);
        }
        setIsPerfectSquare(isInteger);
        operationName = 'Cube Root';
        inputStr = `∛${number}`;
        resultStr = isInteger ? res.toString() : res.toFixed(6);
        break;
      }
      case 'nthRoot': {
        if (number < 0 && nthValue % 2 === 0) {
          setResult('Error: Even root of negative number');
          setExactValue('N/A');
          setDecimalValue('N/A');
          setIsPerfectSquare(false);
          setSteps(['Even roots of negative numbers require complex numbers']);
          return;
        }
        res = Math.pow(Math.abs(number), 1 / nthValue) * (number < 0 ? -1 : 1);
        const isInteger = Number.isInteger(res);

        calculationSteps.push(`Find ${nthValue}√${number}`);
        calculationSteps.push(`x^${nthValue} = ${number}`);
        calculationSteps.push(`x = ${number}^(1/${nthValue})`);
        calculationSteps.push(`x = ${res.toFixed(6)}`);

        exact = isInteger ? res.toString() : `${nthValue}√${number}`;
        setIsPerfectSquare(isInteger);
        operationName = `${nthValue}th Root`;
        inputStr = `${nthValue}√${number}`;
        resultStr = isInteger ? res.toString() : res.toFixed(6);
        break;
      }
      case 'square': {
        res = number * number;
        calculationSteps.push(`Calculate ${number}²`);
        calculationSteps.push(`${number} × ${number} = ${res}`);
        exact = res.toString();
        setIsPerfectSquare(true);
        operationName = 'Square';
        inputStr = `${number}²`;
        resultStr = res.toString();
        break;
      }
      case 'cube': {
        res = number * number * number;
        calculationSteps.push(`Calculate ${number}³`);
        calculationSteps.push(`${number} × ${number} × ${number} = ${res}`);
        exact = res.toString();
        setIsPerfectSquare(true);
        operationName = 'Cube';
        inputStr = `${number}³`;
        resultStr = res.toString();
        break;
      }
    }

    setResult(Number.isInteger(res) ? res.toString() : res.toFixed(6));
    setExactValue(exact);
    setDecimalValue(res.toFixed(6));
    setSteps(calculationSteps);

    // Add to history
    addToHistory(operationName, inputStr, resultStr);
  };

  const addToHistory = (operation: string, input: string, result: string) => {
    const newItem: HistoryItem = {
      operation,
      input,
      result,
      timestamp: new Date()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 10));
  };

  const clearHistory = () => setHistory([]);

  useEffect(() => {
    calculate();
  }, [number, nthValue, calculationType]);

  const perfectSquares = [
    { num: 1, sqrt: 1 }, { num: 4, sqrt: 2 }, { num: 9, sqrt: 3 }, { num: 16, sqrt: 4 },
    { num: 25, sqrt: 5 }, { num: 36, sqrt: 6 }, { num: 49, sqrt: 7 }, { num: 64, sqrt: 8 },
    { num: 81, sqrt: 9 }, { num: 100, sqrt: 10 }, { num: 121, sqrt: 11 }, { num: 144, sqrt: 12 }
  ];

  const perfectCubes = [
    { num: 1, cbrt: 1 }, { num: 8, cbrt: 2 }, { num: 27, cbrt: 3 }, { num: 64, cbrt: 4 },
    { num: 125, cbrt: 5 }, { num: 216, cbrt: 6 }, { num: 343, cbrt: 7 }, { num: 512, cbrt: 8 }
  ];

  const quickNumbers = [2, 3, 5, 7, 10, 16, 25, 49, 64, 100, 144, 256, 1000];

  const fallbackFaqs = [
    {
      id: '1',
      question: "What is a square root?",
      answer: "A square root of a number is a value that, when multiplied by itself, gives the original number. For example, √25 = 5 because 5 × 5 = 25. Every positive number has two square roots: one positive and one negative (±5 for 25).",
      order: 1
    },
    {
      id: '2',
      question: "What is a perfect square?",
      answer: "A perfect square is a number that is the square of an integer. Examples include 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. Perfect squares have exact integer square roots.",
      order: 2
    },
    {
      id: '3',
      question: "How do I simplify square roots?",
      answer: "To simplify √n, find the largest perfect square factor. For example, √72 = √(36 × 2) = √36 × √2 = 6√2. Factor out perfect squares until no perfect square factors remain under the radical.",
      order: 3
    },
    {
      id: '4',
      question: "Can you find the square root of a negative number?",
      answer: "In real numbers, you cannot find the square root of a negative number. However, in complex numbers, √-1 = i (the imaginary unit), and √-n = i√n. For example, √-9 = 3i.",
      order: 4
    },
    {
      id: '5',
      question: "What is the difference between square root and cube root?",
      answer: "Square root (√) finds what number multiplied by itself gives the original. Cube root (∛) finds what number multiplied by itself three times gives the original. For example, √16 = 4 (4×4=16), but ∛64 = 4 (4×4×4=64).",
      order: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Square Root Calculator')}</h1>
          <p className="text-lg text-gray-600">Calculate square roots, cube roots, nth roots, and powers with step-by-step solutions</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculation Type Selection */}

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Operation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {calculationTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setCalculationType(type.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  calculationType === type.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{type.emoji}</div>
                <div className="font-semibold text-gray-800 text-sm">{type.label}</div>
                <div className="text-xs text-gray-500">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Main Calculator */}
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">🔢 Enter Number</h3>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-800 mb-2">Number</label>
                  <input
                    type="number"
                    step="any"
                    value={number}
                    onChange={(e) => setNumber(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Enter a number"
                  />
                </div>

                {calculationType === 'nthRoot' && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-green-800 mb-2">Root Index (n)</label>
                    <input
                      type="number"
                      min="2"
                      value={nthValue}
                      onChange={(e) => setNthValue(parseInt(e.target.value) || 2)}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                      placeholder="e.g., 4 for 4th root"
                    />
                  </div>
                )}

                {/* Quick Number Buttons */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">Quick Numbers</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickNumbers.map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumber(num)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Solution */}
            {steps.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Step-by-Step Solution</h3>
                <div className="bg-yellow-50 rounded-lg p-4">
                  {steps.map((step, index) => (
                    <div key={index} className={`py-2 ${index > 0 ? 'border-t border-yellow-200' : ''}`}>
                      <span className="text-yellow-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
)}

            {/* Reference Tables */}
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Perfect Squares (1-144)</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {perfectSquares.map((ps) => (
                    <button
                      key={ps.num}
                      onClick={() => setNumber(ps.num)}
                      className="p-2 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                    >
                      <span className="text-blue-600">√{ps.num}</span>
                      <span className="text-blue-800 font-bold"> = {ps.sqrt}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Perfect Cubes (1-512)</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {perfectCubes.map((pc) => (
                    <button
                      key={pc.num}
                      onClick={() => { setNumber(pc.num); setCalculationType('cubeRoot'); }}
                      className="p-2 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
                    >
                      <span className="text-purple-600">∛{pc.num}</span>
                      <span className="text-purple-800 font-bold"> = {pc.cbrt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Result */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Result</h3>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white mb-4">
                <div className="text-sm text-green-100 mb-1">
                  {calculationType === 'squareRoot' ? 'Square Root' :
                   calculationType === 'cubeRoot' ? 'Cube Root' :
                   calculationType === 'nthRoot' ? `${nthValue}th Root` :
                   calculationType === 'square' ? 'Square' : 'Cube'}
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">{result}</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700 font-medium">Exact Value</span>
                  <span className="font-bold text-blue-800">{exactValue}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-700 font-medium">Decimal</span>
                  <span className="font-bold text-purple-800">{decimalValue}</span>
                </div>

                {(calculationType === 'squareRoot' || calculationType === 'cubeRoot') && (
                  <div className={`flex justify-between items-center p-3 rounded-lg ${isPerfectSquare ? 'bg-green-50' : 'bg-orange-50'}`}>
                    <span className={`font-medium ${isPerfectSquare ? 'text-green-700' : 'text-orange-700'}`}>
                      Perfect {calculationType === 'squareRoot' ? 'Square' : 'Cube'}
                    </span>
                    <span className={`font-bold ${isPerfectSquare ? 'text-green-800' : 'text-orange-800'}`}>
                      {isPerfectSquare ? 'Yes ✓' : 'No'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Calculations */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 sm:p-4 md:p-6 text-white">
              <h3 className="text-lg font-bold mb-4">🔄 Related Values</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-100">√{number}</span>
                  <span className="font-bold">{Math.sqrt(Math.abs(number)).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">∛{number}</span>
                  <span className="font-bold">{Math.cbrt(number).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">{number}²</span>
                  <span className="font-bold">{(number * number).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-100">{number}³</span>
                  <span className="font-bold">{(number * number * number).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">📜 History</h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-sm text-red-600 hover:text-red-800">
                    Clear
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No calculations yet</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {history.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                      <div className="text-gray-600">{item.input}</div>
                      <div className="font-semibold text-gray-800">= {item.result}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-xl p-4 bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all h-full">
                  <div className={`w-12 h-12 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
                    <span className="text-white text-xl">√</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* FAQs */}
        <FirebaseFAQs
          pageId="square-root-calculator"
          fallbackFaqs={fallbackFaqs}
        />

        {/* Disclaimer */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            <strong>Disclaimer:</strong> This calculator is for educational purposes. Always verify important calculations for academic or professional use.
          </p>
        </div>
      </div>
    </div>
  );
}
