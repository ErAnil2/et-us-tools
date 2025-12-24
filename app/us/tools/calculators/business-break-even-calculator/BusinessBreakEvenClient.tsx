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
    question: "What is a Business Break Even Calculator?",
    answer: "A Business Break Even Calculator is a free online tool designed to help you quickly and accurately calculate business break even-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Business Break Even Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Business Break Even Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Business Break Even Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function BusinessBreakEvenClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('business-break-even-calculator');

  const [sellingPrice, setSellingPrice] = useState(25.00);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(15.00);
  const [rent, setRent] = useState(2000);
  const [salaries, setSalaries] = useState(8000);
  const [utilities, setUtilities] = useState(500);
  const [insurance, setInsurance] = useState(300);
  const [marketing, setMarketing] = useState(1000);
  const [otherFixed, setOtherFixed] = useState(700);
  const [analysisPeriod, setAnalysisPeriod] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [targetProfit, setTargetProfit] = useState(5000);
  const [targetMargin, setTargetMargin] = useState(20);

  const [breakEvenUnits, setBreakEvenUnits] = useState(0);
  const [breakEvenRevenue, setBreakEvenRevenue] = useState(0);
  const [contributionMargin, setContributionMargin] = useState(0);
  const [contributionMarginPercent, setContributionMarginPercent] = useState(0);
  const [totalFixedCosts, setTotalFixedCosts] = useState(0);
  const [unitsForTargetProfit, setUnitsForTargetProfit] = useState(0);
  const [revenueForTargetProfit, setRevenueForTargetProfit] = useState(0);

  useEffect(() => {
    calculateBreakEven();
  }, [sellingPrice, variableCostPerUnit, rent, salaries, utilities, insurance, marketing, otherFixed, analysisPeriod, targetProfit, targetMargin]);

  const calculateBreakEven = () => {
    // Period multiplier
    const periodMultiplier = analysisPeriod === 'monthly' ? 1 : analysisPeriod === 'quarterly' ? 3 : 12;

    // Calculate total fixed costs for the period
    const fixedCosts = (rent + salaries + utilities + insurance + marketing + otherFixed) * periodMultiplier;

    // Calculate contribution margin
    const contributionMarginPerUnit = sellingPrice - variableCostPerUnit;
    const contributionMarginPct = (contributionMarginPerUnit / sellingPrice) * 100;

    if (contributionMarginPerUnit <= 0) {
      // Invalid - selling price must be greater than variable cost
      setBreakEvenUnits(0);
      setBreakEvenRevenue(0);
      setContributionMargin(0);
      setContributionMarginPercent(0);
      setTotalFixedCosts(fixedCosts);
      return;
    }

    // Calculate break-even point
    const breakEvenUnitsCalc = Math.ceil(fixedCosts / contributionMarginPerUnit);
    const breakEvenRevenueCalc = breakEvenUnitsCalc * sellingPrice;

    setBreakEvenUnits(breakEvenUnitsCalc);
    setBreakEvenRevenue(breakEvenRevenueCalc);
    setContributionMargin(contributionMarginPerUnit);
    setContributionMarginPercent(contributionMarginPct);
    setTotalFixedCosts(fixedCosts);

    // Calculate profit target scenario
    if (targetProfit > 0) {
      const unitsForProfit = Math.ceil((fixedCosts + targetProfit) / contributionMarginPerUnit);
      const revenueForProfit = unitsForProfit * sellingPrice;
      setUnitsForTargetProfit(unitsForProfit);
      setRevenueForTargetProfit(revenueForProfit);
    }
  };

  const getPeriodLabel = () => {
    switch(analysisPeriod) {
      case 'monthly': return 'month';
      case 'quarterly': return 'quarter';
      case 'annually': return 'year';
      default: return 'period';
    }
  };

  const getScenarios = () => {
    const periodMultiplier = analysisPeriod === 'monthly' ? 1 : analysisPeriod === 'quarterly' ? 3 : 12;
    const fixedCosts = (rent + salaries + utilities + insurance + marketing + otherFixed) * periodMultiplier;

    const priceIncrease = sellingPrice * 1.1;
    const priceDecrease = sellingPrice * 0.9;
    const costReduction = variableCostPerUnit * 0.9;

    return [
      {
        title: 'Price +10%',
        color: 'green',
        breakEven: Math.ceil(fixedCosts / (priceIncrease - variableCostPerUnit)),
        description: 'Increase selling price by 10%'
      },
      {
        title: 'Price -10%',
        color: 'red',
        breakEven: Math.ceil(fixedCosts / (priceDecrease - variableCostPerUnit)),
        description: 'Decrease selling price by 10%'
      },
      {
        title: 'Cost -10%',
        color: 'blue',
        breakEven: Math.ceil(fixedCosts / (sellingPrice - costReduction)),
        description: 'Reduce variable costs by 10%'
      }
    ];
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Business Break-Even Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Analyze your business break-even point, understand cost structures, and plan for profitability with comprehensive financial analysis and scenario planning.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Business Financial Information</h2>

            {/* Product/Service Information */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Product/Service Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price per Unit ($)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variable Cost per Unit ($)</label>
                  <input
                    type="number"
                    value={variableCostPerUnit}
                    onChange={(e) => setVariableCostPerUnit(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15.00"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Costs */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Fixed Costs (Monthly)</h3>
              <div className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rent/Lease ($)</label>
                    <input
                      type="number"
                      value={rent}
                      onChange={(e) => setRent(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salaries & Benefits ($)</label>
                    <input
                      type="number"
                      value={salaries}
                      onChange={(e) => setSalaries(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="8000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Utilities ($)</label>
                    <input
                      type="number"
                      value={utilities}
                      onChange={(e) => setUtilities(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance ($)</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="300"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marketing & Advertising ($)</label>
                    <input
                      type="number"
                      value={marketing}
                      onChange={(e) => setMarketing(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other Fixed Costs ($)</label>
                    <input
                      type="number"
                      value={otherFixed}
                      onChange={(e) => setOtherFixed(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="700"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Period */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Period</label>
              <select
                value={analysisPeriod}
                onChange={(e) => setAnalysisPeriod(e.target.value as 'monthly' | 'quarterly' | 'annually')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly (3 months)</option>
                <option value="annually">Annually (12 months)</option>
              </select>
            </div>

            {/* Profit Target */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Profit Goals (Optional)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Profit ($)</label>
                  <input
                    type="number"
                    value={targetProfit}
                    onChange={(e) => setTargetProfit(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Profit Margin (%)</label>
                  <input
                    type="number"
                    value={targetMargin}
                    onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Break-Even Analysis Results</h3>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-sm text-blue-600 mb-1">Break-Even Point</div>
                <div className="text-2xl font-bold text-blue-800">{breakEvenUnits.toLocaleString()}</div>
                <div className="text-xs text-blue-600">units per {getPeriodLabel()}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-sm text-green-600 mb-1">Break-Even Revenue</div>
                <div className="text-2xl font-bold text-green-800">${Math.round(breakEvenRevenue).toLocaleString()}</div>
                <div className="text-xs text-green-600">per {getPeriodLabel()}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="text-sm text-purple-600 mb-1">Contribution Margin</div>
                <div className="text-2xl font-bold text-purple-800">${contributionMargin.toFixed(2)}</div>
                <div className="text-xs text-purple-600">per unit</div>
              </div>
            </div>

            {/* Cost Structure Analysis */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Cost Structure Analysis</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Total Fixed Costs:</span>
                    <span className="font-bold">${Math.round(totalFixedCosts).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Variable Cost per Unit:</span>
                    <span className="font-bold">${variableCostPerUnit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-blue-50 rounded border-l-4 border-blue-300">
                    <span className="font-medium text-blue-800">Contribution Margin %:</span>
                    <span className="font-bold text-blue-800">{contributionMarginPercent.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700 mb-3">Cost Breakdown</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Rent/Lease:</span>
                      <span className="font-semibold">${rent.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salaries:</span>
                      <span className="font-semibold">${salaries.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilities:</span>
                      <span className="font-semibold">${utilities.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance:</span>
                      <span className="font-semibold">${insurance.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing:</span>
                      <span className="font-semibold">${marketing.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other:</span>
                      <span className="font-semibold">${otherFixed.toLocaleString()}/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profit Analysis */}
            {targetProfit > 0 && (
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Profit Target Analysis</h4>
                <div className="space-y-2">
                  <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <div className="font-medium text-orange-800 mb-1">Target Profit of ${targetProfit.toLocaleString()}</div>
                    <div className="text-sm text-orange-700">
                      Requires <span className="font-bold">{unitsForTargetProfit.toLocaleString()} units</span> in sales
                      or <span className="font-bold">${Math.round(revenueForTargetProfit).toLocaleString()}</span> in revenue
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario Analysis */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Scenario Analysis</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {getScenarios().map((scenario, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-${scenario.color}-50 rounded-lg border-l-4 border-${scenario.color}-400`}
                  >
                    <div className={`font-semibold text-${scenario.color}-800 mb-1`}>{scenario.title}</div>
                    <div className={`text-2xl font-bold text-${scenario.color}-800 mb-1`}>
                      {scenario.breakEven.toLocaleString()}
                    </div>
                    <div className={`text-xs text-${scenario.color}-600`}>{scenario.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
</div>

        {/* Info Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">📊 Break-Even Basics</h3>
            <p className="text-sm text-blue-700 mb-3">
              Break-even point is where total revenue equals total costs, resulting in zero profit or loss.
            </p>
            <div className="text-xs text-blue-600">
              <strong>Formula:</strong><br />
              Break-Even = Fixed Costs ÷ (Selling Price - Variable Cost per Unit)
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">💰 Key Terms</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div><strong>Fixed Costs:</strong> Costs that don't change with sales volume</div>
              <div><strong>Variable Costs:</strong> Costs that change with each unit sold</div>
              <div><strong>Contribution Margin:</strong> Revenue minus variable costs per unit</div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-amber-800 mb-3">🎯 Uses of Break-Even</h3>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• Pricing decisions</li>
              <li>• Sales targets</li>
              <li>• Cost control</li>
              <li>• Investment planning</li>
              <li>• Risk assessment</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-3">📈 Improve Break-Even</h3>
            <ul className="space-y-2 text-sm text-purple-700">
              <li>• Increase selling prices</li>
              <li>• Reduce fixed costs</li>
              <li>• Lower variable costs</li>
              <li>• Improve product mix</li>
              <li>• Increase volume efficiency</li>
            </ul>
          </div>

          <div className="bg-indigo-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-indigo-800 mb-3">💡 Business Insights</h3>
            <div className="space-y-3 text-sm text-indigo-700">
              <div>
                <strong>Key Insights:</strong>
                <ul className="mt-1 space-y-1 ml-2">
                  <li>• Moderate contribution margin (20-60%) provides reasonable profit potential</li>
                  <li>• Manageable break-even volume provides good operational flexibility</li>
                  <li>• Regular monitoring helps track business health</li>
                </ul>
              </div>
              <div>
                <strong>Action Plan:</strong>
                <ul className="mt-1 space-y-1 ml-2">
                  <li>• Balance price optimization with volume growth</li>
                  <li>• Focus on consistent execution to exceed targets</li>
                  <li>• Review monthly as conditions change</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Related Financial Calculators */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Financial Calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 prose prose-gray max-w-none">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Comprehensive Guide to Business Break-Even Analysis</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Break-even analysis is one of the most fundamental financial tools for business owners and entrepreneurs. Understanding your break-even point helps you make informed decisions about pricing, costs, sales targets, and overall business viability. Whether you're launching a startup, evaluating a new product line, or optimizing an existing business, mastering break-even analysis is essential for long-term profitability.
        </p>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 mb-2">Fixed Costs</h3>
            <p className="text-sm text-gray-600 mb-3">Costs that remain constant regardless of production volume:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Rent and lease payments</li>
              <li>• Salaries and wages</li>
              <li>• Insurance premiums</li>
              <li>• Equipment depreciation</li>
              <li>• Loan interest payments</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-2">Variable Costs</h3>
            <p className="text-sm text-gray-600 mb-3">Costs that change directly with production:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Raw materials</li>
              <li>• Direct labor per unit</li>
              <li>• Packaging costs</li>
              <li>• Shipping and delivery</li>
              <li>• Sales commissions</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-5">
            <h3 className="font-semibold text-purple-800 mb-2">Contribution Margin</h3>
            <p className="text-sm text-gray-600 mb-3">The key metric for break-even analysis:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Revenue minus variable costs</li>
              <li>• Amount per unit toward fixed costs</li>
              <li>• Higher margin = faster break-even</li>
              <li>• Benchmark: 40-60% is healthy</li>
              <li>• Critical for pricing strategy</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Break-Even Formulas and Calculations</h2>
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Basic Break-Even Formula</h4>
              <div className="bg-white rounded-lg p-4 font-mono text-sm border border-gray-200">
                <p className="mb-2">Break-Even Units = Fixed Costs ÷ Contribution Margin per Unit</p>
                <p className="mb-2">Break-Even Revenue = Break-Even Units × Selling Price</p>
                <p>Contribution Margin = Price - Variable Cost per Unit</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Target Profit Formula</h4>
              <div className="bg-white rounded-lg p-4 font-mono text-sm border border-gray-200">
                <p className="mb-2">Units for Profit = (Fixed Costs + Target Profit) ÷ CM</p>
                <p className="mb-2">Margin of Safety = Actual Sales - Break-Even Sales</p>
                <p>Safety Ratio = Margin of Safety ÷ Actual Sales × 100</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Industry Break-Even Benchmarks</h2>
        <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Industry</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Avg. Gross Margin</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Break-Even Timeline</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Key Factor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Retail</td>
                <td className="border border-gray-200 px-4 py-3 text-center">25-35%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">12-18 months</td>
                <td className="border border-gray-200 px-4 py-3">Inventory turnover</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Restaurants</td>
                <td className="border border-gray-200 px-4 py-3 text-center">60-70%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">6-12 months</td>
                <td className="border border-gray-200 px-4 py-3">Labor costs</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-3">SaaS/Software</td>
                <td className="border border-gray-200 px-4 py-3 text-center">70-85%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">18-36 months</td>
                <td className="border border-gray-200 px-4 py-3">Customer acquisition</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Manufacturing</td>
                <td className="border border-gray-200 px-4 py-3 text-center">35-50%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">24-48 months</td>
                <td className="border border-gray-200 px-4 py-3">Equipment costs</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Consulting</td>
                <td className="border border-gray-200 px-4 py-3 text-center">75-90%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">3-6 months</td>
                <td className="border border-gray-200 px-4 py-3">Billable utilization</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Strategies to Lower Break-Even Point</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Reduce Fixed Costs:</strong> Negotiate rent, outsource non-core functions, switch to remote work models</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Decrease Variable Costs:</strong> Bulk purchasing, supplier negotiations, process automation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Increase Prices:</strong> Value-based pricing, premium positioning, bundle products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Improve Product Mix:</strong> Focus on high-margin products, discontinue low performers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Scale Operations:</strong> Leverage economies of scale as volume increases</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Common Break-Even Mistakes</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Ignoring Semi-Variable Costs:</strong> Utilities and overtime that increase with volume</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Forgetting Seasonality:</strong> Break-even varies throughout the year</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Static Analysis:</strong> Not updating calculations as costs and prices change</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Single Product Focus:</strong> Not accounting for product mix in multi-product businesses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Excluding Cash Flow:</strong> Break-even doesn't account for cash timing differences</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="font-semibold text-amber-800 mb-3">Real-World Example: Coffee Shop Break-Even Analysis</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-2">Monthly Fixed Costs:</p>
              <ul className="space-y-1 ml-4">
                <li>Rent: $3,000</li>
                <li>Salaries: $6,000</li>
                <li>Utilities: $400</li>
                <li>Insurance: $200</li>
                <li>Marketing: $300</li>
                <li><strong>Total: $9,900</strong></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Per Cup Economics:</p>
              <ul className="space-y-1 ml-4">
                <li>Average Selling Price: $5.00</li>
                <li>Variable Cost (coffee, cup, lid): $1.50</li>
                <li>Contribution Margin: $3.50</li>
                <li><strong>Break-Even: 2,829 cups/month</strong></li>
                <li>Daily Target: ~95 cups/day</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How often should I recalculate my break-even point?</h3>
            <p className="text-gray-600 leading-relaxed">
              You should recalculate your break-even point whenever there's a significant change in your cost structure or pricing. At minimum, review it quarterly. Major triggers include rent increases, salary changes, supplier price adjustments, new product launches, or market-driven price changes. Many successful businesses monitor their break-even point monthly as part of their financial dashboard to catch trends early.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is a healthy contribution margin percentage?</h3>
            <p className="text-gray-600 leading-relaxed">
              A healthy contribution margin varies by industry. Service businesses typically achieve 60-80%, retail ranges from 25-45%, manufacturing usually falls between 35-55%, and software companies can reach 70-90%. The key is comparing your margin to industry benchmarks and ensuring it's sufficient to cover fixed costs within a reasonable sales volume. A margin below 20% is generally concerning and indicates pricing or cost issues.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can break-even analysis work for service businesses?</h3>
            <p className="text-gray-600 leading-relaxed">
              Yes, break-even analysis is highly applicable to service businesses. Instead of units, you calculate based on billable hours, projects, or clients. For example, a consulting firm with $20,000 in monthly fixed costs and a $150/hour rate with $30 in variable costs per hour (software tools, travel) has a contribution margin of $120/hour. Their break-even is 167 billable hours monthly, or about 42 hours per week.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do I handle multiple products in break-even analysis?</h3>
            <p className="text-gray-600 leading-relaxed">
              For multi-product businesses, calculate a weighted average contribution margin based on your sales mix. If you sell Product A (60% of sales, $20 CM) and Product B (40% of sales, $30 CM), your weighted CM is (0.6 × $20) + (0.4 × $30) = $24. Then use this weighted margin in your break-even formula. Alternatively, calculate individual break-even points for each product line and manage them separately.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What's the difference between break-even point and payback period?</h3>
            <p className="text-gray-600 leading-relaxed">
              Break-even point tells you the sales volume needed to cover all operating costs, resulting in zero profit/loss. Payback period measures how long it takes to recover an initial investment (like equipment or startup costs). A business can reach its operating break-even point monthly while still working toward paying back initial investments over several years. Both metrics are important for different planning purposes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">How does break-even analysis help with pricing decisions?</h3>
            <p className="text-gray-600 leading-relaxed">
              Break-even analysis is essential for pricing strategy. By testing different price points, you can see how they affect your required sales volume. A higher price increases contribution margin (fewer units needed), but may reduce demand. A lower price requires more volume but might capture market share. Use scenario analysis to find the optimal price point where break-even volume is achievable given your market size and competitive position.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="business-break-even-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
