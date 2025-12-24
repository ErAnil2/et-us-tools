'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is heart rate recovery and why does it matter?",
    answer: "Heart rate recovery (HRR) is the decrease in heart rate after stopping exercise, measured as the difference between your peak exercise heart rate and your heart rate at specific time intervals (typically 1, 2, and 3 minutes post-exercise). It's a powerful indicator of cardiovascular fitness and overall health because it reflects your autonomic nervous system function—specifically, how quickly your parasympathetic nervous system (rest-and-digest) takes over from your sympathetic nervous system (fight-or-flight) after exertion. A faster recovery indicates better cardiovascular fitness, stronger vagal tone, and lower cardiovascular disease risk. Research shows that poor heart rate recovery (<12 bpm drop in first minute) is associated with increased mortality risk, while excellent recovery (>25 bpm drop) indicates superior cardiovascular health and lower risk of heart disease.",
    order: 1
  },
  {
    id: '2',
    question: "What is a normal heart rate recovery after exercise?",
    answer: "Normal heart rate recovery varies by fitness level, but general standards for the 1-minute mark are: Excellent: 25+ bpm drop (indicates outstanding cardiovascular fitness, typical of well-trained athletes). Good: 18-24 bpm drop (above average fitness). Average: 12-17 bpm drop (typical for moderately active adults). Below Average: <12 bpm drop (indicates need for cardiovascular improvement or potential health concerns). By 2 minutes post-exercise, heart rate should drop 30-40 bpm, and by 3 minutes, 50-60 bpm. The 1-minute measurement is most clinically significant and widely studied. Factors affecting recovery include age (decreases with age), fitness level (improves with training), hydration status, ambient temperature, medication use, and overall cardiovascular health.",
    order: 2
  },
  {
    id: '3',
    question: "How can I improve my heart rate recovery?",
    answer: "Improving heart rate recovery requires consistent cardiovascular training and lifestyle optimization: 1) Aerobic Base Building - 150+ minutes weekly of moderate-intensity cardio (60-70% max HR) like jogging, cycling, swimming builds parasympathetic tone. 2) High-Intensity Interval Training (HIIT) - 2-3 sessions weekly of intervals at 80-90% max HR followed by active recovery significantly improves HRR. Studies show 8-12 weeks of HIIT can improve 1-minute HRR by 5-10 bpm. 3) Proper Cool-Down - Don't stop abruptly; gradual 5-10 minute cool-down at low intensity helps train recovery response. 4) Sleep Quality - 7-9 hours nightly supports parasympathetic dominance and recovery. 5) Stress Management - Chronic stress impairs vagal tone; meditation, yoga, deep breathing improve autonomic balance. 6) Hydration - Dehydration slows recovery; maintain proper fluid intake. Improvements typically appear within 4-8 weeks of consistent training.",
    order: 3
  },
  {
    id: '4',
    question: "How do I accurately measure my heart rate recovery?",
    answer: "To accurately measure heart rate recovery: Step 1: Warm up properly (5-10 minutes) before intense exercise. Step 2: Exercise at high intensity (80-90% max HR) for at least 10-15 minutes to reach a steady elevated heart rate. For standardized testing, some protocols use 3-minute all-out effort on treadmill or bike. Step 3: Note your peak heart rate at the end of exercise (immediately upon stopping). Step 4: Stop exercise completely and stand still or sit down (don't walk around during measurement period for standardized results). Step 5: Measure heart rate at exactly 1 minute, 2 minutes, and optionally 3 minutes post-exercise. Step 6: Calculate recovery: Peak HR - HR at 1 min = 1-minute recovery (bpm). Use chest strap heart rate monitor for most accurate measurements (±1 bpm accuracy) rather than wrist-based monitors. Perform test when well-rested, properly hydrated, and in similar conditions for tracking progress over time.",
    order: 4
  },
  {
    id: '5',
    question: "What does poor heart rate recovery indicate about my health?",
    answer: "Poor heart rate recovery (<12 bpm drop in first minute) can indicate several health concerns: 1) Cardiovascular Disease Risk - Multiple studies show poor HRR is an independent predictor of cardiovascular mortality. One landmark study found adults with <12 bpm recovery had 4× higher risk of death from heart disease over 6 years. 2) Autonomic Dysfunction - Slow recovery suggests impaired parasympathetic (vagal) nervous system function, indicating imbalanced autonomic regulation. 3) Low Cardiovascular Fitness - Deconditioned hearts take longer to slow down after exertion due to weak vagal tone and poor cardiac efficiency. 4) Potential Overtraining - Athletes experiencing declining recovery despite continued training may be overtrained, requiring rest. 5) Underlying Conditions - Diabetes, hypertension, thyroid disorders, chronic stress, or sleep apnea can impair recovery. If you consistently measure <10 bpm recovery or notice declining trends, consult a healthcare provider for cardiovascular evaluation, especially if you have risk factors (age >40, family history, diabetes, smoking).",
    order: 5
  },
  {
    id: '6',
    question: "How often should I test my heart rate recovery?",
    answer: "Test frequency depends on your goals and training status: For General Fitness Tracking: Test every 4-6 weeks to monitor progress and training effectiveness. This timeframe allows sufficient adaptation to training stimuli to show measurable improvements. For Athletes/Serious Training: Weekly or bi-weekly testing can track training adaptations and detect overtraining or fatigue accumulation. If recovery declines despite maintained training, it signals need for rest or reduced volume. For Clinical Monitoring: If using HRR to track cardiovascular health improvement (e.g., cardiac rehabilitation, post-illness), test monthly or as directed by healthcare provider. For Consistency: Always test under similar conditions - same time of day, hydration status, rest level, exercise protocol, and environment. Morning tests after rest day provide most consistent baseline. Track results over time; single measurements less meaningful than trends. Most people see 2-5 bpm improvements in 1-minute recovery after 8-12 weeks of consistent cardiovascular training.",
    order: 6
  }
];

