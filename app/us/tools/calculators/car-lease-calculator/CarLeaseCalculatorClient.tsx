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
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Car Lease Calculator?",
    answer: "A Car Lease Calculator is a free online tool designed to help you quickly and accurately calculate car lease-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Car Lease Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Car Lease Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Car Lease Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CarLeaseCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('car-lease-calculator');

  const [msrp, setMsrp] = useState(30000);
  const [downPayment, setDownPayment] = useState(3000);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [interestRate, setInterestRate] = useState(4);
  const [residualValue, setResidualValue] = useState(18000);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const depreciation = (msrp - residualValue) / leaseTerm;
    const finance = (msrp + residualValue) * (interestRate / 100 / 12);
    const payment = depreciation + finance;
    setMonthlyPayment(payment);
  }, [msrp, downPayment, leaseTerm, interestRate, residualValue]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Car Lease Calculator')}</h1>
          <p className="text-lg text-gray-600">Calculate monthly lease payments</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MSRP ($)</label>
                <input type="number" value={msrp} onChange={(e) => setMsrp(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
                <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lease Term (months)</label>
                <select value={leaseTerm} onChange={(e) => setLeaseTerm(Number(e.target.value))} 
                  className="w-full px-2 py-3 border rounded-lg">
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} 
                  min="0" step="0.1" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Residual Value ($)</label>
                <input type="number" value={residualValue} onChange={(e) => setResidualValue(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">Results</h3>
              <div className="bg-green-100 rounded-lg p-3 sm:p-4 md:p-6 text-center mb-4">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">${monthlyPayment.toFixed(2)}</div>
                <div className="text-green-700">Monthly Lease Payment</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>Total Lease Cost:</span>
                  <span className="font-semibold">${(monthlyPayment * leaseTerm).toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span>Depreciation:</span>
                  <span className="font-semibold">${(msrp - residualValue).toLocaleString()}</span>
                </div>
</div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-white border hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="text-2xl mb-2">🚗</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Complete Guide to Car Leasing</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Car leasing offers a way to drive a new vehicle with lower monthly payments than buying, but understanding the true costs and terms is essential for making a smart financial decision. This guide covers everything you need to know about lease calculations, hidden fees, and whether leasing is right for your situation.
          </p>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-2">Capitalized Cost</h3>
              <p className="text-sm text-gray-600 mb-3">The effective price of the vehicle:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• MSRP minus rebates</li>
                <li>• Minus cap cost reductions</li>
                <li>• Plus acquisition fees</li>
                <li>• Negotiate like buying</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="font-semibold text-green-800 mb-2">Residual Value</h3>
              <p className="text-sm text-gray-600 mb-3">The car's value at lease end:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Set by leasing company</li>
                <li>• Higher = lower payments</li>
                <li>• Based on depreciation</li>
                <li>• Your buyout price</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-xl p-5">
              <h3 className="font-semibold text-purple-800 mb-2">Money Factor</h3>
              <p className="text-sm text-gray-600 mb-3">The lease interest rate:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multiply by 2400 = APR</li>
                <li>• Example: 0.002 = 4.8% APR</li>
                <li>• Credit score dependent</li>
                <li>• Negotiable with dealer</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">How Monthly Lease Payments Are Calculated</h2>
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Depreciation Charge</h4>
                <div className="bg-white rounded-lg p-4 font-mono text-sm border border-gray-200 mb-2">
                  (Cap Cost - Residual) ÷ Lease Term
                </div>
                <p className="text-sm text-gray-600">The monthly cost of the car's value loss during your lease.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Finance Charge</h4>
                <div className="bg-white rounded-lg p-4 font-mono text-sm border border-gray-200 mb-2">
                  (Cap Cost + Residual) × Money Factor
                </div>
                <p className="text-sm text-gray-600">The interest paid on the average value during the lease.</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lease vs. Buy Comparison</h2>
          <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Factor</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Leasing</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Buying</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-3">Monthly Payment</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-green-600">Lower</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-red-600">Higher</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">Long-term Cost</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-red-600">Higher</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-green-600">Lower</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3">Mileage Limits</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-red-600">Restricted</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-green-600">Unlimited</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">Maintenance</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-green-600">Under warranty</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-gray-600">Varies by age</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3">End of Term</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">Return or buy</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-green-600">Own outright</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">Customization</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-red-600">Limited</td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-green-600">Full freedom</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">When Leasing Makes Sense</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Drive new cars:</strong> You prefer having the latest model every 2-3 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Low mileage:</strong> You drive under 12,000-15,000 miles annually</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Business use:</strong> You can deduct lease payments as business expense</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Cash flow:</strong> You need lower monthly payments for budgeting</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Hidden Lease Costs to Watch</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span><strong>Excess mileage:</strong> $0.15-$0.30 per mile over limit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span><strong>Wear and tear:</strong> Charges for dents, scratches, interior damage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span><strong>Disposition fee:</strong> $300-$500 when returning the vehicle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span><strong>Early termination:</strong> Can cost thousands if you end early</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="font-semibold text-amber-800 mb-3">Lease Negotiation Tips</h3>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-sm text-gray-700">
              <ul className="space-y-2">
                <li>• Negotiate the cap cost just like purchase price</li>
                <li>• Ask for the money factor in writing</li>
                <li>• Request higher mileage limits upfront</li>
                <li>• Avoid paying the first month's payment</li>
              </ul>
              <ul className="space-y-2">
                <li>• Compare manufacturer vs. bank leases</li>
                <li>• Time your lease around model year changes</li>
                <li>• Look for lease loyalty incentives</li>
                <li>• Consider multiple security deposits for lower money factor</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">What is a good residual value for a lease?</h3>
              <p className="text-gray-600 leading-relaxed">
                A good residual value is typically 50-60% of MSRP for a 36-month lease. Higher residual values mean lower monthly payments since you're paying for less depreciation. Luxury vehicles and those with strong resale value (like Toyota, Honda, and Lexus) tend to have higher residuals. Always compare residuals across different brands when shopping for leases.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Should I put money down on a lease?</h3>
              <p className="text-gray-600 leading-relaxed">
                Generally, no. Unlike buying, putting money down on a lease doesn't reduce your interest charges significantly. More importantly, if the car is totaled or stolen, your down payment is lost - gap insurance only covers the remaining payments. Instead, keep your down payment in savings and accept slightly higher monthly payments for better protection.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">What happens if I go over my mileage limit?</h3>
              <p className="text-gray-600 leading-relaxed">
                Exceeding your mileage limit results in excess mileage charges, typically $0.15-$0.30 per mile. On a 36-month lease with a 10,000-mile limit, going 5,000 miles over could cost $750-$1,500 at lease end. If you know you'll drive more, negotiate a higher mileage limit upfront - it's usually cheaper than paying overage fees later.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Can I buy my leased car at the end?</h3>
              <p className="text-gray-600 leading-relaxed">
                Yes, you can purchase your leased vehicle at the residual value stated in your contract, plus any applicable fees. This makes sense if the market value is higher than your buyout price, or if you've kept the car in excellent condition and love it. Sometimes negotiating the buyout price is possible, especially if the car has depreciated more than expected.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">What credit score do I need to lease a car?</h3>
              <p className="text-gray-600 leading-relaxed">
                Most lenders require a credit score of 620+ to approve a lease, but the best rates (lowest money factors) typically go to those with scores of 720 or higher. Subprime leases exist for lower scores but come with higher money factors, larger down payments, or both. Improving your credit before leasing can save you hundreds per month.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Is gap insurance included in a lease?</h3>
              <p className="text-gray-600 leading-relaxed">
                Many (but not all) leases include gap insurance, which covers the difference between the car's value and your remaining lease payments if it's totaled. Check your lease agreement carefully - if gap isn't included, you'll want to purchase it separately. Without gap coverage, you could owe thousands if your leased car is in a major accident.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="car-lease-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
