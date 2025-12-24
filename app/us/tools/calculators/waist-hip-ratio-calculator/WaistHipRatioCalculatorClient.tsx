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
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/body-fat-calculator', title: 'Body Fat Calculator', description: 'Calculate body fat percentage', color: 'bg-green-500' },
  { href: '/us/tools/calculators/ideal-weight-calculator', title: 'Ideal Weight', description: 'Find your ideal weight', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/calorie-calculator', title: 'Calorie Calculator', description: 'Calculate daily calories', color: 'bg-orange-500' },
];

interface WaistHipRatioCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

type RiskLevel = 'low' | 'moderate' | 'high' | 'very-high';

interface RiskInfo {
  level: RiskLevel;
  label: string;
  color: string;
  bgColor: string;
  gradient: string;
}

const getRiskInfo = (whr: number, gender: 'male' | 'female'): RiskInfo => {
  if (gender === 'male') {
    if (whr <= 0.85) return { level: 'low', label: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-100', gradient: 'from-green-500 to-emerald-600' };
    if (whr <= 0.90) return { level: 'moderate', label: 'Moderate Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-100', gradient: 'from-yellow-500 to-orange-500' };
    if (whr <= 0.95) return { level: 'high', label: 'High Risk', color: 'text-orange-600', bgColor: 'bg-orange-100', gradient: 'from-orange-500 to-red-500' };
    return { level: 'very-high', label: 'Very High Risk', color: 'text-red-600', bgColor: 'bg-red-100', gradient: 'from-red-500 to-rose-600' };
  } else {
    if (whr <= 0.75) return { level: 'low', label: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-100', gradient: 'from-green-500 to-emerald-600' };
    if (whr <= 0.80) return { level: 'moderate', label: 'Moderate Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-100', gradient: 'from-yellow-500 to-orange-500' };
    if (whr <= 0.85) return { level: 'high', label: 'High Risk', color: 'text-orange-600', bgColor: 'bg-orange-100', gradient: 'from-orange-500 to-red-500' };
    return { level: 'very-high', label: 'Very High Risk', color: 'text-red-600', bgColor: 'bg-red-100', gradient: 'from-red-500 to-rose-600' };
  }
};

const faqItems = [
  {
    question: "What is a healthy waist-to-hip ratio?",
    answer: "For men, a WHR below 0.90 is considered healthy, with below 0.85 being ideal. For women, below 0.80 is healthy, with below 0.75 being ideal. Higher ratios indicate more abdominal fat and increased health risks."
  },
  {
    question: "How do I measure my waist correctly?",
    answer: "Measure your waist at the narrowest point, typically just above your belly button and below your ribcage. Stand relaxed, exhale normally, and keep the tape measure parallel to the floor without pulling it too tight."
  },
  {
    question: "How do I measure my hips correctly?",
    answer: "Measure your hips at the widest point around your buttocks. Stand with feet together, keep the tape measure parallel to the floor, and wrap it around the fullest part of your hips."
  },
  {
    question: "Why is WHR important for health?",
    answer: "WHR indicates where your body stores fat. Abdominal fat (apple shape) is associated with higher risk of heart disease, type 2 diabetes, and metabolic syndrome compared to hip/thigh fat (pear shape)."
  },
  {
    question: "How can I improve my waist-to-hip ratio?",
    answer: "Reduce waist circumference through cardiovascular exercise, core strengthening, a balanced diet low in processed foods, adequate sleep, and stress management. Focus on overall fat loss rather than spot reduction."
  }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Waist Hip Ratio Calculator?",
    answer: "A Waist Hip Ratio Calculator is a mathematical tool that helps you quickly calculate or convert waist hip ratio-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Waist Hip Ratio Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Waist Hip Ratio Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Waist Hip Ratio Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function WaistHipRatioCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: WaistHipRatioCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('waist-hip-ratio-calculator');

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [waist, setWaist] = useState(80);
  const [hip, setHip] = useState(100);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [results, setResults] = useState({
    whr: 0,
    risk: {} as RiskInfo,
    bodyShape: '',
    recommendation: ''
  });

  useEffect(() => {
    calculateWHR();
  }, [gender, unit, waist, hip]);

  const calculateWHR = () => {
    let waistCm = waist;
    let hipCm = hip;

    if (unit === 'in') {
      waistCm = waist * 2.54;
      hipCm = hip * 2.54;
    }

    const whr = waistCm / hipCm;
    const risk = getRiskInfo(whr, gender);

    // Determine body shape
    let bodyShape = '';
    const threshold = gender === 'male' ? 0.90 : 0.80;
    if (whr < threshold) {
      bodyShape = gender === 'male' ? 'Athletic/Rectangular' : 'Pear Shape';
    } else {
      bodyShape = 'Apple Shape';
    }

    // Recommendation based on risk
    let recommendation = '';
    switch (risk.level) {
      case 'low':
        recommendation = 'Excellent! Your WHR indicates healthy fat distribution. Maintain your lifestyle with regular exercise and balanced nutrition.';
        break;
      case 'moderate':
        recommendation = 'Your WHR is slightly elevated. Consider increasing physical activity and reducing processed foods to improve your ratio.';
        break;
      case 'high':
        recommendation = 'Your WHR indicates elevated health risk. Focus on reducing abdominal fat through cardio, strength training, and dietary changes.';
        break;
      case 'very-high':
        recommendation = 'Your WHR indicates significant health risk. Consult a healthcare provider and implement immediate lifestyle changes.';
        break;
    }

    setResults({ whr, risk, bodyShape, recommendation });
  };

  const handleUnitChange = (newUnit: 'cm' | 'in') => {
    if (newUnit !== unit) {
      if (newUnit === 'in') {
        setWaist(Math.round(waist / 2.54 * 10) / 10);
        setHip(Math.round(hip / 2.54 * 10) / 10);
      } else {
        setWaist(Math.round(waist * 2.54));
        setHip(Math.round(hip * 2.54));
      }
      setUnit(newUnit);
    }
  };

  const getScalePosition = () => {
    const min = gender === 'male' ? 0.70 : 0.60;
    const max = gender === 'male' ? 1.05 : 0.95;
    const pos = ((results.whr - min) / (max - min)) * 100;
    return Math.min(95, Math.max(5, pos));
  };

  return (
    <main className="flex-grow">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">{getH1('Waist-to-Hip Ratio Calculator')}</h1>
          <p className="text-gray-600">Calculate your WHR to assess body fat distribution and health risk</p>
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

          {/* Unit Toggle */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Measurement Unit</label>
              <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => handleUnitChange('cm')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    unit === 'cm' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                  }`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitChange('in')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    unit === 'in' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                  }`}
                >
                  inches
                </button>
              </div>
            </div>
          </div>

          {/* Waist Input */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Waist Circumference</label>
              <span className="text-lg font-bold text-blue-600">{waist} {unit}</span>
            </div>
            <input
              type="range"
              min={unit === 'cm' ? 50 : 20}
              max={unit === 'cm' ? 150 : 60}
              step={unit === 'cm' ? 1 : 0.5}
              value={waist}
              onChange={(e) => setWaist(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{unit === 'cm' ? '50 cm' : '20 in'}</span>
              <span>{unit === 'cm' ? '150 cm' : '60 in'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Measure at narrowest point, above belly button</p>
          </div>

          {/* Hip Input */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Hip Circumference</label>
              <span className="text-lg font-bold text-pink-600">{hip} {unit}</span>
            </div>
            <input
              type="range"
              min={unit === 'cm' ? 60 : 24}
              max={unit === 'cm' ? 170 : 67}
              step={unit === 'cm' ? 1 : 0.5}
              value={hip}
              onChange={(e) => setHip(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-pink-200 to-pink-400 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{unit === 'cm' ? '60 cm' : '24 in'}</span>
              <span>{unit === 'cm' ? '170 cm' : '67 in'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Measure at widest point around buttocks</p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Primary Result */}
            <div className={`bg-gradient-to-r ${results.risk.gradient} rounded-2xl p-6 text-white`}>
              <div className="text-center">
                <div className="text-white/80 text-sm font-medium mb-1">Your Waist-to-Hip Ratio</div>
                <div className="text-5xl font-bold mb-2">{results.whr.toFixed(2)}</div>
                <div className="text-white/90 font-medium">{results.risk.label}</div>
              </div>
            </div>

            {/* Risk Scale */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Risk Level</h4>
              <div className="relative h-6 rounded-full overflow-hidden bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500">
                <div
                  className="absolute top-0 h-full w-1 bg-white border-2 border-gray-800 rounded-full transition-all"
                  style={{ left: `${getScalePosition()}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Very High</span>
              </div>
            </div>

            {/* Secondary Results */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-gray-500 text-xs mb-1">Body Shape</div>
                <div className="text-xl font-bold text-gray-800">{results.bodyShape}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-gray-500 text-xs mb-1">Health Category</div>
                <div className={`text-xl font-bold ${results.risk.color}`}>{results.risk.label}</div>
              </div>
            </div>

            {/* Recommendation */}
            <div className={`${results.risk.bgColor} rounded-xl p-4`}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommendation</h4>
              <p className="text-sm text-gray-600">{results.recommendation}</p>
            </div>
          </div>
        </div>

        {/* WHR Standards */}
        <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">WHR Health Standards</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span>👨</span> Men
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-green-100 rounded-lg p-3">
                  <span className="text-green-800">Low Risk</span>
                  <span className="font-bold text-green-700">&lt; 0.85</span>
                </div>
                <div className="flex items-center justify-between bg-yellow-100 rounded-lg p-3">
                  <span className="text-yellow-800">Moderate Risk</span>
                  <span className="font-bold text-yellow-700">0.85 - 0.90</span>
                </div>
                <div className="flex items-center justify-between bg-orange-100 rounded-lg p-3">
                  <span className="text-orange-800">High Risk</span>
                  <span className="font-bold text-orange-700">0.90 - 0.95</span>
                </div>
                <div className="flex items-center justify-between bg-red-100 rounded-lg p-3">
                  <span className="text-red-800">Very High Risk</span>
                  <span className="font-bold text-red-700">&gt; 0.95</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2">
                <span>👩</span> Women
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-green-100 rounded-lg p-3">
                  <span className="text-green-800">Low Risk</span>
                  <span className="font-bold text-green-700">&lt; 0.75</span>
                </div>
                <div className="flex items-center justify-between bg-yellow-100 rounded-lg p-3">
                  <span className="text-yellow-800">Moderate Risk</span>
                  <span className="font-bold text-yellow-700">0.75 - 0.80</span>
                </div>
                <div className="flex items-center justify-between bg-orange-100 rounded-lg p-3">
                  <span className="text-orange-800">High Risk</span>
                  <span className="font-bold text-orange-700">0.80 - 0.85</span>
                </div>
                <div className="flex items-center justify-between bg-red-100 rounded-lg p-3">
                  <span className="text-red-800">Very High Risk</span>
                  <span className="font-bold text-red-700">&gt; 0.85</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Measure */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-2xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span>📏</span> How to Measure Waist
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">1.</span>
                Stand relaxed with feet together
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">2.</span>
                Find narrowest point (above belly button)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">3.</span>
                Wrap tape parallel to floor
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">4.</span>
                Exhale normally before reading
              </li>
            </ul>
          </div>

          <div className="bg-pink-50 rounded-2xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-pink-900 mb-4 flex items-center gap-2">
              <span>📐</span> How to Measure Hips
            </h3>
            <ul className="space-y-2 text-sm text-pink-800">
              <li className="flex items-start gap-2">
                <span className="text-pink-600">1.</span>
                Stand with feet together
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">2.</span>
                Find widest point around buttocks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">3.</span>
                Wrap tape parallel to floor
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600">4.</span>
                Keep tape snug but not tight
              </li>
            </ul>
          </div>
        </div>

        {/* Tips to Improve */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tips to Improve Your WHR</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🏃</span>
              <div className="font-semibold text-gray-800 text-sm">Cardio Exercise</div>
              <div className="text-xs text-gray-500 mt-1">30+ min most days</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🏋️</span>
              <div className="font-semibold text-gray-800 text-sm">Strength Training</div>
              <div className="text-xs text-gray-500 mt-1">Build core muscles</div>
            </div>
<div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">🥗</span>
              <div className="font-semibold text-gray-800 text-sm">Balanced Diet</div>
              <div className="text-xs text-gray-500 mt-1">Reduce processed foods</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl block mb-2">😴</span>
              <div className="font-semibold text-gray-800 text-sm">Quality Sleep</div>
              <div className="text-xs text-gray-500 mt-1">7-9 hours nightly</div>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}

      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
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
        </div>
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
            <strong>Disclaimer:</strong> This calculator provides general health information and is not a substitute for professional medical advice. Consult a healthcare provider for personalized health recommendations.
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="waist-hip-ratio-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

    </main>
  );
}
