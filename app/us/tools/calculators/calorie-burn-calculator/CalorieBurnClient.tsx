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

interface CalorieBurnClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type WeightUnit = 'kg' | 'lbs';

const activityCategories = {
  cardio: {
    label: 'Cardio',
    icon: '🏃',
    activities: [
      { id: 'running_fast', name: 'Running (8 mph)', met: 13.5 },
      { id: 'running', name: 'Running (6 mph)', met: 10.0 },
      { id: 'jogging', name: 'Jogging (5 mph)', met: 8.0 },
      { id: 'walking_fast', name: 'Walking Fast (4 mph)', met: 5.0 },
      { id: 'walking', name: 'Walking (3 mph)', met: 3.5 },
      { id: 'cycling_fast', name: 'Cycling (14-16 mph)', met: 10.0 },
      { id: 'cycling', name: 'Cycling (moderate)', met: 8.0 },
      { id: 'swimming', name: 'Swimming (moderate)', met: 6.0 },
      { id: 'jump_rope', name: 'Jump Rope', met: 11.0 },
      { id: 'rowing', name: 'Rowing Machine', met: 7.0 },
    ]
  },
  strength: {
    label: 'Strength',
    icon: '💪',
    activities: [
      { id: 'weightLifting_vigorous', name: 'Weight Lifting (vigorous)', met: 6.0 },
      { id: 'weightLifting', name: 'Weight Lifting (moderate)', met: 3.5 },
      { id: 'crossfit', name: 'CrossFit', met: 12.0 },
      { id: 'hiit', name: 'HIIT Training', met: 12.0 },
      { id: 'circuit', name: 'Circuit Training', met: 8.0 },
      { id: 'calisthenics', name: 'Calisthenics', met: 5.0 },
    ]
  },
  sports: {
    label: 'Sports',
    icon: '⚽',
    activities: [
      { id: 'basketball', name: 'Basketball', met: 6.5 },
      { id: 'soccer', name: 'Soccer', met: 7.0 },
      { id: 'tennis', name: 'Tennis', met: 7.3 },
      { id: 'volleyball', name: 'Volleyball', met: 4.0 },
      { id: 'golf', name: 'Golf (walking)', met: 4.5 },
      { id: 'boxing', name: 'Boxing', met: 12.0 },
      { id: 'martial_arts', name: 'Martial Arts', met: 10.0 },
    ]
  },
  lifestyle: {
    label: 'Lifestyle',
    icon: '🧘',
    activities: [
      { id: 'yoga', name: 'Yoga', met: 3.0 },
      { id: 'pilates', name: 'Pilates', met: 3.5 },
      { id: 'dancing', name: 'Dancing', met: 4.5 },
      { id: 'stretching', name: 'Stretching', met: 2.5 },
      { id: 'housework', name: 'Housework', met: 3.5 },
      { id: 'gardening', name: 'Gardening', met: 4.0 },
      { id: 'stairs', name: 'Climbing Stairs', met: 8.0 },
    ]
  }
};

const intensityLevels = [
  { value: 0.8, label: 'Light', description: 'Can easily hold a conversation', color: 'green' },
  { value: 1.0, label: 'Moderate', description: 'Slightly breathless, can talk', color: 'yellow' },
  { value: 1.2, label: 'Vigorous', description: 'Hard to talk, heavy breathing', color: 'red' },
];

