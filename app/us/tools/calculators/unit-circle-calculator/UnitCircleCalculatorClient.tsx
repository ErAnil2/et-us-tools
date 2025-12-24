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
  faqSchema?: any;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Unit Circle Calculator?",
    answer: "A Unit Circle Calculator is a mathematical tool that helps you quickly calculate or convert unit circle-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Unit Circle Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Unit Circle Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Unit Circle Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function UnitCircleCalculatorClient({ relatedCalculators = defaultRelatedCalculators, faqSchema }: Props) {
  const { getH1, getSubHeading } = usePageSEO('unit-circle-calculator');

  const [angleValue, setAngleValue] = useState(45);
  const [angleUnit, setAngleUnit] = useState('degrees');
  const [sineValue, setSineValue] = useState(0.707);
  const [cosineValue, setCosineValue] = useState(0.707);
  const [tangentValue, setTangentValue] = useState(1.000);
  const [coordinates, setCoordinates] = useState('(0.707, 0.707)');
  const [referenceAngle, setReferenceAngle] = useState('45°');
  const [quadrant, setQuadrant] = useState('I');

  useEffect(() => {
    calculateTrigValues();
  }, [angleValue, angleUnit]);

  const calculateTrigValues = () => {
    const angleVal = parseFloat(angleValue.toString()) || 0;

    let angleRadians;
    if (angleUnit === 'degrees') {
      angleRadians = angleVal * Math.PI / 180;
    } else {
      angleRadians = angleVal;
    }

    const sine = Math.sin(angleRadians);
    const cosine = Math.cos(angleRadians);
    const tangent = Math.tan(angleRadians);

    setSineValue(parseFloat(sine.toFixed(4)));
    setCosineValue(parseFloat(cosine.toFixed(4)));
    setTangentValue(isFinite(tangent) ? parseFloat(tangent.toFixed(4)) : Infinity);
    setCoordinates(`(${cosine.toFixed(3)}, ${sine.toFixed(3)})`);

    const angleDegrees = angleUnit === 'degrees' ? angleVal : angleVal * 180 / Math.PI;
    const normalizedAngle = ((angleDegrees % 360) + 360) % 360;

    let refAngle;
    if (normalizedAngle <= 90) {
      refAngle = normalizedAngle;
    } else if (normalizedAngle <= 180) {
      refAngle = 180 - normalizedAngle;
    } else if (normalizedAngle <= 270) {
      refAngle = normalizedAngle - 180;
    } else {
      refAngle = 360 - normalizedAngle;
    }

    setReferenceAngle(`${refAngle.toFixed(1)}°`);

    let quad;
    if (normalizedAngle < 90) quad = 'I';
    else if (normalizedAngle < 180) quad = 'II';
    else if (normalizedAngle < 270) quad = 'III';
    else quad = 'IV';

    setQuadrant(quad);

    updateVisualization(cosine, sine, angleRadians);
  };

  const updateVisualization = (cosine: number, sine: number, angleRadians: number) => {
    const x = cosine * 100;
    const y = -sine * 100;

    const circlePoint = document.getElementById('circlePoint');
    const angleLine = document.getElementById('angleLine');
    const xCoordLine = document.getElementById('xCoordLine');
    const yCoordLine = document.getElementById('yCoordLine');
    const angleArc = document.getElementById('angleArc');

    if (circlePoint) {
      circlePoint.setAttribute('cx', x.toString());
      circlePoint.setAttribute('cy', y.toString());
    }

    if (angleLine) {
      angleLine.setAttribute('x2', x.toString());
      angleLine.setAttribute('y2', y.toString());
    }

    if (xCoordLine) {
      xCoordLine.setAttribute('x1', x.toString());
      xCoordLine.setAttribute('x2', x.toString());
      xCoordLine.setAttribute('y2', y.toString());
    }

    if (yCoordLine) {
      yCoordLine.setAttribute('y1', y.toString());
      yCoordLine.setAttribute('x2', x.toString());
      yCoordLine.setAttribute('y2', y.toString());
    }

    if (angleArc) {
      const largeArc = Math.abs(angleRadians) > Math.PI ? 1 : 0;
      const arcX = Math.cos(angleRadians) * 30;
      const arcY = -Math.sin(angleRadians) * 30;
      const arcPath = `M 30 0 A 30 30 0 ${largeArc} ${angleRadians > 0 ? 0 : 1} ${arcX} ${arcY}`;
      angleArc.setAttribute('d', arcPath);
    }
  };

  const setCommonAngle = (degrees: number, radians: number) => {
    if (angleUnit === 'degrees') {
      setAngleValue(degrees);
    } else {
      setAngleValue(parseFloat(radians.toFixed(4)));
    }
  };

  const randomAngle = () => {
    if (angleUnit === 'degrees') {
      setAngleValue(Math.floor(Math.random() * 360));
    } else {
      setAngleValue(parseFloat((Math.random() * 2 * Math.PI).toFixed(4)));
    }
  };

  const complementaryAngle = () => {
    const currentValue = parseFloat(angleValue.toString()) || 0;
    if (angleUnit === 'degrees') {
      setAngleValue(90 - currentValue);
    } else {
      setAngleValue(parseFloat((Math.PI / 2 - currentValue).toFixed(4)));
    }
  };

  const supplementaryAngle = () => {
    const currentValue = parseFloat(angleValue.toString()) || 0;
    if (angleUnit === 'degrees') {
      setAngleValue(180 - currentValue);
    } else {
      setAngleValue(parseFloat((Math.PI - currentValue).toFixed(4)));
    }
  };

  const coterminalAngle = () => {
    const currentValue = parseFloat(angleValue.toString()) || 0;
    if (angleUnit === 'degrees') {
      setAngleValue(currentValue + 360);
    } else {
      setAngleValue(parseFloat((currentValue + 2 * Math.PI).toFixed(4)));
    }
  };

  const clearValues = () => {
    setAngleValue(0);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Unit Circle Calculator')}</h1>
        <p className="text-xl text-gray-600">Calculate trigonometric values and visualize angles on the unit circle</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">📐 Angle Input</h3>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-800">Angle Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit Type</label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="angleUnit"
                          value="degrees"
                          checked={angleUnit === 'degrees'}
                          onChange={(e) => setAngleUnit(e.target.value)}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Degrees</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="angleUnit"
                          value="radians"
                          checked={angleUnit === 'radians'}
                          onChange={(e) => setAngleUnit(e.target.value)}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Radians</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="angleValue" className="block text-sm font-medium text-gray-700 mb-1">Angle Value</label>
                    <input
                      type="number"
                      id="angleValue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={angleValue}
                      onChange={(e) => setAngleValue(parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-green-800">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={randomAngle} className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded transition">Random Angle</button>
                  <button onClick={complementaryAngle} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded transition">Complementary</button>
                  <button onClick={supplementaryAngle} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded transition">Supplementary</button>
                  <button onClick={coterminalAngle} className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded transition">Add 360°</button>
                </div>
              </div>

              <button
                onClick={calculateTrigValues}
                className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Calculate Trigonometric Values
              </button>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">📊 Common Angles</h3>

            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-purple-800">Standard Angles (First Quadrant)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button onClick={() => setCommonAngle(0, 0)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 text-sm rounded transition">0° / 0</button>
                  <button onClick={() => setCommonAngle(30, 0.5236)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 text-sm rounded transition">30° / π/6</button>
                  <button onClick={() => setCommonAngle(45, 0.7854)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 text-sm rounded transition">45° / π/4</button>
                  <button onClick={() => setCommonAngle(60, 1.0472)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 text-sm rounded transition">60° / π/3</button>
                  <button onClick={() => setCommonAngle(90, 1.5708)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 text-sm rounded transition">90° / π/2</button>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-orange-800">Extended Angles (All Quadrants)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button onClick={() => setCommonAngle(120, 2.0944)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-sm rounded transition">120° / 2π/3</button>
                  <button onClick={() => setCommonAngle(135, 2.3562)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-sm rounded transition">135° / 3π/4</button>
                  <button onClick={() => setCommonAngle(150, 2.6180)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-sm rounded transition">150° / 5π/6</button>
                  <button onClick={() => setCommonAngle(180, 3.1416)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-sm rounded transition">180° / π</button>
                  <button onClick={() => setCommonAngle(210, 3.6652)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-sm rounded transition">210° / 7π/6</button>
                  <button onClick={() => setCommonAngle(225, 3.9270)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-sm rounded transition">225° / 5π/4</button>
                  <button onClick={() => setCommonAngle(270, 4.7124)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-sm rounded transition">270° / 3π/2</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">🎯 Unit Circle Visualization</h3>
            <div className="flex justify-center">
              <svg width="300" height="300" viewBox="-150 -150 300 300" className="border rounded-lg">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <line x1="-150" y1="0" x2="150" y2="0" stroke="#6b7280" strokeWidth="2"/>
                <line x1="0" y1="-150" x2="0" y2="150" stroke="#6b7280" strokeWidth="2"/>
                <circle cx="0" cy="0" r="100" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                <path id="angleArc" fill="none" stroke="#10b981" strokeWidth="2"/>
                <line id="angleLine" x1="0" y1="0" x2="70.7" y2="-70.7" stroke="#ef4444" strokeWidth="2"/>
                <circle id="circlePoint" cx="70.7" cy="-70.7" r="4" fill="#ef4444"/>
                <line id="xCoordLine" x1="70.7" y1="0" x2="70.7" y2="-70.7" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5,5"/>
                <line id="yCoordLine" x1="0" y1="-70.7" x2="70.7" y2="-70.7" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5,5"/>
                <text x="110" y="5" textAnchor="middle" className="text-xs fill-current text-gray-600">1</text>
                <text x="5" y="-110" textAnchor="middle" className="text-xs fill-current text-gray-600">1</text>
                <text x="-110" y="5" textAnchor="middle" className="text-xs fill-current text-gray-600">-1</text>
                <text x="5" y="120" textAnchor="middle" className="text-xs fill-current text-gray-600">-1</text>
              </svg>
            </div>
          </div>
<div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding the Unit Circle</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Unit Circle Basics</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Circle with radius = 1</li>
                    <li>• Center at origin (0, 0)</li>
                    <li>• Equation: x² + y² = 1</li>
                    <li>• Circumference = 2π</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Trigonometric Functions</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• sin θ = y-coordinate</li>
                    <li>• cos θ = x-coordinate</li>
                    <li>• tan θ = sin θ / cos θ</li>
                    <li>• Point: (cos θ, sin θ)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Quadrants</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Q1: sin &gt; 0, cos &gt; 0</li>
                    <li>• Q2: sin &gt; 0, cos &lt; 0</li>
                    <li>• Q3: sin &lt; 0, cos &lt; 0</li>
                    <li>• Q4: sin &lt; 0, cos &gt; 0</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Key Angles</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• 0°, 30°, 45°, 60°, 90°</li>
                    <li>• π/6, π/4, π/3, π/2 radians</li>
                    <li>• Reference angles</li>
                    <li>• Special right triangles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Trigonometric Values</h3>

            <div className="space-y-3">
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-xs text-red-700">Sine (sin θ)</div>
                <div className="text-xl font-bold text-red-600">{sineValue}</div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-blue-700">Cosine (cos θ)</div>
                <div className="text-xl font-bold text-blue-600">{cosineValue}</div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-green-700">Tangent (tan θ)</div>
                <div className="text-xl font-bold text-green-600">{tangentValue === Infinity ? 'undefined' : tangentValue}</div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs text-purple-700">Coordinates (x, y)</div>
                <div className="text-lg font-bold text-purple-600">{coordinates}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Angle Information</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Reference Angle:</span>
                <span className="font-bold text-sm">{referenceAngle}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-600">Quadrant:</span>
                <span className="font-bold text-sm">{quadrant}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>

            <div className="space-y-2">
              <button onClick={clearValues} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded transition">Clear Values</button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-3">📐 Unit Circle Facts</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div>• Radius = 1</div>
              <div>• Center at (0, 0)</div>
              <div>• 360° = 2π radians</div>
              <div>• sin²θ + cos²θ = 1</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-green-800 mb-3">💡 Conversion Tips</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div>• Degrees to radians: × π/180</div>
              <div>• Radians to degrees: × 180/π</div>
              <div>• 90° = π/2 radians</div>
              <div>• 180° = π radians</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Related Math Calculators</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">{calc.title}</h4>
              <p className="text-xs text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="unit-circle-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
