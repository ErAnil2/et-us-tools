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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type HeightUnit = 'ft' | 'cm';
type FrameSize = 'small' | 'medium' | 'large';

interface FormulaResult {
  name: string;
  weight: number;
  description: string;
  color: string;
}

export default function IdealWeightCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('ideal-weight-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('ft');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(7);
  const [heightCm, setHeightCm] = useState(170);
  const [age, setAge] = useState(30);
  const [frameSize, setFrameSize] = useState<FrameSize>('medium');

  const [results, setResults] = useState({
    hamwi: 0,
    devine: 0,
    robinson: 0,
    miller: 0,
    bmiMin: 0,
    bmiMax: 0
  });

  useEffect(() => {
    calculate();
  }, [gender, heightUnit, heightFeet, heightInches, heightCm, age, frameSize]);

  const calculate = () => {
    // Calculate height in inches and meters
    const totalHeightInches = heightUnit === 'ft'
      ? (heightFeet * 12 + heightInches)
      : heightCm / 2.54;

    const heightMeters = totalHeightInches * 0.0254;
    const baseHeight = 60; // 5 feet in inches
    const heightDiff = totalHeightInches - baseHeight;

    let hamwi, devine, robinson, miller;

    if (gender === 'male') {
      hamwi = 48 + 2.7 * heightDiff;
      devine = 50 + 2.3 * heightDiff;
      robinson = 52 + 1.9 * heightDiff;
      miller = 56.2 + 1.41 * heightDiff;
    } else {
      hamwi = 45.5 + 2.2 * heightDiff;
      devine = 45.5 + 2.3 * heightDiff;
      robinson = 49 + 1.7 * heightDiff;
      miller = 53.1 + 1.36 * heightDiff;
    }

    // Frame size adjustment (-10% small, +10% large)
    const frameAdjustment = frameSize === 'small' ? 0.9 : frameSize === 'large' ? 1.1 : 1;

    // BMI-based healthy weight range (BMI 18.5 - 24.9)
    const bmiMin = 18.5 * heightMeters * heightMeters;
    const bmiMax = 24.9 * heightMeters * heightMeters;

    setResults({
      hamwi: Math.max(0, hamwi * frameAdjustment),
      devine: Math.max(0, devine * frameAdjustment),
      robinson: Math.max(0, robinson * frameAdjustment),
      miller: Math.max(0, miller * frameAdjustment),
      bmiMin,
      bmiMax
    });
  };

  const average = (results.hamwi + results.devine + results.robinson + results.miller) / 4;
  const minWeight = Math.min(results.hamwi, results.devine, results.robinson, results.miller);
  const maxWeight = Math.max(results.hamwi, results.devine, results.robinson, results.miller);

  const formulaResults: FormulaResult[] = [
    { name: 'Hamwi', weight: results.hamwi, description: 'Developed in 1964, commonly used by dietitians', color: 'from-blue-500 to-blue-600' },
    { name: 'Devine', weight: results.devine, description: 'Created in 1974, widely used in medical dosing', color: 'from-green-500 to-green-600' },
    { name: 'Robinson', weight: results.robinson, description: 'Modified Devine formula from 1983', color: 'from-purple-500 to-purple-600' },
    { name: 'Miller', weight: results.miller, description: 'Latest formula from 1983, most lenient', color: 'from-orange-500 to-orange-600' },
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: "How is ideal body weight calculated?",
      answer: "Ideal body weight is calculated using height-based formulas developed by researchers. The main formulas (Hamwi, Devine, Robinson, Miller) use a base weight for 5 feet of height, then add a specific amount per inch above that. Results vary because each formula was developed for different purposes and populations.",
    order: 1
  },
    {
    id: '2',
    question: "Which ideal weight formula is most accurate?",
      answer: "No single formula is universally accurate. The Devine formula is commonly used in medical settings for drug dosing. The Robinson formula tends to give slightly lower estimates. For most people, the average of all formulas provides a reasonable target. Your healthy weight range from BMI (18.5-24.9) offers the widest accepted range.",
    order: 2
  },
    {
    id: '3',
    question: "Does frame size affect ideal weight?",
      answer: "Yes, body frame size can affect your ideal weight by about 10%. People with larger bone structures naturally weigh more. You can estimate frame size by measuring your wrist circumference and comparing to height. Our calculator adjusts results based on your selected frame size.",
    order: 3
  },
    {
    id: '4',
    question: "Is ideal weight the same as healthy weight?",
      answer: "Not exactly. 'Ideal weight' from formulas is a mathematical estimate based on height. 'Healthy weight' is the range where health risks are minimized (typically BMI 18.5-24.9). Many factors affect health besides weight: body composition, fitness level, waist circumference, and metabolic markers.",
    order: 4
  },
    {
    id: '5',
    question: "Why are there different ideal weight formulas?",
      answer: "Different formulas were created for different purposes: Devine (1974) for medication dosing, Hamwi (1964) for clinical nutrition, Robinson and Miller (1983) as improved alternatives. Each reflects different data and assumptions, which is why results vary.",
    order: 5
  }
  ];

  const getHeightDisplay = () => {
    if (heightUnit === 'ft') {
      return `${heightFeet}'${heightInches}"`;
    }
    return `${heightCm} cm`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Ideal Weight Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your ideal body weight using 4 scientifically-backed formulas.
            Get personalized results based on your gender, height, and frame size.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      gender === 'male'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">👨</span>
                    <span className="font-medium">Male</span>
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      gender === 'female'
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">👩</span>
                    <span className="font-medium">Female</span>
                  </button>
                </div>
              </div>

              {/* Height Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Height</label>
                  <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setHeightUnit('ft')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        heightUnit === 'ft' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Feet
                    </button>
                    <button
                      onClick={() => setHeightUnit('cm')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        heightUnit === 'cm' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      cm
                    </button>
                  </div>
                </div>

                {heightUnit === 'ft' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(Math.min(7, Math.max(4, parseInt(e.target.value) || 4)))}
                        min="4"
                        max="7"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={heightInches}
                        onChange={(e) => setHeightInches(Math.min(11, Math.max(0, parseInt(e.target.value) || 0)))}
                        min="0"
                        max="11"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">in</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Math.min(230, Math.max(120, parseInt(e.target.value) || 120)))}
                      min="120"
                      max="230"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">cm</span>
                  </div>
                )}
              </div>

              {/* Age Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Age</label>
                  <span className="text-lg font-bold text-blue-600">{age} years</span>
                </div>
                <input
                  type="range"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  min="15"
                  max="80"
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15</span>
                  <span>80</span>
                </div>
              </div>

              {/* Frame Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Body Frame Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as FrameSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFrameSize(size)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        frameSize === size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {size === 'small' ? '🦴' : size === 'medium' ? '💪' : '🏋️'}
                      </div>
                      <span className="text-xs font-medium capitalize">{size}</span>
                      <div className="text-[10px] text-gray-500">
                        {size === 'small' ? '-10%' : size === 'large' ? '+10%' : 'Base'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3 sm:p-4 md:p-6 text-white">
                <div className="text-center">
                  <p className="text-green-100 text-sm font-medium mb-1">Your Ideal Weight Range</p>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {minWeight.toFixed(0)} - {maxWeight.toFixed(0)} kg
                  </div>
                  <p className="text-green-100 text-sm">
                    Average: {average.toFixed(1)} kg ({(average * 2.205).toFixed(0)} lbs)
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-green-400/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-100">Height:</span>
                    <span className="font-semibold">{getHeightDisplay()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-green-100">Frame:</span>
                    <span className="font-semibold capitalize">{frameSize}</span>
                  </div>
                </div>
              </div>

              {/* BMI-Based Range */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-medium">Healthy BMI Range</p>
                    <p className="text-2xl font-bold">{results.bmiMin.toFixed(0)} - {results.bmiMax.toFixed(0)} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-xs">BMI 18.5 - 24.9</p>
                    <p className="text-sm">({(results.bmiMin * 2.205).toFixed(0)} - {(results.bmiMax * 2.205).toFixed(0)} lbs)</p>
                  </div>
                </div>
              </div>

              {/* Formula Comparison */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Formula Comparison</h4>
                <div className="space-y-2">
                  {formulaResults.map((formula) => (
                    <div key={formula.name} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${formula.color}`}></div>
                        <span className="text-sm font-medium text-gray-700">{formula.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">{formula.weight.toFixed(1)} kg</span>
                        <span className="text-xs text-gray-500 ml-1">({(formula.weight * 2.205).toFixed(0)} lbs)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Frame Size Tip</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Measure your wrist: Under 6" (small), 6-7" (medium), over 7" (large) for women.
                      Under 6.5" (small), 6.5-7.5" (medium), over 7.5" (large) for men.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Understanding Ideal Body Weight</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Ideal body weight (IBW) is a theoretical estimate of what a person should weigh based on their height, gender, and body frame. While no single number can define health, understanding your ideal weight range provides a useful reference point for setting realistic fitness goals and monitoring your overall health journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Hamwi Formula</h3>
            <p className="text-xs text-blue-700 font-medium mb-1">Developed: 1964</p>
            <p className="text-xs text-gray-600">Created by Dr. George J. Hamwi for quick clinical estimates. Widely used by dietitians for initial assessments.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">Devine Formula</h3>
            <p className="text-xs text-green-700 font-medium mb-1">Developed: 1974</p>
            <p className="text-xs text-gray-600">Originally created for medication dosing calculations. Still widely used in medical settings for drug administration.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Robinson Formula</h3>
            <p className="text-xs text-purple-700 font-medium mb-1">Developed: 1983</p>
            <p className="text-xs text-gray-600">A modification of the Devine formula, designed to be more accurate for general population estimates.</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2 text-sm">Miller Formula</h3>
            <p className="text-xs text-orange-700 font-medium mb-1">Developed: 1983</p>
            <p className="text-xs text-gray-600">The most recent and tends to give slightly higher estimates. Considered more lenient for modern populations.</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">The Science Behind Ideal Weight Formulas</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-3">All formulas use a base weight for someone 5 feet (60 inches) tall, then add a specific amount per inch above that baseline:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">For Men:</h4>
              <div className="space-y-1 text-xs">
                <p className="bg-white p-2 rounded border"><strong>Hamwi:</strong> 48 kg + 2.7 kg per inch over 5 ft</p>
                <p className="bg-white p-2 rounded border"><strong>Devine:</strong> 50 kg + 2.3 kg per inch over 5 ft</p>
                <p className="bg-white p-2 rounded border"><strong>Robinson:</strong> 52 kg + 1.9 kg per inch over 5 ft</p>
                <p className="bg-white p-2 rounded border"><strong>Miller:</strong> 56.2 kg + 1.41 kg per inch over 5 ft</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">For Women:</h4>
              <div className="space-y-1 text-xs">
                <p className="bg-white p-2 rounded border"><strong>Hamwi:</strong> 45.5 kg + 2.2 kg per inch over 5 ft</p>
                <p className="bg-white p-2 rounded border"><strong>Devine:</strong> 45.5 kg + 2.3 kg per inch over 5 ft</p>
                <p className="bg-white p-2 rounded border"><strong>Robinson:</strong> 49 kg + 1.7 kg per inch over 5 ft</p>
                <p className="bg-white p-2 rounded border"><strong>Miller:</strong> 53.1 kg + 1.36 kg per inch over 5 ft</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Understanding Body Frame Size</h3>
            <p className="text-sm text-gray-600 mb-3">
              Body frame size accounts for natural variation in bone structure, which affects ideal weight. Here&apos;s how to determine yours:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 text-sm">Wrist Measurement Method</h4>
                <p className="text-xs text-gray-600 mt-1">Wrap your thumb and middle finger around your wrist. If they overlap, you have a small frame. If they touch, medium. If they don&apos;t touch, large.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 text-sm">Wrist Circumference (Women)</h4>
                <p className="text-xs text-gray-600 mt-1">Small: &lt;6&quot; | Medium: 6-7&quot; | Large: &gt;7&quot;</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 text-sm">Wrist Circumference (Men)</h4>
                <p className="text-xs text-gray-600 mt-1">Small: &lt;6.5&quot; | Medium: 6.5-7.5&quot; | Large: &gt;7.5&quot;</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Limitations to Consider</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ideal weight formulas have several important limitations:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Don&apos;t account for muscle mass - athletes may exceed &quot;ideal&quot; weight while being very healthy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Based on older data that may not reflect modern populations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Don&apos;t consider age, ethnicity, or individual metabolic differences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Originally developed for specific medical purposes (drug dosing)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Health is better assessed through multiple metrics (body fat, waist circumference, blood markers)</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Reaching Your Ideal Weight</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Set Realistic Goals</h4>
            <p className="text-xs text-gray-600">Aim for 0.5-1 kg (1-2 lbs) per week for weight loss. Use the formula average as a long-term target, not an immediate goal. Focus on trends, not daily fluctuations.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Focus on Body Composition</h4>
            <p className="text-xs text-gray-600">The number on the scale matters less than your body fat percentage and muscle mass. Strength training while in a calorie deficit helps you reach a healthier body composition.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Consider All Health Metrics</h4>
            <p className="text-xs text-gray-600">Weight is just one indicator. Also track waist circumference, energy levels, sleep quality, and how your clothes fit. Blood pressure and blood sugar are also important health markers.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="ideal-weight-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides estimates based on statistical formulas and should not replace professional medical advice.
            Ideal weight varies significantly based on individual factors including muscle mass, bone density, and overall health.
            Consult a healthcare provider for personalized weight management guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
