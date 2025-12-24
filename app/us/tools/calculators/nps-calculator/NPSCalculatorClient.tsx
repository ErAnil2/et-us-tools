'use client';

import { useState, useEffect, useMemo } from 'react';
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

interface YearlyData {
  year: number;
  age: number;
  annualInvestment: number;
  totalInvestment: number;
  totalValue: number;
  returns: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Nps Calculator?",
    answer: "A Nps Calculator is a free online tool designed to help you quickly and accurately calculate nps-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Nps Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Nps Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Nps Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function NPSCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('nps-calculator');

  const [monthlyContribution, setMonthlyContribution] = useState(1500);
  const [employerContribution, setEmployerContribution] = useState(750);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(65);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [annuityRate, setAnnuityRate] = useState(6);
  const [taxRate, setTaxRate] = useState(25);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const [results, setResults] = useState({
    maturityAmount: 0,
    totalInvestment: 0,
    totalReturns: 0,
    lumpSum: 0,
    annuityCorpus: 0,
    monthlyPension: 0,
    annualTaxSavings: 0,
    effectiveReturn: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyFull = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const calculateNPS = () => {
    const investmentYears = Math.max(retirementAge - currentAge, 1);
    const monthlyRate = expectedReturn / 12 / 100;
    const totalMonths = investmentYears * 12;
    const totalMonthlyContribution = monthlyContribution + employerContribution;

    const maturityAmount = totalMonthlyContribution *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalInvestment = totalMonthlyContribution * totalMonths;
    const totalReturns = maturityAmount - totalInvestment;

    const lumpSum = maturityAmount * 0.6;
    const annuityCorpus = maturityAmount * 0.4;
    const monthlyPension = (annuityCorpus * (annuityRate / 100)) / 12;

    const annualContribution = totalMonthlyContribution * 12;
    const annualTaxSavings = annualContribution * (taxRate / 100);

    const effectiveReturn = ((maturityAmount + (annualTaxSavings * investmentYears)) / totalInvestment) ** (1 / investmentYears) - 1;

    setResults({
      maturityAmount,
      totalInvestment,
      totalReturns,
      lumpSum,
      annuityCorpus,
      monthlyPension,
      annualTaxSavings,
      effectiveReturn: effectiveReturn * 100
    });

    // Generate yearly data
    const yearly: YearlyData[] = [];
    for (let year = 1; year <= investmentYears; year++) {
      const months = year * 12;
      const annualInvestment = totalMonthlyContribution * 12;
      const totalValue = totalMonthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const totalInv = totalMonthlyContribution * months;
      const returns = totalValue - totalInv;
      yearly.push({
        year,
        age: currentAge + year,
        annualInvestment,
        totalInvestment: totalInv,
        totalValue,
        returns
      });
    }
    setYearlyData(yearly);
  };

  useEffect(() => {
    calculateNPS();
  }, [monthlyContribution, employerContribution, currentAge, retirementAge, expectedReturn, annuityRate, taxRate]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const investmentYears = Math.max(retirementAge - currentAge, 1);
    const totalMonthlyContribution = monthlyContribution + employerContribution;

    // Scenario 1: 50% Higher Contribution
    const higherContribution = totalMonthlyContribution * 1.5;
    const monthlyRate1 = expectedReturn / 12 / 100;
    const totalMonths1 = investmentYears * 12;
    const corpus1 = higherContribution * ((Math.pow(1 + monthlyRate1, totalMonths1) - 1) / monthlyRate1) * (1 + monthlyRate1);

    // Scenario 2: Work 5 More Years
    const longerYears = investmentYears + 5;
    const totalMonths2 = longerYears * 12;
    const corpus2 = totalMonthlyContribution * ((Math.pow(1 + monthlyRate1, totalMonths2) - 1) / monthlyRate1) * (1 + monthlyRate1);

    // Scenario 3: 2% Higher Return
    const higherReturn = expectedReturn + 2;
    const monthlyRate3 = higherReturn / 12 / 100;
    const corpus3 = totalMonthlyContribution * ((Math.pow(1 + monthlyRate3, totalMonths1) - 1) / monthlyRate3) * (1 + monthlyRate3);

    return [
      {
        title: 'Higher Contribution',
        description: '+50% monthly savings',
        corpus: corpus1,
        difference: corpus1 - results.maturityAmount,
        percentChange: ((corpus1 - results.maturityAmount) / results.maturityAmount * 100) || 0
      },
      {
        title: 'Longer Career',
        description: 'Work 5 more years',
        corpus: corpus2,
        difference: corpus2 - results.maturityAmount,
        percentChange: ((corpus2 - results.maturityAmount) / results.maturityAmount * 100) || 0
      },
      {
        title: 'Higher Returns',
        description: '+2% annual return',
        corpus: corpus3,
        difference: corpus3 - results.maturityAmount,
        percentChange: ((corpus3 - results.maturityAmount) / results.maturityAmount * 100) || 0
      }
    ];
  }, [monthlyContribution, employerContribution, currentAge, retirementAge, expectedReturn, results.maturityAmount]);

  // SVG Chart rendering
  const renderGrowthChart = () => {
    if (yearlyData.length === 0) return null;

    const width = 500;
    const height = 280;
    const padding = { top: 20, right: 30, bottom: 40, left: 70 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...yearlyData.map(d => d.totalValue));
    const minValue = 0;

    const getX = (index: number) => padding.left + (index / (yearlyData.length - 1)) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    // Create path for the line
    const linePath = yearlyData.map((d, i) => {
      const x = getX(i);
      const y = getY(d.totalValue);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    // Create path for filled area
    const areaPath = `${linePath} L ${getX(yearlyData.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

    // Y-axis labels
    const yLabels = [];
    const numYLabels = 5;
    for (let i = 0; i <= numYLabels; i++) {
      const value = minValue + (maxValue - minValue) * (i / numYLabels);
      yLabels.push({
        value,
        y: getY(value)
      });
    }

    // X-axis labels (show every 5 years or reasonable interval)
    const interval = Math.max(1, Math.floor(yearlyData.length / 8));
    const xLabels = yearlyData.filter((_, i) => i === 0 || i === yearlyData.length - 1 || i % interval === 0);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="npsAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={label.y}
            x2={width - padding.right}
            y2={label.y}
            stroke="#E5E7EB"
            strokeDasharray="4,4"
          />
        ))}

        {/* Filled area */}
        <path d={areaPath} fill="url(#npsAreaGradient)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {yearlyData.map((d, i) => (
          <g key={i}>
            <circle
              cx={getX(i)}
              cy={getY(d.totalValue)}
              r={hoveredPoint === i ? 8 : 5}
              fill={hoveredPoint === i ? '#1D4ED8' : '#3B82F6'}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {hoveredPoint === i && (
              <g>
                <rect
                  x={getX(i) - 70}
                  y={getY(d.totalValue) - 50}
                  width="140"
                  height="40"
                  rx="6"
                  fill="#1F2937"
                  fillOpacity="0.95"
                />
                <text x={getX(i)} y={getY(d.totalValue) - 35} textAnchor="middle" fill="white" fontSize="11" fontWeight="500">
                  Year {d.year} (Age {d.age})
                </text>
                <text x={getX(i)} y={getY(d.totalValue) - 18} textAnchor="middle" fill="#34D399" fontSize="12" fontWeight="bold">
                  {formatCurrency(d.totalValue)}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <text
            key={i}
            x={padding.left - 10}
            y={label.y + 4}
            textAnchor="end"
            fill="#6B7280"
            fontSize="11"
          >
            {label.value >= 1000000 ? `$${(label.value / 1000000).toFixed(1)}M` : label.value >= 1000 ? `$${(label.value / 1000).toFixed(0)}K` : `$${label.value.toFixed(0)}`}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((d) => {
          const i = yearlyData.indexOf(d);
          return (
            <text
              key={d.year}
              x={getX(i)}
              y={height - 10}
              textAnchor="middle"
              fill="#6B7280"
              fontSize="11"
            >
              Yr {d.year}
            </text>
          );
        })}

        {/* Axis labels */}
        <text x={width / 2} y={height - 2} textAnchor="middle" fill="#374151" fontSize="12" fontWeight="500">
          Investment Period
        </text>
        <text
          x={-height / 2 + 20}
          y={15}
          transform="rotate(-90)"
          textAnchor="middle"
          fill="#374151"
          fontSize="12"
          fontWeight="500"
        >
          Corpus Value
        </text>
      </svg>
    );
  };

  // Donut Chart for corpus breakdown
  const renderDonutChart = () => {
    const investmentYears = Math.max(retirementAge - currentAge, 1);
    const totalMonths = investmentYears * 12;
    const employeeTotal = monthlyContribution * totalMonths;
    const employerTotal = employerContribution * totalMonths;
    const returnsTotal = results.totalReturns;
    const total = employeeTotal + employerTotal + returnsTotal;

    if (total === 0) return null;

    const employeePercent = (employeeTotal / total) * 100;
    const employerPercent = (employerTotal / total) * 100;
    const returnsPercent = (returnsTotal / total) * 100;

    const radius = 80;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    const employeeOffset = 0;
    const employerOffset = (employeePercent / 100) * circumference;
    const returnsOffset = ((employeePercent + employerPercent) / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          {/* Employee Contribution */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${(employeePercent / 100) * circumference} ${circumference}`}
            strokeDashoffset={-employeeOffset}
          />
          {/* Employer Contribution */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#F59E0B"
            strokeWidth={strokeWidth}
            strokeDasharray={`${(employerPercent / 100) * circumference} ${circumference}`}
            strokeDashoffset={-employerOffset}
          />
          {/* Returns */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#10B981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${(returnsPercent / 100) * circumference} ${circumference}`}
            strokeDashoffset={-returnsOffset}
          />
        </svg>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Your Contribution ({employeePercent.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-gray-600">Employer ({employerPercent.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-600">Returns ({returnsPercent.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    );
  };

  const displayedYearlyData = showFullSchedule ? yearlyData : yearlyData.slice(0, 10);

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('NPS Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate your National Pension System retirement corpus, monthly pension, and tax benefits with employer matching contributions
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">NPS Investment Details</h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Employee Contribution</label>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrency(monthlyContribution)}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$100</span>
                  <span>$10,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Employer Contribution</label>
                  <span className="text-sm font-semibold text-amber-600">{formatCurrency(employerContribution)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={employerContribution}
                  onChange={(e) => setEmployerContribution(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-amber"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$5,000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Current Age</label>
                    <span className="text-sm font-semibold text-gray-800">{currentAge} years</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>18</span>
                    <span>60</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Retirement Age</label>
                    <span className="text-sm font-semibold text-gray-800">{retirementAge} years</span>
                  </div>
                  <input
                    type="range"
                    min="55"
                    max="75"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>55</span>
                    <span>75</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Expected Annual Return</label>
                  <span className="text-sm font-semibold text-emerald-600">{expectedReturn}%</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  step="0.5"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4%</span>
                  <span>15%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Annuity Rate</label>
                    <span className="text-sm font-semibold text-purple-600">{annuityRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.5"
                    value={annuityRate}
                    onChange={(e) => setAnnuityRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4%</span>
                    <span>10%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Tax Rate</label>
                    <span className="text-sm font-semibold text-rose-600">{taxRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-rose"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">NPS Retirement Benefits</h2>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-5 border border-blue-100">
              <div className="text-sm text-blue-700 mb-1">Total Retirement Corpus</div>
              <div className="text-3xl sm:text-3xl md:text-4xl font-bold text-blue-600">{formatCurrency(results.maturityAmount)}</div>
              <div className="text-xs text-blue-600 mt-1">
                After {retirementAge - currentAge} years of investment
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Total Investment</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.totalInvestment)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-emerald-600 mb-1">Investment Returns</div>
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(results.totalReturns)}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Lump Sum (60%)</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(results.lumpSum)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Annuity Corpus (40%)</div>
                <div className="text-lg font-bold text-purple-600">{formatCurrency(results.annuityCorpus)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-center">
                <div className="text-xs text-amber-600 mb-1">Monthly Pension</div>
                <div className="text-lg font-bold text-amber-600">{formatCurrency(results.monthlyPension)}</div>
              </div>
              <div className="bg-rose-50 rounded-lg p-3 border border-rose-200 text-center">
                <div className="text-xs text-rose-600 mb-1">Tax Savings/Year</div>
                <div className="text-lg font-bold text-rose-600">{formatCurrency(results.annualTaxSavings)}</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200 text-center">
                <div className="text-xs text-indigo-600 mb-1">Effective Return</div>
                <div className="text-lg font-bold text-indigo-600">{results.effectiveReturn.toFixed(1)}%</div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 text-center mb-3">Corpus Composition</h3>
              {renderDonutChart()}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Growth Chart Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">NPS Corpus Growth Over Time</h2>
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
          {renderGrowthChart()}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Hover over data points to see detailed values for each year
        </div>
      </div>
{/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">See how small changes can significantly impact your retirement corpus</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{scenario.title}</h3>
                  <p className="text-xs text-gray-500">{scenario.description}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(scenario.corpus)}</div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${scenario.difference >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {scenario.difference >= 0 ? '+' : ''}{formatCurrency(scenario.difference)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${scenario.difference >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {scenario.percentChange >= 0 ? '+' : ''}{scenario.percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year-by-Year Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Accumulation Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-lg">Year</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Age</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Annual Investment</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Total Investment</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Total Returns</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 rounded-tr-lg">Corpus Value</th>
              </tr>
            </thead>
            <tbody>
              {displayedYearlyData.map((data, index) => (
                <tr
                  key={data.year}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{data.year}</td>
                  <td className="px-4 py-3 text-gray-600">{data.age}</td>
                  <td className="px-4 py-3 text-right text-blue-600">{formatCurrency(data.annualInvestment)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(data.totalInvestment)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{formatCurrency(data.returns)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCurrency(data.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {yearlyData.length > 10 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
            >
              {showFullSchedule ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Show Less
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Show Full Schedule ({yearlyData.length} years)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* NPS Investment Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-blue-100">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">NPS Investment Structure</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Tax Benefits</h4>
            <p className="text-blue-800 text-sm">Additional deductions available for NPS contributions. Tax savings compound your effective returns.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-green-900 mb-2">Investment Options</h4>
            <p className="text-green-800 text-sm">Choose from multiple pension funds and customize your asset allocation based on risk tolerance.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-purple-900 mb-2">Withdrawal Rules</h4>
            <p className="text-purple-800 text-sm">60% lump sum tax-free at retirement. 40% must be used to purchase annuity for monthly pension.</p>
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
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Understanding the NPS Calculator</h2>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-4">
            The National Pension System (NPS) is a retirement savings scheme that helps you build a substantial corpus for your golden years.
            Our NPS calculator helps you estimate your retirement corpus, monthly pension, and understand the power of compound interest over
            your working years.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">How NPS Works</h3>
          <p className="mb-4">
            NPS combines employee and employer contributions, invested in market-linked instruments. At retirement, you can withdraw 60% as
            a tax-free lump sum, while 40% must be used to purchase an annuity that provides monthly pension income. The longer you invest,
            the more powerful the compounding effect becomes.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Tax Benefits of NPS</h3>
          <p className="mb-4">
            NPS offers significant tax advantages. Employee contributions qualify for tax deductions, effectively reducing your taxable income.
            This tax savings adds to your effective returns, making NPS one of the most tax-efficient retirement planning tools available.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Maximizing Your NPS Returns</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Start early to maximize the power of compounding</li>
            <li>Consider increasing contributions when you receive salary raises</li>
            <li>Take advantage of employer matching if available</li>
            <li>Review and rebalance your asset allocation periodically</li>
            <li>Consider delaying retirement age to significantly boost your corpus</li>
          </ul>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is the National Pension System (NPS)?</h3>
            <p className="text-gray-600 leading-relaxed">
              The NPS is a government-sponsored retirement savings program designed to help employees build a corpus for retirement. It combines contributions from both the employee and employer, which are invested in market-linked instruments like equities and bonds. The scheme offers tax benefits and provides both a lump sum at retirement and a monthly pension through annuity purchase.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much can I withdraw from NPS at retirement?</h3>
            <p className="text-gray-600 leading-relaxed">
              At retirement (age 60 or above), you can withdraw up to 60% of your total NPS corpus as a tax-free lump sum. The remaining 40% must be used to purchase an annuity from an approved insurance provider, which will pay you a monthly pension for life. If your total corpus is below a certain threshold, you may be eligible to withdraw the entire amount.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What are the tax benefits of investing in NPS?</h3>
            <p className="text-gray-600 leading-relaxed">
              NPS offers significant tax advantages. Your contributions may qualify for tax deductions under relevant tax sections. Employer contributions to your NPS account also receive tax benefits. The 60% lump sum withdrawal at retirement is typically tax-free, and the returns on your investment grow tax-deferred until withdrawal. This makes NPS one of the most tax-efficient retirement planning tools.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can I change my investment allocation in NPS?</h3>
            <p className="text-gray-600 leading-relaxed">
              Yes, NPS offers flexibility in asset allocation. You can choose between Active Choice (where you decide the allocation between equity, corporate bonds, and government securities) or Auto Choice (lifecycle fund that automatically adjusts allocation based on your age). You can switch between pension fund managers and adjust your allocation periodically based on your risk appetite and market conditions.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What happens to my NPS if I leave my job?</h3>
            <p className="text-gray-600 leading-relaxed">
              Your NPS account is portable and remains with you regardless of job changes. You can continue contributing to the same account even if you change employers or become self-employed. If you stop contributing, your existing corpus continues to grow based on market performance. You can also make voluntary contributions to boost your retirement savings.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">How is the monthly pension calculated from NPS?</h3>
            <p className="text-gray-600 leading-relaxed">
              Your monthly pension depends on the annuity corpus (40% of total corpus) and the annuity rate offered by the insurance provider. For example, if your annuity corpus is $200,000 and the annuity rate is 6%, your annual pension would be $12,000 ($1,000/month). Annuity rates vary based on the type of annuity chosen, your age at retirement, and the insurance provider. Consider comparing rates from different providers.
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
              This calculator provides estimates for informational purposes only. Actual returns may vary based on market conditions,
              fund performance, and regulatory changes. The calculations assume consistent returns and contributions throughout the
              investment period. Please consult with a qualified financial advisor for personalized retirement planning advice.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="nps-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
