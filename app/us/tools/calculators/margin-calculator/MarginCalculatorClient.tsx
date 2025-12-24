'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
    question: "What is a Margin Calculator?",
    answer: "A Margin Calculator is a free online tool designed to help you quickly and accurately calculate margin-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Margin Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Margin Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Margin Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MarginCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('margin-calculator');

  const [cost, setCost] = useState(100);
  const [sellingPrice, setSellingPrice] = useState(150);
  const [calculationMode, setCalculationMode] = useState<'cost-price' | 'cost-margin' | 'price-margin'>('cost-price');
  const [marginPercent, setMarginPercent] = useState(33.33);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [results, setResults] = useState({
    margin: 0,
    marginPercent: 0,
    markup: 0,
    markupPercent: 0,
    profit: 0
  });

  useEffect(() => {
    calculateMargin();
  }, [cost, sellingPrice, marginPercent, calculationMode]);

  const calculateMargin = () => {
    let calculatedCost = cost;
    let calculatedPrice = sellingPrice;

    if (calculationMode === 'cost-margin') {
      calculatedPrice = calculatedCost / (1 - marginPercent / 100);
    } else if (calculationMode === 'price-margin') {
      calculatedCost = calculatedPrice * (1 - marginPercent / 100);
    }

    const profit = calculatedPrice - calculatedCost;
    const margin = profit;
    const marginPct = calculatedPrice > 0 ? (profit / calculatedPrice) * 100 : 0;
    const markup = profit;
    const markupPct = calculatedCost > 0 ? (profit / calculatedCost) * 100 : 0;

    setResults({
      margin,
      marginPercent: marginPct,
      markup,
      markupPercent: markupPct,
      profit
    });

    if (calculationMode === 'cost-margin') {
      setSellingPrice(parseFloat(calculatedPrice.toFixed(2)));
    } else if (calculationMode === 'price-margin') {
      setCost(parseFloat(calculatedCost.toFixed(2)));
    }
  };

  const handleTemplate = (costVal: number, priceVal: number) => {
    setCost(costVal);
    setSellingPrice(priceVal);
    setCalculationMode('cost-price');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Margin vs Markup comparison table
  const marginMarkupComparison = useMemo(() => {
    const comparisons = [
      { margin: 10, markup: 11.11 },
      { margin: 15, markup: 17.65 },
      { margin: 20, markup: 25.00 },
      { margin: 25, markup: 33.33 },
      { margin: 30, markup: 42.86 },
      { margin: 33.33, markup: 50.00 },
      { margin: 40, markup: 66.67 },
      { margin: 50, markup: 100.00 },
      { margin: 60, markup: 150.00 },
      { margin: 75, markup: 300.00 },
    ];
    return comparisons;
  }, []);

  // Pricing scenarios at different margins
  const pricingScenarios = useMemo(() => {
    const margins = [20, 30, 40, 50];
    return margins.map(m => ({
      margin: m,
      sellingPrice: cost / (1 - m / 100),
      profit: (cost / (1 - m / 100)) - cost,
      markup: (m / (100 - m)) * 100
    }));
  }, [cost]);

  // Break-even analysis
  const breakEvenAnalysis = useMemo(() => {
    const fixedCosts = [500, 1000, 2500, 5000];
    return fixedCosts.map(fc => ({
      fixedCosts: fc,
      unitsNeeded: results.profit > 0 ? Math.ceil(fc / results.profit) : 0,
      revenueNeeded: results.profit > 0 ? Math.ceil(fc / results.profit) * sellingPrice : 0
    }));
  }, [results.profit, sellingPrice]);

  // Donut chart data
  const donutData = useMemo(() => {
    const total = sellingPrice;
    if (total <= 0) return { costPercent: 0, profitPercent: 0 };
    return {
      costPercent: (cost / total) * 100,
      profitPercent: (results.profit / total) * 100
    };
  }, [cost, sellingPrice, results.profit]);

  const faqItems = [
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What is the difference between margin and markup?",
      answer: "Margin is the percentage of the selling price that is profit (Profit ÷ Selling Price × 100), while markup is the percentage added to the cost to get the selling price (Profit ÷ Cost × 100). For example, if a product costs $100 and sells for $150, the margin is 33.33% ($50/$150) and the markup is 50% ($50/$100). Margin is always lower than markup for the same transaction."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "How do I calculate selling price from cost and desired margin?",
      answer: "To calculate selling price from cost and desired margin, use the formula: Selling Price = Cost ÷ (1 - Margin%). For example, if your cost is $100 and you want a 40% margin, the selling price would be $100 ÷ (1 - 0.40) = $100 ÷ 0.60 = $166.67. This ensures your profit is 40% of the final selling price."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What is a good profit margin for my business?",
      answer: "Good profit margins vary significantly by industry. Grocery stores typically operate on 2-5% margins, retail clothing averages 50-60%, restaurants aim for 3-9%, while software and SaaS companies can achieve 60-80% margins. Research your specific industry benchmarks and factor in your operating costs, competition, and target market when setting prices."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "How does margin affect break-even point?",
      answer: "Higher margins mean you need to sell fewer units to cover fixed costs and break even. For example, with a $10 profit per unit and $1,000 in fixed costs, you need 100 sales to break even. If you increase your margin to $20 profit per unit, you only need 50 sales. However, higher prices may reduce sales volume, so finding the optimal price point is crucial."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "Should I use margin or markup for pricing?",
      answer: "Both are useful but serve different purposes. Margin is better for understanding your overall profitability and comparing with industry standards since it relates profit to revenue. Markup is more practical for day-to-day pricing decisions since it directly tells you how much to add to your cost. Many businesses use markup for pricing but track margin for financial reporting."
    }
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Margin Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate profit margin, markup, and pricing strategies for your products</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">

      <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pricing Information</h2>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Scenarios</h3>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => handleTemplate(100, 150)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Retail (50% markup)</button>
                <button type="button" onClick={() => handleTemplate(50, 100)} className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Standard (100% markup)</button>
                <button type="button" onClick={() => handleTemplate(200, 250)} className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Conservative (25% markup)</button>
                <button type="button" onClick={() => handleTemplate(75, 200)} className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Premium (167% markup)</button>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Mode</label>
              <select
                value={calculationMode}
                onChange={(e) => setCalculationMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cost-price">From Cost & Selling Price</option>
                <option value="cost-margin">From Cost & Desired Margin</option>
                <option value="price-margin">From Selling Price & Desired Margin</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    disabled={calculationMode === 'price-margin'}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Product cost or COGS</p>
              </div>

              {calculationMode !== 'cost-margin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      disabled={calculationMode === 'cost-margin'}
                    />
                  </div>
                </div>
              )}

              {calculationMode !== 'cost-price' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired Margin (%)</label>
                  <input
                    type="number"
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="99.9"
                    step="0.1"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>

            {/* Visual Breakdown */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-3 sm:p-4 md:p-6 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-1">{results.marginPercent.toFixed(2)}%</div>
                  <div className="text-sm text-green-600">Profit Margin</div>
                </div>
                <div className="w-px h-12 bg-green-300"></div>
                <div className="text-center flex-1">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-1">{results.markupPercent.toFixed(2)}%</div>
                  <div className="text-sm text-blue-600">Markup</div>
                </div>
              </div>

              {/* Price Breakdown Bar */}
              <div className="mb-4">
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div
                    className="bg-red-400 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${donutData.costPercent}%` }}
                  >
                    {donutData.costPercent > 15 ? 'Cost' : ''}
                  </div>
                  <div
                    className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${donutData.profitPercent}%` }}
                  >
                    {donutData.profitPercent > 15 ? 'Profit' : ''}
                  </div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-red-600">{donutData.costPercent.toFixed(1)}% Cost</span>
                  <span className="text-green-600">{donutData.profitPercent.toFixed(1)}% Profit</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-white/50 p-2 rounded-lg text-center">
                  <div className="text-gray-600">Cost</div>
                  <div className="font-bold text-gray-800">{formatCurrency(cost)}</div>
                </div>
                <div className="bg-white/50 p-2 rounded-lg text-center">
                  <div className="text-gray-600">Price</div>
                  <div className="font-bold text-gray-800">{formatCurrency(sellingPrice)}</div>
                </div>
<div className="bg-white/50 p-2 rounded-lg text-center">
                  <div className="text-gray-600">Profit</div>
                  <div className="font-bold text-green-700">{formatCurrency(results.profit)}</div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Per Unit Economics</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Revenue:</span>
                    <span className="font-semibold">{formatCurrency(sellingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">COGS:</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(cost)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-1">
                    <span className="text-blue-700 font-medium">Gross Profit:</span>
                    <span className="font-bold text-green-600">{formatCurrency(results.profit)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-800 mb-2">Multipliers</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-600">Price/Cost:</span>
                    <span className="font-semibold">{cost > 0 ? (sellingPrice / cost).toFixed(2) : '0'}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">Profit/Cost:</span>
                    <span className="font-semibold">{cost > 0 ? (results.profit / cost).toFixed(2) : '0'}x</span>
                  </div>
                  <div className="flex justify-between border-t border-purple-200 pt-1">
                    <span className="text-purple-700 font-medium">Break-even:</span>
                    <span className="font-bold">{formatCurrency(cost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Pricing Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Pricing Scenarios</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6">See how different margin targets affect your pricing based on your {formatCurrency(cost)} cost</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingScenarios.map((scenario) => (
            <div key={scenario.margin} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-sm text-gray-500 mb-1">At {scenario.margin}% Margin</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">{formatCurrency(scenario.sellingPrice)}</div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(scenario.profit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Markup:</span>
                  <span className="font-semibold text-blue-600">{scenario.markup.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Break-Even Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Break-Even Analysis</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6">Units needed to cover fixed costs at your current {formatCurrency(results.profit)} profit per unit</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {breakEvenAnalysis.map((analysis) => (
            <div key={analysis.fixedCosts} className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
              <div className="text-sm text-orange-600 mb-1">Fixed Costs: {formatCurrency(analysis.fixedCosts)}</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-800 mb-1">{analysis.unitsNeeded.toLocaleString('en-US')}</div>
              <div className="text-sm text-orange-700">units to break even</div>
              <div className="text-xs text-gray-500 mt-2">
                Revenue needed: {formatCurrency(analysis.revenueNeeded)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Margin vs Markup Reference */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Margin vs Markup Reference Table</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Profit Margin Formula</h4>
            <p className="text-blue-700 text-sm mb-2">
              <strong>Margin = (Revenue - Cost) ÷ Revenue × 100</strong>
            </p>
            <p className="text-blue-600 text-sm">
              Margin shows what percentage of the selling price is profit. It is always less than 100%.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Markup Formula</h4>
            <p className="text-green-700 text-sm mb-2">
              <strong>Markup = (Revenue - Cost) ÷ Cost × 100</strong>
            </p>
            <p className="text-green-600 text-sm">
              Markup shows how much you add to your cost. It can exceed 100% for high-margin products.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Margin</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Markup</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Example</th>
              </tr>
            </thead>
            <tbody>
              {marginMarkupComparison.map((row) => (
                <tr key={row.margin} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-blue-700">{row.margin}%</td>
                  <td className="py-2 px-3 font-medium text-green-700">{row.markup.toFixed(2)}%</td>
                  <td className="py-2 px-3 text-gray-600">
                    ${100} cost → ${(100 / (1 - row.margin / 100)).toFixed(2)} price
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Industry Margins */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Common Industry Profit Margins</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700">2-5%</div>
            <div className="text-sm text-red-600 font-medium">Grocery Stores</div>
            <div className="text-xs text-gray-500 mt-1">High volume, low margin</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700">3-9%</div>
            <div className="text-sm text-orange-600 font-medium">Restaurants</div>
            <div className="text-xs text-gray-500 mt-1">Food & labor costs</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">50-60%</div>
            <div className="text-sm text-blue-600 font-medium">Retail Clothing</div>
            <div className="text-xs text-gray-500 mt-1">Keystone pricing</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700">60-80%</div>
            <div className="text-sm text-purple-600 font-medium">Software/SaaS</div>
            <div className="text-xs text-gray-500 mt-1">Low marginal cost</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">20-30%</div>
            <div className="text-sm text-green-600 font-medium">Manufacturing</div>
            <div className="text-xs text-gray-500 mt-1">Equipment costs</div>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-700">40-50%</div>
            <div className="text-sm text-teal-600 font-medium">E-commerce</div>
            <div className="text-xs text-gray-500 mt-1">Varies by niche</div>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-700">70-90%</div>
            <div className="text-sm text-pink-600 font-medium">Jewelry</div>
            <div className="text-xs text-gray-500 mt-1">High perceived value</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-700">15-25%</div>
            <div className="text-sm text-indigo-600 font-medium">Auto Dealers</div>
            <div className="text-xs text-gray-500 mt-1">Financing income</div>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h4>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Profit Margin</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Profit margin is one of the most important metrics for any business. It tells you what percentage of each dollar in sales you actually keep as profit after covering the cost of goods sold. Understanding and optimizing your margin is essential for pricing strategy, profitability analysis, and business growth.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Gross Margin</h4>
              <p className="text-sm text-green-700 mb-2"><strong>(Revenue - COGS) ÷ Revenue × 100</strong></p>
              <p className="text-sm text-green-600">Measures profitability before operating expenses. A $150 sale with $100 cost = 33.3% gross margin.</p>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Net Margin</h4>
              <p className="text-sm text-blue-700 mb-2"><strong>(Net Income ÷ Revenue) × 100</strong></p>
              <p className="text-sm text-blue-600">The bottom line after ALL expenses including overhead, taxes, and interest are deducted.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Margin vs Markup: Key Differences</h3>
          <div className="bg-gray-50 p-5 rounded-xl mb-3 sm:mb-4 md:mb-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Margin (based on price)</p>
                <p className="text-gray-600">Profit ÷ Selling Price = 33.3%</p>
                <p className="text-gray-500 text-xs mt-1">$50 profit ÷ $150 price</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Markup (based on cost)</p>
                <p className="text-gray-600">Profit ÷ Cost = 50%</p>
                <p className="text-gray-500 text-xs mt-1">$50 profit ÷ $100 cost</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing Strategy Tips</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <strong className="text-gray-800">Know your industry benchmarks</strong>
                <p className="text-sm text-gray-600">Compare your margins to competitors and industry averages.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <strong className="text-gray-800">Consider value perception</strong>
                <p className="text-sm text-gray-600">Higher margins are possible when customers see unique value.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <strong className="text-gray-800">Test different price points</strong>
                <p className="text-sm text-gray-600">Sometimes higher prices increase profit despite lower volume.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <div>
                <strong className="text-gray-800">Account for all costs</strong>
                <p className="text-sm text-gray-600">Include shipping, returns, and overhead in your cost calculations.</p>
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
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === index && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="margin-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
