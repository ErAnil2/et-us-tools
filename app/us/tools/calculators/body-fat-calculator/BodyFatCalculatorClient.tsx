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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

type HeightUnit = 'ft' | 'cm';
type WeightUnit = 'lbs' | 'kg';
type MeasureUnit = 'in' | 'cm';
type Method = 'navy' | 'bmi';

interface CategoryRange {
  label: string;
  maleMin: number;
  maleMax: number;
  femaleMin: number;
  femaleMax: number;
  color: string;
  bgColor: string;
}

const categories: CategoryRange[] = [
  { label: 'Essential Fat', maleMin: 2, maleMax: 5, femaleMin: 10, femaleMax: 13, color: 'text-red-700', bgColor: 'bg-red-100' },
  { label: 'Athletes', maleMin: 6, maleMax: 13, femaleMin: 14, femaleMax: 20, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { label: 'Fitness', maleMin: 14, maleMax: 17, femaleMin: 21, femaleMax: 24, color: 'text-green-700', bgColor: 'bg-green-100' },
  { label: 'Average', maleMin: 18, maleMax: 24, femaleMin: 25, femaleMax: 31, color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  { label: 'Obese', maleMin: 25, maleMax: 100, femaleMin: 32, femaleMax: 100, color: 'text-red-700', bgColor: 'bg-red-100' }
];

export default function BodyFatCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: { relatedCalculators?: RelatedCalculator[] }) {
  const { getH1, getSubHeading } = usePageSEO('body-fat-calculator');

  const [heightUnit, setHeightUnit] = useState<HeightUnit>('ft');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [measureUnit, setMeasureUnit] = useState<MeasureUnit>('in');
  const [method, setMethod] = useState<Method>('navy');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(30);

  // Height measurements
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [heightCm, setHeightCm] = useState(178);

  // Weight measurements
  const [weightLbs, setWeightLbs] = useState(170);
  const [weightKg, setWeightKg] = useState(77);

  // Body measurements (inches)
  const [waist, setWaist] = useState(32);
  const [neck, setNeck] = useState(15);
  const [hip, setHip] = useState(38);

  // Body measurements (cm)
  const [waistCm, setWaistCm] = useState(81);
  const [neckCm, setNeckCm] = useState(38);
  const [hipCm, setHipCm] = useState(97);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [results, setResults] = useState({
    bodyFat: 0,
    category: '',
    fatMass: 0,
    leanMass: 0,
    bmi: 0,
    idealBodyFat: { min: 0, max: 0 }
  });

  useEffect(() => {
    calculateBodyFat();
  }, [heightUnit, weightUnit, measureUnit, method, gender, age, weightLbs, weightKg, heightFeet, heightInches, heightCm, waist, neck, hip, waistCm, neckCm, hipCm]);

  const calculateBodyFat = () => {
    let heightInchesVal: number;
    let weightKgVal: number;
    let waistIn: number;
    let neckIn: number;
    let hipIn: number;
    let heightM: number;

    // Calculate height in inches based on selected unit
    if (heightUnit === 'ft') {
      heightInchesVal = heightFeet * 12 + heightInches;
      heightM = heightInchesVal * 0.0254;
    } else {
      heightInchesVal = heightCm / 2.54;
      heightM = heightCm / 100;
    }

    // Calculate weight in kg based on selected unit
    if (weightUnit === 'lbs') {
      weightKgVal = weightLbs * 0.453592;
    } else {
      weightKgVal = weightKg;
    }

    // Calculate body measurements in inches based on selected unit
    if (measureUnit === 'in') {
      waistIn = waist;
      neckIn = neck;
      hipIn = hip;
    } else {
      waistIn = waistCm / 2.54;
      neckIn = neckCm / 2.54;
      hipIn = hipCm / 2.54;
    }

    let bf = 0;

    if (method === 'navy') {
      // US Navy Method
      if (gender === 'male') {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waistIn - neckIn) + 0.15456 * Math.log10(heightInchesVal)) - 450;
      } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waistIn + hipIn - neckIn) + 0.22100 * Math.log10(heightInchesVal)) - 450;
      }
    } else {
      // BMI-based estimate
      const bmiVal = weightKgVal / (heightM * heightM);
      if (gender === 'male') {
        bf = (1.20 * bmiVal) + (0.23 * age) - 16.2;
      } else {
        bf = (1.20 * bmiVal) + (0.23 * age) - 5.4;
      }
    }

    bf = Math.max(2, Math.min(60, bf));

    // Calculate BMI
    const bmi = weightKgVal / (heightM * heightM);

    // Calculate fat and lean mass
    const fatMass = weightKgVal * (bf / 100);
    const leanMass = weightKgVal - fatMass;

    // Determine category
    let category = '';
    for (const cat of categories) {
      const min = gender === 'male' ? cat.maleMin : cat.femaleMin;
      const max = gender === 'male' ? cat.maleMax : cat.femaleMax;
      if (bf >= min && bf <= max) {
        category = cat.label;
        break;
      }
    }

    // Ideal body fat range (Fitness range)
    const idealMin = gender === 'male' ? 14 : 21;
    const idealMax = gender === 'male' ? 17 : 24;

    setResults({
      bodyFat: parseFloat(bf.toFixed(1)),
      category,
      fatMass: weightUnit === 'lbs' ? Math.round(fatMass * 2.20462) : Math.round(fatMass),
      leanMass: weightUnit === 'lbs' ? Math.round(leanMass * 2.20462) : Math.round(leanMass),
      bmi: parseFloat(bmi.toFixed(1)),
      idealBodyFat: { min: idealMin, max: idealMax }
    });
  };

  const getBodyFatPosition = () => {
    // Map body fat to gauge position (5-45% range)
    const minBF = 5;
    const maxBF = 45;
    const position = ((results.bodyFat - minBF) / (maxBF - minBF)) * 100;
    return Math.min(Math.max(position, 0), 100);
  };

  const getCategoryStyles = () => {
    const cat = categories.find(c => c.label === results.category);
    return cat ? `${cat.bgColor} ${cat.color}` : 'bg-gray-100 text-gray-700';
  };

  const weightLabel = weightUnit === 'lbs' ? 'lbs' : 'kg';
  const measureLabel = measureUnit === 'in' ? 'in' : 'cm';

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is body fat percentage and why does it matter?",
      answer: "Body fat percentage is the proportion of your total weight that is fat tissue. Unlike BMI, it distinguishes between fat and muscle mass. Men typically have 10-20% body fat for fitness, women 18-28%. Too low body fat impairs hormones and immunity; too high increases disease risk. It's a better health indicator than weight alone.",
    order: 1
  },
    {
    id: '2',
    question: "How accurate is the US Navy method?",
      answer: "The US Navy method is accurate to within 3-4% of DEXA scans for most people. It's most accurate for average body types. Athletes with very low body fat or individuals with unusual fat distribution may see larger errors. For tracking progress over time, consistency in measurements is more important than absolute accuracy.",
    order: 2
  },
    {
    id: '3',
    question: "How do I measure my waist, neck, and hip correctly?",
      answer: "Waist: Measure at the narrowest point, usually at the navel level. Relax your stomach, don't suck in. Neck: Measure just below the larynx (Adam's apple), keeping tape level. Hips (women only): Measure at the widest point of your buttocks. Keep the tape parallel to the floor for all measurements.",
    order: 3
  },
    {
    id: '4',
    question: "What's the ideal body fat percentage for me?",
      answer: "Ideal ranges depend on goals. Essential fat (minimum): 2-5% men, 10-13% women. Athletes: 6-13% men, 14-20% women. Fitness: 14-17% men, 21-24% women. Average healthy: 18-24% men, 25-31% women. For general health, aim for the 'Fitness' range. Going below essential fat is dangerous and unsustainable.",
    order: 4
  },
    {
    id: '5',
    question: "How can I reduce body fat percentage?",
      answer: "Create a moderate caloric deficit (300-500 cal/day), prioritize protein (0.7-1g per lb bodyweight) to preserve muscle, and strength train 3-4x weekly. Cardio helps but isn't essential. Sleep 7-9 hours and manage stress (cortisol promotes fat storage). Aim to lose 0.5-1% body fat per week. Rapid loss often means muscle loss.",
    order: 5
  }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Body Fat Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate your body fat percentage and body composition</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6">
        {/* Method Toggle */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMethod('navy')}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
                method === 'navy' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              US Navy Method
            </button>
            <button
              onClick={() => setMethod('bmi')}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
                method === 'bmi' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              BMI Estimate
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 sm:gap-5 md:gap-6">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Measurements</h3>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGender('male')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    gender === 'male'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">👨</span>
                  <span className="font-medium">Male</span>
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    gender === 'female'
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">👩</span>
                  <span className="font-medium">Female</span>
                </button>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age: {age} years</label>
              <input
                type="range"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                min="15"
                max="80"
                className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Height Input with Unit Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setHeightUnit('ft')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      heightUnit === 'ft' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Feet
                  </button>
                  <button
                    onClick={() => setHeightUnit('cm')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      heightUnit === 'cm' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
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
                      onChange={(e) => setHeightFeet(parseInt(e.target.value) || 0)}
                      min="4"
                      max="7"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(parseInt(e.target.value) || 0)}
                      min="0"
                      max="11"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">in</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                    min="120"
                    max="230"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">cm</span>
                </div>
              )}
            </div>

            {/* Weight Input with Unit Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setWeightUnit('kg')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      weightUnit === 'kg' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    onClick={() => setWeightUnit('lbs')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      weightUnit === 'lbs' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>

              <div className="relative">
                {weightUnit === 'kg' ? (
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    min="35"
                    max="180"
                    step="0.5"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                ) : (
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                    min="80"
                    max="400"
                    step="1"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{weightLabel}</span>
              </div>
            </div>

            {/* Navy Method Measurements */}
            {method === 'navy' && (
              <>
                {/* Body Measurements Header with Unit Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Body Measurements</span>
                  <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setMeasureUnit('in')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        measureUnit === 'in' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      inches
                    </button>
                    <button
                      onClick={() => setMeasureUnit('cm')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        measureUnit === 'cm' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      cm
                    </button>
                  </div>
                </div>

                {/* Waist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waist (at navel)
                    <span className="text-xs text-gray-500 ml-2">Measure relaxed, don't suck in</span>
                  </label>
                  <div className="relative">
                    {measureUnit === 'in' ? (
                      <input
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
                        min="20"
                        max="60"
                        step="0.5"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                    ) : (
                      <input
                        type="number"
                        value={waistCm}
                        onChange={(e) => setWaistCm(parseFloat(e.target.value) || 0)}
                        min="50"
                        max="150"
                        step="0.5"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                    )}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{measureLabel}</span>
                  </div>
                </div>

                {/* Neck */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Neck (below Adam's apple)
                  </label>
                  <div className="relative">
                    {measureUnit === 'in' ? (
                      <input
                        type="number"
                        value={neck}
                        onChange={(e) => setNeck(parseFloat(e.target.value) || 0)}
                        min="10"
                        max="25"
                        step="0.5"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                    ) : (
                      <input
                        type="number"
                        value={neckCm}
                        onChange={(e) => setNeckCm(parseFloat(e.target.value) || 0)}
                        min="25"
                        max="60"
                        step="0.5"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                    )}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{measureLabel}</span>
                  </div>
                </div>

                {/* Hip (women only) */}
                {gender === 'female' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hips (at widest point)
                    </label>
                    <div className="relative">
                      {measureUnit === 'in' ? (
                        <input
                          type="number"
                          value={hip}
                          onChange={(e) => setHip(parseFloat(e.target.value) || 0)}
                          min="25"
                          max="60"
                          step="0.5"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                        />
                      ) : (
                        <input
                          type="number"
                          value={hipCm}
                          onChange={(e) => setHipCm(parseFloat(e.target.value) || 0)}
                          min="60"
                          max="150"
                          step="0.5"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                        />
                      )}
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{measureLabel}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Results</h3>

            {/* Main Body Fat Display */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-3 sm:p-4 text-white">
              <div className="text-center">
                <div className="text-sm opacity-80 mb-1">Body Fat Percentage</div>
                <div className="text-lg sm:text-xl md:text-2xl md:text-4xl font-bold mb-1">{results.bodyFat}%</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getCategoryStyles()}`}>
                  {results.category}
                </div>
              </div>
            </div>

            {/* Body Fat Gauge */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Body Fat Scale ({gender === 'male' ? 'Male' : 'Female'})</div>
              <div className="relative h-4 rounded-full overflow-hidden mb-2">
                <div className="absolute inset-0 flex">
                  <div className="w-[10%] bg-red-300"></div>
                  <div className="w-[20%] bg-blue-400"></div>
                  <div className="w-[15%] bg-green-400"></div>
                  <div className="w-[25%] bg-yellow-400"></div>
                  <div className="w-[30%] bg-red-400"></div>
                </div>
                <div
                  className="absolute h-6 w-1 bg-gray-800 -top-1 shadow-lg transition-all duration-300"
                  style={{ left: `${getBodyFatPosition()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Essential</span>
                <span>Athletes</span>
                <span>Fitness</span>
                <span>Average</span>
                <span>Obese</span>
              </div>
            </div>

            {/* Body Composition */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">💪</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-700">{results.leanMass}</div>
                <div className="text-xs text-blue-600">{weightLabel}</div>
                <div className="text-sm text-blue-600 mt-1">Lean Mass</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-xl sm:text-2xl font-bold text-orange-700">{results.fatMass}</div>
                <div className="text-xs text-orange-600">{weightLabel}</div>
                <div className="text-sm text-orange-600 mt-1">Fat Mass</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white border rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">BMI</span>
                  <span className="font-semibold text-gray-800">{results.bmi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ideal Body Fat Range</span>
                  <span className="font-semibold text-green-600">{results.idealBodyFat.min}-{results.idealBodyFat.max}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fat to Lose for Ideal</span>
                  <span className={`font-semibold ${results.bodyFat > results.idealBodyFat.max ? 'text-red-600' : 'text-green-600'}`}>
                    {results.bodyFat > results.idealBodyFat.max
                      ? `${Math.round((results.bodyFat - results.idealBodyFat.max) / 100 * (weightUnit === 'lbs' ? weightLbs : weightKg))} ${weightLabel}`
                      : 'In range'}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Reference */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Body Fat Categories ({gender === 'male' ? 'Male' : 'Female'})</div>
              <div className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <div
                    key={cat.label}
                    className={`flex justify-between items-center p-2 rounded ${
                      results.category === cat.label ? cat.bgColor : ''
                    }`}
                  >
                    <span className={results.category === cat.label ? cat.color + ' font-medium' : 'text-gray-600'}>
                      {cat.label}
                    </span>
                    <span className="text-gray-500">
                      {gender === 'male'
                        ? `${cat.maleMin}-${cat.maleMax === 100 ? '+' : cat.maleMax}%`
                        : `${cat.femaleMin}-${cat.femaleMax === 100 ? '+' : cat.femaleMax}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {relatedCalculators.map((calc: any) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-3 sm:p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-2`}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Understanding Body Fat Percentage</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          Body fat percentage is one of the most accurate indicators of your overall health and fitness level. Unlike body weight alone, which doesn&apos;t distinguish between muscle and fat, body fat percentage tells you exactly what proportion of your body is composed of adipose tissue. This measurement is crucial for athletes tracking performance, individuals pursuing weight loss, and anyone interested in optimizing their health.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-3 border border-red-100 text-center">
            <h3 className="font-semibold text-red-800 mb-1 text-sm">Essential Fat</h3>
            <p className="text-xs text-red-700 font-medium">Men: 2-5%</p>
            <p className="text-xs text-red-700 font-medium">Women: 10-13%</p>
            <p className="text-xs text-gray-600 mt-1">Minimum for survival</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
            <h3 className="font-semibold text-blue-800 mb-1 text-sm">Athletes</h3>
            <p className="text-xs text-blue-700 font-medium">Men: 6-13%</p>
            <p className="text-xs text-blue-700 font-medium">Women: 14-20%</p>
            <p className="text-xs text-gray-600 mt-1">Competition level</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-center">
            <h3 className="font-semibold text-green-800 mb-1 text-sm">Fitness</h3>
            <p className="text-xs text-green-700 font-medium">Men: 14-17%</p>
            <p className="text-xs text-green-700 font-medium">Women: 21-24%</p>
            <p className="text-xs text-gray-600 mt-1">Optimal health</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100 text-center">
            <h3 className="font-semibold text-yellow-800 mb-1 text-sm">Average</h3>
            <p className="text-xs text-yellow-700 font-medium">Men: 18-24%</p>
            <p className="text-xs text-yellow-700 font-medium">Women: 25-31%</p>
            <p className="text-xs text-gray-600 mt-1">Acceptable range</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100 text-center">
            <h3 className="font-semibold text-orange-800 mb-1 text-sm">Obese</h3>
            <p className="text-xs text-orange-700 font-medium">Men: 25%+</p>
            <p className="text-xs text-orange-700 font-medium">Women: 32%+</p>
            <p className="text-xs text-gray-600 mt-1">Health risks increase</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">The US Navy Body Fat Method</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-3">Our calculator uses the US Navy circumference method, developed for military fitness assessments and validated against more expensive methods like DEXA scans. The formulas are:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">For Men:</h4>
              <p className="font-mono text-xs bg-white p-2 rounded border">%BF = 495 / (1.0324 - 0.19077 × log(waist - neck) + 0.15456 × log(height)) - 450</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">For Women:</h4>
              <p className="font-mono text-xs bg-white p-2 rounded border">%BF = 495 / (1.29579 - 0.35004 × log(waist + hip - neck) + 0.22100 × log(height)) - 450</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">This method is accurate to within 3-4% of laboratory methods for most body types.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Why Body Fat Matters More Than Weight</h3>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              Two people can weigh the same but have vastly different health profiles based on their body composition:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Muscle is denser than fat - muscular people may weigh more but be healthier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Visceral fat (around organs) poses greater health risks than subcutaneous fat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>High body fat increases risk of diabetes, heart disease, and metabolic syndrome</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Too low body fat can impair hormones, immunity, and athletic performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Body fat percentage better predicts health outcomes than BMI alone</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">How to Measure Accurately</h3>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              For the most accurate results with the US Navy method, follow these measurement guidelines:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                <span className="font-bold text-blue-600 text-sm">Waist:</span>
                <span className="text-xs text-gray-600">Measure at navel level while relaxed. Don&apos;t hold your breath or suck in.</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
                <span className="font-bold text-green-600 text-sm">Neck:</span>
                <span className="text-xs text-gray-600">Measure just below the Adam&apos;s apple (larynx). Keep tape level and snug.</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-pink-50 rounded">
                <span className="font-bold text-pink-600 text-sm">Hips:</span>
                <span className="text-xs text-gray-600">Women only - measure at the widest point of buttocks. Keep tape parallel to floor.</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Take measurements in the morning, at the same time each day for consistent tracking.</p>
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Strategies for Reducing Body Fat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-red-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Create a Calorie Deficit</h4>
            <p className="text-xs text-gray-600">Aim for 300-500 calories below maintenance. Larger deficits risk muscle loss. Track intake accurately using a food scale and app for best results.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Prioritize Strength Training</h4>
            <p className="text-xs text-gray-600">Lifting weights 3-4x weekly preserves muscle during fat loss, increases metabolism, and improves body composition even without weight change.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Eat Adequate Protein</h4>
            <p className="text-xs text-gray-600">Consume 0.7-1g protein per pound of body weight daily. Protein preserves muscle, increases satiety, and has the highest thermic effect of all macros.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="body-fat-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This calculator provides estimates using the US Navy method or BMI-based formula.
              For precise measurements, consider DEXA scans, hydrostatic weighing, or professional caliper testing.
              Results can vary based on measurement accuracy and individual body composition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
