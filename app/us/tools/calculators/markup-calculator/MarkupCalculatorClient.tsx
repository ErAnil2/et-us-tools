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
    question: "What is a Markup Calculator?",
    answer: "A Markup Calculator is a free online tool designed to help you quickly and accurately calculate markup-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Markup Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Markup Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Markup Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MarkupCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('markup-calculator');

  const [cost, setCost] = useState(100);
  const [markupPercent, setMarkupPercent] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(150);
  const [calculationMode, setCalculationMode] = useState<'cost-markup' | 'cost-price' | 'price-markup'>('cost-markup');

  const [results, setResults] = useState({
    sellingPrice: 0,
    markupAmount: 0,
    marginPercent: 0,
    profitAmount: 0
  });

  useEffect(() => {
    calculateMarkup();
  }, [cost, markupPercent, sellingPrice, calculationMode]);

  const calculateMarkup = () => {
    let calcCost = cost;
    let calcPrice = sellingPrice;
    let calcMarkup = markupPercent;

    if (calculationMode === 'cost-markup') {
      // Calculate selling price from cost and markup
      calcPrice = calcCost * (1 + calcMarkup / 100);
    } else if (calculationMode === 'cost-price') {
      // Calculate markup from cost and selling price
      calcMarkup = calcCost > 0 ? ((calcPrice - calcCost) / calcCost) * 100 : 0;
    } else if (calculationMode === 'price-markup') {
      // Calculate cost from selling price and markup
      calcCost = calcPrice / (1 + calcMarkup / 100);
    }

    const markupAmount = calcPrice - calcCost;
    const marginPercent = calcPrice > 0 ? (markupAmount / calcPrice) * 100 : 0;

    setResults({
      sellingPrice: calcPrice,
      markupAmount,
      marginPercent,
      profitAmount: markupAmount
    });

    // Update state based on calculation mode
    if (calculationMode === 'cost-markup') {
      setSellingPrice(parseFloat(calcPrice.toFixed(2)));
    } else if (calculationMode === 'cost-price') {
      setMarkupPercent(parseFloat(calcMarkup.toFixed(2)));
    } else if (calculationMode === 'price-markup') {
      setCost(parseFloat(calcCost.toFixed(2)));
    }
  };

  const handleTemplate = (costVal: number, markupVal: number) => {
    setCost(costVal);
    setMarkupPercent(markupVal);
    setCalculationMode('cost-markup');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Markup Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate product markup, selling price, and profit margins</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Pricing</h2>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button type="button" onClick={() => handleTemplate(100, 50)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Standard (50%)</button>
                <button type="button" onClick={() => handleTemplate(75, 100)} className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Double (100%)</button>
                <button type="button" onClick={() => handleTemplate(200, 25)} className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Low (25%)</button>
                <button type="button" onClick={() => handleTemplate(50, 200)} className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">High (200%)</button>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Mode</label>
              <select
                value={calculationMode}
                onChange={(e) => setCalculationMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cost-markup">Calculate Price (Cost + Markup %)</option>
                <option value="cost-price">Calculate Markup % (Cost + Price)</option>
                <option value="price-markup">Calculate Cost (Price + Markup %)</option>
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
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    disabled={calculationMode === 'price-markup'}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Product cost or COGS</p>
              </div>

              {calculationMode !== 'cost-price' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Markup Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={markupPercent}
                      onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
                      className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="1"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              )}

              {calculationMode !== 'cost-markup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pricing Results</h3>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 md:p-6 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">{formatCurrency(results.sellingPrice)}</div>
                <div className="text-sm text-blue-600 mb-4">Selling Price</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cost:</span>
                  <span className="font-semibold">{formatCurrency(cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Markup Amount:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(results.markupAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Markup %:</span>
                  <span className="font-semibold">{markupPercent.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-3">Profit Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Profit Amount:</span>
                  <span className="font-semibold text-green-700">{formatCurrency(results.profitAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className="font-semibold">{results.marginPercent.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Markup %:</span>
                  <span className="font-semibold">{markupPercent.toFixed(2)}%</span>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-3">
                Margin is based on price, markup is based on cost
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-3">Quick Reference</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Break-even Price:</span>
                  <span className="font-semibold">{formatCurrency(cost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue per Unit:</span>
                  <span className="font-semibold">{formatCurrency(results.sellingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit per Unit:</span>
                  <span className="font-semibold text-purple-700">{formatCurrency(results.profitAmount)}</span>
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Markup Pricing</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Markup is the amount added to the cost of a product to determine its selling price. It&apos;s one of the most fundamental concepts in retail and wholesale pricing. Understanding markup helps businesses set profitable prices while remaining competitive in their market.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Markup Formula</h4>
              <p className="text-blue-700 text-sm mb-2">
                <strong>Markup % = (Selling Price - Cost) ÷ Cost × 100</strong>
              </p>
              <p className="text-blue-600 text-sm">
                Example: ($150 - $100) ÷ $100 = 50% markup
              </p>
            </div>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Selling Price Formula</h4>
              <p className="text-green-700 text-sm mb-2">
                <strong>Selling Price = Cost × (1 + Markup %)</strong>
              </p>
              <p className="text-green-600 text-sm">
                Example: $100 × (1 + 0.50) = $150
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Markup Percentages by Industry</h3>
          <div className="grid md:grid-cols-4 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-700">50%</div>
              <div className="text-sm text-blue-600">General Retail</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
              <div className="text-2xl font-bold text-green-700">100%</div>
              <div className="text-sm text-green-600">Restaurants</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-100">
              <div className="text-2xl font-bold text-purple-700">200%</div>
              <div className="text-sm text-purple-600">Jewelry</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-100">
              <div className="text-2xl font-bold text-orange-700">300%+</div>
              <div className="text-sm text-orange-600">Luxury Goods</div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Markup vs Margin: Key Difference</h3>
          <div className="bg-gray-50 p-5 rounded-xl mb-3 sm:mb-4 md:mb-6">
            <p className="text-sm text-gray-700 mb-3">
              <strong>Markup</strong> is calculated as a percentage of COST. <strong>Margin</strong> is calculated as a percentage of SELLING PRICE.
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 100% markup = 50% margin ($100 cost → $200 price)</p>
              <p>• 50% markup = 33.3% margin ($100 cost → $150 price)</p>
              <p>• Markup is always higher than the equivalent margin</p>
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
            <h3 className="text-base font-semibold text-gray-800 mb-2">What&apos;s the difference between markup and margin?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Markup is the percentage added to cost to get the selling price (profit ÷ cost). Margin is the percentage of selling price that&apos;s profit (profit ÷ price). A 100% markup equals a 50% margin. Both measure profitability but from different perspectives. Use markup for pricing decisions; use margin for financial reporting and comparisons.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What markup percentage should I use?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              This depends on your industry, competition, and operating costs. Grocery stores may use 15-25% markup, while clothing retailers often use 100% (keystone pricing). Consider all costs including rent, labor, and overhead when setting markup. Your markup must cover these expenses and still provide profit.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How do I convert markup to margin?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Use this formula: Margin = Markup ÷ (1 + Markup). For example, 50% markup: 0.50 ÷ 1.50 = 33.3% margin. To convert margin to markup: Markup = Margin ÷ (1 - Margin). For example, 40% margin: 0.40 ÷ 0.60 = 66.7% markup.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What is keystone pricing?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Keystone pricing is a retail strategy where the selling price is double the cost (100% markup or 50% margin). It&apos;s a simple, widely-used method that typically covers overhead and provides reasonable profit. However, it may need adjustment based on competition, demand elasticity, and specific product categories.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Should I use the same markup for all products?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Not necessarily. Different products may warrant different markups based on demand, competition, and perceived value. Commodity items may need lower markups to remain competitive, while unique or exclusive products can command higher markups. Many businesses use variable markup strategies to maximize overall profitability.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="markup-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
