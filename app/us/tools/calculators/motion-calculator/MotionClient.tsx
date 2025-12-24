'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import Link from 'next/link';
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

// Fallback FAQs for Motion Calculator
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'What are the kinematic equations of motion?',
    answer: 'The kinematic equations describe motion with constant acceleration. The four main equations are: v = u + at (final velocity), s = ut + ½at² (displacement), v² = u² + 2as (velocity-displacement), and s = ½(u + v)t (average velocity). Here, u is initial velocity, v is final velocity, a is acceleration, t is time, and s is displacement.',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'What is the difference between speed and velocity?',
    answer: 'Speed is a scalar quantity that measures how fast an object is moving, regardless of direction - it is always positive. Velocity is a vector quantity that includes both speed and direction of motion. An object moving in a circle at constant speed has changing velocity because its direction changes. In kinematic equations, we use velocity because direction matters for calculating displacement.',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'How do I calculate acceleration from velocity and time?',
    answer: 'Acceleration is calculated as the change in velocity divided by the time taken: a = (v - u)/t, where v is final velocity, u is initial velocity, and t is time. For example, if a car accelerates from 0 to 60 mph (26.8 m/s) in 8 seconds, the acceleration is 26.8/8 = 3.35 m/s². Negative acceleration (deceleration) occurs when an object slows down.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'What is free fall and what is the acceleration due to gravity?',
    answer: 'Free fall is motion under the influence of gravity alone, with no air resistance. On Earth, all objects in free fall accelerate at approximately 9.8 m/s² (or 32.2 ft/s²) regardless of their mass - this is called the acceleration due to gravity (g). Galileo demonstrated this by dropping objects from the Leaning Tower of Pisa. The Moon\'s gravity is about 1.62 m/s².',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'When can I use the kinematic equations?',
    answer: 'Kinematic equations can only be used when acceleration is constant throughout the motion. This includes: free fall (constant g), vehicles with steady acceleration, objects on frictionless inclined planes, and projectile motion (horizontal and vertical components separately). For non-constant acceleration, you need calculus-based methods or numerical integration.',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'How do I solve projectile motion problems?',
    answer: 'Projectile motion is solved by treating horizontal and vertical components separately. Horizontally, there is no acceleration (ignoring air resistance), so x = v₀ₓ × t. Vertically, acceleration is -g (downward), so use standard kinematic equations. The components are linked by time. Key points: horizontal velocity is constant, vertical velocity changes, and the path is a parabola.',
    order: 6,
  },
];

// Motion presets
const motionPresets = [
  { name: 'Free Fall', u: 0, a: 9.8, t: 3, icon: '🍎', desc: 'Falling from rest' },
  { name: 'Car Acceleration', u: 0, a: 3, t: 10, icon: '🚗', desc: '0 to 30 m/s' },
  { name: 'Braking', u: 30, a: -6, t: 5, icon: '🛑', desc: 'Slowing down' },
  { name: 'Bullet', u: 0, a: 300000, t: 0.002, icon: '🔫', desc: 'In gun barrel' },
  { name: 'Roller Coaster', u: 5, a: 15, t: 4, icon: '🎢', desc: 'Initial drop' },
  { name: 'Airplane Takeoff', u: 0, a: 2.5, t: 30, icon: '✈️', desc: 'Runway acceleration' },
];

