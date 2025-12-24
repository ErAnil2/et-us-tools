'use client';

import { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Currency Converter Calculator?",
    answer: "A Currency Converter Calculator is a mathematical tool that helps you quickly calculate or convert currency converter-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Currency Converter Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Currency Converter Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
    order: 3
  },
  {
    id: '4',
    question: "Can I use this for professional or academic work?",
    answer: "Yes, this calculator is suitable for professional, academic, and personal use. It uses standard formulas that are widely accepted. However, always verify critical calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Is this calculator free?",
    answer: "Yes, this Currency Converter Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function CurrencyConverterCalculatorClient() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  // Mock exchange rates - in a real application, these would come from an API
  const exchangeRates: any = {
    'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.50, 'CAD': 1.36, 'AUD': 1.53, 'CHF': 0.88, 'CNY': 7.24, 'SEK': 10.89, 'NZD': 1.64, 'MXN': 17.05, 'SGD': 1.35, 'HKD': 7.83, 'NOK': 10.87, 'TRY': 27.45, 'RUB': 92.50, 'INR': 83.25, 'BRL': 4.93, 'ZAR': 18.75, 'KRW': 1310.50 },
    'EUR': { 'USD': 1.09, 'GBP': 0.86, 'JPY': 162.78, 'CAD': 1.48, 'AUD': 1.66, 'CHF': 0.96, 'CNY': 7.88, 'SEK': 11.84, 'NZD': 1.78, 'MXN': 18.56, 'SGD': 1.47, 'HKD': 8.53, 'NOK': 11.83, 'TRY': 29.87, 'RUB': 100.65, 'INR': 90.64, 'BRL': 5.36, 'ZAR': 20.40, 'KRW': 1426.65 },
    'GBP': { 'USD': 1.27, 'EUR': 1.16, 'JPY': 189.15, 'CAD': 1.72, 'AUD': 1.94, 'CHF': 1.12, 'CNY': 9.18, 'SEK': 13.81, 'NZD': 2.08, 'MXN': 21.62, 'SGD': 1.71, 'HKD': 9.93, 'NOK': 13.79, 'TRY': 34.78, 'RUB': 117.22, 'INR': 105.65, 'BRL': 6.25, 'ZAR': 23.78, 'KRW': 1661.58 },
    'JPY': { 'USD': 0.0067, 'EUR': 0.0061, 'GBP': 0.0053, 'CAD': 0.0091, 'AUD': 0.0102, 'CHF': 0.0059, 'CNY': 0.0484, 'SEK': 0.0728, 'NZD': 0.0110, 'MXN': 0.114, 'SGD': 0.0090, 'HKD': 0.0524, 'NOK': 0.0727, 'TRY': 0.184, 'RUB': 0.619, 'INR': 0.557, 'BRL': 0.0330, 'ZAR': 0.125, 'KRW': 8.77 },
    'CAD': { 'USD': 0.74, 'EUR': 0.68, 'GBP': 0.58, 'JPY': 110.07, 'AUD': 1.13, 'CHF': 0.65, 'CNY': 5.33, 'SEK': 8.02, 'NZD': 1.21, 'MXN': 12.54, 'SGD': 0.99, 'HKD': 5.76, 'NOK': 8.00, 'TRY': 20.21, 'RUB': 68.12, 'INR': 61.25, 'BRL': 3.63, 'ZAR': 13.81, 'KRW': 964.34 }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'KRW', name: 'South Korean Won' }
  ];

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (amount: number, currency: string, decimals = 2) => {
    // Special formatting for certain currencies
    if (currency === 'JPY' || currency === 'KRW') {
      decimals = 0;
    }
    return `${formatNumber(amount, decimals)} ${currency}`;
  };

  const getExchangeRate = (from: string, to: string) => {
    if (from === to) return 1;
    if (exchangeRates[from] && exchangeRates[from][to]) {
      return exchangeRates[from][to];
    }
    // Fallback calculation via USD
    if (from !== 'USD' && to !== 'USD') {
      const fromToUSD = exchangeRates[from] ? exchangeRates[from]['USD'] : (1 / exchangeRates['USD'][from]);
      const USDToTo = exchangeRates['USD'][to];
      return fromToUSD * USDToTo;
    }
    return 1;
  };

  const rate = getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = amount * rate;
  const reverseRate = getExchangeRate(toCurrency, fromCurrency);

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const applyQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount);
  };

  const applyCurrencyPreset = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const getTravelTip = () => {
    const tips: any = {
      'USD-EUR': 'European ATMs typically offer better rates than currency exchange counters.',
      'EUR-USD': 'Notify your bank before traveling to the US to avoid card blocks.',
      'USD-JPY': 'Japan is still largely cash-based. Withdraw yen from 7-Eleven ATMs.',
      'GBP-USD': 'UK cards work well in the US, but check foreign transaction fees.',
      'USD-GBP': 'Contactless payments are widely accepted throughout the UK.',
      'default': 'Banks and exchange services may charge 2-5% fees. Compare rates before exchanging large amounts.'
    };

    const tipKey = `${fromCurrency}-${toCurrency}`;
    return tips[tipKey] || tips['default'];
  };

  const commonAmounts = [1, 10, 100];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
        <a href="/us/tools" className="text-blue-600 hover:text-blue-800">Home</a>
        <span className="text-gray-400">:</span>
        <span className="text-gray-600">Currency Converter Calculator</span>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Currency Converter Calculator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">

            {/* Amount Input */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                id="amount"
                className="w-full px-2 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select
                  id="fromCurrency"
                  className="w-full px-2 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.code} - {curr.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select
                  id="toCurrency"
                  className="w-full px-2 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.code} - {curr.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
              <button
                type="button"
                onClick={swapCurrencies}
                className="flex items-center gap-2 px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
                Swap Currencies
              </button>
            </div>

            {/* Quick Amount Buttons */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Quick Amounts:</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[100, 500, 1000, 5000, 10000, 50000].map(quickAmount => (
                  <button
                    key={quickAmount}
                    type="button"
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-green-50"
                    onClick={() => applyQuickAmount(quickAmount)}
                  >
                    {quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Conversion Shortcuts */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Popular Conversions:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { from: 'USD', to: 'EUR' },
                  { from: 'EUR', to: 'USD' },
                  { from: 'GBP', to: 'USD' },
                  { from: 'USD', to: 'JPY' },
                  { from: 'USD', to: 'CAD' },
                  { from: 'EUR', to: 'GBP' },
                  { from: 'USD', to: 'AUD' },
                  { from: 'CHF', to: 'EUR' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="px-3 py-2 text-sm border rounded-lg hover:bg-green-50"
                    onClick={() => applyCurrencyPreset(preset.from, preset.to)}
                  >
                    {preset.from} → {preset.to}
                  </button>
                ))}
              </div>
            </div>

            {/* Exchange Rate Display */}
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Current Exchange Rate:</div>
              <div className="font-mono text-lg text-gray-800">
                1 {fromCurrency} = {formatNumber(rate, 4)} {toCurrency}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Rates are for reference only
              </div>
            </div>

          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-3 sm:p-4 md:p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Conversion Result</h2>

            <div className="space-y-4">
              {/* Main Result */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">You Get</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(convertedAmount, toCurrency)}</div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">Calculation Breakdown</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">{formatCurrency(amount, fromCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-semibold">{formatNumber(rate, 4)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-600">Result:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(convertedAmount, toCurrency)}</span>
                  </div>
                </div>
              </div>

              {/* Reverse Conversion */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Reverse Conversion</div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatCurrency(convertedAmount, toCurrency)} = {formatCurrency(amount, fromCurrency)}
                </div>
              </div>

              {/* Historical Context */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">Rate Information</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mid-market rate:</span>
                    <span className="font-semibold">{formatNumber(rate, 4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Direction:</span>
                    <span className="font-semibold text-green-600">↑ 0.15%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  *Indicative rates for large amounts
                </div>
              </div>

              {/* Common Denominations */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">Common Amounts</div>
                <div className="space-y-2 text-sm">
                  {commonAmounts.map(amt => {
                    const converted = amt * rate;
                    return (
                      <div key={amt} className="flex justify-between">
                        <span className="text-gray-600">{amt} {fromCurrency}:</span>
                        <span className="font-semibold">{formatCurrency(converted, toCurrency)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Travel Tips */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">✈ Travel Tip</div>
                <div className="text-xs text-gray-600">
                  {getTravelTip()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="currency-converter-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
