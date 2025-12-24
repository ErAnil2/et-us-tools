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
const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Navy Body Fat Calculator?",
    answer: "A Navy Body Fat Calculator is a health and fitness tool that helps you calculate navy body fat-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Navy Body Fat Calculator?",
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
    answer: "Use the results as a starting point for understanding your navy body fat status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function NavyBodyFatClient() {
  const { getH1, getSubHeading } = usePageSEO('navy-body-fat-calculator');

  const [gender, setGender] = useState('male');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(10);
  const [waist, setWaist] = useState(34);
  const [neck, setNeck] = useState(15);
  const [hip, setHip] = useState(38);

  const [results, setResults] = useState({
    bodyFat: 0,
    category: '',
    navyStandard: '',
    leanMass: 0,
    fatMass: 0
  });

  useEffect(() => {
    calculate();
  }, [gender, heightFeet, heightInches, waist, neck, hip]);

  const calculate = () => {
    const totalHeightInches = heightFeet * 12 + heightInches;

    let bodyFat = 0;
    if (gender === 'male') {
      // Navy formula for men: %BF = 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(totalHeightInches)) - 450;
    } else {
      // Navy formula for women: %BF = 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(totalHeightInches)) - 450;
    }

    bodyFat = Math.max(0, Math.min(60, bodyFat));

    // Determine category
    let category = '';
    if (gender === 'male') {
      if (bodyFat < 6) category = 'Essential Fat';
      else if (bodyFat < 14) category = 'Athletes';
      else if (bodyFat < 18) category = 'Fitness';
      else if (bodyFat < 25) category = 'Average';
      else category = 'Obese';
    } else {
      if (bodyFat < 14) category = 'Essential Fat';
      else if (bodyFat < 21) category = 'Athletes';
      else if (bodyFat < 25) category = 'Fitness';
      else if (bodyFat < 32) category = 'Average';
      else category = 'Obese';
    }

    // Navy/Military standards (approximate)
    let navyStandard = '';
    if (gender === 'male') {
      if (bodyFat <= 26) navyStandard = 'Within Navy Standards';
      else navyStandard = 'Exceeds Navy Standards';
    } else {
      if (bodyFat <= 36) navyStandard = 'Within Navy Standards';
      else navyStandard = 'Exceeds Navy Standards';
    }

    // Estimate body weight (rough approximation)
    const estimatedWeight = gender === 'male'
      ? (totalHeightInches - 60) * 5.6 + 140
      : (totalHeightInches - 60) * 5 + 120;

    const fatMass = estimatedWeight * (bodyFat / 100);
    const leanMass = estimatedWeight - fatMass;

    setResults({
      bodyFat,
      category,
      navyStandard,
      leanMass,
      fatMass
    });
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/body-fat-calculator', title: 'Body Fat Calculator', description: 'Calculate body fat percentage' },
    { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index' },
    { href: '/us/tools/calculators/ideal-weight-calculator', title: 'Ideal Weight', description: 'Find your ideal weight' },
    { href: '/us/tools/calculators/lean-body-mass-calculator', title: 'Lean Body Mass', description: 'Calculate lean mass' },
    { href: '/us/tools/calculators/bmr-calculator', title: 'BMR Calculator', description: 'Basal metabolic rate' },
    { href: '/us/tools/calculators/calorie-calculator', title: 'Calorie Calculator', description: 'Daily calorie needs' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Navy Body Fat Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate body fat percentage using the U.S. Navy method</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Measurements</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} className="form-radio text-blue-600" />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} className="form-radio text-blue-600" />
                  <span className="ml-2">Female</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input type="number" value={heightFeet} onChange={(e) => setHeightFeet(Number(e.target.value))} min="4" max="7" className="w-full px-4 py-3 border rounded-lg" />
                  <span className="text-xs text-gray-500">feet</span>
                </div>
                <div className="flex-1">
                  <input type="number" value={heightInches} onChange={(e) => setHeightInches(Number(e.target.value))} min="0" max="11" className="w-full px-4 py-3 border rounded-lg" />
                  <span className="text-xs text-gray-500">inches</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waist Circumference: {waist} inches</label>
              <input type="range" min="24" max="60" value={waist} onChange={(e) => setWaist(parseInt(e.target.value))} className="w-full h-2 bg-orange-200 rounded-lg" />
              <p className="text-xs text-gray-500 mt-1">Measure at navel level for men, narrowest point for women</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Neck Circumference: {neck} inches</label>
              <input type="range" min="10" max="25" value={neck} onChange={(e) => setNeck(parseInt(e.target.value))} className="w-full h-2 bg-purple-200 rounded-lg" />
              <p className="text-xs text-gray-500 mt-1">Measure below the Adam&apos;s apple</p>
            </div>

            {gender === 'female' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hip Circumference: {hip} inches</label>
                <input type="range" min="28" max="60" value={hip} onChange={(e) => setHip(parseInt(e.target.value))} className="w-full h-2 bg-pink-200 rounded-lg" />
                <p className="text-xs text-gray-500 mt-1">Measure at the widest point</p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Navy Method</h3>
              <p className="text-sm text-blue-700">
                The U.S. Navy method uses circumference measurements to estimate body fat percentage.
                It&apos;s commonly used for military fitness assessments.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your Results</h2>

            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-4">
              <div className="text-sm text-blue-600 mb-1">Body Fat Percentage</div>
              <div className="text-5xl font-bold text-blue-700">{results.bodyFat.toFixed(1)}%</div>
              <div className="text-sm text-blue-600 mt-2">{results.category}</div>
            </div>

            <div className={`p-4 rounded-lg mb-4 ${results.navyStandard.includes('Within') ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
              <div className="text-sm font-medium mb-1">Military Assessment</div>
              <div className={`text-lg font-bold ${results.navyStandard.includes('Within') ? 'text-green-600' : 'text-orange-600'}`}>
                {results.navyStandard}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Est. Lean Mass</div>
                <div className="text-lg font-bold text-gray-800">{results.leanMass.toFixed(1)} lbs</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Est. Fat Mass</div>
                <div className="text-lg font-bold text-gray-800">{results.fatMass.toFixed(1)} lbs</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-3">Body Fat Categories ({gender})</div>
              <div className="space-y-2 text-xs">
                {gender === 'male' ? (
                  <>
                    <div className="flex justify-between"><span>Essential Fat:</span><span>2-5%</span></div>
                    <div className="flex justify-between"><span>Athletes:</span><span>6-13%</span></div>
                    <div className="flex justify-between"><span>Fitness:</span><span>14-17%</span></div>
                    <div className="flex justify-between"><span>Average:</span><span>18-24%</span></div>
                    <div className="flex justify-between"><span>Obese:</span><span>25%+</span></div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between"><span>Essential Fat:</span><span>10-13%</span></div>
                    <div className="flex justify-between"><span>Athletes:</span><span>14-20%</span></div>
                    <div className="flex justify-between"><span>Fitness:</span><span>21-24%</span></div>
                    <div className="flex justify-between"><span>Average:</span><span>25-31%</span></div>
                    <div className="flex justify-between"><span>Obese:</span><span>32%+</span></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">💪</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8 prose prose-gray max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">The U.S. Navy Body Fat Measurement Method</h2>
        <p className="text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          The U.S. Navy body fat calculator uses a scientifically validated circumference-based method developed by the Department
          of Defense to assess body composition for military personnel. This method requires only simple body measurements—height,
          neck, and waist circumference for men, plus hip circumference for women—making it accessible, cost-effective, and reliable
          for regular body composition tracking without specialized equipment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 mb-2 text-base">Military Standard</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Official method used by U.S. Armed Forces for fitness assessments</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-5">
            <h3 className="font-semibold text-purple-800 mb-2 text-base">Simple & Accurate</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Requires only a measuring tape with ±3-4% accuracy</p>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-2 text-base">Easy Tracking</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Perfect for consistent home monitoring of body composition</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why the Navy Method Is Trusted</h2>
        <p className="text-base text-gray-600 mb-4 leading-relaxed">
          The Navy method was developed through extensive research correlating circumference measurements with more accurate
          but expensive body composition assessment techniques like hydrostatic weighing. The formulas account for how body
          fat is distributed differently in men and women, providing gender-specific calculations that improve accuracy.
          Unlike BMI, which can't distinguish between muscle and fat, the Navy method considers body shape and fat distribution.
        </p>
        <p className="text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Military branches use this method because it balances accuracy, practicality, and cost-effectiveness. It can be
          administered quickly to large numbers of service members without expensive equipment, yet provides results accurate
          enough to make fitness and health determinations. The method has been validated across diverse populations and
          remains one of the most reliable circumference-based body composition assessment tools available.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Military Body Fat Standards</h2>
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            The U.S. military sets maximum allowable body fat percentages to ensure service members maintain operational
            readiness. These standards vary by age, gender, and sometimes branch of service, but generally range from:
          </p>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Men's Standards:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Age 17-20: Maximum 20%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Age 21-27: Maximum 22%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Age 28-39: Maximum 24%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Age 40+: Maximum 26%</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Women's Standards:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Age 17-20: Maximum 33%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Age 21-27: Maximum 34%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Age 28-39: Maximum 35%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Age 40+: Maximum 36%</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">
            Note: Standards may vary slightly by branch (Army, Navy, Air Force, Marines, Coast Guard). Consult your branch's
            specific regulations for exact requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Take Accurate Measurements</h2>
            <ul className="space-y-2 text-base text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span><strong>Neck:</strong> Measure just below the Adam's apple (laryngeal prominence), at the narrowest point</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span><strong>Waist (Men):</strong> Measure horizontally at navel level, without pulling in your stomach</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span><strong>Waist (Women):</strong> Measure at the narrowest point, typically just above the belly button</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span><strong>Hips (Women):</strong> Measure at the widest point, usually around the buttocks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Use a non-elastic tape measure and keep it level around your body</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Measure after exhaling normally, not while holding your breath</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Take measurements in the morning before eating for consistency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                <span>Have someone else measure you when possible for better accuracy</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Benefits of This Method</h2>
            <ul className="space-y-2 text-base text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span>No expensive equipment or gym memberships required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span>Can be performed at home with just a measuring tape</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span>More accurate than BMI for assessing body composition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span>Takes body shape and fat distribution into account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span>Scientifically validated with ±3-4% accuracy margin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span>Official standard used by U.S. military for decades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span>Ideal for tracking progress over time consistently</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span>Gender-specific formulas improve accuracy for men and women</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How accurate is the Navy body fat calculator?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              The Navy method has an accuracy margin of approximately ±3-4% when measurements are taken correctly. This makes
              it reasonably accurate for practical purposes, though not as precise as DEXA scans (±1-2%) or hydrostatic weighing
              (±2-3%). However, its accuracy is significantly better than BMI calculations, which don't account for body composition
              at all. The key to getting accurate results is consistent, proper measurement technique. The tape should be level,
              snug but not tight, and measurements should be taken at the same time of day under similar conditions. When used
              consistently, the Navy method is excellent for tracking body fat changes over time.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Why does the Navy use circumference measurements instead of weight?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              The Navy method uses circumference measurements because they correlate well with body fat distribution and can
              distinguish between muscle mass and fat—something weight alone cannot do. Two service members might weigh the same,
              but if one has more muscle and less fat, they'll have different circumference measurements. The neck measurement
              reflects lean mass (muscular individuals typically have larger necks), while waist and hip measurements reflect
              fat accumulation. By combining these measurements with height, the formula can estimate body composition with
              reasonable accuracy. This approach is also practical for military use: it requires minimal equipment, can be
              performed quickly, and doesn't require expensive laboratory facilities.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What happens if I exceed Navy body fat standards?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              If an active-duty service member exceeds the maximum allowable body fat percentage for their age and gender, they're
              typically enrolled in a mandatory fitness improvement program. This usually involves regular physical training,
              nutritional counseling, and periodic reassessments (often monthly). Service members are given a specific timeframe
              to meet standards, usually 6-12 months depending on the branch. Failure to meet standards within the allotted time
              can result in administrative actions, including potential separation from service, though commands typically work
              with individuals to help them succeed. For those joining the military, exceeding body fat standards during initial
              screening will prevent enlistment until standards are met.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can I use this calculator if I'm not in the military?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Absolutely! While developed for military use, the Navy body fat calculation method is an excellent tool for anyone
              wanting to track their body composition at home. It's particularly useful for fitness enthusiasts, athletes, and
              anyone monitoring their health. The method doesn't require gym equipment or professional assistance—just a measuring
              tape and a few minutes of time. Many personal trainers and nutritionists recommend it to clients because it's more
              informative than weight or BMI alone. Just remember that the military standards displayed are specific to service
              requirements; healthy body fat ranges for civilians may differ based on individual fitness goals and overall health
              status. Consult with healthcare professionals about appropriate body fat targets for your specific situation.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How often should I measure my body fat using the Navy method?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              Measure every 2-4 weeks for the most meaningful tracking. Body fat changes gradually—measuring too frequently
              (weekly or daily) will show fluctuations mostly due to hydration changes, food intake, and measurement variability
              rather than actual fat loss or gain. When you do measure, maintain consistency: same time of day (morning is ideal),
              similar hydration status, before eating, and using the same technique. Keep a log of your measurements to track
              trends over months. Remember that the Navy method is most valuable for monitoring changes over time rather than
              obsessing over the absolute number. Combine it with other health metrics like how your clothes fit, energy levels,
              strength improvements, and how you feel overall for a complete picture of your fitness progress.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Is the Navy method accurate for very muscular or lean individuals?</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              The Navy method can be less accurate for individuals at body composition extremes—either very muscular bodybuilders
              or extremely lean athletes. For highly muscular individuals, the method might overestimate body fat because their
              larger neck circumference (from muscle) doesn't fully compensate for increased overall muscularity. Conversely,
              for very lean individuals (sub-10% for men, sub-15% for women), the method's margin of error becomes more significant
              relative to their low body fat percentage. For most people in average to athletic condition, however, the method works
              well. If you're an elite athlete or bodybuilder seeking precise measurements, consider more accurate methods like
              DEXA scans. For general fitness tracking and the average person, the Navy method provides sufficiently accurate results
              and excels at showing trends over time.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="navy-body-fat-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
