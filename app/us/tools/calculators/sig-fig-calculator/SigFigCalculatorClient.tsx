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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Sig Fig Calculator?",
    answer: "A Sig Fig Calculator is a free online tool designed to help you quickly and accurately calculate sig fig-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Sig Fig Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Sig Fig Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Sig Fig Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function SigFigCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('sig-fig-calculator');

  const [mode, setMode] = useState('count');
  const [inputNumber, setInputNumber] = useState('0.00456');
  const [roundNumber, setRoundNumber] = useState('');
  const [sigFigCount, setSigFigCount] = useState(3);
  const [firstArithNum, setFirstArithNum] = useState('');
  const [secondArithNum, setSecondArithNum] = useState('');
  const [arithmeticOp, setArithmeticOp] = useState('+');
  const [showRules, setShowRules] = useState(true);

  const [mainResult, setMainResult] = useState('3');
  const [resultLabel, setResultLabel] = useState('Significant Figures');
  const [displayNumber, setDisplayNumber] = useState('0.00456');
  const [sigFigResult, setSigFigResult] = useState('3');
  const [scientificNotation, setScientificNotation] = useState('4.56 × 10⁻³');
  const [roundedResult, setRoundedResult] = useState('-');
  const [arithmeticResult, setArithmeticResult] = useState('-');
  const [digitAnalysis, setDigitAnalysis] = useState<string[]>([
    '• Digits 4, 5, 6 are significant',
    '• Leading zeros are not significant',
    '• No trailing zeros after decimal'
  ]);
  const [showRoundedRow, setShowRoundedRow] = useState(false);
  const [showArithmeticRow, setShowArithmeticRow] = useState(false);

  function countSigFigs(numStr: string): number {
    // Remove scientific notation
    let cleanNum = numStr.toLowerCase().replace(/e[+-]?\d+/, '');

    // Remove leading sign
    if (cleanNum.startsWith('-') || cleanNum.startsWith('+')) {
      cleanNum = cleanNum.substring(1);
    }

    // Handle decimal point
    const hasDecimal = cleanNum.includes('.');

    if (hasDecimal) {
      // Remove trailing zeros only if they're after the decimal point and there are no non-zero digits after them
      cleanNum = cleanNum.replace(/\.?0+$/, '');

      // Remove leading zeros
      cleanNum = cleanNum.replace(/^0+/, '');

      // If we removed all digits, we had only zeros
      if (cleanNum === '' || cleanNum === '.') {
        return 1;
      }

      // Count all remaining digits except decimal point
      return cleanNum.replace(/\./, '').length;
    } else {
      // For whole numbers, trailing zeros may or may not be significant
      // We'll assume they're not significant unless explicitly marked (like 1200.)

      // Remove leading zeros
      cleanNum = cleanNum.replace(/^0+/, '');

      if (cleanNum === '') {
        return 1;
      }

      // Remove trailing zeros for ambiguous cases
      cleanNum = cleanNum.replace(/0+$/, '');

      if (cleanNum === '') {
        // All digits were trailing zeros after removing leading zeros
        // This means we have something like 000 or 1000, count non-leading zeros conservatively
        return 1;
      }

      return cleanNum.length;
    }
  }

  function toScientificNotation(num: string, sigFigs: number | null = null): string {
    const numValue = parseFloat(num);
    if (isNaN(numValue) || numValue === 0) {
      return '0';
    }

    const exponent = Math.floor(Math.log10(Math.abs(numValue)));
    const mantissa = numValue / Math.pow(10, exponent);

    if (sigFigs) {
      const roundedMantissa = parseFloat(mantissa.toPrecision(sigFigs));
      return `${roundedMantissa} × 10${exponent >= 0 ? '⁺' : '⁻'}${Math.abs(exponent)}`;
    }

    return `${mantissa.toPrecision(3)} × 10${exponent >= 0 ? '⁺' : '⁻'}${Math.abs(exponent)}`;
  }

  function roundToSigFigs(num: string, sigFigs: number): string {
    const numValue = parseFloat(num);
    if (isNaN(numValue) || numValue === 0) {
      return '0';
    }

    return numValue.toPrecision(sigFigs);
  }

  function generateDigitAnalysis(numStr: string, sigFigs: number): string[] {
    const analysis: string[] = [];

    // Basic analysis based on the number structure
    const hasDecimal = numStr.includes('.');
    const isScientific = numStr.toLowerCase().includes('e');

    if (isScientific) {
      analysis.push('• Scientific notation format detected');
      analysis.push(`• Mantissa determines ${sigFigs} significant figures`);
    } else if (hasDecimal) {
      if (numStr.match(/^0+\./)) {
        analysis.push('• Leading zeros are not significant');
      }
      if (numStr.match(/0+$/)) {
        analysis.push('• Trailing zeros after decimal are significant');
      }
    } else {
      if (numStr.match(/0+$/)) {
        analysis.push('• Trailing zeros in whole numbers may be ambiguous');
      }
    }

    analysis.push(`• Total significant figures: ${sigFigs}`);

    return analysis;
  }

  function analyzeCount() {
    const inputNum = inputNumber.trim();

    if (!inputNum) {
      resetResults();
      return;
    }

    const sigFigs = countSigFigs(inputNum);
    const scientific = toScientificNotation(inputNum);

    // Update display
    setMainResult(sigFigs.toString());
    setResultLabel('Significant Figures');
    setDisplayNumber(inputNum);
    setSigFigResult(sigFigs.toString());
    setScientificNotation(scientific);

    // Generate digit analysis
    setDigitAnalysis(generateDigitAnalysis(inputNum, sigFigs));
  }

  function analyzeRounding() {
    const inputNum = roundNumber.trim();
    const targetSigFigs = sigFigCount || 3;

    if (!inputNum) {
      resetResults();
      return;
    }

    const originalSigFigs = countSigFigs(inputNum);
    const rounded = roundToSigFigs(inputNum, targetSigFigs);
    const scientific = toScientificNotation(inputNum, targetSigFigs);

    // Update display
    setMainResult(rounded);
    setResultLabel(`Rounded to ${targetSigFigs} Sig Figs`);
    setDisplayNumber(inputNum);
    setSigFigResult(`${originalSigFigs} → ${targetSigFigs}`);
    setScientificNotation(scientific);
    setShowRoundedRow(true);
    setRoundedResult(rounded);

    setDigitAnalysis(generateDigitAnalysis(inputNum, originalSigFigs));
  }

  function analyzeArithmetic() {
    const num1 = firstArithNum.trim();
    const num2 = secondArithNum.trim();
    const operation = arithmeticOp;

    if (!num1 || !num2) {
      resetResults();
      return;
    }

    const val1 = parseFloat(num1);
    const val2 = parseFloat(num2);
    const sigFigs1 = countSigFigs(num1);
    const sigFigs2 = countSigFigs(num2);

    let result: number;
    let resultSigFigs: number;

    switch(operation) {
      case '+':
        result = val1 + val2;
        resultSigFigs = Math.min(sigFigs1, sigFigs2);
        break;
      case '-':
        result = val1 - val2;
        resultSigFigs = Math.min(sigFigs1, sigFigs2);
        break;
      case '*':
        result = val1 * val2;
        resultSigFigs = Math.min(sigFigs1, sigFigs2);
        break;
      case '/':
        result = val1 / val2;
        resultSigFigs = Math.min(sigFigs1, sigFigs2);
        break;
      default:
        result = 0;
        resultSigFigs = 1;
    }

    const roundedResult = roundToSigFigs(result.toString(), resultSigFigs);
    const expression = `${num1} ${operation} ${num2} = ${roundedResult}`;

    // Update display
    setMainResult(roundedResult);
    setResultLabel('Arithmetic Result');
    setDisplayNumber(expression);
    setSigFigResult(`${resultSigFigs} sig figs`);
    setScientificNotation(toScientificNotation(result.toString(), resultSigFigs));
    setShowArithmeticRow(true);
    setArithmeticResult(roundedResult);

    // Generate analysis for arithmetic operation
    setDigitAnalysis([
      `• ${num1} has ${sigFigs1} significant figures`,
      `• ${num2} has ${sigFigs2} significant figures`,
      `• Result limited to ${resultSigFigs} significant figures`,
      `• Raw result: ${result.toPrecision(10)}`
    ]);
  }

  function analyzeScientific() {
    const inputNum = inputNumber.trim();

    if (!inputNum) {
      resetResults();
      return;
    }

    const sigFigs = countSigFigs(inputNum);
    const scientific = toScientificNotation(inputNum, sigFigs);

    // Update display
    setMainResult(scientific);
    setResultLabel('Scientific Notation');
    setDisplayNumber(inputNum);
    setSigFigResult(sigFigs.toString());
    setScientificNotation(scientific);

    setDigitAnalysis(generateDigitAnalysis(inputNum, sigFigs));
  }

  function resetResults() {
    setMainResult('0');
    setResultLabel('Result');
    setDisplayNumber('-');
    setSigFigResult('0');
    setScientificNotation('-');
    setDigitAnalysis(['Enter a number to see analysis']);
  }

  function analyzeSigFigs() {
    // Reset display rows
    setShowRoundedRow(false);
    setShowArithmeticRow(false);

    switch(mode) {
      case 'count':
        analyzeCount();
        break;
      case 'round':
        analyzeRounding();
        break;
      case 'arithmetic':
        analyzeArithmetic();
        break;
      case 'scientific':
        analyzeScientific();
        break;
    }
  }

  function handleSetExample(value: string) {
    if (mode === 'count' || mode === 'scientific') {
      setInputNumber(value);
    } else if (mode === 'round') {
      setRoundNumber(value);
    }
  }

  // Run analysis when inputs change
  useEffect(() => {
    analyzeSigFigs();
  }, [mode, inputNumber, roundNumber, sigFigCount, firstArithNum, secondArithNum, arithmeticOp]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Significant Figures Calculator')}</h1>
        <p className="text-lg text-gray-600">Count significant figures, round numbers, and perform calculations with proper sig fig rules</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Number Analysis</h2>

            {/* Operation Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="count">Count Significant Figures</option>
                <option value="round">Round to Sig Figs</option>
                <option value="arithmetic">Sig Fig Arithmetic</option>
                <option value="scientific">Scientific Notation</option>
              </select>
            </div>

            {/* Single Number Input */}
            {(mode === 'count' || mode === 'scientific') && (
              <div id="singleNumberInput">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Number</label>
                <input
                  type="text"
                  id="inputNumber"
                  placeholder="e.g., 0.00456, 1200, 3.14159"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Enter any decimal number or scientific notation (e.g., 1.23e-4)
                </div>
              </div>
            )}

            {/* Rounding Input */}
            {mode === 'round' && (
              <div id="roundingInput">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number</label>
                    <input
                      type="text"
                      id="roundNumber"
                      placeholder="e.g., 3.14159"
                      value={roundNumber}
                      onChange={(e) => setRoundNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sig Figs</label>
                    <input
                      type="number"
                      id="sigFigCount"
                      min={1}
                      max={15}
                      placeholder="e.g., 3"
                      value={sigFigCount}
                      onChange={(e) => setSigFigCount(parseInt(e.target.value) || 3)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Arithmetic Input */}
            {mode === 'arithmetic' && (
              <div id="arithmeticInput">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">First Number</label>
                      <input
                        type="text"
                        id="firstArithNum"
                        placeholder="e.g., 2.34"
                        value={firstArithNum}
                        onChange={(e) => setFirstArithNum(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Operation</label>
                      <select
                        id="arithmeticOp"
                        value={arithmeticOp}
                        onChange={(e) => setArithmeticOp(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="+">Addition (+)</option>
                        <option value="-">Subtraction (-)</option>
                        <option value="*">Multiplication (×)</option>
                        <option value="/">Division (÷)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Second Number</label>
                      <input
                        type="text"
                        id="secondArithNum"
                        placeholder="e.g., 1.2"
                        value={secondArithNum}
                        onChange={(e) => setSecondArithNum(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show Rules Option */}
            <div className="bg-blue-50 rounded-lg p-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="showRules"
                  checked={showRules}
                  onChange={(e) => setShowRules(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="ml-2 text-blue-700 font-medium">Show significant figure rules</span>
              </label>
            </div>

            {/* Quick Examples */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-3">Quick Examples</h4>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleSetExample('1.23')} className="px-3 py-2 bg-purple-200 hover:bg-purple-300 rounded text-purple-800 text-sm">1.23</button>
                <button onClick={() => handleSetExample('0.00456')} className="px-3 py-2 bg-purple-200 hover:bg-purple-300 rounded text-purple-800 text-sm">0.00456</button>
                <button onClick={() => handleSetExample('1200')} className="px-3 py-2 bg-purple-200 hover:bg-purple-300 rounded text-purple-800 text-sm">1200</button>
                <button onClick={() => handleSetExample('1.200')} className="px-3 py-2 bg-purple-200 hover:bg-purple-300 rounded text-purple-800 text-sm">1.200</button>
                <button onClick={() => handleSetExample('2.00e-3')} className="px-3 py-2 bg-purple-200 hover:bg-purple-300 rounded text-purple-800 text-sm">2.00e-3</button>
                <button onClick={() => handleSetExample('5.060')} className="px-3 py-2 bg-purple-200 hover:bg-purple-300 rounded text-purple-800 text-sm">5.060</button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600" id="mainResult">{mainResult}</div>
                <div className="text-green-700" id="resultLabel">{resultLabel}</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Input Number:</span>
                  <span id="displayNumber" className="font-semibold font-mono">{displayNumber}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Sig Figs:</span>
                  <span id="sigFigResult" className="font-semibold text-blue-600">{sigFigResult}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Scientific Notation:</span>
                  <span id="scientificNotation" className="font-semibold font-mono">{scientificNotation}</span>
                </div>

                {showRoundedRow && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200" id="roundedRow">
                    <span className="text-gray-600">Rounded:</span>
                    <span id="roundedResult" className="font-semibold text-purple-600">{roundedResult}</span>
                  </div>
                )}

                {showArithmeticRow && (
                  <div className="flex justify-between items-center py-2" id="arithmeticResultRow">
                    <span className="text-gray-600">Calculation:</span>
                    <span id="arithmeticResult" className="font-semibold text-orange-600">{arithmeticResult}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Digit Analysis */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3">Digit Analysis</h4>
              <div id="digitAnalysis" className="text-yellow-700 space-y-1 text-sm">
                {digitAnalysis.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        {showRules && (
          <div id="rulesSection" className="mt-8 bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Significant Figure Rules</h3>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">Counting Rules:</h4>
                <ol className="space-y-1 text-sm list-decimal list-inside">
                  <li>All non-zero digits are significant</li>
                  <li>Zeros between non-zero digits are significant</li>
                  <li>Leading zeros are never significant</li>
                  <li>Trailing zeros after decimal point are significant</li>
                  <li>Trailing zeros in whole numbers may or may not be significant</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Arithmetic Rules:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Addition/Subtraction:</strong> Round to least precise decimal place</li>
                  <li>• <strong>Multiplication/Division:</strong> Round to fewest significant figures</li>
                  <li>• <strong>Mixed operations:</strong> Apply rules in order of operations</li>
                  <li>• <strong>Exact numbers:</strong> Have infinite significant figures</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Examples Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Significant Figures Examples</h3>
        <div className="grid md:grid-cols-3 gap-4 text-purple-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Counting Examples</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>123:</span> <span>3 sig figs</span></div>
              <div className="flex justify-between"><span>0.0123:</span> <span>3 sig figs</span></div>
              <div className="flex justify-between"><span>1.230:</span> <span>4 sig figs</span></div>
              <div className="flex justify-between"><span>1200:</span> <span>2 sig figs</span></div>
              <div className="flex justify-between"><span>1200.:</span> <span>4 sig figs</span></div>
            </div>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Rounding Examples</h4>
            <div className="space-y-1 text-sm">
              <div>3.14159 → 3.14 (3 sf)</div>
              <div>0.0056789 → 0.0057 (2 sf)</div>
              <div>1234.5 → 1200 (2 sf)</div>
              <div>0.9999 → 1.0 (2 sf)</div>
            </div>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Arithmetic Examples</h4>
            <div className="space-y-1 text-sm">
              <div>2.3 + 1.234 = 3.5</div>
              <div>2.3 × 1.234 = 2.8</div>
              <div>12.0 ÷ 3.00 = 4.00</div>
              <div>100 - 1.23 = 99</div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Applications of Significant Figures</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Science & Engineering</h4>
            <ul className="text-sm space-y-1">
              <li>• Laboratory measurements</li>
              <li>• Engineering calculations</li>
              <li>• Scientific research</li>
              <li>• Quality control</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Education</h4>
            <ul className="text-sm space-y-1">
              <li>• Chemistry problems</li>
              <li>• Physics calculations</li>
              <li>• Mathematics courses</li>
              <li>• Lab report writing</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Industry</h4>
            <ul className="text-sm space-y-1">
              <li>• Manufacturing tolerances</li>
              <li>• Measurement uncertainty</li>
              <li>• Data analysis</li>
              <li>• Regulatory compliance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{calc.title}</h3>
              <p className="text-xs text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="sig-fig-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
