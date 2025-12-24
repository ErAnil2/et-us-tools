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

interface AgeChartRow {
  age: string;
  men: string;
  women: string;
}

interface FitnessChartRow {
  category: string;
  range: string;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Resting Heart Rate Calculator?",
    answer: "A Resting Heart Rate Calculator is a health and fitness tool that helps you calculate resting heart rate-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Resting Heart Rate Calculator?",
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
    answer: "Use the results as a starting point for understanding your resting heart rate status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function RestingHeartRateCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('resting-heart-rate-calculator');

  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [fitnessLevel, setFitnessLevel] = useState('average');
  const [restingHR, setRestingHR] = useState(70);

  const [measurementActive, setMeasurementActive] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [measurementTimer, setMeasurementTimer] = useState<NodeJS.Timeout | null>(null);

  const [rhrResult, setRhrResult] = useState('70');
  const [categoryResult, setCategoryResult] = useState('');
  const [fitnessScore, setFitnessScore] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [markerPosition, setMarkerPosition] = useState(50);
  const [showResults, setShowResults] = useState(false);

  const rhrCharts = {
    age: [
      { age: '18-25', men: '56-61', women: '61-65' },
      { age: '26-35', men: '55-61', women: '60-64' },
      { age: '36-45', men: '57-62', women: '62-66' },
      { age: '46-55', men: '58-63', women: '63-67' },
      { age: '56-65', men: '57-61', women: '62-65' },
      { age: '65+', men: '56-61', women: '60-64' }
    ],
    fitness: [
      { category: 'Elite Athletes', range: '40-50 bpm' },
      { category: 'Well-trained', range: '50-60 bpm' },
      { category: 'Above Average', range: '60-70 bpm' },
      { category: 'Average', range: '70-80 bpm' },
      { category: 'Below Average', range: '80-90 bpm' },
      { category: 'Poor', range: '90+ bpm' }
    ]
  };

  useEffect(() => {
    analyzeRHR();
  }, [age, gender, fitnessLevel, restingHR]);

  useEffect(() => {
    return () => {
      if (measurementTimer) {
        clearInterval(measurementTimer);
      }
    };
  }, [measurementTimer]);

  const startMeasurement = () => {
    setBeatCount(0);
    setTimeRemaining(60);
    setMeasurementActive(true);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          stopMeasurement();
          setRestingHR(beatCount);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    setMeasurementTimer(timer);
  };

  const incrementCount = () => {
    setBeatCount((prev) => prev + 1);
  };

  const stopMeasurement = () => {
    if (measurementTimer) {
      clearInterval(measurementTimer);
      setMeasurementTimer(null);
    }
    setMeasurementActive(false);

    if (beatCount > 0) {
      const actualTime = 60 - timeRemaining;
      if (actualTime > 0) {
        const extrapolatedHR = Math.round((beatCount / actualTime) * 60);
        setRestingHR(extrapolatedHR);
      }
    }
  };

  const getRHRCategory = (rhr: number, age: number, gender: string, fitnessLevel: string): string => {
    if (fitnessLevel === 'athlete') {
      if (rhr < 45) return 'Elite Athlete';
      if (rhr < 55) return 'Well-trained Athlete';
      return 'Above Average';
    }

    if (rhr < 50) return 'Excellent';
    if (rhr < 60) return 'Good';
    if (rhr < 70) return 'Above Average';
    if (rhr < 80) return 'Average';
    if (rhr < 90) return 'Below Average';
    return 'Poor';
  };

  const getFitnessScore = (rhr: number, age: number, gender: string): number => {
    let baseScore = Math.max(0, 100 - (rhr - 40));

    if (age > 50) baseScore += 5;
    if (age > 65) baseScore += 5;

    if (gender === 'female') baseScore += 3;

    return Math.min(100, Math.max(0, Math.round(baseScore)));
  };

  const updateHRMarker = (rhr: number): void => {
    const minHR = 40;
    const maxHR = 110;
    const position = Math.max(0, Math.min(100, ((rhr - minHR) / (maxHR - minHR)) * 100));
    setMarkerPosition(position);
  };

