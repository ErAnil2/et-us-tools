'use client';

import { useState, useEffect, useMemo } from 'react';
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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is profit margin and why does it matter?",
    answer: "Profit margin is a profitability ratio that shows what percentage of revenue translates to profit. It matters because it reveals how efficiently a business converts sales into profit. Higher margins mean more money retained from each dollar of sales. Investors, lenders, and managers use profit margins to assess business health and compare performance against competitors.",
    order: 1
  },
  {
    id: '2',
    question: "What is a good profit margin for my industry?",
    answer: "Good margins vary widely by industry. Software/SaaS companies often achieve 60-80% gross margins. Retail typically sees 25-50% gross margins. Restaurants aim for 3-9% net margins. Manufacturing averages 20-35% gross margins. Compare your margins to industry benchmarks and track them over time. Improving margins by even 1-2% can significantly impact bottom line.",
    order: 2
  },
  {
    id: '3',
    question: "How can I improve my profit margins?",
    answer: "Improve margins by: 1) Increasing prices if the market allows, 2) Reducing COGS through better supplier negotiations or bulk purchasing, 3) Cutting operating expenses and overhead, 4) Automating processes to reduce labor costs, 5) Focusing on higher-margin products/services, and 6) Improving operational efficiency to reduce waste. Track margins monthly to measure improvement.",
    order: 3
  }
];

