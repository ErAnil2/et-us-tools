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
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface InvestmentData {
  amount: number;
  roi: number;
  profit: number;
  finalValue: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is ROI and why is it important?",
    answer: "ROI (Return on Investment) is a financial metric that measures the profitability of an investment relative to its cost. It's calculated as (Final Value - Total Cost) / Total Cost × 100. ROI is crucial for comparing different investment opportunities, evaluating business decisions, and understanding the efficiency of your capital allocation. A higher ROI indicates a more profitable investment.",
    order: 1
  },
  {
    id: '2',
    question: "What is a good ROI percentage?",
    answer: "A 'good' ROI varies by investment type and risk level. For stocks, the S&P 500 historically averages 7-10% annually after inflation. Real estate typically yields 8-12%. High-risk investments may target 20%+ to compensate for potential losses. For business projects, ROIs above 15-20% are often considered attractive. Always compare ROI with similar investments and consider the risk involved.",
    order: 2
  },
  {
    id: '3',
    question: "Should I include fees and costs in ROI calculations?",
    answer: "Yes, always include all costs for accurate ROI. This includes transaction fees, maintenance costs, taxes, management fees, and any other expenses. The true cost of an investment is the initial amount plus all associated costs. Failing to include fees can make investments appear more profitable than they actually are, leading to poor financial decisions.",
    order: 3
  },
  {
    id: '4',
    question: "How does ROI relate to other financial metrics like IRR and NPV?",
    answer: "ROI is simpler but less precise than IRR (Internal Rate of Return) and NPV (Net Present Value). ROI doesn't account for the time value of money or cash flow timing. IRR calculates the actual rate of return considering all cash flows, while NPV shows the present value of future cash flows. For quick comparisons, ROI works well; for complex investments with multiple cash flows, IRR and NPV provide more accurate analysis.",
    order: 4
  }
];

