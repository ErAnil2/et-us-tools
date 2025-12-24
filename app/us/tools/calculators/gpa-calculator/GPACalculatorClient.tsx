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
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
interface Course {
  id: number;
  name: string;
  grade: string;
  credits: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Gpa Calculator?",
    answer: "A Gpa Calculator is a free online tool designed to help you quickly and accurately calculate gpa-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Gpa Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Gpa Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Gpa Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function GPACalculatorClient({ relatedCalculators = defaultRelatedCalculators }: { relatedCalculators?: RelatedCalculator[] }) {
  const { getH1, getSubHeading } = usePageSEO('gpa-calculator');

  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Math', grade: 'A', credits: 3 },
    { id: 2, name: 'English', grade: 'B', credits: 3 },
    { id: 3, name: 'Science', grade: 'A-', credits: 4 },
  ]);

  const gradePoints: { [key: string]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const calculateGPA = () => {
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    if (totalCredits === 0) return 0;
    
    const totalPoints = courses.reduce((sum, c) => sum + (gradePoints[c.grade] || 0) * c.credits, 0);
    return totalPoints / totalCredits;
  };

  const addCourse = () => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    setCourses([...courses, { id: newId, name: `Course ${newId}`, grade: 'A', credits: 3 }]);
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: number, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const gpa = calculateGPA();

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('GPA Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate your Grade Point Average</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Courses</h2>
              <button onClick={addCourse} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                + Add Course
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Course name"
                  />
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {Object.keys(gradePoints).map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Credits"
                    min="0"
                    max="6"
                  />
                  <button onClick={() => removeCourse(course.id)} className="col-span-1 text-red-600 hover:text-red-800">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your GPA</h2>
            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Grade Point Average</div>
              <div className="text-6xl font-bold text-blue-700">{gpa.toFixed(2)}</div>
              <div className="text-sm text-blue-600 mt-2">
                {courses.reduce((sum, c) => sum + c.credits, 0)} total credits
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-3">GPA Scale</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span>A (4.0):</span><span>Excellent</span></div>
                <div className="flex justify-between"><span>B (3.0):</span><span>Good</span></div>
                <div className="flex justify-between"><span>C (2.0):</span><span>Average</span></div>
                <div className="flex justify-between"><span>D (1.0):</span><span>Below Average</span></div>
                <div className="flex justify-between"><span>F (0.0):</span><span>Failing</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {relatedCalculators.map((calc: any) => (
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
        <FirebaseFAQs pageId="gpa-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
