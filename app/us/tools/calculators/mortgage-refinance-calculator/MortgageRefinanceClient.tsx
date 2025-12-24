'use client';

import { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface MortgageRefinanceClientProps {
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
    question: "What is a Mortgage Refinance Calculator?",
    answer: "A Mortgage Refinance Calculator is a free online tool that helps you calculate and analyze mortgage refinance-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Mortgage Refinance Calculator?",
    answer: "Our Mortgage Refinance Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Mortgage Refinance Calculator free to use?",
    answer: "Yes, this Mortgage Refinance Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Mortgage Refinance calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to mortgage refinance such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function MortgageRefinanceClient({ relatedCalculators = defaultRelatedCalculators }: MortgageRefinanceClientProps) {
  // Current Loan
  const { getH1, getSubHeading } = usePageSEO('mortgage-refinance-calculator');

  const [currentBalance, setCurrentBalance] = useState(300000);
  const [currentRate, setCurrentRate] = useState(6.5);
  const [remainingTerm, setRemainingTerm] = useState(25);

  // New Loan
  const [newRate, setNewRate] = useState(5.5);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(5000);

  // Calculated values
  const [currentPayment, setCurrentPayment] = useState(0);
  const [newPayment, setNewPayment] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [breakEven, setBreakEven] = useState(0);
  const [currentTotalInterest, setCurrentTotalInterest] = useState(0);
  const [newTotalInterest, setNewTotalInterest] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [recommendationReason, setRecommendationReason] = useState('');
  const [recommendationClass, setRecommendationClass] = useState('');

  useEffect(() => {
    // Calculate current monthly payment
    const currentMonthlyRate = currentRate / 100 / 12;
    const currentNumPayments = remainingTerm * 12;
    const currentPmt = currentBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentNumPayments)) /
                       (Math.pow(1 + currentMonthlyRate, currentNumPayments) - 1);

    // Calculate new monthly payment
    const newMonthlyRate = newRate / 100 / 12;
    const newNumPayments = newTerm * 12;
    const newPmt = currentBalance * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newNumPayments)) /
                   (Math.pow(1 + newMonthlyRate, newNumPayments) - 1);

    // Monthly savings
    const savings = currentPmt - newPmt;

    // Break-even point (months)
    const breakEvenMonths = savings > 0 ? closingCosts / savings : 0;

    // Total interest calculations
    const currentInterest = (currentPmt * currentNumPayments) - currentBalance;
    const newInterest = (newPmt * newNumPayments) - currentBalance + closingCosts;
    const interestSavings = currentInterest - newInterest;

    setCurrentPayment(currentPmt);
    setNewPayment(newPmt);
    setMonthlySavings(savings);
    setBreakEven(breakEvenMonths);
    setCurrentTotalInterest(currentInterest);
    setNewTotalInterest(newInterest);
    setTotalSavings(interestSavings);

    // Recommendation logic
    if (breakEvenMonths <= 24 && interestSavings > closingCosts) {
      setRecommendation('Refinance Recommended');
      setRecommendationReason(`You'll break even in ${breakEvenMonths.toFixed(1)} months and save ${formatCurrency(interestSavings)} over the loan term.`);
      setRecommendationClass('green');
    } else if (breakEvenMonths <= 60 && interestSavings > 0) {
      setRecommendation('Consider Refinancing');
      setRecommendationReason(`Break-even in ${breakEvenMonths.toFixed(1)} months. Evaluate if you'll stay in the home long enough.`);
      setRecommendationClass('yellow');
    } else {
      setRecommendation('Not Recommended');
      setRecommendationReason(`High break-even period (${breakEvenMonths.toFixed(1)} months) or minimal savings.`);
      setRecommendationClass('red');
    }
  }, [currentBalance, currentRate, remainingTerm, newRate, newTerm, closingCosts]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Mortgage Refinance Calculator')}</h1>
        <p className="text-lg text-gray-600">
          Calculate potential savings and break-even point for refinancing your mortgage
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Current Loan Section */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Loan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Balance ($)</label>
                  <input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Interest Rate (%)</label>
                  <input
                    type="number"
                    value={currentRate}
                    onChange={(e) => setCurrentRate(Number(e.target.value))}
                    min="0"
                    max="20"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Term (years)</label>
                  <input
                    type="number"
                    value={remainingTerm}
                    onChange={(e) => setRemainingTerm(Number(e.target.value))}
                    min="1"
                    max="40"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Payment ($)</label>
                  <input
                    type="text"
                    value={formatCurrency(currentPayment)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* New Loan Section */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">New Loan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Interest Rate (%)</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    min="0"
                    max="20"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Term (years)</label>
                  <select
                    value={newTerm}
                    onChange={(e) => setNewTerm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="25">25 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closing Costs ($)</label>
                  <input
                    type="number"
                    value={closingCosts}
                    onChange={(e) => setClosingCosts(Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Payment ($)</label>
                  <input
                    type="text"
                    value={formatCurrency(newPayment)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Refinance Analysis</h2>

            <div className="space-y-4">
              {/* Monthly Savings */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Monthly Payment Savings</div>
                <div className="text-2xl font-bold text-green-900">{formatCurrency(monthlySavings)}</div>
              </div>

              {/* Break Even */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Break-Even Point</div>
                <div className="text-xl font-bold text-blue-900">{breakEven.toFixed(1)} months</div>
              </div>

              {/* Total Savings */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Total Interest Savings</div>
                <div className="text-xl font-bold text-purple-900">{formatCurrency(totalSavings)}</div>
              </div>

              {/* Recommendation */}
              <div className={`p-4 rounded-lg ${
                recommendationClass === 'green' ? 'bg-green-50' :
                recommendationClass === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <div className={`text-sm font-medium ${
                  recommendationClass === 'green' ? 'text-green-600' :
                  recommendationClass === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                }`}>Recommendation</div>
                <div className={`text-lg font-bold ${
                  recommendationClass === 'green' ? 'text-green-900' :
                  recommendationClass === 'yellow' ? 'text-yellow-900' : 'text-red-900'
                }`}>{recommendation}</div>
                <p className={`text-sm mt-1 ${
                  recommendationClass === 'green' ? 'text-green-700' :
                  recommendationClass === 'yellow' ? 'text-yellow-700' : 'text-red-700'
                }`}>{recommendationReason}</p>
              </div>
            </div>

            {/* Detailed Comparison */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Loan Comparison</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        New
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-2 py-2 text-sm font-medium text-gray-900">Interest Rate</td>
                      <td className="px-2 py-2 text-sm text-gray-500">{currentRate.toFixed(2)}%</td>
                      <td className="px-2 py-2 text-sm text-gray-500">{newRate.toFixed(2)}%</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 text-sm font-medium text-gray-900">Monthly Payment</td>
                      <td className="px-2 py-2 text-sm text-gray-500">{formatCurrency(currentPayment)}</td>
                      <td className="px-2 py-2 text-sm text-gray-500">{formatCurrency(newPayment)}</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 text-sm font-medium text-gray-900">Total Interest</td>
                      <td className="px-2 py-2 text-sm text-gray-500">{formatCurrency(currentTotalInterest)}</td>
                      <td className="px-2 py-2 text-sm text-gray-500">{formatCurrency(newTotalInterest - closingCosts)}</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 text-sm font-medium text-gray-900">Total Cost</td>
                      <td className="px-2 py-2 text-sm text-gray-500">
                        {formatCurrency(currentBalance + currentTotalInterest)}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-500">
                        {formatCurrency(currentBalance + newTotalInterest)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Monthly Savings Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Monthly Savings Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-600 font-medium mb-2">Current Monthly Payment</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(currentPayment)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-600 font-medium mb-2">New Monthly Payment</p>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(newPayment)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-600 font-medium mb-2">Monthly Savings</p>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(monthlySavings)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-600 font-medium mb-2">Annual Savings</p>
            <p className="text-2xl font-bold text-orange-900">{formatCurrency(monthlySavings * 12)}</p>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <a
              key={index}
              href={calc.href}
              className="block p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Mortgage Refinancing</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Mortgage refinancing replaces your existing home loan with a new one, typically to secure a lower interest rate, reduce monthly payments, change loan terms, or tap into home equity. The decision to refinance involves comparing potential savings against closing costs to determine if the financial benefits justify the expense.
        </p>

        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          The break-even point is the critical metric in any refinance decision. This is when your accumulated monthly savings equal the closing costs you paid. If you plan to stay in your home past the break-even point, refinancing makes financial sense. Otherwise, you&apos;re paying closing costs without recouping the investment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Rate & Term Refinance</h3>
            <p className="text-sm text-blue-800">Replace your loan to get a lower rate or change from 30 to 15 years without taking cash out</p>
          </div>
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <h3 className="font-semibold text-green-900 mb-2">Cash-Out Refinance</h3>
            <p className="text-sm text-green-800">Borrow against your home equity for renovations, debt consolidation, or major expenses</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2">Cash-In Refinance</h3>
            <p className="text-sm text-purple-800">Pay down principal at closing to qualify for better rates or eliminate PMI</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">When Does Refinancing Make Sense?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Good Reasons to Refinance</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Rates have dropped 0.5-1% or more from your current rate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Your credit score has improved significantly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>You plan to stay in the home past the break-even point</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>You want to switch from ARM to fixed-rate for stability</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">When to Reconsider</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>You plan to sell before reaching the break-even point</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Closing costs are unusually high relative to savings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>You&apos;re far into your current loan term</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Your home value has declined significantly</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">Typical Refinancing Costs</h3>
        <p className="text-gray-600 leading-relaxed">
          Refinancing typically costs 2-5% of the loan amount. Common fees include application fees ($300-500), appraisal ($400-700), title search and insurance ($700-900), origination fees (0.5-1% of loan), and recording fees. Some lenders offer &quot;no-cost&quot; refinancing, rolling fees into the loan balance or interest rate.
        </p>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is the ideal rate drop to justify refinancing?</h3>
            <p className="text-gray-600">
              The traditional rule suggests refinancing when rates drop 1-2% from your current rate, but modern lower closing costs mean even 0.5-0.75% can be worthwhile. The key is calculating your specific break-even point. If you can recoup closing costs within 2-3 years and plan to stay longer, refinancing likely makes sense regardless of the rate drop percentage.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I refinance from a 30-year to a 15-year mortgage?</h3>
            <p className="text-gray-600">
              A 15-year mortgage offers lower rates (typically 0.5-0.75% less) and dramatically reduces total interest paid, but requires higher monthly payments. For a $300,000 loan, switching from 30-year at 6.5% to 15-year at 6% increases payments from $1,896 to $2,532 but saves over $200,000 in interest. Only refinance to 15 years if you can comfortably afford the higher payment without straining your budget.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How does refinancing affect my loan timeline?</h3>
            <p className="text-gray-600">
              Refinancing resets your loan term, which can work for or against you. If you&apos;ve paid 10 years on a 30-year mortgage and refinance to another 30-year loan, you&apos;ve extended your payoff by 10 years. Consider refinancing to a term that matches your remaining original timeline, or choose a shorter term to accelerate payoff and save on total interest.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What credit score do I need to refinance?</h3>
            <p className="text-gray-600">
              Most conventional refinance loans require a minimum 620 credit score, though 740+ gets you the best rates. FHA streamline refinances may accept scores as low as 580. If your credit has improved significantly since your original loan, refinancing could qualify you for a much better rate. Check your score and address any issues before applying to maximize your rate improvement.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can I refinance with little or no equity?</h3>
            <p className="text-gray-600">
              Standard refinancing typically requires at least 20% equity to avoid PMI, though some programs accept less with PMI. For underwater or low-equity mortgages, government programs like HARP (for Fannie/Freddie loans) or FHA/VA streamline refinances may help. These programs have less stringent equity requirements and may not require a new appraisal, making refinancing possible even when traditional options aren&apos;t available.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="mortgage-refinance-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