export default function RecoveryHeartRateCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('recovery-heart-rate-calculator');

  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');
  const [restingHR, setRestingHR] = useState(70);
  const [maxExerciseHR, setMaxExerciseHR] = useState(180);
  const [hr1min, setHr1min] = useState(150);
  const [hr2min, setHr2min] = useState(130);
  const [hr3min, setHr3min] = useState(115);
  const [exerciseType, setExerciseType] = useState('cardio');
  const [exerciseDuration, setExerciseDuration] = useState(30);

  const [recovery1min, setRecovery1min] = useState('-- bpm');
  const [recovery2min, setRecovery2min] = useState('--');
  const [recovery3min, setRecovery3min] = useState('--');
  const [hrReserve, setHrReserve] = useState('--');
  const [recoveryRate, setRecoveryRate] = useState('--');
  const [fitnessRating, setFitnessRating] = useState('');
  const [fitnessColor, setFitnessColor] = useState('');
  const [fitnessDescription, setFitnessDescription] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Calculate on mount with default values
    calculateRecoveryHR();
  }, []);

  useEffect(() => {
    if (age && restingHR && maxExerciseHR && hr1min) {
      calculateRecoveryHR();
    }
  }, [age, gender, fitnessLevel, restingHR, maxExerciseHR, hr1min, hr2min, hr3min, exerciseType, exerciseDuration]);

  useEffect(() => {
    // Load Chart.js dynamically
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const calculateRecoveryHR = () => {
    if (!age || !restingHR || !maxExerciseHR || !hr1min) {
      return;
    }

    // Calculate recovery drops
    const recovery1minVal = maxExerciseHR - hr1min;
    const recovery2minVal = hr2min ? maxExerciseHR - hr2min : null;
    const recovery3minVal = hr3min ? maxExerciseHR - hr3min : null;

    // Calculate Heart Rate Reserve
    const maxHR = 220 - age;
    const hrReserveVal = maxHR - restingHR;

    // Calculate recovery rate (bpm per minute)
    const recoveryRateVal = recovery1minVal;

    // Assess fitness level based on 1-minute recovery
    let rating, color, description;

    if (recovery1minVal >= 25) {
      rating = 'Excellent';
      color = 'text-green-600 bg-green-50';
      description = 'Outstanding cardiovascular fitness. Your heart recovers very quickly, indicating excellent aerobic conditioning and autonomic function.';
    } else if (recovery1minVal >= 18) {
      rating = 'Good';
      color = 'text-blue-600 bg-blue-50';
      description = 'Good cardiovascular fitness. Your recovery is above average, showing solid aerobic conditioning.';
    } else if (recovery1minVal >= 12) {
      rating = 'Average';
      color = 'text-yellow-600 bg-yellow-50';
      description = 'Average cardiovascular fitness. There\'s room for improvement through consistent cardio training.';
    } else {
      rating = 'Below Average';
      color = 'text-red-600 bg-red-50';
      description = 'Below average recovery. Consider starting or increasing cardio exercise and consult a healthcare provider if concerned.';
    }

    // Generate recommendations
    const recs: string[] = [];

    if (recovery1minVal < 15) {
      recs.push('• Focus on building aerobic base with 150+ minutes moderate exercise weekly');
      recs.push('• Include interval training 2-3 times per week');
      recs.push('• Ensure proper cool-down after workouts');
    } else if (recovery1minVal < 22) {
      recs.push('• Continue current training and add more interval work');
      recs.push('• Consider increasing exercise intensity gradually');
    } else {
      recs.push('• Maintain current excellent fitness level');
      recs.push('• Monitor for any declining trends');
    }

    recs.push('• Track recovery over time to monitor progress');
    recs.push('• Stay hydrated and get adequate sleep');
    recs.push('• Consider stress management techniques');

    // Update state
    setRecovery1min(recovery1minVal + ' bpm');
    setRecovery2min(recovery2minVal ? recovery2minVal + ' bpm' : 'Not measured');
    setRecovery3min(recovery3minVal ? recovery3minVal + ' bpm' : 'Not measured');
    setHrReserve(hrReserveVal + ' bpm');
    setRecoveryRate(recoveryRateVal + ' bpm/min');
    setFitnessRating(rating);
    setFitnessColor(color);
    setFitnessDescription(description);
    setRecommendations(recs);
    setShowAssessment(true);
    setShowRecommendations(true);

    // Create recovery chart
    createRecoveryChart(maxExerciseHR, hr1min, hr2min || 0, hr3min || 0);
  };

  const createRecoveryChart = (maxHR: number, hr1: number, hr2: number, hr3: number) => {
    if (!canvasRef.current) return;

    // Check if Chart.js is loaded
    if (typeof window !== 'undefined' && (window as any).Chart) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const Chart = (window as any).Chart;

      const data = {
        labels: ['Start', '1 min', '2 min', '3 min'],
        datasets: [{
          label: 'Heart Rate (bpm)',
          data: [maxHR, hr1 || null, hr2 || null, hr3 || null],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      };

      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Recovery Time'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Heart Rate (bpm)'
              },
              min: Math.min(maxHR, hr1 || maxHR, hr2 || maxHR, hr3 || maxHR) - 20
            }
          }
        }
      };

      chartRef.current = new Chart(ctx, config);
    } else {
      // Retry after a short delay if Chart.js isn't loaded yet
      setTimeout(() => createRecoveryChart(maxHR, hr1, hr2, hr3), 100);
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">{getH1('Recovery Heart Rate Calculator')}</h1>
        <p className="text-gray-600">Measure your heart rate recovery after exercise to assess cardiovascular fitness and training effectiveness</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Heart Rate Recovery Analysis</h2>

            {/* Personal Info */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  id="age"
                  min={18}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
                <select
                  id="fitnessLevel"
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="athlete">Athlete</option>
                </select>
              </div>
            </div>

            {/* Heart Rate Data */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Heart Rate Measurements</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="restingHR" className="block text-sm font-medium text-gray-700 mb-2">Resting HR (bpm)</label>
                  <input
                    type="number"
                    id="restingHR"
                    min={40}
                    max={120}
                    value={restingHR}
                    onChange={(e) => setRestingHR(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="70"
                  />
                </div>
                <div>
                  <label htmlFor="maxExerciseHR" className="block text-sm font-medium text-gray-700 mb-2">Peak Exercise HR (bpm)</label>
                  <input
                    type="number"
                    id="maxExerciseHR"
                    min={100}
                    max={220}
                    value={maxExerciseHR}
                    onChange={(e) => setMaxExerciseHR(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="180"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="hr1min" className="block text-sm font-medium text-gray-700 mb-2">HR at 1 min (bpm)</label>
                  <input
                    type="number"
                    id="hr1min"
                    min={60}
                    max={200}
                    value={hr1min}
                    onChange={(e) => setHr1min(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label htmlFor="hr2min" className="block text-sm font-medium text-gray-700 mb-2">HR at 2 min (bpm)</label>
                  <input
                    type="number"
                    id="hr2min"
                    min={60}
                    max={180}
                    value={hr2min}
                    onChange={(e) => setHr2min(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="130"
                  />
                </div>
                <div>
                  <label htmlFor="hr3min" className="block text-sm font-medium text-gray-700 mb-2">HR at 3 min (optional)</label>
                  <input
                    type="number"
                    id="hr3min"
                    min={60}
                    max={160}
                    value={hr3min}
                    onChange={(e) => setHr3min(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="115"
                  />
                </div>
              </div>
            </div>

            {/* Exercise Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Exercise Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exerciseType" className="block text-sm font-medium text-gray-700 mb-2">Exercise Type</label>
                  <select
                    id="exerciseType"
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cardio">Cardio/Endurance</option>
                    <option value="hiit">High Intensity (HIIT)</option>
                    <option value="strength">Strength Training</option>
                    <option value="sports">Sports/Activities</option>
                    <option value="test">Fitness Test</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="exerciseDuration" className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    id="exerciseDuration"
                    min={5}
                    max={180}
                    value={exerciseDuration}
                    onChange={(e) => setExerciseDuration(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recovery Analysis</h3>

            <div id="results" className="space-y-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{recovery1min}</div>
                <div className="text-gray-600">1-Minute Recovery</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">2-Minute Recovery:</span>
                  <span className="font-semibold">{recovery2min}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">3-Minute Recovery:</span>
                  <span className="font-semibold">{recovery3min}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Heart Rate Reserve:</span>
                  <span className="font-semibold">{hrReserve}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Recovery Rate:</span>
                  <span className="font-semibold">{recoveryRate}</span>
                </div>
              </div>

              {/* Heart Rate Recovery Chart */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Recovery Progress</h4>
                <div className="relative h-32 bg-gray-50 rounded">
                  <canvas ref={canvasRef} className="w-full h-full"></canvas>
                </div>
              </div>
{/* Fitness Assessment */}
              {showAssessment && (
                <div className={`rounded-lg p-4 ${fitnessColor}`}>
                  <h4 className="font-semibold mb-2">Fitness Assessment</h4>
                  <div className="text-lg font-bold">{fitnessRating}</div>
                  <div className="text-sm mt-2">{fitnessDescription}</div>
                </div>
              )}

              {/* Recommendations */}
              {showRecommendations && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                  <div className="text-sm text-blue-700">
                    {recommendations.map((rec, index) => (
                      <div key={index}>{rec}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Heart Rate Recovery Zones */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Heart Rate Recovery Standards</h2>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left">1-Minute Recovery (bpm)</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left">Fitness Level</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left">Health Status</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 text-left">Training Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-green-50">
                <td className="px-3 sm:px-4 md:px-6 py-4 font-semibold text-green-700">25+ bpm</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Excellent</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Outstanding cardiovascular health</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Maintain current level, focus on performance</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-3 sm:px-4 md:px-6 py-4 font-semibold text-blue-700">18-24 bpm</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Good</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Above average fitness</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Continue training, add intervals</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="px-3 sm:px-4 md:px-6 py-4 font-semibold text-yellow-700">12-17 bpm</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Average</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Typical fitness level</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Increase cardio frequency and intensity</td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-3 sm:px-4 md:px-6 py-4 font-semibold text-red-700">&lt; 12 bpm</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Below Average</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Needs improvement</td>
                <td className="px-3 sm:px-4 md:px-6 py-4">Start with moderate exercise, build base</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Recovery</h3>
            <p className="text-sm text-gray-600">A drop of 20+ bpm in the first minute indicates excellent autonomic nervous system function and cardiovascular fitness.</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Progress Tracking</h3>
            <p className="text-sm text-gray-600">Improvements of 2-3 bpm in recovery over weeks indicate effective training adaptations.</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Warning Signs</h3>
            <p className="text-sm text-gray-600">Declining recovery rates may indicate overtraining, illness, or need for medical evaluation.</p>
          </div>
        </div>
      </div>

      {/* Training Guidelines */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Improving Heart Rate Recovery</h2>

        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-4">Training Strategies</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Aerobic Base Building</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 150+ minutes moderate exercise weekly</li>
                  <li>• 60-70% max heart rate intensity</li>
                  <li>• Activities: walking, jogging, cycling, swimming</li>
                  <li>• Build gradually over 8-12 weeks</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Interval Training</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 2-3 sessions per week maximum</li>
                  <li>• Work intervals: 80-90% max heart rate</li>
                  <li>• Recovery intervals: 60-70% max heart rate</li>
                  <li>• Start with 1:1 work-to-rest ratio</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-4">Recovery Factors</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Lifestyle Support</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 7-9 hours quality sleep nightly</li>
                  <li>• Stress management techniques</li>
                  <li>• Proper hydration (half body weight in oz)</li>
                  <li>• Balanced nutrition with adequate protein</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Recovery Methods</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Active recovery on rest days</li>
                  <li>• Deep breathing exercises</li>
                  <li>• Cold water immersion (if available)</li>
                  <li>• Regular massage or foam rolling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* When to See a Doctor */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">When to Consult Healthcare Provider</h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Warning Signs</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">Consistently Poor Recovery</p>
                  <p className="text-sm text-gray-600">Recovery &lt; 10 bpm after 1 minute consistently</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">Declining Performance</p>
                  <p className="text-sm text-gray-600">Recovery getting worse despite training</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">Chest Pain or Discomfort</p>
                  <p className="text-sm text-gray-600">Any chest pain during or after exercise</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">Irregular Heart Rhythm</p>
                  <p className="text-sm text-gray-600">Skipped beats or irregular patterns</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Medical Evaluation</h3>
            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Consider Professional Assessment If:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Over 40 and starting new exercise program</li>
                <li>• Family history of heart disease</li>
                <li>• Taking medications affecting heart rate</li>
                <li>• History of heart problems or conditions</li>
                <li>• Unexplained fatigue or shortness of breath</li>
                <li>• Diabetes, high blood pressure, or other conditions</li>
              </ul>

              <div className="mt-4 p-3 bg-purple-50 rounded">
                <p className="text-sm font-medium text-purple-800">Remember:</p>
                <p className="text-sm text-purple-700">This calculator is for educational purposes. Always consult healthcare providers for personalized medical advice.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced SEO Content */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">The Science of Heart Rate Recovery</h2>

        <p className="text-gray-700 mb-3 sm:mb-4 md:mb-6">
          Heart rate recovery (HRR) is one of the most powerful yet underutilized biomarkers of cardiovascular health and overall fitness. Unlike resting heart rate or maximum heart rate, HRR specifically measures your autonomic nervous system's ability to transition from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest) dominance after physical exertion. This rapid shift is controlled primarily by vagal tone—the activity of the vagus nerve, which acts as your body's brake pedal for heart rate. Stronger vagal tone enables faster recovery, indicating superior cardiovascular fitness, better stress resilience, and significantly reduced cardiovascular disease risk. Research consistently shows that individuals with poor heart rate recovery ({'<'}12 bpm drop in first minute) have 2-4× higher mortality risk compared to those with excellent recovery ({'>'}25 bpm), making HRR a critical metric for longevity and health optimization.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Autonomic Balance</h3>
            <p className="text-sm text-gray-700">
              HRR reflects the balance between your sympathetic nervous system (accelerates heart rate) and parasympathetic system (slows heart rate via vagus nerve). Faster recovery indicates dominant parasympathetic tone and better autonomic flexibility, essential for stress management and cardiovascular health.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Predictive Power</h3>
            <p className="text-sm text-gray-700">
              HRR is an independent predictor of all-cause mortality and cardiovascular events. Landmark studies show each additional bpm of 1-minute recovery reduces mortality risk by approximately 5-7%. It outperforms many traditional risk factors in predicting long-term health outcomes.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">Training Sensitivity</h3>
            <p className="text-sm text-gray-700">
              HRR responds rapidly to training status, making it ideal for tracking fitness adaptations and detecting overtraining. Improvements of 5-10 bpm are achievable within 8-12 weeks of consistent cardiovascular training, providing motivating feedback on training effectiveness.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">Clinical Significance & Research</h3>
        <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
            <h4 className="font-semibold text-red-800 mb-2">Landmark Cleveland Clinic Study (1999)</h4>
            <p className="text-sm text-gray-700 mb-2">
              Dr. Michael Lauer's groundbreaking research followed 2,428 adults for 6 years after exercise testing. Key findings: Adults with {'<'}12 bpm 1-minute recovery had 4× higher mortality risk. Each additional bpm of recovery reduced death risk by 6%. HRR predicted mortality independent of other risk factors (age, smoking, diabetes, cholesterol).
            </p>
            <p className="text-xs text-gray-600">
              This study established HRR as a powerful, independent cardiovascular risk marker, leading to its inclusion in clinical exercise testing protocols worldwide. It demonstrated that how quickly your heart slows after exercise may be more important than how high it gets during exercise.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Autonomic Nervous System Function</h4>
            <p className="text-sm text-gray-700 mb-2">
              HRR primarily reflects parasympathetic reactivation via the vagus nerve. During exercise, sympathetic activity dominates to increase heart rate. Upon stopping, parasympathetic withdrawal allows rapid heart rate decline. The first minute of recovery is almost entirely vagally mediated. 2-3 minute recovery involves both parasympathetic reactivation and sympathetic withdrawal.
            </p>
            <p className="text-xs text-gray-600">
              Strong vagal tone (high HRV, fast HRR) is associated with: Better stress resilience and emotional regulation. Lower inflammation (vagus nerve has anti-inflammatory effects). Improved metabolic health and insulin sensitivity. Enhanced recovery from illness and injury. Reduced anxiety and depression risk.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">Factors Affecting Heart Rate Recovery</h3>
        <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Cardiovascular Fitness (Primary Factor)</h4>
            <p className="text-sm text-gray-700 mb-2">
              Aerobic training enhances vagal tone and parasympathetic dominance. Well-trained endurance athletes often show 30-40 bpm 1-minute recovery vs. 10-15 bpm in sedentary individuals. Improvements visible within 4-8 weeks of consistent cardio (150+ min/week moderate intensity or 75+ min vigorous).
            </p>
            <p className="text-xs text-gray-600">
              <strong>Training Effects:</strong> HIIT (High-Intensity Interval Training) particularly effective for improving HRR—2-3× weekly for 8 weeks can improve recovery by 8-12 bpm. Moderate continuous training (Zone 2, 60-70% max HR) builds aerobic base supporting parasympathetic function. Proper cool-down (5-10 min gradual decrease) trains recovery response better than abrupt stopping.
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-semibold text-yellow-800 mb-2">Age & Gender</h4>
            <p className="text-sm text-gray-700 mb-2">
              HRR naturally declines with age at approximately 1 bpm per decade after 40 due to reduced vagal tone and autonomic function deterioration. However, active older adults maintain significantly better HRR than sedentary younger individuals. Men typically show slightly faster recovery than women (2-3 bpm difference), partly due to higher average VO2max, though well-trained female athletes match or exceed average male recovery.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Age-Adjusted Standards:</strong> Age 20-30: Excellent {'>'}30 bpm, Average 15-20. Age 40-50: Excellent {'>'}25 bpm, Average 12-17. Age 60+: Excellent {'>'}20 bpm, Average 10-15. Regular exercise can maintain younger HRR profiles well into older age.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Health Conditions & Medications</h4>
            <p className="text-sm text-gray-700 mb-2">
              Beta-blockers significantly slow HRR by blocking sympathetic receptors (users should use RPE instead of HR for training). Diabetes impairs autonomic function, typically reducing HRR by 3-8 bpm. Hypertension and cardiovascular disease correlate with slower recovery. Sleep apnea disrupts autonomic balance, impairing HRR. Chronic stress elevates cortisol, suppressing parasympathetic function.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Medical Significance:</strong> Declining HRR despite maintained fitness warrants medical evaluation—may indicate developing cardiac autonomic neuropathy (common in diabetes), heart failure, or other cardiovascular issues. Always consult healthcare provider if {'<'}10 bpm recovery persists or recovery trends worsen.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">Optimizing Heart Rate Recovery Through Training</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-3">Evidence-Based Training Protocols</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>HIIT for Recovery (Most Effective):</strong> 4-6 × 4-min intervals at 85-95% max HR with 3-min active recovery. 2-3 sessions weekly for 8 weeks improves HRR by 8-15 bpm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Moderate Continuous Training:</strong> 30-60 min at 60-70% max HR, 4-5× weekly builds parasympathetic tone. Less dramatic but sustainable improvements (4-8 bpm over 12 weeks).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Respiratory Training:</strong> Slow breathing exercises (5-6 breaths/min) for 10 min daily increases vagal tone. Combined with aerobic training, enhances HRR by additional 3-5 bpm.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-3">Lifestyle Optimization</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Sleep Priority:</strong> 7-9 hours nightly essential for parasympathetic recovery. Each hour of sleep debt can impair HRR by 1-2 bpm. Sleep apnea treatment improves recovery by 5-10 bpm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Stress Management:</strong> Meditation (20 min daily) shown to improve vagal tone and HRR by 4-6 bpm within 8 weeks. Yoga, tai chi similarly effective.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Hydration & Recovery:</strong> 2-3% dehydration slows HRR by 3-5 bpm. Proper hydration (½ body weight in oz daily) supports cardiovascular function and recovery.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="mt-12">
        <FirebaseFAQs pageId="recovery-heart-rate-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color || 'bg-gray-500'} text-white rounded-lg p-6 hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-xl font-semibold mb-2">{calc.title}</h3>
              <p className="text-white text-opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
