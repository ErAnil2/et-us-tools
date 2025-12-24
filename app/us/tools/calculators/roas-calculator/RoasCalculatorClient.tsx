'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

interface RoasRating {
  text: string;
  color: string;
  textColor: string;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Roas Calculator?",
    answer: "A Roas Calculator is a free online tool designed to help you quickly and accurately calculate roas-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Roas Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Roas Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Roas Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RoasCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('roas-calculator');

  const [revenue, setRevenue] = useState(10000);
  const [adSpend, setAdSpend] = useState(2500);
  const [cpc, setCpc] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [aov, setAov] = useState(0);

  const [roasValue, setRoasValue] = useState(4.0);
  const [roasPercentage, setRoasPercentage] = useState(400);
  const [netProfit, setNetProfit] = useState(7500);
  const [profitMargin, setProfitMargin] = useState(75);
  const [breakEvenRoas, setBreakEvenRoas] = useState(1.0);
  const [ratingText, setRatingText] = useState('Excellent - Well above break-even');
  const [performanceColor, setPerformanceColor] = useState('bg-green-100');
  const [performanceTextColor, setPerformanceTextColor] = useState('text-green-700');
  const [showAdvancedResults, setShowAdvancedResults] = useState(false);
  const [cpaResult, setCpaResult] = useState('$0');
  const [rpcResult, setRpcResult] = useState('$0');
  const [conversionsResult, setConversionsResult] = useState('0');

  useEffect(() => {
    calculateROAS();
  }, [revenue, adSpend, cpc, conversionRate, aov]);

  const formatCurrency = (amount: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  };

  const formatPercent = (value: number, decimals: number = 1): string => {
    return (value * 100).toFixed(decimals) + '%';
  };

  const getRoasRating = (roas: number): RoasRating => {
    if (roas >= 6) return { text: 'Outstanding - Exceptional performance', color: 'bg-green-100', textColor: 'text-green-700' };
    if (roas >= 4) return { text: 'Excellent - Well above break-even', color: 'bg-green-100', textColor: 'text-green-700' };
    if (roas >= 2.5) return { text: 'Good - Profitable campaign', color: 'bg-yellow-100', textColor: 'text-yellow-700' };
    if (roas >= 1.5) return { text: 'Fair - Room for improvement', color: 'bg-orange-100', textColor: 'text-orange-700' };
    if (roas >= 1) return { text: 'Break-even - Not losing money', color: 'bg-blue-100', textColor: 'text-blue-700' };
    return { text: 'Poor - Losing money on ads', color: 'bg-red-100', textColor: 'text-red-700' };
  };

  const calculateROAS = () => {
    if (revenue <= 0 || adSpend <= 0) {
      resetResults();
      return;
    }

    // Calculate basic ROAS metrics
    const roas = revenue / adSpend;
    const profit = revenue - adSpend;
    const margin = (profit / revenue);
    const breakEven = 1.0;

    // Update main results
    setRoasValue(roas);
    setRoasPercentage(Math.round(roas * 100));
    setNetProfit(profit);
    setProfitMargin(margin * 100);
    setBreakEvenRoas(breakEven);

    // Update performance rating
    const rating = getRoasRating(roas);
    setRatingText(rating.text);
    setPerformanceColor(rating.color);
    setPerformanceTextColor(rating.textColor);

    // Calculate advanced metrics if provided
    let hasAdvancedMetrics = false;
    if (cpc > 0 || conversionRate > 0 || aov > 0) {
      hasAdvancedMetrics = true;

      let clicks = 0;
      let conversions = 0;
      let cpa = 0;
      let rpc = 0;

      if (cpc > 0) {
        clicks = adSpend / cpc;
        rpc = revenue / clicks;
      }

      if (conversionRate > 0 && clicks > 0) {
        conversions = clicks * (conversionRate / 100);
        cpa = adSpend / conversions;
      } else if (aov > 0) {
        conversions = revenue / aov;
        cpa = adSpend / conversions;
      }

      setCpaResult(cpa > 0 ? formatCurrency(cpa) : 'N/A');
      setRpcResult(rpc > 0 ? formatCurrency(rpc) : 'N/A');
      setConversionsResult(conversions > 0 ? Math.round(conversions).toString() : 'N/A');
    }

    setShowAdvancedResults(hasAdvancedMetrics);
  };

