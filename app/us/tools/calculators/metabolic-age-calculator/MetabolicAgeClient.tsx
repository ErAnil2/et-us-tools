'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Metabolic Age Calculator?",
    answer: "A Metabolic Age Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is the date calculation?",
    answer: "Our calculator accounts for leap years, varying month lengths, and other calendar complexities to provide accurate results. It uses the Gregorian calendar system.",
    order: 2
  },
  {
    id: '3',
    question: "What date formats are supported?",
    answer: "The calculator accepts common date formats and displays results in an easy-to-understand format. Simply enter dates in the format shown in the input fields.",
    order: 3
  },
  {
    id: '4',
    question: "Can I calculate dates far in the future or past?",
    answer: "Yes, the calculator can handle dates spanning many years. It's useful for planning, historical research, or any date-related calculations you need.",
    order: 4
  },
  {
    id: '5',
    question: "Is timezone considered in calculations?",
    answer: "Date calculations are based on calendar dates. For time-specific calculations, ensure you're considering your local timezone for the most accurate results.",
    order: 5
  }
];

export default function MetabolicAgeClient() {
  const { getH1, getSubHeading } = usePageSEO('metabolic-age-calculator');

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [bodyFat, setBodyFat] = useState(20);

  const [results, setResults] = useState({
    metabolicAge: 0,
    bmr: 0,
    ageDifference: 0,
    category: ''
  });

  useEffect(() => {
    calculateMetabolicAge();
  }, [gender, age, weight, height, activityLevel, bodyFat]);

  const calculateMetabolicAge = () => {
    // Calculate BMR using Mifflin-St Jeor equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Adjust BMR based on body fat percentage
    const leanMass = weight * (1 - bodyFat / 100);
    const adjustedBMR = 370 + (21.6 * leanMass);

    // Activity level multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.0,
      light: 1.1,
      moderate: 1.2,
      active: 1.3,
      veryActive: 1.4
    };

    const activityFactor = activityMultipliers[activityLevel] || 1.2;

    // Calculate metabolic age based on comparison to average BMR for age
    // Average BMR decreases by about 2% per decade after age 20
    const baselineBMRForAge = gender === 'male'
      ? 1800 - (age - 25) * 8
      : 1400 - (age - 25) * 6;

    const bmrRatio = adjustedBMR / baselineBMRForAge;
    const metabolicAge = Math.round(age - (bmrRatio - 1) * 20 * activityFactor);

    const ageDiff = age - metabolicAge;
    let category = '';
    if (ageDiff >= 5) category = 'Excellent - You are metabolically younger!';
    else if (ageDiff >= 0) category = 'Good - Your metabolic age matches your actual age';
    else if (ageDiff >= -5) category = 'Fair - Slight room for improvement';
    else category = 'Needs Attention - Consider lifestyle changes';

    setResults({
      metabolicAge: Math.max(15, Math.min(80, metabolicAge)),
      bmr: Math.round(adjustedBMR),
      ageDifference: ageDiff,
      category
    });
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/bmr-calculator', title: 'BMR Calculator', description: 'Calculate basal metabolic rate' },
    { href: '/us/tools/calculators/body-fat-calculator', title: 'Body Fat Calculator', description: 'Calculate body fat percentage' },
    { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index' },
    { href: '/us/tools/calculators/calorie-calculator', title: 'Calorie Calculator', description: 'Calculate daily calorie needs' },
    { href: '/us/tools/calculators/ideal-weight-calculator', title: 'Ideal Weight Calculator', description: 'Find your ideal weight' },
    { href: '/us/tools/calculators/bmr-vs-tdee-calculator', title: 'TDEE Calculator', description: 'Total daily energy expenditure' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Metabolic Age Calculator')}</h1>
        <p className="text-lg text-gray-600">Compare your metabolic age to your chronological age</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} className="form-radio text-blue-600" />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} className="form-radio text-blue-600" />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age: {age} years</label>
              <input type="range" min="15" max="80" value={age} onChange={(e) => setAge(parseInt(e.target.value))} className="w-full h-2 bg-blue-200 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight: {weight} kg</label>
              <input type="range" min="40" max="150" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} className="w-full h-2 bg-green-200 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height: {height} cm</label>
              <input type="range" min="140" max="210" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className="w-full h-2 bg-purple-200 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat: {bodyFat}%</label>
              <input type="range" min="5" max="50" value={bodyFat} onChange={(e) => setBodyFat(parseInt(e.target.value))} className="w-full h-2 bg-orange-200 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
              <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Very Active (6-7 days/week)</option>
                <option value="veryActive">Extra Active (athlete level)</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your Results</h2>

            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-4">
              <div className="text-sm text-blue-600 mb-1">Metabolic Age</div>
              <div className="text-5xl font-bold text-blue-700">{results.metabolicAge} years</div>
              <div className="text-sm text-blue-600 mt-2">vs. Chronological Age: {age} years</div>
            </div>

            <div className={`p-4 rounded-lg mb-4 ${results.ageDifference >= 0 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
              <div className="text-sm font-medium mb-1">Age Difference</div>
              <div className={`text-2xl font-bold ${results.ageDifference >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {results.ageDifference > 0 ? '+' : ''}{results.ageDifference} years
              </div>
              <div className="text-sm mt-2">{results.category}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Your BMR</div>
              <div className="text-xl font-bold text-gray-800">{results.bmr} calories/day</div>
              <p className="text-xs text-gray-500 mt-1">Basal Metabolic Rate at rest</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">🧮</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="metabolic-age-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
