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
  { href: '/us/tools/calculators/calorie-calculator', title: 'Calorie Calculator', description: 'Calculate daily calorie needs', color: 'bg-orange-500' },
  { href: '/us/tools/calculators/tdee-calculator', title: 'TDEE Calculator', description: 'Total daily energy expenditure', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/body-fat-calculator', title: 'Body Fat Calculator', description: 'Calculate body fat percentage', color: 'bg-green-500' },
  { href: '/us/tools/calculators/ideal-weight-calculator', title: 'Ideal Weight Calculator', description: 'Find your ideal body weight', color: 'bg-purple-500' },
];

type HeightUnit = 'ft' | 'cm';
type WeightUnit = 'lbs' | 'kg';
type Goal = 'lose' | 'maintain' | 'gain';
type Formula = 'mifflin' | 'harris' | 'katch';

const activityLevels = [
  { value: 1.2, label: 'Sedentary', description: 'Little or no exercise, desk job' },
  { value: 1.375, label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 1.55, label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 1.725, label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 1.9, label: 'Extra Active', description: 'Intense daily exercise or physical job' }
];

export default function BMRCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('bmr-calculator');

  const [heightUnit, setHeightUnit] = useState<HeightUnit>('ft');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [formula, setFormula] = useState<Formula>('mifflin');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(30);
  const [weightLbs, setWeightLbs] = useState(170);
  const [weightKg, setWeightKg] = useState(77);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(10);
  const [heightCm, setHeightCm] = useState(178);
  const [bodyFatPercent, setBodyFatPercent] = useState(20);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [goal, setGoal] = useState<Goal>('maintain');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [results, setResults] = useState({
    bmr: 0,
    tdee: 0,
    targetCalories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    weeklyChange: 0
  });

  useEffect(() => {
    calculateBMR();
  }, [heightUnit, weightUnit, formula, gender, age, weightLbs, weightKg, feet, inches, heightCm, bodyFatPercent, activityLevel, goal]);

  const calculateBMR = () => {
    let weightInKg: number;
    let heightInCm: number;

    // Calculate weight in kg based on selected unit
    if (weightUnit === 'lbs') {
      weightInKg = weightLbs * 0.453592;
    } else {
      weightInKg = weightKg;
    }

    // Calculate height in cm based on selected unit
    if (heightUnit === 'ft') {
      heightInCm = (feet * 12 + inches) * 2.54;
    } else {
      heightInCm = heightCm;
    }

    let bmr = 0;

    // Mifflin-St Jeor Equation (most accurate for most people)
    if (formula === 'mifflin') {
      if (gender === 'male') {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
      } else {
        bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
      }
    }
    // Harris-Benedict Equation (revised)
    else if (formula === 'harris') {
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
      }
    }
    // Katch-McArdle (uses lean body mass)
    else if (formula === 'katch') {
      const leanMass = weightInKg * (1 - bodyFatPercent / 100);
      bmr = 370 + (21.6 * leanMass);
    }

    const tdee = bmr * activityLevel;

    // Calculate target calories based on goal
    let targetCalories = tdee;
    let weeklyChange = 0;

    if (goal === 'lose') {
      targetCalories = tdee - 500; // 1 lb per week loss
      weeklyChange = -1;
    } else if (goal === 'gain') {
      targetCalories = tdee + 300; // Lean bulk
      weeklyChange = 0.5;
    }

    // Calculate macros (balanced approach)
    // Protein: 0.8-1g per lb bodyweight for active individuals
    const proteinGrams = Math.round(weightInKg * 2); // ~1g per lb
    const proteinCalories = proteinGrams * 4;

    // Fat: 25-30% of calories
    const fatCalories = targetCalories * 0.25;
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: remaining calories
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: proteinGrams,
      carbs: Math.max(0, carbGrams),
      fat: fatGrams,
      weeklyChange
    });
  };

  const weightLabel = weightUnit === 'lbs' ? 'lbs' : 'kg';

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is BMR and why is it important?",
      answer: "BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest to maintain vital functions like breathing, circulation, and cell production. It typically accounts for 60-75% of daily calorie expenditure. Understanding your BMR helps you set appropriate calorie goals for weight management, as eating below BMR for extended periods can slow metabolism and harm health.",
    order: 1
  },
    {
    id: '2',
    question: "What's the difference between BMR and TDEE?",
      answer: "BMR is calories burned at rest, while TDEE (Total Daily Energy Expenditure) includes all daily activities. TDEE = BMR × Activity Factor. For weight loss, you should create a deficit from TDEE, not BMR. A typical TDEE is 1.2-2x your BMR depending on activity level. TDEE is the number you should use for meal planning and calorie tracking.",
    order: 2
  },
    {
    id: '3',
    question: "Which BMR formula is most accurate?",
      answer: "The Mifflin-St Jeor equation is considered most accurate for most people and is recommended by the Academy of Nutrition and Dietetics. Harris-Benedict tends to overestimate by 5%. Katch-McArdle is most accurate if you know your body fat percentage, as it uses lean body mass. For athletes or very lean individuals, Katch-McArdle may give better results.",
    order: 3
  },
    {
    id: '4',
    question: "How many calories should I eat to lose weight?",
      answer: "A safe deficit is 500-750 calories below TDEE, resulting in 1-1.5 lbs loss per week. Never go below BMR long-term. For a 2000 TDEE, eating 1500 calories creates a 500-calorie deficit. Larger deficits can cause muscle loss and metabolic slowdown. Include strength training and adequate protein (0.7-1g per lb bodyweight) to preserve muscle during weight loss.",
    order: 4
  },
    {
    id: '5',
    question: "How do I calculate my macros?",
      answer: "Start with protein: 0.7-1g per pound of body weight (higher when cutting). Fat should be 20-35% of calories for hormonal health. Fill remaining calories with carbs. For a 2000 calorie diet at 170 lbs: ~170g protein (680 cal), ~55g fat (500 cal), ~205g carbs (820 cal). Adjust based on energy, performance, and results over 2-4 weeks.",
    order: 5
  }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('BMR Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate your Basal Metabolic Rate, TDEE, and daily macro targets</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6">
        {/* Formula Toggle */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFormula('mifflin')}
              className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                formula === 'mifflin' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              Mifflin-St Jeor
            </button>
            <button
              onClick={() => setFormula('harris')}
              className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                formula === 'harris' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              Harris-Benedict
            </button>
            <button
              onClick={() => setFormula('katch')}
              className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                formula === 'katch' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
              }`}
            >
              Katch-McArdle
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 sm:gap-5 md:gap-6">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Information</h3>

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
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15</span>
                <span>80</span>
              </div>
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
                      value={feet}
                      onChange={(e) => setFeet(parseInt(e.target.value) || 0)}
                      min="4"
                      max="7"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(parseInt(e.target.value) || 0)}
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

            {/* Body Fat (for Katch-McArdle) */}
            {formula === 'katch' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat: {bodyFatPercent}%</label>
                <input
                  type="range"
                  value={bodyFatPercent}
                  onChange={(e) => setBodyFatPercent(parseInt(e.target.value))}
                  min="5"
                  max="50"
                  className="w-full h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>
            )}

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
              <div className="space-y-2">
                {activityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setActivityLevel(level.value)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      activityLevel === level.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{level.label}</span>
                      <span className="text-xs text-gray-500">×{level.value}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setGoal('lose')}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    goal === 'lose'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg">📉</div>
                  <div className="text-xs font-medium">Lose</div>
                </button>
                <button
                  onClick={() => setGoal('maintain')}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    goal === 'maintain'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg">⚖️</div>
                  <div className="text-xs font-medium">Maintain</div>
                </button>
                <button
                  onClick={() => setGoal('gain')}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    goal === 'gain'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg">📈</div>
                  <div className="text-xs font-medium">Gain</div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Results</h3>

            {/* Main Results Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white text-center">
                <div className="text-xs opacity-80 mb-1">BMR</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold">{results.bmr.toLocaleString('en-US')}</div>
                <div className="text-xs opacity-80">cal/day</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                <div className="text-xs opacity-80 mb-1">TDEE</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold">{results.tdee.toLocaleString('en-US')}</div>
                <div className="text-xs opacity-80">cal/day</div>
              </div>
            </div>

            {/* Target Calories */}
            <div className={`rounded-xl p-4 text-center ${
              goal === 'lose' ? 'bg-red-50 border-2 border-red-200' :
              goal === 'gain' ? 'bg-blue-50 border-2 border-blue-200' :
              'bg-green-50 border-2 border-green-200'
            }`}>
              <div className="text-sm text-gray-600 mb-1">Daily Calorie Target</div>
              <div className={`text-3xl sm:text-4xl font-bold ${
                goal === 'lose' ? 'text-red-600' :
                goal === 'gain' ? 'text-blue-600' :
                'text-green-600'
              }`}>
                {results.targetCalories.toLocaleString('en-US')}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {goal === 'lose' ? `${results.tdee - results.targetCalories} cal deficit` :
                 goal === 'gain' ? `${results.targetCalories - results.tdee} cal surplus` :
                 'Maintenance calories'}
              </div>
              {results.weeklyChange !== 0 && (
                <div className="text-xs text-gray-500 mt-2">
                  Expected: {results.weeklyChange > 0 ? '+' : ''}{results.weeklyChange} lb/week
                </div>
              )}
            </div>

            {/* Macros */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Daily Macros</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg">🥩</div>
                  <div className="text-xl font-bold text-red-600">{results.protein}g</div>
                  <div className="text-xs text-gray-500">Protein</div>
                  <div className="text-xs text-gray-400">{results.protein * 4} cal</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg">🍞</div>
                  <div className="text-xl font-bold text-amber-600">{results.carbs}g</div>
                  <div className="text-xs text-gray-500">Carbs</div>
                  <div className="text-xs text-gray-400">{results.carbs * 4} cal</div>
                </div>
<div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg">🥑</div>
                  <div className="text-xl font-bold text-green-600">{results.fat}g</div>
                  <div className="text-xs text-gray-500">Fat</div>
                  <div className="text-xs text-gray-400">{results.fat * 9} cal</div>
                </div>
              </div>
              {/* Macro Bars */}
              <div className="mt-3">
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-red-400"
                    style={{ width: `${(results.protein * 4 / results.targetCalories) * 100}%` }}
                  ></div>
                  <div
                    className="bg-amber-400"
                    style={{ width: `${(results.carbs * 4 / results.targetCalories) * 100}%` }}
                  ></div>
                  <div
                    className="bg-green-400"
                    style={{ width: `${(results.fat * 9 / results.targetCalories) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Protein {Math.round((results.protein * 4 / results.targetCalories) * 100)}%</span>
                  <span>Carbs {Math.round((results.carbs * 4 / results.targetCalories) * 100)}%</span>
                  <span>Fat {Math.round((results.fat * 9 / results.targetCalories) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Calorie Breakdown */}
            <div className="bg-white border rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Calorie Needs by Goal</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded bg-red-50">
                  <span className="text-gray-700">Weight Loss (-1 lb/wk)</span>
                  <span className="font-semibold text-red-600">{(results.tdee - 500).toLocaleString('en-US')} cal</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-green-50">
                  <span className="text-gray-700">Maintain Weight</span>
                  <span className="font-semibold text-green-600">{results.tdee.toLocaleString('en-US')} cal</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-blue-50">
                  <span className="text-gray-700">Lean Bulk (+0.5 lb/wk)</span>
                  <span className="font-semibold text-blue-600">{(results.tdee + 300).toLocaleString('en-US')} cal</span>
                </div>
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
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-2`}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Understanding Basal Metabolic Rate (BMR)</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          Basal Metabolic Rate (BMR) represents the number of calories your body burns at complete rest to maintain vital functions such as breathing, blood circulation, cell production, and brain activity. Understanding your BMR is the foundation of any effective nutrition or fitness plan, as it accounts for 60-75% of your total daily calorie expenditure.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">BMR (60-75%)</h3>
            <p className="text-xs text-gray-600">Calories burned at complete rest for breathing, circulation, cell repair, and organ function. This is your body&apos;s baseline energy need.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">TEF (10%)</h3>
            <p className="text-xs text-gray-600">Thermic Effect of Food - calories burned digesting and processing food. Protein has the highest TEF at 20-30% of calories consumed.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Activity (15-30%)</h3>
            <p className="text-xs text-gray-600">Calories burned through exercise and daily movement (NEAT). This is the most variable component and the easiest to increase.</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">BMR Calculation Methods Compared</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Mifflin-St Jeor (Recommended)</h4>
              <p className="font-mono text-xs bg-white p-2 rounded border mb-1">Men: BMR = (10 × weight kg) + (6.25 × height cm) - (5 × age) + 5</p>
              <p className="font-mono text-xs bg-white p-2 rounded border">Women: BMR = (10 × weight kg) + (6.25 × height cm) - (5 × age) - 161</p>
              <p className="text-xs text-gray-500 mt-1">Most accurate for modern populations. Recommended by the Academy of Nutrition and Dietetics.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Katch-McArdle (For Athletes)</h4>
              <p className="font-mono text-xs bg-white p-2 rounded border">BMR = 370 + (21.6 × lean body mass in kg)</p>
              <p className="text-xs text-gray-500 mt-1">Most accurate if you know your body fat percentage. Best for athletes and very lean individuals.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Factors That Affect Your BMR</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Muscle Mass:</strong> More muscle = higher BMR. Each pound of muscle burns ~6 calories/day at rest vs. 2 for fat.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Age:</strong> BMR decreases ~2% per decade after 20, mainly due to muscle loss. Strength training can slow this.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Gender:</strong> Men typically have 5-10% higher BMR due to greater muscle mass and testosterone.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Genetics:</strong> Natural variation in thyroid function and metabolic efficiency can affect BMR by 10-15%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Dieting History:</strong> Prolonged calorie restriction can lower BMR through metabolic adaptation.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Activity Level Multipliers</h3>
            <p className="text-sm text-gray-600 mb-3">Multiply your BMR by these factors to get TDEE:</p>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-100 rounded text-sm">
                <span className="text-gray-700">Sedentary (desk job, no exercise)</span>
                <span className="font-medium">BMR × 1.2</span>
              </div>
              <div className="flex justify-between p-2 bg-blue-50 rounded text-sm">
                <span className="text-gray-700">Light activity (1-3 days/week)</span>
                <span className="font-medium">BMR × 1.375</span>
              </div>
              <div className="flex justify-between p-2 bg-green-50 rounded text-sm">
                <span className="text-gray-700">Moderate activity (3-5 days/week)</span>
                <span className="font-medium">BMR × 1.55</span>
              </div>
              <div className="flex justify-between p-2 bg-yellow-50 rounded text-sm">
                <span className="text-gray-700">Very active (6-7 days/week)</span>
                <span className="font-medium">BMR × 1.725</span>
              </div>
              <div className="flex justify-between p-2 bg-orange-50 rounded text-sm">
                <span className="text-gray-700">Extremely active (athlete/physical job)</span>
                <span className="font-medium">BMR × 1.9</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">How to Increase Your BMR</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-red-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Build Muscle Mass</h4>
            <p className="text-xs text-gray-600">Strength train 3-4x weekly with progressive overload. Each pound of muscle added increases daily calorie burn by about 6 calories at rest, plus more during activity.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Avoid Crash Diets</h4>
            <p className="text-xs text-gray-600">Severe calorie restriction (under BMR) triggers metabolic adaptation, lowering your BMR. Keep deficits moderate (500 cal/day max) and include diet breaks.</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-teal-800 mb-2 text-sm">Prioritize Sleep &amp; Recovery</h4>
            <p className="text-xs text-gray-600">Poor sleep and chronic stress raise cortisol, which can lower BMR and promote fat storage. Aim for 7-9 hours of quality sleep nightly.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="bmr-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              These calculations provide estimates based on population averages. Individual metabolism varies
              based on genetics, hormones, and other factors. Adjust calories based on actual results over 2-4 weeks.
              Consult a healthcare provider or registered dietitian for personalized nutrition advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
