'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is lean body mass and why does it matter?",
    answer: "Lean body mass (LBM) is your total body weight minus fat mass. It includes muscles, bones, organs, and water. LBM matters because it determines your metabolic rate - more lean mass means you burn more calories at rest. Tracking LBM helps you ensure you're gaining muscle, not just weight.",
    order: 1
  },
  {
    id: '2',
    question: "How much lean body mass should I have?",
    answer: "For men, lean mass typically comprises 75-85% of total weight (15-25% body fat). For women, it's usually 65-75% (25-35% body fat). Athletes often have higher LBM percentages. The ideal depends on your goals - bodybuilders aim for more muscle, while endurance athletes may prefer less.",
    order: 2
  },
  {
    id: '3',
    question: "Can I gain lean mass and lose fat simultaneously?",
    answer: "Yes, this is called body recomposition. It's most effective for beginners, people returning to training, or those with higher body fat. Eat at maintenance calories or a small deficit, prioritize protein (1g per pound), and lift weights consistently. Progress is slower than bulking or cutting separately.",
    order: 3
  },
  {
    id: '4',
    question: "Why is my lean body mass decreasing?",
    answer: "LBM loss can result from: insufficient protein intake, too aggressive calorie deficit, lack of resistance training, inadequate sleep, excessive cardio, or age-related muscle loss (sarcopenia). To prevent this, keep protein high, maintain strength training, and avoid crash diets.",
    order: 4
  },
  {
    id: '5',
    question: "How do I calculate my protein needs based on LBM?",
    answer: "Many experts recommend basing protein intake on lean body mass rather than total weight. Aim for 1-1.2g protein per pound of LBM for muscle building, or 0.8-1g for maintenance. For example, if you have 150 lbs of LBM, target 150-180g protein daily for optimal muscle growth.",
    order: 5
  },
  {
    id: '6',
    question: "How does age affect lean body mass?",
    answer: "After age 30, adults naturally lose approximately 3-8% of lean body mass per decade due to sarcopenia (age-related muscle loss). This process accelerates after age 60. However, regular resistance training and adequate protein intake can significantly slow or even reverse this decline. Studies show that even people in their 70s and 80s can build muscle with proper training.",
    order: 6
  }
];

