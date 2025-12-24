'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

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

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export default function CurrencyConverterClient() {
  const { getH1, getSubHeading } = usePageSEO('currency-converter');

  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(0);
  const [hoveredCurrency, setHoveredCurrency] = useState<string | null>(null);

  // Exchange rates relative to USD (updated for realistic values)
  const rates: Record<string, number> = {
    'USD': 1,
    'EUR': 0.92,
    'GBP': 0.79,
    'INR': 83.12,
    'JPY': 149.50,
    'CAD': 1.36,
    'AUD': 1.53,
    'CHF': 0.88,
    'CNY': 7.24,
    'MXN': 17.05,
    'BRL': 4.97,
    'KRW': 1320.50,
    'SGD': 1.34,
    'HKD': 7.82,
    'NZD': 1.63,
    'SEK': 10.42,
    'NOK': 10.65,
    'DKK': 6.88,
    'ZAR': 18.75,
    'AED': 3.67
  };

  useEffect(() => {
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    const converted = (amount / fromRate) * toRate;
    setResult(converted);
  }, [amount, fromCurrency, toCurrency]);

  const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' }
  ];

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value: number, code: string) => {
    const curr = currencies.find(c => c.code === code);
    if (code === 'JPY' || code === 'KRW') {
      return `${curr?.symbol || ''}${Math.round(value).toLocaleString()}`;
    }
    return `${curr?.symbol || ''}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const exchangeRate = useMemo(() => {
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    return toRate / fromRate;
  }, [fromCurrency, toCurrency]);

  const reverseRate = useMemo(() => {
    return 1 / exchangeRate;
  }, [exchangeRate]);

  const quickAmounts = [100, 500, 1000, 5000, 10000];

  const popularConversions = useMemo(() => {
    const fromRate = rates[fromCurrency] || 1;
    const popular = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD'].filter(c => c !== fromCurrency);
    return popular.map(code => ({
      code,
      currency: currencies.find(c => c.code === code),
      rate: rates[code] / fromRate,
      converted: (amount / fromRate) * rates[code]
    }));
  }, [fromCurrency, amount]);

  const rateComparison = useMemo(() => {
    const fromRate = rates[fromCurrency] || 1;
    const comparisons = ['EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD'].filter(c => c !== fromCurrency);
    const ratesForComparison = comparisons.map(code => ({
      code,
      rate: rates[code] / fromRate,
      currency: currencies.find(c => c.code === code)
    }));
    const maxRate = Math.max(...ratesForComparison.map(r => r.rate));
    return ratesForComparison.map(r => ({ ...r, percent: (r.rate / maxRate) * 100 }));
  }, [fromCurrency]);

  const relatedCalculators = [
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' },
    { href: '/us/tools/calculators/tip-calculator', title: 'Tip Calculator', description: 'Calculate tips & splits' },
    { href: '/us/tools/calculators/discount-calculator', title: 'Discount Calculator', description: 'Calculate sale prices' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert measurements' },
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Convert lengths' },
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weights' }
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: 'What determines currency exchange rates?',
      answer: 'Exchange rates are determined by supply and demand in the foreign exchange market. Key factors include interest rate differentials between countries, inflation rates, trade balances, political stability, and economic growth. Central bank policies and market speculation also play significant roles. Rates fluctuate constantly as these factors change.',
    order: 1
  },
    {
    id: '2',
    question: "What's the difference between the buy and sell rate?",
      answer: "The buy rate (bid) is what the exchange service pays when buying currency from you. The sell rate (ask) is what they charge when selling currency to you. The difference (spread) is their profit. Banks and exchange services typically add 2-5% markup to the mid-market rate. Online services often offer better rates than physical exchange bureaus.",
    order: 2
  },
    {
    id: '3',
    question: 'Where can I get the best exchange rates?',
      answer: 'Online currency exchange services and fintech apps (like Wise, Revolut, or OFX) typically offer rates closest to the mid-market rate. Credit unions and some banks offer competitive rates for larger amounts. Avoid exchanging at airports, hotels, and tourist areas where rates are typically 10-15% worse. Always compare total costs including any fees.',
    order: 3
  },
    {
    id: '4',
    question: 'Should I exchange money before or during travel?',
      answer: "For popular currencies, it's often better to wait until you arrive and use ATMs with a fee-free debit card. However, having some local currency for immediate expenses (transport, tips) is wise. For less common currencies, exchanging in advance may be necessary. Always avoid dynamic currency conversion at merchants abroad - choose to pay in local currency.",
    order: 4
  },
    {
    id: '5',
    question: 'How do exchange rate fluctuations affect my money?',
      answer: 'If you are converting money, rate fluctuations directly impact how much you receive. For regular international transfers or investments, timing matters. A 5% rate movement on a $10,000 transfer means $500 difference. For long-term foreign investments or income, currency hedging strategies may be appropriate. Monitor rates and consider setting rate alerts for large transfers.',
    order: 5
  }
  ];

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Currency Converter",
          "description": "Free online currency converter with live exchange rates. Convert between 20+ world currencies including USD, EUR, GBP, INR, JPY, and more.",
          "url": "https://calculatorhub.com/us/tools/calculators/currency-converter",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any",
          "permissions": "browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": fallbackFaqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calculatorhub.com" },
            { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://calculatorhub.com/us/tools/calculators" },
            { "@type": "ListItem", "position": 3, "name": "Currency Converter", "item": "https://calculatorhub.com/us/tools/calculators/currency-converter" }
          ]
        })
      }} />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{getH1('Currency Converter')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert between world currencies with live exchange rates. Free, fast, and accurate currency conversion.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Converter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 text-xl font-bold text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex justify-center gap-2 flex-wrap">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    amount === amt ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Currency Selectors */}
            <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={swapCurrencies}
                className="p-3 bg-green-100 hover:bg-green-200 rounded-full transition-colors mb-0.5"
                title="Swap currencies"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Card */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 sm:p-4 md:p-6 text-white">
              <div className="text-sm opacity-90 mb-1">Converted Amount</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                {formatCurrency(result, toCurrency)}
              </div>
              <div className="text-sm opacity-90 mt-2">
                {formatCurrency(amount, fromCurrency)} = {formatCurrency(result, toCurrency)}
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">1 {fromCurrency} =</span>
                <span className="font-bold text-gray-800">{exchangeRate.toFixed(4)} {toCurrency}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-600">1 {toCurrency} =</span>
                <span className="font-bold text-gray-800">{reverseRate.toFixed(4)} {fromCurrency}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-700 text-center">
                Exchange rates are indicative. For actual transactions, check with your bank or exchange service.
              </p>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        {/* Popular Conversions */}

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="currency-converter" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href}>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-full">
                  <h3 className="font-medium text-gray-900 text-sm">{calc.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