export default function ProfitMarginCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Gross Margin Calculator states
  const { getH1, getSubHeading } = usePageSEO('profit-margin-calculator');

  const [revenue, setRevenue] = useState(100000);
  const [cogs, setCogs] = useState(60000);
  const [operatingExpenses, setOperatingExpenses] = useState(25000);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const [results, setResults] = useState({
    grossProfit: 0,
    grossMargin: 0,
    operatingProfit: 0,
    operatingMargin: 0,
    netProfit: 0,
    netMargin: 0,
    markup: 0,
    costRatio: 0
  });

  // Revenue breakdown data
  const [breakdownData, setBreakdownData] = useState<{label: string; value: number; color: string}[]>([]);

  useEffect(() => {
    const gross = revenue - cogs;
    const grossM = revenue > 0 ? (gross / revenue) * 100 : 0;
    const operating = gross - operatingExpenses;
    const operatingM = revenue > 0 ? (operating / revenue) * 100 : 0;
    const markup = cogs > 0 ? (gross / cogs) * 100 : 0;
    const costR = revenue > 0 ? (cogs / revenue) * 100 : 0;

    setResults({
      grossProfit: gross,
      grossMargin: grossM,
      operatingProfit: operating,
      operatingMargin: operatingM,
      netProfit: operating,
      netMargin: operatingM,
      markup,
      costRatio: costR
    });

    setBreakdownData([
      { label: 'COGS', value: cogs, color: '#ef4444' },
      { label: 'Operating Exp.', value: operatingExpenses, color: '#f97316' },
      { label: 'Net Profit', value: Math.max(0, operating), color: '#10b981' }
    ]);
  }, [revenue, cogs, operatingExpenses]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = {
      grossProfit: revenue - cogs,
      grossMargin: revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0,
      netProfit: revenue - cogs - operatingExpenses,
      netMargin: revenue > 0 ? ((revenue - cogs - operatingExpenses) / revenue) * 100 : 0
    };

    const higherPrice = {
      revenue: revenue * 1.1,
      grossProfit: (revenue * 1.1) - cogs,
      grossMargin: ((revenue * 1.1) - cogs) / (revenue * 1.1) * 100,
      netProfit: (revenue * 1.1) - cogs - operatingExpenses,
      netMargin: ((revenue * 1.1) - cogs - operatingExpenses) / (revenue * 1.1) * 100,
      diff: ((revenue * 1.1) - cogs - operatingExpenses) - current.netProfit
    };

    const lowerCogs = {
      cogs: cogs * 0.9,
      grossProfit: revenue - (cogs * 0.9),
      grossMargin: (revenue - (cogs * 0.9)) / revenue * 100,
      netProfit: revenue - (cogs * 0.9) - operatingExpenses,
      netMargin: (revenue - (cogs * 0.9) - operatingExpenses) / revenue * 100,
      diff: (revenue - (cogs * 0.9) - operatingExpenses) - current.netProfit
    };

    return { current, higherPrice, lowerCogs };
  }, [revenue, cogs, operatingExpenses]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2) + 'M';
    }
    if (value >= 100000) {
      return '$' + (value / 1000).toFixed(1) + 'K';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 60, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const maxChartValue = revenue * 1.1;

  // Industry benchmarks
  const benchmarks = [
    { industry: 'Retail', grossMargin: '25-50%', netMargin: '2-5%' },
    { industry: 'Software/SaaS', grossMargin: '70-90%', netMargin: '15-25%' },
    { industry: 'Manufacturing', grossMargin: '25-35%', netMargin: '5-10%' },
    { industry: 'Restaurants', grossMargin: '60-70%', netMargin: '3-9%' },
    { industry: 'E-commerce', grossMargin: '40-60%', netMargin: '5-10%' },
    { industry: 'Consulting', grossMargin: '80-90%', netMargin: '15-25%' }
  ];

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/break-even-calculator', title: 'Break-Even', description: 'Find break-even point', icon: '📊' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📈' },
    { href: '/us/tools/calculators/markup-calculator', title: 'Markup Calculator', description: 'Calculate markup', icon: '🏷️' },
    { href: '/us/tools/calculators/selling-price-calculator', title: 'Selling Price', description: 'Find selling price', icon: '💰' },
    { href: '/us/tools/calculators/discount-calculator', title: 'Discount Calculator', description: 'Calculate discounts', icon: '🎯' },
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage', description: 'Percentage calcs', icon: '➗' },
    { href: '/us/tools/calculators/business-valuation-calculator', title: 'Business Valuation', description: 'Value business', icon: '🏢' },
    { href: '/us/tools/calculators/cash-flow-calculator', title: 'Cash Flow', description: 'Analyze cash flow', icon: '💵' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Profit Margin Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate gross profit margin, operating margin, and net profit margin for your business</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Enter Your Figures</h2>

            {/* Revenue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Revenue / Sales</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            {/* Cost of Goods Sold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost of Goods Sold (COGS)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            {/* Operating Expenses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Operating Expenses</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={operatingExpenses}
                  onChange={(e) => setOperatingExpenses(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            {/* Industry Benchmarks */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Industry Benchmarks</h3>
              <div className="space-y-2 text-xs">
                {benchmarks.slice(0, 4).map((b, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600">{b.industry}</span>
                    <span className="text-gray-800">GM: {b.grossMargin} | NM: {b.netMargin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Margin Analysis</h2>

            {/* Gross Margin */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-emerald-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-emerald-600 mb-1">Gross Profit Margin</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-700">{results.grossMargin.toFixed(1)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Gross Profit</div>
                  <div className="text-lg font-semibold text-emerald-600">{formatCurrency(results.grossProfit)}</div>
                </div>
              </div>
            </div>

            {/* Operating Margin */}
            <div className={`rounded-xl p-4 border-2 ${results.operatingMargin >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className={`text-sm ${results.operatingMargin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>Operating Margin</div>
                  <div className={`text-2xl font-bold ${results.operatingMargin >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    {results.operatingMargin.toFixed(1)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Operating Profit</div>
                  <div className={`text-lg font-semibold ${results.operatingProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(results.operatingProfit)}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500">Markup</div>
                <div className="text-lg font-bold text-gray-800">{results.markup.toFixed(1)}%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500">Cost Ratio</div>
                <div className="text-lg font-bold text-gray-800">{results.costRatio.toFixed(1)}%</div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Revenue Breakdown</div>
              <div className="flex h-8 rounded-full overflow-hidden">
                {breakdownData.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${(item.value / revenue) * 100}%`, backgroundColor: item.color }}
                    className="relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.label}: {formatCurrency(item.value)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-red-600">COGS</span>
                <span className="text-orange-600">OpEx</span>
                <span className="text-green-600">Profit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Understanding Profit Margins</h2>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Profit margin is one of the most important metrics for measuring business health and efficiency. It shows what percentage of revenue remains as profit after accounting for costs. Understanding the different types of margins—gross, operating, and net—helps you identify where your business excels and where improvements are needed.
          </p>

          <div className="grid md:grid-cols-3 gap-4 my-6 not-prose">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-semibold text-emerald-900 mb-2">Gross Margin</h3>
              <p className="text-xs text-emerald-800 mb-2">(Revenue - COGS) ÷ Revenue</p>
              <p className="text-sm text-emerald-700">Measures production efficiency and pricing power. Higher margins indicate you are selling products well above their direct costs.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Operating Margin</h3>
              <p className="text-xs text-blue-800 mb-2">(Gross Profit - OpEx) ÷ Revenue</p>
              <p className="text-sm text-blue-700">Shows how well you control overhead costs. Includes rent, salaries, marketing, and administrative expenses.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2">Net Margin</h3>
              <p className="text-xs text-purple-800 mb-2">Net Profit ÷ Revenue</p>
              <p className="text-sm text-purple-700">The bottom line—what percentage of each dollar in sales becomes actual profit after all expenses including taxes and interest.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Margin vs. Markup: Key Difference</h3>
          <p className="text-gray-600 mb-4">
            Margin and markup are often confused but measure different things. Margin is profit as a percentage of the selling price (revenue), while markup is profit as a percentage of cost. A 50% markup results in a 33.3% margin. For example, if you buy an item for $60 and sell it for $100, your markup is 66.7% ($40/$60) but your margin is only 40% ($40/$100).
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Improve Your Margins</h3>
          <div className="grid sm:grid-cols-2 gap-3 my-4 not-prose">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <div>
                <strong className="text-sm text-gray-800">Increase prices strategically</strong>
                <p className="text-xs text-gray-600">Even small price increases can significantly improve margins if volume holds steady.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <div>
                <strong className="text-sm text-gray-800">Negotiate with suppliers</strong>
                <p className="text-xs text-gray-600">Bulk purchasing, early payment discounts, and multiple quotes can reduce COGS.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <div>
                <strong className="text-sm text-gray-800">Reduce operating expenses</strong>
                <p className="text-xs text-gray-600">Audit overhead costs regularly—rent, utilities, subscriptions, and staffing.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <div>
                <strong className="text-sm text-gray-800">Focus on high-margin products</strong>
                <p className="text-xs text-gray-600">Analyze which products/services have best margins and prioritize them.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="profit-margin-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Business Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-emerald-300 active:border-emerald-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-emerald-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-emerald-600 transition-colors leading-tight">
                  {calc.title}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 leading-tight">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
