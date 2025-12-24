'use client';

import { useState, useEffect } from 'react';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface PregnancyWeightGainCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

// IOM weight gain recommendations
const weightGainGuidelines = {
  single: {
    underweight: { min: 28, max: 40, minKg: 12.7, maxKg: 18.1 },
    normal: { min: 25, max: 35, minKg: 11.3, maxKg: 15.9 },
    overweight: { min: 15, max: 25, minKg: 6.8, maxKg: 11.3 },
    obese: { min: 11, max: 20, minKg: 5.0, maxKg: 9.1 }
  },
  twins: {
    underweight: { min: 50, max: 62, minKg: 22.7, maxKg: 28.1 },
    normal: { min: 37, max: 54, minKg: 16.8, maxKg: 24.5 },
    overweight: { min: 31, max: 50, minKg: 14.1, maxKg: 22.7 },
    obese: { min: 25, max: 42, minKg: 11.3, maxKg: 19.1 }
  },
  triplets: {
    underweight: { min: 50, max: 62, minKg: 22.7, maxKg: 28.1 },
    normal: { min: 50, max: 62, minKg: 22.7, maxKg: 28.1 },
    overweight: { min: 44, max: 56, minKg: 20.0, maxKg: 25.4 },
    obese: { min: 38, max: 50, minKg: 17.2, maxKg: 22.7 }
  }
};

