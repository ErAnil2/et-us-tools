'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
const bmrReference = {
  male: {
    20: 1760, 25: 1740, 30: 1720, 35: 1700, 40: 1680,
    45: 1660, 50: 1640, 55: 1620, 60: 1600, 65: 1580,
    70: 1560, 75: 1540, 80: 1520
  },
  female: {
    20: 1460, 25: 1450, 30: 1440, 35: 1430, 40: 1420,
    45: 1410, 50: 1400, 55: 1390, 60: 1380, 65: 1370,
    70: 1360, 75: 1350, 80: 1340
  }
};

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

interface MetabolicAgeCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is metabolic age and how is it calculated?",
    answer: "Metabolic age is an estimate of how well your body functions compared to your chronological (actual) age, based on your metabolic rate. It's calculated by comparing your Basal Metabolic Rate (BMR) to average BMR values for different age groups of your gender. The calculation uses the Mifflin-St Jeor equation: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5 (men) or -161 (women), then adjusts for body composition, activity level, and health factors. Your adjusted BMR is matched against reference tables to determine which age group's average metabolism yours most closely resembles.",
    order: 1
  },
  {
    id: '2',
    question: "What does it mean if my metabolic age is higher than my actual age?",
    answer: "A metabolic age higher than your chronological age indicates your metabolism is functioning less efficiently than average for your age group. This can result from several factors: low muscle mass (muscle burns more calories at rest), high body fat percentage, sedentary lifestyle, poor sleep quality, chronic stress, unhealthy diet, or underlying health conditions. It doesn't mean you're physically older, but rather that your body is burning fewer calories at rest than expected. The good news is that metabolic age can be improved through lifestyle changes: strength training to build muscle, cardiovascular exercise, better nutrition, quality sleep (7-9 hours), stress management, and maintaining healthy body composition.",
    order: 2
  },
  {
    id: '3',
    question: "How can I lower my metabolic age?",
    answer: "To lower metabolic age and boost metabolism: 1) Build Muscle Mass - Resistance training 2-3× weekly increases lean muscle, which burns more calories at rest (50 calories/day per pound of muscle vs. 2 calories/day per pound of fat). 2) Increase Activity - Aim for 150+ minutes moderate exercise weekly; NEAT (non-exercise activity thermogenesis) also matters. 3) Optimize Nutrition - Eat adequate protein (0.8-1.2g/kg body weight), don't severely restrict calories (slows metabolism), stay hydrated. 4) Improve Sleep - 7-9 hours nightly; poor sleep disrupts hormones (ghrelin, leptin) affecting metabolism. 5) Manage Stress - Chronic cortisol elevation promotes fat storage and muscle breakdown. 6) Reduce Body Fat - Through sustainable caloric deficit combined with strength training to preserve muscle. Results typically show within 8-12 weeks of consistent effort.",
    order: 3
  },
  {
    id: '4',
    question: "Is metabolic age scientifically accurate?",
    answer: "Metabolic age is a conceptual estimate rather than a precise medical measurement. While it's based on scientifically validated BMR formulas (Mifflin-St Jeor equation has ±10% accuracy), the 'age' component is interpretive—comparing your BMR to population averages. Actual metabolic function varies significantly between individuals of the same age due to genetics, muscle mass, hormones, and health status. Medical professionals don't typically use 'metabolic age' as a diagnostic tool; instead, they measure: RMR (Resting Metabolic Rate) via indirect calorimetry, body composition via DEXA scans, VO2 max for cardiovascular fitness, and blood biomarkers (thyroid function, insulin sensitivity). Metabolic age calculators are useful for motivation and tracking relative progress, but shouldn't replace comprehensive health assessments. For medical concerns, consult healthcare providers.",
    order: 4
  },
  {
    id: '5',
    question: "What factors affect metabolic age the most?",
    answer: "Key factors affecting metabolic age (ranked by impact): 1) Muscle Mass (highest impact) - Muscle tissue burns 3-4× more calories than fat tissue at rest. A 10% increase in muscle can raise BMR by 7-8%. 2) Body Fat Percentage - Excess body fat lowers BMR per pound of body weight. Ideal ranges: men 10-20%, women 18-28%. 3) Physical Activity Level - Regular exercise increases BMR for 24-48 hours post-workout (EPOC effect). Sedentary lifestyles can reduce BMR by 100-300 calories daily. 4) Age & Hormones - Natural BMR decline of 2-3% per decade after 30 due to muscle loss and hormonal changes (testosterone, growth hormone, thyroid). 5) Sleep Quality - Sleep deprivation reduces BMR by 5-20% and disrupts metabolic hormones. 6) Nutrition - Severe caloric restriction, crash diets, or inadequate protein lower BMR as adaptive thermogenesis. 7) Chronic Conditions - Diabetes, thyroid disorders, PCOS significantly impact metabolism.",
    order: 5
  },
  {
    id: '6',
    question: "How often should I calculate my metabolic age?",
    answer: "Calculate metabolic age every 8-12 weeks (2-3 months) to track meaningful progress. This timeframe allows sufficient time for lifestyle changes to measurably impact body composition and metabolism. More frequent calculations aren't useful because: 1) BMR changes slowly—meaningful muscle gain takes 6-8 weeks, fat loss requires sustained deficit. 2) Daily/weekly fluctuations in weight, hydration, and activity create noise without signal. 3) Metabolic adaptations to new exercise/diet routines take 4-6 weeks to stabilize. Track alongside: body measurements (waist, body fat %), performance metrics (strength gains, endurance), photos for visual progress, and energy levels/sleep quality. Reassess when making major lifestyle changes: new training program, significant diet shift, or after achieving weight loss plateaus. For those maintaining results, quarterly (every 3 months) tracking is sufficient. Remember: trends over time matter more than single measurements.",
    order: 6
  }
];

