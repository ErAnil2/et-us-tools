'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
const fallbackFaqs = [
  {
    id: '1',
    question: "What is the difference between BMR and TDEE?",
    answer: "BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest to maintain basic life functions like breathing, circulation, and cell production. TDEE (Total Daily Energy Expenditure) includes BMR plus all calories burned through physical activity, exercise, digestion, and daily movements. TDEE is typically 20-100% higher than BMR depending on activity level.",
    order: 1
  },
  {
    id: '2',
    question: "Which BMR formula is most accurate?",
    answer: "The Mifflin-St Jeor equation is considered the most accurate for the general population. The Katch-McArdle formula is most accurate for lean, athletic individuals when body fat percentage is known. The Harris-Benedict equation, while widely used, tends to overestimate by about 5%.",
    order: 2
  },
  {
    id: '3',
    question: "How many calories below TDEE should I eat to lose weight?",
    answer: "A deficit of 300-500 calories below TDEE typically results in 0.5-1 lb of weight loss per week, which is considered safe and sustainable. Never consistently eat below your BMR, as this can lead to muscle loss, metabolic slowdown, and nutrient deficiencies. A 500-calorie daily deficit equals about 1 lb per week.",
    order: 3
  },
  {
    id: '4',
    question: "Why does my TDEE decrease when I lose weight?",
    answer: "TDEE decreases with weight loss for several reasons: 1) Your body has less mass to maintain, lowering BMR, 2) You burn fewer calories moving a lighter body, 3) Metabolic adaptation occurs where your body becomes more efficient. This is why recalculating TDEE every 10-15 lbs lost is recommended.",
    order: 4
  },
  {
    id: '5',
    question: "How do I know which activity level to select?",
    answer: "Sedentary: Desk job with no exercise. Light Active: Light exercise 1-3 days/week or walking. Moderate: Exercise 3-5 days/week at moderate intensity. Very Active: Hard exercise 6-7 days/week. Extremely Active: Very intense daily exercise plus physical job. When in doubt, choose a lower level and adjust based on results.",
    order: 5
  },
  {
    id: '6',
    question: "Can I eat at my BMR level to lose weight faster?",
    answer: "Eating at BMR is not recommended as a long-term strategy. While you may lose weight initially, your body will adapt by slowing metabolism, losing muscle mass, and becoming more efficient. This leads to plateaus and makes future weight management harder. Aim for a moderate deficit of 300-500 calories below TDEE instead.",
    order: 6
  }
];

const relatedCalculators = [
  { href: "/us/tools/calculators/bmr-calculator", title: "BMR Calculator", description: "Calculate basal metabolic rate" },
  { href: "/us/tools/calculators/calorie-calculator", title: "Calorie Calculator", description: "Daily calorie needs" },
  { href: "/us/tools/calculators/macro-calculator", title: "Macro Calculator", description: "Calculate macronutrients" },
  { href: "/us/tools/calculators/body-fat-calculator", title: "Body Fat Calculator", description: "Estimate body fat %" },
  { href: "/us/tools/calculators/ideal-weight-calculator", title: "Ideal Weight", description: "Find ideal body weight" },
  { href: "/us/tools/calculators/bmi-calculator", title: "BMI Calculator", description: "Calculate body mass index" }
];

