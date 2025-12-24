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

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

type CalculatorMode = 'basic' | 'scientific' | 'programmer';

interface ScientificCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

export default function ScientificCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: ScientificCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('scientific-calculator');

  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('scientific');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isInverseMode, setIsInverseMode] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setCurrentValue(num);
      setWaitingForOperand(false);
    } else {
      setCurrentValue(currentValue === '0' ? num : currentValue + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(currentValue);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentVal = previousValue || 0;
      const newValue = calculate(currentVal, inputValue, operation);
      setCurrentValue(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const inputFunction = (func: string) => {
    const value = parseFloat(currentValue);
    let result: number;
    let functionName = func;

    try {
      switch (func) {
        case 'sin':
          result = isInverseMode
            ? (angleMode === 'deg' ? radToDeg(Math.asin(value)) : Math.asin(value))
            : Math.sin(angleMode === 'deg' ? degToRad(value) : value);
          functionName = isInverseMode ? 'sin⁻¹' : 'sin';
          break;
        case 'cos':
          result = isInverseMode
            ? (angleMode === 'deg' ? radToDeg(Math.acos(value)) : Math.acos(value))
            : Math.cos(angleMode === 'deg' ? degToRad(value) : value);
          functionName = isInverseMode ? 'cos⁻¹' : 'cos';
          break;
        case 'tan':
          result = isInverseMode
            ? (angleMode === 'deg' ? radToDeg(Math.atan(value)) : Math.atan(value))
            : Math.tan(angleMode === 'deg' ? degToRad(value) : value);
          functionName = isInverseMode ? 'tan⁻¹' : 'tan';
          break;
        case 'sinh':
          result = isInverseMode ? Math.asinh(value) : Math.sinh(value);
          functionName = isInverseMode ? 'sinh⁻¹' : 'sinh';
          break;
        case 'cosh':
          result = isInverseMode ? Math.acosh(value) : Math.cosh(value);
          functionName = isInverseMode ? 'cosh⁻¹' : 'cosh';
          break;
        case 'tanh':
          result = isInverseMode ? Math.atanh(value) : Math.tanh(value);
          functionName = isInverseMode ? 'tanh⁻¹' : 'tanh';
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'log2':
          result = Math.log2(value);
          break;
        case 'exp':
          result = Math.exp(value);
          break;
        case '10x':
          result = Math.pow(10, value);
          break;
        case '2x':
          result = Math.pow(2, value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'cbrt':
          result = Math.cbrt(value);
          break;
        case 'square':
          result = value * value;
          functionName = 'x²';
          break;
        case 'cube':
          result = value * value * value;
          functionName = 'x³';
          break;
        case 'reciprocal':
          if (value === 0) throw new Error('Cannot divide by zero');
          result = 1 / value;
          functionName = '1/x';
          break;
        case 'abs':
          result = Math.abs(value);
          break;
        case 'floor':
          result = Math.floor(value);
          break;
        case 'ceil':
          result = Math.ceil(value);
          break;
        case 'round':
          result = Math.round(value);
          break;
        case 'pow':
          inputOperation('**');
          return;
        case 'factorial':
          result = factorial(value);
          break;
        case 'percent':
          result = value / 100;
          break;
        default:
          return;
      }

      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      addToHistory(`${functionName}(${value})`, String(result));
      setCurrentValue(String(result));
      setWaitingForOperand(true);
    } catch {
      setCurrentValue('Error');
    }
  };

  const inputConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'pi':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      case 'phi':
        value = (1 + Math.sqrt(5)) / 2; // Golden ratio
        break;
      default:
        return;
    }

    setCurrentValue(String(value));
    setWaitingForOperand(true);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'clear':
        setCurrentValue('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
        break;
      case 'clearEntry':
        setCurrentValue('0');
        break;
      case 'backspace':
        if (currentValue.length > 1) {
          setCurrentValue(currentValue.slice(0, -1));
        } else {
          setCurrentValue('0');
        }
        break;
      case 'toggleSign':
        if (currentValue !== '0') {
          setCurrentValue(currentValue.charAt(0) === '-'
            ? currentValue.slice(1)
            : '-' + currentValue);
        }
        break;
      case 'decimal':
        if (waitingForOperand) {
          setCurrentValue('0.');
          setWaitingForOperand(false);
        } else if (currentValue.indexOf('.') === -1) {
          setCurrentValue(currentValue + '.');
        }
        break;
      case 'equals':
        performCalculation();
        break;
    }
  };

  const handleMemory = (action: string) => {
    const value = parseFloat(currentValue);

    switch (action) {
      case 'store':
        setMemory(value);
        break;
      case 'recall':
        setCurrentValue(String(memory));
        setWaitingForOperand(true);
        break;
      case 'add':
        setMemory(memory + value);
        break;
      case 'subtract':
        setMemory(memory - value);
        break;
      case 'clear':
        setMemory(0);
        break;
    }
  };

  const calculate = (firstOperand: number, secondOperand: number, op: string): number => {
    let result: number;

    switch (op) {
      case '+':
        result = firstOperand + secondOperand;
        break;
      case '-':
        result = firstOperand - secondOperand;
        break;
      case '*':
        result = firstOperand * secondOperand;
        break;
      case '/':
        if (secondOperand === 0) {
          throw new Error('Division by zero');
        }
        result = firstOperand / secondOperand;
        break;
      case '**':
        result = Math.pow(firstOperand, secondOperand);
        break;
      case 'mod':
        result = firstOperand % secondOperand;
        break;
      case 'root':
        result = Math.pow(firstOperand, 1 / secondOperand);
        break;
      default:
        return secondOperand;
    }

    return result;
  };

  const performCalculation = () => {
    if (previousValue === null || operation === null) {
      return;
    }

    const inputValue = parseFloat(currentValue);
    const result = calculate(previousValue, inputValue, operation);

    addToHistory(`${previousValue} ${getOperationSymbol(operation)} ${inputValue}`, String(result));
    setCurrentValue(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0 || n !== Math.floor(n)) {
      throw new Error('Factorial is only defined for non-negative integers');
    }
    if (n > 170) {
      throw new Error('Number too large for factorial');
    }

    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const degToRad = (degrees: number): number => degrees * (Math.PI / 180);
  const radToDeg = (radians: number): number => radians * (180 / Math.PI);

  const addToHistory = (expression: string, result: string) => {
    setHistory(prev => {
      const newHistory = [{ expression, result, timestamp: new Date() }, ...prev];
      return newHistory.slice(0, 15);
    });
  };

  const clearHistory = () => setHistory([]);

  const getOperationSymbol = (op: string): string => {
    const symbols: { [key: string]: string } = {
      '+': '+', '-': '−', '*': '×', '/': '÷', '**': '^', 'mod': 'mod', 'root': '√'
    };
    return symbols[op] || op;
  };

  const getExpressionDisplay = (): string => {
    if (previousValue !== null && operation) {
      return `${previousValue} ${getOperationSymbol(operation)}`;
    }
    return '';
  };

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      const key = e.key;

      if (/[0-9]/.test(key)) {
        inputNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        inputOperation(key);
      } else if (key === 'Enter' || key === '=') {
        performCalculation();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleAction('clear');
      } else if (key === 'Backspace') {
        handleAction('backspace');
      } else if (key === '.') {
        handleAction('decimal');
      } else if (key === '%') {
        inputFunction('percent');
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [currentValue, previousValue, operation, waitingForOperand]);

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is a scientific calculator?",
      answer: "A scientific calculator performs advanced mathematical operations beyond basic arithmetic, including trigonometric functions, logarithms, exponentials, powers, roots, and factorials. It's essential for science, engineering, and advanced mathematics.",
    order: 1
  },
    {
    id: '2',
    question: "What's the difference between DEG and RAD mode?",
      answer: "DEG (degrees) mode measures angles where a full circle is 360°. RAD (radians) mode measures angles where a full circle is 2π radians. Use DEG for everyday calculations and RAD for calculus and advanced math. To convert: radians = degrees × (π/180).",
    order: 2
  },
    {
    id: '3',
    question: "How do I use the memory functions?",
      answer: "MS stores the current value in memory. MR recalls the stored value. M+ adds the current value to memory. M- subtracts from memory. MC clears the memory. These are useful for complex calculations where you need to reuse intermediate results.",
    order: 3
  },
    {
    id: '4',
    question: "What is the difference between log and ln?",
      answer: "log (common logarithm) uses base 10: log(100) = 2 because 10² = 100. ln (natural logarithm) uses base e (≈2.718): ln(e) = 1. Use log for decimal-based calculations and ln for calculus, compound interest, and natural growth/decay problems.",
    order: 4
  },
    {
    id: '5',
    question: "What is factorial (n!)?",
      answer: "Factorial is the product of all positive integers up to n. For example: 5! = 5 × 4 × 3 × 2 × 1 = 120. Factorials are used in probability, combinatorics, and series expansions. Note: 0! = 1 by definition.",
    order: 5
  }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Scientific Calculator')}</h1>
        <p className="text-gray-600">Advanced mathematical functions with trigonometry, logarithms, and more</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mode Selection */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Calculator Mode</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'basic' as CalculatorMode, label: 'Basic', emoji: '🔢', desc: 'Simple arithmetic' },
            { value: 'scientific' as CalculatorMode, label: 'Scientific', emoji: '🔬', desc: 'Trig, log, exp' },
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setCalculatorMode(mode.value)}
              className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                calculatorMode === mode.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{mode.emoji}</span>
              <div className="text-left">
                <div className="font-medium">{mode.label}</div>
                <div className="text-xs opacity-70">{mode.desc}</div>
              </div>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {calculatorMode === 'scientific' ? '🔬 Scientific Calculator' : '🔢 Basic Calculator'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    angleMode === 'deg' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                  }`}
                >
                  {angleMode.toUpperCase()}
                </button>
                {calculatorMode === 'scientific' && (
                  <button
                    onClick={() => setIsInverseMode(!isInverseMode)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      isInverseMode ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    INV
                  </button>
                )}
              </div>
            </div>

            {/* Display */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <div className="bg-gray-900 text-white p-4 rounded-lg">
                <div className="text-sm text-gray-400 h-6">{getExpressionDisplay()}</div>
                <div className="text-right text-xl sm:text-2xl md:text-3xl font-mono overflow-x-auto">{currentValue}</div>
              </div>
            </div>

            {/* Calculator Buttons */}
            {calculatorMode === 'scientific' ? (
              <div className="space-y-4">
                {/* Scientific Functions Row */}
                <div className="grid grid-cols-5 gap-2">
                  <button onClick={() => inputFunction('sin')} className="calc-btn-sci">
                    {isInverseMode ? 'sin⁻¹' : 'sin'}
                  </button>
                  <button onClick={() => inputFunction('cos')} className="calc-btn-sci">
                    {isInverseMode ? 'cos⁻¹' : 'cos'}
                  </button>
                  <button onClick={() => inputFunction('tan')} className="calc-btn-sci">
                    {isInverseMode ? 'tan⁻¹' : 'tan'}
                  </button>
                  <button onClick={() => inputFunction('log')} className="calc-btn-sci">log</button>
                  <button onClick={() => inputFunction('ln')} className="calc-btn-sci">ln</button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <button onClick={() => inputFunction('sinh')} className="calc-btn-sci text-xs">
                    {isInverseMode ? 'sinh⁻¹' : 'sinh'}
                  </button>
                  <button onClick={() => inputFunction('cosh')} className="calc-btn-sci text-xs">
                    {isInverseMode ? 'cosh⁻¹' : 'cosh'}
                  </button>
                  <button onClick={() => inputFunction('tanh')} className="calc-btn-sci text-xs">
                    {isInverseMode ? 'tanh⁻¹' : 'tanh'}
                  </button>
                  <button onClick={() => inputFunction('exp')} className="calc-btn-sci">eˣ</button>
                  <button onClick={() => inputFunction('10x')} className="calc-btn-sci">10ˣ</button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <button onClick={() => inputFunction('square')} className="calc-btn-sci">x²</button>
                  <button onClick={() => inputFunction('cube')} className="calc-btn-sci">x³</button>
                  <button onClick={() => inputFunction('pow')} className="calc-btn-sci">xʸ</button>
                  <button onClick={() => inputFunction('sqrt')} className="calc-btn-sci">√x</button>
                  <button onClick={() => inputFunction('cbrt')} className="calc-btn-sci">∛x</button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <button onClick={() => inputFunction('reciprocal')} className="calc-btn-sci">1/x</button>
                  <button onClick={() => inputFunction('abs')} className="calc-btn-sci">|x|</button>
                  <button onClick={() => inputFunction('factorial')} className="calc-btn-sci">n!</button>
                  <button onClick={() => inputConstant('pi')} className="calc-btn-sci">π</button>
                  <button onClick={() => inputConstant('e')} className="calc-btn-sci">e</button>
                </div>

                {/* Main Keypad */}
                <div className="grid grid-cols-5 gap-2">
                  <button onClick={() => handleAction('clear')} className="calc-btn-clear">C</button>
                  <button onClick={() => handleAction('clearEntry')} className="calc-btn-clear">CE</button>
                  <button onClick={() => handleAction('backspace')} className="calc-btn-clear">⌫</button>
                  <button onClick={() => inputOperation('mod')} className="calc-btn-op">mod</button>
                  <button onClick={() => inputOperation('/')} className="calc-btn-op">÷</button>

                  <button onClick={() => inputNumber('7')} className="calc-btn-num">7</button>
                  <button onClick={() => inputNumber('8')} className="calc-btn-num">8</button>
                  <button onClick={() => inputNumber('9')} className="calc-btn-num">9</button>
                  <button onClick={() => handleAction('toggleSign')} className="calc-btn-sci">±</button>
                  <button onClick={() => inputOperation('*')} className="calc-btn-op">×</button>

                  <button onClick={() => inputNumber('4')} className="calc-btn-num">4</button>
                  <button onClick={() => inputNumber('5')} className="calc-btn-num">5</button>
                  <button onClick={() => inputNumber('6')} className="calc-btn-num">6</button>
                  <button onClick={() => inputFunction('percent')} className="calc-btn-sci">%</button>
                  <button onClick={() => inputOperation('-')} className="calc-btn-op">−</button>

                  <button onClick={() => inputNumber('1')} className="calc-btn-num">1</button>
                  <button onClick={() => inputNumber('2')} className="calc-btn-num">2</button>
                  <button onClick={() => inputNumber('3')} className="calc-btn-num">3</button>
                  <button onClick={() => inputOperation('root')} className="calc-btn-sci">ˣ√y</button>
                  <button onClick={() => inputOperation('+')} className="calc-btn-op">+</button>

                  <button onClick={() => inputNumber('0')} className="calc-btn-num col-span-2">0</button>
                  <button onClick={() => handleAction('decimal')} className="calc-btn-num">.</button>
                  <button onClick={() => handleAction('equals')} className="calc-btn-eq col-span-2">=</button>
                </div>
              </div>
            ) : (
              /* Basic Calculator */
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => handleAction('clear')} className="calc-btn-clear">C</button>
                <button onClick={() => handleAction('clearEntry')} className="calc-btn-clear">CE</button>
                <button onClick={() => handleAction('backspace')} className="calc-btn-clear">⌫</button>
                <button onClick={() => inputOperation('/')} className="calc-btn-op">÷</button>

                <button onClick={() => inputNumber('7')} className="calc-btn-num">7</button>
                <button onClick={() => inputNumber('8')} className="calc-btn-num">8</button>
                <button onClick={() => inputNumber('9')} className="calc-btn-num">9</button>
                <button onClick={() => inputOperation('*')} className="calc-btn-op">×</button>

                <button onClick={() => inputNumber('4')} className="calc-btn-num">4</button>
                <button onClick={() => inputNumber('5')} className="calc-btn-num">5</button>
                <button onClick={() => inputNumber('6')} className="calc-btn-num">6</button>
                <button onClick={() => inputOperation('-')} className="calc-btn-op">−</button>

                <button onClick={() => inputNumber('1')} className="calc-btn-num">1</button>
                <button onClick={() => inputNumber('2')} className="calc-btn-num">2</button>
                <button onClick={() => inputNumber('3')} className="calc-btn-num">3</button>
                <button onClick={() => inputOperation('+')} className="calc-btn-op">+</button>

                <button onClick={() => handleAction('toggleSign')} className="calc-btn-num">±</button>
                <button onClick={() => inputNumber('0')} className="calc-btn-num">0</button>
                <button onClick={() => handleAction('decimal')} className="calc-btn-num">.</button>
                <button onClick={() => handleAction('equals')} className="calc-btn-eq">=</button>
              </div>
            )}
          </div>

          {/* Function Reference */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Function Reference</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Trigonometric</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>sin, cos, tan:</strong> Standard trig functions</li>
                  <li>• <strong>sinh, cosh, tanh:</strong> Hyperbolic functions</li>
                  <li>• Use INV for inverse (arcsin, arccos, arctan)</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Logarithmic</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• <strong>log:</strong> Common log (base 10)</li>
                  <li>• <strong>ln:</strong> Natural log (base e)</li>
                  <li>• <strong>eˣ, 10ˣ:</strong> Exponential functions</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Powers & Roots</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• <strong>x², x³:</strong> Square and cube</li>
                  <li>• <strong>√x, ∛x:</strong> Square and cube root</li>
                  <li>• <strong>xʸ, ˣ√y:</strong> Power and nth root</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Other Functions</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• <strong>n!:</strong> Factorial</li>
                  <li>• <strong>|x|:</strong> Absolute value</li>
                  <li>• <strong>1/x:</strong> Reciprocal</li>
                  <li>• <strong>mod:</strong> Modulo (remainder)</li>
                </ul>
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

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Current Value */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Current Value</h3>
            <div className="text-center p-4 bg-white/20 rounded-lg backdrop-blur">
              <div className="text-sm opacity-80 mb-1">{getExpressionDisplay() || 'Ready'}</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold break-all">{currentValue}</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-white/10 rounded">
                <div className="opacity-70">Mode</div>
                <div className="font-bold">{angleMode.toUpperCase()}</div>
              </div>
              <div className="p-2 bg-white/10 rounded">
                <div className="opacity-70">Memory</div>
                <div className="font-bold font-mono">{memory}</div>
              </div>
            </div>
          </div>

          {/* Memory Controls */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">💾 Memory</h3>
            <div className="text-center p-3 bg-green-50 rounded-lg mb-3">
              <div className="text-xs text-green-700">Stored Value</div>
              <div className="text-xl font-mono font-bold text-green-600">{memory}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleMemory('store')} className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">MS</button>
              <button onClick={() => handleMemory('recall')} className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">MR</button>
              <button onClick={() => handleMemory('clear')} className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">MC</button>
              <button onClick={() => handleMemory('add')} className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">M+</button>
              <button onClick={() => handleMemory('subtract')} className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">M−</button>
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
                    <div className="text-sm text-gray-600">{item.expression}</div>
                    <div className="font-bold font-mono text-gray-800">= {item.result}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-3">⌨️ Keyboard Shortcuts</h3>
            <div className="space-y-1 text-sm text-blue-700">
              <div className="flex justify-between"><span>0-9</span><span>Numbers</span></div>
              <div className="flex justify-between"><span>+ - * /</span><span>Operations</span></div>
              <div className="flex justify-between"><span>Enter, =</span><span>Calculate</span></div>
              <div className="flex justify-between"><span>Esc, C</span><span>Clear</span></div>
              <div className="flex justify-between"><span>Backspace</span><span>Delete</span></div>
              <div className="flex justify-between"><span>%</span><span>Percent</span></div>
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
          <h3 className="font-bold text-gray-900 mb-3">Trigonometric Functions</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>sin(θ):</strong> Opposite / Hypotenuse</li>
            <li><strong>cos(θ):</strong> Adjacent / Hypotenuse</li>
            <li><strong>tan(θ):</strong> Opposite / Adjacent</li>
            <li><strong>Identity:</strong> sin²θ + cos²θ = 1</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Logarithm Properties</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>log(ab):</strong> log(a) + log(b)</li>
            <li><strong>log(a/b):</strong> log(a) - log(b)</li>
            <li><strong>log(aⁿ):</strong> n × log(a)</li>
            <li><strong>ln(e):</strong> = 1</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Common Values</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>π:</strong> 3.14159265...</li>
            <li><strong>e:</strong> 2.71828182...</li>
            <li><strong>sin(30°):</strong> 0.5</li>
            <li><strong>cos(60°):</strong> 0.5</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Power Rules</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>aᵐ × aⁿ:</strong> = aᵐ⁺ⁿ</li>
            <li><strong>aᵐ ÷ aⁿ:</strong> = aᵐ⁻ⁿ</li>
            <li><strong>(aᵐ)ⁿ:</strong> = aᵐⁿ</li>
            <li><strong>a⁰:</strong> = 1</li>
          </ul>
        </div>
      </div>
      {/* FAQs */}
      <FirebaseFAQs
        pageId="scientific-calculator"
        fallbackFaqs={fallbackFaqs}
      />

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <strong>Disclaimer:</strong> This calculator is for educational purposes. Results may have small rounding errors due to floating-point arithmetic. Always verify critical calculations independently.
        </p>
      </div>

      <style jsx>{`
        .calc-btn-num {
          @apply bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition-all active:scale-95;
        }
        .calc-btn-op {
          @apply bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all active:scale-95;
        }
        .calc-btn-sci {
          @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-all active:scale-95 text-sm;
        }
        .calc-btn-clear {
          @apply bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-3 rounded-lg transition-all active:scale-95;
        }
        .calc-btn-eq {
          @apply bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all active:scale-95 text-xl;
        }
        .col-span-2 {
          grid-column: span 2;
        }
      `}</style>
    </div>
  );
}
