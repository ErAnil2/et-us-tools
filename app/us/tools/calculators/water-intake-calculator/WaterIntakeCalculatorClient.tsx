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

type WeightUnit = 'kg' | 'lbs';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';
type Climate = 'temperate' | 'hot' | 'dry' | 'cold';

const activityInfo: Record<ActivityLevel, { label: string; emoji: string; multiplier: number; description: string }> = {
  sedentary: { label: 'Sedentary', emoji: '🪑', multiplier: 1.0, description: 'Little or no exercise' },
  light: { label: 'Light', emoji: '🚶', multiplier: 1.1, description: '1-3 days/week' },
  moderate: { label: 'Moderate', emoji: '🏃', multiplier: 1.3, description: '3-5 days/week' },
  active: { label: 'Active', emoji: '💪', multiplier: 1.5, description: '6-7 days/week' },
  extreme: { label: 'Extreme', emoji: '🔥', multiplier: 1.8, description: 'Physical job + exercise' }
};

const climateInfo: Record<Climate, { label: string; emoji: string; multiplier: number }> = {
  temperate: { label: 'Temperate', emoji: '🌤️', multiplier: 1.0 },
  hot: { label: 'Hot/Humid', emoji: '☀️', multiplier: 1.2 },
  dry: { label: 'Hot/Dry', emoji: '🏜️', multiplier: 1.2 },
  cold: { label: 'Cold', emoji: '❄️', multiplier: 1.0 }
};

