'use client';

import { useState, useEffect } from 'react';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface SalaryToHourlyCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Salary To Hourly Calculator?",
    answer: "A Salary To Hourly Calculator is a free online tool designed to help you quickly and accurately calculate salary to hourly-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Salary To Hourly Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Salary To Hourly Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Salary To Hourly Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function SalaryToHourlyCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: SalaryToHourlyCalculatorClientProps) {
  // Main calculator states
  const { getH1, getSubHeading } = usePageSEO('salary-to-hourly-calculator');

  const [annualSalary, setAnnualSalary] = useState(65000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [vacationDays, setVacationDays] = useState(10);
  const [holidays, setHolidays] = useState(8);

  // Overtime calculator states
  const [overtimeSalary, setOvertimeSalary] = useState(60000);
  const [actualHours, setActualHours] = useState(45);
  const [classification, setClassification] = useState('exempt');
  const [weeksPerYear, setWeeksPerYear] = useState(50);

  // Net salary calculator states
  const [grossSalaryInput, setGrossSalaryInput] = useState(75000);
  const [netFilingStatus, setNetFilingStatus] = useState('single');
  const [netStateTax, setNetStateTax] = useState(0.05);
  const [net401kPercent, setNet401kPercent] = useState(6);
  const [healthInsuranceMonthly, setHealthInsuranceMonthly] = useState(350);

  // Negotiation calculator states
  const [negotiationSalary, setNegotiationSalary] = useState(70000);
  const [negotiationExperience, setNegotiationExperience] = useState(5);
  const [negotiationPerformance, setNegotiationPerformance] = useState('good');
  const [marketPosition, setMarketPosition] = useState('market');

  // Result states
  const [hourlyRate, setHourlyRate] = useState('$0.00');
  const [dailyRate, setDailyRate] = useState('$0.00');
  const [weeklyRate, setWeeklyRate] = useState('$0.00');
  const [monthlyRate, setMonthlyRate] = useState('$0.00');
  const [workingHours, setWorkingHours] = useState('0');
  const [workingDays, setWorkingDays] = useState('0');

  // Overtime results
  const [trueHourlyRate, setTrueHourlyRate] = useState('$26.67');
  const [nonExemptAnnual, setNonExemptAnnual] = useState('$67,000');
  const [annualDifference, setAnnualDifference] = useState('+$7,000');
  const [overtimeHours, setOvertimeHours] = useState('5');

  // Net salary results
  const [displayGrossSalary, setDisplayGrossSalary] = useState('$75,000');
  const [netFederalTax, setNetFederalTax] = useState('-$9,000');
  const [netStateTaxAmount, setNetStateTaxAmount] = useState('-$3,750');
  const [netFicaTax, setNetFicaTax] = useState('-$5,738');
  const [net401kContrib, setNet401kContrib] = useState('-$4,500');
  const [netHealthInsurance, setNetHealthInsurance] = useState('-$4,200');
  const [netTakeHomeSalary, setNetTakeHomeSalary] = useState('$47,812');
  const [netHourlyRate, setNetHourlyRate] = useState('$23.91');
  const [takeHomePercentage, setTakeHomePercentage] = useState('63.7%');

  // Negotiation results
  const [conservativeNegotiation, setConservativeNegotiation] = useState('$73,500');
  const [realisticNegotiation, setRealisticNegotiation] = useState('$77,000');
  const [stretchNegotiation, setStretchNegotiation] = useState('$84,000');
  const [negotiationHourly, setNegotiationHourly] = useState('$38.50/hr');

  // Main calculator function
  const calculateHourly = () => {
    if (annualSalary <= 0) {
      setHourlyRate('$0.00');
      setDailyRate('$0.00');
      setWeeklyRate('$0.00');
      setMonthlyRate('$0.00');
      setWorkingHours('0');
      setWorkingDays('0');
      return;
    }

    const hoursPerDay = hoursPerWeek / daysPerWeek;
    const weekendsPerYear = Math.floor(365 / 7) * (7 - daysPerWeek);
    const workingDaysPerYear = 365 - weekendsPerYear - vacationDays - holidays;
    const workingHoursPerYear = workingDaysPerYear * hoursPerDay;

    const hourlyRateValue = annualSalary / workingHoursPerYear;
    const dailyRateValue = hourlyRateValue * hoursPerDay;
    const weeklyRateValue = hourlyRateValue * hoursPerWeek;
    const monthlyRateValue = annualSalary / 12;

    setHourlyRate(`$${hourlyRateValue.toFixed(2)}`);
    setDailyRate(`$${dailyRateValue.toFixed(2)}`);
    setWeeklyRate(`$${weeklyRateValue.toFixed(2)}`);
    setMonthlyRate(`$${monthlyRateValue.toFixed(2)}`);
    setWorkingHours(Math.round(workingHoursPerYear).toString());
    setWorkingDays(Math.round(workingDaysPerYear).toString());
  };

  // Overtime impact calculator
  const calculateOvertimeImpact = () => {
    const totalHours = actualHours * weeksPerYear;
    const trueHourlyRateValue = overtimeSalary / totalHours;

    const regularHours = Math.min(actualHours, 40) * weeksPerYear;
    const overtimeHoursTotal = Math.max(0, actualHours - 40) * weeksPerYear;

    const regularRate = overtimeSalary / (regularHours + (overtimeHoursTotal * 1.5));
    const nonExemptAnnualValue = (regularHours * regularRate) + (overtimeHoursTotal * regularRate * 1.5);

    const annualDifferenceValue = nonExemptAnnualValue - overtimeSalary;
    const overtimeHoursPerWeek = Math.max(0, actualHours - 40);

    setTrueHourlyRate(`$${trueHourlyRateValue.toFixed(2)}`);
    setNonExemptAnnual(`$${nonExemptAnnualValue.toLocaleString()}`);
    setAnnualDifference((annualDifferenceValue >= 0 ? '+' : '') + `$${annualDifferenceValue.toLocaleString()}`);
    setOvertimeHours(overtimeHoursPerWeek.toFixed(1));
  };

  // Net salary calculator
  const calculateNetSalary = () => {
    const k401ContribValue = grossSalaryInput * (net401kPercent / 100);
    const healthInsuranceAnnual = healthInsuranceMonthly * 12;
    const taxableIncome = grossSalaryInput - k401ContribValue - healthInsuranceAnnual;

    let federalTax = 0;
    if (netFilingStatus === 'single') {
      if (taxableIncome > 44725) federalTax += (Math.min(taxableIncome, 95375) - 44725) * 0.22;
      if (taxableIncome > 11000) federalTax += (Math.min(taxableIncome, 44725) - 11000) * 0.12;
      if (taxableIncome > 0) federalTax += Math.min(taxableIncome, 11000) * 0.10;
    } else {
      federalTax = taxableIncome * 0.12;
    }

    const stateTax = taxableIncome * netStateTax;
    const ficaTax = grossSalaryInput * 0.0765;

    const netTakeHome = grossSalaryInput - federalTax - stateTax - ficaTax - k401ContribValue - healthInsuranceAnnual;
    const netHourlyRateValue = netTakeHome / 2000;
    const takeHomePercentageValue = (netTakeHome / grossSalaryInput) * 100;

    setDisplayGrossSalary(`$${grossSalaryInput.toLocaleString()}`);
    setNetFederalTax(`-$${federalTax.toLocaleString()}`);
    setNetStateTaxAmount(`-$${stateTax.toLocaleString()}`);
    setNetFicaTax(`-$${ficaTax.toLocaleString()}`);
    setNet401kContrib(`-$${k401ContribValue.toLocaleString()}`);
    setNetHealthInsurance(`-$${healthInsuranceAnnual.toLocaleString()}`);
    setNetTakeHomeSalary(`$${netTakeHome.toLocaleString()}`);
    setNetHourlyRate(`$${netHourlyRateValue.toFixed(2)}`);
    setTakeHomePercentage(`${takeHomePercentageValue.toFixed(1)}%`);
  };

  // Negotiation calculator
  const calculateNegotiation = () => {
    let baseIncrease = 0.05;

    if (negotiationExperience < 2) baseIncrease += 0.02;
    else if (negotiationExperience > 10) baseIncrease += 0.01;

    const performanceMultipliers: { [key: string]: number } = {
      'excellent': 1.8,
      'good': 1.3,
      'average': 1.0,
      'developing': 0.7
    };
    baseIncrease *= performanceMultipliers[negotiationPerformance] || 1.0;

    const marketMultipliers: { [key: string]: number } = {
      'below': 1.5,
      'market': 1.0,
      'above': 0.7,
      'premium': 0.5
    };
    baseIncrease *= marketMultipliers[marketPosition] || 1.0;

    const conservative = negotiationSalary * (1 + baseIncrease);
    const realistic = negotiationSalary * (1 + baseIncrease * 1.5);
    const stretch = negotiationSalary * (1 + baseIncrease * 2.5);
    const hourlyEquivalent = realistic / 2000;

    setConservativeNegotiation(`$${conservative.toLocaleString()}`);
    setRealisticNegotiation(`$${realistic.toLocaleString()}`);
    setStretchNegotiation(`$${stretch.toLocaleString()}`);
    setNegotiationHourly(`$${hourlyEquivalent.toFixed(2)}/hr`);
  };

  // Run calculations on mount and when values change
  useEffect(() => {
    calculateHourly();
  }, [annualSalary, hoursPerWeek, daysPerWeek, vacationDays, holidays]);

  useEffect(() => {
    calculateOvertimeImpact();
  }, [overtimeSalary, actualHours, classification, weeksPerYear]);

  useEffect(() => {
    calculateNetSalary();
  }, [grossSalaryInput, netFilingStatus, netStateTax, net401kPercent, healthInsuranceMonthly]);

  useEffect(() => {
    calculateNegotiation();
  }, [negotiationSalary, negotiationExperience, negotiationPerformance, marketPosition]);

  return (
    <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Salary to Hourly Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert your annual salary to hourly wage with our comprehensive calculator. Includes vacation, holidays, and detailed employment analysis.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Your Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary ($)</label>
              <input
                type="number"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(parseFloat(e.target.value) || 0)}
                step="1000"
                placeholder="e.g., 75000"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours per Week</label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
                min="1" max="80"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Days per Week</label>
              <input
                type="number"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseFloat(e.target.value) || 0)}
                min="1" max="7"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vacation Days per Year</label>
              <input
                type="number"
                value={vacationDays}
                onChange={(e) => setVacationDays(parseFloat(e.target.value) || 0)}
                min="0" max="365"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Holidays per Year</label>
              <input
                type="number"
                value={holidays}
                onChange={(e) => setHolidays(parseFloat(e.target.value) || 0)}
                min="0" max="50"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Hourly Rate</h3>

            <div className="space-y-4">
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{hourlyRate}</div>
                <div className="text-blue-700">per hour</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="font-semibold">{dailyRate}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Weekly Rate:</span>
                  <span className="font-semibold">{weeklyRate}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Monthly Rate:</span>
                  <span className="font-semibold">{monthlyRate}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Working Hours/Year:</span>
                  <span className="font-semibold">{workingHours}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Working Days/Year:</span>
                  <span className="font-semibold">{workingDays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Charts Section */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Salary Breakdown Visualizations</h2>

        {/* Chart 1: Annual vs Hourly Breakdown */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Hourly Rate Breakdown</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="hourlyBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="dailyBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="weeklyBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="monthlyBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>

              {/* Grid */}
              <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="180" x2="740" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="120" x2="740" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="60" x2="740" y2="60" stroke="#e5e7eb" strokeWidth="1" />

              {/* Axis */}
              <line x1="60" y1="20" x2="60" y2="240" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="240" x2="740" y2="240" stroke="#374151" strokeWidth="2" />

              {(() => {
                const hourlyVal = parseFloat(hourlyRate.replace(/[^0-9.]/g, ''));
                const dailyVal = parseFloat(dailyRate.replace(/[^0-9.]/g, ''));
                const weeklyVal = parseFloat(weeklyRate.replace(/[^0-9.]/g, ''));
                const monthlyVal = parseFloat(monthlyRate.replace(/[^0-9.]/g, ''));

                const maxValue = Math.max(monthlyVal, 1);
                const scale = 200 / maxValue;

                const bars = [
                  { label: 'Hourly', value: hourlyVal, color: 'url(#hourlyBar)', x: 100 },
                  { label: 'Daily', value: dailyVal, color: 'url(#dailyBar)', x: 250 },
                  { label: 'Weekly', value: weeklyVal, color: 'url(#weeklyBar)', x: 400 },
                  { label: 'Monthly', value: monthlyVal, color: 'url(#monthlyBar)', x: 550 }
                ];

                return bars.map((bar, idx) => {
                  const height = bar.value * scale;
                  const y = 240 - height;

                  return (
                    <g key={idx}>
                      <rect
                        x={bar.x}
                        y={y}
                        width="80"
                        height={height}
                        fill={bar.color}
                        rx="4"
                      />
                      <text x={bar.x + 40} y={y - 10} textAnchor="middle" className="text-xs font-semibold fill-gray-700">
                        ${bar.value.toFixed(0)}
                      </text>
                      <text x={bar.x + 40} y={260} textAnchor="middle" className="text-sm fill-gray-600">
                        {bar.label}
                      </text>
                    </g>
                  );
                });
              })()}

              <text x="55" y="245" textAnchor="end" className="text-xs fill-gray-600">$0</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Time Allocation Pie Chart */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Annual Time Breakdown</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5 md:gap-8">
            <svg viewBox="0 0 200 200" className="w-64 h-64">
              <defs>
                <linearGradient id="workingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="offGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>
              {(() => {
                const workingHoursVal = parseInt(workingHours) || 0;
                const totalHours = 8760; // hours in a year
                const workAngle = (workingHoursVal / totalHours) * 360;

                const createPieSlice = (startAngle: number, endAngle: number, color: string) => {
                  const start = (startAngle - 90) * Math.PI / 180;
                  const end = (endAngle - 90) * Math.PI / 180;
                  const x1 = 100 + 80 * Math.cos(start);
                  const y1 = 100 + 80 * Math.sin(start);
                  const x2 = 100 + 80 * Math.cos(end);
                  const y2 = 100 + 80 * Math.sin(end);
                  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

                  return (
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                };

                return (
                  <>
                    {createPieSlice(0, workAngle, 'url(#workingGradient)')}
                    {createPieSlice(workAngle, 360, 'url(#offGradient)')}
                  </>
                );
              })()}
            </svg>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-green-600"></div>
                <div>
                  <p className="text-sm text-gray-600">Working Hours</p>
                  <p className="text-lg font-bold text-green-600">{workingHours} hrs/year</p>
                  <p className="text-xs text-gray-500">{workingDays} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-400 to-gray-500"></div>
                <div>
                  <p className="text-sm text-gray-600">Time Off</p>
                  <p className="text-lg font-bold text-gray-600">{8760 - parseInt(workingHours)} hrs/year</p>
                  <p className="text-xs text-gray-500">Weekends, vacation, holidays</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Work Schedule Comparison */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Hourly Rate by Work Schedule</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="schedule1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="schedule2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="schedule3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="180" x2="740" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="120" x2="740" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="60" x2="740" y2="60" stroke="#e5e7eb" strokeWidth="1" />

              <line x1="60" y1="20" x2="60" y2="240" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="240" x2="740" y2="240" stroke="#374151" strokeWidth="2" />

              {(() => {
                const schedules = [
                  { label: '40 hrs/week', hours: 2080, color: 'url(#schedule1)' },
                  { label: '37.5 hrs/week', hours: 1950, color: 'url(#schedule2)' },
                  { label: '35 hrs/week', hours: 1820, color: 'url(#schedule3)' }
                ];

                const maxRate = annualSalary / 1820;
                const scale = 200 / maxRate;

                return schedules.map((sched, idx) => {
                  const rate = annualSalary / sched.hours;
                  const height = rate * scale;
                  const y = 240 - height;
                  const x = 150 + idx * 200;

                  return (
                    <g key={idx}>
                      <rect
                        x={x}
                        y={y}
                        width="100"
                        height={height}
                        fill={sched.color}
                        rx="4"
                      />
                      <text x={x + 50} y={y - 10} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                        ${rate.toFixed(2)}/hr
                      </text>
                      <text x={x + 50} y={260} textAnchor="middle" className="text-sm fill-gray-600">
                        {sched.label}
                      </text>
                    </g>
                  );
                });
              })()}

              <text x="55" y="245" textAnchor="end" className="text-xs fill-gray-600">$0</text>
            </svg>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">How It Works</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-green-700">
          <div>
            <h4 className="font-semibold mb-2">Calculation Method:</h4>
            <ul className="space-y-1">
              <li>• Total working days = 365 - weekends - vacations - holidays</li>
              <li>• Total working hours = working days × hours per day</li>
              <li>• Hourly rate = annual salary ÷ total working hours</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Considerations:</h4>
            <ul className="space-y-1">
              <li>• Does not include taxes or deductions</li>
              <li>• Assumes consistent work schedule</li>
              <li>• Standard calculation uses 52 weeks per year</li>
              <li>• Includes paid time off in calculations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="salary-to-hourly-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Salary Comparison Table by Job Types */}
      <section className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Salary to Hourly Rate Comparison by Job Level</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Job Level</th>
                <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Annual Salary Range</th>
                <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Hourly Rate (2,080 hrs)</th>
                <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Hourly Rate (2,000 hrs)</th>
                <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Common Industries</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3 font-semibold text-blue-600">Entry Level</td>
                <td className="border border-gray-300 px-2 py-3">$30,000 - $45,000</td>
                <td className="border border-gray-300 px-2 py-3">$14.42 - $21.63</td>
                <td className="border border-gray-300 px-2 py-3">$15.00 - $22.50</td>
                <td className="border border-gray-300 px-2 py-3">Retail, Food Service, Customer Service</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3 font-semibold text-green-600">Junior Professional</td>
                <td className="border border-gray-300 px-2 py-3">$45,000 - $65,000</td>
                <td className="border border-gray-300 px-2 py-3">$21.63 - $31.25</td>
                <td className="border border-gray-300 px-2 py-3">$22.50 - $32.50</td>
                <td className="border border-gray-300 px-2 py-3">Administrative, Junior Analyst, Teacher</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3 font-semibold text-purple-600">Mid-Level Professional</td>
                <td className="border border-gray-300 px-2 py-3">$65,000 - $95,000</td>
                <td className="border border-gray-300 px-2 py-3">$31.25 - $45.67</td>
                <td className="border border-gray-300 px-2 py-3">$32.50 - $47.50</td>
                <td className="border border-gray-300 px-2 py-3">Marketing, Engineering, Nursing, IT</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3 font-semibold text-orange-600">Senior Professional</td>
                <td className="border border-gray-300 px-2 py-3">$95,000 - $140,000</td>
                <td className="border border-gray-300 px-2 py-3">$45.67 - $67.31</td>
                <td className="border border-gray-300 px-2 py-3">$47.50 - $70.00</td>
                <td className="border border-gray-300 px-2 py-3">Senior Engineer, Manager, Specialist</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-2 py-3 font-semibold text-red-600">Executive Level</td>
                <td className="border border-gray-300 px-2 py-3">$140,000 - $250,000+</td>
                <td className="border border-gray-300 px-2 py-3">$67.31 - $120.19+</td>
                <td className="border border-gray-300 px-2 py-3">$70.00 - $125.00+</td>
                <td className="border border-gray-300 px-2 py-3">Director, VP, C-Suite, Medical Doctor</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2 mt-1">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 9h-2V7h2v2zm0 2h-2v6h2v-6zm-1-7A10 10 0 1 0 12 22 10 10 0 0 0 12 2z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Working Hours Considerations</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>2,080 hours:</strong> Standard calculation (40 hrs/week × 52 weeks) with no vacation</li>
                <li>• <strong>2,000 hours:</strong> More realistic with 2-3 weeks vacation time</li>
                <li>• Salaried employees often work more than 40 hours per week</li>
                <li>• Consider unpaid overtime when calculating true hourly value</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Exempt vs Non-Exempt Employee Analysis */}
      <section className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Exempt vs Non-Exempt Employee Classification</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Exempt Employees */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💼 Exempt Employees (Salaried)</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">FLSA Requirements</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Salary Threshold:</strong> Minimum $684/week ($35,568/year) as of 2024</li>
                  <li>• <strong>Salary Basis:</strong> Paid predetermined amount regardless of hours worked</li>
                  <li>• <strong>Duties Test:</strong> Executive, administrative, or professional duties</li>
                  <li>• <strong>Overtime Exempt:</strong> Not entitled to overtime pay under FLSA</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Typical Job Categories</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• <strong>Executive:</strong> Managers, supervisors, department heads</li>
                  <li>• <strong>Administrative:</strong> HR, accounting, marketing professionals</li>
                  <li>• <strong>Professional:</strong> Engineers, lawyers, doctors, teachers</li>
                  <li>• <strong>Computer:</strong> Software engineers, systems analysts</li>
                  <li>• <strong>Outside Sales:</strong> Sales representatives working off-site</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Salary Considerations</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Fixed weekly salary regardless of hours worked</li>
                  <li>• Cannot be docked for partial day absences (in most cases)</li>
                  <li>• May work 50+ hours per week without additional pay</li>
                  <li>• True hourly value may be much lower than calculated rate</li>
                  <li>• Often receive better benefits packages</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Non-Exempt Employees */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">⏰ Non-Exempt Employees (Hourly)</h3>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-3">FLSA Protections</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• <strong>Overtime Pay:</strong> 1.5x regular rate for hours over 40/week</li>
                  <li>• <strong>Minimum Wage:</strong> Must be paid at least federal/state minimum</li>
                  <li>• <strong>Time Tracking:</strong> Employer must track all hours worked</li>
                  <li>• <strong>Break Requirements:</strong> Subject to state break/meal laws</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-3">Common Job Types</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• <strong>Blue-collar:</strong> Manufacturing, construction, maintenance</li>
                  <li>• <strong>Service:</strong> Retail, food service, customer support</li>
                  <li>• <strong>Clerical:</strong> Data entry, receptionist, filing clerks</li>
                  <li>• <strong>Technical:</strong> Lab technicians, paralegals, bookkeepers</li>
                  <li>• <strong>Healthcare:</strong> Nurses, medical assistants (some exceptions)</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-3">Pay Structure</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Paid by the hour for actual time worked</li>
                  <li>• Eligible for overtime premium pay</li>
                  <li>• May have unpredictable income based on hours</li>
                  <li>• Annual salary calculations are estimates</li>
                  <li>• Often fewer benefits than exempt employees</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">🔍 Classification Compliance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Common Misclassification Risks</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Paying salary below $35,568 annual threshold</li>
                <li>• Classifying non-supervisory roles as exempt</li>
                <li>• Docking exempt employees&apos; pay for partial absences</li>
                <li>• Assuming all professionals are automatically exempt</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Penalties for Misclassification</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Back overtime wages owed to employees</li>
                <li>• Liquidated damages (double damages)</li>
                <li>• Civil penalties up to $2,074 per violation</li>
                <li>• Employee attorney fees if they prevail</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Overtime Eligibility Calculator */}
      <section className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Overtime Eligibility & Impact Calculator</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Calculator Input */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Calculate Overtime Impact</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={overtimeSalary}
                      onChange={(e) => setOvertimeSalary(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Hours/Week</label>
                  <input
                    type="number"
                    value={actualHours}
                    onChange={(e) => setActualHours(parseFloat(e.target.value) || 0)}
                    min="40" max="80"
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="exempt">Exempt (No Overtime)</option>
                    <option value="nonexempt">Non-Exempt (Overtime Eligible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weeks/Year</label>
                  <input
                    type="number"
                    value={weeksPerYear}
                    onChange={(e) => setWeeksPerYear(parseFloat(e.target.value) || 0)}
                    min="48" max="52"
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Analysis Results</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>True Hourly Rate:</span>
                  <span className="font-semibold">{trueHourlyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>If Non-Exempt Annual:</span>
                  <span className="font-semibold">{nonExemptAnnual}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Difference:</span>
                  <span className="font-semibold text-green-600">{annualDifference}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overtime Hours/Week:</span>
                  <span className="font-semibold">{overtimeHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overtime Scenarios */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 Common Overtime Scenarios</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Scenario 1: Manager Working 50 Hours</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>• Exempt Salary: $70,000 ($28/hour for 50 hrs/week)</div>
                  <div>• If Non-Exempt: $70,000 would require $25.38/hour regular rate</div>
                  <div>• Non-Exempt Total: Regular (40×$25.38) + OT (10×$38.07) = $81,840</div>
                  <div className="font-semibold text-blue-900">Cost Difference: $11,840 annually</div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Scenario 2: Professional Working 42 Hours</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <div>• Exempt Salary: $55,000 ($26.19/hour for 42 hrs/week)</div>
                  <div>• If Non-Exempt: $55,000 would require $25.24/hour regular rate</div>
                  <div>• Non-Exempt Total: Regular (40×$25.24) + OT (2×$37.86) = $53,564</div>
                  <div className="font-semibold text-green-900">Cost Difference: -$1,436 annually</div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Scenario 3: Supervisor Working 55 Hours</h4>
                <div className="text-sm text-purple-800 space-y-1">
                  <div>• Exempt Salary: $65,000 ($23.64/hour for 55 hrs/week)</div>
                  <div>• If Non-Exempt: $65,000 would require $20.83/hour regular rate</div>
                  <div>• Non-Exempt Total: Regular (40×$20.83) + OT (15×$31.25) = $102,045</div>
                  <div className="font-semibold text-purple-900">Cost Difference: $37,045 annually</div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-900 mb-2">⚠️ Key Takeaways</h5>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Exempt employees working many hours have lower effective hourly rates</li>
                <li>• The more overtime hours, the greater the cost difference</li>
                <li>• Proper classification is crucial for both legal and financial reasons</li>
                <li>• Misclassification can result in significant back-pay liabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Net vs Gross Salary Breakdown */}
      <section className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Net vs Gross Salary Analysis</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Gross to Net Calculator */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💵 Gross to Net Calculator</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gross Annual Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={grossSalaryInput}
                      onChange={(e) => setGrossSalaryInput(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
                  <select
                    value={netFilingStatus}
                    onChange={(e) => setNetFilingStatus(e.target.value)}
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single">Single</option>
                    <option value="marriedJoint">Married Filing Jointly</option>
                    <option value="marriedSeparate">Married Filing Separately</option>
                    <option value="headOfHousehold">Head of Household</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State Tax Rate</label>
                  <select
                    value={netStateTax}
                    onChange={(e) => setNetStateTax(parseFloat(e.target.value))}
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">No State Tax (0%)</option>
                    <option value="0.03">Low (3%)</option>
                    <option value="0.05">Medium (5%)</option>
                    <option value="0.08">High (8%)</option>
                    <option value="0.13">Very High (13%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">401(k) Contribution (%)</label>
                  <input
                    type="number"
                    value={net401kPercent}
                    onChange={(e) => setNet401kPercent(parseFloat(e.target.value) || 0)}
                    min="0" max="100"
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Health Insurance (Monthly)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={healthInsuranceMonthly}
                      onChange={(e) => setHealthInsuranceMonthly(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Net Salary Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Annual Salary:</span>
                  <span className="font-semibold">{displayGrossSalary}</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>Federal Income Tax:</span>
                  <span>{netFederalTax}</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>State Income Tax:</span>
                  <span>{netStateTaxAmount}</span>
                </div>
                <div className="flex justify-between text-red-700">
                  <span>FICA (SS + Medicare):</span>
                  <span>{netFicaTax}</span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>401(k) Contribution:</span>
                  <span>{net401kContrib}</span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>Health Insurance:</span>
                  <span>{netHealthInsurance}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Net Take-Home:</span>
                    <span className="text-green-600">{netTakeHomeSalary}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Net Hourly Rate (2,000 hrs):</span>
                    <span>{netHourlyRate}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Take-Home Percentage:</span>
                    <span>{takeHomePercentage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deduction Breakdown */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Common Salary Deductions</h3>
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-3">Required Deductions</h4>
                <div className="space-y-2 text-sm text-red-800">
                  <div className="flex justify-between">
                    <span>Federal Income Tax:</span>
                    <span className="font-medium">10-37% (marginal rates)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Social Security:</span>
                    <span className="font-medium">6.2% (up to $160,200)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medicare:</span>
                    <span className="font-medium">1.45% (all income)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Income Tax:</span>
                    <span className="font-medium">0-13% (varies by state)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Disability (SDI):</span>
                    <span className="font-medium">0.1-1.5% (some states)</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Pre-Tax Deductions</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>401(k) Contribution:</span>
                    <span className="font-medium">Up to $23,000 (2024)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health Insurance:</span>
                    <span className="font-medium">$200-800/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HSA Contribution:</span>
                    <span className="font-medium">Up to $4,150 (2024)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FSA (Medical):</span>
                    <span className="font-medium">Up to $3,200 (2024)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commuter Benefits:</span>
                    <span className="font-medium">Up to $315/month</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Post-Tax Deductions</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span>Roth 401(k):</span>
                    <span className="font-medium">After-tax retirement</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Life Insurance:</span>
                    <span className="font-medium">$10-50/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Disability Insurance:</span>
                    <span className="font-medium">$50-200/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Union Dues:</span>
                    <span className="font-medium">$20-100/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parking/Transit:</span>
                    <span className="font-medium">$50-300/month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h5 className="font-semibold text-yellow-900 mb-2">💰 Optimization Tips</h5>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Maximize pre-tax deductions to reduce taxable income</li>
                <li>• Consider Roth vs traditional retirement contributions</li>
                <li>• Use FSA/HSA for medical expenses</li>
                <li>• Take advantage of employer matches</li>
                <li>• Review withholdings annually for accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Salary Negotiation Strategies */}
      <section className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Salary Negotiation Strategies & Benchmarking</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Negotiation Calculator */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Salary Negotiation Calculator</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current/Offered Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={negotiationSalary}
                      onChange={(e) => setNegotiationSalary(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={negotiationExperience}
                    onChange={(e) => setNegotiationExperience(parseFloat(e.target.value) || 0)}
                    min="0" max="40"
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Performance Level</label>
                  <select
                    value={negotiationPerformance}
                    onChange={(e) => setNegotiationPerformance(e.target.value)}
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="excellent">Excellent (Top 10%)</option>
                    <option value="good">Good (Top 25%)</option>
                    <option value="average">Average (50th percentile)</option>
                    <option value="developing">Developing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market Position</label>
                  <select
                    value={marketPosition}
                    onChange={(e) => setMarketPosition(e.target.value)}
                    className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="below">Below Market</option>
                    <option value="market">At Market</option>
                    <option value="above">Above Market</option>
                    <option value="premium">Premium Position</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Recommended Negotiation Targets</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Conservative Target:</span>
                  <span className="font-semibold text-green-600">{conservativeNegotiation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Realistic Target:</span>
                  <span className="font-semibold text-blue-600">{realisticNegotiation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stretch Target:</span>
                  <span className="font-semibold text-purple-600">{stretchNegotiation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hourly Equivalent:</span>
                  <span className="font-semibold">{negotiationHourly}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Negotiation Strategies */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💼 Negotiation Strategies</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Research & Preparation</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Research salary ranges on Glassdoor, PayScale, salary.com</li>
                  <li>• Know your company&apos;s compensation philosophy</li>
                  <li>• Document your achievements and quantify impact</li>
                  <li>• Understand your total compensation package</li>
                  <li>• Practice your negotiation conversation</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Timing Strategies</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• <strong>Best Times:</strong> After performance reviews, completed projects</li>
                  <li>• <strong>Annual Reviews:</strong> Prepare case 3-6 months in advance</li>
                  <li>• <strong>Job Offers:</strong> Negotiate before accepting, not after</li>
                  <li>• <strong>Avoid:</strong> During company layoffs or budget constraints</li>
                  <li>• <strong>Follow Up:</strong> Put agreements in writing</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Beyond Base Salary</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• <strong>Signing Bonus:</strong> One-time payment to join</li>
                  <li>• <strong>Stock Options:</strong> Equity compensation</li>
                  <li>• <strong>Additional PTO:</strong> Extra vacation days</li>
                  <li>• <strong>Flexible Schedule:</strong> Remote work, flexible hours</li>
                  <li>• <strong>Professional Development:</strong> Training, conference budgets</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-3">Common Mistakes to Avoid</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Accepting the first offer without negotiating</li>
                  <li>• Focusing only on salary, ignoring total compensation</li>
                  <li>• Making demands without justification</li>
                  <li>• Comparing to unrealistic or outdated data</li>
                  <li>• Threatening to quit without backup plans</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Salary Benchmarks */}
      <section className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Industry Salary Benchmarks & Trends</h2>

        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Industry Comparison Table */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Salary Ranges by Industry (2024)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Industry</th>
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Entry Level</th>
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Mid-Level</th>
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Senior Level</th>
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Hourly Range</th>
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Growth Outlook</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-3 font-semibold text-blue-600">Technology</td>
                    <td className="border border-gray-300 px-2 py-3">$65K - $85K</td>
                    <td className="border border-gray-300 px-2 py-3">$95K - $140K</td>
                    <td className="border border-gray-300 px-2 py-3">$150K - $250K+</td>
                    <td className="border border-gray-300 px-2 py-3">$31 - $120+</td>
                    <td className="border border-gray-300 px-2 py-3 text-green-600">Excellent</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-3 font-semibold text-green-600">Healthcare</td>
                    <td className="border border-gray-300 px-2 py-3">$45K - $70K</td>
                    <td className="border border-gray-300 px-2 py-3">$70K - $110K</td>
                    <td className="border border-gray-300 px-2 py-3">$120K - $200K+</td>
                    <td className="border border-gray-300 px-2 py-3">$22 - $100+</td>
                    <td className="border border-gray-300 px-2 py-3 text-green-600">Strong</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-3 font-semibold text-purple-600">Finance</td>
                    <td className="border border-gray-300 px-2 py-3">$55K - $75K</td>
                    <td className="border border-gray-300 px-2 py-3">$80K - $120K</td>
                    <td className="border border-gray-300 px-2 py-3">$130K - $300K+</td>
                    <td className="border border-gray-300 px-2 py-3">$26 - $144+</td>
                    <td className="border border-gray-300 px-2 py-3 text-yellow-600">Moderate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-3 font-semibold text-orange-600">Engineering</td>
                    <td className="border border-gray-300 px-2 py-3">$60K - $80K</td>
                    <td className="border border-gray-300 px-2 py-3">$85K - $125K</td>
                    <td className="border border-gray-300 px-2 py-3">$130K - $180K</td>
                    <td className="border border-gray-300 px-2 py-3">$29 - $87</td>
                    <td className="border border-gray-300 px-2 py-3 text-green-600">Good</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-3 font-semibold text-red-600">Education</td>
                    <td className="border border-gray-300 px-2 py-3">$35K - $50K</td>
                    <td className="border border-gray-300 px-2 py-3">$50K - $70K</td>
                    <td className="border border-gray-300 px-2 py-3">$70K - $100K</td>
                    <td className="border border-gray-300 px-2 py-3">$17 - $48</td>
                    <td className="border border-gray-300 px-2 py-3 text-yellow-600">Stable</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-3 font-semibold text-indigo-600">Marketing</td>
                    <td className="border border-gray-300 px-2 py-3">$40K - $55K</td>
                    <td className="border border-gray-300 px-2 py-3">$60K - $85K</td>
                    <td className="border border-gray-300 px-2 py-3">$90K - $130K</td>
                    <td className="border border-gray-300 px-2 py-3">$19 - $63</td>
                    <td className="border border-gray-300 px-2 py-3 text-green-600">Good</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-3 font-semibold text-gray-600">Retail</td>
                    <td className="border border-gray-300 px-2 py-3">$25K - $35K</td>
                    <td className="border border-gray-300 px-2 py-3">$35K - $50K</td>
                    <td className="border border-gray-300 px-2 py-3">$50K - $80K</td>
                    <td className="border border-gray-300 px-2 py-3">$12 - $38</td>
                    <td className="border border-gray-300 px-2 py-3 text-red-600">Declining</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Salary Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📈 Current Salary Trends (2024)</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3">Growing Industries</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>AI/Machine Learning:</strong> 15-25% annual growth</li>
                    <li>• <strong>Cybersecurity:</strong> 12-18% annual growth</li>
                    <li>• <strong>Cloud Computing:</strong> 10-20% annual growth</li>
                    <li>• <strong>Healthcare Tech:</strong> 8-15% annual growth</li>
                    <li>• <strong>Renewable Energy:</strong> 10-15% annual growth</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Remote Work Impact</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Geographic salary arbitrage opportunities</li>
                    <li>• Competition for remote roles driving up salaries</li>
                    <li>• Some companies adjusting pay based on location</li>
                    <li>• Emphasis on performance over hours worked</li>
                    <li>• New roles emerging in remote team management</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Skills in High Demand</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Data analysis and visualization</li>
                    <li>• Digital marketing and automation</li>
                    <li>• Project management and agile methodologies</li>
                    <li>• Cloud platform expertise (AWS, Azure, GCP)</li>
                    <li>• Emotional intelligence and leadership</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔮 Future Outlook & Predictions</h3>
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-3">2024-2026 Predictions</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Continued wage growth in tech and healthcare</li>
                    <li>• Increasing focus on total compensation packages</li>
                    <li>• More companies adopting equity compensation</li>
                    <li>• Skills-based hiring over degree requirements</li>
                    <li>• Greater salary transparency due to new laws</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-3">Economic Factors</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Inflation impact on salary negotiations</li>
                    <li>• Labor shortages in skilled positions</li>
                    <li>• Generational differences in work values</li>
                    <li>• Automation&apos;s impact on various industries</li>
                    <li>• Gig economy and freelance growth</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-3">Declining Opportunities</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Traditional retail and brick-and-mortar</li>
                    <li>• Manual manufacturing roles</li>
                    <li>• Print media and traditional advertising</li>
                    <li>• Routine administrative tasks</li>
                    <li>• Some traditional banking roles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">💡 Career Development Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">Short-term (1-2 years)</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Develop in-demand digital skills</li>
                  <li>• Build professional network</li>
                  <li>• Document achievements quantitatively</li>
                  <li>• Seek feedback and mentorship</li>
                  <li>• Consider lateral moves for growth</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-green-900 mb-2">Medium-term (3-5 years)</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Target leadership opportunities</li>
                  <li>• Obtain relevant certifications</li>
                  <li>• Build expertise in growth areas</li>
                  <li>• Consider industry transitions</li>
                  <li>• Develop specialization + breadth</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-purple-900 mb-2">Long-term (5+ years)</h5>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Build thought leadership</li>
                  <li>• Consider entrepreneurship</li>
                  <li>• Focus on high-impact roles</li>
                  <li>• Develop succession planning</li>
                  <li>• Mentor next generation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do I convert my annual salary to an hourly rate?</h3>
            <p className="text-gray-600 leading-relaxed">
              The basic formula is: Annual Salary ÷ Total Working Hours Per Year. For a standard work schedule, divide your salary by 2,080 hours (40 hours/week × 52 weeks). For example, a $60,000 salary equals $28.85/hour. However, if you have paid vacation or work different hours, adjust accordingly. Our calculator factors in vacation days and holidays for a more accurate result.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What&apos;s the difference between 2,080 and 2,000 working hours?</h3>
            <p className="text-gray-600 leading-relaxed">
              2,080 hours assumes you work 40 hours per week for all 52 weeks with no time off. 2,000 hours is more realistic, accounting for approximately 2 weeks of vacation and holidays. Using 2,000 hours gives you a slightly higher hourly rate that better reflects your actual working time. Some professionals use 1,920 hours (48 weeks × 40 hours) for even more accuracy.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I compare job offers using hourly or annual rates?</h3>
            <p className="text-gray-600 leading-relaxed">
              Compare using your true hourly rate, especially if positions have different expected hours. A $70,000 salary working 45 hours/week equals $29.91/hour, while $65,000 at 40 hours/week equals $31.25/hour. The lower annual salary actually pays more per hour of your time. Also consider benefits, commute time, and work-life balance in your comparison.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What does it mean to be exempt vs. non-exempt?</h3>
            <p className="text-gray-600 leading-relaxed">
              Under the Fair Labor Standards Act (FLSA), exempt employees are salaried workers not entitled to overtime pay, typically earning at least $35,568/year and performing executive, administrative, or professional duties. Non-exempt employees must be paid 1.5x their regular rate for hours over 40/week. Misclassification can result in significant penalties and back-pay obligations for employers.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much of my gross salary will I actually take home?</h3>
            <p className="text-gray-600 leading-relaxed">
              Most employees take home 60-75% of their gross salary after deductions. Federal income tax (10-37%), state tax (0-13%), and FICA (7.65%) are mandatory. Add voluntary deductions like 401(k) contributions, health insurance, and other benefits. A $75,000 salary might result in roughly $50,000-$55,000 take-home pay depending on your tax situation and benefit elections.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">When is the best time to negotiate salary?</h3>
            <p className="text-gray-600 leading-relaxed">
              The best times to negotiate are: when receiving a job offer (before accepting), during annual performance reviews, after completing a major project or achievement, when taking on significantly more responsibility, or when you have a competing offer. Prepare by researching market rates, documenting your accomplishments, and practicing your pitch. Avoid negotiating during company layoffs or budget freezes.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Related Calculators */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Business Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className={`${calc.color || 'bg-gray-500'} text-white rounded-lg p-6 hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-xl font-semibold mb-2">{calc.title}</h3>
              <p className="text-white/90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
