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
  icon: string;
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

export default function BMICalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('bmi-calculator');

  const [heightUnit, setHeightUnit] = useState<HeightUnit>('ft');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(25);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(7);
  const [heightCm, setHeightCm] = useState(170);
  const [weightLbs, setWeightLbs] = useState(154);
  const [weightKg, setWeightKg] = useState(70);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [bmi, setBmi] = useState(0);
  const [bmiPrime, setBmiPrime] = useState(0);
  const [category, setCategory] = useState('Normal Weight');
  const [categoryColor, setCategoryColor] = useState('green');
  const [healthyWeightRange, setHealthyWeightRange] = useState({ min: 0, max: 0 });
  const [weightChange, setWeightChange] = useState(0);
  const [fatMass, setFatMass] = useState(0);
  const [leanMass, setLeanMass] = useState(0);

  useEffect(() => {
    calculateBMI();
  }, [heightUnit, weightUnit, gender, age, feet, inches, heightCm, weightLbs, weightKg]);

  const calculateBMI = () => {
    let heightInMeters: number;
    let weightInKg: number;

    // Calculate height in meters based on selected unit
    if (heightUnit === 'ft') {
      const totalInches = feet * 12 + inches;
      heightInMeters = totalInches * 0.0254;
    } else {
      heightInMeters = heightCm / 100;
    }

    // Calculate weight in kg based on selected unit
    if (weightUnit === 'lbs') {
      weightInKg = weightLbs * 0.453592;
    } else {
      weightInKg = weightKg;
    }

    if (heightInMeters <= 0 || weightInKg <= 0) return;

    const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
    setBmi(parseFloat(calculatedBMI.toFixed(1)));

    // BMI Prime (ratio to upper limit of normal BMI)
    const prime = calculatedBMI / 25;
    setBmiPrime(parseFloat(prime.toFixed(2)));

    // Determine category
    let cat = '';
    let color = '';
    if (calculatedBMI < 16) {
      cat = 'Severe Thinness';
      color = 'red';
    } else if (calculatedBMI < 17) {
      cat = 'Moderate Thinness';
      color = 'orange';
    } else if (calculatedBMI < 18.5) {
      cat = 'Mild Thinness';
      color = 'yellow';
    } else if (calculatedBMI < 25) {
      cat = 'Normal Weight';
      color = 'green';
    } else if (calculatedBMI < 30) {
      cat = 'Overweight';
      color = 'yellow';
    } else if (calculatedBMI < 35) {
      cat = 'Obese Class I';
      color = 'orange';
    } else if (calculatedBMI < 40) {
      cat = 'Obese Class II';
      color = 'red';
    } else {
      cat = 'Obese Class III';
      color = 'red';
    }
    setCategory(cat);
    setCategoryColor(color);

    // Calculate healthy weight range
    const minHealthyWeight = 18.5 * (heightInMeters * heightInMeters);
    const maxHealthyWeight = 24.9 * (heightInMeters * heightInMeters);

    // Display in user's selected weight unit
    if (weightUnit === 'lbs') {
      setHealthyWeightRange({
        min: Math.round(minHealthyWeight * 2.20462),
        max: Math.round(maxHealthyWeight * 2.20462)
      });
      if (calculatedBMI < 18.5) {
        setWeightChange(Math.round((minHealthyWeight - weightInKg) * 2.20462));
      } else if (calculatedBMI > 24.9) {
        setWeightChange(-Math.round((weightInKg - maxHealthyWeight) * 2.20462));
      } else {
        setWeightChange(0);
      }
    } else {
      setHealthyWeightRange({
        min: Math.round(minHealthyWeight),
        max: Math.round(maxHealthyWeight)
      });
      if (calculatedBMI < 18.5) {
        setWeightChange(Math.round(minHealthyWeight - weightInKg));
      } else if (calculatedBMI > 24.9) {
        setWeightChange(-Math.round(weightInKg - maxHealthyWeight));
      } else {
        setWeightChange(0);
      }
    }

    // Estimate body composition (rough estimate based on BMI)
    let estimatedBodyFatPercent = 0;
    if (gender === 'male') {
      estimatedBodyFatPercent = (1.20 * calculatedBMI) + (0.23 * age) - 16.2;
    } else {
      estimatedBodyFatPercent = (1.20 * calculatedBMI) + (0.23 * age) - 5.4;
    }
    estimatedBodyFatPercent = Math.max(5, Math.min(60, estimatedBodyFatPercent));

    const fatMassCalc = weightInKg * (estimatedBodyFatPercent / 100);
    const leanMassCalc = weightInKg - fatMassCalc;

    if (weightUnit === 'lbs') {
      setFatMass(Math.round(fatMassCalc * 2.20462));
      setLeanMass(Math.round(leanMassCalc * 2.20462));
    } else {
      setFatMass(Math.round(fatMassCalc));
      setLeanMass(Math.round(leanMassCalc));
    }
  };

  const getCategoryStyles = () => {
    switch (categoryColor) {
      case 'yellow':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'green':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'orange':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'red':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getBMIPosition = () => {
    const minBMI = 15;
    const maxBMI = 40;
    const position = ((bmi - minBMI) / (maxBMI - minBMI)) * 100;
    return Math.min(Math.max(position, 0), 100);
  };

  const weightLabel = weightUnit === 'lbs' ? 'lbs' : 'kg';

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is BMI and how is it calculated?",
      answer: "BMI (Body Mass Index) is a measure of body fat based on height and weight. It's calculated by dividing your weight in kilograms by your height in meters squared (kg/m²). For example, if you weigh 70 kg and are 1.75 m tall, your BMI = 70 ÷ (1.75 × 1.75) = 22.9. BMI provides a simple screening tool to categorize weight status.",
    order: 1
  },
    {
    id: '2',
    question: "What are the BMI categories and their health implications?",
      answer: "BMI categories are: Underweight (< 18.5) - may indicate malnutrition or health issues; Normal (18.5-24.9) - associated with lowest health risks; Overweight (25-29.9) - increased risk of heart disease and diabetes; Obese Class I (30-34.9), Class II (35-39.9), and Class III (40+) - progressively higher risks for chronic conditions including hypertension, type 2 diabetes, and cardiovascular disease.",
    order: 2
  },
    {
    id: '3',
    question: "Is BMI accurate for everyone?",
      answer: "BMI has limitations. It doesn't distinguish between muscle and fat mass, so athletes may be classified as overweight despite low body fat. It also doesn't account for age-related muscle loss, bone density, or fat distribution. For older adults, a slightly higher BMI (25-27) may be protective. BMI is best used as an initial screening tool, not a definitive health measure.",
    order: 3
  },
    {
    id: '4',
    question: "What is BMI Prime and why is it useful?",
      answer: "BMI Prime is your BMI divided by 25 (the upper limit of normal BMI). A BMI Prime of 1.0 means you're at the upper boundary of normal weight. Values below 1.0 indicate underweight to normal, while values above 1.0 indicate overweight. It's useful because it shows how far you are from the ideal range as a simple ratio.",
    order: 4
  },
    {
    id: '5',
    question: "How can I improve my BMI?",
      answer: "To reach a healthy BMI: 1) Create a moderate calorie deficit (500-750 calories/day) for weight loss, or surplus for weight gain. 2) Exercise regularly - combine cardio and strength training. 3) Eat a balanced diet rich in whole foods, lean proteins, and vegetables. 4) Stay hydrated and get adequate sleep. 5) Make gradual, sustainable changes rather than extreme diets. Aim to lose/gain 1-2 lbs per week for lasting results.",
    order: 5
  }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('BMI Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Calculate your Body Mass Index (BMI) to assess if your weight is healthy for your height.
          Get personalized insights and recommendations.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <div className="grid md:grid-cols-2 sm:gap-5 md:gap-6">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Enter Your Details</h3>

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
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                min="2"
                max="120"
                className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>120</span>
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
                      value={feet}
                      onChange={(e) => setFeet(parseInt(e.target.value) || 0)}
                      min="1"
                      max="8"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(parseInt(e.target.value) || 0)}
                      min="0"
                      max="11"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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
                    min="50"
                    max="250"
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
                    min="20"
                    max="300"
                    step="0.5"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                ) : (
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                    min="50"
                    max="700"
                    step="1"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{weightLabel}</span>
              </div>
            </div>

            {/* BMI Formula Info */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-xs text-blue-700">
                <strong>BMI Formula:</strong> Weight (kg) ÷ Height² (m²)
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Your calculation: {weightUnit === 'kg' ? weightKg : (weightLbs * 0.453592).toFixed(1)} kg ÷ {
                  heightUnit === 'ft'
                    ? ((feet * 12 + inches) * 0.0254).toFixed(2)
                    : (heightCm / 100).toFixed(2)
                }² m² = <strong>{bmi}</strong>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Your BMI Results</h3>

            {/* Main BMI Display */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-4 text-white mb-4">
              <div className="text-center">
                <div className="text-sm opacity-80 mb-1">Your BMI</div>
                <div className="text-lg sm:text-xl md:text-2xl md:text-4xl font-bold mb-1">{bmi}</div>
                <div className="text-sm opacity-80">kg/m²</div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="opacity-70">BMI Prime</div>
                  <div className="font-semibold text-lg">{bmiPrime}</div>
                </div>
                <div>
                  <div className="opacity-70">Category</div>
                  <div className="font-semibold text-lg">{category.split(' ')[0]}</div>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <div className={`p-3 sm:p-4 rounded-lg border-2 ${getCategoryStyles()} mb-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm sm:text-base">{category}</div>
                  <div className="text-xs sm:text-sm opacity-80">
                    {category.includes('Normal') ? 'Healthy weight range' :
                     category.includes('Thinness') ? 'Below healthy range' :
                     'Above healthy range'}
                  </div>
                </div>
                <div className="text-2xl">
                  {categoryColor === 'green' ? '✅' :
                   categoryColor === 'yellow' ? '⚠️' : '🔴'}
                </div>
              </div>
            </div>

            {/* BMI Scale Visual */}
            <div className="mb-4 sm:mb-6">
              <div className="text-sm font-medium text-gray-700 mb-2">BMI Scale</div>
              <div className="relative h-4 rounded-full overflow-hidden mb-2">
                <div className="absolute inset-0 flex">
                  <div className="w-[14%] bg-red-400"></div>
                  <div className="w-[6%] bg-orange-400"></div>
                  <div className="w-[6%] bg-yellow-400"></div>
                  <div className="w-[26%] bg-green-400"></div>
                  <div className="w-[20%] bg-yellow-400"></div>
                  <div className="w-[20%] bg-orange-400"></div>
                  <div className="w-[8%] bg-red-400"></div>
                </div>
                <div
                  className="absolute h-6 w-1 bg-gray-800 -top-1 shadow-lg transition-all duration-300"
                  style={{ left: `${getBMIPosition()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Healthy Range</div>
                <div className="font-semibold text-sm text-gray-800">
                  {healthyWeightRange.min} - {healthyWeightRange.max} {weightLabel}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Weight Goal</div>
                <div className="font-semibold text-sm text-gray-800">
                  {weightChange === 0 ? 'Maintain' :
                   weightChange > 0 ? `+${weightChange} ${weightLabel}` :
                   `${weightChange} ${weightLabel}`}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600 mb-1">Est. Lean Mass</div>
                <div className="font-semibold text-sm text-blue-800">{leanMass} {weightLabel}</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-xs text-orange-600 mb-1">Est. Fat Mass</div>
                <div className="font-semibold text-sm text-orange-800">{fatMass} {weightLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-3 sm:p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-2`}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Understanding Body Mass Index (BMI)</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          Body Mass Index (BMI) is a simple yet widely used screening tool that measures body fat based on your height and weight. Developed by Belgian mathematician Adolphe Quetelet in the 1830s, BMI has become the standard method used by healthcare professionals worldwide to categorize individuals into different weight categories and assess potential health risks associated with body weight.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-100">
            <h3 className="font-semibold text-red-800 mb-1 text-sm sm:text-base">Underweight</h3>
            <p className="text-xs sm:text-sm text-red-700 font-medium">BMI &lt; 18.5</p>
            <p className="text-xs text-gray-600 mt-1">May indicate nutritional deficiency or underlying health conditions</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-1 text-sm sm:text-base">Normal Weight</h3>
            <p className="text-xs sm:text-sm text-green-700 font-medium">BMI 18.5 - 24.9</p>
            <p className="text-xs text-gray-600 mt-1">Associated with lowest health risks and optimal body function</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-100">
            <h3 className="font-semibold text-yellow-800 mb-1 text-sm sm:text-base">Overweight</h3>
            <p className="text-xs sm:text-sm text-yellow-700 font-medium">BMI 25 - 29.9</p>
            <p className="text-xs text-gray-600 mt-1">Increased risk for cardiovascular disease and type 2 diabetes</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-1 text-sm sm:text-base">Obese</h3>
            <p className="text-xs sm:text-sm text-orange-700 font-medium">BMI 30+</p>
            <p className="text-xs text-gray-600 mt-1">Significantly higher risk for chronic diseases and health complications</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">The BMI Formula Explained</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Metric Formula:</h4>
              <p className="font-mono text-sm bg-white p-2 rounded border">BMI = Weight (kg) / Height² (m²)</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Imperial Formula:</h4>
              <p className="font-mono text-sm bg-white p-2 rounded border">BMI = (Weight (lbs) × 703) / Height² (in²)</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            The formula calculates the ratio of your weight to your height squared, providing a standardized measure that can be compared across populations regardless of height.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Why BMI Matters for Your Health</h3>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              While BMI is not a direct measure of body fat, research consistently shows strong correlations between BMI and various health outcomes. People with higher BMIs are statistically more likely to develop:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Type 2 diabetes and insulin resistance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Cardiovascular diseases and hypertension</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Sleep apnea and respiratory problems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Joint problems and osteoarthritis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Certain types of cancer</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Limitations of BMI</h3>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              While useful as a screening tool, BMI has several limitations that are important to understand:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Does not distinguish between muscle and fat mass</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>May overestimate body fat in athletes and muscular individuals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>May underestimate body fat in elderly individuals who have lost muscle mass</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Does not account for fat distribution (visceral vs. subcutaneous)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Same categories may not apply equally across different ethnic groups</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Tips for Achieving a Healthy BMI</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Balanced Nutrition</h4>
            <p className="text-xs text-gray-600">Focus on whole foods, lean proteins, vegetables, and complex carbohydrates. Create a moderate calorie deficit of 500 calories per day for sustainable weight loss of about 1 pound per week.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Regular Exercise</h4>
            <p className="text-xs text-gray-600">Aim for at least 150 minutes of moderate aerobic activity weekly, plus strength training 2-3 times per week. Exercise helps preserve muscle mass while losing fat.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Lifestyle Factors</h4>
            <p className="text-xs text-gray-600">Get 7-9 hours of quality sleep, manage stress levels, stay hydrated, and limit alcohol consumption. These factors significantly impact metabolism and weight management.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="bmi-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Medical Disclaimer</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This BMI calculator is for informational purposes only and should not replace professional medical advice.
              BMI is a screening tool and may not be accurate for athletes, elderly individuals, pregnant women,
              or people with high muscle mass. Always consult with a healthcare provider for personalized health
              assessments and weight management recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