export default function MetabolicAgeCalculatorClient({ relatedCalculators = [] }: MetabolicAgeCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('metabolic-age-calculator');

  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(175);
  const [bodyFat, setBodyFat] = useState<number | ''>('');
  const [muscleMass, setMuscleMass] = useState<number | ''>('');
  const [activity, setActivity] = useState('moderately-active');
  const [healthFactors, setHealthFactors] = useState({
    smoker: false,
    diabetes: false,
    highBP: false,
    goodSleep: false,
    lowStress: false,
    healthyDiet: false
  });
  const [results, setResults] = useState<any>(null);

  const toggleUnits = () => {
    const isMetric = units === 'metric';
    const newUnits = isMetric ? 'imperial' : 'metric';

    if (weight && height) {
      if (isMetric && weight < 100) {
        setWeight(parseFloat((weight * 0.453592).toFixed(1)));
        setHeight(parseFloat((height * 2.54).toFixed(1)));
        if (muscleMass) setMuscleMass(parseFloat(((muscleMass as number) * 0.453592).toFixed(1)));
      } else if (!isMetric && weight > 100) {
        setWeight(parseFloat((weight / 0.453592).toFixed(1)));
        setHeight(parseFloat((height / 2.54).toFixed(1)));
        if (muscleMass) setMuscleMass(parseFloat(((muscleMass as number) / 0.453592).toFixed(1)));
      }
    }

    setUnits(newUnits);
  };

  const calculateMetabolicAge = () => {
    let calcWeight = weight;
    let calcHeight = height;
    let calcMuscleMass = muscleMass ? (muscleMass as number) : null;

    if (units === 'imperial') {
      calcWeight = weight * 0.453592;
      calcHeight = height * 2.54;
      if (calcMuscleMass) calcMuscleMass = calcMuscleMass * 0.453592;
    }

    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * calcWeight) + (6.25 * calcHeight) - (5 * age) + 5;
    } else {
      bmr = (10 * calcWeight) + (6.25 * calcHeight) - (5 * age) - 161;
    }

    const adjustments = calculateMetabolicAdjustments(bodyFat, calcMuscleMass, calcWeight, activity);
    const adjustedBMR = bmr + adjustments.total;
    const metabolicAge = calculateMetabolicAgeFromBMR(adjustedBMR, gender);

    displayResults(age, metabolicAge, bmr, adjustedBMR, gender, adjustments);
  };

  const calculateMetabolicAdjustments = (bodyFat: number | '', muscleMass: number | null, weight: number, activity: string) => {
    const adjustments = {
      bodyFat: 0,
      muscle: 0,
      activity: 0,
      health: 0,
      total: 0,
      factors: { positive: [] as string[], negative: [] as string[] }
    };

    if (bodyFat) {
      const expectedBodyFat = gender === 'male' ? 15 : 25;
      if (bodyFat < expectedBodyFat - 5) {
        adjustments.bodyFat = 50;
        adjustments.factors.positive.push('Low body fat percentage');
      } else if (bodyFat > expectedBodyFat + 10) {
        adjustments.bodyFat = -30;
        adjustments.factors.negative.push('High body fat percentage');
      }
    }

    if (muscleMass) {
      const expectedMuscle = weight * (gender === 'male' ? 0.45 : 0.35);
      if (muscleMass > expectedMuscle * 1.1) {
        adjustments.muscle = 40;
        adjustments.factors.positive.push('Above average muscle mass');
      } else if (muscleMass < expectedMuscle * 0.8) {
        adjustments.muscle = -25;
        adjustments.factors.negative.push('Below average muscle mass');
      }
    }

    const activityAdjustments: { [key: string]: number } = {
      'sedentary': -20,
      'lightly-active': -10,
      'moderately-active': 0,
      'very-active': 15,
      'extremely-active': 30
    };
    adjustments.activity = activityAdjustments[activity] || 0;

    if (adjustments.activity > 0) {
      adjustments.factors.positive.push('High activity level');
    } else if (adjustments.activity < -10) {
      adjustments.factors.negative.push('Sedentary lifestyle');
    }

    const healthFactorsCalc = getHealthFactors();
    adjustments.health = healthFactorsCalc.adjustment;
    adjustments.factors.positive.push(...healthFactorsCalc.positive);
    adjustments.factors.negative.push(...healthFactorsCalc.negative);

    adjustments.total = adjustments.bodyFat + adjustments.muscle + adjustments.activity + adjustments.health;

    return adjustments;
  };

  const getHealthFactors = () => {
    const factors = { adjustment: 0, positive: [] as string[], negative: [] as string[] };

    if (healthFactors.smoker) {
      factors.adjustment -= 15;
      factors.negative.push('Smoking');
    }

    if (healthFactors.diabetes) {
      factors.adjustment -= 10;
      factors.negative.push('Diabetes');
    }

    if (healthFactors.highBP) {
      factors.adjustment -= 8;
      factors.negative.push('High blood pressure');
    }

    if (healthFactors.goodSleep) {
      factors.adjustment += 10;
      factors.positive.push('Good sleep quality');
    }

    if (healthFactors.lowStress) {
      factors.adjustment += 8;
      factors.positive.push('Low stress levels');
    }

    if (healthFactors.healthyDiet) {
      factors.adjustment += 12;
      factors.positive.push('Healthy diet');
    }

    return factors;
  };

  const calculateMetabolicAgeFromBMR = (bmr: number, gender: 'male' | 'female') => {
    const refData = bmrReference[gender];

    let closestAge = 35;
    let minDifference = Infinity;

    for (const [ageStr, refBMR] of Object.entries(refData)) {
      const ageVal = parseInt(ageStr);
      const difference = Math.abs(bmr - refBMR);

      if (difference < minDifference) {
        minDifference = difference;
        closestAge = ageVal;
      }
    }

    const ages = Object.keys(refData).map(Number).sort((a, b) => a - b);
    const index = ages.indexOf(closestAge);

    if (index > 0 && index < ages.length - 1) {
      const lowerAge = ages[index - 1];
      const upperAge = ages[index + 1];
      const lowerBMR = refData[lowerAge as keyof typeof refData];
      const upperBMR = refData[upperAge as keyof typeof refData];

      if (bmr < refData[closestAge as keyof typeof refData]) {
        const ratio = (refData[closestAge as keyof typeof refData] - bmr) / (refData[closestAge as keyof typeof refData] - upperBMR);
        return Math.round(closestAge + (upperAge - closestAge) * ratio);
      } else if (bmr > refData[closestAge as keyof typeof refData]) {
        const ratio = (bmr - refData[closestAge as keyof typeof refData]) / (lowerBMR - refData[closestAge as keyof typeof refData]);
        return Math.round(closestAge - (closestAge - lowerAge) * ratio);
      }
    }

    return closestAge;
  };

  const displayResults = (chronoAge: number, metabAge: number, originalBMR: number, adjustedBMR: number, gender: string, adjustments: any) => {
    const ageDiff = metabAge - chronoAge;

    let healthCategory;
    if (ageDiff <= -10) healthCategory = 'Excellent';
    else if (ageDiff <= -5) healthCategory = 'Very Good';
    else if (ageDiff <= -2) healthCategory = 'Good';
    else if (ageDiff <= 2) healthCategory = 'Average';
    else if (ageDiff <= 5) healthCategory = 'Below Average';
    else healthCategory = 'Needs Improvement';

    const refData = bmrReference[gender as keyof typeof bmrReference];
    const ages = Object.keys(refData).map(Number).sort((a, b) => Math.abs(a - chronoAge) - Math.abs(b - chronoAge));
    const closestAge = ages[0];
    const averageBMR = refData[closestAge as keyof typeof refData];
    const bmrDifference = adjustedBMR - averageBMR;

    let recommendations = '';
    if (ageDiff <= -5) {
      recommendations = 'Excellent! Your metabolic age is significantly younger than your chronological age. Continue your current lifestyle to maintain this advantage.';
    } else if (ageDiff <= -2) {
      recommendations = 'Great work! Your metabolic age is younger than your actual age. Focus on maintaining your current healthy habits.';
    } else if (ageDiff <= 2) {
      recommendations = 'Your metabolic age matches your chronological age, which is normal. There\'s room for improvement through targeted lifestyle changes.';
    } else if (ageDiff <= 5) {
      recommendations = 'Your metabolic age is higher than your chronological age, indicating potential for improvement. Focus on the areas identified below.';
    } else {
      recommendations = 'Your metabolic age is significantly higher than your actual age. This suggests your metabolism could benefit from targeted interventions.';
    }

    const priorities = [];
    if (adjustments.factors.negative.includes('Sedentary lifestyle')) {
      priorities.push('Increase daily activity - aim for at least 150 minutes of moderate exercise per week');
    }
    if (adjustments.factors.negative.includes('High body fat percentage')) {
      priorities.push('Focus on reducing body fat through a combination of cardio exercise and strength training');
    }
    if (adjustments.factors.negative.includes('Below average muscle mass')) {
      priorities.push('Incorporate resistance training 2-3 times per week to build lean muscle mass');
    }
    if (adjustments.factors.negative.includes('Smoking')) {
      priorities.push('Quit smoking - this single change can significantly improve your metabolic health');
    }

    if (priorities.length === 0) {
      priorities.push('Continue strength training to maintain muscle mass');
      priorities.push('Eat adequate protein (0.8-1.2g per kg body weight)');
      priorities.push('Maintain regular physical activity');
    }

    priorities.push('Prioritize 7-9 hours of quality sleep nightly');
    priorities.push('Manage stress through meditation, yoga, or other relaxation techniques');
    priorities.push('Stay hydrated and eat a balanced, nutrient-dense diet');

    setResults({
      metabolicAge: metabAge,
      ageDifference: ageDiff,
      healthCategory,
      bmrDifference,
      currentBMR: Math.round(adjustedBMR),
      averageBMR,
      chronoAge,
      factors: adjustments.factors,
      recommendations,
      priorities: priorities.slice(0, 5)
    });
  };

  useEffect(() => {
    if (weight && height && age) {
      calculateMetabolicAge();
    }
  }, [weight, height, age, gender, bodyFat, muscleMass, activity, healthFactors, units]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Personal Information</h2>

      <div className="mb-3 sm:mb-4 md:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Measurement Units</label>
        <div className="flex gap-4">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={units === 'metric'}
              onChange={() => toggleUnits()}
              className="mr-2 text-purple-600 focus:ring-purple-500"
            />
            <span className="font-medium">Metric (kg, cm)</span>
          </label>
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={units === 'imperial'}
              onChange={() => toggleUnits()}
              className="mr-2 text-purple-600 focus:ring-purple-500"
            />
            <span className="font-medium">Imperial (lbs, ft/in)</span>
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Chronological Age (years)</label>
          <input
            type="number"
            id="age"
            min="18"
            max="80"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
            Weight ({units === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            id="weight"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            min="30"
            max="300"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
            Height ({units === 'metric' ? 'cm' : 'inches'})
          </label>
          <input
            type="number"
            id="height"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            min="120"
            max="250"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="mb-3 sm:mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Body Composition (Optional)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700 mb-2">Body Fat %</label>
            <input
              type="number"
              id="bodyFat"
              step="0.1"
              min="5"
              max="50"
              placeholder="Enter if known"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value ? parseFloat(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700 mb-2">
              Muscle Mass ({units === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              id="muscleMass"
              step="0.1"
              min="20"
              max="80"
              placeholder="Enter if known"
              value={muscleMass}
              onChange={(e) => setMuscleMass(e.target.value ? parseFloat(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-3 sm:mb-4 md:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Activity & Fitness Level</label>
        <div className="space-y-3">
          {[
            { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise, desk job' },
            { value: 'lightly-active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
            { value: 'moderately-active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
            { value: 'very-active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
            { value: 'extremely-active', label: 'Extremely Active', desc: 'Very hard exercise, physical job' }
          ].map(item => (
            <label key={item.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="activity"
                value={item.value}
                checked={activity === item.value}
                onChange={(e) => setActivity(e.target.value)}
                className="mr-3 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3 sm:mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Factors (Optional)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={healthFactors.smoker}
                onChange={(e) => setHealthFactors({...healthFactors, smoker: e.target.checked})}
                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">Current smoker</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={healthFactors.diabetes}
                onChange={(e) => setHealthFactors({...healthFactors, diabetes: e.target.checked})}
                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">Diabetes</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={healthFactors.highBP}
                onChange={(e) => setHealthFactors({...healthFactors, highBP: e.target.checked})}
                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">High blood pressure</span>
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={healthFactors.goodSleep}
                onChange={(e) => setHealthFactors({...healthFactors, goodSleep: e.target.checked})}
                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">Good sleep quality (7+ hours)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={healthFactors.lowStress}
                onChange={(e) => setHealthFactors({...healthFactors, lowStress: e.target.checked})}
                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">Low stress levels</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={healthFactors.healthyDiet}
                onChange={(e) => setHealthFactors({...healthFactors, healthyDiet: e.target.checked})}
                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">Healthy, balanced diet</span>
            </label>
          </div>
        </div>
      </div>

      {results && (
        <div className="mt-8 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Metabolic Age Results</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600">{results.metabolicAge} years</div>
              <div className="text-sm text-gray-600">Metabolic Age</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-xl font-bold text-blue-600">
                {results.ageDifference === 0 ? 'Same age' :
                 results.ageDifference > 0 ? `+${results.ageDifference} years older` :
                 `${Math.abs(results.ageDifference)} years younger`}
              </div>
              <div className="text-sm text-gray-600">vs Chrono Age</div>
            </div>
<div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-xl font-bold text-green-600">{results.healthCategory}</div>
              <div className="text-sm text-gray-600">Health Status</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <div className="text-xl font-bold text-orange-600">
                {results.bmrDifference >= 0 ? '+' : ''}{Math.round(results.bmrDifference)} cal
              </div>
              <div className="text-sm text-gray-600">BMR vs Avg</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
            <div className="text-sm text-gray-700 mb-3">{results.recommendations}</div>
            <div className="text-sm text-gray-700">
              <strong>Action Steps:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {results.priorities.map((priority: string, index: number) => (
                  <li key={index}>{priority}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-purple-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-500">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Metabolic Age</h2>

        <p className="text-gray-700 mb-3 sm:mb-4 md:mb-6">
          Metabolic age is a comparative measure that estimates how efficiently your body burns energy at rest compared to the average person of your chronological age. Unlike your actual age, which simply counts the years since birth, metabolic age reflects your body's functional capacity based on your Basal Metabolic Rate (BMR), body composition, activity level, and overall health. A metabolic age younger than your chronological age suggests your metabolism functions more efficiently than average, typically due to higher muscle mass, lower body fat, and better overall fitness. Conversely, a higher metabolic age indicates metabolic inefficiency that can often be improved through targeted lifestyle interventions.
        </p>

        {/* Key Concepts */}
        <div className="grid md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">Basal Metabolic Rate (BMR)</h3>
            <p className="text-sm text-gray-700">
              The number of calories your body burns at complete rest to maintain vital functions (breathing, circulation, cell production). BMR accounts for 60-75% of total daily energy expenditure. Calculated using the Mifflin-St Jeor equation, which factors in weight, height, age, and gender.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Metabolic Efficiency</h3>
            <p className="text-sm text-gray-700">
              How effectively your body converts nutrients to energy and maintains calorie-burning muscle mass. Higher muscle mass increases BMR (muscle burns 50 calories/lb/day vs. 2 calories/lb/day for fat). Influenced by genetics, hormones, activity level, and body composition.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">Age-Related Decline</h3>
            <p className="text-sm text-gray-700">
              Natural metabolic slowdown of 2-3% per decade after age 30, primarily due to muscle loss (sarcopenia) and hormonal changes. Without intervention, average adult loses 3-8% muscle mass per decade after 30, reducing BMR by 100-200 calories daily.
            </p>
          </div>
        </div>

        {/* BMR Calculation Formula */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">BMR Calculation & Metabolic Age Formula</h3>
        <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Mifflin-St Jeor Equation (Most Accurate BMR Formula)</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Men:</strong> BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5<br />
              <strong>Women:</strong> BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161<br />
              <strong>Example:</strong> 35-year-old male, 75kg, 175cm: BMR = (10 × 75) + (6.25 × 175) - (5 × 35) + 5 = 1,668 calories/day
            </p>
            <p className="text-xs text-gray-600">
              This equation is 90% accurate for most people and is recommended by the Academy of Nutrition and Dietetics. More accurate than the older Harris-Benedict formula, especially for obese individuals. Accuracy improves further when adjusted for body composition (muscle mass, body fat percentage).
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Metabolic Age Determination Process</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Step 1:</strong> Calculate base BMR using Mifflin-St Jeor equation<br />
              <strong>Step 2:</strong> Apply adjustments for body composition (+50 cal for low body fat, -30 for high), muscle mass (+40 for above average, -25 for below), activity level (-20 to +30 calories), and health factors (sleep, stress, diet, chronic conditions)<br />
              <strong>Step 3:</strong> Compare adjusted BMR to reference BMR values for different age groups of your gender<br />
              <strong>Step 4:</strong> Determine metabolic age by matching to closest age group's average BMR
            </p>
            <p className="text-xs text-gray-600">
              <strong>Example:</strong> If a 35-year-old's adjusted BMR (1,850) matches the average BMR of a 25-year-old, their metabolic age is 25—10 years younger than chronological age, indicating superior metabolic health.
            </p>
          </div>
        </div>

        {/* Factors Affecting Metabolic Age */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Factors Affecting Metabolic Age</h3>
        <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Muscle Mass (Highest Impact)</h4>
            <p className="text-sm text-gray-700 mb-2">
              Muscle tissue is metabolically active, burning 3-4× more calories at rest than fat tissue. Each pound of muscle burns approximately 50 calories daily at rest vs. 2 calories for fat. A 10% increase in muscle mass can raise BMR by 7-8% (100-150 calories/day).
            </p>
            <p className="text-xs text-gray-600">
              <strong>Impact on Age:</strong> High muscle mass can lower metabolic age by 5-15 years. Natural muscle loss after 30 (sarcopenia) causes BMR to decline 2-3% per decade. Resistance training 2-3× weekly reverses this trend. Athletes and those who maintain muscle through adulthood often have metabolic ages 10-20 years younger than chronological age.
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-semibold text-yellow-800 mb-2">Body Fat Percentage</h4>
            <p className="text-sm text-gray-700 mb-2">
              Excess body fat lowers overall BMR per pound of body weight. Ideal body fat ranges: Men 10-20% (athletes 6-13%), Women 18-28% (athletes 14-20%). Each 5% increase in body fat above optimal can reduce metabolic age favorability by 2-4 years.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Metabolic Impact:</strong> Higher body fat correlates with insulin resistance, inflammation, and hormonal changes that further slow metabolism. Visceral fat (abdominal) is particularly harmful, releasing inflammatory cytokines that interfere with metabolic signaling. Reducing body fat to healthy ranges through caloric deficit + strength training can lower metabolic age by 5-10 years.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2">Physical Activity Level</h4>
            <p className="text-sm text-gray-700 mb-2">
              Regular exercise increases BMR through multiple mechanisms: builds muscle, improves insulin sensitivity, elevates post-exercise oxygen consumption (EPOC - 6-15% BMR boost for 24-48 hours), and optimizes hormones. Sedentary: reduces BMR by 100-300 cal/day. Very Active: increases BMR by 100-200 cal/day.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Activity Adjustments:</strong> Sedentary (desk job, minimal movement): -20 BMR adjustment, raises metabolic age. Lightly Active (1-3 days/week exercise): -10 adjustment. Moderately Active (3-5 days): baseline. Very Active (6-7 days intense): +15 adjustment. Extremely Active (athlete, physical job): +30 adjustment, can lower metabolic age by 8-12 years.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Sleep Quality & Duration</h4>
            <p className="text-sm text-gray-700 mb-2">
              Sleep deprivation (&lt;7 hours) reduces BMR by 5-20% and disrupts metabolic hormones: decreases leptin (satiety hormone), increases ghrelin (hunger hormone), elevates cortisol (stress hormone promoting fat storage), and reduces growth hormone (muscle recovery).
            </p>
            <p className="text-xs text-gray-600">
              <strong>Metabolic Consequences:</strong> Chronic poor sleep (&lt;6 hours) ages metabolism by 4-8 years. Just one week of sleep restriction (5.5 hours) can reduce insulin sensitivity by 30% and lower BMR by 200-300 calories. Quality sleep (7-9 hours, deep sleep phases) provides +10 BMR adjustment, supporting hormonal balance and metabolic health.
            </p>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-100">
            <h4 className="font-semibold text-pink-800 mb-2">Hormonal Health & Medical Conditions</h4>
            <p className="text-sm text-gray-700 mb-2">
              Thyroid function, testosterone (men), estrogen (women), insulin sensitivity, and cortisol levels profoundly affect metabolism. Hypothyroidism can reduce BMR by 20-40%. Type 2 diabetes lowers metabolic efficiency. Chronic stress elevates cortisol, promoting muscle breakdown and fat accumulation.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Health Factor Adjustments:</strong> Smoking: -15 BMR (damages mitochondria, reduces oxygen). Diabetes: -10 (insulin resistance). High blood pressure: -8 (cardiovascular inefficiency). These conditions can age metabolism by 8-15 years combined. Positive factors: good sleep +10, low stress +8, healthy diet +12 can counteract and improve metabolic age.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Nutrition & Diet Quality</h4>
            <p className="text-sm text-gray-700 mb-2">
              Severe caloric restriction triggers adaptive thermogenesis—body reduces BMR by 15-30% to conserve energy. Inadequate protein (&lt;0.8g/kg) leads to muscle loss, lowering BMR. Crash diets can reduce BMR by 300-500 calories daily. Conversely, adequate protein, nutrient-dense foods support metabolic health.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Dietary Impact:</strong> Thermic effect of food (TEF): protein burns 20-30% of calories during digestion vs. 5-10% for carbs/fats. High-protein diet (1.2-1.6g/kg) supports muscle maintenance, provides +12 BMR adjustment. Healthy, balanced diet with vegetables, whole grains, lean proteins supports hormonal balance, insulin sensitivity, and can lower metabolic age by 3-6 years.
            </p>
          </div>
        </div>

        {/* How to Improve Metabolic Age */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Science-Based Strategies to Lower Metabolic Age</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-3">Build & Maintain Muscle Mass</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Resistance Training:</strong> 2-3 sessions weekly, targeting major muscle groups. Progressive overload (gradually increasing weight/reps) essential for muscle growth. Results visible in 8-12 weeks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Compound Exercises:</strong> Squats, deadlifts, bench press, rows recruit multiple muscle groups, maximize hormonal response (testosterone, growth hormone) and calorie burn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Protein Intake:</strong> Consume 1.6-2.2g protein per kg body weight daily (higher end for muscle building). Distribute across meals for optimal muscle protein synthesis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Expected Impact:</strong> Gaining 10 lbs muscle can increase BMR by 350-500 calories daily, potentially lowering metabolic age by 5-10 years within 6 months.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-3">Optimize Cardiovascular Exercise</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>HIIT Training:</strong> 20-30 min high-intensity interval training 2-3× weekly increases EPOC (afterburn effect), boosting BMR for 24-48 hours post-workout by 6-15%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Steady-State Cardio:</strong> 30-60 min moderate intensity 2-4× weekly improves cardiovascular efficiency, insulin sensitivity, mitochondrial density.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>NEAT (Non-Exercise Activity):</strong> Increase daily movement—walking, stairs, standing desk. Can add 200-500 calories daily expenditure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Combined Approach:</strong> Strength training + cardio synergistically improve metabolic age more than either alone. Can lower metabolic age by 10-15 years.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-3">Improve Sleep & Recovery</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Sleep Duration:</strong> Target 7-9 hours nightly. Each hour below 7 can reduce BMR by 50-100 calories and impair recovery hormones.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Sleep Quality:</strong> Optimize deep sleep phases (growth hormone release) with consistent schedule, cool dark room (65-68°F), avoid screens 1 hour before bed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Recovery Days:</strong> Allow 48-72 hours between intense workouts for same muscle groups. Muscle repair requires rest to build metabolically active tissue.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Stress Management:</strong> Chronic stress elevates cortisol, promoting muscle catabolism. Practice meditation, yoga, deep breathing to lower cortisol and support metabolism.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-3">Nutritional Optimization</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Avoid Extreme Deficits:</strong> Don't cut calories below BMR. Sustainable deficit of 300-500 calories daily supports fat loss while preserving muscle and metabolism.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Protein Priority:</strong> 1.6-2.2g/kg body weight preserves muscle during caloric deficit. High TEF (thermic effect) means 25-30% of protein calories burned during digestion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Nutrient Timing:</strong> Eat protein within 2 hours post-workout for optimal muscle protein synthesis. Distribute protein across 3-4 meals (25-40g per meal).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Hydration:</strong> Stay hydrated (2-3L daily). Even mild dehydration (2% body weight) can reduce BMR by 3-5%. Water supports all metabolic processes.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Metabolic Age Interpretation */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Interpreting Your Metabolic Age Results</h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Excellent (-10 years or more younger)</h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>What it means:</strong> Your metabolism functions significantly better than average for your age group. Likely due to high muscle mass, low body fat, excellent cardiovascular fitness, consistent exercise, quality sleep, and healthy lifestyle habits.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Maintenance Strategy:</strong> Continue current training regimen (strength + cardio), maintain protein intake, prioritize sleep and recovery. Focus on consistency rather than changes. Reassess every 3-6 months. Consider small progressive challenges (strength gains, endurance improvements) to continue adaptations.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Very Good/Good (-5 to -2 years younger)</h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>What it means:</strong> Your metabolic health is above average for your age. You're likely active, have decent muscle mass and body composition, but there's room for optimization to achieve even younger metabolic age.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Improvement Strategy:</strong> Increase training intensity or frequency (add 1 strength session weekly). Focus on progressive overload to build more muscle. Fine-tune nutrition (increase protein if needed, reduce processed foods). Optimize sleep to 8+ hours. Consider body composition analysis (DEXA scan) to target specific improvements.
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100">
            <h4 className="font-semibold text-yellow-800 mb-2">Average (-2 to +2 years)</h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>What it means:</strong> Your metabolic age matches your chronological age—typical for your demographic. While normal, significant improvement is possible through targeted lifestyle interventions.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Improvement Plan:</strong> Begin structured resistance training program (2-3× weekly). Increase daily activity (10,000 steps). Audit diet (track protein intake, reduce refined carbs/sugars). Establish sleep routine (consistent bedtime, 7-8 hours). Set goal to lower metabolic age by 5 years within 6 months through these changes.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2">Needs Improvement (+3 to +10 years older)</h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>What it means:</strong> Your metabolism is functioning less efficiently than average for your age, likely due to sedentary lifestyle, low muscle mass, high body fat, poor sleep, chronic stress, or underlying health conditions.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Action Plan:</strong> Start with physician consultation to rule out medical issues (thyroid, diabetes). Begin beginner strength training program (bodyweight or light weights). Increase daily movement (start with 5,000 steps, build to 10,000). Prioritize sleep (7+ hours). Address major issues (quit smoking if applicable, manage stress). Small consistent changes yield significant results—expect 2-5 year metabolic age improvement within 3 months.
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-100">
            <h4 className="font-semibold text-red-800 mb-2">Requires Attention (+10 years or more older)</h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>What it means:</strong> Significant metabolic inefficiency requiring comprehensive intervention. May indicate severe muscle loss, obesity, metabolic syndrome, chronic conditions, or extremely sedentary lifestyle.
            </p>
            <p className="text-xs text-gray-600">
              <strong>Immediate Steps:</strong> Consult healthcare provider and consider metabolic specialist. Get comprehensive health screening (thyroid panel, A1C, insulin, inflammatory markers). Work with registered dietitian for nutrition plan. Start supervised exercise program (physical therapist or certified trainer for safety). Focus on foundational habits (sleep, stress, basic movement) before intensive training. With medical clearance and consistent effort, 10-15 year metabolic age improvement is achievable within 12-18 months.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FirebaseFAQs pageId="metabolic-age-calculator" fallbackFaqs={fallbackFaqs} />

    </div>
  );
}
