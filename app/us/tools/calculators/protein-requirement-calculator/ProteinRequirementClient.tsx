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

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
type Goal = 'lose' | 'maintain' | 'gain';
type WeightUnit = 'kg' | 'lbs';

const activityInfo: Record<ActivityLevel, { label: string; emoji: string; description: string; multiplier: number }> = {
  sedentary: { label: 'Sedentary', emoji: '🪑', description: 'Little or no exercise', multiplier: 0.8 },
  light: { label: 'Light', emoji: '🚶', description: '1-3 days/week', multiplier: 1.2 },
  moderate: { label: 'Moderate', emoji: '🏃', description: '3-5 days/week', multiplier: 1.6 },
  active: { label: 'Active', emoji: '💪', description: '6-7 days/week', multiplier: 2.0 },
  athlete: { label: 'Athlete', emoji: '🏆', description: '2x per day training', multiplier: 2.4 }
};

const goalInfo: Record<Goal, { label: string; emoji: string; adjustment: number; description: string }> = {
  lose: { label: 'Weight Loss', emoji: '📉', adjustment: 0.2, description: 'Preserve muscle mass' },
  maintain: { label: 'Maintain', emoji: '⚖️', adjustment: 0, description: 'Current weight' },
  gain: { label: 'Build Muscle', emoji: '💪', adjustment: 0.2, description: 'Muscle growth' }
};

const proteinSources = {
  animal: [
    { food: 'Chicken breast (4 oz)', protein: 26, icon: '🍗' },
    { food: 'Salmon (4 oz)', protein: 23, icon: '🐟' },
    { food: 'Lean beef (4 oz)', protein: 26, icon: '🥩' },
    { food: 'Eggs (2 large)', protein: 12, icon: '🥚' },
    { food: 'Greek yogurt (1 cup)', protein: 17, icon: '🥛' },
    { food: 'Cottage cheese (1 cup)', protein: 28, icon: '🧀' },
  ],
  plant: [
    { food: 'Tofu (1/2 block)', protein: 20, icon: '🫘' },
    { food: 'Lentils (1 cup cooked)', protein: 18, icon: '🫘' },
    { food: 'Chickpeas (1 cup)', protein: 15, icon: '🫘' },
    { food: 'Tempeh (4 oz)', protein: 21, icon: '🌱' },
    { food: 'Edamame (1 cup)', protein: 17, icon: '🫛' },
    { food: 'Quinoa (1 cup cooked)', protein: 8, icon: '🌾' },
  ]
};