type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';
type PregnancyType = 'single' | 'twins' | 'triplets';
type Units = 'metric' | 'imperial';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Pregnancy Weight Gain Calculator?",
    answer: "A Pregnancy Weight Gain Calculator is a health and fitness tool that helps you calculate pregnancy weight gain-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Pregnancy Weight Gain Calculator?",
    answer: "This calculator provides estimates based on standard formulas. While useful for general guidance, it should not replace professional medical advice. Consult a healthcare provider for personalized recommendations.",
    order: 2
  },
  {
    id: '3',
    question: "Is this calculator suitable for everyone?",
    answer: "This calculator is designed for general adult use. Results may vary for children, pregnant women, athletes, or individuals with specific health conditions. Consult a healthcare professional for personalized advice.",
    order: 3
  },
  {
    id: '4',
    question: "How often should I use this calculator?",
    answer: "You can use this calculator as often as needed to track changes. For health metrics, weekly or monthly tracking is typically recommended to observe meaningful trends.",
    order: 4
  },
  {
    id: '5',
    question: "What should I do with my results?",
    answer: "Use the results as a starting point for understanding your pregnancy weight gain status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function PregnancyWeightGainCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: PregnancyWeightGainCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('pregnancy-weight-gain-calculator');

  const [units, setUnits] = useState<Units>('metric');
  const [preWeight, setPreWeight] = useState<number>(65);
  const [height, setHeight] = useState<number>(165);
  const [age, setAge] = useState<number>(28);
  const [currentWeek, setCurrentWeek] = useState<number>(20);
  const [currentWeight, setCurrentWeight] = useState<number>(70);
  const [pregnancyType, setPregnancyType] = useState<PregnancyType>('single');

  const [preBMI, setPreBMI] = useState<number>(23.9);
  const [currentGain, setCurrentGain] = useState<string>('5.0 kg');
  const [recommendedRange, setRecommendedRange] = useState<string>('11.3-15.9 kg');
  const [trimester, setTrimester] = useState<string>('2nd');
  const [progressPercentage, setProgressPercentage] = useState<number>(50);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [statusClass, setStatusClass] = useState<string>('bg-green-100 border border-green-200');
  const [healthRecommendations, setHealthRecommendations] = useState<string>('');

  const getBMICategory = (bmi: number): BMICategory => {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  };

  const getWeightGainRecommendations = (bmiCategory: BMICategory, pregnancyTypeVal: PregnancyType, unitsVal: Units) => {
    const guidelines = weightGainGuidelines[pregnancyTypeVal][bmiCategory];

    if (unitsVal === 'imperial') {
      return {
        min: guidelines.min,
        max: guidelines.max,
        unit: 'lbs'
      };
    } else {
      return {
        min: guidelines.minKg,
        max: guidelines.maxKg,
        unit: 'kg'
      };
    }
  };

  const calculateExpectedGain = (week: number, recommendations: { min: number; max: number; unit: string }, unitsVal: Units) => {
    let expectedMin: number, expectedMax: number;

    if (week <= 13) {
      // First trimester
      expectedMin = 0;
      expectedMax = unitsVal === 'imperial' ? 4 : 1.8;
    } else if (week <= 27) {
      // Second trimester
      const weeksIntoSecond = week - 13;
      const firstTrimesterGain = unitsVal === 'imperial' ? 2 : 0.9;
      const weeklyRate = (recommendations.min - firstTrimesterGain) / 27;
      expectedMin = firstTrimesterGain + (weeklyRate * weeksIntoSecond);
      expectedMax = firstTrimesterGain + ((recommendations.max - firstTrimesterGain) / 27 * weeksIntoSecond);
    } else {
      // Third trimester
      const weeksIntoThird = week - 27;
      const progressToWeek27 = recommendations.min * 0.7;
      const remainingWeeks = 40 - 27;
      const weeklyRate = (recommendations.max - progressToWeek27) / remainingWeeks;
      expectedMin = progressToWeek27 + (weeklyRate * weeksIntoThird * 0.7);
      expectedMax = progressToWeek27 + (weeklyRate * weeksIntoThird);
    }

    return { min: expectedMin, max: expectedMax };
  };

  const updateProgressStatus = (currentGainVal: number, expectedGain: { min: number; max: number }, recommendations: { min: number; max: number; unit: string }, weightUnit: string, week: number) => {
    let newStatusClass: string, statusText: string;

    if (currentGainVal < expectedGain.min) {
      newStatusClass = 'bg-blue-100 border border-blue-200';
      statusText = `Your current weight gain of ${currentGainVal.toFixed(1)} ${weightUnit} is below the expected range of ${expectedGain.min.toFixed(1)}-${expectedGain.max.toFixed(1)} ${weightUnit} for this stage. Consider discussing with your healthcare provider.`;
    } else if (currentGainVal > expectedGain.max) {
      newStatusClass = 'bg-yellow-100 border border-yellow-200';
      statusText = `Your current weight gain of ${currentGainVal.toFixed(1)} ${weightUnit} is above the expected range of ${expectedGain.min.toFixed(1)}-${expectedGain.max.toFixed(1)} ${weightUnit} for this stage. Monitor your progress closely.`;
    } else {
      newStatusClass = 'bg-green-100 border border-green-200';
      statusText = `Great! Your current weight gain of ${currentGainVal.toFixed(1)} ${weightUnit} is within the healthy range of ${expectedGain.min.toFixed(1)}-${expectedGain.max.toFixed(1)} ${weightUnit} for week ${week}.`;
    }

    setStatusClass(newStatusClass);
    setProgressStatus(statusText);
  };

  const generateHealthRecommendations = (currentGainVal: number, expectedGain: { min: number; max: number }, recommendations: { min: number; max: number; unit: string }, preBMIVal: number, pregnancyTypeVal: PregnancyType, week: number) => {
    let recommendations_text = '';

    // BMI-based recommendations
    if (preBMIVal < 18.5) {
      recommendations_text += 'As you were underweight before pregnancy, adequate weight gain is especially important for your baby\'s healthy development. ';
    } else if (preBMIVal >= 30) {
      recommendations_text += 'With a higher pre-pregnancy BMI, moderate weight gain with focus on nutrient quality is recommended. ';
    }

    // Pregnancy type recommendations
    if (pregnancyTypeVal === 'twins') {
      recommendations_text += 'Carrying twins requires additional calories and nutrients. Higher weight gain is normal and expected. ';
    } else if (pregnancyTypeVal === 'triplets') {
      recommendations_text += 'Multiple pregnancies require significantly more calories and careful monitoring. ';
    }

    // General recommendations
    recommendations_text += 'Focus on eating nutrient-dense foods including fruits, vegetables, whole grains, lean proteins, and dairy products. Take your prenatal vitamins daily, stay hydrated, and engage in approved physical activities. Regular prenatal checkups are essential for monitoring your health and your baby\'s development.';

    setHealthRecommendations(recommendations_text);
  };

  const calculatePregnancyWeight = () => {
    let preWeightVal = preWeight;
    let heightVal = height;
    let currentWeightVal = currentWeight;

    if (!preWeightVal || !heightVal || !currentWeightVal || !currentWeek ||
        preWeightVal <= 0 || heightVal <= 0 || currentWeightVal <= 0 || currentWeek <= 0) {
      return;
    }

    // Convert to metric for calculations
    if (units === 'imperial') {
      preWeightVal = preWeightVal * 0.453592; // lbs to kg
      heightVal = heightVal * 2.54; // inches to cm
      currentWeightVal = currentWeightVal * 0.453592; // lbs to kg
    }

    // Calculate pre-pregnancy BMI
    const calculatedPreBMI = preWeightVal / Math.pow(heightVal / 100, 2);
    const bmiCategory = getBMICategory(calculatedPreBMI);

    // Get weight gain recommendations
    const recommendations = getWeightGainRecommendations(bmiCategory, pregnancyType, units);

    // Calculate current weight gain
    const calculatedCurrentGain = currentWeightVal - preWeightVal;

    // Calculate expected gain for current week
    const expectedGain = calculateExpectedGain(currentWeek, recommendations, units);

    const weightUnit = units === 'imperial' ? 'lbs' : 'kg';

    // Update state
    setPreBMI(calculatedPreBMI);
    setCurrentGain(`${calculatedCurrentGain.toFixed(1)} ${weightUnit}`);
    setRecommendedRange(`${recommendations.min}-${recommendations.max} ${weightUnit}`);

    // Determine trimester
    let trimesterVal;
    if (currentWeek <= 13) trimesterVal = '1st';
    else if (currentWeek <= 27) trimesterVal = '2nd';
    else trimesterVal = '3rd';
    setTrimester(trimesterVal);

    // Update progress bar
    const progressPct = (currentWeek / 40) * 100;
    setProgressPercentage(progressPct);

    // Progress status
    updateProgressStatus(calculatedCurrentGain, expectedGain, recommendations, weightUnit, currentWeek);

    // Generate health recommendations
    generateHealthRecommendations(calculatedCurrentGain, expectedGain, recommendations, calculatedPreBMI, pregnancyType, currentWeek);
  };

  const toggleUnits = (newUnits: Units) => {
    setUnits(newUnits);

    const isMetric = newUnits === 'metric';

    if (preWeight && height && currentWeight) {
      if (isMetric && preWeight < 100) {
        // Convert from lbs/inches to kg/cm
        setPreWeight(parseFloat((preWeight * 0.453592).toFixed(1)));
        setHeight(parseFloat((height * 2.54).toFixed(1)));
        setCurrentWeight(parseFloat((currentWeight * 0.453592).toFixed(1)));
      } else if (!isMetric && preWeight > 100) {
        // Convert from kg/cm to lbs/inches
        setPreWeight(parseFloat((preWeight / 0.453592).toFixed(1)));
        setHeight(parseFloat((height / 2.54).toFixed(1)));
        setCurrentWeight(parseFloat((currentWeight / 0.453592).toFixed(1)));
      }
    }
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    calculatePregnancyWeight();
  }, [preWeight, height, currentWeight, currentWeek, age, pregnancyType, units]);

  // Initial calculation
  useEffect(() => {
    calculatePregnancyWeight();
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Pregnancy Weight Gain Calculator')}</h1>
        <p className="text-xl text-gray-600 mb-3 sm:mb-4 md:mb-6 max-w-3xl mx-auto">
          Calculate your recommended weight gain during pregnancy based on your pre-pregnancy BMI and current trimester.
        </p>
        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg inline-block">
          <p className="text-sm text-blue-800 font-medium">
            ⚕️ Always consult your healthcare provider for personalized pregnancy guidance.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />
      </div>

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Pregnancy Information</h2>

            {/* Units Selection */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Measurement Units</label>
              <div className="flex gap-4">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="units"
                    value="metric"
                    checked={units === 'metric'}
                    onChange={(e) => toggleUnits(e.target.value as Units)}
                    className="mr-2 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="font-medium">Metric (kg, cm)</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="units"
                    value="imperial"
                    checked={units === 'imperial'}
                    onChange={(e) => toggleUnits(e.target.value as Units)}
                    className="mr-2 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="font-medium">Imperial (lbs, ft/in)</span>
                </label>
              </div>
            </div>

            {/* Pre-pregnancy Info */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pre-Pregnancy Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="preWeight" className="block text-sm font-medium text-gray-700 mb-2">
                    <span>{units === 'metric' ? 'Pre-pregnancy Weight (kg)' : 'Pre-pregnancy Weight (lbs)'}</span>
                  </label>
                  <input
                    type="number"
                    id="preWeight"
                    step="0.1"
                    value={preWeight}
                    min="35"
                    max="200"
                    onChange={(e) => setPreWeight(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                    <span>{units === 'metric' ? 'Height (cm)' : 'Height (inches)'}</span>
                  </label>
                  <input
                    type="number"
                    id="height"
                    step="0.1"
                    value={height}
                    min="120"
                    max="220"
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    id="age"
                    min="18"
                    max="50"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Current Pregnancy Info */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Pregnancy Status</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentWeek" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Week of Pregnancy
                  </label>
                  <input
                    type="number"
                    id="currentWeek"
                    min="1"
                    max="42"
                    value={currentWeek}
                    onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label htmlFor="currentWeight" className="block text-sm font-medium text-gray-700 mb-2">
                    <span>{units === 'metric' ? 'Current Weight (kg)' : 'Current Weight (lbs)'}</span>
                  </label>
                  <input
                    type="number"
                    id="currentWeight"
                    step="0.1"
                    value={currentWeight}
                    min="35"
                    max="250"
                    onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Pregnancy Type */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Pregnancy Type</label>
              <div className="flex gap-4">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pregnancyType"
                    value="single"
                    checked={pregnancyType === 'single'}
                    onChange={(e) => setPregnancyType(e.target.value as PregnancyType)}
                    className="mr-2 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="font-medium">Single Baby</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pregnancyType"
                    value="twins"
                    checked={pregnancyType === 'twins'}
                    onChange={(e) => setPregnancyType(e.target.value as PregnancyType)}
                    className="mr-2 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="font-medium">Twins</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pregnancyType"
                    value="triplets"
                    checked={pregnancyType === 'triplets'}
                    onChange={(e) => setPregnancyType(e.target.value as PregnancyType)}
                    className="mr-2 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="font-medium">Triplets+</span>
                </label>
              </div>
            </div>

            <button
              onClick={calculatePregnancyWeight}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Calculate Weight Gain Recommendations
            </button>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Weight Gain Guidelines */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">IOM Weight Gain Guidelines</h3>

            <div className="overflow-hidden border border-gray-200 rounded-lg mb-3 sm:mb-4 md:mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Pre-pregnancy BMI</th>
                    <th className="px-3 py-2 text-left font-semibold">Category</th>
                    <th className="px-3 py-2 text-left font-semibold">Single Baby</th>
                    <th className="px-3 py-2 text-left font-semibold">Twins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2">&lt; 18.5</td>
                    <td className="px-3 py-2 font-medium text-blue-600">Underweight</td>
                    <td className="px-3 py-2">28-40 lbs (12.7-18.1 kg)</td>
                    <td className="px-3 py-2">50-62 lbs (22.7-28.1 kg)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2">18.5-24.9</td>
                    <td className="px-3 py-2 font-medium text-green-600">Normal</td>
                    <td className="px-3 py-2">25-35 lbs (11.3-15.9 kg)</td>
                    <td className="px-3 py-2">37-54 lbs (16.8-24.5 kg)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2">25.0-29.9</td>
                    <td className="px-3 py-2 font-medium text-yellow-600">Overweight</td>
                    <td className="px-3 py-2">15-25 lbs (6.8-11.3 kg)</td>
                    <td className="px-3 py-2">31-50 lbs (14.1-22.7 kg)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2">≥ 30.0</td>
                    <td className="px-3 py-2 font-medium text-red-600">Obese</td>
                    <td className="px-3 py-2">11-20 lbs (5.0-9.1 kg)</td>
                    <td className="px-3 py-2">25-42 lbs (11.3-19.1 kg)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">⚠️ Important Notes</h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• These are general guidelines from the Institute of Medicine (IOM)</li>
                <li>• Individual needs may vary based on health conditions and activity level</li>
                <li>• Regular prenatal checkups are essential for monitoring health</li>
                <li>• Focus on nutrient quality, not just calorie quantity</li>
                <li>• Gradual, steady weight gain is healthier than rapid changes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Results */}
          <div id="results" className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Weight Gain Analysis</h3>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600 mb-1">{preBMI.toFixed(1)}</div>
                <div className="text-xs text-blue-700">Pre-BMI</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600 mb-1">{currentGain}</div>
                <div className="text-xs text-green-700">Current Gain</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600 mb-1">{recommendedRange}</div>
                <div className="text-xs text-purple-700">Total Range</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600 mb-1">{trimester}</div>
                <div className="text-xs text-orange-700">Trimester</div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Weight Gain Progress</h4>
              <div className="relative">
                <div className="h-3 bg-gray-200 rounded-full">
                  <div className="h-3 bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Week 1</span>
                  <span>Week {currentWeek}</span>
                  <span>Week 40</span>
                </div>
              </div>
              <div className={`mt-2 p-2 rounded-lg text-xs ${statusClass}`}>
                <div className="text-sm text-gray-700">{progressStatus}</div>
              </div>
            </div>

            {/* Health Recommendations */}
            <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Health Recommendations</h4>
              <div className="text-xs text-gray-700">{healthRecommendations}</div>
            </div>
          </div>
          <div className="bg-pink-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-pink-800 mb-3">👶 Why Weight Matters</h3>
            <div className="space-y-2 text-sm text-pink-700">
              <div><strong>Too little gain:</strong> Low birth weight, preterm birth</div>
              <div><strong>Too much gain:</strong> Large baby, C-section risk</div>
              <div><strong>Optimal gain:</strong> Healthy baby, easier delivery</div>
              <div><strong>Long-term:</strong> Affects maternal health post-pregnancy</div>
            </div>
          </div>

        </div>
      </div>

      {/* Health Guidelines - 3 Column Full Width */}
      <div className="mt-8 grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-green-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">🥗 Healthy Eating Tips</h3>
          <ul className="space-y-2 text-sm text-green-700">
            <li>• Eat nutrient-dense foods</li>
            <li>• Include folate-rich foods</li>
            <li>• Get enough calcium and iron</li>
            <li>• Stay hydrated</li>
            <li>• Take prenatal vitamins</li>
            <li>• Limit processed foods</li>
            <li>• Eat regular, balanced meals</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">🏃‍♀️ Exercise Guidelines</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• 150 minutes moderate activity/week</li>
            <li>• Walking, swimming, prenatal yoga</li>
            <li>• Avoid high-impact or contact sports</li>
            <li>• Listen to your body</li>
            <li>• Stay cool and hydrated</li>
            <li>• Stop if you feel dizzy or unwell</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">⚕️ When to Call Doctor</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• Sudden rapid weight gain</li>
            <li>• No weight gain for several weeks</li>
            <li>• Excessive nausea/vomiting</li>
            <li>• Swelling in face/hands</li>
            <li>• Signs of preeclampsia</li>
            <li>• Concerns about eating habits</li>
          </ul>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Pregnancy Weight Gain</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Where the Weight Goes</h3>
            <p className="text-gray-600 mb-4">
              Pregnancy weight gain supports your baby&apos;s growth and prepares your body for breastfeeding. Understanding where the weight goes can help you feel more comfortable with the changes.
            </p>

            <h4 className="font-semibold mb-2">Weight Distribution (typical 30 lb gain):</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• <strong>Baby:</strong> 7-8 lbs</li>
              <li>• <strong>Placenta:</strong> 1-2 lbs</li>
              <li>• <strong>Amniotic fluid:</strong> 2 lbs</li>
              <li>• <strong>Breast tissue:</strong> 1-3 lbs</li>
              <li>• <strong>Blood supply:</strong> 3-4 lbs</li>
              <li>• <strong>Fat stores:</strong> 6-8 lbs</li>
              <li>• <strong>Uterus growth:</strong> 2-5 lbs</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Trimester Patterns</h3>
            <p className="text-gray-600 mb-4">
              Weight gain typically follows a pattern throughout pregnancy, with most gain occurring in the second and third trimesters when the baby grows rapidly.
            </p>

            <h4 className="font-semibold mb-2">Typical Pattern:</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• <strong>1st trimester:</strong> 1-4 lbs total (morning sickness may cause loss)</li>
              <li>• <strong>2nd trimester:</strong> 1-2 lbs per week (steady growth)</li>
              <li>• <strong>3rd trimester:</strong> 1-2 lbs per week (continued growth)</li>
              <li>• <strong>Final weeks:</strong> Weight may stabilize or slightly decrease</li>
            </ul>
          </div>
        </div>
      </div>
{/* Medical Disclaimer */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Medical Disclaimer</h3>
            <div className="text-sm text-amber-700 space-y-2">
              <p><strong>This calculator is for educational and informational purposes only.</strong> It provides estimates based on IOM (Institute of Medicine) guidelines and should not be considered medical advice.</p>
              <p><strong>Important:</strong> Pregnancy weight gain needs vary significantly based on individual health conditions, multiple pregnancies, pre-existing conditions, and other factors not captured by these calculations.</p>
              <p><strong>Always consult with your healthcare provider, obstetrician, or certified midwife before:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Making changes to your diet or eating patterns during pregnancy</li>
                <li>If you have concerns about your weight gain or loss during pregnancy</li>
                <li>If you have any medical conditions, complications, or take medications</li>
                <li>If you are carrying multiples (twins, triplets, etc.)</li>
                <li>If you have a history of eating disorders or previous pregnancy complications</li>
              </ul>
              <p><strong>This tool does not replace professional medical advice, diagnosis, or treatment.</strong> Regular prenatal care and monitoring by qualified healthcare professionals is essential for a healthy pregnancy. Every pregnancy is unique - follow your healthcare provider&apos;s specific recommendations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Converter Calculators</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="block">
              <div className={`${calc.color || 'bg-gray-500'} rounded-xl p-6 text-white hover:opacity-90 transition-opacity`}>
                <h3 className="text-xl font-bold mb-2">{calc.title}</h3>
                <p className="text-white/90">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="pregnancy-weight-gain-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
