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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type IncomeModeType = 'percentage' | 'fixed';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Retirement Calculator?",
    answer: "A Retirement Calculator is a free online tool that helps you calculate and analyze retirement-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Retirement Calculator?",
    answer: "Our Retirement Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Retirement Calculator free to use?",
    answer: "Yes, this Retirement Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Retirement calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to retirement such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function RetirementClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('retirement-calculator');

  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [currentIncome, setCurrentIncome] = useState(60000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [returnRate, setReturnRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);
  const [contributionIncrease, setContributionIncrease] = useState(3);
  const [employerMatch, setEmployerMatch] = useState(3);
  const [matchLimit, setMatchLimit] = useState(6);
  const [incomeMode, setIncomeMode] = useState<IncomeModeType>('percentage');
  const [incomeNeededPercent, setIncomeNeededPercent] = useState(70);
  const [incomeNeededFixed, setIncomeNeededFixed] = useState(42000);

  const [totalAtRetirement, setTotalAtRetirement] = useState(0);
  const [totalPersonalContributions, setTotalPersonalContributions] = useState(0);
  const [totalEmployerMatch, setTotalEmployerMatch] = useState(0);
  const [totalGrowth, setTotalGrowth] = useState(0);
  const [monthlyRetirementIncome, setMonthlyRetirementIncome] = useState(0);
  const [replacementRatio, setReplacementRatio] = useState(0);
  const [yearsToRetirement, setYearsToRetirement] = useState(0);

  useEffect(() => {
    calculateRetirement();
  }, [currentAge, retirementAge, currentSavings, currentIncome, monthlyContribution,
      returnRate, inflationRate, contributionIncrease, employerMatch, matchLimit,
      incomeMode, incomeNeededPercent, incomeNeededFixed, lifeExpectancy]);

  const calculateRetirement = () => {
    if (currentAge >= retirementAge) {
      return;
    }

    const years = retirementAge - currentAge;
    setYearsToRetirement(years);

    const monthlyReturn = returnRate / 100 / 12;
    const totalMonths = years * 12;

    // Calculate employer match
    const monthlyEmployerMatchAmount = Math.min(
      (monthlyContribution * (employerMatch / 100)),
      (currentIncome / 12) * (matchLimit / 100) * (employerMatch / 100)
    );

    const totalMonthlyContribution = monthlyContribution + monthlyEmployerMatchAmount;

    // Future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + monthlyReturn, totalMonths);

    // Future value of contributions
    const futureValueContributions = totalMonthlyContribution *
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);

    const total = futureValueCurrentSavings + futureValueContributions;
    setTotalAtRetirement(total);

    const personalContribs = (monthlyContribution * totalMonths) + currentSavings;
    const employerMatchTotal = monthlyEmployerMatchAmount * totalMonths;
    const growth = total - personalContribs - employerMatchTotal;

    setTotalPersonalContributions(personalContribs);
    setTotalEmployerMatch(employerMatchTotal);
    setTotalGrowth(growth);

    // Calculate retirement income using 4% withdrawal rule
    const monthlyIncome = (total * 0.04) / 12;
    setMonthlyRetirementIncome(monthlyIncome);

    // Calculate replacement ratio
    const currentMonthlyIncome = currentIncome / 12;
    const ratio = currentMonthlyIncome > 0 ? (monthlyIncome / currentMonthlyIncome) * 100 : 0;
    setReplacementRatio(ratio);
  };

  const formatCurrency = (amount: number): string => {
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const getAssessment = () => {
    if (replacementRatio >= 80) {
      return {
        title: '🎉 Excellent!',
        content: ` ${Math.round(replacementRatio)}% replacement - on track for comfortable retirement.`,
        color: 'blue'
      };
    } else if (replacementRatio >= 70) {
      return {
        title: '👍 Good:',
        content: ` ${Math.round(replacementRatio)}% replacement - consider increasing to 80%.`,
        color: 'blue'
      };
    } else if (replacementRatio >= 50) {
      return {
        title: '⚠️ Needs Work:',
        content: ` ${Math.round(replacementRatio)}% replacement - increase contributions.`,
        color: 'orange'
      };
    } else {
      return {
        title: '🚨 Action Needed:',
        content: ` Only ${Math.round(replacementRatio)}% - significant changes required.`,
        color: 'red'
      };
    }
  };

  const calculateWhatIf = () => {
    const monthlyReturn = returnRate / 100 / 12;
    const totalMonths = yearsToRetirement * 12;

    // Extra $200/month
    const extraContribution = 200;
    const futureValueExtra = extraContribution *
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);

    // +1% higher return
    const higherReturn = (returnRate + 1) / 100 / 12;
    const monthlyEmployerMatchAmount = Math.min(
      (monthlyContribution * (employerMatch / 100)),
      (currentIncome / 12) * (matchLimit / 100) * (employerMatch / 100)
    );
    const totalMonthlyContribution = monthlyContribution + monthlyEmployerMatchAmount;

    const futureValueHigherReturn =
      currentSavings * Math.pow(1 + higherReturn, totalMonths) +
      totalMonthlyContribution * ((Math.pow(1 + higherReturn, totalMonths) - 1) / higherReturn);
    const returnDifference = futureValueHigherReturn - totalAtRetirement;

    // +5 more years
    const extraYearsMonths = (retirementAge + 5 - currentAge) * 12;
    const futureValueExtraYears =
      currentSavings * Math.pow(1 + monthlyReturn, extraYearsMonths) +
      totalMonthlyContribution * ((Math.pow(1 + monthlyReturn, extraYearsMonths) - 1) / monthlyReturn);
    const yearsDifference = futureValueExtraYears - totalAtRetirement;

    return {
      extraContribution: futureValueExtra,
      extraReturn: returnDifference,
      moreTime: yearsDifference
    };
  };

  const whatIf = calculateWhatIf();
  const assessment = getAssessment();

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Retirement Calculator')}</h1>
        <p className="text-lg text-gray-600">Plan your retirement with our comprehensive savings calculator and secure your financial future</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Retirement Planning Details</h2>

            {/* Current Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                min="18"
                max="75"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Retirement Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(parseInt(e.target.value) || 0)}
                min="50"
                max="80"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Current Savings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1000"
                  placeholder="50000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Current Annual Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Annual Income</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={currentIncome}
                  onChange={(e) => setCurrentIncome(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1000"
                  placeholder="60000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Income Needed in Retirement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Income Needed in Retirement</label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setIncomeMode('percentage')}
                  className={`flex-1 px-3 py-2 border-2 rounded-lg font-medium ${
                    incomeMode === 'percentage'
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setIncomeMode('fixed')}
                  className={`flex-1 px-3 py-2 border-2 rounded-lg font-medium ${
                    incomeMode === 'fixed'
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  Fixed Amount ($)
                </button>
              </div>
              {incomeMode === 'percentage' ? (
                <div>
                  <input
                    type="number"
                    value={incomeNeededPercent}
                    onChange={(e) => setIncomeNeededPercent(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="150"
                    step="5"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Common: 60% (minimal), 70% (comfortable), 80% (similar lifestyle), 100% (same lifestyle)</p>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      value={incomeNeededFixed}
                      onChange={(e) => setIncomeNeededFixed(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="1000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Annual income needed in retirement</p>
                </div>
              )}
            </div>

            {/* Life Expectancy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Life Expectancy</label>
              <input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 0)}
                min="65"
                max="100"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Monthly Contribution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="25"
                  placeholder="500"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Investment Assumptions</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Expected Annual Return (%)</label>
                  <input
                    type="number"
                    value={returnRate}
                    onChange={(e) => setReturnRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="15"
                    step="0.1"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-blue-600 mt-1">Historical average: 7-10%</p>
                </div>
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Expected Inflation Rate (%)</label>
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Annual Contribution Increase (%)</label>
                  <input
                    type="number"
                    value={contributionIncrease}
                    onChange={(e) => setContributionIncrease(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="20"
                    step="0.1"
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Employer Match */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Employer 401(k) Match</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-green-700 mb-1">Match (%)</label>
                  <input
                    type="number"
                    value={employerMatch}
                    onChange={(e) => setEmployerMatch(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-green-700 mb-1">Limit (% salary)</label>
                  <input
                    type="number"
                    value={matchLimit}
                    onChange={(e) => setMatchLimit(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="20"
                    step="0.1"
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Retirement Analysis</h2>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 text-center border border-green-200">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{formatCurrency(totalAtRetirement)}</div>
              <div className="text-gray-700">Total at Retirement</div>
              <div className="text-sm text-gray-600 mt-1">{yearsToRetirement} years to go</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xs text-gray-600">Contributions</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(totalPersonalContributions)}</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xs text-gray-600">Growth</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(totalGrowth)}</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-xs text-gray-600">Match</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(totalEmployerMatch)}</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 text-center border border-purple-200">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">{formatCurrency(monthlyRetirementIncome)}</div>
              <div className="text-gray-700">Monthly Retirement Income</div>
              <div className="text-sm text-gray-600 mt-1">Using 4% withdrawal rule</div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Replacement Ratio:</span>
                  <span className="font-semibold">{Math.round(replacementRatio)}%</span>
                </div>
              </div>
            </div>

            <div className={`p-3 bg-${assessment.color}-50 rounded-lg border border-${assessment.color}-200`}>
              <div className="text-sm">
                <strong>{assessment.title}</strong>
                <span>{assessment.content}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Calculation Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Calculation Breakdown</h3>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="border rounded-lg p-3 sm:p-4 md:p-6">
            <h4 className="text-lg font-semibold text-blue-600 mb-4 text-center">Future Value Formulas</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-blue-50 rounded p-3">
                <h5 className="font-semibold text-blue-800 mb-1">Current Savings:</h5>
                <p className="text-blue-700 font-mono text-xs">FV = PV × (1 + r)^t</p>
              </div>
              <div className="bg-green-50 rounded p-3">
                <h5 className="font-semibold text-green-800 mb-1">Monthly Contributions:</h5>
                <p className="text-green-700 font-mono text-xs">FV = PMT × ((1 + r)^t - 1) / r</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Savings:</span>
                  <span className="font-medium">{formatCurrency(currentSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Contribution:</span>
                  <span className="font-medium">{formatCurrency(monthlyContribution)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rate:</span>
                  <span className="font-medium">{((returnRate / 12)).toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Months to Retirement:</span>
                  <span className="font-medium">{yearsToRetirement * 12}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-3 sm:p-4 md:p-6">
            <h4 className="text-lg font-semibold text-green-600 mb-4 text-center">Retirement Income Analysis</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-purple-50 rounded p-3">
                <h5 className="font-semibold text-purple-800 mb-1">4% Withdrawal Rule:</h5>
                <p className="text-purple-700 text-xs">Monthly = (Total × 0.04) / 12</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total at Retirement:</span>
                  <span className="font-medium">{formatCurrency(totalAtRetirement)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Withdrawal:</span>
                  <span className="font-medium">{formatCurrency(totalAtRetirement * 0.04)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Income:</span>
                  <span className="font-medium">{formatCurrency(monthlyRetirementIncome)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Replacement Rate:</span>
                  <span className="font-semibold text-green-600">{Math.round(replacementRatio)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">"What If" Scenarios</h3>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="text-center p-3 sm:p-4 md:p-6 bg-indigo-50 rounded-lg border border-indigo-200">
            <h4 className="font-medium text-indigo-800 mb-2">+$200/month</h4>
            <div className="text-2xl font-bold text-indigo-600">{formatCurrency(whatIf.extraContribution)}</div>
            <div className="text-sm text-indigo-700 mt-1">Additional at retirement</div>
          </div>

          <div className="text-center p-3 sm:p-4 md:p-6 bg-teal-50 rounded-lg border border-teal-200">
            <h4 className="font-medium text-teal-800 mb-2">+1% Return</h4>
            <div className="text-2xl font-bold text-teal-600">{formatCurrency(whatIf.extraReturn)}</div>
            <div className="text-sm text-teal-700 mt-1">With higher returns</div>
          </div>

          <div className="text-center p-3 sm:p-4 md:p-6 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-2">+5 More Years</h4>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(whatIf.moreTime)}</div>
            <div className="text-sm text-orange-700 mt-1">Working 5 years longer</div>
          </div>
        </div>
      </div>
<div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="retirement-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
