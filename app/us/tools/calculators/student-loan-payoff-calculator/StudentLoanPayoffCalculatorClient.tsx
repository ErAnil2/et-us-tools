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

interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  monthlyPayment: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Student Loan Payoff Calculator?",
    answer: "A Student Loan Payoff Calculator is a free online tool that helps you calculate and analyze student loan payoff-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Student Loan Payoff Calculator?",
    answer: "Our Student Loan Payoff Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Student Loan Payoff Calculator free to use?",
    answer: "Yes, this Student Loan Payoff Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Student Loan Payoff calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to student loan payoff such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function StudentLoanPayoffCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('student-loan-payoff-calculator');

  const [loanBalance, setLoanBalance] = useState(30000);
  const [interestRate, setInterestRate] = useState(6.8);
  const [loanTerm, setLoanTerm] = useState(10);
  const [extraPayment, setExtraPayment] = useState(100);

  const [standardResults, setStandardResults] = useState<PayoffResult>({
    months: 0,
    totalInterest: 0,
    totalPaid: 0,
    monthlyPayment: 0
  });
  const [extraResults, setExtraResults] = useState<PayoffResult>({
    months: 0,
    totalInterest: 0,
    totalPaid: 0,
    monthlyPayment: 0
  });

  useEffect(() => {
    calculatePayoff();
  }, [loanBalance, interestRate, loanTerm, extraPayment]);

  const calculateMonthlyPayment = (principal: number, monthlyRate: number, months: number): number => {
    if (monthlyRate === 0) {
      return principal / months;
    }
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const calculatePayoffWithExtraPayment = (
    principal: number,
    monthlyRate: number,
    monthlyPayment: number,
    extraAmount: number
  ): PayoffResult => {
    let currentBalance = principal;
    let months = 0;
    let totalInterest = 0;
    const totalMonthlyPayment = monthlyPayment + extraAmount;

    while (currentBalance > 0.01 && months < 1000) {
      const interestPayment = currentBalance * monthlyRate;
      const principalPayment = Math.min(totalMonthlyPayment - interestPayment, currentBalance);

      totalInterest += interestPayment;
      currentBalance -= principalPayment;
      months++;
    }

    return {
      months,
      totalInterest,
      totalPaid: principal + totalInterest,
      monthlyPayment: totalMonthlyPayment
    };
  };

  const calculatePayoff = () => {
    if (loanBalance <= 0 || interestRate < 0 || loanTerm <= 0) {
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numberOfMonths = loanTerm * 12;
    const monthlyPayment = calculateMonthlyPayment(loanBalance, monthlyRate, numberOfMonths);

    // Standard repayment
    const standardTotalPaid = monthlyPayment * numberOfMonths;
    const standardTotalInterest = standardTotalPaid - loanBalance;

    setStandardResults({
      months: numberOfMonths,
      totalInterest: standardTotalInterest,
      totalPaid: standardTotalPaid,
      monthlyPayment: monthlyPayment
    });

    // With extra payments
    const extraPayoffResult = calculatePayoffWithExtraPayment(
      loanBalance,
      monthlyRate,
      monthlyPayment,
      extraPayment
    );

    setExtraResults(extraPayoffResult);
  };

  const formatTime = (months: number): string => {
    if (months === 0) return '-';

    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mo`;
    }
  };

  const formatCurrency = (amount: number): string => {
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const formatCurrencyDetailed = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Student Loan Payoff Calculator')}</h1>
        <p className="text-lg text-gray-600">
          Calculate your student loan payoff time and see how extra payments can help you save thousands in interest
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loan Information</h2>

            <div>
              <label htmlFor="loanBalance" className="block text-sm font-medium text-gray-700 mb-2">
                Total Loan Balance: {formatCurrency(loanBalance)}
              </label>
              <input
                id="loanBalance"
                type="range"
                min="5000"
                max="200000"
                step="1000"
                value={loanBalance}
                onChange={(e) => setLoanBalance(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$5K</span>
                <span>$200K</span>
              </div>
            </div>

            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate: {interestRate.toFixed(2)}% per year
              </label>
              <input
                id="interestRate"
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>15%</span>
              </div>
            </div>

            <div>
              <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term: {loanTerm} years
              </label>
              <input
                id="loanTerm"
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 year</span>
                <span>30 years</span>
              </div>
            </div>

            <div>
              <label htmlFor="extraPayment" className="block text-sm font-medium text-gray-700 mb-2">
                Extra Monthly Payment: {formatCurrency(extraPayment)}
              </label>
              <input
                id="extraPayment"
                type="range"
                min="0"
                max="1000"
                step="25"
                value={extraPayment}
                onChange={(e) => setExtraPayment(parseInt(e.target.value))}
                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$1,000</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Payoff Summary</h2>

            <div className="space-y-4">
              {/* Standard Payment */}
              <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                <div className="text-sm text-red-600 mb-2 font-medium">Standard Repayment Plan</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-red-700">Monthly Payment:</span>
                    <span className="text-2xl font-bold text-red-700">
                      {formatCurrencyDetailed(standardResults.monthlyPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-red-700">Payoff Time:</span>
                    <span className="font-semibold text-red-700">{formatTime(standardResults.months)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-red-700">Total Interest:</span>
                    <span className="font-semibold text-red-700">{formatCurrency(standardResults.totalInterest)}</span>
                  </div>
                </div>
              </div>

              {/* With Extra Payment */}
              <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-2 font-medium">With Extra Payments</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-700">Monthly Payment:</span>
                    <span className="text-2xl font-bold text-green-700">
                      {formatCurrencyDetailed(extraResults.monthlyPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-700">Payoff Time:</span>
                    <span className="font-semibold text-green-700">{formatTime(extraResults.months)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-700">Total Interest:</span>
                    <span className="font-semibold text-green-700">{formatCurrency(extraResults.totalInterest)}</span>
                  </div>
                </div>
              </div>

              {/* Savings */}
              <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-2 font-medium">Your Savings</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-700">Time Saved:</span>
                    <span className="text-xl font-bold text-blue-700">
                      {formatTime(standardResults.months - extraResults.months)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-700">Interest Saved:</span>
                    <span className="text-xl font-bold text-blue-700">
                      {formatCurrency(standardResults.totalInterest - extraResults.totalInterest)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Breakdown */}
              <div className="mt-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Payment Breakdown</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Standard Plan</div>
                    <div className="flex h-6 rounded-lg overflow-hidden">
                      <div
                        className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(loanBalance / standardResults.totalPaid) * 100}%` }}
                      >
                        {((loanBalance / standardResults.totalPaid) * 100).toFixed(0)}%
                      </div>
                      <div
                        className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(standardResults.totalInterest / standardResults.totalPaid) * 100}%` }}
                      >
                        {((standardResults.totalInterest / standardResults.totalPaid) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">With Extra Payments</div>
                    <div className="flex h-6 rounded-lg overflow-hidden">
                      <div
                        className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(loanBalance / extraResults.totalPaid) * 100}%` }}
                      >
                        {((loanBalance / extraResults.totalPaid) * 100).toFixed(0)}%
                      </div>
                      <div
                        className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(extraResults.totalInterest / extraResults.totalPaid) * 100}%` }}
                      >
                        {((extraResults.totalInterest / extraResults.totalPaid) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="flex items-center">
                      <span className="w-3 h-3 bg-blue-500 rounded mr-1"></span>
                      Principal: {formatCurrency(loanBalance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* MREC Banners */}
      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Detailed Comparison</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left border">Payment Plan</th>
                <th className="px-4 py-3 text-right border">Monthly Payment</th>
                <th className="px-4 py-3 text-right border">Payoff Time</th>
                <th className="px-4 py-3 text-right border">Total Interest</th>
                <th className="px-4 py-3 text-right border">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-red-50">
                <td className="px-4 py-3 border font-medium">Standard Repayment</td>
                <td className="px-4 py-3 text-right border">{formatCurrencyDetailed(standardResults.monthlyPayment)}</td>
                <td className="px-4 py-3 text-right border">{formatTime(standardResults.months)}</td>
                <td className="px-4 py-3 text-right border">{formatCurrency(standardResults.totalInterest)}</td>
                <td className="px-4 py-3 text-right border">{formatCurrency(standardResults.totalPaid)}</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-4 py-3 border font-medium">With Extra Payments</td>
                <td className="px-4 py-3 text-right border">{formatCurrencyDetailed(extraResults.monthlyPayment)}</td>
                <td className="px-4 py-3 text-right border">{formatTime(extraResults.months)}</td>
                <td className="px-4 py-3 text-right border">{formatCurrency(extraResults.totalInterest)}</td>
                <td className="px-4 py-3 text-right border">{formatCurrency(extraResults.totalPaid)}</td>
              </tr>
              <tr className="bg-blue-50 font-semibold">
                <td className="px-4 py-3 border">Savings</td>
                <td className="px-4 py-3 text-right border">+{formatCurrency(extraPayment)}/mo</td>
                <td className="px-4 py-3 text-right border text-green-600">
                  {formatTime(standardResults.months - extraResults.months)}
                </td>
                <td className="px-4 py-3 text-right border text-green-600">
                  {formatCurrency(standardResults.totalInterest - extraResults.totalInterest)}
                </td>
                <td className="px-4 py-3 text-right border text-green-600">
                  {formatCurrency(standardResults.totalPaid - extraResults.totalPaid)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Student Loan Repayment</h2>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            Student loan repayment can be overwhelming, but understanding how your payments work is the first step toward
            becoming debt-free. The calculator above shows how even small extra payments can significantly reduce your total
            interest and help you pay off your loans faster.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">How It Works</h3>
          <p className="mb-4">
            Each monthly payment consists of two parts: principal (the original amount borrowed) and interest (the cost of
            borrowing). Early in your repayment period, a larger portion goes toward interest. As you pay down the balance,
            more goes toward the principal. Extra payments go directly toward your principal, reducing future interest charges.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Repayment Strategies</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 my-6">
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="font-semibold text-purple-800 mb-2">Avalanche Method</h4>
              <p className="text-sm text-gray-700">
                Pay minimums on all loans, put extra toward the loan with the highest interest rate. Saves the most money on interest.
              </p>
            </div>
            <div className="border border-teal-200 rounded-lg p-4 bg-teal-50">
              <h4 className="font-semibold text-teal-800 mb-2">Snowball Method</h4>
              <p className="text-sm text-gray-700">
                Pay minimums on all loans, put extra toward the smallest balance. Provides quick wins and psychological motivation.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Tips to Pay Off Student Loans Faster</h3>
          <ul className="space-y-2 list-none">
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>Make extra payments whenever possible, even $25-$50 can make a difference</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>Set up automatic payments to get a 0.25% interest rate reduction</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>Consider making bi-weekly payments instead of monthly</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>Use windfalls like tax refunds or bonuses for extra payments</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>Refinance if you can get a lower interest rate (but be cautious with federal loans)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>Look into employer student loan repayment assistance programs</span>
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Important Considerations</h3>
          <ul className="space-y-2 list-none">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>Federal loans offer benefits like income-driven repayment and loan forgiveness programs</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>Private loans typically have fewer protections but may offer lower rates</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>Build an emergency fund before aggressively paying down low-interest student loans</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>Balance loan repayment with retirement savings and other financial goals</span>
            </li>
          </ul>
        </div>
      </div>
{/* Mobile MREC2 - Before FAQs */}

<CalculatorMobileMrec2 />


{/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much can I save by making extra payments on my student loans?</h3>
            <p className="text-gray-600 leading-relaxed">
              The savings depend on your loan balance, interest rate, and extra payment amount. For example, on a $30,000 loan at 6.8% over 10 years, adding just $100 extra per month can save you approximately $2,500-$3,500 in interest and pay off your loan 2-3 years early. The higher your interest rate, the more dramatic the savings from extra payments.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I pay off student loans or invest the money instead?</h3>
            <p className="text-gray-600 leading-relaxed">
              Compare your loan interest rate to expected investment returns. If your student loan rate is above 6-7%, paying it off often makes sense since it&apos;s a guaranteed &quot;return.&quot; However, always get your employer&apos;s 401(k) match first—that&apos;s free money. For lower-rate federal loans (under 5%), investing may yield higher long-term returns, but paying off debt provides peace of mind and reduces financial risk.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What&apos;s the difference between the avalanche and snowball methods?</h3>
            <p className="text-gray-600 leading-relaxed">
              The avalanche method targets the highest-interest loan first, minimizing total interest paid. The snowball method targets the smallest balance first, providing quick psychological wins. Mathematically, avalanche saves more money, but snowball&apos;s motivation factor helps some people stick to their plan. Choose based on whether you&apos;re motivated by savings or by seeing loans disappear quickly.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I refinance my federal student loans?</h3>
            <p className="text-gray-600 leading-relaxed">
              Refinancing federal loans into private loans can lower your interest rate but you&apos;ll lose federal benefits like income-driven repayment plans, loan forgiveness programs (including PSLF), and deferment/forbearance options. Only refinance federal loans if you have stable income, good credit, don&apos;t qualify for forgiveness, and the rate reduction is significant. You can refinance private loans without losing these benefits since they don&apos;t have them.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Do I qualify for Public Service Loan Forgiveness (PSLF)?</h3>
            <p className="text-gray-600 leading-relaxed">
              PSLF forgives remaining federal Direct Loan balances after 120 qualifying monthly payments while working full-time for a qualifying employer (government organizations, non-profits, certain public service roles). You must be on an income-driven repayment plan. If you qualify, prioritize PSLF over aggressive repayment—making minimum payments maximizes the forgiven amount. Use the PSLF Help Tool at studentaid.gov to check eligibility.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">What happens if I can&apos;t afford my student loan payments?</h3>
            <p className="text-gray-600 leading-relaxed">
              For federal loans, apply for an income-driven repayment (IDR) plan like SAVE, PAYE, or IBR, which cap payments at 10-20% of discretionary income. You can also request deferment or forbearance for temporary relief. For private loans, contact your lender about hardship programs. Never ignore payments—defaulting damages your credit, can lead to wage garnishment, and makes the situation much worse. There are always options if you act proactively.
            </p>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Financial Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">🎓</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="student-loan-payoff-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
