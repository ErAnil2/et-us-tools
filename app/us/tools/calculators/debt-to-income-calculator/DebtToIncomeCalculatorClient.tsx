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
    question: "What is a Debt To Income Calculator?",
    answer: "A Debt To Income Calculator is a free online tool that helps you calculate and analyze debt to income-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Debt To Income Calculator?",
    answer: "Our Debt To Income Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Debt To Income Calculator free to use?",
    answer: "Yes, this Debt To Income Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Debt To Income calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to debt to income such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function DebtToIncomeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('debt-to-income-calculator');

  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [mortgage, setMortgage] = useState(1200);
  const [carPayment, setCarPayment] = useState(400);
  const [creditCards, setCreditCards] = useState(200);
  const [otherDebts, setOtherDebts] = useState(100);
  
  const [results, setResults] = useState({
    totalDebt: 0,
    dtiRatio: 0,
    category: '',
    color: ''
  });

  useEffect(() => {
    calculate();
  }, [monthlyIncome, mortgage, carPayment, creditCards, otherDebts]);

  const calculate = () => {
    const totalDebt = mortgage + carPayment + creditCards + otherDebts;
    const dtiRatio = (totalDebt / monthlyIncome) * 100;
    
    let category = '';
    let color = '';
    
    if (dtiRatio <= 36) {
      category = 'Excellent';
      color = 'green';
    } else if (dtiRatio <= 43) {
      category = 'Good';
      color = 'blue';
    } else if (dtiRatio <= 50) {
      category = 'Fair';
      color = 'yellow';
    } else {
      category = 'Poor';
      color = 'red';
    }

    setResults({ totalDebt, dtiRatio, category, color });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Debt to Income Calculator')}</h1>
          <p className="text-lg text-gray-600">Calculate your DTI ratio</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Income & Debts</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gross Monthly Income ($)</label>
                <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Monthly Debt Payments</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mortgage/Rent ($)</label>
                    <input type="number" value={mortgage} onChange={(e) => setMortgage(Number(e.target.value))} 
                      min="0" className="w-full px-2 py-2 border rounded-lg" />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Car Payment ($)</label>
                    <input type="number" value={carPayment} onChange={(e) => setCarPayment(Number(e.target.value))} 
                      min="0" className="w-full px-2 py-2 border rounded-lg" />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Credit Cards ($)</label>
                    <input type="number" value={creditCards} onChange={(e) => setCreditCards(Number(e.target.value))} 
                      min="0" className="w-full px-2 py-2 border rounded-lg" />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Other Debts ($)</label>
                    <input type="number" value={otherDebts} onChange={(e) => setOtherDebts(Number(e.target.value))} 
                      min="0" className="w-full px-2 py-2 border rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your DTI Ratio</h3>
              
              <div className={`bg-${results.color}-100 rounded-lg p-6 text-center mb-4`}>
                <div className="text-5xl font-bold mb-2" style={{color: results.color === 'green' ? '#059669' : results.color === 'blue' ? '#2563eb' : results.color === 'yellow' ? '#d97706' : '#dc2626'}}>
                  {results.dtiRatio.toFixed(1)}%
                </div>
                <div className="text-lg font-semibold" style={{color: results.color === 'green' ? '#059669' : results.color === 'blue' ? '#2563eb' : results.color === 'yellow' ? '#d97706' : '#dc2626'}}>
                  {results.category}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Total Monthly Debt:</span>
                  <span className="font-semibold">${results.totalDebt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Monthly Income:</span>
                  <span className="font-semibold">${monthlyIncome.toLocaleString()}</span>
                </div>
</div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="p-2 bg-green-50 rounded">
                  <strong>Excellent (≤36%):</strong> Great for mortgage approval
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <strong>Good (37-43%):</strong> May qualify for loans
                </div>
                <div className="p-2 bg-yellow-50 rounded">
                  <strong>Fair (44-50%):</strong> Difficult to get loans
                </div>
                <div className="p-2 bg-red-50 rounded">
                  <strong>Poor (&gt;50%):</strong> High debt burden
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Financial Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-white border hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="text-2xl mb-2">🧮</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Debt-to-Income Ratio</h2>
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Your debt-to-income (DTI) ratio is a key financial metric that lenders use to assess your ability to manage monthly payments
            and repay borrowed money. It compares your total monthly debt payments to your gross monthly income, expressed as a percentage.
            Understanding and managing your DTI is crucial for qualifying for mortgages, auto loans, and other forms of credit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Excellent (≤36%)</h3>
              <p className="text-sm text-gray-600">Ideal for mortgage approval. Shows strong financial health and low credit risk.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Acceptable (37-43%)</h3>
              <p className="text-sm text-gray-600">May qualify for most loans. Some lenders allow up to 43% for qualified mortgages.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">High (&gt;50%)</h3>
              <p className="text-sm text-gray-600">Difficult to obtain credit. Focus on paying down debt before new borrowing.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">DTI Formula</h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm mb-3">
                <p><strong>DTI = (Total Monthly Debt / Gross Monthly Income) × 100</strong></p>
              </div>
              <p className="text-sm text-gray-600">
                Include all recurring debt payments: mortgage/rent, car loans, student loans, credit card minimums, and other monthly obligations.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Lower Your DTI</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Pay down existing debt, especially high-interest credit cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Increase your income through raises, side jobs, or promotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Avoid taking on new debt before major purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Refinance high-interest loans to lower monthly payments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What is the maximum DTI for a mortgage?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most conventional mortgage lenders prefer a DTI of 36% or less, with no more than 28% going toward housing costs (known as
                the &quot;front-end&quot; ratio). However, qualified mortgages allow up to 43% DTI. FHA loans may accept DTIs up to 50% with strong
                compensating factors like high credit scores or significant cash reserves. VA loans have no official DTI limit but typically
                require residual income calculations instead.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What debts are included in DTI calculation?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                DTI includes all recurring monthly debt obligations: mortgage or rent payments, car loans, student loans, minimum credit
                card payments, personal loans, child support, alimony, and any other debt with a monthly payment. It does NOT include
                utilities, insurance, phone bills, groceries, or other living expenses. Only debts that appear on your credit report or
                require monthly payments count toward the calculation.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What&apos;s the difference between front-end and back-end DTI?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Front-end DTI (also called housing ratio) only includes housing costs—mortgage principal, interest, taxes, insurance,
                and HOA fees. Lenders typically want this under 28%. Back-end DTI (total DTI) includes all monthly debt obligations.
                When people refer to DTI without specifying, they usually mean back-end DTI. Lenders evaluate both ratios when approving
                mortgages, with different thresholds for each.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">Does DTI affect my credit score?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No, DTI does not directly affect your credit score. Credit bureaus don&apos;t know your income, so they can&apos;t calculate
                your DTI. However, DTI and credit scores are related indirectly—high debt balances that contribute to high DTI also
                increase your credit utilization ratio, which DOES impact your score. Both metrics are important to lenders, but they
                measure different aspects of your financial health.
              </p>
            </div>

            <div>
              <h3 className="text-base font-medium text-gray-800 mb-2">How quickly can I improve my DTI ratio?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                You can improve your DTI immediately by either increasing income or paying down debt. Quick wins include paying off a car
                loan (instantly removes that payment from calculations) or paying down credit card balances to reduce minimum payments.
                Getting a raise or taking a higher-paying job also instantly improves your ratio. For mortgage applications, aim to start
                improving your DTI at least 3-6 months before applying to show consistent financial improvement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="debt-to-income-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
