'use client';

import { useState, useMemo } from 'react';
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

interface BenefitRow {
  age: number | string;
  monthly: number;
  annual: number;
  lifetime: number;
  adjustment: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Social Security Calculator?",
    answer: "A Social Security Calculator is a free online tool designed to help you quickly and accurately calculate social security-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Social Security Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Social Security Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Social Security Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function SocialSecurityCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('social-security-calculator');

  const [currentAge, setCurrentAge] = useState(55);
  const [birthYear, setBirthYear] = useState(1968);
  const [monthlyPIA, setMonthlyPIA] = useState(2000);
  const [claimingAge, setClaimingAge] = useState(67);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [showFullTable, setShowFullTable] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateFRA = (year: number): number => {
    if (year <= 1937) return 65;
    if (year <= 1942) return 65 + (year - 1937) * 2 / 12;
    if (year <= 1954) return 66;
    if (year <= 1959) return 66 + (year - 1954) * 2 / 12;
    return 67;
  };

  const results = useMemo(() => {
    const fra = calculateFRA(birthYear);

    let adjustment = 0;
    if (claimingAge < fra) {
      const monthsEarly = (fra - claimingAge) * 12;
      const reductionRate = monthsEarly <= 36 ? monthsEarly * 5 / 9 : 20 + (monthsEarly - 36) * 5 / 12;
      adjustment = -reductionRate / 100;
    } else if (claimingAge > fra) {
      const yearsDelayed = Math.min(claimingAge - fra, 70 - fra);
      adjustment = yearsDelayed * 0.08;
    }

    const monthlyBenefit = monthlyPIA * (1 + adjustment);
    const annualBenefit = monthlyBenefit * 12;
    const lifetimeBenefit = annualBenefit * Math.max(0, lifeExpectancy - claimingAge);

    // Break-even calculation
    const fraMonthlyBenefit = monthlyPIA;
    const age70Benefit = monthlyPIA * 1.24;
    const monthlyDifference = age70Benefit - fraMonthlyBenefit;
    const yearsToRecoup = 3;
    const totalMissed = fraMonthlyBenefit * 12 * yearsToRecoup;
    const breakEvenAge = fra + yearsToRecoup + (totalMissed / (monthlyDifference * 12));

    // Strategy grade
    let grade = 'B';
    let gradeDesc = 'Moderate timing strategy';
    let barWidth = 50;

    if (claimingAge >= 70) {
      grade = 'A';
      gradeDesc = 'Maximizes monthly and lifetime benefits';
      barWidth = 90;
    } else if (claimingAge >= fra + 1) {
      grade = 'A-';
      gradeDesc = 'Good balance of delay and benefit';
      barWidth = 80;
    } else if (claimingAge === Math.round(fra)) {
      grade = 'B+';
      gradeDesc = 'Claiming at full retirement age';
      barWidth = 70;
    } else if (claimingAge >= 65) {
      grade = 'B';
      gradeDesc = 'Moderate reduction from FRA';
      barWidth = 60;
    } else {
      grade = 'C';
      gradeDesc = 'Significant benefit reduction';
      barWidth = 30;
    }

    return {
      fra,
      monthlyBenefit,
      annualBenefit,
      lifetimeBenefit,
      adjustment,
      breakEvenAge,
      grade,
      gradeDesc,
      barWidth
    };
  }, [birthYear, monthlyPIA, claimingAge, lifeExpectancy]);

