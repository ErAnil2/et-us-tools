'use client';

import { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: "What are daily calorie needs and how are they calculated?",
    answer: "Daily calorie needs represent the total energy your body requires over 24 hours to maintain vital functions, support daily activities, and achieve body composition goals. This calculation combines two primary components: Basal Metabolic Rate (BMR)—the calories burned at complete rest maintaining essential physiological processes like respiration, circulation, cellular metabolism, protein synthesis, and temperature regulation. BMR typically accounts for 60-75% of total daily energy expenditure and depends on age, gender, body weight, and body composition. The Mifflin-St Jeor equation is the most validated BMR formula: Men: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5. Women: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate are online calorie calculators?",
    answer: "Online calorie calculators provide reasonable estimates for approximately 70-80% of the population, typically accurate within ±10-20% of actual energy expenditure measured through gold-standard doubly labeled water methodology. However, several factors create individual variation affecting accuracy including formula limitations, activity level estimation errors, NEAT variation, and metabolic adaptation.",
    order: 2
  },
  {
    id: '3',
    question: "How many calories should I eat to lose weight safely?",
    answer: "Safe and sustainable weight loss requires a moderate calorie deficit that promotes fat loss while preserving muscle mass. A small deficit (250-300 calories below TDEE) produces 0.5 lb weekly loss. A moderate deficit (500 calories below TDEE) produces 1 lb weekly loss—the 'gold standard' recommended by most health organizations. Aggressive deficit (750-1,000 calories) produces 1.5-2 lbs weekly but carries higher risks.",
    order: 3
  },
  {
    id: '4',
    question: "Should I eat the same number of calories every day?",
    answer: "Whether to eat consistent daily calories or vary intake depends on training schedule, lifestyle, preferences, and specific goals. Both approaches work when total weekly calories align with objectives. Consistent daily intake offers simplicity and behavioral consistency, while calorie cycling can optimize both performance and body composition for athletes.",
    order: 4
  },
  {
    id: '5',
    question: "How do I know if my calorie target is working?",
    answer: "Determining whether your calorie target produces desired results requires systematic monitoring of multiple metrics over sufficient time periods. Track body weight daily or at least 3x weekly under consistent conditions, calculate weekly averages, and evaluate trends over 3-4 weeks before making adjustments.",
    order: 5
  }
];

