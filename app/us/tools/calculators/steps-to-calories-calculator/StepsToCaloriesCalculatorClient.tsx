'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
}

interface Props {
  seoContent: string;
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const intensityOptions = [
  { value: 'slow', label: 'Slow', speed: 2.0, met: 2.3, description: '2.0 mph' },
  { value: 'moderate', label: 'Moderate', speed: 2.8, met: 3.0, description: '2.8 mph' },
  { value: 'brisk', label: 'Brisk', speed: 3.5, met: 3.8, description: '3.5 mph' },
  { value: 'fast', label: 'Fast', speed: 4.0, met: 4.3, description: '4.0 mph' },
  { value: 'very-fast', label: 'Very Fast', speed: 4.5, met: 5.0, description: '4.5 mph' }
];

const terrainOptions = [
  { value: 'flat', label: 'Flat', factor: 1.0 },
  { value: 'slight-incline', label: 'Slight Incline', factor: 1.1 },
  { value: 'moderate-incline', label: 'Moderate Incline', factor: 1.3 },
  { value: 'steep-incline', label: 'Steep Incline', factor: 1.5 },
  { value: 'uneven', label: 'Uneven Terrain', factor: 1.2 }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Steps To Calories Calculator?",
    answer: "A Steps To Calories Calculator is a health and fitness tool that helps you calculate steps to calories-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Steps To Calories Calculator?",
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
    answer: "Use the results as a starting point for understanding your steps to calories status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function StepsToCaloriesCalculatorClient({ seoContent, relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('steps-to-calories-calculator');

  const [steps, setSteps] = useState(10000);
  const [weight, setWeight] = useState(70);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [intensity, setIntensity] = useState('moderate');
  const [terrain, setTerrain] = useState('flat');
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const formatNumber = (num: number, decimals: number = 0): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const results = useMemo(() => {
    const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const intensityData = intensityOptions.find(i => i.value === intensity) || intensityOptions[1];
    const terrainData = terrainOptions.find(t => t.value === terrain) || terrainOptions[0];
    const adjustedMET = intensityData.met * terrainData.factor;

    // Calculate stride length (cm)
    const strideLength = gender === 'male' ? height * 0.415 : height * 0.413;

    // Calculate distance
    const distanceM = (steps * strideLength) / 100;
    const distanceKm = distanceM / 1000;
    const distanceMiles = distanceKm * 0.621371;

    // Calculate walking time
    const walkingTimeHours = distanceMiles / intensityData.speed;
    const walkingTimeMinutes = walkingTimeHours * 60;

    // Calculate calories using MET formula
    const caloriesPerMinute = (adjustedMET * 3.5 * weightKg) / 200;
    const totalCalories = caloriesPerMinute * walkingTimeMinutes;
    const caloriesPerStep = steps > 0 ? totalCalories / steps : 0;

    // Macronutrient breakdown
    const fatCalories = totalCalories * 0.5;
    const carbCalories = totalCalories * 0.5;
    const fatGrams = fatCalories / 9;
    const carbGrams = carbCalories / 4;

    // Activity level
    let activityLevel = 'Sedentary';
    if (steps >= 12500) activityLevel = 'Highly Active';
    else if (steps >= 10000) activityLevel = 'Active';
    else if (steps >= 7500) activityLevel = 'Somewhat Active';
    else if (steps >= 5000) activityLevel = 'Low Active';

    // Goal progress
    const tenKProgress = Math.min((steps / 10000) * 100, 100);

    return {
      totalCalories,
      caloriesPerStep,
      adjustedMET,
      distanceKm,
      distanceMiles,
      walkingTimeHours,
      walkingTimeMinutes,
      fatGrams,
      carbGrams,
      activityLevel,
      tenKProgress,
      speed: intensityData.speed
    };
  }, [steps, weight, weightUnit, height, gender, intensity, terrain]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const intensityData = intensityOptions.find(i => i.value === intensity) || intensityOptions[1];
    const terrainData = terrainOptions.find(t => t.value === terrain) || terrainOptions[0];
    const strideLength = gender === 'male' ? height * 0.415 : height * 0.413;

    const calculateCalories = (stepCount: number, met: number) => {
      const distanceMiles = ((stepCount * strideLength) / 100000) * 0.621371;
      const hours = distanceMiles / intensityData.speed;
      const calsPerMin = (met * 3.5 * weightKg) / 200;
      return calsPerMin * hours * 60;
    };

    const baseCalories = calculateCalories(steps, intensityData.met * terrainData.factor);

    // Scenario 1: 15K steps
    const steps15k = calculateCalories(15000, intensityData.met * terrainData.factor);

    // Scenario 2: Brisk pace
    const briskMet = 3.8 * terrainData.factor;
    const briskCalories = calculateCalories(steps, briskMet);

    // Scenario 3: Incline terrain
    const inclineCalories = calculateCalories(steps, intensityData.met * 1.3);

    return [
      {
        name: '15K Steps',
        description: 'Increase daily goal',
        calories: steps15k,
        extra: steps15k - baseCalories,
        color: 'bg-green-100 border-green-300'
      },
      {
        name: 'Brisk Pace',
        description: '3.5 mph walking',
        calories: briskCalories,
        extra: briskCalories - baseCalories,
        color: 'bg-blue-100 border-blue-300'
      },
      {
        name: 'Incline Route',
        description: 'Moderate hills',
        calories: inclineCalories,
        extra: inclineCalories - baseCalories,
        color: 'bg-purple-100 border-purple-300'
      }
    ];
  }, [steps, weight, weightUnit, height, gender, intensity, terrain]);

