'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';

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

export default function CaloriesBurnedCalculatorClient() {
  const fallbackFaqs = [
    {
      id: '1',
      question: "How accurate is the calories burned calculator?",
      answer: "The calories burned calculator uses scientifically validated MET (Metabolic Equivalent of Task) values to estimate energy expenditure. While it provides good estimates for average individuals, actual calorie burn can vary by 15-20% based on factors like fitness level, muscle mass, age, gender, and exercise intensity. For precise measurements, consider using a heart rate monitor or fitness tracker.",
      order: 1
    },
    {
      id: '2',
      question: "What are MET values and how do they work?",
      answer: "MET (Metabolic Equivalent of Task) is a standard unit that measures energy expenditure for different activities. 1 MET equals your resting metabolic rate. For example, an activity with 8 METs burns 8 times more calories than resting. Running at 8 mph has a MET of 8.0, while light walking has a MET of 2.5. The formula is: Calories Burned = MET × Weight (kg) × Duration (hours).",
      order: 2
    },
    {
      id: '3',
      question: "Which exercises burn the most calories?",
      answer: "High-intensity activities burn the most calories per minute. Running at 8-10 mph burns 400-600 cal/30min, followed by cycling fast (400-500 cal), swimming vigorously (400-480 cal), CrossFit (400-500 cal), and jump rope (350-400 cal). However, sustainability matters - moderate activities you can do longer may burn more total calories than brief high-intensity sessions.",
      order: 3
    },
    {
      id: '4',
      question: "How many calories should I burn daily for weight loss?",
      answer: "To lose 1 pound per week, you need a deficit of 500 calories per day (3,500 cal/week). This can be achieved through exercise alone (burning 500 cal), diet alone (eating 500 fewer calories), or a combination (burn 250 cal + eat 250 fewer). For sustainable weight loss of 1-2 lbs/week, aim for a daily deficit of 500-1,000 calories through diet and exercise combined.",
      order: 4
    },
    {
      id: '5',
      question: "Does body weight affect calories burned during exercise?",
      answer: "Yes, body weight significantly affects calorie burn. Heavier individuals burn more calories doing the same activity because more energy is required to move greater mass. For example, a 200 lb person burns approximately 33% more calories than a 150 lb person during the same 30-minute run. This is why the calculator requires your weight for accurate estimates.",
      order: 5
    },
    {
      id: '6',
      question: "Do I burn calories after exercise is over?",
      answer: "Yes, through EPOC (Excess Post-Exercise Oxygen Consumption), also called the 'afterburn effect.' After intense exercise, your metabolism remains elevated for hours as your body recovers. High-intensity activities like HIIT, sprinting, and heavy weightlifting create more afterburn (50-200 extra calories over 24 hours) than moderate cardio. This bonus isn't included in standard MET calculations.",
      order: 6
    }
  ];

  const relatedCalculators = [
    { href: "/us/tools/calculators/calorie-calculator", title: "Calorie Calculator", description: "Calculate daily calorie needs" },
    { href: "/us/tools/calculators/bmi-calculator", title: "BMI Calculator", description: "Calculate body mass index" },
    { href: "/us/tools/calculators/bmr-calculator", title: "BMR Calculator", description: "Basal metabolic rate" },
    { href: "/us/tools/calculators/walking-calorie-calculator", title: "Walking Calorie Calculator", description: "Calories burned walking" },
    { href: "/us/tools/calculators/steps-to-calories-calculator", title: "Steps to Calories", description: "Convert steps to calories" },
    { href: "/us/tools/calculators/body-fat-calculator", title: "Body Fat Calculator", description: "Estimate body fat percentage" }
  ];

  const [weight, setWeight] = useState(150);
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [activity, setActivity] = useState(8.0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [results, setResults] = useState<any>(null);

  const activities = [
    {
      label: 'Cardio Exercises',
      options: [
        { value: 8.0, label: 'Running (8 mph / 7.5 min mile)' },
        { value: 7.0, label: 'Running (7 mph / 8.5 min mile)' },
        { value: 6.0, label: 'Running (6 mph / 10 min mile)' },
        { value: 5.0, label: 'Running (5 mph / 12 min mile)' },
        { value: 11.5, label: 'Running (10 mph / 6 min mile)' },
        { value: 8.5, label: 'Cycling (16-19 mph)' },
        { value: 6.0, label: 'Cycling (12-14 mph)' },
        { value: 4.0, label: 'Cycling (10-12 mph)' },
        { value: 6.0, label: 'Swimming (moderate pace)' },
        { value: 8.0, label: 'Swimming (fast pace)' },
        { value: 7.0, label: 'Rowing machine (vigorous)' },
        { value: 4.5, label: 'Elliptical machine' },
        { value: 6.0, label: 'Jump rope' }
      ]
    },
    {
      label: 'Strength Training',
      options: [
        { value: 3.0, label: 'Weight lifting (light)' },
        { value: 5.0, label: 'Weight lifting (moderate)' },
        { value: 6.0, label: 'Weight lifting (vigorous)' },
        { value: 3.5, label: 'Bodyweight exercises' },
        { value: 8.0, label: 'CrossFit' },
        { value: 4.0, label: 'Circuit training' }
      ]
    },
    {
      label: 'Sports',
      options: [
        { value: 7.0, label: 'Basketball' },
        { value: 8.0, label: 'Soccer' },
        { value: 6.0, label: 'Tennis' },
        { value: 5.0, label: 'Badminton' },
        { value: 4.0, label: 'Volleyball' },
        { value: 3.0, label: 'Golf (walking)' },
        { value: 2.5, label: 'Golf (cart)' },
        { value: 6.0, label: 'Martial arts' }
      ]
    },
    {
      label: 'Daily Activities',
      options: [
        { value: 3.5, label: 'Walking (3.5 mph)' },
        { value: 2.5, label: 'Walking (2.5 mph)' },
        { value: 4.0, label: 'Walking (4 mph)' },
        { value: 4.5, label: 'Hiking' },
        { value: 2.5, label: 'Household chores' },
        { value: 3.0, label: 'Gardening' },
        { value: 2.0, label: 'Cooking' },
        { value: 1.5, label: 'Office work' },
        { value: 5.0, label: 'Construction work' },
        { value: 3.5, label: 'Dancing' }
      ]
    },
    {
      label: 'Other Activities',
      options: [
        { value: 7.0, label: 'Rock climbing' },
        { value: 5.0, label: 'Yoga (vigorous)' },
        { value: 2.5, label: 'Yoga (gentle)' },
        { value: 3.0, label: 'Pilates' },
        { value: 6.0, label: 'Kickboxing' },
        { value: 5.5, label: 'Aerobics' },
        { value: 4.0, label: 'Stairs climbing' }
      ]
    }
  ];

  const calculateCalories = () => {
    const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const totalHours = hours + (minutes / 60);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes === 0 || weight <= 0) {
      setResults(null);
      return;
    }

    const totalCalories = activity * weightKg * totalHours;
    const caloriesPerMinute = totalCalories / totalMinutes;
    const caloriesPerHour = activity * weightKg;

    const weeklyCalories = totalCalories * 3;
    const monthlyCalories = totalCalories * 12;
    const weightLossPerMonth = monthlyCalories / 3500;

    let durationText = '';
    if (hours > 0 && minutes > 0) {
      durationText = `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      durationText = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      durationText = `${minutes} minutes`;
    }

    setResults({
      totalCalories,
      caloriesPerMinute,
      caloriesPerHour,
      weeklyCalories,
      monthlyCalories,
      weightLossPerMonth,
      durationText,
      weightDisplay: `${weight} ${weightUnit}`
    });
  };

  useEffect(() => {
    calculateCalories();
  }, [weight, weightUnit, activity, hours, minutes]);

  const formatNumber = (num: number, decimals: number = 0) => {
    if (num === 0) return '0';
    return decimals > 0 ? num.toFixed(decimals) : Math.round(num).toLocaleString();
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Calories Burned Calculator Online</h1>
        <p className="text-lg text-gray-600">Calculate calories burned during exercise and daily activities based on your weight and duration</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body Weight</label>
              <div className="flex">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  step="1"
                  min="50"
                  placeholder="150"
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="px-2 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lbs">pounds</option>
                  <option value="kg">kilograms</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
              <select
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {activities.map((group, idx) => (
                  <optgroup key={idx} label={group.label}>
                    {group.options.map((option, optIdx) => (
                      <option key={optIdx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  min="0"
                  max="23"
                  placeholder="0"
                  className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="px-2 py-3 text-gray-700">hrs</span>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  min="0"
                  max="59"
                  placeholder="30"
                  className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="px-2 py-3 text-gray-700">mins</span>
              </div>
            </div>

            {/* Quick Duration Buttons */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Quick Duration</h4>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => { setHours(0); setMinutes(15); }} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">15 min</button>
                <button onClick={() => { setHours(0); setMinutes(30); }} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">30 min</button>
                <button onClick={() => { setHours(0); setMinutes(45); }} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">45 min</button>
                <button onClick={() => { setHours(1); setMinutes(0); }} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">1 hour</button>
              </div>
            </div>

            {/* Activity Info */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Activity Information</h4>
              <div className="text-yellow-700 text-sm">
                <p>MET Value: <span>{activity}</span></p>
                <p className="text-xs mt-1">MET = Metabolic Equivalent of Task</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Calories Burned</h3>

            <div className="space-y-4">
              <div className="bg-red-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">{results ? formatNumber(results.totalCalories) : '0'}</div>
                <div className="text-red-700">Total Calories</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Calories per minute:</span>
                  <span className="font-semibold">{results ? formatNumber(results.caloriesPerMinute, 1) : '0'}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Calories per hour:</span>
                  <span className="font-semibold">{results ? formatNumber(results.caloriesPerHour) : '0'}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total duration:</span>
                  <span className="font-semibold">{results ? results.durationText : '30 minutes'}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Body weight:</span>
                  <span className="font-semibold">{results ? results.weightDisplay : '150 lbs'}</span>
                </div>
              </div>

              {/* Weekly/Monthly Projections */}
              <div className="bg-green-100 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">If Done Regularly</h4>
                <div className="text-green-700 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>3x per week:</span>
                    <span className="font-semibold">{results ? formatNumber(results.weeklyCalories) : '0'} calories</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly (12x):</span>
                    <span className="font-semibold">{results ? formatNumber(results.monthlyCalories) : '0'} calories</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight loss potential:</span>
                    <span className="font-semibold">{results ? formatNumber(results.weightLossPerMonth, 1) : '0'} lbs/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Activity Comparison (30 minutes, 150 lbs)</h3>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">High Intensity (400+ cal/30min)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Running (8 mph)</span>
                <span className="font-semibold text-red-600">472 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>CrossFit</span>
                <span className="font-semibold text-red-600">472 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Swimming (fast)</span>
                <span className="font-semibold text-red-600">472 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Cycling (16-19 mph)</span>
                <span className="font-semibold text-red-600">502 cal</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Jump rope</span>
                <span className="font-semibold text-red-600">354 cal</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Moderate Intensity (200-400 cal/30min)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Basketball</span>
                <span className="font-semibold text-orange-600">413 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Tennis</span>
                <span className="font-semibold text-orange-600">354 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Weight lifting (vigorous)</span>
                <span className="font-semibold text-orange-600">354 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Hiking</span>
                <span className="font-semibold text-orange-600">266 cal</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Dancing</span>
                <span className="font-semibold text-orange-600">207 cal</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Light Intensity (100-200 cal/30min)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Walking (3.5 mph)</span>
                <span className="font-semibold text-green-600">207 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Yoga (gentle)</span>
                <span className="font-semibold text-green-600">148 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Household chores</span>
                <span className="font-semibold text-green-600">148 cal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Golf (cart)</span>
                <span className="font-semibold text-green-600">148 cal</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Office work</span>
                <span className="font-semibold text-green-600">89 cal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">About Calorie Calculation</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Calculation Formula:</h4>
            <p className="mb-2"><strong>Calories = MET × Weight (kg) × Duration (hours)</strong></p>
            <ul className="space-y-2">
              <li>• MET = Metabolic Equivalent of Task</li>
              <li>• Higher MET values = more intense activities</li>
              <li>• Calculations based on average metabolic rates</li>
              <li>• Individual results may vary by 15-20%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Important Notes:</h4>
            <ul className="space-y-2">
              <li>• Estimates are based on average values</li>
              <li>• Factors like fitness level affect actual burn</li>
              <li>• Age, gender, and muscle mass also matter</li>
              <li>• Use as a general guideline, not exact science</li>
              <li>• Combine with proper diet for weight management</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Calorie Burn During Exercise</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Understanding how many calories you burn during different activities is crucial for weight management, fitness planning, and achieving your health goals. Whether you're trying to lose weight, maintain your current weight, or build muscle while staying lean, knowing your calorie expenditure helps you balance energy intake with energy output. This comprehensive guide explains the science behind calorie burn, how different factors affect your metabolic rate, and strategies to maximize your workout efficiency.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <h3 className="font-semibold text-red-800 mb-2">MET System</h3>
            <p className="text-sm text-gray-600">The Metabolic Equivalent of Task (MET) is the gold standard for measuring activity intensity. It represents the ratio of your working metabolic rate to your resting metabolic rate, making it easy to compare different activities.</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2">Energy Balance</h3>
            <p className="text-sm text-gray-600">Weight loss occurs when calories burned exceed calories consumed (calorie deficit). Weight gain happens in calorie surplus. Maintaining weight requires energy balance where intake equals expenditure.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Individual Variation</h3>
            <p className="text-sm text-gray-600">Actual calorie burn varies by 15-20% between individuals based on genetics, fitness level, muscle mass, age, gender, and exercise efficiency. Use calculations as estimates, not absolutes.</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">Factors That Affect Calorie Burn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Body Composition & Physiology</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-blue-500">•</span>
                <div>
                  <strong>Body Weight:</strong> Heavier individuals burn more calories because moving greater mass requires more energy. A 200 lb person burns ~33% more than a 150 lb person doing the same activity.
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-blue-500">•</span>
                <div>
                  <strong>Muscle Mass:</strong> Muscle tissue burns more calories at rest and during activity than fat tissue. More muscular individuals have higher metabolic rates.
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-blue-500">•</span>
                <div>
                  <strong>Age:</strong> Metabolism naturally decreases with age due to muscle loss and hormonal changes, reducing calorie burn by 2-8% per decade after age 30.
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-blue-500">•</span>
                <div>
                  <strong>Gender:</strong> Men typically burn 5-10% more calories than women due to higher muscle mass and testosterone levels.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Exercise & Activity Factors</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-500">•</span>
                <div>
                  <strong>Intensity:</strong> Higher intensity activities have higher MET values and burn significantly more calories per minute. Sprinting (15 MET) burns 6x more than walking (2.5 MET).
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-500">•</span>
                <div>
                  <strong>Duration:</strong> Total calorie burn increases linearly with time. Moderate activities done longer can burn more total calories than brief intense sessions.
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-500">•</span>
                <div>
                  <strong>Fitness Level:</strong> Trained individuals often burn fewer calories doing the same activity because their bodies become more efficient. However, they can work at higher intensities.
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-green-500">•</span>
                <div>
                  <strong>Environmental Conditions:</strong> Extreme temperatures, altitude, and terrain (hills, sand, water) increase energy expenditure by 10-30%.
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">Maximizing Calorie Burn Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">High-Intensity Interval Training</h4>
            <p className="text-sm text-gray-600">HIIT alternates intense bursts with recovery periods, burning 25-30% more calories than steady-state cardio in the same time. Plus, it creates significant afterburn (EPOC) for hours post-workout.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Combine Cardio & Strength</h4>
            <p className="text-sm text-gray-600">Strength training builds muscle, which increases resting metabolic rate permanently. Combining weights with cardio burns calories during and after exercise while preserving muscle mass during weight loss.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Progressive Overload</h4>
            <p className="text-sm text-gray-600">Gradually increase intensity, duration, or frequency to prevent plateaus. Your body adapts to exercise, becoming more efficient and burning fewer calories over time unless you progress the challenge.</p>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="calories-burned-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">🔥</div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Medical Disclaimer</h3>
            <p className="text-sm text-amber-700">
              This calculator provides estimates based on standard MET values and should not replace professional medical advice.
              Individual calorie burn varies based on numerous factors. Always consult with a healthcare provider or certified fitness professional
              before starting any new exercise program, especially if you have pre-existing health conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