export default function DailyCalorieNeedsCalculatorClient() {
  const [units, setUnits] = useState('metric');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [activityLevel, setActivityLevel] = useState(1.375);
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState<any>(null);

  const calculateCalories = () => {
    let weightKg = weight;
    let heightCm = height;

    if (units === 'imperial') {
      weightKg = weight * 0.453592;
      heightCm = height * 2.54;
    }

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    const tdee = bmr * activityLevel;

    let goalCalories = tdee;
    let adjustment = 0;
    let projectedText = '';

    switch (goal) {
      case 'maintain':
        adjustment = 0;
        projectedText = 'Maintain current weight';
        break;
      case 'lose-slow':
        adjustment = -250;
        goalCalories = tdee - 250;
        projectedText = 'Lose ~0.5 lbs per week (2 lbs per month)';
        break;
      case 'lose-moderate':
        adjustment = -500;
        goalCalories = tdee - 500;
        projectedText = 'Lose ~1 lb per week (4 lbs per month)';
        break;
      case 'lose-fast':
        adjustment = -1000;
        goalCalories = tdee - 1000;
        projectedText = 'Lose ~2 lbs per week (8 lbs per month)';
        break;
      case 'gain-slow':
        adjustment = 250;
        goalCalories = tdee + 250;
        projectedText = 'Gain ~0.5 lbs per week (2 lbs per month)';
        break;
      case 'gain-moderate':
        adjustment = 500;
        goalCalories = tdee + 500;
        projectedText = 'Gain ~1 lb per week (4 lbs per month)';
        break;
    }

    const recommendations = goal.includes('lose')
      ? 'Focus on protein (0.8-1g per lb), reduce processed foods, maintain strength training.'
      : goal.includes('gain')
      ? 'Increase protein intake (1g per lb), add calorie-dense foods, progressive overload training.'
      : 'Balanced macros: 30% protein, 35% carbs, 35% fats. Maintain current activity level.';

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      adjustment,
      projectedText,
      recommendations
    });
  };

  useEffect(() => {
    if (weight > 0 && height > 0 && age > 0) {
      calculateCalories();
    }
  }, [units, age, gender, weight, height, activityLevel, goal]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Daily Calorie Needs Calculator</h1>
        <p className="text-xl text-gray-600 mb-3 sm:mb-4 md:mb-6 max-w-3xl mx-auto">
          Calculate your Total Daily Energy Expenditure (TDEE) and maintenance calories to plan your nutrition goals.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Personal Information</h2>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Measurement Units</label>
              <div className="flex gap-4">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${units === 'metric' ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <input type="radio" checked={units === 'metric'} onChange={() => setUnits('metric')} className="mr-2 text-blue-600" />
                  <span className="font-medium">Metric (kg, cm)</span>
                </label>
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${units === 'imperial' ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <input type="radio" checked={units === 'imperial'} onChange={() => setUnits('imperial')} className="mr-2 text-blue-600" />
                  <span className="font-medium">Imperial (lbs, in)</span>
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} min="18" max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight ({units === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} step="0.1" min="30" max="300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height ({units === 'metric' ? 'cm' : 'inches'})
                </label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} step="0.1" min="120" max="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
              <div className="space-y-3">
                {[
                  { value: 1.2, label: 'Sedentary (1.2)', desc: 'Little or no exercise, desk job' },
                  { value: 1.375, label: 'Lightly Active (1.375)', desc: 'Light exercise 1-3 days per week' },
                  { value: 1.55, label: 'Moderately Active (1.55)', desc: 'Moderate exercise 3-5 days per week' },
                  { value: 1.725, label: 'Very Active (1.725)', desc: 'Hard exercise 6-7 days per week' },
                  { value: 1.9, label: 'Extremely Active (1.9)', desc: 'Very hard exercise, physical job or 2x/day training' }
                ].map((activity) => (
                  <label key={activity.value} className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${activityLevel === activity.value ? 'border-orange-500 bg-orange-50' : ''}`}>
                    <input type="radio" checked={activityLevel === activity.value} onChange={() => setActivityLevel(activity.value)} className="mr-3 text-orange-600" />
                    <div className="flex-1">
                      <div className="font-medium">{activity.label}</div>
                      <div className="text-sm text-gray-600">{activity.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Primary Goal</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="maintain">Maintain Weight</option>
                <option value="lose-slow">Lose Weight (0.5 lbs/week)</option>
                <option value="lose-moderate">Lose Weight (1 lb/week)</option>
                <option value="lose-fast">Lose Weight (2 lbs/week)</option>
                <option value="gain-slow">Gain Weight (0.5 lbs/week)</option>
                <option value="gain-moderate">Gain Weight (1 lb/week)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {results && (
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Your Daily Calorie Needs</h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 mb-1">{results.bmr}</div>
                  <div className="text-xs text-blue-700">BMR</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600 mb-1">{results.tdee}</div>
                  <div className="text-xs text-green-700">TDEE</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600 mb-1">{results.goalCalories}</div>
                  <div className="text-xs text-orange-700">Goal Calories</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600 mb-1">{results.adjustment >= 0 ? '+' : ''}{results.adjustment}</div>
                  <div className="text-xs text-purple-700">Daily Adjustment</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Projected Progress</h4>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="text-xs text-gray-700">{results.projectedText}</div>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Nutrition Recommendations</h4>
                <div className="text-xs text-gray-700">{results.recommendations}</div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-3">Tips for Success</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li>Track food intake with an app</li>
              <li>Weigh yourself weekly</li>
              <li>Adjust calories based on progress</li>
              <li>Focus on nutrient-dense foods</li>
              <li>Stay hydrated</li>
              <li>Get adequate sleep</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-blue-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">BMR - Basal Metabolic Rate</h3>
          <p className="text-sm text-blue-700">
            Calories your body burns at rest for basic functions like breathing, circulation, and cell production.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">TDEE - Total Daily Energy Expenditure</h3>
          <p className="text-sm text-green-700">
            BMR multiplied by activity factor. This is your maintenance calories - eat this amount to maintain current weight.
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-orange-800 mb-3">Calorie Deficit/Surplus</h3>
          <p className="text-sm text-orange-700">
            1 pound of fat = ~3,500 calories. Create a 500-calorie daily deficit to lose 1 lb/week, or surplus to gain weight.
          </p>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      <div className="mb-4 sm:mb-6 md:mb-8 mt-8">
        <FirebaseFAQs pageId="daily-calorie-needs-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
