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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Scholarship Calculator?",
    answer: "A Scholarship Calculator is a free online tool designed to help you quickly and accurately calculate scholarship-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Scholarship Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Scholarship Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Scholarship Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function ScholarshipCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Education Costs
  const { getH1, getSubHeading } = usePageSEO('scholarship-calculator');

  const [tuitionFees, setTuitionFees] = useState(25000);
  const [roomBoard, setRoomBoard] = useState(12000);
  const [booksSupplies, setBooksSupplies] = useState(1500);
  const [otherExpenses, setOtherExpenses] = useState(3000);
  const [degreeLength, setDegreeLength] = useState(4);

  // Scholarship Information
  const [meritName1, setMeritName1] = useState('Presidential Scholarship');
  const [meritAmount1, setMeritAmount1] = useState(5000);
  const [meritYears1, setMeritYears1] = useState(4);
  const [meritName2, setMeritName2] = useState("Dean's Merit Award");
  const [meritAmount2, setMeritAmount2] = useState(3000);
  const [meritYears2, setMeritYears2] = useState(4);

  // Need-Based Aid
  const [pellGrant, setPellGrant] = useState(6000);
  const [stateGrant, setStateGrant] = useState(2000);

  // Other Support
  const [workStudy, setWorkStudy] = useState(3000);
  const [familyContribution, setFamilyContribution] = useState(5000);

  // Student Profile
  const [gpa, setGpa] = useState(3.75);
  const [testScore, setTestScore] = useState(1300);

  // Results
  const [showResults, setShowResults] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [totalAid, setTotalAid] = useState(0);
  const [remainingNeed, setRemainingNeed] = useState(0);
  const [annualCost, setAnnualCost] = useState(0);
  const [potentialScholarships, setPotentialScholarships] = useState(0);
  const [potentialDescription, setPotentialDescription] = useState('');
  const [costBreakdown, setCostBreakdown] = useState<Array<{ item: string; amount: number }>>([]);
  const [aidBreakdown, setAidBreakdown] = useState<Array<{ item: string; annual: number; years: number; total: number }>>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Auto-calculate on initial load with prefilled data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tuitionFees && roomBoard) {
        calculateScholarships();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-calculate when costs change
  useEffect(() => {
    if (tuitionFees) {
      const timer = setTimeout(() => {
        calculateScholarships();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [tuitionFees, roomBoard, booksSupplies, otherExpenses, degreeLength]);

  const calculateScholarships = () => {
    const annualCostCalc = tuitionFees + roomBoard + booksSupplies + otherExpenses;
    const totalCostCalc = annualCostCalc * degreeLength;

    setAnnualCost(annualCostCalc);
    setTotalCost(totalCostCalc);

    // Calculate total aid over degree length
    const totalMerit1 = meritAmount1 * Math.min(meritYears1, degreeLength);
    const totalMerit2 = meritAmount2 * Math.min(meritYears2, degreeLength);
    const totalPell = pellGrant * degreeLength;
    const totalState = stateGrant * degreeLength;
    const totalWorkStudy = workStudy * degreeLength;
    const totalFamily = familyContribution * degreeLength;

    const totalAidCalc = totalMerit1 + totalMerit2 + totalPell + totalState + totalWorkStudy + totalFamily;
    const remainingNeedCalc = Math.max(0, totalCostCalc - totalAidCalc);

    setTotalAid(totalAidCalc);
    setRemainingNeed(remainingNeedCalc);

    // Estimate additional scholarship potential
    let potentialScholarshipsCalc = 0;
    let potentialDescriptionCalc = '';

    if (gpa >= 3.8 && testScore >= 1400) {
      potentialScholarshipsCalc = 15000;
      potentialDescriptionCalc = 'High academic achievement - strong candidate for major merit scholarships';
    } else if (gpa >= 3.5 && testScore >= 1200) {
      potentialScholarshipsCalc = 8000;
      potentialDescriptionCalc = 'Good academic record - eligible for moderate merit awards';
    } else if (gpa >= 3.0 && testScore >= 1000) {
      potentialScholarshipsCalc = 3000;
      potentialDescriptionCalc = 'Solid academic performance - focus on local and specific-criteria scholarships';
    } else if (gpa > 0 || testScore > 0) {
      potentialScholarshipsCalc = 1500;
      potentialDescriptionCalc = 'Consider need-based aid and community scholarships';
    }

    setPotentialScholarships(potentialScholarshipsCalc);
    setPotentialDescription(potentialDescriptionCalc);

    // Generate cost breakdown
    const costs = [
      { item: 'Tuition & Fees', amount: tuitionFees },
      { item: 'Room & Board', amount: roomBoard },
      { item: 'Books & Supplies', amount: booksSupplies },
      { item: 'Personal/Transportation', amount: otherExpenses }
    ].filter(cost => cost.amount > 0);

    setCostBreakdown(costs);

    // Generate aid breakdown
    const aids = [
      { item: meritName1 || 'Merit Scholarship 1',
        annual: meritAmount1, years: meritYears1, total: meritAmount1 * Math.min(meritYears1, degreeLength) },
      { item: meritName2 || 'Merit Scholarship 2',
        annual: meritAmount2, years: meritYears2, total: meritAmount2 * Math.min(meritYears2, degreeLength) },
      { item: 'Pell Grant', annual: pellGrant, years: degreeLength, total: pellGrant * degreeLength },
      { item: 'State Grant', annual: stateGrant, years: degreeLength, total: stateGrant * degreeLength },
      { item: 'Work-Study', annual: workStudy, years: degreeLength, total: workStudy * degreeLength },
      { item: 'Family Contribution', annual: familyContribution, years: degreeLength, total: familyContribution * degreeLength }
    ].filter(aid => aid.annual > 0);

    setAidBreakdown(aids);

    // Generate recommendations
    generateRecommendations(remainingNeedCalc, annualCostCalc, gpa, testScore, potentialScholarshipsCalc);

    setShowResults(true);
  };

  const generateRecommendations = (remainingNeedCalc: number, annualCostCalc: number, gpaVal: number, testScoreVal: number, potentialVal: number) => {
    const recs: string[] = [];

    if (remainingNeedCalc > annualCostCalc * 2) {
      recs.push('• Large funding gap - prioritize high-value scholarships and consider less expensive schools');
      recs.push('• Look into in-state public universities for lower tuition costs');
    } else if (remainingNeedCalc > annualCostCalc) {
      recs.push('• Moderate funding gap - apply to 10-15 scholarships annually');
      recs.push('• Consider community college for first two years');
    } else if (remainingNeedCalc > 0) {
      recs.push('• Small funding gap - focus on local scholarships and work-study programs');
    } else {
      recs.push('• Excellent funding position - consider setting aside extra aid for graduate school');
    }

    if (gpaVal >= 3.5) {
      recs.push('• Strong GPA - apply for academic merit scholarships');
      recs.push('• Consider honors programs which often include scholarships');
    }

    if (testScoreVal >= 1300) {
      recs.push('• High test scores - eligible for many merit-based awards');
    }

    if (potentialVal > 5000) {
      recs.push('• Apply to 15-20 scholarships to reach potential funding level');
    } else if (potentialVal > 0) {
      recs.push('• Focus on local and niche scholarships for best chances');
    }

    recs.push('• Create a scholarship application calendar with deadlines');
    recs.push('• Prepare a strong personal statement that can be adapted');
    recs.push('• Maintain strong grades and involvement throughout high school');

    if (remainingNeedCalc > 10000) {
      recs.push('• Consider federal student loans as a last resort');
      recs.push('• Look into employer tuition assistance programs');
    }

    setRecommendations(recs);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Scholarship Calculator')}</h1>
        <p className="text-sm md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6 max-w-3xl mx-auto">
          Calculate your scholarship potential, education costs, and funding strategies to make college more affordable.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Column: Input Forms */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Education Costs */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">💰 Education Costs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <label htmlFor="tuitionFees" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">📚 Tuition & Fees ($)</label>
                <input
                  type="number"
                  id="tuitionFees"
                  min="0"
                  value={tuitionFees}
                  onChange={(e) => setTuitionFees(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25,000"
                />
              </div>
              <div>
                <label htmlFor="roomBoard" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">🏠 Room & Board ($)</label>
                <input
                  type="number"
                  id="roomBoard"
                  min="0"
                  value={roomBoard}
                  onChange={(e) => setRoomBoard(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <label htmlFor="booksSupplies" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">📖 Books & Supplies ($)</label>
                <input
                  type="number"
                  id="booksSupplies"
                  min="0"
                  value={booksSupplies}
                  onChange={(e) => setBooksSupplies(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1,500"
                />
              </div>
              <div>
                <label htmlFor="otherExpenses" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">🚗 Personal/Transport ($)</label>
                <input
                  type="number"
                  id="otherExpenses"
                  min="0"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3,000"
                />
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <label htmlFor="degreeLength" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">🎯 Degree Length (years)</label>
              <select
                id="degreeLength"
                value={degreeLength}
                onChange={(e) => setDegreeLength(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2">Associate (2 years)</option>
                <option value="4">Bachelor&apos;s (4 years)</option>
                <option value="6">Master&apos;s (6 years)</option>
                <option value="8">Doctoral (8 years)</option>
              </select>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Scholarship Information */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">🎯 Scholarship & Aid Information</h2>

            {/* Merit-Based Scholarships */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">🏆 Merit-Based Scholarships</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    id="meritName1"
                    placeholder="Scholarship Name"
                    value={meritName1}
                    onChange={(e) => setMeritName1(e.target.value)}
                    className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    id="meritAmount1"
                    placeholder="Annual Amount ($)"
                    value={meritAmount1}
                    onChange={(e) => setMeritAmount1(Number(e.target.value))}
                    className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    id="meritYears1"
                    placeholder="Years"
                    max="8"
                    min="1"
                    value={meritYears1}
                    onChange={(e) => setMeritYears1(Number(e.target.value))}
                    className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    id="meritName2"
                    placeholder="Scholarship Name"
                    value={meritName2}
                    onChange={(e) => setMeritName2(e.target.value)}
                    className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    id="meritAmount2"
                    placeholder="Annual Amount ($)"
                    value={meritAmount2}
                    onChange={(e) => setMeritAmount2(Number(e.target.value))}
                    className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    id="meritYears2"
                    placeholder="Years"
                    max="8"
                    min="1"
                    value={meritYears2}
                    onChange={(e) => setMeritYears2(Number(e.target.value))}
                    className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Need-Based Aid */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">💵 Need-Based Financial Aid</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label htmlFor="pellGrant" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Pell Grant (Annual $)</label>
                  <input
                    type="number"
                    id="pellGrant"
                    min="0"
                    max="7500"
                    value={pellGrant}
                    onChange={(e) => setPellGrant(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6,000"
                  />
                </div>
                <div>
                  <label htmlFor="stateGrant" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">State Grant (Annual $)</label>
                  <input
                    type="number"
                    id="stateGrant"
                    min="0"
                    value={stateGrant}
                    onChange={(e) => setStateGrant(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2,000"
                  />
                </div>
              </div>
            </div>

            {/* Work-Study & Other Aid */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">💼 Other Financial Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label htmlFor="workStudy" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Work-Study (Annual $)</label>
                  <input
                    type="number"
                    id="workStudy"
                    min="0"
                    value={workStudy}
                    onChange={(e) => setWorkStudy(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3,000"
                  />
                </div>
                <div>
                  <label htmlFor="familyContribution" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Family Contribution (Annual $)</label>
                  <input
                    type="number"
                    id="familyContribution"
                    min="0"
                    value={familyContribution}
                    onChange={(e) => setFamilyContribution(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5,000"
                  />
                </div>
              </div>
            </div>

            {/* Student Profile for Scholarship Estimation */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">📊 Student Profile (For Potential Scholarship Estimation)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label htmlFor="gpa" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">GPA (0.0-4.0)</label>
                  <input
                    type="number"
                    id="gpa"
                    step="0.01"
                    min="0"
                    max="4"
                    value={gpa}
                    onChange={(e) => setGpa(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3.75"
                  />
                </div>
                <div>
                  <label htmlFor="testScore" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">SAT/ACT Score</label>
                  <input
                    type="number"
                    id="testScore"
                    min="400"
                    max="1600"
                    value={testScore}
                    onChange={(e) => setTestScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1300"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={calculateScholarships}
              className="w-full bg-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-lg font-semibold"
            >
              Calculate Scholarship Analysis
            </button>
          </div>

          {/* Info Cards - 2 columns, 2 rows */}
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🎓 Scholarship Types</h3>
                  <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                    <div><strong>Merit-Based:</strong> Academic performance</div>
                    <div><strong>Need-Based:</strong> Financial situation</div>
                    <div><strong>Athletic:</strong> Sports achievements</div>
                    <div><strong>Subject-Specific:</strong> Major or field</div>
                    <div><strong>Demographic:</strong> Background/identity</div>
                    <div><strong>Community Service:</strong> Volunteer work</div>
                  </div>
                </div>
              </div>
            </div>
<div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">💡 Scholarship Tips</h3>
                  <ul className="text-sm text-gray-600 leading-relaxed space-y-1">
                    <li>• Apply to multiple scholarships</li>
                    <li>• Start early - many have deadlines</li>
                    <li>• Tailor essays to each application</li>
                    <li>• Maintain good grades</li>
                    <li>• Document community service</li>
                    <li>• Ask for recommendation letters early</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-amber-100 rounded-lg p-2">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📊 Average Awards</h3>
                  <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                    <div><strong>Academic Merit:</strong> $1,000-$10,000</div>
                    <div><strong>Need-Based:</strong> $500-$5,000</div>
                    <div><strong>Athletic:</strong> $2,000-$15,000</div>
                    <div><strong>Private:</strong> $500-$5,000</div>
                    <div><strong>Corporate:</strong> $1,000-$25,000</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🔍 Where to Find Scholarships</h3>
                  <ul className="text-sm text-gray-600 leading-relaxed space-y-1">
                    <li>• School counselor/financial aid office</li>
                    <li>• Scholarship search engines</li>
                    <li>• Professional organizations</li>
                    <li>• Employer/parent&apos;s workplace</li>
                    <li>• Community foundations</li>
                    <li>• Religious organizations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Results */}
        <div className="space-y-4 md:space-y-6">
          {/* Results */}
          <div id="results" className={`bg-white rounded-xl shadow-lg p-4 md:p-6 ${showResults ? '' : 'hidden'}`}>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">📊 Scholarship & Funding Analysis</h3>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 md:p-4 bg-red-50 rounded border-l-4 border-red-500 gap-1">
                <span className="font-medium text-sm md:text-base text-red-800">Total Education Cost:</span>
                <span id="totalCost" className="font-bold text-lg md:text-xl text-red-800">
                  ${totalCost.toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 md:p-4 bg-green-50 rounded border-l-4 border-green-500 gap-1">
                <span className="font-medium text-sm md:text-base text-green-800">Total Financial Aid:</span>
                <span id="totalAid" className="font-bold text-lg md:text-xl text-green-800">
                  ${totalAid.toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 md:p-4 bg-blue-50 rounded border-l-4 border-blue-500 gap-1">
                <span className="font-medium text-sm md:text-base text-blue-800">Remaining Need:</span>
                <span id="remainingNeed" className="font-bold text-lg md:text-xl text-blue-800">
                  ${remainingNeed.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <div id="costBreakdown" className="mb-4 md:mb-6">
              <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-2 md:mb-3">Annual Cost Breakdown</h4>
              <div id="annualCosts" className="space-y-2">
                {costBreakdown.map((cost, index) => (
                  <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>{cost.item}:</span>
                    <span className="font-bold">${cost.amount.toLocaleString('en-US')}</span>
                  </div>
                ))}
                <div className="flex justify-between p-2 bg-blue-100 rounded border-t-2 border-blue-300 mt-2">
                  <span className="font-bold">Annual Total:</span>
                  <span className="font-bold text-blue-800">${annualCost.toLocaleString('en-US')}</span>
                </div>
              </div>
            </div>

            <div id="aidBreakdown" className="mb-4 md:mb-6">
              <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-2 md:mb-3">Financial Aid Summary</h4>
              <div id="aidDetails" className="space-y-2">
                {aidBreakdown.map((aid, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{aid.item}</div>
                      <div className="text-xs text-gray-600">${aid.annual.toLocaleString('en-US')}/year × {aid.years} years</div>
                    </div>
                    <span className="font-bold">${aid.total.toLocaleString('en-US')}</span>
                  </div>
                ))}
                <div className="flex justify-between p-2 bg-green-100 rounded border-t-2 border-green-300 mt-2">
                  <div>
                    <div className="font-bold">Total Financial Aid</div>
                    <div className="text-xs text-gray-600">
                      ${(totalAid / degreeLength).toLocaleString('en-US')}/year average
                    </div>
                  </div>
                  <span className="font-bold text-green-800">${totalAid.toLocaleString('en-US')}</span>
                </div>
              </div>
            </div>

            {/* Scholarship Potential */}
            <div id="scholarshipPotential" className="mb-4 md:mb-6 p-3 md:p-4 bg-purple-50 rounded-lg">
              <h4 className="text-sm md:text-base font-semibold text-purple-800 mb-2">Additional Scholarship Potential</h4>
              <div id="potentialAmount" className="text-xs md:text-sm text-purple-700">
                {potentialScholarships > 0 ? (
                  <>
                    <strong>Estimated Additional Potential:</strong> ${potentialScholarships.toLocaleString('en-US')}/year<br />
                    <em>{potentialDescription}</em>
                  </>
                ) : (
                  <em>Enter GPA and test scores for scholarship potential estimation</em>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm md:text-base font-semibold text-blue-800 mb-2">Funding Strategy Recommendations</h4>
              <div id="recommendations" className="text-xs md:text-sm text-blue-700">
                {recommendations.map((rec, index) => (
                  <div key={index}>{rec}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">📚 Scholarship Strategy Guide</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Creating a Scholarship Portfolio</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              A successful scholarship strategy involves applying to multiple opportunities that match your profile.
              Focus on a mix of large national scholarships and smaller local awards.
            </p>

            <h4 className="text-sm md:text-base font-semibold mb-2">Application Timeline:</h4>
            <ul className="space-y-1 text-gray-600 text-xs md:text-sm">
              <li>• Junior Year: Start researching and preparing</li>
              <li>• Summer: Complete applications for early deadlines</li>
              <li>• Senior Year Fall: Submit most applications</li>
              <li>• Senior Year Spring: Apply to local/last-minute scholarships</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">Maximizing Your Chances</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              Success in scholarship applications comes from understanding what committees are looking for
              and presenting your unique story effectively.
            </p>

            <h4 className="text-sm md:text-base font-semibold mb-2">Key Success Factors:</h4>
            <ul className="space-y-1 text-gray-600 text-xs md:text-sm">
              <li>• Strong academic record and test scores</li>
              <li>• Demonstrated leadership and initiative</li>
              <li>• Community service and volunteer work</li>
              <li>• Compelling personal essays</li>
              <li>• Strong letters of recommendation</li>
              <li>• Meeting all requirements and deadlines</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      {relatedCalculators && relatedCalculators.length > 0 && (
        <div className="mt-8 md:mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 text-center">
            Related Math Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {relatedCalculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="block bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {calc.title}
                </h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content Section */}
      <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">How to Fund Your College Education Through Scholarships</h2>
        <div className="prose max-w-none text-gray-600 space-y-4">
          <p>
            Scholarships represent free money for college that never needs to be repaid, making them the most valuable form of financial aid available to students. With over $6 billion in private scholarships awarded annually and billions more in institutional aid, students who invest time in the scholarship search process can significantly reduce their education costs. The key is starting early, applying broadly, and presenting your unique story compellingly to scholarship committees.
          </p>
          <p>
            Merit-based scholarships reward academic achievement, typically requiring minimum GPA thresholds (often 3.0-3.5) and strong standardized test scores. National Merit Scholarships, based on PSAT performance, can provide substantial funding at participating universities. Athletic scholarships at NCAA Division I and II schools can cover full tuition, room, and board, though they represent a small fraction of available aid. Need-based scholarships consider family financial circumstances, using FAFSA data to determine eligibility for federal Pell Grants and institutional aid.
          </p>
          <p>
            Local scholarships from community foundations, civic organizations, and businesses often have fewer applicants and better odds of winning. While individual awards may be smaller ($500-$5,000), applying to multiple local opportunities can accumulate significant funding. Professional associations related to your intended major, companies in your industry of interest, and ethnic or religious organizations also offer targeted scholarships that match specific student profiles.
          </p>
          <p>
            The Expected Family Contribution (EFC) calculated from your FAFSA determines the gap between what your family can pay and the cost of attendance—this gap represents your demonstrated financial need. Schools meet varying percentages of need through grants, work-study, and loans. Understanding your EFC helps target schools with generous financial aid packages and identify where additional scholarship funding would have the greatest impact on making college affordable.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">When should I start applying for college scholarships?</h3>
            <p className="text-gray-600">Start researching scholarships during your junior year of high school and begin applying the summer before senior year. Many major scholarships have fall deadlines (October-December), so early preparation is essential. Create a scholarship calendar tracking deadlines, continue applying throughout senior year for rolling opportunities, and don&apos;t stop after committing to a college—many scholarships are available for current college students as well.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How many scholarships should I apply to?</h3>
            <p className="text-gray-600">Aim to apply for 20-30 scholarships during your senior year, but quality matters more than quantity. Focus on scholarships matching your profile—academic achievements, intended major, demographics, community involvement, or special talents. Local and niche scholarships often have better odds (sometimes 1 in 10 applicants) compared to national competitions (1 in 1,000+). Treating scholarship applications like a part-time job—10 hours weekly—can yield significant returns.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Do scholarships affect my other financial aid?</h3>
            <p className="text-gray-600">Outside scholarships can impact institutional aid packages, though policies vary by school. Most colleges first reduce loan or work-study components, preserving grants. Some schools practice &quot;stacking&quot; that allows external scholarships to reduce the family contribution. Always ask each college&apos;s financial aid office about their scholarship policy before applying. Report all scholarship awards promptly to avoid aid adjustments later in the academic year.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What makes a winning scholarship essay?</h3>
            <p className="text-gray-600">Winning essays tell authentic personal stories that answer the specific prompt while demonstrating your character, achievements, and future goals. Start with a compelling hook, use concrete examples rather than generalizations, and show—don&apos;t tell—your qualities. Tailor each essay to the scholarship&apos;s mission and values. Have teachers, counselors, or mentors review drafts for feedback. Proofread meticulously—grammatical errors can disqualify otherwise strong applications.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Are there scholarships for students with average grades?</h3>
            <p className="text-gray-600">Absolutely! While academic scholarships often require high GPAs, many opportunities evaluate other qualities: community service, leadership, artistic talent, career goals, demographic background, or specific circumstances (first-generation college student, military family, etc.). Trade and vocational scholarships, employer-sponsored programs, and organization-specific awards often prioritize factors beyond academics. Search for &quot;no minimum GPA&quot; scholarships and focus on highlighting your unique strengths.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I avoid scholarship scams?</h3>
            <p className="text-gray-600">Legitimate scholarships never require application fees, investment purchases, or payment to receive winnings. Be suspicious of unsolicited offers claiming you&apos;ve won contests you didn&apos;t enter. Never share Social Security numbers on initial applications. Use established scholarship databases (Fastweb, Scholarships.com, College Board) rather than responding to random emails. Research organizations offering scholarships to verify legitimacy. If an offer seems too good to be true, it probably is.</p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="scholarship-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
