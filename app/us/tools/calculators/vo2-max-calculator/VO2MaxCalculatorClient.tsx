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
  color?: string;
  icon?: string;
}

interface VO2MaxCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

type TestMethod = 'running' | 'step' | 'estimate';
type RunningTest = '12min' | '15min' | '1.5mile';
type FitnessLevel = 'poor' | 'fair' | 'average' | 'good' | 'excellent';

const testMethods = [
  { value: 'running' as TestMethod, label: 'Running Test', description: 'Cooper or distance test', emoji: '🏃' },
  { value: 'step' as TestMethod, label: 'Step Test', description: '3-min step test', emoji: '🪜' },
  { value: 'estimate' as TestMethod, label: 'Estimate', description: 'Based on profile', emoji: '📊' }
];

const fitnessLevels = [
  { value: 'poor' as FitnessLevel, label: 'Poor', multiplier: 0.7, emoji: '😓' },
  { value: 'fair' as FitnessLevel, label: 'Fair', multiplier: 0.85, emoji: '🙂' },
  { value: 'average' as FitnessLevel, label: 'Average', multiplier: 1.0, emoji: '👍' },
  { value: 'good' as FitnessLevel, label: 'Good', multiplier: 1.2, emoji: '💪' },
  { value: 'excellent' as FitnessLevel, label: 'Excellent', multiplier: 1.4, emoji: '🏆' }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is VO2 max and why is it important?",
    answer: "VO2 max (maximal oxygen uptake) is the maximum amount of oxygen your body can use during intense exercise, measured in milliliters of oxygen per kilogram of body weight per minute (ml/kg/min). It's the gold standard for measuring cardiovascular fitness and aerobic capacity. VO2 max reflects the combined efficiency of your cardiovascular system (heart, lungs, blood vessels) and muscular system (mitochondrial density, oxidative enzymes) to deliver and utilize oxygen during maximal exertion. Higher VO2 max means better endurance performance, improved athletic capacity, and significant health benefits. Research consistently shows that higher VO2 max is associated with lower risk of heart disease, metabolic syndrome, type 2 diabetes, and all-cause mortality. Each 1 MET (3.5 ml/kg/min) increase in VO2 max reduces mortality risk by approximately 13-15%. Elite endurance athletes achieve values of 70-85+ ml/kg/min, while sedentary adults may be 25-35 ml/kg/min.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate are these VO2 max estimates?",
    answer: "Field tests like the Cooper 12-minute run test and 3-minute step test typically estimate VO2 max within 10-15% of laboratory results when performed correctly. Laboratory VO2 max testing (graded exercise test with gas analysis) is the gold standard, measuring actual oxygen consumption and carbon dioxide production through a metabolic cart—accurate to ±2-3%. Field tests rely on validated formulas correlating performance (distance covered or heart rate response) to VO2 max. Accuracy depends on: proper test execution (maximal effort required), fitness level (more accurate for trained individuals), environmental conditions (temperature, altitude affect performance), and test familiarity. While less precise than lab testing, field tests are excellent for tracking relative progress over time—consistent protocol allows you to monitor training adaptations and fitness trends reliably.",
    order: 2
  },
  {
    id: '3',
    question: "How can I improve my VO2 max?",
    answer: "VO2 max can be improved through specific training protocols: 1) High-Intensity Interval Training (HIIT) - Most effective method. Perform 4-6 × 3-5 minute intervals at 90-95% max HR with 2-3 min recovery, 2× weekly. Improvements of 15-25% possible in 8-12 weeks for beginners. 2) Tempo/Threshold Runs - 20-40 minutes at 80-85% max HR, 1-2× weekly improves lactate threshold and oxygen delivery. 3) Long Slow Distance - 60-90+ min at 60-70% max HR builds mitochondrial density and capillary networks. 4) Strength Training - 2× weekly improves running economy and muscular endurance, indirectly supporting VO2 max. Genetics account for 40-50% of VO2 max potential, but training can improve anyone's baseline by 15-30%. Greatest improvements occur in untrained individuals (20-30% gains), while trained athletes may see 5-15% improvements. Consistent training for 12-16 weeks required for significant adaptations.",
    order: 3
  },
  {
    id: '4',
    question: "What is a good VO2 max for my age?",
    answer: "VO2 max standards vary by age and gender due to natural physiological changes. Men aged 20-29: Excellent >55, Good 45-54, Average 35-44, Fair 25-34, Poor <25 ml/kg/min. Men aged 30-39: Excellent >52, Good 42-51, Average 32-41. Men aged 40-49: Excellent >49, Good 39-48. Women aged 20-29: Excellent >49, Good 39-48, Average 29-38, Fair 19-28, Poor <19. Women aged 30-39: Excellent >46, Good 36-45, Average 26-35. Women aged 40-49: Excellent >43, Good 33-42. VO2 max naturally declines approximately 8-10% per decade after age 25-30 (≈1% per year) due to reduced maximum heart rate, decreased cardiac output, and muscle mass loss. However, active older adults maintain significantly higher VO2 max than sedentary younger individuals—a 60-year-old athlete may have better VO2 max than a sedentary 30-year-old. Regular endurance training can slow decline to 5% per decade.",
    order: 4
  },
  {
    id: '5',
    question: "How often should I test my VO2 max?",
    answer: "Test frequency depends on training goals and status: For General Fitness: Test every 8-12 weeks (2-3 months) to monitor progress. This timeframe allows sufficient physiological adaptations (mitochondrial biogenesis, capillary development, cardiac remodeling) to manifest as measurable VO2 max improvements. For Athletes/Competitive Training: Test every 4-6 weeks during build phases, monthly during peak training to track adaptations and adjust programming. For Beginners: Wait 8-12 weeks between tests to allow base fitness development and avoid discouragement from small initial changes. Testing Protocol: Allow 48-72 hours recovery before testing (no hard workouts 2 days prior). Test under consistent conditions (same time of day, temperature, hydration, nutrition). Use same test method each time for valid comparisons. Track trends over multiple tests rather than focusing on single measurements. Most significant improvements occur in first 12-16 weeks of consistent training, after which gains plateau without progressive overload.",
    order: 5
  },
  {
    id: '6',
    question: "What's the difference between VO2 max and lactate threshold?",
    answer: "VO2 max and lactate threshold are distinct but related markers of endurance fitness: VO2 max (Aerobic Capacity) is the maximum rate your body can consume oxygen during all-out effort—represents the ceiling of your aerobic system. It's reached at 95-100% max effort for 3-8 minutes. Primarily genetic (40-50% determined) with training providing 15-30% improvements. Lactate Threshold (Anaerobic Threshold) is the exercise intensity where lactate production exceeds clearance, typically 75-85% of VO2 max. Sustainable for 30-60 minutes (10K-half marathon pace). Highly trainable (30-40% improvements possible) through threshold workouts. Practical Difference: Two athletes with identical VO2 max (50 ml/kg/min) can have vastly different performance if one has higher lactate threshold. Runner A: VO2 max 50, threshold at 70% = 35 ml/kg/min sustainable. Runner B: VO2 max 50, threshold at 85% = 42.5 ml/kg/min sustainable. Runner B performs much better despite same VO2 max. For endurance performance, lactate threshold often matters more than VO2 max for events >10 minutes.",
    order: 6
  }
];

