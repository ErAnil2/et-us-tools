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
  color?: string;
  icon?: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
const relatedCalculators = [
  { href: "/us/tools/calculators/unit-converter", title: "Unit Converter", description: "Convert between units", color: "bg-blue-600" },
  { href: "/us/tools/calculators/temperature-converter", title: "Temperature Converter", description: "Convert temperature units", color: "bg-purple-600" },
  { href: "/us/tools/calculators/weight-converter", title: "Weight Converter", description: "Convert weight units", color: "bg-green-600" },
  { href: "/us/tools/calculators/length-converter", title: "Length Converter", description: "Convert length units", color: "bg-orange-500" },
  { href: "/us/tools/calculators/currency-converter", title: "Currency Converter", description: "Convert currencies", color: "bg-emerald-500" },
  { href: "/us/tools/calculators/area-calculator", title: "Area Calculator", description: "Calculate areas", color: "bg-pink-500" }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Water Weight Calculator?",
    answer: "A Water Weight Calculator is a health and fitness tool that helps you calculate water weight-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Water Weight Calculator?",
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
    answer: "Use the results as a starting point for understanding your water weight status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function WaterWeightCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('water-weight-calculator');

  const [currentWeight, setCurrentWeight] = useState(150);
  const [normalWeight, setNormalWeight] = useState(148);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('female');
  const [activityLevel, setActivityLevel] = useState('light');
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(8);
  const [heightCm, setHeightCm] = useState(173);
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [heightUnit, setHeightUnit] = useState('feet-inches');
  const [baselineWeightUnit, setBaselineWeightUnit] = useState('lbs');
  const [retentionFactors, setRetentionFactors] = useState({
    highSodium: false,
    carbs: false,
    stress: false,
    menstrual: false,
    medication: false,
    travel: false,
    exercise: false,
    sleep: false
  });
  const [results, setResults] = useState({
    waterWeight: '0.0 lbs',
    displayCurrentWeight: '--',
    waterIntake: '--',
    weightFluctuation: '--',
    factorsList: [] as string[],
    recommendations: [] as string[]
  });

  useEffect(() => {
    calculateWaterWeight();
  }, [currentWeight, normalWeight, age, gender, activityLevel, feet, inches, heightCm, weightUnit, heightUnit, baselineWeightUnit, retentionFactors]);

  const calculateWaterWeight = () => {
    // Convert all weights to lbs for consistency
    const currentWeightLbs = weightUnit === 'kg' ? currentWeight * 2.20462 : currentWeight;
    const normalWeightLbs = normalWeight && baselineWeightUnit === 'kg' ? normalWeight * 2.20462 : normalWeight;

    // Convert height to inches
    let height;
    if (heightUnit === 'feet-inches') {
      height = (feet * 12) + inches;
    } else {
      height = heightCm / 2.54;
    }

    // Validation
    if (!currentWeight || currentWeight <= 0 || !height || height <= 0 || !age || age <= 0) {
      return;
    }

    // Calculate body water percentage (Hume-Weyers formula approximation)
    let bodyWaterPercentage;
    if (gender === 'male') {
      bodyWaterPercentage = 0.194786 * height + 0.296785 * currentWeightLbs - 14.012934;
      bodyWaterPercentage = bodyWaterPercentage / currentWeightLbs * 100;
    } else {
      bodyWaterPercentage = 0.344547 * height + 0.183809 * currentWeightLbs - 35.270121;
      bodyWaterPercentage = bodyWaterPercentage / currentWeightLbs * 100;
    }

    // Adjust for age
    if (age > 65) bodyWaterPercentage -= 5;
    else if (age > 50) bodyWaterPercentage -= 2;

    // Calculate estimated water weight
    const estimatedWaterWeight = (currentWeightLbs * bodyWaterPercentage) / 100;

    // Calculate daily water intake needs
    const activityMultipliers: {[key: string]: number} = {
      sedentary: 0.5,
      light: 0.6,
      moderate: 0.7,
      high: 0.8,
      extreme: 1.0
    };

    const waterIntakeOz = currentWeightLbs * activityMultipliers[activityLevel];
    const waterIntakeLiters = waterIntakeOz * 0.0295735;

    // Check retention factors
    const factorsList: string[] = [];
    const factors = [
      { id: 'highSodium', text: 'High sodium intake - can cause 2-3 lbs retention' },
      { id: 'carbs', text: 'Recent high carb intake - each gram stores 3g water' },
      { id: 'stress', text: 'High stress - increases cortisol and water retention' },
      { id: 'menstrual', text: 'Menstrual cycle - can cause 2-5 lbs fluctuation' },
      { id: 'medication', text: 'Water-retaining medication - consult doctor' },
      { id: 'travel', text: 'Recent travel - altitude/sitting can cause retention' },
      { id: 'exercise', text: 'Post-exercise - muscles may retain water for repair' },
      { id: 'sleep', text: 'Poor sleep - affects hormone balance' }
    ];

    factors.forEach(factor => {
      if (retentionFactors[factor.id as keyof typeof retentionFactors]) {
        factorsList.push(factor.text);
      }
    });

    // Calculate weight fluctuation from baseline
    let weightFluctuation = 0;
    if (normalWeightLbs && normalWeightLbs > 0) {
      weightFluctuation = currentWeightLbs - normalWeightLbs;
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (factorsList.length > 0) {
      recommendations.push('• Identify and address retention factors checked above');
    }
    if (Math.abs(weightFluctuation) > 3) {
      recommendations.push('• Large fluctuation detected - monitor trends over time');
    }
    recommendations.push('• Weigh yourself consistently (same time, same conditions)');
    recommendations.push('• Focus on long-term trends rather than daily changes');
    recommendations.push('• Stay hydrated to prevent retention paradox');

    // Display results with proper units
    const displayWeight = weightUnit === 'kg' ? (currentWeightLbs / 2.20462).toFixed(1) + ' kg' : currentWeightLbs.toFixed(1) + ' lbs';
    const displayWaterWeight = weightUnit === 'kg' ? (estimatedWaterWeight / 2.20462).toFixed(1) + ' kg' : estimatedWaterWeight.toFixed(1) + ' lbs';

    let displayFluctuation = '--';
    if (normalWeightLbs && normalWeightLbs > 0) {
      const fluctuationText = weightFluctuation >= 0 ? '+' : '';
      displayFluctuation = weightUnit === 'kg' ? fluctuationText + (weightFluctuation / 2.20462).toFixed(1) + ' kg' : fluctuationText + weightFluctuation.toFixed(1) + ' lbs';
    } else {
      displayFluctuation = 'Enter baseline weight';
    }

    setResults({
      waterWeight: displayWaterWeight + ' (' + bodyWaterPercentage.toFixed(1) + '%)',
      displayCurrentWeight: displayWeight,
      waterIntake: waterIntakeOz.toFixed(0) + ' oz (' + waterIntakeLiters.toFixed(1) + ' L)',
      weightFluctuation: displayFluctuation,
      factorsList,
      recommendations
    });
  };

  const toggleWeightUnit = () => {
    if (weightUnit === 'lbs') {
      setWeightUnit('kg');
      setCurrentWeight(parseFloat((currentWeight * 0.453592).toFixed(1)));
    } else {
      setWeightUnit('lbs');
      setCurrentWeight(parseFloat((currentWeight / 0.453592).toFixed(1)));
    }
  };

  const toggleHeightUnit = () => {
    if (heightUnit === 'feet-inches') {
      setHeightUnit('cm');
      const totalInches = (feet * 12) + inches;
      setHeightCm(Math.round(totalInches * 2.54));
    } else {
      setHeightUnit('feet-inches');
      const totalInches = Math.round(heightCm / 2.54);
      setFeet(Math.floor(totalInches / 12));
      setInches(totalInches % 12);
    }
  };

  const toggleBaselineWeightUnit = () => {
    if (baselineWeightUnit === 'lbs') {
      setBaselineWeightUnit('kg');
      setNormalWeight(parseFloat((normalWeight * 0.453592).toFixed(1)));
    } else {
      setBaselineWeightUnit('lbs');
      setNormalWeight(parseFloat((normalWeight / 0.453592).toFixed(1)));
    }
  };

  const handleRetentionFactorChange = (factor: string) => {
    setRetentionFactors(prev => ({
      ...prev,
      [factor]: !prev[factor as keyof typeof prev]
    }));
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">{getH1('Water Weight Calculator')}</h1>
        <p className="text-gray-600">Track water weight fluctuations, calculate healthy hydration levels, and understand factors affecting water retention</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Water Weight Analysis</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="currentWeight" className="text-sm font-medium text-gray-700">Current Weight</label>
                  <button type="button" onClick={toggleWeightUnit} className="text-xs text-blue-600 hover:text-blue-800">
                    Switch to {weightUnit === 'lbs' ? 'kg' : 'lbs'}
                  </button>
                </div>
                <input
                  type="number"
                  id="currentWeight"
                  step="0.1"
                  min="50"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number(e.target.value))}
                  className="w-full px-2 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Height</label>
                  <button type="button" onClick={toggleHeightUnit} className="text-xs text-blue-600 hover:text-blue-800">
                    Switch to {heightUnit === 'feet-inches' ? 'cm' : 'ft/in'}
                  </button>
                </div>
                {heightUnit === 'feet-inches' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={feet}
                      onChange={(e) => setFeet(Number(e.target.value))}
                      className="w-full px-2 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5 ft"
                    />
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={inches}
                      onChange={(e) => setInches(Number(e.target.value))}
                      className="w-full px-2 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8 in"
                    />
                  </div>
                ) : (
                  <input
                    type="number"
                    min="91"
                    max="213"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full px-2 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="173 cm"
                  />
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  id="age"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-2 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-2 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
              <select
                id="activityLevel"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-2 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="high">High Activity</option>
                <option value="extreme">Extreme Activity</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="normalWeight" className="text-sm font-medium text-gray-700">Baseline Weight</label>
                <button type="button" onClick={toggleBaselineWeightUnit} className="text-xs text-blue-600 hover:text-blue-800">
                  Switch to {baselineWeightUnit === 'lbs' ? 'kg' : 'lbs'}
                </button>
              </div>
              <input
                type="number"
                id="normalWeight"
                step="0.1"
                min="50"
                value={normalWeight}
                onChange={(e) => setNormalWeight(Number(e.target.value))}
                className="w-full px-2 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="148"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Water Retention Factors</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { id: 'highSodium', label: 'High sodium intake' },
                  { id: 'carbs', label: 'High carb meal recently' },
                  { id: 'stress', label: 'High stress levels' },
                  { id: 'menstrual', label: 'Menstrual cycle' },
                  { id: 'medication', label: 'Water-retaining medication' },
                  { id: 'travel', label: 'Recent travel/flight' },
                  { id: 'exercise', label: 'Intense exercise yesterday' },
                  { id: 'sleep', label: 'Poor sleep quality' }
                ].map(factor => (
                  <label key={factor.id} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={retentionFactors[factor.id as keyof typeof retentionFactors]}
                      onChange={() => handleRetentionFactorChange(factor.id)}
                      className="mr-2 text-blue-600"
                    />
                    <span>{factor.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Water Weight Analysis</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{results.waterWeight}</div>
                <div className="text-gray-600">Estimated Water Weight</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Current Weight:</span>
                  <span className="font-semibold">{results.displayCurrentWeight}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Daily Water Intake:</span>
                  <span className="font-semibold">{results.waterIntake}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Weight Fluctuation:</span>
                  <span className="font-semibold">{results.weightFluctuation}</span>
                </div>
              </div>

              {results.factorsList.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Risk Factors Detected</h4>
                  <div className="text-sm text-red-700">
                    {results.factorsList.map((factor, index) => (
                      <div key={index}>• {factor}</div>
                    ))}
                  </div>
                </div>
              )}

              {results.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                  <div className="text-sm text-blue-700">
                    {results.recommendations.map((rec, index) => (
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

      <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding Water Weight</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-700">What is Water Weight?</h4>
              <p className="text-sm text-gray-600">Temporary weight from fluid retention, not fat storage</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-700">Normal Fluctuations</h4>
              <p className="text-sm text-gray-600">2-5 lbs daily variation is completely normal</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-700">Body Composition</h4>
              <p className="text-sm text-gray-600">Adults are 50-60% water by weight</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-700">Monitoring Trends</h4>
              <p className="text-sm text-gray-600">Focus on weekly averages, not daily changes</p>
            </div>
          </div>
        </div>
<div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Water Retention Causes</h3>
          <div className="space-y-3">
            {[
              { label: 'Sodium Intake', impact: 'High Impact' },
              { label: 'Carbohydrate Storage', impact: 'High Impact' },
              { label: 'Hormonal Changes', impact: 'Moderate Impact' },
              { label: 'Stress Levels', impact: 'Moderate Impact' },
              { label: 'Sleep Quality', impact: 'Low Impact' },
              { label: 'Exercise Intensity', impact: 'Variable' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-semibold text-purple-600">{item.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Water Weight Management Strategies</h3>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">Dietary Approach</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Limit sodium to 2,300mg daily</li>
              <li>• Increase potassium-rich foods</li>
              <li>• Balance carbohydrate intake</li>
              <li>• Avoid processed foods</li>
              <li>• Eat anti-inflammatory foods</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">Lifestyle Factors</h4>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Stay consistently hydrated</li>
              <li>• Get 7-9 hours quality sleep</li>
              <li>• Manage stress effectively</li>
              <li>• Exercise regularly</li>
              <li>• Maintain routine eating times</li>
            </ul>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-3">Monitoring Tips</h4>
            <ul className="space-y-2 text-sm text-orange-700">
              <li>• Weigh same time daily</li>
              <li>• Track weekly averages</li>
              <li>• Note menstrual cycle patterns</li>
              <li>• Record food and mood</li>
              <li>• Focus on long-term trends</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">When to Consult a Healthcare Provider</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-yellow-800">Concerning Symptoms</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Sudden weight gain (5+ lbs in 1-2 days)</li>
              <li>• Persistent swelling in legs, ankles, feet</li>
              <li>• Shortness of breath with activity</li>
              <li>• Swelling in face or hands</li>
              <li>• Rapid weight fluctuations (10+ lbs)</li>
              <li>• Chest pain or irregular heartbeat</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-yellow-800">Medical Considerations</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• History of heart disease</li>
              <li>• Kidney problems</li>
              <li>• Liver disease</li>
              <li>• Thyroid disorders</li>
              <li>• Taking medications that affect fluid balance</li>
              <li>• Pregnancy-related swelling</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Converter Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className={`${calc.color || 'bg-gray-500'} text-white rounded-xl p-6 hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-xl font-bold mb-2">{calc.title}</h3>
              <p className="text-white/90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="water-weight-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
