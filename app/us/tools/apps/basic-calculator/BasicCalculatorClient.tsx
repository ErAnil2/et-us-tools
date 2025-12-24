'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface RelatedApp {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface Props {
  relatedApps?: RelatedApp[];
}

const defaultRelatedApps: RelatedApp[] = [
  { href: '/us/tools/apps/qr-generator', title: 'QR Generator', description: 'Generate QR codes', color: 'bg-blue-500', icon: '📱' },
  { href: '/us/tools/apps/timer', title: 'Timer', description: 'Countdown timer', color: 'bg-green-500', icon: '⏱️' },
  { href: '/us/tools/apps/stopwatch', title: 'Stopwatch', description: 'Track time', color: 'bg-purple-500', icon: '⏱️' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do I use this online calculator?',
    answer: 'Simply click the number buttons to enter numbers, use the operator buttons (+, -, ×, ÷) for operations, and press = or Enter to calculate. You can also use your keyboard for faster input.',
    order: 1
  },
  {
    id: '2',
    question: 'Can I use keyboard shortcuts with this calculator?',
    answer: 'Yes! Use 0-9 for numbers, + - * / for operators, Enter or = for calculating results, Escape or C to clear, and % for percentage calculations.',
    order: 2
  },
  {
    id: '3',
    question: 'Does the calculator save my calculation history?',
    answer: 'Yes, the calculator keeps track of your last 10 calculations in the History section. You can clear the history at any time.',
    order: 3
  },
  {
    id: '4',
    question: 'What is the order of operations used?',
    answer: 'This basic calculator processes operations sequentially as you enter them, similar to a standard handheld calculator.',
    order: 4
  },
  {
    id: '5',
    question: 'What does the ± button do?',
    answer: 'The ± button toggles the sign of the current number between positive and negative.',
    order: 5
  },
  {
    id: '6',
    question: 'Is this calculator accurate for financial calculations?',
    answer: 'This calculator is accurate for basic arithmetic. For high-precision financial calculations, consider specialized tools.',
    order: 6
  }
];

