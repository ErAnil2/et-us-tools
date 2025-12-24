'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface CostPriceClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Cost Price Calculator?",
    answer: "A Cost Price Calculator is a free online tool designed to help you quickly and accurately calculate cost price-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Cost Price Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Cost Price Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Cost Price Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CostPriceClient({ relatedCalculators = defaultRelatedCalculators }: CostPriceClientProps) {
  const { getH1, getSubHeading } = usePageSEO('cost-price-calculator');

  const [sellingPrice, setSellingPrice] = useState(100);
  const [markupPercent, setMarkupPercent] = useState(25);

  // Calculated values
  const [costPrice, setCostPrice] = useState(0);
  const [profitAmount, setProfitAmount] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [costPercentage, setCostPercentage] = useState(0);

  useEffect(() => {
    calculateCostPrice();
  }, [sellingPrice, markupPercent]);

  const calculateCostPrice = () => {
    if (sellingPrice <= 0) {
      resetResults();
      return;
    }

    if (markupPercent < 0) {
      resetResults();
      return;
    }

    const cost = sellingPrice / (1 + (markupPercent / 100));
    const profit = sellingPrice - cost;
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    const costPct = sellingPrice > 0 ? (cost / sellingPrice) * 100 : 0;

    setCostPrice(cost);
    setProfitAmount(profit);
    setProfitMargin(margin);
    setCostPercentage(costPct);
  };

  const resetResults = () => {
    setCostPrice(0);
    setProfitAmount(0);
    setProfitMargin(0);
    setCostPercentage(0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Cost Price Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">{getH1('Cost Price Calculator')}</h1>
        <p className="text-sm md:text-lg text-gray-600">Calculate the cost price from selling price and markup percentage</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Calculate Cost Price</h2>
          <p className="text-gray-600">Determine the cost price from selling price and markup percentage</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Enter Values</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price ($)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                step="0.01"
                placeholder="e.g., 100.00"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Markup Percentage (%)</label>
              <input
                type="number"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
                placeholder="e.g., 25"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>

              <div className="space-y-4">
                <div className="bg-orange-100 rounded-lg p-4 text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">{formatCurrency(costPrice)}</div>
                  <div className="text-orange-700">Cost Price</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Profit Amount:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(profitAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Profit Margin:</span>
                    <span className="font-semibold text-blue-600">{profitMargin.toFixed(1)}%</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Cost as % of Sale:</span>
                    <span className="font-semibold text-gray-600">{costPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Breakdown</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Cost Price</span>
                    <span className="font-semibold">{formatCurrency(costPrice)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${costPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Profit</span>
                    <span className="font-semibold">{formatCurrency(profitAmount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${profitMargin}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-orange-800 mb-4">Cost Price Formula</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-orange-700">
          <div>
            <h4 className="font-semibold mb-2">Key Formula:</h4>
            <p className="mb-4">Cost Price = Selling Price ÷ (1 + Markup %)</p>
            <h4 className="font-semibold mb-2">Example:</h4>
            <p className="text-sm">If Selling Price = $100 and Markup = 25%</p>
            <p className="text-sm">Cost Price = $100 ÷ (1 + 0.25) = $80</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Key Points:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Used for reverse calculations</li>
              <li>• Helps determine wholesale prices</li>
              <li>• Useful for competitive analysis</li>
              <li>• Essential for procurement planning</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Common Use Cases</h3>
        <div className="grid md:grid-cols-3 gap-4 text-blue-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Competitive Analysis</h4>
            <p className="text-sm">Determine competitor's cost structure from their selling prices</p>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Procurement Planning</h4>
            <p className="text-sm">Calculate maximum cost price for desired profit margins</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Wholesale Pricing</h4>
            <p className="text-sm">Determine wholesale prices from retail markup strategies</p>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Business Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Understanding Cost Price in Business</h2>
        <div className="prose max-w-none text-gray-600 space-y-4">
          <p>
            Cost price, also known as cost of goods sold (COGS) or purchase price, represents the total expense incurred to produce or acquire a product before any markup is applied. For manufacturers, this includes raw materials, direct labor, and manufacturing overhead. For retailers, cost price encompasses the wholesale purchase price plus shipping, handling, and any import duties. Accurately calculating cost price is fundamental to setting profitable selling prices and maintaining healthy business margins.
          </p>
          <p>
            The relationship between cost price, selling price, and markup determines profitability. If you know the selling price and markup percentage, you can reverse-calculate the cost price using the formula: Cost Price = Selling Price ÷ (1 + Markup%). This reverse calculation is valuable for competitive analysis—estimating what competitors pay for products—and for procurement planning when negotiating with suppliers to achieve target profit margins.
          </p>
          <p>
            Distinguishing between markup and margin is crucial for accurate pricing. Markup is calculated on cost price (a 25% markup on $80 cost = $100 selling price), while margin is calculated on selling price (the same transaction represents a 20% margin). Many business owners confuse these terms, leading to pricing errors. A 50% markup only yields a 33% profit margin, and a 100% markup produces just a 50% margin—understanding this relationship prevents underpricing products.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What is the difference between cost price and selling price?</h3>
            <p className="text-gray-600">Cost price is what you pay to acquire or produce a product, including all associated expenses. Selling price is what customers pay you for that product. The difference between selling price and cost price equals your gross profit. For example, if a product costs $60 to acquire and sells for $100, your gross profit is $40, representing a 67% markup on cost or 40% profit margin on sales.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I calculate cost price if I only know selling price and profit margin?</h3>
            <p className="text-gray-600">Use the formula: Cost Price = Selling Price × (1 - Profit Margin%). For example, if selling price is $100 and profit margin is 40%, Cost Price = $100 × (1 - 0.40) = $60. Alternatively, if you know the markup percentage instead of margin, use: Cost Price = Selling Price ÷ (1 + Markup%). With a 25% markup on a $100 selling price: Cost = $100 ÷ 1.25 = $80.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What expenses should be included in cost price?</h3>
            <p className="text-gray-600">For retailers: purchase price, shipping/freight, import duties, and handling costs. For manufacturers: raw materials, direct labor, manufacturing overhead (utilities, equipment depreciation, factory rent). Storage costs, insurance during transit, and quality inspection fees should also be included. General business expenses like marketing, administrative salaries, and office rent are typically excluded from cost price and categorized as operating expenses.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Why is markup different from profit margin?</h3>
            <p className="text-gray-600">Markup is the percentage added to cost price to determine selling price, while margin is the percentage of selling price that represents profit. They use different bases: markup uses cost as the denominator, margin uses selling price. A 50% markup (Cost × 1.5) produces only a 33.3% margin. To convert: Margin = Markup ÷ (1 + Markup), and Markup = Margin ÷ (1 - Margin). Understanding both metrics prevents pricing mistakes.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I use cost price analysis for competitive pricing?</h3>
            <p className="text-gray-600">By knowing industry-standard markups and competitor selling prices, you can estimate their cost structure. If competitors sell at $100 with typical 40% markups, their cost is approximately $71. This insight helps with supplier negotiations—if your cost exceeds $71, you may need better terms or alternative suppliers. It also reveals whether competitors are potentially selling at thin margins (aggressive pricing) or enjoying premium positioning.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What is a typical markup percentage for retail products?</h3>
            <p className="text-gray-600">Markups vary significantly by industry and product category. Grocery items typically use 5-25% markup due to high volume and competition. Clothing and apparel often use 50-100% markup (keystone pricing doubles cost). Electronics average 30-50%, while jewelry and luxury goods may apply 100-300% markups. Higher-margin industries require fewer sales to cover fixed costs, while low-margin businesses depend on volume.</p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="cost-price-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
