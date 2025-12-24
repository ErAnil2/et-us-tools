'use client';

import { useState, useEffect } from 'react';
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

type BodyFatRanges = {
  [key: string]: { [key: string]: [number, number] };
};

const bodyFatRanges: BodyFatRanges = {
  male: {
    essential: [0, 5],
    athletic: [6, 13],
    fitness: [14, 17],
    average: [18, 24],
    obese: [25, 100]
  },
  female: {
    essential: [0, 13],
    athletic: [14, 20],
    fitness: [21, 24],
    average: [25, 31],
    obese: [32, 100]
  }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Body Fat Percentage Calculator?",
    answer: "A Body Fat Percentage Calculator is a health and fitness tool that helps you calculate body fat percentage-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Body Fat Percentage Calculator?",
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
    answer: "Use the results as a starting point for understanding your body fat percentage status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function BodyFatPercentageClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('body-fat-percentage-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [weight, setWeight] = useState(180);
  const [neck, setNeck] = useState(16);
  const [waist, setWaist] = useState(34);
  const [hip, setHip] = useState(40);

  // Skinfold measurements - Male
  const [chest, setChest] = useState(0);
  const [abdomen, setAbdomen] = useState(0);
  const [thigh, setThigh] = useState(0);

  // Skinfold measurements - Female
  const [tricep, setTricep] = useState(0);
  const [suprailiac, setSuprailiac] = useState(0);

  const [navyBF, setNavyBF] = useState(0);
  const [jpBF, setJpBF] = useState<number | null>(null);
  const [bmiBF, setBmiBF] = useState(0);

  useEffect(() => {
    calculateBodyFat();
  }, [gender, age, heightFeet, heightInches, weight, neck, waist, hip, chest, abdomen, thigh, tricep, suprailiac]);

  const calculateBodyFat = () => {
    if (!age || !heightFeet || !weight || !neck || !waist) return;

    const totalHeightInches = (heightFeet * 12) + heightInches;

    // Navy Method
    const navy = calculateNavyMethod(gender, totalHeightInches, neck, waist, hip);
    setNavyBF(navy);

    // Jackson-Pollock Method
    const jp = calculateJacksonPollock(gender, age);
    setJpBF(jp);

    // BMI-based method
    const bmi = calculateBMIBasedBodyFat(gender, age, totalHeightInches, weight);
    setBmiBF(bmi);
  };

  const calculateNavyMethod = (gender: string, heightInches: number, neck: number, waist: number, hip: number) => {
    if (gender === 'male') {
      return 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(heightInches) + 36.76;
    } else {
      return 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(heightInches) - 78.387;
    }
  };

  const calculateJacksonPollock = (gender: string, age: number) => {
    if (gender === 'male') {
      if (!chest || !abdomen || !thigh) return null;

      const sum = chest + abdomen + thigh;
      const density = 1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * age);
      return (495 / density) - 450;
    } else {
      if (!tricep || !suprailiac || !thigh) return null;

      const sum = tricep + suprailiac + thigh;
      const density = 1.099421 - (0.0009929 * sum) + (0.0000023 * sum * sum) - (0.0001392 * age);
      return (495 / density) - 450;
    }
  };

  const calculateBMIBasedBodyFat = (gender: string, age: number, heightInches: number, weight: number) => {
    const bmi = (weight * 703) / (heightInches * heightInches);

    if (gender === 'male') {
      return (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      return (1.20 * bmi) + (0.23 * age) - 5.4;
    }
  };

  const getCategory = (bodyFat: number) => {
    const ranges = bodyFatRanges[gender];

    for (const [category, range] of Object.entries(ranges)) {
      if (bodyFat >= range[0] && bodyFat <= range[1]) {
        return category.charAt(0).toUpperCase() + category.slice(1);
      }
    }

    return 'Unknown';
  };

  const getCategoryPosition = (bodyFat: number) => {
    const ranges = bodyFatRanges[gender];

    for (const [cat, range] of Object.entries(ranges)) {
      if (bodyFat >= range[0] && bodyFat <= range[1]) {
        const position = ((bodyFat - range[0]) / (range[1] - range[0])) * 20 +
                        (Object.keys(ranges).indexOf(cat) * 20);
        return Math.min(position, 95);
      }
    }

    return 0;
  };

  const totalHeightInches = (heightFeet * 12) + heightInches;
  const bmi = (weight * 703) / (totalHeightInches * totalHeightInches);
  const fatMass = weight * (navyBF / 100);
  const leanMass = weight - fatMass;

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{getH1('Body Fat Percentage Calculator Online')}</h1>
        <p className="text-lg text-gray-600">Calculate body fat using multiple proven methods and compare results</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender('male')}
                    className="mr-2"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender('female')}
                    className="mr-2"
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                min="18"
                max="100"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(parseInt(e.target.value))}
                  min="3"
                  max="8"
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="px-3 py-3 text-gray-500">ft</span>
                <input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(parseInt(e.target.value))}
                  min="0"
                  max="11"
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="px-3 py-3 text-gray-500">in</span>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-3 text-gray-500">lbs</span>
              </div>
            </div>

            {/* Body Measurements */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Body Measurements (inches)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Neck Circumference</label>
                  <input
                    type="number"
                    value={neck}
                    onChange={(e) => setNeck(parseFloat(e.target.value))}
                    step="0.25"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-blue-600 mt-1">Measure at the narrowest point</p>
                </div>

                <div>
                  <label className="block text-xs text-blue-700 mb-1">Waist Circumference</label>
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(parseFloat(e.target.value))}
                    step="0.25"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-blue-600 mt-1">At navel level, no sucking in</p>
                </div>

                {gender === 'female' && (
                  <div>
                    <label className="block text-xs text-blue-700 mb-1">Hip Circumference</label>
                    <input
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(parseFloat(e.target.value))}
                      step="0.25"
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-blue-600 mt-1">At widest point of hips</p>
                  </div>
                )}
              </div>
            </div>

            {/* Skinfold Measurements */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Skinfold Measurements (mm) - Optional</h4>
              <p className="text-xs text-green-700 mb-3">For Jackson-Pollock 3-site method</p>
              <div className="space-y-3">
                {gender === 'male' ? (
                  <>
                    <div>
                      <label className="block text-xs text-green-700 mb-1">Chest/Pectoral</label>
                      <input
                        type="number"
                        value={chest || ''}
                        onChange={(e) => setChest(parseFloat(e.target.value) || 0)}
                        step="0.5"
                        placeholder="10"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-green-700 mb-1">Abdomen</label>
                      <input
                        type="number"
                        value={abdomen || ''}
                        onChange={(e) => setAbdomen(parseFloat(e.target.value) || 0)}
                        step="0.5"
                        placeholder="15"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-green-700 mb-1">Thigh</label>
                      <input
                        type="number"
                        value={thigh || ''}
                        onChange={(e) => setThigh(parseFloat(e.target.value) || 0)}
                        step="0.5"
                        placeholder="12"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs text-green-700 mb-1">Tricep</label>
                      <input
                        type="number"
                        value={tricep || ''}
                        onChange={(e) => setTricep(parseFloat(e.target.value) || 0)}
                        step="0.5"
                        placeholder="18"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-green-700 mb-1">Suprailiac (Hip)</label>
                      <input
                        type="number"
                        value={suprailiac || ''}
                        onChange={(e) => setSuprailiac(parseFloat(e.target.value) || 0)}
                        step="0.5"
                        placeholder="20"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-green-700 mb-1">Thigh</label>
                      <input
                        type="number"
                        value={thigh || ''}
                        onChange={(e) => setThigh(parseFloat(e.target.value) || 0)}
                        step="0.5"
                        placeholder="25"
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Body Fat Results</h3>

            <div className="space-y-4">
              {/* Navy Method Result */}
              <div className="bg-blue-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-800">US Navy Method</span>
                  <span className="text-xs text-blue-600">Most Reliable</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{navyBF.toFixed(1)}%</div>
                <div className="text-xs text-blue-700 mt-1">Based on circumference measurements</div>
              </div>

              {/* Jackson-Pollock Result */}
              <div className="bg-green-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-green-800">Jackson-Pollock 3-Site</span>
                  <span className="text-xs text-green-600">Most Accurate*</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {jpBF !== null ? `${jpBF.toFixed(1)}%` : '--'}
                </div>
                <div className="text-xs text-green-700 mt-1">
                  {jpBF !== null ? 'Based on skinfold measurements' : 'Enter skinfold measurements'}
                </div>
              </div>

              {/* BMI-Based Result */}
              <div className="bg-orange-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-orange-800">BMI-Based Formula</span>
                  <span className="text-xs text-orange-600">Estimate Only</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{bmiBF.toFixed(1)}%</div>
                <div className="text-xs text-orange-700 mt-1">Less accurate, for reference</div>
              </div>
            </div>

            {/* Body Fat Category */}
            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Body Fat Category</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Level:</span>
                  <span className="font-semibold text-blue-600">{getCategory(navyBF)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 relative">
                  <div
                    className="absolute top-0 w-1 h-3 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ left: `${getCategoryPosition(navyBF)}%` }}
                  />
                  <div className="absolute top-0 left-0 h-3 bg-red-400 rounded-l-full" style={{ width: '10%' }} />
                  <div className="absolute top-0 h-3 bg-orange-400" style={{ left: '10%', width: '15%' }} />
                  <div className="absolute top-0 h-3 bg-green-400" style={{ left: '25%', width: '25%' }} />
                  <div className="absolute top-0 h-3 bg-blue-400" style={{ left: '50%', width: '25%' }} />
                  <div className="absolute top-0 h-3 bg-purple-400 rounded-r-full" style={{ left: '75%', width: '25%' }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Essential</span>
                  <span>Athletic</span>
                  <span>Fitness</span>
                  <span>Average</span>
                  <span>Obese</span>
                </div>
              </div>
            </div>

            {/* Body Composition Breakdown */}
            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Body Composition</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Body Fat Mass:</span>
                  <span className="font-semibold">{fatMass.toFixed(1)} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lean Body Mass:</span>
                  <span className="font-semibold">{leanMass.toFixed(1)} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">BMI:</span>
                  <span className="font-semibold">{bmi.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Method Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Method Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left font-semibold text-gray-700">Method</th>
                <th className="px-2 py-3 text-center font-semibold text-gray-700">Accuracy</th>
                <th className="px-2 py-3 text-center font-semibold text-gray-700">Equipment Needed</th>
                <th className="px-2 py-3 text-center font-semibold text-gray-700">Your Result</th>
                <th className="px-2 py-3 text-center font-semibold text-gray-700">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-2 py-3 font-medium">US Navy Method</td>
                <td className="px-2 py-3 text-center">⭐⭐⭐⭐</td>
                <td className="px-2 py-3 text-center">Measuring tape</td>
                <td className="px-2 py-3 text-center font-bold text-blue-600">{navyBF.toFixed(1)}%</td>
                <td className="px-2 py-3 text-center">{getCategory(navyBF)}</td>
              </tr>
              <tr>
                <td className="px-2 py-3 font-medium">Jackson-Pollock 3-Site</td>
                <td className="px-2 py-3 text-center">⭐⭐⭐⭐⭐</td>
                <td className="px-2 py-3 text-center">Skinfold calipers</td>
                <td className="px-2 py-3 text-center font-bold text-green-600">
                  {jpBF !== null ? `${jpBF.toFixed(1)}%` : '--'}
                </td>
                <td className="px-2 py-3 text-center">{jpBF !== null ? getCategory(jpBF) : '--'}</td>
              </tr>
              <tr>
                <td className="px-2 py-3 font-medium">BMI-Based Formula</td>
                <td className="px-2 py-3 text-center">⭐⭐</td>
                <td className="px-2 py-3 text-center">Scale only</td>
                <td className="px-2 py-3 text-center font-bold text-orange-600">{bmiBF.toFixed(1)}%</td>
                <td className="px-2 py-3 text-center">{getCategory(bmiBF)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Body Fat Percentage Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Men's Body Fat Ranges:</h4>
            <ul className="space-y-1">
              <li>• <strong>Essential Fat:</strong> 2-5% (Minimum for health)</li>
              <li>• <strong>Athletic:</strong> 6-13% (Athletes/bodybuilders)</li>
              <li>• <strong>Fitness:</strong> 14-17% (Fit and healthy)</li>
              <li>• <strong>Average:</strong> 18-24% (General population)</li>
              <li>• <strong>Obese:</strong> 25%+ (Health risks increase)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Women's Body Fat Ranges:</h4>
            <ul className="space-y-1">
              <li>• <strong>Essential Fat:</strong> 10-13% (Minimum for health)</li>
              <li>• <strong>Athletic:</strong> 14-20% (Athletes/fitness models)</li>
              <li>• <strong>Fitness:</strong> 21-24% (Fit and healthy)</li>
              <li>• <strong>Average:</strong> 25-31% (General population)</li>
              <li>• <strong>Obese:</strong> 32%+ (Health risks increase)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Measurement Tips & Accuracy</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Measurement Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Measure in the morning</li>
              <li>• Use consistent conditions</li>
              <li>• Don't hold breath during measurement</li>
              <li>• Take multiple measurements</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Method Accuracy</h4>
            <ul className="text-sm space-y-1">
              <li>• DEXA Scan: Gold standard (±1-2%)</li>
              <li>• Hydrostatic: Very accurate (±2-3%)</li>
              <li>• Skinfolds: Good (±3-5%)</li>
              <li>• Navy Method: Reliable (±3-4%)</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Tracking Progress</h4>
            <ul className="text-sm space-y-1">
              <li>• Track trends, not daily changes</li>
              <li>• Use same method consistently</li>
              <li>• Consider taking photos</li>
              <li>• Focus on how you feel</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Health Calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 prose prose-gray max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Body Fat Percentage</h2>
        <p className="text-base text-gray-600 mb-6 leading-relaxed">
          Body fat percentage represents the proportion of your total body weight that consists of adipose tissue (fat). Unlike BMI,
          which only considers height and weight, body fat percentage provides a more accurate picture of your body composition by
          distinguishing between fat mass and lean mass (muscles, bones, organs, and water). This measurement is crucial for
          assessing overall health, fitness levels, and progress toward body composition goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 mb-2 text-base">Accurate Assessment</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Get precise measurements using multiple validated scientific methods</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-5">
            <h3 className="font-semibold text-purple-800 mb-2 text-base">Health Insights</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Understand your body composition and its impact on overall wellness</p>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-2 text-base">Track Progress</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Monitor changes in body composition during your fitness journey</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Body Fat Percentage Matters</h2>
        <p className="text-base text-gray-600 mb-4 leading-relaxed">
          Monitoring body fat percentage is essential for several reasons. First, it provides a more complete health assessment
          than weight or BMI alone. Two people with identical height and weight can have vastly different body compositions—one
          might be muscular with low body fat, while another could have high body fat and little muscle. Body fat percentage
          reveals these critical differences.
        </p>
        <p className="text-base text-gray-600 mb-6 leading-relaxed">
          Excess body fat, particularly visceral fat stored around organs, increases the risk of chronic diseases including
          cardiovascular disease, type 2 diabetes, certain cancers, and metabolic syndrome. Conversely, too little body fat
          can impair hormone production, immune function, and nutrient absorption. Maintaining optimal body fat levels supports
          metabolic health, athletic performance, and longevity.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Measurement Methods Explained</h2>
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">US Navy Method</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The Navy method uses circumference measurements (neck, waist, and hips for women) combined with height to
                estimate body fat. Developed by the U.S. Navy, this method is convenient, requires only a measuring tape,
                and provides reasonably accurate results (±3-4% margin of error). It's ideal for regular tracking since
                it's easy to perform at home.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Jackson-Pollock 3-Site Method</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The Jackson-Pollock method measures subcutaneous fat at three specific sites using skinfold calipers. For men,
                these sites are chest, abdomen, and thigh. For women, they're tricep, suprailiac (hip), and thigh. This method
                is highly accurate (±3-5% margin) when performed correctly by trained individuals and is widely used in fitness
                and research settings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">BMI-Based Formula</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This method estimates body fat using BMI, age, and gender. While convenient since it requires only basic
                information, it's the least accurate method (±5-8% margin) because it doesn't account for muscle mass or
                body fat distribution. Use it as a rough estimate only, especially if you have above-average muscle mass.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Get Accurate Measurements</h2>
            <ul className="space-y-2 text-base text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Measure at the same time of day, preferably in the morning before eating</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Ensure consistent hydration status between measurements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Use the same method each time for accurate progress tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Take multiple measurements and use the average</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>For circumference measurements, breathe normally and don't suck in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Have someone else perform skinfold measurements when possible</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Healthy Body Fat Ranges</h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">For Men:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Essential: 2-5% (minimum for physiological functions)</li>
                <li>Athletic: 6-13% (competitive athletes)</li>
                <li>Fitness: 14-17% (optimal health and appearance)</li>
                <li>Average: 18-24% (general population)</li>
                <li>Obese: 25%+ (increased health risks)</li>
              </ul>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <h4 className="font-semibold text-pink-800 mb-2">For Women:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Essential: 10-13% (minimum for reproductive health)</li>
                <li>Athletic: 14-20% (competitive athletes)</li>
                <li>Fitness: 21-24% (optimal health and appearance)</li>
                <li>Average: 25-31% (general population)</li>
                <li>Obese: 32%+ (increased health risks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What's the difference between body fat percentage and BMI?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              BMI (Body Mass Index) is a simple calculation based only on height and weight, without distinguishing between
              fat and muscle mass. Two people with the same BMI can have vastly different body compositions. For example,
              a muscular athlete might have a high BMI but low body fat, while someone sedentary could have a normal BMI
              but high body fat percentage. Body fat percentage provides a more accurate assessment of health and fitness
              by measuring the actual proportion of fat in your body. It's a superior metric for tracking fitness progress,
              especially for athletes or anyone doing strength training.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Which body fat measurement method is most accurate?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              DEXA (Dual-Energy X-ray Absorptiometry) scans are considered the gold standard, with accuracy within ±1-2%.
              However, they're expensive and require clinical facilities. Among home-friendly methods, the Jackson-Pollock
              skinfold caliper method is most accurate (±3-5%) when performed correctly. The US Navy circumference method
              offers good reliability (±3-4%) and requires only a measuring tape. For consistent tracking, use the same
              method each time rather than switching between methods. Remember, tracking trends over time is more valuable
              than seeking perfect accuracy in any single measurement.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Why do women naturally have higher body fat than men?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Women have higher essential body fat percentages (10-13% vs. 2-5% for men) due to biological and reproductive
              requirements. This essential fat supports hormone production, reproductive functions, and potential pregnancy
              and lactation. Women store more subcutaneous fat in breasts, hips, and thighs due to estrogen, which prepares
              the body for childbearing. Men have higher testosterone levels, which promotes muscle development and fat
              burning. These differences mean healthy body fat ranges are about 8-12% higher for women than men. Attempting
              to reach male-range body fat percentages can be unhealthy for women, potentially disrupting menstrual cycles
              and bone health.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How quickly can I safely reduce body fat percentage?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              A safe and sustainable rate is 0.5-1% reduction in body fat per month. Faster fat loss often results in
              muscle loss, metabolic slowdown, and difficulty maintaining results. This pace requires a moderate caloric
              deficit (300-500 calories below maintenance), adequate protein intake (0.7-1g per pound of body weight),
              resistance training to preserve muscle mass, and sufficient sleep for recovery. Remember that body fat
              percentage decreases both by losing fat and gaining muscle—the latter can improve body composition even
              without weight loss. Patience and consistency are key; crash diets typically lead to rebound weight gain
              and metabolic adaptation.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Is it unhealthy to have very low body fat percentage?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Yes, excessively low body fat can be dangerous. For men, levels below 5% and for women below 12% are considered
              essential minimums needed for basic physiological functions. Going below these levels risks hormonal imbalances,
              weakened immune function, decreased bone density, impaired cognitive function, and reproductive issues (amenorrhea
              in women, low testosterone in men). Even athletic ranges (6-13% for men, 14-20% for women) can be difficult to
              maintain long-term and may not be appropriate for everyone. Unless you're a competitive athlete with professional
              guidance, aim for the fitness or average ranges. Health, energy levels, and quality of life matter more than
              achieving extremely low body fat percentages.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">How often should I measure my body fat percentage?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Measure every 2-4 weeks rather than daily or weekly. Body fat changes gradually, and more frequent measurements
              can show misleading fluctuations due to hydration, food intake, and measurement error. When you do measure, do
              so under consistent conditions: same time of day (morning is best), similar hydration status, using the same
              method and equipment, and wearing similar clothing. Track your measurements in a journal or app to identify
              trends over months rather than focusing on single readings. Combine body fat measurements with other metrics
              like progress photos, how clothes fit, strength gains, and energy levels for a complete picture of your fitness
              journey.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="body-fat-percentage-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
