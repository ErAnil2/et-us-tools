'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface BPResult {
  category: string;
  color: string;
  description: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What do blood pressure numbers mean?",
    answer: "Blood pressure is measured with two numbers: systolic (top number) measures pressure when your heart beats, and diastolic (bottom number) measures pressure when your heart rests between beats. A reading of 120/80 mmHg means systolic is 120 and diastolic is 80.",
    order: 1
  },
  {
    id: '2',
    question: "What is considered normal blood pressure?",
    answer: "Normal blood pressure is less than 120/80 mmHg. Elevated blood pressure is 120-129 systolic with diastolic less than 80. Stage 1 hypertension is 130-139/80-89, and Stage 2 is 140+/90+ mmHg.",
    order: 2
  },
  {
    id: '3',
    question: "How often should I check my blood pressure?",
    answer: "Adults with normal blood pressure should check it at least once a year. Those with elevated or high blood pressure should monitor more frequently, as recommended by their doctor, often daily or several times a week.",
    order: 3
  },
  {
    id: '4',
    question: "What factors affect blood pressure readings?",
    answer: "Many factors can affect readings including stress, caffeine, exercise, smoking, full bladder, body position, and time of day. For accurate readings, rest 5 minutes before measuring, avoid caffeine and exercise 30 minutes prior, and sit with feet flat on the floor.",
    order: 4
  },
  {
    id: '5',
    question: "When is blood pressure considered a medical emergency?",
    answer: "A hypertensive crisis occurs when blood pressure exceeds 180/120 mmHg. If you see these numbers along with symptoms like chest pain, shortness of breath, numbness, or vision problems, call 911 immediately.",
    order: 5
  },
  {
    id: '6',
    question: "Can blood pressure be lowered naturally?",
    answer: "Yes, lifestyle changes can significantly lower blood pressure: reduce sodium intake, maintain healthy weight, exercise regularly (150 minutes/week), limit alcohol, quit smoking, manage stress, and eat a diet rich in fruits, vegetables, and whole grains (DASH diet).",
    order: 6
  }
];

const relatedCalculators = [
  { href: "/us/tools/calculators/bmi-calculator", title: "BMI Calculator", description: "Calculate body mass index" },
  { href: "/us/tools/calculators/bmr-calculator", title: "BMR Calculator", description: "Basal metabolic rate" },
  { href: "/us/tools/calculators/calorie-calculator", title: "Calorie Calculator", description: "Daily calorie needs" },
  { href: "/us/tools/calculators/body-fat-calculator", title: "Body Fat Calculator", description: "Estimate body fat %" },
  { href: "/us/tools/calculators/ideal-weight-calculator", title: "Ideal Weight", description: "Find ideal body weight" },
  { href: "/us/tools/calculators/heart-rate-calculator", title: "Heart Rate Zones", description: "Target heart rate zones" }
];

