'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a normal body water percentage?",
    answer: "Normal body water percentage varies by age and gender. For men: 55-65% (decreasing with age from 58-65% at 18-25 years to 52-59% at 65+). For women: 45-55% (decreasing from 52-59% at 18-25 years to 46-53% at 65+). Athletes and individuals with higher muscle mass typically have higher water percentages, while those with higher body fat have lower percentages. Women naturally have lower water percentages due to higher essential body fat.",
    order: 1
  },
  {
    id: '2',
    question: "How is body water percentage calculated?",
    answer: "Body water percentage is calculated using validated formulas like the Watson formula (most widely used) or Hume-Weyers formula. These equations consider height, weight, age, and gender. The Watson formula for men: TBW = 2.447 - (0.09156 × age) + (0.1074 × height_cm) + (0.3362 × weight_kg). For more accuracy, when body fat percentage is known, lean body mass can be used since muscle tissue is approximately 73% water. The calculator divides total body water (in liters or kg) by body weight to get the percentage.",
    order: 2
  },
  {
    id: '3',
    question: "What factors affect body water percentage?",
    answer: "Several factors influence body water percentage: 1) Body composition - muscle tissue contains ~73% water while fat tissue contains only ~10%, so higher muscle mass means higher water percentage. 2) Age - water percentage decreases with age due to muscle loss. 3) Gender - men typically have 5-10% higher water percentage than women due to greater muscle mass. 4) Hydration status - dehydration lowers water percentage. 5) Health conditions - kidney disease, heart failure, or hormonal imbalances can affect fluid retention. 6) Medications - diuretics, steroids, and other drugs can alter water balance.",
    order: 3
  },
  {
    id: '4',
    question: "What does low body water percentage indicate?",
    answer: "Low body water percentage (below normal ranges) can indicate: 1) Dehydration - insufficient fluid intake or excessive losses through sweat, vomiting, or diarrhea. 2) High body fat percentage - fat tissue contains minimal water, so increased adiposity lowers overall water percentage. 3) Age-related changes - natural decline in muscle mass and cellular water. 4) Chronic conditions - kidney disease, diabetes, or malnutrition. Symptoms may include fatigue, dizziness, dark urine, dry skin, and decreased performance. Persistent low readings warrant medical evaluation to rule out underlying conditions.",
    order: 4
  },
  {
    id: '5',
    question: "Can body water percentage be too high?",
    answer: "Yes, unusually high body water percentage can indicate: 1) Excellent hydration combined with high muscle mass (common in athletes) - this is healthy. 2) Fluid retention (edema) - caused by heart failure, kidney disease, liver cirrhosis, or hormonal imbalances. 3) Overhydration (rare) - excessive water intake overwhelming kidney capacity. 4) Low body fat percentage - while having low body fat is often desirable, extremely low levels (<5% men, <12% women) can be unhealthy. If water percentage is significantly above normal ranges and you're not an athlete, consult a healthcare provider to rule out medical conditions.",
    order: 5
  },
  {
    id: '6',
    question: "How can I improve my body water percentage?",
    answer: "To optimize body water percentage: 1) Stay hydrated - drink 35ml per kg body weight daily (more for athletes or hot climates). 2) Build muscle mass - resistance training 3-5x per week increases muscle, which holds more water than fat. 3) Reduce excess body fat - through calorie deficit and exercise, maintaining healthy body composition. 4) Eat water-rich foods - fruits, vegetables, soups contribute to hydration. 5) Limit alcohol and caffeine - both have mild diuretic effects. 6) Monitor urine color - pale yellow indicates good hydration. 7) Time water intake - drink before, during, and after exercise. 8) Consider electrolytes - especially for athletes or during prolonged exercise.",
    order: 6
  }
];
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface BodyWaterPercentageClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type Units = 'metric' | 'imperial';
type Gender = 'male' | 'female';
type Activity = 'sedentary' | 'active' | 'athlete' | 'elderly';

const bodyWaterRanges = {
  men: [
    { age: '18-25', range: '58-65%' },
    { age: '26-35', range: '57-64%' },
    { age: '36-45', range: '56-63%' },
    { age: '46-55', range: '55-62%' },
    { age: '56-65', range: '54-61%' },
    { age: '65+', range: '52-59%' }
  ],
  women: [
    { age: '18-25', range: '52-59%' },
    { age: '26-35', range: '51-58%' },
    { age: '36-45', range: '50-57%' },
    { age: '46-55', range: '49-56%' },
    { age: '56-65', range: '48-55%' },
    { age: '65+', range: '46-53%' }
  ]
};

