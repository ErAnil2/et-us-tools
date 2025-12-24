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

type OperationType = 'convert' | 'add' | 'subtract' | 'multiply' | 'and' | 'or' | 'xor' | 'not';

interface ConversionResult {
  binary: string;
  decimal: string;
  octal: string;
  hex: string;
}

interface HistoryItem {
  operation: string;
  input: string;
  result: string;
  timestamp: Date;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Binary Calculator?",
    answer: "A Binary Calculator is a free online tool designed to help you quickly and accurately calculate binary-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Binary Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Binary Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Binary Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function BinaryCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('binary-calculator');

  const [operation, setOperation] = useState<OperationType>('convert');
  const [inputBase, setInputBase] = useState<number>(10);
  const [numberInput, setNumberInput] = useState<string>('42');
  const [number2Input, setNumber2Input] = useState<string>('15');
  const [results, setResults] = useState<ConversionResult>({
    binary: '101010',
    decimal: '42',
    octal: '52',
    hex: '2A'
  });
  const [arithmeticResult, setArithmeticResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  const operations = [
    { value: 'convert' as OperationType, label: 'Convert', emoji: '🔄', description: 'Base conversion' },
    { value: 'add' as OperationType, label: 'Add', emoji: '➕', description: 'Binary addition' },
    { value: 'subtract' as OperationType, label: 'Subtract', emoji: '➖', description: 'Binary subtraction' },
    { value: 'multiply' as OperationType, label: 'Multiply', emoji: '✖️', description: 'Binary multiplication' },
    { value: 'and' as OperationType, label: 'AND', emoji: '&', description: 'Bitwise AND' },
    { value: 'or' as OperationType, label: 'OR', emoji: '|', description: 'Bitwise OR' },
    { value: 'xor' as OperationType, label: 'XOR', emoji: '^', description: 'Bitwise XOR' },
    { value: 'not' as OperationType, label: 'NOT', emoji: '~', description: 'Bitwise NOT' },
  ];

  const bases = [
    { value: 2, label: 'Binary (Base 2)', prefix: '0b' },
    { value: 8, label: 'Octal (Base 8)', prefix: '0o' },
    { value: 10, label: 'Decimal (Base 10)', prefix: '' },
    { value: 16, label: 'Hexadecimal (Base 16)', prefix: '0x' },
  ];

  const isValidNumber = (num: string, base: number): boolean => {
    if (!num || num.trim() === '') return false;
    const validChars = '0123456789ABCDEF'.slice(0, base);
    return num.toUpperCase().split('').every(char => validChars.includes(char));
  };

  const toDecimal = (num: string, fromBase: number): number => {
    if (!isValidNumber(num, fromBase)) return NaN;
    return parseInt(num, fromBase);
  };

  const fromDecimal = (decimal: number, toBase: number): string => {
    if (isNaN(decimal) || decimal < 0) return 'Invalid';
    return decimal.toString(toBase).toUpperCase();
  };

  const padBinary = (binary: string, length: number): string => {
    return binary.padStart(length, '0');
  };

  const calculate = () => {
    const calculationSteps: string[] = [];
    let historyInput = '';
    let historyResult = '';

    if (operation === 'convert') {
      const decimal = toDecimal(numberInput, inputBase);
      if (isNaN(decimal)) {
        setResults({ binary: 'Invalid', decimal: 'Invalid', octal: 'Invalid', hex: 'Invalid' });
        return;
      }

      const binary = fromDecimal(decimal, 2);
      const octal = fromDecimal(decimal, 8);
      const hex = fromDecimal(decimal, 16);

      setResults({
        binary,
        decimal: decimal.toString(),
        octal,
        hex
      });

      calculationSteps.push(`Input: ${numberInput} (Base ${inputBase})`);
      calculationSteps.push(`Step 1: Convert to decimal: ${decimal}`);
      calculationSteps.push(`Binary (Base 2): ${binary}`);
      calculationSteps.push(`Octal (Base 8): ${octal}`);
      calculationSteps.push(`Hexadecimal (Base 16): ${hex}`);

      historyInput = `${numberInput} (Base ${inputBase})`;
      historyResult = `Binary: ${binary}`;
    } else if (operation === 'not') {
      const decimal = toDecimal(numberInput, inputBase);
      if (isNaN(decimal)) {
        setArithmeticResult('Invalid');
        return;
      }

      // 8-bit NOT operation
      const notResult = (~decimal) & 0xFF;
      const resultBinary = padBinary(fromDecimal(notResult, 2), 8);

      setArithmeticResult(resultBinary);
      setResults({
        binary: resultBinary,
        decimal: notResult.toString(),
        octal: fromDecimal(notResult, 8),
        hex: fromDecimal(notResult, 16)
      });

      calculationSteps.push(`Input: ${numberInput} (Base ${inputBase}) = ${decimal} decimal`);
      calculationSteps.push(`Binary: ${padBinary(fromDecimal(decimal, 2), 8)}`);
      calculationSteps.push(`NOT operation (8-bit): ~${padBinary(fromDecimal(decimal, 2), 8)}`);
      calculationSteps.push(`Result: ${resultBinary} = ${notResult} decimal`);

      historyInput = `NOT ${numberInput}`;
      historyResult = resultBinary;
    } else {
      const decimal1 = toDecimal(numberInput, inputBase);
      const decimal2 = toDecimal(number2Input, inputBase);

      if (isNaN(decimal1) || isNaN(decimal2)) {
        setArithmeticResult('Invalid');
        return;
      }

      let result = 0;
      const binary1 = padBinary(fromDecimal(decimal1, 2), 8);
      const binary2 = padBinary(fromDecimal(decimal2, 2), 8);

      switch (operation) {
        case 'add':
          result = decimal1 + decimal2;
          calculationSteps.push(`${binary1} (${decimal1})`);
          calculationSteps.push(`+ ${binary2} (${decimal2})`);
          break;
        case 'subtract':
          result = decimal1 - decimal2;
          calculationSteps.push(`${binary1} (${decimal1})`);
          calculationSteps.push(`- ${binary2} (${decimal2})`);
          break;
        case 'multiply':
          result = decimal1 * decimal2;
          calculationSteps.push(`${binary1} (${decimal1})`);
          calculationSteps.push(`× ${binary2} (${decimal2})`);
          break;
        case 'and':
          result = decimal1 & decimal2;
          calculationSteps.push(`${binary1} AND`);
          calculationSteps.push(`${binary2}`);
          break;
        case 'or':
          result = decimal1 | decimal2;
          calculationSteps.push(`${binary1} OR`);
          calculationSteps.push(`${binary2}`);
          break;
        case 'xor':
          result = decimal1 ^ decimal2;
          calculationSteps.push(`${binary1} XOR`);
          calculationSteps.push(`${binary2}`);
          break;
      }

      const resultBinary = result >= 0 ? fromDecimal(result, 2) : 'Negative';
      setArithmeticResult(resultBinary);

      if (result >= 0) {
        setResults({
          binary: resultBinary,
          decimal: result.toString(),
          octal: fromDecimal(result, 8),
          hex: fromDecimal(result, 16)
        });
      }

      calculationSteps.push(`= ${resultBinary} (${result})`);

      historyInput = `${numberInput} ${operation.toUpperCase()} ${number2Input}`;
      historyResult = `${resultBinary} (${result})`;
    }

    setSteps(calculationSteps);
    addToHistory(operation, historyInput, historyResult);
  };

  const addToHistory = (op: string, input: string, result: string) => {
    const newItem: HistoryItem = {
      operation: op,
      input,
      result,
      timestamp: new Date()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 10));
  };