  const getInterpretation = (rhr: number, category: string, age: number, gender: string, fitnessLevel: string): string => {
    let interpretation = `Your resting heart rate of ${rhr} bpm is classified as "${category}" for a ${age}-year-old ${gender}. `;

    if (rhr < 60) {
      interpretation += 'This indicates excellent cardiovascular fitness. Your heart is very efficient at pumping blood.';
    } else if (rhr < 80) {
      interpretation += 'This is within the normal healthy range. Regular exercise can help lower it further.';
    } else if (rhr < 100) {
      interpretation += 'This is higher than optimal. Consider increasing physical activity and managing stress levels.';
    } else {
      interpretation += 'This is above the normal range. Consult with a healthcare provider for evaluation.';
    }

    if (fitnessLevel === 'athlete' && rhr > 65) {
      interpretation += ' For your fitness level, this seems higher than expected - consider factors like stress, recovery, or overtraining.';
    }

    return interpretation;
  };

  const analyzeRHR = () => {
    if (!restingHR || restingHR < 30 || restingHR > 120) {
      return;
    }

    setRhrResult(restingHR + ' bpm');

    const category = getRHRCategory(restingHR, age, gender, fitnessLevel);
    setCategoryResult(category);

    const score = getFitnessScore(restingHR, age, gender);
    setFitnessScore(score + '/100');

    updateHRMarker(restingHR);

    const interp = getInterpretation(restingHR, category, age, gender, fitnessLevel);
    setInterpretation(interp);

    setShowResults(true);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Resting Heart Rate Calculator')}</h1>
        <p className="text-xl text-gray-600 mb-3 sm:mb-4 md:mb-6 max-w-3xl mx-auto">
          Measure and analyze your resting heart rate to assess cardiovascular fitness and overall heart health.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">RHR Assessment</h2>

            {/* Basic Information */}
            <div className="grid md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  id="age"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Female</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Fitness Level</label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fitnessLevel"
                      value="sedentary"
                      checked={fitnessLevel === 'sedentary'}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Sedentary</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fitnessLevel"
                      value="average"
                      checked={fitnessLevel === 'average'}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Average</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fitnessLevel"
                      value="fit"
                      checked={fitnessLevel === 'fit'}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Well-trained</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="fitnessLevel"
                      value="athlete"
                      checked={fitnessLevel === 'athlete'}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Elite Athlete</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Heart Rate Input */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Resting Heart Rate</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="restingHR" className="block text-sm font-medium text-gray-700 mb-2">
                    Resting Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    id="restingHR"
                    min="30"
                    max="120"
                    value={restingHR}
                    onChange={(e) => setRestingHR(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={startMeasurement}
                    disabled={measurementActive}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start 60-Second Count
                  </button>
                </div>
              </div>

              {/* Live Measurement Tool */}
              {measurementActive && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">{timeRemaining}</div>
                    <div className="text-sm text-red-700 mb-3">Seconds remaining</div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={incrementCount}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 sm:px-4 md:px-6 rounded"
                      >
                        Count Beat ({beatCount})
                      </button>
                      <button
                        onClick={stopMeasurement}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Measurement Instructions */}
            <div className="mb-3 sm:mb-4 md:mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📋 How to Measure RHR</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div><strong>1. Rest:</strong> Sit quietly for 5-10 minutes</div>
                <div><strong>2. Find pulse:</strong> Wrist (radial) or neck (carotid)</div>
                <div><strong>3. Count beats:</strong> For 60 seconds or use our timer</div>
                <div><strong>4. Best time:</strong> Morning before getting out of bed</div>
                <div><strong>5. Consistency:</strong> Same time each day for tracking</div>
              </div>
            </div>

            <button
              onClick={analyzeRHR}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Analyze My RHR
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">Results update automatically as you type</p>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* RHR Charts by Demographics */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">RHR Reference Charts</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">By Age & Gender</h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Age</th>
                        <th className="px-3 py-2 text-left font-semibold">Men</th>
                        <th className="px-3 py-2 text-left font-semibold">Women</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rhrCharts.age.map((row: AgeChartRow, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{row.age}</td>
                          <td className="px-3 py-2 text-blue-600">{row.men}</td>
                          <td className="px-3 py-2 text-pink-600">{row.women}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">By Fitness Level</h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Category</th>
                        <th className="px-3 py-2 text-left font-semibold">RHR Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rhrCharts.fitness.map((row: FitnessChartRow, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{row.category}</td>
                          <td className="px-3 py-2">{row.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Results */}
          {showResults && (
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Your RHR Analysis</h3>

              <div className="space-y-3">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">{rhrResult}</div>
                  <div className="text-xs text-red-700">Your RHR (bpm)</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600 mb-1">{categoryResult}</div>
                  <div className="text-xs text-green-700">Category</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 mb-1">{fitnessScore}</div>
                  <div className="text-xs text-blue-700">Fitness Score</div>
                </div>
              </div>

              {/* Visual Heart Rate Scale */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Heart Rate Scale</h4>
                <div className="relative h-6 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-full">
                  <div
                    className="absolute top-0 w-3 h-6 bg-gray-800 rounded-full transform -translate-x-1 transition-all duration-500"
                    style={{ left: `${markerPosition}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                      <span>{restingHR}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>40</span>
                  <span>70</span>
                  <span>100+</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-1">Interpretation</h4>
                <div className="text-xs text-gray-700">{interpretation}</div>
              </div>
            </div>
)}

          <div className="bg-red-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-red-800 mb-3">❤️ What is RHR?</h3>
            <div className="space-y-2 text-sm text-red-700">
              <div><strong>Definition:</strong> Heart beats per minute at rest</div>
              <div><strong>Normal range:</strong> 60-100 bpm</div>
              <div><strong>Athletes:</strong> Often 40-60 bpm</div>
              <div><strong>Indicator:</strong> Cardiovascular fitness</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">📈 Factors Affecting RHR</h3>
            <div className="space-y-3 text-sm text-green-700">
              <div>
                <strong>Lower RHR:</strong><br />
                • Regular exercise<br />
                • Good cardiovascular fitness<br />
                • Adequate rest
              </div>
              <div>
                <strong>Higher RHR:</strong><br />
                • Stress, anxiety<br />
                • Caffeine, medications<br />
                • Illness, dehydration
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips Section */}
      <div className="mt-8 grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-blue-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">🎯 Improving RHR</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Regular aerobic exercise</li>
            <li>• Strength training</li>
            <li>• Stress management</li>
            <li>• Adequate sleep (7-9 hours)</li>
            <li>• Healthy diet</li>
            <li>• Stay hydrated</li>
          </ul>
        </div>

        <div className="bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-amber-800 mb-3">⚠️ When to See a Doctor</h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li>• RHR consistently over 100</li>
            <li>• RHR under 40 (non-athletes)</li>
            <li>• Sudden changes in RHR</li>
            <li>• Chest pain or dizziness</li>
            <li>• Irregular heartbeat</li>
          </ul>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Your Resting Heart Rate</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Why RHR Matters</h3>
            <p className="text-gray-600 mb-4">
              Your resting heart rate is a simple but powerful indicator of cardiovascular health. A lower RHR generally indicates more efficient heart function and better cardiovascular fitness.
            </p>

            <h4 className="font-semibold mb-2">Health Connections:</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• <strong>Fitness level:</strong> Lower RHR = better fitness</li>
              <li>• <strong>Heart efficiency:</strong> Stronger heart pumps more blood per beat</li>
              <li>• <strong>Recovery ability:</strong> How quickly you bounce back from stress</li>
              <li>• <strong>Disease risk:</strong> Predictor of cardiovascular events</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Tracking Your Progress</h3>
            <p className="text-gray-600 mb-4">
              Regular RHR monitoring can help track fitness improvements, detect overtraining, and identify potential health issues early. Consistency in measurement timing and conditions is key.
            </p>

            <h4 className="font-semibold mb-2">Measurement Best Practices:</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• <strong>Timing:</strong> Same time daily, preferably morning</li>
              <li>• <strong>Conditions:</strong> Rested, calm, before caffeine</li>
              <li>• <strong>Position:</strong> Sitting or lying down</li>
              <li>• <strong>Duration:</strong> Full 60 seconds for accuracy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">❤️</div>
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
        <FirebaseFAQs pageId="resting-heart-rate-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
