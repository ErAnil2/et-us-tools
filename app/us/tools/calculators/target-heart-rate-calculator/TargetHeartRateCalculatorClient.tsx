'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

interface TargetHeartRateCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

interface HeartRateZone {
  zone: number;
  name: string;
  minPercent: number;
  maxPercent: number;
  color: string;
  bgColor: string;
  description: string;
  emoji: string;
}

const heartRateZones: HeartRateZone[] = [
  { zone: 1, name: 'Recovery', minPercent: 50, maxPercent: 60, color: 'text-blue-700', bgColor: 'bg-blue-100', description: 'Very light - warm up & cool down', emoji: '🚶' },
  { zone: 2, name: 'Fat Burn', minPercent: 60, maxPercent: 70, color: 'text-green-700', bgColor: 'bg-green-100', description: 'Light - optimal fat burning', emoji: '🔥' },
  { zone: 3, name: 'Cardio', minPercent: 70, maxPercent: 80, color: 'text-yellow-700', bgColor: 'bg-yellow-100', description: 'Moderate - cardiovascular fitness', emoji: '💪' },
  { zone: 4, name: 'Threshold', minPercent: 80, maxPercent: 90, color: 'text-orange-700', bgColor: 'bg-orange-100', description: 'Hard - speed & endurance', emoji: '🏃' },
  { zone: 5, name: 'Max Effort', minPercent: 90, maxPercent: 100, color: 'text-red-700', bgColor: 'bg-red-100', description: 'Maximum - peak performance', emoji: '⚡' }
];

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to exercise', restingHR: 75, emoji: '🌱' },
  { value: 'intermediate', label: 'Intermediate', description: '2-4x per week', restingHR: 65, emoji: '🏋️' },
  { value: 'advanced', label: 'Advanced', description: '5+ days per week', restingHR: 55, emoji: '🏆' },
  { value: 'athlete', label: 'Athlete', description: 'Competitive training', restingHR: 45, emoji: '⭐' }
];

const goalOptions = [
  { value: 'fat-loss', label: 'Fat Loss', zones: 'Zone 2', emoji: '🔥' },
  { value: 'cardio', label: 'Cardio Health', zones: 'Zone 2-3', emoji: '❤️' },
  { value: 'endurance', label: 'Endurance', zones: 'Zone 2-4', emoji: '🏃' },
  { value: 'performance', label: 'Performance', zones: 'Zone 4-5', emoji: '🏆' }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is target heart rate and why does it matter?",
    answer: "Target heart rate is the range of heartbeats per minute you should aim for during exercise to get the most benefit. Training in different zones produces different results - lower zones burn more fat, while higher zones improve cardiovascular fitness and speed.",
    order: 1
  },
  {
    id: '2',
    question: "How do I measure my resting heart rate?",
    answer: "Measure your resting heart rate first thing in the morning before getting out of bed. Place two fingers on your wrist or neck, count the beats for 60 seconds. Take measurements for several days and use the average. Typical resting HR is 60-100 bpm; athletes may have 40-60 bpm.",
    order: 2
  },
  {
    id: '3',
    question: "What is the Karvonen formula?",
    answer: "The Karvonen formula calculates target heart rate using your heart rate reserve (HRR = Max HR - Resting HR). Target HR = Resting HR + (HRR × %Intensity). This method is more personalized than simply using a percentage of max HR.",
    order: 3
  },
  {
    id: '4',
    question: "How accurate is the 220-age formula for max heart rate?",
    answer: "The 220-age formula provides a rough estimate but can be off by 10-20 bpm for individuals. For more accuracy, use gender-specific formulas (like Tanaka or Gulati), get a max HR test at a sports lab, or find your actual max during an all-out effort.",
    order: 4
  },
  {
    id: '5',
    question: "How long should I exercise in each zone?",
    answer: "For general fitness, follow the 80/20 rule: spend 80% of training time in Zones 1-2 (easy aerobic) and 20% in Zones 4-5 (high intensity). Beginners should focus on Zone 2 to build aerobic base. For fat loss, Zone 2 is most efficient.",
    order: 5
  },
  {
    id: '6',
    question: "What is heart rate variability (HRV) and how does it relate to training?",
    answer: "Heart Rate Variability (HRV) measures the variation in time between consecutive heartbeats. Higher HRV generally indicates better cardiovascular fitness and recovery. Low HRV suggests your body is stressed or fatigued. Monitor HRV to determine when to push hard (high HRV days) versus when to take it easy (low HRV days). Many fitness watches now track HRV, which helps optimize training intensity and prevent overtraining. A well-recovered athlete typically has higher HRV in the morning.",
    order: 6
  }
];

