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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

export default function ProportionCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('proportion-calculator');

  const [calculationType, setCalculationType] = useState('proportion');
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [c, setC] = useState<number | ''>('');
  const [d, setD] = useState(8);
  const [solveFor, setSolveFor] = useState('c');

  const [ratioA, setRatioA] = useState(12);
  const [ratioB, setRatioB] = useState(18);

  const [part, setPart] = useState(25);
  const [whole, setWhole] = useState(100);

  const [originalLength, setOriginalLength] = useState(5);
  const [scaledLength, setScaledLength] = useState(15);
  const [newOriginal, setNewOriginal] = useState(8);
  const [newScaled, setNewScaled] = useState<number | ''>('');

  const [answer, setAnswer] = useState('6');
  const [equationDisplay, setEquationDisplay] = useState('3/4 = 6/8');
  const [crossProduct, setCrossProduct] = useState('24 = 24');
  const [problemTypeDisplay, setProblemTypeDisplay] = useState('Basic Proportion');
  const [solutionSteps, setSolutionSteps] = useState<string[]>([
    '1. Set up: 3/4 = ?/8',
    '2. Cross multiply: 3 × 8 = 4 × ?',
    '3. Simplify: 24 = 4 × ?',
    '4. Solve: ? = 24 ÷ 4 = 6'
  ]);
  const [verification, setVerification] = useState<string[]>([
    'Check: 3/4 = 6/8',
    '0.75 = 0.75 ✓'
  ]);

  const fallbackFaqs = [
    {
      id: '1',
      question: "What is a proportion in mathematics?",
      answer: "A proportion is an equation that states two ratios are equal. Written as a/b = c/d, it shows that the relationship between a and b is the same as the relationship between c and d. For example, 3/4 = 6/8 is a proportion because both ratios equal 0.75.",
      order: 1
    },
    {
      id: '2',
      question: "How do you solve proportions using cross multiplication?",
      answer: "Cross multiplication means multiplying diagonally across the equal sign. In a/b = c/d, multiply a×d and b×c. These products must be equal: a×d = b×c. To solve for a missing value, set up the cross multiplication equation and divide to isolate the unknown. Example: If 3/4 = x/8, then 3×8 = 4×x, so 24 = 4x, therefore x = 6.",
      order: 2
    },
    {
      id: '3',
      question: "What's the difference between a ratio and a proportion?",
      answer: "A ratio is a comparison of two quantities (like 3:4 or 3/4). A proportion is an equation stating that two ratios are equal (like 3/4 = 6/8). Think of ratios as the building blocks that make up proportions. Every proportion contains two ratios set equal to each other.",
      order: 3
    },
    {
      id: '4',
      question: "What are direct and inverse proportions?",
      answer: "Direct proportion: When one quantity increases, the other increases proportionally (y = kx). Example: More hours worked = more pay. Inverse proportion: When one increases, the other decreases proportionally (xy = k). Example: More workers = less time to complete a job. Both maintain a constant relationship.",
      order: 4
    },
    {
      id: '5',
      question: "What are practical applications of proportions?",
      answer: "Proportions are used in: recipe scaling (doubling or halving ingredients), map reading (scale like 1 inch = 50 miles), currency conversion, medicine dosage calculations based on weight, mixing paint colors or concrete, resizing images while maintaining aspect ratio, calculating tax and tips, and architectural scale models.",
      order: 5
    }
  ];

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const calculateProportion = () => {
    let answerText = '';
    let steps: string[] = [];
    let verificationText: string[] = [];
    let equation = '';
    let crossProd = '';
    let problemType = '';

    switch(calculationType) {
      case 'proportion':
        const aVal = parseFloat(String(a)) || 0;
        const bVal = parseFloat(String(b)) || 0;
        const cVal = parseFloat(String(c)) || 0;
        const dVal = parseFloat(String(d)) || 0;

        let result = 0;

        switch(solveFor) {
          case 'a':
            if (bVal && cVal && dVal) {
              result = (bVal * cVal) / dVal;
              equation = `${result.toFixed(2)}/${bVal} = ${cVal}/${dVal}`;
              steps = [
                `1. Set up: a/${bVal} = ${cVal}/${dVal}`,
                `2. Cross multiply: a × ${dVal} = ${bVal} × ${cVal}`,
                `3. Simplify: a × ${dVal} = ${bVal * cVal}`,
                `4. Solve: a = ${bVal * cVal} ÷ ${dVal} = ${result.toFixed(2)}`
              ];
              crossProd = `${result.toFixed(2)} × ${dVal} = ${bVal} × ${cVal}`;
            }
            break;
          case 'b':
            if (aVal && cVal && dVal) {
              result = (aVal * dVal) / cVal;
              equation = `${aVal}/${result.toFixed(2)} = ${cVal}/${dVal}`;
              steps = [
                `1. Set up: ${aVal}/b = ${cVal}/${dVal}`,
                `2. Cross multiply: ${aVal} × ${dVal} = b × ${cVal}`,
                `3. Simplify: ${aVal * dVal} = b × ${cVal}`,
                `4. Solve: b = ${aVal * dVal} ÷ ${cVal} = ${result.toFixed(2)}`
              ];
              crossProd = `${aVal} × ${dVal} = ${result.toFixed(2)} × ${cVal}`;
            }
            break;
          case 'c':
            if (aVal && bVal && dVal) {
              result = (aVal * dVal) / bVal;
              equation = `${aVal}/${bVal} = ${result.toFixed(2)}/${dVal}`;
              steps = [
                `1. Set up: ${aVal}/${bVal} = c/${dVal}`,
                `2. Cross multiply: ${aVal} × ${dVal} = ${bVal} × c`,
                `3. Simplify: ${aVal * dVal} = ${bVal} × c`,
                `4. Solve: c = ${aVal * dVal} ÷ ${bVal} = ${result.toFixed(2)}`
              ];
              crossProd = `${aVal} × ${dVal} = ${bVal} × ${result.toFixed(2)}`;
            }
            break;
          case 'd':
            if (aVal && bVal && cVal) {
              result = (bVal * cVal) / aVal;
              equation = `${aVal}/${bVal} = ${cVal}/${result.toFixed(2)}`;
              steps = [
                `1. Set up: ${aVal}/${bVal} = ${cVal}/d`,
                `2. Cross multiply: ${aVal} × d = ${bVal} × ${cVal}`,
                `3. Simplify: ${aVal} × d = ${bVal * cVal}`,
                `4. Solve: d = ${bVal * cVal} ÷ ${aVal} = ${result.toFixed(2)}`
              ];
              crossProd = `${aVal} × ${result.toFixed(2)} = ${bVal} × ${cVal}`;
            }
            break;
        }

        answerText = result.toFixed(3).replace(/\.?0+$/, '');
        problemType = 'Basic Proportion';
        const leftSide = parseFloat(equation.split(' = ')[0].split('/')[0]) / parseFloat(equation.split(' = ')[0].split('/')[1]);
        const rightSide = parseFloat(equation.split(' = ')[1].split('/')[0]) / parseFloat(equation.split(' = ')[1].split('/')[1]);
        verificationText = [
          `Check: ${equation}`,
          `${leftSide.toFixed(6)} = ${rightSide.toFixed(6)} ✓`
        ];
        break;

      case 'ratio':
        const ratioAVal = parseFloat(String(ratioA)) || 1;
        const ratioBVal = parseFloat(String(ratioB)) || 1;

        const commonDivisor = gcd(ratioAVal, ratioBVal);
        const simplifiedA = ratioAVal / commonDivisor;
        const simplifiedB = ratioBVal / commonDivisor;

        answerText = `${simplifiedA}:${simplifiedB}`;
        equation = `${ratioAVal}:${ratioBVal} = ${simplifiedA}:${simplifiedB}`;
        crossProd = `GCD = ${commonDivisor}`;
        problemType = 'Ratio Simplification';
        steps = [
          `1. Original ratio: ${ratioAVal}:${ratioBVal}`,
          `2. Find GCD: ${commonDivisor}`,
          `3. Divide both terms: ${ratioAVal}÷${commonDivisor} : ${ratioBVal}÷${commonDivisor}`,
          `4. Simplified: ${simplifiedA}:${simplifiedB}`
        ];
        verificationText = [
          `${ratioAVal}/${ratioBVal} = ${(ratioAVal/ratioBVal).toFixed(4)}`,
          `${simplifiedA}/${simplifiedB} = ${(simplifiedA/simplifiedB).toFixed(4)} ✓`
        ];
        break;

      case 'percent':
        const partVal = parseFloat(String(part)) || 0;
        const wholeVal = parseFloat(String(whole)) || 1;
        const percentage = (partVal / wholeVal) * 100;

        answerText = percentage.toFixed(2) + '%';
        equation = `${partVal}/${wholeVal} = ${percentage.toFixed(2)}/100`;
        crossProd = `${partVal} × 100 = ${wholeVal} × ${percentage.toFixed(2)}`;
        problemType = 'Percentage Proportion';
        steps = [
          `1. Formula: % = (Part ÷ Whole) × 100`,
          `2. Substitute: (${partVal} ÷ ${wholeVal}) × 100`,
          `3. Calculate: ${(partVal/wholeVal).toFixed(4)} × 100`,
          `4. Result: ${percentage.toFixed(2)}%`
        ];
        verificationText = [
          `${percentage.toFixed(2)}% of ${wholeVal} = ${((percentage/100) * wholeVal).toFixed(2)}`,
          `≈ ${partVal} ✓`
        ];
        break;

      case 'scale':
        const originalLengthVal = parseFloat(String(originalLength)) || 1;
        const scaledLengthVal = parseFloat(String(scaledLength)) || 1;
        const newOriginalVal = parseFloat(String(newOriginal)) || 1;

        const scaleFactor = scaledLengthVal / originalLengthVal;
        const newScaledVal = newOriginalVal * scaleFactor;

        answerText = newScaledVal.toFixed(3).replace(/\.?0+$/, '');
        equation = `${originalLengthVal}:${scaledLengthVal} = ${newOriginalVal}:${newScaledVal.toFixed(2)}`;
        crossProd = `Scale Factor = ${scaleFactor.toFixed(4)}`;
        problemType = 'Scale Factor';
        steps = [
          `1. Find scale factor: ${scaledLengthVal} ÷ ${originalLengthVal} = ${scaleFactor.toFixed(4)}`,
          `2. Apply to new value: ${newOriginalVal} × ${scaleFactor.toFixed(4)}`,
          `3. Result: ${newScaledVal.toFixed(3)}`
        ];
        verificationText = [
          `Scale ratio: 1:${scaleFactor.toFixed(4)}`,
          `${originalLengthVal}:${scaledLengthVal} = ${newOriginalVal}:${newScaledVal.toFixed(3)} ✓`
        ];
        setNewScaled(parseFloat(newScaledVal.toFixed(3)));
        break;
    }

    setAnswer(answerText);
    setEquationDisplay(equation);
    setCrossProduct(crossProd);
    setProblemTypeDisplay(problemType);
    setSolutionSteps(steps);
    setVerification(verificationText);
  };

  useEffect(() => {
    calculateProportion();
  }, [calculationType, a, b, c, d, solveFor, ratioA, ratioB, part, whole, originalLength, scaledLength, newOriginal]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Proportion Calculator')}</h1>
        <p className="text-xl text-gray-600">Solve proportions, ratios, and cross multiplication problems to find missing values</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">

          {/* Problem Type Selection */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">🔢 Proportion Calculator</h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-800">Problem Type</h4>
                <select
                  id="calculationType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value)}
                >
                  <option value="proportion">Solve Proportion (a/b = c/d)</option>
                  <option value="ratio">Simplify Ratio (a:b)</option>
                  <option value="percent">Percentage Proportion</option>
                  <option value="scale">Scale Factor</option>
                </select>
              </div>

              {/* Proportion Inputs */}
              <div
                id="proportionInputs"
                className="bg-purple-50 rounded-lg p-4"
                style={{ display: calculationType === 'proportion' ? 'block' : 'none' }}
              >
                <h4 className="font-semibold mb-3 text-purple-800">Proportion Setup</h4>

                {/* Visual Fraction Display */}
                <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 mb-4 flex items-center justify-center gap-3 sm:gap-5 md:gap-8">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      id="a"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-bold text-lg"
                      value={a}
                      step="any"
                      onChange={(e) => setA(parseFloat(e.target.value) || 0)}
                    />
                    <div className="w-16 h-0.5 bg-gray-800 my-2"></div>
                    <input
                      type="number"
                      id="b"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-bold text-lg"
                      value={b}
                      step="any"
                      onChange={(e) => setB(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">=</div>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      id="c"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-bold text-lg"
                      value={c}
                      placeholder="?"
                      step="any"
                      onChange={(e) => setC(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                    <div className="w-16 h-0.5 bg-gray-800 my-2"></div>
                    <input
                      type="number"
                      id="d"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-bold text-lg"
                      value={d}
                      step="any"
                      onChange={(e) => setD(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Solve For Options */}
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Solve for:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="solveFor"
                        value="a"
                        className="text-purple-600"
                        checked={solveFor === 'a'}
                        onChange={(e) => setSolveFor(e.target.value)}
                      />
                      <span className="text-sm">First numerator (a)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="solveFor"
                        value="b"
                        className="text-purple-600"
                        checked={solveFor === 'b'}
                        onChange={(e) => setSolveFor(e.target.value)}
                      />
                      <span className="text-sm">First denominator (b)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="solveFor"
                        value="c"
                        className="text-purple-600"
                        checked={solveFor === 'c'}
                        onChange={(e) => setSolveFor(e.target.value)}
                      />
                      <span className="text-sm">Second numerator (c)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="solveFor"
                        value="d"
                        className="text-purple-600"
                        checked={solveFor === 'd'}
                        onChange={(e) => setSolveFor(e.target.value)}
                      />
                      <span className="text-sm">Second denominator (d)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Ratio Inputs */}
              <div
                id="ratioInputs"
                className="bg-green-50 rounded-lg p-4"
                style={{ display: calculationType === 'ratio' ? 'block' : 'none' }}
              >
                <h4 className="font-semibold mb-3 text-green-800">Ratio Simplification</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Value</label>
                    <input
                      type="number"
                      id="ratioA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={ratioA}
                      step="any"
                      onChange={(e) => setRatioA(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Second Value</label>
                    <input
                      type="number"
                      id="ratioB"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={ratioB}
                      step="any"
                      onChange={(e) => setRatioB(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Percentage Inputs */}
              <div
                id="percentInputs"
                className="bg-orange-50 rounded-lg p-4"
                style={{ display: calculationType === 'percent' ? 'block' : 'none' }}
              >
                <h4 className="font-semibold mb-3 text-orange-800">Percentage Proportion</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Part</label>
                    <input
                      type="number"
                      id="part"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={part}
                      step="any"
                      onChange={(e) => setPart(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Whole</label>
                    <input
                      type="number"
                      id="whole"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={whole}
                      step="any"
                      onChange={(e) => setWhole(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Scale Inputs */}
              <div
                id="scaleInputs"
                className="bg-indigo-50 rounded-lg p-4"
                style={{ display: calculationType === 'scale' ? 'block' : 'none' }}
              >
                <h4 className="font-semibold mb-3 text-indigo-800">Scale Factor</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Length</label>
                    <input
                      type="number"
                      id="originalLength"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={originalLength}
                      step="any"
                      onChange={(e) => setOriginalLength(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scaled Length</label>
                    <input
                      type="number"
                      id="scaledLength"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={scaledLength}
                      step="any"
                      onChange={(e) => setScaledLength(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Original Value</label>
                    <input
                      type="number"
                      id="newOriginal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newOriginal}
                      step="any"
                      onChange={(e) => setNewOriginal(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Scaled Value (Result)</label>
                    <input
                      type="number"
                      id="newScaled"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      value={newScaled}
                      readOnly
                      placeholder="?"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={calculateProportion}
                className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Calculate Proportion
              </button>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Understanding Proportions Section */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Proportions</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Proportion Formula</h4>
                <p className="text-lg font-mono text-blue-600 mb-2">a/b = c/d</p>
                <p className="text-sm text-blue-700">Two ratios are equal when their cross products are equal: a×d = b×c</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Cross Multiplication</h4>
                <p className="text-lg font-mono text-green-600 mb-2">a×d = b×c</p>
                <p className="text-sm text-green-700">Multiply diagonally across the equal sign to solve for unknowns</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Key Terms</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• <strong>Means:</strong> Middle terms (b and c)</li>
                  <li>• <strong>Extremes:</strong> Outside terms (a and d)</li>
                  <li>• <strong>Ratio:</strong> Comparison of two quantities</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Applications</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Recipe scaling</li>
                  <li>• Map distances</li>
                  <li>• Currency conversion</li>
                  <li>• Medicine dosages</li>
                </ul>
              </div>
            </div>
          </div>
{/* Types of Proportions Section */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Types of Proportions</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">📈</div>
                <h4 className="font-semibold text-blue-800 mb-2">Direct Proportion</h4>
                <p className="text-sm text-blue-700">When one increases, the other increases proportionally</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl mb-2">📉</div>
                <h4 className="font-semibold text-green-800 mb-2">Inverse Proportion</h4>
                <p className="text-sm text-green-700">When one increases, the other decreases proportionally</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold text-purple-800 mb-2">Compound Proportion</h4>
                <p className="text-sm text-purple-700">Multiple ratios combined together</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl mb-2">⭐</div>
                <h4 className="font-semibold text-orange-800 mb-2">Golden Ratio</h4>
                <p className="text-sm text-orange-700">Special proportion ≈ 1.618:1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Proportion Results */}
          <div id="results" className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Proportion Results</h3>

            <div className="grid grid-cols-1 gap-2 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600" id="answer">{answer}</div>
                <div className="text-xs text-blue-700">Answer</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-sm font-bold text-green-600" id="equation-display">{equationDisplay}</div>
                <div className="text-xs text-green-700">Equation</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className="text-sm font-bold text-purple-600" id="cross-product">{crossProduct}</div>
                <div className="text-xs text-purple-700">Cross Product</div>
              </div>
            </div>

            {/* Problem Type Display */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">📊 Problem Type</h4>
              <div className="text-xs text-gray-700" id="problem-type-display">
                {problemTypeDisplay}
              </div>
            </div>
          </div>

          {/* Solution Steps */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-green-800 mb-3">📝 Solution Steps</h3>
            <div className="space-y-2 text-sm text-green-700" id="solutionSteps">
              {solutionSteps.map((step, index) => (
                <div key={index}>{step}</div>
              ))}
            </div>
          </div>

          {/* Verification */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-3">✓ Verification</h3>
            <div className="space-y-2 text-sm text-blue-700" id="verification">
              {verification.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>

          {/* Formula Reference */}
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-purple-800 mb-3">📐 Formulas</h3>
            <div className="space-y-2 text-sm text-purple-700">
              <div><strong>a/b = c/d</strong> (proportion)</div>
              <div><strong>a×d = b×c</strong> (cross product)</div>
              <div><strong>a:b = c:d</strong> (ratio notation)</div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border hover:border-blue-300 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">🧮</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Mobile MREC2 - Before FAQs */}

      <CalculatorMobileMrec2 />


      {/* FAQs */}
      <FirebaseFAQs
        pageId="proportion-calculator"
        fallbackFaqs={fallbackFaqs}
      />
    </div>
  );
}