export default function CalorieBurnClient({ relatedCalculators = defaultRelatedCalculators }: CalorieBurnClientProps) {
  const { getH1, getSubHeading } = usePageSEO('calorie-burn-calculator');

  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [weightKg, setWeightKg] = useState(70);
  const [weightLbs, setWeightLbs] = useState(154);
  const [selectedCategory, setSelectedCategory] = useState('cardio');
  const [activity, setActivity] = useState('running');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState(1.0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [results, setResults] = useState({
    caloriesBurned: 0,
    caloriesPerMinute: 0,
    caloriesPerHour: 0,
    metValue: 0
  });

  // Get all activities flat
  const getAllActivities = () => {
    const all: { id: string; name: string; met: number }[] = [];
    Object.values(activityCategories).forEach(cat => {
      all.push(...cat.activities);
    });
    return all;
  };

  const getActivityMet = (activityId: string) => {
    const allActivities = getAllActivities();
    const found = allActivities.find(a => a.id === activityId);
    return found ? found.met : 5.0;
  };

  const getActivityName = (activityId: string) => {
    const allActivities = getAllActivities();
    const found = allActivities.find(a => a.id === activityId);
    return found ? found.name : 'Unknown Activity';
  };

  useEffect(() => {
    calculateCalories();
  }, [weightKg, weightLbs, weightUnit, activity, duration, intensity]);

  const calculateCalories = () => {
    const weight = weightUnit === 'lbs' ? weightLbs * 0.453592 : weightKg;
    const baseMet = getActivityMet(activity);
    const adjustedMet = baseMet * intensity;
    const hours = duration / 60;
    const calories = adjustedMet * weight * hours;
    const perMinute = calories / duration;
    const perHour = perMinute * 60;

    setResults({
      caloriesBurned: calories,
      caloriesPerMinute: perMinute,
      caloriesPerHour: perHour,
      metValue: baseMet
    });
  };

  const weightLabel = weightUnit === 'lbs' ? 'lbs' : 'kg';

  // Calculate food equivalents
  const foodEquivalents = [
    { name: 'Apples', emoji: '🍎', calories: 95, amount: results.caloriesBurned / 95 },
    { name: 'Bananas', emoji: '🍌', calories: 105, amount: results.caloriesBurned / 105 },
    { name: 'Pizza slices', emoji: '🍕', calories: 285, amount: results.caloriesBurned / 285 },
    { name: 'Chocolate bars', emoji: '🍫', calories: 230, amount: results.caloriesBurned / 230 },
    { name: 'Donuts', emoji: '🍩', calories: 250, amount: results.caloriesBurned / 250 },
    { name: 'Beers', emoji: '🍺', calories: 150, amount: results.caloriesBurned / 150 },
  ];

  // Weekly projection
  const weeklyCalories = results.caloriesBurned * 5; // Assuming 5 days/week
  const monthlyWeightLoss = (weeklyCalories * 4) / 7700; // kg lost (7700 cal = 1kg)

  const fallbackFaqs = [
    {
    id: '1',
    question: "How are calories burned calculated?",
      answer: "Calories burned are calculated using MET (Metabolic Equivalent of Task) values. The formula is: Calories = MET × Weight (kg) × Time (hours). MET values represent the energy cost of physical activities as multiples of resting metabolic rate. Higher MET values indicate more intense activities that burn more calories.",
    order: 1
  },
    {
    id: '2',
    question: "What is MET and why does it matter?",
      answer: "MET stands for Metabolic Equivalent of Task. A MET of 1 represents the energy you use at rest. Walking has a MET of about 3.5 (burns 3.5x resting calories), while running at 6 mph has a MET of 10 (burns 10x resting calories). MET values help compare calorie burn across different activities and intensities.",
    order: 2
  },
    {
    id: '3',
    question: "How accurate is this calorie burn calculator?",
      answer: "This calculator provides estimates based on average MET values from the Compendium of Physical Activities. Actual calories burned can vary by 10-20% based on individual factors like fitness level, body composition, age, and exercise efficiency. Heart rate monitors with chest straps tend to be most accurate for real-time tracking.",
    order: 3
  },
    {
    id: '4',
    question: "How many calories should I burn per day to lose weight?",
      answer: "To lose 1 pound per week, you need a total calorie deficit of about 3,500 calories, or 500 calories per day. This can come from eating less, exercising more, or both. For sustainable weight loss, aim for 200-400 calories burned through exercise combined with a modest calorie reduction in your diet.",
    order: 4
  },
    {
    id: '5',
    question: "Which exercise burns the most calories?",
      answer: "High-intensity activities burn the most calories per minute. Running, jump rope, HIIT training, and cycling at high speeds typically burn 10-15 calories per minute. However, the best exercise is one you'll do consistently. A 30-minute moderate walk you do daily beats a high-intensity workout you skip.",
    order: 5
  }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Calorie Burn Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate calories burned during exercise and daily activities</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Activity Details</h3>

            {/* Weight Input with Unit Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Your Weight</label>
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
                    min="30"
                    max="200"
                    step="0.5"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                ) : (
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                    min="60"
                    max="450"
                    step="1"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{weightLabel}</span>
              </div>
            </div>

            {/* Activity Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Category</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(activityCategories).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCategory(key);
                      setActivity(cat.activities[0].id);
                    }}
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-center ${
                      selectedCategory === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg sm:text-xl">{cat.icon}</div>
                    <div className="text-xs font-medium mt-1">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Activity</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {activityCategories[selectedCategory as keyof typeof activityCategories].activities.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => setActivity(act.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      activity === act.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{act.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">MET {act.met}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration: {duration} minutes</label>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 min</span>
                <span>1 hr</span>
                <span>3 hrs</span>
              </div>
            </div>

            {/* Intensity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intensity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {intensityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setIntensity(level.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      intensity === level.value
                        ? level.color === 'green' ? 'border-green-500 bg-green-50 text-green-700' :
                          level.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
                          'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs font-medium">{level.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{(level.value * 100).toFixed(0)}%</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {intensityLevels.find(l => l.value === intensity)?.description}
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Results</h3>

            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 sm:p-4 md:p-6 text-white text-center">
              <div className="text-sm opacity-80 mb-1">Total Calories Burned</div>
              <div className="text-4xl sm:text-5xl font-bold">{Math.round(results.caloriesBurned)}</div>
              <div className="text-sm opacity-80 mt-2">
                {duration} min of {getActivityName(activity)}
              </div>
            </div>

            {/* Secondary Results */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                <div className="text-xs opacity-80 mb-1">Per Minute</div>
                <div className="text-2xl font-bold">{results.caloriesPerMinute.toFixed(1)}</div>
                <div className="text-xs opacity-80">cal/min</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center">
                <div className="text-xs opacity-80 mb-1">Per Hour</div>
                <div className="text-2xl font-bold">{Math.round(results.caloriesPerHour)}</div>
                <div className="text-xs opacity-80">cal/hr</div>
              </div>
            </div>

            {/* Activity Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Activity Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-gray-600">Activity</span>
                  <span className="font-semibold">{getActivityName(activity)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-gray-600">Base MET Value</span>
                  <span className="font-semibold">{results.metValue}</span>
                </div>
<div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-gray-600">Adjusted MET</span>
                  <span className="font-semibold">{(results.metValue * intensity).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-gray-600">Intensity</span>
                  <span className="font-semibold">{(intensity * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Food Equivalents */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-yellow-800 mb-3">Food Equivalents Burned</h4>
              <div className="grid grid-cols-3 gap-2">
                {foodEquivalents.slice(0, 6).map((food) => (
                  <div key={food.name} className="text-center p-2 bg-white rounded-lg">
                    <div className="text-xl">{food.emoji}</div>
                    <div className="text-sm font-bold text-yellow-700">{food.amount.toFixed(1)}</div>
                    <div className="text-xs text-yellow-600">{food.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Projection */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2">Weekly Impact (5 days/week)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(weeklyCalories)}</div>
                  <div className="text-xs text-green-700">Calories/Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{monthlyWeightLoss.toFixed(1)} kg</div>
                  <div className="text-xs text-green-700">Monthly Loss</div>
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
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Understanding Calorie Burn and Exercise</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          Understanding how many calories you burn during exercise is essential for effective weight management and fitness planning. The calories you expend depend on multiple factors including your body weight, the type of activity, exercise duration, and intensity level. Our calculator uses MET (Metabolic Equivalent of Task) values - the scientific standard for measuring energy expenditure during physical activities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-100 text-center">
            <h3 className="font-semibold text-red-800 mb-1 text-sm">High Intensity</h3>
            <p className="text-xs text-red-700 font-medium">MET 10-15+</p>
            <p className="text-xs text-gray-600 mt-1">Running, HIIT, Jump rope - 10-15+ cal/min</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-100 text-center">
            <h3 className="font-semibold text-orange-800 mb-1 text-sm">Moderate Intensity</h3>
            <p className="text-xs text-orange-700 font-medium">MET 5-10</p>
            <p className="text-xs text-gray-600 mt-1">Cycling, swimming, sports - 5-10 cal/min</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-100 text-center">
            <h3 className="font-semibold text-yellow-800 mb-1 text-sm">Light Activity</h3>
            <p className="text-xs text-yellow-700 font-medium">MET 3-5</p>
            <p className="text-xs text-gray-600 mt-1">Walking, yoga, light weights - 3-5 cal/min</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100 text-center">
            <h3 className="font-semibold text-green-800 mb-1 text-sm">Very Light</h3>
            <p className="text-xs text-green-700 font-medium">MET 1-3</p>
            <p className="text-xs text-gray-600 mt-1">Stretching, standing work - 1-3 cal/min</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">How Calorie Burn is Calculated</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-3">Calorie burn calculations use the MET system developed by the American College of Sports Medicine:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">The Formula:</h4>
              <p className="font-mono text-sm bg-white p-3 rounded border">Calories = MET × Weight (kg) × Time (hours)</p>
              <p className="text-xs text-gray-500 mt-2">Example: Running (MET 10) × 70 kg × 0.5 hr = 350 calories</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">What is MET?</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• MET 1 = Energy at complete rest (sitting quietly)</li>
                <li>• MET 3 = 3× resting energy (light walking)</li>
                <li>• MET 10 = 10× resting energy (running)</li>
                <li>• Higher MET = more calories burned per minute</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Factors Affecting Calorie Burn</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Body Weight:</strong> Heavier individuals burn more calories doing the same activity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Muscle Mass:</strong> More muscle means higher calorie burn at all activity levels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Fitness Level:</strong> Trained individuals may burn fewer calories doing familiar activities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Age:</strong> Metabolism typically decreases with age, affecting calorie burn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span><strong>Intensity:</strong> Working harder (higher heart rate) burns significantly more calories</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Top Calorie-Burning Activities</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span className="text-gray-700">Running (8 mph)</span>
                <span className="font-medium text-red-600">~900 cal/hr</span>
              </div>
              <div className="flex justify-between p-2 bg-orange-50 rounded">
                <span className="text-gray-700">Jump Rope</span>
                <span className="font-medium text-orange-600">~800 cal/hr</span>
              </div>
              <div className="flex justify-between p-2 bg-yellow-50 rounded">
                <span className="text-gray-700">HIIT/CrossFit</span>
                <span className="font-medium text-yellow-600">~700 cal/hr</span>
              </div>
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span className="text-gray-700">Swimming (vigorous)</span>
                <span className="font-medium text-green-600">~500 cal/hr</span>
              </div>
              <div className="flex justify-between p-2 bg-blue-50 rounded">
                <span className="text-gray-700">Cycling (14-16 mph)</span>
                <span className="font-medium text-blue-600">~600 cal/hr</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">*Based on 70 kg (155 lb) person</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Tips for Maximizing Calorie Burn</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-red-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Add Interval Training</h4>
            <p className="text-xs text-gray-600">Alternating high and low intensity burns 25-30% more calories than steady-state exercise. Try 30 seconds hard, 30 seconds easy for 20-30 minutes.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Build Muscle</h4>
            <p className="text-xs text-gray-600">Each pound of muscle burns ~6 calories/day at rest. Strength training 2-3x weekly increases your 24-hour calorie burn, not just during exercise.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Increase NEAT</h4>
            <p className="text-xs text-gray-600">Non-Exercise Activity Thermogenesis (walking, stairs, fidgeting) can burn 200-500 extra calories daily. Take 10,000 steps and stand more often.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="calorie-burn-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This calculator provides estimates based on average MET values from the Compendium of Physical Activities.
              Actual calories burned vary based on individual factors including fitness level, body composition, age, and exercise form.
              For precise measurements, consider using a heart rate monitor. Consult a fitness professional for personalized exercise advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
