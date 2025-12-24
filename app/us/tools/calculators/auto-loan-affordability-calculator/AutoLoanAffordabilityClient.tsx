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
    question: "What is a Auto Loan Affordability Calculator?",
    answer: "A Auto Loan Affordability Calculator is a free online tool that helps you calculate and analyze auto loan affordability-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Auto Loan Affordability Calculator?",
    answer: "Our Auto Loan Affordability Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Auto Loan Affordability Calculator free to use?",
    answer: "Yes, this Auto Loan Affordability Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Auto Loan Affordability calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to auto loan affordability such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function AutoLoanAffordabilityClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('auto-loan-affordability-calculator');

  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [monthlyDebt, setMonthlyDebt] = useState(800);
  const [livingExpenses, setLivingExpenses] = useState(2500);
  const [downPayment, setDownPayment] = useState(5000);
  const [insurance, setInsurance] = useState(150);
  const [dtiPreference, setDtiPreference] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  const [maxCarPayment, setMaxCarPayment] = useState(0);
  const [maxCarPrice, setMaxCarPrice] = useState(0);
  const [availableIncome, setAvailableIncome] = useState(0);

  useEffect(() => {
    calculateAffordability();
  }, [monthlyIncome, monthlyDebt, livingExpenses, downPayment, insurance, dtiPreference]);

  const calculateAffordability = () => {
    // DTI ratios
    const dtiRatios = {
      conservative: 0.20,
      moderate: 0.28,
      aggressive: 0.36
    };

    const dtiRatio = dtiRatios[dtiPreference];

    // Calculate max total debt payment based on DTI
    const maxTotalDebt = monthlyIncome * dtiRatio;

    // Calculate available for car payment (max debt - current debt - insurance)
    const availableForCar = Math.max(0, maxTotalDebt - monthlyDebt - insurance);

    // Assuming 60-month loan at 6% interest
    const months = 60;
    const annualRate = 0.06;
    const monthlyRate = annualRate / 12;

    // Calculate max loan amount using present value formula
    // PV = PMT * [(1 - (1 + r)^-n) / r]
    const maxLoanAmount = availableForCar * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);

    // Add down payment to get max car price
    const maxPrice = maxLoanAmount + downPayment;

    // Calculate available income after expenses
    const available = monthlyIncome - monthlyDebt - livingExpenses;

    setMaxCarPayment(availableForCar);
    setMaxCarPrice(maxPrice);
    setAvailableIncome(available);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{getH1('Auto Loan Affordability Calculator')}</h1>
        <p className="text-lg text-gray-600">Discover how much car you can afford based on your financial situation</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Your Financial Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income ($)</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(parseFloat(e.target.value))}
                step="100"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Monthly Debt ($)</label>
              <input
                type="number"
                value={monthlyDebt}
                onChange={(e) => setMonthlyDebt(parseFloat(e.target.value))}
                step="50"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Credit cards, loans, etc.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Living Expenses ($)</label>
              <input
                type="number"
                value={livingExpenses}
                onChange={(e) => setLivingExpenses(parseFloat(e.target.value))}
                step="100"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Rent, food, utilities, etc.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desired Down Payment ($)</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(parseFloat(e.target.value))}
                step="500"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Insurance ($/month)</label>
              <input
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(parseFloat(e.target.value))}
                step="25"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Debt-to-Income Preference</label>
              <select
                value={dtiPreference}
                onChange={(e) => setDtiPreference(e.target.value as any)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="conservative">Conservative (20%)</option>
                <option value="moderate">Moderate (28%)</option>
                <option value="aggressive">Aggressive (36%)</option>
              </select>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Affordability Analysis</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Monthly Income:</span>
                  <span className="font-semibold text-blue-600">${monthlyIncome.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Current Debt + Insurance:</span>
                  <span className="font-semibold text-orange-600">${(monthlyDebt + insurance).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Available for Car Payment:</span>
                  <span className="font-semibold text-green-600">${Math.round(maxCarPayment).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Max Car Price:</span>
                  <span className="font-semibold text-purple-600 text-xl">${Math.round(maxCarPrice).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">💡 Recommendation</h4>
              <p className="text-sm text-blue-800">
                {maxCarPayment > 0
                  ? `You can afford up to $${Math.round(maxCarPayment).toLocaleString()}/month in car payments. Consider cars in the $${Math.round(maxCarPrice * 0.8).toLocaleString()} - $${Math.round(maxCarPrice).toLocaleString()} range.`
                  : 'Your current debt and expenses are too high. Consider reducing debt or increasing income before purchasing a car.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Detailed Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Detailed Financial Analysis</h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Income & Debt Analysis</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-800">Gross Monthly Income:</span>
                <span className="font-semibold">${monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Current Monthly Debt:</span>
                <span className="font-semibold">${monthlyDebt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Living Expenses:</span>
                <span className="font-semibold">${livingExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Car Insurance:</span>
                <span className="font-semibold">${insurance.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg">
                  <span className="text-blue-900 font-semibold">Available Income:</span>
                  <span className="font-bold">${Math.round(availableIncome).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-900 mb-4">Car Purchase Recommendations</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-800">Recommended Payment:</span>
                <span className="font-semibold text-2xl text-green-900">${Math.round(maxCarPayment).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Max Car Price:</span>
                <span className="font-semibold text-2xl text-green-900">${Math.round(maxCarPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Down Payment:</span>
                <span className="font-semibold">${downPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Loan Amount:</span>
                <span className="font-semibold">${Math.round(maxCarPrice - downPayment).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Related Financial Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-xl">🚗</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">How to Determine What Car You Can Afford</h2>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6 leading-relaxed">
            Buying a car is one of the biggest financial decisions most Americans make, second only to purchasing a home. The key to a smart car purchase isn't just finding a vehicle you love—it's finding one that fits comfortably within your budget without straining your finances. This auto loan affordability calculator helps you determine exactly how much car you can afford based on your income, existing debts, and financial goals.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">The 20/4/10 Rule for Car Buying</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Financial experts often recommend the 20/4/10 rule as a guideline for car purchases:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">20% Down Payment</h4>
              <p className="text-sm text-blue-800">Put at least 20% down to avoid being "upside down" on your loan (owing more than the car is worth).</p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <h4 className="text-lg font-semibold text-green-900 mb-2">4-Year Loan Term</h4>
              <p className="text-sm text-green-800">Keep your loan to 4 years or less to minimize interest costs and avoid paying for a depreciating asset too long.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <h4 className="text-lg font-semibold text-purple-900 mb-2">10% of Income</h4>
              <p className="text-sm text-purple-800">Total car costs (payment, insurance, gas, maintenance) shouldn't exceed 10-15% of your gross monthly income.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Understanding Debt-to-Income Ratio (DTI)</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Your debt-to-income ratio is crucial in determining how much car you can afford. DTI compares your monthly debt payments to your gross monthly income. Lenders use this metric to assess your ability to manage monthly payments:
          </p>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li className="flex items-center gap-2"><span className="text-green-500">•</span><strong>Conservative (20% or less):</strong> Leaves plenty of room for emergencies and savings. Best for financial security.</li>
            <li className="flex items-center gap-2"><span className="text-yellow-500">•</span><strong>Moderate (21-28%):</strong> The sweet spot for most buyers. Manageable payments while still enjoying a reliable vehicle.</li>
            <li className="flex items-center gap-2"><span className="text-red-500">•</span><strong>Aggressive (29-36%):</strong> Higher risk. Only suitable if you have stable income and an emergency fund.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Hidden Costs of Car Ownership</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Your monthly car payment is just the beginning. A complete affordability analysis must include:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">💰</span>
              <div>
                <strong className="text-gray-800">Car Insurance:</strong>
                <p className="text-sm text-gray-600">Typically $100-$300/month depending on coverage, driving record, and vehicle type. Newer, more expensive cars cost more to insure.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">⛽</span>
              <div>
                <strong className="text-gray-800">Fuel Costs:</strong>
                <p className="text-sm text-gray-600">Average American spends $150-$250/month on gas. Consider fuel efficiency when choosing a vehicle.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">🔧</span>
              <div>
                <strong className="text-gray-800">Maintenance & Repairs:</strong>
                <p className="text-sm text-gray-600">Budget $50-$100/month for oil changes, tires, brakes, and unexpected repairs. Older cars need more maintenance.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">📋</span>
              <div>
                <strong className="text-gray-800">Registration & Taxes:</strong>
                <p className="text-sm text-gray-600">Annual registration fees, property taxes, and inspection costs vary by state but typically run $100-$500/year.</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">New vs. Used: Financial Considerations</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Buying New</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Full manufacturer warranty</li>
                <li>✓ Latest safety features</li>
                <li>✓ Better financing rates (often 0-3%)</li>
                <li>✗ Higher insurance costs</li>
                <li>✗ Steeper depreciation (20-30% in year one)</li>
                <li>✗ Higher purchase price</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <h4 className="text-lg font-semibold text-green-900 mb-3">Buying Used</h4>
              <ul className="text-sm text-green-800 space-y-2">
                <li>✓ Lower purchase price</li>
                <li>✓ Less depreciation hit</li>
                <li>✓ Lower insurance costs</li>
                <li>✗ Higher interest rates (4-10%)</li>
                <li>✗ Unknown maintenance history</li>
                <li>✗ Limited or no warranty</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips to Maximize Your Car Budget</h3>
          <ul className="text-gray-600 space-y-2 mb-6">
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Get pre-approved for financing before visiting dealerships to know your rate and have negotiating power</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Save for a larger down payment to reduce monthly payments and total interest paid</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Consider certified pre-owned (CPO) vehicles for warranty protection at used car prices</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Shop for insurance quotes before buying—some vehicles are much cheaper to insure</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Factor in total cost of ownership, not just the sticker price</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Avoid dealer add-ons like extended warranties and paint protection that inflate costs</li>
          </ul>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>

        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How much of my income should go to a car payment?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Financial experts recommend keeping your total car costs (payment, insurance, fuel, maintenance) under 15-20% of your gross monthly income. For just the car payment alone, aim for 10-15% maximum. If you make $5,000/month, your car payment should ideally be $500-$750, with total car costs under $1,000.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What credit score do I need for a good auto loan rate?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              For the best rates (under 5% APR), you typically need a credit score of 720 or higher. Scores between 660-719 qualify for decent rates (5-8%). Below 660, you'll face subprime rates (10-20%+). Before car shopping, check your credit score and consider improving it if below 680. Even a few points can save thousands over the loan term.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Is it better to finance through a dealer or bank?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Always get pre-approved by your bank or credit union before visiting a dealer. This gives you a baseline rate to compare against dealer financing. Sometimes dealers offer promotional 0% financing, which can beat bank rates, but watch for hidden costs or inflated prices. Credit unions often have the best rates, especially for used cars.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How much should I put down on a car?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Aim for at least 20% down on a new car and 10% on a used car. This protects you from being "underwater" on your loan (owing more than the car is worth). If you're trading in a vehicle, the trade-in value can count toward your down payment. A larger down payment also means lower monthly payments and less interest paid overall.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Should I choose a 60-month or 72-month loan?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Shorter is almost always better. A 60-month loan has higher monthly payments but saves thousands in interest. A 72-month loan lowers payments but means you're paying for a depreciating asset longer and paying more total interest. If you need 72+ months to afford the payment, the car is probably too expensive for your budget.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What's included in total cost of ownership?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Total cost of ownership includes: monthly payment, car insurance, fuel costs, routine maintenance (oil, tires, brakes), repairs, registration fees, property taxes (in some states), and depreciation. Websites like Edmunds and KBB provide 5-year cost of ownership estimates for specific models. This helps you compare the true cost of different vehicles beyond the sticker price.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Disclaimer</h3>
            <p className="text-sm text-amber-700">
              This calculator provides estimates based on average interest rates and loan terms. Your actual affordability may vary based on your credit score, the specific lender, and current market conditions. Always get pre-approved for financing to know your exact rate before making a purchase decision.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="auto-loan-affordability-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
