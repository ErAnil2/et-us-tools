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
interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Blood Sugar Calculator?",
    answer: "A Blood Sugar Calculator is a health and fitness tool that helps you calculate blood sugar-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Blood Sugar Calculator?",
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
    answer: "Use the results as a starting point for understanding your blood sugar status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function BloodSugarCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('blood-sugar-calculator');

  const [mgdl, setMgdl] = useState(100);
  const [mmol, setMmol] = useState(5.6);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setMmol(mgdl / 18);
    determineCategory(mgdl);
  }, [mgdl]);

  const determineCategory = (value: number) => {
    if (value < 70) setCategory('Low (Hypoglycemia)');
    else if (value < 100) setCategory('Normal (Fasting)');
    else if (value < 126) setCategory('Prediabetes');
    else setCategory('Diabetes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{getH1('Blood Sugar Calculator')}</h1>
          <p className="text-lg text-gray-600">Convert and check blood glucose levels</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Enter Blood Sugar Level</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">mg/dL (US Standard)</label>
                  <input type="number" value={mgdl} onChange={(e) => setMgdl(Number(e.target.value))} 
                    min="0" className="w-full px-2 py-3 text-2xl font-bold text-center border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">mmol/L (International)</label>
                  <input type="number" value={mmol.toFixed(1)} onChange={(e) => setMgdl(Number(e.target.value) * 18)} 
                    min="0" step="0.1" className="w-full px-2 py-3 text-2xl font-bold text-center border rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Result</h3>
              <div className={`p-6 rounded-lg text-center ${
                category.includes('Low') ? 'bg-red-100' :
                category.includes('Normal') ? 'bg-green-100' :
                category.includes('Prediabetes') ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <div className="text-2xl font-bold mb-2">{category}</div>
                <div className="text-sm">
                  {mgdl.toFixed(0)} mg/dL = {mmol.toFixed(1)} mmol/L
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>Normal (Fasting):</span>
                  <span className="font-semibold">70-99 mg/dL</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span>Prediabetes:</span>
                  <span className="font-semibold">100-125 mg/dL</span>
                </div>
                <div className="flex justify-between p-2 bg-red-50 rounded">
                  <span>Diabetes:</span>
                  <span className="font-semibold">126+ mg/dL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-white border hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="text-2xl mb-2">🧮</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="blood-sugar-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
    </div>
  );
}