  const resetResults = () => {
    setRoasValue(0);
    setRoasPercentage(0);
    setNetProfit(0);
    setProfitMargin(0);
    setBreakEvenRoas(1.0);
    setRatingText('Enter values to see rating');
    setShowAdvancedResults(false);
  };

  const setPreset = (type: string) => {
    if (type === 'ecommerce') {
      setRevenue(10000);
      setAdSpend(2500);
      setCpc(1.25);
      setConversionRate(3.5);
      setAov(125);
    } else if (type === 'saas') {
      setRevenue(25000);
      setAdSpend(5000);
      setCpc(2.50);
      setConversionRate(2.0);
      setAov(500);
    } else if (type === 'local') {
      setRevenue(5000);
      setAdSpend(1000);
      setCpc(0.75);
      setConversionRate(5.0);
      setAov(75);
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('ROAS Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate Return on Ad Spend and analyze your marketing campaign profitability</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Campaign Data</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Revenue Generated ($)</label>
              <input
                type="number"
                id="revenue"
                step="0.01"
                min="0"
                value={revenue || ''}
                onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)}
                placeholder="e.g., 10000"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Ad Spend ($)</label>
              <input
                type="number"
                id="adSpend"
                step="0.01"
                min="0"
                value={adSpend || ''}
                onChange={(e) => setAdSpend(parseFloat(e.target.value) || 0)}
                placeholder="e.g., 2500"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Advanced Metrics (Optional) */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-3">Advanced Metrics (Optional)</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Per Click ($)</label>
                  <input
                    type="number"
                    id="cpc"
                    step="0.01"
                    min="0"
                    value={cpc || ''}
                    onChange={(e) => setCpc(parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 1.25"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Rate (%)</label>
                  <input
                    type="number"
                    id="conversionRate"
                    step="0.01"
                    min="0"
                    max="100"
                    value={conversionRate || ''}
                    onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 3.5"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Order Value ($)</label>
                <input
                  type="number"
                  id="aov"
                  step="0.01"
                  min="0"
                  value={aov || ''}
                  onChange={(e) => setAov(parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 125"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Example Campaigns</h4>
              <div className="space-y-2">
                <button onClick={() => setPreset('ecommerce')} className="w-full px-2 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm text-left">E-commerce Store ($10K revenue, $2.5K spend)</button>
                <button onClick={() => setPreset('saas')} className="w-full px-2 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm text-left">SaaS Business ($25K revenue, $5K spend)</button>
                <button onClick={() => setPreset('local')} className="w-full px-2 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm text-left">Local Business ($5K revenue, $1K spend)</button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Campaign Performance</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600" id="roasValue">{roasValue.toFixed(2)}</div>
                <div className="text-green-700">ROAS Ratio</div>
                <div className="text-xs text-green-600 mt-1" id="roasPercentage">({roasPercentage}%)</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span id="revenueDisplay" className="font-semibold">{formatCurrency(revenue, 0)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Ad Spend:</span>
                  <span id="spendDisplay" className="font-semibold">{formatCurrency(adSpend, 0)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Net Profit:</span>
                  <span id="netProfit" className="font-semibold text-green-600">{formatCurrency(netProfit, 0)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Profit Margin:</span>
                  <span id="profitMargin" className="font-semibold">{profitMargin.toFixed(1)}%</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Break-even ROAS:</span>
                  <span id="breakEvenRoas" className="font-semibold">{breakEvenRoas.toFixed(1)}</span>
                </div>
              </div>

              {/* Performance Rating */}
              <div className={`${performanceColor} rounded-lg p-4`} id="performanceRating">
                <h4 className="font-semibold text-yellow-800 mb-2">Performance Rating</h4>
                <div id="ratingText" className={`${performanceTextColor} text-sm`}>
                  {ratingText}
                </div>
              </div>

              {/* Advanced Metrics Results */}
              {showAdvancedResults && (
                <div id="advancedResults">
                  <div className="bg-purple-100 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Advanced Metrics</h4>
                    <div className="text-purple-700 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Cost per Acquisition:</span>
                        <span id="cpaResult" className="font-semibold">{cpaResult}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue per Click:</span>
                        <span id="rpcResult" className="font-semibold">{rpcResult}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Conversions:</span>
                        <span id="conversionsResult" className="font-semibold">{conversionsResult}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* ROAS Benchmarks */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Industry ROAS Benchmarks</h3>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">E-commerce & Retail</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Fashion & Apparel</span>
                <span className="font-semibold text-green-600">4:1 - 6:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Electronics</span>
                <span className="font-semibold text-green-600">3:1 - 4:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Home & Garden</span>
                <span className="font-semibold text-green-600">4:1 - 5:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Beauty & Cosmetics</span>
                <span className="font-semibold text-green-600">4:1 - 6:1</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sports & Outdoors</span>
                <span className="font-semibold text-green-600">3:1 - 5:1</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Services & B2B</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>SaaS & Software</span>
                <span className="font-semibold text-blue-600">5:1 - 8:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Professional Services</span>
                <span className="font-semibold text-blue-600">3:1 - 5:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Education & Training</span>
                <span className="font-semibold text-blue-600">3:1 - 6:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Real Estate</span>
                <span className="font-semibold text-blue-600">2:1 - 4:1</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Financial Services</span>
                <span className="font-semibold text-blue-600">3:1 - 5:1</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Other Industries</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Travel & Tourism</span>
                <span className="font-semibold text-purple-600">3:1 - 5:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Food & Beverage</span>
                <span className="font-semibold text-purple-600">4:1 - 6:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Healthcare</span>
                <span className="font-semibold text-purple-600">2:1 - 4:1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Automotive</span>
                <span className="font-semibold text-purple-600">2:1 - 3:1</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Non-profit</span>
                <span className="font-semibold text-purple-600">2:1 - 4:1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROAS Improvement Tips */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">How to Improve Your ROAS</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-yellow-700">
          <div>
            <h4 className="font-semibold mb-2">Increase Revenue:</h4>
            <ul className="space-y-2">
              <li>• Optimize landing pages for conversions</li>
              <li>• Implement upselling and cross-selling</li>
              <li>• Improve product recommendations</li>
              <li>• A/B test pricing strategies</li>
              <li>• Target high-intent keywords</li>
              <li>• Use retargeting campaigns effectively</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Reduce Ad Costs:</h4>
            <ul className="space-y-2">
              <li>• Improve Quality Score/Ad Relevance</li>
              <li>• Use negative keywords to filter traffic</li>
              <li>• Optimize bidding strategies</li>
              <li>• Focus on high-performing ad placements</li>
              <li>• Test different ad formats and creatives</li>
              <li>• Pause underperforming campaigns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Understanding ROAS</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">What is ROAS?</h4>
            <p className="mb-4"><strong>ROAS = Revenue ÷ Ad Spend</strong></p>
            <ul className="space-y-2">
              <li>• Measures advertising campaign effectiveness</li>
              <li>• Shows how much revenue each ad dollar generates</li>
              <li>• Higher ROAS = more profitable campaigns</li>
              <li>• Minimum viable ROAS varies by business model</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">ROAS vs ROI:</h4>
            <ul className="space-y-2">
              <li>• <strong>ROAS:</strong> Revenue generated per ad dollar</li>
              <li>• <strong>ROI:</strong> Profit generated per ad dollar</li>
              <li>• ROAS doesn&apos;t account for product costs</li>
              <li>• ROI gives a clearer picture of profitability</li>
              <li>• Use both metrics for complete analysis</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📊</div>
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
        <FirebaseFAQs pageId="roas-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
