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

interface RatioCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface HistoryItem {
  type: string;
  input: string;
  result: string;
  timestamp: Date;
}

type OperationType = 'solve' | 'simplify' | 'scale' | 'compare' | 'divide';

export default function RatioCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: RatioCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('ratio-calculator');

  const [operationType, setOperationType] = useState<OperationType>('solve');
  const [valueA, setValueA] = useState<string>('2');
  const [valueB, setValueB] = useState<string>('3');
  const [valueC, setValueC] = useState<string>('4');
  const [valueD, setValueD] = useState<string>('');
  const [scaleMultiplier, setScaleMultiplier] = useState<string>('5');
  const [divideAmount, setDivideAmount] = useState<string>('100');
  const [divideRatioA, setDivideRatioA] = useState<string>('2');
  const [divideRatioB, setDivideRatioB] = useState<string>('3');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [result, setResult] = useState<{
    primaryResult: string;
    simplifiedRatio: string;
    decimalRatio: string;
    percentageRatio: string;
    crossProduct: string;
    steps: string[];
    verification?: string;
  } | null>(null);

  const operations = [
    { value: 'solve' as OperationType, label: 'Solve Proportion', emoji: '🔢', description: 'Find missing value' },
    { value: 'simplify' as OperationType, label: 'Simplify', emoji: '📐', description: 'Reduce to lowest terms' },
    { value: 'scale' as OperationType, label: 'Scale Ratio', emoji: '📏', description: 'Multiply by factor' },
    { value: 'compare' as OperationType, label: 'Compare', emoji: '⚖️', description: 'Check if equal' },
    { value: 'divide' as OperationType, label: 'Divide Amount', emoji: '➗', description: 'Split by ratio' },
  ];

  const gcd = (a: number, b: number): number => {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    return b === 0 ? a : gcd(b, a % b);
  };

  const simplifyRatio = (a: number, b: number): [number, number] => {
    if (a === 0 || b === 0) return [a, b];
    const divisor = gcd(a, b);
    return [a / divisor, b / divisor];
  };

  const calculate = () => {
    const steps: string[] = [];
    let primaryResult = '';
    let simplifiedRatio = '';
    let decimalRatio = '';
    let percentageRatio = '';
    let crossProduct = '';
    let verification = '';

    switch (operationType) {
      case 'solve': {
        const values = [valueA, valueB, valueC, valueD].map(v => v === '' ? null : parseFloat(v));
        const emptyIndex = values.findIndex(val => val === null || isNaN(val as number));
        const filledCount = values.filter(val => val !== null && !isNaN(val as number)).length;

        if (filledCount < 3) {
          setResult({
            primaryResult: 'Enter 3 values',
            simplifiedRatio: '-',
            decimalRatio: '-',
            percentageRatio: '-',
            crossProduct: '-',
            steps: ['Enter any 3 values to solve for the 4th']
          });
          return;
        }

        let [a, b, c, d] = values;
        steps.push(`Given: ${a !== null ? a : '?'} : ${b !== null ? b : '?'} = ${c !== null ? c : '?'} : ${d !== null ? d : '?'}`);
        steps.push('Using cross multiplication: A × D = B × C');

        if (emptyIndex === 0 && b && c && d) {
          a = (b * c) / d;
          steps.push(`A = (B × C) / D = (${b} × ${c}) / ${d} = ${a.toFixed(4)}`);
          setValueA(a.toFixed(2));
        } else if (emptyIndex === 1 && a && c && d) {
          b = (a * d) / c;
          steps.push(`B = (A × D) / C = (${a} × ${d}) / ${c} = ${b.toFixed(4)}`);
          setValueB(b.toFixed(2));
        } else if (emptyIndex === 2 && a && b && d) {
          c = (a * d) / b;
          steps.push(`C = (A × D) / B = (${a} × ${d}) / ${b} = ${c.toFixed(4)}`);
          setValueC(c.toFixed(2));
        } else if (emptyIndex === 3 && a && b && c) {
          d = (b * c) / a;
          steps.push(`D = (B × C) / A = (${b} × ${c}) / ${a} = ${d.toFixed(4)}`);
          setValueD(d.toFixed(2));
        }

        if (a && b && c && d) {
          primaryResult = `${a} : ${b} = ${c} : ${d}`;
          const [simA, simB] = simplifyRatio(a, b);
          simplifiedRatio = `${simA}:${simB}`;
          decimalRatio = (a / b).toFixed(4);
          percentageRatio = ((a / b) * 100).toFixed(2) + '%';

          const prod1 = a * d;
          const prod2 = b * c;
          const isEqual = Math.abs(prod1 - prod2) < 0.01;
          crossProduct = `${prod1.toFixed(2)} ${isEqual ? '=' : '≈'} ${prod2.toFixed(2)}`;
          verification = isEqual ? '✓ Valid proportion' : '✓ Approximately valid';
        }
        break;
      }

      case 'simplify': {
        const a = parseFloat(valueA) || 0;
        const b = parseFloat(valueB) || 0;

        if (a <= 0 || b <= 0) {
          setResult({
            primaryResult: 'Enter positive values',
            simplifiedRatio: '-',
            decimalRatio: '-',
            percentageRatio: '-',
            crossProduct: '-',
            steps: ['Enter positive numbers for both values']
          });
          return;
        }

        const divisor = gcd(a, b);
        const [simA, simB] = simplifyRatio(a, b);

        steps.push(`Original ratio: ${a} : ${b}`);
        steps.push(`Finding GCD of ${a} and ${b}...`);
        steps.push(`GCD = ${divisor}`);
        steps.push(`Divide both by GCD: ${a}/${divisor} : ${b}/${divisor}`);
        steps.push(`Simplified ratio: ${simA} : ${simB}`);

        primaryResult = `${a}:${b} = ${simA}:${simB}`;
        simplifiedRatio = `${simA}:${simB}`;
        decimalRatio = (a / b).toFixed(4);
        percentageRatio = ((a / b) * 100).toFixed(2) + '%';
        crossProduct = `GCD: ${divisor}`;
        verification = '✓ Fully simplified';
        break;
      }

      case 'scale': {
        const a = parseFloat(valueA) || 0;
        const b = parseFloat(valueB) || 0;
        const multiplier = parseFloat(scaleMultiplier) || 1;

        if (a <= 0 || b <= 0) {
          setResult({
            primaryResult: 'Enter positive values',
            simplifiedRatio: '-',
            decimalRatio: '-',
            percentageRatio: '-',
            crossProduct: '-',
            steps: ['Enter positive numbers for both values']
          });
          return;
        }

        const scaledA = a * multiplier;
        const scaledB = b * multiplier;

        steps.push(`Original ratio: ${a} : ${b}`);
        steps.push(`Scale factor: ${multiplier}`);
        steps.push(`${a} × ${multiplier} = ${scaledA}`);
        steps.push(`${b} × ${multiplier} = ${scaledB}`);
        steps.push(`Scaled ratio: ${scaledA} : ${scaledB}`);

        primaryResult = `${scaledA} : ${scaledB}`;
        const [simA, simB] = simplifyRatio(a, b);
        simplifiedRatio = `${simA}:${simB}`;
        decimalRatio = (a / b).toFixed(4);
        percentageRatio = ((a / b) * 100).toFixed(2) + '%';
        crossProduct = `Factor: ×${multiplier}`;
        verification = '✓ Ratio preserved';
        break;
      }

      case 'compare': {
        const a = parseFloat(valueA) || 0;
        const b = parseFloat(valueB) || 0;
        const c = parseFloat(valueC) || 0;
        const d = parseFloat(valueD) || 0;

        if (a <= 0 || b <= 0 || c <= 0 || d <= 0) {
          setResult({
            primaryResult: 'Enter positive values',
            simplifiedRatio: '-',
            decimalRatio: '-',
            percentageRatio: '-',
            crossProduct: '-',
            steps: ['Enter positive numbers for all values']
          });
          return;
        }

        const ratio1 = a / b;
        const ratio2 = c / d;
        const [sim1A, sim1B] = simplifyRatio(a, b);
        const [sim2A, sim2B] = simplifyRatio(c, d);
        const isEqual = Math.abs(ratio1 - ratio2) < 0.0001;

        steps.push(`Ratio 1: ${a}:${b} = ${ratio1.toFixed(4)}`);
        steps.push(`Simplified: ${sim1A}:${sim1B}`);
        steps.push(`Ratio 2: ${c}:${d} = ${ratio2.toFixed(4)}`);
        steps.push(`Simplified: ${sim2A}:${sim2B}`);
        steps.push(`Comparison: ${ratio1.toFixed(4)} ${isEqual ? '=' : (ratio1 > ratio2 ? '>' : '<')} ${ratio2.toFixed(4)}`);

        primaryResult = isEqual ? 'Equal Ratios' : (ratio1 > ratio2 ? `${a}:${b} > ${c}:${d}` : `${a}:${b} < ${c}:${d}`);
        simplifiedRatio = `${sim1A}:${sim1B} vs ${sim2A}:${sim2B}`;
        decimalRatio = `${ratio1.toFixed(4)} vs ${ratio2.toFixed(4)}`;
        percentageRatio = `${(ratio1 * 100).toFixed(2)}% vs ${(ratio2 * 100).toFixed(2)}%`;
        crossProduct = `${(a * d).toFixed(2)} ${isEqual ? '=' : '≠'} ${(b * c).toFixed(2)}`;
        verification = isEqual ? '✓ Equal ratios' : '✗ Not equal';
        break;
      }

      case 'divide': {
        const amount = parseFloat(divideAmount) || 0;
        const ratioA = parseFloat(divideRatioA) || 0;
        const ratioB = parseFloat(divideRatioB) || 0;

        if (amount <= 0 || ratioA <= 0 || ratioB <= 0) {
          setResult({
            primaryResult: 'Enter positive values',
            simplifiedRatio: '-',
            decimalRatio: '-',
            percentageRatio: '-',
            crossProduct: '-',
            steps: ['Enter positive numbers for all values']
          });
          return;
        }

        const total = ratioA + ratioB;
        const partA = (amount * ratioA) / total;
        const partB = (amount * ratioB) / total;

        steps.push(`Amount to divide: ${amount}`);
        steps.push(`Ratio: ${ratioA}:${ratioB}`);
        steps.push(`Total parts: ${ratioA} + ${ratioB} = ${total}`);
        steps.push(`Value per part: ${amount} / ${total} = ${(amount / total).toFixed(4)}`);
        steps.push(`Part 1: ${ratioA} × ${(amount / total).toFixed(4)} = ${partA.toFixed(2)}`);
        steps.push(`Part 2: ${ratioB} × ${(amount / total).toFixed(4)} = ${partB.toFixed(2)}`);
        steps.push(`Verification: ${partA.toFixed(2)} + ${partB.toFixed(2)} = ${(partA + partB).toFixed(2)}`);

        primaryResult = `${partA.toFixed(2)} and ${partB.toFixed(2)}`;
        const [simA, simB] = simplifyRatio(ratioA, ratioB);
        simplifiedRatio = `${simA}:${simB}`;
        decimalRatio = (ratioA / ratioB).toFixed(4);
        percentageRatio = `${((partA / amount) * 100).toFixed(1)}% : ${((partB / amount) * 100).toFixed(1)}%`;
        crossProduct = `${partA.toFixed(2)} + ${partB.toFixed(2)} = ${amount}`;
        verification = '✓ Sum verified';
        break;
      }
    }

    setResult({
      primaryResult,
      simplifiedRatio,
      decimalRatio,
      percentageRatio,
      crossProduct,
      steps,
      verification
    });

    // Add to history
    const historyItem: HistoryItem = {
      type: operations.find(o => o.value === operationType)?.label || '',
      input: operationType === 'divide' ? `${divideAmount} ÷ ${divideRatioA}:${divideRatioB}` : `${valueA}:${valueB}`,
      result: primaryResult,
      timestamp: new Date()
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 10));
  };

  const loadExample = (a: string, b: string, c: string, d: string) => {
    setValueA(a);
    setValueB(b);
    setValueC(c);
    setValueD(d);
    setOperationType('solve');
  };

  const clearHistory = () => setHistory([]);

  useEffect(() => {
    calculate();
  }, [operationType, valueA, valueB, valueC, valueD, scaleMultiplier, divideAmount, divideRatioA, divideRatioB]);

  const examples = [
    { a: '2', b: '3', c: '4', d: '', desc: 'Find D in 2:3 = 4:?' },
    { a: '5', b: '8', c: '', d: '16', desc: 'Find C in 5:8 = ?:16' },
    { a: '', b: '7', c: '15', d: '21', desc: 'Find A in ?:7 = 15:21' },
    { a: '1', b: '2', c: '50', d: '', desc: 'Recipe scaling 1:2 = 50:?' },
    { a: '3', b: '4', c: '75', d: '', desc: 'Map scale 3:4 = 75:?' },
    { a: '9', b: '12', c: '', d: '36', desc: 'Simplify 9:12 = ?:36' },
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is a ratio?",
      answer: "A ratio is a comparison of two or more quantities. For example, 2:3 means for every 2 units of the first quantity, there are 3 units of the second. Ratios can be written as 2:3, 2/3, or '2 to 3'.",
    order: 1
  },
    {
    id: '2',
    question: "What is a proportion?",
      answer: "A proportion is an equation stating that two ratios are equal. If A:B = C:D, then A×D = B×C (cross multiplication). This property is used to find missing values in proportions.",
    order: 2
  },
    {
    id: '3',
    question: "How do I simplify a ratio?",
      answer: "To simplify a ratio, divide both parts by their Greatest Common Divisor (GCD). For example, 12:18 → GCD is 6 → 12÷6:18÷6 = 2:3. The simplified ratio maintains the same relationship.",
    order: 3
  },
    {
    id: '4',
    question: "How do I divide an amount by a ratio?",
      answer: "To divide an amount in ratio A:B, find total parts (A+B), then multiply amount by each part divided by total. For $100 in ratio 2:3: Total=5 parts, Part 1 = 100×(2/5)=$40, Part 2 = 100×(3/5)=$60.",
    order: 4
  },
    {
    id: '5',
    question: "What's the difference between ratio and rate?",
      answer: "A ratio compares quantities with the same units (3 apples : 5 apples = 3:5). A rate compares quantities with different units (60 miles per 2 hours = 30 mph). Rates often use 'per' and express a relationship over time or units.",
    order: 5
  }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Ratio Calculator')}</h1>
        <p className="text-gray-600">Calculate, simplify, compare, and divide ratios and proportions</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Operation Type Selection */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Operation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
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
              <div className="text-2xl mb-1">{op.emoji}</div>
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
              {operations.find(o => o.value === operationType)?.label}
            </h3>

            {operationType === 'solve' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-lg font-mono font-bold text-blue-800">A : B = C : D</div>
                  <div className="text-sm text-blue-600 mt-1">Enter any 3 values to find the 4th</div>
                </div>

                <div className="grid grid-cols-7 gap-2 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">A</label>
                    <input
                      type="number"
                      value={valueA}
                      onChange={(e) => setValueA(e.target.value)}
                      className="w-full px-2 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                      placeholder="A"
                    />
                  </div>
                  <div className="text-center text-2xl font-bold text-gray-400 pt-6">:</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">B</label>
                    <input
                      type="number"
                      value={valueB}
                      onChange={(e) => setValueB(e.target.value)}
                      className="w-full px-2 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                      placeholder="B"
                    />
                  </div>
                  <div className="text-center text-2xl font-bold text-gray-400 pt-6">=</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">C</label>
                    <input
                      type="number"
                      value={valueC}
                      onChange={(e) => setValueC(e.target.value)}
                      className="w-full px-2 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                      placeholder="C"
                    />
                  </div>
                  <div className="text-center text-2xl font-bold text-gray-400 pt-6">:</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">D</label>
                    <input
                      type="number"
                      value={valueD}
                      onChange={(e) => setValueD(e.target.value)}
                      className="w-full px-2 py-3 border-2 border-green-300 rounded-lg text-center font-mono font-bold focus:border-green-500 focus:outline-none bg-green-50"
                      placeholder="?"
                    />
                  </div>
                </div>
              </div>
            )}

            {(operationType === 'simplify' || operationType === 'scale') && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Value</label>
                    <input
                      type="number"
                      value={valueA}
                      onChange={(e) => setValueA(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="text-center text-2xl font-bold text-gray-400 pt-6">:</div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Second Value</label>
                    <input
                      type="number"
                      value={valueB}
                      onChange={(e) => setValueB(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {operationType === 'scale' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scale Factor</label>
                    <input
                      type="number"
                      value={scaleMultiplier}
                      onChange={(e) => setScaleMultiplier(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg text-center font-mono font-bold focus:border-purple-500 focus:outline-none"
                      min="1"
                    />
                  </div>
                )}
              </div>
            )}

            {operationType === 'compare' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">First Ratio</h4>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <input
                      type="number"
                      value={valueA}
                      onChange={(e) => setValueA(e.target.value)}
                      className="col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                    <div className="text-center text-2xl font-bold text-gray-400">:</div>
                    <input
                      type="number"
                      value={valueB}
                      onChange={(e) => setValueB(e.target.value)}
                      className="col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Second Ratio</h4>
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <input
                      type="number"
                      value={valueC}
                      onChange={(e) => setValueC(e.target.value)}
                      className="col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-green-500 focus:outline-none"
                    />
                    <div className="text-center text-2xl font-bold text-gray-400">:</div>
                    <input
                      type="number"
                      value={valueD}
                      onChange={(e) => setValueD(e.target.value)}
                      className="col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {operationType === 'divide' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Divide</label>
                  <input
                    type="number"
                    value={divideAmount}
                    onChange={(e) => setDivideAmount(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono text-lg font-bold focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., 100"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ratio Part 1</label>
                    <input
                      type="number"
                      value={divideRatioA}
                      onChange={(e) => setDivideRatioA(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="text-center text-2xl font-bold text-gray-400 pt-6">:</div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ratio Part 2</label>
                    <input
                      type="number"
                      value={divideRatioB}
                      onChange={(e) => setDivideRatioB(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Examples */}
            {operationType === 'solve' && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Examples</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {examples.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadExample(ex.a, ex.b, ex.c, ex.d)}
                      className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <div className="font-mono text-sm font-medium">{ex.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
)}

        </div>

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Results Card */}
          {result && (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Result</h3>

              <div className="text-center p-4 bg-white/20 rounded-lg backdrop-blur mb-4">
                <div className="text-2xl font-bold font-mono">{result.primaryResult}</div>
                {result.verification && (
                  <div className="text-sm mt-1 opacity-90">{result.verification}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white/10 rounded text-center">
                  <div className="text-xs opacity-70">Simplified</div>
                  <div className="font-bold font-mono">{result.simplifiedRatio}</div>
                </div>
                <div className="p-2 bg-white/10 rounded text-center">
                  <div className="text-xs opacity-70">Decimal</div>
                  <div className="font-bold font-mono">{result.decimalRatio}</div>
                </div>
                <div className="p-2 bg-white/10 rounded text-center">
                  <div className="text-xs opacity-70">Percentage</div>
                  <div className="font-bold font-mono text-sm">{result.percentageRatio}</div>
                </div>
                <div className="p-2 bg-white/10 rounded text-center">
                  <div className="text-xs opacity-70">Cross Product</div>
                  <div className="font-bold font-mono text-sm">{result.crossProduct}</div>
                </div>
              </div>
            </div>
          )}

          {/* Formula Reference */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📐 Formulas</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 rounded">
                <div className="font-mono font-bold text-blue-800">A : B = C : D</div>
                <div className="text-xs text-blue-600">Proportion</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <div className="font-mono font-bold text-green-800">A × D = B × C</div>
                <div className="text-xs text-green-600">Cross multiplication</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <div className="font-mono font-bold text-purple-800">GCD(A, B)</div>
                <div className="text-xs text-purple-600">For simplification</div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-900">📋 History</h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-700">
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No calculations yet</p>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-xs text-gray-500">{item.type}</div>
                    <div className="font-mono text-sm">{item.input} → {item.result}</div>
                  </div>
                ))
              )}
            </div>
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
          <h3 className="font-bold text-gray-900 mb-3">What is a Ratio?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Definition:</strong> Comparison of quantities</li>
            <li><strong>Forms:</strong> A:B, A/B, A to B</li>
            <li><strong>Equivalent:</strong> 1:2 = 2:4 = 3:6</li>
            <li><strong>Order matters:</strong> 2:3 ≠ 3:2</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Types of Ratios</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Part to Part:</strong> 3 boys : 2 girls</li>
            <li><strong>Part to Whole:</strong> 3 boys : 5 total</li>
            <li><strong>Rate:</strong> 60 miles per hour</li>
            <li><strong>Compound:</strong> 2:3:5</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Common Applications</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Cooking:</strong> Recipe scaling</li>
            <li><strong>Maps:</strong> Scale conversions</li>
            <li><strong>Finance:</strong> Investment splits</li>
            <li><strong>Construction:</strong> Mixing ratios</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Solving Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Cross multiply:</strong> A×D = B×C</li>
            <li><strong>Simplify first:</strong> Use GCD</li>
            <li><strong>Check units:</strong> Same type</li>
            <li><strong>Verify answer:</strong> Substitute back</li>
          </ul>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs */}
      <div className="mt-8">
        <FirebaseFAQs
          pageId="ratio-calculator"
          fallbackFaqs={fallbackFaqs}
        />
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <strong>Disclaimer:</strong> This calculator is for educational purposes. Results are based on standard ratio and proportion formulas. Always verify critical calculations independently.
        </p>
      </div>
    </div>
  );
}