  // Step count comparison data
  const stepComparison = useMemo(() => {
    const weightKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;
    const intensityData = intensityOptions.find(i => i.value === intensity) || intensityOptions[1];
    const terrainData = terrainOptions.find(t => t.value === terrain) || terrainOptions[0];
    const strideLength = gender === 'male' ? height * 0.415 : height * 0.413;
    const adjustedMET = intensityData.met * terrainData.factor;

    const stepCounts = [5000, 7500, 10000, 12500, 15000, 20000];

    return stepCounts.map(count => {
      const distanceMiles = ((count * strideLength) / 100000) * 0.621371;
      const hours = distanceMiles / intensityData.speed;
      const calsPerMin = (adjustedMET * 3.5 * weightKg) / 200;
      const calories = calsPerMin * hours * 60;
      const distance = ((count * strideLength) / 100000);

      return {
        steps: count,
        label: `${count / 1000}K`,
        calories: Math.round(calories),
        distance: distance.toFixed(1),
        time: Math.round(hours * 60)
      };
    });
  }, [weight, weightUnit, height, gender, intensity, terrain]);

  // SVG Bar Chart
  const maxCalories = Math.max(...stepComparison.map(s => s.calories));
  const barWidth = 40;
  const chartHeight = 180;
  const chartWidth = stepComparison.length * 60;

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
  };

  const quickPresets = [
    { label: '5K Steps', steps: 5000 },
    { label: '7.5K Steps', steps: 7500 },
    { label: '10K Steps', steps: 10000 },
    { label: '12.5K Steps', steps: 12500 },
    { label: '15K Steps', steps: 15000 }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Steps to Calories Calculator')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert your daily steps into calories burned based on your weight, pace, and terrain
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Quick Presets */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {quickPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setSteps(preset.steps)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                steps === preset.steps
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Details</h2>

            {/* Steps */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Steps: {formatNumber(steps)}
              </label>
              <input
                type="range"
                min="1000"
                max="30000"
                step="500"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1,000</span>
                <span>30,000</span>
              </div>
            </div>

            {/* Weight */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight: {formatNumber(weight)} {weightUnit}
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-3 py-1 rounded text-sm ${weightUnit === 'kg' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  kg
                </button>
                <button
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-3 py-1 rounded text-sm ${weightUnit === 'lbs' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  lbs
                </button>
              </div>
              <input
                type="range"
                min={weightUnit === 'kg' ? 40 : 88}
                max={weightUnit === 'kg' ? 150 : 330}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Height */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height: {height} cm
              </label>
              <input
                type="range"
                min="140"
                max="210"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Used to estimate stride length</p>
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="mr-2 accent-blue-500"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="mr-2 accent-blue-500"
                  />
                  Female
                </label>
              </div>
            </div>

            {/* Intensity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Walking Intensity</label>
              <div className="grid grid-cols-5 gap-1">
                {intensityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setIntensity(opt.value)}
                    className={`p-2 rounded text-center transition-all text-xs ${
                      intensity === opt.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 hover:bg-orange-100'
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="opacity-75">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Terrain */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Terrain</label>
              <select
                value={terrain}
                onChange={(e) => setTerrain(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                {terrainOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Calories Burned</h2>

            {/* Main Result */}
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-3 sm:p-4 md:p-6 mb-4 text-center">
              <div className="text-sm text-orange-600 font-medium">Total Calories Burned</div>
              <div className="text-5xl font-bold text-orange-600 my-2">
                {formatNumber(results.totalCalories)}
              </div>
              <div className="text-sm text-orange-700">
                {results.caloriesPerStep.toFixed(3)} cal/step | MET: {results.adjustedMET.toFixed(1)}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-600">Distance</div>
                <div className="text-lg font-bold text-blue-800">{results.distanceKm.toFixed(1)} km</div>
                <div className="text-xs text-blue-600">({results.distanceMiles.toFixed(1)} mi)</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-xs text-purple-600">Walking Time</div>
                <div className="text-lg font-bold text-purple-800">{formatTime(results.walkingTimeMinutes)}</div>
                <div className="text-xs text-purple-600">{results.speed} mph</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-xs text-green-600">Fat Burned</div>
                <div className="text-lg font-bold text-green-800">{formatNumber(results.fatGrams)}g</div>
                <div className="text-xs text-green-600">~50% of calories</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-xs text-yellow-600">Carbs Burned</div>
                <div className="text-lg font-bold text-yellow-800">{formatNumber(results.carbGrams)}g</div>
                <div className="text-xs text-yellow-600">~50% of calories</div>
              </div>
            </div>

            {/* 10K Goal Progress */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">10K Steps Goal</span>
                <span className="text-sm font-bold text-green-600">{formatNumber(results.tenKProgress, 0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${results.tenKProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-600">Activity: {results.activityLevel}</span>
                <span className="text-xs text-gray-600">{formatNumber(steps)} / 10,000</span>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Calories by Step Count</h3>
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="w-full min-w-[320px]">
                  {stepComparison.map((item, index) => {
                    const barHeight = (item.calories / maxCalories) * chartHeight;
                    const x = index * 60 + 10;
                    const y = chartHeight - barHeight;
                    const isCurrentSteps = Math.abs(item.steps - steps) < 2500;

                    return (
                      <g key={item.steps}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          fill={isCurrentSteps ? '#f97316' : hoveredBar === index ? '#fb923c' : '#e5e7eb'}
                          rx="4"
                          className="transition-all duration-200 cursor-pointer"
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 5}
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                        >
                          {item.calories}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y={chartHeight + 15}
                          textAnchor="middle"
                          className="text-xs fill-gray-500"
                        >
                          {item.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">What-If Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className={`${scenario.color} rounded-lg p-4 border`}>
              <div className="text-sm font-semibold text-gray-800">{scenario.name}</div>
              <div className="text-xs text-gray-600 mb-2">{scenario.description}</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(scenario.calories)} cal</div>
              {scenario.extra > 0 && (
                <div className="text-sm font-medium text-green-600 mt-1">
                  +{formatNumber(scenario.extra)} extra calories
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Step Count Comparison</h2>
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showFullSchedule ? 'Show Less' : 'Show All'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Steps</th>
                <th className="px-3 py-2 text-right">Calories</th>
                <th className="px-3 py-2 text-right">Distance (km)</th>
                <th className="px-3 py-2 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? stepComparison : stepComparison.slice(0, 4)).map((item, index) => (
                <tr
                  key={index}
                  className={`border-t ${Math.abs(item.steps - steps) < 2500 ? 'bg-orange-50' : ''}`}
                >
                  <td className="px-3 py-2 font-medium">{formatNumber(item.steps)}</td>
                  <td className="px-3 py-2 text-right text-orange-600 font-medium">{item.calories}</td>
                  <td className="px-3 py-2 text-right">{item.distance}</td>
                  <td className="px-3 py-2 text-right">{item.time} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Level Guide */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Step Guidelines</h2>
        <div className="grid md:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">😴</div>
            <div className="font-semibold text-gray-800">Sedentary</div>
            <div className="text-sm text-gray-600">&lt;5,000 steps</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🚶</div>
            <div className="font-semibold text-gray-800">Low Active</div>
            <div className="text-sm text-gray-600">5,000-7,499</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🏃</div>
            <div className="font-semibold text-gray-800">Somewhat Active</div>
            <div className="text-sm text-gray-600">7,500-9,999</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border-2 border-green-400">
            <div className="text-2xl mb-1">💪</div>
            <div className="font-semibold text-green-700">Active</div>
            <div className="text-sm text-green-600">10,000-12,499</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-semibold text-gray-800">Highly Active</div>
            <div className="text-sm text-gray-600">12,500+</div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Health Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.slice(0, 8).map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">🏃</div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="steps-to-calories-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* SEO Content */}
      {seoContent && (
        <div className="mt-8 prose max-w-none" dangerouslySetInnerHTML={{ __html: seoContent }} />
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center">
          <strong>Disclaimer:</strong> This calculator provides estimates based on standard MET values and formulas.
          Actual calorie burn varies by individual factors including fitness level, metabolism, and walking form.
          Consult a healthcare professional for personalized advice.
        </p>
      </div>
    </div>
  );
}
