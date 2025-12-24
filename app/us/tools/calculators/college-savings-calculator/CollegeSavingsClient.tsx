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

type CollegeType = 'community' | 'public-instate' | 'public-outstate' | 'private' | 'elite' | 'custom';

const collegeTypes: Record<CollegeType, { cost: number; name: string }> = {
  community: { cost: 3800, name: 'Community College' },
  'public-instate': { cost: 11000, name: 'Public In-State' },
  'public-outstate': { cost: 29000, name: 'Public Out-of-State' },
  private: { cost: 39000, name: 'Private University' },
  elite: { cost: 55000, name: 'Elite Private' },
  custom: { cost: 39000, name: 'Custom' }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a College Savings Calculator?",
    answer: "A College Savings Calculator is a free online tool that helps you calculate and analyze college savings-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this College Savings Calculator?",
    answer: "Our College Savings Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this College Savings Calculator free to use?",
    answer: "Yes, this College Savings Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my College Savings calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to college savings such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function CollegeSavingsClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('college-savings-calculator');

  const [childAge, setChildAge] = useState(5);
  const [collegeAge, setCollegeAge] = useState(18);
  const [collegeType, setCollegeType] = useState<CollegeType>('private');
  const [customCollegeCost, setCustomCollegeCost] = useState(39000);
  const [collegeDuration, setCollegeDuration] = useState(4);
  const [educationInflation, setEducationInflation] = useState(5.0);
  const [coveragePercent, setCoveragePercent] = useState(80);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(300);
  const [annualReturn, setAnnualReturn] = useState(7.0);
  const [contributionIncrease, setContributionIncrease] = useState(3.0);

  const [totalCollegeCost, setTotalCollegeCost] = useState(0);
  const [targetSavingsGoal, setTargetSavingsGoal] = useState(0);
  const [projectedSavings, setProjectedSavings] = useState(0);
  const [savingsGap, setSavingsGap] = useState(0);
  const [monthlyNeeded, setMonthlyNeeded] = useState(0);
  const [yearsToSave, setYearsToSave] = useState(0);
  const [goalPercentage, setGoalPercentage] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);

  // Scenarios
  const [scenario1Value, setScenario1Value] = useState(0);
  const [scenario2Value, setScenario2Value] = useState(0);
  const [scenario3Value, setScenario3Value] = useState(0);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  useEffect(() => {
    calculateCollegeSavings();
  }, [childAge, collegeAge, collegeType, customCollegeCost, collegeDuration, educationInflation,
      coveragePercent, currentSavings, monthlyContribution, annualReturn, contributionIncrease]);

  const calculateCollegeSavings = () => {
    const currentCollegeCost = collegeType === 'custom' ? customCollegeCost : collegeTypes[collegeType].cost;
    const yearsToSaveCalc = Math.max(0, collegeAge - childAge);
    const inflationRate = educationInflation / 100;
    const returnRate = annualReturn / 100;
    const contributionIncreaseRate = contributionIncrease / 100;
    const coverage = coveragePercent / 100;

    setYearsToSave(yearsToSaveCalc);

    // Calculate future college costs
    const collegeStartCost = currentCollegeCost * Math.pow(1 + inflationRate, yearsToSaveCalc);
    let totalCost = 0;

    for (let year = 0; year < collegeDuration; year++) {
      const yearCost = collegeStartCost * Math.pow(1 + inflationRate, year);
      totalCost += yearCost;
    }

    setTotalCollegeCost(totalCost);
    const targetGoal = totalCost * coverage;
    setTargetSavingsGoal(targetGoal);

    // Calculate projected savings with increasing contributions
    let projectedSavingsCalc = currentSavings;
    let currentMonthlyContrib = monthlyContribution;
    let totalContribCalc = currentSavings;

    for (let year = 0; year < yearsToSaveCalc; year++) {
      const yearlyContribution = currentMonthlyContrib * 12;
      totalContribCalc += yearlyContribution;
      projectedSavingsCalc += yearlyContribution;
      projectedSavingsCalc *= (1 + returnRate);
      currentMonthlyContrib *= (1 + contributionIncreaseRate);
    }

    setProjectedSavings(projectedSavingsCalc);
    setTotalContributions(totalContribCalc);

    const gap = projectedSavingsCalc - targetGoal;
    setSavingsGap(gap);

    const goalPct = targetGoal > 0 ? Math.min((projectedSavingsCalc / targetGoal) * 100, 100) : 0;
    setGoalPercentage(goalPct);

    // Calculate monthly needed if starting from scratch
    let monthlyNeededCalc = 0;
    if (yearsToSaveCalc > 0 && targetGoal > currentSavings) {
      const futureValueNeeded = targetGoal - currentSavings * Math.pow(1 + returnRate, yearsToSaveCalc);
      const monthlyRate = returnRate / 12;
      const totalMonths = yearsToSaveCalc * 12;

      if (monthlyRate === 0) {
        monthlyNeededCalc = futureValueNeeded / totalMonths;
      } else {
        monthlyNeededCalc = futureValueNeeded * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      }
    }

    setMonthlyNeeded(monthlyNeededCalc);

    // Calculate scenarios
    calculateScenarios(yearsToSaveCalc, currentCollegeCost, inflationRate, returnRate, targetGoal);
  };

  const calculateScenarios = (years: number, currentCost: number, inflationRate: number, returnRate: number, targetGoal: number) => {
    // Scenario 1: Increase monthly savings by $100
    const additionalMonthly = 100;
    const additionalSavings = additionalMonthly * 12 * years * Math.pow(1 + returnRate, years / 2);
    setScenario1Value(additionalSavings);

    // Scenario 2: Higher inflation (7% vs current)
    const higherInflation = 0.07;
    const collegeStartCostHigh = currentCost * Math.pow(1 + higherInflation, years);
    let totalCollegeCostHigh = 0;
    for (let year = 0; year < collegeDuration; year++) {
      totalCollegeCostHigh += collegeStartCostHigh * Math.pow(1 + higherInflation, year);
    }
    setScenario2Value(totalCollegeCostHigh);

    // Scenario 3: Start saving when child is 10
    const delayedYears = Math.max(0, 10 - childAge);
    const reducedYears = years - delayedYears;
    if (reducedYears > 0) {
      const monthlyRate = returnRate / 12;
      const totalMonths = reducedYears * 12;
      const monthlyNeededDelayed = monthlyRate === 0 ?
        targetGoal / totalMonths :
        targetGoal * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      setScenario3Value(monthlyNeededDelayed);
    } else {
      setScenario3Value(0);
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('College Savings Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">
          Plan your child's college education with 529 plans, savings strategies, and comprehensive cost projections.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Education Planning</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Child's Current Age</label>
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(parseInt(e.target.value) || 0)}
                    min="0"
                    max="17"
                    step="1"
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age to Start College</label>
                  <input
                    type="number"
                    value={collegeAge}
                    onChange={(e) => setCollegeAge(parseInt(e.target.value) || 18)}
                    min="16"
                    max="25"
                    step="1"
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College Type</label>
                <select
                  value={collegeType}
                  onChange={(e) => setCollegeType(e.target.value as CollegeType)}
                  className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="community">Community College ($3,800/year)</option>
                  <option value="public-instate">Public In-State ($11,000/year)</option>
                  <option value="public-outstate">Public Out-of-State ($29,000/year)</option>
                  <option value="private">Private University ($39,000/year)</option>
                  <option value="elite">Elite Private ($55,000/year)</option>
                  <option value="custom">Custom Amount</option>
                </select>
              </div>

              {collegeType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Annual Cost ($)</label>
                  <input
                    type="number"
                    value={customCollegeCost}
                    onChange={(e) => setCustomCollegeCost(parseFloat(e.target.value) || 0)}
                    min="1000"
                    step="1000"
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Duration (Years)</label>
                  <select
                    value={collegeDuration}
                    onChange={(e) => setCollegeDuration(parseInt(e.target.value))}
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2">2 years (Associate)</option>
                    <option value="4">4 years (Bachelor's)</option>
                    <option value="6">6 years (Master's)</option>
                    <option value="8">8 years (Doctorate)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education Inflation (%)</label>
                  <input
                    type="number"
                    value={educationInflation}
                    onChange={(e) => setEducationInflation(parseFloat(e.target.value) || 5.0)}
                    min="2"
                    max="10"
                    step="0.1"
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Percentage of Costs to Cover (%)</label>
                <input
                  type="range"
                  value={coveragePercent}
                  onChange={(e) => setCoveragePercent(parseInt(e.target.value))}
                  min="25"
                  max="100"
                  step="5"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>25%</span>
                  <span>{coveragePercent}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings ($)</label>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="500"
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution ($)</label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="25"
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                  <input
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(parseFloat(e.target.value) || 7.0)}
                    min="3"
                    max="12"
                    step="0.1"
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Contribution Increase (%)</label>
                  <input
                    type="number"
                    value={contributionIncrease}
                    onChange={(e) => setContributionIncrease(parseFloat(e.target.value) || 3.0)}
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Savings Analysis</h2>
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-700">Target Savings Goal</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">${Math.round(targetSavingsGoal).toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Total College Cost</div>
                  <div className="text-lg font-bold text-blue-600">${Math.round(totalCollegeCost).toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Projected Savings</div>
                  <div className="text-lg font-bold text-purple-600">${Math.round(projectedSavings).toLocaleString()}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Savings Gap/Surplus</div>
                  <div className={`text-lg font-bold ${savingsGap >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {savingsGap >= 0 ? '+' : ''}${Math.round(savingsGap).toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-xs text-gray-600">Monthly Needed</div>
                  <div className="text-lg font-bold">${Math.round(monthlyNeeded).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What-If Scenarios and Progress Tracking */}
        <div className="mt-6">
          <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 College Savings Tips</h3>
            <p className="text-xs text-blue-800">Start saving early to maximize compound growth. Consider 529 plans for tax-free growth on education expenses. Diversify with age-based portfolios that become more conservative as college approaches. Don't forget to factor in room, board, and other expenses beyond tuition.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">What-If Scenarios</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">If you increase monthly savings by $100</div>
                  <div className="text-2xl font-bold text-green-600">+${Math.round(scenario1Value).toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Additional savings at college start</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">If college costs rise 7% annually</div>
                  <div className="text-2xl font-bold text-red-600">${Math.round(scenario2Value).toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Total college cost with higher inflation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">Starting savings when child is 10</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {scenario3Value > 0 ? `$${Math.round(scenario3Value).toLocaleString()}` : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Monthly payment needed if delayed</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Progress Tracking</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">Years to College</div>
                  <div className="text-2xl font-bold text-blue-600">{yearsToSave} years</div>
                  <p className="text-xs text-gray-500 mt-1">Time remaining to save</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">Goal Achievement</div>
                  <div className="text-2xl font-bold text-purple-600">{goalPercentage.toFixed(1)}%</div>
                  <p className="text-xs text-gray-500 mt-1">Of target goal with current plan</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600">Total Contributions</div>
                  <div className="text-2xl font-bold text-green-600">${Math.round(totalContributions).toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Your total investment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* College Fund Growth Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">College Fund Growth Projection</h2>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 800 300" className="w-full h-auto">
            {/* Gradients */}
            <defs>
              <linearGradient id="collegeContributionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="collegeSavingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 20 + 240 - ratio * 240;
              const maxValue = Math.max(targetSavingsGoal, projectedSavings) * 1.1;
              return (
                <g key={ratio}>
                  <line
                    x1={70}
                    y1={y}
                    x2={770}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x={60}
                    y={y + 5}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    ${Math.round(maxValue * ratio / 1000)}K
                  </text>
                </g>
              );
            })}

            {/* Goal line */}
            {targetSavingsGoal > 0 && (
              <>
                <line
                  x1={70}
                  y1={20 + 240 - (targetSavingsGoal / (Math.max(targetSavingsGoal, projectedSavings) * 1.1)) * 240}
                  x2={770}
                  y2={20 + 240 - (targetSavingsGoal / (Math.max(targetSavingsGoal, projectedSavings) * 1.1)) * 240}
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text
                  x={760}
                  y={20 + 240 - (targetSavingsGoal / (Math.max(targetSavingsGoal, projectedSavings) * 1.1)) * 240 - 5}
                  textAnchor="end"
                  fontSize="12"
                  fill="#f97316"
                  fontWeight="bold"
                >
                  Goal: ${Math.round(targetSavingsGoal / 1000)}K
                </text>
              </>
            )}

            {/* X-axis */}
            {yearsToSave > 0 && Array.from({ length: Math.min(yearsToSave + 1, 11) }).map((_, i) => {
              const yearStep = Math.ceil(yearsToSave / 10);
              const year = i * yearStep;
              if (year <= yearsToSave) {
                return (
                  <text
                    key={i}
                    x={70 + (year / yearsToSave) * 700}
                    y={280}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    Yr {year}
                  </text>
                );
              }
              return null;
            })}

            {/* Savings growth area */}
            {yearsToSave > 0 && (
              <path
                d={`M 70 260 ${Array.from({ length: yearsToSave }).map((_, i) => {
                  const x = 70 + ((i + 1) / yearsToSave) * 700;
                  const yearProgress = (currentSavings * Math.pow(1 + annualReturn / 100, i + 1)) + (monthlyContribution * 12 * (i + 1) * Math.pow(1 + annualReturn / 100, (i + 1) / 2));
                  const y = 20 + 240 - (yearProgress / (Math.max(targetSavingsGoal, projectedSavings) * 1.1)) * 240;
                  return `L ${x} ${y}`;
                }).join(' ')} L 770 260 Z`}
                fill="url(#collegeSavingsGradient)"
                opacity="0.8"
              />
            )}

            {/* Savings line */}
            {yearsToSave > 0 && (
              <path
                d={`M 70 ${20 + 240 - (currentSavings / (Math.max(targetSavingsGoal, projectedSavings) * 1.1)) * 240} ${Array.from({ length: yearsToSave }).map((_, i) => {
                  const x = 70 + ((i + 1) / yearsToSave) * 700;
                  const yearProgress = (currentSavings * Math.pow(1 + annualReturn / 100, i + 1)) + (monthlyContribution * 12 * (i + 1) * Math.pow(1 + annualReturn / 100, (i + 1) / 2));
                  const y = 20 + 240 - (yearProgress / (Math.max(targetSavingsGoal, projectedSavings) * 1.1)) * 240;
                  return `L ${x} ${y}`;
                }).join(' ')}`}
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
              />
            )}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Projected Savings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded" style={{ borderRadius: '2px', borderStyle: 'dashed', border: '2px dashed #f97316', backgroundColor: 'transparent' }}></div>
              <span className="text-sm text-gray-600">Savings Goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contributions vs Returns Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Contribution vs Investment Returns</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-center">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto">
              <circle cx="100" cy="100" r="80" fill="#3b82f6" />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="160"
                strokeDasharray={`${projectedSavings > 0 ? ((projectedSavings - totalContributions) / projectedSavings) * 100 * 5.027 : 0} 502.7`}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="white" />
              <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4b5563">
                ${Math.round(projectedSavings / 1000)}K
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                Projected
              </text>
            </svg>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Your Contributions</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">${Math.round(totalContributions).toLocaleString()}</div>
                <div className="text-xs text-gray-500">{projectedSavings > 0 ? ((totalContributions / projectedSavings) * 100).toFixed(1) : 0}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Investment Returns</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">${Math.round(projectedSavings - totalContributions).toLocaleString()}</div>
                <div className="text-xs text-gray-500">{projectedSavings > 0 ? (((projectedSavings - totalContributions) / projectedSavings) * 100).toFixed(1) : 0}%</div>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Goal Achievement</div>
              <div className="text-2xl font-bold text-purple-700">{goalPercentage.toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">
                {savingsGap >= 0 ? `Surplus: $${Math.round(savingsGap).toLocaleString()}` : `Gap: $${Math.round(Math.abs(savingsGap)).toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Projection Table */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year College Fund Projection</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 text-gray-700">Year</th>
                <th className="text-left py-3 px-2 text-gray-700">Child Age</th>
                <th className="text-right py-3 px-2 text-gray-700">Annual Contribution</th>
                <th className="text-right py-3 px-2 text-gray-700">Total Contributed</th>
                <th className="text-right py-3 px-2 text-gray-700">Investment Growth</th>
                <th className="text-right py-3 px-2 text-gray-700">Fund Balance</th>
              </tr>
            </thead>
            <tbody>
              {yearsToSave > 0 && Array.from({ length: Math.min(yearsToSave, 20) }).map((_, i) => {
                const year = i + 1;
                const age = childAge + year;
                const annualContrib = monthlyContribution * 12 * Math.pow(1 + contributionIncrease / 100, i);
                const totalContrib = currentSavings + (monthlyContribution * 12 * year * Math.pow(1 + contributionIncrease / 100, year / 2));
                const balance = currentSavings * Math.pow(1 + annualReturn / 100, year) + (monthlyContribution * 12 * year * Math.pow(1 + annualReturn / 100, year / 2));
                const growth = balance - totalContrib;

                return (
                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{year}</td>
                    <td className="py-3 px-2">{age}</td>
                    <td className="py-3 px-2 text-right text-blue-600">${Math.round(annualContrib).toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">${Math.round(totalContrib).toLocaleString()}</td>
                    <td className="py-3 px-2 text-right text-green-600">${Math.round(growth).toLocaleString()}</td>
                    <td className="py-3 px-2 text-right font-semibold text-purple-600">${Math.round(balance).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Educational Content */}
      <section className="prose max-w-none mt-12">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">College Savings Formula</h3>
            <p className="text-blue-800 mb-4">
              Calculate future education costs and required savings:
            </p>
            <div className="bg-white rounded-lg p-4">
              <p className="font-mono text-sm mb-2">Future Cost = Current Cost × (1 + Inflation Rate)^Years</p>
              <p className="font-mono text-sm mb-2">Savings Growth = Principal × (1 + Return Rate)^Years + Monthly Contributions</p>
              <p className="text-sm text-gray-600 mt-2">Where:</p>
              <ul className="text-sm text-gray-600 list-none mt-2 space-y-1">
                <li>Current Cost = Today's annual college expenses</li>
                <li>Inflation Rate = Annual education cost increases (typically 5-6%)</li>
                <li>Return Rate = Expected investment returns (529 plans average 6-8%)</li>
                <li>Years = Time until college enrollment</li>
              </ul>
            </div>
</div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">529 Education Savings Plans</h2>
          <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 md:mb-6">
            529 plans are tax-advantaged savings plans designed for education expenses. They offer significant benefits
            for college savings including tax-free growth and withdrawals for qualified education expenses.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Tax Benefits</h4>
              <p className="text-blue-800">Tax-free growth and withdrawals for qualified education expenses</p>
            </div>

            <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-3">State Benefits</h4>
              <p className="text-green-800">Many states offer tax deductions or credits for contributions</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-3">High Limits</h4>
              <p className="text-purple-800">Contribution limits exceed $300,000 in most states</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">College Cost Breakdown (2024)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Public Colleges</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <strong>Community College:</strong> ~$3,800/year tuition</li>
                <li>• <strong>In-State Public:</strong> ~$11,000/year tuition</li>
                <li>• <strong>Out-of-State Public:</strong> ~$29,000/year tuition</li>
                <li>• <strong>Room & Board:</strong> ~$12,000/year additional</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Private Colleges</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• <strong>Private University:</strong> ~$39,000/year tuition</li>
                <li>• <strong>Elite Private:</strong> ~$55,000/year tuition</li>
                <li>• <strong>Room & Board:</strong> ~$15,000/year additional</li>
                <li>• <strong>Books & Supplies:</strong> ~$1,200/year</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Saving Strategies</h2>
          <ul className="list-disc pl-6 mb-4 sm:mb-6 md:mb-8 text-gray-700">
            <li><strong>Start Early:</strong> Time is your greatest asset for compound growth</li>
            <li><strong>Automate Savings:</strong> Set up automatic monthly transfers to stay consistent</li>
            <li><strong>Use Age-Based Portfolios:</strong> Gradually shift from growth to conservative investments</li>
            <li><strong>Maximize Gift Contributions:</strong> Ask family to contribute for birthdays and holidays</li>
            <li><strong>Consider Multiple Children:</strong> Plan for potential siblings&apos; education costs</li>
            <li><strong>Don&apos;t Sacrifice Retirement:</strong> Balance college savings with retirement planning</li>
          </ul>
        </div>
      </section>

      {/* Related Financial Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Financial Calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg border hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is a 529 plan and why should I use it?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              A 529 plan is a tax-advantaged investment account specifically designed for education expenses. Your contributions
              grow tax-free, and withdrawals are also tax-free when used for qualified education expenses including tuition, room
              and board, books, and even K-12 private school tuition (up to $10,000/year). Many states also offer tax deductions
              or credits for contributions. It&apos;s one of the most powerful ways to save for education.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much should I save for college each month?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              This depends on your target, time horizon, and expected returns. A good rule of thumb: to cover full costs at a
              public university, save about $350/month from birth. For private schools, aim for $700+/month. If starting later,
              you&apos;ll need to save more. Remember: you don&apos;t have to save 100% of costs—financial aid, scholarships, and
              student contributions can fill gaps. Focus on saving what you can consistently afford.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What if my child doesn&apos;t go to college?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              529 funds are flexible. You can change the beneficiary to another family member (siblings, cousins, yourself)
              without penalty. As of 2024, you can also roll up to $35,000 of unused 529 funds into a Roth IRA for the beneficiary
              (after 15 years of account age). If you withdraw for non-education purposes, you&apos;ll pay taxes plus a 10% penalty
              on the earnings only—contributions come out tax and penalty-free.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Does a 529 plan affect financial aid eligibility?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Parent-owned 529 plans have minimal impact on financial aid. They&apos;re counted as parental assets, which are assessed
              at only 5.64% in federal aid calculations. A $50,000 529 would only reduce aid by about $2,800 total. Grandparent-owned
              529s no longer count as income on the FAFSA as of 2024, making them an excellent gifting option without hurting aid
              eligibility.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Should I save for college or pay off debt first?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Generally, prioritize: 1) High-interest debt (credit cards), 2) Employer 401(k) match, 3) Emergency fund, 4) Then
              college savings. Student loans are available; retirement loans aren&apos;t. If you have low-interest debt (mortgage,
              student loans under 5%), you can contribute to college savings simultaneously. Don&apos;t sacrifice your financial
              security for your child&apos;s education—they have more time to recover from student loans than you have for retirement.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="college-savings-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