export default function ProteinRequirementClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('protein-requirement-calculator');

  const [weight, setWeight] = useState(154);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');

  const [results, setResults] = useState({
    proteinGrams: 0,
    proteinMin: 0,
    proteinMax: 0,
    perMeal: 0,
    perKg: 0,
    calories: 0
  });

  useEffect(() => {
    calculateProtein();
  }, [weight, weightUnit, activityLevel, goal]);

  const calculateProtein = () => {
    const weightKg = weightUnit === 'lbs' ? weight / 2.20462 : weight;

    let baseMultiplier = activityInfo[activityLevel].multiplier;
    let minMult = baseMultiplier - 0.2;
    let maxMult = baseMultiplier + 0.2;

    // Adjust for goal
    const goalAdjust = goalInfo[goal].adjustment;
    baseMultiplier += goalAdjust;
    maxMult += goalAdjust;

    const proteinGrams = weightKg * baseMultiplier;
    const proteinMin = weightKg * minMult;
    const proteinMax = weightKg * maxMult;

    setResults({
      proteinGrams: Math.round(proteinGrams),
      proteinMin: Math.round(proteinMin),
      proteinMax: Math.round(proteinMax),
      perMeal: Math.round(proteinGrams / 4),
      perKg: parseFloat(baseMultiplier.toFixed(1)),
      calories: Math.round(proteinGrams * 4)
    });
  };

  const fallbackFaqs = [
    {
    id: '1',
    question: "How much protein do I really need per day?",
      answer: "The RDA is 0.8g/kg for sedentary adults, but active individuals need more. For fitness enthusiasts, 1.6-2.2g/kg is optimal. Athletes and those in caloric deficit may benefit from up to 2.4g/kg. Your specific needs depend on activity level, goals, and body composition.",
    order: 1
  },
    {
    id: '2',
    question: "Can I eat too much protein?",
      answer: "For healthy individuals, high protein intake (up to 2.4g/kg) is safe. However, extremely high amounts (>3g/kg) offer no additional benefit and may stress kidneys in those with existing kidney conditions. Spread protein across meals for optimal absorption - aim for 20-40g per meal.",
    order: 2
  },
    {
    id: '3',
    question: "When is the best time to eat protein?",
      answer: "Distribute protein evenly across 3-4 meals (20-40g each) for optimal muscle protein synthesis. Post-workout protein (within 2 hours) supports recovery, but total daily intake matters more than exact timing. Having protein at breakfast can help with satiety throughout the day.",
    order: 3
  },
    {
    id: '4',
    question: "Is plant protein as good as animal protein?",
      answer: "Plant proteins can be equally effective when combined properly. Most plant sources are 'incomplete' (missing some amino acids), so eat a variety - beans with grains, tofu with quinoa. Soy (tofu, tempeh, edamame) is a complete plant protein. You may need slightly more total protein from plants.",
    order: 4
  },
    {
    id: '5',
    question: "Do I need protein supplements?",
      answer: "Most people can meet protein needs through whole foods. Supplements (whey, casein, plant proteins) are convenient but not necessary. They're useful when: you can't eat enough whole food protein, need quick post-workout nutrition, or have very high requirements (>150g/day).",
    order: 5
  },
    {
    id: '6',
    question: "How does protein help with weight loss?",
      answer: "Protein aids weight loss through multiple mechanisms: 1) Higher thermic effect - digesting protein burns 20-30% of its calories vs 5-10% for carbs/fats. 2) Increased satiety - protein keeps you full longer, reducing overall calorie intake. 3) Muscle preservation - adequate protein prevents muscle loss during calorie deficit, maintaining metabolic rate. 4) Reduced cravings - higher protein intake stabilizes blood sugar and reduces hunger hormones. Aim for 1.6-2.4g/kg during weight loss, with protein making up 25-35% of total calories.",
    order: 6
  }
  ];

  const getWeightKg = () => weightUnit === 'lbs' ? weight / 2.20462 : weight;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Protein Requirement Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your optimal daily protein intake based on your weight, activity level, and fitness goals.
            Get personalized recommendations for muscle building, weight loss, or maintenance.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Weight Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Body Weight</label>
                  <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => {
                        if (weightUnit === 'kg') {
                          setWeight(Math.round(weight * 2.20462));
                          setWeightUnit('lbs');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        weightUnit === 'lbs' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      lbs
                    </button>
                    <button
                      onClick={() => {
                        if (weightUnit === 'lbs') {
                          setWeight(Math.round(weight / 2.20462));
                          setWeightUnit('kg');
                        }
                      }}
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
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
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
                      onClick={() => setActivityLevel(level)}
                      className={`p-2 rounded-lg border-2 transition-all text-center ${
                        activityLevel === level
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
                  {activityInfo[activityLevel].description} ({activityInfo[activityLevel].multiplier}g/kg base)
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
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        goal === g
                          ? g === 'lose' ? 'border-red-500 bg-red-50' :
                            g === 'maintain' ? 'border-blue-500 bg-blue-50' :
                            'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{goalInfo[g].emoji}</div>
                      <div className="text-sm font-medium text-gray-700">{goalInfo[g].label}</div>
                      <div className="text-[10px] text-gray-500">{goalInfo[g].description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Protein Ratio Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Your Protein Ratio</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Based on your selections, you need approximately <strong>{results.perKg}g per kg</strong> of body weight.
                      {goal === 'lose' && ' Higher protein helps preserve muscle during weight loss.'}
                      {goal === 'gain' && ' Higher protein supports muscle growth when combined with strength training.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-3 sm:p-4 md:p-6 text-white">
                <div className="text-center">
                  <p className="text-red-100 text-sm font-medium mb-1">Daily Protein Target</p>
                  <div className="text-5xl font-bold mb-2">{results.proteinGrams}g</div>
                  <p className="text-red-100 text-sm">
                    {results.calories} calories from protein
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-red-400/30">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-100">Protein Range:</span>
                    <span className="font-semibold">{results.proteinMin}g - {results.proteinMax}g</span>
                  </div>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.perMeal}g</div>
                  <div className="text-purple-100 text-xs font-medium mt-1">Per Meal (4 meals)</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.perKg}g</div>
                  <div className="text-blue-100 text-xs font-medium mt-1">Per kg Body Weight</div>
                </div>
              </div>

              {/* Food Equivalents */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Hitting {results.proteinGrams}g Looks Like:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">🍗 Chicken breasts</span>
                    <span className="font-semibold text-gray-800">{Math.ceil(results.proteinGrams / 26)} servings (4 oz each)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">🥚 Large eggs</span>
                    <span className="font-semibold text-gray-800">{Math.ceil(results.proteinGrams / 6)} eggs</span>
                  </div>
<div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">🥛 Greek yogurt cups</span>
                    <span className="font-semibold text-gray-800">{Math.ceil(results.proteinGrams / 17)} cups</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-gray-700">💊 Protein scoops</span>
                    <span className="font-semibold text-gray-800">{Math.ceil(results.proteinGrams / 25)} scoops (~25g each)</span>
                  </div>
                </div>
              </div>

              {/* Meal Distribution */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Suggested Meal Distribution</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-gray-600 flex-1">Breakfast</span>
                    <span className="text-sm font-semibold">{Math.round(results.proteinGrams * 0.25)}g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600 flex-1">Lunch</span>
                    <span className="text-sm font-semibold">{Math.round(results.proteinGrams * 0.30)}g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600 flex-1">Dinner</span>
                    <span className="text-sm font-semibold">{Math.round(results.proteinGrams * 0.30)}g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-gray-600 flex-1">Snacks</span>
                    <span className="text-sm font-semibold">{Math.round(results.proteinGrams * 0.15)}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

{/* Related Calculators */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all h-full">
                  <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
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
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Protein Requirements: Science-Based Nutrition Guide</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Protein is the most important macronutrient for building and maintaining lean muscle mass, supporting recovery, regulating hormones, and maintaining overall health. Unlike fats and carbohydrates which the body can store and manufacture, protein must be consumed regularly through diet as the body has limited storage capacity. Your optimal protein intake depends on multiple factors: body weight, activity level, fitness goals (muscle building, fat loss, or maintenance), age, and overall health status. The outdated RDA of 0.8g/kg was designed to prevent deficiency in sedentary populations, not optimize health and performance in active individuals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Why Protein Matters</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Muscle protein synthesis</li>
              <li>• Tissue repair and recovery</li>
              <li>• Enzyme and hormone production</li>
              <li>• Immune system support</li>
              <li>• Increased satiety and metabolism</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">General Guidelines</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Sedentary: 0.8-1.0g/kg</li>
              <li>• Active: 1.4-1.8g/kg</li>
              <li>• Athletes: 1.6-2.2g/kg</li>
              <li>• Fat loss: 1.8-2.4g/kg</li>
              <li>• Muscle building: 1.6-2.2g/kg</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Protein Quality</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Complete vs incomplete proteins</li>
              <li>• Amino acid profile matters</li>
              <li>• Leucine content for muscle</li>
              <li>• Digestibility and absorption</li>
              <li>• Timing and distribution</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Protein Requirements by Goal</h3>
        <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Muscle Building & Strength Training</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Recommendation:</strong> 1.6-2.2g per kg body weight (0.7-1.0g per lb)
            </p>
            <p className="text-xs text-gray-600">
              Resistance training creates micro-tears in muscle fibers that require protein for repair and growth. Research shows 1.6g/kg is the minimum effective dose for muscle building, with diminishing returns above 2.2g/kg for most people. Distribute across 3-5 meals with 20-40g per meal to maximize muscle protein synthesis. Post-workout protein (within 2-3 hours) supports recovery but total daily intake matters more than exact timing.
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
            <h4 className="font-semibold text-red-800 mb-2">Fat Loss & Calorie Deficit</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Recommendation:</strong> 1.8-2.4g per kg body weight (0.8-1.1g per lb)
            </p>
            <p className="text-xs text-gray-600">
              Higher protein during fat loss preserves lean muscle mass, increases satiety (reducing hunger), and boosts metabolism through its high thermic effect (20-30% of calories burned during digestion). The larger your calorie deficit and the leaner you are, the more protein you need. Competitive bodybuilders preparing for shows may go as high as 2.7g/kg. Protein should constitute 25-40% of total calories during fat loss phases.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Maintenance & General Health</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Recommendation:</strong> 1.2-1.6g per kg body weight (0.55-0.75g per lb)
            </p>
            <p className="text-xs text-gray-600">
              For maintaining current muscle mass and supporting overall health without specific body composition goals. Still significantly higher than the outdated RDA of 0.8g/kg. Active individuals who exercise recreationally 2-4x per week benefit from the higher end of this range. This intake supports immune function, hormone production, tissue repair, and metabolic health while being easily achievable through whole foods.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Endurance Athletes</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Recommendation:</strong> 1.2-1.6g per kg body weight (0.55-0.75g per lb)
            </p>
            <p className="text-xs text-gray-600">
              Runners, cyclists, and endurance athletes have lower protein needs than strength athletes but still higher than sedentary individuals. Long-duration cardio causes some muscle protein breakdown that must be replaced. Protein timing around long training sessions can improve recovery. Higher carbohydrate intake is prioritized for performance, with protein typically 15-20% of total calories.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Complete Protein Sources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Chicken Breast:</strong> 31g protein per 100g (165 cal) - lean, versatile, affordable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Lean Beef:</strong> 26g protein per 100g (250 cal) - high iron, zinc, B12</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Salmon:</strong> 25g protein per 100g (200 cal) - omega-3s, vitamin D</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Eggs:</strong> 6g protein per large egg (70 cal) - complete amino acids, affordable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Greek Yogurt (0%):</strong> 10g protein per 100g (59 cal) - probiotics, calcium</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Whey Protein:</strong> 20-25g per scoop (100-120 cal) - fast-digesting, convenient</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Tofu (firm):</strong> 8g protein per 100g (76 cal) - plant-based complete protein</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Plant-Based Sources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Lentils:</strong> 9g protein per 100g cooked (116 cal) - fiber, iron, folate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Chickpeas:</strong> 9g protein per 100g cooked (164 cal) - versatile, filling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Quinoa:</strong> 4g protein per 100g cooked (120 cal) - complete protein grain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Edamame:</strong> 11g protein per 100g (122 cal) - complete soy protein</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Tempeh:</strong> 19g protein per 100g (193 cal) - fermented, high protein</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Black Beans:</strong> 9g protein per 100g cooked (132 cal) - fiber, minerals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Pea Protein:</strong> 20-25g per scoop (100-120 cal) - plant-based supplement</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Optimizing Protein Intake</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Meal Distribution</h4>
            <p className="text-xs text-gray-600">Spread protein across 3-5 meals with 20-40g per meal for optimal muscle protein synthesis. This maintains elevated amino acid levels throughout the day. Eating all protein in 1-2 meals reduces utilization efficiency. Breakfast protein (25-30g) improves satiety all day.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Leucine Threshold</h4>
            <p className="text-xs text-gray-600">Each meal should contain 2-3g leucine (key amino acid) to trigger muscle protein synthesis. This equals ~25-30g high-quality protein. Animal proteins are leucine-rich; plant proteins need larger portions. Whey protein has the highest leucine content per serving.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Protein Quality</h4>
            <p className="text-xs text-gray-600">PDCAAS and DIAAS scores measure protein quality based on amino acid profile and digestibility. Animal proteins score highest (0.9-1.0). Combine plant proteins - rice + peas, beans + corn - to create complete amino acid profiles matching animal sources.</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Pre-Sleep Protein</h4>
            <p className="text-xs text-gray-600">Consuming 30-40g slow-digesting protein (casein, cottage cheese) before bed sustains muscle protein synthesis overnight during the 8-hour fast of sleep. Particularly beneficial for hard-training athletes or those in muscle-building phases. Doesn't disrupt sleep quality.</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Post-Workout Timing</h4>
            <p className="text-xs text-gray-600">The "anabolic window" is wider than once thought (up to 3-4 hours post-training). However, consuming 20-40g protein within 2 hours post-workout is convenient and supports recovery. Pre-workout protein also counts toward this window. Total daily intake matters most.</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-pink-800 mb-2 text-sm">Protein for Older Adults</h4>
            <p className="text-xs text-gray-600">Adults 65+ need higher protein (1.2-1.5g/kg) due to anabolic resistance - reduced sensitivity to muscle protein synthesis. This combats sarcopenia (age-related muscle loss). Per-meal threshold increases to 35-40g. Resistance training amplifies protein's benefits.</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Considerations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Kidney Health</h4>
            <p className="text-xs text-gray-600">For healthy individuals, high protein intake (up to 2.4g/kg) is safe long-term. However, those with existing kidney disease should limit protein and work with healthcare providers. High protein doesn't cause kidney damage in healthy people but may stress already-compromised kidneys. Stay well-hydrated (3-4L water daily) with higher protein intake.</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Bone Health</h4>
            <p className="text-xs text-gray-600">Contrary to outdated beliefs, high protein intake supports bone health, not harms it. Protein increases calcium absorption and stimulates IGF-1 production, which promotes bone growth. Studies show higher protein intake correlates with greater bone density and reduced fracture risk, especially when combined with adequate calcium and vitamin D.</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Pregnancy & Lactation</h4>
            <p className="text-xs text-gray-600">Pregnant women need an additional 25g protein daily (total 1.1-1.2g/kg). Lactating women need an extra 25-30g daily. Protein supports fetal development, placental growth, increased maternal blood volume, and breast milk production. Focus on high-quality complete proteins for optimal amino acid availability.</p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2 text-sm">Digestive Issues</h4>
            <p className="text-xs text-gray-600">If experiencing bloating or digestive discomfort with high protein: gradually increase intake over 2-3 weeks, stay hydrated, include digestive enzymes, vary protein sources, and ensure adequate fiber (25-35g daily). Spread protein across meals rather than large boluses. Some people tolerate certain proteins (whey vs plant) better.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="protein-requirement-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides estimates based on research-backed guidelines for healthy adults.
            Individual protein needs may vary based on health conditions, medications, and specific circumstances.
            Those with kidney disease should consult a healthcare provider before increasing protein intake.
          </p>
        </div>
      </div>
    </div>
  );
}
