'use client';

import { useState, useEffect, useRef } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Script from 'next/script';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Credit Score Simulator Calculator?",
    answer: "A Credit Score Simulator Calculator is a free online tool designed to help you quickly and accurately calculate credit score simulator-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Credit Score Simulator Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Credit Score Simulator Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Credit Score Simulator Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CreditScoreSimulatorClient() {
  const [currentScore, setCurrentScore] = useState(720);
  const [totalBalances, setTotalBalances] = useState(5000);
  const [totalLimits, setTotalLimits] = useState(20000);
  const [missedPayments, setMissedPayments] = useState('0');
  const [oldestAccount, setOldestAccount] = useState(10);
  const [numAccounts, setNumAccounts] = useState(5);
  const [hardInquiries, setHardInquiries] = useState('0');

  const [scenario1Balance, setScenario1Balance] = useState(1000);
  const [scenario2Limit, setScenario2Limit] = useState(30000);
  const [scenario3Years, setScenario3Years] = useState('1');

  const [scenario1Result, setScenario1Result] = useState('');
  const [scenario2Result, setScenario2Result] = useState('');
  const [scenario3Result, setScenario3Result] = useState('');

  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  // Helper functions
  const getScoreRating = (score: number): string => {
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 800) return 'bg-green-600';
    if (score >= 740) return 'bg-blue-600';
    if (score >= 670) return 'bg-cyan-600';
    if (score >= 580) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPaymentGrade = (missed: string): string => {
    const m = parseInt(missed);
    if (m === 0) return 'A';
    if (m === 1) return 'B';
    if (m === 2) return 'C';
    return 'D';
  };

  const getUtilizationGrade = (utilization: number): string => {
    if (utilization < 10) return 'A';
    if (utilization < 30) return 'B';
    if (utilization < 50) return 'C';
    return 'D';
  };

  const getAgeGrade = (years: number): string => {
    if (years >= 10) return 'A';
    if (years >= 5) return 'B';
    if (years >= 2) return 'C';
    return 'D';
  };

  const getMixGrade = (accounts: number): string => {
    if (accounts >= 5) return 'A';
    if (accounts >= 3) return 'B';
    if (accounts >= 2) return 'C';
    return 'D';
  };

  const getInquiriesGrade = (inquiries: string): string => {
    const i = parseInt(inquiries);
    if (i === 0) return 'A';
    if (i === 1) return 'B';
    if (i === 2) return 'C';
    return 'D';
  };

  // Calculated values
  const utilization = (totalBalances / totalLimits) * 100;
  const paymentGrade = getPaymentGrade(missedPayments);
  const utilizationGrade = getUtilizationGrade(utilization);
  const ageGrade = getAgeGrade(oldestAccount);
  const mixGrade = getMixGrade(numAccounts);
  const inquiriesGrade = getInquiriesGrade(hardInquiries);
  const scorePercentage = ((currentScore - 300) / (850 - 300)) * 100;

  // Update chart when data changes
  useEffect(() => {
    if (!chartReady || !chartRef.current) return;

    const Chart = (window as any).Chart;
    if (!Chart) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const gradeToScore: any = { 'A': 100, 'B': 75, 'C': 50, 'D': 25 };

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Payment (35%)', 'Utilization (30%)', 'Age (15%)', 'Mix (10%)', 'Inquiries (10%)'],
        datasets: [{
          data: [
            gradeToScore[paymentGrade] * 0.35,
            gradeToScore[utilizationGrade] * 0.30,
            gradeToScore[ageGrade] * 0.15,
            gradeToScore[mixGrade] * 0.10,
            gradeToScore[inquiriesGrade] * 0.10
          ],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
          borderColor: ['#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 10 }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartReady, paymentGrade, utilizationGrade, ageGrade, mixGrade, inquiriesGrade]);

  // Update scenario defaults
  useEffect(() => {
    setScenario1Balance(Math.max(0, Math.round(totalBalances * 0.3)));
    setScenario2Limit(Math.round(totalLimits * 1.5));
  }, [totalBalances, totalLimits]);

  const calculateScenario1 = () => {
    const newBalance = scenario1Balance;
    const newUtilization = (newBalance / totalLimits) * 100;
    const currentUtilization = (totalBalances / totalLimits) * 100;

    const utilizationDiff = currentUtilization - newUtilization;
    const scoreChange = Math.round(utilizationDiff * 2.5);

    const newScore = Math.min(850, currentScore + scoreChange);
    setScenario1Result(`Reducing balance to $${newBalance.toLocaleString()} could improve score by ~${scoreChange} points to ${newScore}`);
  };

  const calculateScenario2 = () => {
    const newLimit = scenario2Limit;
    const newUtilization = (totalBalances / newLimit) * 100;
    const currentUtilization = (totalBalances / totalLimits) * 100;

    const utilizationDiff = currentUtilization - newUtilization;
    const scoreChange = Math.round(utilizationDiff * 2.0);

    const newScore = Math.min(850, currentScore + scoreChange);
    setScenario2Result(`Increasing limit to $${newLimit.toLocaleString()} could improve score by ~${scoreChange} points to ${newScore}`);
  };

  const calculateScenario3 = () => {
    const years = parseInt(scenario3Years);
    let scoreIncrease = years * 3;

    if (parseInt(hardInquiries) > 0) {
      scoreIncrease += years >= 2 ? 10 : 5;
    }

    const newScore = Math.min(850, currentScore + scoreIncrease);
    setScenario3Result(`Waiting ${years} year(s) with good payment behavior could improve score by ~${scoreIncrease} points to ${newScore}`);
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        onLoad={() => setChartReady(true)}
      />

      <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Credit Score Simulator</h1>
          <p className="text-lg text-gray-600">
            Simulate how different financial decisions affect your credit score and create a plan to improve your creditworthiness.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-3 sm:gap-5 md:gap-8">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Credit Profile</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Credit Score</label>
                    <input
                      type="number"
                      value={currentScore}
                      onChange={(e) => setCurrentScore(Math.max(300, Math.min(850, parseInt(e.target.value) || 300)))}
                      min="300"
                      max="850"
                      step="1"
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter score between 300-850</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Credit Card Balances ($)</label>
                      <input
                        type="number"
                        value={totalBalances}
                        onChange={(e) => setTotalBalances(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        step="100"
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Credit Limits ($)</label>
                      <input
                        type="number"
                        value={totalLimits}
                        onChange={(e) => setTotalLimits(Math.max(1, parseInt(e.target.value) || 1))}
                        min="0"
                        step="1000"
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Missed Payments (Last 2 Years)</label>
                    <select
                      value={missedPayments}
                      onChange={(e) => setMissedPayments(e.target.value)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">None</option>
                      <option value="1">1-2 Payments</option>
                      <option value="2">3-4 Payments</option>
                      <option value="3">5+ Payments</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age of Oldest Account (Years)</label>
                      <input
                        type="number"
                        value={oldestAccount}
                        onChange={(e) => setOldestAccount(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                        min="0"
                        max="50"
                        step="1"
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Credit Accounts</label>
                      <input
                        type="number"
                        value={numAccounts}
                        onChange={(e) => setNumAccounts(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                        min="0"
                        max="50"
                        step="1"
                        className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hard Inquiries (Last 2 Years)</label>
                    <select
                      value={hardInquiries}
                      onChange={(e) => setHardInquiries(e.target.value)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">None</option>
                      <option value="1">1-2 Inquiries</option>
                      <option value="2">3-4 Inquiries</option>
                      <option value="3">5+ Inquiries</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="border rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Credit Score Analysis</h3>

                <div className="text-center mb-3 sm:mb-4 md:mb-6">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{currentScore}</div>
                  <div className="text-lg font-medium text-gray-600">{getScoreRating(currentScore)}</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getScoreColor(currentScore)}`}
                      style={{ width: `${scorePercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Payment History (35%)</span>
                    <span className="font-semibold text-blue-600">{paymentGrade}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Credit Utilization (30%)</span>
                    <span className="font-semibold text-blue-600">{utilizationGrade}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Credit Age (15%)</span>
                    <span className="font-semibold text-blue-600">{ageGrade}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>Credit Mix (10%)</span>
                    <span className="font-semibold text-blue-600">{mixGrade}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>New Credit (10%)</span>
                    <span className="font-semibold text-blue-600">{inquiriesGrade}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Score Factors</h4>
                <div className="relative h-64">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6 text-center">Improve Your Score - Scenario Simulations</h2>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="border rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-medium text-green-700 mb-4">Pay Down Credit Card Debt</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Reduce Balances To ($)</label>
                  <input
                    type="number"
                    value={scenario1Balance}
                    onChange={(e) => setScenario1Balance(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={calculateScenario1}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Calculate Impact
                </button>
                {scenario1Result && (
                  <div className="bg-green-50 p-3 rounded text-sm">
                    <p className="text-green-800 font-medium">{scenario1Result}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-medium text-blue-700 mb-4">Increase Credit Limits</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">New Total Credit Limit ($)</label>
                  <input
                    type="number"
                    value={scenario2Limit}
                    onChange={(e) => setScenario2Limit(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={calculateScenario2}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Calculate Impact
                </button>
                {scenario2Result && (
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <p className="text-blue-800 font-medium">{scenario2Result}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-medium text-purple-700 mb-4">Wait for Time to Pass</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Additional Years</label>
                  <select
                    value={scenario3Years}
                    onChange={(e) => setScenario3Years(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                  </select>
                </div>
                <button
                  onClick={calculateScenario3}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Calculate Impact
                </button>
                {scenario3Result && (
                  <div className="bg-purple-50 p-3 rounded text-sm">
                    <p className="text-purple-800 font-medium">{scenario3Result}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Credit Score Ranges</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700 w-24">800-850</div>
              <div className="flex-1">
                <div className="font-semibold text-green-800">Excellent</div>
                <div className="text-sm text-green-700">Best rates and terms available</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700 w-24">740-799</div>
              <div className="flex-1">
                <div className="font-semibold text-blue-800">Very Good</div>
                <div className="text-sm text-blue-700">Above-average rates and favorable terms</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="text-2xl font-bold text-cyan-700 w-24">670-739</div>
              <div className="flex-1">
                <div className="font-semibold text-cyan-800">Good</div>
                <div className="text-sm text-cyan-700">Near or slightly above average rates</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700 w-24">580-669</div>
              <div className="flex-1">
                <div className="font-semibold text-yellow-800">Fair</div>
                <div className="text-sm text-yellow-700">Below-average rates, some difficulty qualifying</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700 w-24">300-579</div>
              <div className="flex-1">
                <div className="font-semibold text-red-800">Poor</div>
                <div className="text-sm text-red-700">Difficulty qualifying, high rates if approved</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Tips to Improve Your Credit Score</h2>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Wins</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Pay all bills on time, every time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Keep credit utilization below 30%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Request credit limit increases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Become authorized user on old accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Dispute errors on credit reports</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Long-Term Strategy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Keep old credit cards open</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Diversify credit types (cards, loans)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Limit hard credit inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Monitor credit reports quarterly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Pay down high balances strategically</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="credit-score-simulator" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}
