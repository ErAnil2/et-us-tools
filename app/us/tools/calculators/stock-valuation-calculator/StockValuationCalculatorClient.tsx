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

interface ProjectionRow {
  year: number;
  fcf: number;
  pv: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is the best valuation method for stocks?",
    answer: "There's no single 'best' method - each has strengths for different situations. DCF (Discounted Cash Flow) is most comprehensive for stable, cash-generating companies. P/E and PEG ratios are quick comparisons for profitable companies. P/B ratio works well for asset-heavy industries like banking and real estate. The Dividend Discount Model is ideal for consistent dividend payers. Professional analysts typically use multiple methods and triangulate results to get a fair value range.",
    order: 1
  },
  {
    id: '2',
    question: "What discount rate should I use for DCF analysis?",
    answer: "The discount rate should reflect the investment's risk level. A common approach is to use the Weighted Average Cost of Capital (WACC), typically 8-12% for most companies. For large, stable blue-chip stocks, use 8-10%. For mid-cap growth stocks, 10-12%. For small-cap or high-risk stocks, 12-15% or higher. You can also use the risk-free rate (10-year Treasury) plus an equity risk premium (4-6%) plus a company-specific risk premium.",
    order: 2
  },
  {
    id: '3',
    question: "How do I interpret P/E and PEG ratios?",
    answer: "P/E (Price-to-Earnings) shows how much investors pay per dollar of earnings. A P/E of 20 means you're paying $20 for each $1 of annual earnings. Compare to industry averages - lower P/E might indicate undervaluation or problems. PEG ratio adjusts P/E for growth: PEG = P/E ÷ Growth Rate. A PEG below 1.0 suggests the stock may be undervalued relative to its growth, while above 2.0 might indicate overvaluation.",
    order: 3
  },
  {
    id: '4',
    question: "What is intrinsic value and why does it matter?",
    answer: "Intrinsic value is the 'true' worth of a stock based on fundamental analysis, independent of its current market price. It matters because the stock market can be irrational short-term - prices may deviate significantly from intrinsic value. Value investors look for stocks trading below intrinsic value (margin of safety), expecting prices to eventually converge to fair value. The difference between current price and intrinsic value represents potential upside or downside.",
    order: 4
  },
  {
    id: '5',
    question: "How accurate are stock valuation calculators?",
    answer: "Valuation calculators provide estimates, not precise predictions. Accuracy depends heavily on input assumptions - small changes in growth rates or discount rates can dramatically change results. DCF models are particularly sensitive to terminal growth and discount rate assumptions. Use these tools as starting points for analysis, not definitive answers. Always run sensitivity analysis (what-if scenarios), compare multiple valuation methods, and incorporate qualitative factors like management quality and competitive position.",
    order: 5
  }
];

