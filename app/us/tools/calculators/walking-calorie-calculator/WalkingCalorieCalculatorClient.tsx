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
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const speedOptions = [
  { value: 2.0, label: 'Slow Walking', met: 2.5, description: '2.0 mph / 3.2 km/h' },
  { value: 3.0, label: 'Moderate Walking', met: 3.0, description: '3.0 mph / 4.8 km/h' },
  { value: 3.5, label: 'Brisk Walking', met: 3.5, description: '3.5 mph / 5.6 km/h' },
  { value: 4.0, label: 'Fast Walking', met: 4.0, description: '4.0 mph / 6.4 km/h' },
  { value: 4.5, label: 'Very Fast', met: 5.0, description: '4.5 mph / 7.2 km/h' },
  { value: 5.0, label: 'Race Walking', met: 6.0, description: '5.0 mph / 8.0 km/h' }
];

export default function WalkingCalorieCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('walking-calorie-calculator');

  const fallbackFaqs = [
    {
      id: '1',
      question: "How many calories do you burn walking?",
      answer: "The number of calories burned while walking depends on your weight, speed, duration, and terrain. On average, a 70kg (154 lbs) person burns approximately 140-150 calories walking at a moderate pace (3 mph) for 30 minutes. At a brisk pace (3.5-4 mph), this increases to 170-200 calories. Heavier individuals burn more calories, while lighter individuals burn fewer.",
      order: 1
    },
    {
      id: '2',
      question: "What are MET values in walking?",
      answer: "MET (Metabolic Equivalent of Task) values measure the energy expenditure of activities relative to resting metabolism. For walking: Slow walking (2 mph) is 2.5 METs, moderate walking (3 mph) is 3.5 METs, brisk walking (3.5 mph) is 4.0 METs, fast walking (4 mph) is 5.0 METs, and very fast walking (4.5+ mph) is 6.0+ METs. Higher MET values mean more calories burned per minute.",
      order: 2
    },
    {
      id: '3',
      question: "Does walking uphill burn more calories?",
      answer: "Yes, walking uphill or on an incline significantly increases calorie burn. For every 5% grade increase (5 feet elevation gain per 100 feet horizontal distance), you burn approximately 0.5 additional METs, which translates to 30-50% more calories. A 10% incline can double your calorie burn compared to flat walking. Treadmill incline training is an effective way to maximize calorie expenditure.",
      order: 3
    },
    {
      id: '4',
      question: "How can I use walking for weight loss?",
      answer: "To lose one pound of body weight, you need to create a calorie deficit of approximately 3,500 calories. Walking 30-60 minutes daily at a brisk pace can burn 200-400 calories, creating a weekly deficit of 1,400-2,800 calories. Combined with a healthy diet reducing 300-500 calories daily, you can safely lose 1-2 pounds per week. Consistency is more important than intensity for sustainable weight loss.",
      order: 4
    },
    {
      id: '5',
      question: "Is walking as effective as running for fitness?",
      answer: "Walking and running both provide excellent cardiovascular benefits, but differ in intensity and impact. Walking is lower impact, reducing injury risk and making it sustainable long-term. While running burns more calories per minute, walking can match running's calorie burn if done for longer durations. For general health, 30 minutes of brisk walking daily meets CDC exercise guidelines. Walking is ideal for beginners, joint health, and lifelong fitness.",
      order: 5
    },
    {
      id: '6',
      question: "How does walking speed affect calorie burn?",
      answer: "Walking speed dramatically affects calorie burn due to increased MET values at higher speeds. Increasing from 2 mph (slow) to 4 mph (fast) more than doubles calorie expenditure. At 2 mph, a 70kg person burns ~90 cal/30min; at 3 mph, ~120 cal/30min; at 4 mph, ~180 cal/30min. Speed also improves cardiovascular fitness. However, sustainable moderate speeds (3-3.5 mph) are often better for longer duration walks.",
      order: 6
    }
  ];

  const [weight, setWeight] = useState(70);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [duration, setDuration] = useState(30);
  const [speed, setSpeed] = useState(3.0);
  const [incline, setIncline] = useState(0);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const formatNumber = (num: number, decimals: number = 0): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const results = useMemo(() => {
    const weightKg = weightUnit === 'lbs' ? weight / 2.205 : weight;
    const speedData = speedOptions.find(s => s.value === speed) || speedOptions[1];

    // Base MET value
    let met = speedData.met;

    // Adjust for incline (+0.5 MET per 5% grade)
    met += (incline / 5) * 0.5;

    // Age and gender adjustment
    let adjustment = 1.0;
    if (age > 50) adjustment -= 0.05;
    if (age > 65) adjustment -= 0.05;
    if (gender === 'female') adjustment -= 0.05;

    // Calculate calories
    const hours = duration / 60;
    const totalCalories = Math.round(met * weightKg * hours * adjustment);
    const caloriesPerMinute = totalCalories / duration;

    // Calculate distance
    const distanceKm = speed * 1.60934 * hours;
    const distanceMiles = speed * hours;

    // Estimate steps (1,250 steps per km)
    const steps = Math.round(distanceKm * 1250);
    const stepsPerMinute = Math.round(steps / duration);

    // Fat burned (~30% of calories from fat)
    const fatBurned = Math.round((totalCalories * 0.3) / 9);

    return {
      totalCalories,
      caloriesPerMinute,
      met,
      distanceKm,
      distanceMiles,
      steps,
      stepsPerMinute,
      fatBurned,
      hours
    };
  }, [weight, weightUnit, age, gender, duration, speed, incline]);

  // Speed comparison data
  const speedComparison = useMemo(() => {
    const weightKg = weightUnit === 'lbs' ? weight / 2.205 : weight;
    const hours = duration / 60;

    let adjustment = 1.0;
    if (age > 50) adjustment -= 0.05;
    if (age > 65) adjustment -= 0.05;
    if (gender === 'female') adjustment -= 0.05;

    return speedOptions.map(opt => {
      let met = opt.met + (incline / 5) * 0.5;
      const calories = Math.round(met * weightKg * hours * adjustment);
      const distance = opt.value * 1.60934 * hours;

      return {
        speed: opt.value,
        label: opt.label,
        calories,
        distance: distance.toFixed(1),
        met: met.toFixed(1)
      };
    });
  }, [weight, weightUnit, age, gender, duration, incline]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const weightKg = weightUnit === 'lbs' ? weight / 2.205 : weight;
    const speedData = speedOptions.find(s => s.value === speed) || speedOptions[1];

    let adjustment = 1.0;
    if (age > 50) adjustment -= 0.05;
    if (age > 65) adjustment -= 0.05;
    if (gender === 'female') adjustment -= 0.05;

    // Scenario 1: Double duration
    const doubleDuration = Math.round(speedData.met * weightKg * (duration * 2 / 60) * adjustment);

    // Scenario 2: Brisk pace
    const briskMet = 3.5 + (incline / 5) * 0.5;
    const briskCalories = Math.round(briskMet * weightKg * (duration / 60) * adjustment);

    // Scenario 3: 5% incline
    const inclineMet = speedData.met + (5 / 5) * 0.5;
    const inclineCalories = Math.round(inclineMet * weightKg * (duration / 60) * adjustment);

    return [
      {
        name: 'Double Duration',
        description: `Walk for ${duration * 2} minutes`,
        calories: doubleDuration,
        extra: doubleDuration - results.totalCalories,
        color: 'bg-green-50',
        textColor: 'text-green-600'
      },
      {
        name: 'Brisk Pace',
        description: '3.5 mph (5.6 km/h)',
        calories: briskCalories,
        extra: briskCalories - results.totalCalories,
        color: 'bg-blue-50',
        textColor: 'text-blue-600'
      },
      {
        name: '5% Incline',
        description: 'Add moderate hills',
        calories: inclineCalories,
        extra: inclineCalories - results.totalCalories,
        color: 'bg-purple-50',
        textColor: 'text-purple-600'
      }
    ];
  }, [weight, weightUnit, age, gender, duration, speed, incline, results.totalCalories]);

  // SVG Bar Chart
  const maxCalories = Math.max(...speedComparison.map(s => s.calories));
  const chartHeight = 140;
  const barColors = ['#94a3b8', '#64748b', '#10b981', '#059669', '#047857', '#065f46'];

  const quickPresets = [
    { label: '15 min', duration: 15, speed: 3.0 },
    { label: '30 min', duration: 30, speed: 3.0 },
    { label: '45 min', duration: 45, speed: 3.5 },
    { label: '60 min', duration: 60, speed: 3.5 }
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3">{getH1('Walking Calorie Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
          Calculate calories burned while walking based on your weight, speed, duration, and terrain
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Quick Presets */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {quickPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setDuration(preset.duration);
                setSpeed(preset.speed);
              }}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                duration === preset.duration && speed === preset.speed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-3 sm:p-5 md:p-8 mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-4 md:space-y-5">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Your Details</h2>

            {/* Personal Info Section */}
            <div className="bg-blue-50 rounded-lg p-3 md:p-4">
              <h4 className="font-semibold text-blue-800 mb-3 text-sm md:text-base">Personal Information</h4>

              {/* Weight */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Weight: {formatNumber(weight)} {weightUnit}
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => setWeightUnit('kg')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      weightUnit === 'kg' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    onClick={() => setWeightUnit('lbs')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      weightUnit === 'lbs' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'
                    }`}
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
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Age */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Age: {age} years
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="mr-2 accent-blue-500"
                    />
                    <span className="text-sm text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="mr-2 accent-blue-500"
                    />
                    <span className="text-sm text-gray-700">Female</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Walking Parameters */}
            <div className="bg-green-50 rounded-lg p-3 md:p-4">
              <h4 className="font-semibold text-green-800 mb-3 text-sm md:text-base">Walking Parameters</h4>

              {/* Duration */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Duration: {duration} minutes
                </label>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-green-600 mt-1">
                  <span>5 min</span>
                  <span>3 hours</span>
                </div>
              </div>

              {/* Walking Speed */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-green-700 mb-2">Walking Speed</label>
                <div className="space-y-2">
                  {speedOptions.slice(0, 4).map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center p-2 md:p-3 rounded-lg cursor-pointer transition-all ${
                        speed === opt.value
                          ? 'bg-green-100 ring-2 ring-green-500'
                          : 'bg-white hover:bg-green-100'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={speed === opt.value}
                        onChange={() => setSpeed(opt.value)}
                        className="mr-2 md:mr-3 accent-green-500"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-800 text-sm">{opt.label}</span>
                        <span className="text-xs text-gray-600 ml-1 md:ml-2 hidden sm:inline">{opt.description}</span>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">MET: {opt.met}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Incline */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Incline: {incline}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={incline}
                  onChange={(e) => setIncline(Number(e.target.value))}
                  className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-green-600 mt-1">
                  <span>Flat</span>
                  <span>Moderate</span>
                  <span>Steep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Calories Burned</h2>

            {/* Main Result */}
            <div className="bg-green-100 rounded-lg p-4 md:p-6 mb-4 text-center">
              <div className="text-sm text-green-700 font-medium">Total Calories Burned</div>
              <div className="text-4xl md:text-5xl font-bold text-green-600 my-2">
                {formatNumber(results.totalCalories)}
              </div>
              <div className="text-sm text-green-700">
                {results.caloriesPerMinute.toFixed(1)} cal/min | MET: {results.met.toFixed(1)}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
              <div className="bg-white rounded-lg p-2 md:p-3 shadow-sm">
                <div className="text-xs text-blue-600">Distance</div>
                <div className="text-base md:text-lg font-bold text-blue-800">{results.distanceKm.toFixed(1)} km</div>
                <div className="text-xs text-blue-600">{results.distanceMiles.toFixed(1)} miles</div>
              </div>
              <div className="bg-white rounded-lg p-2 md:p-3 shadow-sm">
                <div className="text-xs text-purple-600">Steps</div>
                <div className="text-base md:text-lg font-bold text-purple-800">{formatNumber(results.steps)}</div>
                <div className="text-xs text-purple-600">{results.stepsPerMinute}/min</div>
              </div>
<div className="bg-white rounded-lg p-2 md:p-3 shadow-sm">
                <div className="text-xs text-orange-600">Fat Burned</div>
                <div className="text-base md:text-lg font-bold text-orange-800">{results.fatBurned}g</div>
                <div className="text-xs text-orange-600">~30% of calories</div>
              </div>
              <div className="bg-white rounded-lg p-2 md:p-3 shadow-sm">
                <div className="text-xs text-indigo-600">Weekly Goal</div>
                <div className="text-base md:text-lg font-bold text-indigo-800">{formatNumber(results.totalCalories * 7)}</div>
                <div className="text-xs text-indigo-600">if daily</div>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="border-t border-gray-200 pt-4 -mx-3 md:mx-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 px-3 md:px-0">
                Calories at Different Speeds ({duration} min)
              </h3>
              <div className="bg-white rounded-lg p-2 md:p-4">
                <svg viewBox="0 -30 390 220" className="w-full" style={{ overflow: 'visible' }}>
                  {/* Grid lines */}
                  <line x1="40" y1="10" x2="380" y2="10" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="45" x2="380" y2="45" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="80" x2="380" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="115" x2="380" y2="115" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="150" x2="380" y2="150" stroke="#e5e7eb" strokeWidth="1" />

                  {speedComparison.map((item, index) => {
                    const barHeight = maxCalories > 0 ? (item.calories / maxCalories) * chartHeight : 0;
                    const barWidth = 50;
                    const x = 45 + index * 57;
                    const y = 150 - barHeight;
                    const isSelected = item.speed === speed;
                    const isHovered = hoveredBar === index;

                    return (
                      <g
                        key={item.speed}
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          fill={isSelected ? '#10b981' : barColors[index]}
                          rx="4"
                          opacity={isHovered || isSelected ? 1 : 0.8}
                          className="transition-all duration-200"
                        />
                        {/* Hover tooltip */}
                        {isHovered && (
                          <g>
                            <rect
                              x={x - 5}
                              y={y - 32}
                              width={60}
                              height={26}
                              fill="#1f2937"
                              rx="4"
                            />
                            <polygon
                              points={`${x + 25 - 6},${y - 6} ${x + 25 + 6},${y - 6} ${x + 25},${y}`}
                              fill="#1f2937"
                            />
                            <text
                              x={x + 25}
                              y={y - 15}
                              textAnchor="middle"
                              className="text-[11px] fill-white font-semibold"
                            >
                              {item.calories} cal
                            </text>
                          </g>
                        )}
                        {!isHovered && (
                          <text
                            x={x + barWidth / 2}
                            y={y - 5}
                            textAnchor="middle"
                            className="text-[10px] fill-gray-600"
                          >
                            {item.calories}
                          </text>
                        )}
                        <text
                          x={x + barWidth / 2}
                          y={170}
                          textAnchor="middle"
                          className="text-[9px] fill-gray-600"
                        >
                          {item.speed} mph
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y={182}
                          textAnchor="middle"
                          className="text-[8px] fill-gray-400"
                        >
                          {item.label.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Health Benefits */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-medium text-gray-800 mb-2 text-sm">Health Benefits</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Cardiovascular health
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Stronger bones
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Reduced stress
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span> Better sleep
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">What-If Scenarios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className={`${scenario.color} rounded-lg p-3 md:p-4`}>
              <div className="text-sm font-semibold text-gray-800">{scenario.name}</div>
              <div className="text-xs text-gray-600 mb-2">{scenario.description}</div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">{formatNumber(scenario.calories)} cal</div>
              {scenario.extra > 0 && (
                <div className={`text-xs md:text-sm font-medium ${scenario.textColor} mt-1`}>
                  +{formatNumber(scenario.extra)} extra calories
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Speed Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Speed Comparison</h2>
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="text-xs md:text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {showFullSchedule ? 'Show Less' : 'Show All'}
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="min-w-[400px] px-4 md:px-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 md:px-3 py-2 text-left text-xs md:text-sm">Speed</th>
                  <th className="px-2 md:px-3 py-2 text-left text-xs md:text-sm">Pace</th>
                  <th className="px-2 md:px-3 py-2 text-right text-xs md:text-sm">Calories</th>
                  <th className="px-2 md:px-3 py-2 text-right text-xs md:text-sm">Distance</th>
                  <th className="px-2 md:px-3 py-2 text-right text-xs md:text-sm">MET</th>
                </tr>
              </thead>
              <tbody>
                {(showFullSchedule ? speedComparison : speedComparison.slice(0, 4)).map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t border-gray-100 ${item.speed === speed ? 'bg-green-50' : ''}`}
                  >
                    <td className="px-2 md:px-3 py-2 font-medium text-xs md:text-sm">{item.speed} mph</td>
                    <td className="px-2 md:px-3 py-2 text-gray-600 text-xs md:text-sm">{item.label}</td>
                    <td className="px-2 md:px-3 py-2 text-right text-green-600 font-medium text-xs md:text-sm">{item.calories}</td>
                    <td className="px-2 md:px-3 py-2 text-right text-xs md:text-sm">{item.distance} km</td>
                    <td className="px-2 md:px-3 py-2 text-right text-xs md:text-sm">{item.met}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Walking Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Walking Tips & Benefits</h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">Getting Started</h3>
            <ul className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                Start slowly and build up gradually
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                Wear comfortable, supportive shoes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                Stay hydrated during longer walks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                Use proper posture and arm swing
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">Burn More Calories</h3>
            <ul className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                Increase your walking speed
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                Add inclines or hills
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                Walk for longer durations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 flex-shrink-0">✓</span>
                Try interval walking (fast/slow)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Banners */}

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">The Science of Walking and Calorie Burn</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
          Walking is one of the most accessible and sustainable forms of exercise, offering numerous health benefits while burning calories efficiently. Understanding how many calories you burn while walking helps you set realistic fitness goals, track progress toward weight loss targets, and optimize your walking routine. The number of calories burned depends on multiple factors including your body weight, walking speed, duration, terrain, and even environmental conditions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">MET Values</h3>
            <p className="text-xs text-gray-600">Metabolic Equivalent of Task measures energy expenditure. Walking ranges from 2.5 METs (slow) to 6.0+ METs (race walking), determining calories burned per minute.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Body Weight Impact</h3>
            <p className="text-xs text-gray-600">Heavier individuals burn more calories walking the same distance because more energy is required to move greater mass. Every extra 10kg burns ~15% more calories.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">Speed & Intensity</h3>
            <p className="text-xs text-gray-600">Walking speed exponentially increases calorie burn. Doubling your speed from 2 mph to 4 mph more than doubles calorie expenditure due to higher MET values.</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Walking Calorie Calculation Formula</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-3">Our calculator uses the standard MET-based formula for accurate calorie estimation:</p>
          <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
            <p className="font-mono text-sm text-gray-800 mb-2">Calories Burned = MET × Weight (kg) × Duration (hours)</p>
            <p className="text-xs text-gray-600 mt-2">Where MET value depends on walking speed and is adjusted for incline, age, and gender.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>MET Values by Speed:</strong></p>
              <p>• 2.0 mph (slow): 2.5 METs</p>
              <p>• 3.0 mph (moderate): 3.5 METs</p>
              <p>• 3.5 mph (brisk): 4.0 METs</p>
              <p>• 4.0 mph (fast): 5.0 METs</p>
              <p>• 4.5+ mph (very fast): 6.0+ METs</p>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Incline Adjustments:</strong></p>
              <p>• Flat (0%): No adjustment</p>
              <p>• 5% grade: +0.5 MET</p>
              <p>• 10% grade: +1.0 MET</p>
              <p>• 15% grade: +1.5 MET</p>
              <p>Higher inclines increase cardiovascular demand</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Factors Affecting Calorie Burn</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-500 text-lg">⚖️</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Body Weight</h4>
                  <p className="text-xs text-gray-600">The single biggest factor. A 90kg person burns ~40% more calories than a 60kg person walking the same distance at the same speed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-500 text-lg">🏃</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Walking Speed</h4>
                  <p className="text-xs text-gray-600">Speed has exponential impact due to MET increases. Walking 4 mph burns over twice the calories of walking 2 mph for the same duration.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-500 text-lg">⛰️</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Terrain & Incline</h4>
                  <p className="text-xs text-gray-600">Hills, stairs, and uneven terrain increase energy expenditure by 30-100%. Walking uphill at 10% grade can double calorie burn.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Walking for Weight Loss</h3>
            <p className="text-sm text-gray-600 mb-3">Effective strategies to maximize walking's weight loss benefits:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-red-50 rounded">
                <span className="font-bold text-red-600 w-20 text-xs">Frequency</span>
                <span className="text-xs text-gray-600 flex-1">Walk 5-7 days per week for best results; consistency beats intensity</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                <span className="font-bold text-purple-600 w-20 text-xs">Duration</span>
                <span className="text-xs text-gray-600 flex-1">Aim for 45-60 minutes per session to maximize fat burning</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                <span className="font-bold text-blue-600 w-20 text-xs">Intensity</span>
                <span className="text-xs text-gray-600 flex-1">Brisk pace (3.5-4 mph) optimal for calorie burn without overexertion</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <span className="font-bold text-green-600 w-20 text-xs">Deficit</span>
                <span className="text-xs text-gray-600 flex-1">Combined with diet, create 500-750 cal/day deficit for 1-1.5 lbs/week loss</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Maximizing Your Walking Workout</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Interval Walking</h4>
            <p className="text-xs text-gray-600">Alternate between normal and fast-paced walking (2 minutes fast, 1 minute moderate). Burns 15-20% more calories and improves cardiovascular fitness faster than steady-state walking.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Incline Training</h4>
            <p className="text-xs text-gray-600">Use hills or treadmill incline to dramatically increase calorie burn. Even 5% incline adds 50+ calories per hour. Strengthens glutes and hamstrings while reducing knee impact.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Proper Form</h4>
            <p className="text-xs text-gray-600">Maintain upright posture, engage core, swing arms naturally, and take purposeful strides. Good form increases efficiency, prevents injury, and can boost calorie burn by 5-10%.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="walking-calorie-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-6 md:mt-8">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Related Health Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {relatedCalculators.slice(0, 8).map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="p-3 md:p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all h-full">
                <div className="text-xl md:text-2xl mb-2">🚶</div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-800 group-hover:text-green-600 mb-1">
                  {calc.title}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 md:mt-8 p-3 md:p-4 bg-gray-50 rounded-lg">
        <p className="text-[10px] md:text-xs text-gray-500 text-center">
          <strong>Disclaimer:</strong> This calculator provides estimates based on standard MET values.
          Individual results may vary based on fitness level, metabolism, and walking form.
          Consult a healthcare provider before starting any new exercise program.
        </p>
      </div>
    </div>
  );
}
