'use client';

import { useState, useEffect, useRef } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import Script from 'next/script';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Crypto Tax Calculator?",
    answer: "A Crypto Tax Calculator is a free online tool that helps you calculate and analyze crypto tax-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Crypto Tax Calculator?",
    answer: "Our Crypto Tax Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Crypto Tax Calculator free to use?",
    answer: "Yes, this Crypto Tax Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Crypto Tax calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to crypto tax such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function CryptoTaxCalculatorClient() {
  const taxChartRef = useRef<HTMLCanvasElement>(null);
  const profitChartRef = useRef<HTMLCanvasElement>(null);
  const [taxChartInstance, setTaxChartInstance] = useState<any>(null);
  const [profitChartInstance, setProfitChartInstance] = useState<any>(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  const [transactionType, setTransactionType] = useState('trade');
  const [buyPrice, setBuyPrice] = useState(10000);
  const [sellPrice, setSellPrice] = useState(15000);
  const [quantity, setQuantity] = useState(1);
  const [holdingPeriod, setHoldingPeriod] = useState(400);
  const [taxBracket, setTaxBracket] = useState(22);
  const [stateTaxRate, setStateTaxRate] = useState(0);

  const [results, setResults] = useState<any>(null);

  const templates = [
    { name: 'Bitcoin Long-term Gain', buy: 10000, sell: 15000, quantity: 1, holding: 400, bracket: 22, color: 'blue' },
    { name: 'Ethereum Short-term', buy: 2000, sell: 3500, quantity: 10, holding: 100, bracket: 22, color: 'green' },
    { name: 'Altcoin Investment', buy: 50, sell: 200, quantity: 100, holding: 600, bracket: 12, color: 'purple' },
    { name: 'Mining Rewards', buy: 0, sell: 500, quantity: 2, holding: 0, bracket: 22, color: 'orange' },
    { name: 'Bitcoin Loss', buy: 30000, sell: 20000, quantity: 0.5, holding: 200, bracket: 24, color: 'red' },
    { name: 'Staking Rewards', buy: 0, sell: 1000, quantity: 5, holding: 0, bracket: 37, color: 'teal' }
  ];

  const applyTemplate = (template: any) => {
    setBuyPrice(template.buy);
    setSellPrice(template.sell);
    setQuantity(template.quantity);
    setHoldingPeriod(template.holding);
    setTaxBracket(template.bracket);
  };

  const calculateCryptoTax = () => {
    const capitalGain = (sellPrice - buyPrice) * quantity;
    const purchaseValue = buyPrice * quantity;
    const saleValue = sellPrice * quantity;

    const isLongTerm = holdingPeriod > 365;

    let federalTaxRate;
    if (capitalGain <= 0) {
      federalTaxRate = 0;
    } else if (isLongTerm) {
      if (taxBracket <= 12) federalTaxRate = 0;
      else if (taxBracket <= 22) federalTaxRate = 15;
      else federalTaxRate = 20;
    } else {
      federalTaxRate = taxBracket;
    }

    const federalTax = capitalGain > 0 ? capitalGain * (federalTaxRate / 100) : 0;
    const stateTax = capitalGain > 0 ? capitalGain * (stateTaxRate / 100) : 0;
    const totalTax = federalTax + stateTax;
    const netProfit = capitalGain - totalTax;

    // Calculate scenarios
    const shortTermTax = capitalGain > 0 ? capitalGain * (taxBracket / 100) : 0;
    const longTermTax = capitalGain > 0 ? capitalGain * (federalTaxRate / 100) : 0;
    const savings = shortTermTax - longTermTax;

    const stateTaxWith5 = capitalGain > 0 ? capitalGain * 0.05 : 0;
    const totalWithState = longTermTax + stateTaxWith5;

    const lossOffset = 2000;
    const taxableGain = Math.max(0, capitalGain - lossOffset);

    setResults({
      capitalGain,
      purchaseValue,
      saleValue,
      federalTaxRate,
      stateTaxRate,
      federalTax,
      stateTax,
      totalTax,
      netProfit,
      isLongTerm,
      holdingPeriod,
      transactionType,
      quantity,
      shortTermTax,
      longTermTax,
      savings,
      stateTaxWith5,
      totalWithState,
      lossOffset,
      taxableGain
    });
  };

  const updateCharts = () => {
    if (!chartLoaded || !results) return;

    const Chart = (window as any).Chart;
    if (!Chart) return;

    setTimeout(() => {
      // Tax Breakdown Chart
      if (taxChartRef.current) {
        const ctx = taxChartRef.current.getContext('2d');
        if (ctx) {
          if (taxChartInstance) {
            taxChartInstance.destroy();
          }

          const newChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Net Profit', 'Federal Tax', 'State Tax'],
              datasets: [{
                data: [Math.max(0, results.netProfit), results.federalTax, results.stateTax],
                backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
                borderWidth: 2,
                borderColor: '#fff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' }
              }
            }
          });

          setTaxChartInstance(newChart);
        }
      }

      // Profit vs Tax Chart
      if (profitChartRef.current) {
        const ctx = profitChartRef.current.getContext('2d');
        if (ctx) {
          if (profitChartInstance) {
            profitChartInstance.destroy();
          }

          const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Gross Gain', 'After Tax'],
              datasets: [{
                data: [Math.max(0, results.capitalGain), Math.max(0, results.netProfit)],
                backgroundColor: ['#3B82F6', '#10B981'],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value: any) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              },
              plugins: {
                legend: { display: false }
              }
            }
          });

          setProfitChartInstance(newChart);
        }
      }
    }, 100);
  };

  useEffect(() => {
    calculateCryptoTax();
  }, [buyPrice, sellPrice, quantity, holdingPeriod, taxBracket, stateTaxRate, transactionType]);

  useEffect(() => {
    if (chartLoaded && results) {
      updateCharts();
    }

    return () => {
      if (taxChartInstance) taxChartInstance.destroy();
      if (profitChartInstance) profitChartInstance.destroy();
    };
  }, [results, chartLoaded]);

  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="lazyOnload"
        onLoad={() => setChartLoaded(true)}
      />

      <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Crypto Tax Calculator</h1>
          <p className="text-base sm:text-lg text-gray-600">Calculate cryptocurrency taxes, capital gains, and tax liabilities for accurate tax reporting and compliance</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crypto Tax Calculator</h2>

              {/* Crypto Tax Scenarios */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Common Tax Scenarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {templates.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className={`bg-${template.color}-100 hover:bg-${template.color}-200 text-${template.color}-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="trade">Trade/Sale</option>
                    <option value="mining">Mining Income</option>
                    <option value="staking">Staking Rewards</option>
                    <option value="airdrops">Airdrops/Forks</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value))}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cost basis per unit</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price ($)</label>
                    <input
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Number(e.target.value))}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sale price per unit</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      step="0.00000001"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Amount sold/traded</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Holding Period (days)</label>
                    <input
                      type="number"
                      value={holdingPeriod}
                      onChange={(e) => setHoldingPeriod(Number(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days held (&gt;365 = long-term)</p>
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-700">Tax Information</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Bracket (%)</label>
                  <select
                    value={taxBracket}
                    onChange={(e) => setTaxBracket(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="10">10% - $0 to $11,000</option>
                    <option value="12">12% - $11,001 to $44,725</option>
                    <option value="22">22% - $44,726 to $95,375</option>
                    <option value="24">24% - $95,376 to $182,050</option>
                    <option value="32">32% - $182,051 to $231,250</option>
                    <option value="35">35% - $231,251 to $578,125</option>
                    <option value="37">37% - Over $578,125</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">2024 tax brackets for single filers</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State Tax Rate (%)</label>
                  <input
                    type="number"
                    value={stateTaxRate}
                    onChange={(e) => setStateTaxRate(Number(e.target.value))}
                    min="0"
                    max="15"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional state capital gains tax</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Analysis</h3>

                {/* Main Results Display */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 md:p-6 rounded-xl mb-3 sm:mb-4 md:mb-6">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">{formatCurrency(results.totalTax)}</div>
                    <div className="text-sm text-blue-600 mb-4">{results.totalTax > 0 ? 'Total Tax Liability' : 'No Tax Owed'}</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Capital Gain/Loss:</span>
                      <span className={`font-semibold ${results.capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {results.capitalGain >= 0 ? '+' : ''}{formatCurrency(results.capitalGain)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Holding Period:</span>
                      <span className="font-semibold">{results.isLongTerm ? 'Long-term' : 'Short-term'} ({results.holdingPeriod} days)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Federal Tax Rate:</span>
                      <span className="font-semibold">{results.federalTaxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Federal Tax:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(results.federalTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State Tax:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(results.stateTax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Net Profit After Tax:</span>
                      <span className={results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(results.netProfit)}</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="bg-gray-50 p-4 rounded-xl mb-3 sm:mb-4 md:mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Transaction Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Purchase Value:</span>
                      <span className="font-semibold">{formatCurrency(results.purchaseValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sale Value:</span>
                      <span className="font-semibold">{formatCurrency(results.saleValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction Type:</span>
                      <span className="font-semibold">{results.transactionType.charAt(0).toUpperCase() + results.transactionType.slice(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-semibold">{results.quantity.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Tax Tips */}
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">Tax Optimization Tips</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <div className={results.isLongTerm ? 'text-green-700' : ''}>
                      {results.isLongTerm ? "✓ Great! You're getting long-term capital gains rates" : "• Hold crypto >1 year for lower capital gains rates"}
                    </div>
                    <div className={results.capitalGain < 0 ? 'text-green-700' : ''}>
                      {results.capitalGain < 0 ? "✓ This loss can offset other capital gains" : "• Consider tax-loss harvesting with losses"}
                    </div>
                    <div>• Keep detailed records of all transactions</div>
                    <div>• Mining/staking income is taxed at receipt</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        {results && (
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Breakdown</h3>
              <div className="relative h-64">
                <canvas ref={taxChartRef}></canvas>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Profit vs Tax Analysis</h3>
              <div className="relative h-64">
                <canvas ref={profitChartRef}></canvas>
              </div>
            </div>
          </div>
        )}

        {/* What If Scenarios */}
        {results && results.capitalGain > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">What If Scenarios</h2>
            <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Short-term vs Long-term</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Short-term tax:</span>
                    <span className="font-semibold">{formatCurrency(results.shortTermTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Long-term tax:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(results.longTermTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax savings:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(results.savings)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">With State Tax (5%)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Federal tax:</span>
                    <span className="font-semibold">{formatCurrency(results.longTermTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State tax:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(results.stateTaxWith5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total tax:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(results.totalWithState)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Tax-Loss Harvesting</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current gain:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(results.capitalGain)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offset with loss:</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(results.lossOffset)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable gain:</span>
                    <span className="font-semibold">{formatCurrency(results.taxableGain)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Cryptocurrency Taxes</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4 leading-relaxed">
              The IRS treats cryptocurrency as property, not currency. This means every trade, sale, or use of crypto is potentially a taxable event. Understanding these rules is essential for accurate reporting and avoiding penalties. Even swapping one crypto for another triggers capital gains taxes.
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Long-term Gains (held &gt;1 year)</h3>
                <p className="text-sm text-green-800 mb-2">Tax rates: 0%, 15%, or 20%</p>
                <p className="text-xs text-green-700">Based on your income bracket. Most taxpayers pay 15%. High earners (over $500k single) pay 20%.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-900 mb-2">Short-term Gains (held &lt;1 year)</h3>
                <p className="text-sm text-red-800 mb-2">Tax rates: 10% to 37%</p>
                <p className="text-xs text-red-700">Taxed as ordinary income at your marginal tax rate—the same as your salary or wages.</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Taxable Crypto Events</h3>
            <div className="grid sm:grid-cols-2 gap-3 my-4 not-prose">
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <div>
                  <strong className="text-sm text-gray-800">Selling crypto for USD</strong>
                  <p className="text-xs text-gray-600">Capital gain/loss based on cost basis</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <div>
                  <strong className="text-sm text-gray-800">Trading crypto-to-crypto</strong>
                  <p className="text-xs text-gray-600">Each swap is a taxable disposal</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <div>
                  <strong className="text-sm text-gray-800">Spending crypto on goods</strong>
                  <p className="text-xs text-gray-600">Triggers capital gains at time of purchase</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <div>
                  <strong className="text-sm text-gray-800">Receiving mining/staking income</strong>
                  <p className="text-xs text-gray-600">Taxed as ordinary income when received</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tax-Loss Harvesting Strategy</h3>
            <p className="text-gray-600 mb-4">
              Crypto losses can offset gains and reduce your tax bill. If you have $10,000 in gains and $3,000 in losses, you only pay taxes on $7,000. You can also deduct up to $3,000 in net losses against ordinary income each year, carrying forward excess losses to future years. This strategy involves selling underperforming assets to realize losses strategically.
            </p>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">Do I owe taxes if I just hold crypto and don&apos;t sell?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No, simply holding (HODLing) cryptocurrency is not a taxable event. You only owe taxes when you dispose of crypto through selling, trading, or spending. However, receiving new crypto through mining, staking, airdrops, or as payment for goods/services is taxable income at the time you receive it.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How do I calculate my cost basis for crypto?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your cost basis is what you paid for the crypto, including any fees. If you bought 1 BTC for $30,000 plus a $50 fee, your cost basis is $30,050. For multiple purchases, you can use FIFO (First In, First Out), LIFO (Last In, First Out), or Specific Identification methods. FIFO is the IRS default and often results in higher taxes during bull markets.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">Is transferring crypto between my own wallets taxable?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No, moving crypto between wallets you own is not a taxable event—it&apos;s like moving money between bank accounts. However, you should keep records of these transfers to prove ownership and maintain accurate cost basis tracking. Be careful to distinguish transfers from trades on exchanges.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What if I lost money on crypto—can I deduct it?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes, crypto losses are deductible. Capital losses first offset capital gains. If your losses exceed gains, you can deduct up to $3,000 ($1,500 if married filing separately) against ordinary income per year. Remaining losses carry forward indefinitely to future tax years. You must sell or dispose of the crypto to realize the loss.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How is staking and mining income taxed?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mining and staking rewards are taxed as ordinary income at their fair market value when received. If you mine 0.1 BTC when it&apos;s worth $4,000, you report $4,000 as income. When you later sell, you&apos;ll also owe capital gains tax on any appreciation. This means crypto earned through mining/staking can be taxed twice—once as income, once as capital gains.
              </p>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-2">Does the IRS know about my crypto transactions?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Increasingly, yes. Major exchanges like Coinbase, Kraken, and Gemini report to the IRS. Starting 2024, exchanges must issue 1099 forms. The IRS also uses blockchain analytics to track transactions. The 1040 tax form now asks directly about crypto. Non-compliance can result in penalties, interest, and potential criminal prosecution for tax evasion.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Tax Disclaimer</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This calculator provides estimates for educational purposes only. Cryptocurrency tax laws are complex and vary by jurisdiction. This tool does not constitute tax advice. Please consult with a qualified tax professional for official tax guidance and compliance requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="crypto-tax-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}