export default function BMRvsTDEEClient() {
  const { getH1, getSubHeading } = usePageSEO('bmr-vs-tdee-calculator');

  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(9);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [bmrFormula, setBmrFormula] = useState<'mifflin' | 'harris' | 'katch'>('mifflin');
  const [bodyFat, setBodyFat] = useState(15);
  const [fitnessGoal, setFitnessGoal] = useState<'maintain' | 'lose' | 'gain' | 'recomp'>('lose');
  const [weightGoal, setWeightGoal] = useState(-1);

  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('lbs');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('ft');

  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [goalCalories, setGoalCalories] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    calculateBMRTDEE();
  }, [age, gender, weight, height, feet, inches, activityLevel, bmrFormula, bodyFat, fitnessGoal, weightGoal, weightUnit, heightUnit]);

  const toggleWeightUnit = () => {
    if (weightUnit === 'kg') {
      setWeight(parseFloat((weight * 2.20462).toFixed(1)));
      setWeightUnit('lbs');
    } else {
      setWeight(parseFloat((weight / 2.20462).toFixed(1)));
      setWeightUnit('kg');
    }
  };

  const toggleHeightUnit = () => {
    if (heightUnit === 'cm') {
      const totalInches = height / 2.54;
      setFeet(Math.floor(totalInches / 12));
      setInches(Math.round(totalInches % 12));
      setHeightUnit('ft');
    } else {
      setHeight(parseFloat(((feet * 12 + inches) * 2.54).toFixed(1)));
      setHeightUnit('cm');
    }
  };

  const calculateBMRTDEE = () => {
    if (!age || !weight || (!height && heightUnit === 'cm') || age < 15 || age > 100) {
      return;
    }

    let weightKg = weightUnit === 'lbs' ? weight / 2.20462 : weight;
    let heightCm = heightUnit === 'cm' ? height : (feet * 12 + inches) * 2.54;

    let calculatedBmr = 0;

    switch (bmrFormula) {
      case 'mifflin':
        if (gender === 'male') {
          calculatedBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
        } else {
          calculatedBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
        }
        break;

      case 'harris':
        if (gender === 'male') {
          calculatedBmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
        } else {
          calculatedBmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
        }
        break;

      case 'katch':
        if (bodyFat > 0) {
          const leanMass = weightKg * (1 - bodyFat / 100);
          calculatedBmr = 370 + (21.6 * leanMass);
        }
        break;
    }

    const calculatedTdee = calculatedBmr * activityLevel;
    const caloriesPerPound = 3500;
    const weeklyCalorieAdjustment = weightGoal * caloriesPerPound;
    const dailyCalorieAdjustment = weeklyCalorieAdjustment / 7;
    const calculatedGoalCalories = calculatedTdee + dailyCalorieAdjustment;

    setBmr(calculatedBmr);
    setTdee(calculatedTdee);
    setGoalCalories(calculatedGoalCalories);
    setShowResults(true);
  };

  const getMacros = () => {
    let proteinRatio = 0.25, carbRatio = 0.45, fatRatio = 0.30;

    switch (fitnessGoal) {
      case 'lose':
        proteinRatio = 0.30; carbRatio = 0.35; fatRatio = 0.35;
        break;
      case 'gain':
        proteinRatio = 0.25; carbRatio = 0.45; fatRatio = 0.30;
        break;
      case 'recomp':
        proteinRatio = 0.35; carbRatio = 0.35; fatRatio = 0.30;
        break;
    }

    const proteinGrams = Math.round((goalCalories * proteinRatio) / 4);
    const carbGrams = Math.round((goalCalories * carbRatio) / 4);
    const fatGrams = Math.round((goalCalories * fatRatio) / 9);

    return { proteinGrams, carbGrams, fatGrams, proteinRatio, carbRatio, fatRatio };
  };

  const getGoalInfo = () => {
    const goals = {
      maintain: { description: 'Maintain Weight', color: 'blue' },
      lose: { description: 'Weight Loss', color: 'red' },
      gain: { description: 'Weight Gain', color: 'green' },
      recomp: { description: 'Body Recomposition', color: 'purple' }
    };
    return goals[fitnessGoal];
  };

  const macros = getMacros();
  const goalInfo = getGoalInfo();

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "BMR vs TDEE Calculator",
        "description": "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to understand your metabolism and optimize your nutrition.",
        "url": "https://economictimes.indiatimes.com/us/tools/calculators/bmr-vs-tdee-calculator",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "permissions": "browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": fallbackFaqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://economictimes.indiatimes.com/us"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://economictimes.indiatimes.com/us/tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Calculators",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "BMR vs TDEE Calculator",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators/bmr-vs-tdee-calculator"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{getH1('BMR vs TDEE Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to understand your metabolism and optimize your nutrition and fitness goals.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Enter Your Details</h2>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGender('male')}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                      gender === 'male'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                      gender === 'female'
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="15"
                  max="100"
                />
              </div>

              {/* Weight */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Weight</label>
                  <button onClick={toggleWeightUnit} className="text-sm text-blue-600 hover:text-blue-800">
                    Switch to {weightUnit === 'kg' ? 'lbs' : 'kg'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{weightUnit}</span>
                </div>
              </div>

              {/* Height */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Height</label>
                  <button onClick={toggleHeightUnit} className="text-sm text-blue-600 hover:text-blue-800">
                    Switch to {heightUnit === 'cm' ? 'ft/in' : 'cm'}
                  </button>
                </div>
                {heightUnit === 'cm' ? (
                  <div className="relative">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">cm</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        value={feet}
                        onChange={(e) => setFeet(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={inches}
                        onChange={(e) => setInches(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">in</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1.2">Sedentary (little or no exercise)</option>
                  <option value="1.375">Lightly Active (1-3 days/week)</option>
                  <option value="1.55">Moderately Active (3-5 days/week)</option>
                  <option value="1.725">Very Active (6-7 days/week)</option>
                  <option value="1.9">Extremely Active (very intense/physical job)</option>
                </select>
              </div>

              {/* BMR Formula */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BMR Formula</label>
                <select
                  value={bmrFormula}
                  onChange={(e) => setBmrFormula(e.target.value as 'mifflin' | 'harris' | 'katch')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
                  <option value="harris">Harris-Benedict</option>
                  <option value="katch">Katch-McArdle (requires body fat %)</option>
                </select>
              </div>

              {/* Body Fat % (for Katch-McArdle) */}
              {bmrFormula === 'katch' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat %</label>
                  <input
                    type="number"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="50"
                  />
                </div>
              )}

              {/* Fitness Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goal</label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => {
                    const goal = e.target.value as 'maintain' | 'lose' | 'gain' | 'recomp';
                    setFitnessGoal(goal);
                    if (goal === 'maintain') setWeightGoal(0);
                    else if (goal === 'lose') setWeightGoal(-1);
                    else if (goal === 'gain') setWeightGoal(1);
                    else setWeightGoal(0);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="maintain">Maintain Weight</option>
                  <option value="lose">Lose Weight</option>
                  <option value="gain">Gain Weight/Muscle</option>
                  <option value="recomp">Body Recomposition</option>
                </select>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Your Results</h2>

              {/* BMR Result */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Basal Metabolic Rate (BMR)</div>
                <div className="text-4xl font-bold text-blue-700">{Math.round(bmr).toLocaleString()}</div>
                <div className="text-sm text-blue-600">calories/day</div>
                <p className="text-xs text-gray-600 mt-2">Calories burned at rest to maintain basic body functions</p>
              </div>

              {/* TDEE Result */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="text-sm text-green-600 font-medium">Total Daily Energy Expenditure (TDEE)</div>
                <div className="text-4xl font-bold text-green-700">{Math.round(tdee).toLocaleString()}</div>
                <div className="text-sm text-green-600">calories/day</div>
                <p className="text-xs text-gray-600 mt-2">Total calories burned including activity level</p>
              </div>

              {/* Goal Calories */}
              <div className={`bg-gradient-to-br rounded-xl p-6 border-2 ${
                fitnessGoal === 'lose' ? 'from-red-50 to-orange-50 border-red-200' :
                fitnessGoal === 'gain' ? 'from-purple-50 to-pink-50 border-purple-200' :
                'from-gray-50 to-slate-50 border-gray-200'
              }`}>
                <div className={`text-sm font-medium ${
                  fitnessGoal === 'lose' ? 'text-red-600' :
                  fitnessGoal === 'gain' ? 'text-purple-600' :
                  'text-gray-600'
                }`}>Target Calories ({goalInfo.description})</div>
                <div className={`text-4xl font-bold ${
                  fitnessGoal === 'lose' ? 'text-red-700' :
                  fitnessGoal === 'gain' ? 'text-purple-700' :
                  'text-gray-700'
                }`}>{Math.round(goalCalories).toLocaleString()}</div>
                <div className={`text-sm ${
                  fitnessGoal === 'lose' ? 'text-red-600' :
                  fitnessGoal === 'gain' ? 'text-purple-600' :
                  'text-gray-600'
                }`}>calories/day</div>
              </div>

              {/* Macros */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Macros</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{macros.proteinGrams}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{macros.carbGrams}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{macros.fatGrams}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MREC Banners */}
        <CalculatorAfterCalcBanners />

        {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm mb-1">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding BMR vs TDEE: Your Complete Guide to Metabolism</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Understanding the difference between BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure) is fundamental to achieving any fitness goal. While BMR represents the calories your body burns at complete rest to maintain essential functions, TDEE accounts for all energy expenditure throughout the day, including physical activity, exercise, and digestion. Knowing these numbers allows you to create precise nutrition plans tailored to your specific goals, whether that's weight loss, muscle gain, or body recomposition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2 text-sm">Basal Metabolic Rate (BMR)</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Calories burned at complete rest</li>
                <li>• Maintains basic life functions</li>
                <li>• Breathing, circulation, cell production</li>
                <li>• Represents 60-75% of total calories</li>
                <li>• Doesn't include any activity</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-semibold text-green-800 mb-2 text-sm">Total Daily Energy Expenditure</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Total calories burned per day</li>
                <li>• BMR + activity + exercise + digestion</li>
                <li>• Varies based on lifestyle</li>
                <li>• 20-100% higher than BMR</li>
                <li>• Used for calorie planning</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2 text-sm">Key Difference</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• BMR = Calories at complete rest</li>
                <li>• TDEE = BMR × activity multiplier</li>
                <li>• TDEE is always higher than BMR</li>
                <li>• Never eat below BMR long-term</li>
                <li>• Use TDEE for diet planning</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">BMR Calculation Methods Explained</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Mifflin-St Jeor Equation (Recommended)</h4>
                <p className="text-xs text-gray-600 mb-2">The most accurate formula for the general population, developed in 1990. It accounts for gender differences in metabolic rate.</p>
                <div className="font-mono text-xs bg-white p-3 rounded border">
                  <div>Men: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5</div>
                  <div>Women: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Harris-Benedict Equation</h4>
                <p className="text-xs text-gray-600 mb-2">Originally developed in 1919, revised in 1984. Tends to overestimate BMR by about 5% but widely used.</p>
                <div className="font-mono text-xs bg-white p-3 rounded border">
                  <div>Men: BMR = 88.362 + (13.397 × weight_kg) + (4.799 × height_cm) - (5.677 × age)</div>
                  <div>Women: BMR = 447.593 + (9.247 × weight_kg) + (3.098 × height_cm) - (4.330 × age)</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Katch-McArdle Formula (For Athletes)</h4>
                <p className="text-xs text-gray-600 mb-2">Most accurate when body fat percentage is known. Based on lean body mass rather than total weight.</p>
                <div className="font-mono text-xs bg-white p-3 rounded border">
                  BMR = 370 + (21.6 × lean_mass_kg)
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity Level Multipliers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Sedentary (1.2):</strong> Desk job, minimal exercise, mostly sitting throughout the day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Lightly Active (1.375):</strong> Light exercise 1-3 days/week, some walking daily</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Moderately Active (1.55):</strong> Moderate exercise 3-5 days/week, active lifestyle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Very Active (1.725):</strong> Hard exercise 6-7 days/week, physically demanding job</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Extremely Active (1.9):</strong> Intense daily training plus physical labor, athlete-level activity</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use Your TDEE</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Weight Loss:</strong> Eat 300-500 calories below TDEE for safe 0.5-1 lb/week loss</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Maintenance:</strong> Eat at your TDEE to maintain current weight</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Muscle Gain:</strong> Eat 200-400 calories above TDEE for lean bulking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Recomposition:</strong> Eat at TDEE with high protein (0.8-1g per lb bodyweight)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Recalculate:</strong> Update TDEE every 10-15 lbs of weight change</span>
                </li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Factors That Affect Your Metabolism</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Body Composition</h4>
              <p className="text-xs text-gray-600">Muscle tissue burns 3x more calories than fat tissue at rest. Higher muscle mass means higher BMR. This is why strength training is crucial for long-term weight management.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 text-sm">Age & Gender</h4>
              <p className="text-xs text-gray-600">Metabolism naturally decreases 1-2% per decade after age 30 due to muscle loss. Men typically have 5-10% higher BMR than women due to greater muscle mass.</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Genetics & Hormones</h4>
              <p className="text-xs text-gray-600">Thyroid hormones, testosterone, and genetic factors can affect BMR by 10-20%. Conditions like hypothyroidism can significantly lower metabolic rate.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2 text-sm">Climate & Temperature</h4>
              <p className="text-xs text-gray-600">Extreme temperatures increase energy expenditure. Your body burns extra calories maintaining core temperature in very hot or cold environments.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2 text-sm">Metabolic Adaptation</h4>
              <p className="text-xs text-gray-600">Long-term calorie restriction causes your body to adapt by lowering BMR by 5-15%. This is why extreme dieting leads to plateaus and why diet breaks are important.</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <h4 className="font-semibold text-pink-800 mb-2 text-sm">Sleep & Stress</h4>
              <p className="text-xs text-gray-600">Poor sleep and chronic stress increase cortisol, which can lower BMR and increase fat storage. Aim for 7-9 hours of quality sleep for optimal metabolic function.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips for Optimizing Your Metabolism</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Build & Preserve Muscle</h4>
              <p className="text-xs text-gray-600">Engage in resistance training 3-5x per week. Each pound of muscle burns 6-10 calories per day at rest. Prioritize protein intake (0.8-1g per lb bodyweight) to support muscle maintenance and growth.</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2 text-sm">Stay Active Throughout the Day</h4>
              <p className="text-xs text-gray-600">NEAT (Non-Exercise Activity Thermogenesis) can account for 15-30% of TDEE. Take walking breaks, use stairs, fidget, and maintain an active lifestyle beyond structured exercise.</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-2 text-sm">Avoid Extreme Deficits</h4>
              <p className="text-xs text-gray-600">Never consistently eat below your BMR. Aggressive calorie restriction triggers metabolic adaptation, muscle loss, and hormonal disruption. Aim for moderate deficits of 300-500 calories for sustainable fat loss.</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-orange-800 mb-2 text-sm">Track & Adjust Regularly</h4>
              <p className="text-xs text-gray-600">Monitor your weight and measurements weekly. If progress stalls for 2-3 weeks, recalculate your TDEE. As you lose or gain weight, your energy needs change and require adjustment.</p>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQs Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="bmr-vs-tdee-calculator" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </div>
  );
}