export default function StockValuationCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('stock-valuation-calculator');

  const [activeTab, setActiveTab] = useState('dcf');

  // DCF Model State
  const [currentFCF, setCurrentFCF] = useState(1000);
  const [growthRate, setGrowthRate] = useState(8);
  const [terminalGrowth, setTerminalGrowth] = useState(3);
  const [discountRate, setDiscountRate] = useState(10);
  const [sharesOutstanding, setSharesOutstanding] = useState(100);
  const [projectionPeriod, setProjectionPeriod] = useState(10);
  const [showFullProjection, setShowFullProjection] = useState(false);

  // Ratios State
  const [currentPrice, setCurrentPrice] = useState(100);
  const [eps, setEps] = useState(8);
  const [bookValue, setBookValue] = useState(50);
  const [pegGrowth, setPegGrowth] = useState(15);
  const [industryPE, setIndustryPE] = useState(18);
  const [industryPB, setIndustryPB] = useState(2.5);

  // Dividend Model State
  const [dividendStockPrice, setDividendStockPrice] = useState(100);
  const [currentDividend, setCurrentDividend] = useState(2.50);
  const [dividendGrowth, setDividendGrowth] = useState(5);
  const [requiredReturn, setRequiredReturn] = useState(10);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyDecimals = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // DCF Calculations
  const dcfResults = useMemo(() => {
    const fcf = currentFCF;
    const growth = growthRate / 100;
    const termGrowth = terminalGrowth / 100;
    const discount = discountRate / 100;
    const shares = sharesOutstanding;
    const period = projectionPeriod;

    const projections: ProjectionRow[] = [];
    let totalPV = 0;

    for (let year = 1; year <= period; year++) {
      const yearFcf = fcf * Math.pow(1 + growth, year);
      const pv = yearFcf / Math.pow(1 + discount, year);
      totalPV += pv;
      projections.push({ year, fcf: yearFcf, pv });
    }

    const terminalFCF = fcf * Math.pow(1 + growth, period + 1);
    const termValue = (terminalFCF * (1 + termGrowth)) / (discount - termGrowth);
    const termPV = termValue / Math.pow(1 + discount, period);

    const entValue = totalPV + termPV;
    const intrinsic = entValue / shares;

    return {
      intrinsicValue: intrinsic,
      enterpriseValue: entValue,
      pvFCF: totalPV,
      terminalValue: termPV,
      projections
    };
  }, [currentFCF, growthRate, terminalGrowth, discountRate, sharesOutstanding, projectionPeriod]);

  // DCF What-If Scenarios
  const dcfScenarios = useMemo(() => {
    const calcDCF = (fcf: number, growth: number, termGrowth: number, discount: number, period: number, shares: number) => {
      let totalPV = 0;
      for (let year = 1; year <= period; year++) {
        const yearFcf = fcf * Math.pow(1 + growth, year);
        totalPV += yearFcf / Math.pow(1 + discount, year);
      }
      const terminalFCF = fcf * Math.pow(1 + growth, period + 1);
      const termValue = (terminalFCF * (1 + termGrowth)) / (discount - termGrowth);
      const termPV = termValue / Math.pow(1 + discount, period);
      return (totalPV + termPV) / shares;
    };

    const base = dcfResults.intrinsicValue;
    const higherGrowth = calcDCF(currentFCF, (growthRate + 2) / 100, terminalGrowth / 100, discountRate / 100, projectionPeriod, sharesOutstanding);
    const lowerDiscount = calcDCF(currentFCF, growthRate / 100, terminalGrowth / 100, (discountRate - 1) / 100, projectionPeriod, sharesOutstanding);
    const higherFCF = calcDCF(currentFCF * 1.2, growthRate / 100, terminalGrowth / 100, discountRate / 100, projectionPeriod, sharesOutstanding);

    return [
      { title: 'Higher Growth', description: '+2% growth rate', value: higherGrowth, diff: higherGrowth - base, percent: ((higherGrowth - base) / base) * 100 },
      { title: 'Lower Risk', description: '-1% discount rate', value: lowerDiscount, diff: lowerDiscount - base, percent: ((lowerDiscount - base) / base) * 100 },
      { title: 'Better FCF', description: '+20% free cash flow', value: higherFCF, diff: higherFCF - base, percent: ((higherFCF - base) / base) * 100 }
    ];
  }, [dcfResults.intrinsicValue, currentFCF, growthRate, terminalGrowth, discountRate, projectionPeriod, sharesOutstanding]);

  // Ratios Calculations
  const ratiosResults = useMemo(() => {
    const pe = eps > 0 ? currentPrice / eps : 0;
    const pb = bookValue > 0 ? currentPrice / bookValue : 0;
    const peg = pegGrowth > 0 ? pe / pegGrowth : 0;
    const peValue = eps * industryPE;
    const pbValue = bookValue * industryPB;
    const avgValue = (peValue + pbValue) / 2;
    const upside = currentPrice > 0 ? ((avgValue - currentPrice) / currentPrice) * 100 : 0;

    return {
      currentPE: pe,
      peValueEstimate: peValue,
      pegRatio: peg,
      pegRating: peg < 1 ? 'Undervalued' : peg > 2 ? 'Overvalued' : 'Fair Value',
      currentPB: pb,
      pbValueEstimate: pbValue,
      avgFairValue: avgValue,
      upDownside: upside
    };
  }, [currentPrice, eps, bookValue, pegGrowth, industryPE, industryPB]);

  // Dividend Model Calculations
  const dividendResults = useMemo(() => {
    const growth = dividendGrowth / 100;
    const required = requiredReturn / 100;

    const nextDiv = currentDividend * (1 + growth);
    const ddmValue = required > growth ? nextDiv / (required - growth) : 0;
    const yield_ = dividendStockPrice > 0 ? (currentDividend / dividendStockPrice) * 100 : 0;
    const future10YDiv = currentDividend * Math.pow(1 + growth, 10);
    const yoc = dividendStockPrice > 0 ? (future10YDiv / dividendStockPrice) * 100 : 0;

    const projections = [];
    let cumulative = 0;
    for (let year = 1; year <= 10; year++) {
      const yearDiv = currentDividend * Math.pow(1 + growth, year);
      cumulative += yearDiv;
      projections.push({ year, dividend: yearDiv, cumulative });
    }

    return {
      ddmIntrinsicValue: ddmValue,
      nextDividend: nextDiv,
      currentYield: yield_,
      yieldOnCost: yoc,
      projections
    };
  }, [dividendStockPrice, currentDividend, dividendGrowth, requiredReturn]);

  // SVG Bar Chart for DCF
  const renderDCFChart = () => {
    const data = [
      { label: 'PV of FCF', value: dcfResults.pvFCF, color: '#3B82F6' },
      { label: 'Terminal Value', value: dcfResults.terminalValue, color: '#10B981' }
    ];
    const maxValue = Math.max(...data.map(d => d.value));
    const width = 300;
    const height = 200;
    const barWidth = 80;
    const gap = 60;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * 140;
          const x = 50 + i * (barWidth + gap);
          const y = 160 - barHeight;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={d.color} rx="4" />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="#374151" fontSize="11" fontWeight="600">
                ${(d.value / 1000).toFixed(0)}M
              </text>
              <text x={x + barWidth / 2} y={180} textAnchor="middle" fill="#6B7280" fontSize="10">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // SVG Bar Chart for Ratios
  const renderRatiosChart = () => {
    const data = [
      { label: 'Current', value: currentPrice, color: '#6B7280' },
      { label: 'P/E Fair', value: ratiosResults.peValueEstimate, color: '#3B82F6' },
      { label: 'P/B Fair', value: ratiosResults.pbValueEstimate, color: '#8B5CF6' },
      { label: 'Average', value: ratiosResults.avgFairValue, color: '#F59E0B' }
    ];
    const maxValue = Math.max(...data.map(d => d.value));
    const width = 340;
    const height = 200;
    const barWidth = 55;
    const gap = 25;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * 130;
          const x = 30 + i * (barWidth + gap);
          const y = 155 - barHeight;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={d.color} rx="4" />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600">
                ${d.value.toFixed(0)}
              </text>
              <text x={x + barWidth / 2} y={175} textAnchor="middle" fill="#6B7280" fontSize="9">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // SVG Line Chart for Dividend Growth
  const renderDividendChart = () => {
    const data = dividendResults.projections;
    if (data.length === 0) return null;

    const width = 400;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map(d => d.dividend));
    const minValue = 0;

    const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    const linePath = data.map((d, i) => {
      const x = getX(i);
      const y = getY(d.dividend);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    const areaPath = `${linePath} L ${getX(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="divGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#divGradient)" />
        <path d={linePath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        {data.map((d, i) => (
          <circle key={i} cx={getX(i)} cy={getY(d.dividend)} r="4" fill="#10B981" stroke="white" strokeWidth="2" />
        ))}
        {data.filter((_, i) => i % 2 === 0 || i === data.length - 1).map((d, idx) => {
          const i = data.indexOf(d);
          return (
            <text key={idx} x={getX(i)} y={height - 10} textAnchor="middle" fill="#6B7280" fontSize="10">
              Yr {d.year}
            </text>
          );
        })}
      </svg>
    );
  };

  const displayedProjections = showFullProjection ? dcfResults.projections : dcfResults.projections.slice(0, 5);

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Stock Valuation Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Analyze stocks using DCF, P/E, PEG, P/B ratios, and dividend discount models
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        {/* Tab Navigation */}
        <div className="flex border-b mb-4 sm:mb-4 md:mb-6 overflow-x-auto">
          {[
            { id: 'dcf', label: 'DCF', fullLabel: 'DCF Model', icon: '📊' },
            { id: 'ratios', label: 'Ratios', fullLabel: 'Ratio Analysis', icon: '📈' },
            { id: 'dividend', label: 'Dividend', fullLabel: 'Dividend Model', icon: '💰' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-1 xs:gap-2 px-2 xs:px-4 sm:px-6 py-2 sm:py-3 font-semibold border-b-2 whitespace-nowrap text-xs xs:text-sm sm:text-base transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="hidden xs:inline">{tab.icon}</span>
              <span className="sm:hidden">{tab.label}</span>
              <span className="hidden sm:inline">{tab.fullLabel}</span>
            </button>
          ))}
        </div>

        {/* DCF Tab */}
        {activeTab === 'dcf' && (
          <div>
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
              {/* DCF Inputs */}

      <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">DCF Model Inputs</h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Free Cash Flow ($M)</label>
                      <span className="text-sm font-semibold text-blue-600">${currentFCF}M</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={currentFCF}
                      onChange={(e) => setCurrentFCF(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$100M</span>
                      <span>$10,000M</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Growth Rate</label>
                        <span className="text-sm font-semibold text-emerald-600">{growthRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="0.5"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Terminal Growth</label>
                        <span className="text-sm font-semibold text-purple-600">{terminalGrowth}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={terminalGrowth}
                        onChange={(e) => setTerminalGrowth(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Discount Rate (WACC)</label>
                      <span className="text-sm font-semibold text-rose-600">{discountRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.5"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5%</span>
                      <span>20%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Shares (M)</label>
                        <span className="text-sm font-semibold text-gray-800">{sharesOutstanding}M</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={sharesOutstanding}
                        onChange={(e) => setSharesOutstanding(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Projection Period</label>
                      <select
                        value={projectionPeriod}
                        onChange={(e) => setProjectionPeriod(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="5">5 years</option>
                        <option value="10">10 years</option>
                        <option value="15">15 years</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* DCF Results */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">DCF Valuation Results</h2>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-5 border border-blue-100">
                  <div className="text-sm text-blue-700 mb-1">Intrinsic Value per Share</div>
                  <div className="text-3xl sm:text-3xl md:text-4xl font-bold text-blue-600">{formatCurrencyDecimals(dcfResults.intrinsicValue)}</div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Enterprise Value</div>
                    <div className="text-lg font-bold text-gray-800">${(dcfResults.enterpriseValue / 1000).toFixed(1)}B</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">PV of FCF</div>
                    <div className="text-lg font-bold text-blue-600">${(dcfResults.pvFCF / 1000).toFixed(1)}B</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <div className="text-xs text-emerald-600 mb-1">Terminal Value</div>
                    <div className="text-lg font-bold text-emerald-600">${(dcfResults.terminalValue / 1000).toFixed(1)}B</div>
                  </div>
                </div>

                {/* DCF Chart */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 text-center mb-3">Value Components</h3>
                  {renderDCFChart()}
                </div>
              </div>
            </div>

            {/* DCF What-If Scenarios */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">What-If Scenarios</h3>
              <p className="text-gray-600 text-sm mb-4">See how different assumptions affect intrinsic value</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {dcfScenarios.map((scenario, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                          {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                          {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{scenario.title}</h4>
                        <p className="text-xs text-gray-500">{scenario.description}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrencyDecimals(scenario.value)}</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${scenario.diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {scenario.diff >= 0 ? '+' : ''}{formatCurrencyDecimals(scenario.diff)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${scenario.diff >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {scenario.percent >= 0 ? '+' : ''}{scenario.percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DCF Projection Table */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Cash Flow Projections</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-lg">Year</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">FCF ($M)</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 rounded-tr-lg">Present Value ($M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProjections.map((row, index) => (
                      <tr key={row.year} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 font-medium text-gray-800">{row.year}</td>
                        <td className="px-4 py-3 text-right text-blue-600">${row.fcf.toFixed(0)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">${row.pv.toFixed(0)}</td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50 font-semibold">
                      <td className="px-4 py-3 text-emerald-800">Terminal</td>
                      <td className="px-4 py-3 text-right text-emerald-600">-</td>
                      <td className="px-4 py-3 text-right text-emerald-600">${dcfResults.terminalValue.toFixed(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {dcfResults.projections.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowFullProjection(!showFullProjection)}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
                  >
                    {showFullProjection ? 'Show Less' : `Show All ${dcfResults.projections.length} Years`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ratios Tab */}
        {activeTab === 'ratios' && (
          <div>
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
              {/* Ratios Inputs */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Valuation Inputs</h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Current Stock Price</label>
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(currentPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="1"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">EPS</label>
                        <span className="text-sm font-semibold text-blue-600">${eps.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="50"
                        step="0.5"
                        value={eps}
                        onChange={(e) => setEps(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Book Value</label>
                        <span className="text-sm font-semibold text-purple-600">${bookValue}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="200"
                        step="1"
                        value={bookValue}
                        onChange={(e) => setBookValue(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">EPS Growth Rate</label>
                      <span className="text-sm font-semibold text-emerald-600">{pegGrowth}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={pegGrowth}
                      onChange={(e) => setPegGrowth(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Industry P/E</label>
                        <span className="text-sm font-semibold text-amber-600">{industryPE}x</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="0.5"
                        value={industryPE}
                        onChange={(e) => setIndustryPE(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Industry P/B</label>
                        <span className="text-sm font-semibold text-rose-600">{industryPB}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.1"
                        value={industryPB}
                        onChange={(e) => setIndustryPB(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Quick Valuation Tips</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>P/E &lt; Industry avg = Potentially undervalued</li>
                    <li>PEG &lt; 1.0 = Good value for growth</li>
                    <li>P/B &lt; 1.0 = Trading below book value</li>
                  </ul>
                </div>
              </div>

              {/* Ratios Results */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Ratio Analysis Results</h2>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">P/E Analysis</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{ratiosResults.currentPE.toFixed(1)}x</div>
                    <div className="text-xs text-blue-700">Fair Value: {formatCurrency(ratiosResults.peValueEstimate)}</div>
                  </div>
                  <div className={`rounded-lg p-4 border ${ratiosResults.pegRating === 'Undervalued' ? 'bg-emerald-50 border-emerald-200' : ratiosResults.pegRating === 'Overvalued' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                    <h4 className={`font-semibold mb-2 ${ratiosResults.pegRating === 'Undervalued' ? 'text-emerald-900' : ratiosResults.pegRating === 'Overvalued' ? 'text-red-900' : 'text-amber-900'}`}>PEG Ratio</h4>
                    <div className={`text-2xl font-bold mb-1 ${ratiosResults.pegRating === 'Undervalued' ? 'text-emerald-600' : ratiosResults.pegRating === 'Overvalued' ? 'text-red-600' : 'text-amber-600'}`}>{ratiosResults.pegRatio.toFixed(2)}</div>
                    <div className={`text-xs ${ratiosResults.pegRating === 'Undervalued' ? 'text-emerald-700' : ratiosResults.pegRating === 'Overvalued' ? 'text-red-700' : 'text-amber-700'}`}>{ratiosResults.pegRating}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">P/B Analysis</h4>
                    <div className="text-2xl font-bold text-purple-600 mb-1">{ratiosResults.currentPB.toFixed(1)}x</div>
                    <div className="text-xs text-purple-700">Fair Value: {formatCurrency(ratiosResults.pbValueEstimate)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-2">Average Fair Value</h4>
                    <div className="text-2xl font-bold text-amber-600 mb-1">{formatCurrency(ratiosResults.avgFairValue)}</div>
                    <div className={`text-xs font-medium ${ratiosResults.upDownside >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {ratiosResults.upDownside >= 0 ? '+' : ''}{ratiosResults.upDownside.toFixed(1)}% Upside
                    </div>
                  </div>
                </div>

                {/* Ratios Chart */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 text-center mb-3">Valuation Comparison</h3>
                  {renderRatiosChart()}
                </div>
</div>
            </div>
          </div>
        )}

        {/* Dividend Tab */}
        {activeTab === 'dividend' && (
          <div>
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
              {/* Dividend Inputs */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Dividend Model Inputs</h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Current Stock Price</label>
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(dividendStockPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="1"
                      value={dividendStockPrice}
                      onChange={(e) => setDividendStockPrice(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Current Annual Dividend</label>
                      <span className="text-sm font-semibold text-emerald-600">{formatCurrencyDecimals(currentDividend)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="20"
                      step="0.1"
                      value={currentDividend}
                      onChange={(e) => setCurrentDividend(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Dividend Growth Rate</label>
                      <span className="text-sm font-semibold text-blue-600">{dividendGrowth}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={dividendGrowth}
                      onChange={(e) => setDividendGrowth(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Required Return</label>
                      <span className="text-sm font-semibold text-rose-600">{requiredReturn}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.5"
                      value={requiredReturn}
                      onChange={(e) => setRequiredReturn(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Dividend Tips */}
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2">Dividend Model Insights</h4>
                  <p className="text-xs text-emerald-800">Best for stable, dividend-paying companies. A sustainable payout ratio is typically 40-60%. Higher required returns decrease valuation, while higher growth increases it.</p>
                </div>
              </div>

              {/* Dividend Results */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Dividend Model Results</h2>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 mb-5 border border-emerald-100">
                  <div className="text-sm text-emerald-700 mb-1">Intrinsic Value (DDM)</div>
                  <div className="text-3xl sm:text-3xl md:text-4xl font-bold text-emerald-600">{formatCurrencyDecimals(dividendResults.ddmIntrinsicValue)}</div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Next Dividend</div>
                    <div className="text-lg font-bold text-gray-800">{formatCurrencyDecimals(dividendResults.nextDividend)}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Current Yield</div>
                    <div className="text-lg font-bold text-blue-600">{dividendResults.currentYield.toFixed(2)}%</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1">Yield on Cost (10y)</div>
                    <div className="text-lg font-bold text-purple-600">{dividendResults.yieldOnCost.toFixed(2)}%</div>
                  </div>
                </div>

                {/* Dividend Chart */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 text-center mb-3">10-Year Dividend Growth</h3>
                  {renderDividendChart()}
                </div>
              </div>
            </div>

            {/* Dividend Projection Table */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">10-Year Dividend Projection</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-50 to-green-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-lg">Year</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Annual Dividend</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700 rounded-tr-lg">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividendResults.projections.map((row, index) => (
                      <tr key={row.year} className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 font-medium text-gray-800">{row.year}</td>
                        <td className="px-4 py-3 text-right text-emerald-600">{formatCurrencyDecimals(row.dividend)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatCurrencyDecimals(row.cumulative)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Stock Valuation Methods</h2>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Stock valuation is the process of determining a company&apos;s intrinsic or fair value, independent of its current market price. By comparing intrinsic value to market price, investors can identify potentially undervalued opportunities or overpriced stocks to avoid. Professional analysts typically use multiple methods and triangulate results to arrive at a target price range.
          </p>

          <div className="grid md:grid-cols-3 gap-4 my-6 not-prose">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">DCF Model</h3>
              <p className="text-sm text-blue-800 mb-2">Discounted Cash Flow</p>
              <p className="text-xs text-blue-700">Projects future free cash flows and discounts them back to present value. Best for stable, cash-generating companies with predictable growth.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2">Ratio Analysis</h3>
              <p className="text-sm text-purple-800 mb-2">P/E, PEG, P/B Ratios</p>
              <p className="text-xs text-purple-700">Compares stock metrics to industry averages or historical norms. Quick relative valuation for comparable companies.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-semibold text-emerald-900 mb-2">Dividend Discount</h3>
              <p className="text-sm text-emerald-800 mb-2">Gordon Growth Model</p>
              <p className="text-xs text-emerald-700">Values stocks based on future dividend payments. Ideal for mature, dividend-paying companies with consistent payout history.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Valuation Concepts</h3>
          <p className="text-gray-600 mb-4">
            The <strong>discount rate</strong> (or WACC) reflects the investment&apos;s risk level—higher risk demands higher returns, which lowers present values. <strong>Terminal value</strong> in DCF models often represents 60-80% of total value, capturing growth beyond the projection period. <strong>Margin of safety</strong> is the difference between intrinsic value and purchase price, providing a buffer against estimation errors.
          </p>

          <div className="bg-amber-50 p-4 rounded-lg my-6 not-prose">
            <h4 className="font-semibold text-amber-900 mb-2">Sensitivity Analysis Matters</h4>
            <p className="text-sm text-amber-800">
              Small changes in assumptions can dramatically affect valuations. A 1% change in discount rate or growth rate can swing intrinsic value by 15-25%. Always run multiple scenarios (bull, base, bear case) to understand the range of possible values and the margin of safety at current prices.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">When to Use Each Method</h3>
          <p className="text-gray-600">
            Use <strong>DCF</strong> for companies with predictable cash flows (established tech, industrials, consumer staples). Use <strong>ratio analysis</strong> for quick comparisons within sectors or when cash flow data is limited. Use <strong>dividend models</strong> for income-focused investing in utilities, REITs, and mature dividend aristocrats. For growth stocks with no earnings, consider price-to-sales or EV/Revenue multiples as starting points.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="stock-valuation-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className={`w-10 h-10 ${calc.color || 'bg-blue-100'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-xl">{calc.icon || '📊'}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Disclaimer</h3>
            <p className="text-sm text-amber-700">
              This calculator provides estimates for educational purposes only. Stock valuations involve significant uncertainty and should not be used as the sole basis for investment decisions. Always conduct thorough research and consider consulting with a qualified financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
