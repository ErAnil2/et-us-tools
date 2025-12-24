'use client';

import { useState } from 'react';
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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface Assignment {
  id: number;
  name: string;
  grade: number;
  weight: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Grade Calculator?",
    answer: "A Grade Calculator is a free online tool designed to help you quickly and accurately calculate grade-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Grade Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Grade Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Grade Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function GradeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('grade-calculator');

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, name: 'Homework', grade: 85, weight: 20 },
    { id: 2, name: 'Midterm', grade: 90, weight: 30 },
    { id: 3, name: 'Final Exam', grade: 88, weight: 50 },
  ]);

  const calculateFinalGrade = () => {
    const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return 0;
    
    const weightedSum = assignments.reduce((sum, a) => sum + (a.grade * a.weight), 0);
    return weightedSum / totalWeight;
  };

  const addAssignment = () => {
    const newId = Math.max(...assignments.map(a => a.id), 0) + 1;
    setAssignments([...assignments, { id: newId, name: `Assignment ${newId}`, grade: 0, weight: 10 }]);
  };

  const removeAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const updateAssignment = (id: number, field: keyof Assignment, value: string | number) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const finalGrade = calculateFinalGrade();
  const letterGrade = finalGrade >= 90 ? 'A' : finalGrade >= 80 ? 'B' : finalGrade >= 70 ? 'C' : finalGrade >= 60 ? 'D' : 'F';

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Grade Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate your final grade based on weighted assignments</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Assignments</h2>
              <button
                onClick={addAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Add Assignment
              </button>
            </div>

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={assignment.name}
                    onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                    className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Assignment name"
                  />
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={assignment.grade}
                      onChange={(e) => updateAssignment(assignment.id, 'grade', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Grade"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={assignment.weight}
                      onChange={(e) => updateAssignment(assignment.id, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Weight %"
                      min="0"
                      max="100"
                    />
                  </div>
                  <button
                    onClick={() => removeAssignment(assignment.id)}
                    className="col-span-1 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700 font-medium">Total Weight:</span>
                <span className={`font-bold ${assignments.reduce((sum, a) => sum + a.weight, 0) === 100 ? 'text-green-700' : 'text-orange-700'}`}>
                  {assignments.reduce((sum, a) => sum + a.weight, 0)}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Final Grade</h2>
            
            <div className="space-y-4">
              <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1">Your Grade</div>
                <div className="text-6xl font-bold text-green-700">{letterGrade}</div>
                <div className="text-2xl font-semibold text-green-600 mt-2">{finalGrade.toFixed(2)}%</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-3">Grade Scale</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>A:</span>
                    <span className="font-semibold">90-100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>B:</span>
                    <span className="font-semibold">80-89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>C:</span>
                    <span className="font-semibold">70-79%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>D:</span>
                    <span className="font-semibold">60-69%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F:</span>
                    <span className="font-semibold">0-59%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use</h2>
        <ul className="space-y-2 text-gray-600">
          <li>1. Enter your assignment names, grades, and weights</li>
          <li>2. Make sure total weight equals 100%</li>
          <li>3. Your final grade will be calculated automatically</li>
          <li>4. Add or remove assignments as needed</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="grade-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