export default function MotionClient() {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('motion-calculator');

  const [solveFor, setSolveFor] = useState('velocity');
  const [initialVelocity, setInitialVelocity] = useState(0);
  const [finalVelocity, setFinalVelocity] = useState(20);
  const [acceleration, setAcceleration] = useState(5);
  const [time, setTime] = useState(4);
  const [displacement, setDisplacement] = useState(40);

  const [result, setResult] = useState({
    value: 0,
    unit: 'm/s',
    formula: '',
    steps: [] as string[]
  });

  // Additional calculated values
  const [averageVelocity, setAverageVelocity] = useState(0);
  const [kineticEnergyRatio, setKineticEnergyRatio] = useState(0);

  useEffect(() => {
    calculate();
  }, [solveFor, initialVelocity, finalVelocity, acceleration, time, displacement]);

  const calculate = () => {
    let value = 0;
    let unit = '';
    let formula = '';
    let steps: string[] = [];
    let calcDisplacement = displacement;
    let calcFinalV = finalVelocity;

    switch (solveFor) {
      case 'velocity':
        // v = u + at
        value = initialVelocity + acceleration * time;
        calcFinalV = value;
        calcDisplacement = initialVelocity * time + 0.5 * acceleration * time * time;
        unit = 'm/s';
        formula = 'v = u + at';
        steps = [
          `Given: Initial velocity (u) = ${initialVelocity} m/s`,
          `        Acceleration (a) = ${acceleration} m/s²`,
          `        Time (t) = ${time} s`,
          ``,
          `Using formula: v = u + at`,
          `v = ${initialVelocity} + (${acceleration} × ${time})`,
          `v = ${initialVelocity} + ${(acceleration * time).toFixed(2)}`,
          `v = ${value.toFixed(2)} m/s`
        ];
        break;

      case 'acceleration':
        // a = (v - u) / t
        value = time !== 0 ? (finalVelocity - initialVelocity) / time : 0;
        calcDisplacement = initialVelocity * time + 0.5 * value * time * time;
        calcFinalV = finalVelocity;
        unit = 'm/s²';
        formula = 'a = (v - u) / t';
        steps = [
          `Given: Initial velocity (u) = ${initialVelocity} m/s`,
          `        Final velocity (v) = ${finalVelocity} m/s`,
          `        Time (t) = ${time} s`,
          ``,
          `Using formula: a = (v - u) / t`,
          `a = (${finalVelocity} - ${initialVelocity}) / ${time}`,
          `a = ${finalVelocity - initialVelocity} / ${time}`,
          `a = ${value.toFixed(2)} m/s²`
        ];
        break;

      case 'displacement':
        // s = ut + ½at²
        value = initialVelocity * time + 0.5 * acceleration * time * time;
        calcDisplacement = value;
        calcFinalV = initialVelocity + acceleration * time;
        unit = 'm';
        formula = 's = ut + ½at²';
        steps = [
          `Given: Initial velocity (u) = ${initialVelocity} m/s`,
          `        Acceleration (a) = ${acceleration} m/s²`,
          `        Time (t) = ${time} s`,
          ``,
          `Using formula: s = ut + ½at²`,
          `s = (${initialVelocity} × ${time}) + (0.5 × ${acceleration} × ${time}²)`,
          `s = ${(initialVelocity * time).toFixed(2)} + (0.5 × ${acceleration} × ${(time * time).toFixed(2)})`,
          `s = ${(initialVelocity * time).toFixed(2)} + ${(0.5 * acceleration * time * time).toFixed(2)}`,
          `s = ${value.toFixed(2)} m`
        ];
        break;

      case 'time':
        // t = (v - u) / a
        value = acceleration !== 0 ? (finalVelocity - initialVelocity) / acceleration : 0;
        calcDisplacement = initialVelocity * value + 0.5 * acceleration * value * value;
        calcFinalV = finalVelocity;
        unit = 's';
        formula = 't = (v - u) / a';
        steps = [
          `Given: Initial velocity (u) = ${initialVelocity} m/s`,
          `        Final velocity (v) = ${finalVelocity} m/s`,
          `        Acceleration (a) = ${acceleration} m/s²`,
          ``,
          `Using formula: t = (v - u) / a`,
          `t = (${finalVelocity} - ${initialVelocity}) / ${acceleration}`,
          `t = ${finalVelocity - initialVelocity} / ${acceleration}`,
          `t = ${value.toFixed(2)} s`
        ];
        break;
    }

    setResult({ value, unit, formula, steps });

    // Calculate average velocity
    const avgV = calcDisplacement / (solveFor === 'time' ? value : time) || 0;
    setAverageVelocity(avgV);

    // Calculate KE ratio (final KE / initial KE)
    const keRatio = initialVelocity !== 0 ? (calcFinalV * calcFinalV) / (initialVelocity * initialVelocity) : 0;
    setKineticEnergyRatio(keRatio);
  };

  const applyPreset = (preset: typeof motionPresets[0]) => {
    setInitialVelocity(preset.u);
    setAcceleration(preset.a);
    setTime(preset.t);
    setSolveFor('velocity');
  };

  // Schema.org WebApplication markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Motion Calculator",
    "description": "Calculate velocity, acceleration, displacement, and time using kinematic equations of motion.",
    "url": "https://www.example.com/us/tools/calculators/motion-calculator",
    "applicationCategory": "Physics Calculator",
    "operatingSystem": "All",
    "permissions": "none",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/speed-calculator', title: 'Speed Calculator', description: 'Calculate speed, distance, time' },
    { href: '/us/tools/calculators/kinetic-energy-calculator', title: 'Kinetic Energy', description: 'Calculate kinetic energy' },
    { href: '/us/tools/calculators/torque-calculator', title: 'Torque Calculator', description: 'Calculate torque force' },
    { href: '/us/tools/calculators/wave-properties-calculator', title: 'Wave Calculator', description: 'Calculate wave properties' },
    { href: '/us/tools/calculators/ohms-law-calculator', title: 'Ohms Law', description: 'Calculate electrical values' },
    { href: '/us/tools/calculators/gear-ratio-calculator', title: 'Gear Ratio', description: 'Calculate gear ratios' }
  ];

  return (
    <article className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 py-4 sm:py-6 md:py-8">
      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getH1('Motion Calculator')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getSubHeading('Calculate velocity, acceleration, displacement, and time using kinematic equations')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Calculator */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                <span className="text-2xl">🚀</span> Motion Parameters
              </h2>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Solve For Selection */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-indigo-800">What do you want to calculate?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'velocity', label: 'Final Velocity (v)', icon: '⚡' },
                      { value: 'acceleration', label: 'Acceleration (a)', icon: '📈' },
                      { value: 'displacement', label: 'Displacement (s)', icon: '📏' },
                      { value: 'time', label: 'Time (t)', icon: '⏱️' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSolveFor(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          solveFor === option.value
                            ? 'border-indigo-500 bg-indigo-100 shadow-md'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-lg">{option.icon}</div>
                        <div className="text-xs font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-4 text-blue-800">Enter Known Values</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(solveFor !== 'time') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Initial Velocity (u) - m/s
                        </label>
                        <input
                          type="number"
                          value={initialVelocity}
                          onChange={(e) => setInitialVelocity(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                          step="0.1"
                        />
                      </div>
                    )}

                    {(solveFor === 'acceleration' || solveFor === 'time') && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Velocity (u) - m/s
                          </label>
                          <input
                            type="number"
                            value={initialVelocity}
                            onChange={(e) => setInitialVelocity(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Final Velocity (v) - m/s
                          </label>
                          <input
                            type="number"
                            value={finalVelocity}
                            onChange={(e) => setFinalVelocity(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                            step="0.1"
                          />
                        </div>
                      </>
                    )}

                    {(solveFor === 'velocity' || solveFor === 'displacement' || solveFor === 'time') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Acceleration (a) - m/s²
                        </label>
                        <input
                          type="number"
                          value={acceleration}
                          onChange={(e) => setAcceleration(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                          step="0.1"
                        />
                      </div>
                    )}

                    {solveFor !== 'time' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time (t) - seconds
                        </label>
                        <input
                          type="number"
                          value={time}
                          onChange={(e) => setTime(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                          step="0.1"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Motion Presets */}
                <div className="bg-green-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-green-800">Quick Presets - Real-World Examples</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {motionPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="p-3 bg-white hover:bg-green-100 border border-green-200 rounded-lg transition text-center"
                        title={preset.desc}
                      >
                        <div className="text-xl">{preset.icon}</div>
                        <div className="text-xs text-gray-700 font-medium">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Kinematic Equations Reference */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Kinematic Equations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="text-xl font-mono text-indigo-700 mb-2">v = u + at</div>
                  <p className="text-sm text-indigo-600">Final velocity from initial velocity, acceleration, and time</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl font-mono text-purple-700 mb-2">s = ut + ½at²</div>
                  <p className="text-sm text-purple-600">Displacement from initial velocity, acceleration, and time</p>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="text-xl font-mono text-pink-700 mb-2">v² = u² + 2as</div>
                  <p className="text-sm text-pink-600">Relates velocities to acceleration and displacement</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl font-mono text-blue-700 mb-2">s = ½(u + v)t</div>
                  <p className="text-sm text-blue-600">Displacement using average velocity</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Variable Key</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-yellow-700">
                  <div><strong>u</strong> = Initial velocity</div>
                  <div><strong>v</strong> = Final velocity</div>
                  <div><strong>a</strong> = Acceleration</div>
                  <div><strong>t</strong> = Time</div>
                  <div><strong>s</strong> = Displacement</div>
                </div>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <CalculatorMobileMrec2 />



            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
            </div>

            {/* Related Calculators */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedCalculators.map((calc) => (
                  <Link key={calc.href} href={calc.href} className="group">
                    <div className="rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all h-full">
                      <div className="text-2xl mb-2">⚡</div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{calc.title}</h3>
                      <p className="text-xs text-gray-600">{calc.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Result */}
            <div className="bg-white rounded-xl shadow-lg p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span> Result
              </h3>

              <div className="space-y-4">
                {/* Primary Result */}
                <div className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white text-center">
                  <div className="text-sm text-indigo-200 mb-1">Using: {result.formula}</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{result.value.toFixed(2)}</div>
                  <div className="text-lg text-indigo-200 mt-1">{result.unit}</div>
                </div>

                {/* Input Summary */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-xs text-blue-600">Initial Velocity</div>
                    <div className="text-lg font-bold text-blue-800">{initialVelocity} m/s</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-xs text-green-600">Acceleration</div>
                    <div className="text-lg font-bold text-green-800">{acceleration} m/s²</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <div className="text-xs text-purple-600">Time</div>
                    <div className="text-lg font-bold text-purple-800">{time} s</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <div className="text-xs text-orange-600">Avg Velocity</div>
                    <div className="text-lg font-bold text-orange-800">{averageVelocity.toFixed(2)} m/s</div>
                  </div>
                </div>

                {/* Step-by-Step Solution */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">Step-by-Step Solution</h4>
                  <div className="font-mono text-xs text-gray-600 whitespace-pre-line">
                    {result.steps.join('\n')}
                  </div>
                </div>
              </div>
            </div>

            {/* Common Accelerations */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-orange-800 mb-3">Common Accelerations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-orange-200">
                  <span className="text-orange-700">Gravity (Earth)</span>
                  <span className="font-medium text-orange-800">9.8 m/s²</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-orange-200">
                  <span className="text-orange-700">Gravity (Moon)</span>
                  <span className="font-medium text-orange-800">1.62 m/s²</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-orange-200">
                  <span className="text-orange-700">Sports car (0-60)</span>
                  <span className="font-medium text-orange-800">~8 m/s²</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-orange-200">
                  <span className="text-orange-700">Commercial jet</span>
                  <span className="font-medium text-orange-800">~2.5 m/s²</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-orange-700">Human comfort limit</span>
                  <span className="font-medium text-orange-800">~30 m/s²</span>
                </div>
              </div>
            </div>

            {/* Quick Conversions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-blue-800 mb-3">Speed Conversions</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>1 m/s = 3.6 km/h</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>1 m/s = 2.237 mph</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>1 km/h = 0.278 m/s</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>1 mph = 0.447 m/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