  // Benefit comparison data
  const benefitData = useMemo(() => {
    const ages = [62, 64, 65, Math.round(results.fra), 68, 70];
    return ages.map(age => {
      let adj = 0;
      if (age < results.fra) {
        const monthsEarly = (results.fra - age) * 12;
        const reductionRate = monthsEarly <= 36 ? monthsEarly * 5 / 9 : 20 + (monthsEarly - 36) * 5 / 12;
        adj = -reductionRate / 100;
      } else if (age > results.fra) {
        const yearsDelayed = Math.min(age - results.fra, 70 - results.fra);
        adj = yearsDelayed * 0.08;
      }
      const monthly = monthlyPIA * (1 + adj);
      const annual = monthly * 12;
      const lifetime = annual * Math.max(0, lifeExpectancy - age);
      return { age: age === Math.round(results.fra) ? `${age} (FRA)` : age, monthly, annual, lifetime, adjustment: adj };
    });
  }, [monthlyPIA, results.fra, lifeExpectancy]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const calcLifetime = (claimAge: number) => {
      let adj = 0;
      if (claimAge < results.fra) {
        const monthsEarly = (results.fra - claimAge) * 12;
        const reductionRate = monthsEarly <= 36 ? monthsEarly * 5 / 9 : 20 + (monthsEarly - 36) * 5 / 12;
        adj = -reductionRate / 100;
      } else if (claimAge > results.fra) {
        const yearsDelayed = Math.min(claimAge - results.fra, 70 - results.fra);
        adj = yearsDelayed * 0.08;
      }
      const monthly = monthlyPIA * (1 + adj);
      return monthly * 12 * Math.max(0, lifeExpectancy - claimAge);
    };

    return [
      {
        title: 'Claim at 62',
        description: 'Earliest claiming',
        monthly: monthlyPIA * 0.7,
        lifetime: calcLifetime(62),
        diff: calcLifetime(62) - results.lifetimeBenefit
      },
      {
        title: 'Claim at FRA',
        description: 'Full retirement age',
        monthly: monthlyPIA,
        lifetime: calcLifetime(Math.round(results.fra)),
        diff: calcLifetime(Math.round(results.fra)) - results.lifetimeBenefit
      },
      {
        title: 'Claim at 70',
        description: 'Maximum benefits',
        monthly: monthlyPIA * 1.24,
        lifetime: calcLifetime(70),
        diff: calcLifetime(70) - results.lifetimeBenefit
      }
    ];
  }, [monthlyPIA, results.fra, lifeExpectancy, results.lifetimeBenefit]);

  // SVG Bar Chart
  const renderBenefitChart = () => {
    const data = [
      { age: 62, benefit: monthlyPIA * 0.7, color: '#EF4444' },
      { age: 65, benefit: monthlyPIA * (results.fra === 67 ? 0.867 : 0.933), color: '#F59E0B' },
      { age: Math.round(results.fra), benefit: monthlyPIA, color: '#10B981' },
      { age: 70, benefit: monthlyPIA * 1.24, color: '#3B82F6' }
    ];

    const maxBenefit = Math.max(...data.map(d => d.benefit));
    const width = 400;
    const height = 220;
    const barWidth = 60;
    const gap = 35;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {data.map((d, i) => {
          const barHeight = (d.benefit / maxBenefit) * 150;
          const x = 50 + i * (barWidth + gap);
          const y = 180 - barHeight;
          const isHovered = hoveredBar === i;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={d.color}
                rx="4"
                className="cursor-pointer transition-all duration-200"
                opacity={isHovered ? 1 : 0.85}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">
                {formatCurrency(d.benefit)}
              </text>
              <text x={x + barWidth / 2} y={200} textAnchor="middle" fill="#6B7280" fontSize="11">
                Age {d.age}
              </text>
              {isHovered && (
                <rect
                  x={x - 2}
                  y={y - 2}
                  width={barWidth + 4}
                  height={barHeight + 4}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="2"
                  rx="6"
                />
              )}
            </g>
          );
        })}
        <text x={width / 2} y={15} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="600">
          Monthly Benefit by Claiming Age
        </text>
      </svg>
    );
  };

  // SVG Line Chart for Lifetime Benefits
  const renderLifetimeChart = () => {
    const ages = [62, 64, 66, Math.round(results.fra), 68, 70];
    const data = ages.map(age => {
      let adj = 0;
      if (age < results.fra) {
        const monthsEarly = (results.fra - age) * 12;
        const reductionRate = monthsEarly <= 36 ? monthsEarly * 5 / 9 : 20 + (monthsEarly - 36) * 5 / 12;
        adj = -reductionRate / 100;
      } else if (age > results.fra) {
        const yearsDelayed = Math.min(age - results.fra, 70 - results.fra);
        adj = yearsDelayed * 0.08;
      }
      const monthly = monthlyPIA * (1 + adj);
      return { age, lifetime: monthly * 12 * Math.max(0, lifeExpectancy - age) };
    });

    const width = 400;
    const height = 220;
    const padding = { top: 30, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map(d => d.lifetime));
    const minValue = Math.min(...data.map(d => d.lifetime)) * 0.9;

    const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    const linePath = data.map((d, i) => {
      const x = getX(i);
      const y = getY(d.lifetime);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    const areaPath = `${linePath} L ${getX(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="lifetimeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const value = minValue + (maxValue - minValue) * ratio;
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#E5E7EB" strokeDasharray="4,4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#6B7280" fontSize="10">
                ${(value / 1000).toFixed(0)}K
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#lifetimeGradient)" />
        <path d={linePath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.lifetime)} r="5" fill="#10B981" stroke="white" strokeWidth="2" />
            <text x={getX(i)} y={height - 10} textAnchor="middle" fill="#6B7280" fontSize="10">
              {d.age}
            </text>
          </g>
        ))}

        <text x={width / 2} y={15} textAnchor="middle" fill="#374151" fontSize="13" fontWeight="600">
          Lifetime Benefits to Age {lifeExpectancy}
        </text>
      </svg>
    );
  };

  const displayedBenefitData = showFullTable ? benefitData : benefitData.slice(0, 4);

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Social Security Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate Social Security benefits, optimize claiming strategy, and analyze lifetime income scenarios
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Personal Information</h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Current Age</label>
                    <span className="text-sm font-semibold text-gray-800">{currentAge} years</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="70"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Birth Year</label>
                    <span className="text-sm font-semibold text-gray-800">{birthYear}</span>
                  </div>
                  <input
                    type="range"
                    min="1940"
                    max="2005"
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Monthly PIA (Primary Insurance Amount)</label>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrency(monthlyPIA)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="50"
                  value={monthlyPIA}
                  onChange={(e) => setMonthlyPIA(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$500</span>
                  <span>$5,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Planned Claiming Age</label>
                  <span className="text-sm font-semibold text-emerald-600">{claimingAge} years</span>
                </div>
                <input
                  type="range"
                  min="62"
                  max="70"
                  value={claimingAge}
                  onChange={(e) => setClaimingAge(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>62 (Earliest)</span>
                  <span>70 (Maximum)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Life Expectancy</label>
                  <span className="text-sm font-semibold text-purple-600">{lifeExpectancy} years</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>70</span>
                  <span>100</span>
                </div>
              </div>

              {/* FRA Info Box */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Full Retirement Age (FRA)</span>
                  <span className="text-lg font-bold text-blue-600">{results.fra.toFixed(1)} years</span>
                </div>
                <p className="text-xs text-blue-700">Based on birth year {birthYear}</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Benefit Analysis</h2>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 mb-5 border border-emerald-100">
              <div className="text-sm text-emerald-700 mb-1">Monthly Benefit at Age {claimingAge}</div>
              <div className="text-3xl sm:text-3xl md:text-4xl font-bold text-emerald-600">{formatCurrency(results.monthlyBenefit)}</div>
              <div className={`text-xs mt-1 ${results.adjustment >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {results.adjustment >= 0 ? '+' : ''}{(results.adjustment * 100).toFixed(1)}% adjustment from FRA
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Annual Benefit</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(results.annualBenefit)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Lifetime Benefits</div>
                <div className="text-lg font-bold text-purple-600">{formatCurrency(results.lifetimeBenefit)}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-amber-600 mb-1">Break-Even Age</div>
                <div className="text-lg font-bold text-amber-600">{Math.round(results.breakEvenAge)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Full Retirement Age</div>
                <div className="text-lg font-bold text-gray-800">{results.fra.toFixed(1)}</div>
              </div>
            </div>

            {/* Strategy Grade */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Strategy Grade</span>
                <span className="text-2xl font-bold text-indigo-600">{results.grade}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${results.barWidth}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{results.gradeDesc}</p>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              {renderBenefitChart()}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">Compare different claiming ages to optimize your lifetime benefits</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className={`rounded-xl p-5 border hover:shadow-md transition-shadow ${
              index === 0 ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100' :
              index === 1 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' :
              'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-red-100' : index === 1 ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${index === 0 ? 'text-red-600' : index === 1 ? 'text-green-600' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{scenario.title}</h3>
                  <p className="text-xs text-gray-500">{scenario.description}</p>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-xs text-gray-500">Monthly Benefit</div>
                <div className={`text-xl font-bold ${index === 0 ? 'text-red-600' : index === 1 ? 'text-green-600' : 'text-blue-600'}`}>
                  {formatCurrency(scenario.monthly)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Lifetime Total</div>
                <div className="text-lg font-semibold text-gray-800">{formatCurrency(scenario.lifetime)}</div>
              </div>
              <div className={`text-sm font-medium mt-2 ${scenario.diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {scenario.diff >= 0 ? '+' : ''}{formatCurrency(scenario.diff)} vs. current
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Lifetime Benefits Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Lifetime Benefits Analysis</h2>
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl p-4 border border-gray-200">
            {renderLifetimeChart()}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Benefits by Claiming Age</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-green-50">
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 rounded-tl-lg">Age</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Monthly</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Annual</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700 rounded-tr-lg">Lifetime</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedBenefitData.map((row, index) => (
                    <tr key={index} className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-3 py-2 font-medium text-gray-800">{row.age}</td>
                      <td className="px-3 py-2 text-right text-emerald-600">{formatCurrency(row.monthly)}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{formatCurrency(row.annual)}</td>
                      <td className="px-3 py-2 text-right font-bold text-blue-600">{formatCurrency(row.lifetime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {benefitData.length > 4 && (
              <div className="mt-3 text-center">
                <button
                  onClick={() => setShowFullTable(!showFullTable)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {showFullTable ? 'Show Less' : 'Show All Ages'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategy Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-blue-100">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Social Security Claiming Strategies</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-green-900 mb-2">When to Delay</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>Good health with family longevity</li>
              <li>Other retirement income sources</li>
              <li>Still working and earning well</li>
              <li>Want to maximize spousal benefits</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-red-900 mb-2">When to Claim Early</h4>
            <ul className="text-red-800 text-sm space-y-1">
              <li>Health concerns or shorter life expectancy</li>
              <li>Need income for essential expenses</li>
              <li>Unemployed and struggling to find work</li>
              <li>No other retirement savings</li>
            </ul>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Retirement Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className={`w-10 h-10 ${calc.color || 'bg-blue-100'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-xl">{calc.icon || '📊'}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Understanding Social Security Benefits</h2>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-4">
            Social Security benefits form the foundation of retirement income for millions of Americans. Understanding when to claim
            can significantly impact your lifetime benefits. This calculator helps you optimize your claiming strategy based on your
            personal circumstances.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">How Benefits Are Calculated</h3>
          <p className="mb-4">
            Your Primary Insurance Amount (PIA) is calculated based on your highest 35 years of earnings. Claiming before your Full
            Retirement Age (FRA) reduces benefits by 5/9 of 1% per month for the first 36 months and 5/12 of 1% thereafter. Delaying
            past FRA increases benefits by 8% per year until age 70.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Break-Even Analysis</h3>
          <p className="mb-4">
            The break-even age helps determine when delayed claiming pays off. If you expect to live past the break-even age,
            delaying benefits typically results in higher lifetime income. Consider your health, family history, and financial needs
            when making this decision.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the Full Retirement Age (FRA)?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Full Retirement Age is when you&apos;re entitled to 100% of your Social Security benefit. FRA depends on your birth year: 66 for those born 1943-1954, gradually increasing to 67 for those born 1960 or later. Claiming before FRA permanently reduces benefits by up to 30%. Waiting past FRA earns delayed retirement credits of 8% per year until age 70. Your FRA determines the baseline for all benefit calculations.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much will my benefits be reduced if I claim early?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Claiming at 62 (the earliest possible age) reduces benefits by about 30% compared to FRA. The reduction is 5/9 of 1% per month for the first 36 months before FRA, and 5/12 of 1% for additional months. If your FRA is 67, claiming at 62 means 60 months early—resulting in approximately 30% reduction. This reduction is permanent; your benefit won&apos;t increase at FRA.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much do benefits increase by waiting until 70?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              For each year you delay past FRA until age 70, benefits increase by 8% through delayed retirement credits. If your FRA is 67, waiting until 70 adds 24% to your benefit (3 years × 8%). Combined with avoiding early claiming reductions, someone claiming at 70 versus 62 receives about 77% more per month. However, there&apos;s no benefit increase for waiting past 70, so there&apos;s no reason to delay beyond that age.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the break-even age and why does it matter?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The break-even age is when total cumulative benefits from delayed claiming equal what you would have received by claiming earlier. If claiming at 62 versus 67, break-even is typically around 78-80. If you live beyond break-even, delayed claiming provides more lifetime income. However, break-even analysis doesn&apos;t account for investment opportunities—money received earlier can be invested. Consider your health, family longevity, and other income sources.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Can I work while receiving Social Security benefits?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes, but if you&apos;re under FRA, earnings above certain limits reduce benefits. In 2024, benefits are reduced $1 for every $2 earned above $22,320. In the year you reach FRA, the limit increases ($59,520 in 2024) with $1 reduction per $3 above. After reaching FRA, there&apos;s no earnings limit—you keep full benefits regardless of income. Withheld benefits aren&apos;t lost; they&apos;re recalculated to increase future payments.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Are Social Security benefits taxable?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes, Social Security benefits may be taxable depending on your &quot;combined income&quot; (AGI + nontaxable interest + half of SS benefits). For individuals: income below $25,000—no tax; $25,000-$34,000—up to 50% taxable; above $34,000—up to 85% taxable. For couples: thresholds are $32,000 and $44,000. Strategic claiming, Roth conversions, and other income planning can minimize taxation of benefits.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Disclaimer</h3>
            <p className="text-sm text-amber-700">
              This calculator provides estimates for educational purposes only. Actual Social Security benefits depend on your
              complete earnings history and current Social Security Administration rules. For accurate benefit estimates, visit
              ssa.gov or contact the Social Security Administration directly.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="social-security-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
