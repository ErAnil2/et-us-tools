'use client';

import { useState, useMemo } from 'react';
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

interface YearlyData {
  year: number;
  value: number;
  gain: number;
  totalGain: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Appreciation Calculator?",
    answer: "A Appreciation Calculator is a free online tool designed to help you quickly and accurately calculate appreciation-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Appreciation Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Appreciation Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Appreciation Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function AppreciationCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('appreciation-calculator');

  const [initialValue, setInitialValue] = useState(100000);
  const [appreciationRate, setAppreciationRate] = useState(7);
  const [timePeriod, setTimePeriod] = useState(10);
  const [assetType, setAssetType] = useState('custom');
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const assetPresets: Record<string, { rate: number; name: string }> = {
    'residential': { rate: 4, name: 'Residential Real Estate' },
    'commercial': { rate: 7, name: 'Commercial Real Estate' },
    'sp500': { rate: 10, name: 'S&P 500 Index' },
    'growth': { rate: 12, name: 'Growth Stocks' },
    'gold': { rate: 3, name: 'Gold' },
    'art': { rate: 8, name: 'Art & Collectibles' }
  };

  const handleAssetChange = (type: string) => {
    setAssetType(type);
    if (type !== 'custom' && assetPresets[type]) {
      setAppreciationRate(assetPresets[type].rate);
    }
  };

  const results = useMemo(() => {
    const rate = appreciationRate / 100;
    const finalValue = initialValue * Math.pow(1 + rate, timePeriod);
    const totalGain = finalValue - initialValue;
    const totalReturn = (totalGain / initialValue) * 100;
    const avgAnnualGain = totalGain / timePeriod;

    return { finalValue, totalGain, totalReturn, avgAnnualGain };
  }, [initialValue, appreciationRate, timePeriod]);

