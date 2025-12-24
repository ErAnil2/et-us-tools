'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface HistoryItem {
  operation: string;
  input1: string;
  input2?: string;
  result: string;
  timestamp: Date;
}

type OperationType = 'convert' | 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not' | 'leftShift' | 'rightShift';

interface HexCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

export default function HexCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: HexCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('hex-calculator');

  const [operationType, setOperationType] = useState<OperationType>('convert');
  const [inputValue, setInputValue] = useState<string>('FF');
  const [inputBase, setInputBase] = useState<number>(16);
  const [input1, setInput1] = useState<string>('FF');
  const [input2, setInput2] = useState<string>('0F');
  const [shiftAmount, setShiftAmount] = useState<number>(1);
  const [result, setResult] = useState<{
    hex: string;
    decimal: number;
    binary: string;
    octal: string;
    steps: string[];
    bitwiseDetails?: string;
  } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const operations = [
    { value: 'convert' as OperationType, label: 'Convert', emoji: '🔄', description: 'Base conversion' },
    { value: 'add' as OperationType, label: 'Add', emoji: '➕', description: 'Hex addition' },
    { value: 'subtract' as OperationType, label: 'Subtract', emoji: '➖', description: 'Hex subtraction' },
    { value: 'multiply' as OperationType, label: 'Multiply', emoji: '✖️', description: 'Hex multiplication' },
    { value: 'divide' as OperationType, label: 'Divide', emoji: '➗', description: 'Hex division' },
    { value: 'and' as OperationType, label: 'AND', emoji: '&', description: 'Bitwise AND' },
    { value: 'or' as OperationType, label: 'OR', emoji: '|', description: 'Bitwise OR' },
    { value: 'xor' as OperationType, label: 'XOR', emoji: '^', description: 'Bitwise XOR' },
    { value: 'not' as OperationType, label: 'NOT', emoji: '~', description: 'Bitwise NOT' },
    { value: 'leftShift' as OperationType, label: '<<', emoji: '⬅️', description: 'Left shift' },
    { value: 'rightShift' as OperationType, label: '>>', emoji: '➡️', description: 'Right shift' },
  ];

  const bases = [
    { value: 16, label: 'Hexadecimal (16)', pattern: /^[0-9A-Fa-f]*$/ },
    { value: 10, label: 'Decimal (10)', pattern: /^[0-9]*$/ },
    { value: 8, label: 'Octal (8)', pattern: /^[0-7]*$/ },
    { value: 2, label: 'Binary (2)', pattern: /^[01]*$/ },
  ];

  const isValidNumber = (num: string, base: number): boolean => {
    if (!num || num === '') return false;
    const baseConfig = bases.find(b => b.value === base);
    return baseConfig ? baseConfig.pattern.test(num) : false;
  };

  const toDecimal = (num: string, fromBase: number): number => {
    if (!isValidNumber(num, fromBase)) return NaN;
    return parseInt(num, fromBase);
  };

  const fromDecimal = (decimal: number, toBase: number): string => {
    if (isNaN(decimal) || decimal < 0) return 'Invalid';
    return decimal.toString(toBase).toUpperCase();
  };

  const calculate = () => {
    const steps: string[] = [];
    let resultDecimal: number;
    let operationDesc = '';
    let input2Val = '';
    let bitwiseDetails = '';

    if (operationType === 'convert') {
      const decimal = toDecimal(inputValue, inputBase);
      if (isNaN(decimal)) {
        setResult({
          hex: 'Invalid',
          decimal: NaN,
          binary: 'Invalid',
          octal: 'Invalid',
          steps: ['Invalid input for the selected base']
        });
        return;
      }

      const baseName = bases.find(b => b.value === inputBase)?.label || 'Unknown';
      steps.push(`Input: ${inputValue} (${baseName})`);
      steps.push(`Convert to decimal: ${decimal}`);
      steps.push(`Hex: ${fromDecimal(decimal, 16)}`);
      steps.push(`Binary: ${fromDecimal(decimal, 2)}`);
      steps.push(`Octal: ${fromDecimal(decimal, 8)}`);

      operationDesc = `Convert ${inputValue} from base ${inputBase}`;
      resultDecimal = decimal;
    } else if (operationType === 'not') {
      const dec1 = toDecimal(input1, 16);
      if (isNaN(dec1)) {
        setResult({
          hex: 'Invalid',
          decimal: NaN,
          binary: 'Invalid',
          octal: 'Invalid',
          steps: ['Invalid hexadecimal input']
        });
        return;
      }

      // Use 32-bit NOT and mask to positive
      const notResult = (~dec1 >>> 0) & 0xFFFFFFFF;
      steps.push(`Input: ${input1} (hex) = ${dec1} (decimal)`);
      steps.push(`Binary: ${dec1.toString(2).padStart(32, '0')}`);
      steps.push(`NOT operation inverts all bits`);
      steps.push(`Result: ${notResult.toString(2).padStart(32, '0')}`);
      steps.push(`= ${fromDecimal(notResult, 16)} (hex)`);

      bitwiseDetails = `NOT ${input1} = ${fromDecimal(notResult, 16)}`;
      operationDesc = `NOT ${input1}`;
      resultDecimal = notResult;
    } else if (operationType === 'leftShift' || operationType === 'rightShift') {
      const dec1 = toDecimal(input1, 16);
      if (isNaN(dec1)) {
        setResult({
          hex: 'Invalid',
          decimal: NaN,
          binary: 'Invalid',
          octal: 'Invalid',
          steps: ['Invalid hexadecimal input']
        });
        return;
      }

      const shiftResult = operationType === 'leftShift'
        ? (dec1 << shiftAmount) >>> 0
        : dec1 >>> shiftAmount;

      const op = operationType === 'leftShift' ? '<<' : '>>';
      steps.push(`Input: ${input1} (hex) = ${dec1} (decimal)`);
      steps.push(`Binary: ${dec1.toString(2)}`);
      steps.push(`${op} ${shiftAmount} positions`);
      steps.push(`Result: ${shiftResult.toString(2)}`);
      steps.push(`= ${fromDecimal(shiftResult, 16)} (hex)`);

      bitwiseDetails = `${input1} ${op} ${shiftAmount} = ${fromDecimal(shiftResult, 16)}`;
      operationDesc = `${input1} ${op} ${shiftAmount}`;
      resultDecimal = shiftResult;
    } else {
      const dec1 = toDecimal(input1, 16);
      const dec2 = toDecimal(input2, 16);

      if (isNaN(dec1) || isNaN(dec2)) {
        setResult({
          hex: 'Invalid',
          decimal: NaN,
          binary: 'Invalid',
          octal: 'Invalid',
          steps: ['Invalid hexadecimal input']
        });
        return;
      }

      input2Val = input2;

      switch (operationType) {
        case 'add':
          resultDecimal = dec1 + dec2;
          steps.push(`${input1} (hex) = ${dec1} (decimal)`);
          steps.push(`${input2} (hex) = ${dec2} (decimal)`);
          steps.push(`${dec1} + ${dec2} = ${resultDecimal}`);
          steps.push(`${resultDecimal} = ${fromDecimal(resultDecimal, 16)} (hex)`);
          operationDesc = `${input1} + ${input2}`;
          break;

        case 'subtract':
          resultDecimal = Math.max(0, dec1 - dec2);
          steps.push(`${input1} (hex) = ${dec1} (decimal)`);
          steps.push(`${input2} (hex) = ${dec2} (decimal)`);
          steps.push(`${dec1} - ${dec2} = ${resultDecimal}`);
          steps.push(`${resultDecimal} = ${fromDecimal(resultDecimal, 16)} (hex)`);
          operationDesc = `${input1} - ${input2}`;
          break;

        case 'multiply':
          resultDecimal = dec1 * dec2;
          steps.push(`${input1} (hex) = ${dec1} (decimal)`);
          steps.push(`${input2} (hex) = ${dec2} (decimal)`);
          steps.push(`${dec1} × ${dec2} = ${resultDecimal}`);
          steps.push(`${resultDecimal} = ${fromDecimal(resultDecimal, 16)} (hex)`);
          operationDesc = `${input1} × ${input2}`;
          break;

        case 'divide':
          if (dec2 === 0) {
            setResult({
              hex: 'Error',
              decimal: NaN,
              binary: 'Error',
              octal: 'Error',
              steps: ['Cannot divide by zero']
            });
            return;
          }
          resultDecimal = Math.floor(dec1 / dec2);
          const remainder = dec1 % dec2;
          steps.push(`${input1} (hex) = ${dec1} (decimal)`);
          steps.push(`${input2} (hex) = ${dec2} (decimal)`);
          steps.push(`${dec1} ÷ ${dec2} = ${resultDecimal} remainder ${remainder}`);
          steps.push(`Quotient: ${fromDecimal(resultDecimal, 16)} (hex)`);
          steps.push(`Remainder: ${fromDecimal(remainder, 16)} (hex)`);
          operationDesc = `${input1} ÷ ${input2}`;
          break;

        case 'and':
          resultDecimal = dec1 & dec2;
          bitwiseDetails = generateBitwiseTable(dec1, dec2, resultDecimal, 'AND');
          steps.push(`${input1} = ${dec1.toString(2).padStart(8, '0')} (binary)`);
          steps.push(`${input2} = ${dec2.toString(2).padStart(8, '0')} (binary)`);
          steps.push(`AND: Each bit is 1 only if both inputs are 1`);
          steps.push(`Result = ${resultDecimal.toString(2).padStart(8, '0')} = ${fromDecimal(resultDecimal, 16)} (hex)`);
          operationDesc = `${input1} AND ${input2}`;
          break;

        case 'or':
          resultDecimal = dec1 | dec2;
          bitwiseDetails = generateBitwiseTable(dec1, dec2, resultDecimal, 'OR');
          steps.push(`${input1} = ${dec1.toString(2).padStart(8, '0')} (binary)`);
          steps.push(`${input2} = ${dec2.toString(2).padStart(8, '0')} (binary)`);
          steps.push(`OR: Each bit is 1 if either input is 1`);
          steps.push(`Result = ${resultDecimal.toString(2).padStart(8, '0')} = ${fromDecimal(resultDecimal, 16)} (hex)`);
          operationDesc = `${input1} OR ${input2}`;
          break;

        case 'xor':
          resultDecimal = dec1 ^ dec2;
          bitwiseDetails = generateBitwiseTable(dec1, dec2, resultDecimal, 'XOR');
          steps.push(`${input1} = ${dec1.toString(2).padStart(8, '0')} (binary)`);
          steps.push(`${input2} = ${dec2.toString(2).padStart(8, '0')} (binary)`);
          steps.push(`XOR: Each bit is 1 if inputs differ`);
          steps.push(`Result = ${resultDecimal.toString(2).padStart(8, '0')} = ${fromDecimal(resultDecimal, 16)} (hex)`);
          operationDesc = `${input1} XOR ${input2}`;
          break;

        default:
          resultDecimal = 0;
      }
    }

    const hexResult = fromDecimal(resultDecimal!, 16);

    setResult({
      hex: hexResult,
      decimal: resultDecimal!,
      binary: fromDecimal(resultDecimal!, 2),
      octal: fromDecimal(resultDecimal!, 8),
      steps,
      bitwiseDetails: bitwiseDetails || undefined
    });

    const historyItem: HistoryItem = {
      operation: operationDesc,
      input1: operationType === 'convert' ? inputValue : input1,
      input2: input2Val || undefined,
      result: hexResult,
      timestamp: new Date()
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 10));
  };

  const generateBitwiseTable = (a: number, b: number, result: number, op: string): string => {
    const binA = a.toString(2).padStart(8, '0');
    const binB = b.toString(2).padStart(8, '0');
    const binR = result.toString(2).padStart(8, '0');
    return `A: ${binA}\nB: ${binB}\n${op}: ${binR}`;
  };

  const clearHistory = () => setHistory([]);

  const setQuickValue = (hex: string) => {
    if (operationType === 'convert') {
      setInputValue(hex);
      setInputBase(16);
    } else {
      setInput1(hex);
    }
  };

  // Auto-calculate on input changes
  useEffect(() => {
    calculate();
  }, [operationType, inputValue, inputBase, input1, input2, shiftAmount]);

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is hexadecimal?",
      answer: "Hexadecimal (hex) is a base-16 number system using digits 0-9 and letters A-F (where A=10, B=11, C=12, D=13, E=14, F=15). It's widely used in computing because each hex digit represents exactly 4 binary bits, making it a compact way to represent binary data.",
    order: 1
  },
    {
    id: '2',
    question: "How do I convert hex to decimal?",
      answer: "Multiply each hex digit by 16 raised to its position power (starting from 0 on the right). For example, 1A3 = 1×16² + 10×16¹ + 3×16⁰ = 256 + 160 + 3 = 419. Our calculator does this automatically.",
    order: 2
  },
    {
    id: '3',
    question: "What are bitwise operations?",
      answer: "Bitwise operations work on individual bits: AND (&) returns 1 only if both bits are 1; OR (|) returns 1 if either bit is 1; XOR (^) returns 1 if bits differ; NOT (~) inverts all bits. These are fundamental in programming for flags, masks, and optimization.",
    order: 3
  },
    {
    id: '4',
    question: "Why is hex used for colors?",
      answer: "Web colors use hex because RGB values (0-255 each) fit perfectly in 2 hex digits. #FF0000 means Red=FF(255), Green=00(0), Blue=00(0) = pure red. This compact notation is easier than writing 'rgb(255, 0, 0)'.",
    order: 4
  },
    {
    id: '5',
    question: "What are bit shift operations?",
      answer: "Left shift (<<) moves bits left, multiplying by 2 for each position. Right shift (>>) moves bits right, dividing by 2. For example, 8 << 1 = 16 (binary 1000 becomes 10000), and 8 >> 1 = 4 (binary 1000 becomes 100).",
    order: 5
  }
  ];

  const hexReference = [
    { hex: 'A', dec: 10 }, { hex: 'B', dec: 11 }, { hex: 'C', dec: 12 },
    { hex: 'D', dec: 13 }, { hex: 'E', dec: 14 }, { hex: 'F', dec: 15 }
  ];

  const commonValues = [
    { label: 'FF', desc: '255 (max byte)' },
    { label: '100', desc: '256' },
    { label: 'FFFF', desc: '65535 (max 16-bit)' },
    { label: 'DEAD', desc: 'Debug marker' },
    { label: 'BEEF', desc: 'Debug marker' },
    { label: 'CAFE', desc: 'Debug marker' },
  ];

  const colorPresets = [
    { hex: 'FF0000', color: '#FF0000', name: 'Red' },
    { hex: '00FF00', color: '#00FF00', name: 'Green' },
    { hex: '0000FF', color: '#0000FF', name: 'Blue' },
    { hex: 'FFFF00', color: '#FFFF00', name: 'Yellow' },
    { hex: 'FF00FF', color: '#FF00FF', name: 'Magenta' },
    { hex: '00FFFF', color: '#00FFFF', name: 'Cyan' },
    { hex: 'FFFFFF', color: '#FFFFFF', name: 'White' },
    { hex: '000000', color: '#000000', name: 'Black' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Hex Calculator')}</h1>
        <p className="text-gray-600">Hexadecimal operations, base conversion, and bitwise calculations</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Operation Type Selection */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Operation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
          {operations.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperationType(op.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                operationType === op.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-xl mb-1">{op.emoji}</div>
              <div className="text-xs font-medium">{op.label}</div>
            </button>
          ))}
        </div>
      </div>
{/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Main Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {operations.find(o => o.value === operationType)?.emoji}{' '}
              {operations.find(o => o.value === operationType)?.description}
            </h3>

            {operationType === 'convert' ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Input Value
                    </label>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Enter value..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Input Base
                    </label>
                    <select
                      value={inputBase}
                      onChange={(e) => setInputBase(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {bases.map(base => (
                        <option key={base.value} value={base.value}>{base.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : operationType === 'not' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hex Value
                </label>
                <input
                  type="text"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter hex value..."
                />
              </div>
            ) : operationType === 'leftShift' || operationType === 'rightShift' ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hex Value
                  </label>
                  <input
                    type="text"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Enter hex value..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={shiftAmount}
                    onChange={(e) => setShiftAmount(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Hex Value
                  </label>
                  <input
                    type="text"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Enter hex value..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Second Hex Value
                  </label>
                  <input
                    type="text"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Enter hex value..."
                  />
                </div>
              </div>
            )}

            {/* Quick Values */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Values</h4>
              <div className="flex flex-wrap gap-2">
                {commonValues.map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuickValue(val.label)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-mono transition-colors"
                    title={val.desc}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Presets */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Color Codes</h4>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuickValue(color.hex)}
                    className="px-3 py-2 rounded-lg text-xs font-mono transition-transform hover:scale-105 border"
                    style={{
                      backgroundColor: color.color,
                      color: ['FFFFFF', 'FFFF00', '00FF00', '00FFFF'].includes(color.hex) ? '#000' : '#fff'
                    }}
                    title={color.name}
                  >
                    {color.hex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Solution */}
          {result && result.steps.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 font-mono">{step}</span>
                  </div>
                ))}
              </div>

              {result.bitwiseDetails && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Bitwise Operation Detail</h4>
                  <pre className="font-mono text-sm text-purple-700 whitespace-pre-line">
                    {result.bitwiseDetails}
                  </pre>
                </div>
              )}
            </div>
)}

          {/* Hex Reference */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Hex Reference</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Hex Digit Values */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Hex Digits A-F</h4>
                <div className="grid grid-cols-3 gap-2">
                  {hexReference.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuickValue(item.hex)}
                      className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
                    >
                      <div className="text-lg font-bold text-blue-600">{item.hex}</div>
                      <div className="text-sm text-gray-600">= {item.dec}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Powers of 16 */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Powers of 16</h4>
                <div className="space-y-2">
                  {[0, 1, 2, 3, 4].map(power => (
                    <div key={power} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-mono">16<sup>{power}</sup></span>
                      <span className="font-bold">{Math.pow(16, power).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bitwise Truth Table */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Bitwise Operation Truth Table</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">A</th>
                      <th className="p-2 border">B</th>
                      <th className="p-2 border">AND</th>
                      <th className="p-2 border">OR</th>
                      <th className="p-2 border">XOR</th>
                      <th className="p-2 border">NOT A</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border bg-red-50">0</td>
                      <td className="p-2 border bg-red-50">0</td>
                      <td className="p-2 border bg-red-50">0</td>
                      <td className="p-2 border bg-green-50">1</td>
                    </tr>
                    <tr>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">1</td>
                      <td className="p-2 border bg-red-50">0</td>
                      <td className="p-2 border bg-green-50">1</td>
                      <td className="p-2 border bg-green-50">1</td>
                      <td className="p-2 border bg-green-50">1</td>
                    </tr>
                    <tr>
                      <td className="p-2 border">1</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border bg-red-50">0</td>
                      <td className="p-2 border bg-green-50">1</td>
                      <td className="p-2 border bg-green-50">1</td>
                      <td className="p-2 border bg-red-50">0</td>
                    </tr>
                    <tr>
                      <td className="p-2 border">1</td>
                      <td className="p-2 border">1</td>
                      <td className="p-2 border bg-green-50">1</td>
                      <td className="p-2 border bg-green-50">1</td>
                      <td className="p-2 border bg-red-50">0</td>
                      <td className="p-2 border bg-red-50">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile MREC2 - Before FAQs */}


          <CalculatorMobileMrec2 />



          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">❓ Frequently Asked Questions</h3>
            <div className="space-y-3">
              {fallbackFaqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <span className="text-gray-500 text-xl">
                      {openFaqIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-4 py-3 bg-white text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Result Card */}
          {result && (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Result</h3>

              <div className="space-y-4">
                <div className="text-center p-4 bg-white/20 rounded-lg backdrop-blur">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono">{result.hex}</div>
                  <div className="text-sm opacity-90">Hexadecimal</div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between items-center p-2 bg-white/10 rounded">
                    <span className="text-sm opacity-80">Decimal:</span>
                    <span className="font-mono font-bold">{result.decimal?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/10 rounded">
                    <span className="text-sm opacity-80">Binary:</span>
                    <span className="font-mono font-bold text-xs">{result.binary}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/10 rounded">
                    <span className="text-sm opacity-80">Octal:</span>
                    <span className="font-mono font-bold">{result.octal}</span>
                  </div>
                </div>

                {/* Color Preview for 6-digit hex */}
                {result.hex.length === 6 && /^[0-9A-F]+$/i.test(result.hex) && (
                  <div className="mt-4">
                    <div className="text-sm opacity-80 mb-2">Color Preview:</div>
                    <div
                      className="h-16 rounded-lg border-2 border-white/30"
                      style={{ backgroundColor: `#${result.hex}` }}
                    />
                    <div className="text-center mt-1 font-mono">#{result.hex}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Calculation History */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-900">History</h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No calculations yet</p>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-sm font-medium text-gray-800">{item.operation}</div>
                    <div className="text-lg font-bold font-mono text-blue-600">{item.result}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-green-800 mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• 1 hex digit = 4 binary bits</li>
              <li>• 2 hex digits = 1 byte (0-255)</li>
              <li>• 0x prefix in programming</li>
              <li>• # prefix for CSS colors</li>
              <li>• Case insensitive (A = a)</li>
            </ul>
          </div>
{/* Related Calculators */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Related Calculators</h3>
            <div className="grid grid-cols-2 gap-2">
              {relatedCalculators.map((calc, idx) => (
                <Link
                  key={idx}
                  href={calc.href}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                >
                  <div className={`w-8 h-8 ${calc.color || 'bg-gray-500'} rounded-lg mb-2 flex items-center justify-center text-white text-sm font-bold`}>
                    {calc.title.charAt(0)}
                  </div>
                  <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{calc.title}</div>
                  <div className="text-xs text-gray-500">{calc.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Hexadecimal Basics</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Base 16:</strong> Uses 0-9 and A-F</li>
            <li><strong>A-F values:</strong> A=10, B=11, C=12, D=13, E=14, F=15</li>
            <li><strong>Position value:</strong> Powers of 16</li>
            <li><strong>1 hex = 4 bits:</strong> Compact binary representation</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Programming Uses</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Memory addresses:</strong> 0x7FFF, 0x8000</li>
            <li><strong>Colors:</strong> #FF0000 (red)</li>
            <li><strong>Bit flags:</strong> Permission masks</li>
            <li><strong>Assembly:</strong> Machine code representation</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Common Values</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>0xFF:</strong> 255 (max byte)</li>
            <li><strong>0x100:</strong> 256</li>
            <li><strong>0xFFFF:</strong> 65,535 (max 16-bit)</li>
            <li><strong>0xFFFFFFFF:</strong> 4,294,967,295 (max 32-bit)</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Bitwise Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>AND mask:</strong> Extract specific bits</li>
            <li><strong>OR set:</strong> Set specific bits to 1</li>
            <li><strong>XOR toggle:</strong> Flip specific bits</li>
            <li><strong>Shift:</strong> Multiply/divide by powers of 2</li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <strong>Disclaimer:</strong> This calculator is for educational purposes. Results are based on standard hexadecimal arithmetic and bitwise operations. Always verify critical calculations independently.
        </p>
      </div>
    </div>
  );
}