export default function WaterIntakeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('water-intake-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(154);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [age, setAge] = useState(30);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [climate, setClimate] = useState<Climate>('temperate');
  const [pregnant, setPregnant] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [caffeineAlcohol, setCaffeineAlcohol] = useState(false);

  const [results, setResults] = useState({
    totalL: 0,
    totalCups: 0,
    totalOz: 0,
    fromFood: 0,
    fromDrinks: 0,
    perHour: 0
  });

  useEffect(() => {
    calculateWater();
  }, [gender, weight, weightUnit, age, activity, climate, pregnant, breastfeeding, caffeineAlcohol]);

  const calculateWater = () => {
    const weightKg = weightUnit === 'lbs' ? weight / 2.20462 : weight;

    // Base: 35ml per kg
    let waterML = weightKg * 35;

    // Gender adjustment
    if (gender === 'female') waterML *= 0.95;

    // Age adjustment
    if (age > 65) waterML *= 0.9;
    else if (age < 18) waterML *= 1.1;

    // Activity
    waterML *= activityInfo[activity].multiplier;

    // Climate
    waterML *= climateInfo[climate].multiplier;

    // Special conditions
    if (pregnant) waterML *= 1.1;
    if (breastfeeding) waterML *= 1.3;
    if (caffeineAlcohol) waterML *= 1.1;

    const waterL = waterML / 1000;
    const waterCups = Math.round(waterML / 240);
    const waterOz = Math.round(waterML / 29.574);

    setResults({
      totalL: waterL,
      totalCups: waterCups,
      totalOz: waterOz,
      fromFood: waterL * 0.2,
      fromDrinks: waterL * 0.8,
      perHour: Math.round(waterML / 16)
    });
  };

  const schedule = [
    { time: '7:00 AM', emoji: '🌅', activity: 'Upon waking', percent: 0.15 },
    { time: '9:00 AM', emoji: '☕', activity: 'Mid-morning', percent: 0.10 },
    { time: '12:00 PM', emoji: '🍽️', activity: 'Before lunch', percent: 0.15 },
    { time: '2:00 PM', emoji: '📝', activity: 'Afternoon', percent: 0.10 },
    { time: '4:00 PM', emoji: '🏋️', activity: 'Pre-workout', percent: 0.15 },
    { time: '6:00 PM', emoji: '🍴', activity: 'Before dinner', percent: 0.15 },
    { time: '8:00 PM', emoji: '📺', activity: 'Evening', percent: 0.10 },
    { time: '9:30 PM', emoji: '🌙', activity: 'Before bed', percent: 0.10 }
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: "How much water should I drink daily?",
      answer: "The general recommendation is 35ml per kg of body weight, adjusted for activity level, climate, and health conditions. For most adults, this translates to 2-3 liters (8-12 cups) daily. Active individuals and those in hot climates need more.",
    order: 1
  },
    {
    id: '2',
    question: "Does coffee and tea count toward water intake?",
      answer: "Yes, caffeinated beverages do contribute to hydration, though their mild diuretic effect means they're slightly less hydrating than water. Moderate coffee and tea consumption (3-4 cups) can count toward your daily fluid intake.",
    order: 2
  },
    {
    id: '3',
    question: "What are the signs of dehydration?",
      answer: "Common signs include dark yellow urine, dry mouth and lips, headache, fatigue, dizziness, decreased urination, and rapid heartbeat. Severe dehydration can cause confusion, rapid breathing, and fainting.",
    order: 3
  },
    {
    id: '4',
    question: "Can you drink too much water?",
      answer: "Yes, overhydration (hyponatremia) can dilute sodium levels in your blood. This is rare but can occur during extreme exercise. Symptoms include nausea, headache, and confusion. Drink when thirsty and spread intake throughout the day.",
    order: 4
  },
    {
    id: '5',
    question: "How does exercise affect water needs?",
      answer: "During exercise, you can lose 0.5-2 liters of fluid per hour through sweat. Drink 500ml 2 hours before exercise, 150-250ml every 15-20 minutes during exercise, and replenish losses after. Weigh yourself before and after to estimate fluid loss.",
    order: 5
  },
    {
    id: '6',
    question: "What's the best way to monitor hydration status?",
      answer: "The most reliable indicator is urine color: pale yellow indicates good hydration, while dark yellow or amber suggests dehydration. Other methods include monitoring thirst (though not always reliable, especially in elderly), tracking body weight changes (1kg loss ≈ 1L fluid deficit), and observing physical symptoms like skin turgor and mucous membrane moisture. Athletes can track urine specific gravity for precise monitoring. Aim to maintain light yellow urine throughout the day for optimal hydration.",
    order: 6
  }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Water Intake Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your personalized daily water intake based on your weight, activity level,
            climate, and health conditions. Stay optimally hydrated.
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

              {/* Weight Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Weight</label>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    {weightUnit}
                  </span>
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
                  min="10"
                  max="80"
                  className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10</span>
                  <span>80</span>
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

              {/* Climate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Climate</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(climateInfo) as Climate[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setClimate(c)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        climate === c
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{climateInfo[c].emoji}</div>
                      <div className="text-[10px] font-medium text-gray-700">{climateInfo[c].label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Conditions */}
              {gender === 'female' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Conditions</label>
                  <label className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100">
                    <input
                      type="checkbox"
                      checked={pregnant}
                      onChange={(e) => setPregnant(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded"
                    />
                    <span className="text-sm text-gray-700">🤰 Pregnant (+10% water)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100">
                    <input
                      type="checkbox"
                      checked={breastfeeding}
                      onChange={(e) => setBreastfeeding(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded"
                    />
                    <span className="text-sm text-gray-700">🤱 Breastfeeding (+30% water)</span>
                  </label>
                </div>
              )}

              <label className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg cursor-pointer hover:bg-amber-100">
                <input
                  type="checkbox"
                  checked={caffeineAlcohol}
                  onChange={(e) => setCaffeineAlcohol(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <span className="text-sm text-gray-700">☕ High caffeine/alcohol intake (+10% water)</span>
              </label>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-3 sm:p-4 md:p-6 text-white">
                <div className="text-center">
                  <p className="text-cyan-100 text-sm font-medium mb-1">Daily Water Intake</p>
                  <div className="text-5xl font-bold mb-2">{results.totalL.toFixed(1)}L</div>
                  <p className="text-cyan-100 text-sm">
                    {results.totalCups} cups • {results.totalOz} oz
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-cyan-400/30 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-cyan-200 text-xs">From Drinks</p>
                    <p className="font-semibold">{results.fromDrinks.toFixed(1)}L (80%)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-cyan-200 text-xs">From Food</p>
                    <p className="font-semibold">{results.fromFood.toFixed(1)}L (20%)</p>
                  </div>
                </div>
              </div>

              {/* Per Hour */}
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-4 text-white text-center">
                <div className="text-2xl font-bold">{results.perHour}ml</div>
                <div className="text-teal-100 text-xs">Every waking hour (16 hrs)</div>
              </div>

              {/* Hydration Schedule */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Daily Hydration Schedule</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {schedule.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <span className="font-medium text-gray-800">{item.time}</span>
                          <span className="text-gray-500 text-xs ml-2">{item.activity}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {Math.round(results.fromDrinks * 1000 * item.percent)}ml
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dehydration Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Signs of Dehydration</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Dark urine, dry mouth, headache, fatigue, dizziness. Aim for light yellow urine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* MREC Banners */}
        {/* Hydration Tips */}

{/* Related Calculators */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
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
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Daily Water Intake: Complete Hydration Guide</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Water is essential for life, comprising 50-70% of body weight and participating in virtually every bodily function from temperature regulation to nutrient transport. Despite its critical importance, dehydration remains surprisingly common—studies show up to 75% of people are chronically underhydrated. Your optimal water intake depends on multiple factors: body weight (larger bodies need more water), activity level (exercise increases losses), climate (heat and altitude increase needs), diet composition (high sodium/protein increases requirements), and health status (fever, illness, pregnancy affect needs). The outdated "8 glasses daily" rule oversimplifies this—a 50kg sedentary woman and 100kg active man have vastly different requirements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
            <h3 className="font-semibold text-cyan-800 mb-2 text-sm">Base Formula</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 35ml per kg body weight</li>
              <li>• 70kg person = 2.45L baseline</li>
              <li>• Adjust for activity & climate</li>
              <li>• Add 500-1000ml per hour exercise</li>
              <li>• 20% comes from food</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Hydration Benefits</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Regulates body temperature</li>
              <li>• Lubricates joints</li>
              <li>• Transports nutrients</li>
              <li>• Removes waste products</li>
              <li>• Maintains cognitive function</li>
            </ul>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <h3 className="font-semibold text-indigo-800 mb-2 text-sm">Dehydration Signs</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Dark yellow urine</li>
              <li>• Dry mouth & skin</li>
              <li>• Fatigue & headache</li>
              <li>• Dizziness</li>
              <li>• Decreased performance</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Water Requirements by Activity Level</h3>
        <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Sedentary (Little Exercise)</h4>
            <p className="text-xs text-gray-600"><strong>Formula:</strong> 30-35ml/kg bodyweight. Minimal physical activity. Water mainly supports basic metabolic functions, digestion, and waste removal. Lower end applies to cooler climates, upper end for warmer environments.</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Lightly Active (1-3 days/week exercise)</h4>
            <p className="text-xs text-gray-600"><strong>Formula:</strong> 35-40ml/kg bodyweight. Light exercise 1-3 times weekly. Additional water supports increased metabolic rate and compensates for sweat losses during activity. Add 400-600ml on workout days.</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Moderately Active (3-5 days/week)</h4>
            <p className="text-xs text-gray-600"><strong>Formula:</strong> 40-45ml/kg bodyweight. Regular exercise 3-5 times weekly. Consistent activity increases daily baseline needs. Add 500-800ml per hour of moderate exercise. Monitor urine color to verify adequacy.</p>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Very Active (6-7 days/week intense training)</h4>
            <p className="text-xs text-gray-600"><strong>Formula:</strong> 45-50ml/kg bodyweight + exercise losses. Daily intense training significantly elevates needs. Add 800-1500ml per hour depending on intensity and sweat rate. Athletes may need 4-6+ liters daily.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Factors Increasing Water Needs</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span><strong>Hot Climate:</strong> Add 500-1000ml daily in hot/humid environments due to increased perspiration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span><strong>High Altitude:</strong> Add 500ml daily above 2500m - increased respiration and urination</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span><strong>Illness:</strong> Fever, diarrhea, vomiting dramatically increase losses - may need 2-3x normal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span><strong>Pregnancy:</strong> Add 300ml daily to support increased blood volume and amniotic fluid</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span><strong>Breastfeeding:</strong> Add 700-1000ml daily to support milk production</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span><strong>High Protein Diet:</strong> Kidney needs more water to process nitrogen waste from protein</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span><strong>High Sodium:</strong> Excess salt requires dilution and elimination via kidneys</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Hydration Monitoring Methods</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Urine Color:</strong> Best indicator. Pale yellow = good, dark yellow/amber = dehydrated. Check 2nd urination (first is concentrated)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Thirst:</strong> Useful but lags behind actual needs. If thirsty, already ~2% dehydrated. Elderly have blunted thirst.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Body Weight:</strong> Athletes weigh pre/post-exercise. 1kg loss = ~1L fluid deficit. Aim to replace 150% of losses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Skin Turgor:</strong> Pinch skin on back of hand - slow return indicates dehydration (less reliable in elderly)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Urine Frequency:</strong> Should urinate 6-8 times daily if adequately hydrated. Less suggests insufficient intake.</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hydration Strategies & Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-cyan-50 rounded-lg p-4">
            <h4 className="font-semibold text-cyan-800 mb-2 text-sm">Timing & Distribution</h4>
            <p className="text-xs text-gray-600">Spread intake throughout day rather than large amounts at once. Start with 500ml upon waking to rehydrate from overnight. Drink 200-300ml every 2-3 hours. Have water 30-60 min before meals to aid digestion. Limit intake 2 hours before bed to avoid nighttime urination.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Exercise Hydration</h4>
            <p className="text-xs text-gray-600">Pre-hydrate: 500ml 2-3 hours before, 250ml 15 min before. During: 150-250ml every 15-20 min for sessions {'>'}60 min. Post: Replace 150% of weight loss (1.5L per kg lost). Add electrolytes for exercise {'>'}90 min or heavy sweating.</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Food Sources</h4>
            <p className="text-xs text-gray-600">20% of daily water comes from food. Water-rich foods: watermelon (92%), cucumber (96%), lettuce (95%), tomatoes (94%), soups, smoothies. Fruits and vegetables significantly contribute to hydration while providing nutrients.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Temperature Matters</h4>
            <p className="text-xs text-gray-600">Cold water (5-10°C) absorbs faster and aids cooling during exercise. Room temperature easier to drink in large quantities. Hot beverages count toward intake. Ice water slightly increases calorie burn (~8 cal per glass) through thermogenesis.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="water-intake-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides general guidelines for daily water intake.
            Individual needs vary based on health conditions, medications, and specific circumstances.
            Consult a healthcare provider for personalized hydration advice, especially if you have kidney or heart conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
