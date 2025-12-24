'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Mega Millions Payout Calculator?",
    answer: "A Mega Millions Payout Calculator is a free online tool designed to help you quickly and accurately calculate mega millions payout-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Mega Millions Payout Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Mega Millions Payout Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Mega Millions Payout Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MegaMillionsPayoutCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('mega-millions-payout-calculator');

  const [jackpotAmount, setJackpotAmount] = useState(200000000);
  const [lumpSumPercent, setLumpSumPercent] = useState(62);
  const [megaplier, setMegaplier] = useState(1);
  const [payoutOption, setPayoutOption] = useState('lump-sum');
  const [federalTaxRate, setFederalTaxRate] = useState(37);
  const [stateTaxRate, setStateTaxRate] = useState(0);
  const [stateSelection, setStateSelection] = useState('0');

  const prizeChartRef = useRef<HTMLCanvasElement>(null);
  const taxChartRef = useRef<HTMLCanvasElement>(null);
  const prizeChartInstance = useRef<any>(null);
  const taxChartInstance = useRef<any>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const [results, setResults] = useState({
    finalAmount: 78120000,
    advertisedAmount: 200000000,
    lumpSumAmount: 124000000,
    federalTax: 45880000,
    stateTax: 0,
    takeHome: 78120000,
    match5Prize: 1000000,
    match4MegaPrize: 10000,
    match4Prize: 500,
    match3MegaPrize: 200,
    match3Prize: 10,
    expectedReturn: 0.66,
    expectedLoss: 1.34,
    scenario1Amount: 61628000,
    scenario1Diff: 16492000,
    scenario2Amount: 126000000,
    scenario2Diff: 47880000,
    scenario3Amount: 5000000,
    megaplierNote: 'Non-jackpot prizes shown without Megaplier multiplier',
    megaplierClass: 'mt-3 p-2 bg-orange-100 rounded text-xs text-orange-700'
  });

  useEffect(() => {
    // Load Chart.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    script.onload = () => {
      calculateMegaMillions();
    };
    document.head.appendChild(script);

    return () => {
      if (prizeChartInstance.current) prizeChartInstance.current.destroy();
      if (taxChartInstance.current) taxChartInstance.current.destroy();
    };
  }, []);

  const calculateMegaMillions = () => {
    try {
      const jackpot = Math.max(20000000, jackpotAmount);
      const megaplierVal = Math.max(1, Math.min(5, megaplier));
      const federalRate = Math.max(0, Math.min(45, federalTaxRate));
      const stateRate = Math.max(0, Math.min(15, stateTaxRate));
      const lumpSumPercentage = Math.max(50, Math.min(70, lumpSumPercent));

      const totalTaxRate = federalRate + stateRate;
      let jackpotPayout, jackpotAfterTax;

      if (payoutOption === 'lump-sum') {
        jackpotPayout = jackpot * (lumpSumPercentage / 100);
        jackpotAfterTax = jackpotPayout * (1 - totalTaxRate / 100);
      } else {
        jackpotPayout = jackpot;
        const firstPayment = jackpot / 30;
        const firstPaymentAfterTax = firstPayment * (1 - totalTaxRate / 100);

        let annuityTotal = 0;
        for (let year = 0; year < 30; year++) {
          const yearlyPayment = firstPaymentAfterTax * Math.pow(1.05, year);
          annuityTotal += yearlyPayment;
        }
        jackpotAfterTax = annuityTotal;
      }

      const basePrizes = {
        match5: 1000000,
        match4Mega: 10000,
        match4: 500,
        match3Mega: 200,
        match3: 10
      };

      const megapliedPrizes = {
        match5: megaplierVal > 1 ? Math.min(basePrizes.match5 * megaplierVal, 5000000) : basePrizes.match5,
        match4Mega: basePrizes.match4Mega * megaplierVal,
        match4: basePrizes.match4 * megaplierVal,
        match3Mega: basePrizes.match3Mega * megaplierVal,
        match3: basePrizes.match3 * megaplierVal
      };

      const expectedValue = calculateExpectedValue(jackpot, megapliedPrizes, totalTaxRate, lumpSumPercentage);

      // Scenario calculations
      const highTaxRate = 37 + 13.3;
      const highTaxAmount = (jackpot * lumpSumPercentage / 100) * (1 - highTaxRate / 100);
      const currentAmount = (jackpot * lumpSumPercentage / 100) * (1 - totalTaxRate / 100);
      const annuityAmount = jackpot * 1.6;

      let megaplierNote = 'Non-jackpot prizes shown without Megaplier multiplier';
      let megaplierClass = 'mt-3 p-2 bg-orange-100 rounded text-xs text-orange-700';
      if (megaplierVal > 1) {
        megaplierNote = `Prizes shown with ${megaplierVal}x Megaplier applied`;
        megaplierClass = 'mt-3 p-2 bg-green-100 rounded text-xs text-green-700';
      }

      setResults({
        finalAmount: Math.round(jackpotAfterTax),
        advertisedAmount: jackpot,
        lumpSumAmount: Math.round(jackpotPayout),
        federalTax: Math.round(jackpotPayout * federalRate / 100),
        stateTax: Math.round(jackpotPayout * stateRate / 100),
        takeHome: Math.round(jackpotAfterTax),
        match5Prize: megapliedPrizes.match5,
        match4MegaPrize: megapliedPrizes.match4Mega,
        match4Prize: megapliedPrizes.match4,
        match3MegaPrize: megapliedPrizes.match3Mega,
        match3Prize: megapliedPrizes.match3,
        expectedReturn: expectedValue,
        expectedLoss: 2 - expectedValue,
        scenario1Amount: Math.round(highTaxAmount),
        scenario1Diff: Math.round(currentAmount - highTaxAmount),
        scenario2Amount: Math.round(annuityAmount),
        scenario2Diff: Math.round(annuityAmount - currentAmount),
        scenario3Amount: Math.min(megapliedPrizes.match5 * 5, 5000000),
        megaplierNote,
        megaplierClass
      });

      updateCharts(jackpot, jackpotPayout, federalRate, stateRate, megapliedPrizes);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const calculateExpectedValue = (jackpot: number, prizes: any, totalTaxRate: number, lumpSumPercentage: number) => {
    const afterTaxJackpot = (jackpot * lumpSumPercentage / 100) * (1 - totalTaxRate / 100);

    const ev =
      afterTaxJackpot / 302575350 +
      prizes.match5 * 0.65 / 12607306 +
      prizes.match4Mega * 0.65 / 931001 +
      prizes.match4 * 0.8 / 38792 +
      prizes.match3Mega * 0.8 / 14547 +
      prizes.match3 / 606 +
      10 / 693 +
      4 / 89 +
      2 / 37;

    return ev;
  };

  const updateCharts = (jackpot: number, jackpotPayout: number, federalRate: number, stateRate: number, prizes: any) => {
    if (typeof window === 'undefined' || !(window as any).Chart) return;

    setTimeout(() => {
      const Chart = (window as any).Chart;

      // Prize Distribution Chart
      if (prizeChartRef.current) {
        const prizeCtx = prizeChartRef.current.getContext('2d');
        if (prizeCtx) {
          if (prizeChartInstance.current) prizeChartInstance.current.destroy();

          prizeChartInstance.current = new Chart(prizeCtx, {
            type: 'doughnut',
            data: {
              labels: ['Match 5', 'Match 4+MB', 'Match 4', 'Match 3+MB', 'Other'],
              datasets: [{
                data: [prizes.match5, prizes.match4Mega, prizes.match4, prizes.match3Mega, 50],
                backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#6B7280'],
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
        }
      }

      // Tax Impact Chart
      if (taxChartRef.current) {
        const taxCtx = taxChartRef.current.getContext('2d');
        if (taxCtx) {
          if (taxChartInstance.current) taxChartInstance.current.destroy();

          const federalTax = jackpotPayout * federalRate / 100;
          const stateTax = jackpotPayout * stateRate / 100;
          const afterTax = jackpotPayout - federalTax - stateTax;

          taxChartInstance.current = new Chart(taxCtx, {
            type: 'bar',
            data: {
              labels: ['Gross', 'After Federal', 'After All Taxes'],
              datasets: [{
                data: [jackpotPayout, jackpotPayout - federalTax, afterTax],
                backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
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
                      return '$' + (value / 1000000).toFixed(0) + 'M';
                    }
                  }
                }
              },
              plugins: {
                legend: { display: false }
              }
            }
          });
        }
      }
    }, 100);
  };

  const debounceCalculate = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(calculateMegaMillions, 300);
  };

  const handleTemplateClick = (data: any) => {
    setJackpotAmount(Number(data.jackpot));
    setFederalTaxRate(Number(data.federal));
    setStateTaxRate(Number(data.state));
    setMegaplier(Number(data.megaplier));
    setTimeout(calculateMegaMillions, 100);
  };

  const handleStateSelection = (value: string) => {
    setStateSelection(value);
    if (value !== 'custom') {
      setStateTaxRate(Number(value));
    }
  };

  useEffect(() => {
    debounceCalculate();
  }, [jackpotAmount, lumpSumPercent, megaplier, payoutOption, federalTaxRate, stateTaxRate]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Mega Millions Payout Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate Mega Millions payouts, compare lump sum vs annuity, and analyze tax implications with Megaplier effects</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mega Millions Calculator</h2>

            {/* Mega Millions Scenarios */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Mega Millions Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button type="button" className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick({ jackpot: 50000000, federal: 37, state: 0, megaplier: 1 })}>Small Jackpot ($50M)</button>
                <button type="button" className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick({ jackpot: 200000000, federal: 37, state: 0, megaplier: 1 })}>Medium Jackpot ($200M)</button>
                <button type="button" className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick({ jackpot: 500000000, federal: 37, state: 0, megaplier: 1 })}>Large Jackpot ($500M)</button>
                <button type="button" className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick({ jackpot: 1000000000, federal: 37, state: 0, megaplier: 1 })}>Mega Jackpot ($1B)</button>
                <button type="button" className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick({ jackpot: 300000000, federal: 37, state: 13.3, megaplier: 1 })}>California Winner</button>
                <button type="button" className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleTemplateClick({ jackpot: 200000000, federal: 37, state: 0, megaplier: 5 })}>With 5x Megaplier</button>
              </div>
            </div>

            {/* Jackpot Information */}
            <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advertised Jackpot Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" value={jackpotAmount} onChange={(e) => setJackpotAmount(Number(e.target.value))} className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="20000000" step="1000000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lump Sum Percentage</label>
                <div className="relative">
                  <input type="number" value={lumpSumPercent} onChange={(e) => setLumpSumPercent(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="50" max="70" step="0.1" />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Typically 60-65% of advertised jackpot</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Megaplier</label>
                <select value={megaplier} onChange={(e) => setMegaplier(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="1">No Megaplier</option>
                  <option value="2">2x Megaplier</option>
                  <option value="3">3x Megaplier</option>
                  <option value="4">4x Megaplier</option>
                  <option value="5">5x Megaplier</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Multiplies non-jackpot prizes for +$1</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payout Option</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="payoutOption" value="lump-sum" checked={payoutOption === 'lump-sum'} onChange={(e) => setPayoutOption(e.target.value)} className="mr-3 text-blue-600" />
                    <span className="text-sm">Lump Sum Payment</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="payoutOption" value="annuity" checked={payoutOption === 'annuity'} onChange={(e) => setPayoutOption(e.target.value)} className="mr-3 text-blue-600" />
                    <span className="text-sm">30-Year Annuity</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-700">Tax Information</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Federal Tax Rate (%)</label>
                <input type="number" value={federalTaxRate} onChange={(e) => setFederalTaxRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" max="45" step="0.1" />
                <p className="text-xs text-gray-500 mt-1">Top federal tax bracket: 37%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State Tax Rate (%)</label>
                <input type="number" value={stateTaxRate} onChange={(e) => setStateTaxRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" max="15" step="0.1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State Quick Select</label>
                <select value={stateSelection} onChange={(e) => handleStateSelection(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="0">No State Tax</option>
                  <option value="13.3">California (13.3%)</option>
                  <option value="8.82">New York (8.82%)</option>
                  <option value="5.75">Maryland (5.75%)</option>
                  <option value="10.75">New Jersey (10.75%)</option>
                  <option value="custom">Enter Custom Rate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payout Analysis</h3>

            {/* Main Results Display */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 md:p-6 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">${results.finalAmount.toLocaleString()}</div>
                <div className="text-sm text-blue-600 mb-4">{payoutOption === 'lump-sum' ? 'Lump Sum After Taxes' : '30-Year Annuity After Taxes'}</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Advertised Jackpot:</span>
                  <span className="font-semibold">${results.advertisedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lump Sum ({lumpSumPercent}%):</span>
                  <span className="font-semibold">${results.lumpSumAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Federal Tax ({federalTaxRate}%):</span>
                  <span className="font-semibold text-red-600">-${results.federalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>State Tax ({stateTaxRate}%):</span>
                  <span className="font-semibold text-red-600">-${results.stateTax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Your Take-Home:</span>
                  <span className="text-green-600">${results.takeHome.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Prize Tiers */}
            <div className="bg-gray-50 p-4 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Prize Tiers</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Match 5:</span>
                  <span className="font-semibold">${results.match5Prize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Match 4 + MB:</span>
                  <span className="font-semibold">${results.match4MegaPrize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Match 4:</span>
                  <span className="font-semibold">${results.match4Prize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Match 3 + MB:</span>
                  <span className="font-semibold">${results.match3MegaPrize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Match 3:</span>
                  <span className="font-semibold">${results.match3Prize.toLocaleString()}</span>
                </div>
              </div>
              <div className={results.megaplierClass}>
                {results.megaplierNote}
              </div>
            </div>

            {/* Odds & Statistics */}
            <div className="bg-yellow-50 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">Odds & Expected Value</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-800">1 in 302.6M</div>
                  <div className="text-xs text-yellow-600">Jackpot Odds</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-800">1 in 24</div>
                  <div className="text-xs text-yellow-600">Any Prize</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Expected Return:</span>
                  <span className="font-semibold">${results.expectedReturn.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Per $2 Ticket:</span>
                  <span className="font-semibold text-red-600">-${results.expectedLoss.toFixed(2)} loss</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Prize Distribution</h3>
          <div className="relative h-64">
            <canvas ref={prizeChartRef}></canvas>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Impact Analysis</h3>
          <div className="relative h-64">
            <canvas ref={taxChartRef}></canvas>
          </div>
        </div>
</div>

      {/* What If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">What If Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-3">High Tax State</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-semibold">California (13.3%)</span>
              </div>
              <div className="flex justify-between">
                <span>After-tax:</span>
                <span className="font-semibold text-green-600">${results.scenario1Amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Difference:</span>
                <span className="font-semibold text-red-600">-${results.scenario1Diff.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Annuity Option</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="font-semibold">30-year annuity</span>
              </div>
              <div className="flex justify-between">
                <span>Total after-tax:</span>
                <span className="font-semibold text-green-600">${results.scenario2Amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>vs Lump Sum:</span>
                <span className="font-semibold text-green-600">+${results.scenario2Diff.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">5x Megaplier</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Non-jackpot boost:</span>
                <span className="font-semibold">5x multiplier</span>
              </div>
              <div className="flex justify-between">
                <span>Match 5 prize:</span>
                <span className="font-semibold text-green-600">${results.scenario3Amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Extra cost:</span>
                <span className="font-semibold text-red-600">+$1.00 per ticket</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="max-w-[1180px] mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Disclaimer</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This calculator provides estimates for educational purposes only. Actual lottery payouts may vary based on current tax rates, state regulations, and other factors. The odds of winning any lottery prize are extremely low. Please play responsibly and within your means.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="max-w-4xl mx-auto px-2 py-4 sm:py-6 md:py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Mega Millions Payout Guide</h2>

        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding Mega Millions Payouts</h3>
          <div className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
            <p className="text-blue-800 mb-4">
              Mega Millions offers two payout options: a lump sum cash payment or 30 annual payments (annuity). The lump sum is typically 60-65% of the advertised jackpot, while the annuity pays the full advertised amount over 30 years with annual increases.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Considerations</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Federal Taxes</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• 24% automatically withheld</li>
                <li>• Up to 37% total federal tax rate</li>
                <li>• Additional taxes may be owed at filing</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">State Taxes</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Varies by state (0-13%+)</li>
                <li>• Some states don't tax lottery winnings</li>
                <li>• May depend on residency vs. purchase location</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Megaplier Feature</h3>
          <div className="bg-orange-50 p-3 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-4 md:mb-6">
            <p className="text-orange-700 mb-4">
              The Megaplier multiplies non-jackpot prizes by 2x, 3x, 4x, or 5x for an additional $1 per play. It does not affect the jackpot amount.
            </p>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">2x</div>
                <div className="text-xs text-orange-700">Most common</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">3x</div>
                <div className="text-xs text-orange-700">Common</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">4x</div>
                <div className="text-xs text-orange-700">Less common</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">5x</div>
                <div className="text-xs text-orange-700">Rare</div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Making the Right Choice</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800">Lump Sum Advantages</h4>
              <p className="text-gray-600 text-sm">Immediate access to funds, investment opportunities, protection against lottery organization bankruptcy</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800">Annuity Advantages</h4>
              <p className="text-gray-600 text-sm">Guaranteed income for 30 years, protection against overspending, annual payment increases</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-gray-800">Consider Your Situation</h4>
              <p className="text-gray-600 text-sm">Financial discipline, investment knowledge, age, debt situation, and family circumstances all matter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What percentage of the Mega Millions jackpot do you get with the lump sum option?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">The lump sum cash value is typically 50-65% of the advertised jackpot amount. For example, a $200 million advertised jackpot might have a cash value around $120-130 million. The exact percentage varies based on current interest rates, as the advertised amount represents the total of 30 annual annuity payments.</p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much tax do you pay on Mega Millions winnings?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Federal taxes of 24% are withheld immediately from prizes over $5,000, but the top federal tax bracket is 37%. State taxes vary from 0% (in states like Florida, Texas, and California for lottery) to over 10% in states like New York. Total effective tax rates can reach 45-50% depending on your state.</p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the Megaplier and is it worth buying?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">The Megaplier is an add-on feature for $1 extra that multiplies non-jackpot prizes by 2x, 3x, 4x, or 5x. It doesn't affect the jackpot. Mathematically, it slightly improves your expected value on smaller prizes. The Match 5 prize ($1 million) can increase to $2-5 million with Megaplier.</p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Should I take the lump sum or annuity for Mega Millions?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Most financial advisors suggest the lump sum if you have discipline and investment knowledge, as you can potentially earn more than the 5% annual annuity growth. However, the annuity provides guaranteed income for 30 years and protection against overspending. Consider your age, financial goals, and tax situation when deciding.</p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What are the odds of winning the Mega Millions jackpot?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">The odds of winning the jackpot are 1 in 302,575,350. The overall odds of winning any prize are 1 in 24. To put this in perspective, you're more likely to be struck by lightning multiple times than win the jackpot. The expected value of a $2 ticket is typically around $0.50-0.80.</p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-medium text-gray-800 mb-2">What states don't tax Mega Millions winnings?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">States with no state income tax on lottery winnings include Florida, Texas, Tennessee, South Dakota, Wyoming, Washington, and New Hampshire. California taxes income but not lottery winnings specifically. However, federal taxes still apply regardless of state. Non-residents may face withholding in the state where the ticket was purchased.</p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="mega-millions-payout-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