export default function BodyWaterPercentageClient({ relatedCalculators = defaultRelatedCalculators }: BodyWaterPercentageClientProps) {
  const { getH1, getSubHeading } = usePageSEO('body-water-percentage-calculator');

  const [units, setUnits] = useState<Units>('metric');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [activity, setActivity] = useState<Activity>('sedentary');

  // Results
  const [waterPercentage, setWaterPercentage] = useState(0);
  const [totalBodyWater, setTotalBodyWater] = useState(0);
  const [hydrationStatus, setHydrationStatus] = useState('Normal');
  const [dailyWaterNeeds, setDailyWaterNeeds] = useState('');
  const [intracellularWater, setIntracellularWater] = useState(0);
  const [extracellularWater, setExtracellularWater] = useState(0);
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    calculateBodyWater();
  }, [units, age, gender, weight, height, bodyFat, activity]);

  const toggleUnits = (newUnits: Units) => {
    if (newUnits === units) return;

    if (newUnits === 'imperial') {
      // Convert kg/cm to lbs/inches
      setWeight(parseFloat((weight / 0.453592).toFixed(1)));
      setHeight(parseFloat((height / 2.54).toFixed(1)));
    } else {
      // Convert lbs/inches to kg/cm
      setWeight(parseFloat((weight * 0.453592).toFixed(1)));
      setHeight(parseFloat((height * 2.54).toFixed(1)));
    }
    setUnits(newUnits);
  };

  const calculateAllFormulas = (weightKg: number, heightCm: number) => {
    const results: any = {};

    // Watson Formula (most widely used)
    if (gender === 'male') {
      results.watson = 2.447 - (0.09156 * age) + (0.1074 * heightCm) + (0.3362 * weightKg);
    } else {
      results.watson = -2.097 + (0.1069 * heightCm) + (0.2466 * weightKg);
    }

    // Hume-Weyers Formula
    if (gender === 'male') {
      results.hume = (0.194786 * heightCm) + (0.296785 * weightKg) - 14.012934;
    } else {
      results.hume = (0.34454 * heightCm) + (0.183809 * weightKg) - 35.270121;
    }

    // If body fat is known, use lean body mass calculation
    if (bodyFat !== null && bodyFat > 0) {
      const leanMass = weightKg * (1 - bodyFat / 100);
      results.leanMass = leanMass * 0.73; // Muscle tissue is ~73% water
    }

    // Activity-adjusted calculation
    let activityMultiplier = 1.0;
    switch (activity) {
      case 'athlete':
        activityMultiplier = 1.05;
        break;
      case 'active':
        activityMultiplier = 1.02;
        break;
      case 'elderly':
        activityMultiplier = 0.95;
        break;
    }

    // Apply activity adjustment to Watson (primary formula)
    results.adjusted = results.watson * activityMultiplier;

    // Calculate average
    const formulaValues = bodyFat && bodyFat > 0
      ? [results.watson, results.hume, results.leanMass]
      : [results.watson, results.hume];

    results.average = formulaValues.reduce((sum, val) => sum + val, 0) / formulaValues.length;

    return results;
  };

  const getHydrationStatus = (waterPct: number, currentAge: number, currentGender: Gender) => {
    const ranges = bodyWaterRanges[currentGender === 'male' ? 'men' : 'women'];
    const ageGroup = ranges.find(r => {
      if (r.age === '65+') return currentAge >= 65;
      const [min, max] = r.age.split('-').map(Number);
      return currentAge >= min && currentAge <= max;
    });

    if (!ageGroup) return { status: 'Unknown', color: 'gray' };

    const [minPercent, maxPercent] = ageGroup.range.replace('%', '').split('-').map(Number);

    if (waterPct < minPercent - 3) {
      return { status: 'Low', color: 'red' };
    } else if (waterPct < minPercent) {
      return { status: 'Below Normal', color: 'yellow' };
    } else if (waterPct <= maxPercent) {
      return { status: 'Normal', color: 'green' };
    } else if (waterPct <= maxPercent + 3) {
      return { status: 'Above Normal', color: 'blue' };
    } else {
      return { status: 'High', color: 'purple' };
    }
  };

  const calculateDailyWaterNeeds = (weightKg: number) => {
    // Basic needs: 35ml per kg body weight
    let dailyNeedsL = (weightKg * 35) / 1000;

    // Activity adjustments
    switch (activity) {
      case 'athlete':
        dailyNeedsL *= 1.5;
        break;
      case 'active':
        dailyNeedsL *= 1.2;
        break;
      case 'elderly':
        dailyNeedsL *= 0.9;
        break;
    }

    if (units === 'imperial') {
      const dailyOz = dailyNeedsL * 33.814;
      return dailyOz.toFixed(0) + ' oz';
    } else {
      return dailyNeedsL.toFixed(1) + ' L';
    }
  };

  const generateRecommendations = (waterPct: number, status: string) => {
    let recs = `Your body water percentage of ${waterPct.toFixed(1)}% is ${status.toLowerCase()} for a ${age}-year-old ${gender}. `;

    switch (status) {
      case 'Low':
        recs += 'This suggests possible dehydration. Increase fluid intake gradually and consider consulting a healthcare provider if symptoms persist.';
        break;
      case 'Below Normal':
        recs += 'Consider increasing your daily water intake and eating water-rich foods like fruits and vegetables.';
        break;
      case 'Normal':
        recs += 'Great! Maintain your current hydration habits and continue drinking water regularly throughout the day.';
        break;
      case 'Above Normal':
        recs += 'This is slightly elevated, which may indicate good hydration or high muscle mass.';
        break;
      case 'High':
        recs += 'This is unusually high. If you\'re not an athlete, consider consulting a healthcare provider.';
        break;
    }

    // Activity-specific recommendations
    if (activity === 'athlete') {
      recs += ' As an athlete, monitor hydration closely during training and competition. Consider electrolyte replacement during long sessions.';
    } else if (activity === 'active') {
      recs += ' With regular exercise, increase fluid intake before, during, and after workouts.';
    } else if (activity === 'elderly') {
      recs += ' Age-related changes affect hydration. Monitor intake closely and stay ahead of thirst.';
    }

    recs += ' Remember that water needs vary with temperature, humidity, and individual factors.';

    return recs;
  };

  const calculateBodyWater = () => {
    if (!weight || !height || !age) return;

    // Convert to metric for calculations
    let weightKg = weight;
    let heightCm = height;
    if (units === 'imperial') {
      weightKg = weight * 0.453592;
      heightCm = height * 2.54;
    }

    const results = calculateAllFormulas(weightKg, heightCm);
    const totalWater = results.adjusted || results.average;
    const waterPct = (totalWater / weightKg) * 100;

    setWaterPercentage(waterPct);
    setTotalBodyWater(totalWater);

    // Hydration status
    const hydStatus = getHydrationStatus(waterPct, age, gender);
    setHydrationStatus(hydStatus.status);

    // Daily water needs
    const dailyNeeds = calculateDailyWaterNeeds(weightKg);
    setDailyWaterNeeds(dailyNeeds);

    // Water distribution
    setIntracellularWater(totalWater * 0.6);
    setExtracellularWater(totalWater * 0.4);

    // Recommendations
    const recs = generateRecommendations(waterPct, hydStatus.status);
    setRecommendations(recs);
  };

  const displayValue = (value: number) => {
    if (units === 'imperial') {
      return (value * 2.20462).toFixed(1);
    }
    return value.toFixed(1);
  };

  const waterUnit = units === 'imperial' ? 'lbs' : 'L';

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Body Water Percentage Calculator')}</h1>
        <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate your total body water percentage and understand your hydration status using scientifically proven formulas.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Body Composition</h2>

            {/* Units Selection */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Measurement Units</label>
              <div className="flex gap-4">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${units === 'metric' ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <input
                    type="radio"
                    checked={units === 'metric'}
                    onChange={() => toggleUnits('metric')}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-sm md:text-base">Metric (kg, cm)</span>
                </label>
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${units === 'imperial' ? 'border-blue-500 bg-blue-50' : ''}`}>
                  <input
                    type="radio"
                    checked={units === 'imperial'}
                    onChange={() => toggleUnits('imperial')}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-sm md:text-base">Imperial (lbs, inches)</span>
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  min="18"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Body Measurements */}
            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="30"
                  max="300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {units === 'metric' ? 'Height (cm)' : 'Height (inches)'}
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="120"
                  max="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Optional Body Fat */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Fat Percentage (%) - Optional
              </label>
              <input
                type="number"
                value={bodyFat || ''}
                onChange={(e) => setBodyFat(e.target.value ? parseFloat(e.target.value) : null)}
                step="0.1"
                min="5"
                max="50"
                placeholder="Enter if known"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Knowing your body fat percentage provides more accurate water calculations.
              </p>
            </div>

            {/* Activity Level */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { value: 'sedentary' as Activity, label: 'Sedentary', desc: 'Little to no exercise' },
                  { value: 'active' as Activity, label: 'Active', desc: 'Regular exercise' },
                  { value: 'athlete' as Activity, label: 'Athlete', desc: 'Intense training' },
                  { value: 'elderly' as Activity, label: 'Elderly (65+)', desc: 'Age-adjusted calculation' }
                ].map((act) => (
                  <label
                    key={act.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${activity === act.value ? 'border-blue-500 bg-blue-50' : ''}`}
                  >
                    <input
                      type="radio"
                      checked={activity === act.value}
                      onChange={() => setActivity(act.value)}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-sm">{act.label}</div>
                      <div className="text-xs text-gray-600">{act.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Reference Tables */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Body Water Reference Ranges</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Men</h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Age</th>
                        <th className="px-3 py-2 text-left font-semibold">Normal Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bodyWaterRanges.men.map((range, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{range.age}</td>
                          <td className="px-3 py-2">{range.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Women</h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-pink-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Age</th>
                        <th className="px-3 py-2 text-left font-semibold">Normal Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bodyWaterRanges.women.map((range, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{range.age}</td>
                          <td className="px-3 py-2">{range.range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Factors Affecting Body Water */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Factors Affecting Body Water Percentage</h4>
              <div className="grid md:grid-cols-2 gap-4 text-xs md:text-sm text-gray-700">
                <div>
                  <div className="font-semibold mb-2">Increase Water %:</div>
                  <ul className="space-y-1">
                    <li>• More muscle mass</li>
                    <li>• Lower body fat</li>
                    <li>• Good hydration</li>
                    <li>• Younger age</li>
                    <li>• Male gender</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Decrease Water %:</div>
                  <ul className="space-y-1">
                    <li>• Higher body fat</li>
                    <li>• Dehydration</li>
                    <li>• Advanced age</li>
                    <li>• Female gender</li>
                    <li>• Certain medications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">Body Water Analysis</h3>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-base md:text-lg font-bold text-blue-600 mb-1">{waterPercentage.toFixed(1)}%</div>
                <div className="text-xs text-blue-700">Water %</div>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <div className="text-base md:text-lg font-bold text-cyan-600 mb-1">{displayValue(totalBodyWater)} {waterUnit}</div>
                <div className="text-xs text-cyan-700">Total Water</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-base md:text-lg font-bold text-green-600 mb-1">{hydrationStatus}</div>
                <div className="text-xs text-green-700">Status</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-base md:text-lg font-bold text-purple-600 mb-1">{dailyWaterNeeds}</div>
                <div className="text-xs text-purple-700">Daily Needs</div>
              </div>
            </div>

            {/* Water Distribution */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-xs md:text-sm">Water Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-xs md:text-sm font-medium">Intracellular (ICW)</span>
                  <span className="text-xs md:text-sm font-bold text-blue-600">{displayValue(intracellularWater)} {waterUnit}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-cyan-50 rounded-lg">
                  <span className="text-xs md:text-sm font-medium">Extracellular (ECW)</span>
                  <span className="text-xs md:text-sm font-bold text-cyan-600">{displayValue(extracellularWater)} {waterUnit}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 text-xs md:text-sm">Hydration Tips</h4>
              <div className="text-xs text-gray-700">{recommendations}</div>
            </div>
          </div>
{/* Info Cards */}
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
            <h3 className="text-base md:text-lg font-bold text-blue-800 mb-3">💧 About Body Water</h3>
            <div className="space-y-2 text-xs md:text-sm text-blue-700">
              <div><strong>Total:</strong> 50-70% of body weight</div>
              <div><strong>Men:</strong> Usually 55-65%</div>
              <div><strong>Women:</strong> Usually 45-55%</div>
              <div><strong>Function:</strong> Transport, temperature regulation</div>
            </div>
          </div>

          <div className="bg-cyan-50 rounded-xl p-3 sm:p-4">
            <h3 className="text-base md:text-lg font-bold text-cyan-800 mb-3">🔄 Water Distribution</h3>
            <div className="space-y-3 text-xs md:text-sm text-cyan-700">
              <div>
                <strong>Intracellular (60%):</strong><br />
                Water inside cells
              </div>
              <div>
                <strong>Extracellular (40%):</strong><br />
                Blood plasma, lymph, interstitial fluid
              </div>
            </div>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mt-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Body Water Percentage: Hydration, Health & Measurement</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Body water percentage represents the total amount of fluid in your body as a proportion of your total weight. Water is the most abundant substance in the human body, comprising 50-70% of body weight depending on age, gender, and body composition. This vital fluid serves countless functions: transporting nutrients and oxygen, regulating body temperature, cushioning organs, facilitating chemical reactions, eliminating waste, and maintaining blood volume. Understanding your body water percentage provides insights into hydration status, body composition, and overall health. Unlike simple hydration tests, body water percentage accounts for both intracellular water (inside cells) and extracellular water (blood, lymph, interstitial fluid).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Water Distribution</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Intracellular: ~60% of total water</li>
              <li>• Extracellular: ~40% of total water</li>
              <li>• Blood plasma: ~8% of total water</li>
              <li>• Interstitial fluid: ~25% of water</li>
              <li>• Lymph and other: ~7% of water</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">Normal Ranges</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Men 18-25: 58-65%</li>
              <li>• Men 65+: 52-59%</li>
              <li>• Women 18-25: 52-59%</li>
              <li>• Women 65+: 46-53%</li>
              <li>• Athletes: 5-10% higher</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Key Functions</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Nutrient transport</li>
              <li>• Temperature regulation</li>
              <li>• Waste elimination</li>
              <li>• Joint lubrication</li>
              <li>• Cellular metabolism</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Calculation Methods & Formulas</h3>
        <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Watson Formula (1980) - Gold Standard</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Men:</strong> TBW = 2.447 - (0.09156 × age) + (0.1074 × height_cm) + (0.3362 × weight_kg)<br />
              <strong>Women:</strong> TBW = -2.097 + (0.1069 × height_cm) + (0.2466 × weight_kg)
            </p>
            <p className="text-xs text-gray-600">
              Most widely validated formula in clinical practice. Developed from deuterium dilution studies on thousands of subjects. Accounts for age-related decline in water percentage. Used in medical research and body composition analysis.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Hume-Weyers Formula (1971)</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Men:</strong> TBW = (0.194786 × height_cm) + (0.296785 × weight_kg) - 14.012934<br />
              <strong>Women:</strong> TBW = (0.34454 × height_cm) + (0.183809 × weight_kg) - 35.270121
            </p>
            <p className="text-xs text-gray-600">
              Simpler formula without age adjustment. Useful for younger populations where age effects are minimal. Commonly used in pharmacokinetics for drug dosing calculations requiring total body water estimates.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Lean Body Mass Method</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Formula:</strong> TBW = Lean Body Mass × 0.73
            </p>
            <p className="text-xs text-gray-600">
              Most accurate when body fat percentage is known. Based on the fact that muscle tissue is approximately 73% water, while fat tissue is only 10-20% water. Preferred for athletes and bodybuilders with known body composition.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Factors Affecting Body Water %</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Body Composition:</strong> Muscle tissue contains ~73% water; fat tissue only ~10-20%. Higher muscle mass = higher water percentage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Age:</strong> Water percentage decreases with age due to muscle loss (sarcopenia). Elderly may lose 10-15% compared to young adults</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Gender:</strong> Men have 5-10% higher water percentage due to greater muscle mass and lower essential body fat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Hydration Status:</strong> Acute dehydration can lower water percentage by 2-5%. Chronic dehydration has more severe effects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Medical Conditions:</strong> Heart failure, kidney disease, liver cirrhosis cause fluid retention. Diabetes can increase urination</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Medications:</strong> Diuretics reduce water retention. Steroids can cause fluid retention. NSAIDs affect kidney water handling</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Signs of Dehydration</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Mild (1-2% loss):</strong> Increased thirst, decreased urine output, slightly darker urine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Moderate (3-5% loss):</strong> Dry mouth, fatigue, dizziness, decreased skin turgor, dark yellow urine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Severe ({'>'}5% loss):</strong> Confusion, rapid heartbeat, sunken eyes, very dark urine or none, low blood pressure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Athletic performance:</strong> Even 2% dehydration reduces performance by 10-20%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Cognitive effects:</strong> Dehydration impairs concentration, memory, and mood</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Long-term risks:</strong> Kidney stones, urinary infections, constipation</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Optimizing Body Water Percentage</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Proper Hydration</h4>
            <p className="text-xs text-gray-600">Drink 35ml per kg body weight daily (2.5L for 70kg person). Athletes need 1.5-2x more during training. Drink before thirst signals dehydration. Monitor urine color (pale yellow = good hydration). Spread intake throughout the day rather than large amounts at once.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Build Muscle Mass</h4>
            <p className="text-xs text-gray-600">Resistance training 3-5x per week increases muscle mass, which holds 3x more water than fat tissue. Progressive overload with adequate protein (0.8-1g per lb bodyweight) builds lean mass. Each pound of muscle gained can increase water percentage by 0.3-0.5%.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Reduce Excess Body Fat</h4>
            <p className="text-xs text-gray-600">Lower body fat through calorie deficit (300-500 cal/day) and regular exercise. Since fat is only 10-20% water vs muscle's 73%, reducing fat percentage increases overall water percentage. Aim for healthy body fat: men 10-20%, women 20-30%.</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Water-Rich Foods</h4>
            <p className="text-xs text-gray-600">Fruits and vegetables contribute significantly to hydration. Watermelon, cucumber, lettuce are 95% water. Soups, smoothies, and broths add fluids. About 20% of daily water comes from food. These also provide electrolytes for better absorption.</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Electrolyte Balance</h4>
            <p className="text-xs text-gray-600">Sodium, potassium, magnesium, and chloride regulate fluid balance. Athletes or heavy sweaters need electrolyte replacement. Sports drinks, coconut water, or electrolyte tablets help. Too much or too little sodium affects water retention and hydration status.</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-pink-800 mb-2 text-sm">Lifestyle Factors</h4>
            <p className="text-xs text-gray-600">Limit alcohol (diuretic effect) and excessive caffeine. Hot climates and high altitudes increase water needs. Air conditioning and heating dry air. Illness, fever, vomiting, diarrhea dramatically increase requirements. Adjust intake based on activity and environment.</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Clinical Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Medical Diagnosis</h4>
            <p className="text-xs text-gray-600">Body water measurement helps diagnose fluid imbalances. Bioelectrical impedance analysis (BIA) estimates body water in clinical settings. Used to monitor dialysis patients, detect edema, assess malnutrition, and guide fluid therapy. Changes in body water percentage can indicate disease progression or treatment effectiveness.</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Athletic Performance</h4>
            <p className="text-xs text-gray-600">Athletes monitor body water to optimize performance and recovery. Pre- and post-workout weight changes indicate fluid loss (1 lb = ~16 oz fluid). Maintaining optimal hydration prevents performance decline, reduces injury risk, and speeds recovery. Elite athletes aim for {'<'}2% weight loss during training.</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Drug Dosing</h4>
            <p className="text-xs text-gray-600">Some medications are dosed based on total body water volume rather than just weight. Water-soluble drugs distribute throughout body water, so accurate TBW estimates ensure proper dosing. Particularly important for chemotherapy, antibiotics, and anesthetics where precision prevents toxicity.</p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2 text-sm">Body Composition Tracking</h4>
            <p className="text-xs text-gray-600">Body water percentage complements other metrics like BMI, body fat %, and lean mass for comprehensive body composition assessment. Changes in water percentage help distinguish muscle gain from fat gain, or fat loss from muscle loss. Useful for tracking progress during fitness programs or medical weight management.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="body-water-percentage-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
