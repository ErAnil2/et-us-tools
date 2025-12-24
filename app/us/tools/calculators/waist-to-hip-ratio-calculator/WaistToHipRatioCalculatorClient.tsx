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
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
const relatedCalculators = [
  { href: "/us/tools/calculators/bmi-calculator", title: "BMI Calculator", description: "Calculate body mass index", color: "bg-blue-600" },
  { href: "/us/tools/calculators/bmr-calculator", title: "BMR Calculator", description: "Basal metabolic rate", color: "bg-purple-600" },
  { href: "/us/tools/calculators/calorie-calculator", title: "Calorie Calculator", description: "Daily calorie needs", color: "bg-green-600" },
  { href: "/us/tools/calculators/ideal-weight-calculator", title: "Ideal Weight Calculator", description: "Find your ideal weight", color: "bg-orange-500" },
  { href: "/us/tools/calculators/body-fat-calculator", title: "Body Fat Calculator", description: "Calculate body fat percentage", color: "bg-emerald-500" },
  { href: "/us/tools/calculators/water-intake-calculator", title: "Water Intake Calculator", description: "Daily water requirements", color: "bg-pink-500" }
];

interface RiskCategory {
  range: string;
  level: string;
  color: string;
}

const riskCategories = {
  women: [
    { range: '< 0.80', level: 'Low Risk', color: 'green' },
    { range: '0.80 - 0.85', level: 'Moderate Risk', color: 'yellow' },
    { range: '> 0.85', level: 'High Risk', color: 'red' }
  ],
  men: [
    { range: '< 0.90', level: 'Low Risk', color: 'green' },
    { range: '0.90 - 0.99', level: 'Moderate Risk', color: 'yellow' },
    { range: '≥ 1.00', level: 'High Risk', color: 'red' }
  ]
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Waist To Hip Ratio Calculator?",
    answer: "A Waist To Hip Ratio Calculator is a mathematical tool that helps you quickly calculate or convert waist to hip ratio-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Waist To Hip Ratio Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Waist To Hip Ratio Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
    order: 3
  },
  {
    id: '4',
    question: "Can I use this for professional or academic work?",
    answer: "Yes, this calculator is suitable for professional, academic, and personal use. It uses standard formulas that are widely accepted. However, always verify critical calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Is this calculator free?",
    answer: "Yes, this Waist To Hip Ratio Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function WaistToHipRatioCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('waist-to-hip-ratio-calculator');

  const [units, setUnits] = useState('metric');
  const [gender, setGender] = useState('female');
  const [waist, setWaist] = useState(70);
  const [hip, setHip] = useState(95);
  const [whr, setWhr] = useState(0);
  const [categoryResult, setCategoryResult] = useState({ level: '', color: '' });
  const [bodyShape, setBodyShape] = useState('');
  const [riskAssessment, setRiskAssessment] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [highlightedShape, setHighlightedShape] = useState({ apple: false, pear: false, straight: false });

  useEffect(() => {
    calculateWHR();
  }, [waist, hip, gender, units]);

  const calculateWHR = () => {
    if (!waist || !hip || waist <= 0 || hip <= 0) {
      return;
    }

    // Convert to cm if needed
    let waistCm = waist;
    let hipCm = hip;
    if (units === 'inches') {
      waistCm = waist * 2.54;
      hipCm = hip * 2.54;
    }

    const calculatedWhr = waistCm / hipCm;
    setWhr(calculatedWhr);

    const category = getRiskCategory(calculatedWhr);
    setCategoryResult(category);

    const shape = getBodyShape(calculatedWhr);
    setBodyShape(shape);

    updateHighlightedShape(shape);
    generateRiskAssessment(calculatedWhr, category, shape);
    generateRecommendations(category, shape, calculatedWhr);
  };

  const getRiskCategory = (whr: number): { level: string; color: string } => {
    const categoryKey = gender === 'female' ? 'women' : 'men';
    const categories = riskCategories[categoryKey];

    if (gender === 'female') {
      if (whr < 0.80) return categories[0];
      if (whr <= 0.85) return categories[1];
      return categories[2];
    } else {
      if (whr < 0.90) return categories[0];
      if (whr < 1.00) return categories[1];
      return categories[2];
    }
  };

  const getBodyShape = (whr: number): string => {
    if (whr > 0.95) return 'Apple';
    if (whr < 0.85) return 'Pear';
    return 'Athletic';
  };

  const updateHighlightedShape = (shape: string) => {
    setHighlightedShape({
      apple: shape === 'Apple',
      pear: shape === 'Pear',
      straight: shape === 'Athletic'
    });
  };

  const generateRiskAssessment = (whr: number, category: { level: string; color: string }, shape: string) => {
    let assessment = `Your waist-to-hip ratio of ${whr.toFixed(2)} indicates ${category.level.toLowerCase()} for cardiovascular and metabolic diseases. `;

    if (shape === 'Apple') {
      assessment += 'Your apple body shape suggests you store more fat around your midsection, which is associated with higher health risks including diabetes, heart disease, and stroke. ';
    } else if (shape === 'Pear') {
      assessment += 'Your pear body shape suggests you store fat primarily in your hips and thighs, which is generally associated with lower health risks. ';
    } else {
      assessment += 'Your athletic body shape suggests a balanced fat distribution, which is generally favorable for health. ';
    }

    switch (category.level) {
      case 'Low Risk':
        assessment += 'Continue maintaining your current healthy lifestyle to keep your WHR in this optimal range.';
        break;
      case 'Moderate Risk':
        assessment += 'Consider lifestyle modifications to reduce your waist circumference and lower your health risks.';
        break;
      case 'High Risk':
        assessment += "It's important to work on reducing abdominal fat through diet and exercise. Consider consulting with a healthcare provider.";
        break;
    }

    setRiskAssessment(assessment);
  };

  const generateRecommendations = (category: { level: string; color: string }, shape: string, whr: number) => {
    const recs: string[] = [];

    if (category.level === 'High Risk') {
      recs.push('• Consult with a healthcare provider about your cardiovascular risk');
      recs.push('• Focus on losing abdominal fat through targeted exercise');
      recs.push('• Consider a structured weight loss program');
      recs.push('• Monitor blood pressure, blood sugar, and cholesterol');
    } else if (category.level === 'Moderate Risk') {
      recs.push('• Increase cardiovascular exercise to reduce waist circumference');
      recs.push('• Focus on core strengthening exercises');
      recs.push('• Adopt a heart-healthy diet (Mediterranean or DASH)');
    } else {
      recs.push('• Maintain your current healthy lifestyle');
      recs.push('• Continue regular exercise routine');
      recs.push('• Monitor WHR annually');
    }

    if (shape === 'Apple') {
      recs.push('• Prioritize stress management (cortisol increases abdominal fat)');
      recs.push('• Focus on reducing refined carbohydrates');
      recs.push('• Include more soluble fiber in your diet');
      recs.push('• Consider high-intensity interval training (HIIT)');
    }

    recs.push('• Get 7-9 hours of quality sleep nightly');
    recs.push('• Stay hydrated and limit alcohol consumption');
    recs.push('• Include strength training 2-3 times per week');

    setRecommendations(recs);
  };

  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);

    if (newUnits === 'imperial' && waist > 50) {
      setWaist(parseFloat((waist / 2.54).toFixed(1)));
      setHip(parseFloat((hip / 2.54).toFixed(1)));
    } else if (newUnits === 'metric' && waist < 50) {
      setWaist(parseFloat((waist * 2.54).toFixed(1)));
      setHip(parseFloat((hip * 2.54).toFixed(1)));
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Waist-to-Hip Ratio Calculator')}</h1>
        <p className="text-xl text-gray-600 mb-3 sm:mb-4 md:mb-6 max-w-3xl mx-auto">
          Calculate your waist-to-hip ratio to understand your body shape, fat distribution pattern, and associated health risks.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">WHR Measurement</h2>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Measurement Units</label>
              <div className="flex gap-4">
                {[
                  { value: 'metric', label: 'Metric (cm)' },
                  { value: 'imperial', label: 'Imperial (inches)' }
                ].map(option => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="units"
                      value={option.value}
                      checked={units === option.value}
                      onChange={(e) => { setUnits(e.target.value); toggleUnits(); }}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-2">
                  Waist Circumference ({units === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  id="waist"
                  step="0.1"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  min="50"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="hip" className="block text-sm font-medium text-gray-700 mb-2">
                  Hip Circumference ({units === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  id="hip"
                  step="0.1"
                  value={hip}
                  onChange={(e) => setHip(Number(e.target.value))}
                  min="60"
                  max="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">How to Measure</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <div className="font-semibold mb-2">Waist:</div>
                  <ul className="space-y-1">
                    <li>• Stand straight with feet together</li>
                    <li>• Find narrowest part of torso</li>
                    <li>• Usually just above belly button</li>
                    <li>• Measure at end of normal exhale</li>
                    <li>• Don't suck in stomach</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Hip:</div>
                  <ul className="space-y-1">
                    <li>• Stand with feet together</li>
                    <li>• Measure at widest part of hips</li>
                    <li>• Usually at level of hip bones</li>
                    <li>• Keep tape measure level</li>
                    <li>• Don't compress tissues</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={calculateWHR}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Calculate Waist-to-Hip Ratio
            </button>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">WHR Risk Categories</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Women</h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-pink-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">WHR</th>
                        <th className="px-3 py-2 text-left font-semibold">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {riskCategories.women.map((category, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{category.range}</td>
                          <td className={`px-3 py-2 text-${category.color}-600`}>{category.level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Men</h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">WHR</th>
                        <th className="px-3 py-2 text-left font-semibold">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {riskCategories.men.map((category, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{category.range}</td>
                          <td className={`px-3 py-2 text-${category.color}-600`}>{category.level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Associated Health Conditions</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-700">
                <div>
                  <div className="font-semibold mb-2">Higher WHR Associated With:</div>
                  <ul className="space-y-1">
                    <li>• Type 2 diabetes</li>
                    <li>• Cardiovascular disease</li>
                    <li>• High blood pressure</li>
                    <li>• Sleep apnea</li>
                    <li>• Certain cancers</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Why WHR Matters:</div>
                  <ul className="space-y-1">
                    <li>• Abdominal fat is more dangerous</li>
                    <li>• Affects organ function</li>
                    <li>• Increases inflammation</li>
                    <li>• Better predictor than BMI</li>
                    <li>• Easy to measure at home</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Your WHR Results</h3>

            <div className="space-y-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{whr.toFixed(2)}</div>
                <div className="text-xs text-blue-700">WHR</div>
              </div>
              <div className={`text-center p-3 bg-${categoryResult.color}-50 rounded-lg`}>
                <div className={`text-lg font-bold text-${categoryResult.color}-600 mb-1`}>{categoryResult.level}</div>
                <div className={`text-xs text-${categoryResult.color}-700`}>Risk Category</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600 mb-1">{bodyShape}</div>
                <div className="text-xs text-purple-700">Body Shape</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Body Shape</h4>
              <div className="flex justify-center items-center gap-4">
                <div className="text-center" style={{ opacity: highlightedShape.apple ? 1 : 0.3 }}>
                  <div className="w-8 h-10 mx-auto mb-1 bg-red-100 rounded-full relative">
                    <div className="w-6 h-6 bg-red-400 rounded-full absolute top-1 left-1"></div>
                    <div className="w-5 h-6 bg-red-300 rounded-full absolute bottom-1 left-1.5"></div>
                  </div>
                  <div className="text-xs font-medium">Apple</div>
                </div>
                <div className="text-center" style={{ opacity: highlightedShape.pear ? 1 : 0.3 }}>
                  <div className="w-8 h-10 mx-auto mb-1 bg-green-100 rounded-full relative">
                    <div className="w-5 h-5 bg-green-300 rounded-full absolute top-1 left-1.5"></div>
                    <div className="w-7 h-7 bg-green-400 rounded-full absolute bottom-1 left-0.5"></div>
                  </div>
                  <div className="text-xs font-medium">Pear</div>
                </div>
                <div className="text-center" style={{ opacity: highlightedShape.straight ? 1 : 0.3 }}>
                  <div className="w-8 h-10 mx-auto mb-1 bg-blue-100 rounded-full relative">
                    <div className="w-5 h-5 bg-blue-400 rounded-full absolute top-1 left-1.5"></div>
                    <div className="w-5 h-5 bg-blue-400 rounded-full absolute bottom-1 left-1.5"></div>
                  </div>
                  <div className="text-xs font-medium">Athletic</div>
                </div>
              </div>
            </div>

            <div className="mb-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">Risk Assessment</h4>
              <div className="text-xs text-gray-700">{riskAssessment}</div>
            </div>

            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-1">Recommendations</h4>
              <div className="text-xs text-gray-700">
                {recommendations.map((rec, index) => (
                  <div key={index}>{rec}</div>
                ))}
              </div>
            </div>
          </div>
<div className="bg-blue-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">What is WHR?</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div><strong>Formula:</strong> Waist ÷ Hip circumference</div>
              <div><strong>Range:</strong> Typically 0.7 to 1.2</div>
              <div><strong>Lower is better:</strong> Less abdominal fat</div>
              <div><strong>Gender differences:</strong> Men naturally higher</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-orange-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-orange-800 mb-3">Improving WHR</h3>
          <ul className="space-y-2 text-sm text-orange-700">
            <li>• Cardio exercise (HIIT effective)</li>
            <li>• Strength training (core focus)</li>
            <li>• Reduce refined carbs</li>
            <li>• Increase protein intake</li>
            <li>• Manage stress levels</li>
            <li>• Get adequate sleep</li>
            <li>• Stay hydrated</li>
          </ul>
        </div>

        <div className="bg-purple-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-3">Quick Tips</h3>
          <ul className="space-y-2 text-sm text-purple-700">
            <li>• Measure monthly for tracking</li>
            <li>• Same time of day each measurement</li>
            <li>• Use a flexible tape measure</li>
            <li>• Don't hold breath when measuring</li>
            <li>• Take multiple measurements</li>
            <li>• Combine with other health metrics</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-xl p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">Body Shapes</h3>
          <div className="space-y-3 text-sm text-green-700">
            <div>
              <strong>Apple (Android):</strong><br />
              Weight around midsection<br />
              Higher cardiovascular risk
            </div>
            <div>
              <strong>Pear (Gynoid):</strong><br />
              Weight in hips/thighs<br />
              Lower health risks
            </div>
            <div>
              <strong>Athletic:</strong><br />
              Balanced proportions<br />
              Generally healthier
            </div>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6 mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Understanding Waist-to-Hip Ratio and Health</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Waist-to-Hip Ratio (WHR) is one of the most reliable indicators of health risk associated with body fat distribution. Unlike BMI, which only considers total weight, WHR reveals where your body stores fat - a critical factor in predicting cardiovascular disease, type 2 diabetes, and metabolic syndrome. Research consistently shows that abdominal fat (apple shape) poses significantly greater health risks than fat stored in the hips and thighs (pear shape).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">Low Risk WHR</h3>
            <p className="text-xs text-green-700 font-medium">Women: &lt;0.80 | Men: &lt;0.90</p>
            <p className="text-xs text-gray-600 mt-2">Healthy fat distribution with lower cardiovascular and metabolic disease risk</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 text-center">
            <h3 className="font-semibold text-yellow-800 mb-2 text-sm">Moderate Risk WHR</h3>
            <p className="text-xs text-yellow-700 font-medium">Women: 0.80-0.85 | Men: 0.90-0.99</p>
            <p className="text-xs text-gray-600 mt-2">Some excess abdominal fat; lifestyle changes recommended</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
            <h3 className="font-semibold text-red-800 mb-2 text-sm">High Risk WHR</h3>
            <p className="text-xs text-red-700 font-medium">Women: &gt;0.85 | Men: &ge;1.00</p>
            <p className="text-xs text-gray-600 mt-2">Significant visceral fat; increased disease risk; medical consultation advised</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">The WHR Formula and Measurement</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Simple Formula:</h4>
              <p className="font-mono text-sm bg-white p-3 rounded border mb-2">WHR = Waist Circumference / Hip Circumference</p>
              <p className="text-xs text-gray-600">Example: 80 cm waist / 100 cm hip = 0.80 WHR</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Proper Measurement:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Waist:</strong> At narrowest point, usually just above belly button</li>
                <li>• <strong>Hips:</strong> At widest point around buttocks</li>
                <li>• Stand relaxed, don&apos;t suck in stomach</li>
                <li>• Measure at end of normal exhale</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Visceral Fat is Dangerous</h3>
            <p className="text-sm text-gray-600 mb-3">
              Abdominal (visceral) fat surrounds vital organs and is metabolically active, releasing harmful substances into the bloodstream:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Releases inflammatory cytokines that damage blood vessels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Increases insulin resistance, leading to type 2 diabetes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Raises LDL cholesterol and triglyceride levels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Contributes to high blood pressure and heart disease</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Associated with increased risk of certain cancers</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Body Shape Health Implications</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <h4 className="font-medium text-red-800 text-sm">Apple Shape (Android)</h4>
                <p className="text-xs text-gray-600 mt-1">Fat stored around midsection. Higher risk for heart disease, diabetes, and stroke. More common in men and post-menopausal women.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 text-sm">Pear Shape (Gynoid)</h4>
                <p className="text-xs text-gray-600 mt-1">Fat stored in hips, thighs, and buttocks. Lower health risks. More common in pre-menopausal women. Fat here is harder to lose but less harmful.</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 text-sm">Athletic/Balanced</h4>
                <p className="text-xs text-gray-600 mt-1">Proportional fat distribution. Generally associated with best health outcomes. Achieved through regular exercise and balanced nutrition.</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Reduce Your WHR</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-2 text-sm">Reduce Refined Carbs</h4>
            <p className="text-xs text-gray-600">Sugar and refined carbs spike insulin, promoting abdominal fat storage. Replace with whole grains, vegetables, and lean proteins for better results.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Manage Stress</h4>
            <p className="text-xs text-gray-600">Chronic stress elevates cortisol, which promotes visceral fat storage. Practice meditation, deep breathing, or yoga to reduce stress hormones.</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">HIIT and Core Exercise</h4>
            <p className="text-xs text-gray-600">High-intensity interval training is particularly effective at burning abdominal fat. Combine with core strengthening exercises 3-4 times weekly.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">What is a healthy waist-to-hip ratio?</h3>
            <p className="text-sm text-gray-600">For women, a WHR below 0.80 is considered low risk, while men should aim for below 0.90. These thresholds are based on extensive research linking WHR to cardiovascular disease and metabolic health outcomes.</p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Is WHR better than BMI for assessing health?</h3>
            <p className="text-sm text-gray-600">WHR and BMI measure different things. BMI assesses total body mass relative to height, while WHR specifically measures fat distribution. Research shows WHR is often a better predictor of cardiovascular disease and diabetes risk because it identifies dangerous visceral fat that BMI misses.</p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Why do men and women have different WHR standards?</h3>
            <p className="text-sm text-gray-600">Men naturally store more fat around the abdomen (android pattern), while women tend to store fat in hips and thighs (gynoid pattern). Hormones, particularly estrogen and testosterone, influence these patterns. The different thresholds account for these biological differences.</p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Can I change my body shape through exercise?</h3>
            <p className="text-sm text-gray-600">While you can&apos;t completely change where your body naturally stores fat, you can reduce overall body fat and improve your WHR through diet and exercise. Cardiovascular exercise, HIIT, and strength training are particularly effective at reducing abdominal fat.</p>
          </div>
          <div className="pb-2">
            <h3 className="font-semibold text-gray-800 mb-2">How often should I measure my WHR?</h3>
            <p className="text-sm text-gray-600">Measure your WHR once a month to track progress. Always measure at the same time of day (morning is best) and under the same conditions for consistency. WHR changes gradually, so more frequent measurements may not show meaningful differences.</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Medical Disclaimer</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This calculator provides estimates for informational purposes only. WHR is one of many health indicators and should be considered alongside other metrics like BMI, blood pressure, and blood tests. Consult with a healthcare provider for comprehensive health assessment and personalized medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="waist-to-hip-ratio-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
