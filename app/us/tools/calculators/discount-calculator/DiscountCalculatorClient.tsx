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
    question: "What is a Discount Calculator?",
    answer: "A Discount Calculator is a free online tool designed to help you quickly and accurately calculate discount-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Discount Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Discount Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Discount Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function DiscountCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('discount-calculator');

  const [originalPrice, setOriginalPrice] = useState(100);
  const [discountPercent, setDiscountPercent] = useState(20);
  
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    calculateDiscount();
  }, [originalPrice, discountPercent]);

  const calculateDiscount = () => {
    const discount = (originalPrice * discountPercent) / 100;
    const final = originalPrice - discount;
    
    setDiscountAmount(discount);
    setFinalPrice(final);
    setSavings(discount);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const quickDiscounts = [10, 15, 20, 25, 30, 40, 50, 75];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Discount Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate sale prices and savings instantly</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">

      <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Price Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="100.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount: {discountPercent}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Discounts</label>
              <div className="grid grid-cols-4 gap-2">
                {quickDiscounts.map((percent) => (
                  <button
                    key={percent}
                    onClick={() => setDiscountPercent(percent)}
                    className={`py-2 px-3 rounded-lg font-medium transition-all ${
                      discountPercent === percent
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Discount Summary</h2>
            
            <div className="space-y-4">
              <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1">Final Price</div>
                <div className="text-5xl font-bold text-green-700">{formatCurrency(finalPrice)}</div>
                <div className="text-xs text-green-600 mt-1">After {discountPercent}% discount</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-xs text-red-600 mb-1">You Save</div>
                  <div className="text-2xl font-bold text-red-700">{formatCurrency(savings)}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Discount Amount</div>
                  <div className="text-2xl font-bold text-blue-700">{formatCurrency(discountAmount)}</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-3">Breakdown</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="font-semibold">{formatCurrency(originalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount ({discountPercent}%):</span>
                    <span className="font-semibold text-red-700">-{formatCurrency(discountAmount)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between">
                    <span className="text-gray-800 font-medium">Final Price:</span>
                    <span className="font-bold text-lg text-green-700">{formatCurrency(finalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-700 mb-2">Savings Percentage</div>
                <div className="flex items-center justify-between">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700">{discountPercent}%</div>
                  <div className="text-sm text-purple-600">
                    You're saving<br/>{formatCurrency(savings)}
                  </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">🏷️</div>
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
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Discounts and Savings</h2>
        <p className="text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Calculating discounts accurately is essential for smart shopping. Whether you're comparing prices across stores, evaluating sale offers,
          or determining if a discount is truly worthwhile, understanding how to calculate the final price and actual savings helps you make
          informed purchasing decisions and stretch your budget further.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-red-50 rounded-xl p-5">
            <h3 className="font-semibold text-red-800 mb-2">Percentage Off</h3>
            <p className="text-xs text-gray-600 leading-relaxed">The most common discount type, calculated as a percentage of the original price</p>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-2">Dollar Amount Off</h3>
            <p className="text-xs text-gray-600 leading-relaxed">Fixed savings regardless of the original price - better for lower-priced items</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 mb-2">BOGO Deals</h3>
            <p className="text-xs text-gray-600 leading-relaxed">Buy One Get One offers effectively give 50% off when buying two items</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Discount Calculation Formula</h2>
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 font-mono text-sm overflow-x-auto mb-3 sm:mb-4 md:mb-6">
          <p className="mb-4 font-bold">Discount Amount = Original Price × (Discount % ÷ 100)</p>
          <p className="mb-4 font-bold">Final Price = Original Price - Discount Amount</p>
          <div className="text-gray-600 space-y-1 border-t border-gray-200 pt-3">
            <p>Example: $100 item with 25% off</p>
            <p>Discount = $100 × (25 ÷ 100) = $25</p>
            <p>Final Price = $100 - $25 = $75</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Compare Discounts Wisely</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>20% off $50 saves $10 vs $5 off = 20% off wins</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>30% off $30 saves $9 vs $10 off = $10 off wins</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>Always calculate actual dollar savings to compare</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>Consider if you'd buy at the original price</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Stacking Discounts</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Store sales + manufacturer coupons often stack</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Credit card cashback adds to discount savings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Multiple % discounts multiply, don't add directly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>20% + 10% off = 28% off (not 30%)</span>
              </li>
            </ul>
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
            <h3 className="text-base font-semibold text-gray-800 mb-2">Is a bigger percentage always a better deal?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Not necessarily. A 50% discount on an inflated price might still cost more than a 20% discount on a competitively priced item.
              Always compare the final prices across retailers, not just the discount percentages. Some stores artificially raise prices before
              sales to make discounts appear larger than they actually are.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How do I calculate multiple discounts?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              When discounts stack (like an extra 20% off sale items), they multiply rather than add. For example, an item that&apos;s 30% off with
              an additional 20% off isn&apos;t 50% off total. Instead: $100 × 0.70 = $70, then $70 × 0.80 = $56. The combined discount is 44%, not 50%.
              This is why &quot;extra percentage off&quot; promotions sometimes feel less impactful than expected.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">When should I choose a dollar-off coupon vs. percentage off?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Compare which saves more money. Divide the dollar amount by the original price to get the equivalent percentage. If $15 off a $50 item
              (30% equivalent) is offered alongside 25% off, the $15 off is better. Generally, dollar amounts are better for cheaper items, while
              percentage discounts become more valuable as prices increase.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What&apos;s the difference between &quot;off&quot; and &quot;up to&quot; in sales?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              &quot;Up to X% off&quot; means the maximum discount available, which may only apply to select items. Most products in such sales typically have
              smaller discounts (10-20%), with only a few items reaching the advertised maximum. &quot;X% off everything&quot; or &quot;X% off sitewide&quot; means
              the discount applies uniformly to all items, making it a more straightforward deal.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How do I know if a sale is actually a good deal?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Track prices before sales using browser extensions or price-tracking websites. Check the item&apos;s price history to ensure it&apos;s not
              artificially inflated before the sale. Compare prices across multiple retailers - sometimes &quot;sale&quot; prices at one store are regular
              prices elsewhere. Also consider whether you actually need the item, as no discount saves money on unnecessary purchases.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="discount-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
