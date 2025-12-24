'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Script from 'next/script';
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
    question: "What is a Lottery Annuity Calculator?",
    answer: "A Lottery Annuity Calculator is a free online tool designed to help you quickly and accurately calculate lottery annuity-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Lottery Annuity Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Lottery Annuity Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Lottery Annuity Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function LotteryAnnuityCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('lottery-annuity-calculator');

  const [jackpotAmount, setJackpotAmount] = useState(100000000);
  const [federalTaxRate, setFederalTaxRate] = useState(37);
  const [stateTaxRate, setStateTaxRate] = useState(0);
  const [annuityIncrease, setAnnuityIncrease] = useState(5);
  const [annuityYears, setAnnuityYears] = useState(30);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [lumpSumPercent, setLumpSumPercent] = useState(60);
  const [chartLoaded, setChartLoaded] = useState(false);

  const paymentChartRef = useRef<HTMLCanvasElement>(null);
  const cumulativeChartRef = useRef<HTMLCanvasElement>(null);
  const paymentChartInstance = useRef<any>(null);
  const cumulativeChartInstance = useRef<any>(null);

  const [results, setResults] = useState({
    betterChoice: 'Calculating...',
    advantageAmount: 'Enter jackpot to compare',
    lumpSumAfterTax: 0,
    lumpSumInvested: 0,
    annuityTotal: 0,
    firstPayment: 0,
    scenario1Value: 0,
    scenario2Savings: 0,
    scenario3Cost: 0
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Chart) {
      setChartLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (chartLoaded) {
      calculateAnnuity();
    }
  }, [jackpotAmount, federalTaxRate, stateTaxRate, annuityIncrease, annuityYears, investmentReturn, lumpSumPercent, chartLoaded]);

  const calculateAnnuity = () => {
    try {
      // Get input values with validation
      const jackpot = Math.max(1000000, jackpotAmount);
      const federalTax = Math.max(0, Math.min(50, federalTaxRate));
      const stateTax = Math.max(0, Math.min(15, stateTaxRate));
      const annuityIncreaseRate = Math.max(0, Math.min(10, annuityIncrease));
      const years = Math.max(20, Math.min(30, annuityYears));
      const investReturn = Math.max(0, Math.min(15, investmentReturn));
      const lumpSumPct = Math.max(50, Math.min(70, lumpSumPercent));

      // Calculate lump sum
      const lumpSumAmount = jackpot * (lumpSumPct / 100);
      const totalTaxRate = federalTax + stateTax;
      const lumpSumAfterTax = lumpSumAmount * (1 - totalTaxRate / 100);

      // Calculate lump sum invested for 30 years
      const lumpSumInvested = lumpSumAfterTax * Math.pow(1 + investReturn / 100, 30);

      // Calculate annuity payments
      const firstPayment = (jackpot / years) * (1 - totalTaxRate / 100);
      let annuityTotal = 0;

      for (let year = 0; year < years; year++) {
        const payment = firstPayment * Math.pow(1 + annuityIncreaseRate / 100, year);
        annuityTotal += payment;
      }

      // Determine better choice
      const betterChoice = lumpSumInvested > annuityTotal ? 'Lump Sum (Invested)' : 'Annuity Payments';
      const advantage = Math.abs(lumpSumInvested - annuityTotal);

      // Calculate what-if scenarios
      const higherReturn = lumpSumAfterTax * Math.pow(1.10, 30);
      const currentReturn = lumpSumAfterTax * Math.pow(1 + investReturn / 100, 30);
      const scenario1Diff = higherReturn - currentReturn;

      const stateTaxSavings = lumpSumAmount * (stateTax / 100);

      const opportunityCost = lumpSumAfterTax * Math.pow(1.07, 30) - lumpSumAfterTax;

      setResults({
        betterChoice,
        advantageAmount: `Advantage: $${advantage.toLocaleString()}`,
        lumpSumAfterTax,
        lumpSumInvested,
        annuityTotal,
        firstPayment,
        scenario1Value: scenario1Diff,
        scenario2Savings: stateTaxSavings,
        scenario3Cost: opportunityCost
      });

      // Update charts
      if (chartLoaded) {
        updateCharts(lumpSumAfterTax, annuityTotal, firstPayment, annuityIncreaseRate, years, investReturn);
      }
    } catch (error) {
      console.error('Error in calculateAnnuity:', error);
    }
  };

  const updateCharts = (lumpSum: number, annuityTotal: number, firstPayment: number, annuityIncreaseRate: number, years: number, investReturn: number) => {
    setTimeout(() => {
      updatePaymentChart(lumpSum, annuityTotal, firstPayment);
      updateCumulativeChart(lumpSum, firstPayment, annuityIncreaseRate, years, investReturn);
    }, 100);
  };

  const updatePaymentChart = (lumpSum: number, annuityTotal: number, firstPayment: number) => {
    if (!paymentChartRef.current || !window.Chart) return;

    const ctx = paymentChartRef.current.getContext('2d');
    if (!ctx) return;

    try {
      if (paymentChartInstance.current) {
        paymentChartInstance.current.destroy();
        paymentChartInstance.current = null;
      }

      const finalPayment = firstPayment * Math.pow(1.05, 29); // 30th payment

      paymentChartInstance.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Lump Sum', 'First Annuity Payment', 'Final Annuity Payment', 'Annuity Total'],
          datasets: [{
            label: 'Amount ($)',
            data: [lumpSum, firstPayment, finalPayment, annuityTotal],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  return '$' + context.parsed.y.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return '$' + (value / 1000000).toFixed(0) + 'M';
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating payment chart:', error);
    }
  };

  const updateCumulativeChart = (lumpSum: number, firstPayment: number, annuityIncreaseRate: number, years: number, investReturn: number) => {
    if (!cumulativeChartRef.current || !window.Chart) return;

    const ctx = cumulativeChartRef.current.getContext('2d');
    if (!ctx) return;

    try {
      if (cumulativeChartInstance.current) {
        cumulativeChartInstance.current.destroy();
        cumulativeChartInstance.current = null;
      }

      // Generate 30-year comparison data
      const yearsArray = [];
      const lumpSumValues = [];
      const annuityValues = [];

      let annuityCumulative = 0;

      for (let year = 1; year <= 30; year++) {
        yearsArray.push(year);

        // Lump sum growth
        const lumpSumGrowth = lumpSum * Math.pow(1 + investReturn / 100, year);
        lumpSumValues.push(lumpSumGrowth);

        // Annuity cumulative
        const yearlyPayment = firstPayment * Math.pow(1 + annuityIncreaseRate / 100, year - 1);
        annuityCumulative += yearlyPayment;
        annuityValues.push(annuityCumulative);
      }

      cumulativeChartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: yearsArray,
          datasets: [
            {
              label: 'Lump Sum Invested',
              data: lumpSumValues,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Annuity Cumulative',
              data: annuityValues,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: false,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return '$' + (value / 1000000).toFixed(0) + 'M';
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating cumulative chart:', error);
    }
  };

  const handleTemplate = (jackpot: number, federal: number, state: number, investment: number) => {
    setJackpotAmount(jackpot);
    setFederalTaxRate(federal);
    setStateTaxRate(state);
    setInvestmentReturn(investment);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Should I choose lump sum or annuity for lottery winnings?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The choice depends on your financial discipline, investment knowledge, and current interest rates. Lump sum offers immediate access and investment potential, while annuity provides guaranteed income with inflation protection."
        }
      },
      {
        "@type": "Question",
        "name": "How are lottery annuity payments calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lottery annuities typically provide 30 annual payments, with each payment increasing by about 5% annually to account for inflation. The total of all payments equals the advertised jackpot amount."
        }
      },
      {
        "@type": "Question",
        "name": "What are the tax implications of lottery annuity vs lump sum?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Both options are subject to federal and state taxes. Lump sum results in immediate tax liability at current rates, while annuity spreads tax burden over 30 years, potentially offering tax advantages if rates change."
        }
      },
      {
        "@type": "Question",
        "name": "Can I change from annuity to lump sum after choosing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Generally, you cannot change your payout choice after claiming your prize. Some states may allow selling annuity payments to third parties, but this typically results in receiving less than the present value."
        }
      }
    ]
  };

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js" onLoad={() => setChartLoaded(true)} />
      <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Lottery Annuity Calculator')}</h1>
          <p className="text-base sm:text-lg text-gray-600">Compare lump sum vs annuity payments and analyze the best lottery payout strategy</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lottery Annuity Calculator</h2>

              {/* Lottery Scenarios */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Lottery Scenarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button type="button" onClick={() => handleTemplate(50000000, 37, 0, 7)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Small Jackpot ($50M)</button>
                  <button type="button" onClick={() => handleTemplate(200000000, 37, 5, 7)} className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Medium Jackpot ($200M)</button>
                  <button type="button" onClick={() => handleTemplate(500000000, 37, 8, 8)} className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Large Jackpot ($500M)</button>
                  <button type="button" onClick={() => handleTemplate(1000000000, 37, 10, 7)} className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Mega Jackpot ($1B)</button>
                  <button type="button" onClick={() => handleTemplate(300000000, 37, 13.3, 6)} className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">California Winner</button>
                  <button type="button" onClick={() => handleTemplate(100000000, 24, 0, 9)} className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Conservative Investment</button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Jackpot Amount */}
                <div>
                  <label htmlFor="jackpotAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Advertised Jackpot ($)
                  </label>
                  <input
                    type="number"
                    id="jackpotAmount"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={jackpotAmount}
                    onChange={(e) => setJackpotAmount(parseFloat(e.target.value) || 0)}
                    min="1000000"
                    step="1000000"
                    placeholder="100000000"
                  />
                </div>

                {/* Tax Rates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="federalTaxRate" className="block text-sm font-medium text-gray-700 mb-2">
                      Federal Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      id="federalTaxRate"
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={federalTaxRate}
                      onChange={(e) => setFederalTaxRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="50"
                      step="0.1"
                      placeholder="37"
                    />
                  </div>
                  <div>
                    <label htmlFor="stateTaxRate" className="block text-sm font-medium text-gray-700 mb-2">
                      State Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      id="stateTaxRate"
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={stateTaxRate}
                      onChange={(e) => setStateTaxRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="15"
                      step="0.1"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Annuity Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="annuityIncrease" className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Increase (%)
                    </label>
                    <input
                      type="number"
                      id="annuityIncrease"
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={annuityIncrease}
                      onChange={(e) => setAnnuityIncrease(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label htmlFor="annuityYears" className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Years
                    </label>
                    <input
                      type="number"
                      id="annuityYears"
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={annuityYears}
                      onChange={(e) => setAnnuityYears(parseInt(e.target.value) || 0)}
                      min="20"
                      max="30"
                      placeholder="30"
                    />
                  </div>
                </div>

                {/* Investment Options */}
                <div>
                  <label htmlFor="investmentReturn" className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Return Rate (%)
                  </label>
                  <input
                    type="number"
                    id="investmentReturn"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={investmentReturn}
                    onChange={(e) => setInvestmentReturn(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="15"
                    step="0.1"
                    placeholder="7"
                  />
                  <p className="text-xs text-gray-500 mt-1">Expected annual return if lump sum is invested</p>
                </div>

                {/* Lump Sum Percentage */}
                <div>
                  <label htmlFor="lumpSumPercent" className="block text-sm font-medium text-gray-700 mb-2">
                    Lump Sum Percentage (%)
                  </label>
                  <input
                    type="number"
                    id="lumpSumPercent"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={lumpSumPercent}
                    onChange={(e) => setLumpSumPercent(parseFloat(e.target.value) || 0)}
                    min="50"
                    max="70"
                    step="1"
                    placeholder="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical lump sum is 60% of advertised jackpot</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Payout Analysis</h3>

              {/* Main Results */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Better Choice</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2">{results.betterChoice}</div>
                  <div className="text-sm text-gray-500">{results.advantageAmount}</div>
                </div>
              </div>

              {/* Comparison Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-800 mb-3">Payout Comparison</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lump Sum After Tax:</span>
                    <span className="font-semibold">{formatCurrency(results.lumpSumAfterTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lump Sum Invested (30yr):</span>
                    <span className="font-semibold">{formatCurrency(results.lumpSumInvested)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annuity Total After Tax:</span>
                    <span className="font-semibold">{formatCurrency(results.annuityTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Year Payment:</span>
                    <span className="font-semibold">{formatCurrency(results.firstPayment)}</span>
                  </div>
                </div>
              </div>

              {/* Charts Container */}
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Payment Comparison</h4>
                  <div className="relative" style={{ height: '250px' }}>
                    <canvas ref={paymentChartRef}></canvas>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Cumulative Value</h4>
                  <div className="relative" style={{ height: '250px' }}>
                    <canvas ref={cumulativeChartRef}></canvas>
                  </div>
                </div>
</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 pt-8 border-t">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-3 sm:mb-4 md:mb-6">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-600 text-xl">⚠️</span>
                <div className="text-left">
                  <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
                  <p className="text-sm text-yellow-700">
                    This calculator is provided for <strong>educational and entertainment purposes only</strong>. We do not promote, encourage, or recommend gambling or lottery participation.
                    Lottery games involve substantial financial risk and the odds of winning are extremely low. Please gamble responsibly and only spend money you can afford to lose.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What-If Scenarios */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What-If Scenarios</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-blue-800">Higher Investment Return</div>
                    <div className="text-sm text-blue-600">10% vs current rate</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-800">{formatCurrency(results.scenario1Value)}</div>
                    <div className="text-xs text-blue-600">Difference</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-green-800">No State Tax</div>
                    <div className="text-sm text-green-600">Move to tax-free state</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-800">{formatCurrency(results.scenario2Savings)}</div>
                    <div className="text-xs text-green-600">Tax savings</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-purple-800">Immediate Spending</div>
                    <div className="text-sm text-purple-600">Spend vs invest decision</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-800">{formatCurrency(results.scenario3Cost)}</div>
                    <div className="text-xs text-purple-600">Opportunity cost</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reality Check */}
          <div className="mt-6 bg-red-50 p-3 sm:p-4 md:p-6 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-3">Reality Check</h4>
            <div className="space-y-2 text-sm text-red-700">
              <div className="flex items-start">
                <span className="mr-2">💡</span>
                <span>This calculator is for educational purposes only - we do not promote gambling</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">📊</span>
                <span>Consider your financial discipline and investment knowledge when choosing</span>
              </div>
              <div className="flex items-start">
                <span className="mr-2">⏰</span>
                <span>Annuity provides steady income; lump sum offers investment flexibility</span>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* MREC Advertisement Banners */}
{/* Related Calculators */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Financial Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link key={index} href={calc.href} className="block">
                <div className={`${calc.color} p-6 rounded-lg text-white hover:opacity-90 transition-opacity`}>
                  <h3 className="font-semibold mb-2">{calc.title}</h3>
                  <p className="text-sm opacity-90">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}></script>

          <div className="max-w-4xl mx-auto px-2 py-4 sm:py-6 md:py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Complete Guide to Lottery Annuity vs Lump Sum</h2>

            {/* Educational Disclaimer */}
            <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-gray-600 text-lg">📚</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Educational Purpose</h3>
                  <p className="text-sm text-gray-600">
                    The following information is provided for educational purposes to help users understand lottery payout options mathematically.
                    This content is not intended to encourage gambling or lottery participation.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding Lottery Payout Options</h3>

              <div className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">Two Main Options</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold text-green-800 mb-2">Lump Sum</h5>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Immediate payment of ~60% of jackpot</li>
                      <li>• Full control over investment decisions</li>
                      <li>• Subject to current tax rates</li>
                      <li>• Risk of poor financial decisions</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold text-blue-800 mb-2">Annuity</h5>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• 30 annual payments totaling full jackpot</li>
                      <li>• 5% annual increases for inflation</li>
                      <li>• Protection against overspending</li>
                      <li>• Tax advantages if rates change</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Decision Factors</h3>
              <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-700">Choose Lump Sum If:</h4>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>• You have strong financial discipline</li>
                    <li>• You can achieve &gt;7% investment returns</li>
                    <li>• You want maximum estate planning flexibility</li>
                    <li>• You need immediate access to capital</li>
                  </ul>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-700">Choose Annuity If:</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• You prefer predictable income</li>
                    <li>• You&apos;re concerned about overspending</li>
                    <li>• You want inflation protection</li>
                    <li>• You expect tax rates to decrease</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Considerations</h3>
              <div className="bg-yellow-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
                <h4 className="font-semibold text-yellow-800 mb-3">Federal and State Taxes</h4>
                <p className="text-yellow-700 text-sm mb-4">
                  Both lump sum and annuity payments are subject to federal and state income taxes. The key difference is timing:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded">
                    <div className="font-semibold text-yellow-800">Lump Sum</div>
                    <div className="text-xs text-yellow-700">All taxes due in year of receipt</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-semibold text-yellow-800">Annuity</div>
                    <div className="text-xs text-yellow-700">Taxes spread over 30 years</div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Mathematical Analysis</h3>
              <div className="bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Break-Even Investment Return</h4>
                <p className="text-gray-700 text-sm mb-3">
                  The lump sum becomes more valuable when you can consistently earn more than 6-8% annually on your investments.
                  This break-even rate depends on tax rates, annuity increase rates, and investment timing.
                </p>
                <div className="bg-white p-3 rounded border-l-4 border-gray-400">
                  <div className="text-sm font-medium text-gray-800">Typical Break-Even Rates</div>
                  <div className="text-xs text-gray-600">Conservative: 6-7% | Moderate: 7-8% | Aggressive: 8-9%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What percentage of the jackpot is the lump sum?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The lump sum (cash value) typically equals about 50-60% of the advertised jackpot amount. For example, a $1 billion advertised jackpot might have a cash value around $550 million. This is because the advertised amount represents the total of 30 annual payments, while the lump sum is the present value of those payments. The exact percentage varies based on interest rates used to calculate the annuity.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How do annual payments increase with the annuity option?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lottery annuities typically increase by 5% each year to help protect against inflation. If your first payment is $20 million, the second would be $21 million, the third $22.05 million, and so on. By year 30, payments can be nearly three times the initial amount. This graduated payment structure means you receive smaller payments early when you&apos;re younger and larger payments later when you may need more income.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What happens to remaining annuity payments if the winner dies?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lottery annuity payments are typically guaranteed and continue to be paid to your estate or designated beneficiaries if you die before receiving all payments. The payments become part of your estate and may be subject to estate taxes. Some states allow winners to assign or sell remaining payments to third parties. Consult with an estate attorney to understand how your state handles inherited lottery payments and potential tax implications.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">Can I change from annuity to lump sum after claiming?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Generally, no—the choice between lump sum and annuity must be made when you claim your prize and is irreversible. Most states give winners 60-180 days from the drawing to claim and make this decision. However, if you chose the annuity and later need cash, you may be able to sell some or all of your remaining payments to a third-party company at a discount, though this results in receiving less than the full value.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How are lottery winnings taxed differently for each option?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                With the lump sum, you pay federal (up to 37%) and state taxes on the entire amount in the year received—potentially $200+ million in taxes on a $500 million win. With annuity, you pay taxes only on each year&apos;s payment, which may keep you in a lower tax bracket if future rates decrease. The annuity also defers taxes on unpaid amounts, allowing that money to earn investment returns before taxation.
              </p>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-2">Which option do most lottery winners choose?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Approximately 80-90% of major lottery winners choose the lump sum. Winners prefer immediate access to funds, investment flexibility, and protection against lottery organization financial issues. However, studies show many lottery winners face financial difficulties within a few years, suggesting the forced discipline of annuity payments might benefit some winners. Financial advisors increasingly recommend careful consideration rather than automatically choosing lump sum.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="lottery-annuity-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}

declare global {
  interface Window {
    Chart: any;
  }
}