  // Year-by-year data
  const yearlyData = useMemo(() => {
    const data: YearlyData[] = [];
    const rate = appreciationRate / 100;
    let prevValue = initialValue;

    for (let year = 1; year <= timePeriod; year++) {
      const value = initialValue * Math.pow(1 + rate, year);
      const gain = value - prevValue;
      const totalGain = value - initialValue;
      data.push({ year, value, gain, totalGain });
      prevValue = value;
    }

    return data;
  }, [initialValue, appreciationRate, timePeriod]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const calc = (rate: number, years: number) => initialValue * Math.pow(1 + rate / 100, years);

    return [
      {
        title: 'Higher Rate',
        description: '+3% appreciation',
        value: calc(appreciationRate + 3, timePeriod),
        diff: calc(appreciationRate + 3, timePeriod) - results.finalValue
      },
      {
        title: 'Longer Term',
        description: '+5 more years',
        value: calc(appreciationRate, timePeriod + 5),
        diff: calc(appreciationRate, timePeriod + 5) - results.finalValue
      },
      {
        title: 'Double Initial',
        description: '2x starting amount',
        value: calc(appreciationRate, timePeriod) * 2,
        diff: calc(appreciationRate, timePeriod) * 2 - results.finalValue
      }
    ];
  }, [initialValue, appreciationRate, timePeriod, results.finalValue]);

  // SVG Line Chart
  const renderGrowthChart = () => {
    if (yearlyData.length === 0) return null;

    const width = 500;
    const height = 280;
    const padding = { top: 20, right: 30, bottom: 40, left: 70 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const allValues = [initialValue, ...yearlyData.map(d => d.value)];
    const maxValue = Math.max(...allValues);
    const minValue = initialValue * 0.9;

    const getX = (index: number) => padding.left + (index / yearlyData.length) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    const points = [{ year: 0, value: initialValue }, ...yearlyData];
    const linePath = points.map((d, i) => {
      const x = getX(i);
      const y = getY(d.value);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    const areaPath = `${linePath} L ${getX(points.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

    const yLabels = [];
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (maxValue - minValue) * (i / 4);
      yLabels.push({ value, y: getY(value) });
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="appreciationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yLabels.map((label, i) => (
          <line key={i} x1={padding.left} y1={label.y} x2={width - padding.right} y2={label.y} stroke="#E5E7EB" strokeDasharray="4,4" />
        ))}

        {/* Filled area */}
        <path d={areaPath} fill="url(#appreciationGradient)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((d, i) => (
          <g key={i}>
            <circle
              cx={getX(i)}
              cy={getY(d.value)}
              r={hoveredPoint === i ? 8 : 5}
              fill={hoveredPoint === i ? '#059669' : '#10B981'}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {hoveredPoint === i && (
              <g>
                <rect x={getX(i) - 60} y={getY(d.value) - 50} width="120" height="40" rx="6" fill="#1F2937" fillOpacity="0.95" />
                <text x={getX(i)} y={getY(d.value) - 35} textAnchor="middle" fill="white" fontSize="11" fontWeight="500">
                  Year {d.year}
                </text>
                <text x={getX(i)} y={getY(d.value) - 18} textAnchor="middle" fill="#34D399" fontSize="12" fontWeight="bold">
                  {formatCurrency(d.value)}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <text key={i} x={padding.left - 10} y={label.y + 4} textAnchor="end" fill="#6B7280" fontSize="11">
            {label.value >= 1000000 ? `$${(label.value / 1000000).toFixed(1)}M` : `$${(label.value / 1000).toFixed(0)}K`}
          </text>
        ))}

        {/* X-axis labels */}
        {points.filter((_, i) => i === 0 || i === points.length - 1 || i % Math.max(1, Math.floor(points.length / 5)) === 0).map((d, idx, arr) => {
          const i = points.indexOf(d);
          return (
            <text key={i} x={getX(i)} y={height - 10} textAnchor="middle" fill="#6B7280" fontSize="11">
              {d.year === 0 ? 'Start' : `Yr ${d.year}`}
            </text>
          );
        })}

        {/* Axis labels */}
        <text x={width / 2} y={height - 2} textAnchor="middle" fill="#374151" fontSize="12" fontWeight="500">
          Time Period
        </text>
      </svg>
    );
  };

  const displayedYearlyData = showFullSchedule ? yearlyData : yearlyData.slice(0, 10);

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">{getH1('Appreciation Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate asset appreciation, property value growth, and investment returns over time
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Asset Details</h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Asset Type</label>
                <select
                  value={assetType}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="custom">Custom Rate</option>
                  <option value="residential">Residential Real Estate (4%)</option>
                  <option value="commercial">Commercial Real Estate (7%)</option>
                  <option value="sp500">S&P 500 Index (10%)</option>
                  <option value="growth">Growth Stocks (12%)</option>
                  <option value="gold">Gold (3%)</option>
                  <option value="art">Art & Collectibles (8%)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Initial Value</label>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrency(initialValue)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="5000000"
                  step="1000"
                  value={initialValue}
                  onChange={(e) => setInitialValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$1K</span>
                  <span>$5M</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Annual Appreciation Rate</label>
                  <span className="text-sm font-semibold text-emerald-600">{appreciationRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={appreciationRate}
                  onChange={(e) => {
                    setAppreciationRate(Number(e.target.value));
                    setAssetType('custom');
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Time Period</label>
                  <span className="text-sm font-semibold text-purple-600">{timePeriod} years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Scenarios</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setInitialValue(300000); setAppreciationRate(4); setTimePeriod(10); setAssetType('residential'); }}
                    className="p-2 text-xs bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="font-semibold text-blue-900">Home</div>
                    <div className="text-blue-700">$300K, 4%</div>
                  </button>
                  <button
                    onClick={() => { setInitialValue(10000); setAppreciationRate(10); setTimePeriod(20); setAssetType('sp500'); }}
                    className="p-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <div className="font-semibold text-emerald-900">Stock</div>
                    <div className="text-emerald-700">$10K, 10%</div>
                  </button>
                  <button
                    onClick={() => { setInitialValue(5000); setAppreciationRate(8); setTimePeriod(5); setAssetType('art'); }}
                    className="p-2 text-xs bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="font-semibold text-purple-900">Art</div>
                    <div className="text-purple-700">$5K, 8%</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Appreciation Results</h2>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 mb-5 border border-emerald-100">
              <div className="text-sm text-emerald-700 mb-1">Final Value After {timePeriod} Years</div>
              <div className="text-xl sm:text-2xl md:text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">{formatCurrency(results.finalValue)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Total Gain</div>
                <div className="text-lg font-bold text-blue-600">+{formatCurrency(results.totalGain)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Total Return</div>
                <div className="text-lg font-bold text-purple-600">{results.totalReturn.toFixed(1)}%</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-amber-600 mb-1">Annual Rate</div>
                <div className="text-lg font-bold text-amber-600">{appreciationRate}%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Avg Annual Gain</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.avgAnnualGain)}</div>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 text-center mb-3">Value Growth Over Time</h3>
              {renderGrowthChart()}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">See how different factors affect your final value</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{scenario.title}</h3>
                  <p className="text-xs text-gray-500">{scenario.description}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-2">{formatCurrency(scenario.value)}</div>
              <div className="text-sm font-medium text-emerald-600">
                +{formatCurrency(scenario.diff)} more
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Year-by-Year Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Growth Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-50 to-green-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 rounded-tl-lg">Year</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Asset Value</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Yearly Gain</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 rounded-tr-lg">Total Gain</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50 border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">Start</td>
                <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(initialValue)}</td>
                <td className="px-4 py-3 text-right text-gray-500">-</td>
                <td className="px-4 py-3 text-right text-gray-500">-</td>
              </tr>
              {displayedYearlyData.map((row, index) => (
                <tr key={row.year} className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.year}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{formatCurrency(row.value)}</td>
                  <td className="px-4 py-3 text-right text-blue-600">+{formatCurrency(row.gain)}</td>
                  <td className="px-4 py-3 text-right text-purple-600 font-semibold">+{formatCurrency(row.totalGain)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {yearlyData.length > 10 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-3 sm:px-4 md:px-6 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-medium transition-colors"
            >
              {showFullSchedule ? 'Show Less' : `Show Full Schedule (${timePeriod} years)`}
            </button>
          </div>
        )}
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 xs:mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-emerald-50 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className={`w-10 h-10 ${calc.color || 'bg-emerald-100'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-xl">{calc.icon || '📊'}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 xs:mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Asset Appreciation</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Asset appreciation refers to the increase in the value of an investment over time. Whether you&apos;re tracking real estate, stocks, collectibles, or other assets, understanding how appreciation compounds over years is essential for long-term financial planning. This calculator helps you project future values based on historical appreciation rates and different holding periods.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
              <h4 className="font-semibold text-emerald-800 mb-2">The Appreciation Formula</h4>
              <p className="font-mono text-sm text-emerald-700 mb-2">
                FV = PV × (1 + r)^n
              </p>
              <p className="text-sm text-emerald-600">
                Where FV = Future Value, PV = Present Value, r = Annual Rate, n = Years
              </p>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">The Rule of 72</h4>
              <p className="text-sm text-blue-700 mb-2">
                Divide 72 by your return rate to estimate doubling time.
              </p>
              <p className="text-sm text-blue-600">
                At 8% appreciation, your asset doubles in ~9 years (72÷8=9)
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Historical Appreciation Rates by Asset Class</h3>
          <div className="space-y-2 mb-3 sm:mb-4 md:mb-6 text-sm text-gray-600">
            <p>• <strong>US Real Estate:</strong> 3-5% average annual appreciation (varies greatly by location)</p>
            <p>• <strong>S&amp;P 500 Index:</strong> ~10% average annual return historically (including dividends)</p>
            <p>• <strong>Gold:</strong> ~3-4% average over long periods (hedge against inflation)</p>
            <p>• <strong>Art &amp; Collectibles:</strong> Highly variable, 6-12% for quality pieces</p>
            <p>• <strong>Commercial Real Estate:</strong> 6-8% when factoring rental income</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold text-emerald-900 mb-4">Asset Appreciation Tips</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-sm">
                <h4 className="font-semibold text-emerald-800 mb-1">Compound Growth</h4>
                <p className="text-emerald-700">Longer holding periods dramatically increase returns through compounding.</p>
              </div>
              <div className="text-sm">
                <h4 className="font-semibold text-blue-800 mb-1">Diversification</h4>
                <p className="text-blue-700">Different assets appreciate at different rates. Spread risk across asset classes.</p>
              </div>
              <div className="text-sm">
                <h4 className="font-semibold text-purple-800 mb-1">Historical Context</h4>
                <p className="text-purple-700">Past performance doesn&apos;t guarantee future results. Use averages as guidelines.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 xs:mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What&apos;s the difference between appreciation and total return?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Appreciation refers only to the increase in asset value, while total return includes appreciation plus any income generated (like dividends from stocks or rent from real estate). For example, a stock might appreciate 7% while paying a 3% dividend, giving you a 10% total return. When comparing investments, always consider total return, not just appreciation.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Is real estate or stock market appreciation better?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Both have pros and cons. Real estate typically appreciates 3-5% annually but offers leverage (mortgage) and rental income. Stocks historically return ~10% but are more volatile. Real estate requires active management and has transaction costs, while stocks offer liquidity. The best choice depends on your goals, risk tolerance, and whether you want passive or active investment.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How does inflation affect appreciation?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Inflation erodes purchasing power, so you need to consider &quot;real&quot; appreciation (nominal rate minus inflation). If an asset appreciates 6% but inflation is 3%, your real appreciation is only 3%. Assets like real estate and stocks generally keep pace with or exceed inflation, while cash savings lose value over time to inflation.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Can assets depreciate instead of appreciate?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Yes, most physical assets like cars, electronics, and equipment depreciate (lose value) over time. Even assets that typically appreciate—like real estate or stocks—can lose value during market downturns. Location-dependent assets like real estate in declining areas can experience long-term depreciation. This is why diversification and time horizon are crucial considerations.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What appreciation rate should I use for projections?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Use conservative estimates based on historical averages for your asset class. For US real estate, 3-4% is reasonable. For diversified stock portfolios, 7-8% (after inflation) is often used for retirement planning. Always run scenarios with lower rates to stress-test your projections. Remember that past performance doesn&apos;t guarantee future results.
            </p>
          </div>
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
              This calculator provides estimates based on constant appreciation rates. Actual asset values fluctuate based on market conditions, economic factors, and other variables. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="appreciation-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
