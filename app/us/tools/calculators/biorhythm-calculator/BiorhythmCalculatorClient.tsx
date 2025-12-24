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
    question: "What is a Biorhythm Calculator?",
    answer: "A Biorhythm Calculator is a free online tool designed to help you quickly and accurately calculate biorhythm-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Biorhythm Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Biorhythm Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Biorhythm Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function BiorhythmCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('biorhythm-calculator');

  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [results, setResults] = useState({
    physical: 0,
    emotional: 0,
    intellectual: 0
  });

  useEffect(() => {
    calculateBiorhythm();
  }, [birthDate, targetDate]);

  const calculateBiorhythm = () => {
    if (!birthDate || !targetDate) return;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    const daysSinceBirth = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    const physical = Math.sin((2 * Math.PI * daysSinceBirth) / 23) * 100;
    const emotional = Math.sin((2 * Math.PI * daysSinceBirth) / 28) * 100;
    const intellectual = Math.sin((2 * Math.PI * daysSinceBirth) / 33) * 100;

    setResults({ physical, emotional, intellectual });
  };

  const getStatus = (value: number) => {
    if (Math.abs(value) < 5) return { level: 'Critical', color: 'orange' };
    if (value >= 75) return { level: 'High', color: 'green' };
    if (value >= 25) return { level: 'Good', color: 'blue' };
    if (value >= 0) return { level: 'Moderate', color: 'blue' };
    if (value >= -25) return { level: 'Low', color: 'yellow' };
    return { level: 'Poor', color: 'red' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{getH1('Biorhythm Calculator')}</h1>
          <p className="text-lg text-gray-600">Calculate your physical, emotional, and intellectual biorhythm cycles</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Your Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-2 py-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-2 py-3 border rounded-lg"
                />
              </div>

              <button
                onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
                className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg"
              >
                Use Today's Date
              </button>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Biorhythm Cycles</h4>
                <div className="space-y-2 text-sm text-purple-700">
                  <div className="flex justify-between">
                    <span><strong>Physical:</strong> 23 days</span>
                    <span>Strength, energy</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Emotional:</strong> 28 days</span>
                    <span>Mood, creativity</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Intellectual:</strong> 33 days</span>
                    <span>Logic, memory</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Biorhythm Status</h3>
              
              <div className="space-y-4">
                {['physical', 'emotional', 'intellectual'].map((type) => {
                  const value = results[type as keyof typeof results];
                  const status = getStatus(value);
                  return (
                    <div key={type} className={`bg-${status.color}-100 rounded-lg p-4`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold capitalize">{type} Cycle</h4>
                        <span className="text-sm">{status.level}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full bg-${status.color}-500`}
                          style={{ width: `${Math.abs(value)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm">{Math.round(value)}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Understanding Biorhythms</h3>
          <p className="text-blue-700 text-sm">
            Biorhythm theory suggests that our lives are affected by rhythmic biological cycles. While not scientifically proven, 
            many people find it useful for self-reflection and general wellness awareness.
          </p>
        </div>
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
        <FirebaseFAQs pageId="biorhythm-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
    </div>
  );
}
