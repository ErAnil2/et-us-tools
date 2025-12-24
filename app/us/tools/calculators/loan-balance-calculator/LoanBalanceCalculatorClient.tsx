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
    question: "What is a Loan Balance Calculator?",
    answer: "A Loan Balance Calculator is a free online tool that helps you calculate and analyze loan balance-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Loan Balance Calculator?",
    answer: "Our Loan Balance Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Loan Balance Calculator free to use?",
    answer: "Yes, this Loan Balance Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Loan Balance calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to loan balance such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function LoanBalanceCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('loan-balance-calculator');

  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [paymentsMade, setPaymentsMade] = useState(60);
  const [extraPayment, setExtraPayment] = useState(0);

  const [results, setResults] = useState({
    monthlyPayment: 0,
    remainingBalance: 0,
    principalPaid: 0,
    interestPaid: 0,
    totalPaid: 0,
    remainingPayments: 0,
    percentPaid: 0
  });

  useEffect(() => {
    calculateBalance();
  }, [loanAmount, interestRate, loanTerm, paymentsMade, extraPayment]);

  const calculateBalance = () => {
    const principal = Math.max(0, loanAmount);
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const payments = Math.min(Math.max(0, paymentsMade), numPayments);

    // Calculate monthly payment
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = principal / numPayments;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                      (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    // Calculate remaining balance and breakdown
    let balance = principal;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let i = 0; i < payments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment + extraPayment;

      totalInterestPaid += interestPayment;
      totalPrincipalPaid += principalPayment;
      balance -= principalPayment;

      if (balance <= 0) {
        balance = 0;
        break;
      }
    }

    const totalPaid = totalPrincipalPaid + totalInterestPaid;
    const remainingPayments = numPayments - payments;
    const percentPaid = (totalPrincipalPaid / principal) * 100;

    setResults({
      monthlyPayment,
      remainingBalance: Math.max(0, balance),
      principalPaid: totalPrincipalPaid,
      interestPaid: totalInterestPaid,
      totalPaid,
      remainingPayments: Math.max(0, remainingPayments),
      percentPaid
    });
  };

  const handleTemplate = (amount: number, rate: number, term: number, payments: number) => {
    setLoanAmount(amount);
    setInterestRate(rate);
    setLoanTerm(term);
    setPaymentsMade(payments);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Loan Balance Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate your remaining loan balance with detailed payment breakdown</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loan Information</h2>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button type="button" onClick={() => handleTemplate(200000, 5.5, 30, 12)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">1 Year In ($200K)</button>
                <button type="button" onClick={() => handleTemplate(300000, 6.5, 30, 60)} className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">5 Years In ($300K)</button>
                <button type="button" onClick={() => handleTemplate(400000, 7.0, 30, 120)} className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">10 Years In ($400K)</button>
                <button type="button" onClick={() => handleTemplate(500000, 6.0, 30, 180)} className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">15 Years In ($500K)</button>
                <button type="button" onClick={() => handleTemplate(250000, 5.0, 15, 60)} className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">15-Yr Loan ($250K)</button>
                <button type="button" onClick={() => handleTemplate(100000, 8.0, 10, 24)} className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Personal Loan ($100K)</button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (Annual %)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="30"
                  step="0.125"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term (Years)</label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payments Made</label>
                <input
                  type="number"
                  value={paymentsMade}
                  onChange={(e) => setPaymentsMade(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max={loanTerm * 12}
                />
                <p className="text-xs text-gray-500 mt-1">Number of monthly payments already made</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extra Monthly Payment (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Loan Balance Results</h3>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 md:p-6 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">{formatCurrency(results.remainingBalance)}</div>
                <div className="text-sm text-blue-600 mb-4">Remaining Balance</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly Payment:</span>
                  <span className="font-semibold">{formatCurrency(results.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payments Made:</span>
                  <span className="font-semibold">{paymentsMade} of {loanTerm * 12}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payments Remaining:</span>
                  <span className="font-semibold">{results.remainingPayments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Progress:</span>
                  <span className="font-semibold">{results.percentPaid.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Payment Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Principal Paid:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(results.principalPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Paid:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(results.interestPaid)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Paid:</span>
                  <span>{formatCurrency(results.totalPaid)}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">Loan Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Original Amount:</span>
                  <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Balance:</span>
                  <span className="font-semibold">{formatCurrency(results.remainingBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Percent Paid Off:</span>
                  <span className="font-semibold text-green-600">{results.percentPaid.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Years Remaining:</span>
                  <span className="font-semibold">{(results.remainingPayments / 12).toFixed(1)} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

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
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Your Loan Balance</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Your loan balance represents the amount you still owe on a loan at any given time. Understanding how your balance changes over time is crucial for financial planning, whether you&apos;re considering refinancing, selling your home, or simply tracking your progress toward debt freedom. This calculator shows you exactly where you stand in your loan repayment journey.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Principal Payments</h4>
              <p className="text-green-700 text-sm leading-relaxed">
                Principal payments reduce your loan balance directly. Early in the loan, a smaller portion goes to principal due to amortization. Over time, more of your payment reduces the balance as interest decreases.
              </p>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Interest Payments</h4>
              <p className="text-blue-700 text-sm leading-relaxed">
                Interest is calculated on your remaining balance monthly. Early payments are mostly interest because the balance is highest. As your balance decreases, so does the interest portion of each payment.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">The Loan Amortization Formula</h3>
          <div className="bg-gray-50 rounded-xl p-5 mb-3 sm:mb-4 md:mb-6">
            <p className="font-mono text-sm text-gray-700 mb-3">
              Remaining Balance = P × [(1+r)^n - (1+r)^p] / [(1+r)^n - 1]
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>P</strong> = Original principal (loan amount)</p>
              <p><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</p>
              <p><strong>n</strong> = Total number of payments</p>
              <p><strong>p</strong> = Number of payments already made</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ways to Pay Off Your Loan Faster</h3>
          <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800">Extra Monthly Payments</h4>
              <p className="text-gray-600 text-sm">Making additional principal payments each month can significantly reduce your loan term and total interest paid. Even $100 extra monthly can save years off a mortgage.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800">Biweekly Payments</h4>
              <p className="text-gray-600 text-sm">Paying half your monthly payment every two weeks results in 13 full payments per year instead of 12, shaving years off your loan.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-800">Lump Sum Payments</h4>
              <p className="text-gray-600 text-sm">Apply windfalls, bonuses, or tax refunds directly to your principal to reduce your balance faster and save on interest.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-800">Refinancing Options</h4>
              <p className="text-gray-600 text-sm">If rates have dropped, refinancing to a lower rate or shorter term can reduce your total interest and build equity faster.</p>
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
            <h3 className="text-base font-semibold text-gray-800 mb-2">Why is my loan balance decreasing so slowly at first?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              This is due to how loan amortization works. In the early years, most of your payment goes toward interest because interest is calculated on your remaining balance, which is highest at the start. For a 30-year mortgage, you might pay mostly interest for the first 10+ years. As you pay down the principal, more of each payment goes toward reducing your balance.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How can I find out my current loan balance?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              You can find your current loan balance by checking your most recent mortgage statement, logging into your lender&apos;s online portal, or calling your loan servicer directly. This calculator provides an estimate based on your original loan terms and payments made—your actual balance may differ slightly due to escrow changes or rate adjustments.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What is loan-to-value (LTV) ratio and why does it matter?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              LTV ratio is your loan balance divided by your home&apos;s current value. It matters because lenders use it to assess risk. An LTV above 80% typically requires private mortgage insurance (PMI). When your LTV drops below 80%, you can request PMI removal. LTV also affects refinancing options and home equity borrowing.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Should I pay extra toward principal or invest the money instead?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              This depends on your interest rate and investment returns. If your mortgage rate is 7% and you expect 8-10% investment returns, investing might make more sense mathematically. However, paying down your mortgage provides guaranteed &quot;returns&quot; equal to your interest rate and reduces risk. Many people split the difference—making some extra payments while also investing.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How does refinancing affect my loan balance?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Refinancing replaces your current loan with a new one. Your new loan balance includes any remaining principal plus closing costs (if rolled into the loan). While your balance might increase slightly due to fees, a lower rate can still save money long-term. Consider how long you plan to stay in the home—you need to stay long enough to recoup closing costs through monthly savings.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="loan-balance-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
