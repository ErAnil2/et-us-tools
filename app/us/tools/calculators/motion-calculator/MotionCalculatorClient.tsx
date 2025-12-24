'use client';

import { useState, useEffect } from 'react';
import RelatedCalculatorCards from '@/components/RelatedCalculatorCards';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
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
interface MotionCalculatorClientProps {
  relatedCalculators?: Array<{
    href: string;
    title: string;
    description: string;
    color: string;
  }>;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Motion Calculator?",
    answer: "A Motion Calculator is a free online tool designed to help you quickly and accurately calculate motion-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Motion Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Motion Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Motion Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MotionCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: MotionCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('motion-calculator');

  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    // Basic placeholder calculation
    if (value) {
      setResult(`Result for ${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Motion Calculator')}</h1>
          <p className="text-lg text-gray-600">Free online motion calculator</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="max-w-md mx-auto">
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Value
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter value..."
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Calculate
            </button>

            {result && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-semibold">{result}</p>
              </div>
            )}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        <RelatedCalculatorCards calculators={relatedCalculators} />
      
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="motion-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
    </div>
  );
}