export default function LeanBodyMassCalculatorClient() {
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState(180);
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [bodyFat, setBodyFat] = useState(20);
  const [results, setResults] = useState<any>(null);

  const calculateLBM = () => {
    const weightInLbs = weightUnit === 'kg' ? weight * 2.20462 : weight;
    const weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : weight;

    const fatMassLbs = (bodyFat / 100) * weightInLbs;
    const leanMassLbs = weightInLbs - fatMassLbs;
    const leanMassKg = leanMassLbs * 0.453592;

    const bmr = gender === 'male'
      ? 370 + (21.6 * leanMassKg)
      : 370 + (21.6 * leanMassKg) * 0.9;

    let category = '';
    let recommendation = '';

    if (gender === 'male') {
      if (bodyFat < 6) {
        category = 'Essential Fat';
        recommendation = 'Too low - health risks. Increase body fat.';
      } else if (bodyFat < 14) {
        category = 'Athletes';
        recommendation = 'Athletic range. Maintain with proper nutrition.';
      } else if (bodyFat < 18) {
        category = 'Fitness';
        recommendation = 'Fit range. Good for overall health.';
      } else if (bodyFat < 25) {
        category = 'Average';
        recommendation = 'Average range. Room for improvement.';
      } else {
        category = 'Obese';
        recommendation = 'High body fat. Focus on fat loss.';
      }
    } else {
      if (bodyFat < 14) {
        category = 'Essential Fat';
        recommendation = 'Too low - health risks. Increase body fat.';
      } else if (bodyFat < 21) {
        category = 'Athletes';
        recommendation = 'Athletic range. Maintain with proper nutrition.';
      } else if (bodyFat < 25) {
        category = 'Fitness';
        recommendation = 'Fit range. Good for overall health.';
      } else if (bodyFat < 32) {
        category = 'Average';
        recommendation = 'Average range. Room for improvement.';
      } else {
        category = 'Obese';
        recommendation = 'High body fat. Focus on fat loss.';
      }
    }

    setResults({
      leanMassLbs: leanMassLbs.toFixed(1),
      leanMassKg: leanMassKg.toFixed(1),
      fatMassLbs: fatMassLbs.toFixed(1),
      fatMassKg: (fatMassLbs * 0.453592).toFixed(1),
      leanPercentage: (100 - bodyFat).toFixed(1),
      bmr: Math.round(bmr),
      category,
      recommendation
    });
  };

  useEffect(() => {
    if (weight > 0 && bodyFat >= 0 && bodyFat <= 100) {
      calculateLBM();
    }
  }, [gender, weight, weightUnit, bodyFat]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Lean Body Mass Calculator</h1>
        <p className="text-lg text-gray-600">Calculate your lean body mass and body composition based on body fat percentage</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Body Composition</h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${gender === 'male' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <input type="radio" checked={gender === 'male'} onChange={() => setGender('male')} className="mr-2" />
                  <span className="font-medium">Male</span>
                </label>
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${gender === 'female' ? 'border-pink-500 bg-pink-50' : 'hover:bg-gray-50'}`}>
                  <input type="radio" checked={gender === 'female'} onChange={() => setGender('female')} className="mr-2" />
                  <span className="font-medium">Female</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body Weight</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="px-3 py-2 border rounded-lg bg-gray-50"
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat Percentage (%)</label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(Number(e.target.value))}
                min="3"
                max="60"
                step="0.1"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="range"
                value={bodyFat}
                onChange={(e) => setBodyFat(Number(e.target.value))}
                min="3"
                max="60"
                step="0.1"
                className="w-full mt-2"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">How to Measure Body Fat</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Bioelectrical Impedance Scale</li>
                <li>• Skinfold Calipers</li>
                <li>• DEXA Scan (most accurate)</li>
                <li>• Hydrostatic Weighing</li>
                <li>• Visual Estimation (least accurate)</li>
              </ul>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Results</h3>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{results.leanMassLbs} lbs</div>
                  <div className="text-sm text-green-700">({results.leanMassKg} kg)</div>
                  <div className="text-green-700 mt-1">Lean Body Mass</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-blue-600">{results.leanPercentage}%</div>
                    <div className="text-sm text-blue-700">Lean Mass %</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-red-600">{bodyFat}%</div>
                    <div className="text-sm text-red-700">Body Fat %</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Body Composition Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fat Mass:</span>
                      <span className="font-semibold">{results.fatMassLbs} lbs ({results.fatMassKg} kg)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lean Mass:</span>
                      <span className="font-semibold">{results.leanMassLbs} lbs ({results.leanMassKg} kg)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span>Est. BMR:</span>
                      <span className="font-semibold">{results.bmr} calories/day</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${results.category === 'Fitness' || results.category === 'Athletes' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border`}>
                  <h4 className="font-semibold mb-2">Category: {results.category}</h4>
                  <p className="text-sm">{results.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-3 sm:p-4 md:p-6">
              <h4 className="font-semibold text-orange-800 mb-3">💡 Build Lean Mass</h4>
              <ul className="text-sm text-orange-700 space-y-2">
                <li>• Progressive resistance training</li>
                <li>• Adequate protein (0.8-1g per lb LBM)</li>
                <li>• Caloric surplus for muscle gain</li>
                <li>• 7-9 hours sleep for recovery</li>
                <li>• Track progress with measurements</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/us/tools/calculators/body-fat-calculator", title: "Body Fat Calculator", description: "Calculate body fat percentage", color: "bg-red-500" },
            { href: "/us/tools/calculators/bmi-calculator", title: "BMI Calculator", description: "Body mass index", color: "bg-blue-500" },
            { href: "/us/tools/calculators/bmr-calculator", title: "BMR Calculator", description: "Basal metabolic rate", color: "bg-green-500" },
            { href: "/us/tools/calculators/calorie-calculator", title: "Calorie Calculator", description: "Daily calorie needs", color: "bg-purple-500" },
          ].map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors mb-1">{calc.title}</h3>
                <p className="text-xs text-gray-500">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Understanding Lean Body Mass</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Lean Body Mass (LBM) represents everything in your body except fat - including muscles, bones, organs, skin, blood, and water. Understanding your LBM is crucial for fitness planning, tracking muscle gain, and optimizing nutrition because it determines your true metabolic needs and shows whether you&apos;re building muscle or losing it during your fitness journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">What LBM Includes</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Skeletal muscle mass (~40%)</li>
              <li>• Bones and skeleton (~15%)</li>
              <li>• Organs (heart, liver, etc.)</li>
              <li>• Blood and body water</li>
              <li>• Skin and connective tissue</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Why LBM Matters</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Determines basal metabolic rate</li>
              <li>• Shows true muscle development</li>
              <li>• More accurate than scale weight</li>
              <li>• Guides protein requirements</li>
              <li>• Tracks body recomposition</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Typical LBM Ranges</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Men: 75-85% of total weight</li>
              <li>• Women: 65-75% of total weight</li>
              <li>• Athletes: Higher percentages</li>
              <li>• Varies by age and fitness</li>
              <li>• Declines ~1% per year after 30</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">The LBM Formula</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-3">Lean Body Mass is calculated by subtracting your fat mass from total body weight:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">Basic Formula:</h4>
              <p className="font-mono text-sm bg-white p-3 rounded border">LBM = Total Weight × (1 - Body Fat %)</p>
              <p className="text-xs text-gray-500 mt-2">Example: 180 lbs × (1 - 0.20) = 144 lbs LBM</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">BMR from LBM (Katch-McArdle):</h4>
              <p className="font-mono text-sm bg-white p-3 rounded border">BMR = 370 + (21.6 × LBM in kg)</p>
              <p className="text-xs text-gray-500 mt-2">Most accurate BMR formula when body fat % is known</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Increase Lean Body Mass</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Progressive overload:</strong> Gradually increase weight, reps, or sets in strength training</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Adequate protein:</strong> Consume 0.7-1g protein per pound of body weight daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Caloric surplus:</strong> Eat 200-500 calories above maintenance for muscle gain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Quality sleep:</strong> 7-9 hours nightly for optimal recovery and growth hormone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Compound movements:</strong> Focus on squats, deadlifts, bench press, rows</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Preserving LBM During Fat Loss</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Moderate deficit:</strong> Keep deficit at 500 cal/day max to preserve muscle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>High protein:</strong> Increase protein to 1-1.2g per pound during cutting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Maintain lifting:</strong> Keep weights heavy even in a deficit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Slow and steady:</strong> Aim for 0.5-1 lb fat loss per week maximum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Diet breaks:</strong> Take periodic maintenance phases to prevent adaptation</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Ways to Measure Body Fat Percentage</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">DEXA Scan (Most Accurate)</h4>
            <p className="text-xs text-gray-600">Gold standard with 1-2% accuracy. Also measures bone density and fat distribution. Available at medical facilities and some gyms.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Skinfold Calipers</h4>
            <p className="text-xs text-gray-600">Measures subcutaneous fat at multiple sites. 3-4% accuracy when done by trained professional. Affordable and widely available.</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Bioelectrical Impedance</h4>
            <p className="text-xs text-gray-600">Found in smart scales. Convenient but can vary 5-8% based on hydration. Best for tracking trends over time.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <FirebaseFAQs pageId="lean-body-mass-calculator" fallbackFaqs={fallbackFaqs} />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This calculator provides estimates based on your body fat percentage input. The accuracy depends on how accurately you know your body fat percentage. For best results, use DEXA scans, skinfold calipers by a trained professional, or hydrostatic weighing. Consult a fitness professional for personalized guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