export default function VO2MaxCalculatorClient({ relatedCalculators = [] }: VO2MaxCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('vo2-max-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(150);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [testMethod, setTestMethod] = useState<TestMethod>('running');
  const [runningTest, setRunningTest] = useState<RunningTest>('12min');
  const [distance, setDistance] = useState(1.5);
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles');
  const [timeMinutes, setTimeMinutes] = useState(12);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [restingHR, setRestingHR] = useState(70);
  const [recoveryHR, setRecoveryHR] = useState(120);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('average');

  const [results, setResults] = useState({
    vo2max: 0,
    rating: '',
    percentile: '',
    fitnessAge: 0
  });

  useEffect(() => {
    calculateVO2Max();
  }, [gender, age, weight, weightUnit, testMethod, runningTest, distance, distanceUnit, timeMinutes, timeSeconds, restingHR, recoveryHR, fitnessLevel]);

  const calculateVO2Max = () => {
    let vo2max = 0;

    if (testMethod === 'running') {
      vo2max = calculateRunningVO2Max();
    } else if (testMethod === 'step') {
      vo2max = calculateStepVO2Max();
    } else {
      vo2max = estimateVO2Max();
    }

    const rating = getRating(vo2max);
    const percentile = getPercentile(vo2max);
    const fitnessAge = calculateFitnessAge(vo2max);

    setResults({ vo2max, rating, percentile, fitnessAge });
  };

  const calculateRunningVO2Max = () => {
    let distanceMeters = distanceUnit === 'miles' ? distance * 1609.34 : distance * 1000;

    if (runningTest === '12min') {
      // Cooper formula
      return (distanceMeters - 504.9) / 44.73;
    } else if (runningTest === '15min') {
      return 15.3 * (distanceMeters / 1000) / 15;
    } else {
      // 1.5 mile time
      const totalMinutes = timeMinutes + timeSeconds / 60;
      return 483 / totalMinutes + 3.5;
    }
  };

  const calculateStepVO2Max = () => {
    const hrDiff = recoveryHR - restingHR;
    let vo2 = 111.33 - (0.42 * hrDiff);
    if (gender === 'female') vo2 *= 0.85;
    vo2 -= (age - 25) * 0.5;
    return Math.max(vo2, 15);
  };

  const estimateVO2Max = () => {
    let baseVO2 = gender === 'male' ? 50 - (age - 25) * 0.5 : 42 - (age - 25) * 0.4;
    const multiplier = fitnessLevels.find(f => f.value === fitnessLevel)?.multiplier || 1;
    return Math.max(baseVO2 * multiplier, 15);
  };

  const getStandards = () => {
    const standards: Record<string, Record<string, { excellent: number; good: number; average: number; fair: number }>> = {
      male: {
        '20-29': { excellent: 55, good: 45, average: 35, fair: 25 },
        '30-39': { excellent: 52, good: 42, average: 32, fair: 22 },
        '40-49': { excellent: 49, good: 39, average: 29, fair: 19 },
        '50-59': { excellent: 45, good: 35, average: 25, fair: 15 },
        '60+': { excellent: 41, good: 31, average: 21, fair: 11 }
      },
      female: {
        '20-29': { excellent: 49, good: 39, average: 29, fair: 19 },
        '30-39': { excellent: 46, good: 36, average: 26, fair: 16 },
        '40-49': { excellent: 43, good: 33, average: 23, fair: 13 },
        '50-59': { excellent: 39, good: 29, average: 19, fair: 9 },
        '60+': { excellent: 35, good: 25, average: 15, fair: 5 }
      }
    };
    const ageGroup = age < 30 ? '20-29' : age < 40 ? '30-39' : age < 50 ? '40-49' : age < 60 ? '50-59' : '60+';
    return standards[gender][ageGroup];
  };

  const getRating = (vo2: number) => {
    const s = getStandards();
    if (vo2 >= s.excellent) return 'Excellent';
    if (vo2 >= s.good) return 'Good';
    if (vo2 >= s.average) return 'Average';
    if (vo2 >= s.fair) return 'Fair';
    return 'Poor';
  };

  const getPercentile = (vo2: number) => {
    const s = getStandards();
    if (vo2 >= s.excellent) return 'Top 5%';
    if (vo2 >= s.good) return 'Top 25%';
    if (vo2 >= s.average) return 'Top 50%';
    if (vo2 >= s.fair) return 'Top 75%';
    return 'Bottom 25%';
  };

  const calculateFitnessAge = (vo2: number) => {
    // Rough estimate: VO2 max declines ~1% per year after 30
    const baseVO2 = gender === 'male' ? 50 : 42;
    const declineRate = gender === 'male' ? 0.5 : 0.4;
    const fitnessAge = 25 + (baseVO2 - vo2) / declineRate;
    return Math.max(18, Math.min(80, Math.round(fitnessAge)));
  };

  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      'Excellent': 'from-green-500 to-emerald-600',
      'Good': 'from-blue-500 to-indigo-600',
      'Average': 'from-yellow-500 to-orange-500',
      'Fair': 'from-orange-500 to-red-500',
      'Poor': 'from-red-500 to-rose-600'
    };
    return colors[rating] || 'from-gray-500 to-gray-600';
  };

  const handleWeightUnitChange = (unit: 'lbs' | 'kg') => {
    if (unit !== weightUnit) {
      setWeight(unit === 'kg' ? Math.round(weight * 0.453592) : Math.round(weight / 0.453592));
      setWeightUnit(unit);
    }
  };

  const handleDistanceUnitChange = (unit: 'miles' | 'km') => {
    if (unit !== distanceUnit) {
      setDistance(unit === 'km' ? Math.round(distance * 1.60934 * 10) / 10 : Math.round(distance / 1.60934 * 10) / 10);
      setDistanceUnit(unit);
    }
  };

  return (
    <main className="flex-grow">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{getH1('VO2 Max Calculator')}</h1>
          <p className="text-gray-600">Estimate your cardiovascular fitness and aerobic capacity</p>
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
              <span className="text-lg font-bold text-blue-600">{age} years</span>
            </div>
            <input
              type="range"
              min="18"
              max="80"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>18</span>
              <span>80</span>
            </div>
          </div>

          {/* Test Method */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Test Method</label>
            <div className="grid grid-cols-3 gap-2">
              {testMethods.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setTestMethod(method.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    testMethod === method.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <span className="text-2xl block mb-1">{method.emoji}</span>
                  <span className="text-xs font-medium block">{method.label}</span>
                  <span className="text-[10px] text-gray-500 block">{method.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Running Test Options */}
          {testMethod === 'running' && (
            <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Test Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: '12min' as RunningTest, label: '12-Min Cooper' },
                    { value: '15min' as RunningTest, label: '15-Min Run' },
                    { value: '1.5mile' as RunningTest, label: '1.5 Mile Time' }
                  ].map((test) => (
                    <button
                      key={test.value}
                      type="button"
                      onClick={() => setRunningTest(test.value)}
                      className={`p-3 rounded-xl border-2 text-sm transition-all ${
                        runningTest === test.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {test.label}
                    </button>
                  ))}
                </div>
              </div>

              {runningTest !== '1.5mile' ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Distance Covered</label>
                    <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => handleDistanceUnitChange('miles')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                          distanceUnit === 'miles' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        miles
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDistanceUnitChange('km')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                          distanceUnit === 'km' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        km
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    step="0.1"
                    min="0.5"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time to Complete 1.5 Miles</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        value={timeMinutes}
                        onChange={(e) => setTimeMinutes(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        min="6"
                        max="30"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">min</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={timeSeconds}
                        onChange={(e) => setTimeSeconds(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        min="0"
                        max="59"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">sec</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step Test Options */}
          {testMethod === 'step' && (
            <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                <strong>Step Test Instructions:</strong> Step up and down on a 12-inch (30cm) platform for 3 minutes at a steady pace (96 beats per minute or 24 steps/min). Then measure your heart rate 1 minute after stopping.
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resting Heart Rate (before test)</label>
                <input
                  type="number"
                  value={restingHR}
                  onChange={(e) => setRestingHR(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="70"
                  min="40"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recovery Heart Rate (1 min after test)</label>
                <input
                  type="number"
                  value={recoveryHR}
                  onChange={(e) => setRecoveryHR(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="120"
                  min="60"
                  max="200"
                />
              </div>
            </div>
          )}

          {/* Estimate Options */}
          {testMethod === 'estimate' && (
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Current Fitness Level</label>
              <div className="grid grid-cols-5 gap-2">
                {fitnessLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFitnessLevel(level.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      fitnessLevel === level.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-xl block mb-1">{level.emoji}</span>
                    <span className="text-xs font-medium block">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="space-y-4">
            {/* Primary Result */}
            <div className={`bg-gradient-to-r ${getRatingColor(results.rating)} rounded-2xl p-6 text-white`}>
              <div className="text-center">
                <div className="text-white/80 text-sm font-medium mb-1">Your VO2 Max</div>
                <div className="text-5xl font-bold mb-2">{results.vo2max.toFixed(1)}</div>
                <div className="text-white/80 text-sm">ml/kg/min</div>
              </div>
            </div>

            {/* Secondary Results */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-gray-500 text-xs mb-1">Rating</div>
                <div className="text-xl font-bold text-gray-800">{results.rating}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-gray-500 text-xs mb-1">Percentile</div>
                <div className="text-xl font-bold text-gray-800">{results.percentile}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-gray-500 text-xs mb-1">Fitness Age</div>
                <div className="text-xl font-bold text-gray-800">{results.fitnessAge}</div>
              </div>
            </div>

            {/* Visual Scale */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Fitness Level</h4>
              <div className="relative h-6 rounded-full overflow-hidden bg-gradient-to-r from-red-400 via-yellow-400 to-green-400">
                <div
                  className="absolute top-0 h-full w-1 bg-white border-2 border-gray-800 rounded-full transition-all"
                  style={{ left: `${Math.min(95, Math.max(5, (results.vo2max / 70) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Poor</span>
                <span>Fair</span>
                <span>Average</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </div>

        {/* VO2 Max Standards */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">VO2 Max Standards (ml/kg/min)</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span>👨</span> Men
              </h4>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left">Age</th>
                      <th className="px-3 py-2 text-center">Poor</th>
                      <th className="px-3 py-2 text-center">Fair</th>
                      <th className="px-3 py-2 text-center">Good</th>
                      <th className="px-3 py-2 text-center">Exc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-3 py-2">20-29</td><td className="px-3 py-2 text-center">&lt;25</td><td className="px-3 py-2 text-center">25-34</td><td className="px-3 py-2 text-center">45-54</td><td className="px-3 py-2 text-center">55+</td></tr>
                    <tr className="bg-gray-50"><td className="px-3 py-2">30-39</td><td className="px-3 py-2 text-center">&lt;22</td><td className="px-3 py-2 text-center">22-31</td><td className="px-3 py-2 text-center">42-51</td><td className="px-3 py-2 text-center">52+</td></tr>
                    <tr><td className="px-3 py-2">40-49</td><td className="px-3 py-2 text-center">&lt;19</td><td className="px-3 py-2 text-center">19-28</td><td className="px-3 py-2 text-center">39-48</td><td className="px-3 py-2 text-center">49+</td></tr>
                    <tr className="bg-gray-50"><td className="px-3 py-2">50+</td><td className="px-3 py-2 text-center">&lt;15</td><td className="px-3 py-2 text-center">15-24</td><td className="px-3 py-2 text-center">35-44</td><td className="px-3 py-2 text-center">45+</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2">
                <span>👩</span> Women
              </h4>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-pink-500 text-white">
                    <tr>
                      <th className="px-3 py-2 text-left">Age</th>
                      <th className="px-3 py-2 text-center">Poor</th>
                      <th className="px-3 py-2 text-center">Fair</th>
                      <th className="px-3 py-2 text-center">Good</th>
                      <th className="px-3 py-2 text-center">Exc</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-3 py-2">20-29</td><td className="px-3 py-2 text-center">&lt;19</td><td className="px-3 py-2 text-center">19-28</td><td className="px-3 py-2 text-center">39-48</td><td className="px-3 py-2 text-center">49+</td></tr>
                    <tr className="bg-gray-50"><td className="px-3 py-2">30-39</td><td className="px-3 py-2 text-center">&lt;16</td><td className="px-3 py-2 text-center">16-25</td><td className="px-3 py-2 text-center">36-45</td><td className="px-3 py-2 text-center">46+</td></tr>
                    <tr><td className="px-3 py-2">40-49</td><td className="px-3 py-2 text-center">&lt;13</td><td className="px-3 py-2 text-center">13-22</td><td className="px-3 py-2 text-center">33-42</td><td className="px-3 py-2 text-center">43+</td></tr>
                    <tr className="bg-gray-50"><td className="px-3 py-2">50+</td><td className="px-3 py-2 text-center">&lt;9</td><td className="px-3 py-2 text-center">9-18</td><td className="px-3 py-2 text-center">29-38</td><td className="px-3 py-2 text-center">39+</td></tr>
                  </tbody>
                </table>
              </div>
</div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-green-50 rounded-2xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <span>📈</span> Improve Your VO2 Max
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• High-intensity interval training (HIIT) 2-3x/week</li>
              <li>• Long slow distance (LSD) runs for aerobic base</li>
              <li>• Tempo runs at 80-90% max effort</li>
              <li>• Cross-training (cycling, swimming, rowing)</li>
              <li>• Allow adequate recovery between hard sessions</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span>🎯</span> What Affects VO2 Max
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <strong>Genetics:</strong> Sets upper limit potential</li>
              <li>• <strong>Age:</strong> Declines ~1%/year after 30</li>
              <li>• <strong>Training:</strong> Can improve 15-20%</li>
              <li>• <strong>Body composition:</strong> Lower fat = higher VO2</li>
              <li>• <strong>Altitude:</strong> Temporarily decreases VO2</li>
            </ul>
          </div>
        </div>

        {/* Comprehensive SEO Content */}
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding VO2 Max: The Gold Standard of Fitness</h2>
          <p className="text-gray-700 mb-3 sm:mb-4 md:mb-6">
            VO2 max represents the maximum rate at which your body can consume oxygen during intense exercise—the definitive measure of cardiovascular fitness and aerobic capacity. This metric integrates your entire oxygen delivery system (heart, lungs, blood) and utilization system (muscles, mitochondria), making it the most comprehensive indicator of endurance performance and overall health. Each 1 MET (3.5 ml/kg/min) increase in VO2 max reduces mortality risk by 13-15%, making it one of the strongest predictors of longevity.
          </p>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <FirebaseFAQs pageId="vo2-max-calculator" fallbackFaqs={fallbackFaqs} />

{/* Original FAQ code removed - replaced with FirebaseFAQs above */}
{/*      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {fallbackFaqs.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-3 sm:px-4 md:px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-3 sm:px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div> */}

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
                  <div className={`w-10 h-10 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-3`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                  <p className="text-xs text-gray-500">{calc.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This calculator provides estimates based on standard formulas. Field test estimates may vary 10-15% from laboratory measurements. Consult a healthcare provider before starting any intense exercise program.
          </p>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

    </main>
  );
}
