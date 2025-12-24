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
    question: "What is a Percent Off Calculator?",
    answer: "A Percent Off Calculator is a free online tool designed to help you quickly and accurately calculate percent off-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Percent Off Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Percent Off Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Percent Off Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PercentOffCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('percent-off-calculator');

  const [originalPrice, setOriginalPrice] = useState(100);
  const [percentOff, setPercentOff] = useState(25);
  const [includeTax, setIncludeTax] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [itemCount, setItemCount] = useState(1);

  // Results
  const [finalPrice, setFinalPrice] = useState('$75.00');
  const [originalDisplay, setOriginalDisplay] = useState('$100.00');
  const [discountAmount, setDiscountAmount] = useState('-$25.00');
  const [discountedPrice, setDiscountedPrice] = useState('$75.00');
  const [taxAmount, setTaxAmount] = useState('$0.00');
  const [totalSavings, setTotalSavings] = useState('$25.00');
  const [savingsPercent, setSavingsPercent] = useState('25%');
  const [multipleItemsTotal, setMultipleItemsTotal] = useState('$75.00');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateDiscount = () => {
    const price = originalPrice || 0;
    const discount = percentOff || 0;
    const tax = includeTax ? (taxRate || 0) : 0;
    const count = itemCount || 1;

    if (price <= 0) {
      resetResults();
      return;
    }

    // Calculate discount
    const discAmount = price * (discount / 100);
    const priceAfterDiscount = price - discAmount;

    // Calculate tax if included
    let taxAmt = 0;
    let finalPriceValue = priceAfterDiscount;

    if (includeTax && tax > 0) {
      taxAmt = priceAfterDiscount * (tax / 100);
      finalPriceValue = priceAfterDiscount + taxAmt;
    }

    // Calculate totals for multiple items
    const multiTotal = finalPriceValue * count;

    // Update displays
    setOriginalDisplay(formatCurrency(price));
    setDiscountAmount('-' + formatCurrency(discAmount));
    setDiscountedPrice(formatCurrency(priceAfterDiscount));
    setFinalPrice(formatCurrency(finalPriceValue));
    setTotalSavings(formatCurrency(discAmount));
    setSavingsPercent(discount + '%');
    setTaxAmount(formatCurrency(taxAmt));
    setMultipleItemsTotal(formatCurrency(multiTotal));
  };

  const resetResults = () => {
    setOriginalDisplay('$0.00');
    setDiscountAmount('-$0.00');
    setDiscountedPrice('$0.00');
    setFinalPrice('$0.00');
    setTotalSavings('$0.00');
    setSavingsPercent('0%');
    setTaxAmount('$0.00');
    setMultipleItemsTotal('$0.00');
  };

  const setDiscount = (percent: number) => {
    setPercentOff(percent);
  };

  useEffect(() => {
    calculateDiscount();
  }, [originalPrice, percentOff, includeTax, taxRate, itemCount]);

  const commonDiscounts = [10, 15, 20, 25, 30, 40, 50, 75];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Percent Off Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate discount amounts and final sale prices from percentage off deals</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Discount Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 100.00"
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Percent Off (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g., 25"
                value={percentOff || ''}
                onChange={(e) => setPercentOff(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Quick Discount Presets */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Common Discounts</h4>
              <div className="grid grid-cols-4 gap-2">
                {commonDiscounts.map((discount) => (
                  <button
                    key={discount}
                    onClick={() => setDiscount(discount)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm"
                  >
                    {discount}%
                  </button>
                ))}
              </div>
            </div>

            {/* Tax Calculator */}
            <div className="border-t pt-4">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="includeTax"
                  checked={includeTax}
                  onChange={(e) => setIncludeTax(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="includeTax" className="text-sm font-medium text-gray-700">Add Sales Tax</label>
              </div>
              {includeTax && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 8.5"
                    value={taxRate || ''}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Price Breakdown</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{finalPrice}</div>
                <div className="text-green-700">Final Price</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="font-semibold">{originalDisplay}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Discount Amount:</span>
                  <span className="font-semibold text-red-600">{discountAmount}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Price After Discount:</span>
                  <span className="font-semibold">{discountedPrice}</span>
                </div>

                {includeTax && taxRate > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Tax Amount:</span>
                    <span className="font-semibold">{taxAmount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">You Save:</span>
                  <span className="font-semibold text-green-600">{totalSavings}</span>
                </div>
              </div>

              {/* Savings Percentage */}
              <div className="bg-yellow-100 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-yellow-600">{savingsPercent}</div>
                <div className="text-yellow-700 text-sm">Money Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Multiple Items Calculator */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Multiple Items Calculator</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Number of Items</label>
            <input
              type="number"
              min="1"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value) || 1)}
              className="w-full px-2 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-purple-600">Total for {itemCount} item(s):</div>
            <div className="text-2xl font-bold text-purple-600">{multipleItemsTotal}</div>
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Common Shopping Scenarios</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Clothing Sale</h4>
            <p className="text-sm text-green-700">$80 shirt, 25% off</p>
            <p className="font-medium text-green-600">Final Price: $60.00</p>
            <p className="text-xs text-green-600">You save: $20.00</p>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Electronics Deal</h4>
            <p className="text-sm text-green-700">$500 gadget, 15% off</p>
            <p className="font-medium text-green-600">Final Price: $425.00</p>
            <p className="text-xs text-green-600">You save: $75.00</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Clearance Item</h4>
            <p className="text-sm text-green-700">$200 item, 70% off</p>
            <p className="font-medium text-green-600">Final Price: $60.00</p>
            <p className="text-xs text-green-600">You save: $140.00</p>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">How Percent Off Works</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Calculation Formula:</h4>
            <ul className="space-y-2">
              <li>• <strong>Discount Amount = Original Price x (Percent Off / 100)</strong></li>
              <li>• <strong>Sale Price = Original Price - Discount Amount</strong></li>
              <li>• <strong>Final Price = Sale Price + Tax (if applicable)</strong></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Shopping Tips:</h4>
            <ul className="space-y-2">
              <li>• Compare percent off vs. dollar amount discounts</li>
              <li>• Factor in taxes for final cost</li>
              <li>• Consider shipping costs for online purchases</li>
              <li>• Check if additional discounts can be stacked</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">%</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="percent-off-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
