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
type WeightUnit = 'lbs' | 'kg';
type Goal = 'lose' | 'maintain' | 'gain';

const activityLevels = [
  { value: 1.2, label: 'Sedentary', description: 'Little or no exercise, desk job' },
  { value: 1.375, label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 1.55, label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 1.725, label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 1.9, label: 'Extra Active', description: 'Intense daily exercise or physical job' }
];

export default function CalorieCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('calorie-calculator');

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(30);

  // Height state
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('ft');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [heightCm, setHeightCm] = useState(178);

  // Weight state
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [weightLbs, setWeightLbs] = useState(170);
  const [weightKg, setWeightKg] = useState(77);

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
    calculateCalories();
  }, [gender, age, heightUnit, heightFeet, heightInches, heightCm, weightUnit, weightLbs, weightKg, activityLevel, goal]);

  const calculateCalories = () => {
    // Calculate weight in kg
    const weightInKg = weightUnit === 'lbs' ? weightLbs * 0.453592 : weightKg;

    // Calculate height in cm
    const heightInCm = heightUnit === 'ft' ? (heightFeet * 12 + heightInches) * 2.54 : heightCm;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }

    const tdee = bmr * activityLevel;

    // Calculate target calories based on goal
    let targetCalories = tdee;
    let weeklyChange = 0;

    if (goal === 'lose') {
      targetCalories = tdee - 500;
      weeklyChange = -1;
    } else if (goal === 'gain') {
      targetCalories = tdee + 500;
      weeklyChange = 1;
    }

    // Calculate macros
    const proteinGrams = Math.round(weightInKg * 2);
    const proteinCalories = proteinGrams * 4;
    const fatCalories = targetCalories * 0.25;
    const fatGrams = Math.round(fatCalories / 9);
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
    question: "How many calories should I eat per day?",
      answer: "Your daily calorie needs depend on your age, gender, height, weight, and activity level. Most adults need between 1,600-3,000 calories daily. Use this calculator to find your personalized TDEE (Total Daily Energy Expenditure), then adjust based on your goals: subtract 500 calories for weight loss (~1 lb/week) or add 300-500 for muscle gain.",
    order: 1
  },
    {
    id: '2',
    question: "What's the difference between BMR and TDEE?",
      answer: "BMR (Basal Metabolic Rate) is the calories your body burns at complete rest for basic functions like breathing and circulation. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by your activity factor, representing total daily calories burned. Use TDEE, not BMR, for meal planning and calorie tracking.",
    order: 2
  },
    {
    id: '3',
    question: "How accurate is this calorie calculator?",
      answer: "This calculator uses the Mifflin-St Jeor equation, considered the most accurate formula for most people by the Academy of Nutrition and Dietetics. However, individual metabolism can vary by 10-15%. Track your weight for 2-4 weeks and adjust calories based on actual results.",
    order: 3
  },
    {
    id: '4',
    question: "How fast should I lose weight?",
      answer: "A safe and sustainable rate is 0.5-2 lbs (0.25-1 kg) per week. This requires a daily deficit of 250-1000 calories. Faster weight loss often leads to muscle loss, nutrient deficiencies, and metabolic adaptation. For best results, combine a moderate calorie deficit with strength training and adequate protein.",
    order: 4
  },
    {
    id: '5',
    question: "Should I eat back exercise calories?",
      answer: "It depends on your goals and activity level. If your activity level already accounts for regular exercise, you don't need to eat back calories. However, for intense workouts or if you're very active, eating back 50-75% of exercise calories can prevent fatigue and muscle loss. Listen to your body and adjust based on energy levels and progress.",
    order: 5
  }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Calorie Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate your daily calorie needs, TDEE, and personalized macro targets</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
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
                min="15"
                max="80"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
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
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold">{results.bmr.toLocaleString('en-US')}</div>
                <div className="text-xs opacity-80">cal/day</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                <div className="text-xs opacity-80 mb-1">TDEE</div>
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold">{results.tdee.toLocaleString('en-US')}</div>
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
                  <span className="text-gray-700">Weight Gain (+1 lb/wk)</span>
                  <span className="font-semibold text-blue-600">{(results.tdee + 500).toLocaleString('en-US')} cal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {relatedCalculators.map((calc: RelatedCalculator) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-3 sm:p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color || 'bg-blue-500'} rounded-lg flex items-center justify-center mb-2`}>
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
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Understanding Calories and Energy Balance</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          Calories are units of energy that fuel every function in your body, from breathing and circulation to physical activity and brain function. Understanding how calories work is fundamental to achieving your health and fitness goals, whether you want to lose weight, build muscle, or simply maintain your current physique.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">BMR (Basal Metabolic Rate)</h3>
            <p className="text-xs text-gray-600">The calories your body burns at complete rest to maintain vital functions like breathing, circulation, and cell production. Typically 60-75% of daily calories.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">TDEE (Total Daily Energy)</h3>
            <p className="text-xs text-gray-600">Your total daily calorie burn including all activities. This is BMR multiplied by an activity factor and represents the calories needed to maintain current weight.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Energy Balance</h3>
            <p className="text-xs text-gray-600">The relationship between calories consumed and burned. A deficit leads to weight loss, surplus to weight gain, and balance maintains current weight.</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">The Mifflin-St Jeor Equation</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-3">Our calculator uses the Mifflin-St Jeor equation, considered the most accurate formula for estimating calorie needs by the Academy of Nutrition and Dietetics:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">For Men:</h4>
              <p className="font-mono text-xs sm:text-sm bg-white p-2 rounded border">BMR = (10 × weight kg) + (6.25 × height cm) - (5 × age) + 5</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">For Women:</h4>
              <p className="font-mono text-xs sm:text-sm bg-white p-2 rounded border">BMR = (10 × weight kg) + (6.25 × height cm) - (5 × age) - 161</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Calorie Goals by Objective</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <span className="text-red-500 text-lg">📉</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Weight Loss</h4>
                  <p className="text-xs text-gray-600">Eat 500-750 calories below TDEE for 1-1.5 lbs loss per week. Never go below 1200 calories (women) or 1500 calories (men) without medical supervision.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 text-lg">⚖️</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Maintenance</h4>
                  <p className="text-xs text-gray-600">Eat at your TDEE to maintain current weight. Ideal for those happy with their body composition or during diet breaks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-500 text-lg">📈</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Muscle Gain</h4>
                  <p className="text-xs text-gray-600">Eat 300-500 calories above TDEE combined with strength training. A moderate surplus minimizes fat gain while maximizing muscle growth.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Understanding Macronutrients</h3>
            <p className="text-sm text-gray-600 mb-3">Calories come from three macronutrients, each serving essential functions:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-red-50 rounded">
                <span className="font-bold text-red-600 w-20 text-sm">Protein</span>
                <span className="text-xs text-gray-600 flex-1">4 cal/g - Essential for muscle repair, immune function, and satiety. Aim for 0.7-1g per pound of body weight.</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-amber-50 rounded">
                <span className="font-bold text-amber-600 w-20 text-sm">Carbs</span>
                <span className="text-xs text-gray-600 flex-1">4 cal/g - Primary energy source, especially for brain and high-intensity exercise. Choose complex carbs over refined.</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <span className="font-bold text-green-600 w-20 text-sm">Fat</span>
                <span className="text-xs text-gray-600 flex-1">9 cal/g - Essential for hormone production, vitamin absorption, and cell health. Keep at 20-35% of calories.</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Tips for Successful Calorie Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Track Accurately</h4>
            <p className="text-xs text-gray-600">Use a food scale and tracking app for the first few weeks. Studies show people underestimate intake by 30-50% when estimating portions.</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Prioritize Protein</h4>
            <p className="text-xs text-gray-600">Protein increases satiety, preserves muscle during weight loss, and has the highest thermic effect (burns more calories to digest).</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-teal-800 mb-2 text-sm">Adjust Based on Results</h4>
            <p className="text-xs text-gray-600">Track weight weekly and adjust calories every 2-4 weeks. If not losing, reduce by 100-200 calories. Plateaus are normal and require patience.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="calorie-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This calculator provides estimates based on the Mifflin-St Jeor equation, which is considered the most accurate for most adults.
              Individual calorie needs may vary by 10-15% based on metabolism, body composition, genetics, and health conditions.
              Track your progress for 2-4 weeks and adjust accordingly. Consult a healthcare provider or registered dietitian for personalized nutrition advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
