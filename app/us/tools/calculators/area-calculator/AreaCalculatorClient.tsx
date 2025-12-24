'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface Props {
  relatedCalculators?: RelatedCalculator[];
}

type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'square' | 'trapezoid' | 'ellipse';

interface ShapeConfig {
  name: string;
  formula: string;
}

const shapes: Record<ShapeType, ShapeConfig> = {
  rectangle: { name: 'Rectangle', formula: 'A = length × width' },
  circle: { name: 'Circle', formula: 'A = π × r²' },
  triangle: { name: 'Triangle', formula: 'A = ½ × base × height' },
  square: { name: 'Square', formula: 'A = side²' },
  trapezoid: { name: 'Trapezoid', formula: 'A = ½ × (a + b) × h' },
  ellipse: { name: 'Ellipse', formula: 'A = π × a × b' },
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Area Calculator?",
    answer: "A Area Calculator is a mathematical tool that helps you quickly calculate or convert area-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Area Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Area Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
    order: 3
  },
  {
    id: '4',
    question: "Can I use this for professional or academic work?",
    answer: "Yes, this calculator is suitable for professional, academic, and personal use. It uses standard formulas that are widely accepted. However, always verify critical calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Is this calculator free?",
    answer: "Yes, this Area Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function AreaCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('area-calculator');

  const [currentShape, setCurrentShape] = useState<ShapeType>('rectangle');

  // Rectangle/Square
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(8);
  const [side, setSide] = useState(6);

  // Circle/Ellipse
  const [radius, setRadius] = useState(5);
  const [semiMajor, setSemiMajor] = useState(8);
  const [semiMinor, setSemiMinor] = useState(5);

  // Triangle
  const [base, setBase] = useState(12);
  const [height, setHeight] = useState(8);

  // Trapezoid
  const [parallelA, setParallelA] = useState(10);
  const [parallelB, setParallelB] = useState(6);
  const [trapHeight, setTrapHeight] = useState(5);

  const [area, setArea] = useState(0);
  const [perimeter, setPerimeter] = useState(0);
  const [calculation, setCalculation] = useState('');

  useEffect(() => {
    calculateArea();
  }, [currentShape, length, width, side, radius, semiMajor, semiMinor, base, height, parallelA, parallelB, trapHeight]);

  const calculateArea = () => {
    let areaValue = 0;
    let perimeterValue = 0;
    let calcText = '';

    switch (currentShape) {
      case 'rectangle':
        areaValue = length * width;
        perimeterValue = 2 * (length + width);
        calcText = `${length} × ${width} = ${areaValue}`;
        break;
      case 'circle':
        areaValue = Math.PI * radius * radius;
        perimeterValue = 2 * Math.PI * radius;
        calcText = `π × ${radius}² = ${areaValue.toFixed(4)}`;
        break;
      case 'triangle':
        areaValue = (base * height) / 2;
        perimeterValue = 0; // Would need all sides
        calcText = `½ × ${base} × ${height} = ${areaValue}`;
        break;
      case 'square':
        areaValue = side * side;
        perimeterValue = 4 * side;
        calcText = `${side}² = ${areaValue}`;
        break;
      case 'trapezoid':
        areaValue = ((parallelA + parallelB) * trapHeight) / 2;
        perimeterValue = 0; // Would need all sides
        calcText = `½ × (${parallelA} + ${parallelB}) × ${trapHeight} = ${areaValue}`;
        break;
      case 'ellipse':
        areaValue = Math.PI * semiMajor * semiMinor;
        perimeterValue = Math.PI * (3 * (semiMajor + semiMinor) - Math.sqrt((3 * semiMajor + semiMinor) * (semiMajor + 3 * semiMinor)));
        calcText = `π × ${semiMajor} × ${semiMinor} = ${areaValue.toFixed(4)}`;
        break;
    }

    setArea(areaValue);
    setPerimeter(perimeterValue);
    setCalculation(calcText);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getH1('Area Calculator')}</h1>
          <p className="text-gray-600">Calculate the area of different geometric shapes</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Shape Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Shape</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {(Object.keys(shapes) as ShapeType[]).map((shape) => (
                <button
                  key={shape}
                  onClick={() => setCurrentShape(shape)}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    currentShape === shape
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium">{shapes[shape].name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Dimensions</h2>

              {currentShape === 'rectangle' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {currentShape === 'circle' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Radius</label>
                  <input
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {currentShape === 'triangle' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
                    <input
                      type="number"
                      value={base}
                      onChange={(e) => setBase(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {currentShape === 'square' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Side Length</label>
                  <input
                    type="number"
                    value={side}
                    onChange={(e) => setSide(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {currentShape === 'trapezoid' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parallel Side a</label>
                    <input
                      type="number"
                      value={parallelA}
                      onChange={(e) => setParallelA(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parallel Side b</label>
                    <input
                      type="number"
                      value={parallelB}
                      onChange={(e) => setParallelB(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="number"
                      value={trapHeight}
                      onChange={(e) => setTrapHeight(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {currentShape === 'ellipse' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semi-major Axis (a)</label>
                    <input
                      type="number"
                      value={semiMajor}
                      onChange={(e) => setSemiMajor(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semi-minor Axis (b)</label>
                    <input
                      type="number"
                      value={semiMinor}
                      onChange={(e) => setSemiMinor(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Formula Display */}
              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Formula</div>
                <div className="font-mono text-sm text-gray-700">{shapes[currentShape].formula}</div>
              </div>
            </div>

            {/* Result Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

              {/* Main Result */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 mb-4">
                <div className="text-center">
                  <div className="text-sm text-blue-600 mb-1">Area</div>
                  <div className="text-4xl font-bold text-blue-700">{area.toFixed(2)}</div>
                  <div className="text-sm text-blue-600 mt-1">square units</div>
                </div>
              </div>

              {/* Additional Results */}
              <div className="space-y-3">
                {perimeter > 0 && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="text-xs text-green-600 mb-1">Perimeter / Circumference</div>
                    <div className="text-xl font-bold text-green-700">{perimeter.toFixed(2)} units</div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Calculation</div>
                  <div className="font-mono text-sm text-gray-700">{calculation}</div>
                </div>
              </div>

              {/* Unit Conversions */}
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Unit Conversions</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">sq cm:</span>
                    <span className="font-medium">{(area * 10000).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">sq in:</span>
                    <span className="font-medium">{(area * 1550.0031).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">sq ft:</span>
                    <span className="font-medium">{(area * 10.7639).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">sq yd:</span>
                    <span className="font-medium">{(area * 1.19599).toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        {/* Formulas Reference */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Area Formulas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Shape</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Formula</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Variables</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 px-3 font-medium">Rectangle</td>
                  <td className="py-2 px-3 font-mono text-xs">A = l × w</td>
                  <td className="py-2 px-3 text-gray-600">l = length, w = width</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Square</td>
                  <td className="py-2 px-3 font-mono text-xs">A = s²</td>
                  <td className="py-2 px-3 text-gray-600">s = side length</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Circle</td>
                  <td className="py-2 px-3 font-mono text-xs">A = πr²</td>
                  <td className="py-2 px-3 text-gray-600">r = radius</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Triangle</td>
                  <td className="py-2 px-3 font-mono text-xs">A = ½bh</td>
                  <td className="py-2 px-3 text-gray-600">b = base, h = height</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Trapezoid</td>
                  <td className="py-2 px-3 font-mono text-xs">A = ½(a+b)h</td>
                  <td className="py-2 px-3 text-gray-600">a, b = parallel sides, h = height</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Ellipse</td>
                  <td className="py-2 px-3 font-mono text-xs">A = πab</td>
                  <td className="py-2 px-3 text-gray-600">a, b = semi-axes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' },
              { href: '/us/tools/calculators/circumference-calculator', title: 'Circumference Calculator', description: 'Calculate circumference' },
              { href: '/us/tools/calculators/fraction-calculator', title: 'Fraction Calculator', description: 'Work with fractions' },
              { href: '/us/tools/calculators/average-calculator', title: 'Average Calculator', description: 'Statistical averages' },
            ].map((calc) => (
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

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="area-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
    </div>
  );
}