export default function TargetHeartRateCalculatorClient({ relatedCalculators = [] }: TargetHeartRateCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('target-heart-rate-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [restingHR, setRestingHR] = useState<number | ''>('');
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');
  const [goal, setGoal] = useState('cardio');

  const [results, setResults] = useState({
    maxHR: 0,
    restingHR: 0,
    hrReserve: 0,
    zones: [] as Array<{ zone: number; name: string; minHR: number; maxHR: number; emoji: string; color: string; bgColor: string; description: string }>
  });

  useEffect(() => {
    calculateHeartRateZones();
  }, [gender, age, restingHR, fitnessLevel, goal]);

  const calculateHeartRateZones = () => {
    // Calculate max HR using gender-specific formulas
    let maxHR: number;
    if (gender === 'male') {
      // Tanaka formula for men
      maxHR = Math.round(208 - (0.7 * age));
    } else {
      // Gulati formula for women
      maxHR = Math.round(206 - (0.88 * age));
    }

    // Get resting HR (user input or estimate based on fitness)
    const selectedFitness = fitnessLevels.find(f => f.value === fitnessLevel);
    const actualRestingHR = typeof restingHR === 'number' && restingHR > 0 ? restingHR : (selectedFitness?.restingHR || 70);

    // Heart rate reserve (Karvonen method)
    const hrReserve = maxHR - actualRestingHR;

    // Calculate zones using Karvonen formula
    const calculatedZones = heartRateZones.map(zone => ({
      zone: zone.zone,
      name: zone.name,
      minHR: Math.round(actualRestingHR + (hrReserve * zone.minPercent / 100)),
      maxHR: Math.round(actualRestingHR + (hrReserve * zone.maxPercent / 100)),
      emoji: zone.emoji,
      color: zone.color,
      bgColor: zone.bgColor,
      description: zone.description
    }));

    setResults({
      maxHR,
      restingHR: actualRestingHR,
      hrReserve,
      zones: calculatedZones
    });
  };

  const getRecommendedZones = () => {
    const goalConfig: Record<string, { zones: number[]; description: string }> = {
      'fat-loss': { zones: [2], description: 'Focus on Zone 2 for optimal fat oxidation' },
      'cardio': { zones: [2, 3], description: 'Alternate between Zones 2-3 for heart health' },
      'endurance': { zones: [2, 3, 4], description: 'Build base in Zone 2, train in Zone 3-4' },
      'performance': { zones: [4, 5], description: 'Include intervals in Zones 4-5 for speed' }
    };
    return goalConfig[goal] || goalConfig['cardio'];
  };

  return (
    <main className="flex-grow">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{getH1('Target Heart Rate Calculator')}</h1>
          <p className="text-gray-600">Calculate your personalized heart rate zones for optimal training</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          {/* Gender Selection */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  gender === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1 block">👨</span>
                <span className="font-medium">Male</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  gender === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1 block">👩</span>
                <span className="font-medium">Female</span>
              </button>
            </div>
          </div>

          {/* Age Slider */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Age</label>
              <span className="text-lg font-bold text-red-600">{age} years</span>
            </div>
            <input
              type="range"
              min="18"
              max="80"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-red-200 to-red-400 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>18</span>
              <span>80</span>
            </div>
          </div>

          {/* Resting Heart Rate */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Resting Heart Rate (optional)</label>
              <span className="text-xs text-gray-500">Leave empty to estimate</span>
            </div>
            <input
              type="number"
              value={restingHR}
              onChange={(e) => setRestingHR(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g., 65 bpm"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
              min="30"
              max="120"
            />
          </div>

          {/* Fitness Level */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Fitness Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {fitnessLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFitnessLevel(level.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    fitnessLevel === level.value
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-xl block mb-1">{level.emoji}</span>
                  <span className="text-xs font-medium block">{level.label}</span>
                  <span className="text-[10px] text-gray-500 block">{level.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Training Goal */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Training Goal</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {goalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGoal(option.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    goal === option.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-xl block mb-1">{option.emoji}</span>
                  <span className="text-xs font-medium block">{option.label}</span>
                  <span className="text-[10px] text-gray-500 block">{option.zones}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-xl p-4 text-white text-center">
                <div className="text-red-100 text-xs mb-1">Max Heart Rate</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.maxHR}</div>
                <div className="text-red-100 text-xs">bpm</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                <div className="text-blue-100 text-xs mb-1">Resting HR</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.restingHR}</div>
                <div className="text-blue-100 text-xs">bpm</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white text-center">
                <div className="text-green-100 text-xs mb-1">HR Reserve</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">{results.hrReserve}</div>
                <div className="text-green-100 text-xs">bpm</div>
              </div>
            </div>

            {/* Heart Rate Zones */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Heart Rate Zones</h4>
              <div className="space-y-2">
                {results.zones.map((zone) => {
                  const recommended = getRecommendedZones();
                  const isRecommended = recommended.zones.includes(zone.zone);
                  return (
                    <div
                      key={zone.zone}
                      className={`${zone.bgColor} rounded-lg p-3 flex items-center justify-between ${
                        isRecommended ? 'ring-2 ring-offset-1 ring-orange-400' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{zone.emoji}</span>
                        <div>
                          <div className={`font-semibold ${zone.color}`}>
                            Zone {zone.zone}: {zone.name}
                            {isRecommended && <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Recommended</span>}
                          </div>
                          <div className="text-xs text-gray-600">{zone.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${zone.color}`}>{zone.minHR}-{zone.maxHR}</div>
                        <div className="text-xs text-gray-500">bpm</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Goal Recommendation */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Training Recommendation</h4>
              <p className="text-sm text-gray-600">{getRecommendedZones().description}</p>
              <div className="mt-3 text-xs text-gray-500">
                <strong>80/20 Rule:</strong> Spend 80% of training time in easy zones (1-2) and 20% in hard zones (4-5)
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Related Calculators */}
        {relatedCalculators.length > 0 && (
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedCalculators.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-red-600 transition-colors">{calc.title}</h3>
                  <p className="text-xs text-gray-500">{calc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Zone Guide */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-2xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span>💡</span> Zone Benefits
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">Z1-2:</span>
                <span>Burns fat, builds endurance base, low injury risk</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">Z3:</span>
                <span>Improves cardiovascular fitness, moderate calorie burn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">Z4:</span>
                <span>Increases lactate threshold, improves race pace</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">Z5:</span>
                <span>Develops max power and VO2max, sprint performance</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 rounded-2xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
              <span>⚠️</span> Safety Tips
            </h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Warm up in Zone 1 before intense exercise
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Cool down gradually after hard workouts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Stop if you feel chest pain or dizziness
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Consult doctor if over 40 or have health conditions
              </li>
            </ul>
          </div>
        </div>

        {/* How to Measure */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">How to Monitor Your Heart Rate</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">⌚</span>
              <div className="font-semibold text-gray-800">Fitness Watch</div>
              <div className="text-xs text-gray-500 mt-1">Continuous optical HR monitoring</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">💗</span>
              <div className="font-semibold text-gray-800">Chest Strap</div>
              <div className="text-xs text-gray-500 mt-1">Most accurate for training</div>
            </div>
<div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">✋</span>
              <div className="font-semibold text-gray-800">Manual Pulse</div>
              <div className="text-xs text-gray-500 mt-1">Count 15 sec × 4</div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Target Heart Rate Training</h2>

          <p className="text-gray-700 mb-3 sm:mb-4 md:mb-6">
            Target heart rate training is a scientific approach to exercise that uses your heart rate to optimize workout intensity and achieve specific fitness goals. By training within specific heart rate zones—each representing a percentage of your maximum heart rate—you can maximize fat burning, improve cardiovascular endurance, build speed, or enhance athletic performance. This calculator uses the Karvonen formula, which accounts for your resting heart rate, providing more personalized and accurate training zones than simple age-based formulas.
          </p>

          {/* Key Concepts */}
          <div className="grid md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 border border-red-100">
              <h3 className="font-semibold text-red-800 mb-2">Maximum Heart Rate</h3>
              <p className="text-sm text-gray-700">
                The highest number of beats per minute your heart can achieve during maximal exertion. Calculated using gender-specific formulas: Tanaka (men: 208 - 0.7×age) and Gulati (women: 206 - 0.88×age) for better accuracy than the traditional 220-age formula.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Heart Rate Reserve</h3>
              <p className="text-sm text-gray-700">
                The difference between your maximum and resting heart rate (HRR = Max HR - Resting HR). This represents your heart's working capacity and is used in the Karvonen formula to calculate more personalized training zones based on your individual fitness level.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-semibold text-green-800 mb-2">Training Zones</h3>
              <p className="text-sm text-gray-700">
                Five distinct heart rate ranges (50-100% of HRR) that target different physiological adaptations: Zone 1 (Recovery), Zone 2 (Fat Burn), Zone 3 (Cardio), Zone 4 (Threshold), and Zone 5 (Max Effort). Each zone serves specific training purposes and produces different results.
              </p>
            </div>
          </div>

          {/* Calculation Methods */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">Heart Rate Calculation Methods</h3>
          <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-100">
              <h4 className="font-semibold text-red-800 mb-2">Karvonen Formula (Heart Rate Reserve Method)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Formula:</strong> Target HR = Resting HR + (HRR × %Intensity)<br />
                <strong>Example (30-year-old with 65 bpm resting HR):</strong> For 70% intensity: 65 + [(178 - 65) × 0.70] = 144 bpm
              </p>
              <p className="text-xs text-gray-600">
                Most accurate method as it accounts for individual fitness level through resting heart rate. Recommended by exercise physiologists for personalized training zones. Better for athletes and individuals with low or high resting heart rates.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Tanaka Formula (Men) - Modern Max HR Calculation</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Formula:</strong> Max HR = 208 - (0.7 × age)<br />
                <strong>Example:</strong> 30-year-old male: 208 - (0.7 × 30) = 187 bpm
              </p>
              <p className="text-xs text-gray-600">
                Updated formula based on meta-analysis of 351 studies. More accurate than 220-age, especially for younger and older adults. Standard deviation ±10 bpm means individual variation is normal.
              </p>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-100">
              <h4 className="font-semibold text-pink-800 mb-2">Gulati Formula (Women) - Gender-Specific Calculation</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Formula:</strong> Max HR = 206 - (0.88 × age)<br />
                <strong>Example:</strong> 30-year-old female: 206 - (0.88 × 30) = 180 bpm
              </p>
              <p className="text-xs text-gray-600">
                Developed specifically for women through research showing they have different max HR patterns than men. Provides more accurate zones for female athletes and fitness enthusiasts. Standard deviation ±10 bpm.
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Traditional Formula (220-Age) - Quick Estimate</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Formula:</strong> Max HR = 220 - age<br />
                <strong>Example:</strong> 30-year-old: 220 - 30 = 190 bpm
              </p>
              <p className="text-xs text-gray-600">
                Simple but less accurate method with larger margin of error (±10-20 bpm). Not gender-specific. Useful for quick estimates but gender-specific formulas recommended for training zones. May overestimate max HR for younger adults.
              </p>
            </div>
          </div>

          {/* The 5 Heart Rate Zones */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">The 5 Heart Rate Training Zones</h3>
          <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Zone 1: Recovery & Warm-Up (50-60% HRR)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Purpose:</strong> Active recovery, warm-up, cool-down, building aerobic base<br />
                <strong>Duration:</strong> 20-60 minutes | <strong>Feeling:</strong> Very comfortable, can hold full conversation
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Benefits:</strong> Promotes blood flow and recovery, reduces muscle soreness, teaches body to use fat for fuel, prepares cardiovascular system for harder efforts, builds capillary networks.
              </p>
              <p className="text-xs text-gray-600">
                <strong>Best For:</strong> Beginners starting exercise, recovery days between hard workouts, warming up before intense training, cooling down after races, active rest for overtraining prevention.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Zone 2: Fat Burn & Base Building (60-70% HRR)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Purpose:</strong> Aerobic endurance, fat oxidation, metabolic efficiency<br />
                <strong>Duration:</strong> 30-120 minutes | <strong>Feeling:</strong> Comfortable, can talk in full sentences
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Benefits:</strong> Maximum fat burning (60-70% of calories from fat), builds mitochondrial density, improves metabolic flexibility, enhances endurance without fatigue, strengthens heart muscle efficiency.
              </p>
              <p className="text-xs text-gray-600">
                <strong>Best For:</strong> Weight loss (most efficient fat oxidation zone), building aerobic base for endurance sports, long slow distance training, metabolic health, beginner to intermediate fitness levels, 80% of training time for athletes.
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100">
              <h4 className="font-semibold text-yellow-800 mb-2">Zone 3: Cardio & Tempo (70-80% HRR)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Purpose:</strong> Cardiovascular fitness, moderate intensity training<br />
                <strong>Duration:</strong> 20-60 minutes | <strong>Feeling:</strong> Moderately hard, can speak short sentences
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Benefits:</strong> Improves cardiovascular efficiency, increases stroke volume, enhances lactate clearance, builds aerobic capacity, strengthens heart and lungs, moderate calorie burn (50/50 fat/carbs).
              </p>
              <p className="text-xs text-gray-600">
                <strong>Best For:</strong> General cardiovascular health, tempo runs for runners, steady-state cardio, improving fitness base, intermediate exercisers, race pace training for longer events (half marathon, marathon).
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-orange-800 mb-2">Zone 4: Lactate Threshold (80-90% HRR)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Purpose:</strong> Anaerobic threshold, speed endurance, race pace<br />
                <strong>Duration:</strong> 10-40 minutes (intervals) | <strong>Feeling:</strong> Hard, can only speak 1-2 words, breathing heavily
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Benefits:</strong> Raises lactate threshold (ability to sustain higher intensities), improves VO2max, increases anaerobic capacity, enhances speed, burns primarily carbohydrates, builds mental toughness.
              </p>
              <p className="text-xs text-gray-600">
                <strong>Best For:</strong> Advanced athletes, race pace training for 5K-10K, threshold intervals, speed work, competitive training, improving performance, breaking through plateaus. Limit to 1-2 sessions per week to avoid overtraining.
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-100">
              <h4 className="font-semibold text-red-800 mb-2">Zone 5: Maximum Effort (90-100% HRR)</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Purpose:</strong> Peak performance, sprint training, VO2max development<br />
                <strong>Duration:</strong> 30 seconds - 5 minutes (short intervals) | <strong>Feeling:</strong> Maximum effort, cannot talk, gasping for air
              </p>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Benefits:</strong> Develops maximum speed and power, increases VO2max (maximum oxygen uptake), improves anaerobic system, builds fast-twitch muscle fibers, enhances neuromuscular coordination, highest calorie burn.
              </p>
              <p className="text-xs text-gray-600">
                <strong>Best For:</strong> Elite athletes, HIIT training, sprint intervals, competitive racing, breaking personal records, peak performance. Should represent only 5-10% of total training. Requires adequate recovery (48-72 hours between sessions).
              </p>
            </div>
          </div>

          {/* Training Applications by Goal */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">Training Applications by Goal</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <h4 className="font-semibold text-green-800 mb-3">Fat Loss & Weight Management</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Primary Zone:</strong> Zone 2 (60-70%) for 45-90 minutes, 4-5x per week for maximum fat oxidation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Secondary:</strong> Zone 3 (70-80%) for 30-45 minutes, 2-3x per week for calorie burn and metabolism boost</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Add HIIT:</strong> Zone 4-5 intervals 1-2x per week for afterburn effect (EPOC - excess post-exercise oxygen consumption)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span><strong>Strategy:</strong> Fasted Zone 2 cardio in morning maximizes fat utilization; combine with caloric deficit for weight loss</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-3">Cardiovascular Health</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Base Training:</strong> Zone 2 (60-70%) for 30-60 minutes, 3-4x per week builds strong aerobic foundation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Cardio Workouts:</strong> Zone 3 (70-80%) for 20-40 minutes, 2-3x per week improves heart efficiency and stroke volume</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Guidelines:</strong> 150 minutes moderate (Zone 2-3) OR 75 minutes vigorous (Zone 4) per week (CDC recommendations)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Benefits:</strong> Lowers resting heart rate, reduces blood pressure, improves cholesterol, decreases cardiovascular disease risk</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-orange-800 mb-3">Endurance Training (Marathon, Triathlon)</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Base Phase:</strong> 80% Zone 2, 10% Zone 3, 10% Zone 1 to build aerobic capacity and mitochondrial density</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Build Phase:</strong> Add Zone 3 tempo runs (20-40 min) 1x/week and Zone 4 threshold intervals (4-6 × 5 min) 1x/week</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Peak Phase:</strong> Include race-pace efforts in Zone 3-4, maintain Zone 2 for long runs, taper with Zone 1-2 only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Long Runs:</strong> Stay in Zone 2 (60-70%) for runs over 90 minutes to build endurance without excessive fatigue</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-3">Performance & Speed (5K, 10K, Competition)</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Speed Work:</strong> Zone 5 intervals (400m-800m repeats) 1x/week with full recovery to develop max speed and power</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Threshold Training:</strong> Zone 4 (80-90%) tempo intervals (3-4 × 8-10 min) 1x/week to raise lactate threshold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Recovery:</strong> 60% Zone 2 easy runs for active recovery and maintaining aerobic base between hard efforts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Periodization:</strong> Cycle through base (Zone 2), build (Zone 3-4), and peak (Zone 4-5) phases; avoid Zone 3 "junk miles"</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Training Principles & Tips */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">Heart Rate Training Principles & Optimization</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">The 80/20 Training Rule</h4>
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  Elite endurance athletes spend approximately 80% of training time at low intensity (Zones 1-2) and only 20% at moderate-high intensity (Zones 3-5). This polarized training approach:
                </p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600">•</span>
                    <span>Prevents overtraining and burnout from excessive high-intensity work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600">•</span>
                    <span>Maximizes adaptation by ensuring quality hard days and genuine recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600">•</span>
                    <span>Builds massive aerobic base supporting all higher intensity efforts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-600">•</span>
                    <span>Avoids "Zone 3 trap" (middle intensity that's too hard for recovery, too easy for adaptation)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Monitoring & Measurement</h4>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100 mb-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">⌚</span>
                    <span><strong>Fitness Watches:</strong> Optical HR sensors convenient for continuous monitoring; accurate within 5-10 bpm during steady-state cardio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">💓</span>
                    <span><strong>Chest Straps:</strong> Most accurate method (±1 bpm); recommended for interval training where precision matters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">📊</span>
                    <span><strong>HRV Monitoring:</strong> Track heart rate variability daily to assess recovery and determine training intensity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">🔄</span>
                    <span><strong>Resting HR Trends:</strong> Decreasing resting HR over weeks/months indicates improving cardiovascular fitness</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Factors Affecting Heart Rate</h4>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100 mb-4">
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span><strong>Heat & Humidity:</strong> Increases HR by 10-20 bpm; adjust zones downward in hot weather</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span><strong>Altitude:</strong> Raises HR at same effort level due to lower oxygen; allow 1-2 weeks acclimatization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span><strong>Dehydration:</strong> 2% body weight loss can increase HR by 3-5%; hydrate consistently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span><strong>Caffeine:</strong> Can increase resting HR by 5-15 bpm; account for in morning measurements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span><strong>Stress & Sleep:</strong> Poor sleep and high stress elevate HR; adjust training intensity accordingly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span><strong>Medications:</strong> Beta-blockers, stimulants affect HR; consult doctor for adjusted zones</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Common Training Mistakes</h4>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-100 mb-4">
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span><strong>Training Too Hard Too Often:</strong> Every run in Zone 3-4 leads to insufficient recovery and plateau</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span><strong>Ignoring Zone 2:</strong> Skipping easy aerobic work limits aerobic capacity and endurance potential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span><strong>Using Only Age Formula:</strong> 220-age can be inaccurate; test actual max or use gender-specific formulas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span><strong>Not Adjusting for Conditions:</strong> Same HR targets in heat/altitude/illness leads to overtraining</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <span><strong>Cardiac Drift Panic:</strong> HR naturally rises 5-10% during long efforts; normal physiological response</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Advanced Concepts */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Heart Rate Training Concepts</h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-2">Heart Rate Variability (HRV) for Training Optimization</h4>
              <p className="text-sm text-gray-700 mb-2">
                HRV measures the variation in time between heartbeats (milliseconds between beats). Higher HRV indicates better cardiovascular fitness, recovery, and autonomic nervous system balance. Low HRV suggests stress, fatigue, or overtraining.
              </p>
              <p className="text-xs text-gray-600">
                <strong>Application:</strong> Measure HRV first thing in morning. High HRV (above baseline) = ready for hard training (Zone 4-5). Low HRV (below baseline) = stick to Zone 1-2 recovery or rest day. Track trends over weeks/months, not day-to-day fluctuations. Many fitness watches now offer HRV tracking and training readiness scores.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Cardiac Drift & Decoupling</h4>
              <p className="text-sm text-gray-700 mb-2">
                During prolonged exercise (60+ minutes), heart rate gradually increases even at constant pace/power—this is cardiac drift. Caused by dehydration, rising core temperature, and cardiovascular fatigue. Well-trained athletes show less drift.
              </p>
              <p className="text-xs text-gray-600">
                <strong>Decoupling Analysis:</strong> Compare HR in first vs. second half of long runs. Less than 5% increase = good aerobic efficiency. More than 10% = need more Zone 2 base training. Use this metric to assess aerobic development and hydration strategies. Example: HR increases from 145 to 155 at same pace = 6.9% drift (moderate coupling).
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Lactate Threshold Heart Rate (LTHR)</h4>
              <p className="text-sm text-gray-700 mb-2">
                LTHR is the heart rate at which lactate begins accumulating faster than the body can clear it—typically around Zone 4 (80-90%). This is the maximum sustainable intensity for 30-60 minutes (roughly 10K-half marathon pace for runners).
              </p>
              <p className="text-xs text-gray-600">
                <strong>Testing LTHR:</strong> After warm-up, run/bike at maximum sustainable effort for 20-30 minutes. Average HR for last 20 minutes ≈ LTHR. Use this as anchor point for training zones. Threshold training (intervals at 95-105% LTHR) is most effective for improving this critical fitness marker. Retest every 6-8 weeks as fitness improves.
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-orange-800 mb-2">Max Heart Rate Testing</h4>
              <p className="text-sm text-gray-700 mb-2">
                For most accurate zones, test actual maximum HR rather than using age formulas. After thorough warm-up, perform 3 × 3-minute all-out efforts with 3-minute recovery. Highest HR achieved in final effort is your max HR.
              </p>
              <p className="text-xs text-gray-600">
                <strong>Safety Note:</strong> Only attempt if healthy with no cardiovascular conditions. Best done on track or treadmill. Alternative: Note highest HR during races or all-out hill sprints. Max HR declines approximately 0.5-1 bpm per year with aging, so retest annually. Sports labs offer VO2max testing with precise max HR measurement.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <FirebaseFAQs pageId="target-heart-rate-calculator" fallbackFaqs={fallbackFaqs} />

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides estimates based on standard formulas. Individual heart rate zones may vary. Consult a healthcare provider before starting an intense exercise program, especially if you have cardiovascular conditions.
          </p>
        </div>
      </div>
    </main>
  );
}
