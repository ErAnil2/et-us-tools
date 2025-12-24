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
    question: "What is a Loan To Value Calculator?",
    answer: "A Loan To Value Calculator is a free online tool that helps you calculate and analyze loan to value-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Loan To Value Calculator?",
    answer: "Our Loan To Value Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Loan To Value Calculator free to use?",
    answer: "Yes, this Loan To Value Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Loan To Value calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to loan to value such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function LoanToValueCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('loan-to-value-calculator');

  const [purchasePrice, setPurchasePrice] = useState(400000);
  const [loanAmount, setLoanAmount] = useState(320000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);

  const [results, setResults] = useState({
    ltv: 0,
    downPayment: 0,
    equity: 0,
    pmiRequired: false,
    ltvCategory: ''
  });

  useEffect(() => {
    calculateLTV();
  }, [purchasePrice, loanAmount, downPaymentPercent]);

  const calculateLTV = () => {
    const price = Math.max(0, purchasePrice);
    const loan = Math.max(0, loanAmount);
    const downPct = Math.max(0, Math.min(100, downPaymentPercent));

    const ltv = price > 0 ? (loan / price) * 100 : 0;
    const downPayment = price - loan;
    const equity = downPayment;
    const pmiRequired = ltv > 80;

    let ltvCategory = '';
    if (ltv <= 80) ltvCategory = 'Excellent - No PMI Required';
    else if (ltv <= 85) ltvCategory = 'Good - PMI Required';
    else if (ltv <= 90) ltvCategory = 'Fair - Higher PMI';
    else if (ltv <= 95) ltvCategory = 'High Risk';
    else ltvCategory = 'Very High Risk';

    setResults({
      ltv,
      downPayment,
      equity,
      pmiRequired,
      ltvCategory
    });
  };

  const handleTemplate = (price: number, loan: number) => {
    setPurchasePrice(price);
    setLoanAmount(loan);
    const downPct = ((price - loan) / price) * 100;
    setDownPaymentPercent(downPct);
  };

  const syncFromPercent = (percent: number) => {
    const pct = Math.max(0, Math.min(100, percent));
    setDownPaymentPercent(pct);
    const newLoan = purchasePrice * (1 - pct / 100);
    setLoanAmount(newLoan);
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
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Loan-to-Value (LTV) Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate loan-to-value ratio to determine PMI requirements and equity position</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">LTV Calculator</h2>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Scenarios</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button type="button" onClick={() => handleTemplate(400000, 320000)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">80% LTV ($400K)</button>
                <button type="button" onClick={() => handleTemplate(500000, 450000)} className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">90% LTV ($500K)</button>
                <button type="button" onClick={() => handleTemplate(300000, 285000)} className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">95% LTV ($300K)</button>
                <button type="button" onClick={() => handleTemplate(250000, 200000)} className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Conservative ($250K)</button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Home Purchase Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1000"
                    step="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment Percentage</label>
                <input
                  type="number"
                  value={downPaymentPercent.toFixed(1)}
                  onChange={(e) => syncFromPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment Amount</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatCurrency(results.downPayment)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    readOnly
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Calculated automatically</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">LTV Results</h3>

            <div className={`p-6 rounded-xl mb-6 ${results.pmiRequired ? 'bg-orange-50 border-2 border-orange-300' : 'bg-green-50 border-2 border-green-300'}`}>
              <div className="text-center mb-4">
                <div className={`text-4xl font-bold mb-2 ${results.pmiRequired ? 'text-orange-700' : 'text-green-700'}`}>
                  {results.ltv.toFixed(2)}%
                </div>
                <div className="text-sm font-medium">Loan-to-Value Ratio</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold">{results.ltvCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span>PMI Required:</span>
                  <span className={`font-semibold ${results.pmiRequired ? 'text-red-600' : 'text-green-600'}`}>
                    {results.pmiRequired ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Equity & Down Payment</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Down Payment:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(results.downPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Home Equity:</span>
                  <span className="font-semibold">{formatCurrency(results.equity)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Equity Percentage:</span>
                  <span className="font-semibold">{downPaymentPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">LTV Guidelines</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>0-80%:</span>
                  <span className="font-semibold">Excellent (No PMI)</span>
                </div>
                <div className="flex justify-between">
                  <span>80-85%:</span>
                  <span className="font-semibold">Good (PMI req.)</span>
                </div>
                <div className="flex justify-between">
                  <span>85-90%:</span>
                  <span className="font-semibold">Fair (Higher PMI)</span>
                </div>
                <div className="flex justify-between">
                  <span>90-95%:</span>
                  <span className="font-semibold">High Risk</span>
                </div>
                <div className="flex justify-between">
                  <span>95%+:</span>
                  <span className="font-semibold">Very High Risk</span>
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Loan-to-Value (LTV) Ratio</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Loan-to-value ratio is one of the most important metrics lenders use to assess risk when approving a mortgage. It compares the loan amount to the property&apos;s appraised value, expressed as a percentage. A lower LTV means you have more equity in your home and represents less risk to the lender, which can result in better loan terms.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Why LTV Matters</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Determines PMI requirements (over 80%)</li>
                <li>• Affects interest rates offered</li>
                <li>• Impacts loan approval odds</li>
                <li>• Influences refinancing options</li>
                <li>• Determines available equity for HELOCs</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">How to Improve Your LTV</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Make a larger down payment</li>
                <li>• Pay down loan principal faster</li>
                <li>• Benefit from home value appreciation</li>
                <li>• Make value-adding improvements</li>
                <li>• Request a new appraisal if values rose</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">LTV Formula</h3>
          <div className="bg-gray-50 p-5 rounded-xl mb-3 sm:mb-4 md:mb-6">
            <p className="text-center text-lg font-mono">
              LTV = (Loan Amount / Property Value) × 100
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              Example: $320,000 loan / $400,000 value = 80% LTV
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">LTV Impact on Your Mortgage</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800">80% LTV or Below</h4>
              <p className="text-gray-600 text-sm">No PMI required, best interest rates, easiest approval, and access to most loan products.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-gray-800">80-90% LTV</h4>
              <p className="text-gray-600 text-sm">PMI required but manageable premiums. Slightly higher rates but still widely available financing.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-gray-800">90% LTV and Above</h4>
              <p className="text-gray-600 text-sm">Higher PMI costs, more limited loan options, and higher interest rates due to increased lender risk.</p>
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
            <h3 className="text-base font-semibold text-gray-800 mb-2">What is considered a good LTV ratio?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              An LTV of 80% or lower is generally considered good because it means you have at least 20% equity in your home. This eliminates the need for private mortgage insurance (PMI) and typically qualifies you for the best interest rates. An LTV of 80% also means you have a buffer against potential home value declines.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What is PMI and when can I remove it?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Private Mortgage Insurance (PMI) protects the lender if you default on a conventional loan with less than 20% equity. PMI typically costs 0.5-1.5% of the loan amount annually. You can request PMI removal when your LTV reaches 80% through payments, or it&apos;s automatically cancelled at 78% LTV. You can also remove PMI early if your home has appreciated enough to reach 80% LTV with a new appraisal.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How does LTV affect refinancing options?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Lower LTV gives you more refinancing options and better rates. Most conventional refinancing requires 80% LTV or less for the best terms. With higher LTV, you may need to pay PMI even on a refinance. Some programs like FHA Streamline or VA IRRRL allow refinancing with higher LTV, but conventional cash-out refinancing typically requires 80% LTV or lower.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What&apos;s the difference between LTV and CLTV?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              LTV (Loan-to-Value) considers only your first mortgage. CLTV (Combined Loan-to-Value) includes all loans secured by the property—first mortgage, second mortgage, HELOC, etc. Lenders look at CLTV when you apply for additional financing. For example, if your first mortgage is at 70% LTV and you want a HELOC for 15%, your CLTV would be 85%.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Can I buy a home with a high LTV?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Yes, but it typically costs more. Conventional loans allow up to 97% LTV (3% down), FHA loans allow 96.5% LTV (3.5% down), and VA loans allow 100% LTV for eligible veterans. However, higher LTV means higher PMI costs, higher interest rates, and starting with negative or minimal equity. It also increases your risk if home values decline.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="loan-to-value-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
