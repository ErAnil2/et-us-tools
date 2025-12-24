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
    question: "What is a Cash Flow Calculator?",
    answer: "A Cash Flow Calculator is a free online tool designed to help you quickly and accurately calculate cash flow-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Cash Flow Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Cash Flow Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Cash Flow Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CashFlowCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('cash-flow-calculator');

  const [revenue, setRevenue] = useState(100000);
  const [expenses, setExpenses] = useState(70000);
  const [investments, setInvestments] = useState(10000);
  const [financing, setFinancing] = useState(5000);
  
  const [results, setResults] = useState({
    operatingCashFlow: 0,
    investingCashFlow: 0,
    financingCashFlow: 0,
    netCashFlow: 0
  });

  useEffect(() => {
    const operating = revenue - expenses;
    const investing = -investments;
    const financingFlow = financing;
    const net = operating + investing + financingFlow;

    setResults({
      operatingCashFlow: operating,
      investingCashFlow: investing,
      financingCashFlow: financingFlow,
      netCashFlow: net
    });
  }, [revenue, expenses, investments, financing]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Cash Flow Calculator')}</h1>
          <p className="text-lg text-gray-600">Calculate business cash flow</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue ($)</label>
                <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating Expenses ($)</label>
                <input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investments ($)</label>
                <input type="number" value={investments} onChange={(e) => setInvestments(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Financing ($)</label>
                <input type="number" value={financing} onChange={(e) => setFinancing(Number(e.target.value))} 
                  min="0" className="w-full px-2 py-3 border rounded-lg" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">Results</h3>
              <div className="space-y-3">
                <div className="bg-green-100 rounded-lg p-4">
                  <div className="text-sm text-green-700">Operating Cash Flow</div>
                  <div className="text-2xl font-bold text-green-600">${results.operatingCashFlow.toLocaleString()}</div>
                </div>
                <div className="bg-blue-100 rounded-lg p-4">
                  <div className="text-sm text-blue-700">Investing Cash Flow</div>
                  <div className="text-2xl font-bold text-blue-600">${results.investingCashFlow.toLocaleString()}</div>
                </div>
                <div className="bg-purple-100 rounded-lg p-4">
                  <div className="text-sm text-purple-700">Financing Cash Flow</div>
                  <div className="text-2xl font-bold text-purple-600">${results.financingCashFlow.toLocaleString()}</div>
                </div>
                <div className={`${results.netCashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg p-4`}>
                  <div className={`text-sm ${results.netCashFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net Cash Flow</div>
                  <div className={`text-3xl font-bold ${results.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${results.netCashFlow.toLocaleString()}
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
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

        {/* SEO Content */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Cash Flow Analysis</h2>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
              Cash flow is the lifeblood of any business. It represents the movement of money in and out of your company and is crucial for understanding financial health. Unlike profit, which is an accounting concept, cash flow shows the actual money available to pay bills, invest in growth, and weather unexpected challenges.
            </p>

            <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
              <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                <h4 className="font-semibold text-green-800 mb-2">Operating Cash Flow</h4>
                <p className="text-sm text-green-700">Cash generated from core business activities like sales revenue minus operating expenses. Positive operating cash flow indicates a sustainable business model.</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2">Investing Cash Flow</h4>
                <p className="text-sm text-blue-700">Cash spent on or received from investments like equipment, property, or acquisitions. Negative is often healthy for growing businesses investing in assets.</p>
              </div>
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-2">Financing Cash Flow</h4>
                <p className="text-sm text-purple-700">Cash from investors, loans, or paid to shareholders. Includes debt payments, dividends, and capital raised from equity or debt financing.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">The Cash Flow Formula</h3>
            <div className="bg-gray-50 p-5 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <p className="font-mono text-sm text-gray-700 mb-2">
                Net Cash Flow = Operating CF + Investing CF + Financing CF
              </p>
              <p className="text-sm text-gray-600">
                Positive net cash flow means more money coming in than going out—essential for business survival and growth.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cash Flow Management Tips</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-800">Invoice promptly</strong>
                  <p className="text-sm text-gray-600">Send invoices immediately and follow up on overdue payments.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-800">Manage payables</strong>
                  <p className="text-sm text-gray-600">Pay bills on time but use the full payment terms available.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-800">Build reserves</strong>
                  <p className="text-sm text-gray-600">Maintain 3-6 months of operating expenses as a cash buffer.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <strong className="text-gray-800">Forecast regularly</strong>
                  <p className="text-sm text-gray-600">Project cash flow monthly to anticipate shortfalls early.</p>
                </div>
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
              <h3 className="text-base font-semibold text-gray-800 mb-2">What&apos;s the difference between cash flow and profit?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Profit is an accounting measure (revenue minus expenses), while cash flow is actual money movement. A company can be profitable but have negative cash flow if customers pay late or inventory ties up cash. Conversely, a company might have positive cash flow but negative profit during growth phases with high depreciation. Both metrics matter for different reasons.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Why is cash flow more important than profit for small businesses?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Small businesses can&apos;t survive without cash to pay employees, suppliers, and rent—regardless of what their profit and loss statement shows. Many profitable businesses fail due to cash flow problems, especially during rapid growth when they must pay for inventory and labor before receiving customer payments. Cash flow determines day-to-day survival.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">What is a healthy cash flow ratio?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A cash flow coverage ratio above 1.0 means you generate enough cash to cover debt payments. Healthy businesses typically have ratios of 1.5-2.0 or higher. For operating cash flow margin (operating cash flow ÷ revenue), 15-25% is generally considered good, though this varies significantly by industry.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">How can I improve negative cash flow?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Accelerate receivables by offering early payment discounts, requiring deposits, or tightening credit terms. Slow payables by negotiating longer terms with suppliers. Reduce inventory levels, cut unnecessary expenses, and consider invoice factoring for immediate cash. For longer-term fixes, reassess pricing and operating efficiency.
              </p>
            </div>

            <div className="pb-2">
              <h3 className="text-base font-semibold text-gray-800 mb-2">How often should I analyze cash flow?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monitor cash flow weekly for short-term management and create monthly forecasts for planning. Prepare 13-week rolling cash flow projections to anticipate seasonal patterns and potential shortfalls. Annual analysis helps with strategic planning and investment decisions. During challenging times or rapid growth, daily monitoring may be necessary.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="cash-flow-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
