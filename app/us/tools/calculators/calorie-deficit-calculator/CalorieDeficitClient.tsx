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
type WeightUnit = 'kg' | 'lbs';

const activityLevels = [
  { value: 1.2, label: 'Sedentary', description: 'Little or no exercise, desk job' },
  { value: 1.375, label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 1.55, label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 1.725, label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 1.9, label: 'Extra Active', description: 'Intense daily exercise or physical job' }
];

const deficitLevels = [
  { value: 250, label: 'Slow', description: '0.25 kg/week', color: 'green', emoji: '🐢' },
  { value: 500, label: 'Moderate', description: '0.5 kg/week', color: 'yellow', emoji: '🚶' },
  { value: 750, label: 'Fast', description: '0.75 kg/week', color: 'orange', emoji: '🏃' },
  { value: 1000, label: 'Aggressive', description: '1 kg/week', color: 'red', emoji: '🔥' },
];

export default function CalorieDeficitClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('calorie-deficit-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);

  // Height state
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('ft');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [heightCm, setHeightCm] = useState(178);

  // Weight state
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [weightKg, setWeightKg] = useState(80);
  const [weightLbs, setWeightLbs] = useState(176);

  const [activityLevel, setActivityLevel] = useState(1.55);
  const [deficitAmount, setDeficitAmount] = useState(500);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [results, setResults] = useState({
    bmr: 0,
    tdee: 0,
    targetCalories: 0,
    dailyDeficit: 0,
    weeklyDeficit: 0,
    weeksToLose5kg: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    calculateCalorieDeficit();
  }, [gender, age, heightUnit, heightFeet, heightInches, heightCm, weightUnit, weightKg, weightLbs, activityLevel, deficitAmount]);

  const calculateCalorieDeficit = () => {
    // Calculate weight in kg
    const weight = weightUnit === 'lbs' ? weightLbs * 0.453592 : weightKg;

    // Calculate height in cm
    const height = heightUnit === 'ft' ? (heightFeet * 12 + heightInches) * 2.54 : heightCm;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate TDEE
    const tdee = bmr * activityLevel;

    // Calculate target calories with safety minimum
    const minCalories = gender === 'male' ? 1500 : 1200;
    const targetCalories = Math.max(tdee - deficitAmount, minCalories);
    const actualDeficit = tdee - targetCalories;
    const weeklyDeficit = actualDeficit * 7;

    // Calculate time to lose 5kg (7700 cal per kg)
    const weeksToLose5kg = weeklyDeficit > 0 ? Math.round((5 * 7700) / weeklyDeficit) : 0;

    // Calculate macros (higher protein for weight loss)
    const proteinGrams = Math.round(weight * 2.2); // 2.2g per kg for weight loss
    const proteinCalories = proteinGrams * 4;
    const fatCalories = targetCalories * 0.25;
    const fatGrams = Math.round(fatCalories / 9);
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(Math.max(0, carbCalories) / 4);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      dailyDeficit: Math.round(actualDeficit),
      weeklyDeficit: Math.round(weeklyDeficit),
      weeksToLose5kg,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams
    });
  };

  const weightLabel = weightUnit === 'lbs' ? 'lbs' : 'kg';

  const getDeficitStatus = () => {
    const minCalories = gender === 'male' ? 1500 : 1200;
    if (results.targetCalories <= minCalories) {
      return { type: 'warning', message: `At minimum safe level (${minCalories} cal). Increase activity instead of reducing calories.` };
    } else if (results.dailyDeficit > 1000) {
      return { type: 'danger', message: 'Very aggressive deficit. Risk of muscle loss and metabolic slowdown.' };
    } else if (results.dailyDeficit > 750) {
      return { type: 'caution', message: 'Aggressive deficit. Monitor energy levels and consider diet breaks.' };
    } else if (results.dailyDeficit >= 500) {
      return { type: 'good', message: 'Moderate deficit. Good balance between progress and sustainability.' };
    } else {
      return { type: 'safe', message: 'Conservative deficit. Slow but very sustainable approach.' };
    }
  };

  const deficitStatus = getDeficitStatus();

  // Calculate monthly and yearly projections
  const monthlyLoss = (results.weeklyDeficit * 4) / 7700; // kg per month
  const yearlyLoss = monthlyLoss * 12;

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is a calorie deficit and how does it work?",
      answer: "A calorie deficit occurs when you consume fewer calories than your body burns (TDEE). Your body then uses stored energy (fat) for fuel, leading to weight loss. A deficit of 7,700 calories results in approximately 1 kg of fat loss. A daily deficit of 500 calories leads to about 0.5 kg weight loss per week.",
    order: 1
  },
    {
    id: '2',
    question: "How much calorie deficit is safe?",
      answer: "A safe deficit is typically 500-750 calories per day, resulting in 0.5-0.75 kg weight loss per week. Never eat below 1,200 calories (women) or 1,500 calories (men) without medical supervision. Larger deficits increase risk of muscle loss, nutrient deficiencies, and metabolic adaptation.",
    order: 2
  },
    {
    id: '3',
    question: "Why am I not losing weight in a calorie deficit?",
      answer: "Common reasons include: underestimating food intake, overestimating exercise calories, water retention masking fat loss, metabolic adaptation from prolonged dieting, or medical conditions affecting metabolism. Track food accurately for 2 weeks, and if no progress, reduce calories by 100-200 or increase activity.",
    order: 3
  },
    {
    id: '4',
    question: "Should I eat back exercise calories?",
      answer: "Generally, you don't need to eat back all exercise calories if your activity level is already factored into your TDEE. If you do intense workouts beyond your usual activity, consider eating back 50% of those extra calories. Listen to your body - excessive hunger and fatigue signal you may need more fuel.",
    order: 4
  },
    {
    id: '5',
    question: "How long should I stay in a calorie deficit?",
      answer: "Diet for 8-16 weeks, then take a 1-2 week diet break at maintenance calories. This helps prevent metabolic adaptation and psychological burnout. After reaching your goal, gradually increase calories over 2-4 weeks (reverse diet) to find your new maintenance level without rapid weight regain.",
    order: 5
  }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Calorie Deficit Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate your optimal calorie deficit for safe and effective weight loss</p>
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
                <label className="block text-sm font-medium text-gray-700">Current Weight</label>
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
                    max="200"
                    step="0.5"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                ) : (
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                    min="80"
                    max="450"
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

            {/* Deficit Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight Loss Speed</label>
              <div className="grid grid-cols-4 gap-2">
                {deficitLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setDeficitAmount(level.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      deficitAmount === level.value
                        ? level.color === 'green' ? 'border-green-500 bg-green-50 text-green-700' :
                          level.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
                          level.color === 'orange' ? 'border-orange-500 bg-orange-50 text-orange-700' :
                          'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg">{level.emoji}</div>
                    <div className="text-xs font-medium">{level.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Deficit Plan</h3>

            {/* Main Results Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                <div className="text-xs opacity-80 mb-1">Maintenance</div>
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold">{results.tdee.toLocaleString('en-US')}</div>
                <div className="text-xs opacity-80">cal/day</div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-4 text-white text-center">
                <div className="text-xs opacity-80 mb-1">Target</div>
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold">{results.targetCalories.toLocaleString('en-US')}</div>
                <div className="text-xs opacity-80">cal/day</div>
              </div>
            </div>

            {/* Deficit Info */}
            <div className={`rounded-xl p-4 text-center border-2 ${
              deficitStatus.type === 'danger' ? 'bg-red-50 border-red-200' :
              deficitStatus.type === 'caution' ? 'bg-orange-50 border-orange-200' :
              deficitStatus.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              deficitStatus.type === 'good' ? 'bg-green-50 border-green-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="text-sm text-gray-600 mb-1">Daily Calorie Deficit</div>
              <div className={`text-3xl sm:text-4xl font-bold ${
                deficitStatus.type === 'danger' ? 'text-red-600' :
                deficitStatus.type === 'caution' ? 'text-orange-600' :
                deficitStatus.type === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                -{results.dailyDeficit}
              </div>
              <div className="text-sm text-gray-600 mt-1">calories below maintenance</div>
              <div className="text-xs text-gray-500 mt-2">{deficitStatus.message}</div>
            </div>

            {/* Weight Loss Projections */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Weight Loss Projection</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg">📅</div>
                  <div className="text-xl font-bold text-green-600">{(results.weeklyDeficit / 7700).toFixed(2)} kg</div>
                  <div className="text-xs text-gray-500">Per Week</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg">📆</div>
                  <div className="text-xl font-bold text-blue-600">{monthlyLoss.toFixed(1)} kg</div>
                  <div className="text-xs text-gray-500">Per Month</div>
                </div>
<div className="bg-white rounded-lg p-3 border">
                  <div className="text-lg">⏱️</div>
                  <div className="text-xl font-bold text-purple-600">{results.weeksToLose5kg}</div>
                  <div className="text-xs text-gray-500">Weeks to -5kg</div>
                </div>
              </div>
            </div>

            {/* Macros */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Daily Macros (High Protein)</h4>
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

            {/* BMR Info */}
            <div className="bg-white border rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Calorie Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 rounded bg-purple-50">
                  <span className="text-gray-700">BMR (at rest)</span>
                  <span className="font-semibold text-purple-600">{results.bmr.toLocaleString('en-US')} cal</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-blue-50">
                  <span className="text-gray-700">TDEE (maintenance)</span>
                  <span className="font-semibold text-blue-600">{results.tdee.toLocaleString('en-US')} cal</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-red-50">
                  <span className="text-gray-700">Target (with deficit)</span>
                  <span className="font-semibold text-red-600">{results.targetCalories.toLocaleString('en-US')} cal</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-orange-50">
                  <span className="text-gray-700">Weekly Deficit</span>
                  <span className="font-semibold text-orange-600">{results.weeklyDeficit.toLocaleString('en-US')} cal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-4 md:mb-6">
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
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Understanding Calorie Deficit for Weight Loss</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          A calorie deficit is the foundation of all successful weight loss - it occurs when you consume fewer calories than your body burns. When in a deficit, your body must tap into stored energy (primarily body fat) to make up the difference. Understanding how to create and maintain the right deficit is crucial for achieving sustainable weight loss without compromising your health or muscle mass.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100 text-center">
            <h3 className="font-semibold text-green-800 mb-1 text-sm">Slow (250 cal)</h3>
            <p className="text-xs text-green-700 font-medium">~0.25 kg/week</p>
            <p className="text-xs text-gray-600 mt-1">Most sustainable, minimal muscle loss</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-100 text-center">
            <h3 className="font-semibold text-yellow-800 mb-1 text-sm">Moderate (500 cal)</h3>
            <p className="text-xs text-yellow-700 font-medium">~0.5 kg/week</p>
            <p className="text-xs text-gray-600 mt-1">Recommended for most people</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-100 text-center">
            <h3 className="font-semibold text-orange-800 mb-1 text-sm">Fast (750 cal)</h3>
            <p className="text-xs text-orange-700 font-medium">~0.75 kg/week</p>
            <p className="text-xs text-gray-600 mt-1">Aggressive, monitor closely</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-100 text-center">
            <h3 className="font-semibold text-red-800 mb-1 text-sm">Aggressive (1000 cal)</h3>
            <p className="text-xs text-red-700 font-medium">~1 kg/week</p>
            <p className="text-xs text-gray-600 mt-1">Risk of muscle loss, not recommended long-term</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">The Science Behind Calorie Deficit</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-3">Your body requires approximately 7,700 calories of energy to burn 1 kg of body fat. Here&apos;s how different deficits translate to weight loss:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Weekly Math:</h4>
              <div className="space-y-1 text-xs">
                <p className="bg-white p-2 rounded border">500 cal/day × 7 days = 3,500 cal = ~0.45 kg/week</p>
                <p className="bg-white p-2 rounded border">750 cal/day × 7 days = 5,250 cal = ~0.68 kg/week</p>
                <p className="bg-white p-2 rounded border">1000 cal/day × 7 days = 7,000 cal = ~0.91 kg/week</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Minimum Safe Calories:</h4>
              <div className="space-y-1 text-xs">
                <p className="bg-white p-2 rounded border"><strong>Women:</strong> 1,200 cal/day minimum</p>
                <p className="bg-white p-2 rounded border"><strong>Men:</strong> 1,500 cal/day minimum</p>
                <p className="text-gray-500 mt-2">Going below these levels risks nutrient deficiencies and metabolic slowdown</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Why Your Deficit Might Not Be Working</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Underestimating intake:</strong> Most people underreport calories by 20-50%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Overestimating exercise:</strong> Activity trackers often inflate calorie burns by 20-30%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Water retention:</strong> Weight can fluctuate 1-3 kg from salt, carbs, and hormones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Metabolic adaptation:</strong> Body reduces NEAT and BMR after prolonged dieting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Weekend binges:</strong> One big cheat day can erase a week&apos;s deficit</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Protecting Muscle During Weight Loss</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>High protein:</strong> Eat 1.6-2.2g protein per kg body weight</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Strength training:</strong> Lift weights 3-4x/week to signal muscle preservation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Moderate deficit:</strong> Larger deficits increase muscle loss risk</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Adequate sleep:</strong> Poor sleep increases cortisol and muscle breakdown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Diet breaks:</strong> Every 8-12 weeks, eat at maintenance for 1-2 weeks</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Creating a Sustainable Calorie Deficit</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Track Accurately</h4>
            <p className="text-xs text-gray-600">Use a food scale and tracking app for 2-4 weeks. Weigh everything that goes in your mouth. This reveals true intake and helps identify problem areas.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Increase Activity</h4>
            <p className="text-xs text-gray-600">Walking 10,000 steps burns ~400-500 extra calories. This creates deficit without eating less. Aim to increase NEAT (non-exercise activity) before reducing food.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Eat Volume Foods</h4>
            <p className="text-xs text-gray-600">Fill up on vegetables, lean protein, and high-fiber foods. These provide fewer calories per bite, keeping you full while staying in deficit.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="calorie-deficit-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This calculator provides estimates based on the Mifflin-St Jeor equation. Individual metabolism varies.
              Never eat below 1,200 calories (women) or 1,500 calories (men) without medical supervision.
              Consult a healthcare provider or registered dietitian before starting any weight loss program, especially if you have underlying health conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
