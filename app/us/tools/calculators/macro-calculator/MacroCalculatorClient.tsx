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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type HeightUnit = 'ft' | 'cm';
type WeightUnit = 'kg' | 'lbs';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
type Goal = 'lose' | 'maintain' | 'gain';
type DietType = 'balanced' | 'lowCarb' | 'highProtein' | 'keto';

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9
};

const activityInfo: Record<ActivityLevel, { label: string; emoji: string; description: string }> = {
  sedentary: { label: 'Sedentary', emoji: '🪑', description: 'Little or no exercise' },
  light: { label: 'Light', emoji: '🚶', description: '1-3 days/week' },
  moderate: { label: 'Moderate', emoji: '🏃', description: '3-5 days/week' },
  active: { label: 'Active', emoji: '💪', description: '6-7 days/week' },
  veryActive: { label: 'Very Active', emoji: '🔥', description: 'Intense + physical job' }
};

const goalInfo: Record<Goal, { label: string; emoji: string; adjustment: number; description: string }> = {
  lose: { label: 'Lose Weight', emoji: '📉', adjustment: -500, description: '-500 cal/day' },
  maintain: { label: 'Maintain', emoji: '⚖️', adjustment: 0, description: 'Stay same' },
  gain: { label: 'Gain Weight', emoji: '📈', adjustment: 500, description: '+500 cal/day' }
};

const dietInfo: Record<DietType, { label: string; protein: number; carbs: number; fats: number; description: string }> = {
  balanced: { label: 'Balanced', protein: 30, carbs: 40, fats: 30, description: '30% Protein, 40% Carbs, 30% Fat' },
  lowCarb: { label: 'Low Carb', protein: 35, carbs: 25, fats: 40, description: '35% Protein, 25% Carbs, 40% Fat' },
  highProtein: { label: 'High Protein', protein: 40, carbs: 35, fats: 25, description: '40% Protein, 35% Carbs, 25% Fat' },
  keto: { label: 'Keto', protein: 25, carbs: 5, fats: 70, description: '25% Protein, 5% Carbs, 70% Fat' }
};

