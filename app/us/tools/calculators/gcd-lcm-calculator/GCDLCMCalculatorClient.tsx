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

type CalculationType = 'both' | 'gcd' | 'lcm';

interface HistoryItem {
  numbers: number[];
  gcd: number;
  lcm: number;
  timestamp: Date;
}

export default function GCDLCMCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('gcd-lcm-calculator');

  const [calculationType, setCalculationType] = useState<CalculationType>('both');
  const [numberCount, setNumberCount] = useState<number>(2);
  const [numbers, setNumbers] = useState<number[]>([12, 18]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Results
  const [gcdValue, setGcdValue] = useState<number>(6);
  const [lcmValue, setLcmValue] = useState<number>(36);
  const [gcdFactors, setGcdFactors] = useState<number[]>([]);
  const [primeFactorizations, setPrimeFactorizations] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  const calculationTypes = [
    { value: 'both' as CalculationType, label: 'GCD & LCM', emoji: '📊', description: 'Calculate both' },
    { value: 'gcd' as CalculationType, label: 'GCD Only', emoji: '🔗', description: 'Greatest Common Divisor' },
    { value: 'lcm' as CalculationType, label: 'LCM Only', emoji: '✖️', description: 'Least Common Multiple' },
  ];

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const gcdMultiple = (nums: number[]): number => {
    if (nums.length < 2) return nums[0] || 0;
    let result = nums[0];
    for (let i = 1; i < nums.length; i++) {
      result = gcd(result, nums[i]);
      if (result === 1) break;
    }
    return result;
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const lcmMultiple = (nums: number[]): number => {
    if (nums.length < 2) return nums[0] || 0;
    let result = nums[0];
    for (let i = 1; i < nums.length; i++) {
      result = lcm(result, nums[i]);
    }
    return result;
  };

  const primeFactorization = (n: number): { [key: number]: number } => {
    const factors: { [key: number]: number } = {};
    let d = 2;
    while (d * d <= n) {
      while (n % d === 0) {
        factors[d] = (factors[d] || 0) + 1;
        n /= d;
      }
      d++;
    }
    if (n > 1) {
      factors[n] = (factors[n] || 0) + 1;
    }
    return factors;
  };

  const getSuperscript = (num: number): string => {
    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    return num.toString().split('').map(digit => superscripts[parseInt(digit)]).join('');
  };

  const formatPrimeFactorization = (factors: { [key: number]: number }): string => {
    return Object.entries(factors)
      .map(([prime, power]) => power === 1 ? prime : `${prime}${getSuperscript(power)}`)
      .join(' × ') || '1';
  };

  const getFactors = (n: number): number[] => {
    const factors: number[] = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) {
          factors.push(n / i);
        }
      }
    }
    return factors.sort((a, b) => a - b);
  };

  const calculate = () => {
    const validNumbers = numbers.filter(n => !isNaN(n) && n > 0);
    if (validNumbers.length < 2) return;

    const gcdVal = gcdMultiple(validNumbers);
    const lcmVal = lcmMultiple(validNumbers);

    setGcdValue(gcdVal);
    setLcmValue(lcmVal);
    setGcdFactors(getFactors(gcdVal));

    // Prime factorizations
    const primeFactors = validNumbers.map(num => {
      const factors = primeFactorization(num);
      const formatted = formatPrimeFactorization(factors);
      return `${num} = ${formatted}`;
    });
    setPrimeFactorizations(primeFactors);

    // Step-by-step solution
    const newSteps: string[] = [];
    newSteps.push(`Numbers: ${validNumbers.join(', ')}`);

    if (calculationType === 'gcd' || calculationType === 'both') {
      newSteps.push(`Step 1: Find prime factorization of each number`);
      validNumbers.forEach(num => {
        const factors = primeFactorization(num);
        newSteps.push(`${num} = ${formatPrimeFactorization(factors)}`);
      });
      newSteps.push(`Step 2: GCD = product of common prime factors with lowest powers`);
      newSteps.push(`GCD(${validNumbers.join(', ')}) = ${gcdVal}`);
    }

    if (calculationType === 'lcm' || calculationType === 'both') {
      newSteps.push(`Step 3: LCM = product of all prime factors with highest powers`);
      newSteps.push(`LCM(${validNumbers.join(', ')}) = ${lcmVal}`);
    }

    if (validNumbers.length === 2 && calculationType === 'both') {
      newSteps.push(`Verification: GCD × LCM = ${gcdVal} × ${lcmVal} = ${gcdVal * lcmVal}`);
      newSteps.push(`Product of numbers: ${validNumbers[0]} × ${validNumbers[1]} = ${validNumbers[0] * validNumbers[1]}`);
    }

    setSteps(newSteps);

    // Add to history
    addToHistory(validNumbers, gcdVal, lcmVal);
  };

  const addToHistory = (nums: number[], gcdVal: number, lcmVal: number) => {
    const newItem: HistoryItem = {
      numbers: [...nums],
      gcd: gcdVal,
      lcm: lcmVal,
      timestamp: new Date()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 10));
  };

  const clearHistory = () => setHistory([]);

  useEffect(() => {
    calculate();
  }, [numbers, calculationType]);

  useEffect(() => {
    const newNumbers: number[] = [];
    for (let i = 0; i < numberCount; i++) {
      if (i === 0) newNumbers.push(12);
      else if (i === 1) newNumbers.push(18);
      else if (i === 2) newNumbers.push(24);
      else newNumbers.push(0);
    }
    setNumbers(newNumbers);
  }, [numberCount]);

  const handleNumberChange = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value === '' ? 0 : parseInt(value);
    setNumbers(newNumbers);
  };

  const quickExamples = [
    { numbers: [12, 18], label: '12, 18' },
    { numbers: [24, 36], label: '24, 36' },
    { numbers: [15, 25], label: '15, 25' },
    { numbers: [48, 64], label: '48, 64' },
    { numbers: [18, 24, 36], label: '18, 24, 36' },
    { numbers: [100, 75], label: '100, 75' },
  ];

  const applyExample = (exampleNumbers: number[]) => {
    setNumberCount(exampleNumbers.length);
    setNumbers(exampleNumbers);
  };

  const fallbackFaqs = [
    {
      id: '1',
      question: "What is GCD (Greatest Common Divisor)?",
      answer: "GCD, also called Greatest Common Factor (GCF), is the largest positive integer that divides all given numbers without a remainder. For example, GCD(12, 18) = 6 because 6 is the largest number that divides both 12 and 18 evenly.",
      order: 1
    },
    {
      id: '2',
      question: "What is LCM (Least Common Multiple)?",
      answer: "LCM is the smallest positive integer that is divisible by all given numbers. For example, LCM(4, 6) = 12 because 12 is the smallest number that both 4 and 6 divide into evenly.",
      order: 2
    },
    {
      id: '3',
      question: "What is the relationship between GCD and LCM?",
      answer: "For any two positive integers a and b: GCD(a,b) × LCM(a,b) = a × b. This relationship is very useful for calculating LCM if you know the GCD, or vice versa.",
      order: 3
    },
    {
      id: '4',
      question: "How do I find GCD using prime factorization?",
      answer: "Find the prime factorization of each number, then multiply together all prime factors that appear in ALL numbers, using the lowest power of each. For example, 12 = 2² × 3 and 18 = 2 × 3², so GCD = 2¹ × 3¹ = 6.",
      order: 4
    },
    {
      id: '5',
      question: "How do I find LCM using prime factorization?",
      answer: "Find the prime factorization of each number, then multiply together all prime factors that appear in ANY number, using the highest power of each. For example, 12 = 2² × 3 and 18 = 2 × 3², so LCM = 2² × 3² = 36.",
      order: 5
    }
  ];

  const validNumbers = numbers.filter(n => !isNaN(n) && n > 0);
  const showResults = validNumbers.length >= 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('GCD & LCM Calculator')}</h1>
          <p className="text-lg text-gray-600">Calculate Greatest Common Divisor and Least Common Multiple with step-by-step solutions</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculation Type Selection */}

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Calculation</h2>
          <div className="grid grid-cols-3 gap-3">
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
                <div className="font-semibold text-gray-800">{type.label}</div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">🔢 Enter Numbers</h3>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-800 mb-2">Number of Values</label>
                  <select
                    value={numberCount}
                    onChange={(e) => setNumberCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="2">2 numbers</option>
                    <option value="3">3 numbers</option>
                    <option value="4">4 numbers</option>
                    <option value="5">5 numbers</option>
                    <option value="6">6 numbers</option>
                  </select>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-green-800 mb-3">Enter Positive Integers</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {numbers.map((num, index) => (
                      <input
                        key={index}
                        type="number"
                        value={num === 0 ? '' : num}
                        onChange={(e) => handleNumberChange(index, e.target.value)}
                        className="w-full px-3 py-3 text-center text-lg font-bold border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder={`#${index + 1}`}
                        min="1"
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Examples */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-3 text-sm">Quick Examples</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => applyExample(example.numbers)}
                        className="px-3 py-2 bg-purple-200 hover:bg-purple-300 rounded-lg text-purple-800 text-sm font-medium transition-colors"
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Solution */}
            {showResults && steps.length > 0 && (
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

            {/* Prime Factorization */}
            {showResults && (
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🔢 Prime Factorizations</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {primeFactorizations.map((factorization, index) => (
                    <div key={index} className="bg-indigo-50 rounded-lg p-3">
                      <span className="text-indigo-800 font-mono">{factorization}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Understanding GCD & LCM */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Understanding GCD & LCM</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">GCD (Greatest Common Divisor)</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Also called GCF (Greatest Common Factor)</li>
                    <li>• Largest number dividing all inputs</li>
                    <li>• Used to simplify fractions</li>
                    <li>• Always ≤ smallest input number</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">LCM (Least Common Multiple)</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Smallest number divisible by all inputs</li>
                    <li>• Used for adding fractions</li>
                    <li>• Always ≥ largest input number</li>
                    <li>• LCM × GCD = a × b (for 2 numbers)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* GCD Result */}
            {(calculationType === 'both' || calculationType === 'gcd') && (
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 GCD Result</h3>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white mb-4">
                  <div className="text-sm text-green-100 mb-1">Greatest Common Divisor</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{showResults ? gcdValue : '--'}</div>
                </div>
                {showResults && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-green-700 mb-1">Factors of GCD:</div>
                    <div className="text-green-800 font-mono text-sm">{gcdFactors.join(', ')}</div>
                  </div>
                )}
              </div>
            )}

            {/* LCM Result */}
            {(calculationType === 'both' || calculationType === 'lcm') && (
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 LCM Result</h3>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white mb-4">
                  <div className="text-sm text-blue-100 mb-1">Least Common Multiple</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{showResults ? lcmValue.toLocaleString() : '--'}</div>
                </div>
                {showResults && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-700 mb-1">First few multiples:</div>
                    <div className="text-blue-800 font-mono text-sm">
                      {[lcmValue, lcmValue * 2, lcmValue * 3].map(n => n.toLocaleString()).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Relationship */}
            {showResults && calculationType === 'both' && validNumbers.length === 2 && (
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 sm:p-4 md:p-6 text-white">
                <h3 className="text-lg font-bold mb-4">🔗 Relationship</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-100">GCD × LCM:</span>
                    <span className="font-bold">{(gcdValue * lcmValue).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-100">{validNumbers[0]} × {validNumbers[1]}:</span>
                    <span className="font-bold">{(validNumbers[0] * validNumbers[1]).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-purple-200 mt-2">
                    ✓ GCD × LCM = Product of numbers
                  </div>
                </div>
              </div>
            )}

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
                      <div className="text-gray-600">{item.numbers.join(', ')}</div>
                      <div className="font-semibold text-gray-800">
                        GCD: {item.gcd} | LCM: {item.lcm}
                      </div>
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
                    <span className="text-white text-xl">🔢</span>
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
          pageId="gcd-lcm-calculator"
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
