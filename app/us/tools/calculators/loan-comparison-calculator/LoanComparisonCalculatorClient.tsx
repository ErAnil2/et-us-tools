'use client';

import React, { useState, useEffect } from 'react';
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
  icon: string;
}

interface LoanData {
  amount: number;
  rate: number;
  term: number;
  fees: number;
}

interface LoanResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  totalCost: number;
  apr: number;
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
    question: "What is a Loan Comparison Calculator?",
    answer: "A Loan Comparison Calculator is a free online tool that helps you calculate and analyze loan comparison-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Loan Comparison Calculator?",
    answer: "Our Loan Comparison Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Loan Comparison Calculator free to use?",
    answer: "Yes, this Loan Comparison Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Loan Comparison calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to loan comparison such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function LoanComparisonCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('loan-comparison-calculator');

  const [loan1, setLoan1] = useState<LoanData>({ amount: 300000, rate: 6.5, term: 30, fees: 5000 });
  const [loan2, setLoan2] = useState<LoanData>({ amount: 300000, rate: 6.25, term: 30, fees: 8000 });
  const [loan3, setLoan3] = useState<LoanData>({ amount: 300000, rate: 6.75, term: 30, fees: 3000 });

  const [results1, setResults1] = useState<LoanResults>({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0, totalCost: 0, apr: 0 });
  const [results2, setResults2] = useState<LoanResults>({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0, totalCost: 0, apr: 0 });
  const [results3, setResults3] = useState<LoanResults>({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0, totalCost: 0, apr: 0 });

  useEffect(() => {
    setResults1(calculateLoan(loan1));
    setResults2(calculateLoan(loan2));
    setResults3(calculateLoan(loan3));
  }, [loan1, loan2, loan3]);

  const calculateLoan = (loan: LoanData): LoanResults => {
    const principal = Math.max(0, loan.amount);
    const monthlyRate = loan.rate / 100 / 12;
    const numPayments = loan.term * 12;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = principal / numPayments;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                      (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;
    const totalCost = totalPayment + loan.fees;

    // Simplified APR calculation
    const apr = ((totalInterest + loan.fees) / principal / loan.term) * 100;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      totalCost,
      apr
    };
  };

  const getBestLoan = (): number => {
    const costs = [results1.totalCost, results2.totalCost, results3.totalCost];
    const minCost = Math.min(...costs);
    return costs.indexOf(minCost) + 1;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const bestLoan = getBestLoan();

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Loan Comparison Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Compare up to 3 loans side-by-side to find the best deal</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Enter Loan Details</h2>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Loan 1 */}
          <div className={`p-4 rounded-lg ${bestLoan === 1 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Loan 1</h3>
              {bestLoan === 1 && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Best Deal</span>}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Loan Amount</label>
                <input
                  type="number"
                  value={loan1.amount}
                  onChange={(e) => setLoan1({...loan1, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  value={loan1.rate}
                  onChange={(e) => setLoan1({...loan1, rate: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.125"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Term (Years)</label>
                <input
                  type="number"
                  value={loan1.term}
                  onChange={(e) => setLoan1({...loan1, term: parseInt(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Upfront Fees</label>
                <input
                  type="number"
                  value={loan1.fees}
                  onChange={(e) => setLoan1({...loan1, fees: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Loan 2 */}
          <div className={`p-4 rounded-lg ${bestLoan === 2 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Loan 2</h3>
              {bestLoan === 2 && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Best Deal</span>}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Loan Amount</label>
                <input
                  type="number"
                  value={loan2.amount}
                  onChange={(e) => setLoan2({...loan2, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  value={loan2.rate}
                  onChange={(e) => setLoan2({...loan2, rate: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.125"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Term (Years)</label>
                <input
                  type="number"
                  value={loan2.term}
                  onChange={(e) => setLoan2({...loan2, term: parseInt(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Upfront Fees</label>
                <input
                  type="number"
                  value={loan2.fees}
                  onChange={(e) => setLoan2({...loan2, fees: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Loan 3 */}
          <div className={`p-4 rounded-lg ${bestLoan === 3 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Loan 3</h3>
              {bestLoan === 3 && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Best Deal</span>}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Loan Amount</label>
                <input
                  type="number"
                  value={loan3.amount}
                  onChange={(e) => setLoan3({...loan3, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  value={loan3.rate}
                  onChange={(e) => setLoan3({...loan3, rate: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.125"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Term (Years)</label>
                <input
                  type="number"
                  value={loan3.term}
                  onChange={(e) => setLoan3({...loan3, term: parseInt(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Upfront Fees</label>
                <input
                  type="number"
                  value={loan3.fees}
                  onChange={(e) => setLoan3({...loan3, fees: parseFloat(e.target.value) || 0})}
                  className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Comparison Results Table */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Comparison Results</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-700">Metric</th>
                <th className={`px-4 py-3 text-right font-medium ${bestLoan === 1 ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}>Loan 1</th>
                <th className={`px-4 py-3 text-right font-medium ${bestLoan === 2 ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}>Loan 2</th>
                <th className={`px-4 py-3 text-right font-medium ${bestLoan === 3 ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}>Loan 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium">Monthly Payment</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 1 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results1.monthlyPayment)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 2 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results2.monthlyPayment)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 3 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results3.monthlyPayment)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Total Interest</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 1 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results1.totalInterest)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 2 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results2.totalInterest)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 3 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results3.totalInterest)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Upfront Fees</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 1 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(loan1.fees)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 2 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(loan2.fees)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 3 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(loan3.fees)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Total Payments</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 1 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results1.totalPayment)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 2 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results2.totalPayment)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 3 ? 'bg-green-50 font-semibold' : ''}`}>{formatCurrency(results3.totalPayment)}</td>
              </tr>
              <tr className="bg-blue-50 font-bold">
                <td className="px-4 py-3">Total Cost</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 1 ? 'bg-green-200 text-green-800' : ''}`}>{formatCurrency(results1.totalCost)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 2 ? 'bg-green-200 text-green-800' : ''}`}>{formatCurrency(results2.totalCost)}</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 3 ? 'bg-green-200 text-green-800' : ''}`}>{formatCurrency(results3.totalCost)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Effective APR</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 1 ? 'bg-green-50 font-semibold' : ''}`}>{results1.apr.toFixed(2)}%</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 2 ? 'bg-green-50 font-semibold' : ''}`}>{results2.apr.toFixed(2)}%</td>
                <td className={`px-4 py-3 text-right ${bestLoan === 3 ? 'bg-green-50 font-semibold' : ''}`}>{results3.apr.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Recommendation</h3>
          <p className="text-blue-700">
            <strong>Loan {bestLoan}</strong> offers the best overall value with the lowest total cost of {formatCurrency(bestLoan === 1 ? results1.totalCost : bestLoan === 2 ? results2.totalCost : results3.totalCost)}.
            This includes all interest payments and upfront fees over the life of the loan.
          </p>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className={`${calc.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}>
              <h4 className="font-semibold mb-2">{calc.title}</h4>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">How to Compare Loans Effectively</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Comparing loan offers is one of the most important steps in the borrowing process. Even small differences in interest rates or fees can translate into thousands of dollars over the life of a loan. This calculator helps you see the full picture by comparing total costs, not just monthly payments or advertised rates.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">What to Compare</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Monthly payment amounts</li>
                <li>• Total interest over loan term</li>
                <li>• Upfront fees and closing costs</li>
                <li>• APR (Annual Percentage Rate)</li>
                <li>• Loan terms and conditions</li>
              </ul>
            </div>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Beyond the Numbers</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Prepayment penalties</li>
                <li>• Fixed vs variable rates</li>
                <li>• Lender reputation and service</li>
                <li>• Loan flexibility options</li>
                <li>• Processing time and convenience</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding APR vs Interest Rate</h3>
          <div className="bg-gray-50 rounded-xl p-5 mb-3 sm:mb-4 md:mb-6">
            <p className="text-gray-700 text-sm mb-3">
              <strong>Interest Rate:</strong> The cost of borrowing the principal, expressed as a percentage.
            </p>
            <p className="text-gray-700 text-sm mb-3">
              <strong>APR (Annual Percentage Rate):</strong> Includes the interest rate PLUS fees and other costs, giving you the true cost of borrowing.
            </p>
            <p className="text-gray-600 text-sm">
              Always compare APRs, not just interest rates. A loan with a lower rate but higher fees might actually cost more than a slightly higher-rate loan with minimal fees.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Factors in Your Decision</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800">Total Cost Over Loan Term</h4>
              <p className="text-gray-600 text-sm">The most important number for long-term loans. This includes all payments plus upfront fees.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800">Monthly Payment Affordability</h4>
              <p className="text-gray-600 text-sm">Ensure the payment fits comfortably in your budget with room for emergencies.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-800">Break-Even Point</h4>
              <p className="text-gray-600 text-sm">When comparing loans with different fee structures, calculate how long until savings offset higher upfront costs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Should I always choose the loan with the lowest interest rate?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Not necessarily. A loan with a lower interest rate but higher upfront fees might cost more overall than a slightly higher-rate loan with lower fees. This is especially true if you plan to sell or refinance within a few years—you may not stay in the loan long enough to recoup the higher fees. Always compare total costs and consider your timeline.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What fees should I look for when comparing loans?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Common fees include origination fees (0.5-1% of loan amount), appraisal fees ($300-500), title insurance, attorney fees, and points (prepaid interest to lower your rate). Some lenders also charge application fees, underwriting fees, or processing fees. Ask each lender for a Loan Estimate form to see all fees in a standardized format.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How many lenders should I compare?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Experts recommend getting quotes from at least 3-5 lenders, including banks, credit unions, and online lenders. Each type may offer different advantages. Credit inquiries for mortgage shopping within a 14-45 day window (depending on the scoring model) are typically treated as a single inquiry, so shopping around won&apos;t hurt your credit score.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Is a 15-year loan always better than a 30-year loan?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A 15-year loan typically has lower interest rates and saves tens of thousands in interest, but the higher monthly payment may strain your budget. A 30-year loan offers flexibility—you can always pay extra toward principal to pay it off faster while having lower required payments during tight months. Choose based on your financial stability and other goals.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What is a &quot;no-closing-cost&quot; loan and is it worth it?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              No-closing-cost loans roll the closing costs into either a higher interest rate or the loan balance. While you pay less upfront, you pay more over time. These can make sense if you plan to sell or refinance within 3-5 years, as you may not stay long enough for the higher rate to cost more than the upfront savings. For long-term homeownership, paying closing costs typically saves money.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="loan-comparison-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
