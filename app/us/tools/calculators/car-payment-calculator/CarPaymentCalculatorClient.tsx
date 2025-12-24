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
    question: "What is a Car Payment Calculator?",
    answer: "A Car Payment Calculator is a free online tool designed to help you quickly and accurately calculate car payment-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Car Payment Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Car Payment Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Car Payment Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CarPaymentCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('car-payment-calculator');

  const [carPrice, setCarPrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeIn, setTradeIn] = useState(0);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [salesTax, setSalesTax] = useState(7);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const taxAmount = carPrice * (salesTax / 100);
    const totalPrice = carPrice + taxAmount;
    const loanAmount = totalPrice - downPayment - tradeIn;
    const monthlyRate = interestRate / 100 / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                   (Math.pow(1 + monthlyRate, loanTerm) - 1);
    setMonthlyPayment(isNaN(payment) ? 0 : payment);
  }, [carPrice, downPayment, tradeIn, interestRate, loanTerm, salesTax]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Car Payment Calculator')}</h1>
          <p className="text-lg text-gray-600">Calculate monthly auto payments</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Car Price ($)</label>
                <input type="number" value={carPrice} onChange={(e) => setCarPrice(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
                <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trade-in Value ($)</label>
                <input type="number" value={tradeIn} onChange={(e) => setTradeIn(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} 
                  min="0" step="0.1" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (months)</label>
                <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} 
                  className="w-full px-2 py-3 border rounded-lg">
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                  <option value="72">72 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Tax (%)</label>
                <input type="number" value={salesTax} onChange={(e) => setSalesTax(Number(e.target.value))} 
                  min="0" step="0.1" className="w-full px-2 py-3 border rounded-lg" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">Results</h3>
              <div className="bg-green-100 rounded-lg p-3 sm:p-4 md:p-6 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">${monthlyPayment.toFixed(2)}</div>
                <div className="text-green-700">Monthly Payment</div>
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Car Payments</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Your monthly car payment is determined by several factors including the vehicle price, down payment, trade-in value, interest rate, and loan term. Understanding how these components work together helps you make smarter financing decisions and find a payment that fits your budget while minimizing total interest costs.
          </p>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 rounded-xl p-5">
              <h3 className="font-semibold text-blue-800 mb-2">Principal Factors</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vehicle purchase price</li>
                <li>• Down payment amount</li>
                <li>• Trade-in value</li>
                <li>• Sales tax rate</li>
                <li>• Dealer fees and add-ons</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-5">
              <h3 className="font-semibold text-green-800 mb-2">Interest Factors</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your credit score</li>
                <li>• New vs. used vehicle</li>
                <li>• Lender type (bank, credit union)</li>
                <li>• Loan term length</li>
                <li>• Market conditions</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-xl p-5">
              <h3 className="font-semibold text-purple-800 mb-2">Term Considerations</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 36 months: Highest payment, lowest interest</li>
                <li>• 48 months: Balanced option</li>
                <li>• 60 months: Common choice</li>
                <li>• 72+ months: Lower payment, more interest</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Car Payment Formula</h2>
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-white rounded-lg p-4 font-mono text-sm border border-gray-200 mb-4">
              Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]
            </div>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-sm text-gray-600">
              <div>
                <p><strong>P</strong> = Loan amount (price + tax - down payment - trade-in)</p>
                <p><strong>r</strong> = Monthly interest rate (APR ÷ 12)</p>
              </div>
              <div>
                <p><strong>n</strong> = Number of monthly payments</p>
                <p>Result is your fixed monthly payment amount</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Average Car Payments by Credit Score</h2>
          <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Credit Score</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Avg. New Car APR</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Avg. Used Car APR</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">$30K Loan Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-green-600">Excellent (750+)</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">4.5% - 5.5%</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">5.5% - 7%</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">$557/mo</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-blue-600">Good (700-749)</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">5.5% - 7%</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">7% - 9%</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">$580/mo</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-yellow-600">Fair (650-699)</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">8% - 12%</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">10% - 14%</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">$632/mo</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-red-600">Poor (Below 650)</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">12% - 18%</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">15% - 22%</td>
                  <td className="border border-gray-200 px-4 py-3 text-center">$700+/mo</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">*Based on 60-month loan term. Rates vary by lender and market conditions.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ways to Lower Your Payment</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Increase down payment:</strong> Every $1,000 down reduces payment by ~$20/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Improve credit score:</strong> Better credit = lower interest rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Shop for rates:</strong> Compare banks, credit unions, and dealer financing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Consider used:</strong> 1-2 year old cars save 20-30% off new</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Hidden Costs to Budget For</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">!</span>
                  <span><strong>Insurance:</strong> $100-$300/month depending on coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">!</span>
                  <span><strong>Fuel:</strong> $150-$400/month based on driving habits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">!</span>
                  <span><strong>Maintenance:</strong> $50-$100/month average</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">!</span>
                  <span><strong>Registration:</strong> Varies by state, often $100-$500/year</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="font-semibold text-amber-800 mb-3">The 20/4/10 Rule for Car Affordability</h3>
            <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-sm text-gray-700">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 mb-2">20%</div>
                <p>Minimum down payment to avoid being underwater on your loan</p>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 mb-2">4 years</div>
                <p>Maximum loan term to minimize interest and depreciation risk</p>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 mb-2">10%</div>
                <p>Maximum of gross income for total car expenses (payment + insurance + gas)</p>
              </div>
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
              <h3 className="text-lg font-medium text-gray-800 mb-2">How much car can I afford on my salary?</h3>
              <p className="text-gray-600 leading-relaxed">
                A common guideline is to spend no more than 10-15% of your monthly take-home pay on your car payment. If you make $5,000 per month after taxes, aim for a payment of $500-$750. Remember to factor in insurance ($100-$300/month), gas ($150-$400/month), and maintenance ($50-$100/month) for the true cost of car ownership.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Should I choose a longer loan term for lower payments?</h3>
              <p className="text-gray-600 leading-relaxed">
                While longer terms (72-84 months) lower your monthly payment, they cost significantly more in interest. A $30,000 loan at 6% costs $4,799 in interest over 60 months but $6,899 over 84 months - that's $2,100 more. Longer terms also increase the risk of being "underwater" (owing more than the car's worth), which can be problematic if you want to trade in or sell.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Is it better to pay cash or finance a car?</h3>
              <p className="text-gray-600 leading-relaxed">
                Paying cash eliminates interest costs, but financing can make sense if: (1) you can get a low interest rate (under 4%), (2) you'd earn more by investing the cash elsewhere, or (3) you need to preserve emergency savings. If your credit is poor and rates are high (10%+), paying cash or saving longer for a larger down payment is usually smarter.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">How does sales tax affect my car payment?</h3>
              <p className="text-gray-600 leading-relaxed">
                Most states charge sales tax on vehicle purchases, typically 5-10%. On a $30,000 car, that's $1,500-$3,000 added to your loan if financed. This increases both your monthly payment and total interest paid. Some states have no sales tax on vehicles (Montana, New Hampshire), while others like California charge over 8%.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Should I trade in my car or sell it privately?</h3>
              <p className="text-gray-600 leading-relaxed">
                Selling privately typically gets you 10-20% more than a dealer trade-in, but requires more effort (advertising, meeting buyers, paperwork). Trade-ins are convenient and may reduce your sales tax in some states. If you owe more than your car is worth (negative equity), be cautious about rolling that into a new loan - it increases your payment and puts you further underwater.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Can I negotiate the interest rate at a dealership?</h3>
              <p className="text-gray-600 leading-relaxed">
                Yes! Dealers often mark up interest rates for profit. Get pre-approved from your bank or credit union first, then let the dealer try to beat it. You can ask for the "buy rate" (the rate from the lender before dealer markup). Having outside financing gives you negotiating power, and manufacturers sometimes offer promotional 0% financing that beats any bank rate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="car-payment-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