export default function ROICalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('roi-calculator');

  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [finalValue, setFinalValue] = useState(15000);
  const [additionalCosts, setAdditionalCosts] = useState(500);
  const [timePeriod, setTimePeriod] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const [results, setResults] = useState({
    roi: 0,
    netProfit: 0,
    totalCost: 0,
    annualizedRoi: 0,
    profitPercent: 0,
    costPercent: 0,
    returnMultiple: 0
  });

  const [investmentData, setInvestmentData] = useState<InvestmentData[]>([]);

  const calculateROI = (initial: number, final: number, costs: number, years: number) => {
    const totalCost = initial + costs;
    const netProfit = final - totalCost;
    const roi = (netProfit / totalCost) * 100;
    const annualizedRoi = years > 0 ? (Math.pow((final / totalCost), 1 / years) - 1) * 100 : roi;

    return {
      roi,
      netProfit,
      totalCost,
      annualizedRoi,
      returnMultiple: final / totalCost
    };
  };

  useEffect(() => {
    const result = calculateROI(initialInvestment, finalValue, additionalCosts, timePeriod);
    const profitPercent = result.netProfit >= 0 ? (result.netProfit / finalValue) * 100 : 0;
    const costPercent = (result.totalCost / finalValue) * 100;

    setResults({
      roi: result.roi,
      netProfit: result.netProfit,
      totalCost: result.totalCost,
      annualizedRoi: result.annualizedRoi,
      profitPercent: Math.min(profitPercent, 100),
      costPercent: Math.min(costPercent, 100),
      returnMultiple: result.returnMultiple
    });

    // Generate comparison data for different investment amounts
    const data: InvestmentData[] = [];
    const baseAmount = initialInvestment;
    const multipliers = [0.5, 0.75, 1, 1.25, 1.5, 2];

    multipliers.forEach(mult => {
      const amount = Math.round(baseAmount * mult);
      const scaledFinal = finalValue * mult;
      const scaledCosts = additionalCosts * mult;
      const calc = calculateROI(amount, scaledFinal, scaledCosts, timePeriod);
      data.push({
        amount,
        roi: calc.roi,
        profit: calc.netProfit,
        finalValue: scaledFinal
      });
    });

    setInvestmentData(data);
  }, [initialInvestment, finalValue, additionalCosts, timePeriod]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateROI(initialInvestment, finalValue, additionalCosts, timePeriod);
    const higherReturn = calculateROI(initialInvestment, finalValue * 1.2, additionalCosts, timePeriod);
    const lowerCosts = calculateROI(initialInvestment, finalValue, additionalCosts * 0.5, timePeriod);

    return {
      current: {
        ...current,
        initial: initialInvestment,
        final: finalValue,
        costs: additionalCosts
      },
      higherReturn: {
        ...higherReturn,
        initial: initialInvestment,
        final: Math.round(finalValue * 1.2),
        costs: additionalCosts,
        diff: higherReturn.roi - current.roi
      },
      lowerCosts: {
        ...lowerCosts,
        initial: initialInvestment,
        final: finalValue,
        costs: Math.round(additionalCosts * 0.5),
        diff: lowerCosts.roi - current.roi
      }
    };
  }, [initialInvestment, finalValue, additionalCosts, timePeriod]);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return '$' + (value / 1000000).toFixed(1) + 'M';
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxBarValue = investmentData.length > 0 ? Math.max(...investmentData.map(d => d.finalValue)) * 1.1 : 100;
  const scenarioMax = Math.max(
    scenarios.current.roi,
    scenarios.higherReturn.roi,
    scenarios.lowerCosts.roi
  ) * 1.2;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track investment growth over time', icon: '📈' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound returns', icon: '💹' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💰' },
    { href: '/us/tools/calculators/cagr-calculator', title: 'CAGR Calculator', description: 'Compound annual growth rate', icon: '📊' },
    { href: '/us/tools/calculators/profit-margin-calculator', title: 'Profit Margin', description: 'Calculate profit margins', icon: '💵' },
    { href: '/us/tools/calculators/break-even-calculator', title: 'Break Even', description: 'Find break-even point', icon: '⚖️' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Track savings targets', icon: '🎯' }
  ];

  // Chart dimensions
  const chartWidth = 700;
  const chartHeight = 280;
  const chartPadding = { top: 30, right: 30, bottom: 50, left: 80 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const barWidth = plotWidth / investmentData.length - 20;

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('ROI Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate Return on Investment and measure the profitability of your investments</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Investment Details</h2>

            {/* Initial Investment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment ($)</label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter initial investment"
              />
            </div>

            {/* Final Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Final Value ($)</label>
              <input
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter final value"
              />
            </div>

            {/* Additional Costs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Costs ($)</label>
              <input
                type="number"
                value={additionalCosts}
                onChange={(e) => setAdditionalCosts(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter additional costs"
              />
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Period (Years)</label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(parseFloat(e.target.value) || 1)}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter years"
              />
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">ROI Results</h2>

            {/* Main Results */}
            <div className="space-y-4">
              <div className={`bg-white rounded-lg p-4 shadow-sm ${results.roi >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                <div className="text-sm text-gray-500">Return on Investment (ROI)</div>
                <div className={`text-3xl font-bold ${results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.roi >= 0 ? '+' : ''}{results.roi.toFixed(2)}%
                </div>
              </div>

              <div className={`bg-white rounded-lg p-4 shadow-sm ${results.netProfit >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                <div className="text-sm text-gray-500">Net Profit/Loss</div>
                <div className={`text-2xl font-bold ${results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrencyFull(results.netProfit)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Total Cost</div>
                  <div className="text-lg font-bold text-gray-800">{formatCurrency(results.totalCost)}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Annualized ROI</div>
                  <div className={`text-lg font-bold ${results.annualizedRoi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.annualizedRoi.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500 mb-2">Return Multiple</div>
                <div className="text-xl font-bold text-blue-600">{results.returnMultiple.toFixed(2)}x</div>
                <div className="text-xs text-gray-500 mt-1">
                  Your investment is worth {results.returnMultiple.toFixed(2)} times its original value
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Finance Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-blue-300 active:border-blue-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                  {calc.title}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 leading-tight">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6 prose prose-gray max-w-none">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Return on Investment (ROI)</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Return on Investment (ROI) is a fundamental financial metric used to evaluate the profitability and efficiency of an investment.
          By comparing the net profit to the total cost, ROI helps investors, business owners, and financial analysts make informed decisions
          about where to allocate capital for maximum returns.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Simple Formula</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">ROI = (Gain - Cost) / Cost × 100%</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Include All Costs</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Factor in fees, taxes, and hidden expenses</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Compare Fairly</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Use annualized ROI when comparing different time periods</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Common Uses of ROI</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">📈</span>
                <span><strong>Stock Investments:</strong> Measure portfolio performance</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">🏠</span>
                <span><strong>Real Estate:</strong> Evaluate rental or flip returns</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">📣</span>
                <span><strong>Marketing:</strong> Track campaign effectiveness</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">💼</span>
                <span><strong>Business Projects:</strong> Justify capital expenditures</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Benchmark ROI Values</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>S&amp;P 500:</strong> ~10% average annual return</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Real Estate:</strong> 8-12% typical annual ROI</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Business Projects:</strong> 15-20%+ often required</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">⚠️</span>
                <span>Higher ROI typically means higher risk</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="roi-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