export default function BasicCalculatorClient({ relatedApps = defaultRelatedApps }: Props) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('basic-calculator');

  const [currentInput, setCurrentInput] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [previousInput, setPreviousInput] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<string[]>([]);
  const [equation, setEquation] = useState('');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      const key = e.key;

      if (key >= '0' && key <= '9') inputNumber(key);
      else if (key === '.') inputDecimal();
      else if (key === '+') inputOperator('+');
      else if (key === '-') inputOperator('-');
      else if (key === '*') inputOperator('*');
      else if (key === '/') inputOperator('/');
      else if (key === 'Enter' || key === '=') calculate();
      else if (key === 'Escape' || key === 'c' || key === 'C') clear();
      else if (key === '%') percentage();
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentInput, operator, previousInput, shouldResetDisplay]);

  const inputNumber = (number: string) => {
    if (shouldResetDisplay) {
      setCurrentInput(number);
      setShouldResetDisplay(false);
    } else {
      setCurrentInput(currentInput === '0' ? number : currentInput + number);
    }
  };

  const inputOperator = (op: string) => {
    if (operator && !shouldResetDisplay) calculate();
    setOperator(op);
    setPreviousInput(currentInput);
    setShouldResetDisplay(true);
    updateEquationDisplay(currentInput, op);
  };

  const inputDecimal = () => {
    if (shouldResetDisplay) {
      setCurrentInput('0.');
      setShouldResetDisplay(false);
    } else if (currentInput.indexOf('.') === -1) {
      setCurrentInput(currentInput + '.');
    }
  };

  const calculate = () => {
    if (operator && previousInput !== null) {
      const prev = parseFloat(previousInput);
      const current = parseFloat(currentInput);
      let result;

      switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/':
          if (current === 0) { alert('Cannot divide by zero'); return; }
          result = prev / current;
          break;
        default: return;
      }

      const calculation = `${previousInput} ${getOperatorSymbol(operator)} ${currentInput} = ${result}`;
      setCalculationHistory(prev => [calculation, ...prev].slice(0, 10));

      setCurrentInput(formatResult(result));
      setOperator(null);
      setPreviousInput(null);
      setShouldResetDisplay(true);
      setEquation('');
    }
  };

  const formatResult = (result: number): string => {
    if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-6 && result !== 0)) {
      return result.toExponential(6);
    }
    const formatted = parseFloat(result.toFixed(10)).toString();
    return formatted.length > 12 ? parseFloat(result.toPrecision(8)).toString() : formatted;
  };

  const getOperatorSymbol = (op: string): string => {
    const symbols: { [key: string]: string } = { '+': '+', '-': '-', '*': '×', '/': '÷' };
    return symbols[op] || op;
  };

  const updateEquationDisplay = (prevInput: string, op: string) => {
    setEquation(`${prevInput} ${getOperatorSymbol(op)}`);
  };

  const clear = () => {
    setCurrentInput('0');
    setOperator(null);
    setPreviousInput(null);
    setShouldResetDisplay(false);
    setEquation('');
  };

  const toggleSign = () => {
    if (currentInput !== '0') {
      setCurrentInput(currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput);
    }
  };

  const percentage = () => {
    setCurrentInput((parseFloat(currentInput) / 100).toString());
  };

  const clearHistory = () => setCalculationHistory([]);

  const webAppSchema = generateWebAppSchema(
    'Basic Calculator',
    'Free online basic calculator for simple arithmetic operations including addition, subtraction, multiplication, and division',
    'https://economictimes.indiatimes.com/us/tools/apps/basic-calculator',
    'Utility'
  );

  const relatedTools = [
    { name: 'Unit Converter', path: '/us/tools/apps/unit-converter-simple', icon: '📏', color: 'bg-blue-100' },
    { name: 'Random Number', path: '/us/tools/apps/random-number-generator', icon: '🎲', color: 'bg-purple-100' },
    { name: 'Timer', path: '/us/tools/apps/timer', icon: '⏰', color: 'bg-orange-100' },
    { name: 'Stopwatch', path: '/us/tools/apps/stopwatch', icon: '⏱️', color: 'bg-green-100' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">🔢</span>
            <span className="text-white font-semibold text-sm">Basic Calculator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {getH1('Online Basic Calculator')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Perform basic arithmetic operations with keyboard support and calculation history.')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Calculator Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Stats Bar */}
            <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">HISTORY</div>
                <div className="text-xs sm:text-sm font-bold">{calculationHistory.length}</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">OPS</div>
                <div className="text-xs sm:text-sm font-bold">4</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">KEYBOARD</div>
                <div className="text-xs sm:text-sm font-bold">ON</div>
              </div>
              <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] sm:text-xs font-medium opacity-90">MEMORY</div>
                <div className="text-xs sm:text-sm font-bold">10</div>
              </div>
            </div>

            {/* Calculator */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 border border-gray-700">
              {/* Display */}
              <div className="mb-4">
                <div className="text-right text-gray-400 text-sm mb-1 h-5 font-mono">{equation}</div>
                <div className="w-full h-16 sm:h-20 bg-gradient-to-r from-gray-950 to-gray-900 rounded-xl flex items-center justify-end px-4 text-3xl sm:text-4xl font-light text-white overflow-hidden border border-gray-700 shadow-inner">
                  <span>{currentInput}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 active:scale-95 transition-all shadow-lg" onClick={clear}>AC</button>
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 active:scale-95 transition-all shadow-lg" onClick={toggleSign}>±</button>
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 active:scale-95 transition-all shadow-lg" onClick={percentage}>%</button>
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 active:scale-95 transition-all shadow-lg" onClick={() => inputOperator('/')}>÷</button>

                {[7, 8, 9].map(n => (
                  <button key={n} className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 active:scale-95 transition-all shadow-lg" onClick={() => inputNumber(n.toString())}>{n}</button>
                ))}
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 active:scale-95 transition-all shadow-lg" onClick={() => inputOperator('*')}>×</button>

                {[4, 5, 6].map(n => (
                  <button key={n} className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 active:scale-95 transition-all shadow-lg" onClick={() => inputNumber(n.toString())}>{n}</button>
                ))}
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 active:scale-95 transition-all shadow-lg" onClick={() => inputOperator('-')}>-</button>

                {[1, 2, 3].map(n => (
                  <button key={n} className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 active:scale-95 transition-all shadow-lg" onClick={() => inputNumber(n.toString())}>{n}</button>
                ))}
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 active:scale-95 transition-all shadow-lg" onClick={() => inputOperator('+')}>+</button>

                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 active:scale-95 transition-all shadow-lg col-span-2" onClick={() => inputNumber('0')}>0</button>
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 active:scale-95 transition-all shadow-lg" onClick={inputDecimal}>.</button>
                <button className="h-14 sm:h-16 rounded-xl font-semibold text-lg sm:text-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 active:scale-95 transition-all shadow-lg" onClick={calculate}>=</button>
              </div>
            </div>

            {/* Calculation History */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-lg">📋</span> Calculation History
                </h3>
                <button onClick={clearHistory} className="text-red-500 hover:text-red-600 text-sm font-medium">
                  Clear All
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {calculationHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No calculations yet</p>
                ) : (
                  calculationHistory.map((calc, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 hover:bg-gray-100 transition-colors">
                      {calc}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">✨</span> Features
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '➕', title: 'Basic Operations', desc: '+, -, ×, ÷' },
                  { icon: '⌨️', title: 'Keyboard Support', desc: 'Type to calculate' },
                  { icon: '📜', title: 'History', desc: 'Last 10 calculations' },
                  { icon: '📱', title: 'Mobile Ready', desc: 'Works on all devices' },
                ].map(f => (
                  <div key={f.title} className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <div className="font-semibold text-gray-800 text-xs">{f.title}</div>
                    <div className="text-[10px] text-gray-500">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
{/* Right Sidebar */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Calculator Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Display</span>
                  <span className="font-bold text-blue-600 font-mono truncate max-w-[120px]">{currentInput}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Operation</span>
                  <span className="font-bold text-indigo-600">{operator ? getOperatorSymbol(operator) : '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">History</div>
                    <div className="text-xl font-bold text-gray-700">{calculationHistory.length}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Max</div>
                    <div className="text-xl font-bold text-gray-700">10</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Quick Reference */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-sm">
                {[
                  { key: '0-9', desc: 'Numbers' },
                  { key: '+ - * /', desc: 'Operators' },
                  { key: 'Enter / =', desc: 'Calculate' },
                  { key: 'Esc / C', desc: 'Clear' },
                  { key: '%', desc: 'Percentage' },
                ].map(s => (
                  <div key={s.key} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="font-mono text-blue-600 text-xs">{s.key}</span>
                    <span className="text-gray-600 text-xs">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Banner */}
            {/* Ad banner replaced with MREC components */}
{/* Related Tools */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Related Tools</h3>
              <div className="space-y-2">
                {relatedTools.map((tool) => (
                  <Link key={tool.path} href={tool.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                      {tool.icon}
                    </div>
                    <div className="font-semibold text-gray-800 text-sm">{tool.name}</div>
                  </Link>
                ))}
              </div>
              <Link href="/us/tools/apps" className="block mt-3 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Tools →
              </Link>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-4 text-white">
              <h3 className="text-lg font-bold mb-3">Pro Tips</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Use keyboard for faster input</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Press Enter to calculate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>ESC clears the display</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>History shows last 10 calculations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Calculators: Essential Math Tools</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Calculators have been essential tools for mathematical computation since the abacus was invented thousands
            of years ago. Modern electronic calculators emerged in the 1960s, and today&apos;s digital calculators provide
            instant access to mathematical operations. This online calculator offers all the basic functions you need
            for everyday calculations, from simple arithmetic to percentage calculations.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">➕ Basic Operations</h3>
              <p className="text-sm text-gray-600">Addition, subtraction, multiplication, and division for everyday math needs.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h3 className="font-semibold text-green-800 mb-2">📊 Percentage Calculations</h3>
              <p className="text-sm text-gray-600">Calculate percentages for discounts, tips, taxes, and more.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2">📝 Calculation History</h3>
              <p className="text-sm text-gray-600">Review your recent calculations and reuse previous results.</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h3 className="font-semibold text-orange-800 mb-2">⌨️ Keyboard Support</h3>
              <p className="text-sm text-gray-600">Type numbers and operators directly using your keyboard for faster input.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Why Use an Online Calculator?</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Online calculators are always available, require no downloads or installations, and work on any device
              with a web browser. They&apos;re perfect for quick calculations while shopping, budgeting, doing homework,
              or managing finances. Unlike physical calculators, online versions can store history and are continuously
              updated with new features.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3">Common Uses</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Shopping - Calculate discounts, compare prices, and figure out totals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Tipping - Quickly calculate restaurant tips at various percentages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Budgeting - Add up expenses and track your spending</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Education - Verify homework answers and practice math problems</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <GameAppMobileMrec2 />



        {/* FAQs */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