export default function BloodPressureCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('blood-pressure-calculator');

  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [result, setResult] = useState<BPResult | null>(null);
  const [age, setAge] = useState(40);
  const [history, setHistory] = useState<{ date: string; systolic: number; diastolic: number; category: string }[]>([]);

  const calculateBP = () => {
    let category = '';
    let color = '';
    let description = '';
    let recommendations: string[] = [];
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';

    if (systolic >= 180 || diastolic >= 120) {
      category = 'Hypertensive Crisis';
      color = 'red';
      description = 'This is a medical emergency! Your blood pressure is dangerously high.';
      recommendations = [
        'Seek immediate medical attention - call 911',
        'Do not wait to see if pressure comes down',
        'Note any symptoms: chest pain, shortness of breath, vision changes'
      ];
      riskLevel = 'critical';
    } else if (systolic >= 140 || diastolic >= 90) {
      category = 'High Blood Pressure (Stage 2)';
      color = 'red';
      description = 'You have Stage 2 hypertension. This requires medical attention and likely medication.';
      recommendations = [
        'Schedule a doctor appointment soon',
        'Take prescribed medications as directed',
        'Monitor blood pressure daily',
        'Reduce sodium intake to less than 1,500mg/day',
        'Exercise for at least 30 minutes most days'
      ];
      riskLevel = 'high';
    } else if (systolic >= 130 || diastolic >= 80) {
      category = 'High Blood Pressure (Stage 1)';
      color = 'orange';
      description = 'You have Stage 1 hypertension. Lifestyle changes and possibly medication may be recommended.';
      recommendations = [
        'Consult your healthcare provider',
        'Adopt the DASH diet',
        'Reduce sodium intake',
        'Increase physical activity',
        'Limit alcohol consumption',
        'Manage stress'
      ];
      riskLevel = 'moderate';
    } else if (systolic >= 120 && diastolic < 80) {
      category = 'Elevated';
      color = 'yellow';
      description = 'Your blood pressure is elevated. Without intervention, you may develop high blood pressure.';
      recommendations = [
        'Make lifestyle changes now',
        'Reduce sodium in your diet',
        'Exercise regularly',
        'Maintain a healthy weight',
        'Monitor blood pressure periodically'
      ];
      riskLevel = 'moderate';
    } else {
      category = 'Normal';
      color = 'green';
      description = 'Your blood pressure is in the normal, healthy range. Keep up the good work!';
      recommendations = [
        'Continue maintaining healthy habits',
        'Stay physically active',
        'Eat a balanced diet',
        'Check blood pressure annually'
      ];
      riskLevel = 'low';
    }

    setResult({ category, color, description, recommendations, riskLevel });
  };

  useEffect(() => {
    calculateBP();
  }, [systolic, diastolic]);

  const addToHistory = () => {
    if (result) {
      const newEntry = {
        date: new Date().toLocaleDateString(),
        systolic,
        diastolic,
        category: result.category
      };
      setHistory([newEntry, ...history.slice(0, 9)]);
    }
  };

  const getColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
      red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
    };
    return colors[color]?.[type] || '';
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Blood Pressure Calculator",
        "description": "Free blood pressure calculator to check and interpret your BP readings. Understand your systolic and diastolic numbers and get health recommendations.",
        "url": "https://economictimes.indiatimes.com/us/tools/calculators/blood-pressure-calculator",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "permissions": "browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": fallbackFaqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://economictimes.indiatimes.com/us"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://economictimes.indiatimes.com/us/tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Calculators",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Blood Pressure Calculator",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators/blood-pressure-calculator"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{getH1('Blood Pressure Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check and interpret your blood pressure readings. Enter your systolic and diastolic numbers to understand your cardiovascular health status.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}

      <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Blood Pressure</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Systolic Pressure (Top Number)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(Number(e.target.value))}
                      min="70"
                      max="250"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">mmHg</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Pressure when heart beats (typically 90-180)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diastolic Pressure (Bottom Number)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(Number(e.target.value))}
                      min="40"
                      max="150"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">mmHg</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Pressure when heart rests (typically 60-120)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Age (optional)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min="18"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={addToHistory}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Save to History
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div>
              {result && (
                <div className={`rounded-xl p-6 ${getColorClass(result.color, 'bg')} ${getColorClass(result.color, 'border')} border-2`}>
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold text-gray-900 mb-1">
                      {systolic}/{diastolic}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">mmHg</div>
                    <div className={`text-2xl font-bold ${getColorClass(result.color, 'text')}`}>
                      {result.category}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{result.description}</p>

                  <div className="bg-white/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Health Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm mb-1">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Blood Pressure</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Blood pressure is the force of blood pushing against the walls of your arteries as your heart pumps blood throughout your body. It&apos;s one of the most important vital signs and a key indicator of cardiovascular health. High blood pressure (hypertension) is often called the &quot;silent killer&quot; because it typically has no symptoms but can lead to serious health complications including heart attack, stroke, kidney disease, and vision loss.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
              <h3 className="font-semibold text-green-800 mb-1 text-sm">Normal</h3>
              <p className="text-lg text-green-700 font-bold">&lt;120/80</p>
              <p className="text-xs text-gray-600 mt-1">Healthy range - maintain lifestyle</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 text-center">
              <h3 className="font-semibold text-yellow-800 mb-1 text-sm">Elevated</h3>
              <p className="text-lg text-yellow-700 font-bold">120-129/&lt;80</p>
              <p className="text-xs text-gray-600 mt-1">Risk of developing hypertension</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 text-center">
              <h3 className="font-semibold text-orange-800 mb-1 text-sm">Stage 1 Hypertension</h3>
              <p className="text-lg text-orange-700 font-bold">130-139/80-89</p>
              <p className="text-xs text-gray-600 mt-1">Lifestyle changes needed</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
              <h3 className="font-semibold text-red-800 mb-1 text-sm">Stage 2 Hypertension</h3>
              <p className="text-lg text-red-700 font-bold">140+/90+</p>
              <p className="text-xs text-gray-600 mt-1">Medication likely required</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">What the Numbers Mean</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Systolic (Top Number)</h4>
                <p className="text-sm text-gray-600">Measures the pressure in your arteries when your heart beats and pumps blood. This is the higher number and is considered more important for cardiovascular risk assessment, especially in people over 50.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Diastolic (Bottom Number)</h4>
                <p className="text-sm text-gray-600">Measures the pressure in your arteries when your heart rests between beats. High diastolic pressure can indicate stiff arteries and is particularly important in younger individuals.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Risk Factors for High BP</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Age:</strong> Risk increases with age, especially after 65</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Family history:</strong> Genetics play a significant role</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Obesity:</strong> Excess weight increases heart workload</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Sodium intake:</strong> High salt causes fluid retention</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Sedentary lifestyle:</strong> Lack of exercise weakens heart</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Lower Blood Pressure</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>DASH diet:</strong> Rich in fruits, vegetables, whole grains</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Reduce sodium:</strong> Aim for less than 2,300mg/day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Exercise regularly:</strong> 150 min moderate activity/week</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Limit alcohol:</strong> Max 1 drink/day women, 2 for men</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span><strong>Manage stress:</strong> Practice relaxation techniques</span>
                </li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Accurate Blood Pressure Measurement Tips</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Before Measuring</h4>
              <p className="text-xs text-gray-600">Rest quietly for 5 minutes. Avoid caffeine, exercise, and smoking for 30 minutes before. Empty your bladder. Don&apos;t talk during measurement.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2 text-sm">Proper Position</h4>
              <p className="text-xs text-gray-600">Sit with back supported, feet flat on floor. Rest arm on flat surface at heart level. Cuff should be on bare skin, not over clothing.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 text-sm">Taking Multiple Readings</h4>
              <p className="text-xs text-gray-600">Take 2-3 readings, 1 minute apart. Record all readings and note the time. Measure at the same time daily for consistency.</p>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQs Section - Firebase Powered */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="blood-pressure-calculator" fallbackFaqs={fallbackFaqs} />
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-2xl">⚠️</div>
            <div>
              <h3 className="text-sm font-semibold text-amber-800 mb-1">Medical Disclaimer</h3>
              <p className="text-xs sm:text-sm text-amber-700">
                This calculator is for informational purposes only and is not a substitute for professional medical advice. If your blood pressure is consistently elevated or if you experience symptoms such as chest pain, severe headache, or vision problems, seek immediate medical attention. Always consult with a healthcare provider for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