export default function MacroCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('macro-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [weightKg, setWeightKg] = useState(70);
  const [weightLbs, setWeightLbs] = useState(154);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('ft');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(7);
  const [heightCm, setHeightCm] = useState(170);
  const [age, setAge] = useState(30);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [dietType, setDietType] = useState<DietType>('balanced');

  const [results, setResults] = useState({
    bmr: 0,
    tdee: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  useEffect(() => {
    calculateMacros();
  }, [gender, weightUnit, weightKg, weightLbs, heightUnit, heightFeet, heightInches, heightCm, age, activity, goal, dietType]);

  const calculateMacros = () => {
    const weight = weightUnit === 'lbs' ? weightLbs / 2.20462 : weightKg;
    const height = heightUnit === 'ft' ? (heightFeet * 12 + heightInches) * 2.54 : heightCm;

    // Mifflin-St Jeor Equation
    const bmr = gender === 'male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const tdee = bmr * activityMultipliers[activity];
    const targetCals = tdee + goalInfo[goal].adjustment;

    // Calculate macros based on diet type percentages
    const proteinCals = (targetCals * dietInfo[dietType].protein) / 100;
    const carbsCals = (targetCals * dietInfo[dietType].carbs) / 100;
    const fatsCals = (targetCals * dietInfo[dietType].fats) / 100;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(targetCals),
      protein: Math.round(proteinCals / 4), // 4 cal per gram
      carbs: Math.round(carbsCals / 4), // 4 cal per gram
      fats: Math.round(fatsCals / 9) // 9 cal per gram
    });
  };

  const fallbackFaqs = [
    {
    id: '1',
    question: "What are macros and why do they matter?",
      answer: "Macros (macronutrients) are protein, carbohydrates, and fats - the three main nutrients that provide energy. Each plays a unique role: protein builds muscle and repairs tissue, carbs provide energy, and fats support hormones and nutrient absorption. Tracking macros helps optimize body composition and performance.",
    order: 1
  },
    {
    id: '2',
    question: "How much protein do I really need?",
      answer: "For most active people, 0.7-1g per pound of body weight is ideal. Athletes and those building muscle may need 1-1.2g/lb. Sedentary individuals can manage with 0.5-0.7g/lb. Higher protein helps preserve muscle during weight loss and supports recovery.",
    order: 2
  },
    {
    id: '3',
    question: "Which diet type should I choose?",
      answer: "Balanced (30/40/30) works for most people and is sustainable long-term. Low Carb helps with fat loss and blood sugar control. High Protein is ideal for athletes and muscle building. Keto is very low carb for specific goals - consult a professional before trying it.",
    order: 3
  },
    {
    id: '4',
    question: "Should I hit my macros exactly every day?",
      answer: "Aim to be within 5-10g of each macro target. Consistency over time matters more than perfection. Prioritize protein intake, as it's hardest to overconsume, then balance carbs and fats. Weekly averages are more important than daily precision.",
    order: 4
  },
    {
    id: '5',
    question: "How do I track my macros?",
      answer: "Use a food tracking app like MyFitnessPal, Cronometer, or Lose It. Weigh your food with a kitchen scale for accuracy. Start by tracking for 1-2 weeks to understand your eating patterns, then adjust based on your results and goals.",
    order: 5
  }
  ];

  const mealPlan = {
    protein: [
      { food: 'Chicken breast (4 oz)', amount: 26 },
      { food: 'Eggs (2 large)', amount: 12 },
      { food: 'Greek yogurt (1 cup)', amount: 17 },
      { food: 'Salmon (4 oz)', amount: 23 },
    ],
    carbs: [
      { food: 'Brown rice (1 cup)', amount: 45 },
      { food: 'Oatmeal (1 cup)', amount: 27 },
      { food: 'Sweet potato (1 medium)', amount: 26 },
      { food: 'Banana (1 medium)', amount: 27 },
    ],
    fats: [
      { food: 'Avocado (1/2)', amount: 15 },
      { food: 'Almonds (1 oz)', amount: 14 },
      { food: 'Olive oil (1 tbsp)', amount: 14 },
      { food: 'Peanut butter (2 tbsp)', amount: 16 },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Macro Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your personalized daily macronutrients for protein, carbs, and fats
            based on your body stats, activity level, and goals.
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

              {/* Weight Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Weight</label>
                  <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setWeightUnit('lbs')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        weightUnit === 'lbs' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      lbs
                    </button>
                    <button
                      onClick={() => setWeightUnit('kg')}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        weightUnit === 'kg' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      kg
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={weightUnit === 'lbs' ? weightLbs : weightKg}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (weightUnit === 'lbs') {
                        setWeightLbs(val);
                      } else {
                        setWeightKg(val);
                      }
                    }}
                    min={weightUnit === 'lbs' ? 60 : 30}
                    max={weightUnit === 'lbs' ? 450 : 200}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    {weightUnit}
                  </span>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Level</label>
                <div className="grid grid-cols-5 gap-1">
                  {(Object.keys(activityInfo) as ActivityLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setActivity(level)}
                      className={`p-2 rounded-lg border-2 transition-all text-center ${
                        activity === level
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg">{activityInfo[level].emoji}</div>
                      <div className="text-[10px] font-medium text-gray-700 truncate">{activityInfo[level].label}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {activityInfo[activity].description}
                </p>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Your Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(goalInfo) as Goal[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        goal === g
                          ? g === 'lose' ? 'border-red-500 bg-red-50' :
                            g === 'maintain' ? 'border-blue-500 bg-blue-50' :
                            'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{goalInfo[g].emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{goalInfo[g].label}</div>
                      <div className="text-[10px] text-gray-500">{goalInfo[g].description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {/* Calorie Result Card */}
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-3 sm:p-4 md:p-6 text-white">
                <div className="text-center">
                  <p className="text-purple-100 text-sm font-medium mb-1">Daily Calorie Target</p>
                  <div className="text-5xl font-bold mb-2">{results.calories.toLocaleString()}</div>
                  <p className="text-purple-100 text-sm">calories per day</p>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-400/30 grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-purple-200 text-xs">BMR</p>
                    <p className="font-semibold">{results.bmr} cal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-200 text-xs">TDEE</p>
                    <p className="font-semibold">{results.tdee} cal</p>
                  </div>
                </div>
              </div>

              {/* Macro Cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* Protein */}
                <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.protein}g</div>
                  <div className="text-red-100 text-xs font-medium mt-1">Protein</div>
                  <div className="text-red-200 text-[10px] mt-1">{Math.round(results.protein * 4)} cal</div>
                </div>

                {/* Carbs */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.carbs}g</div>
                  <div className="text-amber-100 text-xs font-medium mt-1">Carbs</div>
                  <div className="text-amber-200 text-[10px] mt-1">{Math.round(results.carbs * 4)} cal</div>
                </div>

                {/* Fats */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.fats}g</div>
                  <div className="text-blue-100 text-xs font-medium mt-1">Fats</div>
                  <div className="text-blue-200 text-[10px] mt-1">{Math.round(results.fats * 9)} cal</div>
                </div>
              </div>

              {/* Diet Type Selection */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Diet Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(dietInfo) as DietType[]).map((diet) => (
                    <button
                      key={diet}
                      onClick={() => setDietType(diet)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        dietType === diet
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-800">{dietInfo[diet].label}</div>
                      <div className="text-[10px] text-gray-500">{dietInfo[diet].description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Macro Distribution Visual */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Macro Distribution</h4>
                <div className="h-6 rounded-full overflow-hidden flex">
                  <div
                    className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${dietInfo[dietType].protein}%` }}
                  >
                    {dietInfo[dietType].protein}%
                  </div>
                  <div
                    className="bg-amber-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${dietInfo[dietType].carbs}%` }}
                  >
                    {dietInfo[dietType].carbs}%
                  </div>
                  <div
                    className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${dietInfo[dietType].fats}%` }}
                  >
                    {dietInfo[dietType].fats}%
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-red-600">Protein</span>
                  <span className="text-amber-600">Carbs</span>
                  <span className="text-blue-600">Fats</span>
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
                <div className={`w-10 h-10 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
        <h2 className="text-xl font-bold text-gray-800 mb-4">Understanding Macronutrients</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Macronutrients - protein, carbohydrates, and fats - are the three essential nutrients that provide energy and serve critical functions in your body. Understanding and tracking your macros allows for more precise control over body composition, energy levels, and athletic performance compared to simply counting calories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <span className="text-xl">🥩</span> Protein
            </h3>
            <p className="text-xs text-red-700 font-medium mb-2">4 calories per gram</p>
            <p className="text-xs text-gray-600">Essential for muscle building, repair, and maintenance. Also supports immune function, hormone production, and keeps you feeling full longer. Higher protein diets help preserve muscle during weight loss.</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <span className="text-xl">🍞</span> Carbohydrates
            </h3>
            <p className="text-xs text-amber-700 font-medium mb-2">4 calories per gram</p>
            <p className="text-xs text-gray-600">Your body&apos;s preferred energy source, especially for brain function and high-intensity exercise. Choose complex carbs (whole grains, vegetables) over simple sugars for sustained energy.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <span className="text-xl">🥑</span> Fats
            </h3>
            <p className="text-xs text-blue-700 font-medium mb-2">9 calories per gram</p>
            <p className="text-xs text-gray-600">Critical for hormone production, vitamin absorption (A, D, E, K), brain health, and cell membrane integrity. Focus on unsaturated fats from nuts, fish, and olive oil.</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Diet Types Explained</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-800 text-sm mb-1">Balanced (30/40/30)</h4>
              <p className="text-xs text-gray-600">The most versatile and sustainable approach. Works well for general health, moderate exercise, and long-term maintenance. Good for beginners.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-800 text-sm mb-1">Low Carb (35/25/40)</h4>
              <p className="text-xs text-gray-600">Helps with fat loss and blood sugar control. May reduce hunger and cravings. Good for sedentary individuals or those with insulin resistance.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-800 text-sm mb-1">High Protein (40/35/25)</h4>
              <p className="text-xs text-gray-600">Ideal for muscle building and athletic performance. Higher protein preserves muscle during cutting and supports recovery from intense training.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-800 text-sm mb-1">Keto (25/5/70)</h4>
              <p className="text-xs text-gray-600">Very low carb puts body into ketosis. Can be effective for specific goals but challenging to maintain. Consult a professional before starting.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Hit Your Macros</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">1.</span>
                <span><strong>Prioritize protein</strong> - It&apos;s hardest to overconsume and most important for body composition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">2.</span>
                <span><strong>Plan meals around protein sources</strong> - Chicken, fish, eggs, legumes, dairy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">3.</span>
                <span><strong>Add carbs based on activity</strong> - More on training days, less on rest days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">4.</span>
                <span><strong>Fill in fats last</strong> - They&apos;re calorie-dense, so a little goes a long way</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">5.</span>
                <span><strong>Use a food scale</strong> - Eyeballing portions leads to 20-50% errors</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">High-Protein Food Sources</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span className="text-gray-700">Chicken breast (4 oz)</span>
                <span className="font-medium text-red-600">26g protein</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span className="text-gray-700">Greek yogurt (1 cup)</span>
                <span className="font-medium text-red-600">17g protein</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span className="text-gray-700">Salmon (4 oz)</span>
                <span className="font-medium text-red-600">23g protein</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span className="text-gray-700">Eggs (2 large)</span>
                <span className="font-medium text-red-600">12g protein</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span className="text-gray-700">Cottage cheese (1 cup)</span>
                <span className="font-medium text-red-600">28g protein</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Macro Tracking Success</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Start Simple</h4>
            <p className="text-xs text-gray-600">Track just protein for the first week. Once that becomes habit, add carbs and fats. Trying to be perfect from day one leads to burnout.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Prep in Advance</h4>
            <p className="text-xs text-gray-600">Meal prep makes hitting macros much easier. Cook protein sources in bulk, prepare vegetables, and portion out meals for the week ahead.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Allow Flexibility</h4>
            <p className="text-xs text-gray-600">Aim for within 5-10g of each target. Weekly averages matter more than daily perfection. The 80/20 rule applies - consistency beats perfection.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="macro-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides estimates based on standard formulas and should be used as a starting point.
            Individual needs vary based on metabolism, body composition, and health conditions.
            Consult a registered dietitian or healthcare provider for personalized nutrition advice.
          </p>
        </div>
      </div>
    </div>
  );
}