  const clearHistory = () => setHistory([]);

  useEffect(() => {
    calculate();
  }, [numberInput, number2Input, inputBase, operation]);

  const quickExamples = [
    { value: '255', base: 10, label: '255 (Max 8-bit)' },
    { value: '128', base: 10, label: '128 (2^7)' },
    { value: '11111111', base: 2, label: '11111111 (Binary)' },
    { value: 'FF', base: 16, label: 'FF (Hex)' },
    { value: '1010', base: 2, label: '1010 (Binary 10)' },
    { value: '777', base: 8, label: '777 (Octal)' },
  ];

  const needsSecondNumber = ['add', 'subtract', 'multiply', 'and', 'or', 'xor'].includes(operation);

  const faqItems = [
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What is the binary number system?",
      answer: "Binary is a base-2 number system that uses only two digits: 0 and 1. Each position represents a power of 2. For example, binary 1010 = 1×2³ + 0×2² + 1×2¹ + 0×2⁰ = 8 + 2 = 10 in decimal. Computers use binary because electronic circuits can easily represent two states: on (1) and off (0)."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "How do I convert decimal to binary?",
      answer: "To convert decimal to binary, repeatedly divide by 2 and record the remainders. Read the remainders from bottom to top. For example, to convert 13: 13÷2=6 r1, 6÷2=3 r0, 3÷2=1 r1, 1÷2=0 r1. Reading bottom to top: 1101. So 13 in decimal = 1101 in binary."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What are bitwise operations?",
      answer: "Bitwise operations manipulate individual bits: AND (&) returns 1 only if both bits are 1. OR (|) returns 1 if either bit is 1. XOR (^) returns 1 if bits are different. NOT (~) flips each bit. These are fundamental in computer programming for flags, permissions, and low-level optimization."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What is hexadecimal?",
      answer: "Hexadecimal (hex) is a base-16 number system using digits 0-9 and letters A-F (where A=10, B=11, ..., F=15). It's commonly used in computing because each hex digit represents exactly 4 binary bits, making it a compact way to represent binary data. For example, FF in hex = 11111111 in binary = 255 in decimal."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What is octal?",
      answer: "Octal is a base-8 number system using digits 0-7. Each octal digit represents exactly 3 binary bits. It was historically used in computing and is still used for Unix file permissions. For example, 777 in octal = 111111111 in binary = 511 in decimal."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{getH1('Binary Calculator')}</h1>
          <p className="text-lg text-gray-600">Convert between number bases and perform binary arithmetic and bitwise operations</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Operation Selection */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Operation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {operations.map((op) => (
              <button
                key={op.value}
                onClick={() => setOperation(op.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  operation === op.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-1">{op.emoji}</div>
                <div className="font-semibold text-gray-800 text-sm">{op.label}</div>
                <div className="text-xs text-gray-500">{op.description}</div>
              </button>
            ))}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        {/* Main Calculator */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">🔢 Enter Numbers</h3>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-800 mb-2">Input Base</label>
                  <select
                    value={inputBase}
                    onChange={(e) => setInputBase(Number(e.target.value))}
                    className="w-full px-3 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {bases.map((base) => (
                      <option key={base.value} value={base.value}>{base.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    {needsSecondNumber ? 'First Number' : 'Number'}
                  </label>
                  <input
                    type="text"
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 text-xl font-mono font-bold text-center border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder={`Enter ${bases.find(b => b.value === inputBase)?.label} number`}
                  />
                </div>

                {needsSecondNumber && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-purple-800 mb-2">Second Number</label>
                    <input
                      type="text"
                      value={number2Input}
                      onChange={(e) => setNumber2Input(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 text-xl font-mono font-bold text-center border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder={`Enter ${bases.find(b => b.value === inputBase)?.label} number`}
                    />
                  </div>
                )}

                {/* Quick Examples */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">Quick Examples</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setNumberInput(example.value);
                          setInputBase(example.base);
                        }}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium"
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Solution */}
            {steps.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Calculation Steps</h3>
                <div className="bg-yellow-50 rounded-lg p-4 font-mono">
                  {steps.map((step, index) => (
                    <div key={index} className={`py-1 ${index > 0 && !step.startsWith('=') ? 'border-t border-yellow-200' : ''}`}>
                      <span className="text-yellow-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
)}

            {/* Binary Reference */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Powers of 2</h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((power) => (
                  <div key={power} className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-blue-600">2^{power}</div>
                    <div className="font-bold text-blue-800">{Math.pow(2, power)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* Primary Result */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Result</h3>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white mb-4">
                <div className="text-sm text-blue-100 mb-1">
                  {operation === 'convert' ? 'Conversion Result' : 'Operation Result'}
                </div>
                <div className="text-2xl font-bold font-mono break-all">
                  {operation === 'convert' ? results.binary : arithmeticResult}
                </div>
              </div>
            </div>

            {/* All Conversions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 All Bases</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-600 mb-1">Binary (Base 2)</div>
                  <div className="font-bold text-blue-800 font-mono break-all">{results.binary}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-xs text-green-600 mb-1">Decimal (Base 10)</div>
                  <div className="font-bold text-green-800 font-mono">{results.decimal}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-xs text-purple-600 mb-1">Octal (Base 8)</div>
                  <div className="font-bold text-purple-800 font-mono">{results.octal}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-xs text-orange-600 mb-1">Hexadecimal (Base 16)</div>
                  <div className="font-bold text-orange-800 font-mono">{results.hex}</div>
                </div>
              </div>
            </div>

            {/* Bitwise Truth Table */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">📋 Bitwise Reference</h3>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                <div className="text-center p-1 bg-white/20 rounded">A</div>
                <div className="text-center p-1 bg-white/20 rounded">B</div>
                <div className="text-center p-1 bg-white/20 rounded">AND</div>
                <div className="text-center p-1 bg-white/20 rounded">OR</div>
                <div className="text-center p-1">0</div>
                <div className="text-center p-1">0</div>
                <div className="text-center p-1">0</div>
                <div className="text-center p-1">0</div>
                <div className="text-center p-1">0</div>
                <div className="text-center p-1">1</div>
                <div className="text-center p-1">0</div>
                <div className="text-center p-1">1</div>
                <div className="text-center p-1">1</div>
                <div className="text-center p-1">0</div>
                <div className="text-center p-1">0</div>
                <div className="text-center p-1">1</div>
                <div className="text-center p-1">1</div>
                <div className="text-center p-1">1</div>
                <div className="text-center p-1">1</div>
                <div className="text-center p-1">1</div>
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
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
                      <div className="text-gray-600 font-mono text-xs">{item.input}</div>
                      <div className="font-semibold text-gray-800 font-mono">= {item.result}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-xl p-4 bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all h-full">
                  <div className={`w-12 h-12 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-3`}>
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

        {/* Disclaimer */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            <strong>Disclaimer:</strong> This calculator is for educational purposes. Always verify important calculations for academic or professional use.
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="binary-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
