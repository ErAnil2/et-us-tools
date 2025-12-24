'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
// Register Chart.js components
if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface PowerballCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

// Powerball constants
const JACKPOT_ODDS = 292201338;
const LUMP_SUM_RATIO = 0.6;

// Prize structure
const PRIZES = [
  { match: "5 + Powerball", odds: 292201338, amount: 0 },
  { match: "5", odds: 11688054, amount: 1000000 },
  { match: "4 + Powerball", odds: 913129, amount: 50000 },
  { match: "4", odds: 36525, amount: 100 },
  { match: "3 + Powerball", odds: 14494, amount: 100 },
  { match: "3", odds: 580, amount: 7 },
  { match: "2 + Powerball", odds: 701, amount: 7 },
  { match: "1 + Powerball", odds: 92, amount: 4 },
  { match: "Powerball only", odds: 38, amount: 4 }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Powerball Calculator?",
    answer: "A Powerball Calculator is a free online tool designed to help you quickly and accurately calculate powerball-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Powerball Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Powerball Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Powerball Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PowerballCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: PowerballCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('powerball-calculator');

  const [jackpot, setJackpot] = useState<number>(100000000);
  const [tickets, setTickets] = useState<number>(1);
  const [ticketCost, setTicketCost] = useState<number>(2);
  const [federalTax, setFederalTax] = useState<number>(37);
  const [stateTax, setStateTax] = useState<number>(0);
  const [payoutType, setPayoutType] = useState<string>('lump-sum');
  const [investmentReturn, setInvestmentReturn] = useState<number>(7);

  const [results, setResults] = useState({
    jackpotOdds: '1 in 292M',
    expectedValue: '$0.00',
    advertisedAmount: '$100,000,000',
    lumpSumAmount: '$60,000,000',
    afterTaxAmount: '$37,800,000',
    totalCost: '$2',
    scenario1Odds: '1 in 29.2M',
    scenario2Investment: '$10,700',
    scenario3Savings: '+$0',
    realityCheckFacts: [] as Array<{ icon: string; text: string }>
  });

  const prizeChartRef = useRef<HTMLCanvasElement>(null);
  const payoutChartRef = useRef<HTMLCanvasElement>(null);
  const prizeChartInstance = useRef<Chart | null>(null);
  const payoutChartInstance = useRef<Chart | null>(null);

  const calculateImprovedOdds = (baseOdds: number, numTickets: number): number => {
    if (numTickets === 1) return baseOdds;
    const probNoWin = Math.pow((baseOdds - 1) / baseOdds, numTickets);
    return Math.round(1 / (1 - probNoWin));
  };

  const calculateExpectedValue = (jackpotAmount: number): number => {
    let ev = 0;
    // Jackpot (after-tax lump sum estimate)
    ev += (jackpotAmount * LUMP_SUM_RATIO * 0.6) / JACKPOT_ODDS;
    // Other prizes (simplified)
    PRIZES.slice(1).forEach(prize => {
      ev += (prize.amount * 0.6) / prize.odds;
    });
    return ev;
  };

  const calculateFutureValue = (annualPayment: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = annualPayment / 12;
    const months = years * 12;

    if (monthlyRate === 0) return monthlyPayment * months;
    return monthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  };

  const updatePrizeChart = () => {
    if (!prizeChartRef.current) return;

    const ctx = prizeChartRef.current.getContext('2d');
    if (!ctx) return;

    try {
      if (prizeChartInstance.current) {
        prizeChartInstance.current.destroy();
        prizeChartInstance.current = null;
      }

      const probabilities = [0.0000034, 0.0000856, 0.0011, 0.0274, 0.069, 0.172, 0.143, 1.087, 2.632];
      const labels = ['Jackpot', 'Match 5', '4+PB', 'Match 4', '3+PB', 'Match 3', '2+PB', '1+PB', 'PB Only'];

      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Probability (%)',
            data: probabilities,
            backgroundColor: [
              '#EF4444', '#F97316', '#F59E0B', '#EAB308',
              '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4'
            ],
            borderColor: [
              '#DC2626', '#EA580C', '#D97706', '#CA8A04',
              '#65A30D', '#16A34A', '#059669', '#0D9488', '#0284C7'
            ],
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + (context.parsed?.y ?? 0).toFixed(4) + '%';
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 0,
                font: {
                  size: 10
                }
              },
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Probability (%)',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              ticks: {
                font: {
                  size: 10
                },
                callback: function(value: any) {
                  return (value as number).toFixed(2) + '%';
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          layout: {
            padding: {
              top: 10,
              right: 10,
              bottom: 10,
              left: 10
            }
          }
        }
      };

      prizeChartInstance.current = new Chart(ctx, config);
    } catch (error) {
      console.error('Error creating prize chart:', error);
    }
  };

  const updatePayoutChart = (jackpotAmount: number, lumpSum: number, afterTax: number) => {
    if (!payoutChartRef.current) return;

    const ctx = payoutChartRef.current.getContext('2d');
    if (!ctx) return;

    try {
      if (payoutChartInstance.current) {
        payoutChartInstance.current.destroy();
        payoutChartInstance.current = null;
      }

      const safeJackpot = parseFloat(String(jackpotAmount)) || 0;
      const safeLumpSum = parseFloat(String(lumpSum)) || 0;
      const safeAfterTax = parseFloat(String(afterTax)) || 0;

      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: ['Advertised Jackpot', 'Lump Sum (Pre-tax)', 'After All Taxes'],
          datasets: [{
            label: 'Amount ($)',
            data: [safeJackpot, safeLumpSum, safeAfterTax],
            backgroundColor: ['#FDE047', '#60A5FA', '#34D399'],
            borderColor: ['#F59E0B', '#3B82F6', '#10B981'],
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  const value = (context.parsed?.y ?? 0);
                  if (value >= 1000000) {
                    return context.label + ': $' + (value / 1000000).toFixed(1) + 'M';
                  } else if (value >= 1000) {
                    return context.label + ': $' + (value / 1000).toFixed(0) + 'K';
                  } else {
                    return context.label + ': $' + value.toLocaleString();
                  }
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                maxRotation: 0,
                font: {
                  size: 11
                }
              },
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount (Millions $)',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              ticks: {
                font: {
                  size: 10
                },
                callback: function(value: any) {
                  const numValue = value as number;
                  if (numValue >= 1000000) {
                    return '$' + (numValue / 1000000).toFixed(0) + 'M';
                  } else if (numValue >= 1000) {
                    return '$' + (numValue / 1000).toFixed(0) + 'K';
                  } else {
                    return '$' + numValue.toFixed(0);
                  }
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          layout: {
            padding: {
              top: 10,
              right: 10,
              bottom: 10,
              left: 10
            }
          }
        }
      };

      payoutChartInstance.current = new Chart(ctx, config);
    } catch (error) {
      console.error('Error creating payout chart:', error);
    }
  };

  const calculatePowerball = () => {
    try {
      // Calculate odds with multiple tickets
      const yourOdds = calculateImprovedOdds(JACKPOT_ODDS, tickets);

      // Calculate payouts
      const lumpSum = jackpot * LUMP_SUM_RATIO;
      const totalTaxRate = federalTax + stateTax;
      const afterTax = lumpSum * (1 - totalTaxRate / 100);

      // Calculate expected value
      const expectedValue = calculateExpectedValue(jackpot);

      // Format odds display
      const oddsDisplay = yourOdds >= 1000000
        ? `1 in ${(yourOdds / 1000000).toFixed(1)}M`
        : `1 in ${yourOdds.toLocaleString()}`;

      // Calculate what-if scenarios
      const multipleOdds = calculateImprovedOdds(JACKPOT_ODDS, 10);
      const multipleDisplay = multipleOdds >= 1000000
        ? `1 in ${(multipleOdds / 1000000).toFixed(1)}M`
        : `1 in ${multipleOdds.toLocaleString()}`;

      const weeklyInvestment = ticketCost * 2;
      const annualInvestment = weeklyInvestment * 52;
      const futureValue = calculateFutureValue(annualInvestment, investmentReturn, 30);

      const stateTaxSavings = lumpSum * (stateTax / 100);

      // Reality check facts
      const facts = [];
      if (yourOdds > 200000000) {
        facts.push({
          icon: '⚡',
          text: `You're ${Math.round(yourOdds / 1200000)} times more likely to be struck by lightning`
        });
      }

      const returnRate = (expectedValue / ticketCost) * 100;
      if (returnRate < 60) {
        facts.push({
          icon: '📉',
          text: `Expected return is only ${returnRate.toFixed(1)}% - you lose ${(100 - returnRate).toFixed(1)}¢ per dollar`
        });
      }

      facts.push({
        icon: '🎯',
        text: 'This calculator is for educational purposes only - we do not promote gambling'
      });

      setResults({
        jackpotOdds: oddsDisplay,
        expectedValue: `Expected Value: $${expectedValue.toFixed(2)}`,
        advertisedAmount: `$${jackpot.toLocaleString()}`,
        lumpSumAmount: `$${lumpSum.toLocaleString()}`,
        afterTaxAmount: `$${afterTax.toLocaleString()}`,
        totalCost: `$${(tickets * ticketCost).toLocaleString()}`,
        scenario1Odds: multipleDisplay,
        scenario2Investment: `$${Math.round(futureValue).toLocaleString()}`,
        scenario3Savings: `+$${Math.round(stateTaxSavings).toLocaleString()}`,
        realityCheckFacts: facts
      });

      // Update charts with delay
      setTimeout(() => {
        updatePrizeChart();
        updatePayoutChart(jackpot, lumpSum, afterTax);
      }, 100);

    } catch (error) {
      console.error('Error in calculatePowerball:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculatePowerball();
    }, 300);

    return () => clearTimeout(timer);
  }, [jackpot, tickets, ticketCost, federalTax, stateTax, payoutType, investmentReturn]);

  useEffect(() => {
    // Initial calculation
    calculatePowerball();

    // Cleanup on unmount
    return () => {
      if (prizeChartInstance.current) {
        prizeChartInstance.current.destroy();
      }
      if (payoutChartInstance.current) {
        payoutChartInstance.current.destroy();
      }
    };
  }, []);

  const handleTemplateClick = (templateJackpot: number, templateTickets: number, templateFederal: number, templateState: number) => {
    setJackpot(templateJackpot);
    setTickets(templateTickets);
    setFederalTax(templateFederal);
    setStateTax(templateState);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Powerball Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate Powerball odds, potential winnings, and tax impact with comprehensive analysis</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Powerball Calculator</h2>

            {/* Jackpot Scenarios */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Jackpot Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button type="button" className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick(50000000, 1, 37, 0)}>Small Jackpot ($50M)</button>
                <button type="button" className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick(200000000, 1, 37, 5)}>Medium Jackpot ($200M)</button>
                <button type="button" className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick(500000000, 1, 37, 8)}>Large Jackpot ($500M)</button>
                <button type="button" className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick(1000000000, 1, 37, 10)}>Mega Jackpot ($1B)</button>
                <button type="button" className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick(100000000, 10, 37, 5)}>Multiple Tickets (10)</button>
                <button type="button" className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick(300000000, 1, 37, 13.3)}>California Player</button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Jackpot Amount */}
              <div>
                <label htmlFor="jackpot" className="block text-sm font-medium text-gray-700 mb-2">
                  Jackpot Amount ($)
                </label>
                <input
                  type="number"
                  id="jackpot"
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={jackpot}
                  onChange={(e) => setJackpot(Math.max(1000000, parseFloat(e.target.value) || 0))}
                  min="1000000"
                  step="1000000"
                  placeholder="100000000"
                />
              </div>

              {/* Number of Tickets */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Tickets
                  </label>
                  <input
                    type="number"
                    id="tickets"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={tickets}
                    onChange={(e) => setTickets(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
                    min="1"
                    max="1000"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label htmlFor="ticketCost" className="block text-sm font-medium text-gray-700 mb-2">
                    Cost per Ticket ($)
                  </label>
                  <input
                    type="number"
                    id="ticketCost"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={ticketCost}
                    onChange={(e) => setTicketCost(Math.max(1, parseFloat(e.target.value) || 2))}
                    min="1"
                    placeholder="2"
                  />
                </div>
              </div>

              {/* Tax Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="federalTax" className="block text-sm font-medium text-gray-700 mb-2">
                    Federal Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="federalTax"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={federalTax}
                    onChange={(e) => setFederalTax(Math.max(0, Math.min(50, parseFloat(e.target.value) || 37)))}
                    min="0"
                    max="50"
                    step="0.1"
                    placeholder="37"
                  />
                </div>
                <div>
                  <label htmlFor="stateTax" className="block text-sm font-medium text-gray-700 mb-2">
                    State Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="stateTax"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={stateTax}
                    onChange={(e) => setStateTax(Math.max(0, Math.min(15, parseFloat(e.target.value) || 0)))}
                    min="0"
                    max="15"
                    step="0.1"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Payout Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payout Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payoutType"
                      value="lump-sum"
                      className="mr-2"
                      checked={payoutType === 'lump-sum'}
                      onChange={(e) => setPayoutType(e.target.value)}
                    />
                    <span className="text-sm">Lump Sum (immediate payment)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payoutType"
                      value="annuity"
                      className="mr-2"
                      checked={payoutType === 'annuity'}
                      onChange={(e) => setPayoutType(e.target.value)}
                    />
                    <span className="text-sm">30-Year Annuity (annual payments)</span>
                  </label>
                </div>
              </div>

              {/* Investment Return Rate */}
              <div>
                <label htmlFor="investmentReturn" className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Return Rate (%)
                </label>
                <input
                  type="number"
                  id="investmentReturn"
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={investmentReturn}
                  onChange={(e) => setInvestmentReturn(Math.max(0, Math.min(20, parseFloat(e.target.value) || 7)))}
                  min="0"
                  max="20"
                  step="0.1"
                  placeholder="7"
                />
                <p className="text-xs text-gray-500 mt-1">For comparing lump sum investment vs annuity</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Powerball Analysis</h3>

            {/* Main Results */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Your Jackpot Odds</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-2">{results.jackpotOdds}</div>
                <div className="text-sm text-gray-500">{results.expectedValue}</div>
              </div>
            </div>

            {/* Winnings Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">Potential Winnings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Advertised Jackpot:</span>
                  <span className="font-semibold">{results.advertisedAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lump Sum (Pre-tax):</span>
                  <span className="font-semibold">{results.lumpSumAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">After All Taxes:</span>
                  <span className="font-semibold text-green-600">{results.afterTaxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-semibold">{results.totalCost}</span>
                </div>
              </div>
            </div>

            {/* Charts Container */}
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Prize Probability</h4>
                <div className="relative" style={{ height: '250px' }}>
                  <canvas ref={prizeChartRef}></canvas>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Payout Comparison</h4>
                <div className="relative" style={{ height: '250px' }}>
                  <canvas ref={payoutChartRef}></canvas>
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
                  <div className="font-medium text-blue-800">Buy 10 Tickets</div>
                  <div className="text-sm text-blue-600">Improved odds</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-800">{results.scenario1Odds}</div>
                  <div className="text-xs text-blue-600">New odds</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-green-800">Invest Instead</div>
                  <div className="text-sm text-green-600">Weekly $4 for 30 years</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-800">{results.scenario2Investment}</div>
                  <div className="text-xs text-green-600">Potential return</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-purple-800">No State Tax</div>
                  <div className="text-sm text-purple-600">Move to tax-free state</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-800">{results.scenario3Savings}</div>
                  <div className="text-xs text-purple-600">Tax savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reality Check */}
        <div className="mt-6 bg-red-50 p-3 sm:p-4 md:p-6 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-3">Reality Check</h4>
          <div className="space-y-2 text-sm text-red-700">
            {results.realityCheckFacts.map((fact, index) => (
              <div key={index} className="flex items-start">
                <span className="mr-2">{fact.icon}</span>
                <span>{fact.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Related Financial Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className={`${calc.color || 'bg-gray-500'} text-white rounded-lg p-6 hover:opacity-90 transition-opacity`}>
              <h3 className="text-lg font-semibold mb-2">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="max-w-4xl mx-auto px-2 py-4 sm:py-6 md:py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Complete Guide to Powerball</h2>

        {/* Educational Disclaimer */}
        <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <span className="text-gray-600 text-lg">📚</span>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Educational Purpose</h3>
              <p className="text-sm text-gray-600">
                The following information is provided for educational purposes to help users understand how lotteries work mathematically.
                This content is not intended to encourage gambling or lottery participation. We strongly recommend viewing lottery tickets as entertainment expenses, not investments.
              </p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding Powerball Odds and Payouts</h3>

          <div className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
            <h4 className="font-semibold text-blue-800 mb-3">How Powerball Works</h4>
            <p className="text-blue-700 mb-4">
              Powerball is a multi-state lottery game where players choose 5 numbers from 1-69 (white balls) and 1 number from 1-26 (red Powerball). Drawings occur twice weekly on Wednesday and Saturday nights.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded">
                <h5 className="font-semibold text-blue-800 mb-2">White Balls</h5>
                <div className="text-2xl font-bold text-blue-600">5 from 69</div>
                <div className="text-sm text-blue-700">Choose 5 different numbers</div>
              </div>
              <div className="bg-white p-4 rounded">
                <h5 className="font-semibold text-red-800 mb-2">Powerball</h5>
                <div className="text-2xl font-bold text-red-600">1 from 26</div>
                <div className="text-sm text-red-700">Red Powerball number</div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Prize Structure and Odds</h3>
          <div className="overflow-x-auto mb-3 sm:mb-4 md:mb-6">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-gray-800 font-semibold">Match</th>
                  <th className="px-2 py-3 text-left text-gray-800 font-semibold">Prize</th>
                  <th className="px-2 py-3 text-left text-gray-800 font-semibold">Odds</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-yellow-50">
                  <td className="px-2 py-3">5 + Powerball</td>
                  <td className="px-2 py-3 font-bold">Jackpot</td>
                  <td className="px-2 py-3">1 in 292,201,338</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3">5</td>
                  <td className="px-2 py-3">$1,000,000</td>
                  <td className="px-2 py-3">1 in 11,688,054</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3">4 + Powerball</td>
                  <td className="px-2 py-3">$50,000</td>
                  <td className="px-2 py-3">1 in 913,129</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3">4</td>
                  <td className="px-2 py-3">$100</td>
                  <td className="px-2 py-3">1 in 36,525</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3">3 + Powerball</td>
                  <td className="px-2 py-3">$100</td>
                  <td className="px-2 py-3">1 in 14,494</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3">3</td>
                  <td className="px-2 py-3">$7</td>
                  <td className="px-2 py-3">1 in 580</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3">2 + Powerball</td>
                  <td className="px-2 py-3">$7</td>
                  <td className="px-2 py-3">1 in 701</td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-3">1 + Powerball</td>
                  <td className="px-2 py-3">$4</td>
                  <td className="px-2 py-3">1 in 92</td>
                </tr>
                <tr>
                  <td className="px-2 py-3">Powerball only</td>
                  <td className="px-2 py-3">$4</td>
                  <td className="px-2 py-3">1 in 38</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Lump Sum vs Annuity Analysis</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Lump Sum Benefits</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Immediate access to full amount</li>
                <li>• Investment potential for higher returns</li>
                <li>• No inflation risk on future payments</li>
                <li>• Estate planning advantages</li>
                <li>• Flexibility in spending and investing</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Annuity Benefits</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Guaranteed income for 30 years</li>
                <li>• Built-in inflation protection (5% increases)</li>
                <li>• Protection against poor spending decisions</li>
                <li>• Higher total value than lump sum</li>
                <li>• Tax benefits spread over time</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Implications</h3>
          <div className="bg-yellow-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
            <h4 className="font-semibold text-yellow-800 mb-3">Federal Taxes</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-3 rounded">
                <div className="font-semibold text-yellow-800">Initial Withholding</div>
                <div className="text-2xl font-bold text-yellow-600">24%</div>
                <div className="text-xs text-yellow-700">Withheld immediately</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="font-semibold text-red-800">Top Tax Rate</div>
                <div className="text-2xl font-bold text-red-600">37%</div>
                <div className="text-xs text-red-700">Additional 13% due</div>
              </div>
            </div>
            <p className="text-yellow-700 text-sm">
              <strong>State Taxes:</strong> Vary from 0% (FL, TX, WA) to 13.3% (CA). Some states don&apos;t tax lottery winnings.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Mathematical Reality</h3>
          <div className="bg-red-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
            <h4 className="font-semibold text-red-800 mb-3">Expected Value Analysis</h4>
            <p className="text-red-700 text-sm mb-3">
              The expected value of a Powerball ticket is typically $0.50-$1.20 per $2 ticket, meaning you can expect to lose money over time. The lottery is designed to generate revenue for states.
            </p>
            <div className="bg-white p-3 rounded border-l-4 border-red-400">
              <div className="text-sm font-medium text-red-800">Example: $100 Million Jackpot</div>
              <div className="text-xs text-red-600">Expected value ≈ $0.85 per $2 ticket = 57.5% loss</div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Responsible Gaming</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-semibold text-green-700">Smart Approach</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Set a strict entertainment budget</li>
                <li>• Never spend money needed for essentials</li>
                <li>• View lottery as entertainment, not investment</li>
                <li>• Don&apos;t chase losses with more tickets</li>
              </ul>
            </div>
            <div className="border-l-4 border-red-400 pl-4">
              <h4 className="font-semibold text-red-700">Warning Signs</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Spending bill money on tickets</li>
                <li>• Using credit cards for lottery</li>
                <li>• Feeling compelled to play</li>
                <li>• Increasing spending to recover losses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="powerball-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
